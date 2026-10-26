# Unit ID U124

Stage: `modeled`; browser/visual and physical acceptance remain unverified. Millimetres: +X front-label right, +Y label end, +Z front.

## Official sources and assembly

The official U124 product table, own dimension drawing and native complete casing agree on **24 × 24 × 8 mm**. The drawing identifies Ø5 mounting holes at 16 mm pitch, a 10 mm wide and 5.2 mm high Grove connector, front/rear label recesses, the rear retaining recess and a real top-edge rectangular slot. Exact-model product photographs show the red Grove socket, narrow `ID / ATECC608B- / TNGTLSU-G` front label and rear `PORT.A.I2C` pin-color label. The top slot is an existing casing opening, not a button, LED or sensor aperture.

The own structure path `Products/U124_Unit_ID/Structures/Unit_ID.stl` was retrieved at path-specific commit `66720a863658da9bab58a208d4ebf8a040c2d42c`, verified against Git blob `48e92a95c14e29844db13856cc991e9d3f2f460f` and the source-byte hash in [CAD map](../../../src/units/unit-id/cad-map.json). Component 0 is the complete **4178-triangle** assembled front/rear casing. Components 1/2 are spatially displaced duplicate shell halves. One common translation places the full selected original component at the origin at scale 1. No original faces are removed, patched, filled, stretched or independently repositioned. Native holes, top slot, Grove opening, rear retaining recess and M5 emboss remain intact.

The official MCP response and own schematic identify U2 **ATECC608B-TNGTLSU-G**, U1 **HT7533**, R1/R2 **4.7K**, C1/C2 **10uF** and C3 **100nF**. No MCU, external memory, LED, button, rotary component or moving structure appears. The linked Microchip ATECC608B summary datasheet DS40002239A pages 18–20 gives the **eight-pad 2 × 3 mm UDFN** outline, **0.50–0.60 mm** height with **0.55 mm nominal**, 0.5 mm terminal pitch and an underside exposed paddle. The model rotates that fixed outline in the PCB plane to **3 × 2 × 0.55 mm**; its eight small underside terminals and paddle are physical geometry, not SOIC gull-wing legs. The datasheet package drawing/table was rendered and read locally. Unreadable lot markings are omitted.

## Complete physical appearance

The intact native closed casing contains a shaped 0.8 mm PCB with open mounting-boss reliefs and a real central retaining through-bore, the UDFN security chip and underside paddle, a three-terminal regulator, two pull-ups and three capacitors. A fixed retaining head/shank occupies the existing rear retaining recess. The concealed PCB outline/plane, electronics placement, regulator/passive envelopes and installation are inferred appearance reconstruction because the public structure contains no production electronics assembly.

The true top slot remains open. Its center looks over 4 mm into the recessed closed UDFN package; the PCB edge is also physically present below it. The native casing's internal walls remain behind the cavity. No flat cap, fake chip window or photographic patch is added at the opening. The hidden package placement is inferred, so this does not establish the production assembly fit or internal stackup.

The red HY2.0-4P socket includes side rails, locking shoulders/bridge, a rear dielectric carrier, four physical metal contacts and solder tails. Its mouth has genuine depth and a recessed dielectric back wall. Both native mounting holes remain clear through the complete physical assembly. The front and rear label areas are closed native walls rather than invented electronics windows.

Two thin physical adhesive films touch the existing front and rear label recesses. Their final ordinary PNGs are exact-model `reference-redraw` artwork; [artwork provenance](artwork.json) records photo references, asset hashes, dimensions and placement. The front reproduces only the readable ID/part text; the rear reproduces PORT.A.I2C and the four pin names/colors. No photo pixels, private intake data, source vectors or generators are distributed. `artwork:false` removes only printed artwork, leaving the films and every other physical attribute/index/world transform unchanged.

## Agent integration

```js
import { Model, GroveModule, spec }
  from '../../../src/units/unit-id/index.js';

const unit = new GroveModule({ cableLength: 55 });
host.port('portA').attach(unit); // an existing physical Grove port
host.handle({ type: 'pose', target: 'portA/unitFrame',
  position: [15, 70, -5], rotation: [0.2, -0.1, 0.3] });
host.update(0.016); // update the four physical wire curves after pose changes
const connector = host.get('portA/grove');
const detached = host.port('portA').detach({ dispose: false });
// detached.dispose() when the external owner no longer needs it.
```

Exports are `Model`, `GroveModule` and `spec`. Model metadata uses `m5stack.unit.unit-id`; module metadata uses `m5stack.unit.unit-id.grove`. The body's **only** registered component is `grove`. A mounted module also has the common `unitFrame` pose and `cable` interfaces. There is no `sensor`, secure-element command anchor, button, LED, display or joint. The cable colors are Black GND, Red 5V, Yellow SDA and White SCL. Source connector pin-number conventions do not define a simulator protocol.

External frameworks own identity, serial numbers, keys, certificates, cryptography, random-number generation, data storage, I2C, electrical behavior, power and firmware. The model never generates, reads, stores or exposes a real key, certificate, serial number or device identity. It provides no such commands or synthetic security values. Whole-unit pose only moves the physical assembly and cable endpoint; externally driven movement never echoes input. Normal attachment/detachment still reports port lifecycle intent.

## Necessary construction checks

[Local smoke](smoke.json) verifies all 4178 selected original triangles at scale 1, separate CAD/visual envelopes, ten clear mounting axial paths, native and PCB bore FrontSide wall hits, coordinate-welded directed PCB closure with positive signed volume, the eight-pad UDFN/paddle and PCB seating, documented component counts, a deeply backed four-contact Grove mouth, physical films seated on native surfaces, the real top slot's recessed package/PCB, both entry types' complete artwork physical invariance, absence of invented components, internal-command rejection, nested four-core pose/independent peer/detach/disposal and no input echo. These are necessary construction/API checks; no exhaustive browser review, production fit, cryptographic/device-identity behavior, electrical, firmware or physical hardware validation is claimed.
