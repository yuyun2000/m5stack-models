import assert from 'node:assert/strict';
import * as THREE from 'three';

// Canvas is only for the unchanged legacy labels. Connector acceptance uses
// real triangle intersections and does not inspect or fabricate label pixels.
const noop=()=>{};
const ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop}),measureText:()=>({width:20})},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};

for(const id of ['env-iii','pir','ultrasonic-i2c']){
  const {Model}=await import(`../src/units/${id}/index.js`);
  const unit=new Model();unit.root.updateMatrixWorld(true);
  const h=Model.spec.h,bottom=-h/2;
  const connector=unit.parts.connector;
  const pins=[];let texturedConnectorMeshes=0;
  connector.traverse(o=>{if(o.name==='Grove contact pin')pins.push(o);if(o.isMesh&&o.material?.map)texturedConnectorMeshes++;});
  assert.equal(pins.length,4,`${id}: four physical contacts`);
  assert.equal(texturedConnectorMeshes,0,`${id}: connector is geometry, no painted socket plane`);
  const xs=pins.map(p=>p.position.x).sort((a,b)=>a-b);
  for(let i=1;i<xs.length;i++)assert.equal(xs[i]-xs[i-1],2,`${id}: HY2.0 contact pitch`);
  const hit=(origin,direction)=>new THREE.Raycaster(new THREE.Vector3(...origin),new THREE.Vector3(...direction)).intersectObject(unit.root,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0);
  let rays=0;
  // The removed shell rim / former front decal must not seal the Grove mouth.
  for(const x of [-2,0,2]){
    const first=hit([x,bottom-3,1.6],[0,1,0])[0];
    assert.ok(first&&first.distance>8&&first.distance<10,`${id}: recessed connector cavity stays open`);
    assert.equal(first.object.name,'Grove rear wall',`${id}: cavity terminates at its real rear wall`);rays++;
  }
  for(const x of xs){
    const first=hit([x,bottom-3,1.1],[0,1,0])[0];
    assert.ok(first?.object.name==='Grove contact pin'&&first.distance>3.5&&first.distance<4.5,`${id}: metal pin tips are physically recessed`);rays++;
  }
  const side=hit([4.675,bottom-3,2],[0,1,0])[0];
  assert.ok(side?.object.name==='Grove side wall'&&Math.abs(side.distance-3)<1e-5,`${id}: mouth has finite side-wall thickness`);rays++;
  const floor=hit([0,bottom+1.3,10],[0,0,-1])[0];
  assert.equal(floor?.object.name,'Grove floor',`${id}: top-open mouth has a physical floor`);rays++;
  const bridge=hit([0,bottom+4.6,10],[0,0,-1])[0];
  assert.equal(bridge?.object.name,'Grove locking bridge',`${id}: central latch is a separate solid`);rays++;
  for(const x of [-8,8])for(const [dx,dy]of [[0,0],[1.5,0],[-1.5,0],[0,1.5],[0,-1.5]]){
    assert.equal(hit([x+dx,bottom+12+dy,30],[0,0,-1]).length,0,`${id}: mounting bores remain clear through PCB and housing`);rays++;
  }
  if(id==='env-iii'){
    const vent=hit([0,11.6,10],[0,0,-1])[0];
    assert.equal(vent?.object.name,'Unit PCB','ENV III: ventilation slots expose the recessed PCB, not a cap at the shell face');
    assert.ok(vent.distance>8.5&&vent.distance<9.5,'ENV III: ventilation slots retain real depth');rays++;
  }
  const port=unit.get('grove');
  assert.equal(port.meta.face,'bottom',`${id}: connector face metadata`);
  assert.ok(new THREE.Vector3(0,1,0).applyQuaternion(port.object3d.quaternion).distanceTo(new THREE.Vector3(0,-1,0))<1e-6,`${id}: mating frame points out of bottom`);
  unit.root.traverse(o=>{if(o.isMesh)for(const value of o.geometry.attributes.position?.array??[])assert.ok(Number.isFinite(value),`${id}: finite geometry`);});
  console.log(`PASS ${id}: four contacts, 2.0 mm pitch, ${rays} geometry rays, preserved bottom mating frame`);
  unit.dispose();
}
