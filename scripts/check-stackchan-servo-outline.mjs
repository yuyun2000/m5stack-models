import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';

/** Source-profile regression; default execution needs no private PDF or image. */
export async function checkStackChanServoOutline(){
 const previous=globalThis.document,installed=!previous;
 if(installed){const noop=()=>{},ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});globalThis.document={createElement:()=>({getContext:()=>ctx})};}
 let model;
 try{
  const {StackChan}=await import('../src/devices/stackchan/index.js');model=new StackChan();model.root.updateMatrixWorld(true);
  let probes=0;const caps=[];
  for(const name of ['Pitch','Yaw']){
   const group=model.root.getObjectByName(`${name} servo body`),cap=group.getObjectByName(`${name} servo body rounded gearbox cap`),body=group.getObjectByName(`${name} servo body motor case`);
   assert.ok(cap&&body);cap.geometry.computeBoundingBox();const box=cap.geometry.boundingBox,size=box.getSize(new THREE.Vector3());
   assert.ok(Math.abs(size.y-11)<.02,'drawing keeps full 11 mm width at the output gear');
   assert.ok(box.min.x< -5.48&&box.min.x> -5.52);assert.ok(box.max.x>8.45&&box.max.x<8.55,'drawing small-gear end is about 8.5 mm from output centre');
   const reference=new THREE.Mesh(cap.geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));reference.updateMatrixWorld(true);
   const hit=(x,y)=>!!new THREE.Raycaster(new THREE.Vector3(x,y,-1),new THREE.Vector3(0,0,1)).intersectObject(reference)[0];
   // Independently selected interior/exterior points from the official p6
   // top-view silhouette. Equal-radius stadium geometry fails the last row.
   for(const [x,y]of [[0,0],[-5.2,0],[5.7,0],[7.9,0],[5.7,2.4],[2,4.6]]){assert.ok(hit(x,y),`${name}: source-profile interior ${x},${y}`);probes++;}
   for(const [x,y]of [[8.9,0],[-5.7,0],[5.7,4],[8,3.8],[2,5.4]]){assert.ok(!hit(x,y),`${name}: source-profile exterior ${x},${y}`);probes++;}
   reference.material.dispose();body.geometry.computeBoundingBox();const bodySize=body.geometry.boundingBox.getSize(new THREE.Vector3());
   assert.ok(Math.abs(bodySize.x-23.3)<.001&&Math.abs(bodySize.y-11)<.001&&Math.abs(bodySize.z-16.8)<.001,'main physical case dimensions unchanged');
   assert.ok(group.getObjectByName(`${name} servo body front mounting ear`)&&group.getObjectByName(`${name} servo body rear mounting ear`));
   assert.ok(cap.scale.equals(new THREE.Vector3(1,1,1)),'profile is constructed, not scaled to clear another part');caps.push({name,profileMm:size.toArray(),bounds:{min:box.min.toArray(),max:box.max.toArray()}});
  }
  return {status:'pass',source:'Official linked SCS0009.pdf p6 top-view unequal-radius outline',servoCaps:2,profileProbes:probes,caps,physicalCaseDimensionsUnchanged:true,scope:'Source-supported silhouette correction only; small radius and depth/hidden steps inferred. Existing complete installation/servo fit remains unconfirmed.'};
 }finally{model?.dispose();if(installed)delete globalThis.document;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkStackChanServoOutline(),null,2));
