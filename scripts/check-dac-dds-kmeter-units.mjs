import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {loadModel,loadGroveModule} from '../src/loaders.js';
const ids=['dac2','dds','kmeter-iso-v11'];
const hash=a=>createHash('sha256').update(Buffer.from(a.buffer,a.byteOffset,a.byteLength)).digest('hex');
const stamp=a=>createHash('sha256').update(JSON.stringify(a)).digest('hex');
function printed(model){const out=[];model.root.traverse(o=>{if(o.userData.role==='printed-artwork')out.push(o);});return out;}
function physical(model){const out=[];model.root.updateMatrixWorld(true);model.root.traverse(o=>{if(!o.isMesh||o.userData.role==='printed-artwork')return;out.push({name:o.name,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,v])=>[k,hash(v.array)])),index:o.geometry.index?hash(o.geometry.index.array):null,matrix:o.matrixWorld.toArray()});});return stamp(out);}

/** Real products and four-wire branches. Only the Node canvas boundary is substituted. */
export async function checkDacDdsKmeterUnits(){
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});
 const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};let host,wrong;
 try{
  host=await loadModel('sticks3');const hub=await loadGroveModule('hub');host.port('grove').attach(hub);const units={},artwork=[];
  for(const [i,id]of ids.entries()){
   const options={cableLength:65+i*15,...(id==='dac2'?{terminalPlug:true}:{})},unit=await loadGroveModule(id,options);units[id]=unit;hub.port(`grove-${i+1}`).attach(unit);assert.ok(host.get(`grove/grove-${i+1}`).module===unit);assert.equal(unit.get('cable').getState().wireCount,4);assert.equal(unit.get('sensor').meta.role,'visual-anchor');
   const on=await loadModel(id),off=await loadModel(id,{artwork:false});try{
    const panels=printed(on);assert.ok(panels.length>0,'matching printing is part of each Unit increment');assert.equal(printed(off).length,0);assert.equal(physical(on),physical(off),'print options preserve all physical buffers and world assembly');
    for(const panel of panels){assert.ok(panel.parent&&panel.geometry.attributes.position.count>0);assert.equal(panel.material.alphaTest,.04);assert.ok(['official-raster','official-raster-film','official-vector-raster','source-vector-raster','reference-redraw'].includes(panel.userData.artworkKind));}
    artwork.push({id,panels:panels.length,kinds:[...new Set(panels.map(p=>p.userData.artworkKind))]});
   }finally{on.dispose();off.dispose();}
  }
  for(const [i,type]of ['voltage','waveform','temperature'].entries())assert.throws(()=>host.handle({type,target:`grove/grove-${i+1}/sensor`,value:1}),'passive anchors do not implement signal conversion/generation or temperature acquisition');
  for(const unit of Object.values(units))assert.equal(unit.list('button').length,0,'no invented controls on these fixed instrument bodies');
  const events=[];host.on('input',e=>events.push(e));await checkDac({host,dac:units.dac2,events});
  wrong=await loadGroveModule('key');
  const outputs=[units.dac2.port('terminal'),units.dds.port('sma'),kmeterPort(units['kmeter-iso-v11'])];
  for(const port of outputs){const saved=port.module;assert.notEqual(port.connector,'grove');assert.throws(()=>port.attach(wrong),'actual non-Grove output rejects Grove geometry');assert.ok(port.module===saved,'type rejection leaves the actual existing assembly intact');}
  assert.equal(units.dds.port('sma').connector,'sma-female');assert.equal(units.dds.list('joint').length,0);assert.equal(units.dds.list('led').length,0,'SMA exposure is metal, not a status lamp');
  await checkKmeter({host,unit:units['kmeter-iso-v11'],events});
  wrong.dispose();wrong=null;
  for(const [i,id]of ids.entries()){
   host.handle({type:'pose',target:`grove/grove-${i+1}/unitFrame`,position:[i*25,85+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:`grove/grove-${i+1}/cable`,slack:12,bend:[0,0,-1]});assert.equal(units[id].get('cable').getState().wireCount,4);
  }
  hub.port('grove-2').detach();assert.equal(hub.port('grove-2').module,null);assert.ok(hub.port('grove-1').module===units.dac2&&hub.port('grove-3').module===units['kmeter-iso-v11'],'one output-instrument branch detaches independently');
  return {status:'pass',artwork,cases:['three-real-Unit-four-wire-branches','passive-anchors-reject-conversion-waveform-temperature','real-DAC-terminal-accessory-and-four-screw-heads','fixed-SMA-and-K-flat-receptacles-reject-Grove','artwork-toggle-keeps-physical-geometry-and-world-poses','external-pose-and-selective-detach'],scope:'New Unit construction and external shape/attachment API only; Node canvas stub, no browser, electrical, signal/temperature, firmware, hardware or whole-catalog acceptance'};
 }finally{wrong?.dispose();host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}
async function checkDac({host,dac,events}){
 const port=dac.port('terminal'),plug=port.module;assert.ok(plug,'supplied HT3.96 four-pin plug is available as a physical accessory');assert.equal(plug.list('joint').length,4);assert.equal(dac.list('led').length,0);host.root.updateMatrixWorld(true);const fixed=port.object3d.matrixWorld.clone(),grove=dac.port('grove').object3d.matrixWorld.clone(),before=events.length;
 for(let i=1;i<=4;i++){const screw=plug.get('screw-'+i),rest=screw.object3d.quaternion.clone();screw.set({angleDeg:35});assert.ok(!screw.object3d.quaternion.equals(rest),'real screw head changes pose');screw.set({angleDeg:70,durationMs:120});for(let k=0;k<12;k++)host.update(1/60);assert.equal(screw.getState().angleDeg,70);screw.set({angleDeg:0});assert.ok(screw.object3d.quaternion.equals(rest),'screw head returns exactly to original visual rest');}
 host.root.updateMatrixWorld(true);assert.ok(port.object3d.matrixWorld.equals(fixed)&&dac.port('grove').object3d.matrixWorld.equals(grove),'screw output leaves both fixed mating frames alone');assert.equal(events.length,before,'external screw commands do not echo input or change analog state');
 const saved=port.detach({dispose:false});assert.ok(saved===plug);assert.equal(port.module,null);assert.equal(dac.get('cable').getState().wireCount,4);port.attach(saved);assert.ok(port.module===plug);
 const on=await loadModel('dac2',{terminalPlug:true}),off=await loadModel('dac2',{terminalPlug:true,artwork:false});try{assert.equal(physical(on),physical(off),'printing leaves configured terminal accessory geometry unchanged');}finally{on.dispose();off.dispose();}
}
function kmeterPort(unit){return unit.port('thermocouple');}
async function checkKmeter({unit}){
 const port=kmeterPort(unit);assert.equal(port.connector,'thermocouple-k-mini-flat');assert.equal(port.module,null,'unmodeled supplied probe is not replaced with a guessed plug');assert.equal(unit.list('joint').length,0);assert.equal(unit.list('led').length,0,'hidden LED1 is not an invented external light aperture');assert.deepEqual(unit.get('sensor').getState(),{});
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkDacDdsKmeterUnits(),null,2));
