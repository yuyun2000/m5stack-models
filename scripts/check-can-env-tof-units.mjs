import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {loadModel,loadGroveModule} from '../src/loaders.js';

/** Real product/connector APIs; canvas only is substituted for Node. */
export async function checkCanEnvTofUnits(){
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});
 const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
 let host;
 try{
  host=await loadModel('sticks3');const hub=await loadGroveModule('hub');host.port('grove').attach(hub);
  const modules={};
  for(const [i,id]of ['can','env-pro','tof4m'].entries()){
   const module=await loadGroveModule(id,{terminalPlug:true,cableLength:55+i*10});modules[id]=module;hub.port(`grove-${i+1}`).attach(module);
   assert.ok(host.get(`grove/grove-${i+1}`).module===module);assert.equal(module.get('cable').getState().wireCount,4);
   assert.equal(module.get('sensor').meta.role,'visual-anchor');
   assert.throws(()=>host.handle({type:'sensor',target:`grove/grove-${i+1}/sensor`,values:{distance:100,temperature:25}}),'visual anchors do not accept invented measurements');
  }
  for(const id of ['env-pro','tof4m']){
   assert.equal(modules[id].list('button').length,0,'fixed sensor packages have no invented controls');
   assert.equal(modules[id].list('joint').length,0,'fixed optical/vent packages do not scan or rotate');
  }
  assert.equal(modules['env-pro'].list('led').length,0,'ENV Pro has no invented status light');
  host.root.updateMatrixWorld(true);const events=[];host.on('input',event=>events.push(event));
  const can=modules.can,terminal=can.port('terminal'),plug=terminal.module;assert.ok(plug);
  assert.equal(plug.list('joint').length,4);assert.equal(can.list('led').length,1);
  const led=can.get('power-led'),color=led.getState().color;
  host.handle({type:'led',target:'grove/grove-1/power-led',brightness:.4,color:'#ff0000'});
  assert.equal(led.brightness,.4);assert.equal(led.getState().color,color,'CAN power indicator retains its actual fixed color');
  for(const screw of plug.list('joint'))host.handle({type:'joint',target:screw.path,angleDeg:45});
  assert.ok(plug.list('joint').every(screw=>screw.angleDeg===45));assert.equal(events.length,0,'external screw/light output does not echo input');
  host.handle({type:'pose',target:'grove/grove-1/unitFrame',position:[12,80,6],rotation:[.2,-.1,.3]});
  host.handle({type:'cable',target:'grove/grove-1/cable',slack:12,bend:[0,0,-1]});
  host.root.updateMatrixWorld(true);const canSocket=can.get('grove').object3d.matrixWorld.clone(),ledState=led.getState();
  terminal.detach({dispose:false});host.root.updateMatrixWorld(true);
  assert.ok(can.get('grove').object3d.matrixWorld.equals(canSocket),'removing CAN plug preserves the fixed socket frame');assert.deepEqual(led.getState(),ledState);
  assert.equal(can.get('cable').getState().wireCount,4);terminal.attach(plug);
  assert.ok(plug.list('joint').every(screw=>screw.angleDeg===45),'reattaching the retained plug preserves its screw angles');
  for(const [i,id]of ['env-pro','tof4m'].entries()){
   host.handle({type:'pose',target:`grove/grove-${i+2}/unitFrame`,position:[i*15,75+i*15,8],rotation:[.1,.2,-.15]});
   host.handle({type:'cable',target:`grove/grove-${i+2}/cable`,slack:10,bend:[0,0,-1]});
  }
  hub.port('grove-2').detach();assert.equal(hub.port('grove-2').module,null);
  assert.ok(hub.port('grove-1').module===can&&hub.port('grove-3').module===modules.tof4m,'selective sensor detach preserves sibling Unit branches');
  assert.equal(can.get('cable').getState().wireCount,4);assert.equal(modules.tof4m.get('cable').getState().wireCount,4);
  return {status:'pass',cases:['three-real-Unit-Grove-branches','measurement-free-visual-anchors','fixed-sensor-packages-without-invented-controls','independent-fixed-white-power-indicator','four-screw-heads-and-retained-CAN-terminal','external-Unit-and-four-wire-cable-poses','selective-branch-detach'],scope:'Actual product components and recursive Grove ownership; canvas stub only, no browser, optical or hardware acceptance'};
 }finally{host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkCanEnvTofUnits(),null,2));
