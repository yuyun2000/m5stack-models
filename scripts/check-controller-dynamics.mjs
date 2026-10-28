import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {loadModel,loadModelClass} from '../src/loaders.js';
import {DEVICE_BUTTON_COUNTS,checkDeviceActuators} from './check-device-actuators.mjs';
import {checkAtomLiteController} from './check-atom-lite-controller.mjs';
import {checkAtomMatrixController} from './check-atom-matrix-controller.mjs';
import {checkAtomS3LiteController} from './check-atoms3-lite-controller.mjs';
import {checkAtomS3Controller} from './check-atoms3-controller.mjs';
import {checkDialController} from './check-dial-controller.mjs';
import {checkStickCPlus2Controller} from './check-stickc-plus2-controller.mjs';
import {checkBasicV27Controller} from './check-basic-v27-controller.mjs';

import {checkAtomMatrixV11Controller} from './check-atom-matrix-v11-controller.mjs';

import {checkM5StickController} from './check-m5stick-controller.mjs';

import {checkStickVController} from './check-stickv-controller.mjs';

import {checkAtomS3RAIChatbotController} from './check-atoms3r-ai-chatbot-controller.mjs';

import {checkAtomS3RCamController} from './check-atoms3r-cam-controller.mjs';

import {checkAtomS3RCAMAIChatbotController} from './check-atoms3r-cam-ai-chatbot-controller.mjs';

import {checkAtomS3RM12Controller} from './check-atoms3r-m12-controller.mjs';

import {checkAtomS3RM12VolcengineKitController} from './check-atoms3r-m12-volcengine-kit-controller.mjs';

import {checkStickCController} from './check-stickc-controller.mjs';

import {checkStickCPlusController} from './check-stickc-plus-controller.mjs';

import {checkAtomS3RExtController} from './check-atoms3r-ext-controller.mjs';

import {checkStickCPlusSEController} from './check-stickc-plus-se-controller.mjs';

import {checkAtomEchoController} from './check-atom-echo-controller.mjs';

import {checkAtomEchoS3RController} from './check-atom-echos3r-controller.mjs';

import {checkAtomS3UController} from './check-atoms3u-controller.mjs';

import {checkStickT2Controller} from './check-stickt2-controller.mjs';

import {checkAtomUController} from './check-atomu-controller.mjs';

