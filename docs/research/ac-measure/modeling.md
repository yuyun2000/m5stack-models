# Unit AC Measure · U164

`modeled`, with visual acceptance deferred. Retrieved 2026-10-26. [Official product](https://docs.m5stack.com/en/unit/AC%20Measure%20Unit), [sources](sources.json), [artwork provenance](artwork.json), [local construction checks](smoke.json).

## Official facts

The own-model drawing gives 56 × 24 × 10.3 mm including the fixed terminal, two front Ø4.85 mounting bores on a 16 mm pitch, and a 56 mm body length. The original assembled shell is 8 mm deep. In model coordinates +X is front-label right, +Y is the terminal end and +Z is front. The two mounting centres are at [−8,−16] and [8,−16] mm. Rear native bores measure Ø5 mm.

Own U164 photographs show an orange fixed four-pole HT3.96 socket, a separate supplied orange four-screw plug, and a burgundy HY2.0-4P Grove socket. The front-view terminal labels read L2, N2, L1, N1; these are documentary physical slot names. The Grove labels are GND / 5V / SDA / SCL. The uncovered PCB and schematic identify STM32G030F6P6, HLW8032, B0505ST16-W5, EL357NB, fuse and shunt packages. The internal red D1 has no confirmed exterior optical path. There is no exposed user button, dial, screen or external current transformer in the own-model references.

The official table calls N1 protective earth and its connector illustration also calls that conductor Ground. This conflicts with the own schematic's AC_N_IN / AC_N_OUT neutral-side path and the product's input/output label names. The contradiction was rechecked and submitted to official review as `f9234766e62f43dc944211d02a674d38`. This model reproduces physical printed names only and does not encode an electrical wiring recommendation.

## Geometry and inference

All 5,592 original triangles of the native front/rear assembled components 2 and 1 are retained, unscaled and unmodified, using one common translation. Displaced duplicate components 0 and 3 are excluded. See the exact commit, blob and transform in [cad-map.json](../../../src/units/ac-measure/cad-map.json).

Additional physical parts include the green notched PCB, open mounting reliefs and central retaining bore, fuse, shunt, converter, MCU, metering IC, optocoupler, regulator, passives, concealed LED and SWD contacts, fixed hex screw, Grove carrier/contacts, orange fixed socket and removable plug. Package positions and dimensions, PCB plane, hidden solder/pin paths and connector internals are reconstructed appearance from the own board photograph and schematic. They are not manufacturing-fit or isolation-clearance geometry. The fixed socket gives the drawing's 10.3 mm depth; its four contacts and upper molding slots have physical depth.

The front and back use their own original outlined labels rasterized as two final PNGs. Original vectors, colours and letterforms are retained; compound-path winding is normalized to recover letter counters. No product-photo crop is used. Separate thin physical adhesive substrates remain when `artwork:false`, and the native shell and PCB remain intact independently of printed textures. Label thickness and registration are inferred. No sticker bridges a mounting bore or connector cavity.

## External use

The exports are `Model`, `GroveModule`, `TerminalPlug` and `spec`. The body has only `grove` and `terminal` ports, with no synthetic sensor anchor, external LED, button or body joint.

```js
import { Model, GroveModule, TerminalPlug } from './src/units/ac-measure/index.js';

const bare = new Model();
const plug = new TerminalPlug();
bare.port('terminal').attach(plug);
bare.handle({ type: 'joint', target: 'terminal/screw-1', angleDeg: 70, durationMs: 180 });
bare.update(0.18);
bare.port('terminal').detach({ dispose: false });
plug.dispose();

// Both Model and GroveModule accept terminalPlug:true.
const unit = new GroveModule({ terminalPlug: true, cableLength: 60 });
host.port('unit').attach(unit);
host.handle({ type: 'joint', target: 'unit/terminal/screw-2', angleDeg: -45, durationMs: 200 });
host.handle({ type: 'pose', target: 'unit/unitFrame', position: [20, 70, 0], rotation: [0, 0, 0.2] });
host.update(0.2);
```

`terminal` accepts `meta.connector:'ht3.96-4p'`. Its plug exposes `screw-1` to `screw-4` in the physical front-view L2 / N2 / L1 / N1 order. An external angle or duration changes only the visible head angle. Nonzero RPM is rejected. The documented [−180,180] viewer range is not a measured thread stop. No axial screw travel, wire clamping, tightening torque or electrical state is inferred. Head movement leaves socket, plug body and tongue frames fixed and does not echo input events.

The default has a bare fixed socket. `terminalPlug:true` installs the supplied accessory; `artwork:false` removes only the two printed layers. `GroveModule` provides the normal two-ended four-conductor cable, and `unitFrame` accepts external pose commands. Normal Port/Module ownership handles attach, detach and disposal. Other frameworks own firmware, I2C, voltage/current/power values, metering, mains, wiring and electrical behavior. No live mains example or electrical simulation is included.

## Evidence boundary

Local checks cover the native triangle count and dimensions, empty axial mounting paths, FrontSide native and PCB bore walls, physical label backing and contact depth, real plug mating bores, four external screw joints and fixed frames, all four Model/GroveModule bare/plug artwork-invariance configurations, nested four-core Grove pose/peer independence, detach and resource disposal. No exhaustive browser inspection, production connector-fit test, hardware behavior or electrical validation was performed. Status remains `modeled`, with no visual acceptance claim.
