import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const ids=['earth','hall','qrcode'];
const stamp=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const hash=a=>createHash('sha256').update(Buffer.from(a.buffer,a.byteOffset,a.byteLength)).digest('hex');
function artwork(model){const result=[];model.root.traverse(o=>{if(o.userData.role==='printed-artwork')result.push(o);});return result;}
function physical(model){const result=[];model.root.updateMatrixWorld(true);model.root.traverse(o=>{if(!o.isMesh||o.userData.role==='printed-artwork')return;result.push({name:o.name,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([key,a])=>[key,hash(a.array)])),index:o.geometry.index?hash(o.geometry.index.array):null,matrix:o.matrixWorld.toArray()});});return result;}

/** Actual new products and rendered four-wire branches; only Node canvas is substituted. */
export async function checkEarthHallQrCodeUnits(){
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});
 const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};let host;
 try{
  host=await loadModel('sticks3');const hub=await loadGroveModule('hub');host.port('grove').attach(hub);const modules={},prints=[];
  for(const [i,id]of ids.entries()){
   const module=await loadGroveModule(id,{cableLength:65+i*15});modules[id]=module;hub.port(`grove-${i+1}`).attach(module);
   assert.ok(host.get(`grove/grove-${i+1}`).module===module,'recursive path points at its actual module');assert.equal(module.get('cable').getState().wireCount,4);assert.equal(module.get('sensor').meta.role,'visual-anchor');
   const on=await loadModel(id),off=await loadModel(id,{artwork:false});try{
    const panels=artwork(on);assert.ok(panels.length>0,'corresponding print arrives with each new Unit');assert.equal(artwork(off).length,0);assert.deepEqual(physical(on),physical(off),'printing does not change physical geometry or assembly transforms');
    for(const panel of panels){assert.ok(panel.parent&&panel.geometry.attributes.position.count>0);assert.equal(panel.material.alphaTest,.04);assert.ok(['official-raster','official-raster-film','official-vector-raster','source-vector-raster','reference-redraw'].includes(panel.userData.artworkKind));}
    prints.push({id,panels:panels.length,kinds:[...new Set(panels.map(p=>p.userData.artworkKind))]});
   }finally{on.dispose();off.dispose();}
  }
  for(const [i,type]of ['moisture','magnetic-field','scan'].entries())assert.throws(()=>host.handle({type,target:`grove/grove-${i+1}/sensor`,value:1}),'passive anchors do not implement sensing, magnet physics or scan engines');
  assert.equal(modules.hall.list('button').length,0);assert.equal(modules.hall.list('joint').length,0);assert.equal(modules.hall.list('led').length,0,'hidden Hall D1 has no invented exposed light aperture');assert.equal(modules.earth.list('button').length,0);
  const standardEarth=await loadModel('earth'),educationEarth=await loadModel('earth',{stickerVariant:'education-cn'}),bareEducationEarth=await loadModel('earth',{stickerVariant:'education-cn',artwork:false});try{
   assert.deepEqual(physical(educationEarth),physical(standardEarth),'source-language variant changes only the print layer');assert.deepEqual(physical(bareEducationEarth),physical(standardEarth));assert.equal(artwork(bareEducationEarth).length,0);assert.equal(artwork(educationEarth).length,artwork(standardEarth).length);
  }finally{standardEarth.dispose();educationEarth.dispose();bareEducationEarth.dispose();}
  const fullQr=await loadModel('qrcode'),directQr=await loadModel('qrcode',{refractor:false});try{
   assert.ok(physical(directQr).length<physical(fullQr).length,'direct-view variant removes the actual fixed refractor assembly');
   assert.deepEqual(directQr.list().map(c=>[c.id,c.kind]),fullQr.list().map(c=>[c.id,c.kind]),'fixed optical accessory does not change real input/output APIs');
  }finally{fullQr.dispose();directQr.dispose();}
  const events=[];host.on('input',e=>events.push(e));
  const lamps=ids.flatMap(id=>modules[id].list('led'));
  assert.ok(lamps.length>0);assert.ok(lamps.every(led=>led.brightness===0),'all visible indicators start off');
  for(const led of lamps){
   const other=lamps.filter(x=>x!==led),states=other.map(x=>x.getState()),colour=led.getState().color;
   host.handle({type:'led',target:led.path,brightness:.45,color:'#00ff00'});assert.equal(led.brightness,.45);assert.equal(led.getState().color,colour,'real fixed colour is preserved');assert.deepEqual(other.map(x=>x.getState()),states,'indicator output is independent');
  }
  assert.equal(events.length,0,'external light commands do not echo control input');
  const lampState=lamps.map(led=>led.getState());
  // Product-specific controls are checked below after their documented IDs freeze.
  await checkProductControls({host,modules,events,lamps,lampState});
  for(const [i,id]of ids.entries()){
   host.handle({type:'pose',target:`grove/grove-${i+1}/unitFrame`,position:[i*25,85+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:`grove/grove-${i+1}/cable`,slack:12,bend:[0,0,-1]});assert.equal(modules[id].get('cable').getState().wireCount,4);
  }
  hub.port('grove-2').detach();assert.equal(hub.port('grove-2').module,null);assert.ok(hub.port('grove-1').module===modules.earth&&hub.port('grove-3').module===modules.qrcode,'sibling branches survive Hall detach');
  return {status:'pass',artwork:prints,cases:['three-real-Unit-Grove-branches','passive-sensor-boundaries','independent-fixed-colour-indicators','real-mechanical-inputs-without-device-logic','artwork-toggle-keeps-physical-buffers-and-poses','four-wire-poses-and-selective-detach'],scope:'New product construction/API only; canvas stub, no browser, sensing, magnetic physics, decoding, firmware, hardware or whole-catalog acceptance'};
 }finally{host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}
async function checkProductControls({host,modules,events,lamps,lampState}){
 const qr=modules.qrcode,button=qr.button('button'),mode=qr.button('mode');
 assert.equal(button.latching,false);assert.equal(mode.latching,true);
 assert.equal(qr.list('button').length,2,'only the actual trigger and retained UART/I2C selector');
 assert.equal(qr.list('joint').length,0,'fixed refractor does not become an invented joint');
 assert.equal(qr.list('led').length,2,'white illumination and red aiming are separate outputs');
 assert.ok(qr.get('illumination')!==qr.get('aiming'),'actual optics own independent outputs');
 const originalMode=mode.position;mode.setPosition(1-originalMode);host.update(.3);const retained=mode.position;
 assert.equal(retained,1-originalMode);assert.deepEqual(lamps.map(led=>led.getState()),lampState,'mode position does not start capture or change lights');
 const rest=physical(qr),start=events.length;button.press('branch-check');host.update(.3);
 assert.ok(button.getActuationState().depthMm>0,'actual trigger reaches a pressed pose');assert.notEqual(stamp(physical(qr)),stamp(rest),'physical trigger cap world geometry moves');
 button.cancel('branch-check');host.update(.3);assert.equal(button.getActuationState().depthMm,0);assert.equal(stamp(physical(qr)),stamp(rest),'trigger returns exactly after cancellation');assert.ok(!events.slice(start).some(e=>e.action==='click'));
 button.press('branch-check');button.release('branch-check');host.update(.3);assert.ok(events.some(e=>e.id==='grove/grove-3/button'&&e.action==='click'),'trigger input is recursively addressed');
 assert.equal(mode.position,retained);assert.deepEqual(lamps.map(led=>led.getState()),lampState,'trigger does not automatically light, scan or sound');
 mode.setPosition(originalMode);host.update(.3);
 // Earth trim implementation is added once its original part and axis freeze.
 await checkEarthTrim({host,earth:modules.earth,events,lamps,lampState});
}
async function checkEarthTrim({host,earth,events,lamps,lampState}){
 assert.equal(earth.list('joint').length,1,'only the real adjustable resistor head rotates');assert.equal(earth.list('led').length,0);
 const trim=earth.get('trim'),rest=trim.object3d.quaternion.clone();host.root.updateMatrixWorld(true);const portFrame=earth.get('grove').object3d.matrixWorld.clone(),eventCount=events.length;
 assert.throws(()=>trim.set({rpm:3}),'trim is position driven');trim.set({angleDeg:30});host.root.updateMatrixWorld(true);assert.ok(!trim.object3d.quaternion.equals(rest),'actual trim head turns');assert.ok(earth.get('grove').object3d.matrixWorld.equals(portFrame),'fixed Grove frame stays put');
 trim.set({angleDeg:60,durationMs:120});for(let i=0;i<12;i++)host.update(1/60);assert.equal(trim.getState().angleDeg,60);trim.set({angleDeg:0});host.root.updateMatrixWorld(true);assert.ok(trim.object3d.quaternion.equals(rest),'trim returns exactly to source visual rest');assert.deepEqual(lamps.map(led=>led.getState()),lampState);assert.equal(events.length,eventCount,'external trim does not echo input or implement a threshold');
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkEarthHallQrCodeUnits(),null,2));
