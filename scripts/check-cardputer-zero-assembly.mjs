import assert from 'node:assert/strict';
import * as THREE from 'three';

// Canvas placeholder only; the dedicated browser review must inspect pixels.
const noop=()=>{},ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});
globalThis.document={createElement:()=>({getContext:()=>ctx})};
const {CardputerZero}=await import('../src/devices/cardputer-zero/index.js');
const model=new CardputerZero();model.root.updateMatrixWorld(true);
const hits=(origin,direction)=>new THREE.Raycaster(origin,direction).intersectObject(model.root,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0);
const cast=(o,d)=>hits(new THREE.Vector3(...o),new THREE.Vector3(...d));
const keys=model.list('button').filter(b=>b.meta.role==='keyboard-key');
assert.equal(keys.length,46,'C154 has four eleven-key rows plus ESC and TAB, not the 56-key ADV layout');
assert.equal(new Set(keys.map(k=>k.id)).size,46,'unique keyboard addresses');
for(const key of keys){
 const p=key.object3d.getWorldPosition(new THREE.Vector3());
 const first=hits(p.clone().add(new THREE.Vector3(0,0,20)),new THREE.Vector3(0,0,-1))[0];
 assert.ok(first?.object.name==='Rubber key cap',`${key.id}: cap must be visible through its real front-lid hole`);
 assert.ok(p.z>9.8,'keyboard and LCD occupy the same front deck level');
}
const f1=model.get('key-F1');f1.press('geometry-check');f1.update(1);model.root.updateMatrixWorld(true);
assert.ok(f1.cap.position.z<-.24,'existing inward key press is preserved');f1.release('geometry-check');f1.update(1);
const lcd=model.display('lcd');
for(const [x,y]of [[0,0],[-.48,-.48],[-.48,.48],[.48,-.48],[.48,.48]]){
 const origin=lcd.object3d.localToWorld(new THREE.Vector3(lcd.size[0]*x,lcd.size[1]*y,50));
 assert.ok(hits(origin,new THREE.Vector3(0,0,-1))[0]?.object===lcd.panel,'LCD framebuffer edge must be visible above its physical module');
}

// The following side positions and families are constrained by official side
// photos 09/10: HDMI/audio/Grove on left, USB-A/RJ45 on right, two USB-C above.
for(const [id,axis,sign]of [['hdmi','x',-1],['headset','x',-1],['grove','x',-1],['usb-c2','x',-1],['usb-a','x',1],['ethernet','x',1],['usb-c','x',1],['ext','y',1],['micro-sd','y',1]]){
 const port=model.get(id);assert.ok(port,`${id}: connector exists`);
 const position=port.object3d.getWorldPosition(new THREE.Vector3());assert.ok(position[axis]*sign>(axis==='x'?41.8:26.8),`${id}: correct outer face`);
 const normal=new THREE.Vector3(0,1,0).applyQuaternion(port.object3d.getWorldQuaternion(new THREE.Quaternion()));
 const expected=new THREE.Vector3();expected[axis]=sign;assert.ok(normal.distanceTo(expected)<1e-6,`${id}: module mating frame points out of the product`);
}
assert.equal(model.get('hdmi').connector,'hdmi','the pictured display output is a full-size Type-A, not a mini-HDMI');
for(const [name,xy,expected,minDepth]of [['USB-C receptacle',[0,.85],'USB-C dielectric backstop',4],['USB-A receptacle',[0,.8],'USB-A dielectric backstop',8],['HDMI Type-A display output',[0,1.6],'HDMI dielectric backstop',7],['10/100 Ethernet RJ45',[0,0],'RJ45 deep backstop',11],['3.5 mm audio jack',[0,0],'Audio jack deep backstop',6.5],['microSD receptacle',[0,.3],'microSD insulating backstop',4.5]]){
 const groups=[];model.root.traverse(o=>{if(o.name===name)groups.push(o);});assert.ok(groups.length>0,`${name}: physical body`);
 for(const group of groups){
  const origin=group.localToWorld(new THREE.Vector3(...xy,5)),direction=new THREE.Vector3(0,0,-1).transformDirection(group.matrixWorld),first=hits(origin,direction)[0];
  assert.ok(first?.object.name===expected,`${name}: insertion channel blocked by ${first?.object.name}`);
  assert.ok(first.distance>minDepth+5,`${name}: meaningful insertion depth`);
 }
}
const rj45=model.root.getObjectByName('10/100 Ethernet RJ45');
for(let i=0;i<8;i++){
 const first=hits(rj45.localToWorld(new THREE.Vector3((i-3.5)*1.15,3.8,5)),new THREE.Vector3(0,0,-1).transformDirection(rj45.matrixWorld))[0];
 assert.ok(first?.object.name===`RJ45 spring contact ${i+1}`,'all eight Ethernet contacts remain visible inside the cavity');
}
const ext=model.root.getObjectByName('Female expansion header');assert.ok(ext,'14P physical header');
for(let c=0;c<7;c++)for(let r=0;r<2;r++){
 const first=hits(ext.localToWorld(new THREE.Vector3((c-3)*2.54,(r-.5)*2.54,4)),new THREE.Vector3(0,0,-1).transformDirection(ext.matrixWorld))[0];
 assert.ok(first?.object.name==='Header socket floor','all 14 EXT bores remain recessed and unobstructed');
}
assert.ok(cast([0,20.8,-20],[0,0,1])[0]?.object.name==='Camera optical glass','rear camera has actual visible optics');
for(const x of [-36,-20,20,36]){
 const first=cast([x,23,-20],[0,0,1])[0];
 assert.ok(first?.object.name==='Rear mounting blind-hole floor'&&first.point.z>-6,'rear LEGO mounting openings are real blind sockets');
}
for(let i=0;i<8;i++)assert.ok(cast([(i-3.5)*3,-35,1],[0,1,0])[0]?.object.name==='Speaker acoustic enclosure','eight lower slots retain actual depth and an assembled speaker behind them');
const box=new THREE.Box3();model.root.traverse(o=>{if(o.isMesh){for(const n of o.geometry.attributes.position?.array??[])assert.ok(Number.isFinite(n),'finite model geometry');if(o.material?.opacity!==0)box.expandByObject(o);}});
const envelope=box.getSize(new THREE.Vector3());assert.ok(envelope.x<85&&envelope.y<54.6&&envelope.z<24,'visual inserts remain close to the nominal enclosure without hiding real protrusions');
console.log(`PASS CardputerZero: 46 physical keys, LCD clearance, nine correct connector frames, real insertion depths, eight Ethernet contacts, 14 EXT bores, rear optics/blind sockets. Visible envelope ${envelope.toArray().map(n=>n.toFixed(3)).join(' × ')} mm.`);
model.dispose();
