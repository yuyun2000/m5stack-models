import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {Module} from '../src/core/index.js';

// Necessary current-batch geometry/API fixture; all scene data remains runtime-owned.
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



export function checkWrongFamily(host,u,prefix,portIds,events){
 class Wrong extends Module{static meta={id:'fixture.batch43.wrong',name:'Wrong mechanical family',connector:'fixture-incompatible-family'};build(){}}
 const wrong=new Wrong(),checked=[];try{for(const id of portIds){const p=u.get(id),current=p.module,shape=physical(u),ports=frames(u),n=events.length,visible=p.highlightMesh.visible;assert.equal(p.accepts(wrong),false);assert.throws(()=>host.handle({type:'attach',target:target(prefix,id),module:wrong}));assert.ok(p.module===current&&wrong.attachedTo===null&&wrong.parentHost===null);assert.equal(p.highlightMesh.visible,visible);assert.equal(physical(u),shape);assert.equal(frames(u),ports);assert.equal(events.length,n);checked.push(id);}}finally{wrong.dispose();}return checked;
}
const shapeWithoutMatrices=object=>stamp(records(object).map(({matrix,...rest})=>rest));
const lightState=u=>stamp(own(u,'led').map(l=>({id:l.id,state:l.getState(),emissive:l.lensMaterial.emissive.getHex()})));
const displayState=u=>stamp(own(u,'display').map(d=>({id:d.id,buffer:hash(d.buffer)})));

/** Rigid real plungers only;native flexures have their own earlier fixture. */
export function checkMomentaries(host,u,prefix,events,ids){
 u.root;const report=[];
 for(const[index,id]of ids.entries()){
  const c=u.get(id);assert.equal(c.kind,'button');assert.equal(c.isLatching,false);assert.equal(c.pressed,false);assert.ok(c.travel>0);assert.equal(c.getActuationState().depthMm,0);
  let visibleMeshes=0;c.cap.traverse(o=>{if(o.isMesh&&o.material.opacity!==0){visibleMeshes++;assert.ok(o.userData.component===c,'real cap surface carries its actual button hit owner');}});assert.ok(visibleMeshes>0);
  const rest=physical(u),fixed=physical(u,[c.cap]),capShape=shapeWithoutMatrices(c.cap),ports=frames(u),lights=lightState(u),screen=displayState(u),rotation=stamp(c.cap.quaternion.toArray()),scale=stamp(c.cap.scale.toArray());
  const checkFixed=()=>{assert.equal(physical(u,[c.cap]),fixed,'only own real cap moves;all peers/fixed package/pins/board stay identical');assert.equal(shapeWithoutMatrices(c.cap),capShape);assert.equal(frames(u),ports);assert.equal(lightState(u),lights,'press is not automatic LED output');assert.equal(displayState(u),screen,'press is not automatic display content');assert.equal(stamp(c.cap.quaternion.toArray()),rotation);assert.equal(stamp(c.cap.scale.toArray()),scale);};
  const settle=()=>{tick(host);assert.equal(c.getActuationState().settled,true);checkFixed();};
  const held=()=>{assert.equal(c.pressed,true);assert.equal(c.getActuationState().depthMm,c.travel);const expected=c.axis.clone().multiplyScalar(c.travel);assert.ok(c.cap.position.distanceTo(expected)<1e-8);assert.notEqual(physical(u),rest);};
  const neutral=()=>{assert.equal(c.pressed,false);assert.equal(c.getActuationState().depthMm,0);assert.equal(physical(u),rest);};
  let start=events.length;const pointerId=301+index,source=`fixture:secondary:${id}`;c.onPointerDown({pointerId});host.handle({type:'button',target:target(prefix,id),action:'press',source});settle();held();
  const pressed=physical(c.cap),count=events.length;c.cancel('fixture:unheld');assert.equal(events.length,count);c.onPointerUp({pointerId});settle();held();assert.equal(physical(c.cap),pressed);assert.equal(events.length,start+1);
  host.handle({type:'button',target:target(prefix,id),action:'cancel',source});settle();neutral();let list=events.slice(start);assert.deepEqual(list.map(e=>e.action),['down','up']);assert.ok(list.every(e=>e.kind==='button'&&e.id===target(prefix,id)));assert.equal(list.at(-1).cancelled,true);
  start=events.length;host.handle({type:'button',target:target(prefix,id),action:'press',source:'fixture:success'});settle();held();host.handle({type:'button',target:target(prefix,id),action:'release',source:'fixture:success'});settle();neutral();list=events.slice(start);assert.deepEqual(list.map(e=>e.action),['down','up','click']);assert.ok(list.every(e=>e.kind==='button'&&e.id===target(prefix,id)));
  report.push({id,travelMm:c.travel,axis:c.axis.toArray(),actualMovingMeshes:visibleMeshes,multiSourceReleaseCancel:'last source;cancel suppresses click',rigidCapAndAllFixedMaterial:'pass'});
 }
 return report;
}

/** All physical controls held together,then one cancelled without resetting peers. */
export function checkSimultaneousMomentaries(host,u,events,ids){
 const controls=ids.map(id=>u.get(id)),rest=physical(u),fixed=physical(u,controls.map(c=>c.cap)),lights=lightState(u),ports=frames(u),n=events.length;
 for(const c of controls)c.press('fixture:all');tick(host);const held=new Map(controls.map(c=>[c,physical(c.cap)]));assert.ok(controls.every(c=>c.pressed&&c.getActuationState().depthMm===c.travel));assert.equal(physical(u,controls.map(c=>c.cap)),fixed);assert.equal(lightState(u),lights);
 const first=controls[0];first.cancel('fixture:all');tick(host);assert.equal(first.pressed,false);for(const c of controls.slice(1)){assert.equal(c.pressed,true);assert.equal(physical(c.cap),held.get(c));}
 for(const c of controls.slice(1))c.cancel('fixture:all');tick(host);assert.ok(controls.every(c=>!c.pressed&&c.getActuationState().depthMm===0));assert.equal(physical(u),rest);assert.equal(frames(u),ports);assert.equal(lightState(u),lights);assert.equal(events.slice(n).filter(e=>e.action==='click').length,0);
 return{controls:ids.length,allHeldAndOneCancelled:'independent peers',completeNeutralPhysicalRestored:true};
}

export function checkIndependentLights(host,u,prefix,events,ids){
 const leds=ids.map(id=>u.get(id));assert.ok(leds.every(l=>l.kind==='led'&&!l.invisible));assert.equal(new Set(leds.map(l=>l.lens)).size,ids.length);assert.equal(new Set(leds.map(l=>l.lensMaterial)).size,ids.length);
 const rest=leds.map(l=>l.getState()),shape=physical(u),ports=frames(u),n=events.length;try{for(const[i,l]of leds.entries()){
  const peers=leds.filter(x=>x!==l).map(x=>({state:x.getState(),emissive:x.lensMaterial.emissive.getHex()})),color=i%2?'#169cfa':'#ef7135',brightness=.2+i/100;
  host.handle({type:'led',target:target(prefix,l.id),color,brightness});assert.deepEqual(l.getState(),{color,brightness});assert.ok(l.lensMaterial.emissive.getHex()>0,'real emitter material changes');assert.deepEqual(leds.filter(x=>x!==l).map(x=>({state:x.getState(),emissive:x.lensMaterial.emissive.getHex()})),peers);assert.equal(physical(u),shape);assert.equal(frames(u),ports);assert.equal(events.length,n);
 }const held=leds.map(l=>l.getState());host.update(.5);assert.deepEqual(leds.map(l=>l.getState()),held,'no invented automatic firmware/cascade animation');assert.equal(events.length,n);
 }finally{for(const[i,l]of leds.entries())l.set(rest[i]);}assert.equal(physical(u),shape);assert.equal(frames(u),ports);
 return{count:ids.length,externalNoEcho:true,independentRealMaterials:true,physicalAndPortsUnchanged:true};
}

export function observeDisposal(root){
 const resources=new Set(),disposed=new Set();root.traverse(o=>{if(o.geometry)resources.add(o.geometry);for(const m of[].concat(o.material??[])){resources.add(m);for(const value of Object.values(m))if(value?.isTexture)resources.add(value);}});for(const r of resources)r.addEventListener('dispose',()=>disposed.add(r));return()=>{assert.equal(disposed.size,resources.size,'observed attached resources disposed');return resources.size;};
}

/** One exposed,real two-detent slider; physical caps only,no address algorithm. */
export function checkStableSlide(host,unit,id,prefix,events){
 unit.root;unit.update(0);const c=unit.get(id);assert.equal(c.kind,'button');assert.equal(c.isLatching,true);assert.equal(c.interactive,true);assert.ok(c.travel>0);
 const original=c.position,ports=frames(unit);c.setPosition(0,{immediate:true});const rest=physical(unit),capRest=physical(c.cap),fixed=physical(unit,[c.cap]);let capMeshes=0;c.cap.traverse(o=>{if(o.isMesh&&o.material.opacity!==0)capMeshes++;});assert.ok(capMeshes>0,'actual opaque slider material required');
 let n=events.length;host.handle({type:'button',target:target(prefix,id),action:'position',position:1,immediate:true});assert.equal(c.position,1);assert.equal(c.getActuationState().depthMm,c.travel);assert.notEqual(physical(c.cap),capRest);assert.equal(physical(unit,[c.cap]),fixed);assert.equal(frames(unit),ports);assert.equal(events.length,n);
 const shape=physical(unit),state=c.getState();for(const invalid of[-1,2,.5,NaN,Infinity]){assert.throws(()=>c.setPosition(invalid,{immediate:true}));assert.deepEqual(c.getState(),state);assert.equal(physical(unit),shape);}
 c.setPosition(0,{immediate:true});assert.equal(physical(unit),rest);n=events.length;c.onPointerDown({pointerId:81});c.press('fixture:peer');tick(host);assert.equal(c.position,1);assert.equal(c.pressed,true);assert.equal(physical(unit,[c.cap]),fixed);assert.notEqual(physical(c.cap),capRest);
 c.onPointerUp({pointerId:81});tick(host);assert.equal(c.pressed,true);assert.equal(c.position,1);host.handle({type:'button',target:target(prefix,id),action:'cancel',source:'fixture:peer'});tick(host);assert.equal(c.pressed,false);assert.equal(c.position,1);assert.equal(c.getActuationState().depthMm,c.travel);assert.deepEqual(events.slice(n).map(e=>e.action),['down','up']);assert.equal(events.at(-1).cancelled,true);
 n=events.length;c.press('fixture:one');c.press('fixture:two');tick(host);assert.equal(c.position,0);c.cancel('fixture:one');tick(host);assert.equal(c.pressed,true);assert.equal(c.position,0);c.release('fixture:two');tick(host);assert.equal(c.pressed,false);assert.equal(c.position,0);assert.deepEqual(events.slice(n).map(e=>e.action),['down','up']);assert.equal(events.at(-1).cancelled,true);assert.equal(physical(unit),rest);
 n=events.length;c.press('fixture:click');tick(host);c.release('fixture:click');tick(host);assert.equal(c.position,1);assert.deepEqual(events.slice(n).map(e=>e.action),['down','up','click']);assert.equal(physical(unit,[c.cap]),fixed);
 n=events.length;c.setPosition(0);host.update(1/240);assert.ok(c.getActuationState().depthMm>0&&c.getActuationState().depthMm<c.travel);tick(host);assert.equal(physical(unit),rest);assert.equal(events.length,n);c.setPosition(original,{immediate:true});return{id,movingMeshes:capMeshes,multiSourceCancel:'retains detent',externalPosition:'noecho'};
}

import * as UnitV2USBThree from 'three';

// Concatenated with fixture-parts.mjs; no product mutation or shadow imports.
// Root owns generic artwork/configuration,wrong-family,cable,peer and disposal.
export function checkUnitV2USBPhysical(u){
 u.root;world(u.root);const T=UnitV2USBThree,a=u.unitV2UsbAssembly;
 assert.equal(u.meta.sku,'U078-USB');assert.ok(a?.front?.isMesh&&a.rear?.isMesh&&a.board?.pcb?.isMesh);
 const frame=a.front.parent,inverse=frame.matrixWorld.clone().invert(),tol=1e-5;
 const close=(v,e,message)=>assert.ok(Math.abs(v-e)<tol,message);
 const point=o=>o.getWorldPosition(new T.Vector3()).applyMatrix4(inverse);
 const bounds=o=>new T.Box3().setFromBufferAttribute(o.geometry.attributes.position).applyMatrix4(inverse.clone().multiply(o.matrixWorld));
 const material=o=>o.isMesh&&o.userData.role!=='printed-artwork'&&o.material.opacity!==0;
 const shoot=(p,d,objects,coordinates=frame)=>{const origin=new T.Vector3(...p).applyMatrix4(coordinates.matrixWorld),direction=new T.Vector3(...d).transformDirection(coordinates.matrixWorld),r=new T.Raycaster(origin,direction),hits=(Array.isArray(objects)?r.intersectObjects(objects,false):r.intersectObject(objects,true)).filter(h=>material(h.object));for(const h of hits){assert.equal(h.object.material.side,T.FrontSide);const n=h.face.normal.clone().applyNormalMatrix(new T.Matrix3().getNormalMatrix(h.object.matrixWorld));assert.ok(n.dot(direction)<-1e-7,'Actual outward FrontSide material');}return hits;};
 assert.equal(a.front.geometry.index.count/3,2550,'Complete own native front/fixed USB hood');assert.equal(a.rear.geometry.index.count/3,2412,'Complete own native rear/grille');assert.equal(a.front.userData.source,'official-structure');assert.equal(a.rear.userData.source,'official-structure');
 const f=bounds(a.front),b=bounds(a.rear);close(f.min.x,-12,'Native width unchanged');close(f.max.x,12,'Native width unchanged');close(f.max.z,14.4770898819,'Fixed raised USB hood unchanged');close(b.min.z,-9.1999998093,'Actual native rear depth,not stretched24.2');close(b.min.y,-24,'Rigid Y=-4 origin');close(b.max.y,24,'48mm own native height');
 assert.equal(own(u,'port').length,5);assert.equal(own(u,'button').length,1);for(const k of['joint','led','display','sensor','speaker','component'])assert.equal(own(u,k).length,0,'No unsupported fan/camera/display/indicator '+k);
 const input=a.input;assert.ok(input.port===u.get('grove'));assert.equal(input.port.connector,'grove');for(const field of['contacts','returns','tails'])assert.equal(input[field].length,4);assert.equal(a.board.lands.length,4);
 const gb=shoot([.15,2,.7],[0,-1,0],input.frame,input.frame)[0];assert.ok(gb&&gb.object===input.back,'Actual deep white HY2.0 receiving carrier');
 for(let i=0;i<4;i++){const p=input.port.object3d.worldToLocal(input.contacts[i].getWorldPosition(new T.Vector3()));assert.equal(input.port.pinAt(p).n,i+1);const tail=bounds(input.tails[i]);assert.ok(tail.min.z<-.8&&tail.max.z>0,'Actual contact tail crosses supporting PCB');}
 const pcb=bounds(a.board.pcb);close(pcb.min.z,-.8,'Actual PCB underside');close(pcb.max.z,0,'Actual PCB top');
 let pcbSupportRays=0;for(const tail of[input.tails[1],a.usba.tails[1]]){const p=point(tail),dx=tail === input.tails[1] ? .5 : .65,h=shoot([p.x+dx,p.y+.02,1],[0,0,-1],a.board.pcb)[0];assert.ok(h);close(h.point.clone().applyMatrix4(inverse).z,0,'Physical retained terminal PCB support');pcbSupportRays++;}
 assert.ok(a.usba.port===u.get('usb-a'));assert.equal(a.usba.port.connector,'usb-a');assert.equal(a.usba.contacts.length,4);assert.equal(a.usba.tails.length,4);assert.equal(a.usba.anchors.length,2);
 const ab=shoot([.15,2,-.8],[0,-1,0],a.usba.frame,a.usba.frame)[0],at=shoot([.15,2,1.05],[0,-1,0],a.usba.frame,a.usba.frame)[0];assert.ok(ab&&ab.object===a.usba.back,'Actual USB-A receiving air cavity has deep backing');assert.ok(at&&at.object===a.usba.tongue,'Actual retained white USB-A tongue');
 assert.ok(a.usbc.port===u.get('usb'));assert.equal(a.usbc.port.connector,'usb-c');assert.equal(a.usbc.contacts.length,24,'Documented conventional paired contact appearance,not populated BOM');
 const cb=shoot([.15,2,.85],[0,-1,0],a.usbc.frame,a.usbc.frame)[0],ct=shoot([.15,2,0],[0,-1,0],a.usbc.frame,a.usbc.frame)[0];assert.ok(cb&&cb.object===a.usbc.back);assert.ok(ct&&ct.object===a.usbc.tongue);
 for(const tab of a.usbc.anchors)close(bounds(tab).max.z,-.8,'USB-C tabs physically touch own PCB underside');
 assert.ok(a.storage.port===u.get('sd'));assert.equal(a.storage.port.connector,'microsd');assert.equal(a.storage.contacts.length,8);const sb=shoot([.17,2,.5],[0,-1,0],a.storage.frame,a.storage.frame)[0];assert.ok(sb&&sb.object===a.storage.back,'Real empty SD carrier closes at physical stop');
 assert.ok(a.cooling.frame.isGroup&&a.cooling.housing.isMesh&&a.cooling.backing.isMesh&&a.cooling.hub.isMesh&&a.cooling.support.isMesh);assert.ok(a.cooling.rotor===null&&a.cooling.joint===null,'Own USB-SKU impeller installation remains unestablished');assert.equal(a.cooling.posts.length,4);for(const post of a.cooling.posts)close(bounds(post).max.z,-.8,'Concealed fixed cooling carrier retained against PCB');assert.equal(a.board.indicators.length,2);assert.ok(a.board.indicators.every(o=>o.material.emissive.getHex()===0),'No fabricated exterior light output');
 assert.ok(a.labels.film.isMesh);assert.equal(a.labels.film.userData.role,'physical-label-substrate');close(bounds(a.labels.film).getSize(new T.Vector3()).z,.035,'Actual independent label substrate');
 const mount=u.get('mount');assert.ok(mount===a.mount);assert.equal(mount.connector,'m5.unitv2-usb.clip');let nativeClipTriangles=0,clipEmptyAxisRays=0,clipBoreWallRays=0;
 if(mount.module){const clip=mount.module;assert.equal(clip.meta.id,'m5stack.unit.unitv2-usb.clip');assert.ok(clip.attachedTo===mount&&clip.parentHost===u);const native=clip.clipAssembly.native,g=clip.clipAssembly.frame;assert.ok(native.isMesh&&under(native,clip.root));nativeClipTriangles=native.geometry.index.count/3;assert.equal(nativeClipTriangles,3316,'Whole own static native clip retained');assert.equal(own(clip,'joint').length,0);assert.equal(own(clip,'button').length,0);
  for(const[x,y]of[[.1143188954,6.1601382606],[-7.8852515482,6.2430917100],[8.1138891497,6.0771843545],[.1972725910,14.1597072914],[.0313646818,-1.8394319391]]){assert.equal(shoot([x+.13,y+.07,-25],[0,0,1],native,g).length,0,'Clip geometry has a true native bore;body behind it is checked separately');clipEmptyAxisRays++;const wall=shoot([x,y,-13],[.997,.077,0],native,g)[0];assert.ok(wall&&wall.distance>2.36&&wall.distance<2.43,'Actual FrontSide native clip bore wall');clipBoreWallRays++;}
 }
 return{nativeShellTriangles:4962,nativeClipTriangles,fixedUsbHood:true,actualHy2Contacts:4,actualUsbAContacts:4,usbCContactAppearance:24,microSdContacts:8,deepReceivingCavities:4,pcbSupportRays,clipEmptyAxisRays,clipBoreWallRays,fanRotorEvidence:'not-established;fixed grille/cooling carrier',externalLeds:0,noBuiltInCamera:true};
}

