import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';

export function checkNanoC6Assembly(model){
 model.root.updateMatrixWorld(true);
 const hits=(p,d)=>new THREE.Raycaster(new THREE.Vector3(...p),new THREE.Vector3(...d).normalize()).intersectObject(model.root,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0);
 const local=(g,p)=>hits(g.localToWorld(new THREE.Vector3(...p)).toArray(),new THREE.Vector3(0,0,-1).transformDirection(g.matrixWorld).toArray())[0];
 const cad=new THREE.Box3();for(const part of Object.values(model.parts))cad.expandByObject(part);
 for(const [i,n]of [12,23.47,9.5].entries())assert.ok(Math.abs(cad.getSize(new THREE.Vector3()).getComponent(i)-n)<.01,'NanoC6: official two-piece shell envelope is unchanged');
 const usb=model.root.getObjectByName('USB-C receptacle'),grove=model.root.getObjectByName('NanoC6 Grove socket');
 assert.ok(usb&&grove,'NanoC6: physical connector assemblies');
 assert.ok(usb.position.distanceTo(new THREE.Vector3(0,-11.67,1.2))<1e-6,'NanoC6: USB is at the actual front-half opening');
 const bore=local(usb,[0,1,4]),tongue=local(usb,[0,0,4]),rim=local(usb,[4.25,0,4]);
 assert.ok(bore?.object.name==='USB-C dielectric backstop'&&bore.distance>7.4,'NanoC6: USB bore reaches a recessed backstop without PCB obstruction');
 assert.ok(tongue?.object.name==='USB-C centered tongue'&&tongue.distance>4.4,'NanoC6: USB tongue remains recessed');
 assert.ok(rim?.object.name==='USB-C capsule metal shell'&&rim.distance<4,'NanoC6: USB capsule rim remains physically visible');
 assert.ok(local(grove,[0,1,4])?.distance>9,'NanoC6: Grove bore stays open through the end face');
 const pin=local(grove,[1,-.15,4]);assert.ok(pin&&pin.object.parent===grove&&pin.object.material.metalness>.7&&pin.distance>4.5,'NanoC6: real Grove contact inside its socket');
 const pcb=new THREE.Box3().setFromObject(model.root.getObjectByName('NanoC6 main PCB'));
 assert.ok(pcb.max.z<1.2-3.1/2,'NanoC6: the PCB stays below the USB shell and inner bore');
 let rearSlotRays=0,endSlotRays=0;
 const inside=['NanoC6 main PCB','NanoC6 USB-side ceramic package','NanoC6 Grove underside molding'];
 for(const y of [-10,-9,-8.5,8.5,9,10])for(const x of [-2.2,0,2.2]){
  const ray=new THREE.Raycaster(new THREE.Vector3(x,y,-12),new THREE.Vector3(0,0,1));
  assert.equal(ray.intersectObject(model.parts['rear-shell'],true).length,0,'NanoC6: keep the actual rear ventilation/assembly slots open');
  const first=hits([x,y,-12],[0,0,1])[0];assert.ok(first&&inside.includes(first.object.name)&&first.point.z>-2.6&&first.point.z<-.9,'NanoC6: actual PCB/package thickness is recessed behind each rear slot');rearSlotRays++;
 }
 for(const sign of [-1,1])for(const x of [-2.2,0,2.2])for(const z of [-2.3,-2]){
  const first=hits([x,sign*20,z],[0,-sign,0])[0];assert.ok(first?.object.name===(sign<0?'NanoC6 USB-side ceramic package':'NanoC6 Grove underside molding')&&Math.abs(first.point.y)<10,'NanoC6: preserve end-slot depth with the real underside assembly behind');endSlotRays++;
 }
 let tails=0,tabs=0;model.root.traverse(o=>{
  if(o.name==='NanoC6 Grove PCB tail'){const b=new THREE.Box3().setFromObject(o);assert.ok(b.min.z<=pcb.max.z&&b.max.z>2,'NanoC6: Grove contacts connect to the board');tails++;}
  if(o.name==='NanoC6 USB shield solder tab'){const b=new THREE.Box3().setFromObject(o);assert.ok(b.min.z<=pcb.max.z&&b.max.z>=1.2-3.1/2,'NanoC6: USB solder mounts bridge to the PCB');tabs++;}
 });assert.equal(tails,4);assert.equal(tabs,2);
 assert.ok(hits([12,2.45,.5],[-1,0,0])[0]?.object.name==='IR optical lens','NanoC6: existing physical IR lens remains visible through the right aperture');
 assert.ok(hits([-12,4.85,-1.55],[1,0,0])[0]?.object===model.led('rgb').lens,'NanoC6: RGB lens is visible in the actual left board-edge opening');
 assert.ok(model.button('button')&&model.keymap.Space==='button','NanoC6: retain the official integral front key and its intent target');
 const normals={bottom:[0,-1,0],top:[0,1,0]};for(const port of model.list('port'))assert.ok(new THREE.Vector3(0,1,0).applyQuaternion(port.object3d.quaternion).distanceTo(new THREE.Vector3(...normals[port.meta.face]))<1e-6,`NanoC6: ${port.id} mating direction`);
 return {ports:2,groveTails:tails,usbTabs:tabs,rearSlotRays,endSlotRays,status:'pass'};
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){const noop=()=>{},ctx=new Proxy({createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});globalThis.document={createElement:()=>({getContext:()=>ctx})};const {NanoC6}=await import('../src/devices/nanoc6/index.js');const model=new NanoC6();console.log('PASS NanoC6 assembly:',JSON.stringify(checkNanoC6Assembly(model)));model.dispose();}
