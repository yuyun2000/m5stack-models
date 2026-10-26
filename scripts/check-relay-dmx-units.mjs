import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {loadModel,loadGroveModule} from '../src/loaders.js';

/** Real three-branch assembly; canvas only is replaced for Node. */
export async function checkRelayDmxUnits(){
 const previous=globalThis.document,noop=()=>{},gradient=()=>({addColorStop:noop});
 const ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:gradient,createRadialGradient:gradient},{get:(t,k)=>t[k]??noop,set:(t,k,v)=>(t[k]=v,true)});
 globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>ctx})};
 let host;
 try{
  host=await loadModel('sticks3');const hub=await loadGroveModule('hub');host.port('grove').attach(hub);
  const modules={};
  for(const [i,id]of ['2relay','4relay','dmx'].entries()){
   const module=await loadGroveModule(id,{terminalPlug:true,cableLength:55+i*10});modules[id]=module;hub.port(`grove-${i+1}`).attach(module);
   assert.ok(host.get(`grove/grove-${i+1}`).module===module);
   assert.equal(module.get('sensor').meta.role,'visual-anchor');assert.equal(module.get('cable').getState().wireCount,4);
  }
  host.root.updateMatrixWorld(true);
  const events=[];host.on('input',e=>events.push(e));
  for(const [id,count]of [['2relay',2],['4relay',4]]){
   const unit=modules[id],lamps=unit.list('led');assert.equal(lamps.length,count,'relay channel indicators match the product');
   const cable=unit.get('cable'),socketFrame=unit.get('grove').object3d.matrixWorld.clone();
   for(let n=1;n<=count;n++){
    const port=unit.port(`terminal-${n}`),plug=port.module;assert.ok(plug,'the supplied detachable plug is present');
    assert.equal(plug.list('joint').length,4,'each 4P plug exposes its four real screw heads');
    for(const screw of plug.list('joint'))host.handle({type:'joint',target:screw.path,angleDeg:35});
    assert.ok(plug.list('joint').every(screw=>screw.angleDeg===35));
    const ledStates=lamps.map(led=>led.getState());port.detach({dispose:false});host.root.updateMatrixWorld(true);
    assert.ok(unit.get('cable')===cable,'removing one terminal retains the Grove cable');
    assert.ok(unit.get('grove').object3d.matrixWorld.equals(socketFrame),'terminal removal leaves the fixed Grove mating frame alone');
    assert.deepEqual(lamps.map(led=>led.getState()),ledStates,'terminal removal does not change independent light output');
    assert.equal(port.module,null);port.attach(plug);
   }
   assert.ok(lamps.every(led=>led.brightness===0),'screw rotation does not switch the relay indicators');
   host.handle({type:'led',target:lamps[0].path,brightness:.4});assert.equal(lamps[0].brightness,.4);
   assert.ok(lamps.slice(1).every(led=>led.brightness===0),'channel indicators remain independent');
  }
  assert.equal(events.length,12,'only the six explicit terminal detach/attach pairs emit input');
  assert.ok(events.every(e=>e.kind==='port'),'external screw/light commands do not echo control input');
  const dmx=modules.dmx,termination=dmx.button('termination'),led=dmx.get('power-led');
  assert.equal(termination.latching,true);assert.equal(dmx.list('led').length,1);
  const ledBefore=led.getState(),otherFrames=[modules['2relay'].get('grove').object3d.matrixWorld.clone(),modules['4relay'].get('grove').object3d.matrixWorld.clone()];
  termination.setPosition(0);host.update(1);host.root.updateMatrixWorld(true);const before=termination.cap.matrixWorld.clone();
  termination.press('branch-check');termination.release('branch-check');host.update(1);host.root.updateMatrixWorld(true);
  assert.equal(termination.position,1);assert.ok(!termination.cap.matrixWorld.equals(before),'the real termination selector moves and remains in its detent');
  assert.deepEqual(led.getState(),ledBefore,'termination position does not invent a power state');
  assert.ok(events.some(e=>e.id==='grove/grove-3/termination'&&e.action==='down'),'DMX switch uses its nested input path');
  const release=dmx.button('xlr-release');assert.equal(release.latching,false);
  const rest=release.cap.matrixWorld.clone(),at=events.length;release.press('branch-check');host.update(1);host.root.updateMatrixWorld(true);
  assert.ok(release.getActuationState().depthMm>0&&!release.cap.matrixWorld.equals(rest),'the actual XLR release tab presses');
  release.cancel('branch-check');host.update(1);host.root.updateMatrixWorld(true);
  assert.equal(release.getActuationState().depthMm,0);assert.ok(release.cap.matrixWorld.equals(rest),'XLR release tab returns after cancellation');
  assert.ok(!events.slice(at).some(e=>e.action==='click'));
  for(const [i,id]of ['2relay','4relay'].entries())assert.ok(modules[id].get('grove').object3d.matrixWorld.equals(otherFrames[i]));
  host.handle({type:'pose',target:'grove/grove-3/unitFrame',position:[15,90,5],rotation:[.1,-.2,.3]});
  host.handle({type:'cable',target:'grove/grove-3/cable',slack:12,bend:[0,0,-1]});
  hub.port('grove-1').detach();assert.equal(hub.port('grove-1').module,null);
  assert.ok(hub.port('grove-2').module===modules['4relay']&&hub.port('grove-3').module===dmx,'selective branch removal preserves the sibling products');
  return {status:'pass',cases:['three-real-Unit-branches-with-four-wire-cables','six-independent-removable-4P-plugs-and-24-screw-heads','terminal-removal-retains-fixed-ports-and-light-output','independent-relay-indicators-without-electrical-behavior','stable-DMX-selector-and-nested-input-path','real-XLR-release-tab-press-cancel-and-return','external-pose-and-independent-branch-detach'],scope:'Actual product components and recursive Grove ownership; canvas stub only, no browser or hardware acceptance'};
 }finally{host?.dispose();if(previous===undefined)delete globalThis.document;else globalThis.document=previous;}
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkRelayDmxUnits(),null,2));
