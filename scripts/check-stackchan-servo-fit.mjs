import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import data from '../src/devices/stackchan/geometry-data.js';
import {addCadParts} from '../src/modeling/cad.js';
const direction=new THREE.Vector3(.743,.431,.509).normalize();
const inside=(point,target)=>{
 if(!target.geometry.boundingBox)target.geometry.computeBoundingBox();
 if(!target.geometry.boundingBox.containsPoint(point))return false;
 const hits=new THREE.Raycaster(point,direction).intersectObject(target,true).filter((h,i,a)=>!i||Math.abs(h.distance-a[i-1].distance)>1e-5);
 return hits.length%2===1;
};
const voxelPoints=(mesh,stepMm)=>{
 const reference=new THREE.Mesh(mesh.geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));reference.updateMatrixWorld(true);mesh.geometry.computeBoundingBox();
 const {min,max}=mesh.geometry.boundingBox,points=[];
 for(let x=min.x+stepMm/2;x<max.x;x+=stepMm)for(let y=min.y+stepMm/2;y<max.y;y+=stepMm)for(let z=min.z+stepMm/2;z<max.z;z+=stepMm){const point=new THREE.Vector3(x,y,z);if(inside(point,reference))points.push(point);}
 reference.material.dispose();return points;
};
/** Offline fit diagnostic. A residual is reported, never treated as a passed
 * manufacturing fit. --candidate-xy evaluates an unmerged cover-seat fixture. */
export function inspectStackChanServoFit(model,{candidateXY=false,stepMm=1}={}){
 model.root.updateMatrixWorld(true);assert.equal(model.get('pitch').angleDeg,0);assert.equal(model.get('yaw').angleDeg,0);
 const sourceBody=new THREE.Group(),source=addCadParts({body:sourceBody},data);for(const mesh of Object.values(source)){mesh.material=mesh.material.clone();mesh.material.side=THREE.DoubleSide;}sourceBody.updateMatrixWorld(true);
 const covers=['servo-rear-cover','servo-side-cover'],original=covers.map(name=>model.parts[name].position.clone());
 if(candidateXY){model.parts[covers[0]].position.add(new THREE.Vector3(-.25,3.1,0));model.parts[covers[1]].position.add(new THREE.Vector3(-.25,-2.1,0));model.root.updateMatrixWorld(true);}
 try{
  const servo=model.stackchanAssembly.mechanics.pitchServo,targets=['neck-cradle',...covers],components=[];
  for(const side of ['front','rear'])assert.ok(servo.group.getObjectByName(`Pitch servo body ${side} mounting ear`),'actual independent end tab');
  assert.equal(servo.group.getObjectByName('Pitch servo body mounting ears'),undefined,'no full rectangular ear plate across the case');
  assert.deepEqual(servo.group.userData.caseMm,[23.3,11,25.25]);
  for(const side of ['front','rear']){const ear=servo.group.getObjectByName(`Pitch servo body ${side} mounting ear`),hole=ear.userData.holeXmm-ear.position.x;
   const origin=ear.localToWorld(new THREE.Vector3(hole,0,-2)),normal=new THREE.Vector3(0,0,1).transformDirection(ear.matrixWorld);assert.equal(new THREE.Raycaster(origin,normal).intersectObject(ear,true).length,0,'ear mounting hole remains open');}
  servo.group.traverse(mesh=>{if(mesh.isMesh&&/(motor case|gearbox shoulder|rounded gearbox cap|front mounting ear|rear mounting ear)$/.test(mesh.name))components.push({mesh,points:voxelPoints(mesh,stepMm)});});
  const residuals=[];for(const {mesh,points}of components)for(const name of targets){const inverse=model.parts[name].matrixWorld.clone().invert(),bad=[];
   for(const point of points){const world=mesh.localToWorld(point.clone()),neutral=world.clone().applyMatrix4(inverse);if(inside(neutral,source[name]))bad.push(world);}
   if(bad.length){const box=new THREE.Box3().setFromPoints(bad);residuals.push({part:mesh.name,plastic:name,occupiedVoxelSamples:bad.length,estimatedOverlapMm3:bad.length*stepMm**3,worldSampleBounds:{min:box.min.toArray(),max:box.max.toArray()}});}}
  const adapter=model.root.getObjectByName('Neck Adapter PCB'),ps=adapter.geometry.attributes.position,seen=new Set(),adapterConflicts=[];adapter.geometry.computeBoundingBox();const bounds=adapter.geometry.boundingBox,coverInverse=model.parts['servo-rear-cover'].matrixWorld.clone().invert();
  for(let i=0;i<ps.count;i++)for(const z of [bounds.min.z+.05,(bounds.min.z+bounds.max.z)/2,bounds.max.z-.05]){
   const point=new THREE.Vector3().fromBufferAttribute(ps,i);point.z=z;const key=point.toArray().map(n=>n.toFixed(4)).join(',');if(seen.has(key))continue;seen.add(key);const world=adapter.localToWorld(point),neutral=world.clone().applyMatrix4(coverInverse);if(inside(neutral,source['servo-rear-cover']))adapterConflicts.push(world.toArray());}
  return {status:residuals.length||adapterConflicts.length?'fit-unresolved':'sample-clearance-only',runtimeChanged:false,fixture:candidateXY?'unmerged cover XY candidate':'current runtime; independent two-end ears',stepMm,voxelMethod:'centre occupancy inside actual mesh and unchanged source plastic; per-mesh approximate volume, not union volume or continuous proof',sampledServoVoxels:components.reduce((n,c)=>n+c.points.length,0),earTopologyAssertions:'pass',residuals,adapterCover:{sampleCount:seen.size,containedSamples:adapterConflicts.length,firstWorldPoint:adapterConflicts[0]??null},limits:['No official assembled motor/PCB STEP or seat dimensions are available.','Case centre offset, cap outline and concealed mounting are drawing/photo reconstructions.','Unchanged yaw/pitch axes and physical servo dimensions; no source shell cut or scale.','Candidate cover XY is excluded from runtime because it conflicts with the unconfirmed Adapter seat.']};
 }finally{covers.forEach((name,i)=>model.parts[name].position.copy(original[i]));model.root.updateMatrixWorld(true);for(const mesh of Object.values(source)){mesh.geometry.dispose();mesh.material.dispose();}}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 const noop=()=>{},ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop}),measureText:()=>({width:20})},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});globalThis.document={createElement:()=>({getContext:()=>ctx})};
 const {StackChan}=await import('../src/devices/stackchan/index.js');const model=new StackChan();try{const report=inspectStackChanServoFit(model,{candidateXY:process.argv.includes('--candidate-xy')});console.log(JSON.stringify(report,null,2));if(process.argv.includes('--strict')&&report.status==='fit-unresolved')process.exitCode=2;}finally{model.dispose();}
}
