import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {loadModel,loadGroveModule} from '../src/loaders.js';

/** Actual three-product cascade; canvas only is a Node substitute. */
export async function checkByteJoystickUnits(){
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});
 const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
 let host;
 try{
  host=await loadModel('sticks3');
  const switches=await loadGroveModule('byteswitch'),buttons=await loadGroveModule('bytebutton'),joystick=await loadGroveModule('joystick2');
  const toggles=switches.list('button'),keys=buttons.list('button'),joints=joystick.list('joint'),stickPress=joystick.list('button');
  assert.equal(toggles.length,8);assert.ok(toggles.every(b=>b.latching),'ByteSwitch has eight stable controls');
  assert.equal(keys.length,8);assert.ok(keys.every(b=>!b.latching),'ByteButton has eight momentary controls');
  assert.equal(switches.list('led').length,9);assert.equal(buttons.list('led').length,9);
  assert.equal(joints.length,2);assert.equal(stickPress.length,1);
  host.port('grove').attach(switches);switches.port('grove-out').attach(buttons);buttons.port('grove-out').attach(joystick);
  const settle=()=>{for(let i=0;i<60;i++)host.update(1/60);host.root.updateMatrixWorld(true);};
  const events=[];host.on('input',e=>events.push(e));settle();
  for(const [module,path]of [[switches,'grove'],[buttons,'grove/grove-out'],[joystick,'grove/grove-out/grove-out']]){
   assert.ok(host.get(path).module===module,'recursive product ownership is preserved');
   assert.equal(module.get('cable').getState().wireCount,4);
   assert.equal(module.get('sensor').meta.role,'visual-anchor');
  }
  for(const toggle of toggles){
   toggle.setPosition(0);settle();const before=toggle.cap.matrixWorld.clone();
   host.handle({action:'position',target:toggle.path,position:1});settle();
   assert.equal(toggle.getState().position,1);assert.ok(!toggle.cap.matrixWorld.equals(before),'external detent moves the actual toggle lever');
  }
  assert.equal(events.length,0,'external switch positions do not echo input');
  for(const toggle of toggles){
   const before=events.length;toggle.press('cascade-check');toggle.release('cascade-check');settle();
   assert.equal(toggle.getState().position,0,'toggle release retains the selected detent');
   assert.ok(events.slice(before).some(e=>e.id===toggle.path&&e.action==='down'),'each toggle emits its full nested path');
  }
  const stablePositions=toggles.map(b=>b.position);
  for(const key of keys){
   settle();const before=key.cap.matrixWorld.clone(),at=events.length;
   host.handle({type:'press',target:key.path,source:'cascade-check'});settle();
   assert.ok(key.getActuationState().depthMm>0,'real momentary cap moves');
   assert.ok(!key.cap.matrixWorld.equals(before));
   host.handle({type:'cancel',target:key.path,source:'cascade-check'});settle();
   assert.equal(key.getActuationState().depthMm,0);assert.ok(key.cap.matrixWorld.equals(before),'cancel restores the actual cap');
   assert.ok(events.slice(at).some(e=>e.id===key.path&&e.action==='up'&&e.cancelled));
   assert.ok(!events.slice(at).some(e=>e.action==='click'),'cancel does not invent a click');
  }
  assert.deepEqual(toggles.map(b=>b.position),stablePositions,'downstream presses preserve upstream detents');
  const led=buttons.get('rgb-1'),otherLed=switches.get('rgb-1'),otherState=otherLed.getState();
  host.handle({type:'led',target:led.path,color:'#2aa4c8',brightness:.35});
  assert.deepEqual(otherLed.getState(),otherState,'downstream LED command leaves upstream light alone');
  const inputFrame=joystick.get('grove').object3d.matrixWorld.clone(),frameBefore=joints.map(j=>j.object3d.matrixWorld.clone()),at=events.length;
  for(const joint of joints)host.handle({type:'joint',target:joint.path,angleDeg:10,durationMs:200});
  settle();assert.equal(events.length,at,'externally requested tilt does not echo input');
  assert.ok(joints.every((joint,i)=>joint.angleDeg===10&&!joint.object3d.matrixWorld.equals(frameBefore[i])),'both real tilt axes move');
  assert.ok(joystick.get('grove').object3d.matrixWorld.equals(inputFrame),'tilt preserves the fixed Grove mating frame');
  stickPress[0].press('cascade-check');settle();assert.ok(stickPress[0].getActuationState().depthMm>0);stickPress[0].cancel('cascade-check');
  for(const joint of joints)joint.set({angleDeg:0});settle();
  assert.ok(joints.every((joint,i)=>joint.object3d.matrixWorld.equals(frameBefore[i])),'tilt returns exactly to the neutral pose');
  host.handle({type:'pose',target:'grove/grove-out/grove-out/unitFrame',position:[8,85,6],rotation:[.1,-.2,.15]});
  host.handle({type:'cable',target:'grove/grove-out/grove-out/cable',slack:12,bend:[0,0,-1]});
  switches.port('grove-out').detach();
  assert.ok(host.get('grove').module===switches,'removing the downstream subtree retains upstream Unit');
  assert.equal(switches.port('grove-out').module,null);assert.deepEqual(toggles.map(b=>b.position),stablePositions);
  assert.equal(switches.get('cable').getState().wireCount,4);
  return {status:'pass',cases:['real-ByteSwitch-ByteButton-Joystick2-three-level-cascade','eight-stable-levers-and-eight-independent-momentary-caps','full-nested-input-paths-and-cancel-without-click','independent-external-RGB','two-axis-tilt-and-neutral-pose-with-fixed-socket','four-wire-poses-and-downstream-subtree-detach'],scope:'Actual product geometry/input APIs and recursive attachment; canvas stub only, no browser/hardware acceptance'};
 }finally{
  host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;
 }
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkByteJoystickUnits(),null,2));
