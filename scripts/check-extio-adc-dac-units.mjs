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
 class Wrong extends Module{static meta={id:'fixture.batch45.wrong',name:'Wrong mechanical family',connector:'fixture-incompatible-family'};build(){}}
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

import * as EXTIOThree from 'three';
function extioInspect(u){
 u.root;world(u);const a=u.extioAssembly;assert.ok(a?.casing?.rear&&a.board&&a.input&&a.io&&a.fixing&&a.labels);const frame=a.casing.rear.parent,inverse=frame.matrixWorld.clone().invert();
 const close=(x,y,name,tolerance=1e-5)=>assert.ok(Number.isFinite(x)&&Math.abs(x-y)<tolerance,`${name}:${x}/${y}`),opaque=o=>o.isMesh&&o.userData.role!=='printed-artwork'&&o.material.opacity!==0;
 const bbox=o=>new EXTIOThree.Box3().setFromBufferAttribute(o.geometry.attributes.position).applyMatrix4(inverse.clone().multiply(o.matrixWorld));
 const shoot=(p,d,objects,origin=frame)=>{world(u);const ray=new EXTIOThree.Raycaster(new EXTIOThree.Vector3(...p).applyMatrix4(origin.matrixWorld),new EXTIOThree.Vector3(...d).transformDirection(origin.matrixWorld));return(Array.isArray(objects)?ray.intersectObjects(objects,true):ray.intersectObject(objects,true)).filter(h=>opaque(h.object));};
 const local=h=>h.point.clone().applyMatrix4(inverse),solids=[];frame.traverse(o=>{if(opaque(o))solids.push(o);});return{a,frame,inverse,close,opaque,bbox,shoot,local,solids};
}
export function checkEXTIOPhysical(u){
 const{a,close,bbox,shoot,local,solids}=extioInspect(u),c=a.casing,shell=[c.front,c.rear,...c.sides,c.lowerFloor,c.lowerLip,c.upperFloor,c.hood,...c.hoodSides,c.hoodLower,...c.bosses,c.screwBoss];
 assert.equal(solids.length,194);let triangles=0;const bounds=new EXTIOThree.Box3();for(const o of solids){assert.equal(o.material.side,EXTIOThree.FrontSide);for(const at of Object.values(o.geometry.attributes))assert.ok([...at.array].every(Number.isFinite));triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;bounds.union(bbox(o));assert.ok(!o.userData.sourceFace&&!o.userData.nativeCAD);}
 assert.equal(triangles,32016);const envelope=bounds.getSize(new EXTIOThree.Vector3()).toArray();[24,32,11.1].forEach((n,i)=>close(envelope[i],n,'actual own reconstructed envelope'));
 let closureRays=0,boreRays=0,pcbRays=0;for(const[x,y]of[[-10,-10],[10,-10],[-10,10],[10,10],[0,-7],[0,5]])for(const sign of[-1,1]){assert.ok(shoot([x+.02,y+.03,sign*15],[0,0,-sign],shell)[0],'closed actual white casing material');closureRays++;}
 for(const[x,y]of[[-8,-4],[8,-4]]){for(const sign of[-1,1])assert.equal(shoot([x+.01,y+.01,sign*15],[0,0,-sign],solids).length,0,'actual mounting axis remains air through all physical material');for(const z of[-3.8,-2,0,2,3.8])for(const[dX,dY]of[[1,0],[-1,0],[0,1],[0,-1]]){const hit=shoot([x,y,z],[dX,dY,0],shell)[0];assert.ok(hit,'actual FrontSide bore wall');close(local(hit).distanceTo(new EXTIOThree.Vector3(x,y,z)),2.55,'reconstructed bore radius polygon chord',.012);boreRays++;}const hit=shoot([x,y,-2],[x<0?1:-1,0,0],a.board.pcb)[0];assert.ok(hit);close(local(hit).distanceTo(new EXTIOThree.Vector3(x,y,-2)),3.35,'own inferred PCB boss relief chord',.012);}
 assert.deepEqual(own(u,'port').map(p=>p.id),['grove','io']);for(const k of['button','led','display','joint','sensor','speaker','component','imu'])assert.equal(own(u,k).length,0);assert.equal(a.board.leads.length,48);assert.equal(a.board.regulatorLeads.length,3);assert.equal(a.board.passives.length,16);assert.equal(a.board.ends.length,32);assert.equal(a.board.pads.length,14);assert.equal(a.board.solder.length,4);close(bbox(a.board.pcb).min.z,-2.4,'real PCB rear');close(bbox(a.board.pcb).max.z,-1.6,'real PCB front');
 const g=a.input;assert.ok(g.port===u.get('grove'));assert.equal(g.port.connector,'grove');for(const k of['contacts','returns','tails'])assert.equal(g[k].length,4);for(let i=0;i<4;i++){const x=(i-1.5)*2,hit=shoot([x+.02,1,-.58],[0,-1,0],g.frame,g.frame)[0];assert.ok(hit?.object===g.contacts[i],'actual Grove contact first hit');const p=g.port.object3d.worldToLocal(hit.point.clone());assert.equal(g.port.pinAt(p)?.n,i+1);close(bbox(g.tails[i]).min.z,-3.05,'real bent4P tail rear');close(bbox(g.tails[i]).max.z,-1.15,'tail enters PCB and own solder retention');close(bbox(g.tails[i]).getCenter(new EXTIOThree.Vector3()).y,-8.54,'contact tail shares actual PCB drill');}
 assert.ok(shoot([.15,1,.8],[0,-1,0],g.frame,g.frame)[0]?.object===g.back,'actual Grove deep insertion stop');assert.ok(shoot([.15,-3,.8],[0,0,-1],g.frame,g.frame)[0]?.object===g.floor,'actual Grove cavity floor');for(const sign of[-1,1])assert.ok(g.walls.includes(shoot([.15,-3,.8],[sign,0,0],g.frame,g.frame)[0]?.object),'actual open receiving sidewalls');close(bbox(g.floor).min.z,-1.6,'Grove carrier meets actual PCB front');
 const t=a.io;assert.ok(t.port===u.get('io'));assert.equal(t.port.connector,'header-2x5-2.54mm-male');for(const k of['contacts','legs','solder'])assert.equal(t[k].length,10);assert.equal(t.supports.length,2);assert.ok(shoot([.2,17,2.67],[0,-1,0],t.frame)[0]?.object===t.carrier,'real air between two male rows reaches own carrier');for(const contact of t.contacts){const{row,column,pin}=contact.userData,x=(column-2)*2.54,z=1.4+row*2.54,hit=shoot([x+.02,17,z+.02],[0,-1,0],t.frame)[0];assert.ok(hit?.object===contact,'actual solid square male tip first hit');close(local(hit).y,15.7,'all ten real recessed tips');assert.equal(t.port.pinAt(t.port.object3d.worldToLocal(hit.point.clone()))?.n,pin);}for(const leg of t.legs)close(bbox(leg).min.z,-2.7,'actual male return leg passes PCB');for(const s of t.supports){close(bbox(s).min.z,-1.6,'P1 carrier support meets board');close(bbox(s).max.z,.13,'P1 support meets molded carrier');}
 for(const[x,y,r]of[...[-3,-1,1,3].map(x=>[x,-8.54,.36]),...[-5.08,-2.54,0,2.54,5.08].flatMap(x=>[8.66,11.2].map(y=>[x,y,.52]))]){assert.equal(shoot([x+.01,y+.01,2],[0,0,-1],a.board.pcb).length,0,'real through-board lead hole');for(const d of[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0]]){const h=shoot([x,y,-2],d,a.board.pcb)[0];assert.ok(h);close(local(h).distanceTo(new EXTIOThree.Vector3(x,y,-2)),r,'actual FrontSide PCB lead bore',.004);pcbRays++;}}
 assert.ok(shoot([.1,-3.9,-10],[0,0,1],a.fixing.head).length===0,'actual empty hex drive entrance');assert.ok(shoot([.1,-3.9,-10],[0,0,1],[a.fixing.head,a.fixing.floor])[0]?.object===a.fixing.floor,'actual recessed hex drive floor');assert.equal(a.labels.film.userData.role,'physical-label-substrate');close(bbox(a.labels.film).max.z-bbox(a.labels.film).min.z,.04,'actual adhesive film thickness');assert.equal(c.relief.glyphs.length,2);for(const glyph of c.relief.glyphs)assert.ok(bbox(glyph).min.z< -4.39999,'real unpainted M5 relief retained');
 return{constructionRoute:'own-dimensional-parametric',importedNativeFaces:0,physicalBodyMeshes:solids.length,triangles,actualEnvelopeMm:envelope,nominalEnvelopeMm:[24,32,11],closureRays,trueMountingAxes:2,boreWallRays:boreRays,PCBScallopWallRays:2,PCBLeadDrills:14,PCBDrillWallRays:pcbRays,groveContacts:4,groveReturns:4,groveTails:4,ioMaleContacts:10,ioBentLegs:10,ioPitchMm:2.54,PCBPackages:['PCA9554PW:TSSOP16','HT7533:3-lead'],trueHexDrive:true,physicalFilms:1,physicalM5Glyphs:2,scope:'Own original/EOL appearance and necessary physical rays;estimated internal placement;no native,GPU,manufacturing fit or electrical validation'};
}
export function checkEXTIORuntime(host,u,prefix,events){
 const{a}=extioInspect(u),shape=physical(u),ports=frames(u),peer=physical(host,[u.root]),n=events.length;for(const id of['grove','io']){assert.equal(u.get(id).module,null);for(const type of['gpio','io','read','write','adc','dac','pwm','servo','voltage','i2c','address','button','led','joint','sensor','firmware']){assert.throws(()=>host.handle({type,target:target(prefix,id),value:1}));assert.equal(physical(u),shape);assert.equal(frames(u),ports);assert.equal(physical(host,[u.root]),peer);assert.equal(events.length,n);}}
 host.update(1.25);assert.equal(physical(u),shape);assert.equal(frames(u),ports);assert.equal(physical(host,[u.root]),peer);assert.equal(events.length,n);checkWrongFamily(host,u,prefix,['grove','io'],events);assert.equal(a.io.contacts.length,10);return{noControlsReadingsOutputsOrFirmware:true,rejectedTypesPerPort:16,passivePorts:['grove','io'],wrongFamiliesRejected:true,shapePortsPeersEventsInvariant:true,staticAfter1_25Seconds:true};
}

