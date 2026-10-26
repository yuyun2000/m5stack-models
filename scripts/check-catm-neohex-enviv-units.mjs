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



/** Wrong-family attachment is atomic, even while an actual accessory occupies the port. */
export function checkWrongFamily(host,u,prefix,portIds,events){
 class WrongFamily extends Module{static meta={id:'fixture.batch40.wrong',name:'Wrong mechanical family',connector:'fixture-incompatible-family'};build(){}}
 const wrong=new WrongFamily(),checked=[];
 try{for(const id of portIds){
  const p=u.get(id),current=p.module,attached=current?.attachedTo,shape=physical(u),ports=frames(u),n=events.length,visible=p.highlightMesh.visible,highlighted=p.highlighted;
  assert.equal(p.accepts(wrong),false);assert.throws(()=>host.handle({type:'attach',target:target(prefix,id),module:wrong}));
  assert.ok(p.module===current);assert.ok(!current||current.attachedTo===attached);assert.ok(wrong.attachedTo===null&&wrong.parentHost===null);
  assert.equal(p.highlightMesh.visible,visible);assert.equal(p.highlighted,highlighted);assert.equal(physical(u),shape);assert.equal(frames(u),ports);assert.equal(events.length,n);checked.push(id);
 }}finally{wrong.dispose();}return checked;
}

/** No fake firmware, measurement state or accidental output coupling. */
export function checkNeoHexOutputs(host,u,prefix,events){
 u.root;const leds=own(u,'led'),expected=Array.from({length:37},(_,i)=>`led-${i+1}`);
 assert.deepEqual(leds.map(l=>l.id),expected);assert.equal(new Set(leds.map(l=>l.lens)).size,37);assert.equal(new Set(leds.map(l=>l.lensMaterial)).size,37,'each real emitter needs independently driven material');
 const positions=new Set();for(const l of leds){assert.equal(l.invisible,false);assert.ok(l.lens.isMesh&&l.lens.geometry.attributes.position.count>0);world(l.object3d);positions.add(stamp(l.lens.matrixWorld.toArray()));}
 assert.equal(positions.size,37,'37 actual separate emitter positions');const states=leds.map(l=>l.getState()),shape=physical(u),ports=frames(u),n=events.length;
 try{for(const[i,l]of leds.entries()){
  const peerStates=leds.filter(x=>x!==l).map(x=>x.getState()),color=i%2?'#149cff':'#fa7331',brightness=.15+i/100;
  host.handle({type:'led',target:target(prefix,l.id),color,brightness});assert.deepEqual(l.getState(),{color,brightness});assert.ok(l.lensMaterial.emissive.getHex()>0,'actual emitter material changes rather than synthetic billboard state');
  assert.deepEqual(leds.filter(x=>x!==l).map(x=>x.getState()),peerStates,'driving a pixel cannot mutate another real LED');assert.equal(physical(u),shape);assert.equal(frames(u),ports);assert.equal(events.length,n);
 }
 const driven=leds.map(l=>l.getState());host.update(.75);assert.deepEqual(leds.map(l=>l.getState()),driven,'there is no invented automatic cascade or firmware animation');assert.equal(events.length,n);assert.equal(physical(u),shape);
 }finally{for(const[i,l]of leds.entries())l.set(states[i]);}
 assert.deepEqual(leds.map(l=>l.getState()),states);assert.equal(physical(u),shape);assert.equal(frames(u),ports);
 return{count:37,ids:expected,independentRealEmitters:true,externalNoEcho:true,physicalAndPortsUnchanged:true,automaticState:'none'};
}

export function observeDisposal(root){
 const resources=new Set(),disposed=new Set();root.traverse(o=>{if(o.geometry)resources.add(o.geometry);for(const m of[].concat(o.material??[])){resources.add(m);for(const value of Object.values(m))if(value?.isTexture)resources.add(value);}});
 for(const r of resources)r.addEventListener('dispose',()=>disposed.add(r));
 return()=>{assert.equal(disposed.size,resources.size,'every observed retained geometry/material/texture must be disposed');return resources.size;};
}

import * as NeoHEXThree from 'three';

// Bundled with fixture-parts.mjs: assert/world/under/own are its shared bindings.
// Read-only physical facts only; output commands/roundtrip/artwork belong to root.
export function checkNeoHEXPhysical(u){
 u.root;world(u.root);
 const a=u.neohexAssembly;
 assert.ok(a?.board?.pcb?.isMesh,'own NeoHEX PCB required');
 const frame=a.board.pcb.parent,inverse=frame.matrixWorld.clone().invert();
 const close=(actual,expected,message)=>assert.ok(Math.abs(actual-expected)<1e-5,message);
 const localPoint=object=>object.getWorldPosition(new NeoHEXThree.Vector3()).applyMatrix4(inverse);
 const localBox=object=>new NeoHEXThree.Box3().setFromBufferAttribute(object.geometry.attributes.position).applyMatrix4(inverse.clone().multiply(object.matrixWorld));
 const isMaterial=object=>object.isMesh&&object.userData.role!=='printed-artwork'&&object.material.opacity!==0;
 const collected=new Set();
 const collect=object=>object.traverse(o=>{if(isMaterial(o))collected.add(o);});
 const bareBounds=new NeoHEXThree.Box3();
 const ray=(point,direction,object)=>{
  const origin=new NeoHEXThree.Vector3(...point).applyMatrix4(frame.matrixWorld);
  const vector=new NeoHEXThree.Vector3(...direction).transformDirection(frame.matrixWorld);
  return new NeoHEXThree.Raycaster(origin,vector).intersectObject(object,true).filter(hit=>isMaterial(hit.object));
 };
 const nativeHit=hit=>hit.point.clone().applyMatrix4(inverse);
 const corners=[a.board.pcb,...a.board.pads,...a.board.barrels,...a.board.capacitors,...a.board.terminals];
 for(const object of corners)collect(object);
 assert.equal(a.board.pcb.userData.role,'physical-pcb');
 assert.equal(a.board.capacitors.length,13,'actual own13 decoupling packages');
 assert.equal(a.board.terminals.length,26,'two actual solder ends per capacitor');
 assert.equal(a.board.mountingCenters.length,6);
 assert.equal(a.board.connectorDrills.length,12);
 assert.equal(a.board.barrels.length,18,'six mount and12 connector material barrels');
 assert.equal(a.board.pads.length,36,'two-sided six mount and12 contact annuli');
 const boardBox=localBox(a.board.pcb);
 close(boardBox.min.z,-.5,'real PCB rear plane');close(boardBox.max.z,.5,'real1mm PCB thickness');
 const boreCenters=[];
 for(let i=0;i<6;i++){
  const angle=(30+i*60)*Math.PI/180,[x,y]=a.board.mountingCenters[i];
  close(x,18*Math.cos(angle),'own ear centreX');close(y,18*Math.sin(angle),'own ear centreY');
  close(Math.hypot(x,y),18,'actual18mm mounting radius');
  const opposite=a.board.mountingCenters[(i+3)%6];
  close(Math.hypot(x-opposite[0],y-opposite[1]),36,'36mm is opposing hole centres');
  assert.equal(ray([x,y,3],[0,0,-1],a.board.pcb).length,0,'six actual PCB mounting apertures');
  const barrel=a.board.barrels[i];
  for(const direction of[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0]]){
   const hit=ray([x,y,0],direction,barrel)[0];assert.ok(hit,'real mounting metal wall');
   close(nativeHit(hit).distanceTo(new NeoHEXThree.Vector3(x,y,0)),1,'2mm empty plated bore');
  }
  boreCenters.push([x,y]);
 }
 const socketFacts=[];
 for(const[socket,id,face]of[[a.input,'grove','right'],[a.output,'out','left'],[a.vertical,'grove-in','back']]){
  assert.ok(socket.port===u.get(id),'actual port matches its own socket');
  assert.equal(socket.port.connector,'grove');assert.equal(socket.port.meta.face,face);
  assert.equal(socket.contacts.length,4);assert.equal(socket.returns.length,4);assert.equal(socket.tails.length,4);
  assert.equal(socket.parts.length,21,'actual walls/guide/floor/back/bridge and12 contact pieces');
  for(const object of[socket.floor,socket.back,socket.bridge,...socket.contacts,...socket.returns,...socket.tails]){
   assert.ok(object.isMesh&&under(object,socket.frame),'socket material belongs to its actual frame');
   assert.ok(socket.parts.includes(object));
  }
  collect(socket.frame);
  for(let i=0;i<4;i++){
   const contact=socket.contacts[i],tail=localPoint(socket.tails[i]);
   const portPoint=socket.port.object3d.worldToLocal(contact.getWorldPosition(new NeoHEXThree.Vector3()));
   assert.equal(socket.port.pinAt(portPoint).n,i+1,'actual four contact/pin-grid registration');
   assert.ok(a.board.connectorDrills.some(([x,y])=>Math.hypot(x-tail.x,y-tail.y)<1e-5),'real square tail aligns with its own plated PCB drilling');
   const bounds=localBox(socket.tails[i]);
   assert.ok(bounds.min.z<-.5&&bounds.max.z>.5,'actual solder tail spans the complete PCB thickness');
  }
  socketFacts.push({id,face,contacts:4,actualMaterialParts:socket.parts.length});
 }
 const display=a.display,leds=own(u,'led');
 assert.equal(display.components.length,37);assert.equal(display.lenses.length,37);
 assert.equal(display.packages.length,74,'37 real base/lip pairs');
 assert.equal(display.terminals.length,148,'four actual terminations per package');
 assert.equal(leds.length,37);
 const rowCounts=[4,5,6,7,6,5,4],measuredRows=Array(7).fill(0),emitterPositions=[];
 let index=0;
 for(let row=0;row<7;row++)for(let col=0;col<rowCounts[row];col++,index++){
  const number=index+1,led=u.get('led-'+number),lens=display.lenses[index];
  assert.ok(display.components[index]===led&&leds[index]===led,'U1..U37 component identity');
  assert.ok(led.lens===lens&&under(lens,led.object3d),'real encapsulant belongs to its actual ordinaryLed');
  assert.equal(led.meta.reference,'U'+number);assert.equal(led.meta.row,row);assert.equal(led.meta.column,col);
  const position=localPoint(led.object3d),x=(col-(rowCounts[row]-1)/2)*4.9,y=(3-row)*4.25;
  close(position.x,x,'actual physical column registration');close(position.y,y,'actual physical row registration');
  close(position.z,1.175,'actual encapsulant centre');
  for(const part of display.packages.slice(index*2,index*2+2)){
   const p=localPoint(part);assert.ok(part.isMesh&&part.parent===frame,'fixed actual base/lip');
   close(p.x,x,'base/lip and own LED shareX');close(p.y,y,'base/lip and own LED shareY');collect(part);
  }
  for(const part of display.terminals.slice(index*4,index*4+4)){
   const p=localPoint(part);assert.ok(part.parent===frame);
   close(Math.abs(p.x-x),.74,'four real corner terminalsX');close(Math.abs(p.y-y),.74,'four real corner terminalsY');collect(part);
  }
  collect(lens);close(localBox(lens).max.z,1.35,'actual37 package top support plane');
  // Cylinder cap fans meet at an exact centre vertex. Under an attached
  // half-turn parent, rounding can reject a ray on that shared vertex;
  // probe two interior surface points instead, without changing material.
  for(const[dx,dy]of[[.13,.07],[-.11,.08]]){
   const top=ray([x+dx,y+dy,2.5],[0,0,-1],lens)[0];assert.ok(top,'real encapsulant top material');
   close(nativeHit(top).z,1.35,'no plane-only or absent package beneath sheet');
  }
  emitterPositions.push([x,y,1.35]);measuredRows[row]++;
 }
 assert.deepEqual(measuredRows,rowCounts);
 for(const object of collected){assert.notEqual(object.userData.role,'physical-label-substrate');bareBounds.union(localBox(object));}
 const bareEnvelope=bareBounds.getSize(new NeoHEXThree.Vector3()).toArray(),width=62/Math.sqrt(3);
 [width,40,9.55].forEach((n,i)=>close(bareEnvelope[i],n,'complete bare assembly envelope including six ears'));
 close(bareBounds.min.z,-8.2,'vertical receiving socket defines own rear depth');
 close(bareBounds.max.z,1.35,'encapsulants define own front depth');
 // Device declares size metadata; the cable Module declares its mating family.
 if(u.meta.nominalMm!=null)assert.deepEqual(u.meta.nominalMm,[36,36,9.6],'nominal differs from real six-ear envelope');
 if(u.meta.size!=null)[width,40,9.85].forEach((n,i)=>close(u.meta.size[i],n,'meta carries actual default assembled envelope'));
 const placement=a.diffuserPort;assert.ok(placement===u.get('diffuser'));
 assert.equal(placement.connector,'m5.neohex.diffuser');assert.equal(placement.meta.role,'mechanical-placement');
 assert.equal(placement.meta.physicalRole,'removable-supplied-sheet');
 const placementMaterials=[];placement.object3d.traverse(o=>{
  if(isMaterial(o)&&!(placement.module&&under(o,placement.module.root)))placementMaterials.push(o);
 });assert.equal(placementMaterials.length,0,'sheet placement interface has no fabricated physical socket/latch');
 const expectedSheet=u.options.diffuser??true,sheetModule=placement.module;
 assert.equal(Boolean(sheetModule),expectedSheet,'actual default/bare configuration');
 const installedBounds=bareBounds.clone();
 if(sheetModule){
  assert.equal(sheetModule.meta.physicalRole,'independent-removable-sheet');
  assert.equal(sheetModule.components.size,0);assert.deepEqual(Object.keys(sheetModule.diffuserAssembly),['sheet']);
  const sheet=sheetModule.diffuserAssembly.sheet;assert.ok(sheet.isMesh&&under(sheet,sheetModule.root));
  assert.equal(sheet.userData.role,'physical-diffuser');
  const bounds=localBox(sheet),dimensions=bounds.getSize(new NeoHEXThree.Vector3());
  close(dimensions.x,width,'own hexagonal sheet width');close(dimensions.y,31,'sheet spans actual body flats');
  close(dimensions.z,.3,'separately documented inferred sheet thickness');
  close(bounds.min.z,1.35,'sheet rests on actual37 package tops');close(bounds.max.z,1.65,'sheet front volume');
  for(const[x,y,z]of emitterPositions){
   const underside=ray([x,y,z-.02],[0,0,1],sheet)[0];assert.ok(underside,'actual sheet bottom at every package support');
   close(nativeHit(underside).z,z,'sheet/real LED support correspondence');
  }
  installedBounds.union(bounds);
 }
 const envelope=installedBounds.getSize(new NeoHEXThree.Vector3()).toArray();
 [width,40,expectedSheet?9.85:9.55].forEach((n,i)=>close(envelope[i],n,'current actual sheet configuration envelope'));
 return{geometrySource:'own-dimensioned-parametric',physicalLeds:37,rows:measuredRows,packageBasesAndLips:74,actualTerminations:148,capacitors:13,mountingBores:6,mountingBoreMm:2,opposedMountingCentersMm:36,sockets:socketFacts,physicalAdhesiveFilms:0,removableDiffuserInstalled:expectedSheet,diffuserInterface:'static placement without invented socket/latch',bareEnvelopeMm:bareEnvelope,currentEnvelopeMm:envelope,nominalMm:[36,36,9.6]};
}
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {loadModel,loadGroveModule} from '../src/loaders.js';
import {Antenna as CatMAntenna} from '../src/units/catm/index.js';
import {Diffuser as NeoHEXDiffuser} from '../src/units/neohex/index.js';

