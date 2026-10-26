import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';

function checker(model){
 model.root.updateMatrixWorld(true);
 const cast=(p,d,object=model.root,physicalOnly=false)=>new THREE.Raycaster(new THREE.Vector3(...p),new THREE.Vector3(...d)).intersectObject(object,true).filter(h=>h.object.isMesh&&h.object.material?.opacity!==0&&(!physicalOnly||!['PlaneGeometry','ShapeGeometry'].includes(h.object.geometry.type)))[0];
 const expect=(p,d,name,axis,range)=>{const h=cast(p,d);assert.equal(h?.object.name,name,`${model.meta.name}: ${p} should see ${name}, found ${h?.object.name}`);assert.ok(h.point.getComponent(axis)>=range[0]&&h.point.getComponent(axis)<=range[1],`${name} depth ${h.point.getComponent(axis)} outside ${range}`);return h;};
 return {cast,expect};
}

function common(model,{usb,sd,display,buttons}){
 const {cast,expect}=checker(model),shell=model.parts['paper-shell'];
 const sourceOpen=(p,d,axis,limit)=>{const h=cast(p,d,shell);assert.ok(!h||h.point.getComponent(axis)>limit,`${model.meta.name}: test ray must enter an actual independently supplied CAD aperture`);};
 // The two free insertion paths avoid USB's center tongue. The first surface
 // must be the deep backstop, rather than a plane at the connector entrance.
 for(const dz of [-.8,.8]){const p=[usb[0],-70,usb[2]+dz];sourceOpen(p,[0,1,0],1,-48);expect(p,[0,1,0],'USB-C dielectric backstop',1,[usb[1]+4.4,usb[1]+4.6]);}
 for(const dy of [-3.5,0,3.5]){const p=[-50,sd[1]+dy,sd[2]+.25];sourceOpen(p,[1,0,0],0,sd[0]+.7);expect(p,[1,0,0],'microSD insulating backstop',0,[sd[0]+6.4,sd[0]+6.6]);}
 expect([usb[0]+.25,-70,usb[2]+.34],[0,1,0],'USB-C contact pad',1,[usb[1]+.9,usb[1]+1.1]);
 expect([-50,sd[1]+.55,sd[2]-sd[3]/2+.44],[1,0,0],'microSD spring contact',0,[sd[0]+4.8,sd[0]+5]);
 for(const [id,face,normal,position]of [['usb','bottom',[0,-1,0],usb],['micro-sd','left',[-1,0,0],sd]]){
  const port=model.get(id);assert.ok(port,`${model.meta.name}: ${id} is a public Port`);assert.equal(port.meta.face,face);
  assert.ok(new THREE.Vector3(0,1,0).applyQuaternion(port.object3d.quaternion).distanceTo(new THREE.Vector3(...normal))<1e-6,`${id}: mating normal follows the real aperture`);
  assert.ok(port.object3d.position.distanceTo(new THREE.Vector3(...position.slice(0,3)))<1e-6);
 }
 const lcd=model.get('lcd');assert.deepEqual([lcd.width,lcd.height],display.pixels);assert.equal(lcd.touchEnabled,display.touch);
 let displayRays=0;
 for(const nx of [-.499,0,.499])for(const ny of [-.499,0,.499]){const p=[display.cx+nx*lcd.size[0],display.cy+ny*lcd.size[1],20],h=cast(p,[0,0,-1]);assert.equal(h?.object,lcd.panel,`${model.meta.name}: front cover obstructs active paper at ${p}`);displayRays++;}
 const panel=model.root.getObjectByName('EPD module body');assert.ok(panel&&new THREE.Box3().setFromObject(panel).getSize(new THREE.Vector3()).z>.8,'Physical EPD module has depth');
 for(const [id,axis]of buttons){const b=model.get(id);assert.ok(b);b.press('assembly-check');b.update(1);assert.ok(b.cap.position.distanceTo(new THREE.Vector3(...axis).multiplyScalar(b.travel))<1e-6,`${model.meta.name}: ${id} moves into its own case`);b.release('assembly-check');b.update(1);assert.ok(b.cap.position.length()<1e-6);}
 let photos=0;model.root.traverse(o=>{if(o.userData.role==='printed-artwork'&&!['official-raster','official-raster-film','reference-redraw'].includes(o.userData.artworkKind))photos++;if(o.isMesh){for(const n of o.geometry.attributes.position.array)assert.ok(Number.isFinite(n),'Finite assembly vertex');}});assert.equal(photos,0,'Unclassified photographic artwork does not hide assembly openings');
 return {displayRays,portFreePathRays:5,contactRays:2,buttonDirections:buttons.length};
}

