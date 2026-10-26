import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';

export function checkCore2Assembly(model){
 model.root.updateMatrixWorld(true);
 const hits=(p,d)=>new THREE.Raycaster(new THREE.Vector3(...p),new THREE.Vector3(...d).normalize()).intersectObject(model.root,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0);
 const local=(g,p)=>hits(g.localToWorld(new THREE.Vector3(...p)).toArray(),new THREE.Vector3(0,0,-1).transformDirection(g.matrixWorld).toArray())[0];
 // Measure each native CAD mesh itself; its printed children are separate films.
 const cad=new THREE.Box3();model.root.traverse(o=>{if(o.isMesh&&o.userData.source==='official-structure'){o.geometry.computeBoundingBox();cad.union(o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld));}});
 for(const [i,n]of [54,54,16.5].entries())assert.ok(Math.abs(cad.getSize(new THREE.Vector3()).getComponent(i)-n)<.01,'Core2: official CAD envelope is unchanged');
 assert.ok(model.parts['side-key'].position.length()===0&&model.parts['side-key'].rotation.z===0,'Core2: do not relocate the unspecified original internal key part');
 const usb=model.root.getObjectByName('USB-C receptacle'),sd=model.root.getObjectByName('microSD receptacle'),grove=model.root.getObjectByName('Core2 Grove socket');
 assert.ok(usb&&sd&&grove,'Core2: all three external connectors have physical assemblies');
 assert.ok(usb.position.distanceTo(new THREE.Vector3(-27.02,0,0))<1e-6,'Core2: USB follows the actual left shell opening');
 const bore=local(usb,[0,1,4]),tongue=local(usb,[0,0,4]),rim=local(usb,[4.25,0,4]);
 assert.ok(bore?.object.name==='USB-C dielectric backstop'&&bore.distance>8.9,'Core2: USB cavity remains five millimetres deep through the real shell opening');
 assert.ok(tongue?.object.name==='USB-C centered tongue'&&tongue.distance>4.4,'Core2: USB tongue is recessed');
 assert.ok(rim?.object.name==='USB-C capsule metal shell'&&rim.distance<4,'Core2: continuous metal USB rim');
 const sdBore=local(sd,[0,.2,4]);assert.ok(sdBore?.object.name==='microSD insulating backstop'&&sdBore.distance>8.9,'Core2: actual bottom microSD slot has a recessed physical interior');
 assert.ok(sd.position.distanceTo(new THREE.Vector3(-6.5,-27.02,.75))<1e-6,'Core2: microSD is on the bottom, aligned with the official aperture');
 assert.ok(local(grove,[0,1,4])?.distance>9,'Core2: Grove interior is open through the actual left aperture');
 const power=model.button('power'),reset=model.button('reset');
 assert.ok(power.object3d.position.distanceTo(new THREE.Vector3(-27,13,-.75))<1e-6,'Core2: native power actuator follows the exact left CAD face');
 assert.ok(reset.object3d.position.distanceTo(new THREE.Vector3(14.5,-27,.75))<1e-6,'Core2: native reset actuator follows the exact bottom CAD face');
 assert.ok(model.keymap.KeyP==='power'&&model.keymap.KeyR==='reset','Core2: power/reset keyboard intents point to real controls');
 for(const [button,p,d,expected]of [[power,[-40,13,-.75],[1,0,0],-27],[reset,[14.5,-40,.75],[0,1,0],-26.9032]]){
  const before=hits(p,d)[0],axis=button===power?0:1;assert.ok(before?.object.userData.component===button&&before.object.userData.source==='official-structure','Core2: pointer hits the native CAD cap rather than a transparent proxy');assert.ok(Math.abs(before.point.getComponent(axis)-expected)<.005,'Core2: original native key face stays in its actual CAD position');
  button.press('assembly-check');button.update(1);model.root.updateMatrixWorld(true);const down=hits(p,d)[0];assert.equal(down?.object,before.object);assert.ok(Math.abs(down.point.getComponent(axis)-before.point.getComponent(axis)-button.travel)<1e-5,'Core2: actual cap moves inward and the static duplicate is absent');button.release('assembly-check');button.update(1);model.root.updateMatrixWorld(true);assert.ok(hits(p,d)[0].point.distanceTo(before.point)<1e-5,'Core2: exact native cap position restored after release');
 }
 const powerSeam=hits([-40,9.6,-.75],[1,0,0])[0],resetSeam=hits([11,-40,.75],[0,1,0])[0];
 assert.ok(powerSeam?.object.name==='Core2 power switch housing'&&powerSeam.point.x>-26,'Core2: actual power travel slit sees its recessed backing');
 assert.ok(resetSeam?.object.name==='Core2 reset switch housing'&&resetSeam.point.y>-26,'Core2: actual reset travel slit sees its recessed backing');
 let grilleRays=0;for(const y of [-7,5,17])for(const z of [-2,2]){const hit=hits([40,y,z],[-1,0,0])[0];assert.ok(hit?.object.name==='Core2 recessed speaker diaphragm'&&hit.point.x<26,'Core2: preserve real speaker grille holes with the recessed 0928 diaphragm behind');grilleRays++;}
 const pcb=new THREE.Box3().setFromObject(model.root.getObjectByName('Core2 main PCB'));let tails=0;
 model.root.traverse(o=>{if(o.name==='Core2 Grove PCB contact tail'){const b=new THREE.Box3().setFromObject(o);assert.ok(b.min.z<=pcb.max.z&&b.max.z>=-1.2,'Core2: Grove tails join the board to the contacts');tails++;}});assert.equal(tails,4);
 assert.ok(model.root.getObjectByName('Core2 LCD module back')&&model.root.getObjectByName('Core2 display carrier'),'Core2: full LCD thickness beneath the front glass');
 const lcd=model.display('lcd');for(const [x,y]of [[0,0],[-.48,-.48],[.48,.48]]){const o=lcd.object3d.localToWorld(new THREE.Vector3(x*lcd.size[0],y*lcd.size[1],50));assert.ok(hits(o.toArray(),[0,0,-1])[0]?.object===lcd.panel,'Core2: external framebuffer stays unobstructed');}
 const normals={bottom:[0,-1,0],left:[-1,0,0]};for(const port of model.list('port'))assert.ok(new THREE.Vector3(0,1,0).applyQuaternion(port.object3d.quaternion).distanceTo(new THREE.Vector3(...normals[port.meta.face]))<1e-6,`Core2: ${port.id} mating direction`);
 return {ports:3,groveTails:tails,grilleRays,controls:5,status:'pass'};
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){const noop=()=>{},ctx=new Proxy({},{get:()=>noop});globalThis.document={createElement:()=>({getContext:()=>ctx})};const {Core2}=await import('../src/devices/core2/index.js');const model=new Core2();console.log('PASS Core2 assembly:',JSON.stringify(checkCore2Assembly(model)));model.dispose();}
