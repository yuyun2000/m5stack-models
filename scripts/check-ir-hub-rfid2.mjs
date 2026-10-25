import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';
import {Device,Port} from '../src/core/index.js';

const root=path.resolve(import.meta.dirname,'..');
for(const id of ['ir','hub','rfid2']){
 const {Model,GroveModule}=await import(`../src/units/${id}/index.js`);
 const {spec}=await import(`../src/units/${id}/dimensions.js`);
 const model=new Model();model.root.updateMatrixWorld(true);
 const visible=new THREE.Box3(),cad=new THREE.Box3();let meshes=0;
 model.root.traverse(o=>{
  if(!o.isMesh)return;meshes++;
  for(const value of o.geometry.attributes.position?.array??[])assert.ok(Number.isFinite(value),`${id}: finite geometry`);
  if(o.material?.opacity!==0)visible.expandByObject(o);
  if(o.userData.source==='official-structure')cad.expandByObject(o);
  assert.ok(!o.material?.map,`${id}: no artwork or photo planes in the current model`);
 });
 assert.ok(meshes>12,`${id}: physical shell, board and connector assembly`);
 const size=visible.getSize(new THREE.Vector3()),cadSize=cad.getSize(new THREE.Vector3());
 spec.size.forEach((n,i)=>assert.ok(Math.abs(size.getComponent(i)-n)<.1,`${id}: complete assembly envelope axis ${i}`));
 (spec.cadEnvelopeMm??spec.size).forEach((n,i)=>assert.ok(Math.abs(cadSize.getComponent(i)-n)<.01,`${id}: selected official CAD axis ${i}`));
 const hit=(origin,direction,includeInvisible=false)=>new THREE.Raycaster(new THREE.Vector3(...origin),new THREE.Vector3(...direction)).intersectObject(model.root,true).filter(h=>h.object.isMesh&&(includeInvisible||h.object.material?.opacity!==0));
 let rays=0;
 for(const x of [-8,8])for(const [dx,dy]of [[0,0],[1.5,0],[-1.5,0],[0,1.5],[0,-1.5]]){
  assert.equal(hit([x+dx,spec.mountY+dy,30],[0,0,-1],true).length,0,`${id}: actual mounting bore remains clear`);rays++;
 }
 const ports=model.list('port');assert.equal(ports.length,id==='hub'?4:1,`${id}: actual connector count`);
 for(const port of ports){
  const outward=port.id==='grove'?new THREE.Vector3(0,-1,0):new THREE.Vector3(0,0,1);
  assert.ok(new THREE.Vector3(0,1,0).applyQuaternion(port.object3d.quaternion).distanceTo(outward)<1e-6,`${id}: ${port.id} outward mating frame`);
 }
 const input=hit([0,-spec.size[1]/2-3,.5],[0,1,0])[0];
 assert.ok(input&&input.distance>8&&input.distance<9.2&&input.object.parent.name==='HY2.0-4P',`${id}: input cavity is not blocked by the PCB`);rays++;
 if(id==='ir'){
  for(const [x,name]of [[-5,'transmitter'],[5,'receiver']]){
   const optic=hit([x,8,20],[0,0,-1])[0];
   assert.ok(optic?.object.parent.name===`IR ${name} package`&&optic.point.z>3.7&&optic.point.z<4,`IR: ${name} occupies the matching CAD opening`);rays++;
  }
 }
 if(id==='hub'){
  const sockets=[];model.root.traverse(o=>{if(o.isGroup&&(o.name==='HY2.0-4P'||o.name.startsWith('HUB grove-')))sockets.push(o);});
  assert.equal(sockets.length,4,'HUB: one input and three output housings');
  for(const socket of sockets)assert.equal(socket.children.filter(o=>o.isMesh&&o.material?.metalness>.5).length,4,'HUB: each housing contains four physical metal contacts');
  for(const output of spec.outputs){
   const [x,y]=output.position;
   const empty=hit([x,y,20],[0,0,-1])[0];
   assert.ok(empty?.object.parent.name===`HUB ${output.id} upright socket`&&empty.point.z<2&&empty.point.z>1,'HUB: each front socket has a recessed interior');rays++;
   for(const offset of [-3,-1,1,3]){
    const pin=hit([x+.15,y+offset,20],[0,0,-1])[0];
    assert.ok(pin&&pin.object.material.metalness>.5&&pin.point.z>5.7&&pin.point.z<6,'HUB: four real pins lie inside each upright mouth');rays++;
   }
  }
 }
 if(id==='rfid2'){
  // The official face shell contains a large opening. Check across its full
  // field so a narrow panel or a bare backplate cannot pass as a closed face.
  for(let x=-10.2;x<=10.2;x+=.6)for(let y=-8.3;y<=20.5;y+=.6){
   const face=hit([x,y,20],[0,0,-1])[0];
   assert.ok(face&&['front-shell','RFID dielectric front cover'].includes(face.object.name)&&face.point.z>2.8,'RFID2: assembled antenna face has no missing surface');rays++;
  }
 }
 assert.throws(()=>model.handle({type:'sensor',target:'sensor',values:{value:123}}),`${id}: no sensor or bus simulation`);
 const host=new Device(),port=host.add(new Port({id:'unit',connector:'grove'}));
 const module=new GroveModule({cableLength:35});port.attach(module);host.root.updateMatrixWorld(true);
 assert.equal(host.get('unit/sensor').meta.role,'visual-anchor',`${id}: nested module component path`);
 const box=new THREE.Box3().setFromObject(module.root);assert.ok(box.min.y>=-1.3&&box.max.y>35+spec.size[1]/2,`${id}: mounted geometry extends outwards`);
 assert.equal(module.list('port').length,ports.length,`${id}: module preserves all physical ports`);
 port.detach();host.dispose();model.dispose();
 const report={checkedAt:new Date().toISOString(),scope:'visual geometry/API only; browser acceptance and device behavior not covered',id,meshes,rays,status:'pass',visualEnvelopeMm:size.toArray(),cadEnvelopeMm:cadSize.toArray(),ports:ports.map(p=>p.id)};
 await fs.writeFile(path.join(root,`docs/research/${id}/geometry-check.json`),JSON.stringify(report,null,2)+'\n');
 console.log(`PASS ${id}: ${meshes} meshes; ${rays} rays; ${ports.length} physical ports; standalone and Grove module`);
}
