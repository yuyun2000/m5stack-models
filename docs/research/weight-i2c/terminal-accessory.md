# Weight-I2C U180 removable terminal accessory

Implemented 2026-10-26. The default model keeps the existing empty fixed socket. `new Model({terminalPlug:true})` and `new GroveModule({terminalPlug:true})` install the supplied removable orange four-pole plug. `TerminalPlug` is also exported from the product module.

## Evidence and dimensions

- [Official U180 documentation](https://docs.m5stack.com/en/unit/Unit-Weight%20I2C) lists `1 x HT3.96-4P` in the package contents. The official M5Stack MCP `knowledge_search` result confirmed this again on 2026-10-26.
- [Exact U180 package photograph](https://static-cdn.m5stack.com/resource/docs/products/unit/Unit-Weight%20I2C/img-0634712b-2a27-48cf-894f-d6708a771d47.webp) shows the detached orange accessory with four recessed slotted screws and four round wire entries. Source SHA-256: `d2a64387d3f62c3f2dcd4074a77f516e42504b3da60a0ca2aed332639bb2085c`.
- [Exact U180 terminal photograph](https://static-cdn.m5stack.com/resource/docs/products/unit/Unit-Weight%20I2C/img-d890ef48-fe47-4ae6-bc79-4e920f913e53.webp) shows the fixed socket and its internal pins. The existing fixed geometry is retained.

The plug is a product-specific appearance model. Its visible envelope is approximately 16.3 × 18.8 × 7.0 mm, with a 14.1 mm mating tongue and 3.96 mm pole pitch. Tongue wall dimensions, clamp construction, insertion depth, screw diameter and wire-entry diameter are photograph estimates, not manufacturer tolerances or measured connector dimensions. No accessory CAD or manufacturer cross-section has been confirmed. The clamp cage and spring contacts are representative physical geometry.

The existing U180 socket is offset +1.1 mm in Z relative to the older RS485 assembly. The existing terminal frame stays at `[0,16.04,3.8]`; the plug's four local bore centres at Z −1.4 therefore align with the U180 pins at chassis Z +2.4. Physical left-to-right names stay `A+`, `A−`, `E−`, `E+`, with existing pin numbers `4,3,2,1`. These labels are appearance/interface metadata only.

## External control

```js
import { Model, GroveModule, TerminalPlug } from './src/units/weight-i2c/index.js';

const weight = new Model();
weight.port('terminal').attach(new TerminalPlug());
weight.handle({ type:'joint', target:'terminal/screw-1', angleDeg:65 });
const plug = weight.port('terminal').detach({ dispose:false });
weight.port('terminal').attach(plug);

// With a GroveModule attached to a host port named "unit":
host.handle({ type:'joint', target:'unit/terminal/screw-4', angleDeg:-40 });
host.handle({ type:'detach', target:'unit/terminal' });
```

`screw-1` through `screw-4` follow physical left-to-right order. Their `VisualJoint`s accept an externally supplied visible head angle, with a suggested viewer range of −180° to +180°. The real tightening range and thread pitch are unknown. RPM commands are rejected. Rotating a head leaves the fixed socket, tongue, clamps and pressure plates stationary; it does not simulate tightening, axial movement, wiring, bridge excitation, calibration, sensor values or I2C. Detaching only `unit/terminal` keeps the Unit and its physical Grove cable attached.

## Limited construction check

The local check covers real pin-entry, round wire-entry and screw-tool bores; `FrontSide` inner walls; finite coordinates and closed mesh edges; unchanged native shell bytes and fixed-socket geometry; four independently driven screw heads; neutral return; standalone attach/detach; constructor installation; and nested Grove attachment with selective plug detach. A finite sample/grid clearance check compares the added geometry against the actual fixed assembly and its metal/plastic pairs. Results and source/runtime fingerprints are in `terminal-smoke.json`.

These checks establish local geometry and interface behavior. They do not establish manufacturing fit, exhaustive collision freedom, physical clamp construction or browser visual acceptance. Per the current user priority, no browser review or full-suite verification was run for this accessory.


Printed appearance update (2026-10-26): reference-redrawn PNG labels are included; `artwork:false` disables them while preserving all original physical geometry and controls. Sources, registered surfaces and bounded evidence: [artwork.md](artwork.md), [sticker-smoke.json](sticker-smoke.json).
