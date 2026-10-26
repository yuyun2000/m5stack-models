# Unit Roller485-Lite · U182-Lite

Stage: **modeled**. Research and necessary construction/API smoke dated 2026-10-26. This is the exact Lite bare-motor variant: it has no rotating top LEGO enclosure, expansion Grove, top PCB, top indicator or slip ring. Exhaustive browser and physical-device acceptance remain unperformed.

## Evidence and complete structure

The [own official product page](https://docs.m5stack.com/en/unit/Unit-Roller485%20Lite), official MCP product/schematic response, own photographs and own public CAD path define the model. Immutable sources, hashes and uncertainties are recorded in [sources.json](./sources.json). Native components 0/2/5 retain **all 8,730 triangles** of the coincident assembled fixed shell pair and RGB diffuser. Components 1/3/4 are translated duplicate copies. One common rigid transform preserves the native A tongue, M5 mark, real mounting passages, screen opening, Grove/debug/power apertures, seams and ribs. The U182-Lite and U188-Lite public paths currently contain the same fixed-shell blob; this model independently references U182-Lite and uses its actual single orange HT3.96-4P connector rather than CAN sockets.

The STL omits the motor and circuits. Reconstructed physical parts include the Ø41 D3504 outer bell, open top cap with four real M3 blind bores, recessed bearing sleeve and central bore, fixed stator/magnet envelopes, PCB with real pillar/terminal reliefs, STM32G431CBU6 LQFP48 and 48 leads, DRV8311/TLI5012/SIT3088 package envelopes, S1 tactile switch, deep OLED glass/carrier, open-top red Grove with four contacts, single HT3.96 cavity and four contacts, 5P debug socket, fixed face screws and two separate RGB packages behind the native diffuser. Hidden placement, package detail, motor mounting and connector fit remain inferred appearance geometry.

Own 10.webp and the native opening place the top of the orange socket at approximately Y=-9.6 mm. The inferred single-socket mating center is **[19.8,-13.2,0] mm**, with a16×7.2 mm front envelope. The lower service recess is intentionally retained and backed by the original shell structure. No source shell is stretched or trimmed to fit an assumed connector.

The official table says40×40×40 mm. The native fixed case is approximately40×15.2×40.0244 mm and the linked D3504 motor drawing givesØ41×14.8 mm. Placement at the native seat gives the current source-derived **41×30×41 mm** appearance envelope. This is not a measured production assembly datum, and geometry is not rescaled to force40mm. A request for a Lite-specific assembly drawing and clarification of nominal40mm was accepted as feedback **b6a2e2bf5b174a788c7be66dab54c907**. The package lists a turntable,flange and bracket,but the own public structure directory only supplies the enclosure STL;their fit and load behavior are not invented.

## Dynamic contract for other agents

```js
import {Model, GroveModule, TerminalPlug} from './src/units/roller485-lite/index.js';
const unit = new Model({terminalPlug:true}); // optional supplied orange screw plug
unit.handle({type:'joint', target:'rotor', angleDeg:75, durationMs:300});
unit.update(.3); // caller supplies seconds every animation frame
unit.handle({type:'joint', target:'rotor', rpm:20});
unit.update(.5);
unit.handle({type:'joint', target:'rotor', rpm:0});
unit.get('press','button').press('external-input');
unit.update(.1);
unit.get('press','button').release('external-input');
unit.update(.2);
unit.get('rgb-1','led').set('#00ff40');
unit.get('rgb-2','led').set({on:false});
unit.display('lcd').fill('#ffffff'); // ordinary external64x48 Display framebuffer
unit.handle({type:'joint',target:'pwr485/screw-1',angleDeg:60});
// Alternatively: unit.port('pwr485').attach(new TerminalPlug());
// host.port('port-a').attach(new GroveModule({cableLength:60,terminalPlug:true}));
// Paths under that host: port-a/rotor, port-a/press, port-a/lcd,
// port-a/rgb-1, port-a/pwr485/screw-2, port-a/unitFrame, port-a/cable.
```

`rotor` rotates continuously about +Y and adopts only the bell,top cap/rim and M3 bore wells. The shell,PCB,OLED,Grove,HT3.96,debug port,RGB packages/diffuser,adhesive films,bearing and stator stay fixed. Absolute angles,optional duration and caller-requested RPM change appearance only;the demo speed is a viewer choice with no torque,load,FOC,encoder or electrical meaning. The external framework owns motor control,current,voltage,position feedback,protocol and firmware.

`press` flexes the actual original A tongue vertices from the hinge. The 0.25 mm free-end travel is a visual estimate. Release and cancellation restore exactly the native positions and crease-aware normals;the transparent target handles input picking. Space/A use the same control. Presses emit input intent;there is no built-in settings/menu behavior.

`lcd` accepts the core64×48 external framebuffer;the visible OLED emission converts to white grayscale. Two independently driven `rgb-1`/`rgb-2` appearances default off;IDs describe spatial placement,not an unverified U4/U5 chain order. Neither lights nor pixels react automatically to attachment,supply,mode or communication. External angle/RPM/light/pixel commands do not echo input.

Fixed ports are `grove`(HY2.0-4P I2C),`pwr485`(HT3.96-4P) and `debug`(MX1.25-5P). Grove has four explicit wires and two plugs. `GroveModule` adds `unitFrame` pose and `cable` state;changing rotor angle cannot move its fixed Grove mating frame. Optional `TerminalPlug` adds only four screw-head `VisualJoint`s at `pwr485/screw-1..4`. They accept angles/durations,not RPM,and keep the plug/terminal body fixed. Their visual range does not claim real tightening limits,thread travel,clamp displacement,wiring or force. All connector/pin geometry is visual only. There is no artificial sensor state or encoder anchor.

Coordinates are millimetres: +X right,+Y motor output top,+Z fixed Grove front;the OLED faces-Y. Screen right is+Z and screen up is-X. Nominal dimensions remain metadata and do not override source geometry.

## Artwork and necessary checks

Three [reference-redraw PNGs](./artwork.json) use this exact Lite's own15.webp and12.webp. Only legible marks/colors are redrawn in code. Each print layer sits on a real adhesive substrate,including the U-shaped debug label with an open connector mouth. `artwork:false` removes only ink:all physical geometry attributes,indices and world transforms remain identical in bare/plug Model and GroveModule configurations. No photographic crop or source vector is distributed.

[smoke.json](./smoke.json) records native triangle count,finite attributes,directed closed generated edges,FrontSide mounting/motor/PCB/mating-bore walls,OLED and socket backing,actual flexure press/release/cancel/multiple-source hold,exact rotor reset,fixed versus moving parts,independent lights/white framebuffer,optional plug/screw handling,all four artwork configurations,and nested independent four-wire Grove pose/cable/attach/detach/disposal. These checks establish this appearance/API contract;they do not establish exhaustive browser acceptance,production fit,mechanical capability,electrical correctness,FOC or real-device execution.
