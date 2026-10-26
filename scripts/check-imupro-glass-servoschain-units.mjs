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
 class Wrong extends Module{static meta={id:'fixture.batch42.wrong',name:'Wrong mechanical family',connector:'fixture-incompatible-family'};build(){}}
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

import * as ImuProThree from 'three';

// Concatenated with fixture-parts.mjs; assert/world/own/under are shared.
// Read-only own U171 physical facts. Root owns artwork/cable/peer/roundtrip tests.
export function checkMiniImuProPhysical(u){
 u.root;world(u.root);
 const a=u.miniIMUProAssembly;
 assert.equal(u.meta.sku,'U171');assert.ok(a?.shell?.front?.isMesh&&a?.board?.pcb?.isMesh);
 const frame=a.board.pcb.parent,inverse=frame.matrixWorld.clone().invert(),eps=1e-5;
 const close=(x,y,message)=>assert.ok(Math.abs(x-y)<eps,message);
 const point=o=>o.getWorldPosition(new ImuProThree.Vector3()).applyMatrix4(inverse);
 const bounds=o=>new ImuProThree.Box3().setFromBufferAttribute(o.geometry.attributes.position).applyMatrix4(inverse.clone().multiply(o.matrixWorld));
 const material=o=>o.isMesh&&o.userData.role!=='printed-artwork'&&o.material?.opacity!==0;
 const shoot=(p,d,objects,coordinates=frame)=>{
  const origin=new ImuProThree.Vector3(...p).applyMatrix4(coordinates.matrixWorld),direction=new ImuProThree.Vector3(...d).transformDirection(coordinates.matrixWorld),r=new ImuProThree.Raycaster(origin,direction);
  const h=(Array.isArray(objects)?r.intersectObjects(objects,false):r.intersectObject(objects,true)).filter(x=>material(x.object));
  for(const x of h){assert.equal(x.object.material.side,ImuProThree.FrontSide);const normal=x.face.normal.clone().applyNormalMatrix(new ImuProThree.Matrix3().getNormalMatrix(x.object.matrixWorld));assert.ok(normal.dot(direction)<-1e-7,'actual material wall faces incoming ray');}
  return h;
 };
 const hitLocal=h=>h.point.clone().applyMatrix4(inverse);
 const shell=a.shell,board=a.board,c=a.input;
 for(const p of[shell.front,shell.frontShelf,shell.rear,shell.rearShelf,...shell.bores,...shell.walls,shell.boss,...shell.snapSeats,...shell.relief,board.pcb,...board.barrels,...board.lands,...Object.values(board.sensors),...board.terminals,board.ldo,...board.passives,...board.passiveEnds,...board.serviceLands,...Object.values(a.fixing),...Object.values(a.films)])assert.ok(p.isMesh&&p.parent===frame&&under(p,u.body),'each own fixed physical part belongs to exact U171 body frame');
 const f=bounds(shell.front),rear=bounds(shell.rear),pcb=bounds(board.pcb);
 close(f.min.x,-12,'own24mm left');close(f.max.x,12,'own24mm right');close(f.min.y,-12,'own24mm lower edge');close(f.max.y,12,'own24mm upper edge');close(f.max.z,4,'actual front skin');close(rear.min.z,-4,'actual rear skin');close(pcb.min.z,-2,'actual PCB back');close(pcb.max.z,-1.2,'actual .8mm PCB front');
 assert.equal(shell.bores.length,2);let mountingEmptyRays=0,mountingWallRays=0;
 for(const[x,barrel]of[[-8,shell.bores[0]],[8,shell.bores[1]]]){
  for(const sign of[-1,1]){assert.equal(shoot([x+.13,.07,sign*7],[0,0,-sign],[shell.front,shell.frontShelf,shell.rear,shell.rearShelf,...shell.bores,board.pcb]).length,0,'actual own Ø5 mounting axis open through skins,walls and PCB relief');mountingEmptyRays++;}
  // Ellipse sampling doubles curveSegments48 to96 sides. Interior probes hit
  // straight chords, whose maximum inward sag is r*(1-cos(pi/96)).
  assert.equal(barrel.geometry.parameters.options.curveSegments,48);const boreChordToleranceMm=2.5*(1-Math.cos(Math.PI/96))+eps;
  for(const dir of[[1,.013,0],[-1,.017,0],[.019,1,0],[.011,-1,0]]){const h=shoot([x,0,0],dir,barrel)[0];assert.ok(h);const p=hitLocal(h);assert.ok(Math.abs(Math.hypot(p.x-x,p.y)-2.5)<boreChordToleranceMm,'actual FrontSide polygonal Ø5 bore material within exact chord sag');mountingWallRays++;}
 }
 assert.deepEqual(Object.keys(board.sensors),['bmi270','bmm150','bmp280']);assert.equal(board.terminals.length,37,'14LGA+12WLCSP+8LGA+3LDO fixed terminations');assert.equal(board.passives.length,11,'own schematic3R8C');assert.equal(board.passiveEnds.length,22);assert.equal(board.serviceLands.length,2);
 let packageSupportRays=0;
 for(const[name,w,h,height]of[['bmi270',2.5,3,.83],['bmm150',1.56,1.56,.6],['bmp280',2,2.5,.95]]){
  const part=board.sensors[name],bb=bounds(part),p=point(part);close(bb.max.x-bb.min.x,w,'own linked '+name+' width');close(bb.max.y-bb.min.y,h,'own linked '+name+' length');close(bb.max.z,-1.2+height,'own linked '+name+' total mounted envelope');const support=shoot([p.x+.11,p.y+.07,0],[0,0,-1],board.pcb)[0];assert.ok(support,'real PCB under inferred own package installation');close(hitLocal(support).z,-1.2,'actual PCB support plane');packageSupportRays++;
 }
 assert.ok(shoot([0,9.8,1],[0,0,-1],board.pcb)[0],'real green carrier beneath own service opening');
 assert.equal(own(u,'button').length,0,'unlocated SW1 does not become guessed external control');for(const kind of['led','display','sensor','imu','joint','component'])assert.equal(own(u,kind).length,0);
 assert.equal(own(u,'port').length,1);assert.ok(c.port===u.get('grove'));assert.equal(c.port.connector,'grove');assert.equal(c.port.meta.physicalFamily,'HY2.0-4P receiving socket');
 const mouth=point(c.frame),pp=point(c.port.object3d);assert.ok(mouth.distanceTo(pp)<eps);close(mouth.x,0,'own receiving mouthX');close(mouth.y,-11.96,'own receiving mouthY');close(mouth.z,1.4,'own receiving mouthZ');
 const outward=new ImuProThree.Vector3(0,1,0).transformDirection(c.port.object3d.matrixWorld).transformDirection(inverse);assert.ok(outward.distanceTo(new ImuProThree.Vector3(0,-1,0))<eps,'actual lower receiving mating frame');
 assert.equal(c.contacts.length,4);assert.equal(c.returns.length,4);assert.equal(c.tails.length,4);assert.equal(board.barrels.length,4);assert.equal(board.lands.length,8);
 for(const p of[c.floor,c.back,c.bridge,...c.walls,...c.guides,...c.contacts,...c.returns,...c.tails])assert.ok(p.isMesh&&p.parent===c.frame&&under(p,frame),'actual four-contact receiving socket materials remain on own fixed frame');
 let actualMetalContactRays=0;
 for(let i=0;i<4;i++){
  close(c.contacts[i].position.x,(i-1.5)*2,'actual2mm terminal pitch');const h=shoot([(i-1.5)*2,-.15,1],[0,0,-1],c.frame,c.frame)[0];assert.ok(h?.object===c.contacts[i]);const p=h.point.clone().applyMatrix4(c.frame.matrixWorld.clone().invert());close(p.z,-.95,'own recessed contact front');actualMetalContactRays++;
  const t=bounds(c.tails[i]);close(t.getCenter(new ImuProThree.Vector3()).x,(i-1.5)*2,'tail aligned with real PCB plated bore');close(t.getCenter(new ImuProThree.Vector3()).y,-5.76,'tail passes through ownPCB y datum');assert.ok(t.min.z<-2&&t.max.z>=-1.2-eps);
 }
 assert.ok(shoot([.13,0,1],[0,0,-1],c.frame,c.frame)[0]?.object===c.back,'real dielectric backing closes receiving cavity');close(bounds(c.floor).min.z,pcb.max.z,'real socket floor meets actualPCB plane');
 assert.equal(Object.keys(a.films).length,3);for(const p of Object.values(a.films)){assert.equal(p.userData.role,'physical-label-substrate');close(bounds(p).getSize(new ImuProThree.Vector3()).z,.04,'real independent adhesive substrate thickness');}
 return{geometrySource:'own-dimensioned-parametric-no-CAD',nominalMm:[24,24,8],mountingBores:2,mountingEmptyRays,mountingWallRays,ownPackages:['BMI270','BMM150','BMP280'],packageSupportRays,physicalGroveContacts:4,actualMetalContactRays,platedPcbBores:4,physicalFilms:3,unresolvedSW1NotGuessed:true,allChecksInOwnBodyCoordinates:true};
}

