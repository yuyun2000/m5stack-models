import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {loadModel} from '../src/loaders.js';

export const DEVICE_BUTTON_COUNTS={sticks3:3,cores3:2,stopwatch:3,'cardputer-adv':60,'cardputer-zero':48,papermono:3,core2:5,papercolor:4,nanoc6:1,stackchan:5,tab5:2,atoms3r:2,'nesso-n1':2,stamplc:4};
const settle=model=>{for(let i=0;i<80;i++)model.update(1/60);model.root.updateMatrixWorld(true);};
const physicalMeshes=button=>{const meshes=[];button.cap.traverse(o=>{if(o.isMesh&&(Array.isArray(o.material)?o.material:[o.material]).some(m=>m.opacity>.05))meshes.push(o);});return meshes;};
function visiblePoint(meshes,out){
 // Use the outward triangle envelope. On a curved cap, the highest single
 // vertex may be farther than .12 mm from every surface triangle centroid.
 const faces=[];let max=-Infinity;
 for(const mesh of meshes){const ps=mesh.geometry.attributes.position,index=mesh.geometry.index;for(let i=0;i<(index?.count??ps.count);i+=3){const p=Array.from({length:3},(_,k)=>new THREE.Vector3().fromBufferAttribute(ps,index?index.getX(i+k):i+k).applyMatrix4(mesh.matrixWorld)),normal=p[1].clone().sub(p[0]).cross(p[2].clone().sub(p[0])),area=normal.length();if(!area||normal.normalize().dot(out)<.5)continue;const center=p[0].add(p[1]).add(p[2]).multiplyScalar(1/3);faces.push({center,area});max=Math.max(max,center.dot(out));}}
 const sum=new THREE.Vector3();let weight=0;
 for(const {center,area}of faces){if(center.dot(out)<max-.12)continue;sum.addScaledVector(center,area);weight+=area;}
 assert.ok(weight>0,'A physical actuator has an outward visible surface');return sum.multiplyScalar(1/weight);
}
function belongs(object,button){for(let o=object;o;o=o.parent)if(o===button.cap)return true;return false;}

/** Checks actual visible vertex movement, not only the empty Button Group. */
export function checkDeviceActuators(model,{id=model.meta.id.split('.').at(-1),expected=DEVICE_BUTTON_COUNTS[id]}={}){
 model.root.updateMatrixWorld(true);const buttons=model.list('button');assert.equal(buttons.length,expected,`${id}: all physical controls plus declared touch targets are present`);
 let momentary=0,latching=0,capacitive=0,visibleRays=0;const fixed=new Map();const moving=o=>buttons.some(b=>belongs(o,b));for(const part of Object.values(model.parts??{}))if(!moving(part))fixed.set(part,part.matrixWorld.clone());
 // A local shell-exterior ray checks the cap against its fixed molding. On an
 // assembled StackChan a distant bottom-normal ray first crosses the separate
 // base; that is real scene occlusion, not a second static cap at the key face.
 const cast=(point,out)=>new THREE.Raycaster(point.clone().addScaledVector(out,3),out.clone().negate()).intersectObject(model.root,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0)[0];
 for(const button of buttons){
  if(button.travel===0){assert.equal(button.meta.actuation,'capacitive',`${id}/${button.id}: zero travel is reserved for actual capacitive areas`);button.press('actuator-check');settle(model);assert.equal(button.cap.position.length(),0);button.release('actuator-check');settle(model);capacitive++;continue;}
  const meshes=physicalMeshes(button);assert.ok(meshes.length,`${id}/${button.id}: no movement may be credited to a transparent hit plane`);
  const sample=meshes[0],vertex=new THREE.Vector3().fromBufferAttribute(sample.geometry.attributes.position,0),before=sample.localToWorld(vertex.clone()),axis=button.axis.clone().transformDirection(button.object3d.matrixWorld),expectedDelta=axis.clone().multiplyScalar(button.travel),out=axis.clone().negate();
  let rayBefore,point;if(!button.latching){point=visiblePoint(meshes,out);rayBefore=cast(point,out);assert.ok(rayBefore&&belongs(rayBefore.object,button),`${id}/${button.id}: physical cap is externally visible, found ${rayBefore?.object.name}`);assert.ok(axis.dot(new THREE.Box3().setFromObject(model.root).getCenter(new THREE.Vector3()).sub(point))>0,`${id}/${button.id}: travel points inward`);}
  button.press('actuator-check');settle(model);const after=sample.localToWorld(vertex.clone());assert.ok(after.clone().sub(before).distanceTo(expectedDelta)<2e-5,`${id}/${button.id}: actual visible mesh moves by its full physical travel`);
  if(button.latching){assert.equal(button.position,1);button.release('actuator-check');settle(model);assert.ok(sample.localToWorld(vertex.clone()).distanceTo(after)<1e-6,`${id}/${button.id}: detent must remain stable after release`);button.setPosition(0);settle(model);latching++;}
  else{const rayAfter=cast(point,out);assert.ok(rayAfter&&belongs(rayAfter.object,button),`${id}/${button.id}: moving cap must remain in front of its recessed backing; found ${rayAfter?.object.name}`);assert.ok(rayAfter.point.clone().sub(rayBefore.point).distanceTo(expectedDelta)<2e-4,`${id}/${button.id}: fixed duplicate geometry must not cover the depressed native face`);visibleRays+=2;button.release('actuator-check');settle(model);momentary++;}
  assert.ok(sample.localToWorld(vertex.clone()).distanceTo(before)<1e-6,`${id}/${button.id}: exact visible rest position restored`);
  for(const [part,matrix]of fixed)assert.deepEqual(part.matrixWorld.elements,matrix.elements,`${id}: pressing ${button.id} cannot move the fixed enclosure`);
 }
 return {status:'pass',buttons:buttons.length,momentary,latching,capacitive,visibleSurfaceRays:visibleRays,scope:'actual cap vertices and visible press/release surfaces; geometry-only travel estimates'};
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 const noop=()=>{},ctx=new Proxy({measureText:()=>({width:20}),createRadialGradient:()=>({addColorStop:noop}),createLinearGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});globalThis.document={createElement:()=>({getContext:()=>ctx})};
 for(const id of Object.keys(DEVICE_BUTTON_COUNTS)){const model=await loadModel(id);try{console.log(`PASS ${id} actuators:`,JSON.stringify(checkDeviceActuators(model,{id})));}finally{model.dispose();}}
 const din=await loadModel('cores3',{dinBase:true});try{console.log('PASS cores3 + DinBase actuators:',JSON.stringify(checkDeviceActuators(din,{id:'cores3-din',expected:3})));}finally{din.dispose();}
}
