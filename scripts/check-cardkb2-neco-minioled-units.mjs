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
 class Wrong extends Module{static meta={id:'fixture.batch41.wrong',name:'Wrong mechanical family',connector:'fixture-incompatible-family'};build(){}}
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

import * as CardKB2Three from 'three';

// Concatenated with fixture-parts.mjs: assert/world/own/under are shared.
// Read-only physical checks. Root owns commands, multi-source/cancel, RGB
// no-echo, wrong-family, artwork/peer checks and attachment roundtrips.
export function checkCardKB2Physical(u){
 u.root;world(u.root);
 const a=u.cardkb2Assembly;
 assert.ok(a?.pcb?.pcb?.isMesh,'actual own U215 PCB assembly');
 const frame=a.pcb.pcb.parent,inverse=frame.matrixWorld.clone().invert(),toleranceMm=1e-5;
 const close=(v,n,message)=>assert.ok(Math.abs(v-n)<toleranceMm,message);
 const point=o=>o.getWorldPosition(new CardKB2Three.Vector3()).applyMatrix4(inverse);
 const bounds=o=>new CardKB2Three.Box3().setFromBufferAttribute(o.geometry.attributes.position).applyMatrix4(inverse.clone().multiply(o.matrixWorld));
 const ownMaterial=o=>o.isMesh&&o.userData.role!=='printed-artwork'&&o.material.opacity!==0;
 const physicalMeshes=new Set(),collect=o=>o.traverse(p=>{if(ownMaterial(p))physicalMeshes.add(p);});
 const shoot=(origin,direction,objects,coordinateFrame=frame)=>{
  const p=new CardKB2Three.Vector3(...origin).applyMatrix4(coordinateFrame.matrixWorld),d=new CardKB2Three.Vector3(...direction).transformDirection(coordinateFrame.matrixWorld);
  const ray=new CardKB2Three.Raycaster(p,d),hits=(Array.isArray(objects)?ray.intersectObjects(objects,false):ray.intersectObject(objects,true)).filter(h=>ownMaterial(h.object));
  for(const h of hits){
   assert.equal(h.object.material.side,CardKB2Three.FrontSide,'actual one-sided physical material');
   const normal=h.face.normal.clone().applyNormalMatrix(new CardKB2Three.Matrix3().getNormalMatrix(h.object.matrixWorld));
   assert.ok(normal.dot(d)<-1e-7,'real material face normal opposes incoming ray');
  }
  return hits;
 };
 const localHit=(h,coordinateFrame=frame)=>h.point.clone().applyMatrix4(coordinateFrame.matrixWorld.clone().invert());
 const board=a.pcb,pcbBox=bounds(board.pcb);
 assert.equal(board.pcb.userData.role,'physical-pcb');
 close(pcbBox.min.x,-42,'own PCB84mm left');close(pcbBox.max.x,42,'own PCB84mm right');
 close(pcbBox.min.y,-27,'own PCB54mm bottom');close(pcbBox.max.y,27,'own PCB54mm top');
 close(pcbBox.min.z,-.5,'actual PCB rear');close(pcbBox.max.z,.5,'real1mm PCB front');
 assert.equal(board.drills.length,6,'four actual Grove andtwo USB rear retaining bores');
 assert.equal(board.barrels.length,6);assert.equal(board.lands.length,12);
 for(const part of[board.pcb,...board.barrels,...board.lands])collect(part);
 const holes=[[-39,-24],[-39,24],[39,-24],[39,24]];
 let emptyRays=0,wallRays=0,supportRays=0,capRays=0;
 for(const[x,y]of holes){
  // Small nonsymmetric offsets avoid fan centres, common triangle edges and
  // exact bore-vertex rays while still testing each complete physical opening.
  assert.equal(shoot([x+.11,y+.07,2],[0,0,-1],board.pcb).length,0,'four own real PCB mount openings');
  for(const d of[[1,.013,0],[-1,.017,0],[.019,1,0],[.011,-1,0]]){
   const h=shoot([x,y,.071],d,board.pcb)[0];assert.ok(h,'ownØ2.2 mounting material wall');const p=localHit(h);
   assert.ok(Math.abs(Math.hypot(p.x-x,p.y-y)-1.1)<.002,'actual polygonal bore radius');wallRays++;
  }
 }
 close(holes[2][0]-holes[0][0],78,'source mounting centre spanX');close(holes[1][1]-holes[0][1],48,'source mounting centre spanY');
 for(let i=0;i<board.drills.length;i++){
  const[x,y,outer,inner]=board.drills[i],barrel=board.barrels[i],p=point(barrel);
  close(p.x,x,'true barrel centreX');close(p.y,y,'true barrel centreY');
  close(bounds(barrel).min.z,-.5,'plated material spans actual PCB back');close(bounds(barrel).max.z,.5,'plated material spans actual PCB front');
  assert.equal(shoot([x+.041,y+.027,2],[0,0,-1],board.pcb).length,0,'own connector drill is a real PCB hole');
  const h=shoot([x,y,.071],[1,.023,0],barrel)[0];assert.ok(h,'real inner plated wall');const hp=localHit(h);
  assert.ok(Math.abs(Math.hypot(hp.x-x,hp.y-y)-inner)<.002,'actual receiving barrel clear inner radius');wallRays++;
  assert.ok(outer>inner,'positive actual plated material');
 }
 const input=a.input;
 assert.ok(input.port===u.get('grove'));assert.equal(input.port.connector,'grove');assert.equal(input.port.meta.face,'left');
 assert.equal(input.parts.length,21,'actual Grove walls/guides/backing/contact/return/tail material');
 assert.equal(input.contacts.length,4);assert.equal(input.tails.length,4);
 const gp=point(input.frame),portPoint=point(input.port.object3d);
 close(gp.x,-42.7,'actual Grove mouthX');close(gp.y,-14.3,'actual Grove mouthY');close(gp.z,3.1,'actual Grove mouthZ');
 assert.ok(gp.distanceTo(portPoint)<toleranceMm,'physical socket and own Port mating frame coincide');
 const outward=new CardKB2Three.Vector3(0,1,0).transformDirection(input.port.object3d.matrixWorld).transformDirection(inverse);
 assert.ok(outward.distanceTo(new CardKB2Three.Vector3(-1,0,0))<toleranceMm,'actual left-facing receiving mouth');
 for(const part of input.parts){assert.ok(part.isMesh&&under(part,input.frame));collect(part);}
 for(const part of[input.floor,input.back,input.bridge,...input.contacts,...input.tails])assert.ok(input.parts.includes(part),'real Grove part belongs to own fixed socket frame');
 const groveBacking=shoot([.17,2,.07],[0,-1,0],input.frame,input.frame)[0];
 assert.ok(groveBacking&&groveBacking.object===input.back,'actual deep dielectric Grove backstop');
 const groveFloor=shoot([.17,-2,.07],[0,0,-1],input.floor,input.frame)[0];assert.ok(groveFloor,'actual receiving floor');
 for(let i=0;i<4;i++){
  const contact=input.contacts[i],contactLocal=input.port.object3d.worldToLocal(contact.getWorldPosition(new CardKB2Three.Vector3())),tail=point(input.tails[i]),[x,y]=board.drills[i];
  assert.equal(input.port.pinAt(contactLocal).n,i+1,'all actual contacts match the documentary four-pin grid');close(contactLocal.x,(i-1.5)*2,'actual2mm contact pitch');
  close(tail.x,x,'own Grove solderleg physically in PCB boreX');close(tail.y,y,'own Grove solderleg physically in PCB boreY');
  close(bounds(input.tails[i]).min.z,-.5,'real retained tail finishes flush with PCB rear');assert.ok(bounds(input.tails[i]).max.z>.5,'actual metallic tail crosses board plane');
  assert.ok(.29-.36/Math.SQRT2>0,'actual square metal tail clears true plated inner bore');
 }
 const usb=a.usb;
 assert.ok(usb.port===u.get('usb'));assert.equal(usb.port.connector,'usb-c');assert.equal(usb.port.meta.face,'left');
 assert.equal(usb.contacts.length,24,'two actual rows of12 receiving contact pieces');assert.equal(usb.tails.length,24);assert.equal(usb.tabs.length,4);
 const up=point(usb.frame);close(up.x,-42.6,'actual USB-C mouthX');close(up.y,0,'actual USB-C mouthY');close(up.z,2.05,'actual USB-C mouthZ');
 assert.ok(up.distanceTo(point(usb.port.object3d))<toleranceMm,'USB component frame uses actual receiving mouth');
 for(const part of[usb.shell,usb.back,usb.tongue,...usb.contacts,...usb.tails,...usb.tabs]){assert.ok(part.isMesh&&under(part,usb.frame));collect(part);}
 const usbBacking=shoot([.13,2,.93],[0,-1,0],usb.frame,usb.frame)[0];assert.ok(usbBacking&&usbBacking.object===usb.back,'actual USB deep dielectric backing outside retained tongue');
 for(const z of[-.95,.95]){assert.equal(shoot([.13,1,z],[0,-1,0],usb.shell,usb.frame).length,0,'true USB receiving sleeve axial opening');emptyRays++;}
 for(const[d,axis,expect]of[[[1,.013,0],'x',3.925],[[-1,.017,0],'x',-3.925],[[.019,0,1],'z',1.325],[[.011,0,-1],'z',-1.325]]){
  const h=shoot([.13,-3,.07],d,usb.shell,usb.frame)[0];assert.ok(h,'actual USB FrontSide interior receiving wall');close(localHit(h,usb.frame)[axis],expect,'true USB interior wall bound');wallRays++;
 }
 const buttonComponents=own(u,'button');assert.equal(buttonComponents.length,44);assert.equal(a.keys.length,42);
 const expectedIds=[...Array.from({length:42},(_,i)=>'key-'+(i+1)),'reset','boot'];
 assert.deepEqual(buttonComponents.map(c=>c.id),expectedIds,'own42+RST+BOOT physical component order');
 const mainReports=[];
 for(let i=0;i<42;i++){
  const k=a.keys[i],c=u.get('key-'+(i+1)),row=i<10?0:i<21?1:i<32?2:3,col=i-[0,10,21,32][row],x=(row===0?-24.8:-26.6)+col*6.55,y=[18.5,5,-8.5,-22][row],position=point(c.object3d),depth=c.getActuationState().depthMm;
  assert.ok(k.control===c&&buttonComponents[i]===c);assert.equal(c.kind,'button');assert.equal(c.isLatching,false);close(c.travel,.22,'own inferred main tactile travel');assert.deepEqual(c.axis.toArray(),[0,0,-1]);
  close(position.x,x,'own mainkey physical X');close(position.y,y,'own mainkey physical Y');close(position.z,0,'main component datum');
  assert.ok(k.fixed.parent===frame&&k.body.parent===k.fixed&&k.floor.parent===k.fixed&&k.lid.parent===k.fixed);
  assert.equal(k.pins.length,4);assert.ok(k.pins.every(p=>p.parent===k.fixed&&!under(p,c.cap)),'all four metal feet fixed independently of moving plunger');
  assert.ok(k.moving.parent===c.cap&&k.cap.parent===k.moving&&k.stem.parent===k.moving,'actual unmarked red cap and lower stem belong to only their own control');
  assert.equal(k.moving.children.length,2,'only actual red plunger and lower stem move');assert.ok(!under(k.fixed,c.cap));
  close(bounds(k.body).min.z,.5,'main switch package rests on PCB');close(bounds(k.body).max.z,2.05,'fixed body actual thickness');
  close(bounds(k.lid).min.z,2.05,'fixed silver lid meets own body');close(bounds(k.lid).max.z,2.2,'real fixed silver lid volume');
  const capPoint=point(k.cap),stemPoint=point(k.stem);close(capPoint.x,x,'own actual cap X');close(capPoint.y,y,'own actual cap Y');close(capPoint.z,2.9-depth,'actual cap follows its own current visual depth');close(stemPoint.z,1.625-depth,'actual lower stem shares current cap depth');
  const capSize=new CardKB2Three.Box3().setFromBufferAttribute(k.cap.geometry.attributes.position).getSize(new CardKB2Three.Vector3());close(capSize.x,2.96,'actual red cylindrical cap width');close(capSize.y,2.96,'actual red cylindrical cap diameter');close(capSize.z,1.4,'real red cap height');
  assert.ok(c.travel>0&&.95-c.travel>.65,'inferred main travel retains positive deep-guide floor clearance');
  collect(k.fixed);collect(k.moving);
  for(const[dx,dy]of[[.13,.07],[-.11,.08]]){
   const h=shoot([x+dx,y+dy,4.5],[0,0,-1],k.cap)[0];assert.ok(h,'actual red cap has closed visible material away from fan centre/edges');close(localHit(h).z,3.6-depth,'real current red cap top');
   assert.equal(shoot([x+dx,y+dy,4.5],[0,0,-1],k.lid).length,0,'fixed silver lid has genuine plunger aperture');capRays++;
  }
  for(const[dx,dy]of[[.11,.07],[2.35,2.3],[2.31,-2.33],[-2.34,2.32],[-2.3,-2.31]]){
   const h=shoot([x+dx,y+dy,.8],[0,0,-1],board.pcb)[0];assert.ok(h,'actual own PCB supports every real switch footprint');close(localHit(h).z,.5,'real PCB under fixed switch package');supportRays++;
  }
  mainReports.push({id:c.id,row,column:col,unmarkedMovingMeshes:2,fixedPackageMeshes:7});
 }
 const sideReports=[];
 for(const[id,sign,axis]of[['reset',1,[0,-1,0]],['boot',-1,[0,1,0]]]){
  const k=a[id],c=u.get(id),cp=point(c.object3d),depth=c.getActuationState().depthMm;
  assert.ok(k.control===c);assert.equal(c.isLatching,false);assert.deepEqual(c.axis.toArray(),axis);close(c.travel,.16,'own inferred side tactile travel');
  close(cp.x,-34.7,'actual sidecontrol X');close(cp.y,sign*26.7,'actual sidecontrol Y');close(cp.z,1.4,'actual sidecontrol Z');
  assert.ok(k.moving.parent===c.cap&&k.cap.parent===k.moving&&k.stem.parent===k.moving);assert.equal(k.moving.children.length,2);assert.equal(k.pins.length,4);
  for(const part of[k.body,k.cover,k.yellow,...k.pins])assert.ok(part.parent===k.fixed&&!under(part,c.cap),'yellow cover, metal cover, body and feet remain fixed');
  close(bounds(k.body).min.z,.5,'actual side switch rests on own PCB');close(bounds(k.cover).min.z,2.2,'actual fixed silver side cover');close(bounds(k.yellow).min.z,2.35,'actual fixed yellow top centre');
  const capPoint=point(k.cap);close(capPoint.x,-34.7,'gray side plunger X');close(capPoint.y,sign*26.7+axis[1]*depth,'gray side plunger follows inward Y depth');close(capPoint.z,1.4,'gray side plunger keeps Z datum');
  collect(k.fixed);collect(k.moving);
  const h=shoot([-34.7+.13,sign*30,1.4+.07],[0,-sign,0],k.cap)[0];assert.ok(h,'actual side gray material accessible from correct outside edge');capRays++;
  sideReports.push({id,axis,inferredTravelMm:.16,unmarkedMovingMeshes:2,fixedYellowCover:true,fixedPackageMeshes:7});
 }
 const e=a.electronics,led=u.get('rgb');assert.equal(e.mcuPins.length,40,'ownlinked ESP32-C61HF4 QFN40 actual terminations');
 assert.equal(e.passives.length,10);assert.equal(e.pins.length,20);assert.ok(e.mcu.parent===e.chipFrame&&e.chipFrame.parent===e.frame);close(e.chipFrame.rotation.z,Math.PI/4,'own photo rotated QFN package');
 assert.ok(e.rgb===led&&own(u,'led').length===1&&led.lens.parent===led.object3d);assert.equal(led.meta.part,'XL-1615RGBC-RF');
 const lp=point(led.object3d);close(lp.x,39.8,'actual RGB package X');close(lp.y,20,'actual RGB package Y');close(lp.z,.96,'actual RGB encapsulant datum');
 const rgbSupport=shoot([39.8+.11,20+.07,1.5],[0,0,-1],e.rgbBase)[0];assert.ok(rgbSupport,'real closed RGB fixed carrier beneath visible encapsulant');supportRays++;
 collect(e.frame);collect(led.lens);
 assert.equal(a.label.userData.role,'physical-label-substrate');assert.equal(a.label.userData.face,'back');collect(a.label);
 close(bounds(a.label).min.z,-.54,'independent inferred0.04mm rearfilm outerface');close(bounds(a.label).max.z,-.5,'real film touches own PCB rear');
 for(const[x,y]of[[-30,-15],[-20,15],[20,15],[28,-12],[.13,.07]]){
  const filmHit=shoot([x,y,-2],[0,0,1],a.label)[0],pcbHit=shoot([x,y,-2],[0,0,1],board.pcb)[0];assert.ok(filmHit&&pcbHit,'actual film and real PCB support at each interior sample');close(localHit(filmHit).z,-.54,'film exterior');close(localHit(pcbHit).z,-.5,'PCB backing touches physical film');supportRays++;
 }
 const total=new CardKB2Three.Box3();for(const object of physicalMeshes){assert.equal(object.material.side,CardKB2Three.FrontSide);total.union(bounds(object));}
 assert.equal(physicalMeshes.size,565,'complete own U215 physical material,excluding cable/port highlights and any attached child');
 for(const[x,y]of holes)for(const[dx,dy]of[[.11,.07],[.48,.09],[-.47,.11],[.09,.45],[.08,-.43]]){
  assert.equal(shoot([x+dx,y+dy,8],[0,0,-1],[...physicalMeshes]).length,0,'own mounting bores remain open through complete assembly and film');emptyRays++;
 }
 assert.equal(shoot([39+.11,-16.5+.07,8],[0,0,-1],[...physicalMeshes]).length,0,'actual lower service capsule slot is not blocked by film');emptyRays++;
 const envelope=total.getSize(new CardKB2Three.Vector3()).toArray(),expectedMinY=Math.min(-27,-27.15+u.get('boot').getActuationState().depthMm),expectedMaxY=Math.max(27,27.15-u.get('reset').getActuationState().depthMm);[84.7,expectedMaxY-expectedMinY,6.19].forEach((n,i)=>close(envelope[i],n,'own current physical envelope with inferred0.04rearfilm andactual inward sidecap depths'));
 close(total.min.x,-42.7,'actual Grove defines leftmost populated edge');close(total.max.x,42,'actual PCB defines rightmost populated edge');
 return{geometrySource:'own-dimensioned-parametric-no-CAD',nativeCadFacesConsumed:false,physicalMeshes:565,pcbMm:[84,54,1],drawingPopulatedMm:[84.7,54.3,6.15],restWithBackFilmMm:[84.7,54.3,6.19],currentOwnEnvelopeMm:envelope,realMountingBores:4,mountingGridMm:[78,48],realConnectorDrills:6,platedBarrels:6,groveContacts:4,groveThroughPcbTails:4,usbContacts:24,usbTails:24,usbRetainingTabs:4,actualMomentaryControls:44,mainControls:mainReports,sideControls:sideReports,mainMovingCapMeshes:84,sideMovingCapMeshes:4,fixedPackageMeshesPerControl:7,unmarkedMovingCaps:true,fixedPcbLegends:true,qfnTerminations:40,actualRgbOutputs:1,physicalAdhesiveFilms:1,emptyReceivingAndBoreRays:emptyRays,frontSideWallRays:wallRays,realCapInteriorRays:capRays,pcbAndFilmSupportRays:supportRays,localCoordinateToleranceMm:toleranceMm};
}

import * as NecoThree from 'three';

// Concatenated with fixture-parts.mjs: assert/world/own/under are shared bindings.
// Read-only U163 physical facts. Shared fixture owns LED commands/material-peer,
// momentary multi-source/cancel, wrong-family, artwork-off and attach roundtrips.
export function checkNecoPhysical(u){
 u.root;world(u.root);
 const a=u.necoAssembly;
 assert.ok(a?.board?.pcb?.isMesh,'own Neco PCB required');
 const frame=a.board.pcb.parent,inverse=frame.matrixWorld.clone().invert();
 // 1e-5mm covers Float32 mesh coordinates plus transformed-parent inversion;
 // no tolerance is substituted for a missing hit or FrontSide material.
 const toleranceMm=1e-5;
 const close=(actual,expected,message)=>assert.ok(Math.abs(actual-expected)<toleranceMm,message);
 const point=object=>object.getWorldPosition(new NecoThree.Vector3()).applyMatrix4(inverse);
 const bounds=object=>new NecoThree.Box3().setFromBufferAttribute(object.geometry.attributes.position).applyMatrix4(inverse.clone().multiply(object.matrixWorld));
 const ownMaterial=o=>o.isMesh&&o.userData.role!=='printed-artwork'&&o.material.opacity!==0;
 const collected=new Set();
 const collect=object=>object.traverse(o=>{if(ownMaterial(o))collected.add(o);});
 const shoot=(origin,direction,objects,coordinateFrame=frame)=>{
  const p=new NecoThree.Vector3(...origin).applyMatrix4(coordinateFrame.matrixWorld);
  const d=new NecoThree.Vector3(...direction).transformDirection(coordinateFrame.matrixWorld);
  const raycaster=new NecoThree.Raycaster(p,d);
  const hits=(Array.isArray(objects)?raycaster.intersectObjects(objects,false):raycaster.intersectObject(objects,true)).filter(h=>ownMaterial(h.object));
  for(const h of hits){
   assert.equal(h.object.material.side,NecoThree.FrontSide,'actual one-sided material, not DoubleSide hiding a missing wall');
   const normal=h.face.normal.clone().applyNormalMatrix(new NecoThree.Matrix3().getNormalMatrix(h.object.matrixWorld));
   assert.ok(normal.dot(d)<-1e-7,'material normal faces the actual incoming ray');
  }
  return hits;
 };
 const localHit=hit=>hit.point.clone().applyMatrix4(inverse);
 const board=a.board,boardBox=bounds(board.pcb);
 assert.equal(board.pcb.userData.role,'physical-pcb');
 close(boardBox.min.x,-23.55,'full own PCB left edge');close(boardBox.max.x,23.55,'full own PCB right edge');
 close(boardBox.min.y,-22.3,'full own PCB bottom');close(boardBox.max.y,22.3,'full own rounded tip');
 close(boardBox.min.z,-.5,'real PCB rear');close(boardBox.max.z,.5,'real 1mm PCB front');
 assert.equal(board.capacitors.length,17,'own schematic C1..C17 package count');
 assert.equal(board.terminals.length,34,'two real fixed metal ends per capacitor');
 assert.equal(board.pads.length,38,'four outer mounting lands plus34 capacitor solder lands');
 assert.equal(board.barrels.length,2,'two actual outer plated bores');
 assert.equal(board.eyelets.length,6,'two actual three-part metal fixing eyes');
 for(const object of[board.pcb,...board.capacitors,...board.terminals,...board.pads,...board.barrels,...board.eyelets])collect(object);
 const expectedCenters=[[-21.5,-20.2],[21.5,-20.2],[-14,-17.6],[14,-17.6]],boreRadii=[1.05,1.05,.85,.85];
 assert.equal(board.mountingCenters.length,4);
 for(let i=0;i<4;i++){
  const[x,y]=board.mountingCenters[i];close(x,expectedCenters[i][0],'own mounting centreX');close(y,expectedCenters[i][1],'own mounting centreY');
  assert.equal(shoot([x+.13,y+.07,3],[0,0,-1],board.pcb).length,0,'all four real PCB apertures remain empty');
 }
 close(expectedCenters[1][0]-expectedCenters[0][0],43,'43mm is outer centre spacing, not full width');
 close(expectedCenters[3][0]-expectedCenters[2][0],28,'28mm inner fixing centre spacing');
 close(expectedCenters[2][1]-expectedCenters[0][1],2.6,'own inner fixing centres are 2.6mm higher');
 for(let i=0;i<2;i++){
  const[x,y]=expectedCenters[i+2],[barrel,front,rear]=board.eyelets.slice(i*3,i*3+3);
  for(const part of[barrel,front,rear]){const p=point(part);assert.ok(part.isMesh&&part.parent===frame);close(p.x,x,'metal eye and own inner bore centreX');close(p.y,y,'metal eye and own inner bore centreY');}
  close(bounds(barrel).min.z,-.5,'real metal eye passes through back of PCB');close(bounds(barrel).max.z,.5,'real metal eye passes through front of PCB');
  close(bounds(front).min.z,.5,'front flange physically meets PCB');close(bounds(front).max.z,.63,'real front flange volume');
  close(bounds(rear).min.z,-2,'actual inferred rear fixing collar extends behind board');close(bounds(rear).max.z,-.5,'rear fixing collar physically meets PCB');
 }
 const socketFacts=[];
 for(const[socket,id,x]of[[a.input,'grove',3.5],[a.output,'out',-3.5]]){
  assert.ok(socket.port===u.get(id),'own socket is paired with its actual Port');assert.equal(socket.port.connector,'grove');assert.equal(socket.port.meta.face,'back');
  assert.equal(socket.parts.length,29,'actual walls/feet/anchors/back/floor/bridge and16 contact/land pieces');
  for(const field of['contacts','returns','tails','pads'])assert.equal(socket[field].length,4,'four actual '+field);
  assert.equal(socket.anchors.length,2,'two actual fixed SMD anchor tabs');
  const p=point(socket.frame),portPoint=point(socket.port.object3d);close(p.x,x,'rear socket model X');close(p.y,-7.7,'own rear socket height');close(p.z,-8.75,'own actual socket mouth depth');
  assert.ok(p.distanceTo(portPoint)<toleranceMm,'Port mating frame coincides with its own material socket');
  const mouthDirection=new NecoThree.Vector3(0,1,0).transformDirection(socket.port.object3d.matrixWorld).transformDirection(inverse);
  assert.ok(mouthDirection.distanceTo(new NecoThree.Vector3(0,0,-1))<toleranceMm,'both true Grove mouths point out of rear PCB');
  for(const object of[socket.floor,socket.back,socket.bridge,...socket.contacts,...socket.returns,...socket.tails,...socket.pads,...socket.anchors]){
   assert.ok(object.isMesh&&under(object,socket.frame)&&socket.parts.includes(object),'every actual socket part belongs to its own fixed frame');
  }
  collect(socket.frame);
  const backing=shoot([.17,4,.09],[0,-1,0],socket.frame,socket.frame)[0];assert.ok(backing&&backing.object===socket.back,'actual deep dielectric backing closes each Grove cavity');
  for(const d of[[1,0,0],[-1,0,0],[0,0,-1]])assert.ok(shoot([.17,-2,.09],d,socket.frame,socket.frame)[0],'real end/floor walls behind an actual receiving mouth');
  for(let i=0;i<4;i++){
   const contact=socket.contacts[i],p=socket.port.object3d.worldToLocal(contact.getWorldPosition(new NecoThree.Vector3()));
   assert.equal(socket.port.pinAt(p).n,i+1,'four material contacts match the actual pin grid');close(p.x,(i-1.5)*2,'own real contact pitch');
   const tail=bounds(socket.tails[i]),pad=bounds(socket.pads[i]);
   close(tail.max.z,-.5,'SMD tail meets actual back plane; no floating contact');close(tail.min.z,-.7,'actual SMD tail thickness');
   close(pad.max.z,-.5,'SMD solder land meets actual PCB');close(pad.min.z,-.535,'real thin SMD land');
  }
  socketFacts.push({id,face:'back',contacts:4,smdTails:4,smdPads:4,fixedAnchors:2,actualMaterialParts:29});
 }
 const display=a.display,leds=own(u,'led'),positions=[];
 assert.equal(leds.length,35);assert.equal(display.components.length,35);assert.equal(display.frames.length,35);assert.equal(display.lenses.length,35);
 assert.equal(display.packages.length,70,'35 real base/lip pairs');assert.equal(display.terminals.length,140,'four actual fixed terminations per package');
 let topRays=0,pcbSupportRays=0;
 for(let i=0;i<35;i++){
  const led=u.get('led-'+(i+1)),lens=display.lenses[i],packageFrame=display.frames[i],position=point(led.object3d),base=display.packages[i*2],lip=display.packages[i*2+1];
  assert.ok(led===leds[i]&&display.components[i]===led,'ordinary Led corresponds to its own visible RGB package');
  assert.ok(led.lens===lens&&lens.material===led.lensMaterial&&under(lens,led.object3d),'the actual encapsulant is the component emitter');
  assert.equal(led.meta.packageIndex,i+1,'visible path number is not a fabricated serial address');
  close(position.z,1.175,'actual emitter centre');positions.push(position.toArray());
  const fp=point(packageFrame);close(fp.x,position.x,'fixed package and own emitter X');close(fp.y,position.y,'fixed package and own emitter Y');close(fp.z,.5,'package rests on real PCB front');
  assert.ok(base.parent===packageFrame&&lip.parent===packageFrame,'real white base/lip are fixed independently of LED state');
  close(bounds(base).min.z,.5,'complete white package base begins at actual PCB');close(bounds(base).max.z,1.05,'actual fixed package base thickness');
  close(bounds(lip).min.z,1.05,'molded lip meets base');close(bounds(lip).max.z,1.35,'molded lip surrounds actual lens top');
  close(bounds(lens).max.z,1.35,'real closed encapsulant top');
  for(const part of[base,lip])collect(part);
  for(const terminal of display.terminals.slice(i*4,i*4+4)){
   assert.ok(terminal.parent===packageFrame,'four real terminal parts fixed to their own package frame');
   close(Math.abs(terminal.position.x),.74,'actual corner terminal X');close(Math.abs(terminal.position.y),.74,'actual corner terminal Y');
   close(bounds(terminal).min.z,.5,'terminal meets PCB front');close(bounds(terminal).max.z,.57,'actual terminal volume');collect(terminal);
  }
  collect(lens);
  // Cylinder fan centres and mesh edges are shared vertices. Both probes are
  // deliberately inside the actual lens cap, not on its centre/edge seams.
  for(const[dx,dy]of[[.13,.07],[-.11,.08]]){
   const hit=shoot([position.x+dx,position.y+dy,2.5],[0,0,-1],lens)[0];assert.ok(hit,'actual independent encapsulant has outward top material');close(localHit(hit).z,1.35,'closed real lens top height');
   assert.equal(shoot([position.x+dx,position.y+dy,2.5],[0,0,-1],lip).length,0,'molded lip retains true encapsulant opening');topRays++;
  }
  // Five explicit interior footprint points, all in package-local XY and then
  // mapped through the common body frame; valid below rotated/attached parents.
  for(const[dx,dy]of[[.11,.07],[.87,.91],[.89,-.88],[-.91,.87],[-.88,-.9]]){
   const p=new NecoThree.Vector3(dx,dy,1.5).applyMatrix4(packageFrame.matrixWorld).applyMatrix4(inverse);
   const support=shoot(p.toArray(),[0,0,-1],board.pcb)[0];assert.ok(support,'complete own PCB supports each real RGB footprint');close(localHit(support).z,.5,'actual board material beneath package');pcbSupportRays++;
  }
 }
 for(let i=0;i<17;i++){
  assert.ok(positions[i][0]<0&&positions[34-i][0]>0,'17 actual packages on each side');close(positions[i][0],-positions[34-i][0],'own symmetric package X');close(positions[i][1],positions[34-i][1],'own symmetric package Y');
 }
 close(positions[17][0],0,'one actual tip package');assert.ok(positions[17][1]>19.9&&positions[17][1]<20.3,'tip package is inside own rounded top');
 assert.ok(positions[0][1]<-17.5&&positions[34][1]<-17.5,'edge path reaches both lower ends');
 const control=a.control,button=u.get('button');assert.ok(control.button===button&&own(u,'button').length===1,'one actual rear S1 control');
 assert.equal(button.isLatching,false);close(button.travel,.15,'documented inferred actual cap travel');assert.ok(button.axis.distanceTo(new NecoThree.Vector3(0,0,1))<toleranceMm,'rear cap presses into PCB along+Z');
 const controlPosition=point(button.object3d),fixedPosition=point(control.frame);close(controlPosition.x,8.6,'own rear cap X');close(controlPosition.y,12.7,'own rear cap Y');close(controlPosition.z,-1.42,'own cap rest frame');
 close(fixedPosition.x,8.6,'fixed switch shares real cap X');close(fixedPosition.y,12.7,'fixed switch shares real cap Y');close(fixedPosition.z,-.5,'fixed switch package installed on rear PCB');
 assert.equal(control.fixed.length,3,'closed base, real well and open metal lid');assert.equal(control.terminals.length,4,'four fixed S1 terminals');
 assert.ok(control.fixed.includes(control.base)&&control.base.parent===control.frame);close(bounds(control.base).max.z,-.5,'closed switch base physically meets PCB');
 assert.ok(control.moving.parent===button.cap,'the true yellow/dark cap belongs to the actual Button cap carrier');assert.equal(control.moving.children.length,2,'no duplicated or invented cap layer');
 for(const part of[...control.fixed,...control.terminals]){assert.ok(part.isMesh&&under(part,control.frame)&&!under(part,button.cap),'actual switch base/cover/contacts remain fixed');collect(part);}
 const movingMeshes=[];control.moving.traverse(o=>{if(ownMaterial(o))movingMeshes.push(o);});assert.equal(movingMeshes.length,2,'only real yellow cap and dark centre move');collect(control.moving);
 const yellow=movingMeshes[0],yellowGeometry=new NecoThree.Box3().setFromBufferAttribute(yellow.geometry.attributes.position).getSize(new NecoThree.Vector3());
 close(yellowGeometry.x,2.16,'actual cap width inside fixed well');close(yellowGeometry.y,2.9,'actual cap height inside fixed well');close(yellowGeometry.z,.5,'real volumetric cap, not hit-only plane');
 const capHit=shoot([.63,.77,-2],[0,0,1],yellow,button.object3d)[0];assert.ok(capHit,'actual rear-facing yellow material is reachable at a cap interior point');
 const closedSwitch=shoot([.17,-.11,-3],[0,0,1],control.base,button.object3d)[0];assert.ok(closedSwitch,'fixed closed switch backing exists behind the actual cap opening');
 const total=new NecoThree.Box3();for(const object of collected){assert.equal(object.material.side,NecoThree.FrontSide);assert.notEqual(object.userData.role,'physical-label-substrate');total.union(bounds(object));}
 assert.equal(collected.size,410,'complete own physical assembly excludes cable/port highlights and any attached child');
 let emptyRays=0,boreWallRays=0;
 for(let i=0;i<4;i++){
  const[x,y]=expectedCenters[i];
  for(const[dx,dy]of[[.09,.06],[.43,.08],[-.41,.07],[.07,.42],[.08,-.43]]){assert.equal(shoot([x+dx,y+dy,4],[0,0,-1],[...collected]).length,0,'real bore is not covered by an invented face or distant own part');emptyRays++;}
  // Rays begin just away from exact symmetry edges but at the true bore centre.
  // The finite 72-segment inner wall can differ from a mathematical circle by
  // at most 0.001mm here; cardinal probes hit actual side-wall interiors.
  for(const d of[[1,.013,0],[-1,.017,0],[.019,1,0],[.011,-1,0]]){
   const hit=shoot([x,y,.07],d,[...collected])[0];assert.ok(hit,'all actual mounting/eye bores have outward material walls');
   const p=localHit(hit);assert.ok(Math.abs(Math.hypot(p.x-x,p.y-y)-boreRadii[i])<.0011,'true unmasked plated/metal-eye bore radius');boreWallRays++;
  }
 }
 const envelope=total.getSize(new NecoThree.Vector3()).toArray();[47.1,44.6,10.1].forEach((n,i)=>close(envelope[i],n,'full own physical envelope, independent of Device metadata'));
 close(total.min.z,-8.75,'actual Grove mouth defines rear bound');close(total.max.z,1.35,'real RGB packages define front bound');
 return{geometrySource:'own-dimensioned-parametric',nativeCadFacesConsumed:false,physicalMeshes:410,pcbThicknessMm:1,mountingBores:4,outerHoleCentreSpanMm:43,innerFixingCentreSpanMm:28,metalFixingEyes:2,physicalLeds:35,sidePackageCounts:[17,1,17],fixedPackageBaseAndLipMeshes:70,actualPackageTerminations:140,capacitors:17,sockets:socketFacts,actualRearMomentaryCaps:1,capOnlyTravelMm:.15,fixedSwitchParts:3,fixedSwitchTerminals:4,physicalAdhesiveFilms:0,emptyBoreRays:emptyRays,frontSideBoreWallRays:boreWallRays,interiorLensTopRays:topRays,pcbFootprintSupportRays:pcbSupportRays,localCoordinateToleranceMm:toleranceMm,currentOwnEnvelopeMm:envelope};
}

