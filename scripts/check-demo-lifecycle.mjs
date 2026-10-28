import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {DynamicsPanel} from '../demo/dynamics.js';
import {Device,Module,Port,VisualSlide} from '../src/core/index.js';
import {loadModel,loadGroveModule} from '../src/loaders.js';
import {readFile} from 'node:fs/promises';

class TestUnit extends Module {
 static meta={id:'lifecycle-unit',name:'Lifecycle Unit',connector:'grove'};
 dispose(){this.disposals=(this.disposals??0)+1;super.dispose();}
}
class WrongConnectorUnit extends TestUnit { static meta={...TestUnit.meta,connector:'m5.hat2'}; }
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};

// Exercise the real async controller with real host/port/module ownership.
// DOM field values and the renderer are only the boundary collaborators. The
// actual selection/rendering controls are checked separately in the browser.
function harness(){
 const host=new Device(),port=host.add(new Port({id:'grove',connector:'grove'}));
 const ui={'#grove-connect':{disabled:false},'#grove-status':{textContent:'尚未连接'},'#grove-unit':{value:'env-iii'}};
 const panel=Object.create(DynamicsPanel.prototype);
 Object.assign(panel,{model:host,selectedPort:port,generation:0,held:new Map(),cleanups:[],readouts:[],refreshes:0,fits:0,changes:0,$:s=>ui[s]});
 panel.port=()=>panel.selectedPort;
 panel.refreshComponents=()=>panel.refreshes++;
 panel.refreshPorts=()=>{};
 panel.refreshConnection=()=>{ui['#grove-connect'].disabled=!panel.port();ui['#grove-status'].textContent=panel.port()?.module?'connected':'selected port';};
 panel.releaseAll=()=>panel.releaseHeld(()=>true);
 panel.viewer={fit:()=>panel.fits++};panel.onGeometryChange=()=>panel.changes++;
 return {panel,host,port,ui};
}

export async function checkDemoLifecycle(){
 const cases=[];
 for(const reason of ['port-selection','unit-selection','model-switch']){
  const {panel,host,port,ui}=harness(),request=deferred(),unit=new TestUnit();panel.loadModule=()=>request.promise;
  const pending=panel.connect();assert.equal(ui['#grove-connect'].disabled,true);
  let nextHost=null;
  if(reason==='model-switch'){
   panel.unbind();nextHost=new Device();panel.model=nextHost;panel.selectedPort=nextHost.add(new Port({id:'grove',connector:'grove'}));
  }else{panel.generation++;if(reason==='port-selection')panel.selectedPort=host.add(new Port({id:'other',connector:'grove'}));else ui['#grove-unit'].value='key';}
  panel.refreshConnection();const currentStatus=ui['#grove-status'].textContent;
  request.resolve(unit);await pending;
  assert.equal(port.module,null,`${reason}: outdated request must not attach`);assert.equal(panel.port().module,null);
  assert.equal(unit.disposals,1,`${reason}: only the discarded unowned result is disposed`);
  assert.equal(ui['#grove-status'].textContent,currentStatus);assert.equal(ui['#grove-connect'].disabled,false);
  assert.equal(panel.changes,0);host.dispose();nextHost?.dispose();cases.push(reason);
 }
 {
  const {panel,host,ui}=harness(),request=deferred();panel.loadModule=()=>request.promise;
  const pending=panel.connect();panel.unbind();ui['#grove-status'].textContent='new model status';ui['#grove-connect'].disabled=false;
  request.reject(new Error('outdated import failure'));await pending;
  assert.equal(ui['#grove-status'].textContent,'new model status','late errors cannot overwrite the next model');assert.equal(ui['#grove-connect'].disabled,false);host.dispose();cases.push('stale-error');
 }
 {
  const {panel,host,port,ui}=harness(),unit=new WrongConnectorUnit();
  panel.loadModule=async()=>unit;await panel.connect();assert.equal(port.module,null);assert.equal(unit.disposals,1,'failed attachment releases its newly constructed result');assert.match(ui['#grove-status'].textContent,/连接失败/);host.dispose();cases.push('failed-attachment-disposal');
 }
 {
  const {panel,host,port}=harness(),unit=new TestUnit();panel.loadModule=async()=>unit;await panel.connect();
  assert.equal(port.module,unit);assert.equal(unit.disposals??0,0,'successful attach transfers disposal to its port');assert.equal(panel.changes,1);assert.equal(panel.fits,1);host.dispose();assert.equal(unit.disposals,1);cases.push('successful-ownership');
 }
 {
  const panel=Object.create(DynamicsPanel.prototype),calls=[];
  panel.held=new Map();panel.held.set('a',{cancel:key=>{calls.push(key);panel.releaseHeld(()=>true);}});panel.held.set('b',{cancel:key=>calls.push(key)});
  panel.releaseHeld(()=>true);assert.deepEqual(calls,['a','b'],'synchronous input callbacks may cancel the remaining holds without double release');assert.equal(panel.held.size,0);cases.push('reentrant-hold-cancellation');
 }
 const nested=await checkNestedGroveDemo();
 return {status:'pass',cases,nested,scope:'Actual demo async controller, recursive connection menu and dynamic controls with real host/HUB/Key/Fan; renderer and DOM boundary are fixtures, browser pixels and focus remain separately verified'};
}

