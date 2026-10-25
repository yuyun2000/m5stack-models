import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {Device,Port} from '../src/core/index.js';
import {portQuaternion} from '../src/modeling/parts.js';

export async function checkCardKB(){
 const {Model,GroveModule,KEYS,spec}=await import('../src/units/cardkb/index.js');
 const model=new Model();model.root.updateMatrixWorld(true);assert.equal(KEYS.length,50);assert.equal(new Set(KEYS.map(k=>k.id)).size,50);
 const rows=[0,1,2,3,4].map(r=>KEYS.filter(k=>k.row===r).length);assert.deepEqual(rows,[12,12,11,11,4],'official 46 typing/function keys plus four arrows');
 const hit=(p,d,root=model.root)=>new THREE.Raycaster(new THREE.Vector3(...p),new THREE.Vector3(...d)).intersectObject(root,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0)[0];
 const board=model.parts.pcb,box=new THREE.Box3();model.root.traverse(o=>{if(!o.isMesh)return;for(const v of o.geometry.attributes.position?.array??[])assert.ok(Number.isFinite(v));if(o.material?.opacity!==0)box.expandByObject(o);assert.ok(!o.material?.map,'no sticker/photo textures');});
 const b=new THREE.Box3().setFromObject(board);assert.ok(Math.abs(b.getSize(new THREE.Vector3()).x-84)<1e-6&&Math.abs(b.getSize(new THREE.Vector3()).y-54)<1e-6,'official drawing PCB outline');
 const physical=box.getSize(new THREE.Vector3()).toArray();for(const [i,n]of [84.35,54,6.301].entries())assert.ok(Math.abs(physical[i]-n)<.01,'visible envelope is separate from conflicting source table');
 for(const p of [[-37,22],...Array.from({length:6},(_,i)=>[-35.5+i*2.54,-25.5])])assert.ok(!hit([p[0],p[1],20],[0,0,-1]),'mounting and ISP holes remain real through-holes in all board layers');
 const positions=new Map(),events=[];model.on('input',e=>events.push(e));
 for(const key of KEYS){
  const button=model.button(key.id),cap=button.cap.children[0];positions.set(key.id,cap.getWorldPosition(new THREE.Vector3()));assert.ok(hit([key.position[0],key.position[1],20],[0,0,-1])?.object===cap,'all fifty real caps are visible/pickable');button.press('check');
 }
 assert.equal(model.update(1),true,'pressed terminal frame requests render');model.root.updateMatrixWorld(true);
 for(const key of KEYS){const button=model.button(key.id),cap=button.cap.children[0],delta=cap.getWorldPosition(new THREE.Vector3()).sub(positions.get(key.id));assert.ok(Math.abs(delta.z+.2)<1e-6&&Math.hypot(delta.x,delta.y)<1e-6,'each physical cap moves .2mm along its local push axis');button.release('check');}
 assert.equal(model.update(1),true,'released terminal frame requests render');model.root.updateMatrixWorld(true);
 for(const key of KEYS)assert.ok(model.button(key.id).cap.children[0].getWorldPosition(new THREE.Vector3()).distanceTo(positions.get(key.id))<1e-6,'every cap returns exactly to its own rest pose');assert.equal(model.update(.1),false,'keyboard goes idle after releasing');
 assert.equal(events.filter(e=>e.action==='down').length,50);assert.ok(events.every(e=>e.kind==='button'&&!('character' in e)&&!('keyCode' in e)),'only per-key physical intents; no matrix/firmware translation');
 const normal=new THREE.Vector3(0,1,0).applyQuaternion(model.port('grove').object3d.quaternion);assert.ok(normal.distanceTo(new THREE.Vector3(-1,0,0))<1e-6,'Grove actually faces left');
 const bore=hit([-55,12,.5],[1,0,0]);assert.ok(bore&&bore.object.parent.name==='CardKB left Grove socket'&&bore.point.x>-35,'Grove depth is clear through its open mouth');
 const pin=hit([-55,11,.35],[1,0,0]);assert.ok(pin&&pin.object.parent.name==='CardKB left Grove socket'&&pin.object.material.metalness>.7&&pin.point.x<-41,'metal contacts face out through the left mouth');
 let tails=0;model.root.traverse(o=>{if(o.name==='CardKB Grove PCB tail'){const b=new THREE.Box3().setFromObject(o);assert.ok(b.min.z<=-2.15&&b.max.z>=.34,'Grove tails join the socket contacts to the PCB');tails++;}});assert.equal(tails,4);
 assert.ok(model.led('rgb').object3d.position.distanceTo(new THREE.Vector3(...spec.rgb))<1e-6,'RGB sits between MCU and Shift row, as photographed');model.led('rgb').set({color:'#00ff00',brightness:.5});assert.ok(!model.button('key-a').pressed,'externally driven LED does not emulate keyboard logic');
 const host=new Device(),port=host.add(new Port({id:'unit',connector:'grove',position:[3,4,5],quaternion:portQuaternion('right')})),module=new GroveModule({cableLength:70});port.attach(module);host.root.updateMatrixWorld(true);
 const input=module.port('grove'),inputBefore=input.object3d.getWorldPosition(new THREE.Vector3()),cableBefore=module.get('cable').getState();assert.equal(module.list('button').length,50);assert.ok(host.get('unit/key-q')===module.button('key-q'),'external framework resolves every key through its Grove module');
 const nested=[];host.on('input',e=>nested.push(e));host.get('unit/key-q').press('framework');host.update(1);host.get('unit/key-q').release('framework');host.update(1);host.root.updateMatrixWorld(true);assert.ok(nested.some(e=>e.id==='unit/key-q'&&e.action==='down'),'mounted key intent has stable nested path');assert.ok(input.object3d.getWorldPosition(new THREE.Vector3()).distanceTo(inputBefore)<1e-6,'key action leaves Grove mating face fixed');assert.equal(module.get('cable').getState().faceDistanceMm,cableBefore.faceDistanceMm,'key action leaves cable endpoints fixed');
 module.get('unitFrame').setPose({rotation:[.15,.2,.3]});host.root.updateMatrixWorld(true);assert.equal(module.get('cable').getState().wireCount,4,'actual rotated left input still has four connected wires');port.detach();host.dispose();model.dispose();
 return {keys:50,rowCounts:rows,nominalMm:spec.nominalMm,drawingMm:spec.drawingEnvelopeMm,visibleMm:physical,groveTails:tails,status:'pass'};
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){const noop=()=>{},ctx=new Proxy({createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});globalThis.document={createElement:()=>({getContext:()=>ctx})};console.log('PASS CardKB v1.1:',JSON.stringify(await checkCardKB()));}
