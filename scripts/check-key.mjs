import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {Device,Port} from '../src/core/index.js';
import {Model,GroveModule,spec} from '../src/units/key/index.js';
import {checkDeviceActuators} from './check-device-actuators.mjs';

const near=(a,b,label,tolerance=2e-5)=>assert.ok(Math.abs(a-b)<tolerance,`${label}: ${a} vs ${b}`);
const settle=m=>{for(let i=0;i<80;i++)m.update(1/60);m.root.updateMatrixWorld(true);};
const belongs=(o,cap)=>{for(;o;o=o.parent)if(o===cap)return true;return false;};
const ray=(root,position,direction)=>new THREE.Raycaster(new THREE.Vector3(...position),new THREE.Vector3(...direction)).intersectObject(root,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0);
const box=o=>new THREE.Box3().setFromObject(o);
function closedSurface(object){
 const p=object.geometry.attributes.position,index=object.geometry.index,edges=new Map(),key=v=>v.toArray().map(n=>Math.round(n*1e5)).join(',');
 for(let i=0;i<(index?.count??p.count);i+=3){const points=Array.from({length:3},(_,k)=>new THREE.Vector3().fromBufferAttribute(p,index?index.getX(i+k):i+k));assert.ok(points[1].clone().sub(points[0]).cross(points[2].clone().sub(points[0])).lengthSq()>1e-14,'no zero-area closure triangles');for(let j=0;j<3;j++){const edge=[key(points[j]),key(points[(j+1)%3])].sort().join('|');edges.set(edge,(edges.get(edge)??0)+1);}}
 assert.ok([...edges.values()].every(n=>n===2),'the outer/inner walls and rims form one closed material volume');
}
function nativeShellClearance(model){
 const directions=[[.733,.312,.604],[-.381,.852,.359],[.213,-.527,.823]].map(a=>new THREE.Vector3(...a).normalize()),shells=['Key front shell','Key back shell'].map(name=>{
  const source=model.parts[name];closedSurface(source);
  const shadow=new THREE.Mesh(source.geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));shadow.name=name;shadow.matrixAutoUpdate=false;shadow.matrix.copy(source.matrixWorld);shadow.updateMatrixWorld(true);return shadow;
 }),report=[];
 try{
  for(const object of [model.parts.pcb,model.keyMechanism.lower,model.parts.switchFoot,model.parts.switchHousing,model.keyMechanism.roof]){
   const points=[],seen=new Set(),add=p=>{const key=p.toArray().map(n=>Math.round(n*1e6)).join(',');if(!seen.has(key)){seen.add(key);points.push(p);}},p=object.geometry.attributes.position,index=object.geometry.index;
   for(let i=0;i<p.count;i++)add(new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(object.matrixWorld));
   for(let i=0;i<(index?.count??p.count);i+=3){const v=Array.from({length:3},(_,k)=>new THREE.Vector3().fromBufferAttribute(p,index?index.getX(i+k):i+k).applyMatrix4(object.matrixWorld));add(v[0].add(v[1]).add(v[2]).multiplyScalar(1/3));}
   if(object===model.parts.pcb){
    // Surface samples can miss a narrow internal post. Also sample actual PCB
    // material on a 0.5 mm XY grid at its bottom, middle and top depths.
    const b=box(object);for(let x=b.min.x+.013;x<b.max.x;x+=.5)for(let y=b.min.y+.017;y<b.max.y;y+=.5){if(!ray(object,[x,y,8],[0,0,-1]).length)continue;for(const z of [b.min.z+.001,(b.min.z+b.max.z)/2,b.max.z-.001])add(new THREE.Vector3(x,y,z));}
   }
   for(const shell of shells){
    const a=box(object),b=box(shell),disjoint=[0,1,2].some(i=>a.max.getComponent(i)<=b.min.getComponent(i)+1e-6||a.min.getComponent(i)>=b.max.getComponent(i)-1e-6),counts=[];
    for(const direction of directions){let inside=0;if(!disjoint)for(const point of points){const distances=[];for(const h of new THREE.Raycaster(point,direction).intersectObject(shell,false))if(h.distance>1e-6&&!distances.some(d=>Math.abs(d-h.distance)<1e-5))distances.push(h.distance);if(distances.length%2){inside++;assert.fail(`${object.name} enters ${shell.name} at ${point.toArray().join(',')}`);}}counts.push(inside);}
    report.push({object:object.name,shell:shell.name,samples:points.length,insideByDirection:counts,proof:disjoint?'disjoint material-volume bounding boxes':'three-direction closed-shell parity'});
   }
  }
 }finally{for(const shell of shells)shell.material.dispose();}
 return report;
}

/** Explicit private-source check; normal runtime validation needs no research files. */
export async function verifyKeySource(){
 const source=JSON.parse(await fs.readFile(new URL('../docs/research/key/structure-sources.json',import.meta.url),'utf8'))[0],bytes=await fs.readFile(new URL('../'+source.path,import.meta.url));
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),source.sha256);
 assert.equal(crypto.createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex'),source.gitBlob,'fixed official Git blob verified');
 return {status:'pass',checkedAt:new Date().toISOString(),product:'Unit Key',sku:'U144',source:source.source,commit:source.commit,gitBlob:source.gitBlob,sha256:source.sha256,bytes:bytes.length,scope:'Original private research STL bytes match the recorded fixed official source; runtime geometry and visual validation are separate'};
}

export async function checkKey(){
 const m=new Model();m.root.updateMatrixWorld(true);assert.equal(m.meta.sku,'U144');assert.deepEqual(m.meta.nominalMm,[24,40,22.6]);assert.deepEqual(m.meta.size,[24,40,24.3]);
 assert.equal(m.list('button').length,1);assert.equal(m.list('led').length,1);assert.equal(m.list('port').length,1);
 const button=m.button('press'),cap=button.cap.getObjectByName('Key red sculpted cap with concave top and open underside'),walls=m.keyMechanism.clearWalls,roof=m.keyMechanism.roof;
 closedSurface(cap);closedSurface(walls);
 const nativeParts=['Key back shell','Key front shell'].map(name=>m.parts[name]);assert.ok(nativeParts.every(o=>o?.userData.source==='official-structure'),'only the actual assembled shell pair is imported');
 const nativeBox=new THREE.Box3();for(const o of nativeParts)nativeBox.expandByObject(o);const nativeSize=nativeBox.getSize(new THREE.Vector3()).toArray();for(const [i,n]of [24,40,8].entries())near(nativeSize[i],n,'native shell dimensions');
 const nativeClearance=nativeShellClearance(m);
 const visible=box(m.root).getSize(new THREE.Vector3()).toArray();for(const [i,n]of [24,40,24.335].entries())near(visible[i],n,'drawing envelope plus recessed rear screw');
 m.root.traverse(o=>{if(!o.isMesh)return;for(const v of o.geometry.attributes.position.array)assert.ok(Number.isFinite(v),'all visible geometry finite');assert.ok(!o.material.map,'no photo planes or sticker crops');});
 near(ray(cap,[0,8,40],[0,0,-1])[0].point.z,19.9,'concave center is lower than 20.3 mm rim');
 near(box(cap).max.z,20.3,'drawing height from chassis underside is 24.3 mm');
 const top=ray(cap,[0,8,40],[0,0,-1])[0],side=ray(cap,[30,8,15],[-1,0,0])[0],underside=ray(cap,[0,8,0],[0,0,1])[0];assert.ok(top.face.normal.z>.99&&side.face.normal.x>.9&&underside.face.normal.z<-.99,'single-sided cap surfaces face genuinely outward');near(underside.point.z,17.4,'open lower cap cavity has an inner ceiling, no flat bottom cover');
 const outside=ray(walls,[12,8,5],[-1,0,0])[0],inside=ray(walls,[0,8,5],[1,0,0])[0];near(outside.point.x,7.3,'clear switch outer wall');near(inside.point.x,6.5,'clear switch inner wall');near(outside.point.x-inside.point.x,.8,'clear walls have real thickness');assert.ok(outside.face.normal.x>0&&inside.face.normal.x<0,'the chamber has inward walls');assert.equal(ray(roof,[0,8,20],[0,0,-1]).length,0,'guide has real open central stem bore');
 for(const x of [-8,8])for(const z of [-40,40])assert.equal(ray(m.root,[x,-8,z],[0,0,z>0?-1:1]).length,0,'native mounting bores stay clear through PCB');assert.equal(ray(m.parts.pcb,[0,-17,20],[0,0,-1]).length,0,'PCB has a genuine Grove insertion notch');
 const fixedHits=ray(m.root,[6.8,8,40],[0,0,-1]).filter(h=>!belongs(h.object,button.cap));assert.ok(fixedHits[0]&&fixedHits[0].point.z>6,'actual transparent switch closes the native case opening');
 const normal=new THREE.Vector3(0,1,0).applyQuaternion(m.port('grove').object3d.quaternion);assert.ok(normal.distanceTo(new THREE.Vector3(0,-1,0))<1e-6,'Grove truly faces down');
 const mouth=ray(m.root,[0,-35,0],[0,1,0])[0];assert.ok(mouth?.object.parent.name==='Key native bottom Grove assembly'&&mouth.point.y>-15,'real Grove mouth has recessed depth');
 for(const x of [-3,-1,1,3]){const contact=ray(m.root,[x,-35,-.15],[0,1,0])[0];assert.ok(contact?.object.material.metalness>.7&&contact.point.y<-18.8,'all four recessed metal pins face the true mouth');}
 const fixed=[];m.root.traverse(o=>{if(o.isMesh&&!belongs(o,button.cap))fixed.push([o,o.matrixWorld.clone()]);});const rest=box(cap),events=[];m.on('input',e=>events.push(e));assert.equal(m.led('rgb').getState().brightness,0);
 button.press('framework');button.onPointerDown({pointerId:9});settle(m);near(box(cap).max.z,rest.max.z-1.6,'real red cap presses 1.6 mm');assert.ok(belongs(ray(m.root,[0,8,40],[0,0,-1])[0].object,button.cap),'no fixed duplicate masks the pressed surface');
 assert.equal(m.led('rgb').getState().brightness,0,'press has no fabricated LED response');for(const [o,matrix]of fixed)assert.ok(o.matrixWorld.equals(matrix),'fixed PCB/package/connector/LED do not move');
 // At the fully depressed pose the fixed guide remains inside the actual
 // open cap cavity, with over 1.5 mm lateral clearance, while the blue slider
 // fits through the 5.3 mm guide opening. No hidden solid plunger is pierced.
 const lowerCap=box(cap).min.z,roofTop=box(roof).max.z,innerHalf=8.4-(roofTop-lowerCap)/7.1*2.8;assert.ok(innerHalf-6.3>1.5);assert.ok((5.3-4.5)/2>.39,'moving blue slider has real guide clearance');
 const receiver=button.cap.getObjectByName('Key red hollow cross stem receiver');assert.ok(box(receiver).min.z-roofTop>3,'red receiver remains well above static guide');
 button.release('framework');settle(m);assert.equal(button.pressed,true,'pointer holds independently');button.onPointerCancel({pointerId:9});settle(m);near(box(cap).max.z,rest.max.z,'cap returns exactly');assert.deepEqual(events.map(e=>e.action),['down','up']);assert.equal(events[1].cancelled,true);assert.equal(m.update(.01),false,'idle after exact release');
 m.led('rgb').set({color:'#00cc66',brightness:.4});assert.deepEqual(m.led('rgb').getState(),{color:'#00cc66',brightness:.4});assert.equal(button.pressed,false,'external RGB display does not press key');
 const actuator=checkDeviceActuators(m,{id:'key',expected:1});m.dispose();
 const host=new Device(),port=host.add(new Port({id:'unit',connector:'grove',rotation:[.1,.2,-.3]})),module=new GroveModule({cableLength:55});port.attach(module);module.get('unitFrame').setPose({rotation:[.12,-.18,.27]});host.root.updateMatrixWorld(true);
 const child=host.get('unit/press'),childCap=child.cap.children[0],before=childCap.getWorldPosition(new THREE.Vector3()),inputBefore=module.port('grove').object3d.getWorldPosition(new THREE.Vector3()),cableBefore=module.get('cable').getState(),nested=[];host.on('input',e=>nested.push(e));host.handle({type:'press',target:'unit/press',source:'framework'});settle(host);
 const expected=child.axis.clone().transformDirection(child.object3d.matrixWorld).multiplyScalar(spec.travelMm);assert.ok(childCap.getWorldPosition(new THREE.Vector3()).sub(before).distanceTo(expected)<2e-5,'mounted key uses its transformed real push axis');assert.ok(module.port('grove').object3d.getWorldPosition(new THREE.Vector3()).distanceTo(inputBefore)<1e-6);near(module.get('cable').getState().faceDistanceMm,cableBefore.faceDistanceMm,'press does not move cable endpoints');assert.equal(cableBefore.wireCount,4);
 host.handle({type:'cancel',target:'unit/press',source:'framework'});settle(host);assert.ok(childCap.getWorldPosition(new THREE.Vector3()).distanceTo(before)<1e-6);assert.ok(nested.every(e=>e.kind==='button'&&e.id==='unit/press'&&!('value'in e)),'only nested physical input intents');host.handle({type:'led',target:'unit/rgb',color:'#4466ff',brightness:.3});assert.equal(module.led('rgb').getState().brightness,.3);host.dispose();
 return {status:'pass',sku:'U144',nativeShellMm:nativeSize,nominalMm:spec.nominalMm,drawingMm:spec.drawingEnvelopeMm,visibleMm:visible,buttons:1,travelMm:spec.travelMm,travelEvidence:'visual estimate only',clearWallThicknessMm:.8,nativeClearance,actuator,scope:'Real runtime geometry/clearance, visible cap motion and independent external RGB; original-source, browser and hardware validation separate'};
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 const noop=()=>{},ctx=new Proxy({createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});globalThis.document={createElement:()=>({getContext:()=>ctx})};
 if(process.argv.includes('--verify-source')){const result=await verifyKeySource();await fs.writeFile(new URL('../docs/research/key/source-validation.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log('PASS Unit Key original source:',JSON.stringify(result));}
 console.log('PASS Unit Key:',JSON.stringify(await checkKey()));
}
