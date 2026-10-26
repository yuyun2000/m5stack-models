# Unit AIN4-20mA · U162

`modeled`, without browser acceptance. Retrieved 2026-10-26. [Official product](https://docs.m5stack.com/en/unit/AIN4-20mA%20Unit), [sources](sources.json), [artwork](artwork.json), [necessary construction checks](smoke.json).

## Official facts

U162 is one 4–20 mA input channel. The product drawing gives 56 × 24 × 11.3 mm, an 8 mm shell, two Ø4.85 nominal mounting holes 16 mm apart, and the mounting line 12 mm from the Grove end. The fixed orange field socket has an included removable HT3.96-4P screw plug. Front-view terminal order is IN− / IN+ / GND / 24V; schematic P1 numbering is 4 / 3 / 2 / 1 in that order. The package includes three jumper caps and a HY2.0-4P Grove cable.

The own-model schematic names STM32G030F6P6, one HCNR200 isolation package, two SGM321 amplifier packages, HX6306 regulation, five J2 SWD contacts, four P2 header pins and two P3 header pins. All six P2/P3 pins are exposed through the original stepped front aperture. The five real adjacent pairs are P2.1–P2.2, P2.3–P2.4, P3.1–P3.2, P2.2–P3.1 and P2.3–P3.2. Official photographs and the printed instructions show three horizontal or two vertical jumper caps. Neither the schematic nor exterior photographs establish an exposed user button, LED window or rotary shaft, so none is invented.

## Geometry and inference

The complete native assembled front/rear STL components 1 and 2 contribute 5,688 unchanged triangles, with a common translation `[12,28,0.4]` and scale 1. Components 0 and 3 are displaced presentation duplicates. The complete shell measures about 24 × 56 × 8 mm. +X is front-label right, +Y field-terminal end, +Z front-label side. Exact commit/blob and extraction selection are in [cad-map.json](../../../src/units/ain4-20ma/cad-map.json). Native bores and apertures remain in the source geometry.

Additional physical geometry includes the notched PCB and its real mounting reliefs/retaining bore; MCU, isolator, two amplifiers, regulator, transistor, passives and SWD pads; open Grove cavity with four contacts; open fixed field socket; actual six gold header pins; two separately modeled physical adhesive films; and the rear retaining screw. These continue to exist with `artwork:false`. Labels are separate printed surfaces attached to the film, with the PCB and native supporting rails retained underneath. Artwork does not substitute for missing connector, PCB or shell geometry.

PCB outline/plane, concealed package placement, pin solder detail, Grove construction, terminal seating, insertion profiles, screw dimensions, 2.54 mm header pitch, header placement, jumper shape and adhesive thickness/registration are reconstructed appearance. The official shell drawing does not dimension those installed interfaces. The cap pin bores and socket are real empty geometry, but exact hidden seating, clearance and manufacturing fit remain unconfirmed. No additional hole was cut into the native shell. The removable plug lies beyond the bare-unit nominal envelope. `covers:false` hides native shell meshes and physical films for package inspection while preserving the source data and real fixed component locations.

## API for external frameworks

Exports are `Model`, `GroveModule`, `TerminalPlug`, `Shunt` and `spec`. The body has only physical ports, with no synthetic button, LED, sensor anchor or body joint. `grove` carries documentary GND / 5V / SDA / SCL labels. `terminal` accepts `meta.connector:'ht3.96-4p'`. `terminalPlug:true` attaches the supplied plug; otherwise the fixed socket is bare. The plug exposes `screw-1` … `screw-4` in front-view IN− / IN+ / GND / 24V order. Angle/duration rotate the visible head only; nonzero RPM is rejected. There is no thread travel, clamp force, wire tightening or electrical state.

Every jumper position accepts a separately owned `new Shunt()` with `meta.connector:'pin-header-2.54-2p'`:

| Port ID | Physical pins |
| --- | --- |
| `jumper-p2-12` | P2.1, P2.2 |
| `jumper-p2-34` | P2.3, P2.4 |
| `jumper-p3-12` | P3.1, P3.2 |
| `jumper-p2-2-p3-1` | P2.2, P3.1 |
| `jumper-p2-3-p3-2` | P2.3, P3.2 |

The pin reservation set is `port.meta.physicalPins` and `port.physicalPins`. Attaching a cap to a pair sharing a physical pin with an existing cap throws before replacing either attachment. This prevents two solid caps occupying the same pin; it is appearance ownership, with no conductivity or sensor-power calculation. Each cap has two real blind mating bores, recessed contacts and an internal bridge.

`jumpers:'three-horizontal'` is the default: the first three table positions are occupied. `jumpers:'two-vertical'` uses the final two positions; the third packaged cap is not installed. `jumpers:false` exposes all six pins. Names describe shape and position, without implementing power selection. Caps detach independently through the standard Port lifecycle. Remove interfering caps before installing a different physical pattern.

```js
import { Model, GroveModule, TerminalPlug, Shunt } from './src/units/ain4-20ma/index.js';
const unit = new Model({ terminalPlug: true });
unit.handle({ type: 'joint', target: 'terminal/screw-1', angleDeg: 75, durationMs: 180 });
unit.update(0.18);
const cap = unit.port('jumper-p2-12').detach({ dispose: false });
// P2.3 is still occupied: detach the second horizontal cap before using it.
unit.port('jumper-p2-34').detach();
unit.port('jumper-p3-12').detach();
unit.port('jumper-p2-2-p3-1').attach(cap);
unit.port('jumper-p2-3-p3-2').attach(new Shunt());

const module = new GroveModule({ terminalPlug: true, jumpers: 'two-vertical', cableLength: 60 });
host.port('unit').attach(module);
host.handle({ type: 'pose', target: 'unit/unitFrame', position: [20, 60, 0], rotation: [0, 0, 0.2] });
host.handle({ type: 'joint', target: 'unit/terminal/screw-2', angleDeg: -45, durationMs: 200 });
host.update(0.2);
```

`GroveModule` renders a two-ended four-conductor cable. Moving `unitFrame` updates its shape, while plug and caps retain their nested attachment frames. External m5agent/m5stack-esp-emulator integrations own current values, 2-/4-wire sensor behavior, supply selection, I2C/ADC, calibration, isolation behavior, firmware and all electrical logic. External screw motion does not emit input intent; attach/detach uses normal port lifecycle events.

## Artwork and evidence boundary

No exact Unit original was adopted. Two final ordinary PNGs were newly code-drawn from readable U162 front/back official marks, including pin colors, model, jumper diagrams, isolation flow and port labels. They are `reference-redraw`; no photograph is cropped. Typography, line weights, icon layout, colors and print placement remain reconstruction. Private mappings, source files, vectors, generators and intermediates are excluded.

Necessary local checks cover all 5,688 native triangles and bounds, open mounting/PCB bores with FrontSide wall hits, physical label/PCB/connector backing, six exposed header pins, all five independently detachable shunt positions and blind-bore FrontSide walls, shared-pin rejection preserving old caps, detachable four-screw plug, 48 Model/GroveModule artwork/cover/accessory combinations with full geometry attributes/index/world matrices invariant, and nested Grove pose/independent detach/disposal. No browser face-by-face acceptance, hardware behavior, power-mode/electrical test or manufacturing-fit claim is made. Stage remains `modeled` and visual evidence remains null.