import * as GlassThree from 'three';

// Concatenated root fixture supplies assert/world/own/under. Product/research
// are frozen. This supplement only reads exact U158 physical facts; root owns
// multi-source, framebuffer formats, style/touch atomic rejection, artwork,
// cable/peers and lifecycle checks. No runtime is executed by this author.
export function checkGlassPhysical(u){
 u.root;world(u.root);
 const a=u.glassAssembly;
 assert.ok(a?.board?.pcb?.isMesh,'own original U158 assembly required');
 const frame=a.board.pcb.parent,inverse=frame.matrixWorld.clone().invert(),tol=1e-5;
 const close=(x,y,n)=>assert.ok(Math.abs(x-y)<tol,n);
 const bounds=o=>new GlassThree.Box3().setFromBufferAttribute(o.geometry.attributes.position).applyMatrix4(inverse.clone().multiply(o.matrixWorld));
 const point=o=>o.getWorldPosition(new GlassThree.Vector3()).applyMatrix4(inverse);
 const material=o=>o.isMesh&&o.userData.role!=='printed-artwork'&&o.userData.role!=='emissive-pixel-overlay'&&o.material.opacity!==0;
 const physical=new Set(),collect=o=>o.traverse(q=>{if(material(q))physical.add(q);});
 const shoot=(p,d,objects,coordinate=frame)=>{
  const origin=new GlassThree.Vector3(...p).applyMatrix4(coordinate.matrixWorld),direction=new GlassThree.Vector3(...d).transformDirection(coordinate.matrixWorld);
  const ray=new GlassThree.Raycaster(origin,direction),hits=(Array.isArray(objects)?ray.intersectObjects(objects,false):ray.intersectObject(objects,true)).filter(h=>material(h.object));
  for(const h of hits){assert.equal(h.object.material.side,GlassThree.FrontSide,'real outward material');const normal=h.face.normal.clone().applyNormalMatrix(new GlassThree.Matrix3().getNormalMatrix(h.object.matrixWorld));assert.ok(normal.dot(direction)<-1e-7,'ray hits actual front face');}
  return hits;
 };
 const local=h=>h.point.clone().applyMatrix4(inverse),b=a.board,p=a.panel,g=a.grove,c=a.cover;
 for(const object of[b.pcb,...b.pads,...b.parts,...b.terminals,...b.lands,...b.mcuPins,b.fpcBody,b.latch,...b.fpcContacts,p.base,p.cap,...p.edge,...p.support,p.driver,p.flex,...p.tracks,g.frame,c.plate,...c.columns,...c.frontPads,...c.screws.map(s=>s.group),...a.controls.flatMap(k=>[k.frame,k.moving])])collect(object);
 assert.equal(physical.size,331,'complete own U158 solid assembly; excludes display emission/artwork/cable/attached children');
 const total=new GlassThree.Box3();for(const o of physical){assert.equal(o.material.side,GlassThree.FrontSide);total.union(bounds(o));}
 const envelope=total.getSize(new GlassThree.Vector3()).toArray();[42.04,53,6].forEach((v,i)=>close(envelope[i],v,'actual U158 envelope preserves42.04mm own glass'));
 const boardBox=bounds(b.pcb);close(boardBox.min.x,-21,'42mm own board');close(boardBox.max.x,21,'42mm own board');close(boardBox.max.y,26.5,'own top datum');close(boardBox.min.y,-26.5,'own mounting ear bottom');close(boardBox.min.z,2.2,'rear PCB plane');close(boardBox.max.z,2.8,'front PCB plane');
 for(const x of[-16,16]){
  for(const[dx,dy]of[[.09,.07],[.41,.08]])assert.equal(shoot([x+dx,-23.5+dy,4],[0,0,-1],[...physical]).length,0,'real empty ear bore through entire own assembly');
  for(const d of[[1,.013,0],[-1,.017,0],[.011,1,0],[.017,-1,0]]){const h=shoot([x,-23.5,2.5],d,b.pcb)[0];assert.ok(h,'actual FrontSide ear bore wall');const q=local(h);assert.ok(Math.abs(Math.hypot(q.x-x,q.y+23.5)-1.5)<.001,'inferred true1.5mm ear radius');}
 }
 for(const[x,y]of[[.17,15],[17.7,16],[-17.7,16],[.17,5.1],[.17,23.9]])assert.equal(shoot([x,y,4],[0,0,-1],b.pcb).length,0,'own37×19mm window retains real opening');
 close(local(shoot([18.65,15,4],[0,0,-1],b.pcb)[0]).z,2.8,'board material beside real window');
 for(const [mesh,w,h,z0,z1]of[[p.base,42.04,27.22,.8,1.5],[p.cap,42.04,21.04,1.5,2.05]]){
  const bb=bounds(mesh);close(bb.max.x-bb.min.x,w,'own panel width');close(bb.max.y-bb.min.y,h,'own panel glass height');close(bb.min.z,z0,'physical lower glass plane');close(bb.max.z,z1,'physical upper glass plane');assert.equal(mesh.material.transparent,true);assert.ok(mesh.material.opacity>0&&mesh.material.opacity<1);assert.equal(mesh.material.depthWrite,false);
 }
 const frontGlass=shoot([5,16,4],[0,0,-1],[p.base,p.cap])[0],rearGlass=shoot([5,16,0],[0,0,1],[p.base,p.cap])[0];assert.ok(frontGlass&&rearGlass,'both real glass volumes have actual outer material');close(local(frontGlass).z,2.05,'front glass outer surface');close(local(rearGlass).z,.8,'back glass outer surface');
 assert.equal(p.support.length,3,'three actual narrow panel seats outside aperture');for(const seat of p.support){const bb=bounds(seat);close(bb.min.z,2.05,'seat touches panel cap');close(bb.max.z,2.2,'seat touches PCB rear');assert.ok(bb.min.x>=18.5||bb.max.x<=-18.5||bb.min.y>=24,'no false opaque seat in transparent window');}
 assert.equal(c.columns.length,4);assert.equal(c.screws.length,4);const posts=[[-18.5,-3],[18.5,-3],[-18.5,-17],[18.5,-17]];
 c.columns.forEach((column,i)=>{const q=point(column),bb=bounds(column);close(q.x,posts[i][0],'37mm own post grid');close(q.y,posts[i][1],'14mm own post grid');close(bb.min.z,-1.85,'column touches cover');close(bb.max.z,2.2,'column touches board');});
 const coverBox=bounds(c.plate);close(coverBox.min.z,-2.65,'actual rear cover outside');close(coverBox.max.z,-1.85,'actual rear cover seat');assert.equal(shoot([.17,-17,-4],[0,0,1],c.plate).length,0,'single Grove cover notch is really open');
 assert.equal(b.mcuPins.length,20,'own STM32F030F4P6 TSSOP20,not Glass2 population');assert.equal(b.fpcContacts.length,24);assert.equal(p.tracks.length,24);assert.ok(physical.has(p.flex)&&physical.has(b.buzzer));assert.equal(b.buzzer.userData.role,'fixed-buzzer-body');assert.equal(own(u,'speaker').length,0,'fixed actual buzzer appearance has no fake audio API');assert.equal(own(u,'led').length,0);assert.equal(own(u,'imu').length,0);
 const flexBox=bounds(p.flex);assert.ok(flexBox.min.y<-8&&flexBox.max.y>-.9&&flexBox.min.z<-.6,'actual folded ribbon runs from own panel to24pin connector');
 assert.equal(own(u,'port').length,1,'original U158 has one physical Grove');assert.equal(g.port,u.get('grove'));assert.equal(g.port.connector,'grove');assert.equal(g.contacts.length,4);assert.equal(g.returns.length,4);assert.equal(g.feet.length,4);assert.equal(g.lands.length,4);const mouth=point(g.frame),port=point(g.port.object3d);close(mouth.x,0,'own single socket centre');close(mouth.y,-19.5,'own bottom socket mouth');close(mouth.z,-.25,'own socket stack seating');assert.ok(mouth.distanceTo(port)<tol);
 const outward=new GlassThree.Vector3(0,1,0).transformDirection(g.port.object3d.matrixWorld).transformDirection(inverse);assert.ok(outward.distanceTo(new GlassThree.Vector3(0,-1,0))<tol,'real socket opens downward');
 assert.ok(shoot([.17,.09,-.1],[0,0,-1],g.frame,g.frame).some(h=>h.object===g.back),'deep actual Grove dielectric backing');for(const d of[[1,0,0],[-1,0,0],[0,-1,0]])assert.ok(shoot([.17,.1,-2],d,g.frame,g.frame)[0],'actual socket floor/side walls');
 g.contacts.forEach((contact,i)=>{assert.ok(under(contact,g.frame));const q=g.port.object3d.worldToLocal(contact.getWorldPosition(new GlassThree.Vector3()));assert.equal(g.port.pinAt(q).n,i+1,'real GVDC material contact matches documented pin grid');close(point(contact).x,(1.5-i)*2,'readable rear G/V/D/C row');const foot=bounds(g.feet[i]),land=bounds(g.lands[i]);close(foot.max.z,2.2,'actual SMT foot touches PCB rear');close(land.max.z,2.2,'actual solderland touches PCB rear');});
 assert.equal(own(u,'button').length,2);a.controls.forEach((key,i)=>{const button=u.get(i?'button-b':'button-a');assert.equal(key.button,button);assert.equal(button.isLatching,false);close(button.travel,.14,'inferred actual small cap travel');assert.ok(under(key.moving,button.cap));assert.equal(key.moving.children.length,2,'small gray actuator cap and stem only');assert.equal(key.fixed.length,6,'closed base,yellow package,metal frame,guide and blind backing stay fixed');assert.equal(key.terminals.length,2);for(const fixed of[...key.fixed,...key.terminals])assert.ok(under(fixed,key.frame)&&!under(fixed,button.cap),'fixed yellow switch/package not driven by Button');const q=point(button.object3d);close(q.x,(i?-1:1)*20.62,'A rear-left/B rear-right actual small cap frame');close(q.y,-10,'own side key height');close(q.z,1.18,'own side key stack');const axis=button.axis.clone().transformDirection(button.object3d.matrixWorld).transformDirection(inverse);assert.ok(axis.distanceTo(new GlassThree.Vector3(i?1:-1,0,0))<tol,'actual inward cap-only motion axis');assert.ok(shoot([.17,.1,-1],[0,0,1],key.closedBacking,button.object3d)[0],'actual blind plunger backing behind small cap');});
 const s=u.get('screen');assert.equal(p.screen,s);assert.equal(own(u,'display').length,1);assert.deepEqual([s.width,s.height],[128,56]);assert.deepEqual(s.size,[35.05,15.32]);assert.equal(s.style,'oled');assert.equal(s.touchEnabled,false);assert.equal(s.material.transparent,true);assert.equal(s.material.depthWrite,false);assert.equal(s.material.side,GlassThree.FrontSide);assert.match(s.material.fragmentShader,/sourcePixel\.a/);assert.match(s.material.fragmentShader,/vec3\(0\.18,0\.78,1\.0\)/);assert.match(s.material.fragmentShader,/0\.274-0\.254/);assert.match(s.material.fragmentShader,/float ink=bit\*sourcePixel\.a/);
 const f=s.panel,r=s.rearPanel;assert.equal(f.userData.role,'emissive-pixel-overlay');assert.equal(r.userData.role,'emissive-pixel-overlay');assert.equal(f.material,r.material);assert.deepEqual(Array.from(f.geometry.attributes.position.array),Array.from(r.geometry.attributes.position.array));assert.deepEqual(Array.from(f.geometry.attributes.uv.array),Array.from(r.geometry.attributes.uv.array));assert.ok(f.geometry.attributes.normal.getZ(0)>.99&&r.geometry.attributes.normal.getZ(0)<-.99,'opposing FrontSide normals without flipping physical UV');
 for(let i=0;i<f.geometry.attributes.position.count;i++){const v=new GlassThree.Vector3().fromBufferAttribute(f.geometry.attributes.position,i).applyMatrix4(f.matrixWorld).applyMatrix4(inverse),w=new GlassThree.Vector3().fromBufferAttribute(r.geometry.attributes.position,i).applyMatrix4(r.matrixWorld).applyMatrix4(inverse);close(v.x,w.x,'front/rear physical same world X');close(v.y,w.y,'front/rear physical same world Y');close(v.z,2.058,'front pixel plane just outside cap');close(w.z,.792,'rear pixel plane just outside base');}
 return{physicalMeshes:physical.size,ownEnvelopeMm:envelope,ownPCBWindowMm:[37,19],earBores:2,metalPosts:4,physicalGlassLayers:2,fpcContacts:24,fpcTracks:24,tssopLeads:20,fixedBuzzer:1,sockets:1,actualContacts:4,capOnlyButtons:2,capTravelMm:.14,fixedYellowPackages:true,transparentVisiblePixels:[128,56],activeMm:[35.05,15.32],opposingEmissionNormals:true,sameWorldXYAndUvForTrueRearMirror:true,localToleranceMm:tol};
}

