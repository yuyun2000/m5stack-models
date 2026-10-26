import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import fs from 'node:fs/promises';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const ids=['zigbee','co2l','ina226-1a'];
const digest=v=>createHash('sha256').update(v).digest('hex'),hash=a=>digest(Buffer.from(a.buffer,a.byteOffset,a.byteLength)),stamp=v=>digest(JSON.stringify(v));
const own=(unit,kind)=>[...unit.components.values()].filter(c=>c.kind===kind);
function updateWorld(o){let root=o;while(root.parent)root=root.parent;root.updateMatrixWorld(true);}
function panels(unit){const a=[];unit.root.traverse(o=>{if(o.userData.role==='printed-artwork')a.push(o);});return a;}
function physical(unit,ownOnly=false){updateWorld(unit.root);const a=[],attachments=new Set(own(unit,'port').filter(p=>p.module).map(p=>p.module.root));unit.root.traverse(o=>{if(!o.isMesh||o.userData.role==='printed-artwork')return;if(ownOnly)for(let p=o;p&&p!==unit.root;p=p.parent)if(attachments.has(p))return;a.push({name:o.name,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,v])=>[k,hash(v.array)])),index:o.geometry.index?hash(o.geometry.index.array):null,matrix:o.matrixWorld.toArray()});});return stamp(a);}
function frames(unit){updateWorld(unit.root);return stamp(own(unit,'port').map(c=>({id:c.id,matrix:c.object3d.matrixWorld.toArray()})));}
function tick(host){for(let n=0;n<30;n++)host.update(1/60);}
function under(o,parent){for(let p=o;p;p=p.parent)if(p===parent)return true;return false;}
function roundtrip(unit,port){const complete=physical(unit),body=physical(unit,true),fixed=frames(unit),item=port.module;assert.ok(item);assert.ok(port.detach({dispose:false})===item);assert.equal(physical(unit,true),body);assert.equal(frames(unit),fixed);port.attach(item);assert.equal(physical(unit),complete);}
function antennaMotion(host,unit,events){
 const port=unit.port('sma'),antenna=port.module;assert.ok(antenna);assert.equal(port.connector,'sma-female');assert.equal(antenna.meta.physicalConnector,'sma-male');assert.equal(own(unit,'joint').length,0);const tilt=antenna.get('tilt');assert.deepEqual(tilt.getState().rangeDeg,[0,90]);
 const rest=physical(unit),fixed=frames(unit),before=events.length;updateWorld(unit.root);const still=[],moving=[];unit.root.traverse(o=>{if(o.isMesh)(under(o,tilt.object3d)?moving:still).push([o,o.matrixWorld.clone()]);});assert.ok(moving.length>0);
 host.handle({type:'joint',target:'grove/grove-1/sma/tilt',angleDeg:45,durationMs:120});tick(host);assert.equal(tilt.getState().angleDeg,45);updateWorld(unit.root);assert.ok(moving.some(([o,m])=>!o.matrixWorld.equals(m)));assert.ok(still.every(([o,m])=>o.matrixWorld.equals(m)),'antenna radome motion leaves fixed coupling,radio shell,PCB and ports still');assert.equal(frames(unit),fixed);
 for(const command of [{angleDeg:91},{angleDeg:-1},{rpm:1}]){const state=tilt.getState();assert.throws(()=>tilt.set(command));assert.deepEqual(tilt.getState(),state);}
 tilt.set({angleDeg:90});assert.notEqual(physical(unit),rest);tilt.set({angleDeg:0});assert.equal(physical(unit),rest);assert.equal(events.length,before);roundtrip(unit,port);
}
function plugMotion(host,unit,events){
 const port=unit.port('terminal'),plug=port.module;assert.ok(plug);assert.equal(port.connector,'ht3.96-4p');assert.equal(plug.list('joint').length,4);const fixed=frames(unit),body=physical(unit,true),before=events.length;
 for(let i=1;i<=4;i++){const screw=plug.get('screw-'+i);assert.equal(screw.getState().rangeDeg,null);assert.deepEqual(screw.getState().visualRangeDeg,[-180,180]);const rest=screw.object3d.quaternion.clone(),others=plug.list('joint').filter(j=>j!==screw).map(j=>[j,j.object3d.quaternion.clone()]);host.handle({type:'joint',target:`grove/grove-3/terminal/screw-${i}`,angleDeg:35});assert.ok(!screw.object3d.quaternion.equals(rest));host.handle({type:'joint',target:`grove/grove-3/terminal/screw-${i}`,angleDeg:70,durationMs:120});tick(host);assert.equal(screw.getState().angleDeg,70);for(const command of [{rpm:1},{angleDeg:Infinity}]){const state=screw.getState();assert.throws(()=>screw.set(command));assert.deepEqual(screw.getState(),state);}screw.set({angleDeg:0});assert.ok(screw.object3d.quaternion.equals(rest));assert.ok(others.every(([j,q])=>j.object3d.quaternion.equals(q)));}
 assert.equal(frames(unit),fixed);assert.equal(physical(unit,true),body);assert.equal(events.length,before);roundtrip(unit,port);
}

