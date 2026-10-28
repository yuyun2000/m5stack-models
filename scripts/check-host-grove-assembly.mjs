import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {loadModel,loadGroveModule} from '../src/loaders.js';

// Explicit interface expectations, checked against every catalog controller and
// named configuration before loading the real exported models. A new catalog
// host/configuration must be accounted for here rather than silently skipped.
const EXPECTED_PORTS={
 "atomu":{"complete":["grove"]},
 "stickt2":{"complete":["grove"]},
 "atoms3u":{"complete":["grove"]},
 "atom-echos3r":{"complete":["grove"],"mount-open":["grove"]},
 "atom-echo":{"complete":["grove"],"mount-open":["grove"]},
 "stickc-plus-se":{"complete":["grove"]},
 "atoms3r-ext":{"complete":["grove"]},
 "stickc-plus":{"complete":["grove"]},
 "stickc":{"complete":["grove"]},
 "atoms3r-m12-volcengine-kit":{"complete":["grove"]},
 "atoms3r-m12":{"complete":["grove"]},
 "atoms3r-cam-ai-chatbot":{"complete":["grove"]},
 "atoms3r-cam":{"complete":["grove"]},
 "atoms3r-ai-chatbot":{"complete":["grove"]},
 "stickv":{"blue-pcb":["grove"],"black-pcb":["grove"]},
 "m5stick":{"gray":["grove"],"white":["grove"]},
 "atom-matrix-v11":{"complete":["grove"],"mount-open":["grove"]},
 sticks3:{default:['grove']},cores3:{module:['grove'],din:['grove','grove-b','grove-c']},
 stopwatch:{default:['grove']},'cardputer-adv':{default:['grove']},'cardputer-zero':{default:['grove']},
 papermono:{default:[]},core2:{default:['grove']},papercolor:{default:['grove']},nanoc6:{default:['grove']},
 stackchan:{default:['grove','port-b','port-c']},tab5:{default:['grove']},atoms3r:{default:['grove']},
 'nesso-n1':{default:['grove']},stamplc:{default:['port-a','port-c']},
 atoms3:{complete:['grove']},dial:{complete:['port-a','port-b']},'stickc-plus2':{complete:['grove']},'basic-v27':{complete:['grove'],'base-removed':['grove']},
 'atom-lite':{complete:['grove']},'atom-matrix':{complete:['grove']},'atoms3-lite':{complete:['grove']},
};
const visible=object=>object.isMesh&&(Array.isArray(object.material)?object.material:[object.material]).some(material=>material.opacity!==0);
const within=(object,parent)=>{for(let o=object;o;o=o.parent)if(o===parent)return true;return false;};
const near=(a,b,why)=>assert.ok(a.distanceTo(b)<2e-5,`${why}: ${a.toArray()} vs ${b.toArray()}`);
const Y=new THREE.Vector3(0,1,0),vertex=(mesh,ring,row)=>mesh.localToWorld(new THREE.Vector3().fromBufferAttribute(mesh.geometry.attributes.position,ring*9+row));

/** Real enclosure and actual tube-surface rails, beyond synthetic port tests. */
export async function checkHostGroveAssembly(){
 const cases=[];let railSegments=0,sourcePorts=0,matingChecks=0;
 const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
 const controllers=catalog.products.filter(product=>product.category==='controller'&&product.entry);
 const controllerIds=controllers.map(product=>product.id);
 assert.equal(new Set(controllerIds).size,controllerIds.length,'Catalog controller IDs must be unique');
 assert.deepEqual(Object.keys(EXPECTED_PORTS).toSorted(),controllerIds.toSorted(),'Grove coverage must include exactly the implemented catalog controllers');
 const rows=controllers.flatMap(product=>{
  const configurations=product.configurations?.length?product.configurations:[{id:'default',options:{}}];
  const ids=configurations.map(configuration=>configuration.id);
  assert.equal(new Set(ids).size,ids.length,`${product.id}: catalog configuration IDs must be unique`);
  assert.deepEqual(Object.keys(EXPECTED_PORTS[product.id]).toSorted(),ids.toSorted(),`${product.id}: Grove coverage must include exactly the catalog configurations`);
  return configurations.map(configuration=>({
   id:product.id,configuration:configuration.id,
   label:configurations.length===1||configuration.id==='module'?product.id:`${product.id}-${configuration.id}`,
   ports:EXPECTED_PORTS[product.id][configuration.id],options:configuration.options??{},
  }));
 });
 const covered=[];
 for(const row of rows){
  const host=await loadModel(row.id,row.options),label=row.label??row.id;
  try{
   const actual=host.list('port').filter(port=>port.connector==='grove').map(port=>port.id);
   assert.deepEqual(actual.toSorted(),row.ports.toSorted(),`${label}: all actual Grove interfaces, including declared absence`);
   covered.push({id:row.id,configuration:row.configuration,ports:actual});
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
 assert.equal(covered.length,rows.length,'Every catalog host configuration completed its actual-port check');
 return {status:'pass',controllers:controllerIds.length,sourcePorts,hostConfigurations:covered.length,coverage:covered,cases,matingChecks,railSegments,scope:'Every implemented catalog controller and named configuration; actual Grove interfaces with a real compact Unit, sampled rendered tube-surface rails and mating transforms, including StackChan poses. Not every target Unit or an arbitrary-pose collision solver.'};
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 const args=process.argv.slice(2);
 if(args.length&&!(args.length===2&&args[0]==='--report'&&args[1].endsWith('.json')))throw new Error('Usage: node scripts/check-host-grove-assembly.mjs [--report new-report.json]');
 const noop=()=>{},ctx=new Proxy({measureText:()=>({width:20}),createRadialGradient:()=>({addColorStop:noop}),createLinearGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});globalThis.document={createElement:()=>({getContext:()=>ctx})};
 const report={checkedAt:new Date().toISOString(),...await checkHostGroveAssembly()};
 // Saving is opt-in and exclusive: historical snapshots cannot be overwritten.
 if(args.length)await fs.writeFile(args[1],JSON.stringify(report,null,2)+'\n',{flag:'wx'});
 console.log('PASS real host Grove assembly:',JSON.stringify({checkedAt:report.checkedAt,controllers:report.controllers,hostConfigurations:report.hostConfigurations,sourcePorts:report.sourcePorts,cases:report.cases.length,matingChecks:report.matingChecks,railSegments:report.railSegments,scope:report.scope}));
}
