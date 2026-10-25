import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {Device,Port} from '../src/core/index.js';
import {Model,GroveModule} from '../src/units/encoder/index.js';
import data from '../src/units/encoder/geometry-data.js';

const v=a=>new THREE.Vector3(...a),near=(a,b,label,eps=2e-5)=>assert.ok(Math.abs(a-b)<eps,label);
const tick=model=>{for(let i=0;i<120;i++)if(!model.update(1/60))return;assert.fail('Encoder motion did not settle');};
const decode=(s,Type)=>new Type(Uint8Array.from(atob(s),c=>c.charCodeAt(0)).buffer);

export async function checkEncoderAssembly(){
 const prior=globalThis.document;
 if(!prior){const noop=()=>{},ctx=new Proxy({createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});globalThis.document={createElement:()=>({getContext:()=>ctx})};}
 // Track the product's physical frame. Existing generic cable plugs own their
 // shared resources separately and are covered by the cable lifecycle checker.
 const owners=[],resources=new Map(),track=model=>(model.unitFrame?.object3d??model.root).traverse(o=>{if(!o.isMesh)return;for(const resource of [o.geometry,...(Array.isArray(o.material)?o.material:[o.material])])if(!resources.has(resource)){resources.set(resource,0);resource.addEventListener('dispose',()=>resources.set(resource,resources.get(resource)+1));}});
 let rays=0,materialSamples=0,motionCases=0,failure;
 try{
  const model=new Model(),peer=new Model();owners.push(model,peer);model.root.updateMatrixWorld(true);peer.root.updateMatrixWorld(true);track(model);track(peer);
  for(const part of data){const live=model.parts[part.name];assert.deepEqual(live.geometry.attributes.position.array,decode(part.position,Float32Array),'Original native positions retained');assert.deepEqual(live.geometry.index.array,decode(part.index,Uint32Array),'Original native topology retained');}
  const a=model.encoderAssembly,axis=a.rotation.object3d.position;
  near(axis.x,-.0130000268,'Rotation X matches native collar circle');near(axis.y,7.9499998353,'Rotation Y matches native collar circle');
  const inverse=a.cap.matrixWorld.clone().invert();let radius=0;
  a.cap.traverse(o=>{if(!o.isMesh)return;const matrix=inverse.clone().multiply(o.matrixWorld),p=o.geometry.attributes.position;for(let i=0;i<p.count;i++){const q=new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(matrix);assert.ok(q.toArray().every(Number.isFinite));radius=Math.max(radius,Math.hypot(q.x,q.y));}});
  assert.ok(radius<=5.00002&&radius>4.999,'Actual moving cap respects official Ø10, including ribs');
  const cap=a.cap.getObjectByName('Encoder black cap with blind shaft bore'),p=cap.geometry.attributes.position,n=cap.geometry.attributes.normal;let outward=0;
  const index=cap.geometry.index;for(let i=0;i<index.count;i+=3){const points=[0,1,2].map(k=>new THREE.Vector3().fromBufferAttribute(p,index.getX(i+k))),centre=points[0].clone().add(points[1]).add(points[2]).multiplyScalar(1/3);if(Math.hypot(centre.x,centre.y)<=4.5||centre.z<=7||centre.z>=18)continue;const normal=points[1].clone().sub(points[0]).cross(points[2].clone().sub(points[0])).normalize();assert.ok(centre.x*normal.x+centre.y*normal.y>4.2,'Cap actual outer triangle normals face out');outward++;}assert.ok(outward>50);
  for(const [origin,direction,distance]of [[[0,0,7],[1,0,0],2.35],[[0,0,7],[0,0,1],3]]){const hit=new THREE.Raycaster(v(origin).applyMatrix4(a.cap.matrixWorld),v(direction).transformDirection(a.cap.matrixWorld)).intersectObject(cap,false)[0];assert.ok(hit,'Blind bore has real side and roof');near(hit.distance,distance,'Blind bore dimensions');rays++;}
  const fixed=[model.encoderBoard,...Object.values(model.parts)].map(o=>({object:o,matrix:o.matrixWorld.clone()}));
  for(const angle of [0,37,180,-90]){
   a.rotation.set({angleDeg:angle});tick(model);model.root.updateMatrixWorld(true);const rest=a.cap.matrixWorld.clone();a.press.press('first');a.press.press('second');tick(model);near(a.press.getActuationState().depthMm,.35,'Actual cap reaches visual press endpoint');a.press.release('first');tick(model);assert.equal(a.press.pressed,true,'Other source retains press');a.press.release('second');tick(model);model.root.updateMatrixWorld(true);assert.ok(a.cap.matrixWorld.equals(rest),'Release returns to exact current-angle matrix');for(const row of fixed)assert.ok(row.object.matrixWorld.equals(row.matrix),'Fixed shell/board does not rotate or press');motionCases++;
  }
  a.rotation.set({rpm:18});model.update(.25);const angle=a.rotation.angleDeg;a.press.press('rpm');model.update(.25);assert.ok(a.rotation.angleDeg>angle&&a.press.pressed);a.press.release('rpm');a.rotation.set({angleDeg:0});tick(model);
  for(const [i,led]of a.leds.entries()){
   assert.ok(led.object3d.position.y< -8&&led.object3d.position.z<0,'RGB packages stay behind lower shell, no phantom upper lamps');led.set({color:i?'#2080ff':'#ff2020',brightness:.65});near(model.encoderShellDiffusion.uniforms['encoderBrightness'+i].value,.65,'External brightness reaches actual front material');assert.equal(peer.led('led'+i).brightness,0,'Separate instances retain independent light state');led.set(false);near(model.encoderShellDiffusion.uniforms['encoderBrightness'+i].value,0,'Off clears front emission');
  }
  assert.ok(model.parts.front.material!==model.parts.rear.material&&model.parts.front.material!==peer.parts.front.material,'Only an independently owned native front material is changed');
  const double=new THREE.MeshBasicMaterial({side:THREE.DoubleSide}),shadows=Object.values(model.parts).map(o=>{const s=new THREE.Mesh(o.geometry,double);s.matrixAutoUpdate=false;s.matrixWorld.copy(o.matrixWorld);return s;}),ray=new THREE.Raycaster(),directions=[[.733,.312,.604],[-.381,.852,.359],[.257,-.619,.741]].map(d=>v(d).normalize());
  const contains=(s,point)=>{s.geometry.computeBoundingBox();if(!s.geometry.boundingBox.containsPoint(point))return false;return directions.every(d=>{ray.set(point,d);const raw=ray.intersectObject(s,false);if(raw[0]?.distance<1e-5)return false;return raw.filter((h,i)=>!i||h.distance-raw[i-1].distance>1e-5).length%2===1;});};
  try{
   const board=model.encoderBoard,boardRay=(x,y)=>new THREE.Raycaster(v([x,y,5]),v([0,0,-1])).intersectObject(board,false);
   assert.ok(shadows.some(s=>contains(s,v([9.02,-12.56,-3.1]))),'Regression location is real front reinforcing material');assert.equal(boardRay(9.02,-12.56).length,0,'Reconstructed board leaves reinforcing material empty');
   for(let x=-9.3;x<=9.3;x+=.6)for(let y=-13.7;y<=16;y+=.6){if(!boardRay(x,y).length)continue;for(const z of [-3.898,-3.5,-3.102]){assert.ok(shadows.every(s=>!contains(s,v([x,y,z]))),'PCB material remains in native cavity');materialSamples++;}}
   for(const x of [-8,8])for(const dx of [-1.5,0,1.5]){assert.equal(new THREE.Raycaster(v([x+dx,-4,30]),v([0,0,-1])).intersectObject(model.root,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0).length,0,'Original mounting bores stay open');rays++;}
   for(const x of [-3,-1,1,3]){assert.equal(boardRay(x,-8.4).length,0,'Solder tail has a real board drilling');assert.ok(model.root.getObjectByName('Encoder Grove folded tail '+((x+3)/2)));rays++;}
   near(model.port('grove').object3d.position.z,-.6,'U135 own bay centre follows floor -3.2/front2');
  }finally{double.dispose();}
  const module=new GroveModule(),host=new Device(),port=host.add(new Port({id:'unit',connector:'grove',position:[7,4,2],rotation:[.2,-.3,.4]}));owners.push(module,host);port.attach(module);track(module);host.root.updateMatrixWorld(true);const input=module.port('grove'),cable=module.get('cable');
  for(const pose of [{position:[0,35,0],rotation:[0,0,0]},{position:[20,110,10],rotation:[.2,.3,.4]}]){module.get('unitFrame').setPose(pose);host.update(1/60);host.root.updateMatrixWorld(true);for(const [plug,socket]of [[cable.sourcePlug,port],[cable.targetPlug,input]]){assert.ok(plug.getWorldPosition(new THREE.Vector3()).distanceTo(socket.object3d.getWorldPosition(new THREE.Vector3()))<2e-5,'Real cable endpoints retain actual mouth positions');assert.ok(Math.abs(plug.getWorldQuaternion(new THREE.Quaternion()).dot(socket.object3d.getWorldQuaternion(new THREE.Quaternion())))>1-1e-9,'Cable plug frame follows real port');}}
  host.handle({type:'joint',target:'unit/rotation',angleDeg:37});host.handle({type:'led',target:'unit/led1',brightness:.4});assert.equal(module.get('rotation').angleDeg,37);near(module.led('led1').brightness,.4,'Nested RGB path retained');
  const beforeDetach=[...resources.values()];port.detach({dispose:false});assert.deepEqual([...resources.values()],beforeDetach,'Detach(false) retains current resources; pose updates may already retire old cable geometries');port.attach(module);
  return {status:'pass',sku:'U135',motionCases,rays,pcbMaterialSamples:materialSamples,trackedResources:resources.size,axisMm:axis.toArray(),movingCapDiameterMm:radius*2,scope:'Native geometry, retained holes, product-local board/controls/cable and material state; optical spread/hidden shapes/press travel inferred, not manufacturing or electrical verification'};
 }catch(error){failure=error;throw error;}finally{const roots=owners.filter(owner=>{for(let parent=owner.parentHost;parent;parent=parent.parentHost)if(owners.includes(parent))return false;return true;});for(const owner of roots.reverse())owner.dispose();const bad=[...resources.values()].filter(count=>count!==1);if(!failure)assert.equal(bad.length,0,'Every tracked resource is released exactly once');else if(bad.length)console.error('Encoder cleanup counts:',bad.join(','));if(!prior)delete globalThis.document;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log('PASS Encoder assembly:',JSON.stringify(await checkEncoderAssembly()));
