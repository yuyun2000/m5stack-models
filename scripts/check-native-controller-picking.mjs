import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {createHash} from 'node:crypto';
import {promisify} from 'node:util';
import {fileURLToPath,pathToFileURL} from 'node:url';

const execute=promisify(execFile);

/** Isolate the GPU/DOM boundary from other checks and their module cache. */
export async function checkNativeControllerPicking(){
 const {stdout}=await execute(process.execPath,[fileURLToPath(import.meta.url),'--fixture'],{maxBuffer:4*1024*1024});
 return JSON.parse(stdout.trim());
}

async function fixture(){
 const {register}=await import('node:module'),THREE=await import('three');
 class Target{
  constructor(){this.listeners=new Map();this.style={};this.tagName='DIV';}
  addEventListener(type,fn){if(!this.listeners.has(type))this.listeners.set(type,new Set());this.listeners.get(type).add(fn);}
  removeEventListener(type,fn){this.listeners.get(type)?.delete(fn);}
  dispatch(type,values={}){const event={type,target:this,preventDefault(){},...values};for(const fn of [...(this.listeners.get(type)??[])])fn(event);}
 }
 const document=new Target(),noop=()=>{},context=new Proxy({measureText:()=>({width:20}),createRadialGradient:()=>({addColorStop:noop}),createLinearGradient:()=>({addColorStop:noop})},{get:(object,key)=>object[key]??noop});
 document.createElement=()=>({getContext:()=>context});document.hidden=false;
 class Canvas extends Target{
  constructor(){super();this.captures=new Set();this.clientHeight=400;}
  focus(){document.activeElement=this;}
  setPointerCapture(id){this.captures.add(id);}
  hasPointerCapture(id){return this.captures.has(id);}
  releasePointerCapture(id){if(this.captures.delete(id))this.dispatch('lostpointercapture',{pointerId:id});}
  getBoundingClientRect(){return {left:0,top:0,width:500,height:400};}
  remove(){}
 }
 Object.assign(globalThis,{document,window:new Target(),requestAnimationFrame:()=>1,cancelAnimationFrame:noop,ResizeObserver:class{observe(){}disconnect(){}}});
 globalThis.__m5NativePickingRenderer=class{
  constructor(){this.domElement=new Canvas();this.shadowMap={};}
  setPixelRatio(){}setSize(){}render(){}dispose(){}
 };
 // Only the GPU constructor is substituted. Camera, raycaster, pick(), private
 // ancestor filtering and pointer handlers are the real DeviceViewer code.
 const viewerUrl=new URL('../src/core/DeviceViewer.js',import.meta.url).href,threeUrl=import.meta.resolve('three');
 const shim='data:text/javascript,'+encodeURIComponent(`export * from ${JSON.stringify(threeUrl)};export const WebGLRenderer=globalThis.__m5NativePickingRenderer;`);
 register('data:text/javascript,'+encodeURIComponent(`export async function resolve(s,c,next){if(s==='three'&&c.parentURL===${JSON.stringify(viewerUrl)})return {url:${JSON.stringify(shim)},shortCircuit:true};return next(s,c);}`),import.meta.url);
 const {DeviceViewer}=await import(viewerUrl),{loadModel}=await import('../src/loaders.js'),{weightedInputHit}=await import('../src/modeling/weighted-input.js');
 const samples={
  'atom-lite':[
   ['button','main-centre',[0,2,20],[0,0,-1]],
   ['button','main-right-edge',[5.6,2,20],[0,0,-1]],
   ['button','main-left-edge',[-5.6,2,20],[0,0,-1]],
   ['button','main-near-root',[0,-4,20],[0,0,-1]],
   ['reset','reset-centre',[-20,5,3.1],[1,0,0]],
   ['reset','reset-lower-moving-wall',[-20,5,1],[1,0,0]],
   ['reset','reset-lower-y-edge',[-20,2.8,2.7],[1,0,0]],
   ['reset','reset-upper-y-edge',[-20,6.8,2.7],[1,0,0]],
   [null,'fixed-main-outside-u-slot',[8,2,20],[0,0,-1]],
   [null,'fixed-main-below-root',[0,-7,20],[0,0,-1]],
   [null,'fixed-reset-outside-slot',[-20,0,2.7],[1,0,0]],
   [null,'fixed-reset-below-root',[-20,5,-3],[1,0,0]],
  ],
  'atom-matrix':[
   ['button','main-lens-centre',[0,0,20],[0,0,-1]],
   ['reset','reset-recessed-centre',[-20,4.5,-2.7],[1,0,0]],
   ['reset','reset-reported-gap',[-20,4.5,-1.25],[1,0,0]],
   ['reset','reset-raised-free-end',[-20,4.5,1],[1,0,0]],
   [null,'fixed-reset-lower-y',[-20,1,-2],[1,0,0]],
   [null,'fixed-reset-upper-y',[-20,8,-2],[1,0,0]],
   [null,'fixed-reset-below-root',[-20,4.5,-5.5],[1,0,0]],
  ],
  'atoms3-lite':[
   ['button','main-centre',[0,1.1,20],[0,0,-1]],
   ['button','main-right-edge',[5.6,1.1,20],[0,0,-1]],
   ['button','main-left-edge',[-5.6,1.1,20],[0,0,-1]],
   ['button','main-near-hinge',[0,6.7,20],[0,0,-1]],
   ['reset','reset-centre',[-20,4.5,-.1],[1,0,0]],
   ['reset','reset-lower-moving-wall',[-20,4.5,-2.5],[1,0,0]],
   ['reset','reset-recessed-upper-wall',[-20,4.5,1.5],[1,0,0]],
   ['reset','reset-upper-moving-segment',[-20,4.5,3],[1,0,0]],
   ['reset','reset-free-tip',[-20,4.5,4.1],[1,0,0]],
   [null,'fixed-main-outside-u-slot',[8,1.1,20],[0,0,-1]],
   [null,'fixed-reset-below-root',[-20,4.5,-3.2],[1,0,0]],
   [null,'fixed-reset-lower-y',[-20,1,-.1],[1,0,0]],
   [null,'fixed-reset-upper-y',[-20,8,-.1],[1,0,0]],
  ],
 };
 const settle=model=>{for(let i=0;i<80;i++)model.update(1/60);model.root.updateMatrixWorld(true);};
 const hash=array=>createHash('sha256').update(Buffer.from(array.buffer,array.byteOffset,array.byteLength)).digest('hex');
 const nativeDigest=model=>{
  const shells=[...new Set(model.list('button').map(button=>button.shell).filter(Boolean))];
  return Object.fromEntries(shells.map(shell=>[shell.name,{attributes:Object.fromEntries(Object.entries(shell.geometry.attributes).map(([name,a])=>[name,hash(a.array)])),index:shell.geometry.index?hash(shell.geometry.index.array):null}]));
 };
 const failures=[],perModel={};let checks=0,pointerRoutes=0;
 for(const [id,rows]of Object.entries(samples)){
  const model=await loadModel(id),viewer=new DeviceViewer({clientWidth:500,clientHeight:400,appendChild(){}},{environment:false,shadows:false,ground:false,keyboard:false}),report={states:{},samplesPerPose:rows.length,pointerRoutes:0};
  viewer.mount(model,{fit:false});
  const aim=(origin,direction)=>{
   const start=model.body.localToWorld(new THREE.Vector3(...origin)),axis=new THREE.Vector3(...direction).transformDirection(model.body.matrixWorld);
   viewer.camera.position.copy(start);viewer.camera.up.set(0,1,0);if(Math.abs(axis.y)>.99)viewer.camera.up.set(0,0,1);
   viewer.camera.lookAt(start.clone().add(axis));viewer.camera.near=.01;viewer.camera.far=2000;viewer.camera.updateProjectionMatrix();viewer.camera.updateMatrixWorld(true);
  };
  try{
   for(const state of ['rest','partial','full','returned-rest']){
    if(state==='partial'){for(const button of model.list('button'))button.press('picking-state');model.update(.008);}
    else if(state==='full')settle(model);
    else if(state==='returned-rest'){for(const button of model.list('button'))button.cancel('picking-state');settle(model);}
    report.states[state]={nativeGeometry:nativeDigest(model),poses:{}};
    for(const pose of ['identity','rotated']){
     model.root.position.set(...(pose==='identity'?[0,0,0]:[4,-7,6]));model.root.rotation.set(...(pose==='identity'?[0,0,0]:[.21,-.31,.12]));model.root.updateMatrixWorld(true);
     let passed=0;
     for(const [target,name,origin,direction]of rows){
      aim(origin,direction);const hit=viewer.pick({clientX:250,clientY:200}),expected=target?model.button(target):null;
      const ok=hit&&hit.component===expected&&(!expected||expected.interactive);checks++;
      if(ok)passed++;else failures.push({id,state,pose,sample:name,expected:target,actual:hit?.component?.path??null,first:hit?.intersection.object.name??null,sourceFace:hit?.intersection.object.geometry?.attributes.sourceFaceIndex?.getX(hit.intersection.face.a)??null});
      // At rest, also use the real DOM pointer route for every positive sample.
      // No frame is advanced, so this checks dispatch without another travel suite.
      if(ok&&target&&state==='rest'){
       const events=[],off=model.on('input',event=>events.push(event));
       try{
        viewer.renderer.domElement.dispatch('pointerdown',{pointerId:18,button:0,clientX:250,clientY:200});
        assert.equal(expected.pressed,true,`${id}/${name}: actual pointerdown reaches the picked button`);
        viewer.renderer.domElement.dispatch('pointercancel',{pointerId:18,button:0,clientX:250,clientY:200});
        assert.equal(expected.pressed,false);assert.deepEqual(events.map(event=>[event.id,event.action]),[[target,'down'],[target,'up']]);assert.equal(events.at(-1).cancelled,true);
        pointerRoutes++;report.pointerRoutes++;
       }finally{off();}
      }
     }
     report.states[state].poses[pose]={samples:rows.length,passed};
    }
   }
   assert.deepEqual(report.states['returned-rest'].nativeGeometry,report.states.rest.nativeGeometry,`${id}: picking preserves exact native return`);
   const reset=model.button('reset'),shell=reset.shell,resetRows=rows.filter(([target])=>target==='reset');
   model.root.position.set(0,0,0);model.root.rotation.set(0,0,0);model.root.updateMatrixWorld(true);
   const [, ,origin,direction]=resetRows[0],nativeHit=new THREE.Raycaster(new THREE.Vector3(...origin),new THREE.Vector3(...direction)).intersectObject(shell,false)[0];
   assert.ok(nativeHit&&weightedInputHit(reset,shell,nativeHit),`${id}: actual native centre has a positive current interpolated weight`);
   let foreignInk=null;model.root.traverse(object=>{if(!foreignInk&&object.userData.role==='printed-artwork')foreignInk=object;});
   assert.ok(foreignInk,`${id}: actual unrelated ink mesh exists`);
   assert.equal(weightedInputHit(reset,shell,{...nativeHit,object:foreignInk}),false,`${id}: child/foreign ink face indices cannot index the native geometry`);
   report.foreignInkFaceIndicesRejected=true;
   model.remove('reset');assert.ok(shell.parent,`${id}: removing Reset retains its physical native shell`);
   report.removedReset={poses:{}};
   for(const pose of ['identity','rotated']){
    model.root.position.set(...(pose==='identity'?[0,0,0]:[4,-7,6]));model.root.rotation.set(...(pose==='identity'?[0,0,0]:[.21,-.31,.12]));model.root.updateMatrixWorld(true);
    let passed=0;
    for(const [,name,origin,direction]of resetRows){
     aim(origin,direction);const hit=viewer.pick({clientX:250,clientY:200});checks++;
     if(hit&&hit.component===null&&hit.intersection.object===shell)passed++;
     else failures.push({id,state:'removed-reset',pose,sample:name,expected:null,actual:hit?.component?.path??null,first:hit?.intersection.object.name??null});
    }
    report.removedReset.poses[pose]={samples:resetRows.length,passed};
   }
   perModel[id]=report;
  }finally{viewer.dispose();model.dispose();}
 }
 return {status:failures.length?'fail':'pass',controllers:Object.keys(samples).length,states:['rest','partial','full','returned-rest'],poses:['identity','rotated'],checks,pointerRoutes,failures,perModel,scope:'Actual current native models and real DeviceViewer.pick/pointer dispatch. GPU renderer and DOM boundaries are fixtures;no replacement pick,source geometry edits,artifact writes,browser pixels or hardware acceptance.'};
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 const result=process.argv.includes('--fixture')?await fixture():await checkNativeControllerPicking();
 console.log(JSON.stringify(result,null,2));
 if(result.status!=='pass'&&!process.argv.includes('--fixture'))process.exitCode=1;
}
