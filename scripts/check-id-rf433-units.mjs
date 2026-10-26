import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import fs from 'node:fs/promises';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const ids=['unit-id','rf433r','rf433t'];
const digest=v=>createHash('sha256').update(v).digest('hex'),hash=a=>digest(Buffer.from(a.buffer,a.byteOffset,a.byteLength)),stamp=v=>digest(JSON.stringify(v));
const own=(unit,kind)=>[...unit.components.values()].filter(c=>c.kind===kind);
function updateWorld(o){let root=o;while(root.parent)root=root.parent;root.updateMatrixWorld(true);}
function panels(unit){const a=[];unit.root.traverse(o=>{if(o.userData.role==='printed-artwork')a.push(o);});return a;}
function physical(unit){updateWorld(unit.root);const a=[];unit.root.traverse(o=>{if(!o.isMesh||o.userData.role==='printed-artwork')return;a.push({name:o.name,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,v])=>[k,hash(v.array)])),index:o.geometry.index?hash(o.geometry.index.array):null,matrix:o.matrixWorld.toArray()});});return stamp(a);}
function frames(unit){updateWorld(unit.root);return stamp(own(unit,'port').map(c=>({id:c.id,matrix:c.object3d.matrixWorld.toArray()})));}

/** Actual secure-element/RF PCB structures and external pose APIs; only Node canvas is substituted. */
export async function checkIdRf433Units(){
 const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};let host;
 try{
  host=await loadModel('sticks3');host.display().fill('#123456');const framebuffer=hash(host.display().buffer),hub=await loadGroveModule('hub');host.port('grove').attach(hub);const units={},artwork=[],events=[];host.on('input',e=>{if(e.kind!=='port')events.push(e);});
  for(const [i,id]of ids.entries()){
   const unit=await loadGroveModule(id,{cableLength:65+i*15});units[id]=unit;hub.port(`grove-${i+1}`).attach(unit);assert.ok(host.get(`grove/grove-${i+1}`).module===unit);assert.equal(unit.get('cable').getState().wireCount,4);assert.deepEqual(own(unit,'port').map(p=>p.id),['grove']);for(const kind of ['button','led','display','speaker'])assert.equal(own(unit,kind).length,0);assert.deepEqual(own(unit,'joint').map(p=>p.id),[]);assert.equal(unit.components.has('sensor'),false,'secure element and RF circuits expose no invented sensor anchor');
   const configurations=[{},...(catalog.products.find(p=>p.id===id)?.configurations??[]).map(c=>c.options)],seen=new Set();
   for(const options of configurations){const key=JSON.stringify(options);if(seen.has(key))continue;seen.add(key);for(const load of [loadModel,loadGroveModule]){const on=await load(id,options),off=await load(id,{...options,artwork:false});try{const printed=panels(on);assert.ok(printed.length>0);assert.equal(panels(off).length,0);assert.equal(physical(on),physical(off),'printing changes no physical attribute, index or world matrix in either entry');for(const p of printed){assert.ok(p.parent&&p.geometry.attributes.position.count>0);assert.equal(p.material.alphaTest,.04);assert.equal(p.userData.artworkKind,'reference-redraw');}if(!artwork.some(a=>a.id===id))artwork.push({id,panels:printed.length,kinds:[...new Set(printed.map(p=>p.userData.artworkKind))]});}finally{on.dispose();off.dispose();}}}
   const before=physical(unit),fixed=frames(unit),start=events.length;
   for(const type of id==='unit-id'?['identity','crypto','key']:['rf','receive','transmit'])assert.throws(()=>host.handle({type,target:`grove/grove-${i+1}/grove`,value:1}),'visual connectors own no identity,key,crypto or RF function');assert.equal(physical(unit),before);assert.equal(frames(unit),fixed);assert.equal(events.length,start);
  }
  for(const [i,id]of ids.entries()){host.handle({type:'pose',target:`grove/grove-${i+1}/unitFrame`,position:[i*45,160+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:`grove/grove-${i+1}/cable`,slack:12,bend:[0,0,-1]});assert.equal(units[id].get('cable').getState().wireCount,4);}
  assert.equal(hash(host.display().buffer),framebuffer);const siblings=[physical(units['unit-id']),physical(units.rf433t)];hub.port('grove-2').detach();assert.equal(hub.port('grove-2').module,null);assert.ok(hub.port('grove-1').module===units['unit-id']&&hub.port('grove-3').module===units.rf433t);assert.deepEqual([physical(units['unit-id']),physical(units.rf433t)],siblings);
  return{status:'pass',artwork,cases:['three-real-four-wire-Grove-branches','own-secure-element-receiver-transmitter-PCBs-and-fixed-internal-antennas','grove-only-APIs-reject-key-identity-crypto-and-RF-numeric-functions','no-invented-sensors-buttons-LEDs-joints-displays-speakers-or-external-antennas','both-entries-artwork-preserves-all-physical-attributes-indices-world-matrices','external-pose-cable-and-independent-selective-detach','host-framebuffer-preserved'],scope:'New actual secure-element/RF assemblies and external appearance APIs only;Node canvas stub,no browser,identity,keys,encryption,authentication,RF,ASK,receive,transmit,data,distance,I2C,electrical,firmware,physical or whole-catalog acceptance'};
 }finally{host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkIdRf433Units(),null,2));
