import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import sourceData from '../src/devices/stackchan/geometry-data.js';
import {addCadParts} from '../src/modeling/cad.js';
const V=a=>new THREE.Vector3(...a),EPS=2e-5;
const hits=(root,o,d)=>new THREE.Raycaster(o,d).intersectObject(root,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0);
const cast=(root,o,d)=>hits(root,V(o),V(d))[0];
const relative=(object,parent)=>parent.matrixWorld.clone().invert().multiply(object.matrixWorld);
const nearMatrix=(a,b,why)=>a.elements.forEach((n,i)=>assert.ok(Math.abs(n-b.elements[i])<EPS,why));
const meshEndpoint=(wire,end)=>{const ps=wire.geometry.attributes.position,start=end?64*9:0,p=new THREE.Vector3();for(let i=0;i<8;i++)p.add(new THREE.Vector3().fromBufferAttribute(ps,start+i));return wire.localToWorld(p.multiplyScalar(1/8));};
const localHit=(root,group,x,y)=>hits(root,group.localToWorld(new THREE.Vector3(x,y,5)),new THREE.Vector3(0,0,-1).transformDirection(group.matrixWorld))[0];
const envelope=root=>{const box=new THREE.Box3();root.traverse(o=>{if(o.isMesh&&o.material?.opacity!==0)box.expandByObject(o);});return {min:box.min.toArray(),max:box.max.toArray(),size:box.getSize(new THREE.Vector3()).toArray()};};

// Sample actual insert volume, including the interior of each board. Passing a
// front/back ray alone cannot exclude a board edge embedded in shell material.
const boardVolumeSamples=mesh=>{
 const geometry=mesh.geometry;geometry.computeBoundingBox();const {min,max}=geometry.boundingBox,z=(min.z+max.z)/2,points=[],seen=new Set();
 const add=p=>{const key=p.toArray().map(n=>n.toFixed(5)).join(',');if(!seen.has(key)){seen.add(key);points.push(p);}};
 const ps=geometry.attributes.position;for(let i=0;i<ps.count;i++)for(const layer of [min.z+.05,z,max.z-.05]){const p=new THREE.Vector3().fromBufferAttribute(ps,i);p.z=layer;add(p);}
 const probe=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));probe.updateMatrixWorld(true);
 for(let x=min.x+.7;x<max.x;x+=2.5)for(let y=min.y+.7;y<max.y;y+=2.5)if(cast(probe,[x,y,max.z+1],[0,0,-1]))add(new THREE.Vector3(x,y,z));
 probe.material.dispose();return points;
};
const surfaceSamples=mesh=>{
 const points=[],seen=new Set(),ps=mesh.geometry.attributes.position,ix=mesh.geometry.index;
 // Bevel tessellation contains thousands of nearly coincident points. A
 // 0.35 mm spatial bin keeps actual surface points without retesting them.
 const add=p=>{const key=p.toArray().map(n=>Math.floor(n/.35)).join(',');if(!seen.has(key)){seen.add(key);points.push(p);}};
 for(let i=0;i<ps.count;i++)add(new THREE.Vector3().fromBufferAttribute(ps,i));
 for(let i=0;i<(ix?.count??ps.count);i+=3){const p=new THREE.Vector3();for(let j=0;j<3;j++)p.add(new THREE.Vector3().fromBufferAttribute(ps,ix?ix.getX(i+j):i+j));add(p.multiplyScalar(1/3));}
 return points;
};

export function checkStackChanMovingAssembly(model){
 model.root.updateMatrixWorld(true);const a=model.stackchanAssembly,pitch=model.get('pitch'),yaw=model.get('yaw'),pcb=a.rear.getObjectByName('Rear power PCB');
 const sourceBody=new THREE.Group(),source=addCadParts({body:sourceBody},sourceData);for(const mesh of Object.values(source))mesh.material=mesh.material.clone(),mesh.material.side=THREE.DoubleSide;sourceBody.updateMatrixWorld(true);
 const solidDirection=new THREE.Vector3(.743,.431,.509).normalize();
 const insideSolid=(point,target)=>{if(!target.geometry.boundingBox)target.geometry.computeBoundingBox();if(!target.geometry.boundingBox.containsPoint(point))return false;const ray=new THREE.Raycaster(point,solidDirection),hs=ray.intersectObject(target,true).filter((h,i,a)=>!i||Math.abs(h.distance-a[i-1].distance)>1e-5);return hs.length%2===1;};
 const insertBoards=[pcb,model.root.getObjectByName('Neck Adapter PCB')].map(mesh=>({mesh,points:boardVolumeSamples(mesh)}));
 const adapterInserts=[];for(const root of [a.adapter.lowerHarness,...a.adapter.servoConnectors])root.traverse(mesh=>{if(mesh.isMesh)adapterInserts.push({mesh,points:surfaceSamples(mesh)});});
 const touch=model.root.getObjectByName('Head Touch PCB'),touchSolid=new THREE.Mesh(touch.geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));touchSolid.updateMatrixWorld(true);
 let insertSolidContainmentSamples=0,adapterTouchSamples=0;
 let servoLeadClearanceSamples=0;
 for(const {wire}of a.adapter.servoLeads)for(let k=2;k<32;k++)for(const offset of [[0,0,0],[.2,0,0],[-.2,0,0],[0,.2,0],[0,-.2,0],[0,0,.2],[0,0,-.2]]){
  const point=wire.geometry.parameters.path.getPointAt(k/32).add(V(offset));for(const name of ['neck-cradle','servo-rear-cover','servo-side-cover'])assert.ok(!insideSolid(point,source[name]),`${wire.name}: sample ${point.toArray().map(n=>n.toFixed(2))} insulation clears actual fixed CAD ${name}`);servoLeadClearanceSamples++;
 }
 const sourceEvidence=[];
 for(const [label,origin,direction,target,test]of [
  ['upper-left Core seat',[-21,34,40],[0,0,-1],source['head-shell'],h=>h&&Math.abs(h.point.z-15.95)<.01],
  ['lower-right Core seat',[22,-17,40],[0,0,-1],source['head-shell'],h=>h&&Math.abs(h.point.z-15.95)<.01],
  ['genuinely open rear',[-14,23,-40],[0,0,1],source['head-shell'],h=>!h],
  ['actual base USB opening',[0,-27.7,-60],[0,0,1],source.base,h=>!h||h.point.z> -24],
  ['former USB closed shell',[0,-30.9,-60],[0,0,1],source.base,h=>h&&h.point.z< -30],
  ...[-11,11].map(x=>[`head Grove ${x<0?'B':'C'} opening`,[x,45,13],[0,-1,0],source['head-shell'],h=>!h||h.point.y<34])
 ]){const h=cast(target,origin,direction);assert.ok(test(h),label);sourceEvidence.push({label,origin,direction,hit:h?{name:h.object.name,point:h.point.toArray()}:null});}
 for(const name of Object.keys(source)){
  assert.deepEqual(model.parts[name].geometry.attributes.position.array,source[name].geometry.attributes.position.array,`${name}: original official mesh must not be cut to fit inserts`);
 }
 for(const [x,y]of [[-14,23],[14,23],[0,28]]){const first=cast(model.root,[x,y,-40],[0,0,1]);assert.equal(first?.object.name,'Rear power PCB','rear remains open to the real distant Core attachment PCB');assert.ok(Math.abs(first.point.z-16.0)<.01);}
 for(const x of [-21,21])for(const y of [-12.75,29.25])assert.equal(cast(pcb,[x,y,-40],[0,0,1]),undefined,'four board mounting holes stay open');
 assert.equal(cast(pcb,[0,-2.5,-40],[0,0,1]),undefined,'actual front-board wire window is open');
 assert.equal(a.rear.children.filter(o=>o.userData.contactCount===3).length,0,'head-top black/blue Grove backs must not be misidentified as servo connectors');
 assert.equal(a.adapter.servoConnectors.length,2);for(const c of a.adapter.servoConnectors)assert.equal(c.contacts.length,3);
 assert.equal(a.adapter.lowerHarness.contacts.length,7);assert.equal(a.rear.upperHarness.contacts.length,7);
 assert.equal(a.adapter.servoLeads.length,6);for(const {wire,start,end}of a.adapter.servoLeads){const curve=wire.geometry.parameters.path;assert.ok(wire.localToWorld(curve.getPoint(0)).distanceTo(start.getWorldPosition(new THREE.Vector3()))<EPS);assert.ok(wire.localToWorld(curve.getPoint(1)).distanceTo(end.getWorldPosition(new THREE.Vector3()))<EPS);}
 const fixed=[model.parts.base,model.parts['base-bottom'],a.baseUsb,model.port('base-usb').object3d,a.mechanics.yawServo.output].map(o=>[o,o.matrixWorld.clone()]);
 const headFrame=relative(a.rear,pitch.object3d),adapterFrame=relative(a.adapter,yaw.object3d),motorFrame=relative(a.mechanics.pitchServo.group,yaw.object3d),outputFrame=relative(a.mechanics.pitchServo.output,pitch.object3d);
 const lengths=[...a.harness.targetLengths],poses=[],groves=['B','C'].map(letter=>model.root.getObjectByName(`Head Grove ${letter}`));let endpoints=0,cavityRays=0,notchRays=0,lengthErrorMm=0,wireHeadTopMax=-Infinity;
 for(const y of [0,35,90,180,270])for(let angle=0;angle<=90;angle+=5){
  yaw.setAngle(y);pitch.setAngle(angle);model.update(0);model.root.updateMatrixWorld(true);
  fixed.forEach(([o,m])=>nearMatrix(o.matrixWorld,m,'base, USB and yaw output stay fixed'));
  nearMatrix(relative(a.rear,pitch.object3d),headFrame,'Power board belongs to the pitching head');nearMatrix(relative(a.adapter,yaw.object3d),adapterFrame,'Adapter belongs to yaw, independently of pitch');nearMatrix(relative(a.mechanics.pitchServo.group,yaw.object3d),motorFrame,'pitch motor body stays on the neck');nearMatrix(relative(a.mechanics.pitchServo.output,pitch.object3d),outputFrame,'pitch output splines rotate with the arm');
  if(y===0){
   const plastic=['head-shell','neck-cradle','servo-rear-cover','servo-side-cover'].map(name=>({name,inverse:model.parts[name].matrixWorld.clone().invert()})),touchInverse=touch.matrixWorld.clone().invert();
   for(const {mesh,points}of [...insertBoards,...adapterInserts])for(const point of points){
    const world=mesh.localToWorld(point.clone());for(const {name,inverse}of plastic){assert.ok(!insideSolid(world.clone().applyMatrix4(inverse),source[name]),`${mesh.name} at pitch ${angle}: actual insert volume ${world.clone().applyMatrix4(inverse).toArray().map(n=>n.toFixed(3))} clears official ${name}`);insertSolidContainmentSamples++;}
    if(adapterInserts.some(insert=>insert.mesh===mesh)){assert.ok(!insideSolid(world.clone().applyMatrix4(touchInverse),touchSolid),`${mesh.name} at pitch ${angle}: actual Adapter connector clears moving Touch PCB`);adapterTouchSamples++;}
   }
  }
  if(y===0)for(const {wire}of a.adapter.servoLeads)for(let k=2;k<32;k+=2){const world=wire.localToWorld(wire.geometry.parameters.path.getPointAt(k/32)),head=a.rear.worldToLocal(world);for(const offset of [[0,0,0],[0,.2,0],[0,0,.2]]){assert.ok(!insideSolid(head.clone().add(V(offset)),source['head-shell']),`${wire.name} at pitch ${angle}: static lead sample ${head.clone().add(V(offset)).toArray().map(n=>n.toFixed(2))} clears the moving official head shell`);servoLeadClearanceSamples++;}}
  for(let i=0;i<7;i++){
   const wire=a.harness.wires[i],upper=a.rear.upperHarness.contacts[i].getWorldPosition(new THREE.Vector3()),lower=a.adapter.lowerHarness.contacts[i].getWorldPosition(new THREE.Vector3());assert.ok(meshEndpoint(wire,false).distanceTo(upper)<EPS,'actual upper tube-ring center meets moving terminal');assert.ok(meshEndpoint(wire,true).distanceTo(lower)<EPS,'actual lower tube-ring center meets yaw terminal');endpoints+=2;
   lengthErrorMm=Math.max(lengthErrorMm,Math.abs(wire.geometry.parameters.path.getLength()-lengths[i]));assert.ok(lengthErrorMm<.01,'loom slack folds without visual stretching');
   for(let k=2;k<=62;k++){
    const local=wire.geometry.parameters.path.getPointAt(k/64),world=wire.localToWorld(local.clone()),head=a.rear.worldToLocal(world.clone());wireHeadTopMax=Math.max(wireHeadTopMax,head.y);
    assert.ok(local.y>13,'seven-wire loom clears the neck servo packages');assert.ok(Math.abs(local.x)<18,'slack stays between the moving head cheeks');assert.ok(head.z<14.85,'loom remains behind Power PCB, not through the board');
    assert.ok(!(head.y>33.08&&head.y<34.12&&head.z> -28.22&&head.z<9.22&&Math.abs(head.x)<23.72),'loom insulation clears the actual Touch PCB throughout pitch');
   }
  }
  for(let j=0;j<2;j++){
   const g=groves[j],letter=j?'C':'B',port=model.port(j?'port-c':'port-b');
   for(let i=0;i<4;i++){assert.equal(localHit(model.root,g,(i-1.5)*2,-.15)?.object.name,`Head Grove ${letter} contact ${i+1}`);cavityRays++;}
   for(const [x,z]of [[0,0],[-3,-1.1],[3,-1.1],[-3,1.1],[3,1.1]]){const h=localHit(model.root,g,x,z);assert.equal(h?.object.name,`Head Grove ${letter} backstop`);assert.ok(Math.abs(h.distance-10.18)<.02,'full 5.18mm Grove channel');cavityRays++;}
   const normal=new THREE.Vector3(0,1,0).applyQuaternion(port.object3d.getWorldQuaternion(new THREE.Quaternion())),physicalNormal=new THREE.Vector3(0,0,1).transformDirection(g.matrixWorld);assert.ok(normal.distanceTo(physicalNormal)<EPS,'interaction frame follows physical mouth');assert.ok(port.object3d.getWorldPosition(new THREE.Vector3()).distanceTo(g.getWorldPosition(new THREE.Vector3()))<EPS);
   for(const x of [-4.9,0,4.9])for(const ny of [29.6,31,32.5]){const origin=a.rear.localToWorld(new THREE.Vector3((j?11:-11)+x,ny,-40)),dir=new THREE.Vector3(0,0,1).transformDirection(a.rear.matrixWorld);assert.equal(hits(pcb,origin,dir).length,0,'real PCB edge notch clears all of the Grove housing');notchRays++;}
  }
  if(y===0&&[0,45,90].includes(angle))poses.push({yawDeg:y,pitchDeg:angle,envelope:envelope(model.root)});
 }
 assert.ok(wireHeadTopMax<33.08,'measured loom sweep stays below Touch board');
 yaw.setAngle(0);pitch.setAngle(0);model.update(0);model.root.updateMatrixWorld(true);
 for(let j=0;j<2;j++)for(let i=0;i<4;i++){
  const letter=j?'C':'B',bend=model.root.getObjectByName(`Head Grove ${letter} contact bend ${i+1}`),tail=model.root.getObjectByName(`Head Grove ${letter} PCB tail ${i+1}`);
  assert.ok(new THREE.Box3().setFromObject(bend).intersectsBox(new THREE.Box3().setFromObject(groves[j].children[6+i])),'bent contact joins actual housing pin');assert.ok(new THREE.Box3().setFromObject(tail).intersectsBox(new THREE.Box3().setFromObject(bend)),'L contact pieces join');
  const landing=tail.getWorldPosition(new THREE.Vector3());assert.ok(cast(pcb,[landing.x,landing.y,30],[0,0,-1]),'Grove tail lands below the PCB notch');
 }
 const usbHit=localHit(model.root,a.baseUsb,0,.85);assert.equal(usbHit?.object.name,'USB-C dielectric backstop');assert.ok(Math.abs(usbHit.distance-11.5)<.02,'base USB has a real 6.5mm cavity');
 assert.equal(cast(model.root,[0,45,10.25],[0,-1,0])?.object.name,'Top IR receiver lens');assert.equal(cast(model.root,[0,45,14.5],[0,-1,0])?.object.name,'Top IR carrier PCB');
 assert.equal(model.list('button').length,2,'existing Core buttons remain available');assert.equal(model.display('lcd').width,320);assert.equal(model.display('lcd').height,240);
 assert.equal(a.harness.update(),false,'stationary loom needs no continuing geometry work');
 model.root.traverse(o=>{if(o.isMesh)for(const n of o.geometry.attributes.position?.array??[])assert.ok(Number.isFinite(n),'finite geometry after sweep');});
 for(const o of Object.values(source))o.geometry.dispose(),o.material.dispose();
 touchSolid.material.dispose();
 return {status:'pass',sourceEvidence,poseCount:95,actualMeshEndpoints:endpoints,headGroveCavityRays:cavityRays,pcbNotchRays:notchRays,insertSolidContainmentSamples,adapterTouchSamples,insertBoardSamples:insertBoards.map(({mesh,points})=>({name:mesh.name,points:points.length})),wireLengthErrorMm:lengthErrorMm,wireHeadTopMaxMm:wireHeadTopMax,constantWireLengthsMm:lengths,servoLeads:6,servoLeadClearanceSamples,poses,scope:'official enclosure retained; actual PCB/connector solid containment samples, real board depth and cross-pitch terminals; concealed stock servo seating and cable route are visual estimates, not complete interference/manufacturing/physics verification'};
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 const noop=()=>{},ctx=new Proxy({createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop}),measureText:()=>({width:20})},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});globalThis.document={createElement:()=>({getContext:()=>ctx})};const {StackChan}=await import('../src/devices/stackchan/index.js');const model=new StackChan();try{console.log(JSON.stringify(checkStackChanMovingAssembly(model),null,2));}finally{model.dispose();}
}