/** Actual new assemblies, accessory motion and four-core branches; only Node canvas is substituted. */
export async function checkZigbeeCo2lIna2261aUnits(){
 const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};let host,wrong;
 try{
  host=await loadModel('sticks3');host.display().fill('#123456');const framebuffer=hash(host.display().buffer),hub=await loadGroveModule('hub');host.port('grove').attach(hub);const units={},artwork=[],events=[];host.on('input',e=>{if(e.kind!=='port')events.push(e);});
  for(const [i,id]of ids.entries()){
   const options=id==='zigbee'?{antenna:true}:id==='ina226-1a'?{terminalPlug:true}:{};const unit=await loadGroveModule(id,{...options,cableLength:65+i*15});units[id]=unit;hub.port(`grove-${i+1}`).attach(unit);assert.ok(host.get(`grove/grove-${i+1}`).module===unit);assert.equal(unit.get('cable').getState().wireCount,4);assert.deepEqual(own(unit,'port').map(p=>p.id).sort(),id==='zigbee'?['grove','sma']:id==='ina226-1a'?['grove','terminal']:['grove']);for(const kind of ['button','led','display','speaker','joint'])assert.equal(own(unit,kind).length,0);
   if(id==='co2l'){assert.equal(unit.get('sensor').meta.role,'visual-anchor');assert.deepEqual(unit.get('sensor').getState(),{});}else assert.equal(unit.components.has('sensor'),false);
   const menu=catalog.products.find(p=>p.id===id)?.configurations??[];
   if(id!=='co2l'){const key=id==='zigbee'?'antenna':'terminalPlug';assert.ok(menu.some(c=>c.options[key]===true));assert.ok(menu.some(c=>c.options[key]!==true));}
   const configurations=[{},...menu.map(c=>c.options),...(id==='zigbee'?[{antenna:true,antennaAngleDeg:90}]:[])],seen=new Set();
   for(const options of configurations){const key=JSON.stringify(options);if(seen.has(key))continue;seen.add(key);for(const load of [loadModel,loadGroveModule]){const on=await load(id,options),off=await load(id,{...options,artwork:false});try{const printed=panels(on);assert.ok(printed.length>0);assert.equal(panels(off).length,0);assert.equal(physical(on),physical(off),'printing changes no physical attribute,index or world matrix in either entry/configuration');for(const p of printed){assert.ok(p.parent&&p.geometry.attributes.position.count>0);assert.equal(p.material.alphaTest,.04);assert.ok(['reference-redraw','source-vector-raster','official-vector-raster'].includes(p.userData.artworkKind));}if(!artwork.some(a=>a.id===id))artwork.push({id,panels:printed.length,kinds:[...new Set(printed.map(p=>p.userData.artworkKind))]});}finally{on.dispose();off.dispose();}}}
   const before=physical(unit),fixed=frames(unit),start=events.length,target=id==='co2l'?'sensor':id==='zigbee'?'sma':'terminal';for(const type of id==='zigbee'?['rf','transmit','uart']:id==='co2l'?['co2','temperature','humidity']:['current','voltage','power'])assert.throws(()=>host.handle({type,target:`grove/grove-${i+1}/${target}`,value:1}),'visual assemblies own no internal sensor,RF,bus or electrical values');assert.equal(physical(unit),before);assert.equal(frames(unit),fixed);assert.equal(events.length,start);
  }
  antennaMotion(host,units.zigbee,events);plugMotion(host,units['ina226-1a'],events);
  wrong=await loadGroveModule('key');for(const port of [units.zigbee.port('sma'),units['ina226-1a'].port('terminal')]){const saved=port.module;assert.throws(()=>port.attach(wrong));assert.ok(port.module===saved);}wrong.dispose();wrong=null;
  for(const [i,id]of ids.entries()){host.handle({type:'pose',target:`grove/grove-${i+1}/unitFrame`,position:[i*50,180+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:`grove/grove-${i+1}/cable`,slack:12,bend:[0,0,-1]});assert.equal(units[id].get('cable').getState().wireCount,4);}
  assert.equal(hash(host.display().buffer),framebuffer);const siblings=[physical(units.zigbee),physical(units['ina226-1a'])];hub.port('grove-2').detach();assert.equal(hub.port('grove-2').module,null);assert.ok(hub.port('grove-1').module===units.zigbee&&hub.port('grove-3').module===units['ina226-1a']);assert.deepEqual([physical(units.zigbee),physical(units['ina226-1a'])],siblings);
  return{status:'pass',artwork,cases:['three-real-four-wire-Grove-branches','own-ZigBee-SMA-and-removable-hinged-antenna','finite-antenna-pose-interpolation-and-fixed-body-coupling-ownership','exact-CO2L-SCD41-passive-anchor-rejects-internal-values','own-INA226-1A-80mR-fuse-and-removable-four-screw-plug','independent-screw-head-angle-tweens-exact-return-no-RPM','both-entries-all-configurations-artwork-preserves-all-physical-attributes-indices-world-matrices','actual-non-Grove-types-and-internal-functions-rejected','external-pose-cable-independent-selective-detach-host-framebuffer-preserved'],scope:'New actual assemblies and externally driven appearance only;Node canvas stub,no browser,RF,UART,pairing,CO2,temperature,humidity,current,voltage,power,I2C,isolation,electrical,firmware,manufacturing,physical or whole-catalog acceptance'};
 }finally{wrong?.dispose();host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkZigbeeCo2lIna2261aUnits(),null,2));
