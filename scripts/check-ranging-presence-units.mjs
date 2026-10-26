import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import fs from 'node:fs/promises';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const ids=['uwb','tmos-pir','mini-tof-90'];
const digest=v=>createHash('sha256').update(v).digest('hex'),hash=a=>digest(Buffer.from(a.buffer,a.byteOffset,a.byteLength)),stamp=v=>digest(JSON.stringify(v));
const own=(unit,kind)=>[...unit.components.values()].filter(c=>c.kind===kind);
function updateWorld(o){let root=o;while(root.parent)root=root.parent;root.updateMatrixWorld(true);}
function panels(unit){const a=[];unit.root.traverse(o=>{if(o.userData.role==='printed-artwork')a.push(o);});return a;}
function physical(unit){updateWorld(unit.root);const a=[];unit.root.traverse(o=>{if(!o.isMesh||o.userData.role==='printed-artwork')return;a.push({name:o.name,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,v])=>[k,hash(v.array)])),index:o.geometry.index?hash(o.geometry.index.array):null,matrix:o.matrixWorld.toArray()});});return stamp(a);}
function portFrames(unit){updateWorld(unit.root);return stamp(own(unit,'port').map(p=>({id:p.id,matrix:p.object3d.matrixWorld.toArray()})));}
function nonLampEmissive(unit,lens){const a=[];unit.root.traverse(o=>{if(o.isMesh&&o!==lens)a.push({id:o.uuid,materials:(Array.isArray(o.material)?o.material:[o.material]).map(m=>m.emissive?.toArray()??null)});});return stamp(a);}

/** Real fixed structures and recursive four-wire APIs; only the Node canvas is substituted. */
export async function checkRangingPresenceUnits(){
 const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};let host;
 try{
  host=await loadModel('sticks3');host.display().fill('#123456');const framebuffer=hash(host.display().buffer),hub=await loadGroveModule('hub');host.port('grove').attach(hub);const units={},artwork=[],events=[];host.on('input',e=>{if(e.kind!=='port')events.push(e);});
  for(const [i,id]of ids.entries()){
   const unit=await loadGroveModule(id,{cableLength:65+i*15});units[id]=unit;hub.port(`grove-${i+1}`).attach(unit);assert.ok(host.get(`grove/grove-${i+1}`).module===unit);assert.equal(unit.get('cable').getState().wireCount,4);assert.deepEqual(own(unit,'port').map(p=>p.id),['grove']);assert.equal(own(unit,'button').length,0);assert.equal(own(unit,'joint').length,0);assert.equal(unit.list('display').length,0);
   const expectedLeds=id==='mini-tof-90'?['power-led']:[];assert.deepEqual(own(unit,'led').map(c=>c.id),expectedLeds);
   if(id==='uwb')assert.equal(unit.components.has('sensor'),false);else{assert.equal(unit.get('sensor').meta.role,'visual-anchor');assert.deepEqual(unit.get('sensor').getState(),{});}
   const configurations=[{},...(catalog.products.find(p=>p.id===id)?.configurations??[]).map(c=>c.options)];
   for(const options of configurations){const on=await loadModel(id,options),off=await loadModel(id,{...options,artwork:false});try{const printed=panels(on);assert.ok(printed.length>0);assert.equal(panels(off).length,0);assert.equal(physical(on),physical(off),'printing changes no physical attribute, index or world matrix');for(const p of printed){assert.ok(p.parent&&p.geometry.attributes.position.count>0);assert.equal(p.material.alphaTest,.04);assert.ok(['reference-redraw','source-vector-raster','official-raster','official-vector-raster'].includes(p.userData.artworkKind));}if(!artwork.some(a=>a.id===id))artwork.push({id,panels:printed.length,kinds:[...new Set(printed.map(p=>p.userData.artworkKind))]});}finally{on.dispose();off.dispose();}}
   const target=id==='uwb'?'grove':'sensor',before=physical(unit),fixed=portFrames(unit),start=events.length;assert.throws(()=>host.handle({type:['uwb','presence','distance'][i],target:`grove/grove-${i+1}/${target}`,value:1}),'visual components implement no RF, presence or distance function');assert.equal(physical(unit),before);assert.equal(portFrames(unit),fixed);assert.equal(events.length,start);
  }
  const tof=units['mini-tof-90'],lamp=tof.get('power-led'),lampColor=lamp.getState().color,fixed=portFrames(tof),before=physical(tof),unlit=nonLampEmissive(tof,lamp.lens),start=events.length;assert.equal(lamp.getState().brightness,0);host.handle({type:'led',target:'grove/grove-3/power-led',color:'#0000ff',brightness:.4});assert.equal(lamp.getState().brightness,.4);assert.equal(lamp.getState().color,lampColor);let sprites=0;tof.root.traverse(o=>{if(o.isSprite)sprites++;});assert.equal(sprites,0,'native power guide has no screen-space or through-shell halo');assert.ok(lamp.lens.material.emissive.r>0,'light command drives the actual native guide');assert.equal(nonLampEmissive(tof,lamp.lens),unlit,'light command changes no other mesh emissive');assert.equal(physical(tof),before,'light command changes material appearance only');assert.equal(portFrames(tof),fixed);assert.equal(events.length,start);lamp.set({on:false});
  for(const [i,id]of ids.entries()){host.handle({type:'pose',target:`grove/grove-${i+1}/unitFrame`,position:[i*45,160+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:`grove/grove-${i+1}/cable`,slack:12,bend:[0,0,-1]});assert.equal(units[id].get('cable').getState().wireCount,4);}
  assert.equal(hash(host.display().buffer),framebuffer);const siblings=[physical(units.uwb),physical(tof)];hub.port('grove-2').detach();assert.equal(hub.port('grove-2').module,null);assert.ok(hub.port('grove-1').module===units.uwb&&hub.port('grove-3').module===tof);assert.deepEqual([physical(units.uwb),physical(tof)],siblings,'detaching a passive TMOS branch preserves its sibling assemblies');
  return{status:'pass',artwork,cases:['three-real-four-wire-Grove-branches','actual-fixed-UWB-integrated-antenna-TMOS-window-and-right-angle-ToF-structures','no-invented-buttons-joints-displays-external-antennas-or-visible-IR','passive-anchors-and-UART-connector-reject-numeric-internal-functions','independent-fixed-red-native-power-guide-without-halo-or-geometry-change','configured-artwork-preserves-physical-attributes-indices-and-world-matrices','external-pose-and-independent-selective-detach'],scope:'New actual fixed bodies/optical structures and external appearance APIs only; Node canvas stub, no browser, RF, AT, positioning, ranging, IR optics, presence, motion, temperature, distance, registers, firmware, electrical, hardware or whole-catalog acceptance'};
 }finally{host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkRangingPresenceUnits(),null,2));
