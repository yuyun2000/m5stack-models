import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const ids=['adc-v11','ameter','vmeter'];
const pinCount={'adc-v11':2,ameter:4,vmeter:4};
const hash=a=>createHash('sha256').update(Buffer.from(a.buffer,a.byteOffset,a.byteLength)).digest('hex');
const stamp=a=>createHash('sha256').update(JSON.stringify(a)).digest('hex');
function printed(model){const out=[];model.root.traverse(o=>{if(o.userData.role==='printed-artwork')out.push(o);});return out;}
function physical(model){
 const out=[];model.root.updateMatrixWorld(true);
 model.root.traverse(o=>{if(!o.isMesh||o.userData.role==='printed-artwork')return;out.push({name:o.name,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,v])=>[k,hash(v.array)])),index:o.geometry.index?hash(o.geometry.index.array):null,matrix:o.matrixWorld.toArray()});});
 return stamp(out);
}
function portFrames(unit){unit.root.updateMatrixWorld(true);return stamp([...unit.components.values()].filter(c=>c.kind==='port').map(p=>({id:p.id,matrix:p.object3d.matrixWorld.toArray()})));}

/** Actual products and four-wire branches. Only the canvas drawing boundary is substituted. */
export async function checkAdcMeterUnits(){
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});
 const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
 let host,wrong;
 try{
  host=await loadModel('sticks3');host.display().fill('#123456');const hostFrame=hash(host.display().buffer);
  const hub=await loadGroveModule('hub');host.port('grove').attach(hub);const units={},artwork=[],events=[];host.on('input',e=>{if(e.kind!=='port')events.push(e);});
  for(const [i,id] of ids.entries()){
   const unit=await loadGroveModule(id,{cableLength:65+i*15,terminalPlug:true});units[id]=unit;hub.port(`grove-${i+1}`).attach(unit);
   assert.ok(host.get(`grove/grove-${i+1}`).module===unit,'hierarchical branch resolves exact Unit');assert.equal(unit.get('cable').getState().wireCount,4);assert.equal(unit.get('sensor').meta.role,'visual-anchor');assert.deepEqual(unit.get('sensor').getState(),{});
   assert.equal(unit.list('button').length,0,'no invented controls');assert.equal([...unit.components.values()].filter(c=>c.kind==='joint').length,0,'instrument body has no invented rotor');
   for(const terminalPlug of [false,true]){
    const on=await loadModel(id,{terminalPlug}),off=await loadModel(id,{terminalPlug,artwork:false});
    try{
     const panels=printed(on);assert.ok(panels.length>0,'matching print is included in every new Unit');assert.equal(printed(off).length,0);assert.equal(physical(on),physical(off),'artwork option preserves physical buffers, indices and world assembly');
     for(const p of panels){assert.ok(p.parent&&p.geometry.attributes.position.count>0);assert.equal(p.material.alphaTest,.04);assert.equal(p.userData.artworkKind,'reference-redraw');}
     if(!terminalPlug)artwork.push({id,panels:panels.length,kinds:[...new Set(panels.map(p=>p.userData.artworkKind))]});
    }finally{on.dispose();off.dispose();}
   }
   await checkTerminal({host,unit,id,events});
   assert.throws(()=>host.handle({type:['adc-sample','current','voltage'][i],target:`grove/grove-${i+1}/sensor`,value:1}),'passive anchor does not acquire instrument values');
  }
  assert.equal(units['adc-v11'].list('led').length,0,'ADC has no invented external light');
  const meterLights=[units.ameter.get('power'),units.vmeter.get('power-led')];
  for(const [i,led] of meterLights.entries()){
   const sibling=meterLights[1-i],before=sibling.getState(),color=led.getState().color;
   assert.equal(led.meta.colorConfirmed,false,'unconfirmed emitted color remains explicit in public metadata');
   led.set({color:'#0000ff',brightness:.43});assert.equal(led.getState().color,color,'single indicator keeps documented visual color estimate');assert.equal(led.getState().brightness,.43);assert.deepEqual(sibling.getState(),before,'meter lights are independently externally driven');
  }
  wrong=await loadGroveModule('key');
  for(const id of ids){const port=units[id].port('terminal'),saved=port.module;assert.equal(port.connector,`ht3.96-${pinCount[id]}p`);assert.throws(()=>port.attach(wrong),'real terminal connector rejects Grove geometry');assert.ok(port.module===saved,'rejected mating preserves installed accessory');}
  wrong.dispose();wrong=null;
  const lightStates=meterLights.map(l=>l.getState());
  for(const [i,id] of ids.entries()){
   host.handle({type:'pose',target:`grove/grove-${i+1}/unitFrame`,position:[i*25,85+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:`grove/grove-${i+1}/cable`,slack:12,bend:[0,0,-1]});assert.equal(units[id].get('cable').getState().wireCount,4);
  }
  for(let i=0;i<30;i++)host.update(1/60);
  assert.deepEqual(meterLights.map(l=>l.getState()),lightStates,'updates and poses do not invent power or measurement responses');assert.equal(events.length,0,'external physical commands do not fabricate measurement input');assert.equal(hash(host.display().buffer),hostFrame,'instrument commands preserve host external framebuffer');
  hub.port('grove-2').detach();assert.equal(hub.port('grove-2').module,null);assert.ok(hub.port('grove-1').module===units['adc-v11']&&hub.port('grove-3').module===units.vmeter,'AMeter detaches independently');
  return {status:'pass',artwork,cases:['three-real-Unit-four-wire-branches','two-four-four-real-screw-heads-external-angle-and-exact-reset','supplied-terminal-plug-detach-and-reattach','fixed-meter-lights-independent-from-input-and-measurements','passive-anchors-reject-ADC-current-voltage','terminal-types-reject-Grove','artwork-toggle-preserves-configured-physical-buffers-and-world-matrices','external-pose-and-selective-detach'],scope:'New Unit construction and external shape/attachment APIs only; Node canvas stub, no browser, measurement, calibration, isolation, firmware, hardware or whole-catalog acceptance'};
 }finally{wrong?.dispose();host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}

async function checkTerminal({host,unit,id,events}){
 const port=unit.port('terminal'),plug=port.module;assert.ok(plug,'documented supplied plug is represented');assert.equal(plug.meta.id,`m5stack.unit.${id}.terminal-plug`,'accessory snapshot reports its own product identity');assert.equal(plug.list('joint').length,pinCount[id]);const frames=portFrames(unit),before=events.length;
 const lightState=unit.list('led').map(l=>l.getState());
 for(let i=1;i<=pinCount[id];i++){
  const screw=plug.get('screw-'+i),rest=screw.object3d.quaternion.clone();screw.set({angleDeg:35});assert.ok(!screw.object3d.quaternion.equals(rest),'actual head changes pose');screw.set({angleDeg:70,durationMs:120});for(let k=0;k<12;k++)host.update(1/60);assert.equal(screw.getState().angleDeg,70);assert.throws(()=>screw.set({rpm:2}),'screw head is a position joint, not an invented motor');screw.set({angleDeg:0});assert.ok(screw.object3d.quaternion.equals(rest),'head returns exactly to authored rest');
 }
 assert.equal(portFrames(unit),frames,'screw motion preserves fixed mating frames');assert.deepEqual(unit.list('led').map(l=>l.getState()),lightState,'screw output does not invent power response');assert.equal(events.length,before,'external screw commands do not echo input');
 const saved=port.detach({dispose:false});assert.ok(saved===plug);assert.equal(port.module,null);assert.equal(unit.get('cable').getState().wireCount,4);port.attach(saved);assert.ok(port.module===plug);
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkAdcMeterUnits(),null,2));
