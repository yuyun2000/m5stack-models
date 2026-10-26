import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const defaultIds=["poesp32","cams3-5mp","synth","8angle","pahub-v21","pbhub-v11","2relay","env-pro","fingerprint2","byteswitch","bytebutton","gps-v11","weight-i2c","8servos","fader","mini-scales","joystick2","gesture","oled","lcd","co2","tof4m","rtc","4relay","dmx","can","rollercan","rollercan-lite","vibrator","audioplayer"];
const hash=array=>createHash('sha256').update(Buffer.from(array.buffer,array.byteOffset,array.byteLength)).digest('hex');
function physicalMeshes(host){const result=[];host.root.updateMatrixWorld(true);host.root.traverse(object=>{if(!object.isMesh||object.userData.role==='printed-artwork')return;result.push({name:object.name,attributes:Object.fromEntries(Object.entries(object.geometry.attributes).map(([key,attribute])=>[key,hash(attribute.array)])),index:object.geometry.index?hash(object.geometry.index.array):null,matrix:object.matrix.toArray()});});return result;}
function artwork(host){const result=[];host.root.traverse(object=>{if(object.userData.role==='printed-artwork')result.push(object);});return result;}

/** Only the new artwork and unchanged physical geometry, not whole-catalog acceptance. */
export async function checkUnitStickerAdditions(ids=defaultIds){
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop}),ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};const products=[];
 try{for(const id of ids){const on=await loadModel(id),off=await loadModel(id,{artwork:false}),grove=await loadGroveModule(id);try{
  const panels=artwork(on);assert.ok(panels.length>0,`${id}: visible print mapping exists`);assert.equal(artwork(off).length,0,`${id}: artwork:false disables print`);assert.deepEqual(physicalMeshes(on),physicalMeshes(off),`${id}: physical meshes and poses do not depend on artwork`);
  for(const panel of panels){assert.ok(['official-raster','official-raster-film','reference-redraw'].includes(panel.userData.artworkKind));assert.ok(panel.parent&&panel.geometry.attributes.position.count>0,`${id}: artwork has a real parent and nonempty support`);for(const n of panel.geometry.attributes.position.array)assert.ok(Number.isFinite(n));assert.equal(panel.material.alphaTest,.04);}
  assert.ok(artwork(grove).length>0,`${id}: Grove assembly carries artwork`);assert.equal(grove.get('cable').getState().wireCount,4);products.push({id,panels:panels.length,kinds:[...new Set(panels.map(panel=>panel.userData.artworkKind))]});
 }finally{on.dispose();off.dispose();grove.dispose();}}
 return {status:'pass',products,scope:'New sticker construction, artwork:false, identical physical buffers/poses and four-wire Grove assembly only; no exhaustive UV, browser or whole-catalog acceptance'};
 }finally{if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkUnitStickerAdditions(process.argv.length>2?process.argv.slice(2):defaultIds),null,2));
