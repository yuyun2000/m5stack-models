import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {Device,Port} from '../src/core/index.js';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const v=a=>new THREE.Vector3(...a),near=(a,b,label)=>assert.ok(a.distanceTo(b)<2e-5,label);
const visible=o=>o.isMesh&&o.material?.opacity!==0;
const bounds=o=>new THREE.Box3().setFromObject(o);
const shoot=(root,p,d)=>new THREE.Raycaster(v(p),v(d)).intersectObject(root,true).filter(h=>visible(h.object));
const meshes=root=>{const out=[];root.traverse(o=>{if(visible(o))out.push(o);});return out;};

// Three-direction signed crossings retain touching native-shell boundaries.
// This is finite mesh sampling, not a manufacturing tolerance or CSG proof.
function materialProbe(){
 const material=new THREE.MeshBasicMaterial({side:THREE.DoubleSide}),ray=new THREE.Raycaster(),cache=new Map();
 const directions=[[.733,.312,.604],[-.381,.852,.359],[.213,-.527,.823]].map(a=>v(a).normalize());
 const inside=(object,p)=>directions.every(direction=>{
  if(!cache.has(object)){const shadow=new THREE.Mesh(object.geometry,material);shadow.matrixAutoUpdate=false;shadow.matrixWorld.copy(object.matrixWorld);cache.set(object,shadow);}
  ray.set(p,direction);const groups=[],normal=new THREE.Matrix3().getNormalMatrix(object.matrixWorld);
  for(const h of ray.intersectObject(cache.get(object),false)){
   if(h.distance<1e-5)return false;
   const sign=Math.sign(h.face.normal.clone().applyNormalMatrix(normal).dot(direction));if(!sign)continue;
   const prior=groups.find(g=>Math.abs(g.distance-h.distance)<1e-5);
   if(prior)prior.signs.add(sign);else groups.push({distance:h.distance,signs:new Set([sign])});
  }
  return groups.reduce((n,g)=>n+[...g.signs].reduce((a,b)=>a+b,0),0)>0;
 });
 let surfaceSamples=0,volumeSamples=0,pairs=0;
 const points=new Map(),samples=o=>{
  if(points.has(o))return points.get(o);
  const p=o.geometry.attributes.position,index=o.geometry.index,center=bounds(o).getCenter(new THREE.Vector3()),unique=new Map();
  const add=q=>{q.lerp(center,.001);unique.set(q.toArray().map(n=>Math.round(n*1e5)).join(','),q);};
  for(let i=0;i<p.count;i++)add(new THREE.Vector3().fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld));
  for(let i=0;i<(index?.count??p.count);i+=3){const q=[0,1,2].map(k=>new THREE.Vector3().fromBufferAttribute(p,index?index.getX(i+k):i+k).applyMatrix4(o.matrixWorld));add(q[0].add(q[1]).add(q[2]).multiplyScalar(1/3));}
  points.set(o,[...unique.values()]);return points.get(o);
 };
 const disjoint=(a,b,label)=>{
  const overlap=bounds(a).intersect(bounds(b)),size=overlap.getSize(new THREE.Vector3());
  if(overlap.isEmpty()||Math.min(size.x,size.y,size.z)<1e-4)return;pairs++;
  for(const[source,target]of[[a,b],[b,a]])for(const p of samples(source)){
   if(!overlap.containsPoint(p)||!inside(source,p))continue;
   assert.equal(inside(target,p),false,`${label}: ${source.name} enters ${target.name} at ${p.toArray()}`);surfaceSamples++;
  }
  for(let x=1;x<=4;x++)for(let y=1;y<=4;y++)for(let z=1;z<=4;z++){
   const p=overlap.min.clone().add(v([size.x*x/5,size.y*y/5,size.z*z/5]));
   assert.ok(!(inside(a,p)&&inside(b,p)),`${label}: volume overlap ${a.name} / ${b.name} at ${p.toArray()}`);volumeSamples++;
  }
 };
 return{inside,disjoint,result:()=>({pairs,surfaceSamples,volumeSamples,directions:3}),dispose:()=>material.dispose()};
}

