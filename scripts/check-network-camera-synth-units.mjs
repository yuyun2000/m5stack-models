import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {Module} from '../src/core/index.js';
import {loadModel,loadGroveModule} from '../src/loaders.js';

class GroveProbe extends Module{static meta={id:'connector-probe',name:'Grove connector probe',connector:'grove'};}

/** Real product APIs; canvas only is substituted for Node. */
export async function checkNetworkCameraSynthUnits(){
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});
 const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};let host;
 try{
  host=await loadModel('sticks3');const hub=await loadGroveModule('hub');host.port('grove').attach(hub);const modules={};
  for(const [i,id]of ['poesp32','cams3-5mp','synth'].entries()){
   const module=await loadGroveModule(id,{cableLength:65+i*10});modules[id]=module;hub.port(`grove-${i+1}`).attach(module);
   assert.ok(host.get(`grove/grove-${i+1}`).module===module);assert.equal(module.get('cable').getState().wireCount,4);
   assert.equal(module.get('sensor').meta.role,'visual-anchor');assert.equal(module.list('button').length,0);assert.equal(module.list('joint').length,0);assert.equal(module.list('slider').length,0);
  }
  const poe=modules.poesp32,camera=modules['cams3-5mp'],synth=modules.synth;
  assert.equal(synth.list('led').length,0);assert.equal(synth.list('port').filter(port=>port.connector!=='grove').length,0,'internal speaker connector is fixed geometry');
  for(const [module,id,type]of [[poe,'ethernet','rj45-8p8c'],[camera,'sd','microsd'],[camera,'download','female-1x3-2.54mm'],[camera,'expansion','female-1x3-2.54mm']]){
   const port=module.port(id),probe=new GroveProbe();try{assert.equal(port.connector,type);assert.throws(()=>port.attach(probe));assert.equal(port.module,null);}finally{probe.dispose();}
  }
  for(const [i,type]of ['network','camera','audio'].entries())assert.throws(()=>host.handle({type,target:`grove/grove-${i+1}/sensor`,action:'start'}),'visual anchors do not implement device behavior');
  assert.equal(poe.list('led').length,2);assert.equal(camera.list('led').length,1);
  const link=poe.get('link-led'),activity=poe.get('activity-led'),status=camera.get('status-led'),leds=[link,activity,status],before=leds.map(led=>led.getState()),events=[];
  host.on('input',event=>events.push(event));
  for(const [i,[target,brightness]]of [['grove/grove-1/link-led',.25],['grove/grove-1/activity-led',.6],['grove/grove-2/status-led',.4]].entries()){
   const prior=leds.map(led=>led.getState());host.handle({type:'led',target,color:'#ff00ff',brightness});
   assert.equal(leds[i].brightness,brightness);assert.equal(leds[i].getState().color,before[i].color,'physical indicator keeps its fixed color');
   for(let j=0;j<leds.length;j++)if(i!==j)assert.deepEqual(leds[j].getState(),prior[j],'indicators are independent');
  }
  const states=leds.map(led=>led.getState());for(let i=0;i<30;i++)host.update(1/60);assert.deepEqual(leds.map(led=>led.getState()),states,'no invented network/camera indicator effects');
  for(const [i,id]of ['poesp32','cams3-5mp','synth'].entries()){
   host.handle({type:'pose',target:`grove/grove-${i+1}/unitFrame`,position:[i*20,85+i*12,8],rotation:[.1,-.2,.15]});
   host.handle({type:'cable',target:`grove/grove-${i+1}/cable`,slack:12,bend:[0,0,-1]});assert.equal(modules[id].get('cable').getState().wireCount,4);
  }
  assert.equal(events.length,0,'external outputs and poses do not echo control input');
  hub.port('grove-3').detach();assert.equal(hub.port('grove-3').module,null);assert.ok(hub.port('grove-1').module===poe&&hub.port('grove-2').module===camera,'removing Synth preserves both other branches');assert.deepEqual(leds.map(led=>led.getState()),states);
  return {status:'pass',cases:['three-real-Unit-Grove-branches','network-camera-and-audio-runtime-boundaries','RJ45-card-and-download-socket-types','independent-fixed-color-indicators','no-automatic-network-or-camera-effects','four-wire-poses-and-selective-detach'],scope:'Actual product components and recursive Grove ownership; canvas stub and connector probe only, no browser or hardware acceptance'};
 }finally{host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkNetworkCameraSynthUnits(),null,2));
