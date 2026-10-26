import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import fs from 'node:fs/promises';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const ids=['mini-pdm','mini-bps-v11','mic'];
const digest=v=>createHash('sha256').update(v).digest('hex'),hash=a=>digest(Buffer.from(a.buffer,a.byteOffset,a.byteLength)),stamp=v=>digest(JSON.stringify(v));
const own=(unit,kind)=>[...unit.components.values()].filter(c=>c.kind===kind);
function updateWorld(o){let root=o;while(root.parent)root=root.parent;root.updateMatrixWorld(true);}
function panels(unit){const a=[];unit.root.traverse(o=>{if(o.userData.role==='printed-artwork')a.push(o);});return a;}
function physical(unit){updateWorld(unit.root);const a=[];unit.root.traverse(o=>{if(!o.isMesh||o.userData.role==='printed-artwork')return;a.push({name:o.name,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,v])=>[k,hash(v.array)])),index:o.geometry.index?hash(o.geometry.index.array):null,matrix:o.matrixWorld.toArray()});});return stamp(a);}
function frames(unit){updateWorld(unit.root);return stamp([...own(unit,'port'),unit.get('sensor')].map(c=>({id:c.id,matrix:c.object3d.matrixWorld.toArray()})));}
function isUnder(o,parent){for(let p=o;p;p=p.parent)if(p===parent)return true;return false;}
function tick(host){for(let n=0;n<30;n++)host.update(1/60);}

/** Actual microphone/pressure structures and external shape APIs; only Node canvas is substituted. */
export async function checkAudioPressureUnits(){
 const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};let host;
 try{
  host=await loadModel('sticks3');host.display().fill('#123456');const framebuffer=hash(host.display().buffer),hub=await loadGroveModule('hub');host.port('grove').attach(hub);const units={},artwork=[],events=[];host.on('input',e=>{if(e.kind!=='port')events.push(e);});
  for(const [i,id]of ids.entries()){
   const unit=await loadGroveModule(id,{cableLength:65+i*15});units[id]=unit;hub.port(`grove-${i+1}`).attach(unit);assert.ok(host.get(`grove/grove-${i+1}`).module===unit);assert.equal(unit.get('cable').getState().wireCount,4);assert.deepEqual(own(unit,'port').map(p=>p.id),['grove']);for(const kind of ['button','led','display','speaker'])assert.equal(own(unit,kind).length,0);assert.deepEqual(own(unit,'joint').map(p=>p.id),id==='mic'?['threshold']:[]);assert.equal(unit.get('sensor').meta.role,'visual-anchor');assert.deepEqual(unit.get('sensor').getState(),{});
   const configurations=[{},...(catalog.products.find(p=>p.id===id)?.configurations??[]).map(c=>c.options)],seen=new Set();
   for(const options of configurations){const key=JSON.stringify(options);if(seen.has(key))continue;seen.add(key);for(const load of [loadModel,loadGroveModule]){const on=await load(id,options),off=await load(id,{...options,artwork:false});try{const printed=panels(on);assert.ok(printed.length>0);assert.equal(panels(off).length,0);assert.equal(physical(on),physical(off),'printing changes no physical attribute, index or world matrix in either entry');for(const p of printed){assert.ok(p.parent&&p.geometry.attributes.position.count>0);assert.equal(p.material.alphaTest,.04);assert.equal(p.userData.artworkKind,'reference-redraw');}if(!artwork.some(a=>a.id===id))artwork.push({id,panels:printed.length,kinds:[...new Set(printed.map(p=>p.userData.artworkKind))]});}finally{on.dispose();off.dispose();}}}
   const before=physical(unit),fixed=frames(unit),start=events.length;assert.throws(()=>host.handle({type:['pdm-audio','pressure','audio-sample'][i],target:`grove/grove-${i+1}/sensor`,value:1}),'passive anchors own no PDM/audio/pressure data function');assert.equal(physical(unit),before);assert.equal(frames(unit),fixed);assert.equal(events.length,start);
  }
  const mic=units.mic,joint=mic.get('threshold'),start=events.length,before=physical(mic),fixed=frames(mic);assert.equal(joint.continuous,false);assert.deepEqual(joint.limitsDeg,[-135,135]);updateWorld(mic.root);const stationary=[],moving=[];mic.root.traverse(o=>{if(!o.isMesh)return;(isUnder(o,joint.object3d)?moving:stationary).push({object:o,matrix:o.matrixWorld.clone()});});assert.ok(moving.length>0);
  host.handle({type:'joint',target:'grove/grove-3/threshold',angleDeg:90,durationMs:120});tick(host);updateWorld(host.root);assert.equal(joint.getState().angleDeg,90);assert.ok(moving.some(r=>!r.object.matrixWorld.equals(r.matrix)));assert.ok(stationary.every(r=>r.object.matrixWorld.equals(r.matrix)),'adjustment head leaves fixed cup,microphone,PCB,socket and labels stationary');assert.equal(frames(mic),fixed);assert.equal(events.length,start);
  const held=physical(mic);assert.throws(()=>joint.set({angleDeg:136}));assert.throws(()=>joint.set({angleDeg:-136}));assert.throws(()=>joint.set({rpm:1}));assert.equal(physical(mic),held,'invalid viewer angles and RPM preserve old state');host.handle({type:'joint',target:'grove/grove-3/threshold',angleDeg:0});assert.equal(physical(mic),before,'head returns exactly to neutral geometry');
  for(const [i,id]of ids.entries()){host.handle({type:'pose',target:`grove/grove-${i+1}/unitFrame`,position:[i*45,160+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:`grove/grove-${i+1}/cable`,slack:12,bend:[0,0,-1]});assert.equal(units[id].get('cable').getState().wireCount,4);}
  assert.equal(hash(host.display().buffer),framebuffer);const siblings=[physical(units['mini-pdm']),physical(mic)];hub.port('grove-2').detach();assert.equal(hub.port('grove-2').module,null);assert.ok(hub.port('grove-1').module===units['mini-pdm']&&hub.port('grove-3').module===mic);assert.deepEqual([physical(units['mini-pdm']),physical(mic)],siblings);
  return{status:'pass',artwork,cases:['three-real-four-wire-Grove-branches','actual-PDM-MEMS-pressure-LGA-and-electret-microphone-openings','passive-sensor-anchors-reject-audio-clock-pressure-and-numeric-functions','MIC-exposed-threshold-head-only-finite-angle-tween-and-exact-restoration','MIC-fixed-board-sensor-cup-ports-and-labels-never-follow-head','invalid-head-angles-and-RPM-rejected-with-old-state-preserved','no-invented-buttons-LEDs-displays-speakers-or-sound-wave-animation','both-entries-artwork-preserves-all-physical-attributes-indices-world-matrices','external-pose-and-independent-selective-detach'],scope:'New passive acoustic/pressure structures and external adjustment appearance only;Node canvas stub,no browser,PDM/audio/samples/recording/sound/ADC/comparator/pressure/temperature/altitude/I2C/electrical/firmware/physical or whole-catalog acceptance'};
 }finally{host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkAudioPressureUnits(),null,2));
