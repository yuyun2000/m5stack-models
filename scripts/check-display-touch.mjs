import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {Display} from '../src/core/components/Display.js';
import {loadModel} from '../src/loaders.js';

const TOUCH_HOSTS=['cores3','stackchan','core2','tab5','stopwatch','papermono','nesso-n1'];
const markers=display=>display.object3d.children.filter(object=>object.geometry?.type==='RingGeometry');

function observe(display){
 const events=[],records=[];
 for(const action of ['start','move','end'])display.on(action,event=>events.push(event));
 const capture=()=>{
  for(const marker of markers(display))if(!records.some(record=>record.marker===marker)){
   const record={marker,geometry:0,material:0};records.push(record);
   marker.geometry.addEventListener('dispose',()=>record.geometry++);
   marker.material.addEventListener('dispose',()=>record.material++);
  }
  return records;
 };
 const live=()=>{capture();for(const record of records.filter(record=>record.marker.parent)){assert.equal(record.geometry,0);assert.equal(record.material,0);}};
 const clean=()=>{
  assert.equal(display.touches.size,0,'No active points remain');
  assert.equal(markers(display).length,0,'No rendered touch rings remain');
  for(const record of records){assert.equal(record.marker.parent,null);assert.equal(record.geometry,1,'Each touch geometry is disposed once');assert.equal(record.material,1,'Each touch material is disposed once');}
 };
 return {events,records,capture,live,clean};
}

// Only the browser Canvas boundary is substituted. Model construction,
// framebuffer writes, pointer hooks, event routing and disposal are real.
function canvasBoundary(){
 const saved=new Map(['document','OffscreenCanvas'].map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
 const createCanvas=()=>{
  const noop=()=>{},canvas={width:0,height:0};
  const context=new Proxy({canvas,measureText:()=>({width:20}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop}),getImageData:(_x,_y,width,height)=>{
   const data=new Uint8ClampedArray(width*height*4);for(let i=0;i<data.length;i+=4)data.set([17,34,51,255],i);return {data,width,height};
  }},{get:(object,key)=>object[key]??noop,set:(object,key,value)=>(object[key]=value,true)});
  canvas.getContext=kind=>{assert.equal(kind,'2d');return context;};return canvas;
 };
 Object.defineProperty(globalThis,'document',{configurable:true,writable:true,value:{createElement:tag=>{assert.equal(tag,'canvas');return createCanvas();}}});
 Object.defineProperty(globalThis,'OffscreenCanvas',{configurable:true,writable:true,value:undefined});
 return ()=>{for(const [key,descriptor]of saved)if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];};
}

function checkFramebuffer(display){
 display.fill('#808080');assert.deepEqual(display.getPixel(0,0),[128,128,128]);
 display.writeRGB565(new Uint16Array([0xf800]),{x:1,y:1,w:1,h:1});assert.deepEqual(display.getPixel(1,1),[255,0,0]);
 display.writeRGBA(new Uint8Array([7,8,9,255]),{x:2,y:1,w:1,h:1});assert.deepEqual(display.getPixel(2,1),[7,8,9]);
 display.writeRGB888(new Uint8Array([10,11,12]),{x:3,y:1,w:1,h:1});assert.deepEqual(display.getPixel(3,1),[10,11,12]);
 display.getContext2D();display.present();assert.deepEqual(display.getPixel(0,0),[17,34,51]);
 const version=display.texture.version;assert.equal(display.update(),false);assert.equal(display.texture.version,version+1);display.update();assert.equal(display.texture.version,version+1,'Framebuffer upload remains lazy');
}

function standalone(){
 const display=new Display({id:'lcd',width:320,height:240,size:[40,30],touch:true}),watch=observe(display);
 let textureDisposals=0;display.texture.addEventListener('dispose',()=>textureDisposals++);
 try{
  checkFramebuffer(display);
  assert.deepEqual(display.uvToPixel({x:-1,y:2}),{x:0,y:0});
  assert.deepEqual(display.uvToPixel({x:2,y:-1}),{x:319,y:239});
  display.onPointerDown({pointerId:1,uv:{x:0,y:1}});display.onPointerDown({pointerId:2,uv:{x:1,y:0}});watch.live();
  assert.deepEqual(watch.events.map(event=>[event.action,event.pointerId,event.x,event.y,event.points.length]),[['start',1,0,0,1],['start',2,319,239,2]]);
  const rings=markers(display);display.onPointerMove({pointerId:1,uv:{x:0,y:1}});assert.equal(watch.events.length,2,'An unchanged pixel does not emit move');
  display.onPointerMove({pointerId:1,uv:{x:.5,y:.5}});watch.live();assert.deepEqual(markers(display),rings,'Moving a point reuses its ring');
  assert.deepEqual(watch.events.at(-1).points,[{x:160,y:120},{x:319,y:239}]);
  assert.deepEqual(watch.events[1].points,[{x:0,y:0},{x:319,y:239}],'Earlier event point snapshots retain their coordinates');
  display.onPointerUp({pointerId:1});assert.deepEqual(watch.events.at(-1).points,[{x:319,y:239}]);assert.equal(display.touches.has(2),true,'Releasing one pointer preserves the other');
  display.onPointerCancel({pointerId:2});watch.clean();assert.equal(watch.events.at(-1).action,'end','Cancellation retains the existing end event');
  const ended=watch.events.length;display.onPointerUp({pointerId:1});display.onPointerCancel({pointerId:2});display.touch('end',0,0,99);assert.equal(watch.events.length,ended,'Repeated termination is inert');

  display.onPointerDown({pointerId:3,uv:{x:.25,y:.75}});watch.capture();display.onPointerMove({pointerId:3,uv:null});watch.clean();
  const offGlass=watch.events.length;display.onPointerMove({pointerId:3,uv:{x:.5,y:.5}});assert.equal(watch.events.length,offGlass,'Sliding back over the glass does not resurrect an ended point');

  display.touch('start',12,13,4);display.touch('start',14,15,5);watch.live();
  const off=display.on('end',()=>{display.touch('start',20,21,99);display.onPointerDown({pointerId:98,uv:{x:.5,y:.5}});});
  const beforeDisable=watch.events.length;display.setTouchEnabled(false);off();watch.clean();
  assert.equal(display.interactive,false);assert.deepEqual(watch.events.slice(beforeDisable).map(event=>[event.action,event.pointerId,event.points.length]),[['end',4,1],['end',5,0]],'Disable ends each original pointer without callback resurrection');
  display.setTouchEnabled(false);assert.equal(watch.events.length,beforeDisable+2);

  display.setTouchEnabled(true);display.touch('start',5,6,6);watch.capture();display.touch('move',7,8,6);display.touch('end',0,0,6);watch.clean();
  assert.deepEqual([watch.events.at(-1).x,watch.events.at(-1).y],[7,8],'End reports the final coordinates');
  display.touch('start',3,4,7);watch.capture();display.touches.clear();display.setTouchEnabled(false);watch.clean();

  display.setTouchEnabled(true);display.touch('start',1,2,8);display.touch('start',3,4,9);watch.capture();
  for(const marker of markers(display))marker.geometry.addEventListener('dispose',()=>display.touch('start',7,8,100));
  const beforeDispose=watch.events.length;display.dispose();display.dispose();watch.clean();
  assert.equal(watch.events.length,beforeDispose,'Disposal does not add input events');assert.equal(textureDisposals,1);
  display.setTouchEnabled(true);display.touch('start',1,2,10);display.onPointerDown({pointerId:11,uv:{x:.5,y:.5}});watch.clean();
  assert.equal(display.interactive,false);assert.equal(watch.events.length,beforeDispose,'Disposed displays cannot recreate input or rings');
  return {markers:watch.records.length,markerResources:watch.records.length*2,textureDisposals,events:watch.events.length};
 }finally{display.dispose();}
}

