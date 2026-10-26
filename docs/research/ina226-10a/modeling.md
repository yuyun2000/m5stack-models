# Unit INA226-10A · U200

Stage: `modeled`; browser and physical acceptance remain unverified. Retrieved 2026-10-26. [Official product](https://docs.m5stack.com/en/unit/Unit_INA226-10A), [sources](sources.json), [artwork](artwork.json), [necessary local checks](smoke.json).

## Exact variant and dimensions

This is U200, the ±10 A version with a 5 mΩ shunt. It is not U200-1A. Model coordinates use millimetres: +X is front-label right, +Y is the orange terminal end and +Z is front.

The product table gives 58 × 24 × 10.2 mm. Its linked U085-named drawing shows a 56 × 24 × 8 mm shell and 10.2 mm socket-inclusive depth. The exact U200 native CAD also measures 24 × 56 × 8 mm. All 5,582 triangles of assembled components 0 and 2 are preserved at scale 1 with one common translation; components 1 and 3 are displaced duplicates. No native triangle was filled, removed, patched or scaled. [CAD map](../../../src/units/ina226-10a/cad-map.json) records commit `784c926812716110e9b76041bfa876514017f81a`, blob `407677da165e92da74916f294e3c7e390418c823`, transform and MIT attribution.

The reconstructed installed fixed socket projects 2 mm beyond the native shell, giving a 24 × 58 × 10.2 mm bare-unit visual envelope consistent with the product table and photographs. This projection and mouth datum are inferred appearance, not a measured connector-fit datum. The supplied plug extends beyond that envelope. Official clarification of the 58 mm inclusion and the linked drawing's applicability was requested and accepted as feedback `692e32ec722240559336c5c6fb24a03f`. The model distinguishes nominal table, native-shell and installed-socket dimensions while awaiting that detail.

The linked drawing gives 16 mm mounting pitch, Ø4.85 front holes and mounting centres 12 mm from the Grove end. The model centres are [−8,−16] and [8,−16]. Native rear bores are Ø5 mm. These remain real openings, including PCB reliefs and a genuine central retaining bore with outward FrontSide walls.

## Physical reconstruction

Own-model photographs confirm the burgundy HY2.0-4P Grove, orange fixed four-pole socket, supplied orange four-screw plug, central rear hex screw and two adhesive device labels. Exact U200 schematic identifies INA226AIDGSR in MSOP10, an isolation SOIC8 footprint, B0505ST16-W5, two XC6228D332VR-G SOT25 regulators, BSMD1206C-2120T fuse, 5 mΩ shunt, ferrite/inductor/passives and internal BLUE0603 D2. The rear original label says CA-IS3020S; the schematic lists CA-IS3020 / ISO1540 / ADuM1250 alternatives, so the physical isolation footprint is represented without asserting a particular production die. The manufacturer's B0505ST16-W5 drawing gives a 7.50 × 10.30 mm body, 2.50 mm height and sixteen physical leads at 1.27 mm pitch; NC leads remain physical leads.

Additional geometry includes the notched PCB, real package leads, shunt metal terminations, fuse body/ends, fixed socket cavities, four recessed contacts/tails, plug contact bores, spring contacts, cages, pressure plates and four cross-recess screw heads. PCB plane/outline, concealed component placement, connector interiors, hidden pin paths and installation are appearance reconstruction. They do not certify manufacturing fit, isolation clearances or electrical construction. Internal D2 has no confirmed exterior optical path in the own-model references; it remains a non-emissive package with no invented light window or LED control.

The plug's four mating bores have surrounding material and FrontSide walls. The profile is 2.9 mm high so the lower bore bevel retains a real wall; a shallow profile that makes the bore tangent to the exterior is not used. The complete bored profile and PCB have coherent directed closed edges. These are local construction checks, not plug qualification.

The two exact U200 outlined labels are rasterized as ordinary high-resolution `source-vector-raster` PNGs, retaining original colours and glyph shapes. Original compound-path winding is normalized to recover letter counters. Separate physical adhesive substrates remain with `artwork:false`; the image does not replace missing shell or PCB. No product-photo pixels, packaging label, other current-range version, private mapping, source vector or conversion script is distributed.

## Agent integration

Public exports are `Model`, `GroveModule`, `TerminalPlug` and `spec`. The body has exactly two components: `grove` and `terminal`. It has no synthetic sensor anchor, button, LED, screen or body joint.

```js
import { Model, GroveModule, TerminalPlug }
  from '../../../src/units/ina226-10a/index.js';

const bare = new Model(); // fixed socket is bare by default
const plug = new TerminalPlug();
bare.port('terminal').attach(plug);
bare.handle({ type: 'joint', target: 'terminal/screw-1',
  angleDeg: 70, durationMs: 180 });
bare.update(0.18); // seconds
bare.handle({ type: 'joint', target: 'terminal/screw-1', angleDeg: 0 });
bare.port('terminal').detach({ dispose: false });
plug.dispose();

const unit = new GroveModule({ terminalPlug: true, cableLength: 60 });
host.port('unit').attach(unit);
host.handle({ type: 'joint', target: 'unit/terminal/screw-2',
  angleDeg: -45, durationMs: 200 });
host.handle({ type: 'pose', target: 'unit/unitFrame',
  position: [20, 70, 0], rotation: [0, 0, 0.2] });
host.handle({ type: 'cable', target: 'unit/cable',
  slack: 18, bend: [0, 0, -1] });
host.update(0.2);
const detached = host.port('unit').detach({ dispose: false });
detached.dispose();
```

`terminal` accepts exact `meta.connector:'ht3.96-4p'`. Its documentary front-view slot names are `IN+`, `IN-`, `OUT-`, `OUT+`, matching the actual INPUT / OUTPUT + − − + print. Grove documentary cable-color names are GND / 5V / SDA / SCL. No wiring or electrical behavior is encoded.

`TerminalPlug` exposes `screw-1` through `screw-4` in that physical front-view order. External `angleDeg` with optional `durationMs` rotates only the corresponding screw head and supports exact neutral reset. Nonzero `rpm` is rejected. The [−180,180] viewer range is not a measured thread stop. There is no screw axial motion, clamp displacement, torque, wire simulation or input echo. The socket, plug frame and mating tongue remain fixed during head movement. Both main exports accept `terminalPlug:true`; `artwork:false` disables only the two print layers.

`GroveModule` supplies two physical Grove plugs and four individually rendered conductors. External pose/cable commands update only those visible structures. Standard Port ownership controls attachment, independent detachment and disposal. External frameworks own current, voltage, power, INA226/register/I2C behavior, fuse/overcurrent response, isolation, power and firmware.

## Verification boundary

[Local smoke](smoke.json) checks native triangle count and separate envelopes; ten open mounting paths; native/PCB FrontSide hole walls; PCB and mating-tongue closed directed edges; physical label/PCB/connector/screw backing; four real contacts at each socket; exact connector mismatch rejection; all four screw joints, interpolation, exact reset, fixed frames and no input echo; all Model/GroveModule bare/plug combinations with invariant physical attributes/index/world matrices under `artwork:false`; nested four-conductor cable pose/cable changes, independent peers, attach/detach and disposal; and rejection of internal measurement/electrical commands. No browser face-by-face review, production mating fit, isolation test, electrical behavior or hardware validation was performed. Status remains `modeled`.
