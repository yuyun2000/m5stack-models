import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {Button} from '../src/core/components/Button.js';

function fixture(options={}){return new Button({id:'fixture',mesh:new THREE.Mesh(new THREE.BoxGeometry(3,3,1),new THREE.MeshStandardMaterial()),longPressMs:0,...options});}
const settle=b=>{for(let i=0;i<80;i++)b.update(1/60);};

export async function checkButtonActuation(){
 const b=fixture({position:[2,3,4],axis:[1,0,0],travel:.3}),events=[];for(const action of ['down','up','click'])b.on(action,e=>events.push(e));
 assert.deepEqual(b.object3d.position.toArray(),[2,3,4],'Existing array component placement stays compatible');
 assert.deepEqual(b.getActuationState(),{depthMm:0,targetDepthMm:0,settled:true});
 b.onPointerDown({pointerId:7});b.press('key:Space');b.handle({action:'press',source:'remote'});settle(b);
 assert.equal(events.filter(e=>e.action==='down').length,1,'Pointer, keyboard and handle sources share one physical depression');assert.equal(b.cap.position.x,.3);
 assert.deepEqual(b.getActuationState(),{depthMm:.3,targetDepthMm:.3,settled:true});
 b.onPointerUp({pointerId:7});b.release('key:Space');settle(b);assert.equal(b.pressed,true,'A remaining remote hold prevents a premature spring return');assert.equal(b.cap.position.x,.3);
 b.handle({action:'release',source:'remote'});assert.equal(b.update(1),true,'The exact release endpoint must request its final rendered frame');assert.equal(b.cap.position.length(),0);assert.equal(b.update(1/60),false,'Only an unchanged tick goes idle');assert.equal(events.filter(e=>e.action==='click').length,1);
 const beforeClicks=events.filter(e=>e.action==='click').length;b.onPointerDown({pointerId:8});settle(b);b.onPointerCancel({pointerId:8});settle(b);assert.equal(b.pressed,false);assert.equal(b.cap.position.length(),0);assert.equal(events.filter(e=>e.action==='click').length,beforeClicks,'Pointer cancellation returns the real cap without a click');assert.equal(events.filter(e=>e.action==='up').at(-1).cancelled,true);
 b.press('key:Enter');b.press('pointer:9');b.cancel('key:Enter');assert.equal(b.pressed,true);b.release('pointer:9');assert.equal(events.filter(e=>e.action==='click').length,beforeClicks,'A cancelled overlapping gesture cannot later leak a click');assert.equal(b.getState().pressed,false);
 b.handle({action:'press'});assert.equal(b.update(1),true,'The precise depressed endpoint also renders');assert.equal(b.update(1/60),false);b.handle({action:'cancel'});settle(b);assert.equal(b.cap.position.length(),0);
 const latch=fixture({latching:true,travel:2,axis:[1,0,0]});assert.equal(latch.isLatching,true);latch.onPointerDown({pointerId:1});settle(latch);latch.onPointerUp({pointerId:1});settle(latch);assert.equal(latch.position,1);assert.equal(latch.getState().position,1);assert.equal(latch.cap.position.x,2,'A slider stays at its second detent after pointer release');assert.equal(latch.pressed,false);
 latch.press('key:Space');latch.press('key:Enter');settle(latch);assert.equal(latch.position,0,'One new multi-source press toggles a slider only once');latch.release('key:Space');latch.cancel('key:Enter');settle(latch);assert.equal(latch.cap.position.x,0);latch.setPosition(1,{immediate:true});assert.equal(latch.cap.position.x,2);latch.handle({action:'position',value:0});settle(latch);assert.equal(latch.cap.position.length(),0);assert.throws(()=>latch.setPosition(.5),RangeError);assert.throws(()=>b.setPosition(1));
 const touch=fixture({travel:0});touch.onPointerDown({pointerId:4});settle(touch);assert.equal(touch.pressed,true);assert.equal(touch.cap.position.length(),0,'Capacitive targets preserve input without fake mechanical travel');touch.onPointerUp({pointerId:4});
 const timed=fixture({travel:.2});timed.press('key:Space');timed.click(5);await new Promise(r=>setTimeout(r,15));assert.equal(timed.pressed,true,'A timed click cannot release an independent keyboard hold');timed.release('key:Space');settle(timed);assert.equal(timed.cap.position.length(),0);
 const disposed=fixture();let disposedUps=0;disposed.on('up',()=>disposedUps++);disposed.click(5);disposed.dispose();await new Promise(r=>setTimeout(r,15));assert.equal(disposedUps,0,'Disposal cancels delayed click release');
 for(const item of [b,latch,touch,timed])item.dispose();
 return {status:'pass',inputRoutes:['pointer','keyboard source','handle'],cases:['combined holds','normal release','pointer cancel','overlap cancel','final-frame rendering','stable latching detents','external detent set','zero-travel capacitive target','timed-click ownership','dispose timer cleanup'],scope:'visual actuation and input events only; no hardware power behavior'};
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log('PASS Button actuation:',JSON.stringify(await checkButtonActuation()));
