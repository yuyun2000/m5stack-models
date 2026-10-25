import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {Device,Port} from '../src/core/index.js';
import {Model,GroveModule,TerminalPlug,spec} from '../src/units/rs485/index.js';
import data from '../src/units/rs485/geometry-data.js';

const v=a=>new THREE.Vector3(...a),near=(a,b,why)=>assert.ok(Math.abs(a-b)<3e-5,`${why}: ${a} vs ${b}`);
const visible=o=>o.isMesh&&o.material?.opacity!==0;
const bounds=root=>{const b=new THREE.Box3();root.traverse(o=>{if(visible(o))b.expandByObject(o);});return b;};
const shoot=(root,origin,direction)=>new THREE.Raycaster(v(origin),v(direction)).intersectObject(root,true).filter(h=>visible(h.object));
const meshes=root=>{const a=[];root.traverse(o=>{if(visible(o))a.push(o);});return a;};

function closed(object){
 const p=object.geometry.attributes.position,index=object.geometry.index,edges=new Map();
 const key=i=>{const offset=index?index.getX(i):i;return [p.getX(offset),p.getY(offset),p.getZ(offset)].map(n=>Math.round(n*1e4)).join(',');};
 for(let i=0;i<(index?.count??p.count);i+=3){const a=[key(i),key(i+1),key(i+2)];for(let j=0;j<3;j++){const edge=[a[j],a[(j+1)%3]].sort().join('|');edges.set(edge,(edges.get(edge)??0)+1);}}
 assert.ok([...edges.values()].every(n=>n===2),`${object.name} is a closed physical solid`);
}

function materialClearance(model,plug){
 const material=new THREE.MeshBasicMaterial({side:THREE.DoubleSide}),ray=new THREE.Raycaster(),directions=[[.733,.312,.604],[-.381,.852,.359],[.213,-.527,.823]].map(a=>v(a).normalize());
 const shadow=object=>{const s=new THREE.Mesh(object.geometry,material);s.matrixAutoUpdate=false;s.matrixWorld.copy(object.matrixWorld);return s;};
 const cache=new Map(),solid=o=>{if(!cache.has(o))cache.set(o,shadow(o));return cache.get(o);};
 const contains=(object,p,direction)=>{
  ray.set(p,direction);const hits=ray.intersectObject(solid(object),false),normalMatrix=new THREE.Matrix3().getNormalMatrix(object.matrixWorld),groups=[];
  // Touching native front/rear shells can have opposite crossings at the
  // same distance. Retain both signs; deduplicating distance alone invents
  // a solid where one source shell exits and the next begins.
  for(const h of hits){if(h.distance<1e-5)return false;const sign=Math.sign(h.face.normal.clone().applyNormalMatrix(normalMatrix).dot(direction));if(!sign)continue;const prior=groups.find(g=>Math.abs(g.distance-h.distance)<1e-5);if(prior)prior.signs.add(sign);else groups.push({distance:h.distance,signs:new Set([sign])});}
  return groups.reduce((n,g)=>n+[...g.signs].reduce((a,b)=>a+b,0),0)>0;
 };
 const inside=(o,p)=>directions.every(d=>contains(o,p,d));
 const samples=object=>{
  const p=object.geometry.attributes.position,index=object.geometry.index,center=bounds(object).getCenter(new THREE.Vector3()),a=new Map();
  const add=p=>{p.lerp(center,.001);a.set(p.toArray().map(n=>Math.round(n*1e5)).join(','),p);};
  for(let i=0;i<p.count;i++)add(new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(object.matrixWorld));
  for(let i=0;i<(index?.count??p.count);i+=3){const q=[0,1,2].map(k=>new THREE.Vector3().fromBufferAttribute(p,index?index.getX(i+k):i+k).applyMatrix4(object.matrixWorld));add(q[0].add(q[1]).add(q[2]).multiplyScalar(1/3));}
  return [...a.values()];
 };
 const added=meshes(plug.root),existing=meshes(model.root).filter(o=>!added.includes(o)),pairs=[];
 for(const a of added)for(const b of existing)if(bounds(a).intersectsBox(bounds(b)))pairs.push([a,b,'fixed socket / source assembly']);
 for(const a of added.filter(o=>o.material.metalness>.5))for(const b of added.filter(o=>o.material.metalness<=.5))if(bounds(a).intersectsBox(bounds(b)))pairs.push([a,b,'added metal / plastic']);
 let probes=0,grids=0;const points=new Map();
 try{
  const native=model.parts.housing;assert.ok(inside(native,v([11.6,0,0])),'Native-shell positive control retains real side-wall material');assert.equal(inside(native,v([0,0,20])),false,'Native-shell outside control');
  const tongue=plug.terminalPlugAssembly.tongue,center=plug.root.localToWorld(v([0,-4,1]));assert.ok(inside(tongue,center),'Mating tongue has real material above its bores');
  assert.equal(inside(tongue,plug.root.localToWorld(v([spec.terminal.pinX[0],-4,-1.4]))),false,'Open mating-channel negative control');
  for(const [a,b,label]of pairs){
   for(const [source,target]of [[a,b],[b,a]]){
    if(!points.has(source))points.set(source,samples(source));const box=bounds(target);
    for(const p of points.get(source)){if(!box.containsPoint(p)||!inside(source,p))continue;assert.equal(inside(target,p),false,`${label}: ${source.name} overlaps ${target.name} at ${p.toArray()}`);probes++;}
   }
   const overlap=bounds(a).intersect(bounds(b)),size=overlap.getSize(new THREE.Vector3());
   if(Math.min(size.x,size.y,size.z)<1e-4)continue;
   for(let x=1;x<=3;x++)for(let y=1;y<=3;y++)for(let z=1;z<=3;z++){const p=overlap.min.clone().add(new THREE.Vector3(size.x*x/4,size.y*y/4,size.z*z/4));assert.ok(!(inside(a,p)&&inside(b,p)),`${label}: finite-volume grid found ${a.name} / ${b.name} overlap at ${p.toArray()}`);grids++;}
  }
  return {status:'pass',candidatePairs:pairs.length,surfaceProbes:probes,interiorGridProbes:grids,directions:3,scope:'Bidirectional vertex/triangle-centre samples and finite-volume overlap grids against actual fixed geometry plus added metal/plastic; no manufacturing fit or exhaustive CSG proof'};
 }finally{material.dispose();}
}

