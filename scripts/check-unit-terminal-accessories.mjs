import assert from 'node:assert/strict';
import * as THREE from 'three';
import {Device,Port} from '../src/core/index.js';
import {pathToFileURL} from 'node:url';

/** Constructor/configuration and nested assembly integration; local bore checks are product-specific. */
export async function checkUnitTerminalAccessories(){
 const cases=[];
 for(const id of ['weight-i2c','8servos']){
  const {Model,GroveModule,TerminalPlug}=await import(`../src/units/${id}/index.js`);
  const model=new Model(),configured=new Model({terminalPlug:true}),host=new Device();
  try{
   model.root.updateMatrixWorld(true);const fixed=[];model.root.traverse(o=>{if(o.isMesh)fixed.push([o,o.matrixWorld.clone()]);});
   const port=model.port('terminal');assert.equal(port.module,null,'default retains the empty fixed socket');
   const plug=new TerminalPlug();port.attach(plug);model.root.updateMatrixWorld(true);
   assert.equal(plug.list('joint').length,4);let meshes=0;
   plug.root.traverse(o=>{if(o.isMesh){meshes++;for(const n of o.geometry.attributes.position.array)assert.ok(Number.isFinite(n));}});assert.ok(meshes>20,'the plug contains substantive physical geometry');
   for(let n=1;n<=4;n++){
    const joint=model.get(`terminal/screw-${n}`),before=joint.object3d.getWorldQuaternion(new THREE.Quaternion());
    assert.equal(joint.continuous,false);assert.throws(()=>joint.set({rpm:1}),RangeError);
    model.handle({type:'joint',target:`terminal/screw-${n}`,angleDeg:67});model.root.updateMatrixWorld(true);
    assert.ok(joint.object3d.getWorldQuaternion(new THREE.Quaternion()).angleTo(before)>.8,'the actual screw head rotates');
   }
   for(const [mesh,matrix]of fixed)assert.ok(mesh.matrixWorld.equals(matrix),'default shells, sockets and board stay fixed');
   const retained=port.detach({dispose:false});assert.ok(retained===plug);assert.equal(model.list('joint').length,0);port.attach(retained);assert.equal(model.list('joint').length,4);port.detach();
   assert.ok(configured.port('terminal').module instanceof TerminalPlug,'constructor option installs the supplied plug');
   const grove=host.add(new Port({id:'unit',connector:'grove',rotation:[.2,-.3,.1]}));const unit=new GroveModule({terminalPlug:true,cableLength:75});grove.attach(unit);host.root.updateMatrixWorld(true);
   host.handle({type:'joint',target:'unit/terminal/screw-4',angleDeg:-43});assert.equal(host.get('unit/terminal/screw-4').angleDeg,-43);
   const cable=host.get('unit/cable');assert.equal(cable.getState().wireCount,4);host.get('unit/terminal').detach();
   assert.ok(grove.module===unit,'selective accessory removal retains the Unit');assert.ok(host.get('unit/cable')===cable,'selective accessory removal retains the rendered Grove cable');
   cases.push({product:id,status:'pass',plugMeshes:meshes,screwCommands:5,nestedCableRetained:true,defaultPlug:false});
  }finally{model.dispose();configured.dispose();host.dispose();}
 }
 return {status:'pass',cases,scope:'Real constructor options, plug modules, screw geometry, fixed default solids, nested commands and selective detach; no hardware or browser verification'};
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkUnitTerminalAccessories()));
