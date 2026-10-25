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
  let probes=0;const caps=[],shafts=[];
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
   const output=model.stackchanAssembly.mechanics[name==='Pitch'?'pitchServo':'yawServo'].output,shaft=output.getObjectByName(`${name} servo body splined output`),outputInverse=output.matrixWorld.clone().invert(),points=[];
   assert.ok(shaft,'rendered output shaft exists');
   output.traverse(part=>{if(!part.isMesh)return;const ps=part.geometry.attributes.position;for(let i=0;i<ps.count;i++)points.push(part.localToWorld(new THREE.Vector3().fromBufferAttribute(ps,i)).applyMatrix4(outputInverse));});
   const radii=points.map(p=>Math.hypot(p.x,p.y)),maxRadius=Math.max(...radii),bounds=new THREE.Box3().setFromPoints(points),length=bounds.max.z-bounds.min.z;
   assert.ok(Math.abs(maxRadius-1.975)<1e-5,`${name}: all rendered tooth vertices stay within the annotated OD3.95`);
   assert.ok(Math.abs(length-3.2)<1e-5&&Math.abs(bounds.min.z)<1e-5&&Math.abs(bounds.max.z-3.2)<1e-5,`${name}: real vertices retain the 3.2 mm shaft from the output face`);
   const radialReference=new THREE.Mesh(shaft.geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));radialReference.updateMatrixWorld(true);const radial=[];
   // Sample actual side triangles, then count separated high-radius bands.
   // This detects a cylinder, missing teeth and a wrong tooth period without
   // depending on the implementation's constants or userData tooth count.
   for(let i=0;i<720;i++){const angle=i*Math.PI/360,hit=new THREE.Raycaster(new THREE.Vector3(0,0,1.6),new THREE.Vector3(Math.cos(angle),Math.sin(angle),0)).intersectObject(radialReference)[0];assert.ok(hit,`${name}: output profile encloses each sampled radial direction`);radial.push(hit.distance);}
   radialReference.material.dispose();const minimumRadius=Math.min(...radial),maximumRadius=Math.max(...radial),threshold=(minimumRadius+maximumRadius)/2,high=radial.map(r=>r>threshold),toothStarts=[];
   assert.ok(maximumRadius-minimumRadius>.1&&maximumRadius-minimumRadius<.35,`${name}: visible spline relief remains a bounded appearance approximation`);
   for(let i=0;i<high.length;i++)if(high[i]&&!high[(i+high.length-1)%high.length])toothStarts.push(i);
   assert.equal(toothStarts.length,20,`${name}: actual radial profile has twenty separate tooth-tip bands`);
   const periods=toothStarts.map((start,i)=>(toothStarts[(i+1)%toothStarts.length]+(i===toothStarts.length-1?720:0)-start)*.5);
   for(const period of periods)assert.ok(Math.abs(period-18)<.51,`${name}: tooth-tip bands repeat every 18 degrees`);
   shafts.push({name,maximumVertexRadiusMm:maxRadius,maximumVertexDiameterMm:maxRadius*2,lengthMm:length,axialBoundsMm:[bounds.min.z,bounds.max.z],radialSamples:radial.length,minimumSampledRadiusMm:minimumRadius,maximumSampledRadiusMm:maximumRadius,toothTipBands:toothStarts.length,periodDeg:periods[0],scope:'Annotated external envelope and twenty-fold rendered relief; root radius/flanks are appearance approximations, not a spline-fit tolerance'});
  }
  return {status:'pass',source:'Official linked SCS0009.pdf p6 cap outline and 20T OD3.95 / 3.2 mm output dimensions',servoCaps:2,profileProbes:probes,caps,shafts,physicalCaseDimensionsUnchanged:true,scope:'Source-supported silhouette and output-envelope correction only; small cap radius, spline root/flanks and hidden steps inferred. Existing complete installation/servo fit remains unconfirmed.'};
 }finally{model?.dispose();if(installed)delete globalThis.document;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkStackChanServoOutline(),null,2));
