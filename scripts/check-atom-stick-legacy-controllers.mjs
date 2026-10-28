/** MIT. Actual own-product geometry/output/connection regressions for original K016 and K027. CPU evidence only. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import * as T from 'three';
import {Model as M5Stick,configurations as stickCases} from '../src/devices/m5stick/index.js';
import {Model as StickV,configurations as vCases} from '../src/devices/stickv/index.js';
import {GroveModule as ButtonUnit} from '../src/units/button/index.js';
const hash=a=>createHash('sha256').update(Buffer.from(a.buffer,a.byteOffset,a.byteLength)).digest('hex');
const settle=m=>{for(let i=0;i<100;i++)m.update(.02);m.root.updateMatrixWorld(true);};
const under=(o,p)=>{for(;o;o=o.parent)if(o===p)return true;return false;};
function objects(m){const a=[];m.root.traverse(o=>{if(o.isMesh&&o.userData.role!=='printed-artwork'&&[].concat(o.material).some(v=>v.opacity!==0))a.push(o);});return a;}
const snap=o=>({attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,a])=>[k,hash(a.array)])),index:o.geometry.index?hash(o.geometry.index.array):null,world:o.matrixWorld.toArray()});
const shape=o=>JSON.stringify({a:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,a])=>[k,hash(a.array)])),i:o.geometry.index?hash(o.geometry.index.array):null});
const ray=(m,p,d)=>new T.Raycaster(new T.Vector3(...p),new T.Vector3(...d)).intersectObjects(objects(m),false)[0];
function testOne(Model,options){
 const m=new Model(options),peer=new Model(options),naked=new Model({...options,artwork:false});m.root;peer.root;naked.root;m.root.updateMatrixWorld(true);naked.root.updateMatrixWorld(true);
 const events=[],off=m.on('input',e=>events.push(e));let rays=0;
 try{
  assert.deepEqual(objects(m).map(o=>({name:o.name,...snap(o)})),objects(naked).map(o=>({name:o.name,...snap(o)})),'ink switch preserves all actual physical geometry');
  for(const o of objects(m)){for(const a of Object.values(o.geometry.attributes))for(const v of a.array)assert.ok(Number.isFinite(v),o.name+' finite vertices');assert.ok([].concat(o.material).every(v=>v.side===T.FrontSide),o.name+' does not mask missing walls');}
  const [W,H]=m.meta.size;
  for(let x=-W/2+3;x<W/2-2;x+=2)for(let y=-H/2+3;y<H/2-2;y+=2){
   const f=ray(m,[x,y,35],[0,0,-1]),b=ray(m,[x,y,-35],[0,0,1]);assert.ok(f&&f.point.z>4,'complete front closure');assert.ok(b&&b.point.z<0,'complete rear closure');rays+=2;
  }
  const solids=objects(m);
  for(const button of m.list('button')){
   settle(m);const active=solids.filter(o=>under(o,button.cap)),fixed=solids.filter(o=>!under(o,button.cap)),rest=new Map(active.map(o=>[o,{...snap(o),vertices:o.geometry.attributes.position.array.slice()}])),fixedRest=new Map(fixed.map(o=>[o,snap(o)]));assert.ok(active.length);
   const before=events.length;button.press('pointer');button.press('external');m.update(.008);m.root.updateMatrixWorld(true);const partial=button.getActuationState().depthMm;assert.ok(partial>0&&partial<button.travel);
   const axis=button.axis.clone().transformDirection(button.object3d.matrixWorld);
   const flex=button.meta.visualMotion==='flex-pad';
   const check=d=>{for(const[o,s]of rest){const current=snap(o);assert.equal(current.index,s.index);if(!flex||d===0)assert.deepEqual(current.attributes,s.attributes);for(let k=0;k<16;k++)assert.ok(Math.abs(o.matrixWorld.elements[k]-s.world[k]-(k>=12&&k<=14?axis.getComponent(k-12)*d:0))<1e-7,'whole physical cap transform follows depth');
    if(flex){const matrix=new T.Matrix4().fromArray(s.world),p=o.geometry.attributes.position;for(let i=0;i<p.count;i++){const before=new T.Vector3(...s.vertices.slice(i*3,i*3+3)).applyMatrix4(matrix),actual=new T.Vector3().fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld),t=Math.max(0,Math.min(1,(before.y-button.hingeY)/(button.freeY-button.hingeY))),weight=t*t*(3-t)/2;assert.ok(actual.sub(before).distanceTo(axis.clone().multiplyScalar(d*weight))<5e-6,'continuous U-tab inner/outer vertices share bending depth');}}
   }for(const[o,s]of fixedRest)assert.deepEqual(snap(o),s,'all fixed walls/inserts remain fixed');};
   check(partial);button.cancel('pointer');assert.ok(button.pressed);settle(m);check(button.travel);button.release('external');settle(m);check(0);assert.deepEqual(events.slice(before).map(e=>e.action),['down','up']);assert.ok(events.at(-1).cancelled);
   const pos=button.meta.surfaceCenter,face=button.meta.surfaceFace,out=new T.Vector3(0,0,1).applyQuaternion(button.object3d.quaternion),origin=new T.Vector3(...pos).addScaledVector(out,10);const hits=new T.Raycaster(origin,out.clone().negate()).intersectObjects(solids,false);assert.ok(hits[0]&&under(hits[0].object,button.cap),'actual cap is first visible surface');rays++;
  }
  if(m.meta.sku==='K016'){assert.ok(m.button('a').meta.surfaceCenter[1]>0,'own M5Stick A key sits under OLED end');assert.deepEqual(m.port('grove').pins.map(p=>p.name),['GND','5V','G32','G33']);}
  if(m.meta.sku==='K027'){
   assert.deepEqual(m.port('grove').pins.map(p=>[p.n,p.name]),[[1,'GND'],[2,'VOUT'],[3,'G35'],[4,'G34']],'own official StickV pinmap yellow35/white34');
   const center=ray(m,[0,-40,7.2],[0,1,0]),wall=ray(m,[1.6,-40,7.2],[0,1,0]);assert.equal(center.object,m.stickVAssembly.m3Floor);assert.ok(center.point.y>-21&&center.point.y<-19);assert.ok(wall.object.name.includes('brass insert'));rays+=2;
   const lens=m.led('rgbw').object3d;let rectangular=false;lens.traverse(o=>{if(o.geometry?.type==='BoxGeometry'&&o.geometry.parameters.width>2*o.geometry.parameters.height)rectangular=true;});assert.ok(rectangular,'own rear RGBW optic is a transverse rectangular window');
   assert.equal(m.button('a').meta.visualMotion,'flex-pad');assert.equal(ray(m,[0,-19.425,30],[0,0,-1]).object,m.stickVAssembly.hinge,'fixed lower bridge closes the fourth side of the real U-slot');rays++;
  }
  const d=m.display('lcd'),p=peer.display('lcd'),old=hash(p.buffer),count=events.length;assert.equal(d.touchEnabled,false);m.handle({type:'display',target:'lcd',fill:'#2b68a4'});assert.deepEqual([...d.buffer.slice(0,4)],[43,104,164,255]);assert.equal(hash(p.buffer),old);assert.equal(events.length,count,'external framebuffer does not create input');
  const led=m.list('led')[0];assert.ok(led);led.set({color:'#22bb66',brightness:.5});assert.equal(events.length,count,'external visible light does not create input');
  const unit=new ButtonUnit({cableLength:55});m.port('grove').attach(unit);unit.button('press').press('test');unit.button('press').release('test');assert.ok(events.some(e=>e.id==='grove/press'&&e.action==='down'));m.root.position.set(4,8,-2);m.root.rotation.set(.2,.1,-.15);m.update(.02);unit.cable.sync();assert.equal(unit.cable.getState().wireCount,4);assert.equal(unit.cable.getState().plugCount,2);m.port('grove').detach();
  const g=m.port('grove').object3d;assert.ok(g);const bound=new T.Box3().setFromObject(m.body);assert.ok(bound.max.z>5&&bound.min.z<-5);
  return {options,buttons:m.list('button').map(b=>b.id),display:[d.width,d.height],leds:m.list('led').map(l=>l.id),physicalMeshes:solids.length,frontRearAndActuatorFirstHitRays:rays,partialFullWholeCaps:true,fixedPhysicalStable:true,multiSourceCancelNoClick:true,externalOutputNoEcho:true,peerIsolation:true,inkOnlySwitch:true,realGroveConnectionAndFourWires:true};
 }finally{off();m.dispose();peer.dispose();naked.dispose();}
}
function withCanvas(fn){const previous=globalThis.document,noop=()=>{},ctx=new Proxy({createRadialGradient:()=>({addColorStop:noop}),measureText:()=>({width:20})},{get:(o,k)=>o[k]??noop});if(!previous)globalThis.document={createElement:()=>({getContext:()=>ctx})};try{return fn();}finally{if(!previous)delete globalThis.document;}}
export async function checkM5StickController(){return withCanvas(()=>{const cases=stickCases.map(c=>testOne(M5Stick,c.options));assert.throws(()=>new M5Stick({version:'fictional'}).root,RangeError);return{status:'pass',id:'m5stick',cases,scope:'Own-photo original reconstruction;CPU geometry/dynamics/output/connection evidence,no manufacture or hardware/firmware test'};});}
export async function checkStickVController(){return withCanvas(()=>{const cases=vCases.map(c=>testOne(StickV,c.options));assert.throws(()=>new StickV({pcb:'fictional'}).root,RangeError);return{status:'pass',id:'stickv',cases,scope:'Own K210 product reconstruction;passive camera/audio/SD only,no fabricated camera frame or sensor/audio/firmware emulation'};});}
