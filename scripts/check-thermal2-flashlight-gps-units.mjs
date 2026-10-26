import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import fs from 'node:fs/promises';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const ids=['thermal2','flashlight','gps-sma'];
const digest=value=>createHash('sha256').update(value).digest('hex');
const hash=array=>digest(Buffer.from(array.buffer,array.byteOffset,array.byteLength));
const stamp=value=>digest(JSON.stringify(value));
function updateWorld(object){let root=object;while(root.parent)root=root.parent;root.updateMatrixWorld(true);}
function printed(model){const out=[];model.root.traverse(o=>{if(o.userData.role==='printed-artwork')out.push(o);});return out;}
function physical(model,ownOnly=false){
 updateWorld(model.root);const out=[],modules=new Set([...model.components.values()].filter(c=>c.kind==='port'&&c.module).map(c=>c.module.root));
 model.root.traverse(o=>{if(!o.isMesh||o.userData.role==='printed-artwork')return;if(ownOnly)for(let p=o;p&&p!==model.root;p=p.parent)if(modules.has(p))return;out.push({name:o.name,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,v])=>[k,hash(v.array)])),index:o.geometry.index?hash(o.geometry.index.array):null,matrix:o.matrixWorld.toArray()});});return stamp(out);
}
function portFrames(unit){updateWorld(unit.root);return stamp([...unit.components.values()].filter(c=>c.kind==='port').map(p=>({id:p.id,matrix:p.object3d.matrixWorld.toArray()})));}
function own(unit,kind){return [...unit.components.values()].filter(c=>c.kind===kind);}
function tick(host){for(let n=0;n<30;n++)host.update(1/60);}
function buttonsRoundtrip(host,unit,events){
 for(const button of own(unit,'button')){
  assert.equal(button.latching,false);const rest=physical(unit),ports=portFrames(unit),lamps=stamp(own(unit,'led').map(l=>l.getState()));let start=events.length;
  button.press('branch-check');tick(host);assert.ok(button.getActuationState().depthMm>0);assert.notEqual(physical(unit),rest,'actual cap shape moves');
  button.release('branch-check');tick(host);assert.equal(button.getActuationState().depthMm,0);assert.equal(physical(unit),rest,'cap returns exactly');assert.deepEqual(events.slice(start).map(e=>e.action),['down','up','click']);
  assert.ok(events.slice(start).every(e=>e.id.startsWith('grove/grove-')),'input retains recursive branch identity');
  start=events.length;button.press('cancel-check');tick(host);button.cancel('cancel-check');tick(host);assert.deepEqual(events.slice(start).map(e=>e.action),['down','up']);assert.equal(events.at(-1).cancelled,true);assert.equal(physical(unit),rest);assert.equal(portFrames(unit),ports);assert.equal(stamp(own(unit,'led').map(l=>l.getState())),lamps,'pressing/cancelling does not implement alarm or relay logic');
 }
}
function independentLamps(host,unit,events){
 const lamps=own(unit,'led'),start=events.length;
 for(const lamp of lamps){
  const others=lamps.filter(l=>l!==lamp),before=stamp(others.map(l=>l.getState())),initial=lamp.getState();
  host.handle({type:'led',target:lamp.path,color:'#3468ca',brightness:.55});assert.equal(lamp.getState().brightness,.55);assert.equal(stamp(others.map(l=>l.getState())),before);
  if(lamp.id!=='rgb')assert.equal(lamp.getState().color,initial.color,'fixed-color indicator rejects RGB recoloring');
  host.handle({type:'led',target:lamp.path,on:false});assert.equal(lamp.getState().brightness,0);
 }
 assert.equal(events.length,start,'external lamps emit no control input');
}

