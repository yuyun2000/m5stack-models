import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';
import {Device,Port} from '../src/core/index.js';

const root=path.resolve(import.meta.dirname,'..');
for(const id of ['rs485','buzzer','fan']){
 const {Model,GroveModule}=await import(`../src/units/${id}/index.js`),{spec}=await import(`../src/units/${id}/dimensions.js`);
 const model=new Model();model.root.updateMatrixWorld(true);
 const box=new THREE.Box3(),cad=new THREE.Box3();let meshes=0,rays=0;
 model.root.traverse(o=>{if(!o.isMesh)return;meshes++;for(const n of o.geometry.attributes.position?.array??[])assert.ok(Number.isFinite(n),`${id}: finite geometry`);if(o.material?.opacity!==0)box.expandByObject(o);if(o.userData.source==='official-structure')cad.expandByObject(o);assert.ok(!o.material?.map,`${id}: no label/photo textures`);});
 const size=box.getSize(new THREE.Vector3()),cadSize=cad.getSize(new THREE.Vector3());
 (spec.visualEnvelopeMm??spec.nominalMm).forEach((n,i)=>assert.ok(Math.abs(n-size.getComponent(i))<.1,`${id}: visual envelope axis ${i}`));
 spec.cadEnvelopeMm.forEach((n,i)=>assert.ok(Math.abs(n-cadSize.getComponent(i))<.01,`${id}: selected official assembly axis ${i}`));
 const hit=(origin,direction,object=model.root,invisible=false)=>new THREE.Raycaster(new THREE.Vector3(...origin),new THREE.Vector3(...direction)).intersectObject(object,true).filter(h=>h.object.isMesh&&(invisible||h.object.material?.opacity!==0));
 for(const x of [-8,8])for(const [dx,dy]of [[0,0],[1.5,0],[-1.5,0],[0,1.5],[0,-1.5]]){assert.equal(hit([x+dx,spec.mountY+dy,30],[0,0,-1],model.root,true).length,0,`${id}: mounting bore clear through all layers`);rays++;}
 const mouth=hit([0,-spec.size[1]/2-3,.5],[0,1,0])[0];assert.ok(mouth?.distance>8&&mouth.distance<9.2&&mouth.object.parent.name==='HY2.0-4P',`${id}: Grove insertion path clears PCB`);rays++;
 assert.equal(model.list('port').length,id==='rs485'?2:1,`${id}: connector count`);
 for(const p of model.list('port')){const expected=p.id==='terminal'?[0,1,0]:[0,-1,0];assert.ok(new THREE.Vector3(0,1,0).applyQuaternion(p.object3d.quaternion).distanceTo(new THREE.Vector3(...expected))<1e-6,`${id}: ${p.id} outward mating frame`);}
 if(id==='rs485'){
  for(const x of spec.terminal.pinX){
   const front=hit([x,25,1.3],[0,-1,0])[0];assert.ok(front?.object.name==='RS485 terminal contact pin'&&front.point.y>15&&front.point.y<15.2,'RS485: exposed metal tips lie inside terminal cavity');rays++;
   const window=hit([x,7.45,20],[0,0,-1])[0];assert.equal(window?.object.name,'RS485 terminal contact pin','RS485: inspection windows remain actual holes');rays++;
  }
  const cavity=hit([0,25,2.7],[0,-1,0])[0];assert.ok(cavity?.object.name==='RS485 terminal rear wall'&&cavity.point.y<7,'RS485: deep terminal cavity remains clear');rays++;
  const board=model.root.getObjectByName('RS485 PCB with connector clearances');assert.equal(hit([0,11,20],[0,0,-1],board).length,0,'RS485: PCB does not cross terminal channels');rays++;
 }
 if(id==='buzzer'){
  for(const x of spec.slots.x){const opening=hit([x,9.8,20],[0,0,-1])[0];assert.ok(opening&&['Buzzer acoustic package','Buzzer recessed diaphragm'].includes(opening.object.name)&&opening.point.z<2.9&&opening.point.z>2.4,'Buzzer: all five acoustic slots expose a recessed physical package');rays++;}
  for(const x of [-3,-1,1,3]){const rib=hit([x,9.8,20],[0,0,-1])[0];assert.ok(rib?.object.name==='housing'&&rib.point.z>3.8,'Buzzer: original shell ribs between slots remain solid');rays++;}
 }
 if(id==='fan'){
  const shaft=hit([0,30,2],[0,-1,0])[0];assert.ok(shaft?.object.name==='Fan motor shaft'&&Math.abs(shaft.point.y-18.6)<.01,'Fan: physical shaft projects 2.6 mm past the body');rays++;
  for(const z of [1,3]){const bearing=hit([0,30,z],[0,-1,0])[0];assert.equal(bearing?.object.name,'Fan recessed bearing','Fan: shaft aperture has recessed motor support');rays++;}
  const board=model.root.getObjectByName('Fan PCB with motor and Grove clearances');assert.equal(hit([0,7,20],[0,0,-1],board).length,0,'Fan: motor bay clears PCB');rays++;
  const prop=new Model({propeller:true});prop.root.updateMatrixWorld(true);let blades=0;
  prop.root.traverse(o=>{if(o.name!=='Fan propeller blade')return;blades++;const edges=new Map(),indices=o.geometry.index.array;for(let i=0;i<indices.length;i+=3)for(const[a,b]of [[indices[i],indices[i+1]],[indices[i+1],indices[i+2]],[indices[i+2],indices[i]]]){const key=a<b?`${a},${b}`:`${b},${a}`;edges.set(key,(edges.get(key)??0)+1);}assert.ok([...edges.values()].every(n=>n===2),'Fan: each blade has closed physical thickness');});
  assert.equal(blades,2,'Fan: optional accessory has two static blades');
  for(const[origin,direction]of [[[20,30,2.5],[0,-1,0]],[[20,10,2.5],[0,1,0]]]){const blade=hit(origin,direction,prop.root)[0];assert.equal(blade?.object.name,'Fan propeller blade','Fan: both airfoil faces are rendered solid');rays++;}
  const propBox=new THREE.Box3();prop.root.traverse(o=>{if(o.isMesh&&o.material?.opacity!==0)propBox.expandByObject(o);});assert.ok(Math.abs(propBox.getSize(new THREE.Vector3()).x-60)<.01,'Fan: optional propeller diameter is 60 mm');prop.dispose();
 }
 assert.throws(()=>model.handle({type:'sensor',target:'sensor',values:{value:1}}),`${id}: visual anchor has no device behavior`);
 const host=new Device(),port=host.add(new Port({id:'unit',connector:'grove'})),module=new GroveModule({cableLength:35});port.attach(module);host.root.updateMatrixWorld(true);assert.equal(host.get('unit/sensor').meta.role,'visual-anchor',`${id}: module component path`);assert.equal(module.list('port').length,model.list('port').length,`${id}: module preserves connectors`);assert.ok(new THREE.Box3().setFromObject(module.root).min.y>=-1.3,`${id}: attached geometry extends outwards`);port.detach();host.dispose();model.dispose();
 await fs.writeFile(path.join(root,`docs/research/${id}/geometry-check.json`),JSON.stringify({checkedAt:new Date().toISOString(),scope:'visual geometry only; browser and hardware acceptance remain separate',id,meshes,rays,visualEnvelopeMm:size.toArray(),cadEnvelopeMm:cadSize.toArray(),status:'pass'},null,2)+'\n');
 console.log(`PASS ${id}: ${meshes} meshes, ${rays} rays, physical openings and standalone/GroveModule bindings`);
}
