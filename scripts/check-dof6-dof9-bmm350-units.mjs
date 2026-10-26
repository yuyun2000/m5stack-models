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

import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {loadModel,loadGroveModule} from '../src/loaders.js';
const ids=['dof6','dof9','bmm350'];

function checkComponentBoundary(unit,id){
 unit.root;assert.deepEqual(own(unit,'port').map(c=>c.id),['grove']);assert.deepEqual(unit.port('grove').pins.map(p=>p.name),['GND','5V','SDA','SCL']);
 for(const kind of['sensor','led','display','speaker','joint'])assert.equal(own(unit,kind).length,0,'only actual physical components;no measurement state or invented outputs');
 const controls=own(unit,'button');assert.deepEqual(controls.map(c=>c.id),id==='bmm350'?[]:['address']);
 const passive=[...unit.components.values()].filter(c=>!['port','button'].includes(c.kind)&&!['unitFrame','cable'].includes(c.id));assert.ok(passive.length>0,'at least actual package frame');
 for(const c of passive){assert.equal(c.kind,'component');assert.equal(c.meta.role,'visual-anchor');assert.deepEqual(c.getState(),{});}
 return{id,ports:['grove'],controls:controls.map(c=>c.id),passiveAnchors:passive.map(c=>c.id)};
}

function checkBmmService(closed,open){
 closed.root;open.root;const a=closed.bmm350Assembly,b=open.bmm350Assembly;
 const removed=[a.parts['BMM350 complete native rear housing'],a.labels.back,a.screw.head,a.screw.floor,a.screw.shank];
 assert.equal(removed.length,5);assert.ok(removed.every(o=>o?.isMesh));assert.equal(new Set(removed).size,5);assert.equal(b.screw,null);assert.equal(b.labels.back,undefined);assert.equal(Object.keys(b.parts).length,1);
 assertMultisetEqual(records(closed,removed),records(open),'BMM350 service removes exactly own rear/film/3 fixing meshes and preserves all other physical attributes/index/world');assert.equal(frames(closed),frames(open));return{id:'bmm350',removedPhysicalMeshes:5,retainedPhysicalMeshes:records(open).length};
}

/** Exact current product API fixture; Node canvas stub only. */
export async function checkDof6Dof9Bmm350Units(){
 const restore=installCanvasStub();let host;
 try{
  const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
  host=await loadModel('sticks3');host.root;host.display().fill('#123456');const framebuffer=hash(host.display().buffer),hub=await loadGroveModule('hub');host.port('grove').attach(hub);const events=[],units={},artwork=[],components=[],motions=[],configurations=[],services=[];host.on('input',e=>{if(e.kind!=='port')events.push(e);});
  for(const[i,id]of ids.entries()){
   const unit=await loadGroveModule(id,{cableLength:75+i*15});hub.port('grove-'+(i+1)).attach(unit);units[id]=unit;host.update(0);assert.equal(unit.get('cable').getState().wireCount,4);components.push(checkComponentBoundary(unit,id));
   const product=catalog.products.find(p=>p.id===id),presets=product.configurations;assert.ok(Array.isArray(presets)&&presets.length>0&&presets.every(p=>p.id&&p.name&&p.options));
   const configs=[{},...presets.map(p=>p.options),...(id==='bmm350'?[]:[{addressPosition:0},{addressPosition:1}])],seen=new Set();
   for(const options of configs){const key=JSON.stringify(options);if(seen.has(key))continue;seen.add(key);for(const load of[loadModel,loadGroveModule]){
    const on=await load(id,options),off=await load(id,{...options,artwork:false});try{
     on.root;off.root;on.update(0);off.update(0);assert.equal(physical(on),physical(off),'all actual attributes/index/world matrices stay identical without ink');assert.equal(panels(off).length,0);checkComponentBoundary(on,id);checkComponentBoundary(off,id);
     const expected=options.rearCover===false?2:3;assert.equal(panels(on).length,expected);for(const p of panels(on))assert.equal(p.userData.artworkKind,'source-vector-raster');
     if(id!=='bmm350')assert.equal(on.get('address').position,options.addressPosition??0);
     if(load===loadModel&&key==='{}')artwork.push({id,panels:expected,kinds:['source-vector-raster']});
    }finally{on.dispose();off.dispose();}
   }}configurations.push({id,optionCases:seen.size,entries:2});
   if(id!=='bmm350')motions.push(checkStableSlide(host,unit,'address','grove/grove-'+(i+1),events));
  }
  const closed=await loadModel('bmm350'),open=await loadModel('bmm350',{rearCover:false});try{services.push(checkBmmService(closed,open));}finally{closed.dispose();open.dispose();}
  for(const[i,id]of ids.entries()){const unit=units[id],before=physical(unit),noecho=events.length;host.handle({type:'pose',target:'grove/grove-'+(i+1)+'/unitFrame',position:[i*55,195+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:'grove/grove-'+(i+1)+'/cable',slack:12,bend:[0,0,-1]});host.update(0);assert.notEqual(physical(unit),before);assert.equal(unit.get('cable').getState().wireCount,4);assert.equal(events.length,noecho);if(id!=='bmm350')checkStableSlide(host,unit,'address','grove/grove-'+(i+1),events);}
  // Only physical input intent from those sliders is emitted;commands remain silent.
  assert.equal(hash(host.display().buffer),framebuffer);
  for(const[i,id]of ids.entries()){const peers=ids.filter(x=>x!==id).map(x=>physical(units[x])),p=hub.port('grove-'+(i+1)),part=p.detach({dispose:false});assert.ok(part===units[id]);assert.deepEqual(ids.filter(x=>x!==id).map(x=>physical(units[x])),peers);p.attach(part);host.update(0);assert.equal(part.get('cable').getState().wireCount,4);}
  const peers=[physical(units.dof6),physical(units.dof9)];hub.port('grove-3').detach();assert.deepEqual([physical(units.dof6),physical(units.dof9)],peers);assert.ok(hub.port('grove-1').module===units.dof6&&hub.port('grove-2').module===units.dof9);
  return{status:'pass',artwork,components,motions,configurations,services,cases:['three-real-four-core-Grove-branches','two-own-exposed-real-SW1-detents-cap-only-multiple-source-release-cancel-retains-position','each-SKU-actual-populated-package-frames-empty-passive-state','BMM350-real-fixed-slot-backing-without-borrowed-slider','BMM350-real-rear-cover-service-exact-five-material-removals-full-retained-multiset-equality','both-entries-all-actual-presets-artwork-preserves-every-physical-attribute-index-world-matrix','external-position-pose-and-cable-no-inputecho-transformed-ancestors','independent-detach-peer-isolation-host-framebuffer-and-disposal'],scope:'Own exact-SKU three physical assemblies and externally driven real shape only;Node canvas stub;no browser/GPU,manufacturing,measured travel,production fit,physical hardware,firmware,electrical,I2C/address algorithm,IMU/magnetic readings or whole-history acceptance'};
 }finally{host?.dispose();restore();}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkDof6Dof9Bmm350Units(),null,2));
