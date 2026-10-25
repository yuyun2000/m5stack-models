import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {Device,Port} from '../src/core/index.js';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const near=(a,b,why,tolerance=2e-5)=>assert.ok(Math.abs(a-b)<tolerance,`${why}: ${a} vs ${b}`);
const surface=(model,x,y)=>new THREE.Raycaster(new THREE.Vector3(x,y,20),new THREE.Vector3(0,0,-1)).intersectObject(model.root,true).find(hit=>hit.object.isMesh&&hit.object.material?.opacity!==0);
const originals=model=>Object.values(model.parts).map(mesh=>({mesh,vertices:mesh.geometry.attributes.position.array.slice(),frame:mesh.matrixWorld.clone()}));
const unchanged=(parts,why)=>{for(const {mesh,vertices,frame}of parts){assert.deepEqual(mesh.geometry.attributes.position.array,vertices,why);assert.ok(mesh.matrixWorld.equals(frame),why);}};

export async function checkUnitVisibleFunctions(){
 const models=[];let colorRays=0,toolRays=0,poses=0,nestedCommands=0;
 try{
  const color=await loadModel('color');models.push(color);color.root.updateMatrixWorld(true);const source=originals(color),sensor=color.root.getObjectByName('Color fixed sensor window'),sensorVertices=sensor.geometry.attributes.position.array.slice(),events=[];color.on('input',event=>events.push(event));
  const leds=['fill-left','fill-right'].map(id=>color.get(id));assert.equal(color.list('led').length,2,'Official U009 has two physical white fill emitters');
  for(const [i,led]of leds.entries()){
   assert.equal(led.getState().color,'#ffffff','The physical emitter starts with white rendering color');assert.equal(led.brightness,0);assert.equal(led.glow.visible,false);assert.equal(led.meta.independentElectricalControl,false,'Addressable appearance cells must not imply independent electrical channels');assert.equal(led.meta.powerGroup,'VCC fill pair');
   led.lens.geometry.computeBoundingBox();assert.ok(led.lens.geometry.boundingBox.getSize(new THREE.Vector3()).z>.25,'LED has physical package depth, not a decal');
   for(const dx of [-.4,-.2,0,.2,.4])for(const dy of [-.5,-.25,0,.25,.5]){const first=surface(color,(i?3.4:-3.4)+dx,8+dy);assert.ok(first?.object===led.lens,'Emitter face is actually visible through the unchanged source window');colorRays++;}
   const shape=led.lens.geometry.attributes.position.array.slice(),other=leds[1-i].getState();color.handle({type:'led',target:led.id,color:'#ffffff',brightness:.65});assert.equal(led.brightness,.65);assert.ok(led.lensMaterial.emissive.r>1.4&&led.lensMaterial.emissive.g>1.4&&led.lensMaterial.emissive.b>1.4);assert.deepEqual(leds[1-i].getState(),other,'One appearance address does not silently write its peer');assert.deepEqual(led.lens.geometry.attributes.position.array,shape);color.handle({type:'led',target:led.id,on:false});assert.equal(led.lensMaterial.emissive.getHex(),0);assert.equal(led.glow.visible,false);
  }
  color.update(1);color.root.updateMatrixWorld(true);unchanged(source,'Fill commands leave source housing vertices and transforms unchanged');assert.deepEqual(sensor.geometry.attributes.position.array,sensorVertices);assert.equal(events.length,0,'External light drive cannot manufacture sensor/input events');assert.throws(()=>color.handle({type:'sensor',target:'sensor',values:{red:10}}),'No local color sensing implementation');assert.equal(color.update(1),false,'Light packages have no automatic illumination loop');

  const light=await loadModel('light');models.push(light);light.root.updateMatrixWorld(true);const fixed=originals(light),joint=light.get('trim'),rotor=light.root.getObjectByName('Light moving slotted trimmer head'),rim=light.root.getObjectByName('Light trimmer metal rim with real tool slot'),floor=light.root.getObjectByName('Light trimmer recessed slot floor'),housing=light.root.getObjectByName('Light fixed blue trimmer housing'),ldr=light.root.getObjectByName('Light fixed photoresistor');
  assert.ok(rotor?.isGroup&&rim?.isMesh&&floor?.isMesh,'Actual metal rim and recessed tool-slot floor exist');assert.equal(joint.continuous,false);assert.equal(joint.limitsDeg,null,'Unconfirmed electrical/mechanical end stops cannot be invented');assert.deepEqual(joint.getState().visualRangeDeg,[-135,135]);assert.throws(()=>joint.set({rpm:1}),RangeError,'An adjustment screw is not an invented continuously driven motor');
  const fixedFrames=[housing,ldr,light.port('grove').object3d].map(object=>({object,frame:object.matrixWorld.clone()})),rotorFrame=rotor.matrixWorld.clone(),vertices=rim.geometry.attributes.position.array.slice();
  const restTop=surface(light,0,3.3),restFloor=surface(light,0,2.5);assert.ok(restTop?.object===rim&&restFloor?.object===floor,'Tool slot is a real open profile above a recessed solid floor');near(restTop.point.z-restFloor.point.z,.32,'Tool slot retains its actual modeled depth');toolRays+=2;
  for(const degrees of [-135,-75,-30,0,37,90,135]){
   light.handle({type:'joint',target:'trim',angleDeg:degrees});light.update(0);light.root.updateMatrixWorld(true);
   const basis=joint.object3d.matrixWorld.clone(),position=rim.geometry.attributes.position;for(const index of [0,17,position.count-1]){const actual=rim.localToWorld(new THREE.Vector3().fromBufferAttribute(position,index)),inJoint=joint.object3d.worldToLocal(actual.clone());near(inJoint.z,position.getZ(index),'Metal head moves rigidly in the real joint frame');assert.ok(actual.distanceTo(new THREE.Vector3().fromBufferAttribute(position,index).applyMatrix4(basis))<2e-5,'Actual native rim vertices follow the commanded head angle');}
   for(const {object,frame}of fixedFrames)assert.ok(object.matrixWorld.equals(frame),'Blue carrier, photoresistor and Grove socket stay fixed');unchanged(fixed,'Trimmer movement cannot reshape or move original CAD');poses++;
  }
  joint.setAngle(90);light.root.updateMatrixWorld(true);assert.ok(surface(light,0,3.3)?.object===floor,'Quarter turn moves the real slot across a previously solid rim point');toolRays++;
  joint.setAngle(0);light.root.updateMatrixWorld(true);assert.ok(rotor.matrixWorld.equals(rotorFrame),'Return to neutral is exact');assert.deepEqual(rim.geometry.attributes.position.array,vertices);assert.equal(light.update(1),false,'No resistance, threshold or autonomous motion model');

  for(const id of ['color','light']){
   const host=new Device(),port=host.add(new Port({id:'unit',connector:'grove',rotation:[.2,-.3,.4]}));models.push(host);const module=await loadGroveModule(id,{cableLength:65});port.attach(module);module.get('unitFrame').setPose({rotation:[.25,-.2,.3]});host.root.updateMatrixWorld(true);const socket=module.port('grove').object3d.matrixWorld.clone();
   if(id==='color'){for(const side of ['left','right']){const path=`unit/fill-${side}`,led=module.get(`fill-${side}`);assert.ok(host.get(path)===led,'Grove prefix reaches the actual emitter');host.handle({type:'led',target:path,color:'#ffffff',brightness:.4});near(led.brightness,.4,'Nested external brightness');nestedCommands++;}}
   else{const screw=module.get('trim');assert.ok(host.get('unit/trim')===screw);host.handle({type:'joint',target:'unit/trim',angleDeg:47});near(screw.angleDeg,47,'Nested physical head pose');nestedCommands++;}
   host.update(0);host.root.updateMatrixWorld(true);assert.ok(module.port('grove').object3d.matrixWorld.equals(socket),'Light drive or screw motion leaves the real cable socket fixed');
  }
  return {status:'pass',color:{physicalWhitePackages:2,visiblePackageRays:colorRays,defaultOff:true,commonPhysicalPowerWithoutElectricalEmulation:true},light:{actualHeadPoses:poses,toolSlotRays:toolRays,toolSlotDepthMm:.32,exactReturn:true,continuous:false,ratedLimitsConfirmed:false},nestedCommands,scope:'Actual visible mesh/ray and external API checks for U009 fill packages and U021 manual head; geometry depths and demo angle range are appearance estimates, no physical/electrical/sensor or manufacturing validation'};
 }finally{for(const model of models.reverse())model.dispose();}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){const noop=()=>{},ctx=new Proxy({createRadialGradient:()=>({addColorStop:noop}),measureText:()=>({width:20})},{get:(o,k)=>o[k]??noop});globalThis.document={createElement:()=>({getContext:()=>ctx})};console.log('PASS Unit visible functions:',JSON.stringify(await checkUnitVisibleFunctions()));}
