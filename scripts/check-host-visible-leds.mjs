import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {loadModel,implementedModelIds} from '../src/loaders.js';
import {Led} from '../src/core/components/Led.js';

const SPECS={
 'cardputer-adv':{position:[35.25,10.45,7.8],package:'StampS3A RGB package'},
 stamplc:{position:[29.25,6.48,12.9],package:'StamPLC StampS3A RGB package'},
};
const hash=geometry=>crypto.createHash('sha256').update(Buffer.from(geometry.attributes.position.array.buffer,geometry.attributes.position.array.byteOffset,geometry.attributes.position.array.byteLength)).digest('hex');
const nearMatrix=(a,b,why)=>assert.ok(a.elements.every((v,i)=>Math.abs(v-b.elements[i])<2e-5),why);
const energy=color=>color.r*color.r+color.g*color.g+color.b*color.b;

/** Real product emitters/slot rays and external API; no private source files. */
export async function checkHostVisibleLeds(){
 const previousDocument=globalThis.document;
 if(!previousDocument){const noop=()=>{},ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});globalThis.document={createElement:()=>({getContext:()=>ctx})};}
 const models=[],cases=[],owned=new Map(),visibleDefaults=[];
 let invisibleState;
 try{
  for(const [id,spec]of Object.entries(SPECS)){
   const model=await loadModel(id);models.push(model);model.root.updateMatrixWorld(true);
   assert.deepEqual(model.list('led').map(led=>led.id),['stamp-rgb'],`${id}: one Stamp-S3A RGB, no invented separate red lamp`);
   const led=model.led('stamp-rgb');assert.equal(led.lens.name,spec.package);assert.equal(led.meta.emitter,'WS2812B-2020');assert.equal(led.meta.electricalBehavior,false);assert.equal(led.brightness,0);assert.equal(led.glow.visible,false);
   assert.ok(led.object3d.getWorldPosition(new THREE.Vector3()).distanceTo(new THREE.Vector3(...spec.position))<2e-5,`${id}: stable physical frame at the existing source slot`);
   const resources=[led.lens.geometry,led.lens.material,led.glow.material];
   for(const resource of resources){assert.ok(!owned.has(resource),'Each emitter owns its mesh/materials independently');owned.set(resource,0);resource.addEventListener('dispose',()=>owned.set(resource,owned.get(resource)+1));}
   const geometry=new Map(),transforms=new Map();model.root.traverse(object=>{if(object.isMesh){geometry.set(object.geometry,hash(object.geometry));transforms.set(object,object.matrixWorld.clone());}});
   const events=[];model.on('input',event=>events.push(event));
   const firstAt=(x,y)=>{
    const origin=led.object3d.localToWorld(new THREE.Vector3(x,y,12)),direction=new THREE.Vector3(0,0,-1).transformDirection(led.object3d.matrixWorld);
    return new THREE.Raycaster(origin,direction).intersectObject(model.root,true).find(hit=>hit.object.isMesh&&hit.object.material?.opacity!==0);
   };
   for(const [x,y]of [[0,0],[-.3,0],[.3,0],[0,.25],[0,.5]]){const hit=firstAt(x,y);assert.ok(hit?.object===led.lens,`${id}: actual emitting package is visible through the unchanged source cover slot; hit ${hit?.object.name??'nothing'} at ${x},${y}`);}
   assert.ok(firstAt(0,-.5)?.object===model.parts['stamp-frame'],'The real cover lip continues to occlude the lower package edge; no raised overlay hides its aperture');
   model.handle({type:'led',target:'stamp-rgb',color:'#22b477',brightness:.65});
   assert.deepEqual(led.getState(),{color:'#22b477',brightness:.65});assert.ok(energy(led.lens.material.emissive)>0);assert.equal(led.glow.visible,true);assert.equal(events.length,0,'External light drive emits no button/input action');
   assert.ok(model.list('button').every(button=>!button.pressed),'External color changes never actuate a control');
   model.root.updateMatrixWorld(true);for(const [object,matrix]of transforms)nearMatrix(object.matrixWorld,matrix,'Emission changes do not alter assembled geometry');
   const button=model.list('button').find(button=>!button.latching);button.press('external-check');model.update(.1);button.cancel('external-check');for(let i=0;i<80;i++)model.update(1/60);
   assert.deepEqual(led.getState(),{color:'#22b477',brightness:.65},'Button press/release never fabricates RGB or download behavior');
   assert.ok(events.some(event=>event.action==='up'&&event.cancelled));
   model.root.updateMatrixWorld(true);for(const [object,matrix]of transforms)nearMatrix(object.matrixWorld,matrix,'Control release restores each original physical mesh');
   for(const [g,value]of geometry)assert.equal(hash(g),value,'Color/brightness and button commands never rewrite original mesh positions');
   const localFrame=model.root.matrixWorld.clone().invert().multiply(led.object3d.matrixWorld);
   model.root.position.set(7,-4,3);model.root.rotation.set(.2,-.3,.4);model.root.updateMatrixWorld(true);nearMatrix(model.root.matrixWorld.clone().invert().multiply(led.object3d.matrixWorld),localFrame,'Emitter follows its actual product frame');
   assert.ok(firstAt(0,0)?.object===led.lens,'Rotating the host preserves aperture-to-emitter alignment');
   model.handle({type:'led',target:'stamp-rgb',color:'#bb3344',brightness:.2});assert.deepEqual(led.getState(),{color:'#bb3344',brightness:.2});model.handle({type:'led',target:'stamp-rgb',on:false});assert.equal(led.brightness,0);assert.equal(led.glow.visible,false);assert.equal(energy(led.lens.material.emissive),0);
   cases.push({id,led:'stamp-rgb',emitterCount:1,apertureRays:7,positionMm:spec.position,geometryMeshes:transforms.size,scope:'External RGB state and source-slot appearance; package dimensions/depth remain photo-derived'});
  }
  const first=models[0].led('stamp-rgb'),second=models[1].led('stamp-rgb');assert.ok(first.lens.material!==second.lens.material);first.set({color:'#44bb88',brightness:.8});assert.equal(second.brightness,0,'Independent products do not share emitting state');
  // IR keeps its public ID/commands and physical lens, without inventing
  // visible emission or a camera/infrared optical simulation.
  const fixture=new Led({id:'invisible-probe',invisible:true,mesh:new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({emissive:0x884422}))});
  try{
   assert.equal(energy(fixture.lensMaterial.emissive),0,'Invisible custom lenses suppress pre-existing emission immediately');
   for(const state of [true,'#22b477',{color:'#ff2020',brightness:1},{brightness:.25},false]){
    fixture.set(state);assert.equal(energy(fixture.lensMaterial.emissive),0);assert.equal(fixture.glow.visible,false);assert.equal(fixture.glow.material.opacity,0);assert.equal(fixture.lens.visible,true);
   }
  }finally{fixture.dispose();}
  const stick=await loadModel('sticks3');models.push(stick);
  const ir=stick.led('irTx'),irGeometry=hash(ir.lens.geometry),irPosition=ir.object3d.position.toArray(),irEvents=[];stick.on('input',event=>irEvents.push(event));
  assert.equal(ir.invisible,true);assert.ok(stick.list('led').includes(ir),'Legacy IR component remains addressable');
  stick.handle({type:'led',target:'irTx',color:'#bb3344',brightness:.75});
  assert.deepEqual(ir.getState(),{color:'#bb3344',brightness:.75});assert.equal(energy(ir.lensMaterial.emissive),0);assert.equal(ir.glow.visible,false);assert.equal(ir.glow.material.opacity,0);assert.equal(ir.lens.visible,true);
  assert.equal(hash(ir.lens.geometry),irGeometry);assert.deepEqual(ir.object3d.position.toArray(),irPosition);assert.equal(irEvents.length,0);
  invisibleState={id:'sticks3/irTx',commandedState:ir.getState(),humanVisibleEmission:false,lensPreserved:true};
  // Every default visible emitter in the current lazy-loader inventory keeps
  // its existing set/handle/on/off behavior; this is not a geometry suite.
  for(const id of implementedModelIds){
   const model=await loadModel(id);
   try{
    const leds=model.list('led').filter(led=>!led.invisible),events=[];model.on('input',event=>events.push(event));
    for(const led of leds){
     assert.equal(led.brightness,0,`${id}/${led.path}: default off remains unchanged`);
     model.handle({type:'led',target:led.path,color:'#22b477',brightness:.4});
     const expectedColor=led.meta.colorMode==='fixed-red'?'#ff2820':'#22b477';
     assert.deepEqual(led.getState(),{color:expectedColor,brightness:.4});assert.ok(energy(led.lensMaterial.emissive)>0);assert.equal(led.glow.visible,true);assert.ok(led.glow.material.opacity>0);
     model.handle({type:'led',target:led.path,on:false});assert.equal(led.brightness,0);assert.equal(energy(led.lensMaterial.emissive),0);assert.equal(led.glow.visible,false);
     visibleDefaults.push({id,led:led.path});
    }
    assert.equal(events.length,0,'External visible light commands remain output-only');
   }finally{model.dispose();}
  }
 }finally{
  for(const model of models)model.dispose();
  if(!previousDocument)delete globalThis.document;
 }
 assert.ok([...owned.values()].every(count=>count===1),'Each owned emitter geometry/lens material/glow material is released exactly once');
 return {status:'pass',cases,invisibleState,defaultVisibleEmitters:visibleDefaults,ownedEmitterResources:owned.size,resourceDisposal:'Owned emitter geometry and materials exactly once; core shared glow texture lifecycle is outside this product check',scope:'Actual external LED API, invisible IR state without human-visible emission, default visible emitters, original aperture rays, unchanged geometry, transformed frames and independent resource ownership. Canvas boundary stub only; no camera/IR optics, GPIO38 gating, firmware, boot sequence, physical optical/diffusion or hardware proof'};
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log('PASS visible host LEDs:',JSON.stringify(await checkHostVisibleLeds()));