import * as MiniOledThree from 'three';

// Concatenated with fixture-parts.mjs: assert/world/own/under are shared bindings.
// Read-only own U166 material facts. Root owns framebuffer/control rejection,
// no-echo, peers, artwork, wrong-family and attachment roundtrip fixtures.
export function checkMiniOledPhysical(u){
 u.root;world(u.root);
 const a=u.miniOledAssembly;
 assert.ok(a?.board?.pcb?.isMesh,'actual own U166 rigid PCB required');
 const frame=a.board.pcb.parent,inverse=frame.matrixWorld.clone().invert(),toleranceMm=1e-5;
 const close=(v,n,message)=>assert.ok(Math.abs(v-n)<toleranceMm,message);
 const point=o=>o.getWorldPosition(new MiniOledThree.Vector3()).applyMatrix4(inverse);
 const bounds=o=>new MiniOledThree.Box3().setFromBufferAttribute(o.geometry.attributes.position).applyMatrix4(inverse.clone().multiply(o.matrixWorld));
 const ownMaterial=o=>o.isMesh&&o.userData.role!=='printed-artwork'&&o.userData.role!=='display-surface'&&o.material.opacity!==0;
 const physicalMeshes=new Set(),collect=o=>o.traverse(p=>{if(ownMaterial(p))physicalMeshes.add(p);});
 const shoot=(origin,direction,objects,coordinateFrame=frame)=>{
  const p=new MiniOledThree.Vector3(...origin).applyMatrix4(coordinateFrame.matrixWorld),d=new MiniOledThree.Vector3(...direction).transformDirection(coordinateFrame.matrixWorld);
  const ray=new MiniOledThree.Raycaster(p,d),hits=(Array.isArray(objects)?ray.intersectObjects(objects,false):ray.intersectObject(objects,true)).filter(h=>ownMaterial(h.object));
  for(const h of hits){
   assert.equal(h.object.material.side,MiniOledThree.FrontSide,'actual FrontSide material, not a DoubleSide wall substitute');
   const normal=h.face.normal.clone().applyNormalMatrix(new MiniOledThree.Matrix3().getNormalMatrix(h.object.matrixWorld));
   assert.ok(normal.dot(d)<-1e-7,'real material normal opposes incoming physical ray');
  }
  return hits;
 };
 const localHit=h=>h.point.clone().applyMatrix4(inverse);
 const board=a.board,pcbBox=bounds(board.pcb);
 assert.equal(board.pcb.userData.role,'physical-pcb');
 close(pcbBox.min.x,-12.9,'own25.8mm rigid PCB left');close(pcbBox.max.x,12.9,'own25.8mm rigid PCB right');
 close(pcbBox.min.y,-6,'own12mm rigid PCB bottom');close(pcbBox.max.y,6,'own12mm rigid PCB top');
 close(pcbBox.min.z,-3.2,'actual PCB rear plane');close(pcbBox.max.z,-2.2,'actual1mm PCB front plane');
 assert.equal(board.htPins.length,3,'actual HT7533 three functional terminations');
 assert.equal(board.passives.length,15,'own schematic eleven capacitors andfour resistors');
 assert.equal(board.terminations.length,30,'two actual fixed ends per passive');
 assert.equal(board.lands.length,33,'HT7533 plus11C4R solder lands');
 for(const p of[board.pcb,board.ht,...board.htPins,...board.passives,...board.terminations,...board.lands]){assert.ok(p.isMesh&&p.parent===frame);collect(p);}
 close(bounds(board.ht).min.z,-2.2,'actual regulator body seated on real PCB');
 let pcbSupportRays=0;
 for(const part of[board.ht,...board.passives]){
  const p=point(part),h=shoot([p.x+.11,p.y+.07,0],[0,0,-1],board.pcb)[0];assert.ok(h,'own rigid material supports real populated package footprint');close(localHit(h).z,-2.2,'actual front material beneath HT7533/11C4R');pcbSupportRays++;
 }
 let pcbEmptyRays=0,pcbWallRays=0;
 for(const[x,y]of[[-8,-4],[-8,4],[8,-4],[8,4]]){
  for(const[dx,dy]of[[.07,.04],[.23,.03],[-.22,.05],[.03,.21],[.04,-.23]]){
   assert.equal(shoot([x+dx,y+dy,0],[0,0,-1],board.pcb).length,0,'four unmarked PCB holes have actual open axes,not asserted whole-product mounts');pcbEmptyRays++;
  }
  for(const d of[[1,.013,0],[-1,.017,0],[.019,1,0],[.011,-1,0]]){
   const h=shoot([x,y,-2.7],d,board.pcb)[0];assert.ok(h,'real FrontSide own board bore wall');const p=localHit(h);assert.ok(Math.abs(Math.hypot(p.x-x,p.y-y)-.4)<.001,'inferred actual unmarked Ø.8 board-bore material');pcbWallRays++;
  }
 }

 const sockets=[];let contactRays=0,cavityWallRays=0,seatRays=0;
 for(const[c,id,sign]of[[a.left,'grove',-1],[a.right,'grove-right',1]]){
  assert.ok(c.port===u.get(id)&&own(u,'port').includes(c.port),'each own actual white socket owns its real mechanical Port');
  assert.equal(c.port.connector,'grove');assert.equal(c.port.meta.face,sign<0?'left':'right');
  const cp=point(c.frame),pp=point(c.port.object3d);close(cp.x,sign*12.9,'own Grove mouth X');close(cp.y,0,'own Grove mouth Y');close(cp.z,.375,'own Grove mouth Z');assert.ok(cp.distanceTo(pp)<toleranceMm,'material mouth and real Port frame coincide');
  const outward=new MiniOledThree.Vector3(0,1,0).transformDirection(c.port.object3d.matrixWorld).transformDirection(inverse);assert.ok(outward.distanceTo(new MiniOledThree.Vector3(sign,0,0))<toleranceMm,'real left/right mating normal');
  assert.equal(c.walls.length,4,'two tall outer walls andtwo relieved inner seats');assert.equal(c.guides.length,4,'actual top andlower insertion guides');
  for(const field of['contacts','returns','feet','lands'])assert.equal(c[field].length,4,'four actual SMT Grove '+field);
  for(const p of[c.floor,...c.walls,...c.guides,c.roof,c.back,...c.contacts,...c.returns,...c.feet,...c.lands])assert.ok(p.isMesh&&p.parent===c.frame,'all socket materials remain on own fixed socket frame');
  collect(c.frame);
  close(bounds(c.floor).min.z,-2.2,'actual Grove floor seated at rigid PCB front');close(bounds(c.back).max.z,2.125,'actual relieved inner seat reaches lower glass underside');
  for(let i=0;i<4;i++){
   const p=c.contacts[i].position;close(p.x,(i-1.5)*2,'real2mm contact pitch');close(p.y,-.2,'actual metal contact row');
   const hit=shoot([(i-1.5)*2,-.2,1],[0,0,-1],c.frame,c.frame)[0];assert.ok(hit?.object===c.contacts[i],'each of eight actual metal contacts visible within true receiving mouth');
   const local=hit.point.clone().applyMatrix4(c.frame.matrixWorld.clone().invert());close(local.z,-1.4,'actual recessed metal contact front');contactRays++;
   close(bounds(c.feet[i]).min.z,-2.2,'real SMT foot physically meets PCB plane');close(bounds(c.lands[i]).min.z,-2.2,'actual SMT solder land meets rigid PCB plane');
  }
  const backing=shoot([.13,-.2,1],[0,0,-1],c.frame,c.frame)[0];assert.ok(backing?.object===c.back,'real recessed dielectric backing closes actual receiving cavity');
  for(const[d,n]of[[[1,0,0],5.2],[[-1,0,0],5.2],[[0,-1,0],1.875]]){
   const h=shoot([0,0,-2],d,[c.floor,...c.walls],c.frame)[0];assert.ok(h,'real material socket cavity wall');const p=h.point.clone().applyMatrix4(c.frame.matrixWorld.clone().invert());close(d[0]?Math.abs(p.x):Math.abs(p.y),n,'true socket cavity inner dimension');cavityWallRays++;
  }
  const seat=shoot([sign*5.9,.17,2.4],[0,0,-1],c.back)[0];assert.ok(seat,'real own Grove shoulder supports lower glass edge');close(localHit(seat).z,2.125,'true contact plane at actual glass underside');seatRays++;
  const pcbSupport=shoot([sign*10,.13,-1],[0,0,-1],board.pcb)[0];assert.ok(pcbSupport,'actual rigid board beneath each Grove floor');close(localHit(pcbSupport).z,-2.2,'Grove board support plane');pcbSupportRays++;
  sockets.push({id,contacts:4,bentSmtReturns:4,smtFeet:4,solderLands:4,materialMeshes:27});
 }

 const flex=a.flex;assert.equal(flex.pads.length,16);assert.equal(flex.fanTraces.length,16);assert.equal(flex.foldTraces.length,16);
 for(const p of[flex.tail,...flex.pads,...flex.fanTraces,flex.folded,...flex.foldTraces,flex.bond]){assert.ok(p.isMesh&&p.parent===frame,'actual installed flex belongs to fixed Unit assembly');collect(p);}
 const tail=bounds(flex.tail),fold=bounds(flex.folded);close(tail.max.x-tail.min.x,11.25,'own panel-datasheet FPC tail width');close(tail.min.z,-3.375,'actual rear FPC material bound');close(tail.max.z,-3.275,'actual inferred.1mm FPC thickness');
 close(fold.min.y,-6.12,'actual reconstructed flex outside own12mm rigid PCB footprint');assert.ok(fold.max.y< -2,'default flex is folded behind andaround actual board,not the long unfolded publicity pose');
 let tailEmptyRays=0,tailWallRays=0;
 for(const x of[-4.625,4.625]){
  assert.equal(shoot([x+.07,-.96,-4],[0,0,1],flex.tail).length,0,'two own datasheet FPC tail holes truly open');tailEmptyRays++;
  for(const d of[[1,.013,0],[-1,.017,0],[.019,1,0],[.011,-1,0]]){
   const h=shoot([x,-1,-3.325],d,flex.tail)[0];assert.ok(h,'real FrontSide FPC tail bore wall');const p=localHit(h);assert.ok(Math.abs(Math.hypot(p.x-x,p.y+1)-.4)<.001,'own datasheet Ø.8 FPC material hole');tailWallRays++;
  }
 }
 for(let i=0;i<16;i++){
  const p=point(flex.pads[i]),b=bounds(flex.pads[i]);close(p.x,(i-7.5)*.65,'own.65mm FPC pitch');close(b.max.x-b.min.x,.35,'own.35mm actual contact width');close(b.max.z,-3.2,'actual solder contact reaches own PCB rear');close(b.min.z,-3.375,'actual solder contact reaches FPC tail rear');
  const trace=bounds(flex.foldTraces[i]);assert.ok(fold.containsBox(trace),'each real folded copper trace stays inside actual closed polyimide ribbon');
 }
 const fp=flex.folded.geometry.attributes.position;let outsideCornerVertices=0;
 for(let i=0;i<fp.count;i++)if(fp.getZ(i)>-3.2+1e-6&&fp.getZ(i)<-2.2-1e-6){assert.ok(fp.getY(i)<-6-.001,'actual lower folded flex clears source rigid PCB edge');outsideCornerVertices++;}
 assert.ok(outsideCornerVertices>=4);

 const glass=a.glass;assert.deepEqual(Object.keys(glass),['base','cap','seal','adhesive']);
 for(const p of Object.values(glass)){assert.ok(p.isMesh&&p.parent===frame);collect(p);}
 const base=bounds(glass.base),cap=bounds(glass.cap),adhesive=bounds(glass.adhesive);
 close(base.max.x-base.min.x,12,'own12mm actual glass width');close(base.max.y-base.min.y,11,'own11mm actual glass height');close(base.min.z,2.125,'actual glass underside');close(base.max.z,2.825,'real lower glass volume');close(cap.min.z,2.825,'real upper cap meets lower glass');close(cap.max.z,3.375,'actual complete1.25mm panel front');
 close(adhesive.max.x-adhesive.min.x,11,'own linked protection tape width');close(adhesive.max.y-adhesive.min.y,8.5,'own linked protection tape height');close(adhesive.max.z-adhesive.min.z,.05,'own linked thin tape material');close(adhesive.max.z,base.min.z,'actual underside protection meets actual glass');
 close(bounds(flex.bond).max.z,base.min.z,'actual folded flex bond physically meets own glass underside');
 const display=u.get('lcd'),dp=point(display.object3d);assert.ok(display===a.display&&own(u,'display').length===1);assert.ok(display.panel.isMesh&&under(display.panel,display.object3d));assert.equal(display.panel.userData.role,'display-surface');assert.equal(display.glass,undefined,'physical closed glass is independently modeled');
 close(dp.x,0,'own active centreX');close(dp.y,1.535,'own active centreY from panel drawing');close(dp.z,3.375,'actual output on closed cap front');
 const active=bounds(display.panel);close(active.max.x-active.min.x,9.196,'own active width');close(active.max.y-active.min.y,5.18,'own active height');close(active.max.z-active.min.z,0,'external output is a visual surface,not substituted physical glass');
 let glassSupportRays=0;for(const[x,y]of[[.13,1.605],[-4.4,-.9],[4.4,-.9],[-4.4,4],[4.4,4]]){
  const h=shoot([x,y,5],[0,0,-1],glass.cap)[0];assert.ok(h,'actual opaque volumetric glass closes all sampled active-area points');close(localHit(h).z,3.375,'true cap front supports actual external output plane');glassSupportRays++;
 }

 // Coordinate-welded directed count-two edges and positive local material
 // volume establish actual solids independently from arbitrary parent pose.
 let directedEdges=0;
 for(const p of physicalMeshes){
  assert.equal(p.material.side,MiniOledThree.FrontSide);assert.notEqual(p.userData.role,'physical-label-substrate');
  const g=p.geometry,position=g.attributes.position,index=g.index?.array,edges=new Map(),key=i=>[position.getX(i),position.getY(i),position.getZ(i)].map(v=>Math.round(v*1e5)).join(',');let volume=0;
  for(let k=0;k<(index?.length??position.count);k+=3){
   const ids=[0,1,2].map(i=>index?index[k+i]:k+i),keys=ids.map(key),v=ids.map(i=>new MiniOledThree.Vector3().fromBufferAttribute(position,i));volume+=v[0].dot(v[1].cross(v[2]))/6;
   for(let i=0;i<3;i++){const x=keys[i],y=keys[(i+1)%3];if(x===y)continue;const k=x<y?x+'|'+y:y+'|'+x,e=edges.get(k)??[0,0];e[0]++;e[1]+=x<y?1:-1;edges.set(k,e);}
  }
  assert.ok([...edges.values()].every(e=>e[0]===2&&e[1]===0),'actual own material has directed count-two closed edges: '+p.name);assert.ok(volume>0,'actual positive material volume: '+p.name);directedEdges+=edges.size;
 }
 assert.equal(physicalMeshes.size,192,'complete own U166 material excludes output plane,port highlights,cables and attached child assemblies');
 const total=new MiniOledThree.Box3();for(const p of physicalMeshes)total.union(bounds(p));const envelope=total.getSize(new MiniOledThree.Vector3()).toArray();[25.8,12.12,6.75].forEach((n,i)=>close(envelope[i],n,'real own assembled envelope includes separately reported inferred flex edge'));
 return{geometrySource:'own-dimensioned-parametric-no-CAD',nativeCadFacesConsumed:false,physicalMeshes:192,closedDirectedCountTwoMeshes:192,directedEdges,allPositiveVolume:true,allFrontSide:true,rigidDrawingMm:[25.8,12,6.75],roundedProductThicknessMm:6.8,currentOwnEnvelopeMm:envelope,inferredFoldedFlexEdgeExtensionMm:.12,pcbThicknessMm:1,unmarkedPcbBores:4,assertedWholeProductMountingFunction:false,pcbEmptyRays,pcbWallRays,ht7533Terminations:3,capacitors:11,resistors:4,sockets,actualMetalContactRays:contactRays,actualCavityWallRays:cavityWallRays,actualGlassSeatRays:seatRays,pcbSupportRays,fpcPins:16,fpcContactPitchMm:.65,fpcContactWidthMm:.35,actualFpcTailBores:2,tailEmptyRays,tailWallRays,defaultFoldedFpc:true,outsideCornerVertices,glassMm:[12,11,1.25],protectionTapeMm:[11,8.5,.05],physicalAdhesiveFilms:0,actualGlassSupportRays:glassSupportRays,externalOutputPlaneIsNotMaterialSolid:true,localCoordinateToleranceMm:toleranceMm};
}

