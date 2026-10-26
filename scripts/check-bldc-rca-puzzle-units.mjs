import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import fs from 'node:fs/promises';
import {loadModel,loadGroveModule} from '../src/loaders.js';

const ids=['bldc-driver','rca','puzzle'];
const digest=value=>createHash('sha256').update(value).digest('hex');
const hash=array=>digest(Buffer.from(array.buffer,array.byteOffset,array.byteLength));
const stamp=value=>digest(JSON.stringify(value));
function updateWorld(object){let root=object;while(root.parent)root=root.parent;root.updateMatrixWorld(true);}
function own(unit,kind){return [...unit.components.values()].filter(c=>c.kind===kind);}
function printed(model){const panels=[];model.root.traverse(o=>{if(o.userData.role==='printed-artwork')panels.push(o);});return panels;}
function physical(model,ownOnly=false){
 updateWorld(model.root);const out=[],attachments=new Set(own(model,'port').filter(c=>c.module).map(c=>c.module.root));
 model.root.traverse(o=>{if(!o.isMesh||o.userData.role==='printed-artwork')return;if(ownOnly)for(let p=o;p&&p!==model.root;p=p.parent)if(attachments.has(p))return;out.push({name:o.name,attributes:Object.fromEntries(Object.entries(o.geometry.attributes).map(([k,v])=>[k,hash(v.array)])),index:o.geometry.index?hash(o.geometry.index.array):null,matrix:o.matrixWorld.toArray()});});return stamp(out);
}
function portFrames(unit){updateWorld(unit.root);return stamp(own(unit,'port').map(p=>({id:p.id,matrix:p.object3d.matrixWorld.toArray()})));}
function tick(host){for(let n=0;n<30;n++)host.update(1/60);}
function pixels(unit){return Array.from({length:64},(_,i)=>unit.get(`pixel-${i}`));}
const frame=unit=>pixels(unit).map(led=>led.getState());

function checkPlug(host,unit,events){
 const port=unit.port('terminal'),plug=port.module;assert.ok(plug);assert.equal(port.connector,'ht3.96-4p');assert.equal(plug.list('joint').length,4);const body=physical(unit,true),fixed=portFrames(unit),start=events.length;
 for(let i=1;i<=4;i++){
  const screw=plug.get('screw-'+i),rest=screw.object3d.quaternion.clone();screw.set({angleDeg:35});assert.ok(!screw.object3d.quaternion.equals(rest));screw.set({angleDeg:70,durationMs:120});tick(host);assert.equal(screw.getState().angleDeg,70);assert.throws(()=>screw.set({rpm:1}));screw.set({angleDeg:0});assert.ok(screw.object3d.quaternion.equals(rest));
 }
 assert.equal(events.length,start,'external screw heads emit no motor/control input');assert.equal(portFrames(unit),fixed);const complete=physical(unit),saved=port.detach({dispose:false});assert.ok(saved===plug);assert.equal(physical(unit,true),body);port.attach(saved);assert.equal(physical(unit),complete,'real plug returns exactly to the installed frame');
}
async function checkChannel(host,unit,events){
 const button=unit.button('channel');assert.equal(button.latching,true);assert.equal(button.interactive,true);button.setPosition(0,{immediate:true});const start=events.length,fixed=portFrames(unit),rest=physical(unit);
 button.setPosition(1,{immediate:true});assert.equal(events.length,start);assert.notEqual(physical(unit),rest);button.setPosition(0,{immediate:true});assert.equal(physical(unit),rest);
 button.press('branch-check');tick(host);button.release('branch-check');tick(host);assert.equal(button.getState().position,1);assert.deepEqual(events.slice(start).map(e=>e.action),['down','up','click']);
 const cancelAt=events.length;button.press('cancel-check');tick(host);const detent=button.getState().position;button.cancel('cancel-check');tick(host);assert.equal(button.getState().position,detent);assert.equal(button.getState().pressed,false);assert.deepEqual(events.slice(cancelAt).map(e=>e.action),['down','up']);assert.equal(events.at(-1).cancelled,true);button.setPosition(0,{immediate:true});assert.equal(physical(unit),rest);assert.equal(portFrames(unit),fixed);
 const closed=await loadModel('rca');try{assert.equal(closed.button('channel').interactive,false,'closed shell rejects through-cover pointer');closed.button('channel').setPosition(1,{immediate:true});assert.equal(closed.button('channel').getState().position,1);}finally{closed.dispose();}
}
async function checkMatrixCascade(host,unit,events){
 const downstream=await loadGroveModule('puzzle',{cableLength:60});unit.port('out').attach(downstream);assert.ok(host.get('grove/grove-3/out').module===downstream);assert.equal(downstream.get('cable').getState().wireCount,4);assert.equal(own(downstream,'led').length,64);assert.ok(frame(unit).every(p=>p.brightness===0));assert.ok(frame(downstream).every(p=>p.brightness===0));
 const fixed=portFrames(unit),physicalBefore=physical(unit,true),childFrame=stamp(frame(downstream)),start=events.length,colors=Array.from({length:64},(_,i)=>i===0?'#fb8e34':'#204060');
 host.handle({type:'matrix',target:'grove/grove-3/matrix',colors,brightness:.6});for(const [i,led]of pixels(unit).entries()){assert.equal(led.getState().color,colors[i]);assert.equal(led.getState().brightness,.6);}assert.equal(stamp(frame(downstream)),childFrame,'physical cascade does not implement automatic pixel forwarding');
 const beforeSingle=frame(unit);host.handle({type:'led',target:'grove/grove-3/pixel-63',color:'#34a866',brightness:.25});assert.equal(unit.get('pixel-63').getState().color,'#34a866');assert.equal(unit.get('pixel-63').getState().brightness,.25);assert.deepEqual(frame(unit).slice(0,63),beforeSingle.slice(0,63),'real pixels remain independently addressable');
 const rgba=Array.from({length:64},(_,i)=>[230,80,45,i===0?0:128]).flat();host.handle({type:'matrix',target:'grove/grove-3/matrix',rgba,brightness:.5});assert.equal(unit.get('pixel-0').getState().brightness,0);assert.ok(Math.abs(unit.get('pixel-1').getState().brightness-.5*128/255)<1e-12);assert.equal(stamp(frame(downstream)),childFrame);assert.equal(events.length,start,'matrix and pixel commands emit no input event');
 const old=stamp(frame(unit));for(const command of [{colors:colors.slice(1)},{rgba:rgba.slice(1)},{rgba:rgba.map((v,i)=>i===3?256:v)},{colors,brightness:NaN}])assert.throws(()=>unit.get('matrix').handle({type:'matrix',...command}));assert.equal(stamp(frame(unit)),old,'invalid frame rejected before partial lamp mutation');assert.equal(physical(unit,true),physicalBefore);assert.equal(portFrames(unit),fixed);
 host.handle({type:'pose',target:'grove/grove-3/out/unitFrame',position:[32,90,6],rotation:[.12,0,.2]});assert.equal(downstream.get('cable').getState().wireCount,4);assert.equal(stamp(frame(unit)),old);const body=physical(unit,true),saved=unit.port('out').detach({dispose:false});assert.ok(saved===downstream);assert.equal(physical(unit,true),body);unit.port('out').attach(saved);assert.ok(unit.port('out').module===downstream);assert.equal(stamp(frame(downstream)),childFrame);
 return{pixelsPerTile:64,tiles:2,matrixFormats:['colors64','rgba256'],automaticDataForwarding:false};
}
async function checkBridge(){
 const {Bridge}=await import('../src/units/puzzle/index.js');assert.equal(typeof Bridge,'function');const on=new Bridge(),off=new Bridge({artwork:false});
 try{assert.equal(on.list('port').length,0,'unresolved bridge fit does not create a fictitious mating port');assert.equal(on.list('led').length,0);assert.equal(on.list('button').length,0);assert.ok(printed(on).length>0);assert.equal(printed(off).length,0);assert.equal(physical(on),physical(off),'separate bridge artwork preserves all physical attributes, indices and world matrices');return{separateExport:'Bridge',fittedAssembly:false,artworkToggle:'pass'};}finally{on.dispose();off.dispose();}
}

/** Real products and recursive four-wire connections; only the Node canvas is substituted. */
export async function checkBldcRcaPuzzleUnits(){
 const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});
 const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};let host,wrong;
 try{
  host=await loadModel('sticks3');host.display().fill('#123456');const framebuffer=hash(host.display().buffer),hub=await loadGroveModule('hub');host.port('grove').attach(hub);const units={},artwork=[],events=[];host.on('input',event=>{if(event.kind!=='port')events.push(event);});
  for(const [i,id] of ids.entries()){
   const unit=await loadGroveModule(id,{terminalPlug:true,covers:false,cableLength:65+i*15});units[id]=unit;hub.port(`grove-${i+1}`).attach(unit);assert.ok(host.get(`grove/grove-${i+1}`).module===unit);assert.equal(unit.get('cable').getState().wireCount,4);assert.equal(unit.components.has('sensor'),false,'output assemblies have no invented sensor');
   const menu=catalog.products.find(p=>p.id===id)?.configurations??[];
   if(id==='bldc-driver'){assert.ok(menu.some(c=>c.options.terminalPlug===true));assert.ok(menu.some(c=>c.options.terminalPlug!==true));}
   if(id==='rca'){assert.ok(menu.some(c=>c.options.covers===false));assert.ok(menu.some(c=>c.options.covers!==false));}
   for(const configuration of [{},...menu.map(c=>c.options)]){
    const on=await loadModel(id,configuration),off=await loadModel(id,{...configuration,artwork:false});
    try{const panels=printed(on);assert.ok(panels.length>0);assert.equal(printed(off).length,0);assert.equal(physical(on),physical(off),'printing preserves all physical attributes, indices and world matrices in every configuration');for(const panel of panels){assert.ok(panel.parent&&panel.geometry.attributes.position.count>0);assert.equal(panel.material.alphaTest,.04);assert.equal(panel.userData.artworkKind,'reference-redraw');}if(!artwork.some(r=>r.id===id))artwork.push({id,panels:panels.length,kinds:[...new Set(panels.map(p=>p.userData.artworkKind))]});}finally{on.dispose();off.dispose();}
   }
  }
  const bldc=units['bldc-driver'],rca=units.rca,puzzle=units.puzzle;
  assert.equal(own(bldc,'button').length,0);assert.equal(own(bldc,'led').length,0);assert.equal(own(bldc,'joint').length,0);assert.deepEqual(own(rca,'button').map(c=>c.id),['channel']);assert.equal(own(rca,'led').length,0);assert.equal(own(rca,'joint').length,0);assert.equal(own(puzzle,'button').length,0);assert.equal(own(puzzle,'joint').length,0);assert.equal(own(puzzle,'led').length,64);assert.equal(puzzle.list('display').length,0);
  assert.throws(()=>host.handle({type:'motor',target:'grove/grove-1/terminal',rpm:200}));assert.throws(()=>host.handle({type:'video',target:'grove/grove-2/rca',pixels:[1]}));assert.throws(()=>host.handle({type:'ws2812',target:'grove/grove-3/matrix',bytes:[1]}));
  checkPlug(host,bldc,events);await checkChannel(host,rca,events);const matrix=await checkMatrixCascade(host,puzzle,events),bridge=await checkBridge();
  wrong=await loadGroveModule('key');for(const port of [bldc.port('terminal'),rca.port('rca')]){const saved=port.module;assert.notEqual(port.connector,'grove');assert.throws(()=>port.attach(wrong));assert.ok(port.module===saved);}wrong.dispose();wrong=null;
  for(const [i,id] of ids.entries()){host.handle({type:'pose',target:`grove/grove-${i+1}/unitFrame`,position:[i*45,160+i*15,8],rotation:[.1,-.2,.15]});host.handle({type:'cable',target:`grove/grove-${i+1}/cable`,slack:12,bend:[0,0,-1]});assert.equal(units[id].get('cable').getState().wireCount,4);}
  assert.equal(hash(host.display().buffer),framebuffer);hub.port('grove-2').detach();assert.equal(hub.port('grove-2').module,null);assert.ok(hub.port('grove-1').module===bldc&&hub.port('grove-3').module===puzzle);
  return{status:'pass',artwork,matrix,bridge,cases:['three-real-four-wire-Grove-branches','actual-BLDC-four-screw-plug-and-independent-detach','real-RCA-single-stable-channel-selector-covered-and-uncovered','64-real-independent-RGB-packages-and-external-colors-RGBA-matrix','second-real-Puzzle-four-wire-cascade-without-automatic-data-forwarding','invalid-frame-rejected-before-mutation','separate-actual-bridge-shape-without-unsupported-fit-claim','no-invented-motor-sensor-display-or-hidden-LED','non-Grove-mating-and-internal-function-rejection','configured-artwork-keeps-physical-attributes-indices-and-world-matrices','external-pose-and-selective-detach'],scope:'New actual assemblies, external shapes/lights and input intent only; Node canvas stub, no browser, motor, PWM, protection, audio, video, serial protocol, timing, MCU, electrical, hardware, bridge mating or whole-catalog acceptance'};
 }finally{wrong?.dispose();host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkBldcRcaPuzzleUnits(),null,2));
