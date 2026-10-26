# Unit Accel U056

Stage: `modeled`; browser/visual and physical acceptance remain unverified. Millimetres: +X front-label right, +Y label end, +Z front.

## Official sources and assembly

The official U056 product table lists **32 × 24 × 8 mm** in length/width/thickness order. The same-model dimension drawing gives model X/Y/Z **24 × 32 × 8 mm**, Ø5 mounting holes at 16 mm pitch and 12 mm from the bottom, a 10 mm wide and 5.2 mm high Grove socket, and a complete closed front/rear casing. These are the same overall dimensions in different axis orders; no discrepancy feedback is warranted.

The own structure path `Products/U056_Unit_Accel/Structures/Unit_Accel.stl` was retrieved at path-specific commit `802d26343594f6b8e3b8a9f111cb867613c93882`, verified against Git blob `7527140c2e924042ea350171c9976ce415a127e8` and the source-byte hash in [CAD map](../../../src/units/accel/cad-map.json). Component 0 is the complete **3490-triangle** assembled front/rear casing. Components 1/2 are spatially displaced duplicate shell halves. One common translation puts the full selected original component at the origin, scale 1. No original faces are removed, patched, filled, stretched or moved independently. Native mounting bores, front/rear label recesses, rear retaining recess, Grove opening and M5 emboss remain intact.

The official MCP response and own schematic identify U1 **ADXL345**, U2 **HT7533**, Q1/Q2 **AO3400A**, four capacitors and four 4.7K pull-ups. The linked Analog Devices ADXL345 Rev E datasheet page 37 was rendered and read: the real part is a **3 × 5 mm, 14-terminal LGA**, height **0.85–1.00 mm**, modeled at the stated 0.95 mm nominal. This is a fixed, closed package without an optical/acoustic window. The same datasheet page 18 confirms that the schematic's grounded ALT ADDRESS selects 0x53; that fact does not implement an I2C bus or sensor logic. The product is not modeled as an MMA7660 device.

## Complete physical appearance

The intact native closed casing contains a shaped PCB with open mounting-boss reliefs and a real central retaining through-bore, the actual 14-land ADXL345 package, a three-terminal regulator, two three-terminal level shifter packages, four capacitors, four pull-up resistors, and a physical retaining head/shank. The hidden board outline/plane, exact component placement, non-ADXL package envelopes and installation are inferred appearance reconstruction because the public structure does not include a production electronics assembly.

The red HY2.0-4P socket matches the exact product photographs. Its side rails, locking shoulders/bridge, rear dielectric carrier, four physical contacts and solder tails form a recessed mouth rather than a flat face. Mounting holes remain clear through the complete physical assembly. The shell is closed in the label areas; no invented sensor aperture is cut into it.

Two thin physical adhesive films touch the existing front and rear shell recesses. Their final ordinary PNGs are exact-model `reference-redraw` artwork. The front reproduces `ACCEL` and the three colored axis marks; the rear reproduces readable `ACCEL`, `ADXL 345`, `PORT.A.I2C` and pin colors/text. [Artwork provenance](artwork.json) records photo references, asset hashes, sizes and placement. No photo pixels, unrecognizable fine print, source vectors, generators or private intake data are distributed. `artwork:false` removes only printed artwork, leaving the films and every other physical attribute/index/world transform unchanged.

## Agent integration

```js
import { Model, GroveModule, spec }
  from '../../../src/units/accel/index.js';

const unit = new GroveModule({ cableLength: 55 });
host.port('portA').attach(unit); // existing physical host Grove port
host.handle({ type: 'pose', target: 'portA/unitFrame',
  position: [15, 70, -5], rotation: [0.2, -0.1, 0.3] });
host.update(0.016); // update the four physical wire curves after pose changes
const packageAnchor = host.get('portA/sensor'); // passive fixed package position
const detached = host.port('portA').detach({ dispose: false });
// detached.dispose() when its external owner no longer needs it.
```

Exports are `Model`, `GroveModule` and `spec`. The body's only registered components are `grove` and passive `sensor`; a mounted module also has the common `unitFrame` pose and `cable` interfaces. The cable color mapping is Black GND, Red 5V, Yellow SDA and White SCL. Source connector pin-number conventions are not treated as a simulator protocol.

The `sensor` component is an appearance anchor at the reconstructed fixed package placement. It has no acceleration, orientation, gravity, fall, tap, shake, value, register, I2C, power, electrical or firmware commands. External frameworks own those functions and may position their own overlays using the anchor. Whole-unit pose moves the casing and cable endpoints, never feeds a simulated IMU, and never echoes input. Normal attachment/detachment still reports port lifecycle intent. There is no button, LED, display, joint or moving MEMS structure exposed by the model.

## Necessary construction checks

[Local smoke](smoke.json) verifies all 3490 selected original triangles at scale 1, separate CAD/visual envelopes, ten clear mounting axial paths, native and PCB bore FrontSide wall hits, coordinate-welded directed PCB closure with positive signed volume, real 14-land package dimensions and PCB seating, documented component/terminal counts, deep four-contact Grove backing, physical films seated on native surfaces, both entry types' complete artwork physical invariance, internal-command rejection, nested four-core pose/independent peer/detach/disposal and no input echo. These are construction/API checks; no exhaustive browser review, production fit, sensor measurement, electrical, firmware or physical hardware validation is claimed.
