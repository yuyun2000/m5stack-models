import fs from 'node:fs/promises';
import {loadModel} from '../src/loaders.js';

// Keep product-specific mechanical regressions in the normal check command.
const checks=[];
for(const script of ['check-header-sockets.mjs','check-stopwatch-assembly.mjs','check-stackchan-assembly.mjs','check-classic-unit-connectors.mjs','check-tab5-connectors.mjs','check-cardputer-zero-assembly.mjs','check-ir-hub-rfid2.mjs','check-rs485-buzzer-fan.mjs','check-grove-cable.mjs','check-limit-lever.mjs']){
 await import(new URL(script,import.meta.url));
 checks.push({script:`scripts/${script}`,status:'pass'});
}
const {checkStamPLCTerminals}=await import('./check-stamplc-terminals.mjs');
const model=await loadModel('stamplc');
try{const result=checkStamPLCTerminals(model);checks.push({script:'scripts/check-stamplc-terminals.mjs',...result});console.log('PASS StamPLC terminal detail:',JSON.stringify(result));}finally{model.dispose();}
const {checkNessoAssembly}=await import('./check-nesso-assembly.mjs');
const nesso=await loadModel('nesso-n1');
try{const result=checkNessoAssembly(nesso);checks.push({script:'scripts/check-nesso-assembly.mjs',...result});console.log('PASS Nesso N1 assembly:',JSON.stringify(result));}finally{nesso.dispose();}
const {checkAtomS3RClosure}=await import('./check-atoms3r-closure.mjs');
const atom=await loadModel('atoms3r');
try{const result=checkAtomS3RClosure(atom);checks.push({script:'scripts/check-atoms3r-closure.mjs',...result});console.log('PASS AtomS3R closure:',JSON.stringify(result));}finally{atom.dispose();}
for(const [script,id,exportName]of [
 ['check-sticks3-assembly.mjs','sticks3','checkStickS3Assembly'],
 ['check-paper-assembly.mjs','papermono','checkPaperMonoAssembly'],
 ['check-paper-assembly.mjs','papercolor','checkPaperColorAssembly'],
 ['check-core2-assembly.mjs','core2','checkCore2Assembly'],
 ['check-nanoc6-assembly.mjs','nanoc6','checkNanoC6Assembly'],
 ['check-cardputer-adv-assembly.mjs','cardputer-adv','checkCardputerADVAssembly']
]){
 const test=(await import(new URL(script,import.meta.url)))[exportName],model=await loadModel(id);
 try{const result=test(model);checks.push({script:`scripts/${script}`,product:id,...result});console.log(`PASS ${id} assembly:`,JSON.stringify(result));}finally{model.dispose();}
}
const dynamics=[];
const {checkUnitVisibleFunctions}=await import('./check-unit-visible-functions.mjs');
dynamics.push({script:'scripts/check-unit-visible-functions.mjs',...await checkUnitVisibleFunctions()});
const {checkStackChanCoverSeats}=await import('./check-stackchan-cover-seats.mjs');
dynamics.push({script:'scripts/check-stackchan-cover-seats.mjs',...await checkStackChanCoverSeats()});
const {checkHostVisibleLeds}=await import('./check-host-visible-leds.mjs');
dynamics.push({script:'scripts/check-host-visible-leds.mjs',...await checkHostVisibleLeds()});
const {checkStackChanServoOutline}=await import('./check-stackchan-servo-outline.mjs');
dynamics.push({script:'scripts/check-stackchan-servo-outline.mjs',...await checkStackChanServoOutline()});
const {checkStackChanTouchLed}=await import('./check-stackchan-touch-led.mjs');
dynamics.push({script:'scripts/check-stackchan-touch-led.mjs',...await checkStackChanTouchLed()});
const {checkDisplayTouch}=await import('./check-display-touch.mjs');
dynamics.push({script:'scripts/check-display-touch.mjs',...await checkDisplayTouch()});
const {checkScroll}=await import('./check-scroll.mjs');
dynamics.push({script:'scripts/check-scroll.mjs',...await checkScroll()});
const {checkPortLifecycle}=await import('./check-port-lifecycle.mjs');
dynamics.push({script:'scripts/check-port-lifecycle.mjs',...await checkPortLifecycle()});
const {checkViewerLifecycle}=await import('./check-viewer-lifecycle.mjs');
dynamics.push({script:'scripts/check-viewer-lifecycle.mjs',...await checkViewerLifecycle()});
const {checkDemoLifecycle}=await import('./check-demo-lifecycle.mjs');
dynamics.push({script:'scripts/check-demo-lifecycle.mjs',...await checkDemoLifecycle()});
const {checkHostGroveAssembly}=await import('./check-host-grove-assembly.mjs');
const hostGroveReport=await checkHostGroveAssembly();
await fs.writeFile(new URL('../artifacts/host-grove-assembly-check.json',import.meta.url),JSON.stringify({checkedAt:new Date().toISOString(),...hostGroveReport},null,2)+'\n');
dynamics.push({script:'scripts/check-host-grove-assembly.mjs',...hostGroveReport});
const {checkCardKB}=await import('./check-cardkb.mjs');
dynamics.push({script:'scripts/check-cardkb.mjs',...await checkCardKB()});
const {checkKey}=await import('./check-key.mjs');
dynamics.push({script:'scripts/check-key.mjs',...await checkKey()});
const {checkEightEncoder}=await import('./check-8encoder.mjs');
dynamics.push({script:'scripts/check-8encoder.mjs',...await checkEightEncoder()});
const {checkUnitActuators}=await import('./check-unit-actuators.mjs');
dynamics.push({script:'scripts/check-unit-actuators.mjs',...await checkUnitActuators()});
const {checkButtonActuation}=await import('./check-button-actuation.mjs');
dynamics.push({script:'scripts/check-button-actuation.mjs',...await checkButtonActuation()});
const {checkDeviceActuators,DEVICE_BUTTON_COUNTS}=await import('./check-device-actuators.mjs');
for(const id of Object.keys(DEVICE_BUTTON_COUNTS)){
 const model=await loadModel(id);
 try{const result=checkDeviceActuators(model,{id});dynamics.push({product:id,...result});console.log(`PASS ${id} actual actuators:`,JSON.stringify(result));}finally{model.dispose();}
}
const din=await loadModel('cores3',{dinBase:true});
try{dynamics.push({product:'cores3-din',...checkDeviceActuators(din,{id:'cores3-din',expected:3})});}finally{din.dispose();}
const {checkVisualMotion}=await import('./check-visual-motion.mjs');
dynamics.push({script:'scripts/check-visual-motion.mjs',...await checkVisualMotion()});
await fs.writeFile(new URL('../artifacts/dynamics-check.json',import.meta.url),JSON.stringify({checkedAt:new Date().toISOString(),scope:'Actual control movement and externally driven visual kinematics; no hardware/runtime validation',checks:dynamics},null,2)+'\n');
checks.push({script:'scripts/check-button-actuation.mjs',status:'pass'},{script:'scripts/check-device-actuators.mjs',status:'pass'},{script:'scripts/check-visual-motion.mjs',status:'pass'});
await fs.writeFile(new URL('../artifacts/detail-check.json',import.meta.url),JSON.stringify({checkedAt:new Date().toISOString(),scope:'Assembled mechanical geometry and visual kinematics only; browser review and physical fit remain separate',checks},null,2)+'\n');