function stableSelectors(host,unit,events){
 for(const button of own(unit,'button')){
  assert.equal(button.latching,true);assert.equal(button.interactive,true,'uncovered selector uses its actual pointer surface');button.setPosition(0,{immediate:true});const fixed=portFrames(unit),start=events.length;
  button.setPosition(1,{immediate:true});assert.equal(events.length,start);assert.equal(button.getState().position,1);button.setPosition(0,{immediate:true});
  button.press('branch-check');tick(host);button.release('branch-check');tick(host);assert.equal(button.getState().position,1);assert.deepEqual(events.slice(start).map(e=>e.action),['down','up','click']);
  const cancelAt=events.length;button.press('cancel-check');tick(host);const detent=button.getState().position;button.cancel('cancel-check');tick(host);assert.equal(button.getState().position,detent);assert.equal(button.getState().pressed,false);assert.deepEqual(events.slice(cancelAt).map(e=>e.action),['down','up']);assert.equal(events.at(-1).cancelled,true);button.setPosition(0,{immediate:true});assert.equal(portFrames(unit),fixed);
 }
}
async function antennaRoundtrip(host,unit,events){
 const port=unit.port('sma'),antenna=port.module;assert.ok(antenna);assert.equal(antenna.list('joint').length,0,'wired GPS antenna has no invented hinge');const shape=antenna.get('shape'),points=shape.getState().points,body=physical(unit,true),fixed=portFrames(unit),rest=physical(antenna),start=events.length;assert.equal(shape.getState().nominalCableLengthMm,1000);assert.equal(shape.getState().space,'module-port');assert.deepEqual(shape.getState().puckMm,[38,36,13]);
 const next=points.map(point=>[...point]);next.at(-1)[0]+=25;host.handle({type:'shape',target:'grove/grove-3/sma/shape',points:next});assert.deepEqual(shape.getState().points,next);assert.notEqual(physical(antenna),rest,'coax and terminal puck follow external curve');assert.equal(physical(unit,true),body);assert.equal(portFrames(unit),fixed);assert.equal(events.length,start);
 const current=physical(antenna),state=shape.getState();for(const invalid of [[],points.map((point,i)=>i===0?[1,0,0]:[...point]),points.map((point,i)=>i===1?[NaN,...point.slice(1)]:[...point])])assert.throws(()=>shape.handle({type:'shape',points:invalid}));assert.equal(physical(antenna),current);assert.deepEqual(shape.getState(),state,'invalid path retains geometry and state');
 const saved=port.detach({dispose:false});assert.ok(saved===antenna);assert.equal(physical(unit,true),body);port.attach(saved);assert.equal(physical(antenna),current);host.handle({type:'shape',target:'grove/grove-3/sma/shape',points});assert.equal(physical(antenna),rest,'antenna returns exactly to the original coax and puck pose');
}

/** Real Unit assemblies and physical APIs; only the Node canvas is substituted. */
export async function checkThermal2FlashlightGpsUnits(){
 const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});
 const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};let host,wrong;
 try{
  host=await loadModel('sticks3');host.display().fill('#123456');const framebuffer=hash(host.display().buffer),hub=await loadGroveModule('hub');host.port('grove').attach(hub);const units={},artwork=[],events=[];
  host.on('input',event=>{if(event.kind!=='port')events.push(event);});
  for(const [i,id] of ids.entries()){
   const unit=await loadGroveModule(id,{covers:false,antenna:true,cableLength:65+i*15});units[id]=unit;hub.port(`grove-${i+1}`).attach(unit);assert.ok(host.get(`grove/grove-${i+1}`).module===unit);assert.equal(unit.get('cable').getState().wireCount,4);if(id!=='flashlight'){assert.equal(unit.get('sensor').meta.role,'visual-anchor');assert.deepEqual(unit.get('sensor').getState(),{});}else assert.equal(unit.components.has('sensor'),false,'FlashLight is an output assembly with actual mode/light components');
   const menu=catalog.products.find(p=>p.id===id)?.configurations??[];
   if(id==='flashlight'){assert.ok(menu.some(c=>c.options.covers===false));assert.ok(menu.some(c=>c.options.covers!==false));}
   if(id==='gps-sma'){assert.ok(menu.some(c=>c.options.antenna===true));assert.ok(menu.some(c=>c.options.antenna!==true));}
   for(const configuration of [{},...menu.map(c=>c.options)]){
    const on=await loadModel(id,configuration),off=await loadModel(id,{...configuration,artwork:false});
    try{const panels=printed(on);assert.ok(panels.length>0);assert.equal(printed(off).length,0);assert.equal(physical(on),physical(off),'artwork preserves physical attributes, indices and world matrices in all configurations');for(const panel of panels){assert.ok(panel.parent&&panel.geometry.attributes.position.count>0);assert.equal(panel.material.alphaTest,.04);assert.equal(panel.userData.artworkKind,'reference-redraw');}if(!artwork.some(r=>r.id===id))artwork.push({id,panels:panels.length,kinds:[...new Set(panels.map(p=>p.userData.artworkKind))]});}finally{on.dispose();off.dispose();}
   }
   assert.throws(()=>host.handle({type:['temperature','flash','gnss'][i],target:`grove/grove-${i+1}/${id==='flashlight'?'light':'sensor'}`,value:1}),'actual visual components reject internal function commands');
   independentLamps(host,unit,events);
  }
  const thermal=units.thermal2,flash=units.flashlight,gps=units['gps-sma'];
  assert.deepEqual(own(thermal,'button').map(c=>c.id).sort(),['button','reset']);assert.deepEqual(own(thermal,'led').map(c=>c.id),['rgb']);assert.equal(own(thermal,'joint').length,0);assert.equal(thermal.list('display').length,0);buttonsRoundtrip(host,thermal,events);
  assert.ok(own(flash,'button').length>0);assert.equal(own(flash,'led').length,1);assert.equal(own(flash,'joint').length,0);const lamps=stamp(own(flash,'led').map(l=>l.getState()));stableSelectors(host,flash,events);assert.equal(stamp(own(flash,'led').map(l=>l.getState())),lamps,'mode detents do not implement automatic flashing or illumination modes');
  const closed=await loadModel('flashlight');try{for(const button of own(closed,'button')){assert.equal(button.interactive,false,'covered selector rejects through-shell pointer input');button.setPosition(1,{immediate:true});assert.equal(button.getState().position,1);}}finally{closed.dispose();}
  assert.equal(own(gps,'button').length,0);assert.equal(own(gps,'joint').length,0);assert.equal(own(gps,'led').length,0,'concealed 1PPS has no invented external light');await antennaRoundtrip(host,gps,events);
  wrong=await loadGroveModule('key');const sma=gps.port('sma'),saved=sma.module;assert.notEqual(sma.connector,'grove');assert.throws(()=>sma.attach(wrong));assert.ok(sma.module===saved);wrong.dispose();wrong=null;
  for(const [i,id] of ids.entries()){host.handle({type:'pose',target:`grove/grove-${i+1}/unitFrame`,position:[i*45,160+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:`grove/grove-${i+1}/cable`,slack:12,bend:[0,0,-1]});assert.equal(units[id].get('cable').getState().wireCount,4);}
  assert.equal(hash(host.display().buffer),framebuffer);hub.port('grove-2').detach();assert.equal(hub.port('grove-2').module,null);assert.ok(hub.port('grove-1').module===thermal&&hub.port('grove-3').module===gps);
  return{status:'pass',artwork,cases:['three-real-four-wire-Grove-branches','two-native-Thermal2-tongues-press-release-cancel-and-exact-return','independent-RGB-and-fixed-white-emitter','real-covered-and-uncovered-stable-mode-selector','detachable-SMA-active-coax-antenna-external-shape-and-puck-roundtrip','invalid-coax-path-retains-state-and-geometry','no-invented-GPS-hinge-or-Thermal2-display','passive-numeric-and-SMA-mating-boundaries','configured-artwork-preserves-physical-attributes-indices-and-world-matrices','external-cable-pose-and-selective-detach'],scope:'Only new actual assemblies/external shape and input APIs; Node canvas stub, no browser, imaging, temperature, sound, reset, flash-mode, electrical, GNSS, RF, navigation, cable physics, hardware or whole-catalog acceptance'};
 }finally{wrong?.dispose();host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkThermal2FlashlightGpsUnits(),null,2));

