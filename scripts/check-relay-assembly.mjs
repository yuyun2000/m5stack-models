import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {Device,Port} from '../src/core/index.js';
import {Model,GroveModule,TerminalPlug,spec} from '../src/units/relay/index.js';
import data from '../src/units/relay/geometry-data.js';

const v=a=>new THREE.Vector3(...a),near=(a,b,why,tolerance=2e-5)=>assert.ok(Math.abs(a-b)<tolerance,`${why}: ${a} vs ${b}`);
const visible=o=>o.isMesh&&o.material?.opacity!==0;
const shoot=(root,origin,direction)=>new THREE.Raycaster(v(origin),v(direction)).intersectObject(root,true).filter(h=>visible(h.object));
const bounds=root=>{const b=new THREE.Box3();root.traverse(o=>{if(visible(o))b.expandByObject(o)});return b;};
const point=(position,index,i)=>new THREE.Vector3().fromBufferAttribute(position,index?index.getX(i):i);

function closed(mesh,label='Each split native shell'){
 const p=mesh.geometry.attributes.position,index=mesh.geometry.index,edges=new Map(),key=p=>p.toArray().map(n=>Math.round(n*1e3)).join(',');
 for(let i=0;i<(index?.count??p.count);i+=3){const a=[0,1,2].map(k=>key(point(p,index,i+k)));for(let k=0;k<3;k++){const edge=[a[k],a[(k+1)%3]].sort().join('|');edges.set(edge,(edges.get(edge)??0)+1);}}
 assert.ok([...edges.values()].every(n=>n===2),`${label} is a closed solid before material containment`);
}

