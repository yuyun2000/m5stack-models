import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';

/** May also be called by the aggregate geometry check with an already-built StamPLC instance. */
export function checkStamPLCTerminals(model){
 model.root.updateMatrixWorld(true);const poles=[],banks=[];
 model.root.traverse(o=>{if(o.userData.role==='terminal-pole')poles.push(o);if(o.userData.role==='terminal-bank')banks.push(o);});
 assert.deepEqual(banks.map(b=>b.userData.poles),[3,8,3,3,3,3],'StamPLC: three common/power, eight input and four three-pole relay banks');
 assert.equal(poles.length,23,'StamPLC: all 23 physical terminal positions exist');
 const hits=(origin,direction)=>new THREE.Raycaster(origin,direction).intersectObject(model.root,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0);
 let wireRays=0,screwRays=0;
 for(const pole of poles){
  const p=pole.userData,normal=new THREE.Vector3(...p.entryNormal),direction=normal.clone().negate();
  for(const dz of [-.55,0,.55]){
   const origin=new THREE.Vector3(...p.wireEntryMm).addScaledVector(normal,3);origin.z+=dz;const first=hits(origin,direction)[0];
   assert.ok(first?.object.name==='Clamp rear web'&&first.distance>8.5&&first.distance<9.5,`${p.id}: wire entry reaches a metal clamp about 6 mm behind the mouth`);wireRays++;
  }
  const rimOrigin=new THREE.Vector3(...p.wireEntryMm).addScaledVector(normal,3);rimOrigin.x+=1.9;const rim=hits(rimOrigin,direction)[0];
  assert.ok(rim?.object.name==='Open wire-entry frame'&&rim.distance<3.2,`${p.id}: the deep entry is surrounded by a solid molded frame`);wireRays++;
  const screw=pole.getObjectByName('Recessed slotted screw');assert.ok(screw,`${p.id}: physical screw assembly`);
  const slot=hits(screw.localToWorld(new THREE.Vector3(0,0,5.1)),new THREE.Vector3(0,0,-1))[0];
  const cap=hits(screw.localToWorld(new THREE.Vector3(0,1,5.1)),new THREE.Vector3(0,0,-1))[0];
  assert.ok(slot?.object.name==='Slot bottom and screw base'&&cap?.object.name==='Slotted metal screw head'&&cap.point.z-slot.point.z>.4,`${p.id}: screw slot is a visible geometric recess`);screwRays+=2;
 }
 const jack=model.root.getObjectByName('DC5521 input jack');assert.ok(jack,'StamPLC: DC5521 physical jack');
 const center=hits(jack.localToWorld(new THREE.Vector3(0,0,4.35)),new THREE.Vector3(0,-1,0))[0];
 const bore=hits(jack.localToWorld(new THREE.Vector3(1.6,0,4.35)),new THREE.Vector3(0,-1,0))[0];
 assert.ok(center?.object.name==='Recessed 2.1 mm center pin'&&center.distance>6&&center.distance<6.5,'StamPLC: jack center pin is visibly recessed');
 assert.ok(bore?.object.name==='Deep DC jack back'&&bore.distance>11&&bore.distance<12,'StamPLC: jack bore remains deep around its center pin');
 const port=model.get('dc');assert.equal(port.connector,'dc5521');assert.ok(new THREE.Vector3(0,1,0).applyQuaternion(port.object3d.quaternion).distanceTo(new THREE.Vector3(0,1,0))<1e-6,'StamPLC: DC mating frame points outward');
 return {banks:banks.length,poles:poles.length,wireRays,screwRays,dcRays:2,status:'pass'};
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 const noop=()=>{},ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),measureText:()=>({width:20})},{get:(o,k)=>o[k]??noop});globalThis.document={createElement:()=>({getContext:()=>ctx})};
 const {StamPLC}=await import('../src/devices/stamplc/index.js');const model=new StamPLC();
 console.log('PASS StamPLC terminal detail:',JSON.stringify(checkStamPLCTerminals(model)));model.dispose();
}
