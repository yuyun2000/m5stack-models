import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {Device,Port} from '../src/core/index.js';
import {Model,GroveModule,spec,CHANNELS} from '../src/units/8encoder/index.js';
import data from '../src/units/8encoder/geometry-data.js';
const vector=a=>new THREE.Vector3(...a),near=(a,b,label,tolerance=1e-5)=>assert.ok(Math.abs(a-b)<tolerance,`${label}: ${a} vs ${b}`);
const visible=o=>o.isMesh&&o.material?.opacity!==0;
const shoot=(object,origin,direction)=>new THREE.Raycaster(vector(origin),vector(direction)).intersectObject(object,true).filter(h=>visible(h.object));
const tick=host=>{for(let i=0;i<120;i++)if(!host.update(1/60,i/60))return;assert.fail('Visual mechanism did not settle');};
const box=object=>{const result=new THREE.Box3();object.traverse(o=>{if(visible(o))result.expandByObject(o);});return result;};
function shellVolumeSamples(model,pcb){
 // Odd/even containment only applies to closed solids. Check each unmodified
 // native shell independently, with welded edge keys, before testing material.
 const native=[];model.root.traverse(o=>{if(o.userData.source==='official-structure')native.push(o);});
 const doubleSide=new THREE.MeshBasicMaterial({side:THREE.DoubleSide}),shells=native.map(original=>{
  const positions=original.geometry.attributes.position,index=original.geometry.index,edges=new Map(),point=i=>new THREE.Vector3().fromBufferAttribute(positions,index?index.getX(i):i),key=p=>p.toArray().map(n=>Math.round(n*1e4)).join(',');
  for(let i=0;i<(index?.count??positions.count);i+=3){const p=[0,1,2].map(k=>key(point(i+k)));for(let k=0;k<3;k++){const edge=[p[k],p[(k+1)%3]].sort().join('|');edges.set(edge,(edges.get(edge)??0)+1);}}
  assert.ok([...edges.values()].every(n=>n===2),'Native shell is a closed manifold for volume containment');
  const shadow=new THREE.Mesh(original.geometry,doubleSide);shadow.matrixAutoUpdate=false;shadow.matrixWorld.copy(original.matrixWorld);return shadow;
 });
 const raycaster=new THREE.Raycaster(),direction=vector([.733,.312,.604]).normalize(),points=new Map();
 const contains=(shell,p)=>{raycaster.set(p,direction);const hits=raycaster.intersectObject(shell,false);return hits.filter((h,i)=>!i||h.distance-hits[i-1].distance>1e-5).length%2===1;};
 const add=p=>points.set(p.toArray().map(n=>Math.round(n*1e4)).join(','),p),positions=pcb.geometry.attributes.position,index=pcb.geometry.index,point=i=>new THREE.Vector3().fromBufferAttribute(positions,index?index.getX(i):i).applyMatrix4(pcb.matrixWorld);
 // Mesh vertices plus every triangle centroid catch rims and polygon interiors.
 for(let i=0;i<(index?.count??positions.count);i+=3){const triangle=[0,1,2].map(k=>point(i+k));triangle.forEach(add);add(triangle[0].clone().add(triangle[1]).add(triangle[2]).multiplyScalar(1/3));}
 // Independently sample the actual board material on both faces and mid-plane;
 // this catches shell intrusion between the long top/bottom mesh triangles.
 let materialGridPoints=0;const boardBounds=box(pcb),zPlanes=[boardBounds.min.z+.002,(boardBounds.min.z+boardBounds.max.z)/2,boardBounds.max.z-.002];
 for(let x=-9.75;x<=9.75;x+=.5)for(let y=-59.75;y<=59.75;y+=.5){if(!shoot(pcb,[x,y,0],[0,0,-1]).length)continue;for(const z of zPlanes)add(vector([x,y,z]));materialGridPoints++;}
 for(const p of points.values())for(const shell of shells)assert.equal(contains(shell,p),false,`PCB surface/volume sample lies inside native shell material: ${p.toArray()}`);
 // Former false negatives: these points truly lie in original pillar/boss
 // material, and the revised board must leave them empty at its own height.
 for(const p of [[-4.9,-52,-2.6],[-2.6,-52,-2.6],[-4.9,-52,-1.8]]){assert.ok(shells.some(shell=>contains(shell,vector(p))),'Regression probe lies in actual native shell material');assert.equal(shoot(pcb,[p[0],p[1],0],[0,0,-1]).length,0,'PCB clears full outer pillar/reinforcing boss, not merely the bore');}
 for(const x of [-3.55,3.55]){assert.ok(shoot(pcb,[x,-52,0],[0,0,-1]).length,'Conservative narrow PCB bridges remain continuous between the three bosses');}
 doubleSide.dispose();return {closedNativeShells:shells.length,uniqueSurfaceAndVolumePoints:points.size,materialGridColumns:materialGridPoints,zPlanes,containmentChecks:points.size*shells.length,sideNotchRadiusMm:4.2,centralClearanceRadiusMm:3.3,endY:60,scope:'Sampled native-solid exclusion; concealed PCB outline and narrow bridges inferred for appearance, not manufacturing validation'};
}
export async function checkEightEncoder(){
const noop=()=>{};
if(!globalThis.document){const ctx=new Proxy({createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});globalThis.document={createElement:()=>({getContext:()=>ctx})};}
const model=new Model();model.root.updateMatrixWorld(true);let meshes=0,rays=0;
model.root.traverse(o=>{if(!o.isMesh)return;meshes++;for(const value of o.geometry.attributes.position?.array??[])assert.ok(Number.isFinite(value),'Finite geometry');assert.ok(!o.material?.map,'No photographic surfaces');});
const size=box(model.root).getSize(new THREE.Vector3());spec.visualEnvelopeMm.forEach((n,i)=>near(size.getComponent(i),n,'Nominal visible envelope',.002));
assert.equal(data.length,2,'Only actual assembled shell pair');assert.equal(data.reduce((n,p)=>n+p.triangles,0),11508,'All selected native shell triangles retained');
const cad=new THREE.Box3();model.root.traverse(o=>{if(o.userData.source==='official-structure')cad.expandByObject(o);});spec.cadEnvelopeMm.forEach((n,i)=>near(cad.getSize(new THREE.Vector3()).getComponent(i),n,'Native shell envelope',.002));
assert.equal(model.list('joint').length,8);assert.equal(model.list('button').length,9);assert.equal(model.list('led').length,9);assert.equal(model.list('port').length,1);
for(const [cx,cy]of spec.mountingHoles)for(const[dx,dy]of [[0,0],[1.5,0],[-1.5,0],[0,1.5],[0,-1.5]]){assert.equal(shoot(model.root,[cx+dx,cy+dy,30],[0,0,-1]).length,0,'Both LEGO bores stay clear through shell and board');rays++;}
for(const item of [...CHANNELS,{number:9,y:59}]){const hit=shoot(model.root,[spec.led.x,item.y,30],[0,0,-1])[0];assert.equal(hit?.object.name,`RGB${item.number} recessed physical light pipe`,'Native light slit contains its physical pipe');assert.ok(hit.point.z<3,'Light pipe is recessed');rays++;}
const pcb=model.root.getObjectByName('8Encoder PCB with Grove and mounting clearances');assert.equal(shoot(pcb,[0,-60,20],[0,0,-1]).length,0,'PCB clears connector');rays++;
const pcbShellClearance=shellVolumeSamples(model,pcb);
const mouth=shoot(model.root,[0,-75,.5],[0,1,0])[0];assert.ok(mouth&&mouth.point.y> -58&&mouth.point.y< -56,'Grove has actual recessed insertion cavity');rays++;
const back=shoot(model.root,[0,-40.6,-20],[0,0,1])[0];assert.equal(back?.object,pcb,'Native back service aperture exposes the PCB rather than empty space');rays++;
// The PCB is inside the tapered native walls, with open edge notches at LEGO
// bores and a separate central screw clearance, never intersecting hole paths.
for(const y of [-45,-30,-15,0,15,30,45,59])for(const x of [-9.9,9.9]){const origin=[x,y,-2.2],sign=Math.sign(x),wall=shoot(model.root.getObjectByName('8Encoder back shell'),[0,y,-2.2],[sign,0,0])[0];assert.ok(wall&&Math.abs(wall.point.x)>Math.abs(origin[0])+.2,'PCB perimeter has clearance inside the real tapered shell');rays++;}
const fixed=[];model.root.traverse(o=>{if(o.isMesh&&(o.userData.source==='official-structure'||/fixed|PCB|MCU|recessed slide-switch floor/.test(o.name)))fixed.push({object:o,matrix:o.matrixWorld.clone()});});
const events=[];model.on('input',e=>events.push(e));const defaultLights=model.list('led').map(led=>({...led.getState()}));
for(const item of CHANNELS){
 const c=model.get(item.press,'button'),joint=model.get(item.rotation,'joint');assert.equal(joint.continuous,true);assert.equal(c.travel,.35);
 const others=CHANNELS.filter(other=>other!==item).map(other=>({press:model.get(other.press),joint:model.get(other.rotation),state:model.get(other.rotation).getState().angleDeg}));
 const rest=c.cap.matrix.clone(),knob=c.cap.getObjectByName(`CH${item.number} bored knob body`),pos=knob.geometry.attributes.position,normals=knob.geometry.attributes.normal;
 let outward=0;for(let i=0;i<pos.count;i++)if(Math.hypot(pos.getX(i),pos.getY(i))>4.5&&pos.getZ(i)>.8&&pos.getZ(i)<13.9){assert.ok(pos.getX(i)*normals.getX(i)+pos.getY(i)*normals.getY(i)>4,'Knob side normals face out');outward++;}assert.ok(outward>100);
 model.handle({target:item.rotation,type:'joint',angleDeg:item.number*37});model.handle({target:item.press,action:'press',source:'test'});tick(model);model.root.updateMatrixWorld(true);
 near(c.getActuationState().depthMm,.35,'Exact per-channel press endpoint');near(joint.angleDeg,item.number*37,'Independent external rotation');
 for(const other of others){near(other.press.getActuationState().depthMm,0,'Other knobs do not press');near(other.joint.angleDeg,other.state,'Other knobs do not rotate');}
 // The cap is bored. The true shaft enters that cavity and stays below its
 // closed end at both endpoints, independently of the angular orientation.
 const cavityRay=new THREE.Raycaster(vector([0,0,2]).applyMatrix4(c.cap.matrixWorld),vector([1,0,0]).transformDirection(c.cap.matrixWorld));
 const boreHit=cavityRay.intersectObject(c.cap,true)[0];assert.ok(boreHit,'Physical shaft cavity has a sidewall');near(boreHit.distance,spec.knob.boreRadius,'Real blind bore radius',.002);rays++;
 const inverse=new THREE.Matrix4().copy(c.cap.matrixWorld).invert(),shaftTop=vector([0,item.y,spec.knob.shaftTopZ]).applyMatrix4(inverse);
 assert.ok(Math.hypot(shaftTop.x,shaftTop.y)<spec.knob.boreRadius-.1&&shaftTop.z<spec.knob.boreDepth-1,'Fixed shaft remains in the blind bore');
 near(spec.knob.baseZ-c.getActuationState().depthMm,5.05,'Pressed underside stays above the 5 mm native deck');
 model.handle({target:item.press,action:'release',source:'test'});tick(model);model.root.updateMatrixWorld(true);near(c.getActuationState().depthMm,0,'Exact release endpoint');assert.ok(c.cap.matrix.equals(rest),'Cap translation returns exactly to its neutral matrix');
 model.handle({target:item.rotation,type:'joint',angleDeg:0});
}
model.root.updateMatrixWorld(true);for(const {object,matrix}of fixed)assert.ok(object.matrixWorld.equals(matrix),'Fixed shell/PCB/package never follows moving knobs');
assert.deepEqual(model.list('led').map(led=>led.getState()),defaultLights,'Rotation/press does not change RGB output');
const slider=model.get('switch','button');assert.equal(slider.isLatching,true);model.handle({target:'switch',action:'press',source:'test'});model.handle({target:'switch',action:'release',source:'test'});tick(model);near(slider.cap.position.x,2.2,'Slide switch reaches alternate detent');assert.equal(slider.getState().position,1,'Slide position remains latched after release');near(slider.cap.position.z,0,'Slide switch does not move as a push button');
slider.setPosition(0,{immediate:true});assert.equal(slider.getState().position,0);near(slider.cap.position.x,0,'External stable detent zero');
for(let i=1;i<=9;i++){model.handle({target:'rgb-'+i,type:'led',color:0x22b477,brightness:.4});assert.equal(model.get('rgb-'+i).getState().brightness,.4);model.handle({target:'rgb-'+i,type:'led',on:false});}
assert.throws(()=>model.handle({target:'sensor',type:'sensor',values:{count:9}}),'No encoder values or bus simulation');
assert.equal(events.filter(e=>e.action==='down'&&e.id.startsWith('press-')).length,8,'Eight common button down input paths');
// Nested ownership: button children are removed before their adopting joints.
const disposed=new Map();model.root.traverse(o=>{if(o.isMesh&&!disposed.has(o.geometry)){disposed.set(o.geometry,0);o.geometry.addEventListener('dispose',()=>disposed.set(o.geometry,disposed.get(o.geometry)+1));}});model.dispose();assert.ok([...disposed.values()].every(n=>n===1),'Each owned mesh geometry is disposed exactly once');
const host=new Device(),port=host.add(new Port({id:'unit',connector:'grove',rotation:[.1,.2,.3]})),module=new GroveModule({cableLength:85});port.attach(module);module.get('unitFrame').setPose({position:[16,95,-7],rotation:[.25,.1,-.45]});host.root.updateMatrixWorld(true);const routed=[];host.on('input',e=>routed.push(e.id));host.handle({target:'unit/rotation-8',type:'joint',angleDeg:123});host.handle({target:'unit/press-8',action:'press',source:'test'});tick(host);near(host.get('unit/press-8').getActuationState().depthMm,.35,'Attached press path');near(host.get('unit/rotation-8').angleDeg,123,'Attached joint path');assert.equal(routed.at(-1),'unit/press-8');assert.equal(module.get('cable').getState().wireCount,4);host.handle({target:'unit/press-8',action:'release',source:'test'});tick(host);port.detach();host.dispose();
return {checkedAt:new Date().toISOString(),status:'pass',scope:'Appearance/geometry/input intent only; no encoder count, electrical or firmware simulation',sku:'U153',meshes,rays,selectedNativeTriangles:11508,visualEnvelopeMm:size.toArray(),cadEnvelopeMm:cad.getSize(new THREE.Vector3()).toArray(),pcbShellClearance,channels:8,pressControls:8,continuousVisualJoints:8,latchingSwitches:1,externalRgb:9,checks:['real shell pair and exact envelope','native light/Grove/LEGO/service apertures','closed-shell PCB surface and volume containment sampling','narrow PCB with valid open notches and shell clearance','independent press and rotation paths','outward cap normals','blind shaft cavities and press clearance','stable switch detents','externally driven RGB only','nested rotated Grove pose','exactly-once mesh geometry disposal']};
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 const report=await checkEightEncoder(),output=path.resolve(import.meta.dirname,'../artifacts/8encoder-check.json');
 await fs.mkdir(path.dirname(output),{recursive:true});
 await fs.writeFile(output,JSON.stringify(report,null,2)+'\n');
 console.log(`PASS 8Encoder U153: ${report.meshes} meshes, ${report.rays} rays; 8 independent rotations/presses, stable switch, 9 external RGB and Grove ownership`);
}
