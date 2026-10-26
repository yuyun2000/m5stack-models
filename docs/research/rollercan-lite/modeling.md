# Unit RollerCAN-Lite · U188-Lite

Stage: **modeled**. This product is the Lite bare-motor version, without the standard U188 rotating top enclosure, top Grove, top PCB, top indicator or slip ring. Research and necessary structural/API smoke: 2026-10-26. Browser multi-view acceptance is deferred per the user request.

## Source and assembly

The [official Lite page](https://docs.m5stack.com/en/unit/Unit-RollerCAN%20Lite), official MCP product/schematic response, Lite photographs 4/7/8.webp and Lite's own public STL define this model. The entire coincident fixed shell pair and RGB diffuser are preserved; components 1/3/4 are exploded duplicate copies. CAD parts 0/2/5 use one shared transform. Original A tongue, OLED/Grove/debug/dual-CAN apertures, LEGO bores, fixing holes, ribs and perimeter seam are retained. Public CAD derivatives retain the M5_Hardware MIT attribution.

The original STL lacks the motor and electronics. This model adds the D3504 outer bell, open top cap, four M3 blind wells, a hollow bearing sleeve, fixed stator envelope, PCB with native-boss reliefs, hidden circuit packages/S1 switch, complete OLED glass/carrier, red open-top Grove, dual XT30(2+2) cavities and contacts, debug socket and two separately driven physical RGB packages. Original photographs, raw CAD, conversion scripts and MCP outputs remain outside the repository. Artwork is deferred; no table, vector original or photograph crop is distributed.

### Dimension limitation

The official table says 40 × 40 × 40 mm while the page links a D3504 drawing specifying Ø41 × 14.8 mm. Lite's own native case is15.2mm high; Lite photos show the bare motor instead of the standard top enclosure. The model places the motor against that seat, yielding **41 × 30 × 41 mm source-derived model envelope**. This is an inferred assembly, not hardware measurement or a production mounting datum. The official nominal40mm remains metadata and is not forced onto the geometry. Request for a Lite-specific assembled drawing was accepted by M5Stack as feedback `a0e15a96dbc44923aad9659ff1e2c5eb`. Source hashes, inference details and transforms are in [sources.json](./sources.json) and `src/units/rollercan-lite/cad-map.json`.

## Integration for other agents

```js
import {Model, GroveModule} from './src/units/rollercan-lite/index.js';
const unit = new Model();
unit.handle({type:'joint', target:'rotor', angleDeg:75, durationMs:350});
unit.update(0.35); // caller supplies frame dt in seconds
unit.handle({type:'joint', target:'rotor', rpm:20});
unit.update(0.5);
unit.handle({type:'joint', target:'rotor', rpm:0});
unit.get('press', 'button').press('external-intent');
unit.update(0.1);
unit.get('press', 'button').release('external-intent');
unit.get('rgb-1', 'led').set('#00ff80');
unit.get('rgb-2', 'led').set({on:false});
unit.display('lcd').fill('#ffffff');
// host.port('port-a').attach(new GroveModule({cableLength:60}));
// Nested paths are port-a/rotor, port-a/press, port-a/lcd etc.
```

`rotor` is a continuous VisualJoint around +Y. It adopts only the motor outer bell, end cap/rim and M3 bore wells. Grove, both CAN sockets, OLED, A tongue, PCB, RGB diffuser/packages, bearing sleeve and stator remain fixed. Angle/RPM are visual commands; demo speed is a UI choice and does not claim a real motor rating. The model emits no encoder, current, torque or CAN data. Call `update(dt)` to advance transitions and requested rotation.

`press` is a real native shell flexure: the original tongue vertices and their crease-aware normals deform from the outer hinge, then return exactly to rest on release or cancellation. The transparent pointer target only handles picking. Keyboard Space/A maps to the same input intent. No firmware setting menu is implemented.

`lcd` is64×48 and accepts the ordinary Display framebuffer API. Its visible emission is white grayscale. `rgb-1`/`rgb-2` are independent, externally driven WS2812C-2020 appearances and default off; IDs describe spatial placement rather than an unverified U4/U5 chain order. Neither display nor LEDs respond automatically to cable attachment, power, mode or traffic.

Ports are fixed `grove` (HY2.0-4P I2C), `can-1`/`can-2` (XT30(2+2)) and `debug` (MX1.25-5P). CAN row IDs are spatial and do not claim manufactured connector numbering. Only Grove has a supplied four-wire visual cable implementation. `sensor` is a passive visual anchor with an empty state, not an encoder or electrical model. Millimetres; +X right, +Y motor output top, +Z fixed Grove front, OLED faces -Y.

## Necessary smoke

[smoke.json](./smoke.json) records finite geometry/normals, actual native mounting passages, cap blind-bore depths and FrontSide inner walls, real OLED/connector backing, actual native-tongue movement/release/cancel, fixed and rotating frames, independent RGB and white framebuffer, nested Grove four-wire pose/attach/detach and resource disposal. These checks establish the implemented appearance/API contract only. They do not establish exhaustive browser acceptance, manufacturing tolerances, mechanical capability or real-device execution.
