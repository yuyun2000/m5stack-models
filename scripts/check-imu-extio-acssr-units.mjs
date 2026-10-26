import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {Module} from '../src/core/index.js';
import {loadModel,loadGroveModule} from '../src/loaders.js';

class GroveProbe extends Module{static meta={id:'connector-probe',name:'Grove connector probe',connector:'grove'};}
const hash=array=>createHash('sha256').update(Buffer.from(array.buffer,array.byteOffset,array.byteLength)).digest('hex');
function panels(model){const found=[];model.root.traverse(o=>{if(o.userData.role==='printed-artwork')found.push(o);});return found;}
function physical(model){const found=[];model.root.updateMatrixWorld(true);model.root.traverse(o=>{if(!o.isMesh||o.userData.role==='printed-artwork')return;found.push({name:o.name,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([key,a])=>[key,hash(a.array)])),index:o.geometry.index?hash(o.geometry.index.array):null,matrix:o.matrix.toArray()});});return found;}

/** Real products and actual Grove ownership; only canvas is substituted. */
export async function checkImuExtioAcssrUnits(){
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});
 const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};let host;
 try{
  host=await loadModel('sticks3');const hub=await loadGroveModule('hub');host.port('grove').attach(hub);const modules={},artwork=[];
  for(const [i,id]of ['mini-imu','extio2','acssr'].entries()){
   const module=await loadGroveModule(id,{terminalPlug:true,cableLength:65+i*15});modules[id]=module;hub.port(`grove-${i+1}`).attach(module);
   assert.ok(host.get(`grove/grove-${i+1}`).module===module);assert.equal(module.get('cable').getState().wireCount,4);assert.equal(module.get('sensor').meta.role,'visual-anchor');
   const on=await loadModel(id,{terminalPlug:true}),off=await loadModel(id,{terminalPlug:true,artwork:false});try{
    assert.ok(panels(on).length>0);assert.equal(panels(off).length,0);assert.deepEqual(physical(on),physical(off),'artwork does not replace or deform physical parts');
    for(const panel of panels(on)){assert.ok(panel.parent&&panel.geometry.attributes.position.count>0);assert.equal(panel.material.alphaTest,.04);assert.ok(['official-raster','official-raster-film','reference-redraw'].includes(panel.userData.artworkKind));}
    artwork.push({id,panels:panels(on).length,kinds:[...new Set(panels(on).map(p=>p.userData.artworkKind))]});
   }finally{on.dispose();off.dispose();}
  }
  const imu=modules['mini-imu'],io=modules.extio2,ssr=modules.acssr;
  for(const module of [imu,io]){assert.equal(module.list('button').length,0);assert.equal(module.list('joint').length,0);assert.equal(module.list('led').length,0);}
  for(const [i,type]of ['imu','gpio','ssr'].entries())assert.throws(()=>host.handle({type,target:`grove/grove-${i+1}/sensor`,value:1}),'visual anchors do not implement sensor, GPIO or electrical state');
  const header=io.port('io'),probe=new GroveProbe();try{assert.notEqual(header.connector,'grove');assert.equal(header.pins.length,10);assert.throws(()=>header.attach(probe));assert.equal(header.module,null);}finally{probe.dispose();}
  assert.equal(ssr.list('led').length,3);const rgb=ssr.get('rgb'),power=ssr.get('power-led'),relay=ssr.get('ssr-led'),leds=[rgb,power,relay],initial=leds.map(led=>led.getState()),events=[];
  host.on('input',event=>events.push(event));
  host.handle({type:'led',target:'grove/grove-3/rgb',color:'#37c98b',brightness:.6});assert.equal(rgb.brightness,.6);assert.deepEqual(power.getState(),initial[1]);assert.deepEqual(relay.getState(),initial[2]);
  for(const [id,led,brightness,before]of [['power-led',power,.3,initial[1]],['ssr-led',relay,.45,initial[2]]]){host.handle({type:'led',target:`grove/grove-3/${id}`,color:'#0000ff',brightness});assert.equal(led.brightness,brightness);assert.equal(led.getState().color,before.color,'actual red indicator retains fixed color');}
  const states=leds.map(led=>led.getState());
  const ssrScrews=ssr.list('joint').filter(j=>/^ssr-screw-[1-4]$/.test(j.id));
  assert.equal(ssrScrews.length,4,'four physical SSR terminal screw heads');
  for(const screw of ssrScrews){assert.equal(screw.continuous,false);screw.setAngle(35);screw.setAngle(0);}
  assert.equal(events.length,0,'external screws and lamps do not echo control input');
  const button=ssr.button('button');assert.equal(button.latching,false);host.update(1);host.root.updateMatrixWorld(true);const rest=JSON.stringify(physical(ssr));
  button.press('branch-check');host.update(1);host.root.updateMatrixWorld(true);assert.ok(button.getActuationState().depthMm>0&&JSON.stringify(physical(ssr))!==rest);assert.deepEqual(leds.map(led=>led.getState()),states,'pressing has no automatic SSR/power/lamp behavior');
  button.cancel('branch-check');host.update(1);host.root.updateMatrixWorld(true);assert.equal(button.getActuationState().depthMm,0);assert.ok(JSON.stringify(physical(ssr))===rest,'the actual cap or shell tongue geometry returns exactly');assert.ok(!events.some(e=>e.action==='click'),'cancellation returns the real cap without click');
  assert.ok(events.some(e=>e.id==='grove/grove-3/button'&&e.action==='down'),'actual control emits nested input intent');
  for(const id of ['terminal-1','terminal-2']){
   const port=ssr.port(id),plug=port.module;assert.ok(plug);assert.equal(plug.list('joint').length,4);for(const screw of plug.list('joint'))host.handle({type:'joint',target:screw.path,angleDeg:45});
   host.root.updateMatrixWorld(true);const socket=ssr.get('grove').object3d.matrixWorld.clone();port.detach({dispose:false});host.root.updateMatrixWorld(true);assert.ok(ssr.get('grove').object3d.matrixWorld.equals(socket));assert.deepEqual(leds.map(led=>led.getState()),states);port.attach(plug);assert.ok(plug.list('joint').every(j=>j.angleDeg===45));
  }
  for(const [i,id]of ['mini-imu','extio2','acssr'].entries()){
   host.handle({type:'pose',target:`grove/grove-${i+1}/unitFrame`,position:[i*25,90+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:`grove/grove-${i+1}/cable`,slack:12,bend:[0,0,-1]});assert.equal(modules[id].get('cable').getState().wireCount,4);
  }
  hub.port('grove-1').detach();assert.equal(hub.port('grove-1').module,null);assert.ok(hub.port('grove-2').module===io&&hub.port('grove-3').module===ssr);assert.deepEqual(leds.map(led=>led.getState()),states);
  return {status:'pass',artwork,cases:['three-real-Unit-Grove-branches','passive-IMU-and-IO-visual-anchors','actual-ten-pin-header-rejects-Grove','three-independent-external-indicators','physical-SSR-button-press-cancel-and-return','two-removable-4P-plugs-and-eight-screw-heads','artwork-toggle-keeps-physical-buffers-and-poses','four-wire-poses-and-selective-detach'],scope:'Only new actual products and recursive Grove ownership; canvas/probe substitutes, no browser, sensor, GPIO, mains, hardware or whole-catalog acceptance'};
 }finally{host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkImuExtioAcssrUnits(),null,2));
