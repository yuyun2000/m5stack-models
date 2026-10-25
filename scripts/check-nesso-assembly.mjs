import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';

export function checkNessoAssembly(model){
 model.root.updateMatrixWorld(true);
 assert.ok(!model.parts['side-expansion'],'Nesso: a second pose of the same antenna must not be installed');
 const antenna=model.parts['stowed-lora-antenna'];assert.ok(antenna,'Nesso: single stored LoRa antenna');
 const cad=new THREE.Box3(),casing=new THREE.Box3();model.root.traverse(o=>{if(o.userData.source==='official-structure')cad.expandByObject(o);});
 for(const name of ['upper-housing','back-cover'])casing.expandByObject(model.parts[name]);
 for(const [i,size]of [24,48,22].entries())assert.ok(Math.abs(cad.getSize(new THREE.Vector3()).getComponent(i)-size)<.01,`Nesso: selected CAD assembly axis ${i}`);
 assert.ok(Math.abs(casing.getSize(new THREE.Vector3()).z-21.1)<.01,'Nesso: casing depth excludes the 0.9 mm raised key');
 const antennaSize=new THREE.Box3().setFromObject(antenna).getSize(new THREE.Vector3());for(const [i,n]of [10.8,45.5,6].entries())assert.ok(Math.abs(antennaSize.getComponent(i)-n)<.01,'Nesso: stored antenna envelope includes connector/latch projections');
 const hits=(origin,direction)=>new THREE.Raycaster(origin,direction).intersectObject(model.root,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0);
 const localHit=(group,origin,direction)=>hits(group.localToWorld(new THREE.Vector3(...origin)),new THREE.Vector3(...direction).transformDirection(group.matrixWorld))[0];
 const usb=model.root.getObjectByName('Nesso USB-C assembly');
 const usbBore=localHit(usb,[0,.95,4],[0,0,-1]),tongue=localHit(usb,[0,0,4],[0,0,-1]),rim=localHit(usb,[4.25,0,4],[0,0,-1]);
 assert.ok(usbBore?.object.name==='USB-C recessed back'&&usbBore.distance>9,'Nesso: real USB cavity reaches behind the shell');
 assert.ok(tongue?.object.name==='USB-C tongue'&&tongue.distance>4.5,'Nesso: USB tongue remains recessed');
 assert.ok(rim?.object.name==='USB-C metal shell'&&rim.distance<4.1,'Nesso: continuous metal USB rim');
 const contact=localHit(usb,[.24,1,4],[0,-.63,-5.8]);assert.ok(contact?.object.name==='USB-C contact','Nesso: USB surface contact is visible inside the cavity');
 const pcbBox=new THREE.Box3().setFromObject(model.root.getObjectByName('Nesso main PCB'));let tails=0,tabs=0;
 model.root.traverse(o=>{if(o.name==='Grove PCB contact tail'){const b=new THREE.Box3().setFromObject(o);assert.ok(b.min.z<.6&&b.max.z>=pcbBox.min.z,'Nesso: Grove tail joins the contact elbow to the PCB');tails++;}if(o.name==='USB shell solder tab'){const b=new THREE.Box3().setFromObject(o);assert.ok(b.min.z<=pcbBox.max.z+.01&&b.max.z>=4.25,'Nesso: USB mount joins its shell to the PCB');tabs++;}});
 assert.equal(tails,4);assert.equal(tabs,2);
 const qwiic=model.root.getObjectByName('Qwiic connector'),qBore=localHit(qwiic,[0,0,4],[0,0,-1]),qContact=localHit(qwiic,[.5,-.2,4],[0,0,-1]);
 assert.ok(qBore?.object.name==='Qwiic socket back'&&qBore.distance>6.5,'Nesso: Qwiic bore is open and recessed');assert.ok(qContact?.object.name==='Qwiic contact'&&qContact.distance<5,'Nesso: Qwiic metal contact sits inside the mouth');
 const rf=model.root.getObjectByName('LoRa RF snap receptacle'),rfBore=localHit(rf,[0,0,4],[0,0,-1]),dielectric=localHit(rf,[.65,0,4],[0,0,-1]),rfContact=localHit(rf,[.2,0,4],[0,0,-1]);
 assert.ok(rfBore?.object.name==='RF socket bore back'&&rfBore.distance>5.5,'Nesso: external RF center bore has depth');assert.ok(dielectric?.object.name==='RF socket dielectric'&&rfContact?.object.name==='RF female center contact','Nesso: RF dielectric and center contact remain visible');
 const stored=model.root.getObjectByName('Stored antenna coaxial plug');assert.ok(Math.abs(stored.position.y+19.13)<.01,'Nesso: stored plug follows the antenna drawing rather than the enclosure lip');
 assert.ok(stored.getObjectByName('Antenna plug center pin'),'Nesso: stored antenna plug includes its center pin');
 const storedSide=hits(new THREE.Vector3(-.05,-30,-4.2),new THREE.Vector3(0,1,0))[0];assert.ok(storedSide&&['Antenna snap collar','Antenna plug barrel'].includes(storedSide.object.name)&&storedSide.distance<10,'Nesso: stored connector metal remains visible in the actual lower opening');
 const headers=[];model.root.traverse(o=>{if(o.userData.visualFamily==='female-header')headers.push(o);});assert.equal(headers.length,1);const header=headers[0];
 for(let i=0;i<8;i++){const x=(i-3.5)*2.54;assert.ok(localHit(header,[x,0,4],[0,0,-1])?.object.name==='Header socket floor','Nesso: HAT socket remains visible through the actual top opening');}
 for(const x of [-9,9]){const slot=hits(new THREE.Vector3(x,-21,-15),new THREE.Vector3(0,0,1))[0],head=hits(new THREE.Vector3(x+1.15,-21,-15),new THREE.Vector3(0,0,1))[0];assert.ok(slot?.object.name==='Rear screw hex recess floor'&&head?.object.name==='Rear M2 socket-head fastener'&&slot.point.z-head.point.z>.7,'Nesso: rear screw position and hex recess agree with the CAD counterbores');}
 // These paired narrow slots are real CAD cutouts, also visibly open in official gallery-13/15.
 // Check the enclosure itself, so future legitimate internal parts do not have to preserve a background sightline.
 let intentionalSideSlotRays=0;
 for(const side of [-1,1])for(const y of [-10,10]){
  const direction=new THREE.Vector3(-side,0,0);
  for(const z of [2.8,3.15]){const ray=new THREE.Raycaster(new THREE.Vector3(side*18,y,z),direction);assert.equal(ray.intersectObject(model.parts['upper-housing'],true).length,0,'Nesso: preserve intentional paired side slots');intentionalSideSlotRays++;}
  const wall=new THREE.Raycaster(new THREE.Vector3(side*18,y,1.5),direction).intersectObject(model.parts['upper-housing'],true)[0];assert.ok(wall&&wall.distance>5.9&&wall.distance<6.1,'Nesso: solid nearby side wall bounds the intentional slots');intentionalSideSlotRays++;
 }
 const normals={bottom:[0,-1,0],left:[-1,0,0],right:[1,0,0]};for(const port of model.list('port'))assert.ok(new THREE.Vector3(0,1,0).applyQuaternion(port.object3d.quaternion).distanceTo(new THREE.Vector3(...normals[port.meta.face]))<1e-6,`Nesso: ${port.id} mating frame`);
 const lcd=model.display('lcd');for(const [x,y]of [[0,0],[-.48,-.48],[.48,.48]]){const origin=lcd.object3d.localToWorld(new THREE.Vector3(x*lcd.size[0],y*lcd.size[1],50));assert.ok(hits(origin,new THREE.Vector3(0,0,-1))[0]?.object===lcd.panel,'Nesso: display remains unobstructed');}
 return {antennaPoses:1,hatSockets:8,groveTails:tails,usbTabs:tabs,ports:model.list('port').length,intentionalSideSlotRays,status:'pass'};
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 const noop=()=>{},ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),measureText:()=>({width:20})},{get:(o,k)=>o[k]??noop});globalThis.document={createElement:()=>({getContext:()=>ctx})};
 const {NessoN1}=await import('../src/devices/nesso-n1/index.js');const model=new NessoN1();console.log('PASS Nesso N1 assembly:',JSON.stringify(checkNessoAssembly(model)));model.dispose();
}
