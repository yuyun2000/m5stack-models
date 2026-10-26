import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import fs from 'node:fs/promises';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const ids=['watering','hbridge-v11','dlight'];
const hash=a=>createHash('sha256').update(Buffer.from(a.buffer,a.byteOffset,a.byteLength)).digest('hex');
const stamp=a=>createHash('sha256').update(JSON.stringify(a)).digest('hex');
function printed(model){const out=[];model.root.traverse(o=>{if(o.userData.role==='printed-artwork')out.push(o);});return out;}
function updateWorld(object){let root=object;while(root.parent)root=root.parent;root.updateMatrixWorld(true);}
function physical(model,ownOnly=false){
 const out=[],modules=new Set([...model.components.values()].filter(c=>c.kind==='port'&&c.module).map(c=>c.module.root));updateWorld(model.root);
 model.root.traverse(o=>{if(!o.isMesh||o.userData.role==='printed-artwork')return;if(ownOnly)for(let p=o;p&&p!==model.root;p=p.parent)if(modules.has(p))return;out.push({name:o.name,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,v])=>[k,hash(v.array)])),index:o.geometry.index?hash(o.geometry.index.array):null,matrix:o.matrixWorld.toArray()});});return stamp(out);
}
function portFrames(unit){updateWorld(unit.root);return stamp([...unit.components.values()].filter(c=>c.kind==='port').map(p=>({id:p.id,matrix:p.object3d.matrixWorld.toArray()})));}
function capPose(host,button){updateWorld(host.root);return stamp(button.cap.matrixWorld.toArray());}

/** Actual products and external physical APIs; only canvas drawing is substituted. */
export async function checkWateringLightHbridgeUnits(){
 const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});
 const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};let host,wrong;
 try{
  host=await loadModel('sticks3');host.display().fill('#123456');const hostFrame=hash(host.display().buffer),hub=await loadGroveModule('hub');host.port('grove').attach(hub);const units={},artwork=[],events=[];host.on('input',e=>{if(e.kind!=='port')events.push(e);});
  for(const [i,id] of ids.entries()){
   const options=id==='watering'?{hoses:true}:id==='hbridge-v11'?{covers:false,terminalPlug:true,capacitor:true}:{};
   const unit=await loadGroveModule(id,{...options,cableLength:65+i*15});units[id]=unit;hub.port(`grove-${i+1}`).attach(unit);assert.ok(host.get(`grove/grove-${i+1}`).module===unit);assert.equal(unit.get('cable').getState().wireCount,4);assert.equal(unit.get('sensor').meta.role,'visual-anchor');assert.deepEqual(unit.get('sensor').getState(),{});assert.equal(unit.list('led').length,0,'no invented external lamp');
   const menu=catalog.products.find(p=>p.id===id)?.configurations??[];
   if(id==='watering'){assert.equal(menu[0]?.options.hoses,true,'Viewer opens supplied hose configuration');assert.ok(menu.some(c=>c.options.hoses===false));}
   if(id==='hbridge-v11'){assert.ok(menu.some(c=>c.options.covers===false),'Viewer offers actual uncovered inspection');assert.ok(menu.some(c=>c.options.terminalPlug&&c.options.capacitor),'Viewer offers real capacitor installation');assert.ok(menu.some(c=>c.options.terminalPlug!==true&&c.options.capacitor!==true),'Viewer offers the default bare socket');}
   const configs=[{},...menu.map(c=>c.options)];
   for(const configuration of configs){
    const on=await loadModel(id,configuration),off=await loadModel(id,{...configuration,artwork:false});
    try{const panels=printed(on);assert.ok(panels.length>0);assert.equal(printed(off).length,0);assert.equal(physical(on),physical(off),'printing changes no physical buffers, indices or world assembly in any configuration');for(const p of panels){assert.ok(p.parent&&p.geometry.attributes.position.count>0);assert.equal(p.material.alphaTest,.04);assert.ok(['reference-redraw','source-vector-raster','official-vector-raster','official-raster'].includes(p.userData.artworkKind));}if(!artwork.some(r=>r.id===id))artwork.push({id,panels:panels.length,kinds:[...new Set(panels.map(p=>p.userData.artworkKind))]});}finally{on.dispose();off.dispose();}
   }
   assert.throws(()=>host.handle({type:['pump','motor','lux'][i],target:`grove/grove-${i+1}/sensor`,value:1}),'passive anchors do not own moisture, motor or illuminance behavior');
  }
  for(const id of ['watering','dlight']){assert.equal(units[id].list('button').length,0);assert.equal(units[id].list('joint').length,0);}
  await checkHoses({host,unit:units.watering,events});await checkHbridge({host,unit:units['hbridge-v11'],events});
  wrong=await loadGroveModule('key');
  for(const p of [units.watering.port('inlet'),units.watering.port('outlet'),units['hbridge-v11'].port('terminal')]){const saved=p.module;assert.notEqual(p.connector,'grove');assert.throws(()=>p.attach(wrong));assert.ok(p.module===saved,'type rejection preserves actual accessory');}
  assert.equal(units.watering.port('inlet').connector,'silicone-tube-4mm');assert.equal(units.watering.port('outlet').connector,'silicone-tube-4mm');assert.equal(units['hbridge-v11'].port('terminal').connector,'ht3.96-4p');wrong.dispose();wrong=null;
  for(const [i,id] of ids.entries()){host.handle({type:'pose',target:`grove/grove-${i+1}/unitFrame`,position:[i*45,160+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:`grove/grove-${i+1}/cable`,slack:12,bend:[0,0,-1]});assert.equal(units[id].get('cable').getState().wireCount,4);}
  assert.equal(hash(host.display().buffer),hostFrame,'external shape commands preserve host framebuffer');hub.port('grove-2').detach();assert.equal(hub.port('grove-2').module,null);assert.ok(hub.port('grove-1').module===units.watering&&hub.port('grove-3').module===units.dlight,'HBridge detaches independently');
  return {status:'pass',artwork,cases:['three-real-four-wire-Grove-branches','two-open-wall-hoses-independent-external-shape-and-roundtrip','five-real-covered-and-uncovered-stable-actuators','four-real-terminal-screw-heads-and-installed-capacitor','no-invented-pump-rotation-light-or-electrical-state','non-Grove-mating-type-rejection','configured-artwork-toggle-preserves-physical-buffers-and-world-matrices','external-pose-and-selective-detach'],scope:'New Unit construction and external shape/attachment APIs only; Node canvas stub, no browser, water, moisture, pumping, PWM, motor, lux, firmware, hardware or whole-catalog acceptance'};
 }finally{wrong?.dispose();host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}

async function checkHoses({host,unit,events}){
 const inlet=unit.port('inlet'),outlet=unit.port('outlet'),hose=inlet.module,other=outlet.module;assert.ok(hose&&other&&hose!==other,'supplied hoses are separate physical accessories');assert.ok(hose.meta.id.startsWith('m5stack.unit.watering.'));const shape=hose.get('shape'),points=shape.getState().points;assert.ok(Array.isArray(points)&&points.length>=3);const fixed=physical(unit,true),ports=portFrames(unit),sibling=physical(other),before=events.length,old=physical(hose);
 const next=[[0,0,0],[0,18,0],[15,42,8],[26,75,12]];host.handle({type:'shape',target:'grove/grove-1/inlet/shape',points:next});assert.deepEqual(shape.getState().points,next);assert.notEqual(physical(hose),old,'actual hose geometry follows external centreline');assert.equal(physical(other),sibling,'inlet curve leaves outlet hose alone');assert.equal(physical(unit,true),fixed,'pump and soil probe remain fixed');assert.equal(portFrames(unit),ports);assert.equal(events.length,before,'external hose shape creates no fluid/pump input');
 const after=physical(hose),state=shape.getState();for(const invalid of [[],[[1,0,0],[0,18,0],[15,42,8]],[[0,0,0],[NaN,18,0],[15,42,8]]])assert.throws(()=>shape.handle({type:'shape',points:invalid}));assert.equal(physical(hose),after);assert.deepEqual(shape.getState(),state,'invalid curves keep previous external geometry/state');
 const saved=inlet.detach({dispose:false});assert.ok(saved===hose);assert.equal(physical(unit,true),fixed);assert.equal(physical(other),sibling);inlet.attach(saved);assert.equal(physical(hose),after);host.handle({type:'shape',target:'grove/grove-1/inlet/shape',points});assert.equal(physical(hose),old,'hose returns exactly to original geometry');
}

async function checkHbridge({host,unit,events}){
 const port=unit.port('terminal'),plug=port.module;assert.ok(plug);assert.ok(plug.meta.id.startsWith('m5stack.unit.hbridge-v11.'));assert.equal(plug.list('joint').length,4);assert.equal(unit.list('button').length,5);assert.equal([...unit.components.values()].filter(c=>c.kind==='joint').length,0);const fixed=portFrames(unit),before=events.length;
 for(let i=1;i<=4;i++){const screw=plug.get('screw-'+i),rest=screw.object3d.quaternion.clone();screw.set({angleDeg:35});assert.ok(!screw.object3d.quaternion.equals(rest));screw.set({angleDeg:70,durationMs:120});for(let n=0;n<12;n++)host.update(1/60);assert.equal(screw.getState().angleDeg,70);assert.throws(()=>screw.set({rpm:1}));screw.set({angleDeg:0});assert.ok(screw.object3d.quaternion.equals(rest));}assert.equal(events.length,before);assert.equal(portFrames(unit),fixed);
 const controls=['source','address-1','address-2','address-3','address-4'];for(const id of controls){const c=unit.button(id);assert.equal(c.interactive,true,'uncovered actual cap accepts pointer input');c.setPosition(0,{immediate:true});const neighbour=unit.button(id==='source'?'address-1':'source'),neighbourPose=capPose(host,neighbour),start=events.length;host.handle({type:'button',target:'grove/grove-2/'+id,action:'position',position:1,immediate:true});assert.equal(events.length,start);assert.equal(capPose(host,neighbour),neighbourPose);c.setPosition(0,{immediate:true});c.press('fixture');host.update(.25);c.release('fixture');host.update(.25);assert.equal(c.getState().position,1);assert.equal(c.getState().pressed,false);assert.deepEqual(events.slice(start).map(e=>e.action),['down','up','click']);const cancelAt=events.length;c.press('cancel-fixture');host.update(.25);c.cancel('cancel-fixture');host.update(.25);assert.equal(c.getState().position,0);assert.equal(c.getActuationState().depthMm,0);assert.deepEqual(events.slice(cancelAt).map(e=>e.action),['down','up']);assert.equal(events.at(-1).cancelled,true);assert.equal(portFrames(unit),fixed);}
 const closed=await loadModel('hbridge-v11',{terminalPlug:true,capacitor:true});try{for(const id of controls){const c=closed.button(id);assert.equal(c.interactive,false,'covered controls do not accept through-shell pointer input');c.setPosition(1,{immediate:true});assert.equal(c.getState().position,1,'external physical detent remains available under real covers');}}finally{closed.dispose();}
 const complete=physical(unit),saved=port.detach({dispose:false});assert.ok(saved===plug);assert.equal(portFrames(unit),fixed);assert.equal(unit.get('cable').getState().wireCount,4);port.attach(saved);assert.equal(physical(unit),complete,'terminal/capacitor assembly returns exactly to its installed frame');
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkWateringLightHbridgeUnits(),null,2));
