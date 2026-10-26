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


/** One exposed,real two-detent slider; physical caps only,no electrical mode/address algorithm. */
export function checkStableSlide(host,unit,id,prefix,events){
 unit.root;unit.update(0);const c=unit.get(id);assert.equal(c.kind,'button');assert.equal(c.isLatching,true);assert.equal(c.interactive,true);assert.ok(c.travel>0);assert.equal(c.pressed,false);
 const original=c.position,ports=frames(unit);c.setPosition(0,{immediate:true});const rest=physical(unit),capRest=physical(c.cap),fixed=physical(unit,[c.cap]);let capMeshes=0;c.cap.traverse(o=>{if(o.isMesh&&o.material.opacity!==0)capMeshes++;});assert.ok(capMeshes>0,'actual opaque slider material required');
 let n=events.length;host.handle({type:'button',target:target(prefix,id),action:'position',position:1,immediate:true});assert.equal(c.position,1);assert.equal(c.getActuationState().depthMm,c.travel);assert.notEqual(physical(c.cap),capRest);assert.equal(physical(unit,[c.cap]),fixed);assert.equal(frames(unit),ports);assert.equal(events.length,n);
 const shape=physical(unit),state=c.getState();for(const invalid of[-1,2,.5,NaN,Infinity]){assert.throws(()=>c.setPosition(invalid,{immediate:true}));assert.deepEqual(c.getState(),state);assert.equal(physical(unit),shape);}
 c.setPosition(0,{immediate:true});assert.equal(physical(unit),rest);n=events.length;c.onPointerDown({pointerId:81});c.press('fixture:peer');tick(host);assert.equal(c.position,1);assert.equal(c.pressed,true);assert.equal(physical(unit,[c.cap]),fixed);assert.notEqual(physical(c.cap),capRest);
 c.onPointerUp({pointerId:81});tick(host);assert.equal(c.pressed,true);assert.equal(c.position,1);host.handle({type:'button',target:target(prefix,id),action:'cancel',source:'fixture:peer'});tick(host);assert.equal(c.pressed,false);assert.equal(c.position,1);assert.equal(c.getActuationState().depthMm,c.travel);assert.deepEqual(events.slice(n).map(e=>e.action),['down','up']);assert.equal(events.at(-1).cancelled,true);
 n=events.length;c.press('fixture:one');c.press('fixture:two');tick(host);assert.equal(c.position,0);c.cancel('fixture:one');tick(host);assert.equal(c.pressed,true);assert.equal(c.position,0);c.release('fixture:two');tick(host);assert.equal(c.pressed,false);assert.equal(c.position,0);assert.deepEqual(events.slice(n).map(e=>e.action),['down','up']);assert.equal(events.at(-1).cancelled,true);assert.equal(physical(unit),rest);
 n=events.length;c.press('fixture:click');tick(host);c.release('fixture:click');tick(host);assert.equal(c.position,1);assert.deepEqual(events.slice(n).map(e=>e.action),['down','up','click']);assert.equal(physical(unit,[c.cap]),fixed);
 n=events.length;c.setPosition(0);host.update(1/240);assert.ok(c.getActuationState().depthMm>0&&c.getActuationState().depthMm<c.travel);tick(host);assert.equal(physical(unit),rest);assert.equal(events.length,n);c.setPosition(original,{immediate:true});return{id,movingMeshes:capMeshes,multiSourceCancel:'retains detent',externalPosition:'noecho'};
}

import {Antenna as LoRa433Antenna} from '../src/units/lora-e220-433/index.js';
import {LoraAntenna as RpSmaLoraAntenna} from '../src/units/c6l/index.js';

/** Final own433 API; caller records only non-port input in events. */
export function checkLoRa433(host,unit,prefix,events){
 unit.root;unit.update(0);assert.ok(Array.isArray(events));
 assert.deepEqual([...unit.components.keys()].filter(id=>!['unitFrame','cable'].includes(id)),['grove','sma','m0','m1']);
 assert.deepEqual(own(unit,'port').map(p=>p.id),['grove','sma']);
 assert.deepEqual(own(unit,'button').map(c=>c.id),['m0','m1']);
 for(const kind of['sensor','led','display','speaker','joint','component'])assert.equal(own(unit,kind).length,0,'own433 has no fabricated anchor,value,output or joint');
 assert.equal(unit.port('grove').connector,'grove');assert.deepEqual(unit.port('grove').pins.map(p=>p.name),['GND','5V','RXD','TXD']);
 const p=unit.get('sma');assert.equal(p.connector,'sma-female');assert.equal(p.meta.physicalConnector,'sma-female');
 assert.equal(LoRa433Antenna.meta.connector,'sma-female');assert.equal(LoRa433Antenna.meta.physicalConnector,'sma-male');assert.equal(p.accepts(LoRa433Antenna),true);
 const a=unit.lora433Assembly;assert.equal(Object.keys(a.parts).length,1);assert.ok(a.parts['LoRaE220-433 complete own native assembled front and rear housing']);
 assert.equal(a.controls.fixed.length,6);assert.ok(a.controls.fixed.every(o=>o?.isMesh));assert.equal(new Set(a.controls.fixed).size,6);
 assert.ok(a.controls.sliders[0]===unit.get('m0'));assert.ok(a.controls.sliders[1]===unit.get('m1'));
 for(const c of a.controls.sliders){
  assert.ok(a.controls.fixed.every(o=>!under(o,c.cap)),'base,cover and four solder terminals stay outside both moving caps');
  assert.ok(!under(a.controls.base,c.cap)&&!under(a.controls.cover,c.cap));assert.equal(a.controls.terminals.length,4);
  let moving=0;c.cap.traverse(o=>{if(o.isMesh&&o.material.opacity!==0)moving++;});assert.equal(moving,1,'one real retained cream thumb perDIP');
 }
 const assemblyRest=physical(unit),portRest=frames(unit),motion=[];
 for(const id of['m0','m1']){
  const peer=unit.get(id==='m0'?'m1':'m0'),peerState=peer.getState(),peerShape=physical(peer.cap),fixed=stamp(a.controls.fixed.flatMap(o=>records(o)));
  motion.push(checkStableSlide(host,unit,id,prefix,events));
  assert.deepEqual(peer.getState(),peerState,'other stable DIP keeps independent state');assert.equal(physical(peer.cap),peerShape,'other actual thumb stays still');
  assert.equal(stamp(a.controls.fixed.flatMap(o=>records(o))),fixed,'all six known fixed switch meshes unchanged');
  assert.equal(physical(unit),assemblyRest,'complete initial geometry and both actual detents restored');assert.equal(frames(unit),portRest);
 }
 const oldAccessory=p.module;let temporary=null;
 try{
  if(!oldAccessory){temporary=new LoRa433Antenna();p.attach(temporary);}
  const antenna=p.module;antenna.root;assert.ok(antenna);assert.equal(antenna.meta.connector,'sma-female');assert.equal(antenna.meta.physicalConnector,'sma-male');
  assert.deepEqual([...antenna.components.keys()],[],'observed static own433 accessory has no invented hinge/control');
  assert.equal(own(antenna,'joint').length,0);assert.ok(antenna.antennaAssembly.frame.isGroup);
  const shape=physical(antenna),fixedBody=physical(unit,[antenna.root]),ports=frames(unit),inputStart=events.length;
  antenna.update(.5);assert.equal(physical(antenna),shape,'static antenna never moves automatically');assert.equal(events.length,inputStart);
  for(const type of['joint','tilt','rpm','rf','uart','frequency','mode'])assert.throws(()=>antenna.handle({type,target:'tilt',angleDeg:30,rpm:1,value:1}));
  assert.equal(physical(antenna),shape);assert.equal(physical(unit,[antenna.root]),fixedBody);
  roundtrip(unit,p);assert.ok(p.module===antenna);assert.equal(physical(unit,[antenna.root]),fixedBody);assert.equal(frames(unit),ports);
  class WrongGrove extends Module{static meta={id:'fixture.lora433.wrong-grove',name:'Incompatible Grove accessory',connector:'grove'};build(){}}
  const incompatible=[new WrongGrove(),new RpSmaLoraAntenna()];
  try{
   for(const wrong of incompatible){
    const occupied=p.module,complete=physical(unit),fixedPorts=frames(unit);assert.equal(p.accepts(wrong),false);assert.throws(()=>p.attach(wrong));
    assert.ok(p.module===occupied&&occupied===antenna,'wrong Grove/RP-SMA cannot replace occupied ordinary SMA');
    assert.equal(physical(unit),complete);assert.equal(frames(unit),fixedPorts);
   }
  }finally{for(const wrong of incompatible)wrong.dispose();}
  assert.equal(events.length,inputStart,'static accessory operations emit no non-port intent');
 }finally{
  if(temporary){if(p.module===temporary)p.detach({dispose:false});temporary.dispose();}
 }
 assert.ok(p.module===oldAccessory);assert.equal(physical(unit),assemblyRest);assert.equal(frames(unit),portRest);
 return{id:'lora-e220-433',ports:['grove','sma'],controls:motion,fixedSwitchMeshes:6,antenna:{static:true,connector:'sma-female',physicalConnector:'sma-male',joints:[],independentDetach:'pass',rejects:['grove','rp-sma']},initialAssemblyRestored:true};
}

/** Own U078-C native tongues and real interfaces; uses fixture-parts helpers. */
export function checkUnitVNative(host,u,prefix,events){
 u.root;u.update(0);world(u);assert.ok(Array.isArray(events));
 const a=u.unitVOv7740Assembly,ids=[...u.components.keys()].filter(id=>!['unitFrame','cable'].includes(id));
 assert.deepEqual(ids,['grove','usb','sd','buttonA','buttonB','camera','rgb']);
 assert.deepEqual(own(u,'port').map(c=>c.id),['grove','usb','sd']);
 assert.deepEqual(own(u,'button').map(c=>c.id),['buttonA','buttonB']);
 assert.deepEqual(own(u,'led').map(c=>c.id),['rgb']);
 for(const kind of['sensor','display','speaker','joint'])assert.equal(own(u,kind).length,0);
 assert.equal(u.get('camera').kind,'component');assert.equal(u.get('camera').interactive,false);assert.deepEqual(u.get('camera').getState(),{});
 assert.equal(u.get('grove').connector,'grove');assert.deepEqual(u.get('grove').pins.map(p=>p.name),['GND','V','G35','G34']);
 assert.equal(u.get('usb').connector,'usb-c');assert.equal(u.get('sd').connector,'microsd');assert.equal(u.get('sd').meta.cardInstalled,false);
 assert.equal(a.input.contacts.length,4);assert.equal(a.input.tails.length,4);assert.equal(a.usb.contacts.length,24);assert.equal(a.sd.contacts.length,9);
 assert.equal(Object.keys(a.parts).length,2);assert.ok(a.parts['UnitV-OV7740 complete native front housing']===a.front);assert.ok(a.parts['UnitV-OV7740 complete native rear housing']===a.rear);
 assert.equal(a.front.geometry.index.count/3,3002);assert.equal(a.rear.geometry.index.count/3,4054);
 const controls=[u.get('buttonA'),u.get('buttonB')],rear=a.rear,g=rear.geometry,p=g.attributes.position,n=g.attributes.normal;
 const restP=p.array.slice(),restN=n.array.slice(),restIndex=g.index.array.slice(),restPH=hash(restP),restNH=hash(restN),restIH=hash(restIndex);
 const componentFrames=new Map(),followerFixed=new Map(),proxyFixed=new Map(),allMask=new Set(),masks=new Map();
 const geomFixed=o=>stamp({attributes:attrs(o),index:o.geometry.index?hash(o.geometry.index.array):null});
 const localFixed=o=>stamp({y:o.position.y,z:o.position.z,quaternion:o.quaternion.toArray(),scale:o.scale.toArray()});
 for(const [i,c] of controls.entries()){
  const b=a.buttons[c.id];assert.equal(c.kind,'button');assert.equal(c.isLatching,false);assert.equal(c.interactive,true);assert.equal(c.travel,.22);assert.deepEqual(c.getState(),{pressed:false});assert.equal(c.getActuationState().depthMm,0);
  assert.equal(c.sign,i===0?-1:1);assert.deepEqual(c.axis.toArray(),i===0?[1,0,0]:[-1,0,0]);assert.ok(c.shell===rear);assert.ok(c.follower===b.follower);assert.ok(b.control===c);
  assert.equal(c.affectedIndices.length,98);assert.equal(c.weights.length,p.count);assert.equal(c.slopes.length,p.count);assert.equal(c.rest.length,restP.length);assert.equal(c.norm.length,restN.length);assert.equal(hash(c.rest),restPH);assert.equal(hash(c.norm),restNH);
  assert.ok(b.hit.userData.component===c);assert.ok(under(b.hit,c.cap));assert.equal(b.hit.visible,true);assert.equal(b.hit.material.opacity,0);assert.equal(b.hit.material.depthWrite,false);
  assert.ok(!under(rear,c.object3d)&&!under(a.front,c.object3d));assert.ok(!under(b.follower,c.cap)&&!under(b.body,c.cap));assert.equal(b.terminals.length,2);assert.ok(b.terminals.every(o=>o.isMesh&&!under(o,c.cap)));
  assert.equal(rear.userData.component,undefined,'whole rear housing is never tagged as either side key');
  const mask=new Set(c.affectedIndices);assert.equal(mask.size,98);for(const j of mask){assert.ok(Number.isInteger(j)&&j>=0&&j<p.count);assert.ok(c.weights[j]>0&&c.weights[j]<=1);assert.ok(!allMask.has(j),'native masks must be disjoint');allMask.add(j);}masks.set(c,mask);
  for(let j=0;j<c.weights.length;j++)if(!mask.has(j))assert.equal(c.weights[j],0,'no unlisted native vertex may acquire a flexure weight');
  assert.equal(c.follower.position.x,c.followerRest);componentFrames.set(c,stamp(c.object3d.matrixWorld.toArray()));followerFixed.set(c,{geometry:geomFixed(c.follower),local:localFixed(c.follower)});proxyFixed.set(c,{geometry:geomFixed(b.hit),local:stamp({position:b.hit.position.toArray(),quaternion:b.hit.quaternion.toArray(),scale:b.hit.scale.toArray()})});
 }
 assert.equal(allMask.size,196);assert.ok(a.buttons.buttonA.body.position.x<0&&a.buttons.buttonB.body.position.x>0,'rear print A/B is mirrored into the front coordinate frame');
 const rearFrame=stamp(rear.matrixWorld.toArray()),otherAttrs=Object.fromEntries(Object.entries(g.attributes).filter(([key])=>!['position','normal'].includes(key)).map(([key,v])=>[key,hash(v.array)]));
 const excluded=[rear,...controls.flatMap(c=>[c.follower,c.cap])],fixed=physical(u,excluded),rest=physical(u),ports=frames(u);
 const near=(actual,expected,message)=>assert.ok(Math.abs(actual-expected)<.000002,`${message}: ${actual}/${expected}`);
 function verifyMotion(){
  world(u);assert.equal(hash(g.index.array),restIH,'all original native indices stay fixed');assert.equal(stamp(rear.matrixWorld.toArray()),rearFrame);assert.equal(physical(u,excluded),fixed,'all other physical meshes/attributes/indices/world frames stay fixed');assert.equal(frames(u),ports);
  for(const [key,h] of Object.entries(otherAttrs))assert.equal(hash(g.attributes[key].array),h);
  for(let j=0;j<p.count;j++)if(!allMask.has(j))for(let k=0;k<3;k++){assert.equal(p.array[j*3+k],restP[j*3+k],'unweighted rear position fixed');assert.equal(n.array[j*3+k],restN[j*3+k],'unweighted rear normal fixed');}
  for(const c of controls){
   const d=c.getActuationState().depthMm,b=a.buttons[c.id];assert.equal(stamp(c.object3d.matrixWorld.toArray()),componentFrames.get(c));
   near(c.cap.position.x,-c.sign*d,'only real cap input proxy follows own depth');assert.equal(c.cap.position.y,0);assert.equal(c.cap.position.z,0);
   near(c.follower.position.x,c.followerRest-c.sign*d*.93,'only own real switch follower moves');assert.equal(geomFixed(c.follower),followerFixed.get(c).geometry);assert.equal(localFixed(c.follower),followerFixed.get(c).local);
   assert.equal(geomFixed(b.hit),proxyFixed.get(c).geometry);assert.equal(stamp({position:b.hit.position.toArray(),quaternion:b.hit.quaternion.toArray(),scale:b.hit.scale.toArray()}),proxyFixed.get(c).local);
   for(const j of c.affectedIndices){
    const k=j*3;near(p.array[k],restP[k]-c.sign*d*c.weights[j],'only own listed native X coordinates deform');assert.equal(p.array[k+1],restP[k+1]);assert.equal(p.array[k+2],restP[k+2]);
    let nx=restN[k],ny=restN[k+1],nz=restN[k+2];if(d){nz+=c.sign*d*c.slopes[j]*nx;const length=Math.hypot(nx,ny,nz);nx/=length;ny/=length;nz/=length;}
    near(n.array[k],nx,'native normal X follows actual flexure');near(n.array[k+1],ny,'native normal Y follows actual flexure');near(n.array[k+2],nz,'native normal Z follows actual flexure');
   }
  }
 }
 function settled(){tick(host);for(const c of controls)assert.equal(c.getActuationState().settled,true);verifyMotion();}
 function neutral(){for(const c of controls){assert.equal(c.pressed,false);assert.equal(c.getActuationState().depthMm,0);}assert.equal(hash(p.array),restPH);assert.equal(hash(n.array),restNH);assert.equal(hash(g.index.array),restIH);assert.equal(physical(u),rest);assert.equal(frames(u),ports);}
 function held(c){assert.equal(c.pressed,true);assert.equal(c.getActuationState().depthMm,.22);}
 function eventSequence(start,id,actions,cancelled=false){const list=events.slice(start);assert.deepEqual(list.map(e=>e.action),actions);assert.ok(list.every(e=>e.kind==='button'&&e.id===target(prefix,id)));if(cancelled){const up=list.find(e=>e.action==='up');assert.equal(up?.cancelled,true);assert.ok(!list.some(e=>e.action==='click'));}}
 function maskShape(c){const indices=c.affectedIndices,positions=new Float32Array(indices.length*3),normals=new Float32Array(positions.length);indices.forEach((j,i)=>{for(let k=0;k<3;k++){positions[i*3+k]=p.array[j*3+k];normals[i*3+k]=n.array[j*3+k];}});return stamp({positions:hash(positions),normals:hash(normals),follower:physical(c.follower),proxy:physical(c.cap)});}
 neutral();const receipts=[];
 for(const [i,c] of controls.entries()){
  const peer=controls[1-i],peerShape=maskShape(peer),pointerId=141+i,source=`fixture:unitv:${c.id}:external`;let start=events.length;
  c.onPointerDown({pointerId});host.handle({type:'button',target:target(prefix,c.id),action:'press',source});settled();held(c);assert.equal(peer.pressed,false);assert.equal(maskShape(peer),peerShape);
  const count=events.length;c.cancel('fixture:unitv:unheld');assert.equal(events.length,count);held(c);
  c.onPointerUp({pointerId});settled();held(c);assert.equal(events.length,start+1,'releasing one of two sources cannot emit up');
  host.handle({type:'button',target:target(prefix,c.id),action:'release',source});settled();eventSequence(start,c.id,['down','up','click']);neutral();assert.equal(maskShape(peer),peerShape);
  start=events.length;host.handle({type:'button',target:target(prefix,c.id),action:'press',source});c.onPointerDown({pointerId});settled();held(c);
  host.handle({type:'button',target:target(prefix,c.id),action:'cancel',source});settled();held(c);assert.equal(events.length,start+1);
  c.onPointerCancel({pointerId});settled();eventSequence(start,c.id,['down','up'],true);neutral();assert.equal(maskShape(peer),peerShape);
  receipts.push({id:c.id,nativeVertices:98,multiSourceRelease:'last source',pointerExternalCancel:'neutral/no click',indexAndOtherNativeVertices:'fixed',neutralPositionsAndNormals:'restored'});
 }
 const [A,B]=controls,startDual=events.length;A.onPointerDown({pointerId:151});host.handle({type:'button',target:target(prefix,'buttonB'),action:'press',source:'fixture:unitv:dual:B'});settled();held(A);held(B);const bHeld=maskShape(B);
 A.onPointerUp({pointerId:151});settled();assert.equal(A.pressed,false);held(B);assert.equal(maskShape(B),bHeld,'releasing A cannot reset any held B geometry/normal/follower/proxy');
 host.handle({type:'button',target:target(prefix,'buttonA'),action:'press',source:'fixture:unitv:dual:A'});settled();held(A);held(B);const aHeld=maskShape(A);
 host.handle({type:'button',target:target(prefix,'buttonB'),action:'cancel',source:'fixture:unitv:dual:B'});settled();held(A);assert.equal(B.pressed,false);assert.equal(maskShape(A),aHeld,'cancelling B cannot reset any held A geometry/normal/follower/proxy');
 host.handle({type:'button',target:target(prefix,'buttonA'),action:'release',source:'fixture:unitv:dual:A'});settled();neutral();
 const dual=events.slice(startDual);assert.deepEqual(dual.map(e=>[e.id,e.action]),[[target(prefix,'buttonA'),'down'],[target(prefix,'buttonB'),'down'],[target(prefix,'buttonA'),'up'],[target(prefix,'buttonA'),'click'],[target(prefix,'buttonA'),'down'],[target(prefix,'buttonB'),'up'],[target(prefix,'buttonA'),'up'],[target(prefix,'buttonA'),'click']]);assert.equal(dual.find(e=>e.id===target(prefix,'buttonB')&&e.action==='up')?.cancelled,true);
 const rgb=u.get('rgb'),rgbState=rgb.getState(),beforeRgb=events.length;assert.ok(a.indicator.rgb===rgb);assert.ok(a.indicator.pipe===rgb.lens);assert.ok(under(a.indicator.pipe,rgb.object3d));
 host.handle({type:'led',target:target(prefix,'rgb'),color:'#319aff',brightness:.43});assert.deepEqual(rgb.getState(),{color:'#319aff',brightness:.43});assert.ok(a.indicator.pipe.material.emissive.getHex()>0);assert.equal(events.length,beforeRgb);assert.equal(physical(u),rest);assert.equal(frames(u),ports);
 host.handle({type:'led',target:target(prefix,'rgb'),color:rgbState.color,brightness:rgbState.brightness});assert.deepEqual(rgb.getState(),rgbState);assert.equal(events.length,beforeRgb);neutral();
 for(const type of['capture','camera','inference','storage'])assert.throws(()=>host.handle({type,target:target(prefix,'camera'),value:1}));assert.deepEqual(u.get('camera').getState(),{});assert.equal(events.length,beforeRgb);neutral();
 class WrongUnitVGrove extends Module{static meta={id:'fixture.unitv.wrong-grove',name:'Incompatible Grove accessory',connector:'grove'};build(){}}
 const wrong=new WrongUnitVGrove();assert.equal(u.get('grove').accepts(wrong),true);const rejected=[];
 try{for(const id of['usb','sd']){const port=u.get(id),occupied=port.module,visible=port.highlightMesh.visible,before=events.length,shape=physical(u),framesBefore=frames(u);assert.equal(port.accepts(wrong),false);assert.throws(()=>host.handle({type:'attach',target:target(prefix,id),module:wrong}));assert.ok(port.module===occupied);assert.ok(wrong.attachedTo===null&&wrong.parentHost===null);assert.equal(port.highlightMesh.visible,visible);assert.equal(events.length,before);assert.equal(physical(u),shape);assert.equal(frames(u),framesBefore);rejected.push(id);}}finally{wrong.dispose();}
 neutral();return{id:'unitv-ov7740',ownComponents:7,ports:['grove','usb','sd'],nativeRestFaces:7056,controls:receipts,disjointNativeVertices:196,simultaneousReleaseCancel:'independent',rgb:'noecho/fixed physical',camera:'passive/empty state',rejectsGrove:rejected,initialAssemblyRestored:true};
}

import * as THREE from 'three';

const STEP=Math.PI/8;
function rayAt(selector,pointerId,angle){
 world(selector.object3d);
 const hit=selector.object3d.localToWorld(new THREE.Vector3(1.4*Math.cos(angle),1.4*Math.sin(angle),0));
 const normal=new THREE.Vector3(0,0,1).transformDirection(selector.object3d.matrixWorld);
 return{pointerId,intersection:null,uv:null,point:null,ray:new THREE.Ray(hit.clone().addScaledVector(normal,20),normal.clone().negate()),event:{}};
}
function movingMeshes(rotor){const out=[];rotor.traverse(o=>{if(o.isMesh&&o.userData.role!=='printed-artwork'&&o.material.opacity!==0)out.push(o);});return out;}

/** Own U222 stable physical switch; caller supplies non-port intent events. */
export function checkServosSelector(host,u,prefix,events){
 u.root;u.update(0);assert.ok(Array.isArray(events));
 const ids=['grove','grove-b','dc',...Array.from({length:8},(_,i)=>'ch'+i)],bodyOrder=[...ids,'selector'];
 assert.deepEqual([...u.components.keys()].filter(id=>!['unitFrame','cable'].includes(id)),bodyOrder);
 assert.deepEqual(own(u,'port').map(c=>c.id),ids);assert.equal(own(u,'port').length,11);
 assert.deepEqual(own(u,'rotary-selector').map(c=>c.id),['selector']);
 for(const kind of['button','joint','led','display','sensor','imu','component'])assert.equal(own(u,kind).length,0,'own U222 has no invented button/shaft/LED/sensor state');
 assert.equal(u.get('grove').connector,'grove');assert.equal(u.get('grove-b').connector,'grove');assert.equal(u.get('dc').connector,'dc-5.5x2.1');
 for(const id of['grove','grove-b'])assert.deepEqual(u.get(id).pins.map(p=>p.name),['GND','5V','SDA','SCL']);
 for(let i=0;i<8;i++){
  const p=u.get('ch'+i);assert.equal(p.connector,'servo-2.54-3');assert.equal(p.meta.physicalConnector,'male');assert.deepEqual(p.pins.map(v=>v.name),['GND','5V','SIG']);
  const outward=new THREE.Vector3(0,1,0).applyQuaternion(p.object3d.quaternion);assert.ok(outward.distanceTo(new THREE.Vector3(0,0,1))<1e-10,'actual male row mates towards front +Z');
 }
 const a=u.eightServos2Assembly,c=u.get('selector');assert.equal(c.kind,'rotary-selector');assert.equal(c.interactive,true);assert.ok(c===a.rotary.control);
 assert.equal(a.headers.stems.length,24);assert.equal(a.headers.tips.length,24);assert.equal(a.headers.carriers.length,4);assert.equal(a.headers.ports.length,8);
 const rotor=a.rotary.rotor,moving=movingMeshes(rotor),expected=[a.rotary.lower,...a.rotary.upper,a.rotary.arrow];assert.equal(moving.length,4);assert.equal(expected.length,4);assert.equal(new Set(expected).size,4);assert.ok(expected.every(o=>moving.includes(o)&&under(o,rotor)));
 const fixed=[a.rotary.fixed,a.rotary.base,a.rotary.scale,...a.rotary.retainers,...a.rotary.teeth,...a.rotary.pins,a.board.board,...a.headers.stems,...a.headers.tips,...a.headers.carriers,...ids.map(id=>u.get(id).object3d)];
 assert.ok(fixed.every(o=>!under(o,rotor)),'case, PCB, fixed switch carrier, solderpins and actual connector posts/frames are outside moving rotor');
 const original=c.getState().position,completeInitial=physical(u),portInitial=frames(u),eventInitial=events.length;
 let detents=0,pointerChanges=0,rejections=0;
 try{
  c.setPosition(0);const zero=physical(u),rotorZero=physical(rotor),movingZero=moving.map(o=>physical(o)),fixedBody=physical(u,[rotor]),fixedKnown=stamp(fixed.flatMap(o=>records(o)));
  for(let n=0;n<16;n++){
   const before=events.length,result=host.handle({type:'selector',target:target(prefix,'selector'),position:n});assert.deepEqual(result,{position:n,positions:16});assert.deepEqual(c.getState(),{position:n,positions:16});assert.equal(events.length,before,'external detent command must not synthesize input');
   assert.ok(Math.abs(rotor.rotation.z+n*STEP)<1e-12);assert.equal(physical(u,[rotor]),fixedBody);assert.equal(stamp(fixed.flatMap(o=>records(o))),fixedKnown);assert.equal(frames(u),portInitial);
   for(let i=0;i<moving.length;i++){if(n===0)assert.equal(physical(moving[i]),movingZero[i]);else assert.notEqual(physical(moving[i]),movingZero[i],'every actual head/floor/slot/pointer mesh follows the physical rotor');}
   if(n===0)assert.equal(physical(rotor),rotorZero);else assert.notEqual(physical(rotor),rotorZero);detents++;
  }
  assert.equal(events.length,eventInitial,'all16 external positions are noecho');
  const invalid=[-1,16,.5,NaN,Infinity,-Infinity,'3',null,undefined,{},[]];
  for(const value of invalid){const state=c.getState(),shape=physical(u),ports=frames(u),n=events.length;assert.throws(()=>c.setPosition(value));assert.deepEqual(c.getState(),state);assert.equal(physical(u),shape);assert.equal(frames(u),ports);assert.equal(events.length,n);}
  for(const value of invalid){const state=c.getState(),shape=physical(u),n=events.length;assert.throws(()=>host.handle({type:'selector',target:target(prefix,'selector'),position:value}));assert.deepEqual(c.getState(),state);assert.equal(physical(u),shape);assert.equal(events.length,n);}
  c.setPosition(0);assert.equal(physical(u),zero,'complete real geometry returns exactly to zero');assert.equal(physical(rotor),rotorZero);
  // Real world rays, captured outside the hit mesh, including -pi/+pi crossing.
  c.setPosition(15);let before=events.length;
  c.onPointerDown(rayAt(c,221,-Math.PI+STEP/2));c.onPointerDown(rayAt(c,222,0));
  c.onPointerMove(rayAt(c,222,-STEP*4));c.onPointerUp({pointerId:222});c.onPointerCancel({pointerId:222});assert.equal(c.getState().position,15);assert.equal(events.length,before,'foreign pointer does not alter or end owning drag');
  c.onPointerMove(rayAt(c,221,Math.PI-STEP/2));assert.equal(c.getState().position,0,'crossing atan2 boundary gives one clockwise detent and wraps15to0');
  assert.equal(events.length,before+1);assert.equal(events.at(-1).kind,'rotary-selector');assert.equal(events.at(-1).id,target(prefix,'selector'));assert.equal(events.at(-1).action,'change');assert.equal(events.at(-1).position,0);assert.equal(events.at(-1).previousPosition,15);assert.equal(events.at(-1).delta,1);assert.equal(events.at(-1).source,'pointer');
  c.onPointerMove(rayAt(c,221,Math.PI-STEP*1.5));assert.equal(c.getState().position,1);assert.equal(events.at(-1).delta,1);assert.equal(physical(u,[rotor]),fixedBody);assert.equal(stamp(fixed.flatMap(o=>records(o))),fixedKnown);assert.equal(frames(u),portInitial);
  c.onPointerCancel({pointerId:221});const cancelled=c.getState().position,nCancel=events.length;c.onPointerMove(rayAt(c,221,0));assert.equal(c.getState().position,cancelled);assert.equal(events.length,nCancel,'cancel retains selected detent and releases capture');
  c.setPosition(0);c.onPointerDown(rayAt(c,223,Math.PI/2));c.onPointerMove(rayAt(c,223,Math.PI/2+STEP));assert.equal(c.getState().position,15,'counterclockwise physical0to15wrap');c.onPointerUp({pointerId:223});const released=c.getState().position,nRelease=events.length;c.onPointerMove(rayAt(c,223,0));assert.equal(c.getState().position,released);assert.equal(events.length,nRelease,'release retains selected detent');
  // Invalid external input is atomic even while a real pointer owns a drag.
  c.setPosition(7);c.onPointerDown(rayAt(c,224,Math.PI/2));const drag=c._drag,heldState=c.getState(),heldShape=physical(u),nHeld=events.length;assert.ok(drag);assert.throws(()=>c.setPosition(7.25));assert.ok(c._drag===drag);assert.deepEqual(c.getState(),heldState);assert.equal(physical(u),heldShape);assert.equal(events.length,nHeld);
  const driven=host.handle({type:'selector',target:target(prefix,'selector'),position:11});assert.deepEqual(driven,{position:11,positions:16});assert.equal(c._drag,null);assert.equal(events.length,nHeld,'external during drag is noecho');c.onPointerMove(rayAt(c,224,0));c.onPointerUp({pointerId:224});assert.equal(c.getState().position,11,'old captured move cannot overwrite external detent');assert.equal(events.length,nHeld);
  pointerChanges=events.length-before;assert.equal(pointerChanges,3);assert.equal(physical(u,[rotor]),fixedBody);assert.equal(stamp(fixed.flatMap(o=>records(o))),fixedKnown);assert.equal(frames(u),portInitial);
  // Incompatible families cannot displace a real current occupant on any of11ports.
  class WrongGrove extends Module{static meta={id:'fixture.servos.wrong-grove',name:'Incompatible Grove plug',connector:'grove'};build(){}}
  class WrongServo extends Module{static meta={id:'fixture.servos.wrong-servo',name:'Incompatible servo plug',connector:'servo-2.54-3'};build(){}}
  const wrongGrove=new WrongGrove(),wrongServo=new WrongServo();
  try{
   for(const id of ids){const p=u.get(id),wrong=p.connector==='grove'?wrongServo:wrongGrove,occupant=p.module,shape=physical(u),ports=frames(u),n=events.length;assert.equal(p.accepts(wrong),false);assert.throws(()=>p.attach(wrong));assert.ok(p.module===occupant);assert.ok(!wrong.attachedTo);assert.equal(physical(u),shape,'incompatible family preserves complete existing scene');assert.equal(frames(u),ports);assert.equal(events.length,n);rejections++;}
  }finally{wrongGrove.dispose();wrongServo.dispose();}
 }finally{c.setPosition(original);}
 assert.deepEqual(c.getState(),{position:original,positions:16});assert.equal(physical(u),completeInitial,'named preset and entire original assembly restored');assert.equal(frames(u),portInitial);
 return{id:'8servos2-i2c',ports:ids,portCount:11,selector:{kind:'rotary-selector',stableDetents:detents,movingMeshes:4,fixedBodyAndPinsAndPorts:'unchanged',external:'noecho',invalid:'atomic',pointer:'worldray/atan2boundary/mod16',foreignPointer:'ignored',cancelAndRelease:'retains detent',externalDuringDrag:'clears capture;old move ignored',pointerChanges},wrongFamilyRejections:rejections,initialAssemblyRestored:true};
}
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {loadModel,loadGroveModule} from '../src/loaders.js';
const ids=['unitv-ov7740','lora-e220-433','8servos2-i2c'];
const artworkKinds={
 'unitv-ov7740':['official-flat-raster'],
 'lora-e220-433':['reference-redraw','reference-redraw','reference-redraw'],
 '8servos2-i2c':['source-vector-raster','source-vector-raster','official-photo-code-redraw'],
};
function componentBoundary(u,id){
 u.root;const order=[...u.components.keys()].filter(k=>!['unitFrame','cable'].includes(k));
 const expected={
  'unitv-ov7740':['grove','usb','sd','buttonA','buttonB','camera','rgb'],
  'lora-e220-433':['grove','sma','m0','m1'],
  '8servos2-i2c':['grove','grove-b','dc',...Array.from({length:8},(_,i)=>`ch${i}`),'selector'],
 };
 assert.deepEqual(order,expected[id]);for(const kind of['sensor','display','speaker','joint'])assert.equal(own(u,kind).length,0);
 if(id!=='unitv-ov7740')assert.equal(own(u,'led').length,0);
 if(id==='unitv-ov7740')assert.deepEqual(u.get('camera').getState(),{});
 if(id==='lora-e220-433')for(const k of['m0','m1'])assert.equal(u.get(k).isLatching,true);
 if(id==='8servos2-i2c')assert.equal(u.get('selector').kind,'rotary-selector');
 return{id,components:order,ports:own(u,'port').map(p=>p.id),passiveState:'no synthetic firmware state'};
}
function setUnitVHeld(u,held){
 for(const id of['buttonA','buttonB'])if(held.includes(id))u.get(id).press('fixture:artwork');else u.get(id).release('fixture:artwork');
 tick(u);world(u);
}
function watchResources(root){
 const resources=new Set(),disposed=new Set();root.traverse(o=>{if(o.geometry)resources.add(o.geometry);for(const m of[].concat(o.material??[])){resources.add(m);for(const t of Object.values(m))if(t?.isTexture)resources.add(t);}});
 for(const r of resources)r.addEventListener('dispose',()=>disposed.add(r));return()=>{assert.equal(disposed.size,resources.size,'all observed attached resources must be disposed');return resources.size;};
}

/** Current own-model integration fixture; no browser or GPU work. */
export async function checkUnitVLora433Servos2Units(){
 const restore=installCanvasStub();let host;
 try{
  const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
  host=await loadModel('sticks3');host.root;host.display().fill('#123456');
  const framebuffer=hash(host.display().buffer),hub=await loadGroveModule('hub');host.port('grove').attach(hub);
  const units={},events=[],components=[],artwork=[],configurations=[],motions=[];host.on('input',e=>{if(e.kind!=='port')events.push(e);});
  for(const[i,id]of ids.entries()){
   const u=await loadGroveModule(id,{cableLength:75+i*15});hub.port(`grove-${i+1}`).attach(u);units[id]=u;host.update(0);
   assert.equal(u.get('cable').getState().wireCount,4);components.push(componentBoundary(u,id));
   const p=catalog.products.find(p=>p.id===id),cases=[{},...p.configurations.map(c=>c.options)];
   if(id==='8servos2-i2c')for(let position=0;position<16;position++)cases.push({selectorPosition:position});
   const seen=new Set();let states=0;
   for(const options of cases){
    const key=JSON.stringify(Object.fromEntries(Object.entries(options).sort(([a],[b])=>a.localeCompare(b))));if(seen.has(key))continue;seen.add(key);
    for(const load of[loadModel,loadGroveModule]){
     const on=await load(id,options),off=await load(id,{...options,artwork:false});
     try{
      on.root;off.root;on.update(0);off.update(0);componentBoundary(on,id);componentBoundary(off,id);
      const statesToCheck=id==='unitv-ov7740'?[[],['buttonA'],['buttonA','buttonB'],['buttonB'],[]]:[null];
      for(const held of statesToCheck){
       if(held){setUnitVHeld(on,held);setUnitVHeld(off,held);}
       assert.equal(physical(on),physical(off),'artwork removal must preserve every physical attribute/index/world frame');assert.equal(frames(on),frames(off));assert.equal(panels(off).length,0);states++;
      }
      const kinds=panels(on).map(o=>o.userData.artworkKind).sort();assert.deepEqual(kinds,[...artworkKinds[id]].sort());
      if(id==='lora-e220-433'){assert.equal(on.get('m0').position,options.m0Position??0);assert.equal(on.get('m1').position,options.m1Position??0);assert.equal(Boolean(on.get('sma').module),options.antenna??false);}
      if(id==='8servos2-i2c')assert.equal(on.get('selector').getState().position,options.selectorPosition??0);
      if(load===loadModel&&key==='{}')artwork.push({id,panels:kinds.length,kinds});
     }finally{on.dispose();off.dispose();}
    }
   }
   configurations.push({id,optionCases:seen.size,entries:2,physicalStateComparisons:states});
  }
  const prefix=i=>`grove/grove-${i+1}`;
  motions.push(checkUnitVNative(host,units[ids[0]],prefix(0),events));
  motions.push(checkLoRa433(host,units[ids[1]],prefix(1),events));
  motions.push(checkServosSelector(host,units[ids[2]],prefix(2),events));
  for(const[i,id]of ids.entries()){
   const u=units[id],before=physical(u),n=events.length;
   host.handle({type:'pose',target:target(prefix(i),'unitFrame'),position:[i*55,195+i*15,8],rotation:[.1,-.2,.15]});
   host.handle({type:'cable',target:target(prefix(i),'cable'),slack:12,bend:[0,0,-1]});host.update(0);
   assert.notEqual(physical(u),before);assert.equal(u.get('cable').getState().wireCount,4);assert.equal(events.length,n);
  }
  // Re-run real motion under nontrivial ancestors; no local-space-only hit fiction.
  motions.push(checkUnitVNative(host,units[ids[0]],prefix(0),events));
  motions.push(checkLoRa433(host,units[ids[1]],prefix(1),events));
  motions.push(checkServosSelector(host,units[ids[2]],prefix(2),events));
  const servos=units[ids[2]],key=await loadGroveModule('key',{cableLength:55}),chain=servos.get('grove-b'),beforeChain=physical(servos),chainFrames=frames(servos),n=events.length;
  chain.attach(key);host.update(0);assert.ok(chain.module===key);assert.equal(key.get('cable').getState().wireCount,4);assert.equal(frames(servos),chainFrames);assert.equal(events.length,n);
  const peers=ids.slice(0,2).map(id=>physical(units[id]));
  host.handle({type:'button',target:'grove/grove-3/grove-b/press',action:'press',source:'fixture:chain'});tick(host);assert.equal(key.get('press').pressed,true);
  host.handle({type:'button',target:'grove/grove-3/grove-b/press',action:'cancel',source:'fixture:chain'});tick(host);assert.equal(key.get('press').pressed,false);assert.equal(key.get('press').getActuationState().depthMm,0);
  assert.deepEqual(ids.slice(0,2).map(id=>physical(units[id])),peers);assert.equal(frames(servos),chainFrames);assert.ok(host.get('grove/grove-3/grove-b/press')===key.get('press'));
  const beforeSelector=physical(key),selectorEvents=events.length;host.handle({type:'selector',target:'grove/grove-3/selector',position:15});assert.equal(physical(key),beforeSelector);assert.equal(events.length,selectorEvents);host.handle({type:'selector',target:'grove/grove-3/selector',position:0});
  roundtrip(servos,chain);chain.detach();host.update(0);assert.equal(physical(servos),beforeChain);assert.deepEqual(ids.slice(0,2).map(id=>physical(units[id])),peers);
  // Observe retained resources before branch detachment/disposal.
  const disposal=watchResources(host.root);
  for(const[i,id]of ids.entries()){
   const peerIds=ids.filter(x=>x!==id),before=peerIds.map(x=>physical(units[x])),p=hub.port(`grove-${i+1}`),part=p.detach({dispose:false});
   assert.ok(part===units[id]);assert.deepEqual(peerIds.map(x=>physical(units[x])),before);p.attach(part);host.update(0);assert.equal(part.get('cable').getState().wireCount,4);
  }
  const retained=ids.slice(0,2).map(id=>physical(units[id]));hub.port('grove-3').detach();assert.deepEqual(ids.slice(0,2).map(id=>physical(units[id])),retained);
  assert.equal(hash(host.display().buffer),framebuffer);host.dispose();host=null;const disposedResources=disposal();
  return{status:'pass',artwork,components,motions,configurations,disposedResources,cases:['three-real-four-core-Grove-branches','two-native-independent-flexures-A-AB-B-neutral-and-multi-source-release-cancel','two-real-stable-independent-DIP-sliders-and-static-ordinary-SMA-accessory','real-sixteen-detent-rotary-selector-ray-drag-and-external-noecho','all-actual-configurations-both-entries-and-pressed-states-artwork-physical-invariance','transformed-ancestors-peer-isolation-independent-detach','actual-second-Grove-four-core-Key-chain-routes-input-intent-only','host-framebuffer-and-observed-resource-disposal'],scope:'Current three own physical assemblies, print and visual kinematics only;Node canvas stub;no browser/GPU,manufacturing,production fit,physical hardware,camera/RF/PWM/electrical/firmware or whole-history acceptance'};
 }finally{host?.dispose();restore();}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkUnitVLora433Servos2Units(),null,2));