function plugDeckClearance(plug){
 const deck=plug.root.getObjectByName('Relay plug screw-access deck'),frame=plug.plugAssembly.frame,metal=[];
 plug.root.traverse(object=>{if(visible(object)&&object.material.metalness>.5)metal.push(object);});
 assert.ok(deck?.isMesh&&metal.length>20,'Actual molded deck and distinct metal parts are present');closed(deck,'Plug screw-access deck');
 const material=new THREE.MeshBasicMaterial({side:THREE.DoubleSide}),shadow=object=>{const s=new THREE.Mesh(object.geometry,material);s.matrixAutoUpdate=false;s.matrixWorld.copy(object.matrixWorld);return s;},deckSolid=shadow(deck),metals=metal.map(shadow),directions=[[.733,.312,.604],[-.381,.852,.359],[.213,-.527,.823]].map(a=>v(a).normalize()),ray=new THREE.Raycaster();
 const contains=(solid,p,direction)=>{ray.set(p,direction);const hits=ray.intersectObject(solid,false).filter(h=>h.distance>1e-6);return hits.filter((h,i)=>!i||h.distance-hits[i-1].distance>1e-5).length%2===1;};
 const global=(x,y,z)=>frame.localToWorld(v([x,y,z-spec.terminal.position[2]]));
 let regressionChecks=0,controlChecks=0,sampledChecks=0,disjointPairs=0;const topBands=[];
 try{
  // The old construction put both a pressure plate and cage side into the
  // plastic at z7.65. Confirm these are actual deck material, then require
  // every metal solid to leave that volume clear in all three directions.
  for(const x of spec.terminal.pinX)for(const [dx,label]of [[.2,'pressure plate'],[1.35,'cage side']])for(const direction of directions){
   const probe=global(x+dx,-2,7.65);assert.equal(contains(deckSolid,probe,direction),true,'Regression probe remains inside the unchanged molded deck');
   assert.ok(metals.every(s=>!contains(s,probe,direction)),`Metal ${label} cannot share the molded deck at ${probe.toArray()}`);regressionChecks++;
  }
  for(const object of metal){
   const s=shadow(object),box=bounds(object),deckBox=bounds(deck);closed(object,object.name);
   const q=object.geometry.attributes.position,index=object.geometry.index,center=box.getCenter(new THREE.Vector3()),samples=new Map(),add=p=>{p.lerp(center,.001);samples.set(p.toArray().map(n=>Math.round(n*1e5)).join(','),p);};
   for(let i=0;i<q.count;i++)add(point(q,null,i).applyMatrix4(object.matrixWorld));for(let i=0;i<(index?.count??q.count);i+=3){const a=[0,1,2].map(k=>point(q,index,i+k).applyMatrix4(object.matrixWorld));add(a[0].add(a[1]).add(a[2]).multiplyScalar(1/3));}
   if(!box.intersectsBox(deckBox))disjointPairs++;
   for(const p of samples.values())for(const direction of directions){assert.equal(contains(deckSolid,p,direction),false,`${object.name} material enters molded screw deck at ${p.toArray()}`);sampledChecks++;}
   // Reverse-direction surface sampling also detects a plastic island that
   // is wholly contained inside an added metal solid.
   if(box.intersectsBox(deckBox)){const p=deck.geometry.attributes.position,i=deck.geometry.index;for(let n=0;n<(i?.count??p.count);n+=3){const a=[0,1,2].map(k=>point(p,i,n+k).applyMatrix4(deck.matrixWorld)),probe=a[0].add(a[1]).add(a[2]).multiplyScalar(1/3);if(!box.containsPoint(probe))continue;for(const direction of directions){assert.equal(contains(s,probe,direction),false,`Molded deck surface enters ${object.name}`);sampledChecks++;}}}
   if(/plug pressure plate|plug clamp cage side|plug clamp rear web/.test(object.name)){near(box.max.z,7.51,'Concealed clamp metal top');near(deckBox.min.z-box.max.z,.09,'Explicit metal-to-molded-deck clearance');topBands.push({part:object.name,metalTopZ:box.max.z,deckBottomZ:deckBox.min.z,gapMm:deckBox.min.z-box.max.z});}
  }
  // Positive controls prove the pressure plate and side cage still have
  // material below the new gap, rather than passing by losing the parts.
  for(const x of spec.terminal.pinX)for(const [dx,z,name]of [[.2,7.4,'Relay plug pressure plate'],[1.35,6.75,'Relay plug clamp cage side']])for(const direction of directions){const probe=global(x+dx,-2,z);assert.ok(metal.some((o,i)=>o.name===name&&contains(metals[i],probe,direction)),`${name} retains its real metal volume below the deck`);assert.equal(contains(deckSolid,probe,direction),false);controlChecks++;}
  return {status:'pass',metalParts:metal.length,regressionChecks,positiveControls:controlChecks,sampledChecks,disjointBoundingPairs:disjointPairs,metalTopZ:7.51,moldedDeckBottomZ:7.6,minimumClampDeckGapMm:.09,topBands,scope:'Actual deck/metal solids, three-direction regression and bidirectional material samples; hidden gap is an appearance estimate, not a manufacturing tolerance'};
 }finally{material.dispose();}
}

function nativeSolids(original){
 // The original assembled STL contains touching front/back shells. Its 25
 // four-triangle contact edges must not be treated as one parity volume: that
 // loses coincident entry/exit surfaces and produces false positives.
 const g=original.geometry,p=g.attributes.position,index=g.index,count=index.count/3,parent=Array.from({length:count},(_,i)=>i),edges=new Map();
 const find=i=>parent[i]===i?i:parent[i]=find(parent[i]);
 for(let t=0;t<count;t++){
  const keys=[0,1,2].map(k=>point(p,index,t*3+k).toArray().map(n=>Math.round(n*1e4)).join(','));
  for(let k=0;k<3;k++){const key=[keys[k],keys[(k+1)%3]].sort().join('|');if(!edges.has(key))edges.set(key,[]);edges.get(key).push(t);}
 }
 for(const a of edges.values())if(a.length===2)parent[find(a[0])]=find(a[1]);
 const groups=new Map();for(let t=0;t<count;t++){const key=find(t);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(t);}
 const large=[...groups.values()].filter(a=>a.length>100),patches=[...groups.values()].filter(a=>a.length<=100);
 assert.deepEqual(large.map(a=>a.length),[1616,1884]);assert.deepEqual(patches.map(a=>a.length),[2,2,2,2]);
 for(const patch of patches){const q=[0,1,2].map(k=>point(p,index,patch[0]*3+k)),nz=q[1].sub(q[0]).cross(q[2].sub(q[0])).z;assert.ok(Math.abs(nz)>.01);large[nz<0?0:1].push(...patch);}
 assert.deepEqual(large.map(a=>a.length),[1620,1888],'Exact original front/back triangle counts, no source triangles deleted');
 return large.map(triangles=>{const geometry=g.clone();geometry.setIndex(triangles.flatMap(t=>[index.getX(t*3),index.getX(t*3+1),index.getX(t*3+2)]));const mesh=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));mesh.matrixAutoUpdate=false;mesh.matrixWorld.copy(original.matrixWorld);closed(mesh);return mesh;});
}

function materialClearance(model){
 const shadows=nativeSolids(model.parts.housing),directions=[[.733,.312,.604],[-.381,.852,.359],[.213,-.527,.823]].map(a=>v(a).normalize()),ray=new THREE.Raycaster(),report=[];
 let total=0,gridPoints=0;
 try{
  model.root.traverse(object=>{
   if(!visible(object)||object.userData.source==='official-structure')return;
   const position=object.geometry.attributes.position,index=object.geometry.index,center=bounds(object).getCenter(new THREE.Vector3()),samples=new Map();
   // A tiny inward nudge avoids calling tangent contact a solid overlap.
   const add=(p,nudge=true)=>{if(nudge)p.lerp(center,.001);samples.set(p.toArray().map(n=>Math.round(n*1e5)).join(','),p);};
   for(let i=0;i<position.count;i++)add(point(position,null,i).applyMatrix4(object.matrixWorld));
   for(let i=0;i<(index?.count??position.count);i+=3){const q=[0,1,2].map(k=>point(position,index,i+k).applyMatrix4(object.matrixWorld));add(q[0].add(q[1]).add(q[2]).multiplyScalar(1/3));}
   if(object===model.relayAssembly.pcb){
    for(let x=-9.13;x<=9.2;x+=.5)for(let y=-21.13;y<=21.2;y+=.5){if(!shoot(object,[x,y,20],[0,0,-1]).length)continue;for(const z of [-2.099,-1.7,-1.301]){add(v([x,y,z]),false);gridPoints++;}}
   }
   for(const p of samples.values())for(const direction of directions)for(const shadow of shadows){ray.set(p,direction);const hits=ray.intersectObject(shadow,false).filter(h=>h.distance>1e-6),unique=hits.filter((h,i)=>!i||h.distance-hits[i-1].distance>1e-5);assert.equal(unique.length%2,0,`${object.name||object.geometry.type} enters original source shell at ${p.toArray()}`);total++;}
   report.push({name:object.name||object.geometry.type,samples:samples.size});
  });
  return {nativeClosedSolids:shadows.map(s=>s.geometry.index.count/3),objects:report.length,uniqueSurfaceAndVolumePoints:report.reduce((n,r)=>n+r.samples,0),boardGridPoints:gridPoints,containmentChecks:total,scope:'Three-direction sampled exclusion against each closed native solid; inferred hidden geometry is not manufacturing CAD'};
 }finally{for(const s of shadows){s.geometry.dispose();s.material.dispose();}}
}

