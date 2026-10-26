import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {Module} from '../src/core/index.js';
import {loadModel,loadGroveModule} from '../src/loaders.js';

class GroveProbe extends Module{static meta={id:'connector-probe',name:'Grove connector probe',connector:'grove'};}

/** Real product APIs; canvas only is substituted for Node. */
export async function checkRtcFingerprintAudioUnits(){
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});
 const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};let host;
 try{
  host=await loadModel('sticks3');const hub=await loadGroveModule('hub');host.port('grove').attach(hub);const modules={};
  for(const [i,id]of ['rtc','fingerprint2','audioplayer'].entries()){
   const module=await loadGroveModule(id,{cableLength:55+i*10});modules[id]=module;hub.port(`grove-${i+1}`).attach(module);
   assert.ok(host.get(`grove/grove-${i+1}`).module===module);assert.equal(module.get('cable').getState().wireCount,4);
   assert.equal(module.get('sensor').meta.role,'visual-anchor');assert.equal(module.list('button').length,0);assert.equal(module.list('joint').length,0);
  }
  const rtc=modules.rtc,finger=modules.fingerprint2,audio=modules.audioplayer;
  assert.equal(rtc.find('battery','port'),null,'no unsupported battery-removal interface');assert.equal(rtc.list('led').length,0);
  assert.throws(()=>host.handle({type:'rtc',target:'grove/grove-1/sensor',value:1}),'model does not implement clock state');
  assert.throws(()=>host.handle({type:'fingerprint',target:'grove/grove-2/sensor',action:'enroll'}),'model does not collect or identify fingerprints');
  assert.throws(()=>host.handle({type:'audio',target:'grove/grove-3/sensor',action:'play'}),'model does not decode or play audio');
  for(const id of ['sd','audio']){
   const port=audio.port(id),probe=new GroveProbe();try{
    assert.notEqual(port.connector,'grove');assert.throws(()=>port.attach(probe),'storage/audio socket rejects a Grove module');assert.equal(port.module,null);
   }finally{probe.dispose();}
  }
  assert.equal(finger.list('led').length,2);assert.equal(audio.list('led').length,1);
  const ring=finger.get('ring-led'),power=finger.get('power-led'),busy=audio.get('busy-led'),powerBefore=power.getState(),busyBefore=busy.getState(),events=[];
  host.on('input',event=>events.push(event));
  host.handle({type:'led',target:'grove/grove-2/ring-led',color:'#24c7a3',brightness:.65});assert.equal(ring.brightness,.65);
  assert.deepEqual(power.getState(),powerBefore);assert.deepEqual(busy.getState(),busyBefore);
  host.handle({type:'led',target:'grove/grove-2/power-led',color:'#ff0000',brightness:.3});
  host.handle({type:'led',target:'grove/grove-3/busy-led',color:'#ff0000',brightness:.4});
  assert.equal(power.getState().color,powerBefore.color,'fingerprint power LED keeps its actual blue color');assert.equal(power.brightness,.3);
  assert.equal(busy.getState().color,busyBefore.color,'audio BUSY LED keeps its actual blue color');assert.equal(busy.brightness,.4);
  const states=[ring,power,busy].map(led=>led.getState());
  for(let i=0;i<30;i++)host.update(1/60);assert.deepEqual([ring,power,busy].map(led=>led.getState()),states,'updates do not invent recognition or playback light effects');
  for(const [i,id]of ['rtc','fingerprint2','audioplayer'].entries()){
   host.handle({type:'pose',target:`grove/grove-${i+1}/unitFrame`,position:[i*15,70+i*10,6],rotation:[.1,-.2,.15]});
   host.handle({type:'cable',target:`grove/grove-${i+1}/cable`,slack:10,bend:[0,0,-1]});assert.equal(modules[id].get('cable').getState().wireCount,4);
  }
  assert.equal(events.length,0,'external output and poses do not echo control input');
  hub.port('grove-1').detach();assert.equal(hub.port('grove-1').module,null);
  assert.ok(hub.port('grove-2').module===finger&&hub.port('grove-3').module===audio,'removing RTC preserves the other Unit branches');assert.deepEqual([ring,power,busy].map(led=>led.getState()),states);
  return {status:'pass',cases:['three-real-Unit-Grove-branches','clock-fingerprint-and-audio-runtime-boundaries','physical-connectors-reject-Grove','independent-RGB-ring-and-fixed-blue-indicators','no-automatic-recognition-or-playback-light-effects','four-wire-poses-and-selective-detach'],scope:'Actual product components and recursive Grove ownership; canvas stub and connector probe only, no browser or hardware acceptance'};
 }finally{host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkRtcFingerprintAudioUnits(),null,2));
