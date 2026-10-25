import assert from 'node:assert/strict';
import * as THREE from 'three';

// Geometry/API checks only. Canvas is a placeholder; browser review is separate.
const noop=()=>{};
const ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop}),measureText:()=>({width:20})},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
const {StackChan}=await import('../src/devices/stackchan/index.js');
const d=new StackChan();d.root.updateMatrixWorld(true);
const visibleHits=(origin,direction,target=d.root)=>new THREE.Raycaster(new THREE.Vector3(...origin),new THREE.Vector3(...direction)).intersectObject(target,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0);
const head=d.parts['head-shell'];

// Position is independently constrained by the real apertures in the official
// top shell, not merely by matching a hard-coded connector position.
for(const id of ['port-b','port-c']){
 const port=d.get(id),p=port.object3d.getWorldPosition(new THREE.Vector3());
 const outward=new THREE.Vector3(0,1,0).applyQuaternion(port.object3d.getWorldQuaternion(new THREE.Quaternion()));
 assert.ok(outward.distanceTo(new THREE.Vector3(0,1,0))<1e-6,`${id}: connector must mate through the top of the head`);
 assert.ok(p.y>=35.24&&p.y<35.5,`${id}: mating plane at the top shell`);
 assert.ok(p.z>10.5&&p.z<15,`${id}: connector must occupy the official top aperture near CoreS3`);
 const shellHit=visibleHits([p.x,45,p.z],[0,-1,0],head)[0];
 assert.ok(!shellHit||shellHit.point.y<34,`${id}: connector face obstructed by the selected head shell`);
 for(const dx of [-3,-1,1,3]){
  const hit=visibleHits([p.x+dx,45,p.z+.15],[0,-1,0])[0];
  assert.ok(hit&&hit.point.y>29&&hit.point.y<35.4,`${id}: real contact/backstop must occupy the port cavity`);
  assert.ok(hit.object.parent?.name==='HY2.0-4P',`${id}: port contact obscured by ${hit?.object.name}`);
 }
}
const irHit=visibleHits([0,45,10.25],[0,-1,0])[0];
assert.ok(irHit?.object.name==='Top IR receiver lens','top circular window must expose the physical IR receiver');
const carrierHit=visibleHits([0,45,14.5],[0,-1,0])[0];
assert.ok(carrierHit?.object.name==='Top IR carrier PCB','small top slot has a physical PCB behind it');

const rear=d.root.getObjectByName('Rear body electronics');
assert.ok(rear,'rear assembly must exist');
const connectors=rear.children.filter(o=>o.userData.role==='visual-cable-connector');
assert.equal(connectors.filter(o=>o.userData.contactCount===3).length,2,'two actual three-pin servo connector housings');
assert.equal(connectors.filter(o=>o.userData.contactCount===7).length,2,'two endpoints for the seven-wire harness');
const wires=rear.children.filter(o=>o.geometry?.type==='TubeGeometry');
assert.equal(wires.length,7,'seven separate physical wires');
for(let i=0;i<wires.length;i++){
 const wire=wires[i],curve=wire.geometry.parameters.path;
 assert.ok(wire.geometry.parameters.radius>=.18,'cable has physical insulation thickness');
 const start=curve.getPoint(0),end=curve.getPoint(1);
 assert.ok(start.y>22&&end.y<15,'harness joins upper and lower connector rather than floating across the PCB');
 const tubeBox=new THREE.Box3().setFromObject(wire);
 assert.ok(tubeBox.getSize(new THREE.Vector3()).z>.6,'cable bows away from the PCB');
 assert.ok(tubeBox.min.z>=-30.75&&tubeBox.max.z<-29.2,'rear cable stays inside the assembled rear envelope');
 // The endpoint centers must land inside the volume of actual metal terminals.
 for(const point of [start,end]){
  let joined=false;rear.traverse(o=>{if(o.isMesh&&o.name.includes('7P harness connector contact')&&new THREE.Box3().setFromObject(o).expandByScalar(.03).containsPoint(point))joined=true;});
  assert.ok(joined,`${wire.name}: cable endpoint misses its connector contact`);
 }
}
for(const [x,y] of [[-14,23],[14,23],[0,28]]){
 const hit=visibleHits([x,y,-40],[0,0,1])[0];
 assert.ok(hit&&hit.point.z<=-29.2,'upper rear electronics need a physical PCB behind them');
}
const pcb=rear.getObjectByName('Rear power PCB');
assert.equal(visibleHits([0,0,-40],[0,0,1],pcb).length,0,'preserve the PCB clearance around the servo');

// Keep the independently positioned CAD covers in their intended orientation.
for(const [name,expected] of [['servo-rear-cover',[30.1,8.8,35.05]],['servo-side-cover',[34.504,26,3]]]){
 const size=new THREE.Box3().setFromObject(d.parts[name]).getSize(new THREE.Vector3());
 expected.forEach((n,i)=>assert.ok(Math.abs(size.getComponent(i)-n)<.02,`${name}: CAD cover axis ${i} has been transposed`));
}
for(const o of rear.children)if(o.isMesh)for(const v of o.geometry.attributes.position?.array??[])assert.ok(Number.isFinite(v),'rear assembly finite geometry');
console.log('PASS StackChan assembly: top Grove apertures/contact rays, physical PCB, 3-pin connectors, connected 7-wire harness, servo-cover axes.');
d.dispose();
