import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const ids=['weight','ssr','poe-cam-w-v11'];
const digest=v=>createHash('sha256').update(v).digest('hex');
const hash=a=>digest(Buffer.from(a.buffer,a.byteOffset,a.byteLength));
const stamp=v=>digest(JSON.stringify(v));
const own=(u,k)=>[...u.components.values()].filter(c=>c.kind===k);
function world(o){let r=o;while(r.parent)r=r.parent;r.updateMatrixWorld(true);}
function under(o,parent){for(;o;o=o.parent)if(o===parent)return true;return false;}
function attrs(o){return Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,v])=>[k,hash(v.array)]));}
function physical(u,exclude=[]){world(u.root);const out=[];u.root.traverse(o=>{if(o.isMesh&&o.userData.role!=='printed-artwork'&&!exclude.some(p=>p&&under(o,p)))out.push({name:o.name,attributes:attrs(o),index:o.geometry.index?hash(o.geometry.index.array):null,matrix:o.matrixWorld.toArray()});});return stamp(out);}
function frames(u){world(u.root);return stamp(own(u,'port').map(c=>({id:c.id,matrix:c.object3d.matrixWorld.toArray()})));}
function panels(u){const out=[];u.root.traverse(o=>{if(o.userData.role==='printed-artwork')out.push(o);});return out;}
function tick(h,n=30){for(let i=0;i<n;i++)h.update(1/60);}
function roundtrip(u,p){const item=p.module;assert.ok(item);const rest=physical(u),fixed=frames(u);assert.ok(p.detach({dispose:false})===item);assert.equal(frames(u),fixed);p.attach(item);assert.equal(physical(u),rest);return item;}

function screws(host,u,prefix,events){
 const plug=u.port('terminal').module;assert.ok(plug);assert.deepEqual(own(plug,'joint').map(c=>c.id),['screw-1','screw-2','screw-3','screw-4']);
 const all=own(plug,'joint'),rest=physical(u),fixed=physical(u,all.map(j=>j.object3d)),ports=frames(u),begin=events.length;
 for(const joint of all){
  assert.equal(joint.getState().continuous,false);assert.equal(joint.getState().rangeDeg,null);assert.deepEqual(joint.getState().visualRangeDeg,[-180,180]);
  const original=joint.object3d.quaternion.clone(),others=all.filter(j=>j!==joint).map(j=>[j,j.object3d.quaternion.clone()]);
  host.handle({type:'joint',target:prefix+'/terminal/'+joint.id,angleDeg:35});assert.ok(!joint.object3d.quaternion.equals(original));
  host.handle({type:'joint',target:prefix+'/terminal/'+joint.id,angleDeg:70,durationMs:150});host.update(1/60);assert.ok(joint.getState().angleDeg>35&&joint.getState().angleDeg<70);tick(host);assert.equal(joint.getState().angleDeg,70);
  assert.equal(physical(u,all.map(j=>j.object3d)),fixed);assert.ok(others.every(([j,q])=>j.object3d.quaternion.equals(q)));
  for(const bad of [{rpm:1},{angleDeg:Infinity},{durationMs:-1}]){const state=joint.getState(),shape=physical(u);assert.throws(()=>joint.set(bad));assert.deepEqual(joint.getState(),state);assert.equal(physical(u),shape);}
  joint.set({angleDeg:0});assert.ok(joint.object3d.quaternion.equals(original));assert.equal(physical(u),rest);
 }
 assert.equal(frames(u),ports);assert.equal(events.length,begin);roundtrip(u,u.port('terminal'));
}