/** Real native tongue deformation;never substitute a rigid visible cap. */
export function checkUnitV2USBMotion(host,u,prefix,events){
 u.root;tick(host);const a=u.unitV2UsbAssembly,c=u.get('user'),g=a.front.geometry,p=g.attributes.position,n=g.attributes.normal;
 assert.equal(c.kind,'button');assert.equal(c.isLatching,false);assert.equal(c.meta.visualMotion,'native-flexure');assert.equal(c.meta.deformedNativeVertices,165);assert.equal(c.pressed,false);assert.equal(c.travel,.25);assert.ok(c.shell===a.front&&c.follower===a.board.follower);
 const rest=physical(u),fixed=physical(u,[a.front,a.board.follower,c.cap]),ports=frames(u),indexAtRest=hash(g.index.array),normalAtRest=hash(n.array),changed=new Set(c.changedTriangles),path=target(prefix,'user');
 assert.equal(hash(p.array),hash(c.restPositions));assert.equal(normalAtRest,hash(c.restNormals));
 function check(depth){assert.equal(physical(u,[a.front,a.board.follower,c.cap]),fixed,'Native tongue/follower only;fixed switch/PCB/hood/ports/clip retained');assert.equal(frames(u),ports);assert.equal(hash(g.index.array),indexAtRest,'All complete2550 native source triangles remain');let moved=0;
  for(let i=0;i<c.weights.length;i++){const k=i*3;assert.equal(p.array[k],c.restPositions[k]);assert.equal(p.array[k+2],c.restPositions[k+2]);assert.ok(Math.abs(p.array[k+1]-(c.restPositions[k+1]-depth*c.weights[i]))<2e-6,'Actual weighted own tongue flexure');if(c.weights[i]>0&&depth>0)moved++;else assert.equal(p.array[k+1],c.restPositions[k+1]);if(!changed.has(Math.floor(i/3)*3))for(let j=0;j<3;j++)assert.equal(n.array[k+j],c.restNormals[k+j],'Native fixed-face normals retained');}
  assert.ok(Math.abs(a.board.follower.position.y-(c.followerRest-depth))<1e-8);assert.ok([...n.array].every(Number.isFinite));if(depth>0)assert.equal(moved,165);else{assert.equal(hash(p.array),hash(c.restPositions));assert.equal(hash(n.array),normalAtRest);assert.equal(physical(u),rest);}return moved;
 }
 let start=events.length;c.onPointerDown({pointerId:707});host.handle({type:'button',target:path,action:'press',source:'fixture:usb-hold'});host.update(1/240);assert.ok(c.getActuationState().depthMm>0&&c.getActuationState().depthMm<c.travel);check(c.getActuationState().depthMm);tick(host);assert.equal(c.pressed,true);check(c.travel);c.onPointerUp({pointerId:707});tick(host);assert.equal(c.pressed,true);check(c.travel);host.handle({type:'button',target:path,action:'cancel',source:'fixture:usb-hold'});tick(host);assert.equal(c.pressed,false);check(0);let list=events.slice(start);assert.deepEqual(list.map(e=>e.action),['down','up']);assert.ok(list.every(e=>e.kind==='button'&&e.id===path));assert.equal(list.at(-1).cancelled,true);
 start=events.length;host.handle({type:'button',target:path,action:'press',source:'fixture:usb-success'});tick(host);check(c.travel);host.handle({type:'button',target:path,action:'release',source:'fixture:usb-success'});tick(host);check(0);list=events.slice(start);assert.deepEqual(list.map(e=>e.action),['down','up','click']);assert.ok(list.every(e=>e.id===path));
 return{id:'user',visualMotion:'native-flexure',deformedNativeVertices:165,travelMm:.25,completeNativeTriangles:2550,allFixedMaterial:'identical',multiSourceCancel:'last cancel suppresses click',restPositionsNormalsRoundtrip:'exact'};
}

import * as UnitVM12Three from 'three';

