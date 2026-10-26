import assert from 'node:assert/strict';
import * as THREE from 'three';
const noop=()=>{},ctx=new Proxy({measureText:()=>({width:20})},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});
globalThis.document={createElement:()=>({getContext:()=>ctx})};
const {StopWatch}=await import('../src/devices/stopwatch/index.js');
const model=new StopWatch();model.root.updateMatrixWorld(true);
for(const [name,sx,sy]of [['power-key',-1,-1],['key-a',-1,1],['key-b',1,1]]){
 const center=new THREE.Box3().setFromObject(model.parts[name]).getCenter(new THREE.Vector3());
 assert.ok(center.x*sx>15&&center.y*sy>15,`StopWatch: ${name} matches the official front-view quadrant`);
}
const headers=[];model.root.traverse(o=>{if(o.userData.visualFamily==='female-header')headers.push(o);});
assert.equal(headers.find(h=>h.position.x<0)?.userData.layout.rows,7,'StopWatch: model -X has the 7P rear header');
assert.equal(headers.find(h=>h.position.x>0)?.userData.layout.rows,6,'StopWatch: model +X has the 6P rear header');
const cast=(origin,direction)=>new THREE.Raycaster(origin,direction).intersectObject(model.root,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0);
const usb=cast(new THREE.Vector3(0,-35,1),new THREE.Vector3(0,1,0))[0];assert.ok(usb?.object.parent.name==='USB-C','StopWatch: USB insert occupies the actual bottom CAD aperture');
const group=model.root.getObjectByName('HY2.0-4P'),outward=new THREE.Vector3(0,0,1).transformDirection(group.matrixWorld);
assert.ok(outward.distanceTo(new THREE.Vector3(Math.SQRT1_2,-Math.SQRT1_2,0))<1e-6,'StopWatch: Grove is radial on the lower-right rim');
for(const x of [-3,-1,1,3]){
 const hit=cast(group.localToWorld(new THREE.Vector3(x,-.15,5)),outward.clone().negate())[0];
 assert.ok(hit?.object.parent===group,`StopWatch: Grove contact at ${x} visible through the real curved shell aperture`);
}
// The official rear grille is at the top, rather than next to a rear header.
const pcb=model.root.getObjectByName('Rear main PCB');
assert.ok(pcb,'StopWatch: rear main PCB exists independently of its label');
// This assertion checks the native shell mesh. The separate raster film uses
// alpha for its U-shaped outer cutline and is reviewed with decoded pixels.
const speakerHits=new THREE.Raycaster(new THREE.Vector3(0,16,-20),new THREE.Vector3(0,0,1)).intersectObject(model.parts['body-shell'],false);
assert.equal(speakerHits.length,0,'StopWatch: top grille center stays a genuine shell aperture');
assert.ok(cast(new THREE.Vector3(0,16,-20),new THREE.Vector3(0,0,1))[0]?.object.name==='Speaker acoustic backing','StopWatch: rear grille has nearby acoustic backing');
model.dispose();console.log('PASS StopWatch: CAD orientation, button quadrants, 7+6 headers, actual USB/Grove apertures and rear backing.');