import * as ADCThree from 'three';

// Exact own U013 dimensional reconstruction;no native or sibling geometry claim.
function inspectADC(u){
 u.root;world(u.root);const T=ADCThree,a=u.adcAssembly;assert.ok(a?.frame&&a?.shell&&a?.board&&a?.input&&a?.terminal);const frame=a.frame,inverse=frame.matrixWorld.clone().invert(),attached=own(u,'port').flatMap(p=>p.module?[p.module.root]:[]),material=o=>o.isMesh&&o.userData.role!=='printed-artwork'&&o.material.opacity!==0,solids=[];frame.traverse(o=>{if(material(o)&&!attached.some(r=>under(o,r)))solids.push(o);});
 const near=(x,y,label='Own actual U013 material')=>assert.ok(Number.isFinite(x)&&Math.abs(x-y)<1e-5,label+': '+x+'/'+y),bbox=o=>new T.Box3().setFromBufferAttribute(o.geometry.attributes.position).applyMatrix4(inverse.clone().multiply(o.matrixWorld)),point=o=>o.getWorldPosition(new T.Vector3()).applyMatrix4(inverse),local=h=>h.point.clone().applyMatrix4(inverse);
 const shoot=(p,d,objects,coordinate=frame)=>{const direction=new T.Vector3(...d).transformDirection(coordinate.matrixWorld),origin=new T.Vector3(...p).applyMatrix4(coordinate.matrixWorld),r=new T.Raycaster(origin,direction),hits=(Array.isArray(objects)?r.intersectObjects(objects,true):r.intersectObject(objects,true)).filter(h=>material(h.object));for(const h of hits){assert.equal(h.object.material.side,T.FrontSide);const n=h.face.normal.clone().applyNormalMatrix(new T.Matrix3().getNormalMatrix(h.object.matrixWorld));assert.ok(n.dot(direction)<-1e-7,'Actual FrontSide surface faces incoming air ray');}return hits;};
 const inFrame=(h,f)=>h.point.clone().applyMatrix4(f.matrixWorld.clone().invert());return{T,a,frame,inverse,solids,material,near,bbox,point,local,shoot,inFrame};
}
function closedADC(o){
 const T=ADCThree,g=o.geometry,p=g.attributes.position,index=g.index,keys=[],edges=new Map();let volume=0;
 for(let i=0;i<p.count;i++)keys.push([p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(','));
 for(let k=0;k<(index?.count??p.count);k+=3){const ids=[0,1,2].map(j=>index?index.getX(k+j):k+j),v=ids.map(i=>new T.Vector3().fromBufferAttribute(p,i));volume+=v[0].dot(v[1].cross(v[2]))/6;for(let j=0;j<3;j++){const a=keys[ids[j]],b=keys[ids[(j+1)%3]];if(a===b)continue;const key=a<b?a+'|'+b:b+'|'+a,e=edges.get(key)??[0,0];e[0]++;e[1]+=a<b?1:-1;edges.set(key,e);}}
 assert.ok(volume>1e-9,'Positive own actual solid: '+o.name);assert.ok([...edges.values()].every(([n,d])=>n===2&&d===0),'Closed directed material edges: '+o.name);assert.equal(o.material.side,T.FrontSide);return(index?.count??p.count)/3;
}

export function checkADCPhysical(u){
 const{T,a,frame,solids,near,bbox,point,local,shoot,inFrame}=inspectADC(u);assert.equal(u.meta.sku,'U013');assert.equal(solids.length,132,'Own physical body excludes removable plug,cable,ink and hit proxies');let triangles=solids.reduce((n,o)=>n+closedADC(o),0);assert.ok(solids.every(o=>o.userData.source!=='official-structure'),'Own dimensional-parametric route has no imported native/source-face claim');
 assert.deepEqual(own(u,'port').map(c=>c.id),['grove','terminal']);for(const kind of['button','led','joint','sensor','display','speaker','imu','component','rotary-selector','led-matrix'])assert.equal(own(u,kind).length,0);
 const s=a.shell,caseBox=new T.Box3();for(const o of[s.lid,s.back,s.rim,...s.sides,...s.ends,...s.bores])caseBox.union(bbox(o));const baseMm=caseBox.getSize(new T.Vector3()).toArray();[24,32,8].forEach((v,i)=>near(baseMm[i],v,'Own exact dimensional24x32x8 base'));near(caseBox.min.z,-4);near(caseBox.max.z,4);assert.equal(s.bores.length,2);let boreRays=0;
 for(const x of[-8,8]){assert.equal(shoot([x,-4,20],[0,0,-1],solids).length,0,'True5mm mounting clear axis through lid,case,PCB and rear');assert.equal(shoot([x,-4,-20],[0,0,1],solids).length,0);for(const d of[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0]]){const h=shoot([x,-4,.13],d,s.bores)[0];assert.ok(h);near(local(h).distanceTo(new T.Vector3(x,-4,.13)),2.5,'Actual5mm FrontSide bore wall');boreRays++;}}
 let closureRays=0;for(const[x,y]of[[10.1,7.13],[-10.1,7.13],[6.1,-12.13],[-6.1,-12.13],[9.1,13.13],[-9.1,13.13]])for(const sign of[-1,1]){assert.ok(shoot([x,y,sign*20],[0,0,-sign],solids)[0],'Complete actual assembled shell surfaces');closureRays++;}assert.ok(shoot([.13,20,-2],[0,-1,0],s.ends)[0],'Real upper rear shell closure below orange front plug');assert.ok(shoot([.13,-20,-2],[0,1,0],s.ends)[0],'Real lower rear shell closure below red receiving mouth');
 assert.equal(s.relief.length,4);for(const[x,y]of[[-3,.8],[-.7,1.3],[1.55,1.9],[.13,5]])near(local(shoot([x,y,20],[0,0,-1],s.relief)[0]).z,4.12,'Actual white ADC/arrow positive material remains without PNG');near(local(shoot([-4.35,-10.6,-20],[0,0,1],[s.rim,s.back])[0]).z,-3.88,'Actual geometric M5 recess floor');near(local(shoot([-5.2,-10.6,-20],[0,0,1],[s.rim,s.back])[0]).z,-4,'Actual M5 surrounding rear rim');
 const b=a.board;near(bbox(b.pcb).min.z,-2);near(bbox(b.pcb).max.z,-1.2);assert.equal(b.posts.length,4);for(const post of b.posts){near(bbox(post).min.z,-3,'Real support on rear pan');near(bbox(post).max.z,-2,'Real support under PCB');const q=point(post);near(local(shoot([q.x+.03,q.y+.02,20],[0,0,-1],b.pcb)[0]).z,-1.2,'Actual supported PCB material');}assert.deepEqual(Object.keys(b.packages),['ads1100','lm358','ht7533']);assert.equal(b.legs.length,17);assert.equal(b.pads.length,17);assert.equal(b.passives.length,8);assert.equal(b.terminals.length,16);
 const g=a.input;assert.ok(g.port===u.get('grove'));assert.equal(g.port.connector,'grove');assert.ok(point(g.port.object3d).distanceTo(new T.Vector3(0,-16,1.4))<1e-5);assert.equal(g.contacts.length,4);assert.equal(g.returns.length,4);assert.equal(g.tails.length,4);assert.equal(g.barrels.length,4);assert.equal(g.pads.length,8);assert.ok(shoot([.13,.7,1],[0,0,-1],g.frame,g.frame)[0]?.object===g.back,'Real deep Grove dielectric stop');let socketWallRays=0;for(const d of[[1,0,0],[-1,0,0],[0,-1,0],[0,1,0]]){assert.ok(shoot([.17,0,-3],d,g.frame,g.frame)[0],'Actual red receiving wall/floor/partial roof');socketWallRays++;}
 for(let i=0;i<4;i++){const x=-3+2*i;assert.ok(shoot([x,-.2,1],[0,0,-1],g.frame,g.frame)[0]?.object===g.contacts[i],'Each actual independent Grove contact');const q=g.port.object3d.worldToLocal(g.contacts[i].getWorldPosition(new T.Vector3()));assert.equal(g.port.pinAt(q).n,i+1);near(bbox(g.tails[i]).min.z,-2);near(bbox(g.tails[i]).max.z,-1.2);assert.equal(shoot([x,-10.4,20],[0,0,-1],b.pcb).length,0,'True four actual PCB substrate drills');const h=shoot([x+.37,-10.4,-1.6],[1,0,0],b.pcb)[0];assert.ok(h);near(local(h).x-x,.38,'Actual receiving PCB bore wall from positive air gap outside plated barrel');near(bbox(g.barrels[i]).min.z,-2);near(bbox(g.barrels[i]).max.z,-1.2);}
 const t=a.terminal;assert.ok(t.port===u.get('terminal'));assert.equal(t.port.connector,'m5.adc.u013.terminal-2p');assert.ok(point(t.port.object3d).distanceTo(new T.Vector3(0,6.4,1.1))<1e-5);for(const key of['pins','knees','tails','barrels'])assert.equal(t[key].length,2);assert.equal(t.pads.length,4);assert.ok(shoot([.13,12,.1],[0,-1,0],t.frame,t.frame)[0]?.object===t.back,'Actual fixed terminal deep stop from outside the assembled product');near(bbox(t.floor).min.z,-1.2,'Receiving body physically supported on PCB');
 const wallSamples=[{p:[3.47,-2,0],d:[1,0,0]},{p:[-3.47,-2,0],d:[-1,0,0]},{p:[0,-2,-1.37],d:[0,0,-1]},{p:[0,-2,1.37],d:[0,0,1]}];for(const q of wallSamples){assert.ok(shoot(q.p,q.d,[...t.walls,t.floor,t.roof],t.frame)[0],'Actual two-pole fixed receiving side/floor/roof material from air');socketWallRays++;}
 for(let i=0;i<2;i++){const x=i?1.98:-1.98;near(bbox(t.knees[i]).min.z,-1.2,'Actual contact bend reaches PCB front/tail');near(bbox(t.tails[i]).max.z,-1.2);near(bbox(t.tails[i]).min.z,-2);const p=t.port.object3d.worldToLocal(t.pins[i].getWorldPosition(new T.Vector3()));assert.equal(t.port.pinAt(p).n,i+1);assert.equal(shoot([x,3.3,20],[0,0,-1],b.pcb).length,0);near(local(shoot([x+.41,3.3,-1.6],[1,0,0],b.pcb)[0]).x-x,.42,'Actual terminal receiving PCB hole wall outside plated barrel');}
 near(bbox(s.film).min.z,-3.92);near(bbox(s.film).max.z,-3.88,'Actual rear film rests on real recessed rear pan');assert.equal(s.film.userData.role,'physical-label-substrate');const filmCount=solids.filter(o=>o.userData.role==='physical-label-substrate').length;assert.equal(filmCount,1);near(bbox(a.screw.shank).max.z,2.8);assert.ok(bbox(a.screw.shank).min.z<bbox(a.screw.floor).max.z,'Real fixing shank retained in blind head floor and front boss');
 const fullBox=new T.Box3();solids.forEach(o=>fullBox.union(bbox(o)));let accessory=null;const plug=t.port.module;if(plug){plug.root;assert.equal(plug.meta.id,'m5stack.unit.adc.terminal-plug');assert.equal(plug.meta.connector,t.port.connector);assert.ok(plug.parentHost===u&&plug.attachedTo===t.port);assert.equal(plug.components.size,0,'Actual plug is static;source does not establish a movable screw head');const a=plug.adcPlugAssembly;assert.ok(a?.tongue&&a?.entry&&a?.film);const meshes=[];plug.root.traverse(o=>{if(o.isMesh&&o.material.opacity!==0&&o.userData.role!=='printed-artwork')meshes.push(o);});assert.equal(meshes.length,22);for(const o of meshes){triangles+=closedADC(o);fullBox.union(bbox(o));}assert.equal(a.springs.length,4);assert.equal(a.backs.length,2);assert.equal(a.cages.length,8);assert.equal(a.film.userData.role,'physical-label-substrate');near(bbox(a.film).min.z,6.16);near(bbox(a.film).max.z,6.2,'Physical polarity carrier included in exact10.2mm envelope');
  const clearances=[];for(const q of wallSamples){const wall=shoot(q.p,q.d,[...t.walls,t.floor,t.roof],t.frame)[0],opposite=q.d.map(v=>-v),neck=shoot(q.p,opposite,a.tongue,t.frame)[0];assert.ok(neck,'Actual installed tongue wall opposite receiving wall');const gap=inFrame(wall,t.frame).distanceTo(inFrame(neck,t.frame));assert.ok(gap>.14&&gap<.26,'Positive actual tongue-to-fixed-receiver material clearance');clearances.push(gap);}for(const x of[-1.98,1.98]){assert.ok(shoot([x,10.4,1],[0,-1,0],a.frame,a.frame)[0]?.object===a.backs[x<0?0:1],'Two true wire entries have actual deep conducting stops');for(const d of[[1,0,0],[-1,0,0],[0,0,1],[0,0,-1]])assert.ok(shoot([x+.03,9.27,1.02],d,a.entry,a.frame)[0],'Real round wire-entry bore wall from air');}
  accessory={id:plug.meta.id,physicalMeshes:meshes.length,contacts:2,femaleSprings:4,wireEntryBores:2,positiveTongueReceivingClearanceMm:clearances,physicalFilms:1,joints:0,mechanicalOnly:true};}
 const fullMm=fullBox.getSize(new T.Vector3()).toArray();[24,32,plug?10.2:8.12].forEach((v,i)=>near(fullMm[i],v,'Own complete/plug-removed physical envelope'));return{constructionRoute:'own-dimensional-parametric',nativeGeometry:false,nativeTriangles:null,bodyPhysicalMeshes:solids.length,totalPhysicalMeshes:solids.length+(accessory?.physicalMeshes??0),triangles,allClosedPositiveDirectedTwoEdges:true,frontSide:true,nominalMm:[24,32,10.2],baseCaseEnvelopeMm:baseMm,actualPhysicalEnvelopeMm:fullMm,mountingBores:{diameterMm:5,pitchMm:16,frontSideWallRays:boreRays,truePcbOpenEdgeClearance:true},closureRays,realUncoloredFrontRelief:4,realRearM5Recess:true,actualPcbSupportPosts:4,contacts:{grove:4,terminal:2},fourActualRightAngleGroveReturns:true,allContactTailsBarrelsPadsRetained:true,frontSideSocketWallRays:socketWallRays,physicalRearFilms:1,staticAccessory:accessory,controls:0,externalLeds:0,joints:0,readings:0};
}

