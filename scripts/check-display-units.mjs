import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {loadModel,loadGroveModule} from '../src/loaders.js';
import {FramebufferPanel} from '../demo/framebuffers.js';

const signature=display=>createHash('sha256').update(display.buffer).digest('hex');

/** Real OLED/LCD products and Grove routing; only canvas/form controls are stubbed. */
export async function checkDisplayUnits(){
 const previous=globalThis.document,noop=()=>{};
 const gradient=()=>({addColorStop:noop});
 const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(target,key)=>target[key]??noop,set:(target,key,value)=>(target[key]=value,true)});
 globalThis.document={createElement:tag=>tag==='canvas'?{width:0,height:0,getContext:()=>ctx}:{}};
 const selector={value:'',replaceChildren(...children){this.children=children;}},button={dataset:{},setAttribute:noop};
 let host,panel;
 try{
  host=await loadModel('sticks3');panel=new FramebufferPanel({selector,button});panel.bind(host);
  host.display().fill('#123456');const hostFrame=signature(host.display());
  const hub=await loadGroveModule('hub');host.port('grove').attach(hub);
  const oled=await loadGroveModule('oled'),lcd=await loadGroveModule('lcd');
  hub.port('grove-1').attach(oled);hub.port('grove-2').attach(lcd);
  const paths=['lcd','grove/grove-1/lcd','grove/grove-2/lcd'];
  assert.deepEqual(selector.children.map(option=>option.value),paths,'both real screen Units are discoverable with the host framebuffer');
  assert.equal(signature(host.display()),hostFrame,'attaching screen Units preserves the host picture');
  const oledDisplay=host.get(paths[1],'display'),lcdDisplay=host.get(paths[2],'display');
  assert.equal(oledDisplay.meta.monochrome,true,'OLED documents its monochrome surface');
  host.handle({type:'display',target:paths[1],fill:'#dedede'});
  const oledFrame=signature(oledDisplay);
  host.handle({type:'display',target:paths[2],fill:'#18a4d0'});
  const lcdFrame=signature(lcdDisplay);
  assert.equal(signature(oledDisplay),oledFrame,'LCD writes preserve the OLED framebuffer');
  assert.equal(signature(host.display()),hostFrame,'Unit writes preserve the host framebuffer');
  for(let i=0;i<30;i++)host.update(1/60);
  assert.equal(signature(lcdDisplay),lcdFrame,'model updates do not invent display content');
  selector.value=paths[1];selector.onchange();button.onclick();
  assert.notEqual(signature(oledDisplay),oledFrame,'the calibration control targets the real nested OLED');
  for(let i=0;i<oledDisplay.buffer.length;i+=4)assert.ok(oledDisplay.buffer[i]===oledDisplay.buffer[i+1]&&oledDisplay.buffer[i]===oledDisplay.buffer[i+2],'OLED calibration is grayscale');
  assert.equal(signature(lcdDisplay),lcdFrame,'OLED calibration preserves the LCD picture');
  assert.equal(signature(host.display()),hostFrame,'OLED calibration preserves the host picture');
  host.handle({type:'pose',target:'grove/grove-2/unitFrame',position:[15,65,8],rotation:[.2,-.3,.1]});
  host.handle({type:'cable',target:'grove/grove-2/cable',slack:12,bend:[0,0,-1]});
  assert.equal(signature(lcdDisplay),lcdFrame,'physical Unit/cable poses preserve its external framebuffer');
  hub.port('grove-1').detach();
  assert.deepEqual(selector.children.map(option=>option.value),[paths[0],paths[2]],'removing OLED retains the sibling LCD target');
  assert.equal(signature(lcdDisplay),lcdFrame);assert.equal(signature(host.display()),hostFrame);
  assert.equal(host.get('grove/grove-2/cable').getState().wireCount,4);
  hub.port('grove-2').detach();assert.deepEqual(selector.children.map(option=>option.value),['lcd']);
  return {status:'pass',cases:['real-products-discovered-through-Grove-HUB','independent-host-OLED-LCD-framebuffers','nested-grayscale-calibration','poses-and-four-wire-cable-preserve-pixels','selective-detach-retains-sibling-screen'],scope:'Actual product APIs and demo controller with canvas/forms stubbed; no browser or hardware acceptance'};
 }finally{
  panel?.unbind();host?.dispose();
  if(previous===undefined)delete globalThis.document;else globalThis.document=previous;
 }
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkDisplayUnits(),null,2));
