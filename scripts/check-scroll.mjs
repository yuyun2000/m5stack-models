import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {Device,Port} from '../src/core/index.js';
import {Model,GroveModule,spec} from '../src/units/scroll/index.js';
const settle=m=>{for(let i=0;i<80;i++)m.update(1/60);m.root.updateMatrixWorld(true);};
const near=(a,b,label)=>assert.ok(Math.abs(a-b)<2e-5,`${label}: ${a} / ${b}`);
const ray=(o,p,d)=>new THREE.Raycaster(new THREE.Vector3(...p),new THREE.Vector3(...d)).intersectObject(o,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0);
const belongs=(o,root)=>{for(;o;o=o.parent)if(o===root)return true;return false;};
function boardClearance(m){
 const pcb=m.parts.pcb,source=['Scroll back shell','Scroll front shell'].map(name=>{const mesh=new THREE.Mesh(m.parts[name].geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));mesh.name=name;mesh.updateMatrixWorld(true);return mesh;});
 const b=new THREE.Box3().setFromObject(pcb),directions=[[.733,.312,.604],[-.381,.852,.359]].map(a=>new THREE.Vector3(...a).normalize());let samples=0;
 try{for(let x=b.min.x+.03;x<b.max.x;x+=.65)for(let y=b.min.y+.07;y<b.max.y;y+=.65){if(!ray(pcb,[x,y,20],[0,0,-1]).length)continue;
  for(const z of [b.min.z+.001,(b.min.z+b.max.z)/2,b.max.z-.001])for(const shell of source)for(const direction of directions){const points=[];for(const hit of new THREE.Raycaster(new THREE.Vector3(x,y,z),direction).intersectObject(shell,false))if(hit.distance>1e-6&&!points.some(d=>Math.abs(d-hit.distance)<1e-5))points.push(hit.distance);assert.equal(points.length%2,0,`PCB inside ${shell.name} at ${x},${y},${z}`);samples++;}
 }}finally{source.forEach(mesh=>mesh.material.dispose());}return samples;
}
function actuatorClearance(m){
 const {wheel,support,joint,press}=m.scrollMechanism,targets=['Scroll back shell','Scroll front shell'].map(name=>{const mesh=new THREE.Mesh(m.parts[name].geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));mesh.updateMatrixWorld(true);mesh.geometry.computeBoundingBox();return mesh;}),direction=new THREE.Vector3(.733,.312,.604).normalize();let samples=0;
 const points=[wheel,support].map(mesh=>{const unique=new Map(),p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){const point=new THREE.Vector3().fromBufferAttribute(p,i);unique.set(point.toArray().map(n=>Math.round(n*1e5)).join(','),point);}return {mesh,points:[...unique.values()]};});
 try{for(const angle of [0,30,60,90,180,270])for(const down of [false,true]){
  joint.set({angleDeg:angle});if(down)press.press('clearance');else press.cancel('clearance');settle(m);
  for(const {mesh,points:vertices}of points)for(const local of vertices)for(const target of targets){const point=mesh.localToWorld(local.clone());samples++;if(!target.geometry.boundingBox.containsPoint(point))continue;const distances=[];for(const hit of new THREE.Raycaster(point,direction).intersectObject(target,false))if(hit.distance>1e-6&&!distances.some(d=>Math.abs(d-hit.distance)<1e-5))distances.push(hit.distance);assert.equal(distances.length%2,0,`moving ${mesh.name} enters source shell at ${point.toArray()}`);}
 }}finally{press.cancel('clearance');joint.set({angleDeg:0});settle(m);targets.forEach(mesh=>mesh.material.dispose());}return {poses:12,vertexContainmentSamples:samples,scope:'Source wheel/axle insert versus original shell at sampled angles and rest/full visual press; no continuous or physical support-mechanism proof'};
}
export async function verifyScrollSource(){
 const source=JSON.parse(await fs.readFile(new URL('../docs/research/scroll/structure-sources.json',import.meta.url)))[0],bytes=await fs.readFile(new URL('../'+source.path,import.meta.url));
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),source.sha256);assert.equal(crypto.createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex'),source.gitBlob);
 return {status:'pass',source:source.source,gitBlob:source.gitBlob,sha256:source.sha256,scope:'Original private STL bytes only; default runtime check needs no source binary'};
}
export async function checkScroll(){
 const m=new Model();m.root.updateMatrixWorld(true);const {wheel,support,joint,press,led}=m.scrollMechanism;
 assert.equal(m.meta.sku,'U186');assert.deepEqual(m.meta.size,[24,32,18.9]);assert.equal(m.list('button').length,1);assert.equal(m.list('joint').length,1);assert.equal(m.list('led').length,1);
 const cadBox=new THREE.Box3();for(const [name,mesh]of Object.entries(m.parts))if(mesh.userData.source==='official-structure')cadBox.expandByObject(mesh);[24,32,18.9].forEach((n,i)=>near(cadBox.getSize(new THREE.Vector3()).getComponent(i),n,'official assembled envelope'));
 const sampledPcbContainment=boardClearance(m);
 const actuatorShellClearance=actuatorClearance(m);
 for(const x of [-8,8])for(const offset of [[0,0],[1.5,0],[-1.5,0],[0,1.5],[0,-1.5]])assert.equal(ray(m.root,[x+offset[0],-4+offset[1],40],[0,0,-1]).length,0,'native mounting bores stay clear through board');
 for(const x of [-3,-1,1,3])assert.ok(ray(m.root,[x,-13.5,25],[0,0,-1])[0]?.object.material.metalness>.7,'open upper Grove face exposes all four real pins instead of a flat roof');
 const first=ray(m.root,[0,6.4,40],[0,0,-1])[0];assert.ok(first&&belongs(first.object,press.cap),'native wheel is the visible moving surface');
 const fixed=[];m.root.traverse(o=>{if(o.isMesh&&!belongs(o,press.cap))fixed.push([o,o.matrixWorld.clone()]);if(o.isMesh)assert.ok(!o.material?.map,'stickers remain deferred');});
 const point=new THREE.Vector3().fromBufferAttribute(wheel.geometry.attributes.position,0),neutral=wheel.localToWorld(point.clone()),events=[];m.on('input',event=>events.push(event));
 joint.set({angleDeg:90});m.root.updateMatrixWorld(true);const pivot=new THREE.Vector3(...spec.wheelCenter),expected=neutral.clone().sub(pivot).applyAxisAngle(new THREE.Vector3(1,0,0),Math.PI/2).add(pivot);assert.ok(wheel.localToWorld(point.clone()).distanceTo(expected)<2e-5,'actual CAD wheel vertices rotate on original transverse shaft');
 const rotated=wheel.localToWorld(point.clone()),supportAtRest=support.getWorldPosition(new THREE.Vector3());press.press('framework');press.press('pointer-test');settle(m);assert.ok(wheel.localToWorld(point.clone()).sub(rotated).distanceTo(new THREE.Vector3(0,0,-spec.travelMm))<2e-5,'wheel press stays on the body axis at any rotary angle');assert.ok(support.getWorldPosition(new THREE.Vector3()).sub(supportAtRest).distanceTo(new THREE.Vector3(0,0,-spec.travelMm))<2e-5,'source axle insert retains its fit with the wheel during the approximate press');
 assert.equal(led.getState().brightness,0,'press does not fabricate RGB response');for(const[o,matrix]of fixed)assert.ok(o.matrixWorld.equals(matrix),'shells, board and light pipe remain fixed');
 press.release('framework');assert.equal(press.pressed,true);press.cancel('pointer-test');settle(m);assert.ok(wheel.localToWorld(point.clone()).distanceTo(rotated)<2e-5);assert.deepEqual(events.map(e=>e.action),['down','up']);assert.equal(events[1].cancelled,true);
 led.set({color:'#33bb77',brightness:.45});assert.equal(press.pressed,false);assert.equal(joint.angleDeg,90);joint.set({rpm:60});m.update(.1);near(joint.angleDeg,126,'single visual update');joint.set({angleDeg:0});settle(m);assert.ok(wheel.localToWorld(point.clone()).distanceTo(neutral)<2e-5,'original vertices restore exactly');
 assert.equal(m.update(.01),false);m.dispose();
 const host=new Device(),port=host.add(new Port({id:'grove',connector:'grove',rotation:[.2,.3,-.4]})),unit=new GroveModule({cableLength:60});port.attach(unit);unit.get('unitFrame').setPose({position:[15,80,2],rotation:[.1,-.2,.4]});host.root.updateMatrixWorld(true);
 const source=unit.port('grove').object3d.getWorldPosition(new THREE.Vector3()),cable=unit.get('cable').getState(),before=unit.scrollMechanism.wheel.getWorldPosition(new THREE.Vector3()),nested=[];host.on('input',e=>nested.push(e));host.handle({type:'press',target:'grove/press',source:'external'});settle(host);
 const axis=new THREE.Vector3(0,0,-1).transformDirection(unit.button('press').object3d.matrixWorld);assert.ok(unit.scrollMechanism.wheel.getWorldPosition(new THREE.Vector3()).sub(before).distanceTo(axis.multiplyScalar(spec.travelMm))<2e-5,'nested pose uses transformed press axis');
 assert.ok(unit.port('grove').object3d.getWorldPosition(new THREE.Vector3()).distanceTo(source)<1e-6);near(unit.get('cable').getState().faceDistanceMm,cable.faceDistanceMm,'press leaves actual cable mating planes fixed');host.handle({type:'cancel',target:'grove/press',source:'external'});settle(host);assert.ok(nested.every(e=>e.id==='grove/press'&&e.kind==='button'));host.handle({type:'joint',target:'grove/rotation',rpm:60});host.update(.1);near(unit.get('rotation').angleDeg,36,'nested joint external rpm');host.dispose();
 return {status:'pass',sku:'U186',nativeParts:5,nominalMm:spec.nominalMm,pressTravelMm:spec.travelMm,pressEvidence:'paired wheel/axle-insert appearance estimate; actual hidden support mechanism unconfirmed',sampledPcbContainment,actuatorShellClearance,axis:[1,0,0],scope:'Original assembled wheel/shell geometry, real vertex motion/return, PCB containment, physical holes, nested cable and independent RGB; no encoder/bus/firmware/physics or manufacturing fit'};
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 const noop=()=>{},ctx=new Proxy({createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});globalThis.document={createElement:()=>({getContext:()=>ctx})};
 if(process.argv.includes('--verify-source'))console.log('PASS Scroll source:',JSON.stringify(await verifyScrollSource()));console.log('PASS Scroll:',JSON.stringify(await checkScroll()));
}
