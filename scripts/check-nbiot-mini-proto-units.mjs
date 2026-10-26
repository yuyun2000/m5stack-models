import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const ids=['nbiot2','nbiot-cn','mini-proto'];
const radioPorts={nbiot2:'sma','nbiot-cn':'antenna'};
const digest=v=>createHash('sha256').update(v).digest('hex');
const hash=a=>digest(Buffer.from(a.buffer,a.byteOffset,a.byteLength));
const stamp=v=>digest(JSON.stringify(v));
const own=(u,k)=>[...u.components.values()].filter(c=>c.kind===k);
function world(o){let r=o;while(r.parent)r=r.parent;r.updateMatrixWorld(true);}
function under(o,p){for(;o;o=o.parent)if(o===p)return true;return false;}
function attrs(o){return Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,v])=>[k,hash(v.array)]));}
function records(u,excluded=[]){world(u.root);const out=[];u.root.traverse(o=>{if(o.isMesh&&o.userData.role!=='printed-artwork'&&!excluded.some(p=>p&&under(o,p)))out.push({name:o.name,attributes:attrs(o),index:o.geometry.index?hash(o.geometry.index.array):null,matrix:o.matrixWorld.toArray()});});return out;}
const physical=(u,excluded=[])=>stamp(records(u,excluded));
function frames(u){world(u.root);return stamp(own(u,'port').map(c=>({id:c.id,matrix:c.object3d.matrixWorld.toArray()})));}
function panels(u){const out=[];u.root.traverse(o=>{if(o.userData.role==='printed-artwork')out.push(o);});return out;}
function tick(h){for(let i=0;i<30;i++)h.update(1/60);}
function roundtrip(u,p){const item=p.module;assert.ok(item);const complete=physical(u),ports=frames(u);assert.ok(p.detach({dispose:false})===item);assert.equal(frames(u),ports);p.attach(item);assert.equal(physical(u),complete);return item;}
function finiteTilt(host,u,joint,target,events){
 const original=joint.getState().angleDeg,range=joint.getState().rangeDeg;
 assert.ok(Array.isArray(range)&&range.length===2);assert.equal(joint.getState().continuous,false);
 const goal=original===range[1]?range[0]:range[1],rest=physical(u),fixed=physical(u,[joint.object3d]),ports=frames(u),start=events.length;
 host.handle({type:'joint',target,angleDeg:goal,durationMs:250});host.update(1/60);assert.ok(joint.getState().transitioning);assert.notEqual(joint.getState().angleDeg,original);assert.notEqual(joint.getState().angleDeg,goal);tick(host);assert.equal(joint.getState().angleDeg,goal);
 assert.notEqual(physical(u),rest);assert.equal(physical(u,[joint.object3d]),fixed);assert.equal(frames(u),ports);assert.equal(events.length,start);
 const bent=physical(u);for(const bad of [{angleDeg:range[0]-.01},{angleDeg:range[1]+.01},{angleDeg:Infinity},{rpm:1}]){assert.throws(()=>joint.set(bad));assert.equal(physical(u),bent);}joint.set({angleDeg:original});assert.equal(physical(u),rest);
}
function serviceOnlyRemovesCover(id,closed,open){
 closed.root;open.root;
 const a=id==='mini-proto'?closed.miniProtoAssembly:id==='nbiot2'?closed.nbiot2Assembly:closed.nbiotCnAssembly;
 const rearName=id==='mini-proto'?'Mini Proto complete native rear housing':id==='nbiot2'?'NBIoT2 exact own native rear casing half':'NBIoT-CN complete native rear housing';
 const fixings=id==='mini-proto'?Object.values(a.screw):id==='nbiot2'?a.fixing.flatMap(s=>[s.head,s.blind,s.shank]):a.screws.flatMap(s=>[s.head,s.floor,s.shank]);
 const removed=[a.parts[rearName],id==='mini-proto'?a.film:id==='nbiot2'?a.labels.back:a.films.back,...fixings];
 assert.equal(removed.length,id==='mini-proto'?5:11);assert.ok(removed.every(o=>o?.isMesh));
 const retained=records(closed,removed),actual=records(open);
 assert.equal(retained.length,records(closed).length-removed.length,'only named native rear housing,film and actual fixing meshes removed');assert.equal(actual.length,retained.length);
 const available=new Map();for(const r of retained){const k=stamp(r);available.set(k,(available.get(k)??0)+1);}
 for(const r of actual){const k=stamp(r),count=available.get(k)??0;assert.ok(count>0,'service leaves every retained physical attribute and pose unchanged');available.set(k,count-1);}
 assert.ok([...available.values()].every(n=>n===0),'service retains the complete remaining physical multiset');
 assert.equal(frames(open),frames(closed));
}

/** Current exact-SKU physical assemblies and external motion; Node canvas stub. */
export async function checkNbiotMiniProtoUnits(){
 const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
 const {LoraAntenna:RpSmaAntenna}=await import('../src/units/c6l/index.js');
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop}),ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};let host,wrong,wrongSma;
 try{
  host=await loadModel('sticks3');host.display().fill('#123456');const framebuffer=hash(host.display().buffer),hub=await loadGroveModule('hub');host.port('grove').attach(hub);const units={},events=[],artwork=[];host.on('input',e=>{if(e.kind!=='port')events.push(e);});
  for(const[i,id]of ids.entries()){
   const radio=id!=='mini-proto',u=await loadGroveModule(id,{...(radio?{antenna:true}:{}),cableLength:70+i*15});hub.port('grove-'+(i+1)).attach(u);units[id]=u;
   assert.equal(u.get('cable').getState().wireCount,4);assert.equal(u.components.has('sensor'),false);assert.equal(u.components.has('sim'),false);
   for(const kind of ['display','speaker','button','led','joint'])assert.equal(own(u,kind).length,0,'only real own controls and carriers');
   assert.deepEqual(own(u,'port').map(p=>p.id).sort(),radio?['grove',radioPorts[id]].sort():['grove']);
   const presets=catalog.products.find(p=>p.id===id)?.configurations??[];assert.ok(Array.isArray(presets)&&presets.every(p=>p.id&&p.name&&p.options));
   const configs=[{},...presets.map(p=>p.options),...(radio?[{antenna:false,rearCover:true},{antenna:true,rearCover:true},{antenna:false,rearCover:false},{antenna:true,rearCover:false},{antenna:true,antennaAngleDeg:90,rearCover:true},{antenna:true,antennaAngleDeg:90,rearCover:false}]:[{rearCover:true},{rearCover:false}])],seen=new Set();
   for(const options of configs){const key=JSON.stringify(options);if(seen.has(key))continue;seen.add(key);for(const load of [loadModel,loadGroveModule]){const on=await load(id,options),off=await load(id,{...options,artwork:false});try{
    assert.equal(physical(on),physical(off),'every physical attribute,index and world pose preserved without ink');assert.equal(panels(off).length,0);
    const rear=options.rearCover!==false;assert.equal(panels(on).length,radio?(rear?2:1):(rear?1:0));
    for(const p of panels(on))assert.ok(['reference-redraw','reference-redraw-raster','official-photo-code-redraw','source-vector-raster','source-vector-raster-and-reference-redraw'].includes(p.userData.artworkKind));
    if(radio){assert.equal(on.port(radioPorts[id]).module!==null,options.antenna===true,'actual antenna default and option');assert.equal(off.port(radioPorts[id]).module!==null,options.antenna===true);assert.equal(on.components.has('sim'),!rear);if(!rear)assert.deepEqual(on.get('sim').getState(),{});}
    if(load===loadModel&&key==='{}')artwork.push({id,panels:panels(on).length,kinds:[...new Set(panels(on).map(p=>p.userData.artworkKind))]});
   }finally{on.dispose();off.dispose();}}}
   const closed=await loadModel(id,{rearCover:true,antenna:false}),open=await loadModel(id,{rearCover:false,antenna:false});try{serviceOnlyRemovesCover(id,closed,open);if(radio){assert.equal(closed.components.has('sim'),false);assert.ok(open.components.has('sim'));assert.deepEqual(open.get('sim').getState(),{});}else assert.deepEqual([...open.components.keys()],['grove']);}finally{closed.dispose();open.dispose();}
  }
  wrong=await loadGroveModule('key');wrongSma=new RpSmaAntenna();
  for(const[i,id]of ids.slice(0,2).entries()){
   const radio=units[id],p=radio.port(radioPorts[id]),antenna=p.module;assert.ok(antenna);assert.deepEqual(own(antenna,'joint').map(c=>c.id),['tilt']);finiteTilt(host,radio,antenna.get('tilt'),'grove/grove-'+(i+1)+'/'+radioPorts[id]+'/tilt',events);roundtrip(radio,p);
   const rest=physical(radio);for(const incompatible of [wrong,wrongSma]){assert.throws(()=>p.attach(incompatible));assert.ok(p.module===antenna);assert.equal(physical(radio),rest);}
  }
  wrong.dispose();wrong=null;wrongSma.dispose();wrongSma=null;
  for(const[i,id]of ids.entries()){host.handle({type:'pose',target:'grove/grove-'+(i+1)+'/unitFrame',position:[i*55,190+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:'grove/grove-'+(i+1)+'/cable',slack:12,bend:[0,0,-1]});assert.equal(units[id].get('cable').getState().wireCount,4);}
  assert.equal(hash(host.display().buffer),framebuffer);const siblings=[physical(units.nbiot2),physical(units['nbiot-cn'])];hub.port('grove-3').detach();assert.deepEqual([physical(units.nbiot2),physical(units['nbiot-cn'])],siblings);assert.ok(hub.port('grove-1').module===units.nbiot2&&hub.port('grove-2').module===units['nbiot-cn']);
  return {status:'pass',artwork,cases:['three-real-four-core-input-branches','two-own-cellular-SKUs-ordinary-SMA-antenna-finite-elbow-motion-with-fixed-coupling-body-and-ports','two-SMA-ports-reject-RP-SMA-and-Grove-preserving-occupied-antenna','native-rear-cover-service-removes-only-cover-fasteners-and-rear-film-retaining-other-material-and-frames','internal-empty-NanoSIM-holder-passive-anchor-only-accessible-after-own-real-cover-removal','Mini-Proto-own-48-hole-board-without-U022-borrowed-hole-grid-or-user-circuit','both-entries-all-real-configurations-artwork-preserves-every-physical-attribute-index-and-world-matrix','external-pose-cable-no-inputecho-independent-detach-and-host-framebuffer-preserved'],scope:'Three current exact-SKU assemblies and external visual motion; Node canvas stub; no browser/GPU,cellular/RF/AT/UART,SIM or network state,electrical/power,firmware,measured stops,production fit,physical hardware or whole-catalog acceptance'};
 }finally{wrongSma?.dispose();wrong?.dispose();host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkNbiotMiniProtoUnits(),null,2));
