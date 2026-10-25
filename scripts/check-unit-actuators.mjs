import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {Device,Port} from '../src/core/index.js';
import {loadModel,loadGroveModule} from '../src/loaders.js';
import {checkDeviceActuators} from './check-device-actuators.mjs';

const settle=model=>{for(let i=0;i<80;i++)model.update(1/60);model.root.updateMatrixWorld(true);};
const near=(a,b,why,tolerance=2e-5)=>assert.ok(Math.abs(a-b)<tolerance,`${why}: ${a} vs ${b}`);
const cast=(root,x,y)=>new THREE.Raycaster(new THREE.Vector3(x,y,20),new THREE.Vector3(0,0,-1)).intersectObject(root,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0)[0];
const belongs=(object,cap)=>{for(let o=object;o;o=o.parent)if(o===cap)return true;return false;};

/** Native flex-pad checks deliberately sample real CAD surfaces and openings. */
export async function checkUnitActuators(){
 const flex=await loadModel('button');flex.root.updateMatrixWorld(true);
 const button=flex.button('press'),native=button.cap.getObjectByName('Button native molded flex pad');
 assert.ok(native?.isMesh,'The original molded face, not a transparent hit plane, moves');
 const rest=native.geometry.attributes.position.array.slice(),restNormals=native.geometry.attributes.normal.array.slice(),fixed=flex.parts.housing.geometry.attributes.position.array.slice();
 const samples=[3,4,6,8,10,11.1].map(y=>({y,z:cast(flex.root,0,y).point.z}));
 // Three native grooves and the U-cut keep their actual depth instead of a
 // planar painted outline. The PCB behind the cut is a separate real part.
 for(const y of [5,7,9])near(cast(flex.root,0,y).point.z,3.8,'Native molded groove',1e-4);
 for(const [x,y]of [[-5.2,7],[5.2,7],[0,11.5]]){
  const hit=cast(flex.root,x,y);assert.equal(hit?.object.name,'Unit PCB','U-cut exposes recessed PCB');near(hit.point.z,1,'No missing assembly behind the real slot');
 }
 const events=[];flex.on('input',event=>events.push(event));button.press('framework');button.onPointerDown({pointerId:1});settle(flex);
 assert.deepEqual(button.getActuationState(),{depthMm:.35,targetDepthMm:.35,settled:true});
 let previous=-1;
 for(const {y,z}of samples){const hit=cast(flex.root,0,y),delta=z-hit.point.z;assert.ok(delta>=previous-1e-5,'Flex displacement grows toward free edge');previous=delta;if(y>3)assert.ok(belongs(hit.object,button.cap),'No fixed duplicate covers the depressed native face');}
 near(cast(flex.root,0,3).point.z,4,'Molded hinge stays fixed');near(cast(flex.root,0,11.1).point.z,3.65,'Free edge travels the full .35 mm');near(cast(flex.root,6,7).point.z,4,'Surrounding housing stays fixed');
 for(const [name,x,y]of [['Button tactile switch cover',-.5,9.8],['Button recessed switch plunger',0,8.1]]){
  const part=flex.root.getObjectByName(name),top=new THREE.Box3().setFromObject(part).max.z;
  const points=new THREE.Raycaster(new THREE.Vector3(x,y,10),new THREE.Vector3(0,0,-1)).intersectObject(native).map(h=>h.point.z);
  assert.ok(points.length&&Math.min(...points)>top+.05,'Hidden switch packaging clears the fully depressed original molded push-post');
 }
 assert.deepEqual(flex.parts.housing.geometry.attributes.position.array,fixed,'Press cannot deform the fixed enclosure');
 button.release('framework');settle(flex);assert.equal(button.pressed,true,'Independent pointer hold survives framework release');button.onPointerCancel({pointerId:1});settle(flex);
 assert.deepEqual(native.geometry.attributes.position.array,rest,'All native vertices return exactly to rest');assert.deepEqual(native.geometry.attributes.normal.array,restNormals,'Native smooth normals return exactly; pressing cannot permanently facet CAD');assert.deepEqual(events.map(e=>e.action),['down','up']);assert.equal(events[1].cancelled,true);
 const replacement=new THREE.Mesh(native.geometry.clone(),native.material);replacement.name=native.name;button.setMesh(replacement);button.press('replacement');settle(flex);
 near(cast(flex.root,0,3).point.z,4,'Replacing Button mesh preserves its fixed flex hinge');near(cast(flex.root,0,11.1).point.z,3.65,'Replacement follows flex shape');assert.deepEqual(native.geometry.attributes.position.array,rest,'Detached mesh is no longer deformed');button.cancel('replacement');settle(flex);assert.deepEqual(replacement.geometry.attributes.normal.array,restNormals);native.geometry.dispose();
 flex.dispose();

 const dual=await loadModel('dual-button');dual.root.updateMatrixWorld(true);
 const dualReport=checkDeviceActuators(dual,{id:'dual-button',expected:2});
 for(const [id,y]of [['blue',13],['red',-1]]){
  const cap=dual.button(id).cap.getObjectByName(`Dual Button ${id} full-depth cap`),box=new THREE.Box3().setFromObject(cap),size=box.getSize(new THREE.Vector3());
  near(size.x,11.5,'Official cap diameter');near(size.y,11.5,'Round cap diameter');near(size.z,3,'Cap has full physical thickness');near(box.getCenter(new THREE.Vector3()).y,y,'Official 14 mm center spacing');near(box.max.z,11,'Overall cap height includes molded white pedestal');
  for(const dx of [-5.5,0,5.5])assert.ok(belongs(cast(dual.root,dx,y).object,dual.button(id).cap),'Colored surface remains physically visible to its rounded edge');
 }
 const box=new THREE.Box3();dual.root.traverse(o=>{if(o.isMesh&&o.material?.opacity!==0)box.expandByObject(o);});near(box.getSize(new THREE.Vector3()).z,15.045,'Official 15 mm envelope plus rear fastener',.002);dual.dispose();

 // All legacy Unit buttons also receive the actual visible-cap regression,
 // independent of the controller inventory. Flex/lever and CardKB have their
 // own mechanical checks because their shapes and key counts differ.
 const legacy=[];
 for(const id of ['encoder','joystick-v11']){const model=await loadModel(id);try{legacy.push({id,...checkDeviceActuators(model,{id,expected:1})});}finally{model.dispose();}}
 const host=new Device(),port=host.add(new Port({id:'unit',connector:'grove',rotation:[.2,.3,-.4]})),module=await loadGroveModule('button',{cableLength:60});port.attach(module);module.get('unitFrame').setPose({rotation:[.1,-.2,.3]});
 const child=host.get('unit/press'),mesh=child.cap.getObjectByName('Button native molded flex pad'),original=mesh.geometry.attributes.position.array.slice(),nested=[];host.on('input',event=>nested.push(event.id));
 host.handle({type:'press',target:'unit/press',source:'framework'});settle(host);assert.equal(child.getActuationState().settled,true);assert.notDeepEqual(mesh.geometry.attributes.position.array,original);host.handle({type:'cancel',target:'unit/press',source:'framework'});settle(host);assert.deepEqual(mesh.geometry.attributes.position.array,original);assert.ok(nested.every(id=>id==='unit/press'),'Flex pad retains nested input addressing');host.dispose();
 return {status:'pass',flexPad:{nativeGrooves:3,openSlotSamples:3,travelMm:.35,fixedHinge:true,exactVertexReturn:true},dualButton:dualReport,legacy,scope:'Actual Unit faces, physical cap thickness, nonlinear deformation, input cancellation and nested mounting; no hardware validation'};
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 const noop=()=>{},ctx=new Proxy({createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});globalThis.document={createElement:()=>({getContext:()=>ctx})};
 console.log('PASS Unit actuators:',JSON.stringify(await checkUnitActuators()));
}
