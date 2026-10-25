import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {Device} from '../src/core/index.js';
import {loadModel} from '../src/loaders.js';
import {physicalButton} from '../src/modeling/actuators.js';
import {DEVICE_BUTTON_COUNTS} from './check-device-actuators.mjs';

const materials=object=>Array.isArray(object.material)?object.material:object.material?[object.material]:[];
const belongs=(object,parent)=>{for(;object;object=object.parent)if(object===parent)return true;return false;};
const emissiveMaterials=root=>{const found=new Set();root.traverse(object=>{if(object.isMesh)for(const material of materials(object))if(material.emissive)found.add(material);});return found;};
const snapshot=root=>new Map([...emissiveMaterials(root)].map(material=>[material,material.emissive.toArray()]));
const unchanged=(values,why)=>{for(const [material,value]of values)assert.deepEqual(material.emissive.toArray(),value,why);};
const renderProperties=material=>{const json=material.toJSON();delete json.uuid;return json;};

function checkOptInBoundary(){
 const host=new Device(),texture=new THREE.DataTexture(new Uint8Array([9,27,81,255]),1,1),palette=new THREE.MeshPhysicalMaterial({color:0x426e91,emissive:0x010305,roughness:.64,metalness:.13,clearcoat:.17,map:texture}),shader=new THREE.ShaderMaterial({uniforms:{map:{value:texture}}}),basic=new THREE.MeshBasicMaterial({color:0x777777});
 const group=new THREE.Group(),a=new THREE.Mesh(new THREE.BoxGeometry(2,2,1),[palette,basic]),b=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),palette),screen=new THREE.Mesh(new THREE.PlaneGeometry(1,1),shader);group.add(a,b,screen);
 const fixed=new THREE.Mesh(new THREE.BoxGeometry(3,3,1),palette);host.body.add(fixed);
 const before=renderProperties(palette),fixedEmission=palette.emissive.toArray();
 const isolated=physicalButton(host,{id:'isolated',mesh:group,isolateMaterials:true}),copy=a.material[0];
 assert.ok(copy!==palette,'Opted-in cap owns an independent conventional material');assert.ok(b.material===copy,'Meshes inside the same cap retain one shared clone');assert.ok(copy.map===texture,'Cloning the cap retains its texture reference');assert.ok(a.material[1]===basic,'Unmodified non-emissive materials keep their caller-owned reference');assert.ok(screen.material===shader&&shader.uniforms.map.value===texture,'Output shader and framebuffer references remain with their owner');assert.deepEqual(renderProperties(copy),before,'Material isolation preserves every serialized inactive render property');assert.ok(fixed.material===palette,'Fixed enclosure keeps its original palette reference');
 isolated.setHover(true);assert.deepEqual(palette.emissive.toArray(),fixedEmission,'Hover cannot brighten the fixed palette');isolated.setHover(false);assert.deepEqual(renderProperties(copy),before,'Hover off restores the exact inactive material');
 const defaultMaterial=new THREE.MeshPhysicalMaterial({color:0x5c6f39}),defaultMesh=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),defaultMaterial);
 physicalButton(host,{id:'caller-owned',mesh:defaultMesh});assert.ok(defaultMesh.material===defaultMaterial,'Default physicalButton preserves externally held material references');
 host.dispose();
 return ['opt-in material ownership','same-cap sharing','unchanged inactive render properties','texture and shader reference preservation','default caller-owned material preservation'];
}

