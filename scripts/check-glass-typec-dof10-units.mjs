import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import fs from 'node:fs/promises';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const ids=['glass2','typec-to-grove','dof10'];
const digest=v=>createHash('sha256').update(v).digest('hex');
const hash=a=>digest(Buffer.from(a.buffer,a.byteOffset,a.byteLength));
const stamp=v=>digest(JSON.stringify(v));
const own=(u,k)=>[...u.components.values()].filter(c=>c.kind===k);
function world(o){let r=o;while(r.parent)r=r.parent;r.updateMatrixWorld(true);}
function under(o,p){for(;o;o=o.parent)if(o===p)return true;return false;}
function attrs(g){return Object.fromEntries(Object.entries(g.attributes).map(([k,v])=>[k,hash(v.array)]));}
function physical(u,exclude=null){world(u.root);const a=[];u.root.traverse(o=>{if(o.isMesh&&o.userData.role!=='printed-artwork'&&(!exclude||!under(o,exclude)))a.push({name:o.name,attributes:attrs(o.geometry),index:o.geometry.index?hash(o.geometry.index.array):null,matrix:o.matrixWorld.toArray()});});return stamp(a);}
function frames(u){world(u.root);return stamp(own(u,'port').map(p=>({id:p.id,matrix:p.object3d.matrixWorld.toArray()})));}
function printed(u){const a=[];u.root.traverse(o=>{if(o.userData.role==='printed-artwork')a.push(o);});return a;}
function tick(h){for(let n=0;n<30;n++)h.update(1/60);}
function roundtrip(u,p){const m=p.module,rest=physical(u),fixed=frames(u);assert.ok(m);assert.ok(p.detach({dispose:false})===m);assert.equal(frames(u),fixed);p.attach(m);assert.equal(physical(u),rest);}
function addressCheck(host,u,events){
 const b=u.button('address');assert.equal(b.isLatching,true);assert.ok(b.travel>0);b.setPosition(0,{immediate:true});
 const rest=physical(u),fixed=physical(u,b.cap),ports=frames(u),start=events.length;
 host.handle({type:'position',target:'grove/grove-3/address',position:1,immediate:true});
 assert.equal(b.getState().position,1);assert.equal(b.getActuationState().depthMm,b.travel);assert.notEqual(physical(u),rest);assert.equal(physical(u,b.cap),fixed);assert.equal(frames(u),ports);assert.equal(events.length,start,'external visual state does not echo input');
 const atOne=physical(u);for(const invalid of [-1,2,.5,NaN,Infinity]){assert.throws(()=>b.setPosition(invalid,{immediate:true}));assert.equal(b.getState().position,1);assert.equal(physical(u),atOne);}
 b.setPosition(0,{immediate:true});assert.equal(physical(u),rest);
 const begin=events.length;b.onPointerDown({pointerId:81});b.press('fixture-held');tick(host);assert.equal(b.getState().position,1);assert.equal(b.getState().pressed,true);assert.equal(physical(u,b.cap),fixed);
 b.onPointerUp({pointerId:81});tick(host);assert.equal(b.getState().pressed,true);host.handle({type:'button',target:'grove/grove-3/address',action:'cancel',source:'fixture-held'});tick(host);
 assert.equal(b.getState().pressed,false);assert.equal(b.getState().position,1,'cancel keeps the stable detent');assert.equal(b.getActuationState().depthMm,b.travel);assert.deepEqual(events.slice(begin).map(e=>e.action),['down','up']);assert.equal(events.at(-1).cancelled,true);assert.equal(physical(u,b.cap),fixed);
 b.setPosition(0,{immediate:true});assert.equal(physical(u),rest);b.setPosition(1);host.update(1/240);assert.ok(b.getActuationState().depthMm>0&&b.getActuationState().depthMm<b.travel);tick(host);assert.equal(b.getActuationState().depthMm,b.travel);b.setPosition(0);tick(host);assert.equal(physical(u),rest);assert.equal(frames(u),ports);
}

/** Necessary current-product integration; canvas is stubbed, no GPU/browser or firmware. */
export async function checkGlassTypecDof10Units(){
 const cat=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
 const old=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});
 const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
 let host,wrong;
 try{
  host=await loadModel('sticks3');host.display().fill('#123456');const framebuffer=hash(host.display().buffer),hub=await loadGroveModule('hub');host.port('grove').attach(hub);const units={},events=[],artwork=[];host.on('input',e=>{if(e.kind!=='port')events.push(e);});
  for(const [i,id]of ids.entries()){
   const u=await loadGroveModule(id,{cableLength:75+i*15});units[id]=u;hub.port('grove-'+(i+1)).attach(u);assert.equal(u.get('cable').getState().wireCount,4);assert.equal(own(u,'joint').length,0);assert.equal(own(u,'led').length,0);assert.equal(own(u,'speaker').length,0);
   assert.deepEqual(own(u,'port').map(p=>p.id).sort(),id==='glass2'?['grove','grove-right']:id==='typec-to-grove'?['grove','out-1','out-2','usb']:['grove']);
   assert.deepEqual(own(u,'button').map(p=>p.id),id==='dof10'?['address']:[]);assert.deepEqual(own(u,'display').map(p=>p.id),id==='glass2'?['screen']:[]);assert.equal(u.components.has('sensor'),id==='dof10');
   const configs=[{},...(cat.products.find(p=>p.id===id)?.configurations??[]).map(c=>c.options)],seen=new Set();
   for(const options of configs){const key=JSON.stringify(options);if(seen.has(key))continue;seen.add(key);for(const load of [loadModel,loadGroveModule]){const on=await load(id,options),off=await load(id,{...options,artwork:false});try{assert.equal(physical(on),physical(off),'artwork must preserve all physical attributes,indices and world matrices');assert.equal(printed(off).length,0);const p=printed(on);for(const m of p)assert.ok(['source-vector-raster','reference-redraw'].includes(m.userData.artworkKind));if(load===loadModel&&key==='{}')artwork.push({id,panels:p.length,kinds:[...new Set(p.map(m=>m.userData.artworkKind))]});}finally{off.dispose();on.dispose();}}}
  }
  const glass=units.glass2,screen=glass.display('screen'),fixedGlass=physical(glass);assert.equal(screen.width,128);assert.equal(screen.height,56);assert.equal(screen.buffer.length,128*56*4);assert.equal(screen.material.transparent,true,'off-pixel display layer must blend with real background');assert.equal(screen.material.depthWrite,false,'transparent pixels must not occlude background');
  screen.fill('#000000');assert.equal(screen.buffer[0],0);screen.writeRGBA(new Uint8Array([255,255,255,255]),{x:0,y:0,w:1,h:1});assert.equal(screen.buffer[0],255);assert.equal(screen.buffer[3],255);assert.equal(physical(glass),fixedGlass);assert.equal(hash(host.display().buffer),framebuffer);
  const glassPixels=hash(screen.buffer);addressCheck(host,units.dof10,events);assert.deepEqual(units.dof10.get('sensor').getState(),{});assert.equal(hash(screen.buffer),glassPixels);
  const gp=await loadGroveModule('key'),ap=await loadGroveModule('key'),bp=await loadGroveModule('key');glass.port('grove-right').attach(gp);units['typec-to-grove'].port('out-1').attach(ap);units['typec-to-grove'].port('out-2').attach(bp);for(const u of [gp,ap,bp])assert.equal(u.get('cable').getState().wireCount,4);
  roundtrip(glass,glass.port('grove-right'));roundtrip(units['typec-to-grove'],units['typec-to-grove'].port('out-1'));roundtrip(units['typec-to-grove'],units['typec-to-grove'].port('out-2'));
  wrong=await loadGroveModule('key');const adapterFixed=physical(units['typec-to-grove']);assert.throws(()=>units['typec-to-grove'].port('usb').attach(wrong));assert.equal(physical(units['typec-to-grove']),adapterFixed);wrong.dispose();wrong=null;
  for(const [i,id]of ids.entries()){const u=units[id],shape=physical(u);u.handle({type:'pose',target:'unitFrame',position:[i*55,190+i*15,8],rotation:[.1,-.2,.15]});u.handle({type:'cable',target:'cable',slack:12,bend:[0,0,-1]});tick(host);assert.notEqual(physical(u),shape);roundtrip(hub,hub.port('grove-'+(i+1)));assert.equal(hash(host.display().buffer),framebuffer);}
  return{status:'pass',artwork,cases:['three-real-four-core-input-branches','Glass2-visible128x56-external-framebuffer-transparent-material-and-fixed-physical-assembly','actual-two-Grove-display-and-three-Grove-USB-C-adapter-independent-four-core-outputs','USB-rejects-Grove-plug-and-preserves-installed-peers','DoF10-actual-stable-switch-detents-multiple-sources-cancel-retains-detent-external-position-noecho-and-fixed-parts','two-entries-all-real-configurations-artwork-preserves-all-physical-attributes-indices-world-matrices','external-pose-cable-independent-detach-and-host-framebuffer-preserved'],scope:'Current three visual assemblies and external controls only;Node canvas stub,no GPU/browser,controller mapping,USB,power,protocol,sensor values,electrical,physical or whole-catalog acceptance'};
 }finally{wrong?.dispose();host?.dispose();if(old===undefined)delete globalThis.document;else globalThis.document=old;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkGlassTypecDof10Units(),null,2));
