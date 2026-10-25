import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {VisualJoint} from '../src/core/components/VisualJoint.js';
import {Device,Port} from '../src/core/index.js';
import {portQuaternion} from '../src/modeling/parts.js';

const near=(a,b,why,tol=1e-6)=>assert.ok(Math.abs(a-b)<tol,why);
const point=o=>o.getWorldPosition(new THREE.Vector3());
const box=o=>new THREE.Box3().setFromObject(o);
const direction=(o,v=[0,0,1])=>new THREE.Vector3(...v).applyQuaternion(o.getWorldQuaternion(new THREE.Quaternion()));

export async function checkVisualMotion(){
 const unitHost=new Device(),joint=unitHost.add(new VisualJoint({id:'j',axis:[0,0,1],limitsDeg:[0,90]}));
 const marker=new THREE.Object3D();marker.position.set(3,0,0);unitHost.body.add(marker);joint.adopt(marker);
 assert.equal(unitHost.update(1),false,'neutral joint remains idle');near(point(marker).x,3,'adopt preserves the neutral pose');
 unitHost.handle({type:'joint',target:'j',angleDeg:90,durationMs:1000});assert.equal(unitHost.update(.5),true);unitHost.root.updateMatrixWorld(true);near(point(marker).x,3/Math.sqrt(2),'explicit half-duration linear angle');
 assert.equal(unitHost.update(.5),true,'the exact terminal pose requests a render');unitHost.root.updateMatrixWorld(true);near(point(marker).y,3,'exact destination is applied');assert.equal(unitHost.update(.1),false,'next idle frame stops requesting renders');
 assert.throws(()=>joint.set({angleDeg:91}),RangeError);assert.throws(()=>joint.set({angleDeg:NaN}),TypeError);assert.throws(()=>joint.set({rpm:1}),RangeError);assert.throws(()=>joint.update(-1),RangeError);
 const before=joint.getState();assert.throws(()=>joint.set({angleDeg:10,durationMs:-1}));assert.deepEqual(joint.getState(),before,'invalid commands are atomic');unitHost.dispose();

 const {StackChan}=await import('../src/devices/stackchan/index.js');const stack=new StackChan();stack.update(0);stack.root.updateMatrixWorld(true);
 let headDisposals=0;stack.parts['head-shell'].geometry.addEventListener('dispose',()=>headDisposals++);
 const baseBefore=stack.parts.base.matrixWorld.clone(),usbBefore=stack.port('base-usb').object3d.matrixWorld.clone(),lcdBefore=stack.display('lcd').object3d.matrixWorld.clone();
 const neck=stack.parts['neck-cradle'],fittings=stack.root.getObjectByName('Neck lower rear fittings'),fittingsFrame=neck.matrixWorld.clone().invert().multiply(fittings.matrixWorld),fittingsBefore=fittings.matrixWorld.clone();
 const arm=stack.parts['pitch-servo-arm'],axisRay=new THREE.Raycaster(new THREE.Vector3(40,6.65,-2),new THREE.Vector3(-1,0,0));
 assert.equal(axisRay.intersectObject(arm,true).length,0,'official servo arm bore is coaxial with the selected pitch axis');
 assert.ok(new THREE.Raycaster(new THREE.Vector3(40,8.65,-2),new THREE.Vector3(-1,0,0)).intersectObject(arm,true).length>0,'official arm material surrounds the real bore');
 const actual=stack.stackchanAssembly,powerFrame=stack.parts['head-shell'].matrixWorld.clone().invert().multiply(actual.rear.matrixWorld),adapterFrame=neck.matrixWorld.clone().invert().multiply(actual.adapter.matrixWorld);
 const pitch=stack.get('pitch'),yaw=stack.get('yaw');assert.equal(stack.update(.5),false,'StackChan does not move by itself');
 near(pitch.object3d.position.y,30.8,'pitch pivot relative to yaw preserves official Y6.65 axis');assert.ok(pitch.object3d.parent===yaw.object3d,'pitch is nested under horizontal yaw');
 stack.handle({type:'joint',target:'pitch',angleDeg:90});stack.update(0);stack.root.updateMatrixWorld(true);assert.ok(direction(stack.display('lcd').object3d).distanceTo(new THREE.Vector3(0,1,0))<1e-6,'pitch lifts the screen towards +Y');
 assert.ok(stack.parts.base.matrixWorld.equals(baseBefore)&&stack.port('base-usb').object3d.matrixWorld.equals(usbBefore),'pitch leaves foot and base USB fixed');
 stack.handle({type:'joint',target:'pitch',angleDeg:30});stack.handle({type:'joint',target:'yaw',angleDeg:70});stack.update(0);stack.root.updateMatrixWorld(true);
 assert.ok(stack.parts.base.matrixWorld.equals(baseBefore)&&stack.port('base-usb').object3d.matrixWorld.equals(usbBefore),'yaw leaves foot and base USB fixed');
 assert.ok(!stack.display('lcd').object3d.matrixWorld.equals(lcdBefore),'head framebuffer moves with its housing');
 const headFrame=stack.parts['head-shell'].matrixWorld.clone().invert().multiply(stack.display('lcd').object3d.matrixWorld);
 const groveFrame=stack.parts['head-shell'].matrixWorld.clone().invert().multiply(stack.port('port-b').object3d.matrixWorld);
 stack.handle({type:'joint',target:'yaw',angleDeg:-130});stack.handle({type:'joint',target:'pitch',angleDeg:60});stack.update(0);stack.root.updateMatrixWorld(true);
 const matrixNear=(a,b,why)=>assert.ok(a.elements.every((v,i)=>Math.abs(v-b.elements[i])<1e-6),why);
 matrixNear(neck.matrixWorld.clone().invert().multiply(fittings.matrixWorld),fittingsFrame,'lower rear fittings stay on the neck, independently of pitch');
 matrixNear(stack.parts['head-shell'].matrixWorld.clone().invert().multiply(actual.rear.matrixWorld),powerFrame,'actual front Power PCB follows the pitching head');
 matrixNear(neck.matrixWorld.clone().invert().multiply(actual.adapter.matrixWorld),adapterFrame,'Adapter and servo connectors stay on yaw neck');
 for(let i=0;i<7;i++){const wire=actual.harness.wires[i],curve=wire.geometry.parameters.path;assert.ok(wire.localToWorld(curve.getPoint(0)).distanceTo(actual.rear.upperHarness.contacts[i].getWorldPosition(new THREE.Vector3()))<1e-6,'moving Power terminal holds upper loom end');assert.ok(wire.localToWorld(curve.getPoint(1)).distanceTo(actual.adapter.lowerHarness.contacts[i].getWorldPosition(new THREE.Vector3()))<1e-6,'yaw Adapter terminal holds lower loom end');}

 assert.ok(!fittings.matrixWorld.equals(fittingsBefore),'neck fittings move with horizontal yaw');
 matrixNear(stack.parts['head-shell'].matrixWorld.clone().invert().multiply(stack.display('lcd').object3d.matrixWorld),headFrame,'LCD remains rigidly mounted to head through combined yaw/pitch');
 matrixNear(stack.parts['head-shell'].matrixWorld.clone().invert().multiply(stack.port('port-b').object3d.matrixWorld),groveFrame,'Grove hit target follows its physical head socket');
 yaw.set({rpm:10});const oldYaw=yaw.angleDeg;stack.update(.25);near(yaw.angleDeg-oldYaw,15,'external yaw rpm integrates only the visual pose');yaw.set({rpm:0});
 for(const id of ['power','reset']){
  const button=stack.button(id),cap=button.cap.children[0];assert.ok(cap&&cap.name!=='hit-only','StackChan inherits the actual CoreS3 key cap');
  const before=point(cap),axis=button.axis.clone().transformDirection(button.object3d.matrixWorld);button.press('motion-check');stack.update(1);stack.update(0);stack.root.updateMatrixWorld(true);near(point(cap).sub(before).dot(axis),button.travel,'StackChan real key presses along the transformed head-local axis');button.release('motion-check');stack.update(1);stack.update(0);stack.root.updateMatrixWorld(true);assert.ok(point(cap).distanceTo(before)<1e-6,'StackChan real key returns to its tilted rest position');
 }stack.dispose();assert.equal(headDisposals,1,'Nested visual joints dispose the head shell exactly once');

 const results={};
 for(const slug of ['fan','encoder','angle','joystick-v11']){
  const {Model,GroveModule}=await import(`../src/units/${slug}/index.js`),model=new Model({propeller:true});model.root.updateMatrixWorld(true);
  const shell=Object.values(model.parts)[0],housing=shell.matrixWorld.clone();assert.equal(model.update(.5),false,`${slug}: default geometry stays still`);
  if(slug==='fan'){
   const rotor=model.get('rotor'),blade=model.root.getObjectByName('Fan propeller blade'),bladeFrame=blade.matrixWorld.clone(),bearing=model.root.getObjectByName('Fan recessed bearing'),bearingFrame=bearing.matrixWorld.clone();
   rotor.set({rpm:60});assert.equal(model.update(.25),true);near(rotor.angleDeg,90,'Fan externally requested 60 rpm gives a quarter turn in .25 seconds');model.root.updateMatrixWorld(true);
   assert.ok(!blade.matrixWorld.equals(bladeFrame),'Fan blade is bound to the moving rotor');assert.ok(bearing.matrixWorld.equals(bearingFrame),'Fan bearing remains stationary');
   rotor.set({rpm:0});const stopped=rotor.object3d.quaternion.clone();assert.equal(model.update(.5),false);assert.ok(rotor.object3d.quaternion.equals(stopped),'Fan stops without automatic coasting');
  }else if(slug==='encoder'||slug==='angle'){
   const rotation=model.get('rotation'),cap=model.root.getObjectByName(slug==='encoder'?'Encoder moving knob':'Angle moving knob'),q=cap.getWorldQuaternion(new THREE.Quaternion());rotation.set({angleDeg:37});model.root.updateMatrixWorld(true);assert.ok(cap.getWorldQuaternion(new THREE.Quaternion()).angleTo(q)>.6,`${slug}: the actual ribbed cap rotates`);
   if(slug==='encoder'){const press=model.button('press'),before=point(cap);press.press('check');model.update(1);model.root.updateMatrixWorld(true);near(before.z-point(cap).z,press.travel,'Encoder physical knob depresses');press.release('check');model.update(1);model.root.updateMatrixWorld(true);near(point(cap).z,before.z,'Encoder knob releases to its current rotation');}
   else assert.throws(()=>rotation.set({rpm:1}),RangeError,'Angle accepts absolute visual angles, not an invented endless potentiometer');
  }else{
   model.get('tilt-x').set({angleDeg:15});model.get('tilt-y').set({angleDeg:-12});model.root.updateMatrixWorld(true);
   const press=model.button('press'),cap=model.root.getObjectByName('Joystick thumb cap'),before=point(cap),axis=direction(press.object3d);assert.ok(Math.abs(axis.x)>.1&&Math.abs(axis.y)>.1,'Joystick stick tilts around both real axes');
   press.press('check');model.update(1);model.root.updateMatrixWorld(true);const motion=point(cap).sub(before);near(motion.dot(axis),-press.travel,'Joystick press follows the tilted stick local axis');near(motion.clone().cross(axis).length(),0,'Joystick push does not move sideways');press.release('check');model.update(1);
  }
  assert.ok(shell.matrixWorld.equals(housing),`${slug}: control motion leaves the shell fixed`);
  const host=new Device(),port=host.add(new Port({id:'unit',connector:'grove',quaternion:portQuaternion('left')})),module=new GroveModule({cableLength:20,propeller:true});port.attach(module);host.root.updateMatrixWorld(true);
  const id=slug==='fan'?'rotor':slug==='joystick-v11'?'tilt-x':'rotation';assert.ok(host.get(`unit/${id}`)===module.get(id),`${slug}: joint remains addressable when mounted`);host.handle({type:'joint',target:`unit/${id}`,angleDeg:10});host.root.updateMatrixWorld(true);near(module.get(id).angleDeg,10,`${slug}: nested external joint command`);
  const groove=point(module.port('grove').object3d);host.update(.1);host.root.updateMatrixWorld(true);assert.ok(point(module.port('grove').object3d).distanceTo(groove)<1e-6,`${slug}: mechanical control motion leaves Grove cable socket fixed`);
  port.detach();host.dispose();results[slug]=model.list('joint').map(j=>j.id);model.dispose();
 }
 return {jointTransition:'terminal frame rendered',stackchan:['yaw','pitch'],units:results,status:'pass'};
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 const noop=()=>{},ctx=new Proxy({createRadialGradient:()=>({addColorStop:noop}),createLinearGradient:()=>({addColorStop:noop}),measureText:()=>({width:20})},{get:(o,k)=>o[k]??noop});globalThis.document={createElement:()=>({getContext:()=>ctx})};
 console.log('PASS external visual motion:',JSON.stringify(await checkVisualMotion()));
}
