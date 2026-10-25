import assert from 'node:assert/strict';
import * as THREE from 'three';
import {loadModel} from '../src/loaders.js';

// Canvas is only needed for legacy labels. This check inspects actual 3D intersections.
const noop=()=>{};
const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});
globalThis.document={createElement:()=>({getContext:()=>ctx})};
let sockets=0;
for(const id of ['sticks3','atoms3r','cores3','stopwatch','tab5','cardputer-adv','nesso-n1','cardputer-zero']){
 const model=await loadModel(id);model.root.updateMatrixWorld(true);
 const headers=[];model.root.traverse(o=>{if(o.userData.visualFamily==='female-header')headers.push(o);});
 assert.ok(headers.length>0,`${id}: expansion headers present`);
 for(const h of headers){
  const {cols,rows,pitch}=h.userData.layout;
  const cast=(x,y)=>new THREE.Raycaster(h.localToWorld(new THREE.Vector3(x,y,4)),new THREE.Vector3(0,0,-1).transformDirection(h.matrixWorld)).intersectObject(model.root,true).filter(hit=>hit.object.isMesh&&hit.object.material?.opacity!==0);
  for(let c=0;c<cols;c++)for(let r=0;r<rows;r++){
   const x=(c-(cols-1)/2)*pitch,y=(r-(rows-1)/2)*pitch,center=cast(x,y)[0];
   assert.ok(center?.object.name==='Header socket floor',`${id}: header ${h.position.toArray()} bore ${c},${r} obstructed by ${center?.object.name}`);
   const floor=h.worldToLocal(center.point.clone());assert.ok(floor.z< -1.4&&floor.z> -1.8,`${id}: socket must have real depth`);
   const spring=cast(x+pitch*.4*.34,y)[0];assert.ok(spring?.object.name==='Header spring contact',`${id}: spring contact visible inside socket`);
   const face=cast(x+pitch*.43,y)[0];assert.ok(face?.object.name==='Header molded housing',`${id}: solid wall separates sockets`);
   sockets++;
  }
 }
 console.log(`PASS ${id}: ${headers.length} header bodies; recessed openings and metal contacts`);
 model.dispose();
}
console.log(`Checked ${sockets} actual expansion receptacles in assembled models.`);
