# Unit Mini CAN U179

Stage: `modeled`; browser/physical acceptance remains unverified. Millimetres: +X front-label right, +Y orange HT3.96 terminal end, +Z front label.

## Official facts and native shell

Own U179 product page and dimension drawing specify 32 × 24 × 10.2 mm (normalized viewer axes 24 × 32 × 10.2), 16 mm mounting pitch, 12 mm from the Grove end and Ø5 mounting holes. The 10.2 mm depth includes the proud orange terminal socket. The complete native shell is 24 × 32 × 8 mm and remains unscaled; it is not flattened or stretched to fit that total depth. The supplied removable plug is an accessory extending beyond the bare-unit envelope.

The exact own structure path `Products/U179_Unit_Mini_CAN/Structures/Unit_Mini_CAN.stl` was fetched at its latest path-specific commit `b4d8875bd504fed30242df78a1370703742941fb`. Bytes match Git blob `3827ed04a34a72fd0a6db23c69faae09ee08fcd6`. Component 0 is the full 3286-triangle assembled front/rear shell; 1/2 are displaced duplicate half-shells. One shared rigid 180° Y rotation and translation puts the front terminal opening at +Z and the native rear label panel/M5 emboss at -Z. Every selected native triangle remains, with no cuts, patches or rearrangement. [CAD map](../../../src/units/mini-can/cad-map.json) records source, transform, hashes and MIT attribution.

Own U179 schematic documents U3 TJA1051T/3, U1 ME3116 buck, U2 MST5333, L1 36.8 µH/3012, protection/passives, Grove and JP1. The official comparison explicitly calls Mini CAN **non-isolated**; no isolated DC/DC module, isolated transceiver, MCU or sensor state is added. The linked NXP TJA1051 Rev 9 data sheet, Table 2, confirms TJA1051T/3 uses 8-lead SO8/SOT96-1 with 3.9 mm body width. The model includes a 3.9 × 4.9 mm SO8 body and eight separate leads. Concealed package installation and PCB population are appearance reconstruction rather than PCB layout data.

Front terminal print reads H / L / HV / G from left to right, corresponding to schematic JP1 4/3/2/1 = CAN_H/CAN_L/HPWR+/GND. White Grove cable-color order is GND / 5V / CAN_TX / CAN_RX. These labels document the connector; the model does not execute CAN or power conversion.

## Physical appearance and motion

The model includes the full native shell, a shaped PCB with mounting reliefs and retaining bore, SO8 transceiver, six-lead buck and three-lead regulator, 3012 inductor, protection/passive packages, concealed White LED1, fixed rear retaining screw, four-contact white Grove cavity/carrier/latch, and orange fixed HT3.96-4P socket. The socket has real contact pins and tails, side/rear walls, four scalloped insulating channels and four top slots. Physical front die-cut and rear adhesive films remain independently of `artwork:false`.

The exact-model package photograph shows the supplied orange four-pole screw terminal. `TerminalPlug` models its open mating bores, four springs, partitions, real round wire entries, clamp cages/plates and recessed cross-head screws. Each screw is an external visual joint, `screw-1` through `screw-4`, supporting `angleDeg` and `durationMs`. A ±180° viewer range is metadata, not a confirmed tightening limit. There is no axial thread/clamp displacement or nonzero RPM. Bare socket and plug configurations are both available. The bored mating profile is 2.9 mm high so every bevel retains a real lower bore wall; the shallow 2.5 mm candidate with a tangent lower mouth is not used. Connector insertion depth, concealed details, screw installation and plug dimensions are appearance estimates, not manufacturing-fit tolerances.

LED1 is documented White in the own schematic. Same-model exterior photographs and native shell do not establish an exposed LED aperture or light guide. A non-emissive concealed LED1 package is included, with no public LED component, fabricated window, glow or automatic power response.

## Agent integration

```js
import { GroveModule as MiniCAN, TerminalPlug }
  from '../../../src/units/mini-can/index.js';

host.port('portC').attach(new MiniCAN({ cableLength: 55, terminalPlug: true }));
host.handle({ type: 'joint', target: 'portC/terminal/screw-1',
  angleDeg: 90, durationMs: 180 });
host.handle({ type: 'pose', target: 'portC/unitFrame',
  position: [15, 75, -5], rotation: [0.2, -0.1, 0.3] });
host.update(0.18); // seconds for visual interpolation and four-core cable pose

const unit = host.port('portC').module;
const plug = unit.port('terminal').detach({ dispose: false });
unit.port('terminal').attach(plug); // exact connector type ht3.96-4p
// A bare unit also accepts unit.port('terminal').attach(new TerminalPlug()).
```

Exports are `Model`, `GroveModule`, `TerminalPlug` and `spec`. Body component IDs are only `grove` and `terminal`; the plug owns four screw joints. No button, body joint, sensor anchor, display or LED API exists. External appearance commands do not echo input; port attach/detach reports normal lifecycle intent. CAN messages, transceiver logic, electrical behavior, voltage conversion, circuit protection, power state, firmware and hardware physics belong to the external runtime.

## Artwork and necessary verification

Two final ordinary PNGs are exact-model `reference-redraw`, newly drawn from the readable own U179 front/back product photographs. [Artwork provenance](artwork.json) records their sources, placement and hashes. Original vector sources, private tables/mappings, raw photos and generators remain outside the distribution.

[Local smoke](smoke.json) covers all 3286 native triangles and separate CAD/visual envelopes; ten empty mounting paths; native, PCB and plug-mating FrontSide walls; PCB and plug-tongue closed directed edges and positive signed volumes; physical backing for labels/Grove/socket/screw; exact connector rejection; four-head external angle/duration/exact return/no-RPM/no-echo; all four bare/plug × Model/GroveModule physical attribute/index/world-transform artwork invariants; and nested four-core cable pose, independent peer detach and resource disposal. It is construction evidence, not full browser, physical fit, electrical, CAN or hardware acceptance. No exhaustive browser or historical suite was run.