/** External pixel traffic reaches the actual native panel texture,without changing material geometry. */
export function checkMiniOledFramebuffer(host,u,prefix,events){
 u.root;const displays=own(u,'display');assert.equal(displays.length,1);const d=displays[0],id=d.id;
 assert.equal(d.width,72);assert.equal(d.height,40);assert.deepEqual(d.size,[9.196,5.18]);assert.equal(d.touchEnabled,false);assert.equal(d.interactive,false);assert.equal(d.meta.monochrome,true);
 assert.ok(d.texture.image.data===d.buffer);assert.ok(d.material.uniforms.map.value===d.texture);assert.equal(d.material.uniforms.style.value,1);assert.equal(d.material.uniforms.blackLevel.value.getHex(),0);assert.ok(d.panel.isMesh&&under(d.panel,d.object3d));
 assert.ok(d.material.fragmentShader.includes('vec3(step(0.5, dot(texture2D(map, (cell + 0.5) / res).rgb, vec3(0.2126, 0.7152, 0.0722))))'),'actual pixel shader maps source luminance to fixed white OLED');
 const geometry=d.panel.geometry;assert.ok(Math.abs(geometry.parameters.width-9.196)<1e-9&&Math.abs(geometry.parameters.height-5.18)<1e-9);
 const rest=d.buffer.slice(),shape=physical(u),ports=frames(u),start=events.length;
 const check=()=>{assert.equal(events.length,start);assert.equal(physical(u),shape);assert.equal(frames(u),ports);assert.ok(d.texture.image.data===d.buffer&&d.material.uniforms.map.value===d.texture);assert.equal(d.touchEnabled,false);};
 const expected=rest.slice();
 try{
  for(const run of[()=>d.setStyle('lcd'),()=>d.setStyle('reflective'),()=>d.setTouchEnabled(true),()=>d.touch('down',1,1),()=>host.handle({type:'display',target:target(prefix,id),style:'lcd'}),()=>host.handle({type:'display',target:target(prefix,id),touch:true})]){const before=hash(d.buffer);assert.throws(run);assert.equal(hash(d.buffer),before);check();}
  d.setStyle('oled');d.setTouchEnabled(false);host.handle({type:'display',target:target(prefix,id),style:'oled',touch:false});check();
  const rgba=new Uint8Array(72*40*4);for(let y=0;y<40;y++)for(let x=0;x<72;x++){const p=(y*72+x)*4,v=(x+y)%2?255:0;rgba[p]=rgba[p+1]=rgba[p+2]=v;rgba[p+3]=255;}
  host.handle({type:'display',target:target(prefix,id),format:'rgba',x:0,y:0,w:72,h:40,data:rgba});expected.set(rgba);assert.equal(hash(d.buffer),hash(expected));check();
  host.handle({type:'display',target:target(prefix,id),format:'rgb888',x:5,y:4,w:1,h:1,data:new Uint8Array([255,0,0])});expected.set([255,0,0],(4*72+5)*4);assert.equal(hash(d.buffer),hash(expected));assert.deepEqual(d.getPixel(5,4),[255,0,0],'source RGB buffer remains external data;white mapping belongs to actual shader');check();
  host.handle({type:'display',target:target(prefix,id),format:'rgb565',x:2,y:1,w:2,h:1,data:new Uint16Array([0xffff,0])});expected.set([255,255,255],(72+2)*4);expected.set([0,0,0],(72+3)*4);assert.equal(hash(d.buffer),hash(expected));check();
  host.handle({type:'display',target:target(prefix,id),fill:'#ffffff',rect:{x:70,y:38,w:3,h:3}});for(let y=38;y<40;y++)for(let x=70;x<72;x++)expected.set([255,255,255],(y*72+x)*4);assert.equal(hash(d.buffer),hash(expected));check();
  const stable=hash(d.buffer),state=d.getState();host.update(.5);assert.equal(hash(d.buffer),stable,'no autonomous screen content or controller state');assert.deepEqual(d.getState(),state);check();
 }finally{d.buffer.set(rest);d.invalidate();}
 assert.equal(hash(d.buffer),hash(rest));check();return{id,resolution:[72,40],activeMm:[9.196,5.18],sourceBufferPreserved:true,actualTextureAlias:true,formats:['rgba','rgb888','rgb565','clipped-fill'],externalNoEcho:true,physicalAndPortsUnchanged:true,touch:false,unsupportedStyleAndTouch:'six actual rejected branches preserve pixels and physical state',scope:'CPU framebuffer and material binding/shader contract only;no GPU pixels or SSD1315/I2C emulation'};
}

