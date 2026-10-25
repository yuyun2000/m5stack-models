import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const near=(a,b,why)=>assert.ok(Math.abs(a-b)<2e-5,`${why}: ${a} vs ${b}`);
const snapshot=model=>{model.root.updateMatrixWorld(true);const rows=[];model.root.traverse(o=>{if(o.isMesh)rows.push({o,vertices:o.geometry.attributes.position.array.slice(),matrix:o.matrixWorld.clone()});});return rows;};
const unchanged=(rows,why)=>{for(const {o,vertices,matrix}of rows){assert.deepEqual(o.geometry.attributes.position.array,vertices,why);assert.ok(o.matrixWorld.equals(matrix),why);}};
const physicalHit=(model,x,y)=>new THREE.Raycaster(new THREE.Vector3(x,y,12),new THREE.Vector3(0,0,-1)).intersectObject(model.root,true).find(h=>h.object.isMesh&&h.object.material?.opacity!==0);

export async function checkHeartOptics(){
 const previousDocument=globalThis.document;
 if(!previousDocument){const noop=()=>{},ctx=new Proxy({measureText:()=>({width:20}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});globalThis.document={createElement:()=>({getContext:()=>ctx})};}
 const models=[],resources=new Map();let apertureRays=0,emitterRays=0,sourceClearanceSamples=0,nestedCommands=0;
 try{
  const model=await loadModel('heart'),peer=await loadModel('heart');models.push(model,peer);model.root.updateMatrixWorld(true);
  const a=model.heartOpticalAssembly,led=model.led('red-led'),source=model.parts.housing,geometry=snapshot(model),events=[];model.on('input',e=>events.push(e));
  assert.deepEqual(model.list('led').map(l=>l.id),['red-led'],'One physical visible red aperture; no invented human-visible IR or detector LED');
  assert.equal(source.geometry.index.count/3,3216,'Retain the original selected source housing');
  const box=new THREE.Box3().setFromObject(a.body),size=box.getSize(new THREE.Vector3());near(size.x,2.8,'Original MAX30100 nominal package width');near(size.y,5.6,'Original MAX30100 nominal package length');
  near(a.detector.position.y,1.70,'Original top-view SENSOR centre offset');near(led.object3d.position.y-a.group.position.y,-1.96,'Original top-view LED centre offset');
  near(a.detector.getWorldPosition(new THREE.Vector3()).y-led.object3d.getWorldPosition(new THREE.Vector3()).y,3.66,'Original aperture centre separation');
  const centreSize=new THREE.Box3().setFromObject(a.centre).getSize(new THREE.Vector3());near(centreSize.x,2.14,'Original central feature width');near(centreSize.y,1.19,'Original central feature length');near(a.centre.position.y,-.51,'Original central feature offset');
  near(led.object3d.position.y,6.040472784,'Emitter end toward Grove, mapped to unchanged CAD slot centre');
  assert.equal(led.meta.colorMode,'fixed-red');assert.equal(led.brightness,0);assert.equal(led.glow.visible,false);assert.equal(led.lensMaterial.emissive.getHex(),0);
  assert.ok(led.glow.isMesh&&!led.glow.isSprite,'Recessed emitter glow stays in its physical aperture plane');assert.equal(led.glow.material.depthTest,true);assert.equal(led.glow.material.side,THREE.FrontSide);
  const glowBox=new THREE.Box3().setFromObject(led.glow);near(glowBox.min.z,3.962,'Fixed glow plane stays behind the original z4 shell face');near(glowBox.max.z,3.962,'Glow cannot billboard toward the camera above its shell');
  assert.ok(led.lensMaterial!==a.detector.material&&led.lensMaterial!==peer.led('red-led').lensMaterial,'Emitter, passive detector and instances own distinct materials');
  for(const m of [model,peer])for(const resource of [m.led('red-led').lens.geometry,m.led('red-led').lensMaterial,m.led('red-led').glow.geometry,m.led('red-led').glow.material]){resources.set(resource,0);resource.addEventListener('dispose',()=>resources.set(resource,resources.get(resource)+1));}
  // Central package rays avoid the actual 0.05 mm housing/package assembly
  // clearance. Every aperture interior ray reaches a physical package/lens.
  for(const dx of [-1.3,-1,0,1,1.3])for(const y of [5.3,6,6.5,7,8,9,10,10.7]){
   const hit=physicalHit(model,a.group.position.x+dx,y);assert.ok(hit&&hit.object!==source&&hit.point.z>3.6,'The original front aperture is backed by a complete optical package');apertureRays++;
  }
  for(const dx of [-.3,0,.3])for(const dy of [-.3,0,.3]){const hit=physicalHit(model,led.object3d.position.x+dx,led.object3d.position.y+dy);assert.ok(hit?.object===led.lens,'Actual red-emitter lens is visible through its original aperture');emitterRays++;}
  assert.ok(physicalHit(model,a.group.position.x,a.group.position.y+1.70)?.object===a.detector,'The opposite circular aperture remains a passive detector');
  assert.ok(physicalHit(model,1.6,8)?.object===source,'The original shell still occludes outside the slot');
  // Three-direction parity checks only sampled physical added surfaces, not
  // sprite bounds. This is finite overlap evidence, not manufacturing fit.
  const side=source.material.side;source.material.side=THREE.DoubleSide;
  try{
   const directions=[[.173,.389,.905],[-.411,.803,.431],[.713,-.283,.641]].map(v=>new THREE.Vector3(...v).normalize());
   const inside=(point,direction)=>{let count=0,last=-Infinity;for(const h of new THREE.Raycaster(point,direction,1e-5).intersectObject(source)){if(h.distance-last>1e-4){count++;last=h.distance;}}return count%2===1;};
   for(const object of [a.body,a.centre,a.rim,a.detector,a.foot,led.lens]){
    const p=object.geometry.attributes.position,stride=Math.max(1,Math.floor(p.count/100));
    for(let i=0;i<p.count;i+=stride){const point=object.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i));for(const direction of directions){assert.equal(inside(point,direction),false,`Optical surface cannot enter original housing: ${object.name}`);sourceClearanceSamples++;}}
   }
  }finally{source.material.side=side;}
  const detectorEmission=a.detector.material.emissive.toArray();
  for(const value of [true,'#00ff00',0x0000ff,{color:'#00ff00',brightness:.35},{brightness:4},{brightness:-2},false]){
   led.set(value);assert.equal(led.getState().color,'#ff2820','Visible MAX30100 emitter retains its physical red color');assert.ok(led.brightness>=0&&led.brightness<=1);assert.deepEqual(a.detector.material.emissive.toArray(),detectorEmission);assert.equal(peer.led('red-led').brightness,0,'One Unit does not light another');
  }
  model.handle({type:'led',target:'red-led',brightness:.6});assert.equal(led.brightness,.6);assert.ok(led.lensMaterial.emissive.r>0&&led.glow.visible);assert.equal(events.length,0,'External illumination emits no sensor/input events');
  assert.equal(model.update(1),false,'No autonomous heartbeat or measurement animation');model.root.updateMatrixWorld(true);unchanged(geometry,'LED commands retain every physical vertex and assembly frame');
  model.handle({type:'led',target:'red-led',on:false});assert.equal(led.brightness,0);assert.equal(led.lensMaterial.emissive.getHex(),0);assert.equal(led.glow.visible,false);
  const host=await loadModel('sticks3'),hub=await loadGroveModule('hub'),heart=await loadGroveModule('heart');models.push(host);host.port('grove').attach(hub);hub.port('grove-1').attach(heart);
  const path='grove/grove-1/red-led';assert.ok(host.find(path,'led')===heart.led('red-led'),'Nested Grove path reaches the real emitter');
  heart.get('unitFrame').setPose({rotation:[.2,-.3,.4]});host.root.updateMatrixWorld(true);const portFrame=heart.port('grove').object3d.matrixWorld.clone();
  host.handle({type:'led',target:path,color:'#00ff00',brightness:.45});assert.deepEqual(heart.led('red-led').getState(),{color:'#ff2820',brightness:.45});nestedCommands++;
  host.root.updateMatrixWorld(true);assert.ok(heart.port('grove').object3d.matrixWorld.equals(portFrame),'Light output cannot move a real cable socket');host.handle({type:'led',target:path,on:false});nestedCommands++;
  host.handle({type:'detach',target:'grove/grove-1'});assert.equal(host.find(path,'led'),null);assert.ok(host.port('grove').module===hub,'Selective detach retains the host and HUB');
  return {status:'pass',apertureRays,emitterRays,sourceClearanceSamples,nestedCommands,defaultOff:true,exactPhysicalGeometry:true,colorMode:'fixed-red',scope:'Real U029 optical package, original slot visibility/finite source clearance, external red-only output and nested Grove path. Installed Z/profile/material and brightness remain visual inferences; no measurement, human-visible IR, physical optical or manufacturing proof.'};
 }finally{for(const m of models.reverse())m.dispose();if(!previousDocument)delete globalThis.document;assert.ok([...resources.values()].every(n=>n===1),'Every owned emitter geometry and lens/glow material is disposed exactly once');}
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log('PASS Heart optics:',JSON.stringify(await checkHeartOptics()));
