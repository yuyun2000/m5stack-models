import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import * as THREE from 'three';
import {Device,Port} from '../src/core/index.js';
import {loadGroveModule,loadModel} from '../src/loaders.js';

// Geometry checks only. Actual label pixels and assembled looks need a browser.
const noop=()=>{},ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});
globalThis.document={createElement:()=>({getContext:()=>ctx})};
const root=path.resolve(import.meta.dirname,'..');
const catalog=JSON.parse(await fs.readFile(path.join(root,'catalog/products.json'),'utf8'));
const unitIds=catalog.products.filter(p=>p.category==='unit'&&p.integration?.moduleExport).map(p=>p.id);
assert.equal(unitIds.length,catalog.products.filter(p=>p.category==='unit'&&p.entry).length,'every implemented Unit exposes a Grove visual module');
const Y=new THREE.Vector3(0,1,0),rows=[-3,-1,1,3];let endpointChecks=0,collisionRays=0;
const near=(a,b,message)=>assert.ok(a.distanceTo(b)<2e-5,`${message}: ${a.toArray()} / ${b.toArray()}`);
function ringCenter(mesh,ring){
  const attribute=mesh.geometry.attributes.position,out=new THREE.Vector3();
  for(let j=0;j<8;j++)out.add(new THREE.Vector3().fromBufferAttribute(attribute,ring*9+j));
  return mesh.localToWorld(out.multiplyScalar(1/8));
}
function checkEndpoints(host,port,module){
  host.root.updateMatrixWorld(true);module.get('cable').sync();host.root.updateMatrixWorld(true);
  const cable=module.get('cable'),input=module.get('grove'),state=cable.getState();
  assert.equal(cable.wires.length,4);assert.equal(state.plugCount,2);
  for(const [plug,socket]of [[cable.sourcePlug,port],[cable.targetPlug,input]]){
    near(plug.getWorldPosition(new THREE.Vector3()),socket.object3d.getWorldPosition(new THREE.Vector3()),'plug mating plane follows its actual socket');
    near(Y.clone().applyQuaternion(plug.getWorldQuaternion(new THREE.Quaternion())),Y.clone().applyQuaternion(socket.object3d.getWorldQuaternion(new THREE.Quaternion())),'plug outward axis follows its actual socket');
    endpointChecks+=2;
  }
  for(let i=0;i<4;i++)for(const [ring,plug]of [[0,cable.sourcePlug],[96,cable.targetPlug]]){
    const expected=plug.localToWorld(new THREE.Vector3(rows[i],4.2,0));
    near(ringCenter(cable.wires[i],ring),expected,'rendered wire ring touches the corresponding molded wire exit');endpointChecks++;
  }
  // Mid-curve rows must keep their physical spacing even during a 180° twist.
  for(const ring of [0,12,24,36,48,60,72,84,96])for(let i=0;i<3;i++){
    const gap=ringCenter(cable.wires[i],ring).distanceTo(ringCenter(cable.wires[i+1],ring));
    // Tube rings sample each wire by its own arc length; their intermediate
    // stations need not share the same centerline parameter after a twist.
    assert.ok(gap>1.2,'four wires do not collapse in the bend');
  }
  for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)for(let a=0;a<=96;a+=2)for(let b=0;b<=96;b+=2)
    assert.ok(ringCenter(cable.wires[i],a).distanceTo(ringCenter(cable.wires[j],b))>.85,'different physical wires have clearance throughout the bend');
  assert.ok(state.curveLengthMm>0&&Number.isFinite(state.curveLengthMm));
  return state;
}
function checkShellClearance(host,module){
  host.root.updateMatrixWorld(true);const frame=module.get('unitFrame').object3d,cable=module.get('cable'),solids=[];
  frame.traverse(o=>{if(o.isMesh&&o.material?.opacity!==0)solids.push(o);});
  host.body.traverse(o=>{
    if(!o.isMesh||o.material?.opacity===0)return;
    let parent=o;while(parent&&parent!==module.root)parent=parent.parent;
    if(parent!==module.root)solids.push(o);
  });
  for(const wire of cable.wires)for(let ring=0;ring<96;ring+=4){
    const a=ringCenter(wire,ring),b=ringCenter(wire,ring+4),v=b.clone().sub(a),length=v.length();
    const hits=new THREE.Raycaster(a,v.normalize(),1e-5,length-1e-5).intersectObjects(solids,false);
    assert.equal(hits.length,0,`${module.meta.id}: cable must not cross the host/Unit shell (${hits[0]?.object.name})`);collisionRays++;
  }
}
const reports=[];
for(const id of unitIds){
  const host=new Device(),port=host.add(new Port({id:'unit',connector:'grove'})),module=await loadGroveModule(id,{cableLength:35});
  const events=[];host.on('input',event=>events.push(event));port.attach(module);
  assert.equal(host.get('unit/sensor').meta.role,'visual-anchor',`${id}: existing component path survives`);
  assert.equal(host.get('unit/unitFrame').kind,'unit-frame');assert.equal(host.get('unit/cable').kind,'cable');
  const initial=checkEndpoints(host,port,module);near(new THREE.Vector3(...initial.target.position),new THREE.Vector3(0,35,0),`${id}: actual input mouth is aligned, independent of nominal shell size`);
  assert.ok(new THREE.Box3().setFromObject(module.root).min.y>=-1.20001,'only the controlled mating nose may enter the source socket');
  checkShellClearance(host,module);
  const oldGeometry=module.get('cable').wires[0].geometry;let oldDisposals=0;oldGeometry.addEventListener('dispose',()=>oldDisposals++);
  host.handle({type:'pose',target:'unit/unitFrame',position:[18,75,-2],rotation:[.13,-.28,.32]});
  host.handle({type:'cable',target:'unit/cable',slack:18,bend:[0,0,-1]});
  checkEndpoints(host,port,module);checkShellClearance(host,module);assert.equal(oldDisposals,1,'replaced wire buffers are freed');
  host.root.rotation.set(.4,-.6,.8);host.root.position.set(22,-11,7);host.update(1/60,1);
  checkEndpoints(host,port,module);checkShellClearance(host,module);
  module.get('grove').input('visual-probe');assert.ok(events.some(e=>e.id==='unit/grove'&&e.action==='visual-probe'),'existing input events bubble with the same path');
  const geometry=module.get('cable').wires[0].geometry;let disposals=0;geometry.addEventListener('dispose',()=>disposals++);
  assert.equal(port.detach({dispose:false}),module);assert.equal(disposals,0,'detach without disposal keeps resources');
  const second=host.add(new Port({id:'rotated',connector:'grove',position:[-25,5,3],rotation:[.2,.3,-.8]}));second.attach(module);host.update(1/60,2);
  checkEndpoints(host,second,module);assert.equal(host.get('rotated/sensor').path,'rotated/sensor');
  host.dispose();assert.equal(disposals,1,'final attached cable buffer is freed exactly once');assert.equal(module.components.size,0,'attached module is fully disposed with host');
  reports.push({id,status:'pass',initialFaceDistanceMm:initial.faceDistanceMm});
  console.log(`PASS ${id}: two plugs/four wires, moving Unit, rotated host, reuse and disposal`);
}

// Use a real source enclosure, not only a synthetic Port frame.
const atom=await loadModel('atoms3r'),atomPort=atom.get('grove'),buzzer=await loadGroveModule('buzzer',{cableLength:60,cable:{slack:15}});
atomPort.attach(buzzer);checkEndpoints(atom,atomPort,buzzer);checkShellClearance(atom,buzzer);
const frame=buzzer.get('unitFrame');frame.setDistance(100);const state=checkEndpoints(atom,atomPort,buzzer);assert.ok(Math.abs(state.faceDistanceMm-100)<1e-5);checkShellClearance(atom,buzzer);
// External runtimes may write the anchor transform then use the normal tick.
frame.object3d.position.x+=8;frame.object3d.rotation.z+=.2;atom.update(1/60,3);checkEndpoints(atom,atomPort,buzzer);checkShellClearance(atom,buzzer);
const before=frame.getState();assert.throws(()=>frame.setDistance(2),RangeError);assert.deepEqual(frame.getState(),before,'invalid length leaves the Unit pose intact');
assert.throws(()=>buzzer.get('cable').setOptions({bend:[0,0,0]}),RangeError);atom.dispose();

// Corrected ADV socket and the large left-input keyboard need real-host
// checks as well as the synthetic mating frame used above.
for(const id of ['limit','cardkb']){
 const adv=await loadModel('cardputer-adv'),port=adv.get('grove'),unit=await loadGroveModule(id,{cableLength:85,cable:{slack:16}});
 port.attach(unit);checkEndpoints(adv,port,unit);checkShellClearance(adv,unit);adv.dispose();
}

// Nested passive-HUB output ports keep their original transform and path.
const host=new Device(),port=host.add(new Port({id:'grove',connector:'grove',rotation:[.25,.4,-.3]})),hub=await loadGroveModule('hub',{cableLength:55}),leaf=await loadGroveModule('env-iii',{cableLength:70});
port.attach(hub);const output=hub.get('grove-1');output.attach(leaf);hub.get('unitFrame').setPose({position:[20,80,0],rotation:[.2,-.1,.5]});host.root.rotation.set(.2,.3,-.4);host.update(1/60,4);
checkEndpoints(host,port,hub);checkEndpoints(host,output,leaf);assert.equal(host.get('grove/grove-1/sensor').path,'grove/grove-1/sensor');
host.dispose();assert.equal(leaf.components.size,0,'nested leaf is disposed');

await fs.writeFile(path.join(root,'artifacts/grove-cable-check.json'),JSON.stringify({checkedAt:new Date().toISOString(),scope:'visual cable geometry and public assembly API; no electrical or bus simulation',status:'pass',unitCount:unitIds.length,endpointChecks,collisionRays,reports,additional:['real AtomS3R source enclosure','real Cardputer-ADV source with Limit and left-input CardKB','length and external anchor updates','nested rotated HUB attachment','detach reuse and exactly-once cable buffer disposal']},null,2)+'\n');
console.log(`PASS Grove cable: ${unitIds.length} Units, ${endpointChecks} endpoint checks, ${collisionRays} physical shell-clearance rays`);