import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {loadModel,loadGroveModule} from '../src/loaders.js';
import {FramebufferPanel} from '../demo/framebuffers.js';

const ids=['cardkb2','neco','mini-oled'];
const expectedApi={"cardkb2":{"body":["grove","usb","key-1","key-2","key-3","key-4","key-5","key-6","key-7","key-8","key-9","key-10","key-11","key-12","key-13","key-14","key-15","key-16","key-17","key-18","key-19","key-20","key-21","key-22","key-23","key-24","key-25","key-26","key-27","key-28","key-29","key-30","key-31","key-32","key-33","key-34","key-35","key-36","key-37","key-38","key-39","key-40","key-41","key-42","reset","boot","rgb"],"ports":["grove","usb"],"controls":["key-1","key-2","key-3","key-4","key-5","key-6","key-7","key-8","key-9","key-10","key-11","key-12","key-13","key-14","key-15","key-16","key-17","key-18","key-19","key-20","key-21","key-22","key-23","key-24","key-25","key-26","key-27","key-28","key-29","key-30","key-31","key-32","key-33","key-34","key-35","key-36","key-37","key-38","key-39","key-40","key-41","key-42","reset","boot"],"leds":["rgb"],"displays":[],"canonical":"grove"},"neco":{"body":["grove","out","button","led-1","led-2","led-3","led-4","led-5","led-6","led-7","led-8","led-9","led-10","led-11","led-12","led-13","led-14","led-15","led-16","led-17","led-18","led-19","led-20","led-21","led-22","led-23","led-24","led-25","led-26","led-27","led-28","led-29","led-30","led-31","led-32","led-33","led-34","led-35"],"ports":["grove","out"],"controls":["button"],"leds":["led-1","led-2","led-3","led-4","led-5","led-6","led-7","led-8","led-9","led-10","led-11","led-12","led-13","led-14","led-15","led-16","led-17","led-18","led-19","led-20","led-21","led-22","led-23","led-24","led-25","led-26","led-27","led-28","led-29","led-30","led-31","led-32","led-33","led-34","led-35"],"displays":[],"canonical":"grove"},"mini-oled":{"body":["grove","grove-right","lcd"],"ports":["grove","grove-right"],"controls":[],"leds":[],"displays":["lcd"],"canonical":"grove"}};
const expectedPrint={"cardkb2":["reference-redraw","source-vector-raster"],"neco":["reference-redraw","reference-redraw"],"mini-oled":["reference-redraw","reference-redraw"]};
function checkBoundary(u,id){
 u.root;const a=expectedApi[id],body=[...u.components.keys()].filter(k=>!['unitFrame','cable'].includes(k));
 assert.deepEqual(body,a.body);for(const[kind,key]of[['port','ports'],['button','controls'],['led','leds'],['display','displays']])assert.deepEqual(own(u,kind).map(c=>c.id),a[key]);
 for(const kind of['joint','sensor','speaker','rotary-selector','led-matrix'])assert.equal(own(u,kind).length,0,'no invented firmware/electrical/automatic motion components');
 for(const c of own(u,'component')){assert.equal(c.interactive,false);assert.deepEqual(c.getState(),{});}
 assert.equal(u.get(a.canonical).connector,'grove');return{id,body,ports:a.ports,controls:a.controls,leds:a.leds,displays:a.displays};
}
function checkPhysical(u,id){return id==='cardkb2'?checkCardKB2Physical(u):id==='neco'?checkNecoPhysical(u):checkMiniOledPhysical(u);}
function artworkPressed(on,off,ids){
 const reports=[];for(const id of ids){const a=on.get(id),b=off.get(id);a.press('fixture:ink');b.press('fixture:ink');on.update(.035);off.update(.035);assert.ok(a.getActuationState().depthMm>0);assert.equal(physical(on),physical(off),'actual partial press preserves every physical record with ink disabled');a.cancel('fixture:ink');b.cancel('fixture:ink');tick(on);tick(off);assert.equal(physical(on),physical(off));reports.push(id);}return reports;
}
async function nestedKey(host,u,prefix,portId,events){
 const key=await loadGroveModule('key',{cableLength:55}),p=u.get(portId),rest=physical(u),ports=frames(u),n=events.length;p.attach(key);host.update(0);
 assert.equal(key.get('cable').getState().wireCount,4);const path=target(prefix,portId),shape=physical(u,[key.root]);assert.equal(shape,rest);
 checkMomentaries(host,key,path,events,['press']);roundtrip(u,p);assert.equal(frames(u),ports);assert.ok(p.detach({dispose:false})===key);key.dispose();host.update(0);assert.equal(physical(u),rest);assert.equal(frames(u),ports);
 return{port:portId,wireCount:4,inputPath:target(path,'press'),retainedPhysical:'identical',observedInputEvents:events.length-n,electricalCascade:false};
}
function checkFramebufferPanel(host,u,hub){
 const d=u.get('lcd'),h=host.display(),hostRest=h.buffer.slice(),unitRest=d.buffer.slice(),shape=physical(u),selector={value:'',replaceChildren(...items){this.items=items;}},button={dataset:{},setAttribute(k,v){this[k]=v;}},panel=new FramebufferPanel({selector,button});
 try{
  panel.bind(host);h.buffer.set(hostRest);h.invalidate();selector.value='grove/grove-3/lcd';selector.onchange();assert.ok(panel.target()===d);assert.equal(selector.hidden,false);assert.ok(selector.items.some(x=>x.value==='grove/grove-3/lcd'));
  const beforeHost=hash(h.buffer),beforeUnit=hash(d.buffer);button.onclick();assert.notEqual(hash(d.buffer),beforeUnit);assert.equal(hash(h.buffer),beforeHost);assert.equal(physical(u),shape);assert.equal(d.touchEnabled,false);
  const calibrated=hash(d.buffer),p=hub.get('grove-3');assert.ok(p.detach({dispose:false})===u);assert.equal(hash(d.buffer),calibrated);assert.equal(hash(h.buffer),beforeHost);p.attach(u);host.update(0);assert.equal(hash(d.buffer),calibrated);assert.equal(hash(h.buffer),beforeHost);selector.value='grove/grove-3/lcd';selector.onchange();assert.ok(panel.target()===d);
  return{actualDemoClass:'FramebufferPanel',nestedPath:'grove/grove-3/lcd',calibrationTargetOnly:true,attachDetachRefreshWritesPixels:false,scope:'Actual demo controller with DOM stubs;CPU framebuffer only'};
 }finally{panel.unbind();h.buffer.set(hostRest);h.invalidate();d.buffer.set(unitRest);d.invalidate();}
}

/** Three current own-SKU models with real controls,external outputs and four-core assemblies. */
export async function checkCardKB2NecoMiniOledUnits(){
 const restore=installCanvasStub();let host;
 try{
  const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
  host=await loadModel('sticks3');host.root;host.display().fill('#123456');const framebuffer=hash(host.display().buffer),hub=await loadGroveModule('hub');host.port('grove').attach(hub);
  const units={},events=[],components=[],artwork=[],configurations=[],controls=[],outputs=[],nested=[];host.on('input',e=>{if(e.kind!=='port')events.push(e);});
  for(const[i,id]of ids.entries()){
   const u=await loadGroveModule(id,{cableLength:75+i*15});hub.get(`grove-${i+1}`).attach(u);host.update(0);units[id]=u;assert.equal(u.get('cable').getState().wireCount,4);components.push(checkBoundary(u,id));
   const product=catalog.products.find(p=>p.id===id),seen=new Set();
   for(const options of[{},...product.configurations.map(c=>c.options)]){
    const k=JSON.stringify(Object.fromEntries(Object.entries(options).sort(([a],[b])=>a.localeCompare(b))));if(seen.has(k))continue;seen.add(k);
    for(const load of[loadModel,loadGroveModule]){
     const on=await load(id,options),off=await load(id,{...options,artwork:false});try{
      on.root;off.root;on.update(0);off.update(0);checkBoundary(on,id);checkBoundary(off,id);assert.equal(physical(on),physical(off),'all physical attributes/index/world survive ink removal');assert.equal(frames(on),frames(off));assert.equal(panels(off).length,0);
      const kinds=panels(on).map(p=>p.userData.artworkKind).sort();assert.deepEqual(kinds,[...expectedPrint[id]].sort());
      const pressed=artworkPressed(on,off,id==='cardkb2'?['key-1','key-42','reset','boot']:id==='neco'?['button']:[]);
      if(id==='cardkb2')for(const c of own(on,'button'))assert.equal(panels({root:c.cap}).length,0,'all red/side moving plungers have no printed surface');
      if(load===loadModel&&k==='{}'){checkPhysical(on,id);artwork.push({id,panels:kinds.length,kinds,actualPartialPressIds:pressed});}
     }finally{on.dispose();off.dispose();}
    }
   }configurations.push({id,optionCases:seen.size,entries:2,physicalAttributesIndexWorld:'identical with ink off,including actual representative partial presses'});
  }
  const prefix=i=>`grove/grove-${i+1}`;
  for(const[i,id]of ids.entries()){
   const peers=ids.filter(x=>x!==id),snapshot=peers.map(x=>physical(units[x])),u=units[id];components.find(c=>c.id===id).physicalStructure=checkPhysical(u,id);
   if(expectedApi[id].controls.length){controls.push({id,individual:checkMomentaries(host,u,prefix(i),events,expectedApi[id].controls),simultaneous:checkSimultaneousMomentaries(host,u,events,expectedApi[id].controls)});}
   if(expectedApi[id].leds.length)outputs.push({id,...checkIndependentLights(host,u,prefix(i),events,expectedApi[id].leds)});
   if(id==='mini-oled')outputs.push({id,...checkMiniOledFramebuffer(host,u,prefix(i),events)});
   checkWrongFamily(host,u,prefix(i),expectedApi[id].ports,events);assert.deepEqual(peers.map(x=>physical(units[x])),snapshot);assert.equal(hash(host.display().buffer),framebuffer);
  }
  for(const[i,id]of ids.entries()){
   const u=units[id],before=physical(u),n=events.length;host.handle({type:'pose',target:target(prefix(i),'unitFrame'),position:[i*55,195+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:target(prefix(i),'cable'),slack:12,bend:[0,0,-1]});host.update(0);assert.notEqual(physical(u),before);assert.equal(u.get('cable').getState().wireCount,4);assert.equal(events.length,n);components.find(c=>c.id===id).transformedStructure=checkPhysical(u,id);
   if(id==='cardkb2')checkMomentaries(host,u,prefix(i),events,['key-1','reset','boot']);if(id==='neco')checkMomentaries(host,u,prefix(i),events,['button']);if(id==='mini-oled')checkMiniOledFramebuffer(host,u,prefix(i),events);
   checkWrongFamily(host,u,prefix(i),expectedApi[id].ports,events);
  }
  nested.push({id:'neco',...await nestedKey(host,units.neco,prefix(1),'out',events)});nested.push({id:'mini-oled',...await nestedKey(host,units['mini-oled'],prefix(2),'grove-right',events)});
  const framebufferPanel=checkFramebufferPanel(host,units['mini-oled'],hub);assert.equal(hash(host.display().buffer),framebuffer);
  const disposal=observeDisposal(host.root);
  for(const[i,id]of ids.entries()){
   const peerIds=ids.filter(x=>x!==id),before=peerIds.map(x=>physical(units[x])),p=hub.get(`grove-${i+1}`),part=p.detach({dispose:false});assert.ok(part===units[id]);assert.deepEqual(peerIds.map(x=>physical(units[x])),before);p.attach(part);host.update(0);assert.equal(part.get('cable').getState().wireCount,4);
  }
  const beforeLast=[physical(units.cardkb2),physical(units.neco)];hub.get('grove-3').detach();assert.deepEqual([physical(units.cardkb2),physical(units.neco)],beforeLast);assert.equal(hash(host.display().buffer),framebuffer);host.dispose();host=null;const disposedResources=disposal();
  return{status:'pass',components,artwork,configurations,controls,outputs,nested,framebufferPanel,disposedResources,cases:['three-real-four-core-branches','44-key-and-one-rear-momentary-real-cap-fixed-package-separation','multi-source-cancel-independent-simultaneous-controls','36-independent-real-external-LED-materials-noecho','72x40-external-framebuffer-native-white-shader-touch-style-lock','both-entries-actual-presets-and-partial-press-ink-physical-invariance','transformed-parent-physical-structure-ports-cancel-peer-isolation','two-real-secondary-Grove-nested-Key-intents-no-electrical-cascade','actual-demo-nested-framebuffer-selector','host-framebuffer-and-observed-resource-disposal'],scope:'Own three physical assemblies,matching print and actual external controls/outputs;Node DOM/canvas boundary fixture;no browser/GPU/manufacturing/productionfit/hardware/keyboard-matrix/firmware/electrical/whole-history acceptance'};
 }finally{host?.dispose();restore();}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkCardKB2NecoMiniOledUnits(),null,2));
