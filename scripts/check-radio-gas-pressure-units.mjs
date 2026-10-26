import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import fs from 'node:fs/promises';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const ids=['tube-pressure','mq','lora-e220-920'];
const hash=a=>createHash('sha256').update(Buffer.from(a.buffer,a.byteOffset,a.byteLength)).digest('hex');
const stamp=a=>createHash('sha256').update(JSON.stringify(a)).digest('hex');
function printed(model){const out=[];model.root.traverse(o=>{if(o.userData.role==='printed-artwork')out.push(o);});return out;}
function physical(model){
 const out=[];model.root.updateMatrixWorld(true);
 model.root.traverse(o=>{if(!o.isMesh||o.userData.role==='printed-artwork')return;out.push({name:o.name,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,v])=>[k,hash(v.array)])),index:o.geometry.index?hash(o.geometry.index.array):null,matrix:o.matrixWorld.toArray()});});
 return stamp(out);
}
function portFrames(unit){unit.root.updateMatrixWorld(true);return stamp([...unit.components.values()].filter(c=>c.kind==='port').map(p=>({id:p.id,matrix:p.object3d.matrixWorld.toArray()})));}
function capPose(host,button){host.root.updateMatrixWorld(true);return stamp(button.cap.matrixWorld.toArray());}

/** Real products and external visual APIs. Only the canvas drawing boundary is substituted. */
export async function checkRadioGasPressureUnits(){
 const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});
 const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};let host,wrong;
 try{
  host=await loadModel('sticks3');host.display().fill('#123456');const hostFrame=hash(host.display().buffer);
  const hub=await loadGroveModule('hub');host.port('grove').attach(hub);const units={},artwork=[],events=[];host.on('input',e=>{if(e.kind!=='port')events.push(e);});
  for(const [i,id] of ids.entries()){
   const unit=await loadGroveModule(id,{cableLength:65+i*15,...(id==='lora-e220-920'?{antenna:true}:{})});units[id]=unit;hub.port(`grove-${i+1}`).attach(unit);
   assert.ok(host.get(`grove/grove-${i+1}`).module===unit);assert.equal(unit.get('cable').getState().wireCount,4);assert.equal(unit.get('sensor').meta.role,'visual-anchor');assert.deepEqual(unit.get('sensor').getState(),{});
   const menu=catalog.products.find(p=>p.id===id)?.configurations??[];
   if(id==='mq'){assert.ok(menu.length>=2,'Viewer offers MQ installed/removed configurations');assert.notEqual(menu[0].options.mq5Cartridge,false);assert.ok(menu.some(c=>c.options.mq5Cartridge===false));}
   if(id==='lora-e220-920'){assert.equal(menu[0]?.options.antenna,true,'Viewer opens the supplied antenna configuration first');assert.ok(menu.some(c=>c.options.antenna===false));}
   const configurations=id==='mq'?[{},...menu.map(c=>c.options)]:id==='lora-e220-920'?[...menu.map(c=>c.options),{antenna:true,antennaAngleDeg:90}]:[{}];
   for(const options of configurations){
    const on=await loadModel(id,options),off=await loadModel(id,{...options,artwork:false});
    try{
     const panels=printed(on);assert.ok(panels.length>0,'each new Unit includes its actual matching print');assert.equal(printed(off).length,0);assert.equal(physical(on),physical(off),'artwork changes no physical buffer/index or world pose, including fitted accessories');
     for(const p of panels){assert.ok(p.parent&&p.geometry.attributes.position.count>0);assert.equal(p.material.alphaTest,.04);assert.ok(['reference-redraw','source-vector-raster','official-vector-raster','official-raster'].includes(p.userData.artworkKind));}
     if(!artwork.some(r=>r.id===id))artwork.push({id,panels:panels.length,kinds:[...new Set(panels.map(p=>p.userData.artworkKind))]});
    }finally{on.dispose();off.dispose();}
   }
   assert.equal(unit.list('led').length,0,'no invented exposed lamp');
   assert.throws(()=>host.handle({type:['pressure','gas','transmit'][i],target:`grove/grove-${i+1}/sensor`,value:1}),'passive anchor does not own pressure, gas or RF state');
  }
  assert.equal(units['tube-pressure'].list('button').length,0);assert.equal(units['tube-pressure'].list('joint').length,0);assert.equal(units.mq.list('button').length,0);assert.equal(units.mq.list('joint').length,0);
  await checkMq({host,unit:units.mq,events});await checkLora({host,unit:units['lora-e220-920'],events});
  wrong=await loadGroveModule('key');
  for(const port of [units['tube-pressure'].port('tube'),units.mq.port('mq5'),units['lora-e220-920'].port('sma')]){const saved=port.module;assert.notEqual(port.connector,'grove');assert.throws(()=>port.attach(wrong));assert.ok(port.module===saved,'type rejection preserves actual existing accessory');}
  assert.equal(units['tube-pressure'].port('tube').connector,'tube-3mm');assert.equal(units['tube-pressure'].port('tube').module,null);assert.equal(units.mq.port('mq5').connector,'mq5-six-pin');assert.equal(units['lora-e220-920'].port('sma').connector,'sma-female');
  wrong.dispose();wrong=null;
  for(const [i,id] of ids.entries()){
   host.handle({type:'pose',target:`grove/grove-${i+1}/unitFrame`,position:[i*25,85+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:`grove/grove-${i+1}/cable`,slack:12,bend:[0,0,-1]});assert.equal(units[id].get('cable').getState().wireCount,4);
  }
  assert.equal(hash(host.display().buffer),hostFrame,'all external shape commands preserve host framebuffer');hub.port('grove-2').detach();assert.equal(hub.port('grove-2').module,null);assert.ok(hub.port('grove-1').module===units['tube-pressure']&&hub.port('grove-3').module===units['lora-e220-920'],'MQ detaches independently from pressure and radio branches');
  return {status:'pass',artwork,cases:['three-real-four-wire-Grove-branches','single-real-pressure-nozzle-and-passive-anchor','MQ5-cartridge-detach-retains-fixed-socket-and-adapter','two-real-latching-DIP-input-and-external-detents','supplied-SMA-antenna-detach-and-real-hinge','non-Grove-mating-type-rejection','configured-artwork-toggle-keeps-physical-buffers-and-world-matrices','external-pose-and-selective-detach'],scope:'New Unit construction and external shape/attachment APIs only; Node canvas stub, no browser, pressure, gas, heater, RF, firmware, hardware or whole-catalog acceptance'};
 }finally{wrong?.dispose();host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}

async function checkMq({host,unit,events}){
 const port=unit.port('mq5'),cartridge=port.module;assert.ok(cartridge,'MQ5 actual round-pin sensor is installed by default');assert.ok(cartridge.meta.id.startsWith('m5stack.unit.mq.'),'sensor accessory reports its own product identity');const before=events.length,ports=portFrames(unit),full=physical(unit);
 const saved=port.detach({dispose:false});assert.ok(saved===cartridge);assert.equal(port.module,null);assert.equal(portFrames(unit),ports,'actual socket and internal adapter remain fixed');assert.equal(unit.get('cable').getState().wireCount,4);port.attach(saved);assert.ok(port.module===cartridge);assert.equal(physical(unit),full,'sensor returns to identical installed geometry and world frame');assert.equal(events.length,before,'sensor replacement does not fabricate gas or heating events');
}

async function checkLora({host,unit,events}){
 const port=unit.port('sma'),antenna=port.module;assert.ok(antenna,'documented supplied antenna can be fitted');assert.ok(antenna.meta.id.startsWith('m5stack.unit.lora-e220-920.'),'antenna reports its own product identity');assert.equal(antenna.meta.physicalConnector,'sma-male');assert.ok(port.accepts(antenna),'Module connector names the compatible host port while physicalConnector names the actual male part');
 const ports=portFrames(unit),before=events.length;const tilt=antenna.get('tilt'),rest=physical(unit);assert.deepEqual(tilt.getState().rangeDeg,[0,90]);tilt.set({angleDeg:45,durationMs:120});for(let i=0;i<12;i++)host.update(1/60);assert.equal(tilt.getState().angleDeg,45);assert.notEqual(physical(unit),rest);assert.equal(portFrames(unit),ports,'hinge leaves SMA and Grove fixed');assert.throws(()=>tilt.set({angleDeg:91}));assert.throws(()=>tilt.set({rpm:1}));tilt.set({angleDeg:90});tilt.set({angleDeg:0});assert.equal(physical(unit),rest,'folded antenna returns to exact original pose');assert.equal(events.length,before,'externally driven antenna does not transmit or echo input');
 assert.equal(unit.list('button').length,2);assert.equal([...unit.components.values()].filter(c=>c.kind==='joint').length,0,'hinge belongs to the antenna, not the radio body');
 for(const id of ['mode-0','mode-1']){
  const control=unit.button(id),other=unit.button(id==='mode-0'?'mode-1':'mode-0');control.setPosition(0,{immediate:true});const otherPose=capPose(host,other),start=events.length;
  host.handle({type:'button',target:'grove/grove-3/'+id,action:'position',position:1,immediate:true});assert.equal(control.getState().position,1);assert.equal(events.length,start,'external detent does not echo input');assert.equal(capPose(host,other),otherPose);assert.equal(portFrames(unit),ports);
  control.setPosition(0,{immediate:true});control.press('fixture');host.update(.25);assert.equal(control.getState().position,1);control.release('fixture');host.update(.25);assert.equal(control.getState().pressed,false);assert.equal(control.getState().position,1,'released stable switch stays in its actual detent');assert.deepEqual(events.slice(start).map(e=>e.action),['down','up','click']);
  const cancelAt=events.length;control.press('cancel-fixture');host.update(.25);control.cancel('cancel-fixture');host.update(.25);assert.equal(control.getState().position,0);assert.equal(control.getActuationState().depthMm,0);assert.deepEqual(events.slice(cancelAt).map(e=>e.action),['down','up']);assert.equal(events.at(-1).cancelled,true);assert.throws(()=>control.setPosition(2));
 }
 const full=physical(unit),saved=port.detach({dispose:false});assert.ok(saved===antenna);assert.equal(portFrames(unit),ports);assert.equal(unit.get('cable').getState().wireCount,4);port.attach(saved);assert.equal(physical(unit),full,'antenna roundtrip retains fixed radio and accessory pose');
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkRadioGasPressureUnits(),null,2));
