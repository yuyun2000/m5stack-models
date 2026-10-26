# Unit LoRaE220-433 - U170-433

Exact own433 official MCP/page,schematic,front/rear/socket photographs and pinned own CAD were checked on2026-10-27. Stage **modeled**,scope **visual-only**. Necessary construction/API smoke passes;GPU/browser,production-fit,physical,electrical orfirmware acceptance is not claimed.

Own source order0=complete6614front/rear faces,1=displaced3858rear,2=displaced2756front. All6614 directed native triangles remain under one translation from `[12,32,.4]`,identity axes,scale1. No native face repair,deletion,stretch orindependent half shift. Original mating coincidence remains;combined case is not called a single manifold. Native24x64x8mm shell is not stretched to the nominal71.4x24x8mm unit includingSMA. Mounts remain atX+/-8,Y-20;outer-layer radius2.425 andlarger native middle contours are retained.

Physical construction includes a populated carrier with real mounting reliefs/retaining/Grove bores andplated barrels;E220-400T22S board,22castellated contact envelopes,documented LLCC68 package under a closed metal shield,C1/C2 10uF;actual blueGrove/four contacts/bent solder tails;SMA female annular barrel/thread crests/hex fixing/dielectric/female centre socket anddeep blind floor;inferred internal coax;three rear hex fasteners andtwo actual body films. Hidden board/package/coax/support dimensions are appearance estimates. The schematic does not establish the mechanical ANT/coax route,so the reconstructed coax does not assert an electrical net. No900T22S/JP/Telec content or920 whole assembly is used.

Exports are `Model`, `GroveModule`, `Antenna`, `spec`. Actual body order is `grove`, `sma`, `m0`, `m1`. Grove labelsGND/5V/RXD/TXD are documentary in actual colour-wire order;own rear-view print readsTXD/RXD/5V/GND. `sma` uses ordinary `sma-female` family matching;Antenna.meta.connector is `sma-female` andphysicalConnector is `sma-male`.It accepts the actual ordinary male accessory,notGrove orRP-SMA. No sensor/LED/display/speaker/body joint ormeasurement anchor is invented. Module wrappers add actual4-core/two-plug `unitFrame`/`cable`;use`get(id)` on modules.

`m0`/`m1` are two independent latching Button controls genuinely reachable through the original front opening. Only each cream cap moves along-Y by inferred1.1mm;body/cover/four solder terminals,PCB/case/connectors/films remain fixed. First press toggles once even with multiple held sources;partial release stays held;cancel/final release ends holding andpreserves selected detent without click. External `position` emits no input echo. These are visual detents without electrical mode mapping,RF/UART/address implementation.

```js
const unit = new Model({antenna:true,m0Position:0,m1Position:1});
unit.get('m0').onPointerDown({pointerId:1});
unit.get('m0').press('key');
unit.get('m0').onPointerUp({pointerId:1});
unit.get('m0').cancel('key'); // hold ends,selected detent stays
unit.handle({type:'button',target:'m0',action:'position',position:0,immediate:true});
const module = new GroveModule({antenna:true,cableLength:70});
host.port('unit').attach(module);
host.handle({type:'button',target:'unit/m1',action:'position',position:1});
const antenna = module.get('sma').detach({dispose:false});
module.get('sma').attach(antenna);
// External runtime calls update(dtSeconds). No tilt/joint method exists.
```

Defaults are antenna:false,m0Position:0,m1Position:0. Eight named presets cover actual absent/present antenna andall four physical slider combinations. No half-cover service API is added to the complete native assembly. Invalid visual detents are rejected on lazy build.

Own433 hero shows the supplied110mm-total SMA-male rubber duck in a bent outline but does not establish a clear hinge pin,axis orstop. `Antenna` therefore reproduces an inferred static folded shell/coupler/neck/elbow/whip,with no components orjoints andno tilt/RPM command. Receiving coupling bore andmale pin have positive clearance to the real female SMA barrel/socket;attachment/detachment is independent ofDIP/cable/peer modules. Nominal110mm refers to supplied accessory total;folded visual bounds are recorded separately,not claimed measured fit.

Two body-film PNGs reproduce own frontLoRa433 and rearLoRaE220-433/433MHz/E220-400T22S/mode-chart/UART/pins. A third PNG reproduces actualON/1/2 ink on the fixed DIP cover without inventing another film. All are accurate code redraw from readable exact433 photos,with inferred font/color/registration;no photo crops or920/JP label substitution. Actual front film has its DIP die-cut andprojection follows only real surfaces. Static literal PNG URLs permit bundling. artwork:false only removes ink;all physical attributes/index/world matrices stay fixed through both entries,all8real presets andintermediate cap motion. Printed mode chart is observed ink only.

Necessary smoke matches all6614 original directed source triangles,checks all102body material meshes andthe static accessory for directed closure/positive volume,23empty-axis and92FrontSide wall rays,actual Grove plated-tail installation/SMA female blind bore/antenna pin-coupling clearance,source layer profiles,supported films andreal switch/hex/socket backing;two cap-only multi-source stable controls withnoecho;16entry/preset artwork checks andintermediate motion;static antenna detach/reattach andwrongGrove/RP-SMA preservation;transformed-parent4-core cable,peer isolation and555resource disposals. No RF link/frequency/range,packets,UART,mode/electrical/power orfirmware behavior. Source code MIT andexisting M5_Hardware MIT notices remain;printed-design/trademark rights are retained.
