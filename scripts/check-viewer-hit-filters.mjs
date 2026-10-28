import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {fileURLToPath,pathToFileURL} from 'node:url';

const execute=promisify(execFile);

/** Importing this check is inert; isolate the GPU shim and DOM in a child. */
export async function checkViewerHitFilters(){
 const {stdout}=await execute(process.execPath,[fileURLToPath(import.meta.url),'--fixture'],{maxBuffer:1024*1024});
 const report=JSON.parse(stdout.trim());assert.equal(report.status,'pass');return report;
}

async function fixture(){
 const {register}=await import('node:module');
 const THREE=await import('three');
 const {Device}=await import('../src/core/Device.js');
 const {Component}=await import('../src/core/Component.js');
 const {Button}=await import('../src/core/components/Button.js');
 class Target{
  constructor(){this.listeners=new Map();this.style={};this.tagName='DIV';}
  addEventListener(type,fn){if(!this.listeners.has(type))this.listeners.set(type,new Set());this.listeners.get(type).add(fn);}
  removeEventListener(type,fn){this.listeners.get(type)?.delete(fn);}
  listenerCount(){return [...this.listeners.values()].reduce((n,set)=>n+set.size,0);}
 }
 class Canvas extends Target{
  constructor(){super();this.tagName='CANVAS';this.clientHeight=400;}
  getBoundingClientRect(){return {left:0,top:0,width:500,height:400};}
  remove(){this.removed=true;}
 }
 const frames=new Set(),observers=[];let sequence=0;
 Object.assign(globalThis,{window:new Target(),document:new Target(),requestAnimationFrame:()=>{const id=++sequence;frames.add(id);return id;},cancelAnimationFrame:id=>frames.delete(id),ResizeObserver:class{constructor(){observers.push(this);}observe(){}disconnect(){this.disconnected=true;}}});
 globalThis.__m5ViewerHitFilterRenderer=class{
  constructor(){this.domElement=new Canvas();this.shadowMap={};this.disposals=0;}
  setPixelRatio(){}setSize(){}render(){}dispose(){this.disposals++;}
 };
 // The real Viewer and Raycaster remain intact. Only the WebGL constructor
 // uses the same no-GPU boundary approach as check-viewer-lifecycle.mjs.
 const viewerUrl=new URL('../src/core/DeviceViewer.js',import.meta.url).href,threeUrl=import.meta.resolve('three');
 const shim='data:text/javascript,'+encodeURIComponent(`export * from ${JSON.stringify(threeUrl)};export const WebGLRenderer=globalThis.__m5ViewerHitFilterRenderer;`);
 register('data:text/javascript,'+encodeURIComponent(`export async function resolve(s,c,next){if(s==='three'&&c.parentURL===${JSON.stringify(viewerUrl)})return {url:${JSON.stringify(shim)},shortCircuit:true};return next(s,c);}`),import.meta.url);
 const {DeviceViewer}=await import(viewerUrl);
 const host=new Device(),viewer=new DeviceViewer({clientWidth:500,clientHeight:400,appendChild(){}},{environment:false,shadows:false,ground:false,keyboard:false});
 const owned=new Map(),checks=[];
 const box=(name,x,z=0)=>{
  const geometry=new THREE.BoxGeometry(4,4,1),material=new THREE.MeshStandardMaterial();
  for(const resource of [geometry,material]){owned.set(resource,0);resource.addEventListener('dispose',()=>owned.set(resource,owned.get(resource)+1));}
  const mesh=new THREE.Mesh(geometry,material);mesh.name=name;mesh.position.set(x,0,z);return mesh;
 };
 const plain=host.add(new Component({id:'plain'})),filtered=host.add(new Component({id:'filtered'}));
 const plainMesh=box('legacy unfiltered mesh',-16),filteredMesh=box('filtered physical shell',-8);
 plain.object3d.add(plain.hit(plainMesh));filtered.object3d.add(filteredMesh);
 const ancestor=new Component({id:'ancestor'}),middle=new Component({id:'middle'}),nearest=new Component({id:'nearest'});
 // Child components own their geometry and are disposed before their parents.
 host.add(nearest,middle.object3d);host.add(middle,ancestor.object3d);host.add(ancestor);
 const front=box('front physical fixed shell',8),rearButton=host.add(new Button({id:'behind-shell',mesh:box('rear actual button',8,-4),longPressMs:0}));
 nearest.object3d.add(front);
 viewer.mount(host,{fit:false});host.root.updateMatrixWorld(true);
 viewer.camera.position.set(0,0,100);viewer.camera.lookAt(0,0,0);viewer.camera.updateMatrixWorld(true);viewer.camera.updateProjectionMatrix();
 const pick=(x,z=.5)=>{
  host.root.updateMatrixWorld(true);
  const p=new THREE.Vector3(x,0,z).project(viewer.camera);
  return viewer.pick({clientX:(p.x+1)*250,clientY:(1-p.y)*200});
 };
 try{
  let hit=pick(-16);assert.equal(hit.component,plain);assert.equal(hit.intersection.object,plainMesh);assert.equal(hit.device,host);
  checks.push('legacy unfiltered target uses the actual first ray intersection');
  let received=null;
  filtered.hit(filteredMesh,intersection=>{received=intersection;return intersection.point.x>-8;});
  hit=pick(-7);assert.equal(hit.component,filtered);assert.equal(received,hit.intersection);assert.equal(received.object,filteredMesh);assert.ok(Number.isInteger(received.faceIndex));assert.ok(Math.abs(received.point.z-.5)<1e-8);
  hit=pick(-9);assert.equal(hit.component,null);assert.equal(hit.intersection,received);assert.equal(hit.intersection.object,filteredMesh);assert.equal(hit.device,host);
  checks.push('predicate receives the real object/face/point and selects only its accepted region');
  const calls=[];
  nearest.hit(front,intersection=>{calls.push(['nearest',intersection]);return false;});
  middle.hit(middle.object3d,intersection=>{calls.push(['middle',intersection]);return false;});
  ancestor.hit(ancestor.object3d,intersection=>{calls.push(['ancestor',intersection]);return true;});
  hit=pick(8);assert.equal(hit.component,ancestor);assert.equal(hit.intersection.object,front);assert.deepEqual(calls.map(([id])=>id),['nearest','middle','ancestor']);assert.ok(calls.every(([,intersection])=>intersection===hit.intersection));
  checks.push('rejected child and intermediate filters fall back to an accepting ancestor on the same intersection');
  ancestor.hit(ancestor.object3d,()=>false);hit=pick(8);assert.equal(hit.component,null);assert.equal(hit.intersection.object,front);assert.notEqual(hit.component,rearButton);
  front.visible=false;assert.equal(pick(8).component,rearButton,'the real rear button is ray-pickable only after removing the front obstruction');front.visible=true;
  checks.push('a rejected visible shell still occludes a real button behind it');
  ancestor.hit(ancestor.object3d);assert.equal(pick(8).component,ancestor,'an unfiltered ancestor still receives a rejected child intersection');
  filtered.hit(filteredMesh);assert.equal(pick(-9).component,filtered,'unfiltered re-registration clears the old predicate');
  checks.push('unfiltered ancestor fallback and re-registration retain legacy behavior');
  const registration=filteredMesh.userData.componentHit;
  for(const invalid of [false,0,'predicate',{},[]]){
   assert.throws(()=>plain.hit(filteredMesh,invalid),TypeError);assert.equal(filteredMesh.userData.component,filtered);assert.equal(filteredMesh.userData.componentHit,registration);
  }
  for(const invalid of [null,undefined,{},0])assert.throws(()=>plain.hit(invalid),TypeError);
  const error=new Error('intentional predicate error');filtered.hit(filteredMesh,()=>{throw error;});assert.throws(()=>pick(-8),caught=>caught===error,'predicate errors are not swallowed or turned into picking through the surface');
  filtered.hit(filteredMesh,()=>false);filteredMesh.userData.component=plain;assert.equal(pick(-8).component,plain,'legacy reassignment cannot inherit a different owner\'s predicate');
  checks.push('invalid registration is atomic; predicate errors propagate; legacy owner replacement ignores stale filters');
  const external=box('host-owned external native surface',0);host.body.add(external);
  const removed=host.add(new Component({id:'removed-external-owner'}));let staleCalls=0;
  removed.hit(external,()=>{staleCalls++;return true;});assert.equal(pick(0).component,removed);
  const callsBeforeRemoval=staleCalls;host.remove(removed.id);
  assert.equal(external.parent,host.body);assert.equal(owned.get(external.geometry),0,'removing the component must retain the actual external shell geometry');
  assert.equal(external.userData.component,undefined);assert.equal(external.userData.componentHit,undefined);assert.equal(pick(0).component,null);assert.equal(staleCalls,callsBeforeRemoval,'removed external targets must not invoke their old predicate');
  checks.push('removing an external-surface component clears its input binding while retaining the occluding physical shell');
  const former=host.add(new Component({id:'former-owner'})),current=host.add(new Component({id:'current-owner'}));
  former.hit(external,()=>{throw new Error('former owner filter must never run');});current.hit(external,()=>true);
  const currentRegistration=external.userData.componentHit;host.remove(former.id);
  assert.equal(external.userData.component,current);assert.equal(external.userData.componentHit,currentRegistration);assert.equal(pick(0).component,current,'disposing a former owner must preserve a later registration');
  current.unmount();assert.equal(external.userData.componentHit,currentRegistration);current.mount(host);assert.equal(pick(0).component,current,'component unmount/reattach retains the registered target');
  viewer.unmount(host);viewer.mount(host,{fit:false});assert.equal(pick(0).component,current,'Viewer unmount/reattach retains component input registrations');
  checks.push('new owner registration survives old owner disposal and both component/Viewer unmount-reattach');
  viewer.fit({padding:1.6});const visibleDistance=viewer.distance,visibleTarget=viewer.target.toArray();
  viewer.container.clientWidth=0;viewer.resize();viewer.distance=visibleDistance*.75;
  viewer.fit({padding:1.6});assert.equal(viewer.distance,visibleDistance*.75,'hidden model fit waits without changing user camera');
  viewer.container.clientWidth=500;viewer.resize();assert.equal(viewer.distance,visibleDistance,'first visible resize performs the deferred fit with its padding');assert.deepEqual(viewer.target.toArray(),visibleTarget);
  viewer.distance=visibleDistance*.65;viewer.resize();assert.equal(viewer.distance,visibleDistance*.65,'ordinary later resize preserves user zoom');
  checks.push('hidden-panel model fit defers until a real viewport;later ordinary resize preserves user zoom');
 }finally{viewer.dispose();host.dispose();}
 assert.ok([...owned.values()].every(count=>count===1),'fixture geometry and materials are released exactly once');assert.equal(viewer.renderer.disposals,1);assert.ok(viewer.renderer.domElement.removed);assert.equal(viewer.renderer.domElement.listenerCount(),0);assert.equal(window.listenerCount(),0);assert.equal(document.listenerCount(),0);assert.ok(observers.every(observer=>observer.disconnected));assert.equal(frames.size,0);
 return {status:'pass',checks,ownedResources:owned.size,scope:'Real Component.hit and DeviceViewer.pick with actual ray/triangle intersections; isolated DOM and no-GPU renderer boundary only, no browser pixel evidence'};
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 if(process.argv.includes('--fixture'))console.log(JSON.stringify(await fixture()));
 else console.log('PASS Viewer hit filters:',JSON.stringify(await checkViewerHitFilters()));
}