export async function checkRelayAssembly(){
 const model=new Model(),owned=[];let rays=0,screwPoses=0;owned.push(model);
 try{
  model.root.updateMatrixWorld(true);assert.equal(model.meta.sku,'U023');assert.deepEqual(model.meta.nominalMm,[24,48,8]);assert.deepEqual(model.meta.size,[24,48,14.6]);
  assert.equal(data.length,1);assert.equal(data[0].triangles,3508);const native=model.parts.housing,shape=native.geometry.attributes.position.array.slice(),frame=native.matrixWorld.clone();
  for(const [key,array]of [['position',native.geometry.attributes.position.array],['normal',native.geometry.attributes.normal.array],['index',native.geometry.index.array]])assert.equal(Buffer.compare(Buffer.from(array.buffer,array.byteOffset,array.byteLength),Buffer.from(data[0][key],'base64')),0,'All original source coordinates, normals and triangle indices remain byte-identical');
  assert.ok(native.matrixWorld.equals(new THREE.Matrix4()),'Native assembled shell is not moved or scaled');
  const shellSize=bounds(native).getSize(new THREE.Vector3());spec.cadEnvelopeMm.forEach((n,i)=>near(shellSize.getComponent(i),n,'Native shell envelope'));
  const size=bounds(model.root).getSize(new THREE.Vector3());spec.visualEnvelopeMm.forEach((n,i)=>near(size.getComponent(i),n,'Assembled drawing envelope plus recessed rear screw',.06));
  near(bounds(model.relayAssembly.package).max.z,10.6,'14.6 mm drawing depth from native -4 mm rear');
  near(bounds(model.relayAssembly.package).getSize(new THREE.Vector3()).x,15.5,'HK4100F package width');near(bounds(model.relayAssembly.package).getSize(new THREE.Vector3()).y,10.5,'HK4100F package height');
  assert.equal(model.list('led').length,0,'Unresolved status-lamp documentation cannot invent a visible LED');assert.equal(model.list('button').length,0,'Sealed relay internals do not acquire a fabricated actuator');
  assert.equal(model.list('port').length,2);assert.ok(model.find('sensor'));assert.equal(model.port('terminal').module,null,'The default view retains the real open fixed socket');
  const terminal=model.port('terminal');assert.equal(terminal.connector,'ht3.96-3p');assert.deepEqual(terminal.pins.map(p=>p.name),['COM','NO','NC']);assert.ok(v([0,1,0]).applyQuaternion(terminal.object3d.quaternion).distanceTo(v([0,0,1]))<1e-6,'Load port mates outward from the front');
  for(const [i,x]of spec.terminal.pinX.entries()){assert.equal(terminal.pinAt(v([x,0,0])).n,i+1);const first=shoot(model.root,[x,9.05,20],[0,0,-1])[0];assert.equal(first?.object.name,'Relay fixed terminal tapered contact tip');near(first.point.z,5.65,'Three real exposed contact tips');rays++;}
  for(const x of [-1.98,1.98]){const hit=shoot(model.root,[x,9.05,20],[0,0,-1])[0];assert.equal(hit?.object.name,'Relay fixed terminal floor');near(hit.point.z,.1,'Fixed socket has an 8.2 mm actual open cavity');rays++;}
  for(const x of [-7,-3,0,3,7])for(const y of [-5,0,4]){assert.equal(shoot(model.root,[x,y,20],[0,0,-1])[0]?.object.name,'Relay sealed HK4100F housing','Real external relay package closes the unchanged native opening');rays++;}
  for(const x of [-8,8])for(const [dx,dy]of [[0,0],[-1.5,0],[1.5,0],[0,-1.5],[0,1.5]]){assert.equal(shoot(model.root,[x+dx,-12+dy,30],[0,0,-1]).length,0,'Both original LEGO bores remain open through all new layers');rays++;}
  assert.equal(shoot(model.relayAssembly.pcb,[0,-20,20],[0,0,-1]).length,0,'PCB has a real external Grove notch');
  assert.ok(v([0,1,0]).applyQuaternion(model.port('grove').object3d.quaternion).distanceTo(v([0,-1,0]))<1e-6);near(model.port('grove').object3d.position.z,1.4,'5.2 mm Grove opening aligns to unchanged 8 mm chassis');
  const mouth=shoot(model.root,[0,-28,1.4],[0,1,0])[0];assert.ok(mouth&&mouth.point.y>-20&&mouth.object.parent===model.relayAssembly.grove,'Grove mouth remains a deep real channel');rays++;
  const plug=new TerminalPlug();terminal.attach(plug);model.root.updateMatrixWorld(true);assert.equal(model.list('joint').length,3);near(bounds(plug.root).max.z,8.9,'12.9 mm accessory drawing depth from native rear');
  for(const [i,x]of spec.terminal.pinX.entries()){
   const foot=plug.root.getObjectByName('Relay plug bored mating foot');assert.equal(shoot(foot,[x,9.05,3],[0,0,1]).length,0,'Each fixed pin has an actual open mating channel');rays++;
   const access=shoot(model.root,[x,9.05,20],[0,0,-1])[0];assert.equal(access?.object.name,'Relay plug screw slot floor','Front deck contains actual recessed screw bores and tool slots');near(access.point.z,8,'Screw slot floor is below the real 8.3 mm head');rays++;
   const entry=shoot(plug.root,[x,4.35,6.75],[0,1,0])[0];assert.equal(entry?.object.name,'Relay plug clamp rear web','Side wire entry is a real deep channel with a metal clamp');assert.ok(entry.point.y>10.6,'Wire-entry cavity has modeled depth');rays++;
   const notch=shoot(model.relayAssembly.terminal,[x,4.35,6.75],[0,1,0])[0];assert.ok(notch?.point.y>12.8,'Original-style scalloped wall leaves wire entry clear');rays++;
   const joint=plug.get(`screw-${i+1}`),head=joint.object3d.children[0],neutral=head.matrixWorld.clone();assert.equal(joint.continuous,false);assert.equal(joint.limitsDeg,null);assert.throws(()=>joint.set({rpm:1}),RangeError);
   for(const angleDeg of [-120,-45,0,37,90,170]){model.handle({type:'joint',target:`terminal/screw-${i+1}`,angleDeg});model.root.updateMatrixWorld(true);near(joint.angleDeg,angleDeg,'External screw angle');assert.ok(native.matrixWorld.equals(frame));assert.deepEqual(native.geometry.attributes.position.array,shape);screwPoses++;}
   joint.setAngle(0);model.root.updateMatrixWorld(true);assert.ok(head.matrixWorld.equals(neutral),'Each real screw returns exactly without axial/clamp movement');
  }
  const plugDeck=plugDeckClearance(plug),material=materialClearance(model),retained=terminal.detach({dispose:false});assert.ok(retained===plug);assert.equal(model.list('joint').length,0);terminal.attach(retained);assert.equal(model.list('joint').length,3);terminal.detach();assert.equal(model.list('joint').length,0);assert.equal(model.update(1),false,'No relay/LED/electrical behavior runs automatically');
  assert.throws(()=>model.handle({type:'sensor',target:'sensor',values:{on:true}}),'Appearance anchor does not implement relay drive');
  const configured=new Model({terminalPlug:true});owned.push(configured);assert.ok(configured.port('terminal').module instanceof TerminalPlug,'Public constructor option builds the exact supplied detachable accessory');
  const host=new Device(),port=host.add(new Port({id:'unit',connector:'grove',rotation:[.1,.2,-.3]}));owned.push(host);const module=new GroveModule({cableLength:80,terminalPlug:true});port.attach(module);host.root.updateMatrixWorld(true);assert.ok(host.get('unit/sensor')===module.get('sensor'));assert.ok(host.get('unit/terminal')===module.port('terminal'));assert.equal(host.get('unit/cable').getState().wireCount,4);
  host.handle({type:'joint',target:'unit/terminal/screw-2',angleDeg:58});near(host.get('unit/terminal/screw-2').angleDeg,58,'Grove and terminal nested paths reach the actual attached screw');host.handle({type:'detach',target:'unit/terminal'});assert.equal(module.port('terminal').module,null);assert.ok(host.get('unit/sensor')===module.get('sensor'),'Detaching the plug preserves the Unit and its Grove route');port.detach();
  return {status:'pass',sku:'U023',nativeTriangles:3508,nativeEnvelopeMm:shellSize.toArray(),defaultVisibleEnvelopeMm:size.toArray(),drawingAssembledMm:[24,48,14.6],accessoryDepthMm:12.9,rays,screwPoses,defaultTerminalPlug:false,detachableAccessory:true,pinPitchMm:3.96,pinOrder:['COM','NO','NC'],material,plugDeck,scope:'Actual mesh/API, sampled native-solid exclusion and added deck/metal separation only; concealed dimensions estimated, no electrical, relay physics, clamp mechanics, production fit or browser proof'};
 }finally{for(const m of owned.reverse())m.dispose();}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkRelayAssembly(),null,2));
