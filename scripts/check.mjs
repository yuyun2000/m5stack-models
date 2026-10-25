import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
await import('./catalog.mjs');
const root=path.resolve(import.meta.dirname,'..');
const catalog=JSON.parse(await fs.readFile(path.join(root,'catalog/products.json'),'utf8'));
// Decal geometry needs a Canvas placeholder in Node. Real texture pixels require browser review.
const noop=()=>{};const ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop}),measureText:()=>({width:20})},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
let total=0;const reports=[];
for(const p of catalog.products.filter(p=>p.entry)){
 const mod=await import(pathToFileURL(path.join(root,p.entry)).href);const C=mod[p.export];const {loadModelClass}=await import('../src/loaders.js');assert.equal(await loadModelClass(p.id),C,'lazy factory must use the catalog export');assert.equal(typeof C,'function',p.id);
 const d=new C();d.root.updateMatrixWorld(true);
 let meshes=0;d.root.traverse(o=>{if(o.isMesh){meshes++;for(const v of o.geometry.attributes.position?.array??[])assert.ok(Number.isFinite(v),`${p.id}: finite geometry`);}});
 assert.ok(meshes>4,`${p.id}: substantive model`);
 for(const [key,target]of Object.entries(d.keymap))assert.ok(d.get(target),`${p.id}: keymap ${key} references missing visual control ${target}`);
 if(p.display){const lcd=d.display('lcd');assert.equal(lcd.width,p.display.width);assert.equal(lcd.height,p.display.height);const bytes=new Uint8Array([0xf8,0x00]);lcd.writeRGB565(bytes,{x:0,y:0,w:1,h:1},{swapBytes:true});assert.equal(lcd.buffer[0],255);assert.equal(lcd.buffer[1],0);lcd.fill('#808080',{x:0,y:0,w:1,h:1});assert.ok(Math.abs(lcd.buffer[0]-128)<=1,'CSS color fills must store sRGB bytes');}
 const cadBox=new THREE.Box3();let cadCount=0;d.root.traverse(o=>{if(o.isMesh&&o.userData.source==='official-structure'){cadBox.expandByObject(o);cadCount++;}});
 if(cadCount){const size=cadBox.getSize(new THREE.Vector3()),expected=p.cadEnvelopeMm??p.nominalMm;expected.forEach((v,i)=>assert.ok(Math.abs(size.getComponent(i)-v)<.3,`${p.id}: official selected assembly axis ${i}, ${size.getComponent(i)} vs ${v}`));}
 if(p.display){const lcd=d.display('lcd');const origin=lcd.object3d.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0,0,100));const ray=new THREE.Raycaster(origin,new THREE.Vector3(0,0,-1));const visible=ray.intersectObject(d.root,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0);assert.ok(visible[0]?.object===lcd.panel,`${p.id}: framebuffer center obscured by ${visible[0]?.object.name}`);}
 if(p.display){const lcd=d.display('lcd'),origin=lcd.object3d.getWorldPosition(new THREE.Vector3());const [w,h]=lcd.size;const points=p.display.shape==='circle'?[[0,0],[.45,0],[-.45,0],[0,.45],[0,-.45]]:[[-.48,-.48],[.48,-.48],[-.48,.48],[.48,.48]];for(const [x,y]of points){const ray=new THREE.Raycaster(lcd.object3d.localToWorld(new THREE.Vector3(w*x,h*y,100)),new THREE.Vector3(0,0,-1));const visible=ray.intersectObject(d.root,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0);assert.ok(visible[0]?.object===lcd.panel,`${p.id}: display edge ${x},${y} obscured by ${visible[0]?.object.name}`);}}
 if(p.category==='unit'){
  const box=new THREE.Box3();d.root.traverse(o=>{if(o.isMesh&&o.material?.opacity!==0)box.expandByObject(o);});const size=box.getSize(new THREE.Vector3());(p.visualEnvelopeMm??p.nominalMm).forEach((n,i)=>assert.ok(Math.abs(size.getComponent(i)-n)<.3,`${p.id}: envelope ${i}, actual ${size.getComponent(i)} vs ${n}`));
  const hy=-p.nominalMm[1]/2+12;
  for(const [x,y] of (p.mountingHolesMm??[[-8,hy],[8,hy]]))for(const [dx,dy] of [[0,0],[1.5,0],[-1.5,0],[0,1.5],[0,-1.5]]){const ray=new THREE.Raycaster(new THREE.Vector3(x+dx,y+dy,50),new THREE.Vector3(0,0,-1));assert.equal(ray.intersectObject(d.root,true).length,0,`${p.id}: mounting hole must remain open through board and housing at ${dx},${dy}`);}
  assert.throws(()=>d.handle({type:'sensor',target:'sensor',values:{temperature:10}}),`${p.id}: visual anchor must not implement sensor behavior`);
 }
 for(const port of d.list('port')){if(!port.meta.face)continue;const normals={top:[0,1,0],bottom:[0,-1,0],left:[-1,0,0],right:[1,0,0],front:[0,0,1],back:[0,0,-1]},normal=port.meta.outward??normals[port.meta.face];assert.ok(normal,`${p.id}: ${port.id} outward normal is documented`);const outward=new THREE.Vector3(0,1,0).applyQuaternion(port.object3d.quaternion);assert.ok(outward.distanceTo(new THREE.Vector3(...normal))<1e-6,`${p.id}: ${port.id} module mating frame must face outward`);}
 if(p.category==='unit'&&p.integration?.moduleExport){
  const {loadGroveModule}=await import('../src/loaders.js');const {Device,Port}=await import('../src/core/index.js');
  const host=new Device(),port=host.add(new Port({id:'unit',connector:'grove'}));const unit=await loadGroveModule(p.id,{cableLength:35});port.attach(unit);host.root.updateMatrixWorld(true);
  assert.equal(host.get('unit/sensor').meta.role,'visual-anchor',`${p.id}: attached visual anchor path`);
  const attachedBox=new THREE.Box3().setFromObject(unit.root);assert.ok(attachedBox.min.y>=-1.3&&attachedBox.max.y>35+p.nominalMm[1]/2,`${p.id}: unit stays outward; only mating plug may overlap the port`);
  const button=unit.list('button')[0];if(button){let events=[];host.on('input',e=>events.push(e));button.press('check');button.release('check');assert.ok(events.some(e=>e.action==='down'&&e.id.startsWith('unit/')),`${p.id}: input intent path bubbles through connector`);}
  port.detach();host.dispose();
 }
 for(const check of p.closureChecks??[]){
  const ray=new THREE.Raycaster(new THREE.Vector3(...check.origin),new THREE.Vector3(...check.direction));
  const hits=ray.intersectObject(d.root,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0);
  assert.ok(hits[0]&&hits[0].distance<=check.maxDistance,`${p.id}: unintended assembly gap: ${check.purpose}; distance=${hits[0]?.distance}`);
 }
 const configurations=[];
 if(p.id==='cores3'){
  // The kit uses a separate selected assembly and rear/side hardware; default module checks cannot cover it.
  const din=new C({dinBase:true});din.root.updateMatrixWorld(true);let variantMeshes=0;
  const kitBox=new THREE.Box3();din.root.traverse(o=>{if(o.isMesh){variantMeshes++;for(const v of o.geometry.attributes.position?.array??[])assert.ok(Number.isFinite(v),'cores3/din: finite geometry');if(o.userData.source==='official-structure')kitBox.expandByObject(o);}});
  const kitSize=kitBox.getSize(new THREE.Vector3());for(const [i,n]of [54,69.284,31.5].entries())assert.ok(Math.abs(kitSize.getComponent(i)-n)<.01,`cores3/din: selected assembled CAD axis ${i}`);
  assert.deepEqual(din.meta.size,[54,69.284,31.5],'cores3/din: configuration metadata matches kit dimensions');
  const hit=(origin,direction)=>new THREE.Raycaster(new THREE.Vector3(...origin),new THREE.Vector3(...direction)).intersectObject(din.root,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0);
  const lcd=din.display('lcd');for(const [x,y]of [[0,0],[-.48,-.48],[.48,-.48],[-.48,.48],[.48,.48]]){const origin=lcd.object3d.localToWorld(new THREE.Vector3(lcd.size[0]*x,lcd.size[1]*y,100));assert.ok(hit(origin.toArray(),[0,0,-1])[0]?.object===lcd.panel,`cores3/din: framebuffer visible at ${x},${y}`);}
  for(const [id,face]of [['usb','left'],['grove','left'],['grove-b','top'],['grove-c','top'],['dc','bottom']]){const port=din.get(id);assert.equal(port.meta.face,face,`cores3/din: ${id} face`);const normals={left:[-1,0,0],top:[0,1,0],bottom:[0,-1,0]};assert.ok(new THREE.Vector3(0,1,0).applyQuaternion(port.object3d.quaternion).distanceTo(new THREE.Vector3(...normals[face]))<1e-6,`cores3/din: ${id} mating frame`);}
  let closureRays=0;
  for(const x of [-11,11])for(const dx of [-4.5,0,4.5]){assert.ok(hit([x+dx,32,-2.1],[0,-1,0])[0]?.distance<11,'cores3/din: Grove shell opening has connector housing and recessed interior');closureRays++;}
  assert.ok(hit([-10,-32,-3.1],[0,1,0])[0]?.distance<7,'cores3/din: DC aperture contains the recessed center pin');closureRays++;
  const bore=hit([-8.5,-32,-3.1],[0,1,0])[0];assert.ok(bore&&bore.distance>10&&bore.distance<13,'cores3/din: DC bore retains a real recess behind its annular rim');closureRays++;
  assert.ok(hit([9,-32,-2.5],[0,1,0])[0]?.distance<5.5,'cores3/din: power-switch cutout contains the switch body');closureRays++;
  for(const z of [5.8,9.8])for(const y of [-7,2,17]){const first=hit([32,y,z],[-1,0,0])[0];assert.ok(first?.distance<7&&first.object.parent.name==='Speaker acoustic housing','cores3/din: actual grille holes have a nearby acoustic housing');closureRays++;}
  for(const x of [-12,12]){assert.ok(hit([x+1.5,0,-20],[0,0,1])[0]?.distance<4.5,'cores3/din: brass inserts align with horizontal CAD holes');assert.ok(hit([x,0,-20],[0,0,1])[0]?.distance>8,'cores3/din: threaded insert center remains open');closureRays+=2;}
  for(const x of [-15,15])for(const y of [-31.5,31.5])assert.equal(hit([x,y,-20],[0,0,1]).length,0,'cores3/din: four mounting-ear bores remain open');
  configurations.push({id:'dinBase',meshes:variantMeshes,closureRays,status:'pass'});din.dispose();console.log(`PASS cores3/dinBase: ${variantMeshes} meshes; kit assembly and ${closureRays} closure rays`);
 }
 reports.push({id:p.id,meshes,closureRays:(p.closureChecks??[]).length,...(configurations.length?{configurations}:{}),status:'pass'});
 const hostCode=await fs.readFile(path.join(root,p.entry),'utf8');assert.ok(!/qemu|fetch\(|setInterval\(/.test(hostCode),`${p.id}: model has no runtime backend`);
 console.log(`PASS ${p.id}: ${meshes} meshes; geometry and visual bindings`);d.dispose();total++;
}
console.log(`Checked ${total} implemented models. Unimplemented catalog entries remain explicitly pending.`);

await fs.mkdir(path.join(root,'artifacts'),{recursive:true});await fs.writeFile(path.join(root,'artifacts/geometry-check.json'),JSON.stringify({checkedAt:new Date().toISOString(),scope:'model geometry/API only; not hardware or external emulator proof',products:reports},null,2)+'\n');
