import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {loadModel,loadGroveModule} from '../src/loaders.js';
import {GROVE_CABLE_GEOMETRY} from '../src/modeling/grove-cable.js';

const signature=display=>createHash('sha256').update(display.buffer).digest('hex');
const near=(a,b,message)=>assert.ok(a.distanceTo(b)<2e-5,message);
function movingCableFollows(port,module){
 // Deliberately do not call cable.sync()/getState(): check the actual frame
 // produced by the normal host update and scene-graph transform propagation.
 const cable=module.get('cable');assert.equal(cable.wires.length,4);
 for(const [plug,socket]of [[cable.sourcePlug,port],[cable.targetPlug,module.get('grove')]]){
  near(plug.getWorldPosition(new THREE.Vector3()),socket.object3d.getWorldPosition(new THREE.Vector3()),'moving plug mating plane follows its socket in the current frame');
  near(new THREE.Vector3(0,1,0).applyQuaternion(plug.getWorldQuaternion(new THREE.Quaternion())),new THREE.Vector3(0,1,0).applyQuaternion(socket.object3d.getWorldQuaternion(new THREE.Quaternion())),'moving plug normal follows its socket');
 }
 for(let i=0;i<4;i++)for(const [ring,plug]of [[0,cable.sourcePlug],[96,cable.targetPlug]]){
  const points=cable.wires[i].geometry.attributes.position,center=new THREE.Vector3();
  for(let j=0;j<8;j++)center.add(new THREE.Vector3().fromBufferAttribute(points,ring*9+j));
  cable.wires[i].localToWorld(center.multiplyScalar(1/8));
  near(center,plug.localToWorld(new THREE.Vector3((i-1.5)*GROVE_CABLE_GEOMETRY.pitchMm,GROVE_CABLE_GEOMETRY.plugExitMm,0)),'rendered wire exit follows the current rotating plug');
 }
}

export async function checkRotatingUnitExpansion(){
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});
 const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};let host;
 try{
  host=await loadModel('sticks3');const hub=await loadGroveModule('hub');host.port('grove').attach(hub);
  const modules={};for(const [i,id]of ['rollercan','rollercan-lite','vibrator'].entries()){
   const module=await loadGroveModule(id,{cableLength:55+i*10});modules[id]=module;hub.port(`grove-${i+1}`).attach(module);
   assert.equal(module.get('sensor').meta.role,'visual-anchor');assert.equal(module.get('cable').getState().wireCount,4);
   assert.equal(module.get('rotor','joint').continuous,true);
  }
  const standard=modules.rollercan,lite=modules['rollercan-lite'],top=standard.port('grove-top'),key=await loadGroveModule('key',{cableLength:45});top.attach(key);
  assert.equal(lite.find('grove-top'),null,'Lite does not invent the standard slip-ring output');
  standard.display().fill('#dedede');lite.display().fill('#4c4c4c');
  const frames=[standard,lite].map(unit=>signature(unit.display()));host.root.updateMatrixWorld(true);
  const fixed=[];for(const unit of Object.values(modules))fixed.push([unit.get('grove').object3d,unit.get('grove').object3d.matrixWorld.clone()]);
  for(const unit of [standard,lite])for(const id of ['lcd','can-1','can-2','debug'])fixed.push([unit.get(id).object3d,unit.get(id).object3d.matrixWorld.clone()]);
  const topBefore=top.object3d.matrixWorld.clone(),keyBefore=key.unitFrame.object3d.matrixWorld.clone(),events=[];host.on('input',e=>events.push(e));
  for(const unit of Object.values(modules))unit.get('rotor').set({rpm:12});host.update(.25);host.root.updateMatrixWorld(true);
  assert.ok(Object.values(modules).every(unit=>Math.abs(unit.get('rotor').angleDeg-18)<1e-9),'each nested rotor advances exactly once per host frame');
  assert.equal(events.length,0,'externally driven rotation does not echo input');
  assert.ok(fixed.every(([object,matrix])=>object.matrixWorld.equals(matrix)),'fixed sockets, displays and CAN/debug connectors remain fixed');
  assert.ok(!top.object3d.matrixWorld.equals(topBefore)&&!key.unitFrame.object3d.matrixWorld.equals(keyBefore),'the actual top port and attached Unit rotate together');movingCableFollows(top,key);
  assert.deepEqual([standard,lite].map(unit=>signature(unit.display())),frames,'rotor motion preserves external screen pixels');
  for(const unit of Object.values(modules))unit.get('rotor').set({angleDeg:0,rpm:0});host.root.updateMatrixWorld(true);
  assert.ok(top.object3d.matrixWorld.equals(topBefore)&&key.unitFrame.object3d.matrixWorld.equals(keyBefore),'the top assembly returns exactly to its neutral pose');movingCableFollows(top,key);
  for(const unit of [standard,lite]){
   const press=unit.button('press'),shell=press.shell;assert.ok(shell?.isMesh,'the native flexure exposes the actual shell mesh for construction checks');
   const rest=shell.geometry.attributes.position.array.slice();press.press('rotation-check');host.update(.2);
   assert.ok(shell.geometry.attributes.position.array.some((value,i)=>value!==rest[i]),'press deforms actual native shell vertices');
   press.cancel('rotation-check');host.update(1);
   assert.ok(shell.geometry.attributes.position.array.every((value,i)=>value===rest[i]),'native shell returns exactly on cancel');
  }
  assert.deepEqual([standard,lite].map(unit=>signature(unit.display())),frames,'real flexure presses preserve framebuffer ownership');
  assert.ok(events.some(e=>e.id==='grove/grove-1/press'&&e.action==='up'&&e.cancelled));
  assert.ok(!events.some(e=>e.action==='click'),'cancelled input does not invent clicks');
  top.detach();assert.equal(top.module,null);assert.ok(hub.port('grove-2').module===lite&&hub.port('grove-3').module===modules.vibrator,'removing rotating child preserves independent branches');
  return {status:'pass',cases:['three-actual-rotors-on-Grove-branches','single-frame-rpm-and-fixed-port-invariants','rotating-output-Unit-and-four-wire-endpoints','standard-versus-Lite-top-port','external-OLED-framebuffer-ownership','real-native-flexure-press-cancel-and-exact-restoration','independent-rotating-child-detach'],scope:'Actual product geometry and recursive APIs; canvas stub only, no browser, motor physics or hardware acceptance'};
 }finally{host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkRotatingUnitExpansion(),null,2));
