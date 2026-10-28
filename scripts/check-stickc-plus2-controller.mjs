/** MIT. Actual K016-P2 geometry/API fixture. Import has no autorun or artifact writes. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import * as T from 'three';
let Model,StickCPlus2,spec,DIM,Device,ButtonUnit;
async function initialize(){({default:Model,StickCPlus2,spec,DIM}=await import('../src/devices/stickc-plus2/index.js'));({Device}=await import('../src/core/index.js'));({GroveModule:ButtonUnit}=await import('../src/units/button/index.js'));}
const hash=a=>createHash('sha256').update(Buffer.from(a.buffer,a.byteOffset,a.byteLength)).digest('hex');
const digest=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const under=(o,p)=>{for(;o;o=o.parent)if(o===p)return true;return false;};
function world(h){let root=h.root;while(root.parent)root=root.parent;root.updateMatrixWorld(true);}
function meshes(h,except=[]){const out=[];h.root.traverse(o=>{if(o.isMesh&&o.userData.role!=='printed-artwork'&&o.material.opacity!==0&&!except.some(p=>under(o,p)))out.push(o);});return out;}
function records(h,except=[]){world(h);return meshes(h,except).map(o=>({name:o.name,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,a])=>[k,{sha256:hash(a.array),itemSize:a.itemSize,count:a.count}])),index:o.geometry.index?hash(o.geometry.index.array):null,matrix:o.matrixWorld.toArray()}));}
function tick(h,n=50){for(let i=0;i<n;i++)h.update(1/60);world(h);}
function shoot(h,p,d,objects=null,frame=null){world(h);frame??=h.body;return new T.Raycaster(new T.Vector3(...p).applyMatrix4(frame.matrixWorld),new T.Vector3(...d).transformDirection(frame.matrixWorld)).intersectObjects(objects??meshes(h),true).filter(x=>x.object.userData.role!=='printed-artwork'&&x.object.material.opacity!==0);}
function closed(o){
 const p=o.geometry.attributes.position,idx=o.geometry.index,keys=[],edges=new Map();let volume=0,triangles=0;
 for(let i=0;i<p.count;i++)keys.push([p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(','));
 for(let i=0;i<(idx?.count??p.count);i+=3){const ids=[0,1,2].map(k=>idx?idx.getX(i+k):i+k),v=ids.map(j=>new T.Vector3().fromBufferAttribute(p,j));
  const area=v[1].clone().sub(v[0]).cross(v[2].clone().sub(v[0])).length();if(area<1e-10)continue;
  triangles++;volume+=v[0].dot(v[1].clone().cross(v[2]))/6;
  for(let k=0;k<3;k++){const a=keys[ids[k]],b=keys[ids[(k+1)%3]];if(a===b)continue;const key=[a,b].sort().join('|'),e=edges.get(key)??[0,0];e[0]++;e[1]+=a<b?1:-1;edges.set(key,e);}
 }
 assert.ok(volume>1e-8,'Positive closed solid: '+o.name);assert.ok([...edges.values()].every(([n,d])=>n===2&&d===0),'Directed closed two-edge solid: '+o.name);
 assert.equal(o.material.side,T.FrontSide,'Real outward material: '+o.name);return triangles;
}
function stub(){const old=globalThis.document,noop=()=>{},ctx=new Proxy({createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});globalThis.document={createElement:()=>({getContext:()=>ctx})};return()=>{if(old===undefined)delete globalThis.document;else globalThis.document=old;};}
function observe(root){const resources=new Set(),disposed=new Set();root.traverse(o=>{if(o.geometry)resources.add(o.geometry);for(const m of[].concat(o.material??[])){resources.add(m);for(const v of Object.values(m))if(v?.isTexture)resources.add(v);}});for(const r of resources)r.addEventListener('dispose',()=>disposed.add(r));return()=>{assert.equal(disposed.size,resources.size,'Every owned resource receives disposal');return resources.size;};}
function rays(h){const a=h.stickcPlus2Assembly;let wallRays=0,contacts=0;
 for(const [id,g]of[['usb',a.usb],['grove',a.grove]]){
  const z=id==='usb'?-2.7:-3.0;
  for(const d of[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0]]){assert.ok(shoot(h,[.1,.8,z],d,[g],g).length,`${id} has physical cavity walls`);wallRays++;}
  const stop=shoot(h,[.1,.8,1],[0,0,-1],[g],g)[0];assert.ok(stop&&stop.point.clone().applyMatrix4(g.matrixWorld.clone().invert()).z<-3,`${id} real deep stop`);
 }
 const usbPads=a.usb.children.filter(o=>o.name==='USB-C contact pad');assert.equal(usbPads.length,24);
 for(const p of usbPads){const point=p.position.clone();point.y+=Math.sign(point.y)*.3;const hits=shoot(h,point.toArray(),[0,-Math.sign(p.position.y),0],[a.usb],a.usb);assert.ok(hits[0]?.object===p,'Actual USB contact first material');contacts++;}
 const grovePads=a.grove.children.filter(o=>o.material?.metalness>.3);assert.equal(grovePads.length,4);
 for(const p of grovePads){const hit=shoot(h,[p.position.x,p.position.y,1],[0,0,-1],[a.grove],a.grove)[0];assert.ok(hit?.object===p,'Each Grove contact is reached through actual opening');contacts++;}
 for(let i=0;i<8;i++){
  const x=(i-3.5)*2.54;
  const stop=shoot(h,[x,0,1],[0,0,-1],[a.hat],a.hat)[0];assert.ok(stop?.object===a.hatStops[i],'Each actual HAT bore reaches deep stop');
  for(const dir of[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0]]){assert.ok(shoot(h,[x,0,-.9],dir,[a.hat],a.hat)[0]);wallRays++;}
  const port=h.port('hat');assert.equal(port.pinAt(new T.Vector3(x,0,0)).n,8-i);
 }
 for(const p of a.hatContacts){assert.ok(shoot(h,[p.position.x,0,1],[0,0,-1],[a.hat],a.hat).some(x=>x.object===p),'Recessed HAT metal contact is physically visible');contacts++;}
 for(const [p,d]of[[[0,0,-20],[0,0,1]],[[8,-19.5,-20],[0,0,1]],[[0,-22,-20],[0,0,1]],[[9,0,20],[0,0,-1]]]){const hit=shoot(h,p,d)[0];assert.ok(hit,'Real assembly is closed at physical sample');if(p[2]<0)assert.ok(hit.point.z<0,'Rear closure does not see far front face');}
 assert.equal(a.carrier.userData.role,'physical-label-substrate');return{connectorWallRays:wallRays,visibleContacts:contacts,usbContacts:24,groveContacts:4,hatWells:8,hatContacts:16,rearClosureSamples:3};
}
function keyRays(h,id){const b=h.button(id),samples=id==='a'?[[-6.4,-17.0,20],[0,-17.0,20],[6.4,-10.3,20]]:[[0,0,3],[.8,.6,3],[-.8,-.6,3]],frame=id==='a'?h.body:b.object3d;
 return samples.map(p=>{const hit=shoot(h,p,[0,0,-1],[b.cap],frame)[0];assert.ok(hit,`${id} actual cap surface`);assert.ok(hit.object.userData.component===b,`${id} real moving material is hit-bound`);return hit.point.clone();});
}
async function dynamics(h,inkOff){const a=h.stickcPlus2Assembly,events=[],off=h.on('input',e=>events.push(e)),rest=digest(records(h));let surfaceRays=0;const perButton={};
 try{for(const id of['a','b','power']){
  const b=h.button(id),c=inkOff.button(id),fixed=digest(records(h,[b.cap])),surface=keyRays(h,id);surfaceRays+=surface.length;
  const led=h.led('red').getState(),screen=hash(h.display().buffer);
  const before=events.length;b.onPointerDown({pointerId:22});c.onPointerDown({pointerId:22});b.press('external');c.press('external');h.update(.008);inkOff.update(.008);world(h);world(inkOff);
  const partial=b.getActuationState().depthMm;assert.ok(partial>0&&partial<b.travel);assert.deepEqual(records(h),records(inkOff),'Ink-off preserves every physical attribute/index/world at partial press');
  assert.equal(digest(records(h,[b.cap])),fixed,'Fixed objects remain exact while partial');
  const p=keyRays(h,id);surfaceRays+=p.length;for(let i=0;i<p.length;i++)assert.ok(p[i].distanceTo(surface[i])>0&&p[i].distanceTo(surface[i])<b.travel,'Actual cap first surface moves partially');
  b.onPointerCancel({pointerId:22});c.onPointerCancel({pointerId:22});tick(h);tick(inkOff);assert.equal(b.pressed,true);assert.equal(b.getActuationState().depthMm,b.travel);
  assert.deepEqual(records(h),records(inkOff),'Ink-off preserves every physical attribute/index/world at full press');assert.equal(digest(records(h,[b.cap])),fixed);
  for(const object of meshes(h).filter(o=>under(o,b.cap)))closed(object);
  const full=keyRays(h,id);surfaceRays+=full.length;for(let i=0;i<full.length;i++)assert.ok(full[i].distanceTo(surface[i])>p[i].distanceTo(surface[i]),'Actual cap full surface exceeds partial motion');
  // The cap's real inner solid moves too, not a hit-only front face.
  const inner=shoot(h,id==='a'?[0,-17,4.8]:[0,0,-1.8],[0,0,1],[b.cap],id==='a'?h.body:b.object3d)[0];assert.ok(inner,'Actual full-depth inner key face');
  assert.deepEqual(h.led('red').getState(),led);assert.equal(hash(h.display().buffer),screen,'Press does not synthesize pixels');
  if(id==='a')for(const binding of b.bindings){for(let i=0;i<binding.p.count;i++)if(binding.weights[i]===0){const local=new T.Vector3().fromBufferAttribute(binding.p,i).applyMatrix4(binding.o.matrixWorld);const z=binding.rest[i*3+2]+binding.o.position.z;assert.ok(Math.abs(local.z-z)<1e-6,'Actual molded hinge remains fixed');}}
  b.cancel('external');c.cancel('external');tick(h);tick(inkOff);assert.equal(b.getActuationState().depthMm,0);assert.equal(digest(records(h)),rest,'Every physical attribute/index/world restores exactly');assert.deepEqual(records(h),records(inkOff));
  assert.deepEqual(events.slice(before).map(e=>e.action),['down','up']);assert.equal(events.at(-1).cancelled,true,'Cancellation suppresses click with multiple held sources');
  keyRays(h,id);surfaceRays+=3;perButton[id]={travelMm:b.travel,partialMm:partial,partialFullActualSurfaces:true,innerAndOuterPhysical:true,fixedMeshesExact:true,cancelWithoutClick:true,exactReturn:true};
 }
 const n=events.length;h.handle({type:'display',target:'lcd',fill:'#205790'});h.handle({type:'led',target:'red',color:'#ff3020',brightness:.4});assert.equal(events.length,n,'External outputs have no input echo');assert.deepEqual(h.display().getPixel(0,0),[32,87,144]);
 h.handle({type:'display',target:'lcd',format:'rgb565',data:new Uint16Array([0xf800]),x:0,y:0,w:1,h:1});assert.deepEqual(h.display().getPixel(0,0),[255,0,0]);
 const before=events.length;h.button('a').click(20);await new Promise(r=>setTimeout(r,45));tick(h);assert.deepEqual(events.slice(before).map(e=>e.action),['down','up','click']);assert.equal(digest(records(h)),rest);
 return{perButton,actualSurfaceRays:surfaceRays,external135x240Framebuffer:true,rgb565AndFill:true,redLedExternalNoEcho:true,realTimerClick:true,inkOffAllPhysicalAttributesIndexWorld:true};
 }finally{off();}
}
function cableProof(host,unit){const c=unit.get('cable'),state=c.getState();assert.equal(state.wireCount,4);assert.equal(state.plugCount,2);for(const [end,j]of[['source',0],['target',c.wirePoints[0].length-1]]){const f=state[end],q=new T.Quaternion().fromArray(f.quaternion),row=new T.Vector3(1,0,0).applyQuaternion(q),normal=new T.Vector3(0,1,0).applyQuaternion(q);for(let i=0;i<4;i++){const expected=new T.Vector3(...f.position).addScaledVector(normal,4.2).addScaledVector(row,(i-1.5)*2);assert.ok(c.wirePoints[i][j].distanceTo(expected)<1e-5,'Four actual wire ends follow mating frame');}}assert.ok(host.get('grove/press')===unit.get('press'));return{wireCount:4,plugCount:2,faceDistanceMm:state.faceDistanceMm};}
function connection(){const host=new Model({artwork:false}),peer=new Model({artwork:false}),unit=new ButtonUnit({artwork:false,cableLength:70}),events=[];host.root;peer.root;host.root.position.set(3,-4,7);host.root.rotation.set(.15,-.23,.19);host.port('grove').attach(unit);host.on('input',e=>events.push(e));tick(host);const own=digest(records(host,[unit.root]));const cable=cableProof(host,unit);host.handle({type:'button',target:'grove/press',action:'press',source:'downstream'});tick(host);host.handle({type:'button',target:'grove/press',action:'cancel',source:'downstream'});tick(host);assert.deepEqual(events.filter(e=>e.kind==='button').map(e=>[e.id,e.action]),[['grove/press','down'],['grove/press','up']]);assert.equal(digest(records(host,[unit.root])),own);
 const n=events.length;host.handle({type:'pose',target:'grove/unitFrame',rotation:[.1,.2,-.3]});host.handle({type:'pose',target:'grove/unitFrame',distance:90});host.update(0);assert.equal(events.length,n);cableProof(host,unit);
 const actual=host.port('grove').detach({dispose:false});assert.ok(actual===unit);peer.port('grove').attach(unit);tick(peer);cableProof(peer,unit);assert.equal(host.port('grove').module,null);const observed=observe(unit.root);peer.port('grove').detach();const released=observed();host.dispose();peer.dispose();return{transformedHost:true,hierarchicalInputPath:'grove/press',sourceToActualGroveFrame:true,cable,unitPoseAndHostTransfer:true,realDetachReattach:true,resourcesReleased:released};}
function connectedInk(){
 const build=artwork=>{const host=new Model({artwork}),unit=new ButtonUnit({artwork:false,cableLength:78});host.root;host.root.position.set(-3,4,7);host.root.rotation.set(.12,-.19,.23);host.port('grove').attach(unit);unit.get('unitFrame').setPose({rotation:[.11,-.08,.14]});tick(host);return{host,unit};};
 const on=build(true),off=build(false);try{
  assert.deepEqual(records(on.host),records(off.host),'Connected rest retains all physical geometry with ink disabled');
  for(const id of['a','b','power']){on.host.button(id).press('connected');off.host.button(id).press('connected');}
  on.unit.button('press').press('child');off.unit.button('press').press('child');
  on.host.update(.008);off.host.update(.008);assert.deepEqual(records(on.host),records(off.host),'Connected partial host and child keys are ink invariant');
  tick(on.host);tick(off.host);assert.deepEqual(records(on.host),records(off.host),'Connected full host and child keys are ink invariant');
  for(const id of['a','b','power']){on.host.button(id).cancel('connected');off.host.button(id).cancel('connected');}
  on.unit.button('press').cancel('child');off.unit.button('press').cancel('child');tick(on.host);tick(off.host);assert.deepEqual(records(on.host),records(off.host));cableProof(on.host,on.unit);cableProof(off.host,off.unit);
  return{restPartialFullReturnedAllPhysicalAttributesIndexWorld:true,allThreeHostKeysAndChildHeld:true,actualFourCoreAndBothPlugs:true};
 }finally{on.host.dispose();off.host.dispose();}
}
async function picking(){const{stdout}=await promisify(execFile)(process.execPath,[fileURLToPath(import.meta.url),'--picking-fixture'],{maxBuffer:2*1024*1024});const report=JSON.parse(stdout);assert.equal(report.status,'pass');return report;}
async function pickingFixture(){
 const {register}=await import('node:module');
 class Target{constructor(){this.listeners=new Map();this.style={};this.tagName='DIV';}addEventListener(k,f){if(!this.listeners.has(k))this.listeners.set(k,new Set());this.listeners.get(k).add(f);}removeEventListener(k,f){this.listeners.get(k)?.delete(f);}dispatch(k,v={}){for(const f of[...(this.listeners.get(k)??[])])f({type:k,target:this,preventDefault(){},...v});}}
 const doc=new Target(),noop=()=>{},ctx=new Proxy({createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});doc.createElement=()=>({getContext:()=>ctx});
 class Canvas extends Target{constructor(){super();this.captures=new Set();this.clientHeight=400;}focus(){doc.activeElement=this;}setPointerCapture(i){this.captures.add(i);}hasPointerCapture(i){return this.captures.has(i);}releasePointerCapture(i){if(this.captures.delete(i))this.dispatch('lostpointercapture',{pointerId:i});}getBoundingClientRect(){return{left:0,top:0,width:500,height:400};}remove(){}}
 Object.assign(globalThis,{document:doc,window:new Target(),requestAnimationFrame:()=>1,cancelAnimationFrame:noop,ResizeObserver:class{observe(){}disconnect(){}}});
 globalThis.__plus2FixtureRenderer=class{constructor(){this.domElement=new Canvas();this.shadowMap={};}setPixelRatio(){}setSize(){}render(){}dispose(){}};
 const viewerUrl=new URL('../src/core/DeviceViewer.js',import.meta.url).href,threeUrl=import.meta.resolve('three');
 const shim='data:text/javascript,'+encodeURIComponent(`export * from ${JSON.stringify(threeUrl)};export const WebGLRenderer=globalThis.__plus2FixtureRenderer;`);
 register('data:text/javascript,'+encodeURIComponent(`export async function resolve(s,c,next){if(s==='three'&&c.parentURL===${JSON.stringify(viewerUrl)})return {url:${JSON.stringify(shim)},shortCircuit:true};return next(s,c);}`),import.meta.url);
 await initialize();const {DeviceViewer}=await import(viewerUrl),host=new Model({artwork:false}),viewer=new DeviceViewer({clientWidth:500,clientHeight:400,appendChild(){}},{environment:false,shadows:false,ground:false,keyboard:false});
 viewer.mount(host,{fit:false});const events=[];host.on('input',e=>events.push(e));
 const samples=[['a',[-6.4,-17,20],[0,0,-1]],['a',[0,-13.8,20],[0,0,-1]],['a',[6.4,-10.3,20],[0,0,-1]],['b',[20,8.1,0],[-1,0,0]],['b',[20,9.8,2],[-1,0,0]],['b',[20,6.4,-2],[-1,0,0]],['power',[-20,-15.5,0],[1,0,0]],['power',[-20,-14,2],[1,0,0]],['power',[-20,-17,-2],[1,0,0]],[null,[8,-14,20],[0,0,-1]],[null,[0,-20,20],[0,0,-1]],[null,[20,12.5,0],[-1,0,0]],[null,[-20,-10,0],[1,0,0]]];
 let checks=0,routes=0;try{for(const rotated of[false,true]){host.root.position.set(rotated?3:0,rotated?-4:0,rotated?7:0);host.root.rotation.set(...(rotated?[.2,-.3,.1]:[0,0,0]));for(const state of['rest','partial','full','returned']){
  for(const b of host.list('button')){if(state==='partial'||state==='full')b.press('fixture');else b.cancel('fixture');}if(state==='partial')host.update(.008);else tick(host);world(host);
  for(const[id,origin,dir]of samples){const start=host.body.localToWorld(new T.Vector3(...origin)),axis=new T.Vector3(...dir).transformDirection(host.body.matrixWorld);viewer.camera.position.copy(start);viewer.camera.up.set(0,1,0);viewer.camera.lookAt(start.clone().add(axis));viewer.camera.near=.01;viewer.camera.updateProjectionMatrix();viewer.camera.updateMatrixWorld(true);
   const hit=viewer.pick({clientX:250,clientY:200});assert.ok(hit);assert.ok(hit.component===(id?host.button(id):null),`Actual Viewer picks ${id??'fixed shell'} in ${state}/${rotated}`);checks++;
   if(state==='rest'&&id){const n=events.length;viewer.renderer.domElement.dispatch('pointerdown',{pointerId:31,button:0,clientX:250,clientY:200});assert.equal(host.button(id).pressed,true);host.update(.008);viewer.renderer.domElement.dispatch('pointercancel',{pointerId:31,button:0,clientX:250,clientY:200});tick(host);assert.deepEqual(events.slice(n).map(e=>[e.id,e.action]),[[id,'down'],[id,'up']]);assert.equal(events.at(-1).cancelled,true);routes++;}
  }
 }}return{status:'pass',states:['rest','partial','full','returned'],poses:2,samplesPerPose:13,actualViewerPicks:checks,actualDomPointerCancelRoutes:routes,scope:'Real Viewer/camera/raycaster/private pointer route; GPU and DOM boundary fixture only, no browser pixel claim'};
 }finally{viewer.unmount(host);host.dispose();viewer.dispose();}
}
export async function checkStickCPlus2Controller(){await initialize();const restore=stub();let model,inkOff;try{
 assert.ok(Model===StickCPlus2);assert.equal(spec.sku,'K016-P2');model=new Model();inkOff=new Model({artwork:false});model.root;inkOff.root;assert.ok(model instanceof Device);assert.deepEqual([...model.components.keys()],['a','b','power','usb','grove','hat','red','lcd']);assert.deepEqual(model.list('button').map(c=>c.id),['a','b','power']);assert.equal(model.list('display').length,1);assert.equal(model.display().touchEnabled,false);assert.deepEqual([model.display().width,model.display().height],[135,240]);assert.equal(model.list('imu').length,0);assert.equal(model.list('speaker').length,0);assert.equal(model.list('sensor').length,0);assert.equal(model.list('led').length,1);
 assert.deepEqual(records(model),records(inkOff),'Artwork false removes only ink');let solids=0,triangles=0;for(const o of meshes(model)){for(const a of Object.values(o.geometry.attributes))assert.ok([...a.array].every(Number.isFinite));if(o.geometry.type==='PlaneGeometry')continue;triangles+=closed(o);solids++;}
 const panel=[];model.root.traverse(o=>{if(o.userData.role==='printed-artwork')panel.push(o);});assert.equal(panel.length,1);assert.equal(panel[0].userData.artworkKind,'reference-redraw');assert.ok(panel[0].parent===model.stickcPlus2Assembly.carrier);
 const report={status:'pass',id:'stickc-plus2',sku:'K016-P2',nominalMm:DIM.body,geometry:{kind:'original-parametric-reconstruction',closedPositiveFrontSideSolids:solids,triangles},ports:rays(model),runtime:await dynamics(model,inkOff),connection:connection(),connectedInk:connectedInk(),picking:await picking(),scope:'Actual product CPU geometry/API/cable/timer only; no browser pixels, physical fit, hidden BOM accuracy, firmware/electrical or certification acceptance.'};
 const ra=observe(model.root),rb=observe(inkOff.root);model.dispose();inkOff.dispose();report.disposedResources=[ra(),rb()];model=null;inkOff=null;
 const pending=new Model({artwork:false});pending.root;let late=0;pending.on('input',()=>late++);pending.button('a').click(40);pending.button('power').click(40);const before=late,resources=observe(pending.root);pending.dispose();report.pendingClickResources=resources();await new Promise(r=>setTimeout(r,65));assert.equal(late,before);report.pendingRealClickTimersCancelled=true;return report;
 }finally{model?.dispose();inkOff?.dispose();restore();}}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(process.argv.includes('--picking-fixture')?await pickingFixture():await checkStickCPlus2Controller(),null,2));