export function checkADCRuntime(host,u,prefix,events){
 u.root;tick(host);world(u.root);const a=u.adcAssembly,p=u.get('terminal'),item=p.module,rest=physical(u),ports=frames(u),n=events.length,fixed=physical(u,item?[item.root]:[]);for(const kind of['button','led','sensor','display','joint','speaker','component'])assert.equal(own(u,kind).length,0);
 if(item){const shape=stamp(records(item).map(({matrix,...r})=>r));assert.ok(roundtrip(u,p)===item);assert.equal(stamp(records(item).map(({matrix,...r})=>r)),shape);assert.equal(physical(u,[item.root]),fixed);assert.equal(physical(u),rest);assert.equal(frames(u),ports);assert.equal(item.components.size,0);}
 for(const id of['grove','terminal'])for(const type of['adc','read','voltage','waveform','i2c','firmware','sensor','led','button','joint'])assert.throws(()=>host.handle({type,target:target(prefix,id),value:1,angleDeg:30}));assert.equal(events.length,n,'No fabricated readings,voltage,conversion or firmware input');assert.equal(physical(u),rest);assert.equal(frames(u),ports);host.update(.4);assert.equal(events.length,n);assert.equal(physical(u),rest,'No automatic conversion/contact/screw animation');assert.equal(frames(u),ports);assert.ok(a.input.port===u.get('grove')&&a.terminal.port===p);
 return{actualRemovablePlug:!!item,staticMechanicalRoundtrip:item?'pass':'actual removed preset;no fabricated accessory',fixedCasePcbGroveReceiverDuringAttachment:true,noScrewAngleApiWithoutVisibleHeadEvidence:true,noSensorVoltageWaveformI2cFirmware:true,noAutomaticMotionOrEcho:true,allPhysicalAttributesIndicesWorldRetained:true,ownControls:0,ownLeds:0,ownJoints:0};
}

import * as DACThree from 'three';
function dacInspect(u){u.root;world(u);const a=u.dacAssembly;assert.ok(a?.frame&&a.shell&&a.board&&a.grove&&a.terminal);const inverse=a.frame.matrixWorld.clone().invert(),close=(x,y,n)=>assert.ok(Number.isFinite(x)&&Math.abs(x-y)<1e-5,n+':'+x+'/'+y),opaque=o=>o.isMesh&&o.userData.role!=='printed-artwork'&&o.material.opacity!==0,bbox=o=>new DACThree.Box3().setFromBufferAttribute(o.geometry.attributes.position).applyMatrix4(inverse.clone().multiply(o.matrixWorld)),shoot=(p,d,objects,frame=a.frame)=>{world(u);const ray=new DACThree.Raycaster(new DACThree.Vector3(...p).applyMatrix4(frame.matrixWorld),new DACThree.Vector3(...d).transformDirection(frame.matrixWorld));return(Array.isArray(objects)?ray.intersectObjects(objects,true):ray.intersectObject(objects,true)).filter(h=>opaque(h.object));},local=h=>h.point.clone().applyMatrix4(inverse),solids=[];a.frame.traverse(o=>{if(opaque(o))solids.push(o);});return{a,inverse,close,opaque,bbox,shoot,local,solids};}
export function checkDACPhysical(u){const{a,close,bbox,shoot,local,solids}=dacInspect(u),shell=[a.shell.rear,a.shell.rearRim,a.shell.front,a.shell.lowerRing,a.shell.upperRing,...a.shell.sleeves];for(const o of solids)assert.equal(o.material.side,DACThree.FrontSide);const bounds=new DACThree.Box3();shell.forEach(o=>bounds.union(bbox(o)));const size=bounds.getSize(new DACThree.Vector3()).toArray();[24,32,8].forEach((n,i)=>close(size[i],n,'own dimensional shell envelope'));let closureRays=0;for(const[x,y]of[[0,1],[-7,11],[7,11],[-7,-11],[7,-11],[-5,0],[5,0]])for(const sign of[-1,1]){assert.ok(shoot([x+.03,y+.04,sign*15],[0,0,-sign],shell).length>0,'closed real front/rear material');closureRays++;}let boreRays=0;for(const[x,y]of[[-8,-4],[8,-4]]){for(const sign of[-1,1])assert.equal(shoot([x+.01,y+.01,sign*15],[0,0,-sign],solids).length,0,'true empty mounting axis through complete physical product');for(const z of[-3.5,-2,0,2,3.5])for(const[dX,dY]of[[1,0],[-1,0],[0,1],[0,-1]]){const hits=shoot([x,y,z],[dX,dY,0],shell);assert.ok(hits[0],'FrontSide bore wall');close(local(hits[0]).distanceTo(new DACThree.Vector3(x,y,z)),2.5,'actual nominal5mm bore wall');boreRays++;}}
 assert.deepEqual(own(u,'port').map(c=>c.id),['grove','terminal']);for(const kind of['button','led','sensor','joint','display','imu'])assert.equal(own(u,kind).length,0);assert.equal(Object.keys(a.board.packages).join(','),'MCP4725,LM321MFX');assert.equal(a.board.passives.length,5);assert.equal(a.board.barrels.length,6);assert.equal(a.board.lands.length,12);assert.equal(a.supports.length,4);close(bbox(a.board.pcb).min.z,-.5,'real PCB rear');close(bbox(a.board.pcb).max.z,.3,'real PCB front');for(const s of a.supports){close(bbox(s).min.z,-3,'post meets rear floor');close(bbox(s).max.z,-.5,'post meets PCB');}
 const g=a.grove;assert.ok(g.port===u.get('grove'));assert.equal(g.contacts.length,4);assert.equal(g.returns.length,4);assert.equal(g.tails.length,4);for(let i=0;i<4;i++){assert.ok(shoot([(i-1.5)*2,-.2,1],[0,0,-1],g.frame,g.frame)[0]?.object===g.contacts[i],'four first-hit actual receiving contacts');const b=bbox(g.tails[i]);close(b.getCenter(new DACThree.Vector3()).x,(i-1.5)*2,'FACE.bottom real physicalX');close(b.min.z,-.5,'bent4P tail entersPCB rear');close(b.max.z,.5,'tail reaches PCB front/solder land');}assert.ok(shoot([0,0,1],[0,0,-1],g.frame,g.frame)[0]?.object===g.back,'deep4P insertion stop');assert.equal(g.port.connector,'grove');close(bbox(g.floor).min.y,-16,'Grove material mouth on port');
 const t=a.terminal;assert.ok(t.port===u.get('terminal'));assert.equal(t.pins.length,2);assert.equal(t.returns.length,2);assert.equal(t.tails.length,2);assert.equal(t.port.connector,'m5.u012.2p-terminal');for(const tail of t.tails){close(bbox(tail).min.z,-.5,'actual2P tailPCB rear');close(bbox(tail).max.z,.3,'actual2P tailPCB front');}close(bbox(t.back).max.y,5.55,'actual2P deep stop');assert.equal(a.rearFilm.userData.role,'physical-label-substrate');assert.ok(a.frontRelief.children.length>0&&a.rearRelief.children.length>0,'unpainted DAC arrow andM5 are physical strokes');let pcbBoreRays=0;for(const[x,y]of[...[-3,-1,1,3].map(x=>[x,-9.65]),...[-1.98,1.98].map(x=>[x,5.8])]){assert.equal(shoot([x+.01,y+.01,2],[0,0,-1],a.board.pcb).length,0,'true substrate lead drill');for(const d of[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0]]){const hit=shoot([x,y,-.1],d,a.board.pcb)[0];assert.ok(hit);close(local(hit).distanceTo(new DACThree.Vector3(x,y,-.1)),.45,'FrontSide PCB drill wall');pcbBoreRays++;}}let plug=null;if(t.port.module){const p=t.port.module;assert.equal(p.components.size,0);const q=p.dacTerminalAssembly;assert.ok(q?.entry&&q?.tongue&&q?.film);assert.equal(q.springs.length,4);assert.equal(q.cages.length,8);assert.equal(q.film.userData.role,'physical-label-substrate');for(const x of[-1.98,1.98]){assert.ok(shoot([x,12,-.2],[0,-1,0],q.entry,q.frame).length===0,'real empty2P wire-entry channel');const hit=shoot([x,12,-.2],[0,-1,0],q.frame,q.frame)[0];assert.ok(hit&&hit.point,'wire bore reaches deep metal rear backing');}close(bbox(q.film).max.z,6.2,'actual10.2mm terminal datum from rear shell');close(bbox(q.entry).max.y,16,'actual32mm assembled top datum');plug={removable:true,ownComponents:0,wireEntries:2,realSprings:4,physicalFilm:true};}
 return{constructionRoute:'own-dimensional-parametric',importedNativeFaces:0,physicalBodyMeshes:solids.length,shellEnvelopeMm:size,closureRays,boreWallRays:boreRays,trueMountingAxes:2,PCBPackages:['MCP4725','LM321MFX'],groveContacts:4,groveReturns:4,groveTails:4,terminalContacts:2,PCBLeadDrills:6,PCBDrillWallRays:pcbBoreRays,PCBSolderLands:12,physicalReliefs:2,realRearFilm:true,actualPlug:plug,scope:'Own appearance solids/necessary rays only;no GPU,productionfit or electrical validation'};}
export function checkDACRuntime(host,u,prefix,events){const{a}=dacInspect(u),shape=physical(u),fixed=physical(u,[u.get('terminal').module?.root]),ports=frames(u),peer=physical(host,[u.root]),n=events.length,port=u.get('terminal'),plug=port.module;for(const type of['voltage','dac','waveform','eeprom','i2c','button','led','sensor']){assert.throws(()=>host.handle({type,target:target(prefix,'terminal'),value:1}));assert.equal(physical(u),shape);assert.equal(frames(u),ports);assert.equal(events.length,n);}let roundtripDone=false;if(plug){const item=roundtrip(u,port);assert.ok(item===plug);assert.equal(physical(u),shape);assert.equal(physical(u,[plug.root]),fixed);assert.equal(physical(host,[u.root]),peer);roundtripDone=true;}host.update(.25);assert.equal(physical(u),shape);assert.equal(frames(u),ports);assert.equal(physical(host,[u.root]),peer);return{actualTerminalRoundtrip:roundtripDone,noControlsOrOutputs:true,unsupportedElectricalCommandsRejected:true,fixedShellPCBContactsAndPeersUnchanged:true,noAutomaticFirmware:true,neutralRestored:true};}

import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const ids=['extio','adc','dac'];
const expectedApi={"extio":{"body":["grove","io"],"ports":["grove","io"],"controls":[],"leds":[],"displays":[],"joints":[],"canonical":"grove"},"adc":{"body":["grove","terminal"],"ports":["grove","terminal"],"controls":[],"leds":[],"displays":[],"joints":[],"canonical":"grove"},"dac":{"body":["grove","terminal"],"ports":["grove","terminal"],"controls":[],"leds":[],"displays":[],"joints":[],"canonical":"grove"}},expectedPrint={"extio":{"default":{"kinds":["reference-redraw"]},"cases":[{"options":{},"kinds":["reference-redraw"]}]},"adc":{"default":{"kinds":["reference-redraw","reference-redraw"]},"cases":[{"options":{},"kinds":["reference-redraw","reference-redraw"]},{"options":{"terminal":"installed"},"kinds":["reference-redraw","reference-redraw"]},{"options":{"terminal":"removed"},"kinds":["reference-redraw"]}]},"dac":{"default":{"kinds":["reference-redraw","reference-redraw"]},"cases":[{"options":{"terminalPlug":true},"kinds":["reference-redraw","reference-redraw"]},{"options":{"terminalPlug":false},"kinds":["reference-redraw"]}]}},hostOptions={"extio":{},"adc":{"terminal":"installed"},"dac":{"terminalPlug":true}};
function checkBoundary(u,id){
 u.root;const a=expectedApi[id],body=[...u.components.keys()].filter(k=>!['unitFrame','cable'].includes(k));assert.deepEqual(body,a.body);
 for(const[kind,key]of[['port','ports'],['button','controls'],['led','leds'],['display','displays'],['joint','joints']])assert.deepEqual(own(u,kind).map(c=>c.id),a[key]);
 for(const kind of['sensor','speaker','rotary-selector','led-matrix'])assert.equal(own(u,kind).length,0,'no invented readings,protocol,servo or firmware component');
 for(const c of own(u,'component')){assert.equal(c.interactive,false);assert.deepEqual(c.getState(),{});}
 assert.equal(u.get(a.canonical).connector,'grove');return{id,body,ports:a.ports,controls:a.controls,leds:a.leds,displays:a.displays,joints:a.joints};
}
function currentReceipt(value){assert.ok(value&&typeof value==='object'&&typeof value.then!=='function','current structure/runtime helpers must finish synchronously;no unawaited test promise');return value;}
function checkPhysical(u,id){return currentReceipt(id==='extio'?checkEXTIOPhysical(u):id==='adc'?checkADCPhysical(u):checkDACPhysical(u));}
function checkRuntime(host,u,id,prefix,events){return currentReceipt(id==='extio'?checkEXTIORuntime(host,u,prefix,events):id==='adc'?checkADCRuntime(host,u,prefix,events):checkDACRuntime(host,u,prefix,events));}
function artworkMotion(on,off){
 const report=[];for(const a of own(on,'button')){
  const b=off.get(a.id),original=a.position;a.press('fixture:ink');b.press('fixture:ink');on.update(.035);off.update(.035);assert.ok(a.getActuationState().depthMm>0||a.isLatching);assert.equal(physical(on),physical(off),'actual partial control motion retains every physical record without ink');a.cancel('fixture:ink');b.cancel('fixture:ink');tick(on);tick(off);
  if(a.isLatching){a.setPosition(original,{immediate:true});b.setPosition(original,{immediate:true});}
  assert.equal(physical(on),physical(off));report.push(a.id);
 }
 for(const a of own(on,'joint')){
  const b=off.get(a.id),rest=a.getState();assert.equal(rest.transitioning,false);assert.equal(rest.rpm,0,'actual joints default to externally controlled static geometry');
  const limits=a.limitsDeg,angle=limits?(Math.abs((limits[0]*.63+limits[1]*.37)-rest.angleDeg)>1e-7?limits[0]*.63+limits[1]*.37:limits[0]*.31+limits[1]*.69):rest.angleDeg+37;
  assert.notEqual(angle,rest.angleDeg);const before=physical(on);a.set({angleDeg:angle,durationMs:120});b.set({angleDeg:angle,durationMs:120});on.update(.035);off.update(.035);assert.equal(a.getState().transitioning,true);assert.equal(physical(on),physical(off),'all actual joint material remains identical without ink during an actual partial motion');assert.notEqual(physical(on),before);
  a.set({angleDeg:rest.angleDeg,rpm:0});b.set({angleDeg:rest.angleDeg,rpm:0});on.update(0);off.update(0);assert.equal(physical(on),physical(off));report.push(a.id);
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
  for(const type of['gpio','register','adc','dac','voltage','waveform','eeprom','address'])assert.throws(()=>host.handle({type,target:target(prefix,c.id),value:1}));
  assert.deepEqual(c.getState(),{});assert.equal(physical(u),shape);assert.equal(frames(u),ports);assert.equal(events.length,n);report.push(c.id);
 }return{id,passiveAnchors:report,noFirmwareOrProtocolBehavior:true};
}

/** Original U011/U013/U012 reconstructed assemblies and actual mechanical boundaries. */
export async function checkEXTIOADCDACUnits(){
 const restore=installCanvasStub();let host;
 try{
  const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));host=await loadModel('sticks3');host.root;host.display().fill('#123456');const framebuffer=hash(host.display().buffer),hub=await loadGroveModule('hub');host.port('grove').attach(hub);
  const units={},events=[],components=[],artwork=[],configurations=[],behaviors=[],accessories=[],boundaries=[];host.on('input',e=>{if(e.kind!=='port')events.push(e);});
  for(const[i,id]of ids.entries()){
   const u=await loadGroveModule(id,{...hostOptions[id],cableLength:75+i*15});hub.get(`grove-${i+1}`).attach(u);host.update(0);units[id]=u;assert.equal(u.get('cable').getState().wireCount,4);components.push(checkBoundary(u,id));
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
   }configurations.push({id,optionCases:seen.size,entries:2,physicalAttributesIndexWorld:'identical with ink off,including actual evidenced mechanical configuration'});
  }
  const prefix=i=>`grove/grove-${i+1}`;
  for(const[i,id]of ids.entries()){
   const u=units[id],peers=ids.filter(x=>x!==id),snapshot=peers.map(x=>physical(units[x]));components.find(c=>c.id===id).physicalStructure=checkPhysical(u,id);behaviors.push({id,...checkRuntime(host,u,id,prefix(i),events)});
   accessories.push({id,mounting:staticMounting(u,id)});boundaries.push(passiveBoundary(host,u,id,prefix(i),events));checkWrongFamily(host,u,prefix(i),expectedApi[id].ports,events);assert.deepEqual(peers.map(x=>physical(units[x])),snapshot);assert.equal(hash(host.display().buffer),framebuffer);
  }
  for(const[i,id]of ids.entries()){
   const u=units[id],before=physical(u),n=events.length;host.handle({type:'pose',target:target(prefix(i),'unitFrame'),position:[i*55,195+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:target(prefix(i),'cable'),slack:12,bend:[0,0,-1]});host.update(0);assert.notEqual(physical(u),before);assert.equal(u.get('cable').getState().wireCount,4);assert.equal(events.length,n);components.find(c=>c.id===id).transformedStructure=checkPhysical(u,id);
   checkRuntime(host,u,id,prefix(i),events);staticMounting(u,id);checkWrongFamily(host,u,prefix(i),expectedApi[id].ports,events);
  }
  assert.equal(hash(host.display().buffer),framebuffer);const disposal=observeDisposal(host.root);
  for(const[i,id]of ids.entries()){
   const peers=ids.filter(x=>x!==id),before=peers.map(x=>physical(units[x])),p=hub.get(`grove-${i+1}`),part=p.detach({dispose:false});assert.ok(part===units[id]);assert.deepEqual(peers.map(x=>physical(units[x])),before);p.attach(part);host.update(0);assert.equal(part.get('cable').getState().wireCount,4);
  }
  const beforeLast=[physical(units['extio']),physical(units['adc'])];hub.get('grove-3').detach();assert.deepEqual([physical(units['extio']),physical(units['adc'])],beforeLast);assert.equal(hash(host.display().buffer),framebuffer);host.dispose();host=null;const disposedResources=disposal();
  return{status:'pass',components,artwork,configurations,behaviors,accessories,boundaries,disposedResources,cases:['three-real-four-core-branches','own-dimensional-parametric-original-EOL-shells','real-front-terminal-receiving-assemblies-and-removable-plugs','actual-static-terminal-detach-reattach','own-readable-rear-and-polarity-print','both-entries-actual-presets-and-ink-physical-invariance','transformed-parent-physical-structure-ports-peer-isolation','host-framebuffer-and-observed-resource-disposal'],scope:'Own three physical assemblies and actual matching ordinary print,actual evidenced mechanical interfaces;Node DOM/canvas boundary fixture;no browser/GPU/manufacturing/productionfit/hardware/IO-ADC-DAC-values/electrical/firmware/whole-history acceptance'};
 }finally{host?.dispose();restore();}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkEXTIOADCDACUnits(),null,2));
