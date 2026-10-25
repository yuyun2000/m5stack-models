import assert from 'node:assert/strict';
import * as THREE from 'three';
const noop=()=>{},ctx=new Proxy({measureText:()=>({width:20})},{get:(o,k)=>o[k]??noop});
globalThis.document={createElement:()=>({getContext:()=>ctx})};
const {Tab5}=await import('../src/devices/tab5/index.js');
const model=new Tab5();model.root.updateMatrixWorld(true);
const groups={};model.root.traverse(o=>{if(o.userData.visualFamily)groups[o.userData.visualFamily]=o;});
function hit(group,x,y){return new THREE.Raycaster(group.localToWorld(new THREE.Vector3(x,y,8)),new THREE.Vector3(0,0,-1).transformDirection(group.matrixWorld)).intersectObject(model.root,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0)[0];}
function reaches(group,x,y,name,maxZ){const h=hit(group,x,y);assert.ok(h?.object.name===name,`${group.name}: ${x},${y} obstructed by ${h?.object.name}`);if(maxZ!==undefined)assert.ok(group.worldToLocal(h.point.clone()).z<maxZ,`${group.name}: entrance must stay genuinely recessed`);}
const a=groups['usb-a'],c=groups['usb-c'],sd=groups['micro-sd'],audio=groups['audio-3.5mm'];
assert.ok(a&&c&&sd&&audio,'Tab5: four distinct physical connector families');
reaches(a,0,1.1,'USB-A dielectric backstop',-6.4);
for(const x of [-5.8,5.8])reaches(a,x,1.5,'USB-A dielectric backstop',-6.4);
for(const x of [-3,-1,1,3])reaches(a,x,-.18,'USB-A contact pad',-.8);
reaches(a,0,-.9,'USB-A lower tongue',-.6);
for(const y of [-.8,.8])reaches(c,0,y,'USB-C dielectric backstop',-3.4);
for(const y of [-.34,.34])for(const x of [-2.75,0.25,2.75])reaches(c,x,y,'USB-C contact pad',-.8);
reaches(c,0,0,'USB-C centered tongue',-.4);
reaches(sd,0,.2,'microSD insulating backstop',-4.9);
for(let i=0;i<8;i++)reaches(sd,(i-3.5)*1.1,-.31,'microSD spring contact',-3.2);
reaches(audio,0,0,'Audio jack deep backstop',-6.9);
for(const p of [[1.15,.5],[-1.15,-.5]])reaches(audio,...p,'Audio jack deep backstop',-6.9);
for(const [id,connector]of [['usb','usb-c'],['usb-a','usb-a'],['micro-sd','micro-sd'],['headset','audio-3.5mm']])assert.equal(model.get(id).connector,connector,`Tab5: preserve connector path ${id}`);
const pads=(g,name)=>g.children.filter(o=>o.name===name).length;
assert.equal(pads(a,'USB-A contact pad'),4);assert.equal(pads(c,'USB-C contact pad'),24);assert.equal(pads(sd,'microSD spring contact'),8);
for(const g of [a,c,sd,audio])for(const mesh of g.children){if(!mesh.isMesh)continue;assert.ok(!mesh.material.map,'connector detail must be actual geometry');for(const v of mesh.geometry.attributes.position.array)assert.ok(Number.isFinite(v),'finite connector geometry');}
for(const name of ['MMCX antenna socket 1','MMCX antenna socket 2']){
 const socket=model.root.getObjectByName(name);assert.ok(socket,'Tab5: both actual top-edge coaxial sockets present');
 reaches(socket,0,0,'MMCX internal backstop',-3.4);reaches(socket,.8,0,'MMCX dielectric seat',-.5);
}
const mount=model.root.getObjectByName('Quarter-inch tripod insert');assert.ok(mount,'Tab5: physical tripod insert');
reaches(mount,0,0,'Tripod blind-hole floor',-4.4);assert.ok(mount.getObjectByName('Tripod internal helical thread'),'Tab5: geometric internal thread');
const grille=new THREE.Raycaster(new THREE.Vector3(35,-50,0),new THREE.Vector3(0,1,0)).intersectObject(model.root,true)[0];
assert.ok(grille?.object.name==='Speaker grille backing'&&grille.point.y< -38,'Tab5: true speaker holes have a nearby acoustic housing');
assert.equal(model.get('micro-sd').meta.face,'bottom','Tab5: microSD is on the long bottom edge');
assert.equal(model.get('gpio-ext').meta.face,'bottom','Tab5: side GPIO_EXT shares the actual long edge');
const power=model.get('power');assert.ok(power&&power.meta.mechanism==='battery-release-latch'&&power.meta.legacyId==='power','Tab5: preserve the legacy power input ID while correctly identifying the rear battery latch');
const powerHit=new THREE.Raycaster(new THREE.Vector3(59.7,10,-20),new THREE.Vector3(0,0,1)).intersectObject(model.root,true)[0];
assert.ok(powerHit?.object===model.parts['power-actuator'],'Tab5: actual rear key, not its internal long retainer, is the visible actuator');
power.press('geometry-check');power.update(1);assert.ok(power.cap.position.z>.2,'Tab5: rear battery-release actuator presses inward along +Z');power.release('geometry-check');power.update(1);
model.dispose();console.log('PASS Tab5 connectors: distinct USB-A/C geometry, real microSD slot, deep 3.5 mm jack, PCB clearances and contact visibility.');