// Exact U078-V-M12 frozen product supplement. Concatenated root fixture provides
// assert/hash/stamp/attrs/own/target/world/under/physical/frames/tick/Module.
export function checkUnitVM12Physical(u){
 u.root;world(u);
 const a=u.unitVM12Assembly;assert.ok(a?.front?.isMesh&&a?.rear?.isMesh);
 const frame=a.front.parent,inverse=frame.matrixWorld.clone().invert(),tol=1e-5;
 const close=(x,y,n)=>assert.ok(Math.abs(x-y)<tol,n);
 const material=o=>o.isMesh&&o.userData.role!=='printed-artwork'&&o.material.opacity!==0;
 const bbox=o=>new UnitVM12Three.Box3().setFromBufferAttribute(o.geometry.attributes.position).applyMatrix4(inverse.clone().multiply(o.matrixWorld));
 const point=o=>o.getWorldPosition(new UnitVM12Three.Vector3()).applyMatrix4(inverse);
 const solids=new Set(),collect=o=>o.traverse(q=>{if(material(q))solids.add(q);});
 for(const o of[a.front,a.rear,a.board.pcb,a.board.k210,a.board.flash,...a.board.packages,...a.board.terminations,...a.board.lands,a.input.frame,a.usb.frame,...a.usb.anchors,a.sd.frame,...a.sd.supports,...Object.values(a.controls).flatMap(k=>[k.frame,k.moving]),a.optical.carrier,...a.optical.posts,a.optical.sensor,a.optical.opticalStop,a.optical.inner,a.optical.seat,a.optical.barrel,a.optical.lip,a.optical.glass,a.fixing.head,a.fixing.floor,a.fixing.shank,a.label])collect(o);
 assert.equal(solids.size,152,'complete own physical assembly excludes artwork/proxies/cable/attached children');
 const shoot=(p,d,objects,coordinate=frame)=>{const origin=new UnitVM12Three.Vector3(...p).applyMatrix4(coordinate.matrixWorld),direction=new UnitVM12Three.Vector3(...d).transformDirection(coordinate.matrixWorld),r=new UnitVM12Three.Raycaster(origin,direction),hits=(Array.isArray(objects)?r.intersectObjects(objects,true):r.intersectObject(objects,true)).filter(h=>material(h.object));for(const h of hits){assert.equal(h.object.material.side,UnitVM12Three.FrontSide);const n=h.face.normal.clone().applyNormalMatrix(new UnitVM12Three.Matrix3().getNormalMatrix(h.object.matrixWorld));assert.ok(n.dot(direction)<-1e-7,'real outward material faces incoming ray');}return hits;};
 const local=h=>h.point.clone().applyMatrix4(inverse),total=new UnitVM12Three.Box3();for(const s of solids){assert.equal(s.material.side,UnitVM12Three.FrontSide);total.union(bbox(s));}
 const envelope=total.getSize(new UnitVM12Three.Vector3()).toArray();[24.000003814697266,40,16.44].forEach((n,i)=>close(envelope[i],n,'own optics/film inclusive envelope'));
 assert.equal(a.front.geometry.index.count/3,2850);assert.equal(a.rear.geometry.index.count/3,1660);const shell=bbox(a.front).union(bbox(a.rear)),shellSize=shell.getSize(new UnitVM12Three.Vector3()).toArray();[24.000003814697266,40,12.7].forEach((n,i)=>close(shellSize[i],n,'unscaled own4510-face native case'));
 for(const x of[-8,8]){for(const[dx,dy]of[[.09,.08],[.4,.07]])assert.equal(shoot([x+dx,-8.2+dy,12],[0,0,-1],[...solids]).length,0,'real native mounting bore remains empty through electronics');for(const d of[[1,.013,0],[-1,.017,0],[.013,1,0],[.017,-1,0]]){const h=shoot([x,-8.2,-.5],d,[a.front,a.rear])[0];assert.ok(h,'native actual bore inner wall');for(const vertexIndex of[h.face.a,h.face.b,h.face.c]){const corner=new UnitVM12Three.Vector3().fromBufferAttribute(h.object.geometry.attributes.position,vertexIndex).applyMatrix4(h.object.matrixWorld).applyMatrix4(inverse);assert.ok(Math.abs(Math.hypot(corner.x-x,corner.y+8.2)-2.425)<.0002,'own native4.85mm bore facet source corners');}}}
 assert.equal(shoot([.13,11.1,12],[0,0,-1],a.front).length,0,'actual native optical aperture');const optical=a.optical,hit=shoot([.13,11.1,12],[0,0,-1],optical.glass)[0];assert.ok(hit);assert.ok(local(hit).z>10.04,'real curved glass apex');assert.ok(shoot([.13,11.1,9],[0,0,-1],optical.opticalStop)[0],'actual deep optical stop,not fake image');
 const barrel=bbox(optical.barrel);close(barrel.max.x-barrel.min.x,14,'own black14mm M12 barrel');close(barrel.min.z,6.45,'actual protruding barrel seat');close(barrel.max.z,9.7,'actual protruding barrel body');close(bbox(optical.glass).max.z,10.05,'actual curved glass front');
 for(const post of optical.posts){const b=bbox(post);close(b.min.z,-2.7,'camera support meets main PCB');close(b.max.z,-2.3,'camera support meets optical subboard');}close(bbox(optical.carrier).min.z,-2.3,'real sensor carrier rests on four supports');
 assert.ok(optical.anchor===u.get('camera'),'own passive optical anchor identity');assert.equal(optical.anchor.kind,'component');assert.equal(optical.anchor.interactive,false);assert.deepEqual(optical.anchor.getState(),{});
 assert.deepEqual(own(u,'port').map(c=>c.id),['grove','usb','sd']);assert.deepEqual(own(u,'button').map(c=>c.id),['buttonA','buttonB']);for(const kind of['led','display','speaker','imu','sensor','joint'])assert.equal(own(u,kind).length,0,'no unsupported '+kind);
 for(const[id,assembly,connector,count]of[['grove',a.input,'grove',4],['usb',a.usb,'usb-c',24],['sd',a.sd,'microsd',9]]){const p=u.get(id);assert.ok(p===assembly.port,'own actual port identity');assert.equal(p.connector,connector);assert.equal(assembly.contacts.length,count);const at=point(p.object3d),mouth=point(assembly.frame);assert.ok(at.distanceTo(mouth)<tol,'actual material mouth and Port frame coincide');}
 close(point(a.input.frame).y,-20,'own actual bottomGrove mouth');close(point(a.usb.frame).z,-4.65,'actual rear USB-C centre');close(point(a.sd.frame).x,-1,'own actual offset SD mouth');assert.equal(a.sd.port.meta.cardInstalled,false);
 assert.ok(shoot([.17,.1,-.1],[0,0,-1],a.input.frame,a.input.frame).some(h=>h.object===a.input.back),'actual Grove deep backing');for(const d of[[1,0,0],[-1,0,0],[0,-1,0]])assert.ok(shoot([.17,.1,-2],d,a.input.frame,a.input.frame)[0],'real Grove cavity floor/side wall');
 a.input.contacts.forEach((c,i)=>{assert.ok(under(c,a.input.frame));const p=a.input.port.object3d.worldToLocal(c.getWorldPosition(new UnitVM12Three.Vector3()));assert.equal(a.input.port.pinAt(p).n,i+1,'four actual contacts match own G/V/G35/G34 grid');close(bbox(a.input.feet[i]).min.z,-2.7,'actual SMT foot meets PCB front');close(bbox(a.input.lands[i]).min.z,-2.7,'actual solderland meets PCB front');});
 assert.ok(shoot([.17,.9,-1],[0,0,-1],a.usb.frame,a.usb.frame)[0],'real recessed USB dielectric wall');assert.ok(shoot([.17,.2,-1],[0,0,-1],a.sd.frame,a.sd.frame)[0],'real recessed empty SD carrier stop');
 assert.equal(a.label.userData.role,'physical-label-substrate');close(bbox(a.label).min.z,-6.39,'own actual rear film outside');close(bbox(a.label).max.z,-6.35,'own rear film touches cyan case');assert.equal([...solids].filter(o=>o.userData.role==='physical-label-substrate').length,1,'no invented CNC front film');
 for(const[id,c]of Object.entries(a.controls)){assert.ok(c.control===u.get(id),'own actual control identity');assert.ok(c.control.shell===a.rear,'own rear native shell identity');for(const fixed of[c.base,c.body,c.lid,...c.terminals])assert.ok(under(fixed,c.frame)&&!under(fixed,c.control.cap));assert.ok(under(c.moving,c.control.cap));assert.equal(c.moving.children.length,2,'actual small plunger plus invisible cap proxy');assert.ok(c.proxy.material.opacity===0&&c.proxy.userData.component===c.control);assert.ok(!under(a.rear,c.control.object3d),'cyan native cap belongs to original shell');}
 return{physicalMeshes:solids.size,nativeFaces:4510,nativeParts:[2850,1660],shellEnvelopeMm:shellSize,physicalEnvelopeMm:envelope,trueMountingBores:2,actualOptics:true,cameraSupports:4,contacts:{grove:4,usb:24,sd:9},nativeSideCaps:2,rearFilms:1,cncFrontFilms:0,passiveCamera:true,localToleranceMm:tol};
}

export function checkUnitVM12Motion(host,u,prefix,events){
 u.root;u.update(0);world(u);assert.ok(Array.isArray(events));
 const a=u.unitVM12Assembly,controls=[u.get('buttonA'),u.get('buttonB')],g=a.rear.geometry,p=g.attributes.position,n=g.attributes.normal;
 const restP=p.array.slice(),restN=n.array.slice(),restIndex=g.index.array.slice(),restPH=hash(restP),restNH=hash(restN),restIH=hash(restIndex),allMask=new Set(),masks=new Map(),componentFrames=new Map(),movingGeometry=new Map();
 for(const[i,c]of controls.entries()){
  const b=a.controls[c.id],expected=i?171:172;assert.equal(c.kind,'button');assert.equal(c.isLatching,false);assert.equal(c.travel,.18);assert.equal(c.sign,i?1:-1);assert.deepEqual(c.axis.toArray(),i?[-1,0,0]:[1,0,0]);assert.ok(c.shell===a.rear,'own rear native shell identity');assert.equal(c.affectedIndices.length,expected);assert.equal(hash(c.rest),restPH);assert.equal(hash(c.norm),restNH);assert.equal(c.weights.length,p.count);assert.equal(c.slopes.length,p.count);assert.ok(under(b.moving,c.cap));assert.ok(!under(b.frame,c.cap));assert.equal(a.rear.userData.component,undefined);
  const mask=new Set(c.affectedIndices);assert.equal(mask.size,expected);for(const j of mask){assert.ok(Number.isInteger(j)&&j>=0&&j<p.count&&!allMask.has(j));allMask.add(j);}masks.set(c,mask);
  for(let j=0;j<p.count;j++){const k=j*3,x=restP[k],y=restP[k+1],z=restP[k+2],inside=c.sign*x>=10.29&&y>=-16.501&&y<=-12.699&&z> -3.15&&z<=.151,t=Math.max(0,Math.min(1,(z+3.15)/3.3)),expectedWeight=inside?t*t*(3-2*t):0;assert.ok(Math.abs(c.weights[j]-expectedWeight)<1e-7,'only exact own native cap/bridge gets smooth weight');assert.equal(mask.has(j),c.weights[j]>0);}
  componentFrames.set(c,stamp(c.object3d.matrixWorld.toArray()));movingGeometry.set(c,b.moving.children.map(o=>stamp({attributes:attrs(o),index:o.geometry.index?hash(o.geometry.index.array):null,localPosition:o.position.toArray(),quaternion:o.quaternion.toArray()})));
 }
 assert.equal(allMask.size,343);const excluded=[a.rear,...controls.map(c=>c.cap)],fixed=physical(u,excluded),rest=physical(u),ports=frames(u),rearFrame=stamp(a.rear.matrixWorld.toArray());
 const peer=new u.constructor({artwork:false});peer.root;const peerGeometry=hash(peer.unitVM12Assembly.rear.geometry.attributes.position.array),peerNormals=hash(peer.unitVM12Assembly.rear.geometry.attributes.normal.array);assert.equal(peerGeometry,restPH);assert.equal(peerNormals,restNH);
 const near=(x,y,n)=>assert.ok(Math.abs(x-y)<.000002,n);
 function verify(){world(u);assert.equal(hash(g.index.array),restIH);assert.equal(stamp(a.rear.matrixWorld.toArray()),rearFrame);assert.equal(physical(u,excluded),fixed,'fixed shell/package/PCB/ports/optics untouched');assert.equal(frames(u),ports);for(let j=0;j<p.count;j++)if(!allMask.has(j))for(let k=0;k<3;k++){assert.equal(p.array[j*3+k],restP[j*3+k]);assert.equal(n.array[j*3+k],restN[j*3+k]);}
  for(const c of controls){const depth=c.getActuationState().depthMm;assert.equal(stamp(c.object3d.matrixWorld.toArray()),componentFrames.get(c));near(c.cap.position.x,-c.sign*depth,'only own plunger/cap proxy moves inward');assert.equal(c.cap.position.y,0);assert.equal(c.cap.position.z,0);assert.deepEqual(a.controls[c.id].moving.children.map(o=>stamp({attributes:attrs(o),index:o.geometry.index?hash(o.geometry.index.array):null,localPosition:o.position.toArray(),quaternion:o.quaternion.toArray()})),movingGeometry.get(c));for(const j of c.affectedIndices){const k=j*3;near(p.array[k],restP[k]-c.sign*depth*c.weights[j],'only exact native cap X deforms');assert.equal(p.array[k+1],restP[k+1]);assert.equal(p.array[k+2],restP[k+2]);let x=restN[k],y=restN[k+1],z=restN[k+2];if(depth){z+=c.sign*depth*c.slopes[j]*x;const l=Math.hypot(x,y,z);x/=l;y/=l;z/=l;}near(n.array[k],x,'actual cap normal X');near(n.array[k+1],y,'actual cap normal Y');near(n.array[k+2],z,'actual cap normal Z');}}
  assert.equal(hash(peer.unitVM12Assembly.rear.geometry.attributes.position.array),peerGeometry,'independent peer native geometry');assert.equal(hash(peer.unitVM12Assembly.rear.geometry.attributes.normal.array),peerNormals,'independent peer native normals');
 }
 function settled(){tick(host);controls.forEach(c=>assert.equal(c.getActuationState().settled,true));verify();}
 function neutral(){controls.forEach(c=>{assert.equal(c.pressed,false);assert.equal(c.getActuationState().depthMm,0);});assert.equal(hash(p.array),restPH);assert.equal(hash(n.array),restNH);assert.equal(hash(g.index.array),restIH);assert.equal(physical(u),rest);assert.equal(frames(u),ports);}
 function held(c){assert.equal(c.pressed,true);assert.equal(c.getActuationState().depthMm,.18);}
 function shape(c){const values=new Float32Array(c.affectedIndices.length*6);c.affectedIndices.forEach((j,i)=>{for(let k=0;k<3;k++){values[i*6+k]=p.array[j*3+k];values[i*6+3+k]=n.array[j*3+k];}});return stamp({values:hash(values),moving:physical(c.cap)});}
 function eventSequence(start,id,actions,cancelled=false){const list=events.slice(start);assert.deepEqual(list.map(e=>e.action),actions);assert.ok(list.every(e=>e.kind==='button'&&e.id===target(prefix,id)));if(cancelled){assert.equal(list.find(e=>e.action==='up')?.cancelled,true);assert.ok(!list.some(e=>e.action==='click'));}}
 const receipts=[];try{neutral();for(const[i,c]of controls.entries()){const other=controls[1-i],beforeOther=shape(other),pointerId=181+i,source='fixture:vm12:'+c.id;let start=events.length;c.onPointerDown({pointerId});host.handle({type:'button',target:target(prefix,c.id),action:'press',source});settled();held(c);assert.equal(shape(other),beforeOther);const length=events.length;c.cancel('unheld');assert.equal(events.length,length);c.onPointerUp({pointerId});settled();held(c);assert.equal(events.length,start+1);host.handle({type:'button',target:target(prefix,c.id),action:'release',source});settled();eventSequence(start,c.id,['down','up','click']);neutral();assert.equal(shape(other),beforeOther);
  start=events.length;host.handle({type:'button',target:target(prefix,c.id),action:'press',source});c.onPointerDown({pointerId});settled();host.handle({type:'button',target:target(prefix,c.id),action:'cancel',source});settled();held(c);assert.equal(events.length,start+1);c.onPointerCancel({pointerId});settled();eventSequence(start,c.id,['down','up'],true);neutral();assert.equal(shape(other),beforeOther);receipts.push({id:c.id,nativeVertices:c.affectedIndices.length,multiSource:true,cancelNoClick:true,neutralPositionsNormalsExact:true});}
  const[A,B]=controls;A.press('dualA');B.press('dualB');settled();held(A);held(B);const heldB=shape(B);A.release('dualA');settled();held(B);assert.equal(shape(B),heldB);A.press('dualA');settled();const heldA=shape(A);B.cancel('dualB');settled();held(A);assert.equal(shape(A),heldA);A.release('dualA');settled();neutral();
  const before=events.length;for(const type of['capture','camera','inference','storage'])assert.throws(()=>host.handle({type,target:target(prefix,'camera'),value:1}));assert.equal(events.length,before);assert.deepEqual(u.get('camera').getState(),{});neutral();
  class WrongVM12 extends Module{static meta={id:'fixture.vm12.wrong',name:'Wrong Grove accessory',connector:'grove'};build(){}}
  const wrong=new WrongVM12();try{for(const id of['usb','sd']){const port=u.get(id),start=events.length,occupant=port.module,shapeBefore=physical(u);assert.equal(port.accepts(wrong),false);assert.throws(()=>port.attach(wrong));assert.ok(port.module===occupant,'rejected attach retains own occupant');assert.equal(wrong.attachedTo,null);assert.equal(events.length,start);assert.equal(physical(u),shapeBefore);}}finally{wrong.dispose();}neutral();
  return{id:'unitv-m12',nativeFaces:4510,controls:receipts,disjointNativeVertices:343,simultaneousReleaseCancelIndependent:true,fixedPackagesPortsAndOptics:true,peerIndependent:true,passiveCameraNoEcho:true,neutralPositionsNormalsAndIndicesExact:true};
 }finally{peer.dispose();}
}

import * as TimerCameraFThree from 'three';

// Own frozen U082-F supplement. Root supplies assert/hash/stamp/own/target/
// world/under/physical/frames/tick/roundtrip; this file only reads product data.
export function checkTimerCameraFPhysical(u){
 u.root;world(u);const a=u.timerCameraFAssembly;assert.ok(a?.parts&&a?.frontFill&&a?.film);
 const native=Object.values(a.parts),frame=native[0].parent,inverse=frame.matrixWorld.clone().invert(),epsilon=1e-5;
 const close=(x,y,label)=>assert.ok(Math.abs(x-y)<epsilon,label+': '+x+'/'+y);
 const opaque=o=>o.isMesh&&o.userData.role!=='printed-artwork'&&o.material.opacity!==0;
 const bbox=o=>new TimerCameraFThree.Box3().setFromBufferAttribute(o.geometry.attributes.position).applyMatrix4(inverse.clone().multiply(o.matrixWorld));
 const localPoint=o=>o.getWorldPosition(new TimerCameraFThree.Vector3()).applyMatrix4(inverse);
 const shoot=(p,d,objects,coordinate=frame)=>{const origin=new TimerCameraFThree.Vector3(...p).applyMatrix4(coordinate.matrixWorld),direction=new TimerCameraFThree.Vector3(...d).transformDirection(coordinate.matrixWorld),ray=new TimerCameraFThree.Raycaster(origin,direction);return(Array.isArray(objects)?ray.intersectObjects(objects,true):ray.intersectObject(objects,true)).filter(h=>opaque(h.object));};
 const hitPoint=h=>h.point.clone().applyMatrix4(inverse),solids=new Set(),add=o=>{if(o?.isObject3D)o.traverse(q=>{if(opaque(q))solids.add(q);});else if(Array.isArray(o))o.forEach(add);};
 for(const o of[...native,a.frontFill,a.infillColumns,...Object.values(a.board),...Object.values(a.fixings),...Object.values(a.battery),a.grove.frame,a.usb.frame,a.usb.feet,...Object.values(a.optics),a.controls.fixed,a.controls.terminals,u.get('power').cap,u.get('reset').cap,a.status.lens,a.film])add(o);
 assert.equal(solids.size,379,'own actual physical assembly excludes attached accessories/cable/artwork/proxies');
 const envelope=new TimerCameraFThree.Box3();for(const o of solids){assert.equal(o.material.side,TimerCameraFThree.FrontSide);envelope.union(bbox(o));}const physicalEnvelope=envelope.getSize(new TimerCameraFThree.Vector3()).toArray();[24,48,23.3].forEach((n,i)=>close(physicalEnvelope[i],n,'own actual nominal optics-inclusive assembly'));
 assert.deepEqual(native.map(o=>o.geometry.index.count/3),[7912,1584]);assert.equal(native.reduce((n,o)=>n+o.geometry.index.count/3,0),9496);
 const shell=new TimerCameraFThree.Box3();native.forEach(o=>shell.union(bbox(o)));const shellEnvelope=shell.getSize(new TimerCameraFThree.Vector3()).toArray();[24,48,22.39441967010498].forEach((n,i)=>close(shellEnvelope[i],n,'unaltered9496native source shell'));
 close(bbox(a.frontFill).min.z,7.4,'actual continuous internal web starts within shell thickness');close(bbox(a.frontFill).max.z,9.5,'no broad external coplanar overlay');assert.equal(a.infillColumns.length,24);
 for(const column of a.infillColumns){const b=bbox(column),p=b.getCenter(new TimerCameraFThree.Vector3());close(b.min.z,9.3,'real column overlaps internal web');close(b.max.z,10,'only exact native mouth reaches photographed plain front');close(bbox(a.frontFill).max.z-b.min.z,.2,'true continuous bulk-plastic overlap');assert.ok(column.material===a.frontFill.material,'own continuous fill material identity');assert.ok(column.material===native[0].material,'own native plastic material identity');assert.equal(column.userData.nativeMouthOnly,true);const hit=shoot([p.x,p.y,20],[0,0,-1],[...solids])[0];assert.ok(hit?.object===column);close(hitPoint(hit).z,10,'true material closes only former dot mouth');}
 for(const[x,y]of[[0,10],[8.4,20.75],[9,13.65]])assert.ok(shoot([x,y,30],[0,0,-1],native).every(h=>hitPoint(h).z<0),'real native lens/LED-slot/reset-pinhole remain open');
 close(bbox(a.optics.glass).max.z,13.3,'own3.3mm curved optical glass');close(bbox(a.optics.glass).min.z,12.39441967010498,'glass seated on native lens carrier');assert.ok(shoot([.13,10,30],[0,0,-1],[...solids])[0]?.object===a.optics.glass);assert.ok(shoot([.13,10,12.2],[0,0,-1],a.optics.inner)[0],'real opaque deep optical backing');
 assert.ok(a.camera===u.get('camera'));assert.equal(a.camera.kind,'component');assert.equal(a.camera.interactive,false);assert.equal(a.camera.meta.role,'visual-anchor');assert.deepEqual(a.camera.getState(),{});
 close(bbox(a.board.pcb).min.z,-3.4,'actual blackPCB rear');close(bbox(a.board.pcb).max.z,-2.4,'actual blackPCB front');assert.equal(a.board.fpcContacts.length,24);assert.equal(a.board.pins.length,98);assert.equal(a.board.barrels.length,4);assert.equal(a.board.lands.length,8);assert.equal(a.board.statusFeet.length,2);
 close(bbox(a.battery.foil).getSize(new TimerCameraFThree.Vector3()).z,2.6,'inferred270mAh pouch thickness');assert.equal(a.battery.leads.length,2);assert.ok(bbox(a.battery.foil).min.z>shell.min.z&&bbox(a.battery.foil).max.z<bbox(a.board.pcb).min.z);
 assert.deepEqual(own(u,'port').map(c=>c.id),['grove','usb','mount']);assert.deepEqual(own(u,'button').map(c=>c.id),['power','reset']);assert.deepEqual(own(u,'led').map(c=>c.id),['status']);for(const kind of['display','sensor','imu','joint'])assert.equal(own(u,kind).length,0);
 for(const[id,part,connector]of[['grove',a.grove,'grove'],['usb',a.usb,'usb-c']]){assert.ok(u.get(id)===part.port);assert.equal(part.port.connector,connector);assert.ok(localPoint(part.port.object3d).distanceTo(localPoint(part.frame))<epsilon);close(localPoint(part.frame).y,-23.99,'actual lower material mouth coincides with port');}
 assert.equal(a.grove.contacts.length,4);assert.equal(a.grove.returns.length,4);assert.equal(a.grove.tails.length,4);const grove=a.grove;
 for(let i=0;i<4;i++){assert.ok(shoot([(i-1.5)*2,-.15,1],[0,0,-1],grove.frame,grove.frame)[0]?.object===grove.contacts[i]);const t=bbox(grove.tails[i]);close(t.getCenter(new TimerCameraFThree.Vector3()).x,(i-1.5)*2,'actual tail aligns to own2mm pitch');close(t.min.z,-3.4,'real terminal passes PCB rear');close(t.max.z,-2.4,'real terminal passes PCB front');const x=(i-1.5)*2,y=-17.79;assert.equal(shoot([x,y,0],[0,0,-1],a.board.pcb).length,0,'true substrate drill');for(const d of[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0]])close(shoot([x,y,-2.9],d,a.board.pcb)[0]?.distance,.47,'actual FrontSidePCB bore wall');}
 assert.ok(shoot([0,0,1],[0,0,-1],grove.frame,grove.frame)[0]?.object===grove.back);for(const[d,n]of[[[1,0,0],4.35],[[-1,0,0],4.35],[[0,-1,0],1.95]])close(shoot([0,0,-2],d,[grove.floor,...grove.walls],grove.frame)[0]?.distance,n,'real receiving cavity wall');
 assert.equal(a.usb.contacts.length,24);assert.ok(shoot([0,1,1],[0,0,-1],a.usb.frame,a.usb.frame)[0]?.object===a.usb.back);assert.ok(shoot([.2,0,1],[0,0,-1],a.usb.frame,a.usb.frame)[0]?.object===a.usb.tongue);
 close(bbox(a.film).min.z,-9.84,'rear film exposed face');close(bbox(a.film).max.z,-9.8,'physical film rests in native recess');close(hitPoint(shoot([0,3,-30],[0,0,1],native)[0]).z,-9.800000190734863,'actual native film support');assert.equal(a.film.userData.role,'physical-label-substrate');assert.equal([...solids].filter(o=>o.userData.role==='physical-label-substrate').length,1,'no invented front paper');
 assert.equal(a.fixings.heads.length,2);for(const[i,x]of[-8.5,8.5].entries()){assert.ok(shoot([x,-21,-20],[0,0,1],a.fixings.floors[i])[0],'real recessed silver fixing floor');close(bbox(a.fixings.shanks[i]).max.z,-5.55,'real fixing reaches native boss seat');}
 for(const id of['power','reset']){const c=u.get(id);assert.ok(a.controls[id]===c);for(const fixed of[...a.controls.fixed,...a.controls.terminals])assert.ok(!under(fixed,c.cap));}assert.ok(shoot([-20,-14.7,-5.25],[1,0,0],[...solids])[0]?.object===u.get('power').cap.children[0]);const resetHit=shoot([9.03,13.67,30],[0,0,-1],[...solids])[0];assert.ok(resetHit&&under(resetHit.object,u.get('reset').cap),'actual reset plunger visible through original pinhole');assert.ok(shoot([8.4,20.75,30],[0,0,-1],[...solids])[0]?.object===a.status.lens,'real blueLED behind upper slot');
 const mount=u.get('mount');assert.ok(mount===a.mount);assert.equal(mount.connector,'m5.timercamera.u082f.rear-mount');close(localPoint(mount.object3d).z,-10,'actual static rear mount datum');let accessory=null;
 if(mount.module){const module=mount.module,b=module.timerCameraFAccessory;assert.ok(b?.nativeMesh&&b?.frame&&b?.parts);assert.ok(under(b.nativeMesh,b.frame));assert.equal(own(module,'joint').length,0);const faces=b.nativeMesh.geometry.index.count/3;assert.equal(faces,b.kind==='clip'?2150:1966);assert.equal(b.nativeMesh.material.side,TimerCameraFThree.FrontSide);close(b.frame.rotation.x,Math.PI/2,'own static source installation frame');close(b.frame.position.y,-10,'own static source frame restoration');accessory={kind:b.kind,nativeFaces:faces,static:true};}
 return{physicalMeshes:solids.size,nativeBodyFaces:9496,nativeParts:[7912,1584],shellEnvelopeMm:shellEnvelope,physicalEnvelopeMm:physicalEnvelope,continuousMouthClosures:24,overlapMm:.2,actualOptics:true,contacts:{grove:4,usb:24},pcbBores:4,actualFixings:2,physicalFilms:1,filmTouchesNativeRecess:true,actualControlOpenings:true,passiveCamera:true,configuredAccessory:accessory,localToleranceMm:epsilon};
}

export function checkTimerCameraFOutput(host,u,prefix,events){
 u.root;world(u);const a=u.timerCameraFAssembly,led=u.get('status'),rest=led.getState();assert.equal(led.kind,'led');assert.equal(rest.color,'#168aff');assert.equal(rest.brightness,0);assert.ok(a.status===led&&led.lens?.isMesh);assert.ok(led.lensMaterial===led.lens.material,'own actual emitter material identity');
 const beforeShape=physical(u),beforePorts=frames(u),hostPeers=physical(host,[u.root]),controls=stamp(own(u,'button').map(c=>({id:c.id,state:c.getState(),actuation:c.getActuationState()}))),start=events.length,initialEmissive=led.lensMaterial.emissive.getHex();
 const frame=Object.values(a.parts)[0].parent,origin=frame.localToWorld(new TimerCameraFThree.Vector3(8.4,20.75,30)),direction=new TimerCameraFThree.Vector3(0,0,-1).transformDirection(frame.matrixWorld);
 const path=new TimerCameraFThree.Raycaster(origin,direction).intersectObject(frame,true).filter(h=>h.object.isMesh&&h.object.userData.role!=='printed-artwork'&&h.object.material.opacity!==0);assert.ok(path[0]?.object===led.lens,'actual physical LED is first material visible through original upper slot');
 const unchanged=()=>{assert.equal(physical(u),beforeShape);assert.equal(frames(u),beforePorts);assert.equal(physical(host,[u.root]),hostPeers,'LED output leaves all sibling/host geometry intact');assert.equal(stamp(own(u,'button').map(c=>({id:c.id,state:c.getState(),actuation:c.getActuationState()}))),controls,'external light output has no automatic button/power/reset logic');assert.equal(events.length,start,'external indicator output has no input echo');};
 try{for(const brightness of[.23,.81]){host.handle({type:'led',target:target(prefix,'status'),brightness});assert.deepEqual(led.getState(),{color:'#168aff',brightness});const expected=new TimerCameraFThree.Color(0x168aff).multiplyScalar(brightness*2);assert.ok(Math.abs(led.lensMaterial.emissive.r-expected.r)+Math.abs(led.lensMaterial.emissive.g-expected.g)+Math.abs(led.lensMaterial.emissive.b-expected.b)<1e-8);assert.notEqual(led.lensMaterial.emissive.getHex(),initialEmissive);unchanged();}
  const state=led.getState(),emissive=led.lensMaterial.emissive.getHex();for(const color of['#ff0000','#00ff00']){assert.throws(()=>host.handle({type:'led',target:target(prefix,'status'),color,brightness:.1}));assert.deepEqual(led.getState(),state);assert.equal(led.lensMaterial.emissive.getHex(),emissive);unchanged();}
  host.update(.5);assert.deepEqual(led.getState(),state,'no invented camera/RTC/power-driven light animation');unchanged();host.handle({type:'led',target:target(prefix,'status'),on:false});assert.deepEqual(led.getState(),{color:'#168aff',brightness:0});host.handle({type:'led',target:target(prefix,'status'),on:true});assert.deepEqual(led.getState(),{color:'#168aff',brightness:1});unchanged();
 }finally{led.set(rest);}
 assert.deepEqual(led.getState(),rest);assert.equal(led.lensMaterial.emissive.getHex(),initialEmissive);unchanged();return{count:1,fixedColor:'#168aff',fields:['on','brightness'],actualUpperSlotLightPath:true,externalNoEcho:true,realEmitterMaterial:true,noAutomaticFirmwareLogic:true,peerPhysicalAndPortsUnchanged:true,neutralRestored:true};
}

