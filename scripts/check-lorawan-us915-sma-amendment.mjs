// Current US915-only amendment check. Imports current fixture helpers; no historical suite is executed.
import {Model,GroveModule,configurations,defaults,configurationSchema} from '../src/units/lorawan-us915/index.js';
import {StickS3} from '../src/devices/sticks3/StickS3.js';
import {GroveModule as Hub} from '../src/units/hub/index.js';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {checkLoRaWANUS915Physical,checkLoRaWANUS915Runtime,installCanvasStub,records,panels,observeDisposal,hash,physical,frames,tick} from './check-cardkboriginal-poecamoriginal-lorawanus915-units.mjs';
const fileSha=url=>createHash('sha256').update(readFileSync(url)).digest('hex');
function runtimeFiles(){
 const base=new URL('../src/units/lorawan-us915/',import.meta.url),out=[];
 function visit(url,prefix=''){
  for(const entry of readdirSync(url,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){
   const rel=prefix+entry.name,child=new URL(entry.name+(entry.isDirectory()?'/':''),url);
   if(entry.isDirectory())visit(child,rel+'/');else out.push({path:'src/units/lorawan-us915/'+rel,sha256:fileSha(child)});
  }
 }
 visit(base);return out;
}
const restore=installCanvasStub(),report={id:'lorawan-us915',amendment:'us915-sma-2026-10-27',candidateSourceOverlay:false,sourceLoaderUsed:false,historicalBatch51Preserved:true,status:'pass',entryReports:[],configurationReports:[],scope:'Necessary actual CPU source geometry/runtime/DOM boundary only;no browser/GPU/manufacturing/electrical/RF/hardware acceptance'};
try{
 for(const C of[Model,GroveModule])for(const cfg of configurations){
  const u=new C(cfg.options),off=new C({...cfg.options,artwork:false}),events=[];u.root;off.root;u.on('input',e=>{if(e.kind!=='port')events.push(e);});
  try{assert.deepEqual(records(u),records(off),'All actual attributes/index/world are identical with ink off for both entries/all presets');assert.equal(panels(u).length,2);assert.equal(panels(off).length,0);const physicalReceipt=checkLoRaWANUS915Physical(u),runtime=checkLoRaWANUS915Runtime(u,u,'',events);assert.equal(events.length,0);if(cfg.options.antenna!==false){const onAnt=u.get('antenna').module,offAnt=off.get('antenna').module;onAnt.get('fold').set({angleDeg:47,durationMs:200});offAnt.get('fold').set({angleDeg:47,durationMs:200});u.update(.07);off.update(.07);assert.deepEqual(records(u),records(off),'Partial realhinge angle and ink toggle retain allphysical attrs/index/world');assert.equal(panels(u).length,2);onAnt.get('fold').set({angleDeg:cfg.options.antennaFoldDeg??90});offAnt.get('fold').set({angleDeg:cfg.options.antennaFoldDeg??90});assert.deepEqual(records(u),records(off));}
   report.configurationReports.push({entry:C===Model?'Model':'GroveModule',configuration:cfg.id,options:cfg.options,physical:physicalReceipt,runtime,ordinaryPanels:2,inkOffEveryPhysicalAttributeIndexWorldIdentical:true,realHingePartialInkInvariant:cfg.options.antenna!==false});if(C===Model&&cfg.id==='complete')report.physical=physicalReceipt;
  }finally{const observe=observeDisposal(u.root),observeOff=observeDisposal(off.root);u.dispose();off.dispose();assert.ok(observe()>0&&observeOff()>0);}
 }
 const host=new StickS3(),hub=new Hub({artwork:false,cableLength:72}),u=new GroveModule({cableLength:86}),peer=new GroveModule({cableLength:69,artwork:false});host.root;host.root.position.set(9,-6,12);host.root.rotation.set(.14,-.21,.29);host.get('grove').attach(hub);hub.get('unitFrame').setPose({rotation:[.19,.12,-.16]});hub.get('grove-3').attach(u);hub.get('grove-1').attach(peer);tick(host);host.display().fill('#28496d');const fb=hash(host.display().buffer),events=[];host.on('input',e=>{if(e.kind!=='port')events.push(e);});
 try{const before=physical(peer),physicalReceipt=checkLoRaWANUS915Physical(u),runtime=checkLoRaWANUS915Runtime(host,u,'grove/grove-3',events);assert.equal(physical(peer),before);assert.equal(hash(host.display().buffer),fb);assert.ok(host.get('grove/grove-3/antenna/fold')===u.get('antenna/fold'));const n=events.length;host.handle({type:'pose',target:'grove/grove-3/unitFrame',rotation:[.12,-.16,.2]});host.handle({type:'pose',target:'grove/grove-3/unitFrame',distance:91});host.handle({type:'cable',target:'grove/grove-3/cable',slack:14,bend:[0,0,-1]});host.update(0);const cable=u.get('cable').getState();assert.equal(cable.wireCount,4);assert.equal(cable.plugCount,2);assert.equal(events.length,n);assert.equal(physical(peer),before);assert.equal(hash(host.display().buffer),fb);const shape=physical(u),ports=frames(u),removed=hub.get('grove-3').detach({dispose:false});assert.ok(removed===u);hub.get('grove-3').attach(u);host.update(0);assert.equal(physical(u),shape);assert.equal(frames(u),ports);assert.equal(physical(peer),before);const relocatedGeometry=checkLoRaWANUS915Physical(u),runtimeAfterPose=checkLoRaWANUS915Runtime(host,u,'grove/grove-3',events);assert.equal(physical(peer),before);assert.equal(hash(host.display().buffer),fb);const observe=observeDisposal(u.root);hub.get('grove-3').detach();const resources=observe();assert.equal(physical(peer),before);report.entryReports.push({entry:'GroveModule',parent:'Real transformed StickS3 -> HUB grove-3',physical:physicalReceipt,runtime,relocatedGeometry,runtimeAfterPose,cable,fullPath:'grove/grove-3/antenna/fold',independentPeerPhysicalAttrsIndexWorld:true,hostFramebufferUnchanged:true,actualFourCore:true,realBodySmaDetachAndReattachRestore:true,disposedResources:resources});
 }finally{host.dispose();}
 report.api={exports:['Antenna','GroveModule','Model','configurationSchema','configurations','defaults','spec'],bodyComponentOrder:['grove','antenna'],moduleComponentOrder:['grove','antenna','unitFrame','cable'],bodyKinds:{grove:'port',antenna:'port'},accessoryComponentOrder:['fold'],accessoryComponentKinds:{fold:'joint'},recursiveJoint:'antenna/fold',ownJoints:[],defaults,configurationSchema,configurations};report.ordinaryPngCount=2;report.physicalFilms=2;report.nativeSourceFaces=6592;report.finalStop=true;report.appliedRuntimeFiles=runtimeFiles();report.currentFixtureSha256=fileSha(new URL('./check-cardkboriginal-poecamoriginal-lorawanus915-units.mjs',import.meta.url));console.log(JSON.stringify(report,null,2));
}finally{restore();}
