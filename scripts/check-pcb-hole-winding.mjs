import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {loadModel} from '../src/loaders.js';

// Test the rendered geometry, not shape.holes flags or DoubleSide parity alone.
// These existing inferred drill dimensions are not new manufacturing claims.
const thermalX=2.92*Math.cos(67.5*Math.PI/180),thermalY=2.92*Math.sin(67.5*Math.PI/180);
const grove=y=>[-3,-1,1,3].map(x=>({x,y,r:.30}));
const cases=[
 {id:'thermal',board:'Thermal PCB with open boss and Grove relief',holes:[{x:0,y:-4,r:3},...[-thermalX,thermalX].flatMap(x=>[8-thermalY,8+thermalY].map(y=>({x,y,r:.35}))),...grove(-8.4)]},
 {id:'angle',board:'Angle PCB with open boss and Grove relief',holes:[{x:0,y:-4,r:2.2},...grove(-8.4)]},
 {id:'encoder',board:'Encoder PCB with open boss and Grove relief',holes:[{x:0,y:-4,r:2.9},...grove(-8.4)]},
 // NCIR is the previously corrected positive control, using its own lead row.
 {id:'ncir',board:'NCIR PCB with open boss and Grove relief',holes:[{x:0,y:-4,r:3},...[-1,1].flatMap(sx=>[-1,1].map(sy=>({x:sx*5.08/(2*Math.sqrt(2)),y:8+sy*5.08/(2*Math.sqrt(2)),r:.35}))),...grove(-8.1)]},
];

function closure(geometry){
 const position=geometry.attributes.position,index=geometry.index,edges=new Map();
 const key=i=>[position.getX(i),position.getY(i),position.getZ(i)].map(n=>Math.round(n*1e5)).join(',');
 let faces=0;
 for(let i=0;i<(index?.count??position.count);i+=3){
  const ids=[0,1,2].map(k=>key(index?index.getX(i+k):i+k));
  if(new Set(ids).size<3)continue;
  faces++;
  for(let k=0;k<3;k++){
   const a=ids[k],b=ids[(k+1)%3],pair=[a,b].sort().join('|'),edge=edges.get(pair)??{count:0,balance:0};
   edge.count++;edge.balance+=a<b?1:-1;edges.set(pair,edge);
  }
 }
 return {faces,unpairedEdges:[...edges.values()].filter(e=>e.count!==2).length,directedErrors:[...edges.values()].filter(e=>e.balance!==0).length};
}

function inspect(board,holes){
 assert.ok(board?.isMesh,'Expected actual PCB mesh is present');
 assert.equal(board.material.side,THREE.FrontSide,'PCB keeps ordinary FrontSide material; do not conceal reversed faces with DoubleSide');
 const geometry=board.geometry;geometry.computeBoundingBox();
 const box=geometry.boundingBox,z=(box.min.z+box.max.z)/2;
 const material=new THREE.MeshBasicMaterial(),probe=new THREE.Mesh(geometry,material);probe.updateMatrixWorld(true);
 const shoot=(point,direction,side,far=Infinity)=>{material.side=side;return new THREE.Raycaster(new THREE.Vector3(...point),new THREE.Vector3(...direction),0,far).intersectObject(probe,false);};
 let emptyAxes=0,wallHits=0,inwardNormals=0,backsideHits=0,positiveCaps=0;
 try{
  for(const {x,y,r}of holes){
   for(const sign of [-1,1])if(!shoot([x,y,sign<0?box.max.z+1:box.min.z-1],[0,0,sign],THREE.DoubleSide,box.max.z-box.min.z+2).length)emptyAxes++;
   for(let i=0;i<16;i++){
    const a=.113+i*Math.PI/8,d=[Math.cos(a),Math.sin(a),0];
    const hit=shoot([x,y,z],d,THREE.FrontSide,r+.004)[0];
    if(hit&&Math.abs(hit.distance-r)<.004){wallHits++;if(hit.face.normal.dot(new THREE.Vector3(...d))<-.99)inwardNormals++;}
    if(shoot([x,y,z],d,THREE.BackSide,r+.004).length)backsideHits++;
   }
  }
  for(const [x,y]of [[0,0],[-4,4],[4,4]])for(const sign of [-1,1]){
   const hit=shoot([x,y,sign<0?box.max.z+1:box.min.z-1],[0,0,sign],THREE.FrontSide)[0];
   if(hit&&Math.abs(hit.point.z-(sign<0?box.max.z:box.min.z))<1e-5&&hit.face.normal.z*sign<-.99)positiveCaps++;
  }
  return {holes:holes.length,emptyAxes,expectedEmptyAxes:holes.length*2,wallHits,inwardNormals,expectedWallHits:holes.length*16,backsideHits,positiveCaps,expectedPositiveCaps:6,...closure(geometry)};
 }finally{material.dispose();}
}

export async function checkPCBHoleWinding(){
 const prior=globalThis.document;
 // LED construction needs a canvas in Node; this stub is not render proof.
 if(!prior){const noop=()=>{},ctx=new Proxy({createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});globalThis.document={createElement:()=>({getContext:()=>ctx})};}
 const results=[],failures=[];
 try{
 for(const c of cases){
  const model=await loadModel(c.id);
  try{
   model.root.updateMatrixWorld(true);
   const board=model.body.getObjectByName(c.board),result={product:c.id,...inspect(board,c.holes)};results.push(result);
   if(result.emptyAxes!==result.expectedEmptyAxes||result.wallHits!==result.expectedWallHits||result.inwardNormals!==result.expectedWallHits||result.backsideHits!==0||result.positiveCaps!==result.expectedPositiveCaps||result.faces===0||result.unpairedEdges!==0||result.directedErrors!==0)failures.push(result);
  }finally{model.dispose();}
 }
 assert.equal(failures.length,0,'Actual PCB bore orientation failure: '+JSON.stringify(failures));
 return {status:'pass',scope:'Four actual non-beveled PCBs: finite empty bore axes, FrontSide interior walls and inward normals, BackSide negative controls, positive caps and directed edge closure after 1e-5 mm seam welding; not fit or hardware proof.',results};
 }finally{if(prior===undefined)delete globalThis.document;else globalThis.document=prior;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log('PASS PCB hole winding:',JSON.stringify(await checkPCBHoleWinding()));
