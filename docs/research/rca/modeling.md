# Unit RCA U155

Stage: `modeled`; full browser/reference and hardware visual acceptance remain deferred. This model implements the assembled object's physical shape, a real internal selector's retained travel, attachment frames and input intent. External frameworks implement signals and audio/video behavior.

## Official facts

- [Product](https://docs.m5stack.com/en/unit/RCA): one RCA female socket, internal two-channel selection, HY2.0-4P Grove and two LEGO compatible mounting holes. Package includes the Unit and a 20 cm Grove cable; no RCA plug or A/V cable is listed.
- [Own schematic](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/609/SCH_UNIT_RCA.pdf): S1 is one SW-PWR SPDT selector feeding one P4 `Yellow` `SIG` terminal, with three ground/shield terminals; three passive elements are shown. No MCU, active IC, LED, display, motor or separate sensor appears.
- [Own dimension drawing](https://static-cdn.m5stack.com/resource/docs/products/unit/RCA/img-35ebdaa2-f972-46ac-b132-8cbf2438c5d7.png) distinguishes the 32 × 24 × 8 mm shell from 36.4 mm total length including the RCA and 14.7 mm overall side thickness. Model axes are width X, length Y, front Z. The vendor table's 36.4 × 24 × 8 mm is retained as `nominalMm: [24,36.4,8]`; `visualEnvelopeMm` is separately `[24,36.4,14.7]`.
- [Own bare-board photograph](https://static-cdn.m5stack.com/resource/docs/products/unit/RCA/img-366b7aa4-2cef-4656-9ef6-c84cb29a3d96.webp) confirms one horizontal retained slide and readable `I1` / `I2` silk. The assembled rear label explicitly says `SWITCH INSIDE`; no fabricated exterior opening is added.
- The pinned MIT CAD at commit `53d59bf42f8a5eba12e0003ef71d429d585ce43e` has blob `9ec405a4b6353ebad3f1423c90838e44873c2dce`. All 3,216 triangles of native assembled component 0 are retained at scale 1. Displaced duplicate covers 1 and 2 are excluded. A proper 180 degree Y rotation puts the original component-side opening at +Z and the solid label face at -Z; no reflection, patch or triangle removal occurs.

## Public API

```js
import { Model, GroveModule } from './src/units/rca/index.js';
const unit = new Model();                  // Complete closed assembled shell
const inspection = new Model({ covers: false }); // Covers hidden, not removed
inspection.root;
inspection.get('channel').press('operator');
inspection.update(0.1);                    // Interpolate real horizontal thumb
inspection.get('channel').release('operator'); // Retains the selected detent
inspection.handle({ type: 'position', target: 'channel', position: 1, immediate: true });
inspection.get('channel').getState();      // { pressed:false, position:1, latching:true }
inspection.on('input', event => { /* input intent only */ });

// The host port must have connector:'grove'. Both plugs and all four wires render.
host.port('grove').attach(new GroveModule({ covers: false, cableLength: 180 }));
host.handle({ type: 'pose', target: 'grove/unitFrame', position: [20,80,0], rotation: [0,0,0] });
host.handle({ type: 'position', target: 'grove/channel', position: 0, immediate: true });
host.port('grove').detach();
```

- `channel` is a stable `Button`, with `axis:[1,0,0]` and estimated 1.7 mm throw. `press` changes the visible detent, `release` retains it, and `cancel` emits cancelled release without click. Position 0 and 1 are **visual detents**, without asserted IO mapping. External `setPosition` / `position` never echoes input events or changes signal routing.
- Default closed shell sets `channel.interactive=false` and removes the thumb's hit tags. `covers:false` exposes the actual internal component and enables pointer down/up/cancel. Programmatic external visual position works in either configuration.
- `grove`: four-contact HY2.0-4P, bottom outward -Y; physical attachment only. The same-model printed labels are `GND`, `5V`, `IN1`, `IN2`. Label names do not establish unproven IO1/IO2-to-AIN name equivalence.
- `rca`: one `connector:'rca-female'` Port, at `[0,20.4,5.95]`, outward +Y, with `SIG` and `GND` documentation. It rejects Grove modules. No supplied RCA plug/cable is fabricated; external adapters may provide their own compatible Module whose `meta.connector` equals `rca-female`.
- No LED, joint, sensor, sound, waveform, video framebuffer, stereo mixer, GPIO, electrical simulation or automatic selector coupling exists.
- `{ artwork:false }` removes only two final ordinary PNG labels; all physical surfaces, attributes, indices and transforms remain identical for every Model/GroveModule cover configuration.

## Reconstructed appearance and limits

The original shell closes around a separately reconstructed green PCB, three passive packages, internal slide case/three solder terminals, retaining screw, four-contact black Grove and metal RCA bracket/contact assembly. The RCA has genuine open outer barrel, yellow annular dielectric and female centre contact bores; a deeply recessed physical dielectric base closes the real connector depth. Stickers never close a missing assembly part.

PCB silhouette/installed plane, passive dimensions, hidden selector installation/throw, socket bracket/insulator/spring shape, contacts and print registration are photo-based estimates. The 14.7 mm assembled thickness and 36.4 mm length follow the official drawing, but local connector geometry is not a production mating or tolerance specification.

Two final `reference-redraw` PNGs reproduce only legible same-model rear label and PCB `I1` / `I2`. Typography, color and physical registration are reconstructed. Photographs are reference material only; no photo crop, private spreadsheet, private mapping, original vector, generator or intermediate is distributed.

Official wording `RCA stereo output` is ambiguous against one SIG/SPDT socket, and the table's 8 mm thickness omits the assembled projection shown as 14.7 mm. Reasonable MCP/schema/photo recheck completed and feedback was accepted as `d23253c3c0f3488895e6aef0bd1ca5d3`; this model makes no audio/video compatibility claim.

## Necessary construction evidence

[smoke.json](smoke.json) records retained native triangle count/envelope, real PCB/Grove/deep RCA backing closure, empty mounting axes and FrontSide native/PCB/RCA bore walls, closed/open pointer boundary, press/release/cancel, retained visual position without input echo, all four Model/GroveModule cover/artwork configurations with every physical attribute/index/matrixWorld unchanged, nested four-wire/two-plug Grove pose independence, detach and resource disposal. This does not claim browser, hardware, production-fit, signal or electrical validation.
