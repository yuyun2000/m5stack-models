import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const letters=['a','b','c','d','e','f','g','dp'];
const hash=array=>createHash('sha256').update(Buffer.from(array.buffer,array.byteOffset,array.byteLength)).digest('hex');
function artwork(model){const result=[];model.root.traverse(o=>{if(o.userData.role==='printed-artwork')result.push(o);});return result;}
function physical(model){const result=[];model.root.updateMatrixWorld(true);model.root.traverse(o=>{if(!o.isMesh||o.userData.role==='printed-artwork')return;result.push({name:o.name,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([key,a])=>[key,hash(a.array)])),index:o.geometry.index?hash(o.geometry.index.array):null,matrix:o.matrix.toArray()});});return result;}

/** New real product components; only the Node canvas boundary is substituted. */
export async function checkStepAsrUhfUnits(){
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});
 const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};let host;
 try{
  host=await loadModel('sticks3');const hub=await loadGroveModule('hub');host.port('grove').attach(hub);const modules={},prints=[];
  for(const [i,id]of ['step16','asr','uhf-rfid'].entries()){
   const module=await loadGroveModule(id,{cableLength:65+i*15});modules[id]=module;hub.port(`grove-${i+1}`).attach(module);
   assert.ok(host.get(`grove/grove-${i+1}`).module===module);assert.equal(module.get('cable').getState().wireCount,4);assert.equal(module.get('sensor').meta.role,'visual-anchor');
   const on=await loadModel(id),off=await loadModel(id,{artwork:false});try{
    const panels=artwork(on);assert.ok(panels.length>0);assert.equal(artwork(off).length,0);assert.deepEqual(physical(on),physical(off),'corresponding print layer does not alter original physical parts');
    for(const panel of panels){assert.ok(panel.parent&&panel.geometry.attributes.position.count>0);assert.equal(panel.material.alphaTest,.04);assert.ok(['official-raster','official-raster-film','official-vector-raster','reference-redraw'].includes(panel.userData.artworkKind));}
    prints.push({id,panels:panels.length,kinds:[...new Set(panels.map(p=>p.userData.artworkKind))]});
   }finally{on.dispose();off.dispose();}
  }
  const step=modules.step16,asr=modules.asr,uhf=modules['uhf-rfid'];
  for(const unit of [asr,uhf]){assert.equal(unit.list('button').length,0);assert.equal(unit.list('joint').length,0);assert.equal(unit.list('led').length,0);}
  for(const [i,type]of ['bcd','voice','rfid'].entries())assert.throws(()=>host.handle({type,target:`grove/grove-${i+1}/sensor`,value:1}),'anchors do not implement BCD, voice capture/recognition or RF reads');
  assert.equal(step.list('button').length,0);assert.equal(step.list('display').length,0,'physical seven-segment assembly is not a framebuffer LCD');assert.equal(step.list('joint').length,1);assert.equal(step.list('led').length,9);
  const leds=letters.map(letter=>step.get('segment-'+letter)),rgb=step.get('rgb'),initial=leds.map(led=>led.getState()),events=[];host.on('input',e=>events.push(e));
  for(let i=0;i<leds.length;i++)for(let j=i+1;j<leds.length;j++)if(leds[i].lensMaterial&&leds[j].lensMaterial)assert.ok(leds[i].lensMaterial!==leds[j].lensMaterial,'segment emissive materials are independently owned');
  const rgbOff=rgb.getState();host.handle({type:'led',target:'grove/grove-1/segment-a',brightness:.7,color:'#0000ff'});assert.equal(leds[0].brightness,.7);assert.equal(leds[0].getState().color,initial[0].color,'actual segment colour remains fixed');assert.deepEqual(leds.slice(1).map(led=>led.getState()),initial.slice(1));assert.deepEqual(rgb.getState(),rgbOff);
  host.handle({type:'led',target:'grove/grove-1/segment-f',brightness:.4});const segments=leds.map(led=>led.getState());host.handle({type:'led',target:'grove/grove-1/rgb',color:'#319bc7',brightness:.55});assert.deepEqual(leds.map(led=>led.getState()),segments,'RGB output does not overwrite digit segments');
  const lightState=[...leds,rgb].map(led=>led.getState()),rotation=step.get('rotation');host.root.updateMatrixWorld(true);const rest=rotation.object3d.quaternion.clone(),frames=[...leds,rgb].map(led=>led.object3d.matrixWorld.clone());
  rotation.set({angleDeg:45});host.root.updateMatrixWorld(true);assert.ok(!rotation.object3d.quaternion.equals(rest),'real source knob changes pose');for(let i=0;i<frames.length;i++)assert.ok([...leds,rgb][i].object3d.matrixWorld.equals(frames[i]),'fixed segment/RGB frames do not rotate with knob');assert.deepEqual([...leds,rgb].map(led=>led.getState()),lightState,'rotating does not generate an automatic hex digit');
  rotation.set({angleDeg:67.5,durationMs:120});for(let i=0;i<12;i++)host.update(1/60);assert.equal(rotation.getState().angleDeg,67.5);rotation.set({angleDeg:0});host.root.updateMatrixWorld(true);assert.ok(rotation.object3d.quaternion.equals(rest));assert.deepEqual([...leds,rgb].map(led=>led.getState()),lightState);assert.equal(events.length,0,'external rotation and light outputs do not echo input');
  for(const [i,id]of ['step16','asr','uhf-rfid'].entries()){
   host.handle({type:'pose',target:`grove/grove-${i+1}/unitFrame`,position:[i*25,85+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:`grove/grove-${i+1}/cable`,slack:12,bend:[0,0,-1]});assert.equal(modules[id].get('cable').getState().wireCount,4);
  }
  hub.port('grove-2').detach();assert.equal(hub.port('grove-2').module,null);assert.ok(hub.port('grove-1').module===step&&hub.port('grove-3').module===uhf);assert.deepEqual([...leds,rgb].map(led=>led.getState()),lightState);
  return {status:'pass',artwork:prints,cases:['three-real-Unit-Grove-branches','actual-knob-angle-transition-and-exact-restoration','eight-independent-fixed-colour-segments-and-RGB','no-automatic-digit-or-firmware-state','fixed-acoustic-and-RF-assemblies-with-passive-anchors','artwork-toggle-keeps-physical-buffers-and-poses','four-wire-poses-and-selective-detach'],scope:'New product construction/API only; canvas stub, no browser, audio/recognition, RF, firmware, hardware or whole-catalog acceptance'};
 }finally{host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkStepAsrUhfUnits(),null,2));