async function hostCase(id){
 const model=await loadModel(id),display=model.display('lcd'),watch=observe(display),routed=[];
 let textureDisposals=0;display.texture.addEventListener('dispose',()=>textureDisposals++);
 const framebuffer=display.buffer;model.on('input',event=>{if(event.kind==='display')routed.push(event);});
 const panelMaterial=display.panel.material,texturePose=[...display.texture.repeat.toArray(),...display.texture.offset.toArray()];
 const paperMap=display.panel.material.map;assert.equal(display.touchEnabled,true,`${id} has a real enabled touch display`);
 if(id==='papermono')assert.equal(paperMap,display.texture,'Paper surface uses the same framebuffer texture as its map');
 else assert.equal(display.material.uniforms.map.value,display.texture,'Standard shader uses the owned framebuffer texture');
 try{
  model.handle({type:'display',target:'lcd',fill:'#102030',rect:{x:0,y:0,w:1,h:1}});assert.deepEqual(display.getPixel(0,0),[16,32,48]);
  for(const uv of [{x:0,y:1},{x:1,y:0}]){const point=display.uvToPixel(uv);assert.ok(point.x>=0&&point.x<display.width&&point.y>=0&&point.y<display.height);}
  display.onPointerDown({pointerId:21,uv:{x:.25,y:.75}});display.onPointerDown({pointerId:22,uv:{x:.75,y:.25}});watch.capture();
  display.onPointerMove({pointerId:21,uv:{x:.5,y:.5}});display.onPointerCancel({pointerId:21});assert.equal(display.touches.size,1);display.onPointerUp({pointerId:22});watch.clean();
  assert.deepEqual(routed.map(event=>event.action),['start','start','move','end','end'],`${id}: real host routes existing touch actions`);assert.ok(routed.every(event=>event.id==='lcd'));
  display.touch('start',1,2,23);display.touch('start',3,4,24);watch.capture();model.handle({type:'display',target:'lcd',touch:false});watch.clean();
  assert.equal(display.interactive,false);assert.equal(display.buffer,framebuffer,'Touch changes do not replace the framebuffer');assert.equal(display.panel.material,panelMaterial);
  assert.deepEqual([...display.texture.repeat.toArray(),...display.texture.offset.toArray()],texturePose,'Touch changes preserve the existing raster transform');
  assert.deepEqual(display.getPixel(0,0),[16,32,48]);if(id==='papermono')assert.equal(display.panel.material.map,display.texture,'Paper map stays attached until disposal');
  display.setTouchEnabled(true);display.touch('start',5,6,25);display.touch('start',7,8,26);watch.capture();const beforeDispose=routed.length;
  model.dispose();model.dispose();watch.clean();assert.equal(routed.length,beforeDispose);assert.equal(textureDisposals,1,`${id}: framebuffer texture is disposed exactly once`);
  return {id,width:display.width,height:display.height,markers:watch.records.length,markerResources:watch.records.length*2,textureDisposals};
 }finally{model.dispose();}
}

/** No file I/O or private source assets; safe to call from the normal checks. */
export async function checkDisplayTouch(){
 const restore=canvasBoundary();
 try{
  const fixture=standalone(),hosts=[];for(const id of TOUCH_HOSTS)hosts.push(await hostCase(id));
  return {status:'pass',fixture,hosts,markers:fixture.markers+hosts.reduce((sum,host)=>sum+host.markers,0),scope:'Real Display and touch-host input, framebuffer and exact-once marker/texture disposal; Canvas boundary stub only, no browser or hardware validation'};
 }finally{restore();}
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log('PASS Display touch:',JSON.stringify(await checkDisplayTouch()));