async function checkNestedGroveDemo(){
 // Only browser boundaries are replaced: the real panel constructor, event
 // subscriptions, option refresh, pose sliders and component APIs run here.
 const previous={document:globalThis.document,window:globalThis.window,Option:globalThis.Option};
 class Element{
  constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.dataset={};this.attributes={};this._value='';this._selectionSet=false;this.textContent='';this.disabled=false;this.hidden=false;this.listeners=new Map();}
  get childElementCount(){return this.children.length;}
  get value(){return this.tagName==='SELECT'?(this._selectionSet?this.children.find(child=>child.value===this._value)?.value??'':this.children[0]?.value??''):this._value;}
  set value(value){this._value=String(value);this._selectionSet=true;}
  append(...children){for(const child of children){child.parentElement=this;this.children.push(child);}}
  add(child){this.append(child);}
  replaceChildren(...children){this.children=[];this._value='';this._selectionSet=false;this.append(...children);}
  setAttribute(name,value){this.attributes[name]=String(value);}
  addEventListener(type,fn){if(!this.listeners.has(type))this.listeners.set(type,new Set());this.listeners.get(type).add(fn);}
  removeEventListener(type,fn){this.listeners.get(type)?.delete(fn);}
  querySelectorAll(selector){const out=[];for(const child of this.children){if((selector==='input'&&child.tagName==='INPUT')||(selector.startsWith('#')&&child.id===selector.slice(1))||(selector==='input[id$="-rpm"]'&&child.tagName==='INPUT'&&child.id?.endsWith('-rpm')))out.push(child);out.push(...child.querySelectorAll(selector));}return out;}
  querySelector(selector){return this.querySelectorAll(selector)[0]??null;}
  get nextElementSibling(){const siblings=this.parentElement?.children??[];return siblings[siblings.indexOf(this)+1]??null;}
 }
 const noop=()=>{},ctx=new Proxy({measureText:()=>({width:20}),createRadialGradient:()=>({addColorStop:noop}),createLinearGradient:()=>({addColorStop:noop})},{get:(o,key)=>o[key]??noop,set:(o,key,value)=>(o[key]=value,true)});
 const document=new Element(),window=new Element();document.createElement=tag=>{const element=new Element(tag);if(tag==='canvas')element.getContext=()=>ctx;return element;};
 Object.assign(globalThis,{document,window,Option:class extends Element{constructor(text,value){super('option');this.textContent=text;this.value=value;}}});
 const ui={},container=new Element();
 for(const id of ['grove-port','grove-unit','grove-connect','grove-disconnect','grove-status','cable-controls','connection-note','button-controls','button-inspection','inspect-button','hold-button','release-button','focus-button','button-travel','joint-section','joint-controls','led-section','led-target','led-color','led-brightness-control','led-off','led-state','input-events','dynamic-state']){
  const element=new Element(['grove-port','grove-unit','inspect-button','led-target'].includes(id)?'select':id==='led-color'?'input':'div');element.id=id;ui[`#${id}`]=element;container.append(element);
 }
 let panel,host;const events=[],cases=[],focusCalls=[];
 const selected=id=>ui[id].value,options=id=>ui[id].children.map(option=>option.value);
 const choose=(id,value)=>{ui[id].value=value;ui[id].onchange?.();};
 const hold=path=>{choose('#inspect-button',path);ui['#hold-button'].onclick();};
 const settle=()=>{for(let i=0;i<80;i++)host.update(1/60);};
 try{
  host=await loadModel('sticks3');host.on('input',event=>events.push(event));
  panel=new DynamicsPanel(container,{catalog:{products:['hub','key','fan','pahub-v21','pbhub-v11'].map(id=>({id,name:id,category:'unit',entry:true}))},viewer:{on:()=>()=>{},fit:noop,focus:(path,options)=>focusCalls.push({path,options}),requestRender:noop},onGeometryChange:noop});
  panel.bind(host,{id:'sticks3'});assert.deepEqual(options('#grove-port'),['grove']);
  assert.equal(host.led('irTx').invisible,true);assert.ok(!options('#led-target').includes('irTx'),'Invisible IR stays addressable but is absent from visible-light controls');assert.equal(ui['#led-section'].hidden,true,'An IR-only host has no visible-light panel');cases.push('invisible-host-emitter-excluded-from-visible-light-controls');
  choose('#grove-unit','hub');await ui['#grove-connect'].onclick();
  assert.deepEqual(options('#grove-port'),['grove','grove/grove-1','grove/grove-2','grove/grove-3'],'all HUB outputs become selectable, excluding the occupied upstream input');
  assert.equal(selected('#grove-port'),'grove','attaching preserves a still valid selected host socket');
  const hub=host.port('grove').module;assert.equal(hub.get('unitFrame').inputPort,hub.port('grove'));cases.push('recursive-HUB-outputs-without-upstream-input');
  choose('#grove-port','grove/grove-1');choose('#grove-unit','key');await ui['#grove-connect'].onclick();
  const key=host.get('grove/grove-1').module;assert.equal(key.meta.id,'m5stack.unit.key.grove');assert.equal(selected('#grove-port'),'grove/grove-1');
  assert.ok(options('#inspect-button').includes('grove/grove-1/press'));assert.ok(options('#led-target').includes('grove/grove-1/rgb'));
  assert.ok(!options('#grove-port').includes('grove/grove-1/grove'),'Key input occupied by its own cable is never offered as another socket');
  hold('grove/grove-1/press');choose('#led-target','grove/grove-1/rgb');ui['#led-color'].oninput({target:{value:'#22b477'}});assert.equal(key.led('rgb').getState().color,'#22b477');
  choose('#grove-port','grove/grove-2');choose('#grove-unit','fan');await ui['#grove-connect'].onclick();
  const fan=host.get('grove/grove-2').module;assert.equal(fan.meta.id,'m5stack.unit.fan.grove');assert.equal(key.button('press').pressed,true,'attaching sibling Fan preserves Key inspection hold');assert.equal(selected('#led-target'),'grove/grove-1/rgb');assert.equal(selected('#inspect-button'),'grove/grove-1/press');
  const rpm=container.querySelector('#joint-grove-grove-2-rotor-rpm');assert.ok(rpm,'nested Fan has a live rpm control');rpm.value=60;rpm.oninput();const before=fan.get('rotor').angleDeg;host.update(.1);assert.ok(Math.abs(fan.get('rotor').angleDeg-before-36)<1e-6,'nested Fan is updated once through the real host');
  const beforeReadback=events.length;panel.refreshState();const angle=container.querySelector('#joint-grove-grove-2-rotor-angle');assert.ok(angle);assert.ok(Math.abs(Number(angle.value)-fan.get('rotor').angleDeg)<1e-6,'actual external joint motion reflects into angle slider');assert.equal(angle.nextElementSibling.textContent,`${fan.get('rotor').angleDeg.toFixed(1)}°`);assert.equal(Number(rpm.value),60);assert.equal(events.length,beforeReadback,'joint control readback does not create input');
  assert.equal(key.button('press').pressed,true);cases.push('nested-Key-button-LED-and-Fan-rpm-controls');
  choose('#grove-port','grove/grove-3');choose('#grove-unit','hub');await ui['#grove-connect'].onclick();
  assert.ok(options('#grove-port').includes('grove/grove-3/grove-1'),'second HUB level exposes full unique paths');assert.ok(!options('#grove-port').includes('grove/grove-3/grove'));
  choose('#grove-port','grove/grove-3/grove-1');choose('#grove-unit','fan');await ui['#grove-connect'].onclick();assert.equal(host.get('grove/grove-3/grove-1').module.meta.id,'m5stack.unit.fan.grove');
  const disappearing=deferred();panel.loadModule=()=>disappearing.promise;choose('#grove-unit','key');const disappearingRequest=ui['#grove-connect'].onclick();
  host.port('grove').module.port('grove-3').detach();assert.equal(selected('#grove-port'),'grove/grove-3','removed selected subtree falls back to its surviving upstream socket');assert.equal(ui['#grove-disconnect'].disabled,true);assert.equal(key.button('press').pressed,true,'removing another branch preserves the held Key');
  const abandoned=new TestUnit();disappearing.resolve(abandoned);await disappearingRequest;assert.equal(abandoned.disposals,1,'removing a selected ancestor discards the still loading result');assert.equal(hub.port('grove-3').module,null);assert.equal(ui['#grove-connect'].disabled,false);cases.push('two-level-paths-ancestor-fallback-and-pending-result-disposal');
  const request=deferred();let discarded;panel.loadModule=async()=>{discarded=await request.promise;return discarded;};choose('#grove-port','grove/grove-2');choose('#grove-unit','key');const pending=ui['#grove-connect'].onclick();choose('#grove-port','grove/grove-1');request.resolve(new TestUnit());await pending;assert.equal(discarded.disposals,1);assert.equal(host.get('grove/grove-2').module,fan,'changed nested socket rejects the old async request');assert.equal(host.get('grove/grove-1').module,key);cases.push('nested-selection-invalidates-async-load');
  const old=events.length;ui['#grove-disconnect'].onclick();const detached=events.slice(old),cancelled=detached.find(event=>event.id==='grove/grove-1/press'&&event.action==='up');
  assert.ok(cancelled?.cancelled,'Key is released through its full old path before detach');assert.ok(detached.indexOf(cancelled)<detached.findIndex(event=>event.id==='grove/grove-1'&&event.action==='detach'));assert.ok(!detached.some(event=>event.action==='click'));assert.equal(panel.held.size,0);assert.ok(!options('#inspect-button').includes('grove/grove-1/press'));assert.ok(!options('#led-target').includes('grove/grove-1/rgb'));assert.equal(fan.get('rotor').rpm,60,'unrelated Fan rpm survives targeted Key detach');cases.push('nested-target-detach-cancels-old-path-without-stale-controls');
  hold('btnA');choose('#grove-port','grove');ui['#grove-disconnect'].onclick();assert.deepEqual(options('#grove-port'),['grove']);assert.equal(host.button('btnA').pressed,true,'removing whole HUB subtree does not release a host inspection hold');settle();ui['#release-button'].onclick();settle();assert.equal(host.button('btnA').pressed,false);cases.push('ancestor-detach-prunes-menu-and-keeps-unrelated-host-hold');
  const inspection=[];
  const catalog=JSON.parse(await readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
  const controllerCases=catalog.products.filter(p=>p.category==='controller'&&p.entry).flatMap(p=>(p.configurations?.length?p.configurations:[{id:'default',options:{}}]).map(c=>[p.id,c.options??{}]));
  for(const [id,configuration]of controllerCases){
   panel.unbind();host.dispose();host=await loadModel(id,configuration);panel.bind(host,{id});
   const buttons=host.list('button');assert.deepEqual(options('#inspect-button'),buttons.map(button=>button.path),`${id}: every real Button is selectable for inspection`);assert.equal(ui['#button-inspection'].hidden,false);
   for(const button of buttons){
    choose('#inspect-button',button.path);assert.equal(ui['#hold-button'].disabled,button.latching);assert.equal(ui['#release-button'].disabled,button.latching);assert.equal(ui['#focus-button'].disabled,false);ui['#focus-button'].onclick();assert.equal(focusCalls.at(-1).path,button.path,'All real controls, including sliders/touches, have a working focus route');assert.equal(focusCalls.at(-1).options.distance,50);
    const output=ui['#button-travel'];
    if(button.latching){
     const before=button.getState(),initialPosition=before.position,nextPosition=1-initialPosition;ui['#hold-button'].onclick();ui['#release-button'].onclick();assert.deepEqual(button.getState(),before,'Disabled inspection callbacks cannot accidentally toggle or hold a slider');assert.equal(panel.held.size,0);assert.equal(output.dataset.actuation,'latching');assert.equal(output.dataset.position,String(initialPosition));assert.match(output.textContent,new RegExp(`稳定档位 ${initialPosition}.*松开保持档位`));
     ui['#button-controls'].children.find(element=>element.dataset.button===button.path).onclick();settle();panel.refreshState();assert.equal(button.position,nextPosition);assert.equal(button.pressed,false);assert.equal(output.dataset.position,String(nextPosition));assert.equal(output.dataset.settled,'true');assert.match(output.textContent,new RegExp(`稳定档位 ${nextPosition}`));assert.equal(button.getActuationState().depthMm,button.travel*nextPosition,'Independent switch click reaches the other stable detent');button.setPosition(initialPosition,{immediate:true});panel.refreshState();
    }else if(button.travel===0){
     assert.equal(output.dataset.actuation,'capacitive');assert.equal(output.dataset.position,undefined,'A previous stable detent cannot leak into touch readout');assert.match(output.textContent,/电容触摸.*已松开.*机械行程 0 mm/);ui['#hold-button'].onclick();settle();panel.refreshState();assert.equal(button.pressed,true);assert.equal(button.getActuationState().depthMm,0);assert.equal(output.dataset.pressed,'true');assert.match(output.textContent,/电容触摸.*已按下.*机械行程 0 mm/);assert.ok(panel.held.get(`inspect:${button.path}`)===button,'Zero-travel inspection preserves the normal hold owner');ui['#release-button'].onclick();settle();panel.refreshState();assert.equal(button.pressed,false);assert.equal(button.cap.position.length(),0);assert.equal(output.dataset.pressed,'false');assert.equal(panel.held.size,0);
    }else{assert.equal(output.dataset.actuation,'momentary');assert.equal(output.dataset.position,undefined);assert.match(output.textContent,/行程/);}
   }
   inspection.push({id:configuration.dinBase?'cores3-din':id,buttons:buttons.length,latching:buttons.filter(button=>button.latching).length,capacitive:buttons.filter(button=>button.travel===0).length});
  }
  panel.unbind();host.dispose();host=await loadModel('fan');panel.bind(host,{id:'fan'});assert.deepEqual(options('#inspect-button'),[]);assert.equal(ui['#button-inspection'].hidden,true);for(const id of ['#hold-button','#release-button','#focus-button'])assert.equal(ui[id].disabled,true);const focusCount=focusCalls.length;ui['#focus-button'].onclick();assert.equal(focusCalls.length,focusCount,'An empty inspection cannot focus a stale control');assert.equal(ui['#button-travel'].textContent,'');assert.deepEqual(ui['#button-travel'].dataset,{},'Removing the final control clears stale inspection state');
  cases.push('all-host-controls-including-stable-sliders-and-zero-travel-touch-selectable-and-focusable','stable-slider-inspection-disabled-while-independent-click-preserves-detents','capacitive-inspection-hold-release-with-zero-physical-travel','empty-inspection-disables-actions-and-clears-stale-readout');
  panel.unbind();host.dispose();host=new Device();const slide=host.add(new VisualSlide({id:'slider',rangeMm:[-17.5,17.5]})),slideEvents=[];host.on('input',event=>slideEvents.push(event));panel.bind(host,{id:'slider-fixture'});
  assert.equal(ui['#joint-section'].hidden,false,'a slider without rotary joints still exposes position controls');
  const slideGroup=ui['#joint-controls'].children.find(element=>element.dataset.slider==='slider'),slideInput=slideGroup.querySelector('#slide-slider-position');
  assert.equal(Number(slideInput.min),-17.5);assert.equal(Number(slideInput.max),17.5);slideInput.value='12.3';slideInput.oninput();assert.equal(slide.positionMm,12.3);assert.equal(slideEvents.length,0,'panel pose demonstrations do not masquerade as hardware/user intent');
  slide.set({positionMm:-9.5});panel.refreshState();assert.equal(Number(slideInput.value),-9.5,'pointer/external state refreshes the range control');
  slideGroup.children.find(element=>element.tagName==='BUTTON').onclick();host.update(.2);panel.refreshState();assert.equal(slide.positionMm,0);assert.equal(Number(slideInput.value),0);assert.ok(JSON.parse(ui['#dynamic-state'].textContent).sliders.slider);
  cases.push('millimetre-slider-only-panel-exposes-stops-reflects-external-state-and-resets-to-centre');
  panel.loadModule=loadGroveModule; // Restore the real factory after stale-request fault injection above.
  for(const id of ['pahub-v21','pbhub-v11']){
   panel.unbind();host.dispose();host=await loadModel('sticks3');panel.bind(host,{id:'sticks3'});
   choose('#grove-unit',id);await ui['#grove-connect'].onclick();
   const expected=['grove',...Array.from({length:6},(_,i)=>`grove/grove-${i}`)];
   assert.deepEqual(options('#grove-port').slice().sort(),expected.sort(),`${id}: all six outputs remain available while its cable-occupied input is excluded`);
   choose('#grove-port','grove/grove-0');choose('#grove-unit','key');await ui['#grove-connect'].onclick();
   choose('#grove-port','grove/grove-5');choose('#grove-unit','fan');await ui['#grove-connect'].onclick();
   const key=host.get('grove/grove-0').module,fan=host.get('grove/grove-5').module;
   assert.equal(key.get('cable').getState().wireCount,4);assert.equal(fan.get('cable').getState().wireCount,4);
   assert.ok(ui['#button-controls'].children.some(element=>element.dataset.button==='grove/grove-0/press'));
   assert.ok(ui['#joint-controls'].children.some(element=>element.dataset.joint==='grove/grove-5/rotor'));
   choose('#grove-port','grove/grove-0');ui['#grove-disconnect'].onclick();
   assert.equal(host.get('grove/grove-0').module,null);assert.ok(host.get('grove/grove-5').module===fan,'removing one branch retains the sibling Unit and its four-wire cable');
   cases.push(`${id}-six-output-menu-nested-controls-and-independent-branch-detach`);
  }
  return {status:'pass',cases,inspection,rootOptions:['grove'],nestedKeyPath:'grove/grove-1/press',nestedFanPath:'grove/grove-2/rotor',deepestPortPath:'grove/grove-3/grove-1',scope:'Real controller configurations, StickS3/HUB/Key/Fan assemblies, millimetre slider and panel; light DOM/renderer fixture only'};
 }finally{
  panel?.dispose();host?.dispose();
  for(const [key,value]of Object.entries(previous)){if(value===undefined)delete globalThis[key];else globalThis[key]=value;}
 }
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log('PASS demo lifecycle:',JSON.stringify(await checkDemoLifecycle()));
