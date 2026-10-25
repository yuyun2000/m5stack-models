import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {Device,Module,Port,Button,VisualJoint} from '../src/core/index.js';

class ProbeModule extends Module {
  static meta={id:'lifecycle-probe',name:'Lifecycle probe',connector:'grove'};
  attaches=0;
  detaches=0;
  build(){
    this.body.add(new THREE.Mesh(new THREE.BoxGeometry(4,4,1),new THREE.MeshBasicMaterial()));
    this.add(new Button({id:'press',longPressMs:0,mesh:new THREE.Mesh(new THREE.BoxGeometry(2,2,1),new THREE.MeshBasicMaterial())}));
    this.add(new VisualJoint({id:'rotor',continuous:true}));
    this.add(new Port({id:'out',connector:'grove'}));
  }
  onAttach(){this.attaches++;}
  onDetach(){this.detaches++;}
}

const near=(actual,expected,why)=>assert.ok(Math.abs(actual-expected)<1e-9,`${why}: ${actual} vs ${expected}`);
const makePort=(host,id,connector='grove')=>host.add(new Port({id,connector}));
const belongs=(object,root)=>{for(;object;object=object.parent)if(object===root)return true;return false;};
const eventSnapshot=event=>({id:event.id,action:event.action,...(event.cancelled?{cancelled:true}:{})});

function resources(module){
  const counts=new Map();
  module.root.traverse(object=>{
    const material=Array.isArray(object.material)?object.material:[object.material];
    for(const resource of [object.geometry,...material])if(resource&&!counts.has(resource)){
      counts.set(resource,0);resource.addEventListener('dispose',()=>counts.set(resource,counts.get(resource)+1));
    }
  });
  return {
    size:counts.size,
    retained:()=>assert.ok([...counts.values()].every(count=>count===0),'Preserving or transferring a module cannot dispose its owned resources'),
    disposed:()=>assert.ok([...counts.values()].every(count=>count===1),'Every exclusively owned probe resource is disposed exactly once'),
  };
}

/** No filesystem or private source reads; only the CLI below writes a report. */
export async function checkPortLifecycle(){
  const {loadModel,loadGroveModule}=await import('../src/loaders.js');
  const freshSnapshots=[];
  for(const id of ['atoms3r','hub']){
    const fresh=await loadModel(id);
    try{
      assert.equal(fresh.components.size,0,'Factory models stay lazy until their first public access');
      const snapshot=fresh.getState(),components=[...fresh.components.values()];
      assert.ok(Object.keys(snapshot).length>0,`${id}: first getState builds real components without viewer/list/root access`);
      assert.deepEqual(Object.keys(snapshot),components.map(component=>component.id));
      assert.deepEqual(fresh.getState(),snapshot,'Repeated state reads preserve state');
      assert.deepEqual([...fresh.components.values()],components,'State reads do not rebuild components');
      freshSnapshots.push({id,components:Object.keys(snapshot)});
    }finally{fresh.dispose();}
  }
  const freshHub=await loadGroveModule('hub'),freshLeaf=await loadGroveModule('hub');
  class FreshAssembly extends Device{
    builds=0;
    build(){this.builds++;this.add(new Port({id:'hub',connector:'grove'})).attach(freshHub);freshHub.port('grove-1').attach(freshLeaf);}
  }
  const freshAssembly=new FreshAssembly();
  try{
    const snapshot=freshAssembly.getState();
    assert.equal(freshAssembly.builds,1);assert.equal(snapshot.hub.module.id,freshHub.meta.id);
    assert.equal(snapshot.hub.module.state['grove-1'].module.id,freshLeaf.meta.id);
    assert.deepEqual(snapshot.hub.module.state['grove-1'].module.state.sensor,{});
    assert.ok(snapshot.hub.module.state['grove-1'].module.state.grove,'First state recursively includes real nested Unit components');
    assert.deepEqual(freshAssembly.getState(),snapshot);assert.equal(freshAssembly.builds,1);
  }finally{freshAssembly.dispose();}
  const first=new Device(),second=new Device();
  const a=makePort(first,'a'),b=makePort(first,'b'),destination=makePort(second,'destination');
  const module=new ProbeModule(),owned=resources(module),events=[];
  first.on('input',event=>events.push(eventSnapshot(event)));
  const willDetach=[];
  first.on('module:will-detach',event=>{
    willDetach.push({port:event.port.id,module:event.module});
    assert.equal(event.port.module,event.module,'The old port still owns the module during will-detach');
    assert.equal(event.module.attachedTo,event.port);
    assert.equal(event.module.parentHost,event.port.host);
    assert.equal(event.module.root.parent,event.port.object3d,'Scene ancestry is intact during will-detach');
  });
  a.attach(module);
  const button=module.button('press'),root=module.root;
  const inputsBefore=events.length;
  assert.equal(a.attach(module),module,'Attaching the current instance is idempotent');
  assert.equal(module.root,root);assert.equal(module.button('press'),button);
  assert.equal(module.attaches,1);assert.equal(module.detaches,0);
  assert.equal(events.length,inputsBefore,'Idempotent attach emits no extra input');
  module.get('rotor').setRPM(60);first.update(.1,0);near(module.get('rotor').angleDeg,36,'One host tick integrates the current module once');

  b.attach(module);
  assert.equal(a.module,null);assert.equal(b.module,module);assert.equal(module.attachedTo,b);
  assert.equal(module.parentHost,first);assert.equal(module.root.parent,b.object3d);
  assert.equal(module.attaches,2);assert.equal(module.detaches,1);owned.retained();
  first.update(.1,.1);near(module.get('rotor').angleDeg,72,'Transferred instance is not ticked through its former port');
  assert.equal(a.detach(),null,'A former port cannot unplug the transferred instance');
  assert.equal(b.module,module);owned.retained();

  const replaced=new ProbeModule(),replacedResources=resources(replaced);a.attach(replaced);a.attach(module);
  assert.equal(a.module,module);assert.equal(b.module,null);
  replacedResources.disposed();assert.equal(replaced.components.size,0);owned.retained();

  class HatModule extends ProbeModule {static meta={id:'hat-probe',name:'Hat probe',connector:'hat'};}
  const hatPort=makePort(first,'hat','hat'),hat=new HatModule(),hatResources=resources(hat);hatPort.attach(hat);
  const beforeFailure=events.length,willBeforeFailure=willDetach.length;
  assert.throws(()=>hatPort.attach(module),/does not fit/);
  assert.equal(a.module,module);assert.equal(hatPort.module,hat);
  assert.equal(events.length,beforeFailure);assert.equal(willDetach.length,willBeforeFailure);
  owned.retained();hatResources.retained();

  const nested=new ProbeModule(),nestedResources=resources(nested),guard=new ProbeModule(),guardResources=resources(guard);
  module.port('out').attach(nested);nested.port('out').attach(guard);
  const beforeCycles=events.length,willBeforeCycles=willDetach.length;
  assert.throws(()=>module.port('out').attach(module),/itself|descendants/,'A module cannot attach to its own port');
  assert.throws(()=>nested.port('out').attach(module),/itself|descendants/,'A descendant cannot attach its ancestor');
  assert.throws(()=>guard.port('out').attach(nested),/itself|descendants/,'Deeper ancestry is checked before replacing a destination');
  assert.equal(a.module,module);assert.equal(module.port('out').module,nested);assert.equal(nested.port('out').module,guard);
  assert.equal(events.length,beforeCycles);assert.equal(willDetach.length,willBeforeCycles);
  owned.retained();nestedResources.retained();guardResources.retained();

  // Model the viewer's captured-source cancellation through the public event.
  const captured=new Map([[button,'pointer:7'],[nested.button('press'),'key:Enter']]);
  for(const [held,source]of captured)held.press(source);
  const oldPaths=[button.path,nested.button('press').path],cancelOrder=[];
  const offCancel=first.on('module:will-detach',({module:leaving})=>{
    cancelOrder.push('will-detach');
    for(const [held,source]of captured)if(belongs(held.object3d,leaving.root))held.cancel(source);
  });
  const offInputs=first.on('input',event=>{if(event.action==='up'||event.action==='detach')cancelOrder.push(event.action);});
  destination.attach(module);
  assert.equal(a.module,null);assert.equal(destination.module,module);
  assert.equal(module.parentHost,second);assert.equal(module.attachedTo,destination);
  assert.deepEqual(events.filter(event=>event.action==='up').map(event=>event.id),oldPaths,'Cancellation reaches the old top-level host with the old full paths');
  assert.ok(events.filter(event=>event.action==='up').every(event=>event.cancelled),'Transfer cancellation cannot produce a click');
  assert.deepEqual(cancelOrder,['will-detach','up','up','detach'],'Cancellation is synchronous and precedes detach input');
  assert.ok(!events.some(event=>event.action==='will-detach'),'Lifecycle notification adds no input action');
  assert.equal(button.path,'destination/press');assert.equal(nested.button('press').path,'destination/out/press');
  const angle=module.get('rotor').angleDeg;first.update(.1,.2);near(module.get('rotor').angleDeg,angle,'The old host stops ticking the transferred module');
  second.update(.1,.2);near(module.get('rotor').angleDeg,angle+36,'The new host ticks the module exactly once');
  owned.retained();nestedResources.retained();guardResources.retained();offCancel();offInputs();

  let reentrantCalls=0;
  const offReentrant=second.on('module:will-detach',({port,module:leaving})=>{
    reentrantCalls++;
    assert.equal(port.detach({dispose:false}),leaving,'Reentrant detach does not recurse');
    assert.throws(()=>b.attach(leaving),/detaching/,'A module cannot be transferred during its old port notification');
  });
  const saved=destination.detach({dispose:false});offReentrant();
  assert.equal(reentrantCalls,1);assert.equal(saved,module);assert.equal(saved.parentHost,null);assert.equal(saved.attachedTo,null);
  assert.equal(saved.root.parent,null);owned.retained();destination.attach(saved);

  first.dispose();hatResources.disposed();second.dispose();
  owned.disposed();nestedResources.disposed();guardResources.disposed();

  const promotionHost=new Device(),promotionPort=makePort(promotionHost,'promotion');
  const formerParent=new ProbeModule(),formerParentResources=resources(formerParent),promoted=new ProbeModule(),promotedResources=resources(promoted);
  promotionPort.attach(formerParent);formerParent.port('out').attach(promoted);
  promotionPort.attach(promoted);
  assert.equal(promotionPort.module,promoted);assert.equal(promoted.parentHost,promotionHost);
  assert.equal(formerParent.components.size,0);formerParentResources.disposed();promotedResources.retained();
  promotionHost.dispose();promotedResources.disposed();

  const transactionHost=new Device(),source=makePort(transactionHost,'source'),target=makePort(transactionHost,'target'),other=makePort(transactionHost,'other');
  const transferring=new ProbeModule(),transferringResources=resources(transferring),incumbent=new ProbeModule(),incumbentResources=resources(incumbent),intruder=new ProbeModule(),intruderResources=resources(intruder);
  source.attach(transferring);target.attach(incumbent);other.attach(intruder);
  const offUncaught=transactionHost.on('module:will-detach',({port})=>{if(port===source)other.attach(transferring);});
  assert.throws(()=>target.attach(transferring),/transaction/,'An uncaught forbidden reattach aborts before old-owner unlink');offUncaught();
  assert.equal(source.module,transferring);assert.equal(target.module,incumbent);assert.equal(other.module,intruder);
  transferringResources.retained();incumbentResources.retained();intruderResources.retained();
  const transactionPhases=[];
  const offWill=transactionHost.on('module:will-detach',({port,module:leaving})=>{
    if(port===source){
      transactionPhases.push('source-will');
      assert.equal(leaving,transferring);assert.equal(transferring.attachedTo,source);
      assert.throws(()=>other.attach(transferring),/transaction/,'The candidate cannot move during its old will-detach');
      assert.throws(()=>target.attach(intruder),/attaching/,'A callback cannot replace the destination during its attach transaction');
      assert.equal(other.module,intruder);assert.equal(target.module,incumbent);
    }else if(port===target){
      transactionPhases.push('target-will');assert.equal(leaving,incumbent);
      assert.throws(()=>other.attach(incumbent),/transaction/,'The old destination cannot move while it is being detached');
    }
  });
  const offPost=transactionHost.on('input',event=>{
    if(event.action!=='detach')return;
    if(event.id==='source'){
      transactionPhases.push('source-post');assert.equal(transferring.attachedTo,null);
      assert.throws(()=>other.attach(transferring),/transaction/,'The transfer lock survives old-owner unlink and detach input');
      assert.throws(()=>target.attach(intruder),/attaching/);assert.equal(other.module,intruder);
    }else if(event.id==='target'){
      transactionPhases.push('target-post');assert.equal(incumbent.attachedTo,null);
      assert.throws(()=>other.attach(incumbent),/transaction/,'A pending disposal cannot destroy an instance revived by detach input');
      assert.equal(other.module,intruder);
    }
  });
  target.attach(transferring);offWill();offPost();
  assert.deepEqual(transactionPhases,['source-will','source-post','target-will','target-post']);
  assert.equal(source.module,null);assert.equal(target.module,transferring);assert.equal(other.module,intruder);
  transferringResources.retained();intruderResources.retained();incumbentResources.disposed();
  other.attach(transferring);assert.equal(target.module,null);intruderResources.disposed();transferringResources.retained();
  transactionHost.dispose();transferringResources.disposed();

  let callbackAncestryResources=0;
  for(const phase of ['source-will','target-post']){
    const host=new Device(),oldPort=makePort(host,'old'),branchPort=makePort(host,'branch');
    const candidate=new ProbeModule(),candidateResources=resources(candidate),branch=new ProbeModule(),branchResources=resources(branch),previous=new ProbeModule(),previousResources=resources(previous);
    oldPort.attach(candidate);branchPort.attach(branch);const destination=branch.port('out');destination.attach(previous);
    const oldTargetPath=destination.path;let changed=false;
    const moveTargetHost=()=>{changed=true;candidate.port('out').attach(branch);};
    const off=phase==='source-will'
      ?host.on('module:will-detach',({port})=>{if(!changed&&port===oldPort)moveTargetHost();})
      :host.on('input',event=>{if(!changed&&event.id===oldTargetPath&&event.action==='detach')moveTargetHost();});
    assert.throws(()=>destination.attach(candidate),/itself|descendants|own attachment port/,'Callback-modified ancestry is validated again before final assignment');off();
    assert.equal(changed,true);assert.equal(oldPort.module,null);assert.equal(branchPort.module,null);
    assert.equal(candidate.attachedTo,null);assert.equal(candidate.parentHost,null);assert.equal(candidate.root.parent,null);
    assert.equal(candidate.port('out').module,branch);assert.equal(branch.attachedTo,candidate.port('out'));
    candidateResources.retained();branchResources.retained();
    if(phase==='source-will'){assert.equal(destination.module,previous);previousResources.retained();}
    else{assert.equal(destination.module,null);previousResources.disposed();}
    candidate.dispose();host.dispose();candidateResources.disposed();branchResources.disposed();previousResources.disposed();
    callbackAncestryResources+=candidateResources.size+branchResources.size+previousResources.size;
  }

  // Use the actual HUB wrapper to check bubbling and nested moving assemblies.
  const {GroveModule:Hub}=await import('../src/units/hub/index.js');
  const hubHost=new Device(),hubSource=makePort(hubHost,'hub'),hub=new Hub(),leaf=new ProbeModule(),leafResources=resources(leaf);
  hubSource.attach(hub);hub.port('grove-1').attach(leaf);
  const bubbled=[],nestedInputs=[];
  hubHost.on('input',event=>nestedInputs.push(eventSnapshot(event)));
  const localOff=hub.on('module:will-detach',({port,module:leaving})=>{
    if(leaving===leaf){bubbled.push('hub');assert.equal(port.path,'hub/grove-1');}
  });
  const topOff=hubHost.on('module:will-detach',({port,module:leaving})=>{
    if(leaving!==leaf)return;
    bubbled.push('host');assert.equal(port.path,'hub/grove-1');assert.equal(leaf.button('press').path,'hub/grove-1/press');
    leaf.button('press').cancel('pointer:19');
  });
  leaf.button('press').press('pointer:19');hub.port('grove-2').attach(leaf);
  assert.deepEqual(bubbled,['hub','host'],'Nested will-detach reaches the old immediate and top-level hosts once');
  assert.deepEqual(nestedInputs.filter(event=>event.action==='up'),[{id:'hub/grove-1/press',action:'up',cancelled:true}]);
  assert.equal(hub.port('grove-1').module,null);assert.equal(hub.port('grove-2').module,leaf);
  assert.equal(leaf.button('press').path,'hub/grove-2/press');leafResources.retained();
  const hubEvents=nestedInputs.length;
  assert.throws(()=>hub.port('grove-3').attach(hub),/itself|descendants/);
  assert.throws(()=>leaf.port('out').attach(hub),/itself|descendants/);
  assert.equal(hubSource.module,hub);assert.equal(hub.port('grove-2').module,leaf);assert.equal(nestedInputs.length,hubEvents);
  localOff();topOff();
  const {GroveModule:Fan}=await import('../src/units/fan/index.js'),fan=new Fan();
  hub.port('grove-3').attach(fan);hubHost.update(0,0);
  const cableBuffers=[...hub.get('cable').wires,...fan.get('cable').wires].map(wire=>({wire,geometry:wire.geometry,disposals:0}));
  for(const buffer of cableBuffers)buffer.geometry.addEventListener('dispose',()=>buffer.disposals++);
  fan.get('rotor').setRPM(60);hubHost.update(.1,0);near(fan.get('rotor').angleDeg,36,'A real nested Fan is ticked once');
  hub.port('grove-1').attach(fan);hubHost.update(.1,.1);near(fan.get('rotor').angleDeg,72,'Moving a real Unit between HUB outputs leaves one owner');
  assert.equal(hub.port('grove-3').module,null);assert.equal(hub.port('grove-1').module,fan);
  const otherHubHost=new Device(),otherHubPort=makePort(otherHubHost,'moved-hub');
  otherHubPort.object3d.rotation.set(.2,-.3,.5);otherHubPort.attach(hub);otherHubHost.update(.1,.2);
  assert.equal(hubSource.module,null);assert.equal(hub.parentHost,otherHubHost);assert.equal(hub.attachedTo,otherHubPort);
  assert.equal(fan.get('rotor').path,'moved-hub/grove-1/rotor');near(fan.get('rotor').angleDeg,108,'Moving a complete real HUB assembly keeps one recursive tick');
  hubHost.update(.1,.3);near(fan.get('rotor').angleDeg,108,'The former host no longer ticks nested Units');
  for(const buffer of cableBuffers){assert.equal(buffer.wire.geometry,buffer.geometry,'Rigid transfer retains the actual four-wire cable buffers');assert.equal(buffer.disposals,0);}
  hubHost.dispose();otherHubHost.dispose();leafResources.disposed();
  for(const buffer of cableBuffers)assert.equal(buffer.disposals,1,'Each retained real cable buffer is disposed once with its final host');

  // An unusual scene-only nesting must also be rejected before mutation.
  const detached=new ProbeModule(),detachedResources=resources(detached),unhosted=new Port({id:'unhosted',connector:'grove'});
  detached.body.add(unhosted.object3d);
  assert.throws(()=>unhosted.attach(detached),/own attachment port/);
  assert.equal(unhosted.module,null);assert.equal(detached.attachedTo,null);detachedResources.retained();
  unhosted.dispose();detached.dispose();detachedResources.disposed();

  return {status:'pass',freshSnapshots,nestedFreshSnapshot:'hub/grove-1/sensor',cases:['fresh public state and recursive real module snapshots','same-port idempotence','same-host transfer','cross-host transfer','destination replacement','descendant promotion before former-parent disposal','validation before mutation','self and descendant cycle rejection','old-path synchronous cancellation','nested actual HUB event bubbling','reentrant detach protection','transaction rejects will-detach and post-detach reattachment','pending destination disposal cannot revive its module','ancestry revalidated after source and destination detach callbacks','scene-only cycle rejection','single-tick rpm after transfer','real HUB/Fan rigid transfer retains four-wire buffers','retained then exactly-once resource disposal'],probeResources:owned.size+replacedResources.size+hatResources.size+nestedResources.size+guardResources.size+leafResources.size+detachedResources.size+formerParentResources.size+promotedResources.size+transferringResources.size+incumbentResources.size+intruderResources.size+callbackAncestryResources,realCableBuffers:cableBuffers.length,scope:'Public Module/Port ownership, lifecycle events and visual state only; no electrical, firmware or private source dependency'};
}

if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
  const fs=await import('node:fs/promises'),report={checkedAt:new Date().toISOString(),...await checkPortLifecycle()};
  await fs.mkdir(new URL('../artifacts/',import.meta.url),{recursive:true});
  await fs.writeFile(new URL('../artifacts/port-lifecycle-check.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
  console.log('PASS Port lifecycle:',JSON.stringify(report));
}
