import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {Device,Port} from '../src/core/index.js';
import {Model,GroveModule} from '../src/units/ncir/index.js';
import {GroveModule as HubModule} from '../src/units/hub/index.js';
import data from '../src/units/ncir/geometry-data.js';

const v=a=>new THREE.Vector3(...a),sha=b=>createHash('sha256').update(b).digest('hex');
const near=(a,b,label,epsilon=3e-5)=>assert.ok(Math.abs(a-b)<epsilon,`${label}: ${a} / ${b}`);
const visible=o=>o.isMesh&&o.visible&&!Array.isArray(o.material)&&o.material?.opacity!==0;
const bounds=o=>new THREE.Box3().setFromObject(o);
const shoot=(o,p,d,recursive=false)=>new THREE.Raycaster(v(p),v(d)).intersectObject(o,recursive).filter(h=>visible(h.object));
const decode=(s,Type)=>new Type(Uint8Array.from(atob(s),c=>c.charCodeAt(0)).buffer);

// This probe is only used on new individually closed meshes, never on the
// native touching-shell aggregate. Disagreement is an error, not empty space.
function materialProbe(){
 const material=new THREE.MeshBasicMaterial({side:THREE.DoubleSide}),cache=new Map();
 const directions=[[.733,.312,.604],[-.381,.852,.359],[.213,-.527,.823]].map(a=>v(a).normalize());
 let queries=0;
 const classify=(o,p)=>{
  queries++;
  if(!cache.has(o)){const shadow=new THREE.Mesh(o.geometry,material);shadow.matrixAutoUpdate=false;shadow.matrixWorld.copy(o.matrixWorld);cache.set(o,shadow);}
  const parity=[];
  for(const direction of directions){
   const hits=new THREE.Raycaster(p,direction).intersectObject(cache.get(o),false),distances=[];
   for(const h of hits){if(h.distance<1e-5)return 'boundary';if(!distances.length||h.distance-distances.at(-1)>1e-5)distances.push(h.distance);}
   parity.push(distances.length%2);
  }
  return parity.every(n=>n===1)?'inside':parity.every(n=>n===0)?'outside':'unknown';
 };
 return {classify,get queries(){return queries;},dispose:()=>material.dispose()};
}

function closedMesh(object){
 const p=object.geometry.attributes.position,index=object.geometry.index,edges=new Map();
 const key=i=>[p.getX(i),p.getY(i),p.getZ(i)].map(n=>Math.round(n*1e5)).join(',');
 let faces=0;
 for(let i=0;i<(index?.count??p.count);i+=3){
  const ids=[0,1,2].map(k=>key(index?index.getX(i+k):i+k));
  if(new Set(ids).size<3)continue;
  faces++;
  for(let k=0;k<3;k++){const start=ids[k],end=ids[(k+1)%3],pair=[start,end].sort().join('|'),row=edges.get(pair)??{count:0,balance:0};row.count++;row.balance+=start<end?1:-1;edges.set(pair,row);}
 }
 assert.ok(faces>0,`${object.name} has real faces`);
 assert.equal([...edges.values()].filter(r=>r.count!==2).length,0,`${object.name} is independently closed after seam welding`);
 assert.equal([...edges.values()].filter(r=>r.balance!==0).length,0,`${object.name} has consistent cap/sidewall winding after seam welding`);
}

