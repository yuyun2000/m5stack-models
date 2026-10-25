import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';

export function checkStickS3Assembly(model){
 model.root.updateMatrixWorld(true);
 const hit=(p,d)=>new THREE.Raycaster(new THREE.Vector3(...p),new THREE.Vector3(...d)).intersectObject(model.root,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0)[0];
 const hat=model.root.getObjectByName('Hat2 physical 2x8 receptacle');assert.ok(hat,'StickS3: physical Hat2 receptacle');
 let headerRays=0,topRays=0;
 for(let c=0;c<8;c++)for(let row=0;row<2;row++){
  const p=hat.localToWorld(new THREE.Vector3((c-3.5)*2.54,(row-.5)*2.54,4));
  const h=hit(p.toArray(),[0,-1,0]);assert.equal(h?.object.name,'Header socket floor','StickS3: each of the sixteen Hat2 bores remains open into its physical floor');assert.ok(h.point.y>22&&h.point.y<22.3,'StickS3: actual header depth, no painted plane');headerRays++;
 }
 for(const x of [-2,0,2])for(const z of [-.8,0,.45]){
  const h=hit([x,30,z],[0,-1,0]);assert.equal(h?.object.name,'Speaker acoustic enclosure','StickS3: acoustic insert is inside the actual three CAD slots');assert.ok(h.point.y<23.6&&h.point.y>23.2,'StickS3: speaker slots keep real depth');topRays++;
 }
 const tx=hit([6.5,30,-1.2],[0,-1,0]);assert.ok(tx?.object===model.get('irTx').lens,'StickS3: transmitter lens sits inside the actual upper socket, not on the solid case');assert.ok(tx.point.y<24&&tx.point.y>23.5);topRays++;
 for(const dx of [-.3,.3]){const edge=hit([6.5+dx,30,-1.2],[0,-1,0]);assert.ok(edge?.object===model.get('irTx').lens,'StickS3: lens shoulders must not be buried in the package face');}
 const rx=hit([-6.3,30,-1.2],[0,-1,0]);assert.equal(rx?.object.name,'IR receiver optical window');assert.ok(rx.point.y<24&&rx.point.y>23.5);topRays++;
 const usb=hit([0,-30,2.5],[0,1,0]);assert.equal(usb?.object.name,'USB-C dielectric backstop','StickS3: physical USB-C insertion cavity');assert.ok(usb.point.y> -21&&usb.point.y< -20,'StickS3: USB mouth keeps 3.5 mm depth');
 for(const [x,z]of [[-4.4,2.8],[4.4,2.8],[-4,3.1],[4,3.1]]){const corner=hit([x,-35,z],[0,1,0]);assert.equal(corner?.object.name,'USB-C rectangular package surround','StickS3: USB corner sees a real package instead of the internal blue key');assert.ok(corner.point.y< -23.5);}
 const board=model.root.getObjectByName('StickS3 main PCB');
 for(const x of [-9,9])assert.equal(new THREE.Raycaster(new THREE.Vector3(x,-21.06,-10),new THREE.Vector3(0,0,1)).intersectObject(board,true).length,0,'StickS3: lower assembly shafts have real board clearance');
 const grove=hit([0,-30,-5],[0,1,0]);assert.ok(grove?.object.parent?.name==='HY2.0-4P'&&grove.point.y> -19&&grove.point.y< -17,'StickS3: Grove mouth remains genuinely open');
 for(const x of [-9,9]){
  const flange=hit([x+1,-15.56,-20],[0,0,1]);assert.equal(flange?.object.name,'M2 insert flange','StickS3: actual brass insert aligns with rear CAD bore');
  const bore=hit([x,-15.56,-20],[0,0,1]);assert.equal(bore?.object.name,'M2 blind bore floor');assert.ok(bore.point.z> -4.8&&bore.point.z< -4.6,'StickS3: rear mounting bore retains depth');
  const screw=hit([x,-21.06,-20],[0,0,1]);assert.equal(screw?.object.name,'Screw hex floor');assert.ok(screw.point.z> -3&&screw.point.z< -2.6,'StickS3: lower fastener is recessed, not floating at the rear label plane');
 }
 for(const [side,y,z,name]of [[1,-4.75,2.25,'KEY2 switch carrier'],[1,-4.75,2.75,'KEY2 switch carrier'],[1,-4.5,2.5,'KEY2 switch carrier'],[1,-4.5,3.25,'KEY2 switch carrier'],[-1,-16,3.25,'Power switch carrier'],[-1,-16,3.5,'Power switch carrier'],[-1,-15.5,3.25,'Power switch carrier'],[-1,-15.5,3.5,'Power switch carrier']]){
  const h=hit([side*20,y,z],[-side,0,0]);assert.equal(h?.object.name,name,'StickS3: true side-key travel slit has its own carrier, not a view of the blue front-key stem');assert.ok(Math.abs(h.point.x)>11.3&&Math.abs(h.point.x)<11.5);
 }
 const lcd=model.display('lcd');assert.deepEqual(lcd.size,[14.864,24.912],'StickS3: official A183 active area');
 for(const [x,y]of [[0,0],[-.48,-.48],[-.48,.48],[.48,-.48],[.48,.48]]){const p=lcd.object3d.localToWorld(new THREE.Vector3(lcd.size[0]*x,lcd.size[1]*y,30));assert.ok(hit(p.toArray(),[0,0,-1])?.object===lcd.panel,'StickS3: actual display area stays visible');}
 assert.ok(new THREE.Box3().setFromObject(model.root.getObjectByName('LCD module with physical depth')).getSize(new THREE.Vector3()).z>1.8,'StickS3: actual LCD subassembly');
 assert.deepEqual(model.get('hat').object3d.position.toArray(),[0,24,0],'StickS3: existing Hat2 mating frame retained');assert.equal(model.get('hat').connector,'m5.hat2');assert.equal(model.get('hat').pins.length,16);
 for(const [id,face,out]of [['usb','bottom',[0,-1,0]],['grove','bottom',[0,-1,0]],['hat','top',[0,1,0]]]){const p=model.get(id);assert.equal(p.meta.face,face);assert.ok(new THREE.Vector3(0,1,0).applyQuaternion(p.object3d.quaternion).distanceTo(new THREE.Vector3(...out))<1e-6);}
 for(const id of ['btnA','btnB','btnPWR'])assert.ok(model.get(id),'StickS3: preserve existing visual controls');
 return {status:'pass',hatBores:headerRays,topApertureRays:topRays,usbCornerRays:4,sideCarrierRays:8,rearMountAndFastenerRays:6,shaftClearances:2,scope:'assembled appearance geometry; exact shell and A183 active area, concealed packaging remains photo-derived'};
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 const noop=()=>{},ctx=new Proxy({measureText:()=>({width:20}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});globalThis.document={createElement:()=>({getContext:()=>ctx})};
 const {StickS3}=await import('../src/devices/sticks3/StickS3.js');const model=new StickS3();try{console.log('PASS StickS3 assembly:',JSON.stringify(checkStickS3Assembly(model)));}finally{model.dispose();}
}