import * as ServosChainThree from 'three';

// Concatenated with fixture-parts.mjs: assert/world/own/under are shared bindings.
// Frozen U223 physical facts only. Root owns commands, peers, cable and lifecycles.
export function checkServosChainPhysical(u){
 u.root;world(u.root);
 const T=ServosChainThree,a=u.eightServosChainAssembly;
 assert.ok(a?.shell?.front?.isMesh&&a.board?.pcb?.isMesh,'U223 own case and real PCB are required');
 const frame=a.shell.front.parent,inverse=frame.matrixWorld.clone().invert(),tol=1e-5;
 const close=(v,e,message)=>assert.ok(Math.abs(v-e)<tol,message);
 const point=o=>o.getWorldPosition(new T.Vector3()).applyMatrix4(inverse);
 const bounds=o=>new T.Box3().setFromBufferAttribute(o.geometry.attributes.position).applyMatrix4(inverse.clone().multiply(o.matrixWorld));
 const solid=o=>o.isMesh&&o.userData.role!=='printed-artwork'&&o.material.opacity!==0;
 const physicalMeshes=new Set();
 const collect=o=>o.traverse(p=>{if(solid(p))physicalMeshes.add(p);});
 for(const o of[...a.shell.parts,a.board.pcb,...a.board.pads,...a.board.packages,...a.board.terminals,...a.board.passives,...a.board.indicators,a.input.frame,a.output.frame,...a.input.pads,...a.output.pads,...a.header.carriers,...a.header.posts,...a.header.tips,...a.header.tails,a.dc.frame,a.bulk.frame,a.labels.front,a.labels.back])collect(o);
 const shoot=(p,d,objects,coordinates=frame)=>{
  const origin=new T.Vector3(...p).applyMatrix4(coordinates.matrixWorld),direction=new T.Vector3(...d).transformDirection(coordinates.matrixWorld),ray=new T.Raycaster(origin,direction);
  const hits=(Array.isArray(objects)?ray.intersectObjects(objects,false):ray.intersectObject(objects,true)).filter(h=>solid(h.object));
  for(const h of hits){assert.equal(h.object.material.side,T.FrontSide);const n=h.face.normal.clone().applyNormalMatrix(new T.Matrix3().getNormalMatrix(h.object.matrixWorld));assert.ok(n.dot(direction)<-1e-7,'Actual FrontSide material faces the ray');}
  return hits;
 };
 assert.equal(own(u,'port').length,11);for(const kind of['button','rotary-selector','joint','led','display','sensor'])assert.equal(own(u,kind).length,0,'No fabricated U223 '+kind);
 assert.equal(a.shell.bores.length,2);assert.ok(a.shell.lower.isMesh&&a.shell.rear.isMesh&&a.shell.rearSkin.isMesh);assert.ok(a.shell.supports.length>0&&a.shell.snaps.length>0);
 close(bounds(a.shell.front).max.z,5.71,'Main case front supports independent film');close(bounds(a.shell.lower).max.z,2.85,'Lowered real mounting face remains stepped');close(bounds(a.shell.rearSkin).min.z,-5.71,'Own physical rear cover remains closed');
 let emptyAxisRays=0,frontSideRays=0,pcbSupportRays=0;
 for(let i=0;i<2;i++){
  const x=i?8:-8,y=-16,p=point(a.shell.bores[i]);close(p.x,x,'Actual mounting sleeve X');close(p.y,y,'Actual mounting sleeve Y');
  assert.equal(shoot([x+.13,y+.07,20],[0,0,-1],[...physicalMeshes]).length,0,'Real mounting air path remains empty');emptyAxisRays++;
  const h=shoot([x,y,0],[.997,.077,0],a.shell.bores[i])[0];assert.ok(h,'Actual outward inner bore wall');const q=h.point.clone().applyMatrix4(inverse);assert.ok(Math.abs(Math.hypot(q.x-x,q.y-y)-2.425)<.003);frontSideRays++;
 }
 const pcb=bounds(a.board.pcb);close(pcb.min.z,2.65,'PCB underside');close(pcb.max.z,3.45,'Actual 0.8mm PCB front');
 const socketFacts=[];
 for(const[sock,id,y]of[[a.input,'grove',-27.95],[a.output,'out',27.95]]){
  assert.ok(sock.port===u.get(id)&&sock.port.connector==='grove','Actual socket owns its mechanical Port');assert.equal(sock.port.label,id==='grove'?'Chain IN':'Chain OUT');
  close(point(sock.frame).y,y,'Actual opposite end mouth');assert.ok(point(sock.frame).distanceTo(point(sock.port.object3d))<tol,'Port and socket mating frame coincide');
  for(const field of['contacts','returns','tails','pads'])assert.equal(sock[field].length,4,'Four actual '+field);
  const back=shoot([.17,4,.6],[0,-1,0],sock.frame,sock.frame)[0];assert.ok(back&&back.object===sock.back,'Actual receiving cavity has deep dielectric backing');
  for(let i=0;i<4;i++){
   assert.ok(under(sock.contacts[i],sock.frame)&&under(sock.tails[i],sock.frame));const p=sock.port.object3d.worldToLocal(sock.contacts[i].getWorldPosition(new T.Vector3()));assert.equal(sock.port.pinAt(p).n,i+1);
   const tail=bounds(sock.tails[i]);assert.ok(tail.min.z<2.65&&tail.max.z>3.45,'True retained tail crosses the physical PCB');close(bounds(sock.pads[i]).min.z,3.45,'Solder pad rests on real PCB');
  }
  const p=point(sock.tails[1]),h=shoot([p.x+.5,p.y+.025,4],[0,0,-1],a.board.pcb)[0];assert.ok(h);close(h.point.clone().applyMatrix4(inverse).z,3.45,'Socket PCB support beside its drill');pcbSupportRays++;
  socketFacts.push({id,contacts:4,returns:4,throughBoardTails:4});
 }
 assert.equal(a.header.carriers.length,4);for(const field of['posts','tips','tails'])assert.equal(a.header[field].length,24,'24 actual male header '+field);
 for(const i of[0,7,16,23]){
  const tail=bounds(a.header.tails[i]);assert.ok(tail.min.z<2.65&&tail.max.z>=3.45-tol);const p=point(a.header.posts[i]),h=shoot([p.x+.8,p.y+.025,4],[0,0,-1],a.board.pcb)[0];assert.ok(h);close(h.point.clone().applyMatrix4(inverse).z,3.45,'Actual male post is retained by its own complete PCB');pcbSupportRays++;
 }
 assert.ok(a.bulk.frame.parent===frame,'Fixed capacitor belongs to the actual body, never a selector');assert.equal(a.bulk.terminals.length,2);const cap=shoot([6.13,14.37,10],[0,0,-1],a.bulk.top)[0];assert.ok(cap);close(cap.point.clone().applyMatrix4(inverse).z,5.55,'Real fixed capacitor metal end');
 assert.ok(a.dc.port===u.get('dc')&&a.dc.port.connector==='dc-5.5x2.1');assert.ok(a.dc.face.isMesh&&a.dc.housing.isMesh&&a.dc.sleeve.isMesh&&a.dc.center.isMesh&&a.dc.back.isMesh);
 const dcBack=shoot([1.65,.3,2],[0,0,-1],a.dc.frame,a.dc.frame)[0];assert.ok(dcBack&&dcBack.object===a.dc.back,'DC5.5 annular receiving cavity terminates in real deep backing');
 const center=shoot([.13,.07,2],[0,0,-1],a.dc.frame,a.dc.frame)[0];assert.ok(center&&center.object===a.dc.center,'Real 2.1mm central pin is retained');
 const sleeve=shoot([0,0,-2],[.997,.077,0],a.dc.sleeve,a.dc.frame)[0];assert.ok(sleeve,'FrontSide inner DC sleeve remains real');frontSideRays++;
 assert.equal(a.board.indicators.length,2);assert.ok(a.board.indicators.every(o=>o.material.emissive.getHex()===0),'Internal carriers do not invent an external lamp');
 assert.equal(a.labels.front.userData.role,'physical-label-substrate');assert.equal(a.labels.back.userData.role,'physical-label-substrate');
 return {physicalMalePosts:24,physicalSocketContacts:8,socketFacts,emptyAxisRays,frontSideRays,pcbSupportRays,fixedCapacitor:true,deepDcCavity:true,externalControls:0,externalLeds:0};
}

/** External visible framebuffer and actual transparent OLED material bindings. */
export function checkGlassFramebuffer(host,u,prefix,events){
 u.root;assert.equal(own(u,'display').length,1);const d=own(u,'display')[0];assert.equal(d.width,128);assert.equal(d.height,56);assert.ok(Math.abs(d.size[0]-35.05)<=.005&&Math.abs(d.size[1]-15.32)<=.005,'own panel PDF transparent AA35.05x15.32;not webpage18mm stretched over56rows');assert.equal(d.touchEnabled,false);assert.equal(d.interactive,false);assert.equal(d.meta.monochrome,true);
 assert.ok(d.texture.image.data===d.buffer&&d.material.uniforms.map.value===d.texture);assert.equal(d.material.uniforms.style.value,1);assert.equal(d.material.uniforms.blackLevel.value.getHex(),0);assert.equal(d.material.transparent,true);assert.equal(d.material.depthWrite,false);assert.ok(d.panel.isMesh&&under(d.panel,d.object3d));
 const rest=d.buffer.slice(),shape=physical(u),ports=frames(u),n=events.length,expected=rest.slice(),path=target(prefix,d.id);
 const invariant=()=>{assert.equal(events.length,n);assert.equal(physical(u),shape);assert.equal(frames(u),ports);assert.equal(d.touchEnabled,false);assert.ok(d.texture.image.data===d.buffer&&d.material.uniforms.map.value===d.texture);};
 try{
  for(const run of[()=>d.setStyle('lcd'),()=>d.setStyle('reflective'),()=>d.setTouchEnabled(true),()=>d.touch('down',1,1),()=>host.handle({type:'display',target:path,style:'lcd'}),()=>host.handle({type:'display',target:path,touch:true})]){const before=hash(d.buffer);assert.throws(run);assert.equal(hash(d.buffer),before);invariant();}
  d.setStyle('oled');d.setTouchEnabled(false);host.handle({type:'display',target:path,style:'oled',touch:false});invariant();
  const rgba=new Uint8Array(128*56*4);for(let y=0;y<56;y++)for(let x=0;x<128;x++){const p=(y*128+x)*4,v=(x+y)%2?255:0;rgba.set([v,v,v,255],p);}
  host.handle({type:'display',target:path,format:'rgba',x:0,y:0,w:128,h:56,data:rgba});expected.set(rgba);assert.equal(hash(d.buffer),hash(expected));invariant();
  host.handle({type:'display',target:path,format:'rgb888',x:5,y:4,w:1,h:1,data:new Uint8Array([0,255,0])});expected.set([0,255,0],(4*128+5)*4);assert.equal(hash(d.buffer),hash(expected));assert.deepEqual(d.getPixel(5,4),[0,255,0],'source RGB preserved;blue monochrome mapping belongs to actual shader');invariant();
  host.handle({type:'display',target:path,format:'rgba',x:6,y:4,w:1,h:1,data:new Uint8Array([255,255,255,0])});expected.set([255,255,255,0],(4*128+6)*4);assert.equal(hash(d.buffer),hash(expected));invariant();
  host.handle({type:'display',target:path,format:'rgb565',x:2,y:1,w:2,h:1,data:new Uint16Array([0xffff,0])});expected.set([255,255,255],(128+2)*4);expected.set([0,0,0],(128+3)*4);assert.equal(hash(d.buffer),hash(expected));invariant();
  host.handle({type:'display',target:path,fill:'#ffffff',rect:{x:126,y:54,w:3,h:3}});for(let y=54;y<56;y++)for(let x=126;x<128;x++)expected.set([255,255,255],(y*128+x)*4);assert.equal(hash(d.buffer),hash(expected));invariant();
  const stable=hash(d.buffer),state=d.getState();host.update(.5);assert.equal(hash(d.buffer),stable,'no automatic image or SSD1309/controller-memory state');assert.deepEqual(d.getState(),state);invariant();
 }finally{d.buffer.set(rest);d.invalidate();}
 assert.equal(hash(d.buffer),hash(rest));invariant();return{id:d.id,resolution:[128,56],actualVisibleMm:d.size,sourceRgbAndAlphaPreserved:true,actualTextureAlias:true,formats:['rgba','rgb888','rgb565','clipped-fill'],externalNoEcho:true,touch:false,fixedStyle:'oled',materialTransparency:true,physicalAndPortsUnchanged:true,scope:'CPU framebuffer and actual material bindings;no GPU pixel,128x64 memory/register,I2C or firmware acceptance'};
}