export function checkPaperMonoAssembly(model){
 const result=common(model,{usb:[-19.262,-50.51,0],sd:[-30.02,-33,0,1.5],display:{cx:.5,cy:1.7,pixels:[480,800],touch:true},buttons:[['key1',[1,0,0]],['key2',[1,0,0]],['power',[1,0,0]]]});
 const {cast,expect}=checker(model),shell=model.parts['paper-shell'];let rgbRays=0,rearRays=0;
 // Select rays by the actual CAD opening, not the dimensions of the new lens.
 for(let y=5.5;y<=14.5;y+=.25)for(let z=-1.25;z<=1.25;z+=.25){const p=[-45,y,z],h=cast(p,[1,0,0],shell);if(h&&h.point.x> -29.5){expect(p,[1,0,0],'RGB long light guide',0,[-30,-29.85]);rgbRays++;}}
 assert.ok(rgbRays>200,'Exercise the long guide over its full CAD opening');
 expect([-45,18,0],[1,0,0],'MIC recessed diaphragm',0,[-28.4,-28.2]);
 const lens=model.get('rgb').lens;assert.equal(lens.name,'RGB long light guide');assert.ok(new THREE.Box3().setFromObject(lens).getSize(new THREE.Vector3()).y>8,'Existing rgb API controls the complete long guide');
 // Current orthographic rear reference places the NFC cover below Y=-14.4.
 // Continue checking its complete lower field and the same retained bottom edge.
 for(let x=-25;x<=25;x+=2)for(let y=-47;y<=-15;y+=2){const h=cast([x,y,-20],[0,0,1],model.root,true);assert.equal(h?.object.name,'NFC rear molded cover',`NFC rear physical cover missing at ${x},${y}`);assert.ok(h.point.z< -4&&h.point.z> -4.15);rearRays++;}
 const nfcCover=model.root.getObjectByName('NFC rear molded cover');const nfcBounds=new THREE.Box3().setFromObject(nfcCover);assert.ok(Math.abs(nfcBounds.max.y+14.4)<.01&&Math.abs(nfcBounds.min.y+49.05)<.01,'NFC cover retains its lower edge and follows the documented upper seam');
 const nfc=model.root.getObjectByName('NFC rear molded cover');assert.ok(new THREE.Box3().setFromObject(nfc).getSize(new THREE.Vector3()).z>.55,'NFC cover is a volume, not a photo plane');
 return {status:'pass',...result,rgbApertureRays:rgbRays,nfcPhysicalRearRays:rearRays,micRays:1,scope:'assembled appearance and real cavity retention; inferred concealed dimensions, not fabrication proof'};
}

export function checkPaperColorAssembly(model){
 const result=common(model,{usb:[-23.7335,-51.951,.25],sd:[-34.6,-24.45,-.75,1.4],display:{cx:.4165,cy:2.2,pixels:[400,600],touch:false},buttons:[['key1',[1,0,0]],['key2',[1,0,0]],['key3',[0,-1,0]],['power',[1,0,0]]]});
 const {cast,expect}=checker(model),shell=model.parts['paper-shell'];let bottomRays=0,speakerRays=0,ventRays=0;
 for(let x=-15;x<=15.5;x+=.5)for(let z=1;z<=2.5;z+=.25){const p=[x,-70,z],h=cast(p,[0,1,0],shell);if(!h||h.point.y> -50){expect(p,[0,1,0],'Bottom aperture molded insert',1,[-51.7,-51.6]);bottomRays++;}}
 assert.ok(bottomRays>350,'Bottom aperture is checked across its full upper band');
 for(const y of [-19.25,-16.25,-13.25])for(const z of [-.3,.3,.9]){const p=[50,y,z],h=cast(p,[-1,0,0],shell);assert.ok(!h||h.point.x<34,'Official speaker slot stays open');expect(p,[-1,0,0],'Speaker recessed diaphragm',0,[33.4,33.7]);speakerRays++;}
 for(const x of [19.5,21.3,23.2])for(const z of [-.3,.25,.7]){const p=[x,70,z],h=cast(p,[0,-1,0],shell);assert.ok(!h||h.point.y<50,'Official SHT40 air slot stays open');const a=cast(p,[0,-1,0]);assert.ok(['SHT40 local carrier','SHT40 sensor package','SHT40 perforated inlet guard'].includes(a?.object.name));assert.ok(a.point.y<49.9&&a.point.y>48.2,'Sensor air path stays recessed');ventRays++;}
 expect([-19.6,70,.25],[0,-1,0],'MIC recessed diaphragm',1,[49,49.3]);
 for(const x of [18.5,30.5])expect([x,-70,-.5],[0,1,0],'Grove retaining surround',1,[-52.1,-51.8]);
 const cavity=cast([24.7665,-70,-.5],[0,1,0]);assert.equal(cavity?.object.parent.name,'HY2.0-4P');assert.ok(cavity.point.y> -47&&cavity.point.y< -46,'Grove insert retains its deep mouth');
 const port=model.get('grove');assert.equal(port.meta.face,'bottom');assert.ok(new THREE.Vector3(0,1,0).applyQuaternion(port.object3d.quaternion).y<-.999);
 const cover=new THREE.Box3().setFromObject(model.root.getObjectByName('Paper front cover')),body=new THREE.Box3().setFromObject(shell);assert.ok(cover.getCenter(new THREE.Vector3()).distanceTo(new THREE.Vector3(.4165,-.441,4.075))<1e-4,'Front cover is aligned to selected official shell');assert.ok(cover.min.x>body.min.x&&cover.max.x<body.max.x&&cover.min.y>body.min.y&&cover.max.y<body.max.y,'Front cover stays inside the case silhouette');
 return {status:'pass',...result,bottomPhysicalInsertRays:bottomRays,speakerOpenSlotRays:speakerRays,sensorOpenSlotRays:ventRays,micRays:1,groveFlankRays:2,scope:'assembled appearance and real cavity retention; inferred concealed dimensions, not fabrication proof'};
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 const noop=()=>{},ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});globalThis.document={createElement:()=>({getContext:()=>ctx})};
 const {PaperMono}=await import('../src/devices/papermono/index.js'),{PaperColor}=await import('../src/devices/papercolor/index.js');
 for(const [Model,check]of [[PaperMono,checkPaperMonoAssembly],[PaperColor,checkPaperColorAssembly]]){const model=new Model();console.log(`PASS ${Model.name} assembly:`,JSON.stringify(check(model)));model.dispose();}
}
