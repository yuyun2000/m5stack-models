import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {Module} from '../src/core/index.js';

// This base is intended to live under public scripts/. Root adds batch loading,
// transformed sibling branches, all-preset artwork checks and the CatM branch.
export const digest=value=>createHash('sha256').update(value).digest('hex');
export const hash=array=>digest(Buffer.from(array.buffer,array.byteOffset,array.byteLength));
export const stamp=value=>digest(JSON.stringify(value));
export const own=(unit,kind)=>[...unit.components.values()].filter(c=>c.kind===kind);
export const target=(prefix,id)=>prefix?`${prefix}/${id}`:id;
export const rootOf=value=>value.root??value;
export function world(object){let top=rootOf(object);while(top.parent)top=top.parent;top.updateWorldMatrix(true,true);}
export function under(object,parent){for(let p=object;p;p=p.parent)if(p===parent)return true;return false;}
export function attrs(object){
 return Object.fromEntries(Object.entries(object.geometry.attributes).sort(([a],[b])=>a.localeCompare(b)).map(([name,a])=>{
  const array=a.array??a.data.array;return[name,{hash:hash(array),type:array.constructor.name,itemSize:a.itemSize,count:a.count,normalized:a.normalized,offset:a.offset??0,stride:a.data?.stride??a.itemSize}];
 }));
}
export function records(unit,excluded=[]){
 const root=rootOf(unit);world(root);const out=[];
 root.traverse(o=>{if(!o.isMesh||o.userData.role==='printed-artwork'||excluded.some(p=>p&&under(o,p)))return;
  const index=o.geometry.index,array=index?.array;
  out.push({name:o.name,attributes:attrs(o),index:array?{hash:hash(array),type:array.constructor.name,itemSize:index.itemSize,count:index.count,normalized:index.normalized}:null,matrix:o.matrixWorld.toArray()});
 });return out;
}
export const physical=(unit,excluded=[])=>stamp(records(unit,excluded));
export function frames(unit){unit.root;world(unit.root);return stamp(own(unit,'port').map(c=>({id:c.id,matrix:c.object3d.matrixWorld.toArray()})));}
export function panels(unit){const out=[];unit.root.traverse(o=>{if(o.userData.role==='printed-artwork')out.push(o);});return out;}
export function tick(host,count=30){for(let i=0;i<count;i++)host.update(1/60);}
export function roundtrip(unit,port){
 const item=port.module;assert.ok(item,'expected an actual installed accessory');const rest=physical(unit),ports=frames(unit);
 assert.ok(port.detach({dispose:false})===item);assert.equal(frames(unit),ports);assert.ok(port.module===null);assert.ok(item.attachedTo===null);
 port.attach(item);assert.ok(port.module===item);assert.equal(frames(unit),ports);assert.equal(physical(unit),rest);return item;
}

/** Install only for Node fixture runs; caller must restore in finally. */
export function installCanvasStub(){
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});
 const context=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>context})};
 return()=>{if(previous===undefined)delete globalThis.document;else globalThis.document=previous;};
}
export function assertMultisetEqual(expected,actual,message='retained physical material is unchanged'){
 assert.equal(actual.length,expected.length,message);const counts=new Map();
 for(const record of expected){const key=stamp(record);counts.set(key,(counts.get(key)??0)+1);}
 for(const record of actual){const key=stamp(record),count=counts.get(key)??0;assert.ok(count>0,message);counts.set(key,count-1);}
 assert.ok([...counts.values()].every(n=>n===0),message);
}