export async function checkRs485Terminal(){
 const owned=[],model=new Model();owned.push(model);let rays=0,screwPoses=0;
 try{
  model.root.updateMatrixWorld(true);assert.equal(model.meta.sku,'U034');assert.equal(model.port('terminal').module,null,'Default product retains the empty fixed socket');assert.equal(model.list('joint').length,0);
  const native=model.parts.housing,neutralNative=native.matrixWorld.clone(),nativePositions=native.geometry.attributes.position.array.slice();
  for(const key of ['position','normal','index']){const a=key==='index'?native.geometry.index.array:native.geometry.attributes[key].array;assert.equal(Buffer.compare(Buffer.from(a.buffer,a.byteOffset,a.byteLength),Buffer.from(data[0][key],'base64')),0,'Native source geometry remains byte-identical');}
  const baseBounds=bounds(model.root);near(baseBounds.getSize(new THREE.Vector3()).y,32,'Default assembled height');near(baseBounds.getSize(new THREE.Vector3()).z,10.245,'Default fixed-socket depth with rear screw offset');
  const terminal=model.port('terminal');assert.equal(terminal.connector,'ht3.96-4p');assert.deepEqual(terminal.pins.map(p=>p.name),['B','A','12V+','12V-']);assert.ok(v([0,1,0]).applyQuaternion(terminal.object3d.quaternion).equals(v([0,1,0])),'Original +Y mating frame is preserved');
  const plug=new TerminalPlug();terminal.attach(plug);model.root.updateMatrixWorld(true);assert.equal(model.list('joint').length,4);
  for(const object of meshes(plug.root)){closed(object);for(const n of object.geometry.attributes.position.array)assert.ok(Number.isFinite(n),'All plug coordinates are finite');assert.ok(!object.material.map,'No photographic label or flat image hides the connector');}
  for(const [i,x]of spec.terminal.pinX.entries()){
   assert.equal(terminal.pinAt(v([x,0,-1.4])).n,i+1,'Physical pin centre resolves through the existing port');
   const tongue=plug.terminalPlugAssembly.tongue;assert.equal(shoot(tongue,[x,7,1.3],[0,1,0]).length,0,'Fixed pin has a real bored mating route through the tongue');rays++;
   const access=shoot(model.root,[x,21.24,20],[0,0,-1])[0];assert.equal(access?.object.name,'RS485 plug screw slot floor','Screw-access bore and actual tool slot remain open');near(access.point.z,6.6,'Slot floor depth');rays++;
   const entry=shoot(plug.root,[x,32,3.05],[0,-1,0])[0];assert.equal(entry?.object.name,'RS485 plug clamp rear web','Wire entry opens into a deep physical clamp channel');near(entry.point.y,18.9,'Clamp channel rear position');rays++;
   const joint=plug.get(`screw-${i+1}`),head=joint.object3d.children[0],rest=head.matrixWorld.clone(),plate=meshes(plug.root).find(o=>o.name==='RS485 plug pressure plate'),fixed=plate.matrixWorld.clone();
   assert.equal(joint.continuous,false);assert.equal(joint.limitsDeg,null);assert.throws(()=>joint.set({rpm:1}),RangeError);
   for(const angleDeg of [-150,-37,0,90,170]){model.handle({type:'joint',target:`terminal/screw-${i+1}`,angleDeg});model.root.updateMatrixWorld(true);near(joint.angleDeg,angleDeg,'Nested external screw command');assert.ok(plate.matrixWorld.equals(fixed),'Visible screw rotation does not fabricate clamp movement');assert.ok(native.matrixWorld.equals(neutralNative),'Source shell never moves');assert.deepEqual(native.geometry.attributes.position.array,nativePositions);screwPoses++;}
   joint.setAngle(0);model.root.updateMatrixWorld(true);assert.ok(head.matrixWorld.equals(rest),'Each screw returns exactly to its neutral head angle');
  }
  const clearance=materialClearance(model,plug),plugBounds=bounds(plug.root),retained=terminal.detach({dispose:false});assert.ok(retained===plug);assert.equal(model.list('joint').length,0);terminal.attach(retained);assert.equal(model.list('joint').length,4);terminal.detach();assert.equal(model.list('joint').length,0);assert.equal(model.update(1),false,'No protocol, supply or automatic screw animation is introduced');
  const configured=new Model({terminalPlug:true});owned.push(configured);assert.ok(configured.port('terminal').module instanceof TerminalPlug,'Standalone constructor option installs the supplied accessory');
  const host=new Device();owned.push(host);const port=host.add(new Port({id:'unit',connector:'grove',rotation:[.1,.2,-.3]})),unit=new GroveModule({cableLength:80,terminalPlug:true});port.attach(unit);host.root.updateMatrixWorld(true);assert.ok(host.get('unit/terminal').module instanceof TerminalPlug);assert.equal(host.get('unit/cable').getState().wireCount,4);host.handle({type:'joint',target:'unit/terminal/screw-4',angleDeg:67});near(host.get('unit/terminal/screw-4').angleDeg,67,'Grove nested path reaches the actual fourth screw');host.handle({type:'detach',target:'unit/terminal'});assert.equal(unit.port('terminal').module,null);assert.ok(port.module===unit,'Selective accessory detach preserves the Unit and Grove cable');port.detach();
  return {status:'pass',sku:'U034',defaultTerminalPlug:false,defaultVisibleEnvelopeMm:baseBounds.getSize(new THREE.Vector3()).toArray(),plugVisibleEnvelopeMm:plugBounds.getSize(new THREE.Vector3()).toArray(),estimatedPlugBoundsMm:{min:plugBounds.min.toArray(),max:plugBounds.max.toArray()},pinPitchMm:3.96,pinOrder:spec.terminal.names,rays,screwPoses,clearance,scope:'Actual standalone / nested Module API and physical mesh checks only; accessory local dimensions inferred from official photographs, no RS485, UART, supply, wiring, thread pitch, clamp mechanics, firmware, hardware or browser proof'};
 }finally{for(const object of owned.reverse())object.dispose();}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkRs485Terminal(),null,2));
