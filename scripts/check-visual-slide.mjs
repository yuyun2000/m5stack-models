import assert from 'node:assert/strict';
import * as THREE from 'three';
import {Device,VisualSlide} from '../src/core/index.js';
import {pathToFileURL} from 'node:url';

export function checkVisualSlide(){
 const device=new Device(),cap=new THREE.Mesh(new THREE.BoxGeometry(4,7,3),new THREE.MeshBasicMaterial());
 const slide=device.add(new VisualSlide({id:'slider',mesh:cap,position:[2,3,4],rangeMm:[-17.5,17.5]}));
 const events=[];device.on('input',event=>events.push(event));
 device.root.position.set(6,8,-5);device.root.rotation.set(.3,-.2,.4);device.root.scale.setScalar(1.8);
 device.root.updateMatrixWorld(true);
 const neutral=cap.getWorldPosition(new THREE.Vector3()),fixed=device.body.matrixWorld.clone();
 slide.set({positionMm:17.5});device.root.updateMatrixWorld(true);
 const expected=new THREE.Vector3(0,17.5,0).applyMatrix4(slide.object3d.matrixWorld);
 assert.ok(cap.getWorldPosition(new THREE.Vector3()).distanceTo(expected)<1e-8,'cap follows its local slide axis through rotated/scaled parent');
 assert.ok(device.body.matrixWorld.equals(fixed),'the fixed device does not translate');
 assert.equal(events.length,0,'external pose commands never report user input');
 const snapshot=slide.getState();snapshot.rangeMm[0]=900;assert.equal(slide.getState().rangeMm[0],-17.5);
 slide.set({positionMm:-17.5,durationMs:200});assert.equal(slide.update(.1),true);assert.equal(slide.getState().positionMm,0);
 const moving=slide.getState();
 for(const cmd of [{positionMm:18},{positionMm:NaN},{durationMs:-1},{durationMs:20},{positionMm:0,durationMs:Infinity}])assert.throws(()=>slide.set(cmd));
 assert.deepEqual(slide.getState(),moving,'invalid commands preserve the pending transition');
 assert.equal(slide.update(.1),true);assert.equal(slide.getState().positionMm,-17.5);assert.equal(slide.getState().transitioning,false);
 assert.equal(slide.update(.1),false,'on-demand render goes idle after the exact destination');
 slide.handle({type:'slider',positionMm:0});device.root.updateMatrixWorld(true);
 assert.ok(cap.getWorldPosition(new THREE.Vector3()).distanceTo(neutral)<1e-8);
 const rayAt=y=>{
  device.root.updateMatrixWorld(true);
  return new THREE.Ray(new THREE.Vector3(.6,y,80),new THREE.Vector3(0,0,-1)).applyMatrix4(slide.object3d.matrixWorld);
 };
 const grab=slide.object3d.localToWorld(new THREE.Vector3(.6,1,1.5));
 slide.onPointerDown({pointerId:7,point:grab,ray:rayAt(1)});
 assert.equal(slide.getState().dragging,true);
 slide.onPointerMove({pointerId:8,ray:rayAt(12)});assert.equal(slide.positionMm,0,'a second pointer cannot steal the slide');
 slide.onPointerMove({pointerId:7,ray:rayAt(12)});assert.ok(Math.abs(slide.positionMm-11)<1e-8,'grab offset is preserved even when the pointer is beyond the physical cap');
 slide.onPointerMove({pointerId:7,ray:rayAt(90)});assert.equal(slide.positionMm,17.5,'pointer intent clamps at the physical stop');
 slide.onPointerCancel({pointerId:7});slide.onPointerUp({pointerId:7});
 assert.equal(events.filter(e=>e.action==='end').length,1);assert.equal(events.at(-1).cancelled,true);
 slide.onPointerMove({pointerId:7,ray:rayAt(-30)});assert.equal(slide.positionMm,17.5,'lost capture leaves a stable position');
 slide.set({positionMm:0});slide.onPointerDown({pointerId:9,point:grab,ray:rayAt(1)});
 let releases=0;cap.geometry.addEventListener('dispose',()=>releases++);
 device.dispose();assert.equal(releases,1,'the cap has a single disposal owner');assert.equal(events.at(-1).cancelled,true);
 return {status:'pass',scope:'Physical translation, rotated/scaled parent, transition endpoints, external-command/input separation, off-cap ray drag, pointer ownership/cancellation and disposal; no browser pixels or hardware proof',checks:13};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(checkVisualSlide()));
