import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {fileURLToPath,pathToFileURL} from 'node:url';

const execute=promisify(execFile);

/** Isolate the DOM/renderer fixture from other checks and their module cache. */
export async function checkViewerLifecycle(){
 const {stdout}=await execute(process.execPath,[fileURLToPath(import.meta.url),'--fixture'],{maxBuffer:1024*1024});
 const report=JSON.parse(stdout.trim());assert.equal(report.status,'pass');return report;
}

async function fixture(){
 const {register}=await import('node:module');
 const THREE=await import('three');
 const {Device}=await import('../src/core/Device.js');
 const {Module}=await import('../src/core/Module.js');
 const {Button}=await import('../src/core/components/Button.js');
 const {Port}=await import('../src/core/components/Port.js');
 const {VisualJoint}=await import('../src/core/components/VisualJoint.js');
 const {VisualSlide}=await import('../src/core/components/VisualSlide.js');
 let clock=0,sequence=0;const frames=new Map(),observers=[],renderers=[];
 class Target{
  constructor(){this.listeners=new Map();this.style={};this.tagName='DIV';}
  addEventListener(type,fn){if(!this.listeners.has(type))this.listeners.set(type,new Set());this.listeners.get(type).add(fn);}
  removeEventListener(type,fn){this.listeners.get(type)?.delete(fn);}
  dispatch(type,values={}){const event={type,target:this,preventDefault(){this.defaultPrevented=true;},...values};for(const fn of [...(this.listeners.get(type)??[])])fn(event);return event;}
  listenerCount(){return [...this.listeners.values()].reduce((sum,set)=>sum+set.size,0);}
 }
 const document=new Target();document.hidden=false;document.activeElement=null;
 const noop=()=>{},context=new Proxy({createRadialGradient:()=>({addColorStop:noop}),measureText:()=>({width:20})},{get:(object,key)=>object[key]??noop});
 document.createElement=()=>({getContext:()=>context});
 class Canvas extends Target{
  constructor(){super();this.tagName='CANVAS';this.captures=new Set();this.clientHeight=400;}
  focus(){const old=document.activeElement;if(old!==this){document.activeElement=this;old?.dispatch('blur');}}
  setPointerCapture(id){this.captures.add(id);}
  hasPointerCapture(id){return this.captures.has(id);}
  releasePointerCapture(id){if(this.captures.delete(id))this.dispatch('lostpointercapture',{pointerId:id});}
  getBoundingClientRect(){return {left:0,top:0,width:500,height:400};}
  remove(){this.removed=true;}
 }
 Object.assign(globalThis,{window:new Target(),document,performance:{now:()=>clock},requestAnimationFrame:fn=>{const id=++sequence;frames.set(id,fn);return id;},cancelAnimationFrame:id=>frames.delete(id),ResizeObserver:class{constructor(fn){this.fn=fn;observers.push(this);}observe(){}disconnect(){this.disconnected=true;}}});
 globalThis.__m5ViewerLifecycleRenderer=class{
  constructor(){this.domElement=new Canvas();this.shadowMap={};this.disposals=0;renderers.push(this);}
  setPixelRatio(){}setSize(){}render(){this.renders=(this.renders??0)+1;}dispose(){this.disposals++;}
 };
 // Import the actual Viewer module with only its GPU constructor substituted.
 // Its lifecycle, DOM listeners, private input maps and RAF loop run unchanged.
 const viewerUrl=new URL('../src/core/DeviceViewer.js',import.meta.url).href,threeUrl=import.meta.resolve('three');
 const shim='data:text/javascript,'+encodeURIComponent(`export * from ${JSON.stringify(threeUrl)};export const WebGLRenderer=globalThis.__m5ViewerLifecycleRenderer;`);
 register('data:text/javascript,'+encodeURIComponent(`export async function resolve(s,c,next){if(s==='three'&&c.parentURL===${JSON.stringify(viewerUrl)})return {url:${JSON.stringify(shim)},shortCircuit:true};return next(s,c);}`),import.meta.url);
 const {DeviceViewer}=await import(viewerUrl);
 const owned=new Map(),events=[],checks=[];
 const mesh=()=>{const geometry=new THREE.BoxGeometry(3,3,1),material=new THREE.MeshStandardMaterial();for(const resource of [geometry,material]){owned.set(resource,0);resource.addEventListener('dispose',()=>owned.set(resource,owned.get(resource)+1));}return new THREE.Mesh(geometry,material);};
 class Unit extends Module{
  static meta={id:'fixture.unit',name:'Fixture Unit',connector:'grove'};
  build(){this.add(new Button({id:'press',mesh:mesh(),longPressMs:0}));this.add(new Port({id:'next',connector:'grove'}));this.add(new VisualJoint({id:'spin',continuous:true}));}
 }
 class Board extends Device{
  static meta={id:'fixture.board',name:'Fixture Board',keymap:{KeyH:'host',KeyM:'left/next/press',KeyR:'right/press'}};
  build(){this.add(new Button({id:'host',mesh:mesh(),longPressMs:0}));for(const id of ['left','right'])this.add(new Port({id,connector:'grove'}));this.add(new VisualJoint({id:'spin',continuous:true}));}
 }
 const makeViewer=()=>new DeviceViewer({clientWidth:500,clientHeight:400,appendChild(){}},{environment:false,shadows:false,ground:false,keyboard:'focused'});
 const advance=ms=>{clock+=ms;const batch=[...frames.values()];frames.clear();for(const fn of batch)fn(clock);};
 const key=(viewer,code,down=true)=>{viewer.renderer.domElement.focus();window.dispatch(down?'keydown':'keyup',{code,key:code,target:viewer.renderer.domElement,repeat:false});};
 const pointer=(viewer,component,id)=>{viewer.pick=()=>({component,intersection:{object:component.cap.children[0]},device:viewer.device});viewer.renderer.domElement.dispatch('pointerdown',{pointerId:id,button:0,clientX:10,clientY:10});};
 const monitorSubscriptions=host=>{const count={input:0,will:0},on=host.on.bind(host);host.on=(type,fn)=>{const name=type==='input'?'input':type==='module:will-detach'?'will':null;if(name)count[name]++;const off=on(type,fn);let active=true;return()=>{if(!active)return;active=false;if(name)count[name]--;off();};};return count;};

 const host=new Board();host.ensureBuilt();const hub=new Unit(),nested=new Unit(),sibling=new Unit();host.port('left').attach(hub);hub.port('next').attach(nested);host.port('right').attach(sibling);
 host.on('input',event=>events.push(event));const subscriptions=monitorSubscriptions(host),viewer=makeViewer();viewer.mount(host,{fit:false});viewer.mount(host,{fit:false});
 assert.deepEqual(subscriptions,{input:1,will:1},'same Viewer mount is idempotent without extra subscriptions');
 key(viewer,'KeyM');key(viewer,'KeyH');pointer(viewer,sibling.button('press'),11);pointer(viewer,nested.button('press'),12);
 const offset=events.length,saved=hub.port('next').detach({dispose:false}),detached=events.slice(offset),cancel=detached.find(event=>event.id==='left/next/press'&&event.action==='up');
 assert.equal(saved,nested);assert.ok(cancel?.cancelled,'captured key/pointer cancel reaches old nested path');assert.ok(detached.indexOf(cancel)<detached.findIndex(event=>event.id==='left/next'&&event.action==='detach'),'cancel arrives before unlink/detach input');
 assert.equal(detached.filter(event=>event.action==='click').length,0,'detach cancellation never becomes click');assert.equal(nested.button('press').pressed,false);assert.equal(host.button('host').pressed,true,'host key survives unrelated nested detach');assert.equal(sibling.button('press').pressed,true,'sibling pointer survives unrelated detach');assert.ok(viewer.renderer.domElement.hasPointerCapture(11));assert.equal(viewer.renderer.domElement.hasPointerCapture(12),false);
 checks.push('same Viewer mount idempotence','nested held key plus pointer cancels at old path before detach','unrelated host key and sibling pointer remain held');
 hub.port('next').attach(saved);key(viewer,'KeyM');assert.equal(nested.button('press').pressed,true,'reuse has no stale key ownership');key(viewer,'KeyM',false);assert.equal(nested.button('press').pressed,false);
 window.dispatch('blur');assert.equal(host.button('host').pressed,false);assert.equal(sibling.button('press').pressed,false);assert.equal(viewer.renderer.domElement.captures.size,0);
 key(viewer,'KeyH');document.hidden=true;document.dispatch('visibilitychange');document.hidden=false;assert.equal(host.button('host').pressed,false);
 host.button('host').press('external-engine');key(viewer,'KeyH');window.dispatch('blur');assert.equal(host.button('host').pressed,true,'Viewer cancels only sources it owns');host.button('host').release('external-engine');
 checks.push('reuse after nested cancellation','window blur and hidden document cancel owned sources','external input source remains owned by its caller');
 viewer.unmount(host);assert.deepEqual(subscriptions,{input:0,will:0},'unmount removes both subscriptions');viewer.unmount(host);viewer.dispose();host.dispose();

 const moving=new Board();moving.ensureBuilt();const transferEvents=[];moving.on('input',event=>transferEvents.push(event));const transferSubscriptions=monitorSubscriptions(moving),a=makeViewer(),b=makeViewer();a.mount(moving,{fit:false});a.mount(moving,{fit:false});key(a,'KeyH');moving.get('spin').set({rpm:60});advance(100);assert.equal(moving.get('spin').angleDeg,36);
 b.mount(moving,{fit:false});assert.equal(a.devices.size,0);assert.equal(b.devices.size,1);assert.equal(moving.viewer,b);assert.equal(moving.root.parent,b.scene);assert.equal(moving.button('host').pressed,false);assert.ok(transferEvents.some(event=>event.id==='host'&&event.action==='up'&&event.cancelled));assert.deepEqual(transferSubscriptions,{input:1,will:1},'cross Viewer move removes old subscriptions');
 a.unmount(moving);assert.equal(moving.viewer,b,'late old unmount cannot clear new owner');b.mount(moving,{fit:false});advance(100);assert.equal(moving.get('spin').angleDeg,72,'one tick per frame after transfer, not double integration');
 b.unmount(moving);const angle=moving.get('spin').angleDeg;advance(100);assert.equal(moving.get('spin').angleDeg,angle,'unmounted model does not tick');b.mount(moving,{fit:false});advance(100);assert.equal(moving.get('spin').angleDeg,108,'reattachment resumes external rpm without elapsed-time catch-up');
 checks.push('cross Viewer transfer cancels old owned input and removes subscriptions','one update owner for continuous rpm','unmount pauses and remount resumes existing rpm');
 key(b,'KeyH');let offMove=moving.on('input',event=>{if(event.id==='host'&&event.action==='up'&&event.cancelled){offMove();a.mount(moving,{fit:false});}});b.unmount(moving);
 assert.equal(moving.viewer,a);assert.equal(moving.root.parent,a.scene);assert.equal(b.devices.size,0);assert.equal(a.devices.size,1);assert.deepEqual(transferSubscriptions,{input:1,will:1},'A cancelled-up consumer can transfer ownership synchronously');advance(100);assert.equal(moving.get('spin').angleDeg,144);
 key(a,'KeyH');let offRemount=moving.on('input',event=>{if(event.id==='host'&&event.action==='up'&&event.cancelled){offRemount();a.mount(moving,{fit:false});}});a.unmount(moving);
 assert.equal(moving.viewer,a);assert.equal(moving.root.parent,a.scene);assert.equal(a.devices.size,1);assert.deepEqual(transferSubscriptions,{input:1,will:1},'Synchronous same Viewer remount keeps only its replacement subscriptions');
 const c=makeViewer();key(a,'KeyH');let offThird=moving.on('input',event=>{if(event.id==='host'&&event.action==='up'&&event.cancelled){offThird();c.mount(moving,{fit:false});}});b.mount(moving,{fit:false});
 assert.equal(moving.viewer,c);assert.equal(moving.root.parent,c.scene);assert.equal(a.devices.size,0);assert.equal(b.devices.size,0);assert.equal(c.devices.size,1);assert.deepEqual(transferSubscriptions,{input:1,will:1},'A third Viewer chosen by the cancelled-up consumer keeps sole ownership');advance(100);assert.equal(moving.get('spin').angleDeg,180,'The older outer mount cannot add a second update owner');
 checks.push('synchronous cancelled-up consumer can safely transfer or remount a device','third Viewer chosen during cancellation wins over the stale outer mount');
 a.dispose();b.dispose();c.dispose();assert.deepEqual(transferSubscriptions,{input:0,will:0});moving.dispose();

 const left=new Board(),right=new Board();left.ensureBuilt();right.ensureBuilt();const transferUnit=new Unit();left.port('left').attach(transferUnit);left.keymap.KeyM='left/press';const oldEvents=[],newEvents=[];left.on('input',e=>oldEvents.push(e));right.on('input',e=>newEvents.push(e));const oldViewer=makeViewer(),newViewer=makeViewer();oldViewer.mount(left,{fit:false});newViewer.mount(right,{fit:false});key(oldViewer,'KeyM');right.port('right').attach(transferUnit);
 assert.equal(transferUnit.button('press').pressed,false);assert.ok(oldEvents.some(e=>e.id==='left/press'&&e.action==='up'&&e.cancelled),'cross host transfer releases through old host');assert.equal(newEvents.filter(e=>e.action==='up').length,0,'old cancellation is not misrouted to new host');assert.equal(transferUnit.parentHost,right);assert.equal(transferUnit.button('press').path,'right/press');
 checks.push('cross host module transfer routes cancellation only through old host');oldViewer.dispose();newViewer.dispose();left.dispose();right.dispose();
 const finalHost=new Board();finalHost.ensureBuilt();const finalSubscriptions=monitorSubscriptions(finalHost),dying=makeViewer();dying.mount(finalHost,{fit:false});key(dying,'KeyH');finalHost.on('input',event=>{if(event.id==='host'&&event.action==='up'&&event.cancelled)dying.mount(finalHost,{fit:false});});dying.dispose();
 assert.equal(dying.devices.size,0);assert.equal(finalHost.viewer,null);assert.equal(finalHost.root.parent,null);assert.equal(finalHost.button('host').pressed,false);assert.deepEqual(finalSubscriptions,{input:1,will:0},'Only the external consumer remains; the disposed Viewer has no subscriptions');dying.dispose();assert.throws(()=>dying.mount(finalHost),/disposed DeviceViewer/);finalHost.dispose();
 checks.push('disposing Viewer cannot be revived by cancelled-up and disposal is idempotent');

 // Use the real U035-B model/keymap: direct Button calls do not exercise a
 // browser's altKey flag on the documented AltLeft -> Sym shortcut.
 const {Model:CardKB}=await import('../src/units/cardkb/index.js');
 const card=new CardKB(),cardViewer=makeViewer(),keyboardEvents=[];
 cardViewer.mount(card,{fit:false});card.on('input',event=>keyboardEvents.push(event));
 const sym=card.button('key-sym'),cardCanvas=cardViewer.renderer.domElement;
 const keyboard={sku:'U035-B',positiveShortcuts:[],blockedCases:[],cancelActions:{}};
 const dispatchKey=(type,code,flags={})=>window.dispatch(type,{code,key:code.startsWith('Alt')?'Alt':code,target:cardCanvas,repeat:false,altKey:false,metaKey:false,ctrlKey:false,...flags});
 const shortcut=(code,target,flags={})=>{
  cardCanvas.focus();const start=keyboardEvents.length,button=card.button(target),down=dispatchKey('keydown',code,flags);
  assert.equal(down.defaultPrevented,true,`${code}: mapped focused shortcut consumes keydown`);assert.equal(button.pressed,true,`${code}: real keyboard route presses its target`);
  card.update(1);assert.equal(button.getActuationState().depthMm,.2,`${code}: actual CardKB cap reaches its full visual stroke`);
  const up=dispatchKey('keyup',code);card.update(1);
  assert.equal(up.defaultPrevented,undefined,`${code}: paired keyup uses the existing release route without consuming default`);assert.equal(button.pressed,false);assert.equal(button.getActuationState().depthMm,0,`${code}: cap returns exactly`);
  assert.deepEqual(keyboardEvents.slice(start).map(event=>event.action),['down','up','click']);keyboard.positiveShortcuts.push({code,target,travelMm:.2,exactReturn:true});
 };
 shortcut('AltLeft','key-sym',{altKey:true});shortcut('KeyQ','key-q');shortcut('F1','key-fn');shortcut('ShiftLeft','key-shift',{shiftKey:true});
 const blocked=(label,code,flags={})=>{
  const start=keyboardEvents.length,down=dispatchKey('keydown',code,flags),up=dispatchKey('keyup',code,flags);
  assert.equal(down.defaultPrevented,undefined,`${label}: ignored keydown preserves browser default`);assert.equal(up.defaultPrevented,undefined,`${label}: ignored keyup preserves browser default`);assert.equal(keyboardEvents.length,start,`${label}: no physical input intent`);assert.equal(sym.pressed,false,`${label}: Sym stays released`);keyboard.blockedCases.push(label);
 };
 cardCanvas.focus();const altMapping=card.keymap.AltLeft;delete card.keymap.AltLeft;
 blocked('unmapped standalone AltLeft','AltLeft',{altKey:true});card.keymap.AltLeft='sensor';blocked('AltLeft mapped to a non-button','AltLeft',{altKey:true});card.keymap.AltLeft=altMapping;
 blocked('unmapped standalone AltRight','AltRight',{altKey:true});blocked('Alt+Q chord','KeyQ',{altKey:true});blocked('Meta+Q chord','KeyQ',{metaKey:true});blocked('Ctrl+Q chord','KeyQ',{ctrlKey:true});blocked('Meta+AltLeft chord','AltLeft',{metaKey:true,altKey:true});blocked('Ctrl+AltLeft chord','AltLeft',{ctrlKey:true,altKey:true});
 for(const tagName of ['INPUT','TEXTAREA','SELECT']){const editable=new Target();editable.tagName=tagName;document.activeElement=editable;blocked(`AltLeft in ${tagName}`,'AltLeft',{altKey:true,target:editable});}
 const editable=new Target();editable.isContentEditable=true;document.activeElement=editable;blocked('AltLeft in contenteditable','AltLeft',{altKey:true,target:editable});
 document.activeElement=new Target();blocked('AltLeft outside focused canvas','AltLeft',{altKey:true});blocked('Q outside focused canvas','KeyQ');
 cardCanvas.focus();const unmatchedStart=keyboardEvents.length,unmatched=dispatchKey('keyup','AltLeft');assert.equal(unmatched.defaultPrevented,undefined,'Unheld Alt keyup does not consume default');assert.equal(keyboardEvents.length,unmatchedStart);keyboard.blockedCases.push('unheld AltLeft keyup');
 const cancelAlt=(label,cancel)=>{
  cardCanvas.focus();const start=keyboardEvents.length;dispatchKey('keydown','AltLeft',{altKey:true});card.update(1);assert.equal(sym.pressed,true);assert.equal(sym.getActuationState().depthMm,.2);
  cancel();card.update(1);const actions=keyboardEvents.slice(start);
  assert.equal(sym.pressed,false);assert.equal(sym.getActuationState().depthMm,0,`${label}: cancelled cap returns exactly`);assert.deepEqual(actions.map(event=>event.action),['down','up'],`${label}: cancellation cannot become click`);assert.equal(actions[1].cancelled,true);assert.equal(actions[1].id,'key-sym');
  const lateUp=dispatchKey('keyup','AltLeft');assert.equal(lateUp.defaultPrevented,undefined,`${label}: late unheld keyup preserves default`);assert.equal(keyboardEvents.length,start+2);keyboard.cancelActions[label]=actions.map(event=>({id:event.id,action:event.action,cancelled:!!event.cancelled}));
 };
 cancelAlt('blur',()=>window.dispatch('blur'));cancelAlt('unmount',()=>cardViewer.unmount(card));cardViewer.dispose();
 // Global keyboard mode keeps its historical behavior, but cannot claim a
 // standalone Alt shortcut unless this viewer's canvas is actually focused.
 const globalViewer=new DeviceViewer({clientWidth:500,clientHeight:400,appendChild(){}},{environment:false,shadows:false,ground:false,keyboard:true});globalViewer.mount(card,{fit:false});document.activeElement=new Target();blocked('AltLeft with unfocused global-keyboard viewer','AltLeft',{altKey:true,target:document.activeElement});globalViewer.dispose();card.dispose();
 checks.push('actual CardKB AltLeft Sym keyboard stroke and exact release','standalone mapped Alt requires focused canvas and a real button','modifier chords and editable/unfocused targets preserve browser defaults','Alt hold cancels without click on blur or unmount');
 // Real picking must pass the current world ray even after the captured
 // pointer leaves the moving cap; otherwise a physical fader sticks in place.
 const slideHost=new Device(),slide=slideHost.add(new VisualSlide({id:'slider',mesh:mesh(),rangeMm:[-17.5,17.5]})),slideViewer=makeViewer(),slideEvents=[];
 slideHost.on('input',event=>slideEvents.push(event));slideViewer.mount(slideHost,{fit:false});
 slideHost.root.rotation.set(0,0,0);slideHost.root.updateMatrixWorld(true);
 slideViewer.camera.position.set(0,0,80);slideViewer.camera.lookAt(0,0,0);slideViewer.camera.updateMatrixWorld(true);slideViewer.camera.updateProjectionMatrix();
 const screen=(y)=>{const p=new THREE.Vector3(0,y,.5).project(slideViewer.camera);return {clientX:(p.x+1)*250,clientY:(1-p.y)*200};};
 slideViewer.renderer.domElement.dispatch('pointerdown',{pointerId:31,button:0,...screen(0)});assert.equal(slide.getState().dragging,true);
 slideViewer.renderer.domElement.dispatch('pointermove',{pointerId:31,...screen(12)});assert.ok(Math.abs(slide.positionMm-12)<1e-6,'actual Viewer ray reaches the slide after the pointer leaves its cap');
 window.dispatch('blur');assert.equal(slide.getState().dragging,false);assert.ok(slideEvents.at(-1).cancelled);assert.ok(Math.abs(slide.positionMm-12)<1e-6,'blur leaves the physical slider at its stable position');
 slideViewer.dispose();slideHost.dispose();checks.push('actual ray-picked slider follows captured pointer beyond cap and cancels on blur without springing back');
 assert.ok([...owned.values()].every(count=>count===1),'all fixture-owned geometry/material released exactly once');assert.ok(renderers.every(r=>r.disposals===1&&r.domElement.removed&&r.domElement.listenerCount()===0),'all renderer/canvas/listener lifetimes end exactly once');assert.ok(observers.every(o=>o.disconnected));assert.equal(window.listenerCount(),0);assert.equal(document.listenerCount(),0);assert.equal(frames.size,0,'all Viewer RAF callbacks cancelled');
 return {checkedAt:new Date().toISOString(),status:'pass',checks,ownedResources:owned.size,rendererInstances:renderers.length,oldNestedCancellationPath:'left/next/press',singleTickDegreesPer100msAt60Rpm:36,cardkbKeyboard:keyboard,scope:'Actual DeviceViewer lifecycle/input/RAF code and CardKB shortcuts with an isolated no-GPU renderer and DOM fixture; no browser pixels, private research, network, firmware or hardware simulation'};
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
 if(process.argv.includes('--fixture')){try{console.log(JSON.stringify(await fixture()));}catch(error){console.error(`${error.name}: ${error.message.split('\n')[0]}\n${error.stack?.split('\n').filter(line=>/^\s+at /.test(line)).slice(0,3).join('\n')??''}`);process.exitCode=1;}}
 else{const report=await checkViewerLifecycle(),directory=new URL('../artifacts/',import.meta.url);await fs.mkdir(directory,{recursive:true});await fs.writeFile(new URL('viewer-lifecycle-check.json',directory),JSON.stringify(report,null,2)+'\n');console.log('PASS Viewer lifecycle:',JSON.stringify(report));}
}