const ids=['catm','neohex','env-iv'];
const expectedApi={"catm":{"body":["grove","sma"],"ports":["grove","sma"],"leds":[],"canonical":"grove"},"neohex":{"body":["grove","out","grove-in","diffuser","led-1","led-2","led-3","led-4","led-5","led-6","led-7","led-8","led-9","led-10","led-11","led-12","led-13","led-14","led-15","led-16","led-17","led-18","led-19","led-20","led-21","led-22","led-23","led-24","led-25","led-26","led-27","led-28","led-29","led-30","led-31","led-32","led-33","led-34","led-35","led-36","led-37"],"ports":["grove","out","grove-in","diffuser"],"leds":["led-1","led-2","led-3","led-4","led-5","led-6","led-7","led-8","led-9","led-10","led-11","led-12","led-13","led-14","led-15","led-16","led-17","led-18","led-19","led-20","led-21","led-22","led-23","led-24","led-25","led-26","led-27","led-28","led-29","led-30","led-31","led-32","led-33","led-34","led-35","led-36","led-37"],"canonical":"grove"},"env-iv":{"body":["grove","sht40","bmp280"],"ports":["grove"],"leds":[],"canonical":"grove"}};
const expectedPrint={"catm":{"default":{"kinds":["source-vector-raster","source-vector-raster"]},"cases":[]},"neohex":{"default":{"kinds":["reference-redraw","reference-redraw"]},"cases":[]},"env-iv":{"default":{"kinds":["source-vector-raster"]},"cases":[{"options":{"rearCover":false},"kinds":[]}]}};

function checkCatMNative(u){
 u.root;const a=u.catmAssembly,parts=Object.values(a.parts);assert.equal(parts.length,1);assert.equal(parts[0].geometry.index.count/3,6592);
 assert.equal(a.input.contacts.length,4);assert.equal(a.input.tails.length,4);assert.equal(a.sim.contacts.length,6);assert.equal(a.sim.cardIncluded,false);assert.equal(a.sim.concealed,true);assert.ok(u.find('sim')===null);
 assert.equal(a.sma.port.connector,'sma-female');assert.equal(CatMAntenna.meta.connector,'sma-female');assert.equal(CatMAntenna.meta.physicalConnector,'sma-male');assert.equal(a.screws.length,3);assert.ok(a.labels.front.isMesh&&a.labels.back.isMesh);
 assert.equal(a.pcb.netlight.material.emissive.getHex(),0,'concealed NETLIGHT has no invented exterior emission');
 return{nativeFaces:6592,ownSingleSourceAssembly:true,internalNanoSIMContacts:6,noSuppliedCard:true,noExposedSIMPort:true,noExteriorLED:true};
}

function checkBoundary(u,id){
 u.root;const expected=expectedApi[id],body=[...u.components.keys()].filter(x=>!['unitFrame','cable'].includes(x));
 assert.deepEqual(body,expected.body);assert.deepEqual(own(u,'port').map(p=>p.id),expected.ports);assert.deepEqual(own(u,'led').map(p=>p.id),expected.leds);
 for(const kind of['button','joint','sensor','display','speaker','rotary-selector'])assert.equal(own(u,kind).length,0,'no invented controls,firmware readings or outputs');
 const passive=own(u,'component');for(const c of passive){assert.equal(c.interactive,false);assert.deepEqual(c.getState(),{});}
 assert.equal(u.get(expected.canonical).connector,'grove');
 return{id,body,ports:expected.ports,leds:expected.leds,passive:passive.map(c=>c.id)};
}

function staticAttachment(host,u,prefix,id,Constructor,events){
 u.root;const p=u.get(id),original=p.module;let temporary=null;
 try{
  if(!p.module){temporary=new Constructor();p.attach(temporary);}
  const a=p.module;a.root;assert.deepEqual([...a.components.keys()],[],'static accessory has no fabricated joint,animation or firmware component');
  const shape=physical(u),fixed=physical(u,[a.root]),ports=frames(u),n=events.length;
  host.update(.5);assert.equal(physical(u),shape);assert.equal(events.length,n);
  for(const type of['joint','rpm','tilt'])assert.throws(()=>a.handle({type,target:'tilt',angleDeg:30,rpm:5}));
  assert.equal(physical(u),shape);assert.equal(events.length,n);
  assert.ok(p.detach({dispose:false})===a);assert.equal(physical(u),fixed,'detaching actual accessory preserves every retained physical record');assert.equal(frames(u),ports);
  p.attach(a);assert.ok(p.module===a);assert.equal(physical(u),shape);assert.equal(frames(u),ports);assert.equal(events.length,n);
  checkWrongFamily(host,u,prefix,[id],events);
  return{port:id,connector:p.connector,accessory:Constructor.meta.id,static:true,detachRetainedPhysical:'identical',reattach:'same identity and complete physical pose',wrongFamily:'atomic rejection'};
 }finally{if(temporary){if(p.module===temporary)p.detach({dispose:false});temporary.dispose();}assert.ok(p.module===original);}
}