/** Hover is appearance feedback only; external displays and lights keep ownership. */
export async function checkActuatorMaterials(){
 const previousDocument=globalThis.document;
 if(!previousDocument){const noop=()=>{},ctx=new Proxy({measureText:()=>({width:20}),createRadialGradient:()=>({addColorStop:noop}),createLinearGradient:()=>({addColorStop:noop})},{get:(object,key)=>object[key]??noop,set:(object,key,value)=>(object[key]=value,true)});globalThis.document={createElement:()=>({getContext:()=>ctx})};}
 const cases=[],products=[];let controls=0,hoverMaterials=0,disposedCapMaterials=0;
 try{
  cases.push(...checkOptInBoundary());
  for(const [id,options]of [...Object.keys(DEVICE_BUTTON_COUNTS).map(id=>[id,{}]),['cores3',{dinBase:true}]]){
   const model=await loadModel(id,options),resources=new Map(),buttons=model.list('button'),label=options.dinBase?'cores3-din':id;
   try{
    for(const button of buttons){
     const capMaterials=emissiveMaterials(button.cap),own=snapshot(button.cap),outside=new Map();
     model.root.traverse(object=>{if(object.isMesh&&!belongs(object,button.cap))for(const material of materials(object))if(material.emissive)outside.set(material,material.emissive.toArray());});
     for(const material of capMaterials){assert.ok(!outside.has(material),`${label}/${button.id}: a hover material cannot also color fixed geometry or a neighbouring control`);if(!resources.has(material)){resources.set(material,0);material.addEventListener('dispose',()=>resources.set(material,resources.get(material)+1));}}
     const initialState=button.getState(),position=button.cap.position.clone();
     button.setHover(true);
     unchanged(outside,`${label}/${button.id}: hover leaves every fixed/other-control emissive channel bit-for-bit unchanged`);
     for(const [material,base]of own){const expected=material.color.clone().multiplyScalar(.18).add(new THREE.Color(...base));assert.deepEqual(material.emissive.toArray(),expected.toArray(),`${label}/${button.id}: visible cap receives its normal hover feedback`);}
     assert.deepEqual(button.getState(),initialState,`${label}/${button.id}: hover cannot press or change a stable detent`);assert.ok(button.cap.position.equals(position),`${label}/${button.id}: hover cannot move the cap`);
     button.setHover(false);unchanged(own,`${label}/${button.id}: hover off exactly restores cap emission`);unchanged(outside,`${label}/${button.id}: hover off leaves fixed/other-control emission unchanged`);
     button.press('material-check');model.update(1);button.cancel('material-check');model.update(1);if(button.latching)button.setPosition(initialState.position,{immediate:true});unchanged(own,`${label}/${button.id}: held/released input cannot fabricate cap light`);unchanged(outside,`${label}/${button.id}: held/released input cannot fabricate other-component light`);assert.equal(button.pressed,false);
     controls++;hoverMaterials+=capMaterials.size;
    }
    if(id==='cardputer-zero'){
     const cap=buttons.find(button=>button.id==='key-F1').cap,capMesh=cap.getObjectByName('Rubber key cap'),stem=cap.getObjectByName('Key membrane stem');assert.ok(capMesh.material===stem.material,'Real Zero key cap and membrane stem preserve their within-cap material sharing');
    }
    if(id==='atoms3r'){
     const lcd=model.display('lcd'),button=model.button('button'),shader=lcd.material,glass=lcd.glass.material,texture=lcd.texture;
     assert.ok(belongs(lcd.panel,button.cap),'Actual LCD remains inside the pressable cap');assert.ok(lcd.panel.material===shader&&shader.uniforms.map.value===texture,'Actual AtomS3R retains its public Display material and texture references');assert.ok(lcd.glass.material===glass,'Actual AtomS3R retains its glass reference');
     model.handle({type:'display',target:'lcd',fill:'#12ab34',backlight:.42});model.update(1);assert.deepEqual(lcd.getPixel(0,0),[18,171,52]);assert.equal(lcd.panel.material.uniforms.brightness.value,.42);
     button.setHover(true);button.press('framebuffer-check');model.update(1);model.handle({type:'display',target:'lcd',fill:'#bc3456',backlight:.73});model.update(1);assert.deepEqual(lcd.getPixel(17,29),[188,52,86]);assert.equal(lcd.panel.material.uniforms.brightness.value,.73);assert.ok(lcd.panel.material===shader&&lcd.glass.material===glass&&shader.uniforms.map.value===texture,'Framebuffer writes and cap motion preserve live shader/glass ownership');button.cancel('framebuffer-check');button.setHover(false);model.update(1);assert.equal(button.getActuationState().depthMm,0);
     cases.push('Actual AtomS3R external framebuffer/backlight during hover and held/released cap');
    }
    products.push({id:label,controls:buttons.length,hoverMaterials:[...resources].length});
   }finally{model.dispose();}
   assert.ok([...resources.values()].every(count=>count>0),`${label}: all conventional cap materials are disposed with their real model`);disposedCapMaterials+=resources.size;
  }
 }finally{if(!previousDocument)delete globalThis.document;}
 return {status:'pass',products,controls,hoverMaterials,disposedCapMaterials,cases,scope:'Real controller models plus CoreS3 DinBase: independent cap hover, exact emission restoration, fixed/neighbour material stability, stable detents, caller-owned output references and disposal. Canvas drawing boundary is stubbed; browser pixels remain separate.'};
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log('PASS actuator material isolation:',JSON.stringify(await checkActuatorMaterials()));