import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const ids=['unitv2-usb','unitv-m12','timercamera-f'];
const expectedApi={"unitv2-usb":{"body":["grove","usb-a","usb","sd","user","mount"],"ports":["grove","usb-a","usb","sd","mount"],"controls":["user"],"leds":[],"displays":[],"joints":[],"canonical":"grove"},"unitv-m12":{"body":["grove","usb","sd","buttonA","buttonB","camera"],"ports":["grove","usb","sd"],"controls":["buttonA","buttonB"],"leds":[],"displays":[],"joints":[],"canonical":"grove"},"timercamera-f":{"body":["grove","usb","power","reset","status","camera","mount"],"ports":["grove","usb","mount"],"controls":["power","reset"],"leds":["status"],"displays":[],"joints":[],"canonical":"grove"}},expectedPrint={"unitv2-usb":{"default":{"kinds":["reference-redraw"]},"cases":[]},"unitv-m12":{"default":{"kinds":["reference-redraw","reference-redraw"]},"cases":[]},"timercamera-f":{"default":{"kinds":["source-vector-raster"]},"cases":[]}};
function checkBoundary(u,id){
 u.root;const a=expectedApi[id],body=[...u.components.keys()].filter(k=>!['unitFrame','cable'].includes(k));assert.deepEqual(body,a.body);
 for(const[kind,key]of[['port','ports'],['button','controls'],['led','leds'],['display','displays'],['joint','joints']])assert.deepEqual(own(u,kind).map(c=>c.id),a[key]);
 for(const kind of['sensor','speaker','rotary-selector','led-matrix'])assert.equal(own(u,kind).length,0,'no invented readings,protocol,servo or firmware component');
 for(const c of own(u,'component')){assert.equal(c.interactive,false);assert.deepEqual(c.getState(),{});}
 assert.equal(u.get(a.canonical).connector,'grove');return{id,body,ports:a.ports,controls:a.controls,leds:a.leds,displays:a.displays,joints:a.joints};
}
function checkPhysical(u,id){return id==='unitv2-usb'?checkUnitV2USBPhysical(u):id==='unitv-m12'?checkUnitVM12Physical(u):checkTimerCameraFPhysical(u);}
function checkControls(host,u,id,prefix,events){
 if(id==='unitv2-usb')return checkUnitV2USBMotion(host,u,prefix,events);
 if(id==='unitv-m12')return checkUnitVM12Motion(host,u,prefix,events);
 const momentaries=expectedApi[id].controls.filter(k=>!u.get(k).isLatching),stable=expectedApi[id].controls.filter(k=>u.get(k).isLatching),report={};
 if(momentaries.length){report.individual=checkMomentaries(host,u,prefix,events,momentaries);report.simultaneous=checkSimultaneousMomentaries(host,u,events,momentaries);}
 if(stable.length)report.stable=stable.map(key=>checkStableSlide(host,u,key,prefix,events));
 return report;
}
function artworkMotion(on,off){
 const report=[];for(const a of own(on,'button')){
  const b=off.get(a.id),original=a.position;a.press('fixture:ink');b.press('fixture:ink');on.update(.035);off.update(.035);assert.ok(a.getActuationState().depthMm>0||a.isLatching);assert.equal(physical(on),physical(off),'actual partial control motion retains every physical record without ink');a.cancel('fixture:ink');b.cancel('fixture:ink');tick(on);tick(off);
  if(a.isLatching){a.setPosition(original,{immediate:true});b.setPosition(original,{immediate:true});}
  assert.equal(physical(on),physical(off));report.push(a.id);
 }return report;
}
function staticMounting(u,id){
 const report=[];for(const key of expectedApi[id].ports){const p=u.get(key);if(!p.module)continue;
  const item=p.module;item.root;assert.equal(own(item,'joint').length,0,'actual static mounting accessory has no invented joint');assert.equal(own(item,'button').length,0);assert.equal(own(item,'led').length,0);assert.equal(own(item,'display').length,0);
  const before=physical(u),ports=frames(u),accessoryShape=stamp(records(item).map(({matrix,...r})=>r));roundtrip(u,p);assert.equal(physical(u),before);assert.equal(frames(u),ports);assert.equal(stamp(records(item).map(({matrix,...r})=>r)),accessoryShape);
  report.push({port:key,connector:p.connector,accessory:item.constructor.name,ownPorts:own(item,'port').map(c=>c.id),staticDetachReattach:'pass'});
 }return report;
}
function passiveBoundary(host,u,id,prefix,events){
 const report=[];for(const c of own(u,'component')){const shape=physical(u),ports=frames(u),n=events.length;
  for(const type of['capture','camera','inference','storage','rtc','power'])assert.throws(()=>host.handle({type,target:target(prefix,c.id),value:1}));
  assert.deepEqual(c.getState(),{});assert.equal(physical(u),shape);assert.equal(frames(u),ports);assert.equal(events.length,n);report.push(c.id);
 }return{id,passiveAnchors:report,noFirmwareOrProtocolBehavior:true};
}

/** Own U078-USB/U078-V-M12/U082-F structures and actual visual input/output boundaries. */
export async function checkUnitVUSBFamilies(){
 const restore=installCanvasStub();let host;
 try{
  const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));host=await loadModel('sticks3');host.root;host.display().fill('#123456');const framebuffer=hash(host.display().buffer),hub=await loadGroveModule('hub');host.port('grove').attach(hub);
  const units={},events=[],components=[],artwork=[],configurations=[],controls=[],outputs=[],accessories=[],boundaries=[];host.on('input',e=>{if(e.kind!=='port')events.push(e);});
  for(const[i,id]of ids.entries()){
   const attachedOptions=id==='unitv2-usb'?{clip:true}:id==='timercamera-f'?{mount:'wall1515'}:{};const u=await loadGroveModule(id,{...attachedOptions,cableLength:75+i*15});hub.get(`grove-${i+1}`).attach(u);host.update(0);units[id]=u;assert.equal(u.get('cable').getState().wireCount,4);components.push(checkBoundary(u,id));
   const product=catalog.products.find(p=>p.id===id),seen=new Set();
   for(const options of[{},...product.configurations.map(c=>c.options)]){
    const k=JSON.stringify(Object.fromEntries(Object.entries(options).sort(([a],[b])=>a.localeCompare(b))));if(seen.has(k))continue;seen.add(k);
    for(const load of[loadModel,loadGroveModule]){
     const on=await load(id,options),off=await load(id,{...options,artwork:false});try{
      on.root;off.root;on.update(0);off.update(0);checkBoundary(on,id);checkBoundary(off,id);assert.equal(physical(on),physical(off),'all physical attributes/index/world survive ink removal');assert.equal(frames(on),frames(off));assert.equal(panels(off).length,0);
      const kinds=panels(on).map(p=>p.userData.artworkKind).sort(),expected=expectedPrint[id].cases.find(c=>JSON.stringify(c.options)===k)??expectedPrint[id].default;assert.deepEqual(kinds,[...expected.kinds].sort());const moving=artworkMotion(on,off);
      const shape=checkPhysical(on,id),mounts=staticMounting(on,id);if(load===loadModel&&k==='{}')artwork.push({id,panels:kinds.length,kinds,actualPartialMotionIds:moving,physicalStructure:shape,staticMounting:mounts});
     }finally{on.dispose();off.dispose();}
    }
   }configurations.push({id,optionCases:seen.size,entries:2,physicalAttributesIndexWorld:'identical with ink off,including actual partial native/cap motion'});
  }
  const prefix=i=>`grove/grove-${i+1}`;
  for(const[i,id]of ids.entries()){
   const u=units[id],peers=ids.filter(x=>x!==id),snapshot=peers.map(x=>physical(units[x]));components.find(c=>c.id===id).physicalStructure=checkPhysical(u,id);controls.push({id,...checkControls(host,u,id,prefix(i),events)});
   if(expectedApi[id].leds.length)outputs.push({id,...(id==='timercamera-f'?checkTimerCameraFOutput(host,u,prefix(i),events):checkIndependentLights(host,u,prefix(i),events,expectedApi[id].leds))});
   accessories.push({id,mounting:staticMounting(u,id)});boundaries.push(passiveBoundary(host,u,id,prefix(i),events));checkWrongFamily(host,u,prefix(i),expectedApi[id].ports,events);assert.deepEqual(peers.map(x=>physical(units[x])),snapshot);assert.equal(hash(host.display().buffer),framebuffer);
  }
  for(const[i,id]of ids.entries()){
   const u=units[id],before=physical(u),n=events.length;host.handle({type:'pose',target:target(prefix(i),'unitFrame'),position:[i*55,195+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:target(prefix(i),'cable'),slack:12,bend:[0,0,-1]});host.update(0);assert.notEqual(physical(u),before);assert.equal(u.get('cable').getState().wireCount,4);assert.equal(events.length,n);components.find(c=>c.id===id).transformedStructure=checkPhysical(u,id);
   checkControls(host,u,id,prefix(i),events);staticMounting(u,id);checkWrongFamily(host,u,prefix(i),expectedApi[id].ports,events);
  }
  assert.equal(hash(host.display().buffer),framebuffer);const disposal=observeDisposal(host.root);
  for(const[i,id]of ids.entries()){
   const peers=ids.filter(x=>x!==id),before=peers.map(x=>physical(units[x])),p=hub.get(`grove-${i+1}`),part=p.detach({dispose:false});assert.ok(part===units[id]);assert.deepEqual(peers.map(x=>physical(units[x])),before);p.attach(part);host.update(0);assert.equal(part.get('cable').getState().wireCount,4);
  }
  const beforeLast=[physical(units['unitv2-usb']),physical(units['unitv-m12'])];hub.get('grove-3').detach();assert.deepEqual([physical(units['unitv2-usb']),physical(units['unitv-m12'])],beforeLast);assert.equal(hash(host.display().buffer),framebuffer);host.dispose();host=null;const disposedResources=disposal();
  return{status:'pass',components,artwork,configurations,controls,outputs,accessories,boundaries,disposedResources,cases:['three-real-four-core-branches','own-native-closed-halves-no-cropped-faces-or-stretched-replicas','own-real-native-flexure-side-buttons-fixed-switches','own-USB-A-hood-no-invented-camera','own-M12-optics-and-TimerF-fisheye-carriers','actual-static-mounting-accessories-detach-reattach','both-entries-actual-presets-and-partial-motion-ink-physical-invariance','transformed-parent-physical-structure-ports-cancel-peer-isolation','host-framebuffer-and-observed-resource-disposal'],scope:'Own three physical assemblies,matching print and actual external controls/outputs;Node DOM/canvas boundary fixture;no browser/GPU/manufacturing/productionfit/hardware/sensorvalues/USB-UART-AI-camera-RTC-firmware/electrical/whole-history acceptance'};
 }finally{host?.dispose();restore();}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkUnitVUSBFamilies(),null,2));