import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {loadModel,loadGroveModule} from '../src/loaders.js';
import {FramebufferPanel} from '../demo/framebuffers.js';

const ids=['mini-imu-pro','glass','8servos2-chain'];
const expectedApi={"mini-imu-pro":{"body":["grove"],"ports":["grove"],"controls":[],"leds":[],"displays":[],"canonical":"grove"},"glass":{"body":["screen","grove","button-a","button-b"],"ports":["grove"],"controls":["button-a","button-b"],"leds":[],"displays":["screen"],"canonical":"grove"},"8servos2-chain":{"body":["grove","out","ch0","ch1","ch2","ch3","ch4","ch5","ch6","ch7","dc"],"ports":["grove","out","ch0","ch1","ch2","ch3","ch4","ch5","ch6","ch7","dc"],"controls":[],"leds":[],"displays":[],"canonical":"grove"}},expectedPrint={"mini-imu-pro":{"default":{"kinds":["reference-redraw","reference-redraw","reference-redraw"]},"cases":[]},"glass":{"default":{"kinds":["reference-redraw","reference-redraw"]},"cases":[]},"8servos2-chain":{"default":{"kinds":["official-vector-raster","official-vector-raster"]},"cases":[]}};
function checkBoundary(u,id){
 u.root;const a=expectedApi[id],body=[...u.components.keys()].filter(k=>!['unitFrame','cable'].includes(k));assert.deepEqual(body,a.body);
 for(const[kind,key]of[['port','ports'],['button','controls'],['led','leds'],['display','displays']])assert.deepEqual(own(u,kind).map(c=>c.id),a[key]);
 for(const kind of['joint','sensor','speaker','rotary-selector','led-matrix'])assert.equal(own(u,kind).length,0,'no invented readings,servo/rotary/electrical/firmware component');
 for(const c of own(u,'component')){assert.equal(c.interactive,false);assert.deepEqual(c.getState(),{});}
 assert.equal(u.get(a.canonical).connector,'grove');return{id,body,ports:a.ports,controls:a.controls,leds:a.leds,displays:a.displays};
}
function checkPhysical(u,id){return id==='mini-imu-pro'?checkMiniImuProPhysical(u):id==='glass'?checkGlassPhysical(u):checkServosChainPhysical(u);}
function artworkMotion(on,off){
 const report=[];for(const a of own(on,'button')){
  const b=off.get(a.id),original=a.position;a.press('fixture:ink');b.press('fixture:ink');on.update(.035);off.update(.035);assert.ok(a.getActuationState().depthMm>0||a.isLatching);assert.equal(physical(on),physical(off),'actual partial control motion retains every physical record without ink');a.cancel('fixture:ink');b.cancel('fixture:ink');tick(on);tick(off);
  if(a.isLatching){a.setPosition(original,{immediate:true});b.setPosition(original,{immediate:true});}
  assert.equal(physical(on),physical(off));report.push(a.id);
 }return report;
}
async function nestedKey(host,u,prefix,portId,events){
 const key=await loadGroveModule('key',{cableLength:55}),p=u.get(portId),rest=physical(u),ports=frames(u),n=events.length;p.attach(key);host.update(0);assert.equal(key.get('cable').getState().wireCount,4);assert.equal(physical(u,[key.root]),rest);
 const path=target(prefix,portId);checkMomentaries(host,key,path,events,['press']);roundtrip(u,p);assert.equal(frames(u),ports);assert.ok(p.detach({dispose:false})===key);key.dispose();host.update(0);assert.equal(physical(u),rest);assert.equal(frames(u),ports);
 return{port:portId,wireCount:4,inputPath:target(path,'press'),retainedPhysical:'identical',observedInputEvents:events.length-n,protocolAndElectricalRouting:false};
}
function checkFramebufferPanel(host,u,hub){
 const d=own(u,'display')[0],h=host.display(),hostRest=h.buffer.slice(),unitRest=d.buffer.slice(),shape=physical(u),selector={value:'',replaceChildren(...items){this.items=items;}},button={dataset:{},setAttribute(k,v){this[k]=v;}},panel=new FramebufferPanel({selector,button}),path=target('grove/grove-2',d.id);
 try{
  panel.bind(host);h.buffer.set(hostRest);h.invalidate();selector.value=path;selector.onchange();assert.ok(panel.target()===d);assert.equal(selector.hidden,false);assert.ok(selector.items.some(x=>x.value===path));
  const beforeHost=hash(h.buffer),beforeUnit=hash(d.buffer);button.onclick();assert.notEqual(hash(d.buffer),beforeUnit);assert.equal(hash(h.buffer),beforeHost);assert.equal(physical(u),shape);assert.equal(d.touchEnabled,false);
  const calibrated=hash(d.buffer),p=hub.get('grove-2');assert.ok(p.detach({dispose:false})===u);assert.equal(hash(d.buffer),calibrated);assert.equal(hash(h.buffer),beforeHost);p.attach(u);host.update(0);assert.equal(hash(d.buffer),calibrated);assert.equal(hash(h.buffer),beforeHost);selector.value=path;selector.onchange();assert.ok(panel.target()===d);
  return{actualDemoClass:'FramebufferPanel',nestedPath:path,calibrationTargetOnly:true,attachDetachRefreshWritesPixels:false,scope:'Actual demo controller with DOM stubs;CPU framebuffer only'};
 }finally{panel.unbind();h.buffer.set(hostRest);h.invalidate();d.buffer.set(unitRest);d.invalidate();}
}

