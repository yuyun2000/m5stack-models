import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const EXPECTED_PORTS={sticks3:['grove'],cores3:['grove'],stopwatch:['grove'],'cardputer-adv':['grove'],'cardputer-zero':['grove'],papermono:[],core2:['grove'],papercolor:['grove'],nanoc6:['grove'],stackchan:['grove','port-b','port-c'],tab5:['grove'],atoms3r:['grove'],'nesso-n1':['grove'],stamplc:['port-a','port-c']};
const visible=object=>object.isMesh&&(Array.isArray(object.material)?object.material:[object.material]).some(material=>material.opacity!==0);
const within=(object,parent)=>{for(let o=object;o;o=o.parent)if(o===parent)return true;return false;};
const near=(a,b,why)=>assert.ok(a.distanceTo(b)<2e-5,`${why}: ${a.toArray()} vs ${b.toArray()}`);
const Y=new THREE.Vector3(0,1,0),vertex=(mesh,ring,row)=>mesh.localToWorld(new THREE.Vector3().fromBufferAttribute(mesh.geometry.attributes.position,ring*9+row));

/** Real enclosure and actual tube-surface rails, beyond synthetic port tests. */
export async function checkHostGroveAssembly(){
 const cases=[];let railSegments=0,sourcePorts=0,matingChecks=0;
 const rows=[...Object.entries(EXPECTED_PORTS).map(([id,ports])=>({id,ports,options:{}})),{id:'cores3',label:'cores3-din',ports:['grove','grove-b','grove-c'],options:{dinBase:true}}];
 for(const row of rows){
  const host=await loadModel(row.id,row.options),label=row.label??row.id;
  try{
   const actual=host.list('port').filter(port=>port.connector==='grove').map(port=>port.id);
   assert.deepEqual(actual.toSorted(),row.ports.toSorted(),`${label}: all actual Grove interfaces, including declared absence`);
   sourcePorts+=actual.length;
   for(const portId of actual){
    const port=host.port(portId),unit=await loadGroveModule('env-iii',{cableLength:85,cable:{slack:16}});
    port.attach(unit);
    try{
     const poses=row.id==='stackchan'?[{yaw:0,pitch:0},{yaw:35,pitch:35},{yaw:180,pitch:90}]:[{}];
     for(const pose of poses){
      if(row.id==='stackchan'){host.get('yaw').set({angleDeg:pose.yaw});host.get('pitch').set({angleDeg:pose.pitch});}
      host.update(1/60);host.root.updateMatrixWorld(true);
      const cable=unit.get('cable');cable.sync();host.root.updateMatrixWorld(true);
      const solids=[];host.body.traverse(object=>{if(visible(object)&&!within(object,cable.object3d))solids.push({object,box:new THREE.Box3().setFromObject(object)});});
      const input=unit.port('grove');
      for(const [plug,socket]of [[cable.sourcePlug,port],[cable.targetPlug,input]]){
       near(plug.getWorldPosition(new THREE.Vector3()),socket.object3d.getWorldPosition(new THREE.Vector3()),`${label}/${portId}: real plug mating position`);
       near(Y.clone().applyQuaternion(plug.getWorldQuaternion(new THREE.Quaternion())),Y.clone().applyQuaternion(socket.object3d.getWorldQuaternion(new THREE.Quaternion())),`${label}/${portId}: real plug mating direction`);
       matingChecks+=2;
      }
      for(const wire of cable.wires){
       // Eight rendered tube rails (radius .4 mm), with every two rings checked.
       // World-space boxes only prune irrelevant meshes; final evidence is an
       // actual triangle ray against each candidate, in both directions.
       for(let ring=0;ring<96;ring+=2)for(let rail=0;rail<8;rail++){
        const a=vertex(wire,ring,rail),b=vertex(wire,ring+2,rail),delta=b.clone().sub(a),length=delta.length();
        const segmentBox=new THREE.Box3().setFromPoints([a,b]).expandByScalar(.0001);
        const candidates=solids.filter(solid=>solid.box.intersectsBox(segmentBox)).map(solid=>solid.object);
        if(candidates.length){
         const direction=delta.normalize(),forward=new THREE.Raycaster(a,direction,1e-5,length-1e-5).intersectObjects(candidates,false),backward=new THREE.Raycaster(b,direction.clone().negate(),1e-5,length-1e-5).intersectObjects(candidates,false);
         const first=forward[0]??backward[0];assert.ok(!first,`${label}/${portId} yaw=${pose.yaw??0} pitch=${pose.pitch??0}: rendered wire surface crosses ${first?.object.name} at ${first?.point.toArray()}`);
        }
        railSegments++;
       }
      }
      cases.push({host:label,port:portId,unit:'env-iii',...pose,status:'pass'});
     }
    }finally{port.detach();}
   }
  }finally{host.dispose();}
 }
 return {status:'pass',sourcePorts,hostConfigurations:rows.length,cases,matingChecks,railSegments,scope:'All actual host Grove interfaces with a real compact Unit; sampled rendered tube-surface rails and mating transforms, including StackChan poses. Not an arbitrary-pose collision solver or hardware fit proof.'};
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 const noop=()=>{},ctx=new Proxy({measureText:()=>({width:20}),createRadialGradient:()=>({addColorStop:noop}),createLinearGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});globalThis.document={createElement:()=>({getContext:()=>ctx})};
 const report=await checkHostGroveAssembly();await fs.writeFile(new URL('../artifacts/host-grove-assembly-check.json',import.meta.url),JSON.stringify({checkedAt:new Date().toISOString(),...report},null,2)+'\n');console.log('PASS real host Grove assembly:',JSON.stringify({sourcePorts:report.sourcePorts,cases:report.cases.length,matingChecks:report.matingChecks,railSegments:report.railSegments}));
}
