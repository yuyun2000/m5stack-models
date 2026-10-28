/** MIT. Exact complete-kit native-source, assembly and externally driven interaction regression. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import * as T from 'three';
const hash=a=>createHash('sha256').update(Buffer.from(a.buffer,a.byteOffset,a.byteLength)).digest('hex');
const settle=m=>{for(let i=0;i<100;i++)m.update(.02);m.root.updateMatrixWorld(true);};
const snap=o=>({a:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,a])=>[k,hash(a.array)])),i:hash(o.geometry.index.array),w:o.matrixWorld.toArray()});
const stub=()=>{const previous=globalThis.document,noop=()=>{},ctx=new Proxy({createRadialGradient:()=>({addColorStop:noop}),measureText:()=>({width:20})},{get:(o,k)=>o[k]??noop});if(!previous)globalThis.document={createElement:()=>({getContext:()=>ctx})};return()=>{if(!previous)delete globalThis.document;};};
function baseInsertContainment(a){
 const probes=Object.values(a.nativeParts).map(o=>{const p=new T.Mesh(o.geometry,new T.MeshBasicMaterial({side:T.DoubleSide}));p.matrixWorld.copy(o.matrixWorld);p.name=o.name;return p;}),directions=[[1,.37,.23],[-.29,1,.43],[.31,.27,1]].map(v=>new T.Vector3(...v).normalize());let vertices=0,centroids=0;
 const inspect=(o,point,normal)=>{const v=point.applyMatrix4(o.matrixWorld).addScaledVector(normal.applyNormalMatrix(new T.Matrix3().getNormalMatrix(o.matrixWorld)),-.01);for(const probe of probes){let votes=0;for(const d of directions){const hits=new T.Raycaster(v,d,1e-5,1000).intersectObject(probe,false),dist=[];for(const h of hits)if(!dist.length||Math.abs(h.distance-dist.at(-1))>1e-4)dist.push(h.distance);if(dist.length%2)votes++;}assert.ok(votes<2,o.name+' enters '+probe.name+' at '+v.toArray().map(x=>x.toFixed(4)).join(','));}};
 try{for(const o of a.inferredMeshes){const p=o.geometry.attributes.position,n=o.geometry.attributes.normal,index=o.geometry.index,stride=Math.max(1,Math.floor(p.count/45));for(let i=0;i<p.count;i+=stride){inspect(o,new T.Vector3().fromBufferAttribute(p,i),new T.Vector3().fromBufferAttribute(n,i));vertices++;}const count=index?.count??p.count,faceStep=Math.max(1,Math.floor(count/3/35));for(let face=0;face<count/3;face+=faceStep){const ids=[0,1,2].map(k=>index?index.getX(face*3+k):face*3+k),v=ids.map(i=>new T.Vector3().fromBufferAttribute(p,i)),normal=v[1].clone().sub(v[0]).cross(v[2].clone().sub(v[0])).normalize();if(normal.lengthSq()<.5)continue;inspect(o,v[0].clone().add(v[1]).add(v[2]).divideScalar(3),normal);centroids++;}}return{sampledInsertMeshes:a.inferredMeshes.length,sampledVertices:vertices,sampledTriangleCentroids:centroids,nativeParityDirections:directions.length,insideProbeOffsetMm:.01,noSampleEntersOwnNativeBase:true};}finally{for(const p of probes)p.material.dispose();}
}
function matingStops(m,a,physical){
 const base=new Set([...Object.values(a.nativeParts),...a.inferredMeshes]),host=physical.filter(o=>!base.has(o)),gaps=[];
 for(const p of a.contactPins){const bounds=new T.Box3().setFromObject(p),x=(bounds.min.x+bounds.max.x)/2,y=(bounds.min.y+bounds.max.y)/2;assert.ok(Math.abs(bounds.max.z-bounds.min.z-4.14)<1e-5);assert.ok(Math.abs(bounds.max.z-(a.matingPlaneZ+a.assembledInsertionMm))<1e-5);const hit=new T.Raycaster(new T.Vector3(x,y,bounds.max.z),new T.Vector3(0,0,1),1e-5,10).intersectObjects(host,false)[0];assert.ok(hit&&/floor/i.test(hit.object.name),'actual host receiver floor must be the next first surface');assert.ok(hit.distance>.15,'assembled pin tip must leave positive actual stop gap');gaps.push(hit.distance);}
 return{actualHostStopFirstHits:gaps.length,minimumTipToStopGapMm:Math.min(...gaps),maximumTipToStopGapMm:Math.max(...gaps),metalBodyLengthMm:4.14,documentedUnmatedProjectionMm:a.documentedUnmatedPinProjectionMm,assembledInsertionMm:a.assembledInsertionMm,remainingBodyBuriedInBaseMm:4.14-a.assembledInsertionMm};
}
export async function checkKit(id){
 const restore=stub();let m,peer,naked;
 try{
  const mod=await import('../src/devices/'+id+'/index.js'),data=(await import('../src/devices/'+id+'/native-base-data.js')).default,source=JSON.parse(await readFile(new URL('../docs/research/'+id+'/native-map.json',import.meta.url),'utf8'));
  m=new mod.Model();peer=new mod.Model();naked=new mod.Model({artwork:false});m.root;peer.root;naked.root;m.root.updateMatrixWorld(true);naked.root.updateMatrixWorld(true);const a=m.voiceBaseAssembly;
  assert.equal(m.meta.sku,mod.spec.sku);assert.ok(a&&a.shellDepthMm===10&&a.documentedUnmatedPinProjectionMm===4.14&&a.assembledInsertionMm===(id==='atoms3r-ai-chatbot'?1.65:2.0));assert.equal(a.contactPins.length,9);assert.equal(source.components.reduce((n,c)=>n+c.triangles,0),source.rawFaces);assert.ok(source.allSourceFacesAccounted);
  let sourceFaces=0;for(const p of data){const o=a.nativeParts[p.id];assert.ok(o);for(const[k,digest]of Object.entries(p.sha256)){const bytes=k==='index'?o.geometry.index.array:o.geometry.attributes[k].array;assert.equal(hash(bytes),digest,id+' exact native '+k);}sourceFaces+=o.geometry.index.count/3;assert.equal(p.closedDirectedDegree2,true);}
  assert.equal(sourceFaces,source.retainedBaseFaces);
  const fixed=Object.values(a.nativeParts).map(o=>[o,snap(o)]),events=[],off=m.on('input',e=>events.push(e));
  for(const b of m.list('button')){const state=b.getActuationState();b.press('pointer');b.press('external');m.update(.008);const partial=b.getActuationState().depthMm;assert.ok(partial>0&&partial<b.travel);b.cancel('pointer');settle(m);assert.ok(Math.abs(b.getActuationState().depthMm-b.travel)<1e-8);b.release('external');settle(m);assert.equal(b.pressed,false);assert.equal(b.getActuationState().depthMm,state.depthMm);assert.ok(events.at(-1).cancelled);for(const[o,s]of fixed)assert.deepEqual(snap(o),s,'all actual native base parts fixed while controls move');}
  assert.ok(!events.some(e=>e.action==='click'));
  const nakedBase=naked.voiceBaseAssembly;for(const[k,o]of Object.entries(a.nativeParts))assert.deepEqual(snap(o),snap(nakedBase.nativeParts[k]),'ink only switch retains actual base source');
  assert.equal(a.label.geometry.attributes.position.count,nakedBase.label.geometry.attributes.position.count);assert.equal(a.expansion.children.length,nakedBase.expansion.children.length);
  const count=events.length;for(const d of m.list('display')){const peerDisplay=peer.display(d.id),old=hash(peerDisplay.buffer);d.fill('#3d78ab');assert.deepEqual([...d.buffer.slice(0,4)],[61,120,171,255]);assert.equal(hash(peerDisplay.buffer),old);}for(const l of m.list('led'))l.set({color:'#00bb88',brightness:.5});assert.equal(events.length,count,'external outputs do not echo input');
  const ports=m.list('port').filter(p=>p.connector==='grove');assert.equal(ports.length,1);assert.equal(m.port('voice-base-ext').connector,'m5.voice-base.ext-5p');
  const physical=[];m.root.traverse(o=>{if(o.isMesh&&o.userData.role!=='printed-artwork'&&[].concat(o.material).some(v=>v.opacity!==0))physical.push(o);});let rays=0;
  // A complete bottom is required behind every sampled point, including the
  // exposed five-well connector. A sticker alone is excluded from ray targets.
  for(let x=-9;x<=9;x+=1.5)for(let y=-9;y<=9;y+=1.5){const hit=new T.Raycaster(new T.Vector3(x,y,-35),new T.Vector3(0,0,1)).intersectObjects(physical,false)[0];assert.ok(hit&&hit.point.z<=a.matingPlaneZ-8,'real bottom first hit');rays++;}
  const mating=matingStops(m,a,physical),containment=baseInsertContainment(a);
  for(const o of physical)for(const mat of[].concat(o.material))assert.equal(mat.side,T.FrontSide,'no DoubleSide gap masking');off();
  return{status:'pass',id,sku:m.meta.sku,exactOwnNativeBaseFaces:sourceFaces,allSourceFacesAccounted:true,nativeBottomFirstHitRays:rays,fullyMatedPins:9,mating,baseInsertContainment:containment,speaker:{nominalFrontFrameMm:[20,14],separateBackChamberMm:[18.3,12.3,4.1],cornerRadiusMm:3.6,centerY:-3.2,hiddenDimensionsInferred:true},buttons:m.list('button').map(b=>b.id),displays:m.list('display').map(d=>[d.id,d.width,d.height]),leds:m.list('led').map(l=>l.id),partialFullCancelAndExactReturn:true,actualBaseFixed:true,inkOnlySwitch:true,externalOutputNoEchoAndPeerIsolation:true,scope:'Complete visual assembly,not audio/AI/electrical/firmware or mechanical fit acceptance'};
 }finally{m?.dispose();peer?.dispose();naked?.dispose();restore();}
}