export async function checkOpenTopGrove(){
 const previous=globalThis.document;
 if(!previous){const noop=()=>{},ctx=new Proxy({measureText:()=>({width:20}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});globalThis.document={createElement:()=>({getContext:()=>ctx})};}
 const owned=[],resources=new Map(),rows=[];let rays=0,regressionPoints=0,poses=0;
 const track=model=>{
  const objects=meshes(model.groveSocketAssembly.group);if(model.heartGroveBoard)objects.push(model.heartGroveBoard);
  for(const object of objects)for(const resource of [object.geometry,object.material])if(!resources.has(resource)){resources.set(resource,0);resource.addEventListener('dispose',()=>resources.set(resource,resources.get(resource)+1));}
 };
 try{
  for(const[id,options]of[['heart',{}],['rs485',{}],['rs485',{terminalPlug:true}]]){
   const model=await loadModel(id,options);owned.push(model);model.root.updateMatrixWorld(true);track(model);
   const a=model.groveSocketAssembly,port=model.port('grove'),label=id==='heart'?'Heart':'RS485';
   assert.ok(a.port===port,'Refinement retains the original port instance');
   assert.equal(port.connector,'grove');near(port.object3d.position,v([0,-15.65,1.4]),'Drawing/CAD mouth centre');
   near(v([0,1,0]).applyQuaternion(port.object3d.quaternion),v([0,-1,0]),'Original outward port axis');
   assert.deepEqual([port.highlightMesh.geometry.parameters.width,port.highlightMesh.geometry.parameters.height,port.highlightMesh.geometry.parameters.depth],[10,1,5],'Existing hover/picking contract remains');
   const box=bounds(a.group);near(box.getSize(new THREE.Vector3()),v([10,6.8,5.2]),'Open socket envelope including two mouth ears');
   assert.ok(Math.abs(box.min.z+1.2)<2e-5&&Math.abs(box.max.z-4)<2e-5,'Mouth fills the independently documented Z interval');
   for(const x of [-3,-1,1,3]){
    const h=shoot(model.root,[x,-14.2,20],[0,0,-1])[0];assert.ok(h?.object.name.startsWith(`${label} Grove contact `),'Four actual contacts visible through the real open top');assert.ok(h.point.z>1&&h.point.z<1.5);rays++;
   }
   for(const[p,name]of[[[0,-14.2,20],'floor'],[[4.65,-12,20],'side rail right'],[[3.85,-12,20],'upper lip right'],[[-3.85,-12,20],'upper lip left'],[[0,-11.5,20],'short locking tongue'],[[0,-9.5,20],'rear wall']]){
    assert.equal(shoot(model.root,p,[0,0,-1])[0]?.object.name,`${label} Grove ${name}`,'Open upper channel has real floor, rails, joined tongue and rear web');rays++;
   }
   for(const[z,name,y]of[[.5,'recessed contact support',-13.8],[1.8,'rear wall',-9.75]]){
    const mouth=shoot(model.root,[0,-19,z],[0,1,0])[0];assert.equal(mouth?.object.name,`${label} Grove ${name}`,'Whole assembled stepped insertion path clears PCB');assert.ok(Math.abs(mouth.point.y-y)<2e-5);rays++;
   }
   for(const contact of Object.values(a.parts).filter(o=>o.name.includes('Grove contact ')))assert.ok(Math.abs(contact.geometry.parameters.depth-1.2)<1e-8,'Visible contact row has four short metal segments');
   for(const x of [-8,8])for(const[dx,dy]of[[0,0],[1.5,0],[-1.5,0],[0,1.5],[0,-1.5]]){assert.equal(shoot(model.root,[x+dx,-4+dy,20],[0,0,-1]).length,0,'Mounting bores remain clear through every physical layer');rays++;}
   const probe=materialProbe();
   try{
    assert.ok(probe.inside(a.parts['side rail right'],a.group.localToWorld(v([4.65,0,-2]))),'Positive physical rail control');
    assert.ok(probe.inside(model.parts.housing,v([11.6,0,0])),'Positive source-shell control');
    const board=model.heartGroveBoard??model.root.getObjectByName('RS485 PCB with connector clearances');assert.ok(board);
    for(const part of meshes(a.group))for(const target of [board,model.parts.housing])probe.disjoint(part,target,'Socket / original assembly');
    const module=await loadGroveModule(id,options);owned.push(module);module.root.updateMatrixWorld(true);track(module);
    const input=module.port('grove'),cable=module.get('cable'),nose=cable.targetPlug.getObjectByName('Grove plug four-chamber housing'),mp=materialProbe();
    try{
     near(input.object3d.getWorldPosition(new THREE.Vector3()),v([0,35,0]),'Default module compensates actual revised input origin');
     for(const p of [[4.15,-.65,0],[-4.15,-.65,0],[0,-.65,-.9]]){
      const world=input.object3d.localToWorld(v(p));assert.ok(mp.inside(nose,world),'Regression point is real plug material, not an empty hole');
      for(const target of [...meshes(module.groveSocketAssembly.group),module.heartGroveBoard??module.root.getObjectByName('RS485 PCB with connector clearances')])assert.equal(mp.inside(target,world),false,'Historical side-wall/PCB overlap stays fixed');regressionPoints++;
     }
     const staticParts=[...meshes(module.groveSocketAssembly.group),module.heartGroveBoard??module.root.getObjectByName('RS485 PCB with connector clearances'),module.parts.housing];
     for(const plugPart of meshes(cable.targetPlug))for(const target of staticParts)mp.disjoint(plugPart,target,'Real plug / socket, PCB and source shell');
     rows.push({id,terminalPlug:options.terminalPlug===true,assembly:probe.result(),matedPlug:mp.result()});
    }finally{mp.dispose();}
    const host=new Device(),parent=host.add(new Port({id:'unit',connector:'grove',position:[10,4,6],rotation:[.23,-.36,.48]}));owned.push(host);parent.attach(module);
    for(const pose of [{position:[20,70,5],rotation:[.2,-.3,.4]},{position:[-15,85,-3],rotation:[-.35,.27,-.6]}]){
     module.get('unitFrame').setPose(pose);host.root.rotation.set(.3,-.2,.4);host.root.updateMatrixWorld(true);host.update(1/60,1);host.root.updateMatrixWorld(true);
     for(const[plug,socket]of[[cable.sourcePlug,parent],[cable.targetPlug,input]]){
      near(plug.getWorldPosition(new THREE.Vector3()),socket.object3d.getWorldPosition(new THREE.Vector3()),'Full pose preserves the actual mating origin');
      assert.ok(Math.abs(plug.getWorldQuaternion(new THREE.Quaternion()).dot(socket.object3d.getWorldQuaternion(new THREE.Quaternion())))>1-1e-9,'Full quaternion follows the socket');
     }
     near(module.get('unitFrame').object3d.position,v(pose.position),'Explicit unitPose is retained rather than silently offset');poses++;
    }
    parent.detach({dispose:false});assert.ok([...resources.values()].every(n=>n===0),'Detach(false) retains new physical resources');parent.attach(module);assert.ok(parent.module===module,'Reattach retains the same module');
   }finally{probe.dispose();}
  }
  const host=await loadModel('sticks3'),hub=await loadGroveModule('hub'),heart=await loadGroveModule('heart'),rs=await loadGroveModule('rs485',{terminalPlug:true});owned.push(host);
  host.port('grove').attach(hub);hub.port('grove-1').attach(heart);hub.port('grove-2').attach(rs);
  host.handle({type:'led',target:'grove/grove-1/red-led',brightness:.4});host.handle({type:'joint',target:'grove/grove-2/terminal/screw-4',angleDeg:45});
  assert.equal(heart.led('red-led').brightness,.4);assert.equal(rs.get('terminal').module.get('screw-4').angleDeg,45);
  host.handle({type:'detach',target:'grove/grove-1'});assert.ok(host.port('grove').module===hub&&hub.port('grove-2').module===rs,'Selective nested detach retains other real branches');
  return{status:'pass',products:['heart','rs485'],configurations:3,rays,regressionPoints,poses,ownedResources:resources.size,rows,scope:'Physical open mouth, finite bidirectional/volume material samples, real cable nose/latch/retainer, frames and API only; inferred clearances are not manufacturing fit. Baseline PCB outer-edge/source-wall overlaps elsewhere are not resolved by this socket check.'};
 }finally{
  for(const model of owned.reverse())model.dispose();
  assert.ok([...resources.values()].every(n=>n===1),'Every tracked new geometry and material is disposed exactly once');
  if(!previous)delete globalThis.document;
 }
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log('PASS open-top Grove:',JSON.stringify(await checkOpenTopGrove()));
