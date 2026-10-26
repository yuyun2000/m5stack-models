import assert from 'node:assert/strict';
import * as THREE from 'three';
import {Device,Button} from '../src/core/index.js';
import {slab} from '../src/modeling/parts.js';
import {printedArtwork,printedFilm} from '../src/modeling/artwork.js';

// Exercise real projected geometry and transformed ownership, independently of
// image decoding. Source pixels and final appearance are checked in a browser.
export function checkPrintedArtwork(){
 const host=new Device(),part=slab(host.body,12,10,1,.5,[0,0,0],new THREE.MeshStandardMaterial(),[{w:3,h:3,r:1.5}],.05);
 const button=host.add(new Button({id:'test-cap',mesh:part,travel:.25}));
 const labels=printedArtwork(host,{target:part,url:'data:image/png;base64,',size:[11,9],position:[0,0,1],depth:.2});
 assert.equal(labels.length,1,'a real supported surface creates one label');
 const label=labels[0];assert.ok(label.parent===part,'projected artwork belongs to the physical cap');
 host.root.updateMatrixWorld(true);
 const ray=(x,y,object)=>new THREE.Raycaster(new THREE.Vector3(x,y,10),new THREE.Vector3(0,0,-1)).intersectObject(object,false);
 assert.equal(ray(0,0,label).length,0,'projection preserves the real through-hole');
 assert.ok(ray(4,0,label).length>0,'projection includes solid material beside the hole');
 const before=label.getWorldPosition(new THREE.Vector3());button.press('check');button.update(1);host.root.updateMatrixWorld(true);
 const after=label.getWorldPosition(new THREE.Vector3());assert.ok(Math.abs(after.z-before.z+.25)<1e-6,'print follows cap travel');
 button.release('check');button.update(1);host.root.updateMatrixWorld(true);assert.ok(label.getWorldPosition(new THREE.Vector3()).distanceTo(before)<1e-6,'print returns with the released cap');
 const film=printedFilm(host,{url:'data:image/png;base64,',size:[8,6],position:[0,0,2],parent:part,holes:[{w:2,h:2,r:1}]});
 host.root.updateMatrixWorld(true);assert.equal(ray(0,0,film).length,0,'physical film retains its explicit die-cut hole');assert.ok(ray(3,0,film).length>0);
 host.root.scale.setScalar(2);
 const scaled=printedArtwork(host,{target:part,url:'unused',size:[8,8],position:[0,0,1],depth:.2})[0];host.root.updateMatrixWorld(true);
 assert.ok(Math.abs(ray(6,0,scaled)[0].uv.x-.875)<1e-5,'projection retains model-space scale when an ancestor is scaled');
 const thin=slab(host.body,6,6,.1,.2,[0,0,3],new THREE.MeshStandardMaterial(),[],.01);
 const thinLabel=printedArtwork(host,{target:thin,url:'unused',size:[4,4],position:[0,0,3.05],depth:.3})[0];
 assert.ok([...thinLabel.geometry.attributes.normal.array].filter((_,i)=>i%3===2).every(z=>z>0),'a thin part receives print on its outward face only');
 const disabled=new Device({artwork:false}),surface=new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.MeshStandardMaterial());disabled.body.add(surface);
 assert.equal(printedArtwork(disabled,{target:surface,url:'unused',size:[2,2],position:[0,0,0]}),null);
 assert.equal(printedFilm(disabled,{url:'unused',size:[2,2],position:[0,0,0]}),null);
 host.dispose();disabled.dispose();
 return {status:'pass',projectedHole:true,filmHole:true,capTravelMm:.25,release:true,ancestorScale:true,outwardFacesOnly:true,explicitDisable:true,scope:'geometry and ownership; raster decoding and visual fit require browser review'};
}
