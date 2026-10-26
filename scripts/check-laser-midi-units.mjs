import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {loadModel,loadGroveModule} from '../src/loaders.js';
const ids=['laser-tx','laser-rx','midi'];
const hash=a=>createHash('sha256').update(Buffer.from(a.buffer,a.byteOffset,a.byteLength)).digest('hex');
const stamp=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
function printed(model){const a=[];model.root.traverse(o=>{if(o.userData.role==='printed-artwork')a.push(o);});return a;}
function physical(model){const a=[];model.root.updateMatrixWorld(true);model.root.traverse(o=>{if(!o.isMesh||o.userData.role==='printed-artwork')return;a.push({name:o.name,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,v])=>[k,hash(v.array)])),index:o.geometry.index?hash(o.geometry.index.array):null,matrix:o.matrixWorld.toArray()});});return stamp(a);}

/** Actual products and four-wire assembly; only the Node canvas boundary is replaced. */
export async function checkLaserMidiUnits(){
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});
 const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};let host,wrongPlug;
 try{
  host=await loadModel('sticks3');const hub=await loadGroveModule('hub');host.port('grove').attach(hub);const modules={},artwork=[];
  for(const [i,id]of ids.entries()){
   const unit=await loadGroveModule(id,{cableLength:65+i*15});modules[id]=unit;hub.port(`grove-${i+1}`).attach(unit);assert.ok(host.get(`grove/grove-${i+1}`).module===unit,'recursive path owns its actual module');assert.equal(unit.get('cable').getState().wireCount,4);assert.equal(unit.get('sensor').meta.role,'visual-anchor');
   const on=await loadModel(id),off=await loadModel(id,{artwork:false});try{
    const panels=printed(on);assert.ok(panels.length>0,'corresponding printing arrives with every new Unit');assert.equal(printed(off).length,0);assert.equal(physical(on),physical(off),'print option preserves physical buffers and world assembly');
    for(const panel of panels){assert.ok(panel.parent&&panel.geometry.attributes.position.count>0);assert.equal(panel.material.alphaTest,.04);assert.equal(panel.userData.artworkKind,'reference-redraw');}
    artwork.push({id,panels:panels.length,kinds:[...new Set(panels.map(p=>p.userData.artworkKind))]});
   }finally{on.dispose();off.dispose();}
  }
  const tx=modules['laser-tx'],rx=modules['laser-rx'],midi=modules.midi,events=[];host.on('input',e=>events.push(e));
  for(const unit of [tx,rx]){assert.equal(unit.list('button').length,0);assert.equal(unit.list('joint').length,0);}
  assert.equal(rx.list('led').length,0,'actual receive optic is not an invented emitter');
  for(const [i,type]of ['laser-send','light-level','midi-message'].entries())assert.throws(()=>host.handle({type,target:`grove/grove-${i+1}/sensor`,value:1}),'passive anchors own no propagation, sensing, MIDI routing or sound engine');
  const emitter=tx.get('emitter'),off=emitter.getState(),rxBefore=rx.getState(),midiBefore=midi.getState();assert.equal(tx.list('led').length,1);assert.equal(emitter.brightness,0);const offEmission=emitter.lensMaterial.emissive.clone();
  host.handle({type:'led',target:'grove/grove-1/emitter',color:'#00ff00',brightness:.6});assert.equal(emitter.brightness,.6);assert.ok(!emitter.lensMaterial.emissive.equals(offEmission),'real emitter lens material responds to external brightness');assert.equal(emitter.glow.visible,false,'no exterior beam/glow sprite is introduced');assert.equal(emitter.getState().color,off.color,'650nm documented emitter keeps a fixed red appearance');assert.deepEqual(rx.getState(),rxBefore,'TX appearance does not update receiving Unit');assert.deepEqual(midi.getState(),midiBefore);assert.equal(events.length,0,'external appearance output does not echo input');
  await checkMidi({host,midi,tx,rx,events,emitter});
  wrongPlug=await loadGroveModule('key');const physicalPorts=midi.list('port').filter(p=>p.id!=='grove');assert.equal(physicalPorts.length,5,'two DIN and three 3.5mm receptacles exist');
  for(const port of physicalPorts){assert.notEqual(port.connector,'grove');assert.throws(()=>port.attach(wrongPlug),'DIN/TRS cannot accept Grove geometry');assert.equal(port.module,null);}
  wrongPlug.dispose();wrongPlug=null;
  for(const [i,id]of ids.entries()){
   host.handle({type:'pose',target:`grove/grove-${i+1}/unitFrame`,position:[i*25,85+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:`grove/grove-${i+1}/cable`,slack:12,bend:[0,0,-1]});assert.equal(modules[id].get('cable').getState().wireCount,4);
  }
  const state=emitter.getState();hub.port('grove-2').detach();assert.equal(hub.port('grove-2').module,null);assert.ok(hub.port('grove-1').module===tx&&hub.port('grove-3').module===midi,'selective receive-Unit detach preserves sibling branches');assert.deepEqual(emitter.getState(),state);
  return {status:'pass',artwork,cases:['three-real-Unit-Grove-branches','distinct-transmit-and-receive-optics-with-passive-anchors','fixed-red-emitter-output-is-independent','actual-retained-MIDI-selector-with-input-intent','five-real-DIN-TRS-ports-reject-Grove','artwork-toggle-keeps-physical-buffers-and-world-assembly','four-wire-poses-and-selective-detach'],scope:'New product construction/API only; Node canvas stub, no browser, optical propagation/sensing/communication, MIDI routing, audio, firmware, hardware or whole-catalog acceptance'};
 }finally{wrongPlug?.dispose();host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}
async function checkMidi({host,midi,tx,rx,events,emitter}){
 assert.equal(midi.list('button').length,1,'only the real Bypass/Separate selector');assert.equal(midi.list('joint').length,0);assert.equal(midi.list('led').length,1);
 const mode=midi.button('mode'),power=midi.get('power-led');assert.equal(mode.latching,true);assert.equal(power.brightness,0);const offEmission=power.lensMaterial.emissive.clone(),colour=power.getState().color,emitterState=emitter.getState(),rxState=rx.getState();
 power.set({brightness:.35,color:'#ff0000'});assert.equal(power.getState().color,colour,'actual green power indicator retains its fixed colour');assert.equal(power.brightness,.35);assert.ok(!power.lensMaterial.emissive.equals(offEmission),'real native light guide responds to external brightness');assert.deepEqual(emitter.getState(),emitterState);assert.deepEqual(rx.getState(),rxState);
 const light=power.getState(),original=mode.position;host.root.updateMatrixWorld(true);const rest=physical(midi),frames=midi.list('port').map(p=>[p,p.object3d.matrixWorld.clone()]);
 mode.setPosition(1-original);host.update(.3);host.root.updateMatrixWorld(true);assert.notEqual(physical(midi),rest,'the actual retained selector cap moves');assert.deepEqual(power.getState(),light,'mode does not imply power, routing or sound');assert.deepEqual(emitter.getState(),emitterState);assert.deepEqual(rx.getState(),rxState);
 for(const [port,frame]of frames)assert.ok(port.object3d.matrixWorld.equals(frame),'fixed DIN/TRS/Grove mating frame does not move with selector');
 const before=events.length;mode.press('branch-check');mode.release('branch-check');host.update(.3);assert.equal(mode.position,original);assert.equal(physical(midi),rest,'retained selector can return to its original detent');assert.ok(events.slice(before).some(e=>e.id==='grove/grove-3/mode'&&e.action==='click'),'selector input uses the actual nested address');assert.deepEqual(power.getState(),light);
 const ports=['midi-in-din','midi-out-din','midi-in-trs','midi-out-trs','audio'];
 for(const id of ports)assert.ok(midi.port(id),'all five real external receptacles are addressable');
 for(const id of ['midi-in-din','midi-out-din'])assert.equal(midi.port(id).connector,'din-5pin-female');
 for(const id of ['midi-in-trs','midi-out-trs','audio'])assert.equal(midi.port(id).connector,'audio-3.5mm-trs','TRS is a mechanical match type, not audio/MIDI protocol equivalence');
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkLaserMidiUnits(),null,2));
