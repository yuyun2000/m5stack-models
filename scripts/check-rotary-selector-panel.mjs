import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {DynamicsPanel} from '../demo/dynamics.js';
import {loadModel,loadGroveModule} from '../src/loaders.js';
import {GroveModule as ServosModule} from '../src/units/8servos2-i2c/index.js';

class Element{
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.dataset={};this.attributes={};this._value='';this._selectionSet=false;this.textContent='';this.disabled=false;this.hidden=false;this.listeners=new Map();}
 get childElementCount(){return this.children.length;}
 get value(){return this.tagName==='SELECT'?(this._selectionSet?this.children.find(c=>c.value===this._value)?.value??'':this.children[0]?.value??''):this._value;}
 set value(value){this._value=String(value);this._selectionSet=true;}
 append(...children){for(const child of children){child.parentElement=this;this.children.push(child);}}
 add(child){this.append(child);}
 replaceChildren(...children){this.children=[];this._value='';this._selectionSet=false;this.append(...children);}
 setAttribute(name,value){this.attributes[name]=String(value);}
 addEventListener(type,fn){if(!this.listeners.has(type))this.listeners.set(type,new Set());this.listeners.get(type).add(fn);}
 removeEventListener(type,fn){this.listeners.get(type)?.delete(fn);}
 querySelectorAll(selector){const out=[];for(const c of this.children){if((selector==='input'&&c.tagName==='INPUT')||(selector.startsWith('#')&&c.id===selector.slice(1))||(selector==='input[id$="-rpm"]'&&c.tagName==='INPUT'&&c.id?.endsWith('-rpm')))out.push(c);out.push(...c.querySelectorAll(selector));}return out;}
 querySelector(selector){return this.querySelectorAll(selector)[0]??null;}
 get nextElementSibling(){const a=this.parentElement?.children??[];return a[a.indexOf(this)+1]??null;}
}
const digest=value=>createHash('sha256').update(value).digest('hex');
function physical(model){let root=model.root;while(root.parent)root=root.parent;root.updateMatrixWorld(true);const out=[];model.root.traverse(o=>{if(o.isMesh&&o.userData.role!=='printed-artwork')out.push({name:o.name,matrix:o.matrixWorld.toArray(),positions:digest(Buffer.from(o.geometry.attributes.position.array.buffer))});});return digest(JSON.stringify(out));}
function descendants(e){return e.children.flatMap(c=>[c,...descendants(c)]);}

/** Real panel + real nested Unit;DOM/renderer boundaries are fixtures,not GPU. */
export async function checkRotarySelectorPanel(){
 const previous={document:globalThis.document,window:globalThis.window,Option:globalThis.Option},noop=()=>{},gradient=()=>({addColorStop:noop}),ctx=new Proxy({measureText:()=>({width:20}),createRadialGradient:gradient,createLinearGradient:gradient},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});
 const document=new Element(),window=new Element();document.createElement=tag=>{const e=new Element(tag);if(tag==='canvas')e.getContext=()=>ctx;return e;};
 Object.assign(globalThis,{document,window,Option:class extends Element{constructor(text,value){super('option');this.textContent=text;this.value=value;}}});
 const ui={},container=new Element();for(const id of['grove-port','grove-unit','grove-connect','grove-disconnect','grove-status','cable-controls','connection-note','button-controls','button-inspection','inspect-button','hold-button','release-button','focus-button','button-travel','joint-section','joint-controls','led-section','led-target','led-color','led-brightness-control','led-off','led-state','input-events','dynamic-state']){const e=new Element(['grove-port','grove-unit','inspect-button','led-target'].includes(id)?'select':id==='led-color'?'input':'div');e.id=id;ui['#'+id]=e;container.append(e);}container.querySelector=s=>ui[s]??Element.prototype.querySelector.call(container,s);
 let host,panel,unit,detached=null,render=()=>{};
 try{
  host=await loadModel('sticks3');host.root;host.display().fill('#123456');const framebuffer=digest(host.display().buffer),hub=await loadGroveModule('hub');host.port('grove').attach(hub);unit=new ServosModule();hub.port('grove-1').attach(unit);host.update(0);
  const selector=unit.get('selector'),events=[];host.on('input',e=>{if(e.kind!=='port')events.push(e);});
  const viewer={fit:noop,focus:noop,on:(event,fn)=>{assert.equal(event,'render');render=fn;return()=>{render=noop;};}};
  panel=new DynamicsPanel(container,{viewer,catalog:{products:[{id:'8servos2-i2c',name:'Unit 8Servos2-I2C',category:'unit',entry:'src/units/8servos2-i2c/index.js'}]},onGeometryChange:noop});panel.bind(host,{id:'sticks3'});
  const inputId='#rotary-grove-grove-1-selector-position',input=container.querySelector(inputId);assert.ok(input,'nested physical selector must be operable through the actual demo panel');assert.equal(ui['#joint-section'].hidden,false);assert.equal(Number(input.min),0);assert.equal(Number(input.max),15);assert.equal(Number(input.step),1);
  selector.setPosition(0);render();const rest=physical(unit),seen=new Set(),start=events.length;
  for(let position=0;position<16;position++){input.value=position;input.oninput();assert.equal(selector.getState().position,position);assert.equal(input.nextElementSibling.textContent,position.toString(16).toUpperCase());assert.equal(events.length,start,'panel external setPosition does not fabricate input');seen.add(physical(unit));}
  assert.equal(seen.size,16,'all sixteen panel detents produce real distinct rotor poses');input.value=0;input.oninput();assert.equal(physical(unit),rest);
  selector.setPosition(10);render();assert.equal(Number(input.value),10);assert.equal(input.nextElementSibling.textContent,'A');assert.equal(JSON.parse(ui['#dynamic-state'].textContent).rotarySelectors['grove/grove-1/selector'].position,10);
  const visible=descendants(ui['#joint-controls']).filter(e=>e.dataset.rotary==='grove/grove-1/selector');assert.equal(visible.length,1);
  detached=hub.port('grove-1').detach({dispose:false});assert.ok(detached===unit);assert.equal(container.querySelector(inputId),null,'detached selector must not leave stale controls');assert.equal(ui['#joint-section'].hidden,true);assert.ok(host.list('button').every(b=>!b.pressed));
  hub.port('grove-1').attach(detached);detached=null;host.update(0);const replacement=container.querySelector(inputId);assert.ok(replacement&&replacement!==input);assert.equal(Number(replacement.value),10);assert.equal(descendants(ui['#joint-controls']).filter(e=>e.dataset.rotary==='grove/grove-1/selector').length,1);replacement.value=15;replacement.oninput();assert.equal(selector.getState().position,15);assert.equal(events.length,start);assert.equal(digest(host.display().buffer),framebuffer);
  return{status:'pass',cases:['actual-nested-Unit-selector-visible-in-real-DynamicsPanel','all16external-panel-detents-change-real-rotor-geometry-without-inputecho','external-state-terminal-render-syncs-hex-readout-and-dynamic-state','detach-prunes-controls-and-reattach-rebuilds-one-correct-bound-control','host-buttons-and-framebuffer-preserved'],scope:'Real current model/component/panel/host attachment;DOM and renderer boundary fixtures only,no browser pixels or GPU acceptance'};
 }finally{panel?.unbind();panel?.offRender?.();if(panel){window.removeEventListener('blur',panel.releaseAll);document.removeEventListener('visibilitychange',panel.onVisibilityChange);}detached?.dispose();host?.dispose();for(const[key,value]of Object.entries(previous))if(value===undefined)delete globalThis[key];else globalThis[key]=value;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkRotarySelectorPanel(),null,2));