/** Own U171/U158/U223 physical assemblies and actual external visual interfaces. */
export async function checkImuProGlassServosChainUnits(){
 const restore=installCanvasStub();let host;
 try{
  const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));host=await loadModel('sticks3');host.root;host.display().fill('#123456');const framebuffer=hash(host.display().buffer),hub=await loadGroveModule('hub');host.port('grove').attach(hub);
  const units={},events=[],components=[],artwork=[],configurations=[],controls=[],outputs=[],nested=[];host.on('input',e=>{if(e.kind!=='port')events.push(e);});
  for(const[i,id]of ids.entries()){
   const u=await loadGroveModule(id,{cableLength:75+i*15});hub.get(`grove-${i+1}`).attach(u);host.update(0);units[id]=u;assert.equal(u.get('cable').getState().wireCount,4);components.push(checkBoundary(u,id));
   const product=catalog.products.find(p=>p.id===id),seen=new Set();
   for(const options of[{},...product.configurations.map(c=>c.options)]){
    const k=JSON.stringify(Object.fromEntries(Object.entries(options).sort(([a],[b])=>a.localeCompare(b))));if(seen.has(k))continue;seen.add(k);
    for(const load of[loadModel,loadGroveModule]){
     const on=await load(id,options),off=await load(id,{...options,artwork:false});try{
      on.root;off.root;on.update(0);off.update(0);checkBoundary(on,id);checkBoundary(off,id);assert.equal(physical(on),physical(off),'all physical attributes/index/world survive ink removal');assert.equal(frames(on),frames(off));assert.equal(panels(off).length,0);
      const kinds=panels(on).map(p=>p.userData.artworkKind).sort(),expected=expectedPrint[id].cases.find(c=>JSON.stringify(c.options)===k)??expectedPrint[id].default;assert.deepEqual(kinds,[...expected.kinds].sort());const moving=artworkMotion(on,off);
      if(load===loadModel&&k==='{}'){checkPhysical(on,id);artwork.push({id,panels:kinds.length,kinds,actualPartialMotionIds:moving});}
     }finally{on.dispose();off.dispose();}
    }
   }configurations.push({id,optionCases:seen.size,entries:2,physicalAttributesIndexWorld:'identical with ink off,including actual partial control motion'});
  }
  const prefix=i=>`grove/grove-${i+1}`;
  for(const[i,id]of ids.entries()){
   const u=units[id],peers=ids.filter(x=>x!==id),snapshot=peers.map(x=>physical(units[x]));components.find(c=>c.id===id).physicalStructure=checkPhysical(u,id);
   const momentaries=expectedApi[id].controls.filter(k=>!u.get(k).isLatching),stable=expectedApi[id].controls.filter(k=>u.get(k).isLatching);
   if(momentaries.length)controls.push({id,individual:checkMomentaries(host,u,prefix(i),events,momentaries),simultaneous:checkSimultaneousMomentaries(host,u,events,momentaries)});
   for(const key of stable)controls.push({id,stable:checkStableSlide(host,u,key,prefix(i),events)});
   if(expectedApi[id].leds.length)outputs.push({id,...checkIndependentLights(host,u,prefix(i),events,expectedApi[id].leds)});
   if(id==='glass')outputs.push({id,...checkGlassFramebuffer(host,u,prefix(i),events)});
   checkWrongFamily(host,u,prefix(i),expectedApi[id].ports,events);assert.deepEqual(peers.map(x=>physical(units[x])),snapshot);assert.equal(hash(host.display().buffer),framebuffer);
  }
  for(const[i,id]of ids.entries()){
   const u=units[id],before=physical(u),n=events.length;host.handle({type:'pose',target:target(prefix(i),'unitFrame'),position:[i*55,195+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:target(prefix(i),'cable'),slack:12,bend:[0,0,-1]});host.update(0);assert.notEqual(physical(u),before);assert.equal(u.get('cable').getState().wireCount,4);assert.equal(events.length,n);components.find(c=>c.id===id).transformedStructure=checkPhysical(u,id);
   const momentaries=expectedApi[id].controls.filter(k=>!u.get(k).isLatching);if(momentaries.length)checkMomentaries(host,u,prefix(i),events,momentaries);if(id==='glass')checkGlassFramebuffer(host,u,prefix(i),events);checkWrongFamily(host,u,prefix(i),expectedApi[id].ports,events);
  }
  for(const[i,id]of ids.entries())for(const portId of expectedApi[id].ports){const p=units[id].get(portId);if(portId!==expectedApi[id].canonical&&p.connector==='grove')nested.push({id,...await nestedKey(host,units[id],prefix(i),portId,events)});}
  assert.ok(nested.some(x=>x.id==='8servos2-chain'&&x.port==='out'),'actual U223 Chain OUT tested');const framebufferPanel=checkFramebufferPanel(host,units.glass,hub);assert.equal(hash(host.display().buffer),framebuffer);
  const disposal=observeDisposal(host.root);
  for(const[i,id]of ids.entries()){
   const peers=ids.filter(x=>x!==id),before=peers.map(x=>physical(units[x])),p=hub.get(`grove-${i+1}`),part=p.detach({dispose:false});assert.ok(part===units[id]);assert.deepEqual(peers.map(x=>physical(units[x])),before);p.attach(part);host.update(0);assert.equal(part.get('cable').getState().wireCount,4);
  }
  const beforeLast=[physical(units['mini-imu-pro']),physical(units.glass)];hub.get('grove-3').detach();assert.deepEqual([physical(units['mini-imu-pro']),physical(units.glass)],beforeLast);assert.equal(hash(host.display().buffer),framebuffer);host.dispose();host=null;const disposedResources=disposal();
  return{status:'pass',components,artwork,configurations,controls,outputs,nested,framebufferPanel,disposedResources,cases:['three-real-four-core-branches','own-U171-shell-and-documented-internal-carriers','actual-Glass-side-plunger-fixed-package-separation-multi-source-cancel','128x56-external-transparent-blue-visible-framebuffer-no-touch','own-U223-24-posts-DC-IN-OUT-real-cavities-no-old-selector','both-entries-actual-presets-and-partial-motion-ink-physical-invariance','transformed-parent-physical-structure-ports-cancel-peer-isolation','real-Chain-OUT-nested-Key-input-intents-only','actual-demo-nested-framebuffer-selector','host-framebuffer-and-observed-resource-disposal'],scope:'Own three physical assemblies,matching print and actual external controls/outputs;Node DOM/canvas boundary fixture;no browser/GPU/manufacturing/productionfit/hardware/sensorvalues/128x64-registermapping/firmware/electrical/servo-PWM/whole-history acceptance'};
 }finally{host?.dispose();restore();}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkImuProGlassServosChainUnits(),null,2));
