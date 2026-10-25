import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {addCadParts} from '../src/modeling/cad.js';
import sourceData from '../src/devices/cardputer-adv/geometry-data.js';
import {checkDeviceActuators} from './check-device-actuators.mjs';

const speakerCenters=[...[14.1,15.7,17.3,18.9].map(y=>[y,1.1]),...[13.3,14.9,16.5,18.1,19.7].map(y=>[y,2.7]),...[14.1,15.7,17.3,18.9].map(y=>[y,4.3])];
const cast=(root,origin,direction)=>new THREE.Raycaster(new THREE.Vector3(...origin),new THREE.Vector3(...direction)).intersectObject(root,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0)[0];
const localCast=(model,group,x,y)=>{
 const origin=group.localToWorld(new THREE.Vector3(x,y,5)),direction=new THREE.Vector3(0,0,-1).transformDirection(group.matrixWorld);
 return new THREE.Raycaster(origin,direction).intersectObject(model.root,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0)[0];
};
const isWithin=(object,parent)=>{for(let o=object;o;o=o.parent)if(o===parent)return true;return false;};

export function checkCardputerADVAssembly(model){
 model.root.updateMatrixWorld(true);
 // Independently inspect pristine official CAD; its aperture evidence is not
 // generated from, or changed to fit, the new connector meshes.
 const body=new THREE.Group(),source=addCadParts({body},sourceData);
 for(const mesh of Object.values(source))mesh.material=mesh.material.clone(),mesh.material.side=THREE.DoubleSide;
 body.updateMatrixWorld(true);
 const apertureEvidence=[];
 for(const [name,origin,direction,axis,limit,sign]of [
  ['USB-C',[60,16.47,7.85],[-1,0,0],'x',35,1],
  ['Grove',[-60,19,1.7],[1,0,0],'x',-35,-1],
  ['microSD',[-12.8,60,0],[0,-1,0],'y',20,1],
  ['audio',[60,16.6,-4],[-1,0,0],'x',30,1],
  ['IR',[-32.4,60,.45],[0,-1,0],'y',20,1],
  ['SW2',[-60,8,0],[1,0,0],'x',-35,-1]
 ]){
  const first=cast(body,origin,direction);assert.ok(!first||first.point[axis]*sign<limit*sign,`${name}: center must pass through its independent official-CAD opening`);
  apertureEvidence.push({name,origin,direction,firstSourceHit:first?{name:first.object.name,point:first.point.toArray()}:null});
 }
 const seamEvidence=[];
 for(const [origin,direction]of [
  ...[-20,0,8].map(y=>[[60,y,-1],[-1,0,0]]),
  ...[-20,0,8].map(y=>[[-60,y,-1],[1,0,0]]),
  ...[-30,-12,0,30].map(x=>[[x,-60,-1],[0,1,0]]),
  ...[-30,-12,0,12,30].map(x=>[[x,60,-1],[0,-1,0]])
 ]){
  const sourceHit=cast(body,origin,direction),first=cast(model.root,origin,direction);
  assert.ok(first?.object.name.startsWith('Inner enclosure seam lap '),'assembly seam must meet a real recessed structural lap');
  assert.ok(first.distance<(direction[0]?22:38),'seam closure is on the near enclosure, not its opposite wall');
  seamEvidence.push({origin,direction,sourceHit:sourceHit?{name:sourceHit.object.name,point:sourceHit.point.toArray()}:null,assembledHit:{name:first.object.name,point:first.point.toArray()}});
 }
 const oldUSB=cast(body,[60,18,4.2],[-1,0,0]),oldGrove=cast(body,[-60,10.2,2.6],[1,0,0]);
 assert.ok(Math.abs(oldUSB.point.x-42)<.01&&oldUSB.object.name==='upper-housing','former USB location is demonstrably closed white shell');
 assert.ok(oldGrove.point.x<-41&&oldGrove.object.name==='upper-housing','former Grove location is demonstrably closed white shell');
 for(const [y,z]of speakerCenters){const sourceHit=cast(body,[60,y,z],[-1,0,0]);assert.ok(!sourceHit||sourceHit.point.x<39,'source speaker aperture is genuinely open');const first=cast(model.root,[60,y,z],[-1,0,0]);assert.equal(first?.object.name,'Speaker acoustic enclosure');assert.ok(first.point.x>40&&first.point.x<40.5,'speaker has ~1.75 mm depth behind the real drilled holes');}
 const cavities=[];
 for(const [name,xy,floor,depth]of [
  ['USB-C receptacle',[0,.85],'USB-C dielectric backstop',6.5],
  ['microSD receptacle',[0,.2],'microSD insulating backstop',7.2],
  ['3.5 mm audio jack',[0,0],'Audio jack deep backstop',8.5],
  ['HY2.0-4P',[0,0],'Grove deep insulating backstop',5.18]
 ]){
  const group=model.root.getObjectByName(name);assert.ok(group,`${name}: physical assembly exists`);const first=localCast(model,group,...xy);
  assert.equal(first?.object.name,floor,`${name}: unblocked insertion channel`);assert.ok(Math.abs(first.distance-(depth+5))<.03,`${name}: real depth before its backing`);
  cavities.push({name,depthMm:first.distance-5,firstHit:first.object.name});
 }
 const usb=model.root.getObjectByName('USB-C receptacle');for(const y of [-.34,.34])for(let i=0;i<12;i++)assert.equal(localCast(model,usb,(i-5.5)*.5,y)?.object.name,'USB-C contact pad','each of the 24 USB-C contacts remains visible down its channel');
 const sd=model.root.getObjectByName('microSD receptacle');for(let i=0;i<8;i++)assert.equal(localCast(model,sd,(i-3.5)*1.1,-.26)?.object.name,'microSD spring contact','all eight microSD contacts remain visible');
 const grove=model.root.getObjectByName('HY2.0-4P');for(let i=0;i<4;i++)assert.equal(localCast(model,grove,(i-1.5)*2,-.15)?.object.name,`Grove spring contact ${i+1}`,'all four HY2.0 contacts remain visible');
 for(const [id,axis,sign]of [['usb','x',1],['headset','x',1],['grove','x',-1],['micro-sd','y',1]]){
  const port=model.get(id);assert.ok(port,`${id}: stable connector address`);const p=port.object3d.getWorldPosition(new THREE.Vector3());assert.ok(p[axis]*sign>(axis==='x'?41.8:26.7));
  const n=new THREE.Vector3(0,1,0).applyQuaternion(port.object3d.getWorldQuaternion(new THREE.Quaternion())),expected=new THREE.Vector3();expected[axis]=sign;assert.ok(n.distanceTo(expected)<1e-6,`${id}: module mating normal faces out of the real product side`);
 }
 const ext=model.root.getObjectByName('Female expansion header');for(let c=0;c<7;c++)for(let r=0;r<2;r++)assert.equal(localCast(model,ext,(c-3)*2.54,(r-.5)*2.54)?.object.name,'Header socket floor','previously corrected 14P header retains all fourteen unobstructed bores');
 for(const x of [-36,-20,20,36]){const first=cast(model.root,[x,23,-30],[0,0,1]);assert.equal(first?.object.name,'Rear mounting blind-hole floor');assert.ok(first.point.z>-5&&first.point.z<-4,'rear bores retain more than 5 mm depth');}
 for(const x of [-28,28]){assert.equal(cast(model.root,[x,23,-30],[0,0,1])?.object.name,'Rear brass threaded mounting insert recessed floor');assert.equal(cast(model.root,[x+.93,23,-30],[0,0,1])?.object.name,'Rear brass threaded mounting insert bored body');}
 for(const x of [-29,12.4]){assert.equal(cast(model.root,[x,9.4,-30],[0,0,1])?.object.name,'Rear enclosure hex screw recessed floor');assert.equal(cast(model.root,[x+1,9.4,-30],[0,0,1])?.object.name,'Rear enclosure hex screw bored body');}
 for(const [x,y]of [[19,12],[19,21],[22,15],[22,18]])assert.equal(cast(model.root,[x,y,30],[0,0,-1])?.object.name,'StampS3A U-notched 3D antenna','actual silver antenna fills its CAD pocket below the molded rim');
 assert.equal(cast(model.root,[22,16.8,30],[0,0,-1])?.object.name,'StampS3A antenna carrier','antenna notch has a real recessed carrier');
 assert.equal(cast(model.root,[31.3,20.97,30],[0,0,-1])?.object.name,'StampS3A retaining hex screw recessed floor');
 assert.ok(cast(model.root,[-32.4,60,.45],[0,-1,0])?.object.name==='IR emitter domed lens','IR aperture contains a real emitter');
 const sw=model.get('grove-power');assert.ok(sw?.isLatching&&sw.meta.electricalBehavior===false);assert.ok(isWithin(cast(model.root,[-60,7.3,0],[1,0,0])?.object,sw.cap));sw.setPosition(1);for(let i=0;i<80;i++)model.update(1/60);model.root.updateMatrixWorld(true);assert.ok(isWithin(cast(model.root,[-60,8.7,0],[1,0,0])?.object,sw.cap),'SW2 remains visible in its second physical detent');sw.setPosition(0);for(let i=0;i<80;i++)model.update(1/60);model.root.updateMatrixWorld(true);
 const actuators=checkDeviceActuators(model,{id:'cardputer-adv',expected:60});
 const box=new THREE.Box3();model.root.traverse(o=>{if(o.isMesh){for(const n of o.geometry.attributes.position?.array??[])assert.ok(Number.isFinite(n),'finite geometry');if(o.material?.opacity!==0)box.expandByObject(o);}});const size=box.getSize(new THREE.Vector3());assert.ok(size.x<85&&size.y<54.6&&size.z<20.1,'inserts stay inside the nominal envelope with real small protrusions');
 for(const o of Object.values(source))o.geometry.dispose(),o.material.dispose();
 return {status:'pass',apertureEvidence,seamEvidence,cavities,usbContacts:24,sdContacts:8,groveContacts:4,speakerApertures:13,extBores:14,rearBlindBores:4,rearThreadedInserts:2,rearScrews:2,actuators,visibleEnvelopeMm:size.toArray(),scope:'independent CAD aperture rays, assembled cavities and actual moving meshes; concealed shapes remain inferred'};
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 const noop=()=>{},ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});globalThis.document={createElement:()=>({getContext:()=>ctx})};
 const {CardputerADV}=await import('../src/devices/cardputer-adv/index.js');const model=new CardputerADV();try{console.log(JSON.stringify(checkCardputerADVAssembly(model),null,2));}finally{model.dispose();}
}