/** Both callers must use matching attachment/actuator/root poses. No model edits. */
export function checkService(id,closed,open){
 closed.root;open.root;let removed;
 if(id==='hbridge'){
  const a=closed.hbridgeAssembly,b=open.hbridgeAssembly;
  removed=[a.parts['HBridge exact own native front casing half'],a.labels.front,a.screw.head,a.screw.blind,a.screw.shank];
  assert.equal(b.screw,null);assert.equal(b.labels.front,undefined);assert.equal(Object.keys(b.parts).length,1);
  assert.ok(b.parts['HBridge exact own native rear casing half']);
  assert.equal(panels(closed).length,closed.options.artwork===false?0:2);assert.equal(panels(open).length,open.options.artwork===false?0:1);
 }else if(id==='ultrasonic-io'){
  const a=closed.ultrasonicIOAssembly,b=open.ultrasonicIOAssembly;
  removed=[a.parts['Ultrasonic-IO complete native rear housing'],a.film,a.screw.head,a.screw.floor,a.screw.shank];
  assert.equal(b.screw,null);assert.equal(b.film,null);assert.equal(Object.keys(b.parts).length,1);
  assert.ok(b.parts['Ultrasonic-IO complete native front housing']);
  assert.equal(panels(closed).length,closed.options.artwork===false?0:1);assert.equal(panels(open).length,0);
 }else throw new Error(`No service removal definition for ${id};root adds other batch products explicitly`);
 assert.equal(removed.length,5);assert.ok(removed.every(o=>o?.isMesh),'five exact real meshes,not guessed subtree removals');assert.equal(new Set(removed).size,5);
 const complete=records(closed),retained=records(closed,removed),actual=records(open);
 assert.equal(retained.length,complete.length-5,'only specified cover,film and three real fixing meshes removed');
 assertMultisetEqual(retained,actual,'service preserves every retained attribute,index and world pose,including actual controls/connectors');
 assert.equal(frames(open),frames(closed));return{id,removedPhysicalMeshes:5,retainedPhysicalMeshes:retained.length};
}

function checkTerminalHeads(host,unit,prefix,events){
 const port=unit.port('terminal'),plug=port.module;
 if(!plug){assert.equal(unit.options.terminalPlug===true,false);return{heads:0,accessory:false};}
 const joints=own(plug,'joint'),assembly=plug.terminalPlugAssembly;
 assert.deepEqual(joints.map(j=>j.id),['screw-1','screw-2','screw-3','screw-4']);assert.equal(assembly.heads.length,4);
 const rest=physical(unit),ports=frames(unit),begin=events.length;
 for(const[i,joint]of joints.entries()){
  const state=joint.getState(),original=joint.object3d.quaternion.clone(),head=assembly.heads[i];
  assert.ok(under(head,joint.object3d));assert.equal(state.continuous,false);assert.equal(state.rangeDeg,null);assert.deepEqual(state.visualRangeDeg,[-180,180]);
  const fixed=physical(unit,[head]),capRest=physical(head),others=joints.filter(j=>j!==joint).map(j=>[j,j.object3d.quaternion.clone()]);
  host.handle({type:'joint',target:target(prefix,`terminal/${joint.id}`),angleDeg:35});assert.notEqual(physical(head),capRest);
  assert.equal(physical(unit,[head]),fixed,'only selected visible head moves;shank/clamp/socket/PCB and all peer material stay fixed');
  host.handle({type:'joint',target:target(prefix,`terminal/${joint.id}`),angleDeg:70,durationMs:150});host.update(1/60);
  assert.ok(joint.getState().angleDeg>35&&joint.getState().angleDeg<70);tick(host);assert.equal(joint.getState().angleDeg,70);assert.equal(joint.getState().transitioning,false);
  assert.equal(physical(unit,[head]),fixed);assert.ok(others.every(([j,q])=>j.object3d.quaternion.equals(q)));assert.equal(frames(unit),ports);
  for(const bad of[{rpm:1},{angleDeg:Infinity},{angleDeg:NaN},{durationMs:-1}]){
   const valid=joint.getState(),shape=physical(unit);assert.throws(()=>joint.set(bad));assert.deepEqual(joint.getState(),valid);assert.equal(physical(unit),shape);
  }
  joint.set({angleDeg:state.angleDeg});assert.ok(joint.object3d.quaternion.equals(original));assert.equal(physical(unit),rest);
 }
 assert.equal(events.length,begin,'external visible-head drive has no input echo');roundtrip(unit,port);
 class WrongFamily extends Module{static meta={id:'fixture.grove-only',name:'Fixture incompatible Grove accessory',connector:'grove'};build(){}}
 const wrong=new WrongFamily();try{
  const saved=port.module,shape=physical(unit),fixedPorts=frames(unit);assert.equal(port.accepts(wrong),false);assert.throws(()=>port.attach(wrong));
  assert.ok(port.module===saved);assert.ok(saved===plug);assert.equal(physical(unit),shape);assert.equal(frames(unit),fixedPorts);
 }finally{wrong.dispose();}
 return{heads:4,accessory:true};
}