function checkRearService(closed,opened){
 closed.root;opened.root;const a=closed.envIVAssembly.rear;assert.ok(a);assert.equal(opened.envIVAssembly.rear,null);
 const removed=[a.plate,...a.walls,a.film,...a.logo,a.head,a.floor,a.shaft];assert.equal(removed.length,35);assert.equal(new Set(removed).size,35);assert.ok(removed.every(o=>o.isMesh));
 const retained=records(closed,removed),actual=records(opened);assertMultisetEqual(retained,actual,'service removes exactly own rear plate/8walls/film/22M5meshes/3fixing meshes,not a different same-count subset');
 assert.equal(frames(closed),frames(opened));return{removedPhysicalMeshes:35,retainedPhysicalMeshes:actual.length,retainedMultiset:'identical',removalFields:['rear.plate','rear.walls[8]','rear.film','rear.logo[22]','rear.head','rear.floor','rear.shaft']};
}

/** Current three own physical assemblies,actual outputs/accessories and four-core integration. */
export async function checkCatMNeoHEXEnvIVUnits(){
 const restore=installCanvasStub();let host;
 try{
  const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
  host=await loadModel('sticks3');host.root;host.display().fill('#123456');const framebuffer=hash(host.display().buffer),hub=await loadGroveModule('hub');host.port('grove').attach(hub);
  const units={},events=[],components=[],artwork=[],configurations=[],accessories=[],outputs=[];host.on('input',e=>{if(e.kind!=='port')events.push(e);});
  for(const[i,id]of ids.entries()){
   const u=await loadGroveModule(id,{cableLength:75+i*15});hub.get(`grove-${i+1}`).attach(u);host.update(0);units[id]=u;assert.equal(u.get('cable').getState().wireCount,4);components.push(checkBoundary(u,id));
   const product=catalog.products.find(p=>p.id===id),seen=new Set();
   for(const options of[{},...product.configurations.map(c=>c.options)]){
    const key=JSON.stringify(Object.fromEntries(Object.entries(options).sort(([a],[b])=>a.localeCompare(b))));if(seen.has(key))continue;seen.add(key);
    for(const load of[loadModel,loadGroveModule]){
     const on=await load(id,options),off=await load(id,{...options,artwork:false});try{
      on.root;off.root;on.update(0);off.update(0);checkBoundary(on,id);checkBoundary(off,id);
      assert.equal(physical(on),physical(off),'all physical attributes/index/world survive artwork removal');assert.equal(frames(on),frames(off));assert.equal(panels(off).length,0);
      const expected=expectedPrint[id].cases.find(c=>JSON.stringify(c.options)===key)??expectedPrint[id].default;
      const kinds=panels(on).map(p=>p.userData.artworkKind).sort();assert.deepEqual(kinds,[...expected.kinds].sort());
      if(id==='neohex'){
       if(load===loadModel)checkNeoHEXPhysical(on);
       const localEvents=[],offInput=on.on('input',e=>{if(e.kind!=='port')localEvents.push(e);});try{checkNeoHexOutputs(on,on,'',localEvents);}finally{offInput();}assert.equal(physical(on),physical(off),'externalLED commands preserve all physical geometry');
       assert.equal(Boolean(on.get('diffuser').module),options.diffuser??true);
      }
      if(id==='catm')assert.equal(Boolean(on.get('sma').module),options.antenna??false);
      if(load===loadModel&&key==='{}')artwork.push({id,panels:kinds.length,kinds});
     }finally{on.dispose();off.dispose();}
    }
   }configurations.push({id,optionCases:seen.size,entries:2,physicalAttributesIndexWorld:'identical without ink'});
  }
  const prefix=i=>`grove/grove-${i+1}`;
  components.find(c=>c.id==='catm').native=checkCatMNative(units.catm);accessories.push(staticAttachment(host,units.catm,prefix(0),'sma',CatMAntenna,events));
  accessories.push(staticAttachment(host,units.neohex,prefix(1),'diffuser',NeoHEXDiffuser,events));
  components.find(c=>c.id==='neohex').physicalStructure=checkNeoHEXPhysical(units.neohex);
  outputs.push(checkNeoHexOutputs(host,units.neohex,prefix(1),events));
  for(const[i,id]of ids.entries())checkWrongFamily(host,units[id],prefix(i),expectedApi[id].ports,events);
  for(const[i,id]of ids.entries()){
   const u=units[id],before=physical(u),n=events.length;host.handle({type:'pose',target:target(prefix(i),'unitFrame'),position:[i*55,195+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:target(prefix(i),'cable'),slack:12,bend:[0,0,-1]});host.update(0);assert.notEqual(physical(u),before);assert.equal(u.get('cable').getState().wireCount,4);assert.equal(events.length,n);
  }
  accessories.push(staticAttachment(host,units.catm,prefix(0),'sma',CatMAntenna,events));accessories.push(staticAttachment(host,units.neohex,prefix(1),'diffuser',NeoHEXDiffuser,events));outputs.push(checkNeoHexOutputs(host,units.neohex,prefix(1),events));components.find(c=>c.id==='neohex').transformedStructure=checkNeoHEXPhysical(units.neohex);
  const closed=await loadModel('env-iv'),opened=await loadModel('env-iv',{rearCover:false});let service;
  try{closed.root;opened.root;service=checkRearService(closed,opened);}finally{closed.dispose();opened.dispose();}
  // An actual second Grove socket carries a nested four-core visual assembly,input only.
  const neo=units.neohex,key=await loadGroveModule('key',{cableLength:55}),out=neo.get('out'),neoRest=physical(neo),ports=frames(neo),peers=[physical(units.catm),physical(units['env-iv'])];out.attach(key);host.update(0);assert.equal(key.get('cable').getState().wireCount,4);
  host.handle({type:'button',target:'grove/grove-2/out/press',action:'press',source:'fixture:neohex-chain'});tick(host);assert.equal(key.get('press').pressed,true);
  host.handle({type:'button',target:'grove/grove-2/out/press',action:'cancel',source:'fixture:neohex-chain'});tick(host);assert.equal(key.get('press').pressed,false);assert.equal(key.get('press').getActuationState().depthMm,0);
  const keyShape=physical(key),n=events.length,ledState=neo.get('led-1').getState();host.handle({type:'led',target:'grove/grove-2/led-1',color:'#158dff',brightness:.4});assert.equal(physical(key),keyShape);assert.equal(events.length,n);neo.get('led-1').set(ledState);
  roundtrip(neo,out);out.detach();host.update(0);assert.equal(physical(neo),neoRest);assert.equal(frames(neo),ports);assert.deepEqual([physical(units.catm),physical(units['env-iv'])],peers);
  const disposal=observeDisposal(host.root);
  for(const[i,id]of ids.entries()){
   const peerIds=ids.filter(x=>x!==id),before=peerIds.map(x=>physical(units[x])),p=hub.get(`grove-${i+1}`),part=p.detach({dispose:false});assert.ok(part===units[id]);assert.deepEqual(peerIds.map(x=>physical(units[x])),before);p.attach(part);host.update(0);assert.equal(part.get('cable').getState().wireCount,4);
  }
  const beforeLast=[physical(units.catm),physical(units.neohex)];hub.get('grove-3').detach();assert.deepEqual([physical(units.catm),physical(units.neohex)],beforeLast);assert.equal(hash(host.display().buffer),framebuffer);host.dispose();host=null;const disposedResources=disposal();
  return{status:'pass',components,artwork,configurations,accessories,outputs,service,disposedResources,cases:['three-real-four-core-Grove-branches','own-native-CatM-static-ordinary-SMA-accessory','37-real-independent-externalLED-emitters-noecho-no-electrical-cascade','actual-removable-opal-diffuser-and-retained-body-identity','ENV-IV-real-rear-service-retained-full-physical-multiset','both-entries-all-actual-presets-artwork-physical-invariance','transformed-ancestors-wrong-family-atomicity-peer-isolation-independent-detach','NeoHEX-out-real-four-core-nested-Key-input-intent-only','host-framebuffer-and-observed-resource-disposal'],scope:'Own current three physical assemblies,matching print and actual external visual outputs/accessories;Node canvas boundary fixture;no browser/GPU/manufacturing/productionfit/hardware/cellular/UART/network/electrical/cascade/sensorvalues/firmware/whole-history acceptance'};
 }finally{host?.dispose();restore();}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkCatMNeoHEXEnvIVUnits(),null,2));
