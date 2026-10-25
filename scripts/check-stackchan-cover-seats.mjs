import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';

const EPS=.002,ROUND=1e4;
const near=(actual,expected,why,tolerance=EPS)=>assert.ok(Math.abs(actual-expected)<tolerance,`${why}: ${actual} / ${expected}`);
const radiusNear=(feature,radius)=>Math.abs(feature.radius-radius)<.003;

function fitCircle(points){
 const mean=points.reduce((sum,p)=>[sum[0]+p[0]/points.length,sum[1]+p[1]/points.length],[0,0]);
 let xx=0,xy=0,yy=0,xr=0,yr=0,square=0;
 for(const point of points){const x=point[0]-mean[0],y=point[1]-mean[1],r=x*x+y*y;xx+=x*x;xy+=x*y;yy+=y*y;xr+=x*r;yr+=y*r;square+=r;}
 const determinant=xx*yy-xy*xy;if(Math.abs(determinant)<1e-12)return null;
 const x=(xr*yy-yr*xy)/(2*determinant),y=(yr*xx-xr*xy)/(2*determinant),center=[mean[0]+x,mean[1]+y],radius=Math.sqrt(square/points.length+x*x+y*y);
 const errors=points.map(point=>Math.abs(Math.hypot(point[0]-center[0],point[1]-center[1])-radius));
 return {center,radius,maxError:Math.max(...errors),rms:Math.sqrt(errors.reduce((sum,error)=>sum+error*error,0)/errors.length)};
}

/** Extract boundary loops of actual axis-aligned planar triangles, then fit
 * their vertices. No source binary, CAD map, position delta or private report
 * is used. Planes and hole centres are discovered from the runtime mesh. */
function circularFeatures(mesh,axis){
 const position=mesh.geometry.attributes.position,index=mesh.geometry.index,uv=[0,1,2].filter(component=>component!==axis),planes=new Map();
 for(let i=0;i<(index?.count??position.count);i+=3){
  const points=[0,1,2].map(offset=>new THREE.Vector3().fromBufferAttribute(position,index?index.getX(i+offset):i+offset));
  const coordinates=points.map(point=>point.getComponent(axis));if(Math.max(...coordinates)-Math.min(...coordinates)>2e-5)continue;
  const value=coordinates.reduce((sum,n)=>sum+n,0)/3,key=Math.round(value*ROUND);
  let plane=planes.get(key);if(!plane){plane={sum:0,triangles:0,vertices:new Map(),edges:new Map()};planes.set(key,plane);}
  plane.sum+=value;plane.triangles++;
  const keys=points.map(point=>uv.map(component=>Math.round(point.getComponent(component)*ROUND)).join(','));
  points.forEach((point,j)=>plane.vertices.set(keys[j],uv.map(component=>point.getComponent(component))));
  for(let j=0;j<3;j++){const a=keys[j],b=keys[(j+1)%3];if(a===b)continue;const edge=[a,b].sort().join(';');plane.edges.set(edge,(plane.edges.get(edge)??0)+1);}
 }
 const features=[];
 for(const plane of planes.values()){
  const adjacency=new Map();for(const [edge,count]of plane.edges)if(count===1){const [a,b]=edge.split(';');for(const [from,to]of [[a,b],[b,a]]){if(!adjacency.has(from))adjacency.set(from,new Set());adjacency.get(from).add(to);}}
  const visited=new Set();for(const start of adjacency.keys()){
   if(visited.has(start))continue;const queue=[start],keys=[];while(queue.length){const key=queue.pop();if(visited.has(key))continue;visited.add(key);keys.push(key);for(const next of adjacency.get(key)??[])if(!visited.has(next))queue.push(next);}
   if(keys.length<12||keys.some(key=>adjacency.get(key).size!==2))continue;
   const fit=fitCircle(keys.map(key=>plane.vertices.get(key)));if(!fit||fit.maxError>.001||fit.radius<.7||fit.radius>1.3)continue;
   const center=new THREE.Vector3();center.setComponent(axis,plane.sum/plane.triangles);uv.forEach((component,j)=>center.setComponent(component,fit.center[j]));
   features.push({mesh,axis,plane:plane.sum/plane.triangles,center,radius:fit.radius,vertices:keys.length,maxError:fit.maxError,rms:fit.rms});
  }
 }
 return features;
}

const worldCenter=feature=>feature.mesh.localToWorld(feature.center.clone());
const worldAxis=feature=>new THREE.Vector3().setComponent(feature.axis,1).transformDirection(feature.mesh.matrixWorld);
function coaxial(a,b,label){
 const axis=worldAxis(b),delta=worldCenter(a).sub(worldCenter(b));
 assert.ok(Math.abs(worldAxis(a).dot(axis))>1-1e-8,`${label}: extracted hole-plane normals remain parallel`);
 const error=delta.clone().cross(axis).length();assert.ok(error<EPS,`${label}: extracted bore axes differ by ${error} mm`);return {error,gap:delta.dot(axis)};
}
function twoFaces(features,radius,label){
 const selected=features.filter(feature=>radiusNear(feature,radius)).sort((a,b)=>a.plane-b.plane);
 assert.equal(selected.length,2,`${label}: two closed circular source rims are required`);near(selected[1].plane-selected[0].plane,1,`${label}: original 1 mm cover wall`);
 near(selected[0].center.distanceTo(selected[1].center),1,`${label}: rims describe a straight through bore`);return selected;
}
function mate(feature,features,radius,label){
 const candidates=features.filter(candidate=>radiusNear(candidate,radius));assert.ok(candidates.length>0,`${label}: original smaller cradle bore exists`);
 candidates.sort((a,b)=>worldCenter(a).distanceToSquared(worldCenter(feature))-worldCenter(b).distanceToSquared(worldCenter(feature)));
 const found=candidates[0];coaxial(feature,found,label);assert.ok(feature.radius-found.radius>.15,`${label}: cover clearance bore stays larger than cradle bore`);return found;
}
function doubleSided(mesh){
 const proxy=new THREE.Mesh(mesh.geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));proxy.matrixAutoUpdate=false;proxy.matrix.copy(mesh.matrixWorld);proxy.updateMatrixWorld(true);return proxy;
}
const ray=(mesh,origin,direction,far)=>new THREE.Raycaster(origin,direction,0,far).intersectObject(mesh,false);
const summary=feature=>({part:feature.mesh.name,axis:feature.axis,planeMm:feature.plane,centerMm:feature.center.toArray(),radiusMm:feature.radius,vertices:feature.vertices,maxCircleErrorMm:feature.maxError});

