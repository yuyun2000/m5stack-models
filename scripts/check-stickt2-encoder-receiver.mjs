/** MIT. Guarded own K016-T2 receiver amendment probe; no artifact writes. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import * as T from 'three';
import Model from '../src/devices/stickt2/index.js';
import {nativeParts} from '../src/devices/stickt2/native-data.js';
const hash=a=>createHash('sha256').update(Buffer.from(a.buffer,a.byteOffset,a.byteLength)).digest('hex');
const record=o=>({attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,a])=>[k,hash(a.array)])),index:o.geometry.index?hash(o.geometry.index.array):null,matrix:o.matrixWorld.toArray()});
function world(m){m.root.updateMatrixWorld(true);}
function settle(m){for(let i=0;i<60;i++)m.update(1/60);world(m);}
function physical(m){const rows=[];m.root.traverse(o=>{if(o.isMesh&&o.userData.role!=='printed-artwork'&&o.material.opacity!==0)rows.push(o);});return rows;}
function shoot(m,origin,direction,objects=null,frame=m.body){world(m);return new T.Raycaster(frame.localToWorld(new T.Vector3(...origin)),new T.Vector3(...direction).transformDirection(frame.matrixWorld)).intersectObjects(objects??physical(m),true)[0];}
function inFrame(o,frame){const p=o.geometry.attributes.position,matrix=frame.matrixWorld.clone().invert().multiply(o.matrixWorld),points=[];for(let i=0;i<p.count;i++)points.push(new T.Vector3().fromBufferAttribute(p,i).applyMatrix4(matrix));return points;}
function bounds(o,frame){return new T.Box3().setFromPoints(inFrame(o,frame));}
function proveNativeRest(m){for(const p of nativeParts){const g=m.stickT2Assembly.parts[p.id].geometry;for(const[k,v]of Object.entries(p.attributeSha256))assert.equal(hash(k==='index'?g.index.array:g.attributes[k].array),v,'Own native source attributes unchanged');}}
function closed(o){
 const p=o.geometry.attributes.position,idx=o.geometry.index,keys=[],edges=new Map();let volume=0,triangles=0;
 for(let i=0;i<p.count;i++)keys.push([p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(','));
 for(let i=0;i<(idx?.count??p.count);i+=3){const ids=[0,1,2].map(k=>idx?idx.getX(i+k):i+k),v=ids.map(j=>new T.Vector3().fromBufferAttribute(p,j));
  const area=v[1].clone().sub(v[0]).cross(v[2].clone().sub(v[0])).length();if(area<1e-10)continue;
  triangles++;volume+=v[0].dot(v[1].clone().cross(v[2]))/6;
  for(let k=0;k<3;k++){const a=keys[ids[k]],b=keys[ids[(k+1)%3]];if(a===b)continue;const key=[a,b].sort().join('|'),e=edges.get(key)??[0,0];e[0]++;e[1]+=a<b?1:-1;edges.set(key,e);}
 }
 assert.ok(volume>1e-8,'Positive closed solid: '+o.name);assert.ok([...edges.values()].every(([n,d])=>n===2&&d===0),'Directed closed two-edge solid: '+o.name);
 assert.equal(o.material.side,T.FrontSide,'Real outward material: '+o.name);return triangles;
}
export async function inspectStickT2EncoderReceiver(){
 const old=globalThis.document,noop=()=>{},ctx=new Proxy({createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});if(!old)globalThis.document={createElement:()=>({getContext:()=>ctx})};
 const m=new Model({artwork:false});let report;
 try{
  world(m);proveNativeRest(m);const a=m.stickT2Assembly,r=a.encoderReceiver;assert.ok(r?.housing===a.encoderStator&&r.stop===a.encoderShaftStop);
  for(const o of[r.housing,r.stop]){assert.equal(o.material.side,T.FrontSide);assert.notEqual(o.geometry.type,'PlaneGeometry');assert.ok(o.material.opacity>0);closed(o);}
  const hb=bounds(r.housing,m.body),sb=bounds(r.stop,m.body),bb=bounds(a.battery,m.body),pb=bounds(a.pcb,m.body),batteryGap=Math.min(hb.min.x,sb.min.x)-bb.max.x,pcbGap=pb.min.z-hb.max.z;
  assert.ok(batteryGap>.08,'Receiver clears actual battery envelope');assert.ok(pcbGap>.08,'Receiver stays behind actual main board');
  const boreWalls=[];for(const d of[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0]]){const hit=shoot(m,[0,0,-3.0],d,[r.housing],r.frame);assert.ok(hit?.object===r.housing,'Four actual shaft bore walls');boreWalls.push(hit.distance);}
  const stop=shoot(m,[0,0,1],[0,0,-1],[r.housing,r.stop],r.frame);assert.ok(stop?.object===r.stop,'Shaft hole reaches closed deep stop');const stopFront=r.frame.worldToLocal(stop.point.clone()).z;
  const shaft=[];a.press.cap.traverse(o=>{if(o.name==='StickT2 moving encoder shaft')shaft.push(o);});assert.equal(shaft.length,1);
  const patches=[];for(const y of[-2.5,-3,-3.5,-12.5,-13,-13.5])for(const z of[-5.6,-5,-4.7,-4.1])patches.push([30,y,z]);let rays=0,minRadial=Infinity,minAxial=Infinity;
  for(const rotated of[false,true]){
   m.root.position.set(rotated?3:0,rotated?-4:0,rotated?7:0);m.root.rotation.set(...(rotated?[.19,-.23,.17]:[0,0,0]));world(m);const fixed=[record(r.housing),record(r.stop)];
   for(const state of['rest','partial','full','returned']){
    for(const b of m.list('button')){if(state==='partial'||state==='full')b.press('receiver-fixture');else b.cancel('receiver-fixture');}if(state==='partial'){m.update(.008);world(m);}else settle(m);
    for(const angleDeg of[0,90,233]){
     m.get('rotation').set({angleDeg});world(m);for(const p of patches){const hit=shoot(m,p,[-1,0,0]);assert.ok(hit?.object===r.housing,'Receiver first at former battery/background sample '+p.join(','));rays++;}
     assert.deepEqual([record(r.housing),record(r.stop)],fixed,'Receiver stays fixed through actual press and rotation');const points=inFrame(shaft[0],r.frame),radius=Math.max(...points.map(p=>Math.hypot(p.x,p.y))),back=Math.min(...points.map(p=>p.z));minRadial=Math.min(minRadial,...boreWalls.map(v=>v-radius));minAxial=Math.min(minAxial,back-stopFront);
    }
   }
  }
  assert.ok(minRadial>.16,'Actual shaft retains radial clearance');assert.ok(minAxial>.8,'Full press clears deep stop');m.get('rotation').set({angleDeg:0});for(const b of m.list('button'))b.cancel('receiver-fixture');settle(m);proveNativeRest(m);
  report={status:'pass',id:'stickt2',amendment:'encoder-receiver-2026-10-28',formerWindowSamples:24,firstMaterialRays:rays,poses:2,states:['rest','partial','full','returned'],anglesDeg:[0,90,233],formerBatteryAndBackgroundNowActualReceiver:true,receiverIsClosedThicknessAndFrontSide:true,shaftBorePhysicalWalls:boreWalls.length,shaftDeepStop:true,minimumShaftRadialClearanceMm:minRadial,minimumFullPressToStopMm:minAxial,batteryClearanceMm:batteryGap,mainBoardClearanceMm:pcbGap,receiverFixedAllAttributesIndexWorld:true,ownNativeRestArraysUnchanged:true,scope:'Own digital assembly;concealed receiver dimensions remain visual inferences,not production mounting,material or physical-device certification.'};
 }finally{m.dispose();if(!old)delete globalThis.document;}
 return report;
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await inspectStickT2EncoderReceiver(),null,2));
