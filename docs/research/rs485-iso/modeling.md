# Unit RS485-ISO U094

Stage: `modeled`; browser/physical acceptance remains unverified. Model frame: millimetres, +X front-label right, +Y bus-terminal end, +Z front.

## Official facts

- Own U094 official product and MCP report 56 × 24 × 10.2 mm, CA-IS3082W isolated half-duplex transceiver, isolated DC-DC, one VH3.96-4P plug and a separate 120 Ω resistor.
- Own U094 structure path was resolved through its most recent path-specific commit `a9ac25ce7325a37b03b3f4457a6f45caf3b058dc`. Downloaded Git blob `0eb07f39b2b571c6fbd37703f2bd778108dda048` and SHA-256 are recorded in [cad-map](../../../src/units/rs485-iso/cad-map.json). Both full assembled shells (components 0 and 2, 5630 triangles) remain at scale 1 with a common translation. Components 1 and 3 are displaced duplicate shells.
- The official U094 STL is byte-identical to U085 CAN's shell. Own U094 electronics, port names, stickers and Grove color are reconstructed from U094 sources. The untitled linked `U085_Model_Size.jpg` is treated as shared-shell corroboration; it is not claimed to be an independently identified U094 drawing. The shared shell measures Ø4.85 mounting bores at 16 mm pitch, 12 mm from the Grove end.
- Own v1.1 schematic shows U1 CA-IS3082W, M1 B0505ST16-W5, U2 MST5333, a physical LED1 marked only `SMT_LED`, and JP1 4=B / 3=A / 2=NC / 1=SHIELD. Front-view terminal slots read B / A / crossed NC / G. `G` identifies SHIELD and must not be relabeled as host ground or a 12 V power pole. Grove documentary labels are GND / 5V / UART_RX / UART_TX in cable-color order.
- Own board photos show a toroidal red winding, power-module rear base, wide isolated IC, small protection packages, a blue Grove, the indicator package and narrow shell slot. Own package photograph shows the loose four-screw plug and the 120 Ω resistor.

## Reconstructed appearance and motion

PCB outline, plane, concealed population, toroid winding detail, socket/plug mating depth, screw head profile and light-guide depth are appearance estimates. Native shell triangles are not cut, filled or removed. Real front/rear adhesive substrate meshes back label recesses, and the complete PCB/packages back deeper shell cavities; these remain when artwork is disabled. Mounting bores and connector/latch apertures retain real FrontSide cavity walls.

The body exposes ports `grove` and `terminal` and one `power-led`. It has no sensor anchor, button or own joint. `power-led` defaults off and accepts external on/brightness commands. Emitted color is unconfirmed; its fixed neutral-white preview is marked `meta.colorConfirmed:false` and does not establish white/RGB hardware capability. Cable attachment and elapsed time never turn it on or simulate traffic/power.

`TerminalPlug` is a product-local Module with `meta.connector:'vh3.96-4p'`, four visible screw-head joints `screw-1`…`screw-4`, and true mating/wire-entry chambers. Screw angle and optional duration change only the visible head angle. Nonzero RPM is rejected. No thread advance, clamping, wire connection, tightening torque or electrical continuity is implemented.

`terminalPlug:true` attaches the supplied plug. `terminator:true` requires `terminalPlug:true` and adds a physical resistor plus two metal leads entering the **same plug's B/A slots**. The 120 Ω value is a product fact; body dimensions, band appearance and bent lead installation pose are inferred. The package documents a loose part; this model does not claim factory-installed posture, approved tolerances or a circuit/termination behavior. Resistor and leads remain with the plug through independent detach/reattach. No extra connector is invented.

## Agent integration

```js
import { GroveModule as RS485ISO, TerminalPlug }
  from '../../../src/units/rs485-iso/index.js';

host.port('portC').attach(new RS485ISO({
  cableLength: 70, terminalPlug: true, terminator: true,
}));
host.handle({ type: 'joint', target: 'portC/terminal/screw-1',
  angleDeg: 90, durationMs: 200 });
host.handle({ type: 'led', target: 'portC/power-led', brightness: 0.5 });
host.handle({ type: 'pose', target: 'portC/unitFrame',
  position: [15, 75, -5], rotation: [0.2, -0.1, 0.3] });
host.update(0.1); // seconds; interpolation and four real Grove wire poses

const plug = host.port('portC').module.port('terminal').detach({ dispose: false });
// plug still owns its resistor and four screw-head joints.
host.port('portC').module.port('terminal').attach(plug);
// For manual construction: new TerminalPlug({ terminator: true }).
```

Model options/configurations are socket `{}`, plug `{terminalPlug:true}`, and terminated `{terminalPlug:true,terminator:true}`. Read `getState()` on individual Led/joint components; externally driven appearance writes do not echo user input. The four-core Grove assembly supports nested paths, Unit pose changes and independent attachment/disposal through the existing core API.

## Artwork and verification

Two final ordinary PNGs are authorized own-photo `reference-redraw`, not product-photo crops. Readable original marks are newly drawn; unconfirmed tiny print is omitted. [Artwork provenance](artwork.json) identifies exact source photos, placement and PNG SHA-256. Private table, original vectors, mappings, generators and intermediates remain outside the public tree.

[Local smoke](smoke.json) covers full own shell triangles/envelope, empty mounting paths, native/PCB/mating FrontSide bore walls, cavity backing, independent externally driven LED and screw motion, resistor ownership/B-A endpoints, no-RPM/no-input-echo, all six Model/GroveModule artwork configurations using full geometry attributes/index/world transforms, nested four-wire pose/peer independence/selective detach and resource disposal. No full historical suite or exhaustive browser review was run. Production fit, physical hardware, UART/RS485 frames, transceiver direction, isolation, voltage/current/resistance, firmware, protection and cable electrical behavior are outside this model.

Official missing drawing attribution and LED-color evidence were reported with feedback ID `fc852dfeccab40d882873afc3066dfee`. This does not assert that shared-shell dimensions are incorrect.
