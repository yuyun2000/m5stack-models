# Unit 8Angle U154

This model represents the original U154, using the [official product documentation](https://docs.m5stack.com/en/unit/8Angle), [mechanical drawing](https://static-cdn.m5stack.com/resource/docs/products/unit/8Angle/img-4b39398e-5590-43b9-8dfe-84eb4aec5312.png), [annotated product photograph](https://static-cdn.m5stack.com/resource/docs/products/unit/8Angle/img-b698604d-29dd-4506-b662-4752e1f03a28.webp) and [schematic](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/608/SCH_UNIT_8Angle_V1.01.pdf). Official M5Stack MCP `knowledge_search` returned these sources on 2026-10-26. A schematic V1.01 filename does not establish a separate product revision.

Coordinates are millimetres: +X right, +Y toward the slide switch, +Z toward the knob faces. The complete envelope is 24 × 128 × 23 mm. The drawing specifies Ø10 mm knobs at 13 mm pitch, first knob 23.4 mm from the Grove end, and mounting axes 16 mm apart and 12 mm from that end. The nominal perimeter shell is 8 mm thick; the raised front platform produces a 10 mm native shell envelope.

## Shell and physical assembly

The [fixed official CAD source](https://github.com/m5stack/M5_Hardware/blob/e29c139cbc7c80b5ccc5557e5ab8025a7a19a109/Products/U154_Unit_8Angle/Structures/Unit_8Angle.stl) contains an assembled front/back pair and two displaced duplicates. The model preserves components 1 and 2, with 7,548 and 3,960 triangles, and omits only the displaced copies. `src/units/8angle/cad-map.json` records the exact normalization, source Git blob and SHA-256. The U154 and U153 structure paths contain the same official Git blob; the caps and motion in this model follow U154's own drawing and photographs. The native mounting bores, shell seam, snaps, eight shaft apertures, nine light slits, switch aperture and rear service opening remain intact.

The model adds a 0.8 mm solid PCB with mounting-pillar, central screw-boss and Grove relief, eight stationary potentiometer packages and annular bushings, eight moving shafts with bored molded caps and cyan inserts, nine recessed light pipes, a two-position physical slide switch, a rear screw and an open-top red Grove socket with walls, recessed support and contacts. The real PCB is visible through the native rear service opening. There is no photographic plane or thin cover hiding a missing assembly.

The PCB outline, concealed packages, shaft/bore details, cap grip profile, connector wall dimensions and 2.2 mm switch detent separation are appearance estimates, not fabrication dimensions or physical-fit validation. Labels and rear/front printed surfaces are deferred. Small concealed components and the SWD connector remain simplified.

## Externally driven motion API

The official annotated U154 photograph explicitly marks 280° rotary travel. Each of `rotation-1` through `rotation-8` is therefore a finite `VisualJoint` with `limitsDeg: [-140, 140]` and `continuous: false`. Zero is a visual middle position, not a calibrated mechanical or ADC zero. A command outside the range or a nonzero RPM command throws. U154's potentiometers are rotary controls; no push-button action is invented.

```js
import {Model, GroveModule} from './src/units/8angle/index.js';

const unit = new Model();
unit.handle({target: 'rotation-1', type: 'joint', angleDeg: 90, durationMs: 300});
unit.handle({target: 'switch', action: 'position', position: 1});
unit.handle({target: 'rgb-1', type: 'led', color: '#00b8d8', brightness: 0.6});
// Tick unit.update(dt, time), or let DeviceViewer drive the frame updates.

const connected = host.port('grove').attach(new GroveModule({cableLength: 85}));
host.handle({target: 'grove/rotation-8', type: 'joint', angleDeg: -120});
connected.get('unitFrame').setPose({position: [16, 95, -7], rotation: [.25, .1, -.45]});
host.port('grove').detach();
```

The `switch` uses the shared latching `Button`: pointer or keyboard press toggles the stable visual detent and release leaves it there. `Space` maps to the switch for standalone use. `rgb-1` through `rgb-8` identify the physical channel locations; `rgb-9` is the switch light. These are physical positions, not a claim about schematic U1–U9 serial order. They respond only to external LED commands. The Grove frame records the official black/red/yellow/white mapping GND/5V/SDA/SCL. The library provides no ADC or resistance values, I2C, register model, firmware, electrical behavior, automatic LED response or hardware physics.

## Limited construction check

`geometry-check.json` records finite geometry, the complete envelope, native mounting clearances, the FrontSide PCB screw-clearance wall, real PCB/Grove backing, nine recessed light pipes, eight independent limited rotary joints, stationary fixed assemblies, stable switch, external RGB, module attach/pose/cable/detach and owned-geometry disposal. This is a small local smoke check. Browser inspection and exhaustive review were intentionally deferred following the user's request to prioritize additional Units. Stage remains `modeled`.
