import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
export function inspect(geo){const p=geo.attributes.position,index=geo.index?.array,edges=new Map();const coordinate=i=>[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5));const key=v=>v.join(',');let signedVolume=0;
for(let n=0;n<(index?.length??p.count);n+=3){const idx=[0,1,2].map(k=>index?index[n+k]:n+k),f=idx.map(i=>key(coordinate(i))),[a,b,c]=idx.map(i=>[p.getX(i),p.getY(i),p.getZ(i)]);signedVolume+=(a[0]*(b[1]*c[2]-b[2]*c[1])+a[1]*(b[2]*c[0]-b[0]*c[2])+a[2]*(b[0]*c[1]-b[1]*c[0]))/6;for(let j=0;j<3;j++){const a=f[j],b=f[(j+1)%3];if(a===b)continue;const id=a<b?a+'|'+b:b+'|'+a,item=edges.get(id)??{incidence:0,directionSum:0};item.incidence++;item.directionSum+=a<b?1:-1;edges.set(id,item);}}
const bad=[...edges].filter(([,v])=>v.incidence!==2||v.directionSum!==0).map(([edge,v])=>({endpointsMm:edge.split('|').map(s=>s.split(',').map(v=>Number(v)/1e5)),...v}));return{triangles:(index?.length??p.count)/3,quantizationMm:.00001,signedVolumeMm3:signedVolume,uniqueCoordinateEdges:edges.size,nonClosedOrMisdirectedEdges:bad.length,incidenceOneEdges:bad.filter(e=>e.incidence===1).length,otherEdgeFailures:bad.filter(e=>e.incidence!==1).length,allFailuresAtLowerCapBoundary:bad.every(e=>e.endpointsMm.every(v=>Math.abs(v[1]+1.225)<1e-5&&(Math.abs(v[2])<1e-5||Math.abs(v[2]-7.6)<1e-5))),badEdges:bad};}

export async function checkTerminalTongueClosure(){
 const checks=[];
 for(const id of ['ac-measure','ain4-20ma','bldc-driver']){
  const {TerminalPlug,spec}=await import(`../src/units/${id}/index.js`),plug=new TerminalPlug();
  try{
   plug.root.updateMatrixWorld(true);const tongue=plug.terminalPlugAssembly.tongue,closure=inspect(tongue.geometry);
   assert.equal(closure.nonClosedOrMisdirectedEdges,0,`${id} tongue has paired opposite edges`);assert.ok(closure.signedVolumeMm3>0,`${id} outward material volume`);assert.equal(tongue.material.side,THREE.FrontSide);
   const q=tongue.getWorldQuaternion(new THREE.Quaternion());let wallRays=0,axialRays=0;
   for(const x of spec.terminal.pinX){
    for(const d of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0]]){const origin=tongue.localToWorld(new THREE.Vector3(x,-.725,3.8)),dir=new THREE.Vector3(...d).applyQuaternion(q),hits=new THREE.Raycaster(origin,dir).intersectObject(tongue,false);assert.ok(hits.length&&hits[0].distance>0&&hits[0].distance<.81,`${id} FrontSide bore wall`);wallRays++;}
    for(const [z,d] of [[-3,[0,0,1]],[10.6,[0,0,-1]]]){const origin=tongue.localToWorld(new THREE.Vector3(x,-.725,z)),dir=new THREE.Vector3(...d).applyQuaternion(q);assert.equal(new THREE.Raycaster(origin,dir).intersectObject(tongue,false).length,0,`${id} empty mating bore`);axialRays++;}
   }
   checks.push({id,status:'pass',triangles:closure.triangles,coordinateEdges:closure.uniqueCoordinateEdges,invalidEdges:0,positiveSignedVolumeMm3:closure.signedVolumeMm3,frontSideWallRays:wallRays,axialRays});
  }finally{plug.dispose();}
 }
 return {status:'pass',scope:'Only three actual terminal tongues;coordinate-welded directed closure,positive volume and FrontSide/axial bore checks;no manufacturing fit or whole-catalog acceptance',checks};
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkTerminalTongueClosure(),null,2));