function checkSlide(host,unit,id,prefix,events,service){
 const c=unit.get(id),allFixed=unit.hbridgeAssembly.controls.fixed;
 assert.equal(c.isLatching,true);assert.equal(c.interactive,service);assert.ok(c.travel>0);assert.equal(c.getState().pressed,false);
 assert.ok(allFixed.every(o=>o?.isMesh&&!under(o,c.cap)),'all switch bases/covers/floors/solder legs are separate fixed meshes');
 let capMeshes=0;c.cap.traverse(o=>{if(o.isMesh)capMeshes++;if(!service)assert.equal(o.userData.component,undefined);});assert.equal(capMeshes,id==='source'?5:1,'only actual retained thumb/grip meshes live in the moving cap');
 const original=c.position,ports=frames(unit),begin=events.length;
 host.handle({type:'button',target:target(prefix,id),action:'position',position:0,immediate:true});
 const rest=physical(unit),capRest=physical(c.cap),fixed=physical(unit,[c.cap]);
 const p0=c.getState();c.onPointerDown({pointerId:35});
 if(!service){
  c.onPointerUp({pointerId:35});c.onPointerCancel({pointerId:35});tick(host);
  assert.deepEqual(c.getState(),p0);assert.equal(physical(unit),rest);assert.equal(events.length,begin,'closed pointer calls cannot actuate through native cover');
 }else{
  // Pointer and external source share one actual slider; releasing/cancelling
  // one holder cannot fabricate a second toggle or reset a stable detent.
  c.press(`fixture:${id}:other`);tick(host);assert.equal(c.position,1);assert.equal(c.pressed,true);assert.notEqual(physical(c.cap),capRest);
  assert.equal(physical(unit,[c.cap]),fixed,'retained cap only moves;board/base/cover/peer controls stay fixed');
  c.onPointerUp({pointerId:35});tick(host);assert.equal(c.pressed,true);assert.equal(c.position,1);
  host.handle({type:'button',target:target(prefix,id),action:'cancel',source:`fixture:${id}:other`});tick(host);
  assert.equal(c.pressed,false);assert.equal(c.position,1);assert.equal(c.getActuationState().depthMm,c.travel);
  assert.deepEqual(events.slice(begin).map(e=>e.action),['down','up']);assert.equal(events.at(-1).cancelled,true,'cancelled up without click preserves selected detent');
  const again=events.length;c.press(`fixture:${id}:one`);c.press(`fixture:${id}:two`);tick(host);assert.equal(c.position,0);assert.equal(c.pressed,true);
  c.cancel(`fixture:${id}:one`);tick(host);assert.equal(c.pressed,true);assert.equal(c.position,0);
  c.release(`fixture:${id}:two`);tick(host);assert.equal(c.pressed,false);assert.equal(c.position,0);
  assert.deepEqual(events.slice(again).map(e=>e.action),['down','up']);assert.equal(events.at(-1).cancelled,true);assert.equal(physical(unit),rest);
 }
 const echo=events.length;
 host.handle({type:'button',target:target(prefix,id),action:'position',position:1,immediate:true});
 assert.equal(c.position,1);assert.notEqual(physical(c.cap),capRest);assert.equal(physical(unit,[c.cap]),fixed);assert.equal(events.length,echo,'external stable-position command produces no input echo in either cover state');
 const valid=c.getState(),shape=physical(unit);assert.throws(()=>c.setPosition(2));assert.deepEqual(c.getState(),valid);assert.equal(physical(unit),shape);
 host.handle({type:'button',target:target(prefix,id),action:'position',position:0,immediate:true});assert.equal(physical(unit),rest);assert.equal(frames(unit),ports);
 c.setPosition(original,{immediate:true});return{id,service,capMeshes};
}

/** Works with either closed or frontCover:false Model/GroveModule and nested paths. */
export function checkHbridge(host,unit,prefix,events){
 unit.root;unit.update(0);assert.ok(Array.isArray(events),'caller supplies host input log,filtered to non-port intent');
 assert.deepEqual(own(unit,'port').map(p=>p.id).sort(),['grove','terminal']);
 assert.deepEqual(own(unit,'button').map(p=>p.id).sort(),['address-1','address-2','address-3','address-4','source']);
 for(const kind of['sensor','led','display','speaker','joint'])assert.equal(own(unit,kind).length,0);
 assert.deepEqual(unit.port('grove').pins.map(p=>p.name),['GND','5V','SDA','SCL']);assert.deepEqual(unit.port('terminal').pins.map(p=>p.name),['HV','GND','M−','M+']);
 const assembly=unit.hbridgeAssembly;assert.equal(assembly.controls.fixed.length,18);const service=unit.options.frontCover===false,rest=physical(unit);
 const controls=['source','address-1','address-2','address-3','address-4'].map(id=>checkSlide(host,unit,id,prefix,events,service));
 assert.equal(physical(unit),rest);const terminal=checkTerminalHeads(host,unit,prefix,events);assert.equal(physical(unit),rest);
 return{id:'hbridge',service,controls,...terminal};
}

/** Original U098-B2 passive acoustic carrier,only the real Grove input port. */
export function checkUltrasonicIo(unit){
 unit.root;assert.deepEqual(own(unit,'port').map(p=>p.id),['grove']);
 for(const kind of['sensor','button','led','display','speaker','joint'])assert.equal(own(unit,kind).length,0,'no invented range state,button,membrane motion or light');
 assert.equal(unit.components.has('sensor'),false);assert.equal(unit.components.has('transmit'),false);assert.equal(unit.components.has('receive'),false);
 assert.deepEqual(unit.port('grove').pins.map(p=>p.name),['GND','5V','TRIG','ECHO']);
 const assembly=unit.ultrasonicIOAssembly;assert.equal(assembly.carriers.length,2);assert.deepEqual(assembly.carriers.map(c=>c.id),['transmit','receive']);
 for(const c of assembly.carriers){assert.equal(c.frame.userData.role,'passive-acoustic-carrier');assert.equal(c.frame.userData.noAnimatedMembrane,true);assert.ok(c.housing.isMesh&&c.floor.isMesh&&c.diaphragm.isMesh&&c.guard.length>0);}
 // Synchronize the four-core wrapper after caller attachment before comparing.
 unit.update(0);const rest=physical(unit),ports=frames(unit);tick(unit);assert.equal(physical(unit),rest);assert.equal(frames(unit),ports);
 return{id:'ultrasonic-io',ports:['grove'],passiveCarriers:2};
}

import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {Vector3} from 'three';
import {loadModel,loadGroveModule} from '../src/loaders.js';
import {LoraAntenna as RpSmaAntenna} from '../src/units/c6l/index.js';
const ids=['hbridge','catm-gnss','ultrasonic-io'];

function checkLte(host,unit,prefix,events){
 const antenna=unit.port('lte').module,joint=antenna.get('tilt');assert.deepEqual(own(antenna,'joint').map(c=>c.id),['tilt']);
 const assembly=antenna.lteAntennaAssembly,original=joint.getState().angleDeg,rest=physical(unit),fixed=physical(unit,[assembly.moving]),ports=frames(unit),start=events.length;
 assert.deepEqual(joint.getState().rangeDeg,[0,90]);assert.equal(joint.getState().continuous,false);assert.ok(under(assembly.moving,joint.object3d));assert.ok(!under(assembly.fixed,joint.object3d));
 host.handle({type:'joint',target:target(prefix,'lte/tilt'),angleDeg:75,durationMs:180});host.update(1/60);assert.ok(joint.getState().transitioning);assert.ok(joint.getState().angleDeg>original&&joint.getState().angleDeg<75);tick(host);assert.equal(joint.getState().angleDeg,75);assert.notEqual(physical(unit),rest);assert.equal(physical(unit,[assembly.moving]),fixed);assert.equal(frames(unit),ports);assert.equal(events.length,start);
 for(const bad of[{rpm:1},{angleDeg:-.1},{angleDeg:90.1},{angleDeg:NaN},{durationMs:-1}]){const shape=physical(unit),state=joint.getState();assert.throws(()=>joint.set(bad));assert.deepEqual(joint.getState(),state);assert.equal(physical(unit),shape);}
 joint.set({angleDeg:original});assert.equal(physical(unit),rest);roundtrip(unit,unit.port('lte'));
}
function checkCoax(host,unit,prefix,events){
 const antenna=unit.port('gnss').module,assembly=antenna.gnssAntennaAssembly,pose=antenna.get('puckPose'),coax=antenna.get('coax');
 assert.equal(own(antenna,'joint').length,0);assert.equal(pose.kind,'gnss-pose');assert.equal(coax.kind,'rf-coax');
 const start=events.length,originalPose=pose.getState(),originalPoints=coax.getState().points,rest=physical(unit),fixed=physical(unit,[pose.object3d,coax.object3d]);
 function endpoints(){
  world(antenna.root);const state=coax.getState(),expected=pose.object3d.localToWorld(new Vector3(-20,0,0));coax.object3d.worldToLocal(expected);
  assert.equal(state.wireCount,1);assert.equal(state.nominalLengthMm,1000);assert.equal(state.conductorSystem,'coaxial-centre-and-shield');assert.ok(new Vector3(...state.target.position).distanceTo(expected)<1e-8);assert.ok(coax.centerPoints[0].distanceTo(new Vector3(...state.source.position))<1e-8);assert.ok(coax.centerPoints.at(-1).distanceTo(expected)<1e-8);return state;
 }
 const before=endpoints(),points=[[0,25,0],[15,45,3],[35,70,5]];
 host.handle({type:'pose',target:target(prefix,'gnss/puckPose'),position:[65,115,12],rotation:[.1,-.15,.25]});
 let state=endpoints();assert.notDeepEqual(state.target.position,before.target.position);assert.deepEqual(state.source,before.source);assert.deepEqual(state.points,originalPoints);assert.notEqual(physical(unit),rest);assert.equal(physical(unit,[pose.object3d,coax.object3d]),fixed);
 host.handle({type:'cable',target:target(prefix,'gnss/coax'),points});state=endpoints();assert.deepEqual(state.points,points);assert.deepEqual(state.source,before.source);assert.equal(physical(unit,[pose.object3d,coax.object3d]),fixed);
 for(const bad of[{points:[]},{points:[[NaN,0,0]]},{points:Array.from({length:25},()=>[0,0,0])}]){const valid=coax.getState(),shape=physical(unit);assert.throws(()=>coax.setOptions(bad));assert.deepEqual(coax.getState(),valid);assert.equal(physical(unit),shape);}
 for(const bad of[{position:[NaN,0,0]},{rotation:[0,Infinity,0]},{quaternion:[0,0,0,0]}]){const valid=pose.getState(),shape=physical(unit);assert.throws(()=>pose.setPose(bad));assert.deepEqual(pose.getState(),valid);assert.equal(physical(unit),shape);}
 pose.setPose({position:originalPose.position,quaternion:originalPose.quaternion});coax.setOptions({points:originalPoints});endpoints();assert.equal(physical(unit),rest);assert.equal(events.length,start);roundtrip(unit,unit.port('gnss'));return{fixedEndpoints:true,points:'intermediate-only',poseRebind:true};
}
function checkCatmService(closed,open){
 closed.root;open.root;const a=closed.catmGnssAssembly,b=open.catmGnssAssembly,removed=[a.parts['CatM GNSS complete native rear housing'],a.films.back,...a.screws.flatMap(s=>[s.head,s.floor,s.shank])];
 assert.equal(removed.length,8);assert.ok(removed.every(o=>o?.isMesh));assert.equal(b.screws.length,0);assert.equal(b.films.back,undefined);assert.equal(Object.keys(b.parts).length,1);assertMultisetEqual(records(closed,removed),records(open));assert.equal(frames(closed),frames(open));return{id:'catm-gnss',removedPhysicalMeshes:8};
}
function checkCatm(host,unit,prefix,events){
 assert.deepEqual(own(unit,'port').map(p=>p.id).sort(),['dc','gnss','grove','lte']);for(const kind of['button','led','joint','sensor','display','speaker'])assert.equal(own(unit,kind).length,0);
 assert.deepEqual(unit.get('sim').getState(),{});assert.equal(unit.get('sim').meta.cardType,'MicroSIM');const noecho=events.length;checkLte(host,unit,prefix,events);const coax=checkCoax(host,unit,prefix,events);assert.equal(events.length,noecho);
 class WrongFamily extends Module{static meta={id:'fixture.wrong-grove',connector:'grove'};build(){}}
 for(const id of['lte','gnss']){const peer=unit.port(id==='lte'?'gnss':'lte').module,peerShape=physical(peer),before=physical(unit),port=unit.port(id),part=port.detach({dispose:false});assert.ok(part);assert.equal(physical(peer),peerShape);assert.equal(unit.get('cable').getState().wireCount,4);port.attach(part);assert.equal(physical(unit),before);}
 const wrong=new WrongFamily(),wrongRp=new RpSmaAntenna();try{for(const id of['lte','gnss']){const port=unit.port(id),saved=port.module,shape=physical(unit);for(const item of[wrong,wrongRp]){assert.equal(port.accepts(item),false);assert.throws(()=>port.attach(item));assert.ok(port.module===saved);assert.equal(physical(unit),shape);}}}finally{wrongRp.dispose();wrong.dispose();}
 return{id:'catm-gnss',ports:['dc','gnss','grove','lte'],lte:'finite-real-hinge',coax};
}

/** Current three real assemblies/external shape only; no GPU or hardware execution. */
export async function checkHbridgeCatmUltrasonicUnits(){
 const restore=installCanvasStub();let host,closedH;
 try{
  const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
  host=await loadModel('sticks3');host.root;host.display().fill('#123456');const framebuffer=hash(host.display().buffer),hub=await loadGroveModule('hub');host.port('grove').attach(hub);const events=[],units={},artwork=[],services=[],motions=[];host.on('input',e=>{if(e.kind!=='port')events.push(e);});
  for(const[i,id]of ids.entries()){
   const options=id==='hbridge'?{frontCover:false,terminalPlug:true}:id==='catm-gnss'?{lteAntenna:true,gnssAntenna:true}:{};
   const u=await loadGroveModule(id,{...options,cableLength:75+i*15});hub.port('grove-'+(i+1)).attach(u);units[id]=u;host.update(0);assert.equal(u.get('cable').getState().wireCount,4);assert.equal(u.components.has('sensor'),false);
   const presets=catalog.products.find(p=>p.id===id).configurations;assert.ok(Array.isArray(presets)&&presets.length&&presets.every(p=>p.id&&p.name&&p.options));
   const extra=id==='hbridge'?[{frontCover:true,terminalPlug:true},{frontCover:false,terminalPlug:true}]:id==='catm-gnss'?[{lteAntenna:true,gnssAntenna:true,lteAngleDeg:90},{rearCover:false,lteAntenna:true,gnssAntenna:true,gnssPose:{position:[70,110,14],rotation:[.1,.2,.3]},gnssCable:{points:[[0,20,0],[20,60,2]]}}]:[];
   const configs=[{},...presets.map(p=>p.options),...extra],seen=new Set();
   for(const opts of configs){const key=JSON.stringify(opts);if(seen.has(key))continue;seen.add(key);for(const load of[loadModel,loadGroveModule]){const on=await load(id,opts),off=await load(id,{...opts,artwork:false});try{
    on.root;off.root;assert.equal(physical(on),physical(off),'ink toggle preserves every physical attribute/index/world matrix');assert.equal(panels(off).length,0);const expected=id==='hbridge'?(opts.frontCover===false?1:2):id==='ultrasonic-io'?(opts.rearCover===false?0:1):(opts.rearCover===false?1:2)+(opts.gnssAntenna===true?1:0);assert.equal(panels(on).length,expected);
    for(const p of panels(on))assert.ok(['reference-redraw','source-vector-raster'].includes(p.userData.artworkKind));
    if(id==='hbridge'){assert.equal(on.port('terminal').module!==null,opts.terminalPlug===true);assert.equal(on.get('source').interactive,opts.frontCover===false);}
    if(id==='catm-gnss'){assert.equal(on.port('lte').module!==null,opts.lteAntenna===true);assert.equal(on.port('gnss').module!==null,opts.gnssAntenna===true);}
    if(load===loadModel&&key==='{}')artwork.push({id,panels:expected,kinds:[...new Set(panels(on).map(p=>p.userData.artworkKind))]});
   }finally{on.dispose();off.dispose();}}}
   const closed=await loadModel(id),open=await loadModel(id,id==='hbridge'?{frontCover:false}:{rearCover:false});try{services.push(id==='catm-gnss'?checkCatmService(closed,open):checkService(id,closed,open));}finally{closed.dispose();open.dispose();}
  }
  motions.push(checkHbridge(host,units.hbridge,'grove/grove-1',events));motions.push(checkCatm(host,units['catm-gnss'],'grove/grove-2',events));motions.push(checkUltrasonicIo(units['ultrasonic-io']));
  closedH=await loadModel('hbridge');const closedEvents=[];closedH.on('input',e=>{if(e.kind!=='port')closedEvents.push(e);});motions.push(checkHbridge(closedH,closedH,'',closedEvents));closedH.dispose();closedH=null;
  const noecho=events.length;for(const[i,id]of ids.entries()){host.handle({type:'pose',target:'grove/grove-'+(i+1)+'/unitFrame',position:[i*55,195+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:'grove/grove-'+(i+1)+'/cable',slack:12,bend:[0,0,-1]});host.update(0);assert.equal(units[id].get('cable').getState().wireCount,4);}
  assert.equal(events.length,noecho);checkCoax(host,units['catm-gnss'],'grove/grove-2',events);assert.equal(hash(host.display().buffer),framebuffer);
  const siblings=[physical(units.hbridge),physical(units['catm-gnss'])];hub.port('grove-3').detach();assert.deepEqual([physical(units.hbridge),physical(units['catm-gnss'])],siblings);assert.ok(hub.port('grove-1').module===units.hbridge&&hub.port('grove-2').module===units['catm-gnss']);
  return{status:'pass',artwork,services,motions,cases:['three-real-four-core-Grove-branches-and-independent-detach','five-real-HBridge-detents-cap-only-multiple-source-cancel-covered-pointer-guard-and-external-position-noecho','four-independent-terminal-heads-with-fixed-shank-cage-socket-no-RPM','own-CatM-MicroSIM-two-SMA-LTE-real-hinge-and-GNSS-puck-pose-with-automatically-bound-single-coax-endpoints','incompatible-Grove-and-RP-SMA-rejected-preserving-installed-accessories','only-exact-service-material-removed-full-retained-physical-multisets-match','Ultrasonic-IO-only-Grove-two-static-real-acoustic-carriers-no-distance-state','both-entries-all-real-presets-and-accessory-pose-configs-artwork-toggle-physical-invariant','external-commands-noecho-transformed-parents-peer-isolation-framebuffer-and-disposal'],scope:'Current exact-SKU three physical assemblies and external appearance only;Node canvas stub;no browser/GPU,manufacturing stops,production fit,physical hardware,firmware,electrical,power,motor,RF/GNSS/network,acoustic timing or sensor values;no whole-history acceptance'};
 }finally{closedH?.dispose();host?.dispose();restore();}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkHbridgeCatmUltrasonicUnits(),null,2));