function button(host,u,id,prefix,events){
 const b=u.get(id),shell=b.shell,followers=(b.followers??(b.follower?[b.follower]:[])).map(f=>f.mesh??f.object3d??f).filter(f=>f?.isObject3D);
 assert.equal(b.isLatching,false);assert.ok(b.travel>0);const rest=physical(u),fixed=physical(u,[shell,b.cap,...followers]),ports=frames(u),lamps=own(u,'led').map(l=>l.getState());
 const p=shell?.geometry.attributes.position.array.slice(),n=shell?hash(shell.geometry.attributes.normal.array):null,index=shell?.geometry.index?hash(shell.geometry.index.array):null;
 world(u.root);const followerRest=followers.map(f=>[f,f.matrixWorld.clone(),f.isMesh?attrs(f):null]);let visible=0;b.cap.traverse(o=>{if(o.isMesh&&o.material.opacity!==0)visible++;});assert.ok(shell?.isMesh||visible>0,'actual native tongue or real cap required');
 const start=events.length,source='key:fixture/'+id;b.onPointerDown({pointerId:35});b.press(source);tick(host);assert.ok(b.getActuationState().depthMm>0);
 if(shell){assert.notEqual(hash(shell.geometry.attributes.position.array),hash(p));if(b.weights)for(let i=0;i<b.weights.length;i++)if(!b.weights[i])for(let j=0;j<3;j++)assert.equal(shell.geometry.attributes.position.array[i*3+j],p[i*3+j]);assert.equal(shell.geometry.index?hash(shell.geometry.index.array):null,index);}else assert.notEqual(physical(u),rest);
 world(u.root);assert.equal(physical(u,[shell,b.cap,...followers]),fixed);assert.ok(followerRest.every(([f,m,a])=>!f.matrixWorld.equals(m)&&(!a||Object.entries(a).every(([k,v])=>hash(f.geometry.attributes[k].array)===v))));assert.equal(frames(u),ports);
 b.onPointerUp({pointerId:35});tick(host);assert.equal(b.getState().pressed,true);host.handle({type:'button',target:prefix+'/'+id,action:'release',source});tick(host);assert.equal(b.getActuationState().depthMm,0);assert.equal(physical(u),rest);if(shell)assert.equal(hash(shell.geometry.attributes.normal.array),n);assert.ok(followerRest.every(([f,m])=>f.matrixWorld.equals(m)));assert.deepEqual(events.slice(start).map(e=>e.action),['down','up','click']);
 const cancel=events.length;host.handle({type:'button',target:prefix+'/'+id,action:'press',source:'cancel'});tick(host);host.handle({type:'button',target:prefix+'/'+id,action:'cancel',source:'cancel'});tick(host);assert.deepEqual(events.slice(cancel).map(e=>e.action),['down','up']);assert.equal(events.at(-1).cancelled,true);assert.equal(physical(u),rest);if(shell)assert.equal(hash(shell.geometry.attributes.normal.array),n);assert.deepEqual(own(u,'led').map(l=>l.getState()),lamps);
}
function lights(host,u,prefix,events){
 const rest=physical(u);for(const lamp of own(u,'led')){const start=events.length,others=own(u,'led').filter(c=>c!==lamp).map(c=>[c,c.getState()]);host.handle({type:'led',target:prefix+'/'+lamp.id,brightness:.4});assert.equal(lamp.getState().brightness,.4);assert.ok(others.every(([c,s])=>JSON.stringify(c.getState())===JSON.stringify(s)));assert.equal(events.length,start);assert.equal(physical(u),rest);lamp.set({on:false});}
}
function tilt(host,u,joint,prefix,events){
 const original=joint.getState().angleDeg,range=joint.getState().rangeDeg;assert.ok(range?.length===2);assert.equal(joint.getState().continuous,false);const target=range[1]===original?range[0]:range[1],rest=physical(u),fixed=physical(u,[joint.object3d]),start=events.length;
 host.handle({type:'joint',target:prefix,angleDeg:target,durationMs:250});host.update(1/60);assert.ok(joint.getState().transitioning);assert.notEqual(joint.getState().angleDeg,original);assert.notEqual(joint.getState().angleDeg,target);tick(host);assert.equal(joint.getState().angleDeg,target);assert.notEqual(physical(u),rest);assert.equal(physical(u,[joint.object3d]),fixed);assert.equal(events.length,start);
 const valid=physical(u);for(const bad of [{angleDeg:range[0]-.01},{angleDeg:range[1]+.01},{rpm:1}]){assert.throws(()=>joint.set(bad));assert.equal(physical(u),valid);}joint.set({angleDeg:original});assert.equal(physical(u),rest);
}

/** Current real physical assemblies and external visual controls; canvas is stubbed. */
export async function checkWeightSsrPoecamUnits(){
 const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
 const {Stand,BackBrick}=await import('../src/units/poe-cam-w-v11/index.js');
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop}),ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};let host,stand,brick,wrong;
 try{
  host=await loadModel('sticks3');host.display().fill('#123456');const framebuffer=hash(host.display().buffer),hub=await loadGroveModule('hub');host.port('grove').attach(hub);const units={},events=[],artwork=[];host.on('input',e=>{if(e.kind!=='port')events.push(e);});
  for(const[i,id]of ids.entries()){
   const u=await loadGroveModule(id,{terminalPlug:id!=='poe-cam-w-v11',cableLength:70+i*15});hub.port('grove-'+(i+1)).attach(u);units[id]=u;assert.equal(u.get('cable').getState().wireCount,4);assert.equal(u.components.has('sensor'),false);assert.equal(own(u,'display').length,0);assert.equal(own(u,'speaker').length,0);assert.equal(own(u,'joint').length,0);
   assert.deepEqual(own(u,'port').map(c=>c.id).sort(),id==='poe-cam-w-v11'?['download-p2','download-p3','ethernet','grove','mount']:['grove','terminal']);assert.deepEqual(own(u,'button').map(c=>c.id).sort(),id==='poe-cam-w-v11'?['reset','user']:[]);assert.deepEqual(own(u,'led').map(c=>c.id).sort(),id==='poe-cam-w-v11'?['activity-led','blue','link-led']:[]);
   const presets=catalog.products.find(p=>p.id===id)?.configurations??[];assert.ok(Array.isArray(presets));assert.ok(presets.every(p=>p.id&&typeof p.name==='string'&&p.options));
   const configs=[{},...presets.map(p=>p.options),...(id==='poe-cam-w-v11'?[{mount:'none'},{mount:'stand'},{mount:'brick'}]:[{terminalPlug:false},{terminalPlug:true}])],seen=new Set();
   for(const options of configs){const key=JSON.stringify(options);if(seen.has(key))continue;seen.add(key);for(const load of [loadModel,loadGroveModule]){const on=await load(id,options),off=await load(id,{...options,artwork:false});try{if(id!=='poe-cam-w-v11'){assert.equal(on.get('terminal').module!==null,options.terminalPlug===true,'actual terminal plug default/option');assert.equal(off.get('terminal').module!==null,options.terminalPlug===true,'artwork toggle preserves terminal option');}assert.equal(physical(on),physical(off),'all physical attributes/index/world invariant without ink');assert.equal(panels(off).length,0);assert.equal(panels(on).length,2,'two actual body print panels');if(id==='ssr')assert.deepEqual(panels(on).map(p=>p.userData.artworkKind).sort(),['source-vector-raster','source-vector-raster-and-reference-redraw']);if(id==='weight')assert.deepEqual(panels(on).map(p=>p.userData.artworkKind),['reference-redraw','reference-redraw']);if(id==='poe-cam-w-v11')assert.deepEqual(panels(on).map(p=>p.userData.artworkKind),['official-photo-code-redraw','official-photo-code-redraw']);for(const p of panels(on))assert.ok(['reference-redraw','reference-redraw-raster','official-photo-code-redraw','source-vector-raster','source-vector-raster-and-reference-redraw','official-vector-raster'].includes(p.userData.artworkKind));if(load===loadModel&&key==='{}')artwork.push({id,panels:panels(on).length,kinds:[...new Set(panels(on).map(p=>p.userData.artworkKind))]});}finally{on.dispose();off.dispose();}}}
  }
  screws(host,units.weight,'grove/grove-1',events);screws(host,units.ssr,'grove/grove-2',events);const camera=units['poe-cam-w-v11'];button(host,camera,'user','grove/grove-3',events);button(host,camera,'reset','grove/grove-3',events);lights(host,camera,'grove/grove-3',events);assert.deepEqual(camera.get('camera').getState(),{});
  stand=new Stand();camera.port('mount').attach(stand);tilt(host,camera,stand.get('tilt'),'grove/grove-3/mount/tilt',events);roundtrip(camera,camera.port('mount'));assert.ok(camera.port('mount').detach({dispose:false})===stand);stand.dispose();stand=null;
  brick=new BackBrick();camera.port('mount').attach(brick);assert.throws(()=>brick.get('tilt'));roundtrip(camera,camera.port('mount'));assert.ok(camera.port('mount').detach({dispose:false})===brick);brick.dispose();brick=null;
  wrong=await loadGroveModule('key');for(const id of ['weight','ssr']){const u=units[id],saved=u.port('terminal').module,rest=physical(u);assert.throws(()=>u.port('terminal').attach(wrong));assert.ok(u.port('terminal').module===saved);assert.equal(physical(u),rest);}
  const cameraRest=physical(camera);for(const id of ['ethernet','download-p2','download-p3','mount']){assert.throws(()=>camera.port(id).attach(wrong));assert.equal(physical(camera),cameraRest);}wrong.dispose();wrong=null;
  for(const[i,id]of ids.entries()){host.handle({type:'pose',target:'grove/grove-'+(i+1)+'/unitFrame',position:[i*55,190+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:'grove/grove-'+(i+1)+'/cable',slack:12,bend:[0,0,-1]});assert.equal(units[id].get('cable').getState().wireCount,4);}assert.equal(hash(host.display().buffer),framebuffer);const siblings=[physical(units.weight),physical(units.ssr)];hub.port('grove-3').detach();assert.deepEqual([physical(units.weight),physical(units.ssr)],siblings);assert.ok(hub.port('grove-1').module===units.weight&&hub.port('grove-2').module===units.ssr);
  return {status:'pass',artwork,cases:['three-real-four-core-input-branches','own-U030-HX711-without-fabricated-loadcell-platform-values-or-I2C','own-U122-SSR-without-ACSSR-DCSSR-controller-invented-light-or-switching-state','two-own-removable-4P-plugs-eight-independent-screwhead-tweens-exact-return-and-fixed-material','PoE-CAM-W-v11-actual-user-native-tongue-and-reset-cap-multiple-source-release-cancel-original-normals','own-OV3660-fixed-camera-passive-anchor-independent-real-lamp-carriers-no-inputecho','own-native-Stand-singleaxis-relative-motion-fixed-clamp-and-BackBrick-independent-attachment','both-entries-all-real-configurations-artwork-preserves-every-physical-attribute-index-world-matrix','real-connectors-reject-Grove-wrong-family-preserving-occupied-accessories','external-pose-cable-independent-detach-and-host-framebuffer-preserved'],scope:'Current three own physical assemblies/external visuals only; Node canvas stub; no GPU/browser, weighing/SSR/AI/video/network/PoE/USB/electrical/firmware behavior, measured stops, production fit, physical hardware or whole-catalog acceptance'};
 }finally{wrong?.dispose();if(stand&&!stand.attached)stand.dispose();if(brick&&!brick.attached)brick.dispose();host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkWeightSsrPoecamUnits(),null,2));
