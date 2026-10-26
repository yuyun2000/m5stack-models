import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const ids=['unitv2','lorawan-cn470','proto'];
const digest=v=>createHash('sha256').update(v).digest('hex');
const hash=a=>digest(Buffer.from(a.buffer,a.byteOffset,a.byteLength));
const own=(u,kind)=>[...u.components.values()].filter(c=>c.kind===kind);
const stamp=v=>digest(JSON.stringify(v));
function world(o){let r=o;while(r.parent)r=r.parent;r.updateMatrixWorld(true);}
function under(o,parent){for(;o;o=o.parent)if(o===parent)return true;return false;}
function attrs(o){return Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,v])=>[k,hash(v.array)]));}
function physical(u,excluded=[]){world(u.root);const out=[];u.root.traverse(o=>{if(o.isMesh&&o.userData.role!=='printed-artwork'&&!excluded.some(p=>p&&under(o,p)))out.push({name:o.name,attributes:attrs(o),index:o.geometry.index?hash(o.geometry.index.array):null,matrix:o.matrixWorld.toArray()});});return stamp(out);}
function frames(u){world(u.root);return stamp(own(u,'port').map(c=>({id:c.id,matrix:c.object3d.matrixWorld.toArray()})));}
function panels(u){const out=[];u.root.traverse(o=>{if(o.userData.role==='printed-artwork')out.push(o);});return out;}
function tick(host,n=30){for(let i=0;i<n;i++)host.update(1/60);}
function roundtrip(u,port){const item=port.module;assert.ok(item);const rest=physical(u),frame=frames(u);assert.ok(port.detach({dispose:false})===item);assert.equal(frames(u),frame);port.attach(item);assert.equal(physical(u),rest);return item;}

function nativeUser(host,u,prefix,events){
 const b=u.get('user'),shell=b.shell;assert.ok(shell?.isMesh);assert.equal(b.isLatching,false);assert.ok(b.travel>0);
 const positions=shell.geometry.attributes.position.array.slice(),normals=hash(shell.geometry.attributes.normal.array),index=shell.geometry.index?hash(shell.geometry.index.array):null;
 const follower=b.follower;assert.ok(follower?.isMesh,'actual retained switch plunger');const followerRest=follower.position.clone();
 const rest=physical(u),fixed=physical(u,[shell,b.cap,follower]),ports=frames(u),lights=own(u,'led').map(l=>l.getState());
 const start=events.length,source='key:fixture/unitv2';b.onPointerDown({pointerId:34});b.press(source);tick(host);world(u.root);
 assert.ok(b.getActuationState().depthMm>0);assert.notEqual(hash(shell.geometry.attributes.position.array),hash(positions));
 assert.equal(shell.geometry.index?hash(shell.geometry.index.array):null,index);
 for(let i=0;i<b.weights.length;i++)if(!b.weights[i])for(let j=0;j<3;j++)assert.equal(shell.geometry.attributes.position.array[i*3+j],positions[i*3+j]);
 assert.equal(follower.position.y,followerRest.y-b.getActuationState().depthMm);assert.equal(follower.position.x,followerRest.x);assert.equal(follower.position.z,followerRest.z);
 assert.equal(physical(u,[shell,b.cap,follower]),fixed);assert.equal(frames(u),ports);
 b.onPointerUp({pointerId:34});tick(host);assert.equal(b.getState().pressed,true);
 host.handle({type:'button',target:prefix+'/user',action:'release',source});tick(host);
 assert.equal(b.getActuationState().depthMm,0);assert.equal(physical(u),rest);assert.equal(hash(shell.geometry.attributes.normal.array),normals);
 assert.deepEqual(events.slice(start).map(e=>e.action),['down','up','click']);
 const cancel=events.length;host.handle({type:'button',target:prefix+'/user',action:'press',source:'cancel'});tick(host);host.handle({type:'button',target:prefix+'/user',action:'cancel',source:'cancel'});tick(host);
 assert.deepEqual(events.slice(cancel).map(e=>e.action),['down','up']);assert.equal(events.at(-1).cancelled,true);assert.equal(physical(u),rest);assert.equal(hash(shell.geometry.attributes.normal.array),normals);assert.deepEqual(own(u,'led').map(l=>l.getState()),lights);
}
function lights(host,u,prefix,events){
 const rest=physical(u);for(const lamp of own(u,'led')){const start=events.length,others=own(u,'led').filter(c=>c!==lamp).map(c=>[c,c.getState()]);host.handle({type:'led',target:prefix+'/'+lamp.id,brightness:.4});assert.equal(lamp.getState().brightness,.4);assert.ok(others.every(([c,s])=>JSON.stringify(c.getState())===JSON.stringify(s)));assert.equal(physical(u),rest);assert.equal(events.length,start);lamp.set({on:false});}
}
function finiteJoint(host,u,joint,prefix,events){
 const initial=joint.getState().angleDeg,range=joint.getState().rangeDeg;assert.ok(range?.length===2);assert.equal(joint.getState().continuous,false);
 const target=range[1]===initial?range[0]:range[1],rest=physical(u),fixed=physical(u,[joint.object3d]),start=events.length;
 host.handle({type:'joint',target:prefix,angleDeg:target,durationMs:250});host.update(1/60);assert.ok(joint.getState().transitioning);assert.notEqual(joint.getState().angleDeg,initial);assert.notEqual(joint.getState().angleDeg,target);tick(host);
 assert.equal(joint.getState().angleDeg,target);assert.notEqual(physical(u),rest);assert.equal(physical(u,[joint.object3d]),fixed);assert.equal(events.length,start);
 const valid=physical(u);for(const bad of [{angleDeg:range[0]-.01},{angleDeg:range[1]+.01},{rpm:1}]){assert.throws(()=>joint.set(bad));assert.equal(physical(u),valid);}
 joint.set({angleDeg:initial});assert.equal(physical(u),rest);
}

/** Necessary actual three-product construction/API fixture; canvas is stubbed. */
export async function checkUnitv2LorawanProtoUnits(){
 const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
 const {Stand,BackBrick,UsbCable}=await import('../src/units/unitv2/index.js');
 const {Antenna}=await import('../src/units/lorawan-cn470/index.js');
 const {LoraAntenna:RpSmaAntenna}=await import('../src/units/c6l/index.js');
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop}),ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
 let host,stand,brick,wrong,wrongSma,service;
 try{
  host=await loadModel('sticks3');host.display().fill('#123456');const framebuffer=hash(host.display().buffer),hub=await loadGroveModule('hub');host.port('grove').attach(hub);
  const units={},events=[],artwork=[];host.on('input',e=>{if(e.kind!=='port')events.push(e);});
  for(const[i,id]of ids.entries()){
   const options=id==='lorawan-cn470'?{antenna:true}:{},u=await loadGroveModule(id,{...options,cableLength:70+i*15});hub.port('grove-'+(i+1)).attach(u);units[id]=u;
   assert.equal(u.get('cable').getState().wireCount,4);assert.equal(own(u,'display').length,0);assert.equal(own(u,'speaker').length,0);
   assert.deepEqual(own(u,'port').map(p=>p.id).sort(),id==='unitv2'?['grove','mount','sd','usb']:id==='lorawan-cn470'?['grove','sma']:['grove']);
   assert.deepEqual(own(u,'button').map(c=>c.id),id==='unitv2'?['user']:[]);assert.deepEqual(own(u,'led').map(c=>c.id).sort(),id==='unitv2'?['red','white']:[]);assert.deepEqual(own(u,'joint').map(c=>c.id),id==='unitv2'?['fan']:[]);
   const configs=[{},...(catalog.products.find(p=>p.id===id)?.configurations??[]).map(c=>c.options)];
   if(id==='unitv2')for(const card of [false,true])for(const usbCable of [false,true])for(const mount of ['none','stand','brick'])configs.push({card,usbCable,mount});
   if(id==='lorawan-cn470')configs.push({antenna:false},{antenna:true,antennaAngleDeg:0},{antenna:true,antennaAngleDeg:90});
   if(id==='proto')configs.push({rearCover:true},{rearCover:false});
   const seen=new Set();for(const config of configs){const key=JSON.stringify(config);if(seen.has(key))continue;seen.add(key);for(const load of [loadModel,loadGroveModule]){const on=await load(id,config),off=await load(id,{...config,artwork:false});try{assert.equal(physical(on),physical(off),'all physical attributes/index/world invariant without ink');assert.equal(panels(off).length,0);for(const p of panels(on))assert.ok(['reference-redraw','reference-redraw-raster','official-photo-code-redraw'].includes(p.userData.artworkKind));if(load===loadModel&&key==='{}')artwork.push({id,panels:panels(on).length,kinds:[...new Set(panels(on).map(p=>p.userData.artworkKind))]});}finally{on.dispose();off.dispose();}}}
  }
  const camera=units.unitv2;assert.deepEqual(camera.get('camera').getState(),{});assert.deepEqual(camera.get('microphone').getState(),{});nativeUser(host,camera,'grove/grove-1',events);lights(host,camera,'grove/grove-1',events);
  const fan=camera.get('fan'),fanRest=physical(camera),fanFixed=physical(camera,[fan.object3d]),fanEvents=events.length;assert.equal(fan.getState().continuous,true);assert.equal(fan.getState().rpm,0);host.handle({type:'joint',target:'grove/grove-1/fan',rpm:15});tick(host);assert.notEqual(physical(camera),fanRest);assert.equal(physical(camera,[fan.object3d]),fanFixed);assert.equal(events.length,fanEvents);fan.set({angleDeg:0,rpm:0});assert.equal(physical(camera),fanRest);
  roundtrip(camera,camera.port('sd'));assert.equal(camera.port('usb').module,null);const usb=new UsbCable();camera.port('usb').attach(usb);roundtrip(camera,camera.port('usb'));camera.port('usb').detach();
  stand=new Stand();camera.port('mount').attach(stand);finiteJoint(host,camera,stand.get('tilt'),'grove/grove-1/mount/tilt',events);roundtrip(camera,camera.port('mount'));assert.ok(camera.port('mount').detach({dispose:false})===stand);stand.dispose();stand=null;
  brick=new BackBrick();camera.port('mount').attach(brick);assert.throws(()=>brick.get('tilt'));roundtrip(camera,camera.port('mount'));assert.ok(camera.port('mount').detach({dispose:false})===brick);brick.dispose();brick=null;
  const radio=units['lorawan-cn470'],port=radio.port('sma');if(!port.module)port.attach(new Antenna());const antenna=port.module;finiteJoint(host,radio,antenna.get('tilt'),'grove/grove-2/sma/tilt',events);roundtrip(radio,port);
  wrongSma=new RpSmaAntenna();const radioRest=physical(radio);assert.throws(()=>port.attach(wrongSma));assert.ok(port.module===antenna);assert.equal(physical(radio),radioRest);wrongSma.dispose();wrongSma=null;
  service=await loadModel('proto',{rearCover:false});service.root;const closed=await loadModel('proto',{rearCover:true});try{assert.notEqual(physical(service),physical(closed));assert.deepEqual([...service.components.keys()],['grove']);assert.equal(panels(service).length,0);assert.equal(panels(closed).length,1);}finally{closed.dispose();}
  wrong=await loadGroveModule('key');const cameraRest=physical(camera);for(const id of ['usb','sd','mount']){assert.throws(()=>camera.port(id).attach(wrong));assert.equal(physical(camera),cameraRest);}wrong.dispose();wrong=null;
  for(const[i,id]of ids.entries()){host.handle({type:'pose',target:'grove/grove-'+(i+1)+'/unitFrame',position:[i*55,190+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:'grove/grove-'+(i+1)+'/cable',slack:12,bend:[0,0,-1]});assert.equal(units[id].get('cable').getState().wireCount,4);}assert.equal(hash(host.display().buffer),framebuffer);
  const siblings=[physical(camera),physical(radio)];hub.port('grove-3').detach();assert.deepEqual([physical(camera),physical(radio)],siblings);assert.ok(hub.port('grove-1').module===camera&&hub.port('grove-2').module===radio);
  return {status:'pass',artwork,cases:['three-real-four-core-input-branches','UnitV2-top-native-flexure-multiple-sources-release-cancel-original-normals-fixed-parts','UnitV2-independent-red-white-lamps-camera-microphone-passive-and-no-inputecho','UnitV2-actual-fan-impeller-only-external-rpm-and-exact-return','UnitV2-supplied-card-USB-cable-stand-relative-singleaxis-and-backbrick-independent-attachment','LoRaWAN-CN470-own195mm-ordinary-SMA-antenna-finite-elbow-fixed-coupling-and-RP-SMA-rejection','Proto-real-rear-cover-service-perforated-board-no-invented-controls-values-or-user-circuit','two-entries-all-real-configurations-artwork-preserves-every-physical-attribute-index-world-matrix','external-pose-cable-independent-detach-and-host-framebuffer-preserved'],scope:'Current three actual assemblies and external visuals only; Node canvas stub; no GPU/browser, AI/video, radio/network, USB, electrical, firmware, measured stops, production fit, hardware or whole-catalog acceptance'};
 }finally{wrongSma?.dispose();wrong?.dispose();stand?.dispose();brick?.dispose();service?.dispose();host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkUnitv2LorawanProtoUnits(),null,2));
