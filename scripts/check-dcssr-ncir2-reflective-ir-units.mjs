import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import fs from 'node:fs/promises';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const ids=['dcssr','ncir2','reflective-ir'];
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
function jointRoundtrip(host,joint,events){
 const start=events.length;updateWorld(joint.object3d);const quaternion=joint.object3d.quaternion.clone();
 joint.set({angleDeg:35});assert.ok(!joint.object3d.quaternion.equals(quaternion));
 joint.set({angleDeg:70,durationMs:120});tick(host);assert.equal(joint.getState().angleDeg,70);
 assert.throws(()=>joint.set({rpm:1}),'actual screw/trimmer heads do not continuously spin');
 joint.set({angleDeg:0});assert.ok(joint.object3d.quaternion.equals(quaternion),'external head returns exactly to its datum');assert.equal(events.length,start,'external joint commands emit no input intent');
}
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

/** Real products and recursive four-wire connections; only the Node canvas is substituted. */
export async function checkDcssrNcir2ReflectiveIrUnits(){
 const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});
 const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};let host,wrong;
 try{
  host=await loadModel('sticks3');host.display().fill('#123456');const hostFrame=hash(host.display().buffer),hub=await loadGroveModule('hub');host.port('grove').attach(hub);const units={},artwork=[],events=[];
  host.on('input',event=>{if(event.kind!=='port')events.push(event);});
  for(const [i,id] of ids.entries()){
   const unit=await loadGroveModule(id,{terminalPlug:true,cableLength:65+i*15});units[id]=unit;hub.port(`grove-${i+1}`).attach(unit);assert.ok(host.get(`grove/grove-${i+1}`).module===unit);assert.equal(unit.get('cable').getState().wireCount,4);assert.equal(unit.get('sensor').meta.role,'visual-anchor');assert.deepEqual(unit.get('sensor').getState(),{});
   const menu=catalog.products.find(p=>p.id===id)?.configurations??[];
   if(id==='dcssr'){assert.ok(menu.some(c=>c.options.terminalPlug===true),'menu exposes supplied plugs');assert.ok(menu.some(c=>c.options.terminalPlug!==true),'menu exposes actual bare sockets');}
   for(const configuration of [{},...menu.map(c=>c.options)]){
    const on=await loadModel(id,configuration),off=await loadModel(id,{...configuration,artwork:false});
    try{const panels=printed(on);assert.ok(panels.length>0);assert.equal(printed(off).length,0);assert.equal(physical(on),physical(off),'printing preserves physical attributes, indices and world matrices in every configuration');for(const panel of panels){assert.ok(panel.parent&&panel.geometry.attributes.position.count>0);assert.equal(panel.material.alphaTest,.04);assert.equal(panel.userData.artworkKind,'reference-redraw');}if(!artwork.some(r=>r.id===id))artwork.push({id,panels:panels.length,kinds:[...new Set(panels.map(p=>p.userData.artworkKind))]});}finally{on.dispose();off.dispose();}
   }
   assert.throws(()=>host.handle({type:['relay','temperature','distance'][i],target:`grove/grove-${i+1}/sensor`,value:1}),'passive anchors reject electrical/sensor/firmware operations');
   independentLamps(host,unit,events);buttonsRoundtrip(host,unit,events);
  }
  const ssr=units.dcssr,ncir=units.ncir2,ir=units['reflective-ir'];
  assert.deepEqual(own(ssr,'button').map(c=>c.id),['button']);assert.equal(own(ssr,'led').length,3);assert.equal(own(ssr,'joint').length,4);assert.deepEqual(own(ncir,'button').map(c=>c.id).sort(),['button','reset']);assert.equal(own(ncir,'joint').length,0);assert.deepEqual(own(ncir,'led').map(c=>c.id),['rgb']);assert.deepEqual(own(ir,'led').map(c=>c.id),['status-led']);assert.equal(own(ir,'button').length,0);assert.deepEqual(own(ir,'joint').map(c=>c.id),['threshold']);
  const fixed=portFrames(ssr);for(const joint of own(ssr,'joint'))jointRoundtrip(host,joint,events);assert.equal(portFrames(ssr),fixed);
  for(const id of ['terminal-1','terminal-2']){
   const port=ssr.port(id),plug=port.module;assert.ok(plug);assert.equal(port.connector,'ht3.96-4p');assert.equal(plug.list('joint').length,4);const body=physical(ssr,true),neighbour=physical(ssr.port(id==='terminal-1'?'terminal-2':'terminal-1').module);
   for(const joint of plug.list('joint'))jointRoundtrip(host,joint,events);const complete=physical(ssr),saved=port.detach({dispose:false});assert.ok(saved===plug);assert.equal(physical(ssr,true),body);assert.equal(physical(ssr.port(id==='terminal-1'?'terminal-2':'terminal-1').module),neighbour);port.attach(saved);assert.equal(physical(ssr),complete,'plugs independently return to exact installed frames');
  }
  const irFrame=portFrames(ir);jointRoundtrip(host,own(ir,'joint')[0],events);assert.equal(portFrames(ir),irFrame);
  assert.throws(()=>ir.get('threshold').set({angleDeg:136}));assert.throws(()=>ir.get('threshold').set({angleDeg:-136}));ir.get('status-led').set({on:true});assert.equal(ir.get('status-led').glow.visible,false,'concealed D1 has no invented through-shell halo');ir.get('status-led').set({on:false});for(const id of ['emitter','receiver']){assert.equal(ir.get(id).meta.role,'visual-anchor');assert.deepEqual(ir.get(id).getState(),{});}
  wrong=await loadGroveModule('key');for(const id of ['terminal-1','terminal-2']){const port=ssr.port(id),saved=port.module;assert.throws(()=>port.attach(wrong));assert.ok(port.module===saved,'Grove rejection preserves physical plug');}wrong.dispose();wrong=null;
  for(const [i,id] of ids.entries()){host.handle({type:'pose',target:`grove/grove-${i+1}/unitFrame`,position:[i*45,160+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:`grove/grove-${i+1}/cable`,slack:12,bend:[0,0,-1]});assert.equal(units[id].get('cable').getState().wireCount,4);}
  assert.equal(hash(host.display().buffer),hostFrame);hub.port('grove-2').detach();assert.equal(hub.port('grove-2').module,null);assert.ok(hub.port('grove-1').module===ssr&&hub.port('grove-3').module===ir);
  return {status:'pass',artwork,cases:['three-real-four-wire-Grove-branches','actual-button-press-release-cancel-and-exact-return','independent-RGB-and-fixed-red-indicators','four-DCSSR-terminal-heads-and-two-four-screw-plugs','independent-plug-detach-and-reassembly','finite-reflective-IR-trimmer-angle-no-RPM','passive-sensor-anchors-reject-numeric-behavior','configured-artwork-preserves-physical-attributes-indices-and-world-matrices','external-cable-pose-and-selective-branch-detach'],scope:'New actual assemblies and external shape/input interfaces only; Node canvas stub, no browser, relay, electrical, temperature, sound, reset, distance, firmware, hardware or whole-catalog acceptance'};
 }finally{wrong?.dispose();host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkDcssrNcir2ReflectiveIrUnits(),null,2));
