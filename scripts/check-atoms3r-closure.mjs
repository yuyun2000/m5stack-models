import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';

/** Surface/assembly checks only; no label pixels, electrical behavior or fit proof. */
export function checkAtomS3RClosure(model){
 model.root.updateMatrixWorld(true);
 const cast=(p,d)=>new THREE.Raycaster(new THREE.Vector3(...p),new THREE.Vector3(...d)).intersectObject(model.root,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0)[0];
 let rearRays=0,plasticRays=0,detailRays=0,rearMinZ=Infinity,rearMaxZ=-Infinity;
 // A 1mm grid covers the rear interior projection, including PCB, holding
 // plate, header openings and connector floor. Missing boards cannot be hidden
 // by a front screen hit: every first surface must lie near the rear plane.
 for(let x=-10;x<=10;x++)for(let y=-10;y<=10;y++){
  const h=cast([x,y,-20],[0,0,1]);
  assert.ok(h&&h.point.z>=-6.6&&h.point.z<=-4.4,`AtomS3R: rear assembly missing at ${x},${y}; first surface ${h?.point.z}`);
  rearMinZ=Math.min(rearMinZ,h.point.z);rearMaxZ=Math.max(rearMaxZ,h.point.z);rearRays++;
 }
 // The white rectangle below the rear PCB is the Grove floor, not background.
 for(let x=-4;x<=4;x+=2)for(let y=-11;y<=-7;y++){
  const h=cast([x,y,-20],[0,0,1]);
  assert.ok(h?.object.parent?.name==='HY2.0-4P'&&Math.abs(h.point.z+6.45)<.02,'AtomS3R: Grove rear floor is physical plastic');plasticRays++;
 }
 for(const x of [-6,6])for(const z of [-3.5,-2.5,-1.5]){
  const h=cast([x,-25,z],[0,1,0]);
  assert.ok(h?.object.name==='Grove connector side seat'&&Math.abs(h.point.y+11.2)<.03,'AtomS3R: connector-side window needs its black seat rather than a view across the hollow case');detailRays++;
 }
 for(const x of [-5.25,5.25]){
  const h=cast([x,-25,-3.3],[0,1,0]);
  assert.ok(h?.object.name==='Grove retaining clip','AtomS3R: separate retaining tab visible beside Grove housing');detailRays++;
 }
 for(const x of [-4,4]){
  const h=cast([x,-25,2.5],[0,1,0]);
  assert.ok(h?.object.name==='USB-C rectangular package surround'&&h.point.y< -11.5,'AtomS3R: USB capsule corner has a real package behind it');detailRays++;
 }
 const usb=cast([0,-25,2],[0,1,0]);
 assert.ok(usb?.object.name==='USB-C dielectric backstop'&&usb.point.y> -8.8&&usb.point.y< -8.1,'AtomS3R: USB insertion cavity stays recessed and open');detailRays++;
 const grove=cast([0,-25,-3],[0,1,0]);
 assert.ok(grove?.object.parent?.name==='HY2.0-4P'&&grove.point.y> -7&&grove.point.y< -5.7,'AtomS3R: side seats do not cap the Grove mouth');detailRays++;
 const mount=cast([0,0,-20],[0,0,1]);
 assert.ok(mount?.object.name==='M2 mounting blind-hole floor'&&Math.abs(mount.point.z+5.45)<.02,'AtomS3R: preserve the genuine recessed mounting bore');detailRays++;
 for(const x of [-7,0,7]){
  const h=cast([x,-25,4.15],[0,1,0]);assert.ok(h?.object.name==='3D antenna body'&&h.point.y< -11.5,'AtomS3R: antenna assembly closes its long upper window');detailRays++;
 }
 for(const id of ['usb','grove']){
  const port=model.get(id);assert.ok(port&&port.meta.face==='bottom',`AtomS3R: preserve ${id} public connector and face`);
  assert.ok(new THREE.Vector3(0,1,0).applyQuaternion(port.object3d.quaternion).distanceTo(new THREE.Vector3(0,-1,0))<1e-6,`AtomS3R: ${id} mating frame points through the real bottom`);
 }
 const lcdBody=model.root.getObjectByName('LCD module body');assert.ok(lcdBody,'AtomS3R: physical LCD module exists');
 assert.ok(new THREE.Box3().setFromObject(lcdBody).getSize(new THREE.Vector3()).z>2.9,'AtomS3R: LCD has assembly depth rather than a lone framebuffer plane');
 let photographicPanels=0;model.root.traverse(o=>{if(o.userData.role==='printed-artwork')photographicPanels++;});
 assert.equal(photographicPanels,0,'AtomS3R: no photographic plane substitutes for missing assembly');
 return {status:'pass',rearRays,grovePlasticRays:plasticRays,detailRays,rearFirstZMm:[rearMinZ,rearMaxZ],scope:'assembled surfaces; real port and mounting cavities retained; not fabrication or hardware validation'};
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 const noop=()=>{},ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});globalThis.document={createElement:()=>({getContext:()=>ctx})};
 const {AtomS3R}=await import('../src/devices/atoms3r/index.js');const model=new AtomS3R();console.log('PASS AtomS3R closure:',JSON.stringify(checkAtomS3RClosure(model)));model.dispose();
}