/** Relative registration and local fittings only. No hidden fit/volume claim. */
export async function checkStackChanCoverSeats(){
 const previous=Object.getOwnPropertyDescriptor(globalThis,'document');
 if(!globalThis.document){const noop=()=>{},ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(object,key)=>object[key]??noop});Object.defineProperty(globalThis,'document',{configurable:true,writable:true,value:{createElement:()=>({getContext:()=>ctx})}});}
 let model;const proxies=[];
 try{
  const {StackChan}=await import('../src/devices/stackchan/index.js');model=new StackChan();model.root.updateMatrixWorld(true);
  const white=model.parts['servo-rear-cover'],gray=model.parts['servo-side-cover'],cradle=model.parts['neck-cradle'];
  assert.ok(!!white&&!!gray&&!!cradle,'Actual runtime cover and cradle meshes exist');
  for(const mesh of [white,gray,cradle])assert.ok(mesh.userData.source==='official-structure','Seat checks use retained official runtime surfaces');
  const whiteFeatures=circularFeatures(white,0),grayFeatures=circularFeatures(gray,2),sideFeatures=circularFeatures(cradle,0),rearFeatures=circularFeatures(cradle,2),pairs=[];
  for(const [radius,cradleRadius,label,gap]of [[1.1,.915377,'white front',0],[1.05,.849886,'white rear',.1]]){
   const faces=twoFaces(whiteFeatures,radius,label),cradleHole=mate(faces[0],sideFeatures,cradleRadius,label);
   near(coaxial(faces[0],cradleHole,label).gap,gap,`${label}: original stepped mating-face separation`);pairs.push({label,faces,cradle:cradleHole,gap});
  }
  near(pairs[0].faces[0].center.distanceTo(pairs[1].faces[0].center),28.5,'White source-hole spacing, independent of cover translation');
  const grayRims=grayFeatures.filter(feature=>radiusNear(feature,1.1));assert.equal(grayRims.length,4,'Two gray ear through-bores have two actual circular rims each');
  const grayPlanes=[...new Set(grayRims.map(feature=>Math.round(feature.plane*ROUND)))].sort((a,b)=>a-b);assert.equal(grayPlanes.length,2);
  const outer=grayRims.filter(feature=>Math.abs(feature.plane-grayPlanes[0]/ROUND)<EPS).sort((a,b)=>a.center.x-b.center.x),inner=grayRims.filter(feature=>Math.abs(feature.plane-grayPlanes[1]/ROUND)<EPS).sort((a,b)=>a.center.x-b.center.x);
  assert.equal(outer.length,2);assert.equal(inner.length,2);near(inner[0].center.distanceTo(inner[1].center),22,'Gray original ear-hole spacing');
  for(let i=0;i<2;i++){
   const label=`gray ${i?'right':'left'}`,faces=[outer[i],inner[i]],cradleHole=mate(inner[i],rearFeatures,.849887,label);
   near(inner[i].plane-outer[i].plane,1,`${label}: original ear thickness`);near(coaxial(inner[i],cradleHole,label).gap,0,`${label}: ear and cradle original mating planes meet`);coaxial(outer[i],cradleHole,label);pairs.push({label,faces,cradle:cradleHole,gap:0,innerFace:1});
  }
  const grayProxy=doubleSided(gray),cradleProxy=doubleSided(cradle);proxies.push(grayProxy,cradleProxy);let seatRays=0;
  for(let i=0;i<2;i++){
   const hole=outer[i],direction=worldAxis(hole),radial=new THREE.Vector3(1,0,0).transformDirection(gray.matrixWorld),at=worldCenter(hole);
   assert.equal(ray(grayProxy,at.clone().addScaledVector(radial,.8).addScaledVector(direction,-.5),direction,2).length,0,'Gray ear retains the real open bore at radius .8 mm');seatRays++;
   const hit=ray(grayProxy,at.clone().addScaledVector(radial,1.35).addScaledVector(direction,-.5),direction,2)[0];assert.ok(!!hit,'Gray original ear has an actual annular screw seat');near(hit.point.clone().sub(at).dot(direction),0,'Screw seat is the fitted outer ear plane');seatRays++;
  }
  const fittings=model.root.getObjectByName('Neck lower rear fittings');assert.ok(!!fittings);
  const screws=fittings.children.filter(object=>object.isGroup&&object.children.some(child=>child.geometry?.type==='CircleGeometry'&&Math.abs(child.geometry.parameters.radius-1.5)<1e-6));assert.equal(screws.length,2,'Two actual screw-head assemblies are checked');
  const screwPairs=[];
  for(const screw of screws){const center=screw.getWorldPosition(new THREE.Vector3()),hole=outer.slice().sort((a,b)=>worldCenter(a).distanceToSquared(center)-worldCenter(b).distanceToSquared(center))[0],axis=worldAxis(hole),delta=center.clone().sub(worldCenter(hole));
   assert.ok(delta.clone().cross(axis).length()<EPS,'Screw head centres follow extracted source bores');near(delta.dot(axis),-.01,'Screw head is 0.01 mm outside the real recessed ear seat');assert.ok(new THREE.Vector3(0,0,1).transformDirection(screw.matrixWorld).dot(axis)<-.99999,'Screw head faces out of the seated cover');screwPairs.push({screw,hole});
  }
  const insert=model.root.getObjectByName('Cradle central window appearance insert');assert.ok(!!insert,'Real central-window fitting exists');insert.geometry.computeBoundingBox();assert.ok(insert.geometry.boundingBox.max.z-insert.geometry.boundingBox.min.z>.2,'Window fitting has physical depth');
  const back=insert.geometry.boundingBox.min.z;let apertureRays=0;
  for(const x of [-.55,0,.55])for(const y of [-1.1,0,1.1]){const at=insert.localToWorld(new THREE.Vector3(x,y,back)),direction=new THREE.Vector3(0,0,1).transformDirection(insert.matrixWorld);assert.equal(ray(cradleProxy,at.clone().addScaledVector(direction,-1),direction,1.4).length,0,'Actual source window is open around the fitting, not a surface painted over plastic');apertureRays++;}
  let poses=0,axisChecks=0,maxAxisError=0;
  for(const yaw of [0,35,90,180,270])for(let pitch=0;pitch<=90;pitch+=5){
   model.get('yaw').setAngle(yaw);model.get('pitch').setAngle(pitch);model.update(0);model.root.updateMatrixWorld(true);
   for(const pair of pairs){for(const face of pair.faces){maxAxisError=Math.max(maxAxisError,coaxial(face,pair.cradle,`${pair.label} yaw${yaw}/pitch${pitch}`).error);axisChecks++;}near(coaxial(pair.faces[pair.innerFace??0],pair.cradle,pair.label).gap,pair.gap,'Cover seat cannot float along its own bore axis');}
   for(const {screw,hole}of screwPairs){const delta=screw.getWorldPosition(new THREE.Vector3()).sub(worldCenter(hole)),axis=worldAxis(hole);assert.ok(delta.clone().cross(axis).length()<EPS);near(delta.dot(axis),-.01,'Screw stays on the same source ear seat through articulation');}
   poses++;
  }
  return {status:'pass',holePairs:4,extractedCircularRims:pairs.reduce((sum,pair)=>sum+pair.faces.length+1,0),pairs:pairs.map(pair=>({label:pair.label,coverRims:pair.faces.map(summary),cradleRim:summary(pair.cradle),matingPlaneGapMm:pair.gap})),poseCount:poses,axisChecks,maxAxisErrorMm:maxAxisError,grayEarSeatRays:seatRays,sourceWindowRays:apertureRays,screwHeads:2,scope:'Relative cover/cradle registration from closed planar boundary loops and circle fits of actual runtime meshes, original unequal bore radii and local fittings. No private files, position-delta assertions, dense volume sampling, global cradle/head datum, hidden servo/board fit, tolerances or manufacturing/physics acceptance.'};
 }finally{for(const proxy of proxies)proxy.material.dispose();model?.dispose();if(previous)Object.defineProperty(globalThis,'document',previous);else delete globalThis.document;}
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log('PASS StackChan cover seats:',JSON.stringify(await checkStackChanCoverSeats()));