export async function checkNCIRAssembly(){
 const assemblyUrl=new URL('../src/units/ncir/assembly.js',import.meta.url),assemblySha256=sha(await fs.readFile(assemblyUrl));
 const owners=[],resources=new Map(),nativeSnapshots=[],probe=materialProbe();
 const originalGeometryDispose=THREE.BufferGeometry.prototype.dispose,originalMaterialDispose=THREE.Material.prototype.dispose;
 let captureRetired=false,retiredAtBuild=0,failure,report,rays=0,closedMeshes=0,poseCases=0;
 const resource=o=>{if(o&&!resources.has(o))resources.set(o,{count:0,type:o.isBufferGeometry?'geometry':'material'});};
 THREE.BufferGeometry.prototype.dispose=function(){if(captureRetired||resources.has(this)){if(captureRetired&&!resources.has(this))retiredAtBuild++;resource(this);resources.get(this).count++;}return originalGeometryDispose.call(this);};
 THREE.Material.prototype.dispose=function(){if(captureRetired||resources.has(this)){if(captureRetired&&!resources.has(this))retiredAtBuild++;resource(this);resources.get(this).count++;}return originalMaterialDispose.call(this);};
 const track=model=>{
  (model.unitFrame?.object3d??model.root).traverse(o=>{if(!o.isMesh)return;resource(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])resource(m);});
  if(model.cable)for(const wire of model.cable.wires){resource(wire.geometry);resource(wire.material);}
 };
 const build=(Class,options)=>{let model;captureRetired=true;try{model=new Class(options);owners.push(model);model.root.updateMatrixWorld(true);}finally{captureRetired=false;}track(model);return model;};
 const native=model=>{
  for(const part of data){
   const mesh=model.parts[part.name];assert.ok(mesh?.isMesh);
   for(const [key,Type]of [['position',Float32Array],['normal',Float32Array],['index',Uint32Array]]){
    const actual=key==='index'?mesh.geometry.index.array:mesh.geometry.attributes[key].array;
    assert.deepEqual(actual,decode(part[key],Type),`Original NCIR ${key} remains unchanged`);nativeSnapshots.push({mesh,key,copy:actual.slice()});
   }
  }
 };
 const checkNative=()=>{for(const s of nativeSnapshots)assert.deepEqual(s.key==='index'?s.mesh.geometry.index.array:s.mesh.geometry.attributes[s.key].array,s.copy,'Native NCIR geometry is unchanged after Grove pose operations');};
 const endpoint=(module,port)=>{
  module.root.updateWorldMatrix(true,true);
  for(const [plug,socket]of [[module.cable.sourcePlug,port],[module.cable.targetPlug,module.port('grove')]]){
   assert.ok(plug.getWorldPosition(new THREE.Vector3()).distanceTo(socket.object3d.getWorldPosition(new THREE.Vector3()))<3e-5,'NCIR cable endpoint is at the real socket mouth');
   assert.ok(Math.abs(plug.getWorldQuaternion(new THREE.Quaternion()).dot(socket.object3d.getWorldQuaternion(new THREE.Quaternion())))>1-1e-9,'NCIR plug quaternion follows the actual port');
  }
  track(module);poseCases++;
 };
 const bareHost=()=>{const host=new Device();owners.push(host);host.root.position.set(7,-3,5);host.root.rotation.set(.12,-.27,.31);return {host,port:host.add(new Port({id:'grove',connector:'grove',position:[4,6,2],rotation:[.2,-.3,.4]}))};};
 try{
  assert.equal(sha(await fs.readFile(new URL('../src/units/ncir/geometry-data.js',import.meta.url))),'380cd829a765aa3eb784d50942782c8322fd13bc7de355d50b96d641ecb5fa73','Original NCIR source triangles are retained');
  assert.equal(sha(await fs.readFile(new URL('../src/units/ncir/cad-map.json',import.meta.url))),'e5a79a039db0ed3bd24475be36f6339efd578eefca73b0790010198f9309daea','Original NCIR source registration is retained');
  const model=build(Model),peer=build(Model);native(model);native(peer);
  assert.equal(model.meta.sku,'U028');assert.deepEqual(model.meta.size,[24,32,8.6]);
  assert.equal(model.get('sensor').meta.scope,'no-sensor-behavior');assert.equal(model.list('led').length,0);assert.equal(model.list('joint').length,0);assert.equal(model.update(1/60),false,'NCIR has no autonomous measurement or invented output');
  model.root.traverse(o=>{
   if(o.userData?.role==='printed-artwork')assert.ok(['official-raster','official-raster-film','reference-redraw'].includes(o.userData.artworkKind),'NCIR artwork must be source raster artwork or an identified reference redraw; unclassified photographic patches remain disabled');
  });
  const a=model.ncirAssembly,b=peer.ncirAssembly;assert.ok(a?.board&&a.window&&a.header&&a.body);
  assert.equal(a.board,model.parts.pcb);assert.equal(a.grovePort,model.port('grove'));assert.equal(a.grove,model.groveSocketAssembly.group);
  const physical=[a.board,a.body,a.window,a.header,...a.leads,...a.insulators,...a.pads,...a.fillets,...a.groveTails,...a.grovePads,...a.groveFillets,...Object.values(model.groveSocketAssembly.parts)];
  for(const object of physical){assert.ok(visible(object));assert.ok(!object.material.map,'NCIR physical details do not depend on photographic patches');closedMesh(object);closedMeshes++;const p=object.geometry.attributes.position;for(let i=0;i<p.count;i++)assert.ok([p.getX(i),p.getY(i),p.getZ(i)].every(Number.isFinite));}
  for(const key of ['body','window','header','board']){assert.notEqual(a[key].geometry,b[key].geometry,'Instances own their actual physical geometry');assert.notEqual(a[key].material,b[key].material,'Instances own their materials');}
  const shell=bounds(model.parts.housing).getSize(new THREE.Vector3());near(shell.x,24,'Original shell width');near(shell.y,32,'Original shell height');near(shell.z,8,'Original shell thickness');
  const box=bounds(a.body),wb=bounds(a.window),hb=bounds(a.header),pcb=bounds(a.board);
  near(box.max.z,4.6,'Actual raised crown top');near(hb.min.z,.5,'Actual flange underside');near(box.max.z-hb.min.z,4.1,'Base to crown is the manufacturer H4.10');near(box.getSize(new THREE.Vector3()).x,8.2,'Actual outer can diameter');
  near(wb.getSize(new THREE.Vector3()).x,3.5,'Actual optical window diameter');assert.ok(wb.max.z<box.max.z&&wb.min.z>4.1,'Optical filter is a closed recessed solid');
  assert.equal(probe.classify(a.window,v([0,8,4.34])),'inside','The optical filter has actual material thickness');assert.equal(a.window.material.emissive.getHex(),0,'Passive IR window has no invented visible emission');
  assert.equal(probe.classify(a.body,v([3.5,8,2])),'inside','The can extends inside the housing as real metal');assert.equal(probe.classify(a.body,v([0,8,2])),'outside','The central optical aperture is not a solid barrel');
  near(pcb.min.z,-.3,'Engineering PCB bottom');near(pcb.max.z,.5,'Engineering PCB top meets flange base');near(pcb.getSize(new THREE.Vector3()).x,20.8,'Actual conservative PCB width');near(pcb.getSize(new THREE.Vector3()).y,27.6,'Actual conservative PCB height');
  const top=shoot(a.body,[3.5,8,10],[0,0,-1])[0];assert.ok(top);near(top.point.z,4.1,'H3.60 ends at outer shoulder from the same flange base');rays++;
  for(const [dx,dy]of [[0,0],[1.3,0],[-1.3,0],[0,1.3],[0,-1.3]]){
   assert.equal(shoot(a.body,[dx,8+dy,10],[0,0,-1]).length,0,'Can has a real central optical aperture');
   const hit=shoot(model.root,[dx,8+dy,10],[0,0,-1],true)[0];assert.equal(hit?.object,a.window,'Real solid optical filter closes the original sensor opening');near(hit.point.z,wb.max.z,'Recessed optical surface');rays+=2;
  }
  // This is an intended assembly clearance, backed at depth by the flange.
  // It must not be hidden by widening the can into a fictitious full barrel.
  for(let i=0;i<16;i++){
   const t=i*Math.PI/8,p=[4.4*Math.cos(t),8+4.4*Math.sin(t),10],hit=shoot(model.root,p,[0,0,-1],true)[0];
   assert.equal(hit?.object,a.header,'Real radial clearance is backed by the deep physical flange');near(hit.point.z,1,'Visible gap terminates at the reconstructed flange');rays++;
  }
  assert.ok(shoot(a.header,[0,12.9,2],[0,0,-1])[0],'Reference tab is physical flange geometry');rays++;
  assert.equal(a.leads.length,4);assert.equal(a.insulators.length,4);assert.equal(a.pads.length,4);assert.equal(a.fillets.length,4);
  const pitch=5.08/(2*Math.sqrt(2)),expected=[[-pitch,8+pitch],[-pitch,8-pitch],[pitch,8-pitch],[pitch,8+pitch]],names=['SCL','SDA','VDD','VSS'];
  for(let i=0;i<4;i++){
   const [x,y]=expected[i],lead=a.leads[i],seal=a.insulators[i],pad=a.pads[i],fillet=a.fillets[i],lb=bounds(lead);
   near(lb.getCenter(new THREE.Vector3()).x,x,'Bottom-view pin mirror X');near(lb.getCenter(new THREE.Vector3()).y,y,'Bottom-view pin mirror Y');near(lb.getSize(new THREE.Vector3()).x,.45,'Real lead diameter');near(lb.min.z,-.95,'Installed clipped lead endpoint');assert.equal(lead.userData.pin,i+1);assert.equal(lead.userData.name,names[i]);
   near(lead.userData.bottomViewMm[0],-x,'Bottom-view pin metadata X');near(lead.userData.bottomViewMm[1],y-8,'Bottom-view pin metadata Y');
   assert.equal(shoot(a.board,[x,y,2],[0,0,-1]).length,0,'Each sensor lead uses an actual PCB drill');
   assert.equal(shoot(a.header,[x,y,2],[0,0,-1]).length,0,'Each metal flange feedthrough is actually drilled');
   assert.equal(shoot(seal,[x,y,2],[0,0,-1]).length,0,'Glass seal has its real central conductor bore');
   assert.equal(shoot(pad,[x,y,2],[0,0,-1]).length,0,'Annular sensor pad has a true centre hole');
   assert.equal(shoot(fillet,[x,y,2],[0,0,-1]).length,0,'Sensor solder does not falsely plug the conductor centre');
   const boardWall=shoot(a.board,[x,y,.1],[1,0,0])[0];assert.ok(boardWall);near(boardWall.distance,.35,'Actual sensor drill radius');
   assert.equal(probe.classify(lead,v([x,y,.1])),'inside','Positive conductor control');assert.equal(probe.classify(a.board,v([x,y,.1])),'outside','PCB drill is true material negative');
   assert.equal(probe.classify(seal,v([x+.5,y,.75])),'inside','Feedthrough glass is an actual annulus');assert.equal(probe.classify(a.header,v([x+.5,y,.75])),'outside','Metal flange does not fill its glass feedthrough');
   assert.equal(probe.classify(pad,v([x+.5,y,-.33])),'inside','Positive annular copper pad control');assert.equal(probe.classify(fillet,v([x+.4,y,-.5])),'inside','Positive physical sensor solder control');
   const support=shoot(a.board,[x+.5,y,2],[0,0,-1])[0];assert.ok(support);near(support.point.z,.5,'Positive board adjacent to each real drill');
   const solderHit=shoot(fillet,[x,y,-.75],[1,0,0])[0];assert.ok(solderHit);near(solderHit.distance,.225,'Solder bore contacts the actual round lead');rays+=8;
  }
  for(const x of [-8,8])for(const [dx,dy]of [[0,0],[1.5,0],[-1.5,0],[0,1.5],[0,-1.5]]){assert.equal(shoot(model.root,[x+dx,-4+dy,20],[0,0,-1],true).length,0,'LEGO pass-through is clear through all physical layers');rays++;}
  assert.equal(shoot(a.board,[0,-4,2],[0,0,-1]).length,0,'Central fastener relief is a real PCB hole');rays++;
  const socket=model.groveSocketAssembly;near(a.grovePort.object3d.position.z,1.4,'U028 own drawing mouth centre');
  const sb=bounds(a.grove);near(sb.min.z,-1.2,'U028 mouth floor');near(sb.max.z,4,'U028 mouth top');near(sb.getSize(new THREE.Vector3()).x,10,'Actual U028 Grove width');
  assert.deepEqual([a.grovePort.highlightMesh.geometry.parameters.width,a.grovePort.highlightMesh.geometry.parameters.height,a.grovePort.highlightMesh.geometry.parameters.depth],[10,1,5.2],'Picking volume follows the current physical mouth');
  for(const x of [-3,-1,1,3]){const hit=shoot(model.root,[x,-14.2,20],[0,0,-1],true)[0];assert.equal(hit?.object,socket.parts[`contact ${(x+3)/2+1}`],'Four short contacts visible through the true open top');rays++;}
  for(const [p,name]of [[[0,-14.2,20],'floor'],[[4.65,-12,20],'side rail right'],[[3.85,-12,20],'upper lip right'],[[-3.85,-12,20],'upper lip left'],[[0,-11.5,20],'short locking tongue'],[[0,-9.5,20],'rear wall']]){assert.equal(shoot(model.root,p,[0,0,-1],true)[0]?.object,socket.parts[name],'Open socket has physical floor, rails, tongue and rear web');rays++;}
  assert.equal(a.groveTails.length,8);assert.equal(a.grovePads.length,4);assert.equal(a.groveFillets.length,4);
  for(let i=0;i<4;i++){
   const x=-3+2*i,leg=a.groveTails[2*i+1],pad=a.grovePads[i],fillet=a.groveFillets[i];
   assert.equal(shoot(a.board,[x,-8.1,2],[0,0,-1]).length,0,'Grove leg has a real PCB drill');assert.equal(shoot(pad,[x,-8.1,2],[0,0,-1]).length,0,'Grove pad is annular');assert.equal(shoot(fillet,[x,-8.1,2],[0,0,-1]).length,0,'Grove solder retains a true square leg bore');
   const wall=shoot(a.board,[x,-8.1,.1],[1,0,0])[0];assert.ok(wall);near(wall.distance,.30,'Grove actual drilled radius');
   assert.equal(probe.classify(leg,v([x,-8.1,.1])),'inside','Positive square conductor control');assert.equal(probe.classify(a.board,v([x,-8.1,.1])),'outside','Negative square conductor drill control');
   for(const [axis,direction]of [[0,[1,0,0]],[1,[0,1,0]]]){const hit=shoot(fillet,[x,-8.1,-.5],direction)[0];assert.ok(hit);near(hit.distance,.16,`Grove square solder bore axis ${axis}`);rays++;}
   const adjacent=shoot(a.board,[x+.45,-8.1,2],[0,0,-1])[0];assert.ok(adjacent,'Positive PCB next to each Grove drill');rays+=5;
  }
  const one=bareHost(),module=build(GroveModule);native(module);one.port.attach(module);one.host.root.updateMatrixWorld(true);endpoint(module,one.port);
  const mouth=module.root.worldToLocal(module.port('grove').object3d.getWorldPosition(new THREE.Vector3()));assert.ok(mouth.distanceTo(v([0,35,0]))<3e-5,'Default module compensates the real revised input origin');
  for(const pose of [{position:[20,110,10],rotation:[.2,.3,.4]},{position:[-15,85,-3],rotation:[-.35,.27,-.6]}]){module.unitFrame.setPose(pose);one.host.root.updateMatrixWorld(true);endpoint(module,one.port);assert.ok(module.unitFrame.object3d.position.distanceTo(v(pose.position))<3e-5,'Explicit NCIR unit pose is not silently offset');}
  const q=module.unitFrame.object3d.quaternion.clone();module.unitFrame.setDistance(110);one.host.root.updateMatrixWorld(true);endpoint(module,one.port);assert.ok(module.unitFrame.object3d.quaternion.equals(q),'Distance control preserves chosen orientation');
  const explicit=build(GroveModule,{cableLength:72,unitPose:{position:[8,90,-9],rotation:[.15,-.25,.45]},cable:{slack:18}}),two=bareHost();two.port.attach(explicit);two.host.root.updateMatrixWorld(true);endpoint(explicit,two.port);near(explicit.cable.slack,18,'Explicit cable slack');assert.deepEqual(explicit.unitFrame.object3d.position.toArray(),[8,90,-9]);
  const nose=explicit.cable.targetPlug.getObjectByName('Grove plug four-chamber housing');assert.ok(nose);
  for(const p of [[4.15,-.65,0],[-4.15,-.65,0],[0,-.65,-.9]]){
   const world=explicit.port('grove').object3d.localToWorld(v(p));assert.equal(probe.classify(nose,world),'inside','Insertion regression control is real plug material');
   for(const target of [...Object.values(explicit.groveSocketAssembly.parts),explicit.ncirAssembly.board])assert.equal(probe.classify(target,world),'outside','Real inserted plug clears NCIR socket and PCB at historical interference points');
  }
  const three=bareHost(),hub=new HubModule({cableLength:70});owners.push(hub);three.port.attach(hub);const nested=build(GroveModule,{cableLength:65}),out=hub.port('grove-1');out.attach(nested);three.host.root.updateMatrixWorld(true);endpoint(nested,out);
  assert.equal(three.host.get('grove/grove-1/sensor'),nested.get('sensor'),'Nested public sensor anchor remains addressable');nested.unitFrame.setPose({position:[20,110,10],rotation:[.2,.3,.4]});three.host.root.updateMatrixWorld(true);endpoint(nested,out);checkNative();
  const before=[...resources.values()].map(r=>r.count);out.detach({dispose:false});assert.deepEqual([...resources.values()].map(r=>r.count),before,'Detach(false) keeps physical resources');assert.equal(three.host.find('grove/grove-1/sensor'),null);assert.equal(three.port.module,hub,'Selective detach retains the HUB');out.attach(nested);three.host.root.updateMatrixWorld(true);endpoint(nested,out);checkNative();
  report={status:'pass',sku:'U028',inputAssemblySha256:assemblySha256,rays,independentlyClosedAddedMeshes:closedMeshes,materialQueries:probe.queries,grovePoseCases:poseCases,retiredResourcesAtBuild:retiredAtBuild,trackedResources:resources.size,realOpticalWindowDiameterMm:3.5,actualShoulderZMm:top.point.z,actualCrownTopZMm:box.max.z,scope:'Product-specific actual mesh closure, preserved native arrays/source hashes, real optical filter/can/lead drills/solder bores, open Grove and insertion regression points, standalone/Grove/HUB API and lifecycle. Finite directed tests do not replace independent source/addition bidirectional collision audit, browser review, production PCB datum, manufacturing-fit or hardware validation.'};
  return report;
 }catch(error){failure=error;throw error;}finally{
  const roots=owners.filter(owner=>{for(let p=owner.parentHost;p;p=p.parentHost)if(owners.includes(p))return false;return true;});let cleanupError;
  try{for(const owner of roots.reverse())try{owner.dispose();}catch(error){cleanupError??=error;}}finally{THREE.BufferGeometry.prototype.dispose=originalGeometryDispose;THREE.Material.prototype.dispose=originalMaterialDispose;probe.dispose();}
  const bad=[...resources.values()].filter(r=>r.count!==1);
  if(!failure){if(cleanupError)throw cleanupError;assert.equal(bad.length,0,'Every NCIR resource, including retired constructor meshes, is disposed exactly once');assert.equal(sha(await fs.readFile(assemblyUrl)),assemblySha256,'NCIR assembly stayed stable during the directed check');if(report)report.resourcesReleasedExactlyOnce=resources.size;}
  else if(bad.length)console.error('NCIR cleanup counts:',bad.map(r=>r.type+':'+r.count).join(','));
 }
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log('PASS NCIR assembly:',JSON.stringify(await checkNCIRAssembly()));
