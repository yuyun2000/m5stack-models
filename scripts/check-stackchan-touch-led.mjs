import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import data from '../src/devices/stackchan/geometry-data.js';
import {addCadParts} from '../src/modeling/cad.js';
const EPS=3e-5,near=(a,b,why)=>assert.ok(a.elements.every((v,i)=>Math.abs(v-b.elements[i])<EPS),why);
function ensureCanvas(){
 if(globalThis.document)return;
 const noop=()=>{},ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});globalThis.document={createElement:()=>({getContext:()=>ctx})};
}
/** Product-local appearance/API regression; no network or private files. */
export async function checkStackChanTouchLed(){
 ensureCanvas();const {StackChan}=await import('../src/devices/stackchan/index.js');const model=new StackChan();model.root.updateMatrixWorld(true);
 const a=model.stackchanAssembly.touchLed,head=model.parts['head-shell'],owned=[],disposals=new Map();
 a.group.traverse(o=>{if(o.isMesh)for(const resource of [o.geometry,...(Array.isArray(o.material)?o.material:[o.material])])if(!disposals.has(resource)){disposals.set(resource,0);resource.addEventListener('dispose',()=>disposals.set(resource,disposals.get(resource)+1));owned.push(resource);}});
 const sourceBody=new THREE.Group(),source=addCadParts({body:sourceBody},data.filter(p=>p.name==='head-shell'));for(const o of Object.values(source)){o.material.side=THREE.DoubleSide;}sourceBody.updateMatrixWorld(true);
 let report;
 try{
  assert.equal(model.list('button').length,5);assert.equal(model.list('led').length,12);
  assert.deepEqual(a.touches.map(b=>b.id),['touch-1','touch-2','touch-3']);assert.deepEqual(a.touches.map(b=>b.meta.physicalZone),['front','middle','back']);
  assert.ok(a.touches[0].object3d.position.z>a.touches[1].object3d.position.z&&a.touches[1].object3d.position.z>a.touches[2].object3d.position.z,'official Front/Middle/Back ordering follows +Z front');
  assert.deepEqual(a.lights.map(l=>l.id),['left','right'].flatMap(side=>Array.from({length:6},(_,i)=>`rgb-${side}-${i+1}`)));
  assert.equal(new Set(a.lights.map(l=>l.lensMaterial)).size,12,'each external LED owns its emission material');
  const events=[];model.on('input',event=>events.push(event));const frame=()=>head.matrixWorld.clone().invert(),rest=new THREE.Box3();
  model.root.traverse(o=>{if(o.isMesh&&!a.touches.some(b=>o===b.cap.children[0]))rest.expandByObject(o);});
  for(const b of a.touches){assert.equal(b.kind,'button');assert.equal(b.travel,0);assert.equal(b.meta.capacitive,true);assert.equal(b.meta.actuation,'capacitive');assert.equal(b.cap.children[0].material.opacity,0);assert.ok(rest.containsBox(new THREE.Box3().setFromObject(b.object3d)),'invisible touch target cannot enlarge the assembled envelope');
   const at=b.cap.matrix.clone();b.press('top-check');model.update(.1);near(b.cap.matrix,at,'capacitive press has no cap travel');assert.equal(b.pressed,true);assert.ok(a.lights.every(l=>l.brightness===0),'touch does not invent touch-to-light behavior');b.release('top-check');model.update(.1);assert.equal(b.pressed,false);near(b.cap.matrix,at,'capacitive release has no cap movement');
   b.onPointerDown({pointerId:77});assert.equal(b.pressed,true);b.onPointerCancel({pointerId:77});assert.equal(b.pressed,false,'pointer cancellation releases top touch');}
  assert.equal(events.filter(e=>e.action==='down'&&e.id.startsWith('touch-')).length,6);assert.equal(events.filter(e=>e.action==='click'&&e.id.startsWith('touch-')).length,3);
  let slotRays=0;const componentFrames=[...a.touches,...a.lights].map(c=>[c,frame().multiply(c.object3d.matrixWorld)]),base=model.parts.base.matrixWorld.clone();
  // Every actual emitting surface vertex must see a recessed source aperture.
  // A plane painted over closed source plastic would hit within 0.4 mm here.
  for(const led of a.lights){const ps=led.lens.geometry.attributes.position;let surface=0;
   for(let i=0;i<ps.count;i++){const p=new THREE.Vector3().fromBufferAttribute(ps,i);if(Math.abs(Math.hypot(p.y,p.z+5.03)-5.04)>.001)continue;
    const neutral=head.worldToLocal(led.lens.localToWorld(p)),side=led.meta.physicalSide==='left'?-1:1,normal=new THREE.Vector3(neutral.x-side*22,neutral.y-30.25,0).normalize(),origin=neutral.clone().addScaledVector(normal,.4),h=new THREE.Raycaster(origin,normal.clone().negate()).intersectObject(source['head-shell'],true)[0];
    assert.ok(!h||h.distance>.65,`${led.id}: emitting surface ${neutral.toArray().map(n=>n.toFixed(3))} lies in the real roof slot, not on opaque shell`);slotRays++;surface++;
   }assert.ok(surface>100);assert.equal(led.meta.electricalIndex,null);assert.ok(led.lens.geometry.boundingBox.getSize(new THREE.Vector3()).x<5,'emission is one narrow guide cell');}
  const geometryBefore=a.lights.map(l=>l.lens.geometry.attributes.position.array.slice()),colors=['#ee3040','#20c770','#277bea'];
  for(let i=0;i<12;i++){
   const before=a.lights.map(l=>l.getState()),led=a.lights[i],brightness=(i+1)/12;model.handle({type:'led',target:led.id,color:colors[i%3],brightness});assert.equal(led.getState().color,colors[i%3]);assert.equal(led.brightness,brightness);
   for(let j=0;j<12;j++)if(j!==i)assert.deepEqual(a.lights[j].getState(),before[j],'one light command cannot change another cell');
   const expected=new THREE.Color(colors[i%3]).multiplyScalar(brightness*2.2);assert.ok(['r','g','b'].every(key=>Math.abs(led.lensMaterial.emissive[key]-expected[key])<EPS));assert.deepEqual(led.lens.geometry.attributes.position.array,geometryBefore[i],'color writes never reshape guide geometry');assert.equal(led.glow.scale.length(),0,'no oversized billboard emission');
  }
  let poses=0,touchRays=0;const sceneTouchOcclusions=[];for(const yaw of [0,35,90,180,270])for(const pitch of [0,15,35,60,75,90]){
   model.get('yaw').setAngle(yaw);model.get('pitch').setAngle(pitch);model.update(0);model.root.updateMatrixWorld(true);near(model.parts.base.matrixWorld,base,'new visual inputs/lights cannot move the fixed base');
   for(const [component,relative]of componentFrames)near(frame().multiply(component.object3d.matrixWorld),relative,'top targets and guide cells follow the actual pitching head');
   for(const b of a.touches){const centre=b.object3d.getWorldPosition(new THREE.Vector3()),normal=new THREE.Vector3(0,0,1).transformDirection(b.object3d.matrixWorld),ray=new THREE.Raycaster(centre.clone().addScaledVector(normal,2),normal.negate()),target=ray.intersectObject(b.object3d,true)[0],first=ray.intersectObject(model.root,true)[0];assert.ok(target?.object.userData.component===b,`${b.id}: transformed top target remains aligned at yaw ${yaw}/pitch ${pitch}`);if(first?.object.userData.component!==b)sceneTouchOcclusions.push({yaw,pitch,target:b.id,firstHit:first?.object.name??'nothing',firstDistanceMm:first?.distance,targetDistanceMm:target.distance,touchPointLocal:head.worldToLocal(centre.clone()).toArray(),touchPointWorld:centre.toArray(),firstHitPointWorld:first?.point.toArray()});touchRays++;}poses++;
  }
  model.get('yaw').setAngle(0);model.get('pitch').setAngle(0);a.lights.forEach(l=>l.set(false));model.update(0);assert.equal(model.update(.25),false,'appearance has no autonomous touch/light animation');
  assert.ok(model.button('power')&&model.button('reset'));assert.equal(model.get('yaw').id,'yaw');assert.equal(model.get('pitch').id,'pitch');assert.equal(model.display('lcd').width,320);assert.equal(model.display('lcd').height,240);
  a.group.traverse(o=>{if(o.isMesh)for(const name of ['position','normal'])for(const value of o.geometry.attributes[name]?.array??[])assert.ok(Number.isFinite(value),'finite native guide/touch geometry');});
  // The unaltered servo-side cover is an existing unresolved mechanical fit;
  // report its occlusion explicitly rather than moving either geometry to hide it.
  assert.ok(sceneTouchOcclusions.every(o=>o.firstHit==='servo-side-cover'&&o.pitch===90),'any new scene-touch obstruction needs an explicit product audit');
  report={status:'pass',passScope:'API, independent material drive, source roof apertures and head hierarchy only; scene access is separately partial',touchZones:3,touchOrder:['front','middle','back'],capacitiveTravelMm:0,independentRgbCells:12,rows:2,cellsPerRow:6,poseCount:poses,actualApertureRays:slotRays,articulatedTargetSelfRays:touchRays,sceneAccess:{status:sceneTouchOcclusions.length?'partial':'pass',probeCount:touchRays,unblocked:touchRays-sceneTouchOcclusions.length,blocked:sceneTouchOcclusions,scope:'Complete assembled-scene approach along local roof normal, 2 mm start offset. Self-target hits do not imply whole-device accessibility.'},ownedMeshResources:owned.length,targetEnvelopeExpansion:false,sourceScope:'Si12T three zones, WS2812C x12, official BSP front/middle/back and left6/right6; source roof slots',limits:'Exact electrode boundaries and per-side emitter order/spacing/diffusion remain inferred. Pitch90 touch-middle normal-ray occlusion by the original servo-side-cover remains unresolved; whole-device touch access is not fully accepted. No electrical chain mapping, gestures, capacitance, firmware, cable physics or hidden servo fit claim.'};
 }finally{model.dispose();for(const o of Object.values(source)){o.geometry.dispose();o.material.dispose();}}
 for(const count of disposals.values())assert.equal(count,1,'each new owned mesh geometry/material is released exactly once');
 return {...report,resourceDisposal:'all new mesh resources exactly once'};
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){const report=await checkStackChanTouchLed();console.log(process.argv.includes('--json')?JSON.stringify(report,null,2):`PASS StackChan top touch/RGB: ${JSON.stringify(report)}`);}
