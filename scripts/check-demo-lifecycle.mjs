import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {DynamicsPanel} from '../demo/dynamics.js';
import {Device,Module,Port} from '../src/core/index.js';

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
 return {status:'pass',cases,scope:'Actual demo async controller with real host/port/module ownership; browser selection and focus remain separately verified'};
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log('PASS demo lifecycle:',JSON.stringify(await checkDemoLifecycle()));