// Explicit coverage is intentional: a new controller/configuration must fail
// this aggregate until its real dynamics fixture is deliberately selected.
const legacyCases=[
 ['sticks3','default',{}],['cores3','module',{}],['cores3','din',{dinBase:true}],
 ['stopwatch','default',{}],['cardputer-adv','default',{}],['cardputer-zero','default',{}],
 ['papermono','default',{}],['core2','default',{}],['papercolor','default',{}],
 ['nanoc6','default',{}],['stackchan','default',{}],['tab5','default',{}],
 ['atoms3r','default',{}],['nesso-n1','default',{}],['stamplc','default',{}],
];
const nativeCases=[
 ['atom-lite','complete',{},checkAtomLiteController],
 ['atom-matrix','complete',{},checkAtomMatrixController],
 ['atoms3-lite','complete',{},checkAtomS3LiteController],
];
const newCases=[
 ['atomu','complete',{},checkAtomUController],
 ['stickt2','complete',{},checkStickT2Controller],
 ['atoms3u','complete',{},checkAtomS3UController],
 ['atom-echos3r','mount-open',{"labelPierced":true},checkAtomEchoS3RController],
 ['atom-echos3r','complete',{},checkAtomEchoS3RController],
 ['atom-echo','mount-open',{"labelPierced":true},checkAtomEchoController],
 ['atom-echo','complete',{},checkAtomEchoController],
 ['stickc-plus-se','complete',{},checkStickCPlusSEController],
 ['atoms3r-ext','complete',{},checkAtomS3RExtController],
 ['stickc-plus','complete',{},checkStickCPlusController],
 ['stickc','complete',{},checkStickCController],
 ['atoms3r-m12-volcengine-kit','complete',{},checkAtomS3RM12VolcengineKitController],
 ['atoms3r-m12','complete',{},checkAtomS3RM12Controller],
 ['atoms3r-cam-ai-chatbot','complete',{},checkAtomS3RCAMAIChatbotController],
 ['atoms3r-cam','complete',{},checkAtomS3RCamController],
 ['atoms3r-ai-chatbot','complete',{},checkAtomS3RAIChatbotController],
 ['stickv','black-pcb',{"pcb":"black"},checkStickVController],
 ['stickv','blue-pcb',{"pcb":"blue"},checkStickVController],
 ['m5stick','white',{"version":"white"},checkM5StickController],
 ['m5stick','gray',{"version":"gray"},checkM5StickController],
 ['atom-matrix-v11','mount-open',{"labelPierced":true},checkAtomMatrixV11Controller],
 ['atom-matrix-v11','complete',{},checkAtomMatrixV11Controller],
 ['atoms3','complete',{},checkAtomS3Controller],
 ['dial','complete',{},checkDialController],
 ['stickc-plus2','complete',{},checkStickCPlus2Controller],
 ['basic-v27','complete',{},checkBasicV27Controller],
 ['basic-v27','base-removed',{base:'removed'},checkBasicV27Controller],
];
const key=([id,configuration])=>`${id}/${configuration}`;
const settle=model=>{for(let i=0;i<80;i++)model.update(1/60);model.root.updateMatrixWorld(true);};
const under=(object,parent)=>{for(;object;object=object.parent)if(object===parent)return true;return false;};
const hash=array=>createHash('sha256').update(Buffer.from(array.buffer,array.byteOffset,array.byteLength)).digest('hex');
const geometry=object=>JSON.stringify({attributes:Object.fromEntries(Object.entries(object.geometry.attributes).map(([name,a])=>[name,[a.itemSize,a.count,hash(a.array)]])),index:object.geometry.index?hash(object.geometry.index.array):null});
function physicalMeshes(model){
 const meshes=[];
 model.root.traverse(object=>{
  if(object.isMesh&&object.userData.role!=='printed-artwork'&&[].concat(object.material).some(material=>material.opacity>.05))meshes.push(object);
 });
 return meshes;
}
function capture(meshes){
 return new Map(meshes.map(object=>{
  const position=object.geometry.attributes.position,indices=[0,Math.floor(position.count/2),position.count-1];
  return [object,{geometry:geometry(object),matrix:object.matrixWorld.toArray(),indices,points:indices.map(i=>new THREE.Vector3().fromBufferAttribute(position,i).applyMatrix4(object.matrixWorld))}];
 }));
}
function fixedEqual(rows,label){
 for(const [object,row]of rows){
  assert.equal(geometry(object),row.geometry,`${label}: fixed attributes/index ${object.name}`);
  assert.deepEqual(object.matrixWorld.toArray(),row.matrix,`${label}: fixed world matrix ${object.name}`);
 }
}
function moved(rows,delta,label){
 for(const [object,row]of rows){
  assert.equal(geometry(object),row.geometry,`${label}: actual cap attributes/index ${object.name}`);
  const matrix=object.matrixWorld.toArray();
  for(let i=0;i<16;i++)assert.ok(Math.abs(matrix[i]-row.matrix[i]-(i>=12&&i<=14?delta.getComponent(i-12):0))<1e-8,`${label}: whole physical cap transform ${object.name}`);
  for(let j=0;j<row.indices.length;j++){
   const point=new THREE.Vector3().fromBufferAttribute(object.geometry.attributes.position,row.indices[j]).applyMatrix4(object.matrixWorld);
   assert.ok(point.sub(row.points[j]).distanceTo(delta)<1e-7,`${label}: actual cap vertex ${object.name}`);
  }
 }
}

// Complements the existing visible-surface press/release fixture. Exercise
// partial/full geometry and cancellation on the real Button implementation;
// capacitive areas remain still and latching controls retain their detent.
function checkRigidCancellation(model,buttons,{visibleMesh=null}={}){
 const meshes=physicalMeshes(model),events=[],off=model.on('input',event=>events.push(event));
 let capMeshes=0,fixedMeshChecks=0,visibleSurfaceRays=0;
 try{
  for(const button of buttons){
   const label=`${model.meta.id}/${button.id}`;
   if(button.latching)button.setPosition(0,{immediate:true});
   settle(model);
   const active=meshes.filter(object=>under(object,button.cap)),fixed=meshes.filter(object=>!under(object,button.cap));
   const rest=capture(active),base=capture(fixed),axis=button.axis.clone().transformDirection(button.object3d.matrixWorld);
   if(button.travel>0)assert.ok(active.length,`${label}: real cap geometry required`);
   const ray=()=>{
    const hits=new THREE.Raycaster(new THREE.Vector3(0,0,20),new THREE.Vector3(0,0,-1)).intersectObject(model.root,true).filter(hit=>hit.object.isMesh&&[].concat(hit.object.material).some(material=>material.opacity>.05));
    assert.ok(hits[0]?.object===visibleMesh,`${label}: actual Matrix lens stays first visible surface`);
    visibleSurfaceRays++;return hits[0].point.clone();
   };
   const restPoint=visibleMesh?ray():null;
   const inspect=(depth,stage)=>{
    moved(rest,axis.clone().multiplyScalar(depth),`${label}/${stage}`);fixedEqual(base,`${label}/${stage}`);
    if(visibleMesh)assert.ok(ray().sub(restPoint).distanceTo(axis.clone().multiplyScalar(depth))<1e-7,`${label}: actual visible lens follows ${stage}`);
   };
   events.length=0;
   button.onPointerDown({pointerId:18});button.press('controller-dynamics-external');model.update(.008);model.root.updateMatrixWorld(true);
   const depth=button.getActuationState().depthMm;
   if(button.travel>0)assert.ok(depth>0&&depth<button.travel,`${label}: actual partial travel`);
   inspect(depth,'partial');
   button.onPointerCancel({pointerId:18});assert.equal(button.pressed,true,`${label}: external source retains hold`);settle(model);
   inspect(button.travel,'full');
   button.release('controller-dynamics-external');settle(model);
   assert.equal(button.pressed,false,`${label}: final source releases`);
   assert.deepEqual(events.map(event=>event.action),['down','up'],`${label}: cancellation produces no click`);
   assert.equal(events.at(-1).cancelled,true,`${label}: cancelled up survives until final source releases`);
   inspect(button.latching?button.travel:0,'released');
   if(button.latching){button.setPosition(0,{immediate:true});settle(model);}
   inspect(0,'returned-rest');
   capMeshes+=active.length;fixedMeshChecks+=fixed.length;
  }
 }finally{off();}
 return {status:'pass',controls:buttons.length,capMeshes,fixedMeshChecks,visibleSurfaceRays,partialFullActualGeometry:true,allFixedPhysicalAttributesIndexWorld:true,pointerCancelWhileOtherSourceHolds:true,cancelledFinalReleaseNoClick:true,exactRestOrStableDetent:true};
}

/** No catalog generation, artifact writes, browser/GPU or hardware execution. */
export async function checkControllerDynamics(){
 const catalog=JSON.parse(await readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
 const controllers=catalog.products.filter(product=>product.category==='controller');
 const actual=controllers.flatMap(product=>(product.configurations?.length?product.configurations:[{id:'default',options:{}}]).map(configuration=>[product.id,configuration.id,configuration.options??{}]));
 const expected=[...legacyCases,...nativeCases.map(row=>row.slice(0,3)),...newCases.map(row=>row.slice(0,3))];
 assert.equal(new Set(actual.map(key)).size,actual.length,'Catalog controller/configuration identities are unique');
 assert.deepEqual(actual.map(key).sort(),expected.map(key).sort(),'Every current catalog controller/configuration needs explicit dynamics coverage');
 assert.deepEqual([...new Set(legacyCases.map(([id])=>id))].sort(),Object.keys(DEVICE_BUTTON_COUNTS).sort(),'Legacy fixture coverage must match the selected controller identities');
 for(const row of actual)assert.deepEqual(row[2],expected.find(candidate=>key(candidate)===key(row))[2],`${key(row)}: fixture must use actual catalog options`);
 for(const product of controllers){
  const api=await import(new URL('../'+product.entry,import.meta.url));
  assert.equal(await loadModelClass(product.id),api[product.export],`${product.id}: actual catalog export and public loader identity`);
 }
 const previousDocument=globalThis.document;
 if(!previousDocument){
  const noop=()=>{},ctx=new Proxy({measureText:()=>({width:20}),createRadialGradient:()=>({addColorStop:noop}),createLinearGradient:()=>({addColorStop:noop})},{get:(object,name)=>object[name]??noop,set:(object,name,value)=>(object[name]=value,true)});
  globalThis.document={createElement:()=>({getContext:()=>ctx})};
 }
 const perModel={};
 try{
  for(const [id,configuration,options]of legacyCases){
   const model=await loadModel(id,options);
   try{
    const actuator=checkDeviceActuators(model,{id,expected:configuration==='din'?3:DEVICE_BUTTON_COUNTS[id]});
    const cancellation=checkRigidCancellation(model,model.list('button'));
    (perModel[id]??={configurations:[]}).configurations.push({id:configuration,controls:actuator.buttons,momentary:actuator.momentary,latching:actuator.latching,capacitive:actuator.capacitive,visibleSurfaceRays:actuator.visibleSurfaceRays,cancellation});
   }finally{model.dispose();}
  }
  for(const [id,configuration,,check]of nativeCases){
   const result=await check();assert.equal(result?.status,'pass',`${id}: own current fixture must explicitly pass`);
   const entry={id:configuration,controls:2,status:'pass',ownCurrentNativeFixture:true,partialFullActualGeometry:true,fixedGeometryAndExactReturn:true,multiSourceCancelNoClick:true};
   if(id==='atom-matrix'){
    assert.equal(result.buttons.cancelSuppressesClick,true);assert.equal(result.reset.partialFullActualFrontSideRays,true);
    const model=await loadModel(id);
    try{model.root;entry.rigidMainLens=checkRigidCancellation(model,[model.button('button')],{visibleMesh:model.atomMatrixAssembly.main.lens});}finally{model.dispose();}
   }else if(id==='atom-lite')assert.equal(result.runtime.independentTwoKeysMultiSourceCancelAndSimultaneous,true);
   else{assert.equal(result.actuation.cancelWithoutClick,true);entry.nativeSurfaceRaysPerState=result.actuation.nativeSurfaceRays.raysPerState;}
   perModel[id]={configurations:[entry]};
  }
  for(const [id,configuration,options,check]of newCases){
   const result=await check();assert.equal(result?.status,'pass',`${id}: own current fixture must explicitly pass`);
   const model=await loadModel(id,options);
   try{const controls=model.list('button').length;assert.ok(controls>0);(perModel[id]??={configurations:[]}).configurations.push({id:configuration,controls,status:'pass',ownCurrentModelFixture:true,result});}finally{model.dispose();}
  }
 }finally{if(!previousDocument)delete globalThis.document;}
 return {status:'pass',controllers:controllers.length,configurations:actual.length,controlsAcrossConfigurations:Object.values(perModel).reduce((sum,model)=>sum+model.configurations.reduce((n,c)=>n+c.controls,0),0),perModel,scope:'Current explicit catalog controller/configuration coverage;actual physical press/release/partial/full and fixed geometry,source cancellation and rest/stable detents. Canvas drawing is stubbed. CPU visual-dynamics evidence only;no browser pixels,manufacturing tolerance,electrical,firmware or physical-device acceptance.'};
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkControllerDynamics(),null,2));
