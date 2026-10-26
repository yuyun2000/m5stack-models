# Unit HBridge — original U160

Original U160 was checked against official M5Stack MCP, its own page, original board/schematic, package photographs and pinned own CAD on 2026-10-27. Stage is **modeled**, scope **visual-only**. Necessary construction/API smoke passes; GPU/browser, physical assembly and production-fit acceptance are not claimed.

The same-location rear component 1 (3,032 triangles) and front component 2 (2,560 triangles) preserve all **5,592** original directed source faces with one common translation `[0,-28,4]`, identity axes and scale 1. Components 0/3 are displaced display duplicates. No source repairs, cuts, omitted faces, per-half moves or stretching. Native case is 24 × 56 × 8 mm; nominal 56 × 24 × 10.2 mm includes the installed terminal cross-section. +X is front-label right, +Y terminal end, +Z front H label. Real mounting bores stay open.

Physical construction includes original front retaining tongues behind rear inspection windows, a populated PCB with actual retaining/Grove/terminal/SWD bores and solder barrels, red Grove housing/four contacts/bent solder tails, orange HT3.96 receiving socket/four real male contacts and rear backing, rear hex fastener, and two supported adhesive films. Exact original own board shows STM32F030F4P6, RZ7899, MP1584EN-LF-Z, HX6306P332MR, AO3401A/DTC143ZCA, inductor, protection diodes and capacitors. Concealed layout, package dimensions, solder/contact geometry and installed planes are photo reconstructions. No original-U160 INA199/SY8303/shunt or supplied loose 470 µF capacitor is asserted.

`Model`, `GroveModule`, `TerminalPlug`, `spec` are exported. Ports are `grove` (`grove`, GND/5V/SDA/SCL documentary labels) and `terminal` (`ht3.96-4p`, HV/GND/M−/M+ front-view spatial slots). Terminal slot indices do not claim schematic P5 pin order or wiring. SWD has five physical plated bores without an exterior operational port. No sensor/LED/value anchor is invented.

The four independent `address-1`…`address-4` DIP sliders and `source` VM selector are latching Button components. Their fixed body/metal cover/leads stay on the actual internal board. Only real caps move. Closed front case blocks them: `interactive === false`, no cap hit targets, guarded pointer methods. External `setPosition(0|1,{immediate:true})` and `handle({type:'button',target:'source',action:'position',position:1})` drive visual detents without input echo. No I2C address calculation or power routing is implemented. Actual source/DIP throw and electrical left/right mapping remain unmeasured.

`frontCover:false` is a service presentation: it omits the entire original front cover, its film/ink and the rear retaining fastener that must first be released. Original rear, PCB, switches, connector positions and rear film remain unchanged; retained caps become genuinely reachable from the front and pointer-enabled. It is not a production-qualified disassembly or operating-state claim. Press from multiple simultaneous sources toggles only once, partial release stays held, and cancel/final release preserves the switched detent without a click. A subsequent new press toggles back.

The optional supplied `TerminalPlug` has four real mating channels, wire-entry cavities with metal clamp backing and four screw-access bores. `terminal/screw-1`…`terminal/screw-4` are externally driven VisualJoint components. Only each visible cross-recess head rotates around its fixed axis; every shank, clamp cage, pressure/lower plate, contact and other head stays fixed. Viewer range −180…180° is demonstrative; `rangeDeg:null`, continuous false, nonzero RPM rejected. Finite external angles have no asserted thread stop, axial travel, clamping force or electrical consequence.

```js
const device = new Model({terminalPlug:true});
const service = new Model({frontCover:false,terminalPlug:true});
service.get('source').onPointerDown({pointerId:1});
service.get('source').onPointerCancel({pointerId:1}); // selected detent stays
device.handle({type:'joint',target:'terminal/screw-2',angleDeg:70,durationMs:200});
const module = new GroveModule({frontCover:false,terminalPlug:true,cableLength:55});
host.port('unit').attach(module);
host.handle({type:'button',target:'unit/address-1',action:'position',position:1});
host.handle({type:'pose',target:'unit/unitFrame',position:[16,80,-9],rotation:[.1,-.2,.15]});
// External runtime calls update(dtSeconds); use module.get('id'), not a joint() helper.
```

Four named cover/plug combinations are catalogued. A four-core cable with two fitted plugs follows transformed host/module mating frames; peer modules and terminal attachment remain independent. Detach without disposal permits reattachment; disposal releases graphics resources.

Two high-resolution ordinary PNGs are accurate code redraws of readable original U160 body labels. They recreate observed text/color blocks/circuit lines without photo crops; font metrics, spacing, film registration and colorimetry remain inferred. Static literal PNG URLs allow production bundling. `artwork:false` removes ink while every physical geometry attribute, index and world transform stays unchanged across both entries, all four actual configurations and stable cap/head poses. PNG metadata retains numeric pixel density only.

The original product page links cross-product `U085_Model_Size.jpg` and a v1.1 capacitor instruction image. Original own CAD, board and package images govern this model; those links do not justify stretching the case or importing a v1.1 loose capacitor. Public documentation feedback was accepted as `6c58540d051147ba9af562a88312b544`.

Necessary smoke compares every directed native triangle against own raw source under the common transform, checks 40 empty-axis rays and 188 FrontSide material-wall rays, closed positive volume for 280 material meshes including plug, supported films/real connector backing/window closure, five cap-only controls in both cover states with multi-source cancellation and noecho, four independent head angles/reset/invalid-command rejection, 16 artwork configuration/pose pairs, transformed-parent four-core attachment, nested drive/peer isolation/detach and disposal. No motor/direction/speed/PWM/current/voltage/address/electrical/protocol/firmware behavior is supplied. Source-code MIT and existing M5_Hardware MIT notices remain applicable; printed-design/trademark rights are retained.
