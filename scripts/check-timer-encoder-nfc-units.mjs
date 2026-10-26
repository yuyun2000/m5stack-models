import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {loadModel,loadGroveModule} from '../src/loaders.js';
import {FramebufferPanel} from '../demo/framebuffers.js';

const ids=['timerpwr','extencoder','nfc'];
const hash=a=>createHash('sha256').update(Buffer.from(a.buffer,a.byteOffset,a.byteLength)).digest('hex');
const stamp=a=>createHash('sha256').update(JSON.stringify(a)).digest('hex');
const frame=d=>hash(d.buffer);
function printed(model){const out=[];model.root.traverse(o=>{if(o.userData.role==='printed-artwork')out.push(o);});return out;}
function physical(model){
 const out=[];model.root.updateMatrixWorld(true);
 model.root.traverse(o=>{if(!o.isMesh||o.userData.role==='printed-artwork')return;out.push({name:o.name,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,v])=>[k,hash(v.array)])),index:o.geometry.index?hash(o.geometry.index.array):null,matrix:o.matrixWorld.toArray()});});
 return stamp(out);
}
function fixedFrames(unit){unit.root.updateMatrixWorld(true);return stamp(unit.list('port').map(p=>({id:p.id,matrix:p.object3d.matrixWorld.toArray()})));}

/** Real products and their external visual APIs; only canvas/form boundaries are substituted. */
export async function checkTimerEncoderNfcUnits(){
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});
 const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});
 globalThis.document={createElement:tag=>tag==='canvas'?{width:0,height:0,getContext:()=>ctx}:{}};
 const selector={value:'',replaceChildren(...children){this.children=children;}},button={dataset:{},setAttribute:noop};
 let host,wrong,panel;
 try{
  host=await loadModel('sticks3');panel=new FramebufferPanel({selector,button});panel.bind(host);
  host.display().fill('#123456');const hostFrame=frame(host.display());
  const hub=await loadGroveModule('hub');host.port('grove').attach(hub);const units={},artwork=[];
  for(const [i,id] of ids.entries()){
   const unit=await loadGroveModule(id,{cableLength:65+i*15,...(id==='extencoder'?{terminalPlug:true}:{})});units[id]=unit;hub.port(`grove-${i+1}`).attach(unit);
   assert.ok(host.get(`grove/grove-${i+1}`).module===unit,'hierarchical path resolves exact Unit');assert.equal(unit.get('cable').getState().wireCount,4);assert.equal(unit.get('sensor').meta.role,'visual-anchor');
   const on=await loadModel(id),off=await loadModel(id,{artwork:false});
   try{
    const panels=printed(on);assert.ok(panels.length>0,'each added Unit includes corresponding printing');assert.equal(printed(off).length,0);
    assert.equal(physical(on),physical(off),'artwork toggle preserves physical buffers, indices and world assembly');
    for(const p of panels){assert.ok(p.parent&&p.geometry.attributes.position.count>0);assert.equal(p.material.alphaTest,.04);assert.ok(['official-raster','official-raster-film','official-vector-raster','source-vector-raster','reference-redraw'].includes(p.userData.artworkKind));}
    artwork.push({id,panels:panels.length,kinds:[...new Set(panels.map(p=>p.userData.artworkKind))]});
   }finally{on.dispose();off.dispose();}
  }
  assert.deepEqual(selector.children.map(o=>o.value),['lcd','grove/grove-1/lcd'],'real TimerPWR screen is discoverable independently from host');
  const events=[];host.on('input',e=>events.push(e));await checkTimer({host,unit:units.timerpwr,events});await checkEncoder({host,unit:units.extencoder,events});
  const nfc=units.nfc;assert.equal(nfc.list('button').length,0);assert.equal(nfc.list('joint').length,0);assert.equal(nfc.list('led').length,0);assert.deepEqual(nfc.get('sensor').getState(),{});
  for(const [i,type] of ['power','encoder-count','scan'].entries())assert.throws(()=>host.handle({type,target:`grove/grove-${i+1}/sensor`,value:1}),'passive anchor does not own power, ABZ or RF state');
  wrong=await loadGroveModule('key');
  for(const port of [units.timerpwr.port('usb'),units.timerpwr.port('battery'),units.extencoder.port('encoder')]){
   const saved=port.module;assert.notEqual(port.connector,'grove');assert.throws(()=>port.attach(wrong),'non-Grove mating frame rejects Grove module');assert.ok(port.module===saved,'rejected mating preserves existing assembly');
  }
  assert.equal(units.timerpwr.port('usb').connector,'usb-c-charge-only');assert.equal(units.timerpwr.port('battery').connector,'mx1.25-2p');assert.equal(units.extencoder.port('encoder').connector,'vh2.54-5p');
  wrong.dispose();wrong=null;
  const timerFrame=frame(units.timerpwr.display('lcd'));
  for(const [i,id] of ids.entries()){
   host.handle({type:'pose',target:`grove/grove-${i+1}/unitFrame`,position:[i*25,85+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:`grove/grove-${i+1}/cable`,slack:12,bend:[0,0,-1]});assert.equal(units[id].get('cable').getState().wireCount,4);
  }
  assert.equal(frame(units.timerpwr.display('lcd')),timerFrame);assert.equal(frame(host.display()),hostFrame,'Unit buttons, display, cable and poses preserve host framebuffer');
  hub.port('grove-2').detach();assert.equal(hub.port('grove-2').module,null);assert.ok(hub.port('grove-1').module===units.timerpwr&&hub.port('grove-3').module===units.nfc,'encoder branch detaches independently');
  assert.deepEqual(selector.children.map(o=>o.value),['lcd','grove/grove-1/lcd'],'detaching encoder leaves actual TimerPWR screen target');
  return {status:'pass',artwork,cases:['three-real-Unit-four-wire-branches','TimerPWR-two-native-side-buttons-release-cancel-and-screen-independence','external-monochrome-framebuffer-and-independent-fixed-red-light','ExtEncoder-five-screw-plug-attachment-and-no-invented-rotor','NFC-U216-passive-antenna-anchor','non-Grove-mating-rejection','artwork-toggle-keeps-physical-geometry-and-world-poses','external-pose-and-selective-detach'],scope:'New Unit construction and external shape/attachment API only; Node canvas/forms stubs, no browser, timing, power, ABZ, NFC, firmware, hardware or whole-catalog acceptance'};
 }finally{panel?.unbind();wrong?.dispose();host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}

async function checkTimer({host,unit,events}){
 const display=unit.display('lcd'),light=unit.get('power-led');assert.equal(display.width,64);assert.equal(display.height,48);assert.equal(display.meta.monochrome,true);assert.equal(unit.list('button').length,2);assert.equal(unit.list('led').length,1);assert.equal(unit.list('joint').length,0);
 host.handle({type:'display',target:'grove/grove-1/lcd',fill:'#dedede'});assert.deepEqual(display.getPixel(17,29),[222,222,222]);const pixels=frame(display),ports=fixedFrames(unit);
 light.set({on:true,brightness:.37,color:'#00ff00'});assert.deepEqual(light.getState(),{color:'#ff2720',brightness:.37});const lightState=light.getState();
 for(const id of ['button-a','button-b']){
  const control=unit.button(id),rest=physical(unit),start=events.length,other=unit.button(id==='button-a'?'button-b':'button-a');
  host.handle({type:'button',target:'grove/grove-1/'+id,action:'press',source:'fixture'});for(let k=0;k<15;k++)host.update(1/60);
  assert.equal(control.getState().pressed,true);assert.ok(control.getActuationState().depthMm>0);assert.equal(other.getState().pressed,false);assert.notEqual(physical(unit),rest,'native side actuator moves actual physical surfaces');
  assert.equal(fixedFrames(unit),ports);assert.equal(frame(display),pixels);assert.deepEqual(light.getState(),lightState,'button does not invent supply or charge response');
  host.handle({type:'button',target:'grove/grove-1/'+id,action:'release',source:'fixture'});for(let k=0;k<15;k++)host.update(1/60);
  assert.equal(control.getActuationState().depthMm,0);assert.equal(physical(unit),rest,'physical actuator returns exactly to rest');
  assert.deepEqual(events.slice(start).map(e=>e.action),['down','up','click']);
  const cancelAt=events.length;control.press('cancel-fixture');host.update(.2);control.cancel('cancel-fixture');host.update(.2);
  assert.deepEqual(events.slice(cancelAt).map(e=>e.action),['down','up']);assert.equal(events.at(-1).cancelled,true);assert.equal(control.getActuationState().depthMm,0);
 }
 light.set(false);assert.equal(frame(display),pixels,'independent external light commands preserve external pixels');for(let k=0;k<30;k++)host.update(1/60);assert.equal(frame(display),pixels,'updates do not create an OLED clock or battery page');
}

async function checkEncoder({host,unit,events}){
 const port=unit.port('encoder'),plug=port.module;assert.ok(plug,'supplied five-pin plug is available as a physical accessory');assert.equal(plug.list('joint').length,5);assert.equal(unit.list('button').length,0);assert.equal([...unit.components.values()].filter(c=>c.kind==='joint').length,0,'external encoder acquisition box itself has no rotor');assert.equal(unit.list('led').length,0);
 const fixed=fixedFrames(unit),before=events.length;
 for(let i=1;i<=5;i++){
  const screw=plug.get('screw-'+i),rest=screw.object3d.quaternion.clone();screw.set({angleDeg:35});assert.ok(!screw.object3d.quaternion.equals(rest));screw.set({angleDeg:70,durationMs:120});for(let k=0;k<12;k++)host.update(1/60);assert.equal(screw.getState().angleDeg,70);screw.set({angleDeg:0});assert.ok(screw.object3d.quaternion.equals(rest),'screw returns to exact rest');
 }
 assert.equal(fixedFrames(unit),fixed);assert.equal(events.length,before,'external head motion does not emit ABZ input');const saved=port.detach({dispose:false});assert.ok(saved===plug);assert.equal(port.module,null);assert.equal(unit.get('cable').getState().wireCount,4);port.attach(saved);assert.ok(port.module===plug);
 const on=await loadModel('extencoder',{terminalPlug:true}),off=await loadModel('extencoder',{terminalPlug:true,artwork:false});try{assert.equal(physical(on),physical(off),'printing preserves configured terminal accessory');}finally{on.dispose();off.dispose();}
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkTimerEncoderNfcUnits(),null,2));
