# Unit ZigBee U110

Stage: `modeled`; browser visual and physical acceptance remain unverified. Millimetres: +X right, +Y SMA, +Z front logo. This is the exact Grove **Unit U110**, not a COMX/M5-Bus ZigBee Module.

## Own sources and dimensions

The official product table specifies **71.5 × 24 × 8 mm** in length/width/thickness order. Own structure `Products/U110_Unit_ZigBee/Structures/Unit_ZigBee.stl` was retrieved at file-specific commit `c6bf30a9848f1a8b4e4dd7537cceec5b147cafb3`, verified against Git blob `cd451d15e2d03f37e80e7db05bf7f82fa56a78ba` and source-byte SHA-256 in the [CAD map](../../../src/units/zigbee/cad-map.json). Component 0 is the complete **6592-triangle**, **24 × 64 × 8 mm** assembled shell. Components 1/2 are displaced duplicate shell halves. One common translation `[0,32,-4]` centers the complete selected assembly at scale 1; no original triangle is removed, filled, patched, stretched or independently repositioned.

The casing alone remains 64 mm long. The model places the visible SMA mating face 7.5 mm beyond the shell to reproduce the published **24 × 71.5 × 8 mm** Unit envelope. This body/SMA split is an inferred installation consistent with the photograph and nominal total length, not a production dimension drawing. The supplied antenna is excluded from the Unit dimensions. Its straight envelope is **estimated 100 mm**, explicitly inferred from the same-model photos, not a published antenna length. Native Ø4.85 mm through-bores, enlarged end reliefs, 16 mm mounting pitch, three rear retaining recesses, end openings and M5 emboss remain intact.

## Complete assembled appearance

A shaped carrier PCB includes real mounting-boss reliefs, central retention through-bore and Grove notch. It carries the DRF1609H radio module, SPX3819M5-L-3-3 five-terminal regulator, six capacitors, two resistors and the schematic's physical S1 KEY switch and D1 green 0603 LED packages. The exact official-linked DRF module guide pages 19–21 identify CC2630F128, ten module pins, a **32 × 16 mm** module PCB and **2.54 mm** pad spacing. The model has that actual PCB envelope, ten true half-circle edge castellations and separate plated lands. The fixed opaque radio shield is a concealed module envelope; its exact shield/PCB/population installation remains inferred. The M5Stack board schematic does not expand the module's internal silicon, crystal or RF front end, so hidden CC2630 package details are not invented as exposed parts.

The blue HY2.0-4P Grove has side walls, guides, latch shoulders/bridge, deep dielectric carrier, four separate metal contacts and solder tails. Its actual recessed mouth remains open. Black GND, Red 5V, Yellow UART_RX and White UART_TX document the official color map. There is no UART transaction or electrical behavior.

The top metal SMA has an annular barrel, external helical thread, recessed PTFE, genuine hollow centre contact with deep backing, rear feed-through and concealed coax termination envelope. The photo's externally threaded socket is reconstructed as a female SMA accepting the matching male accessory through the existing `sma-female` visual family. Contact/thread dimensions, exact connector part and production mating remain inferred. The hidden miniature board termination is not asserted to be a particular U.FL/IPEX model.

The native front/back fine slots near the SMA reveal a physical gold hex body recessed about 0.87 mm below the shell face. The same rigid connector body backs both original openings. Its installation is an appearance reconstruction matching the gold material in own photos and the source geometry; exact production assembly was requested from the official source. The slots are neither pasted over nor converted into a luminous window or movable control.

Although the schematic includes S1 KEY and D1 green LED, own exterior photos do not establish an accessible actuator or confirmed optical path. Both physical packages are included internally and remain fixed/nonemissive. No external button/LED API is registered. This prevents an ambiguous gold opening from acquiring invented behavior. Official accepted feedback `d2b33b1826c44698be8ec73d5fd89789` requests their exact production location/accessibility and the body/SMA dimension split; [source provenance](sources.json) records this missing documentation without claiming the schematic or total length is wrong.

Three real retaining screw faces/shanks and two physical adhesive films complete the assembly. Both films touch the original closed label recesses and remain when artwork is disabled. The two **1600 × 3600** ordinary PNGs reproduce readable exact U110 artwork from its own photos; they contain no photographic pixels or COMX/other-model print. [Artwork provenance](artwork.json) records asset hashes, source URLs, placements and reconstruction limits. Raw photos, vector originals, generators, private intake and intermediate assets remain outside the repository.

## Supplied antenna motion and attachment

Own `zigbee_01.webp` shows the supplied antenna straight; own `zigbee_03.webp` packaging shows its actual right-angle folded form. Its model therefore has a real hinge fork/axle and moving knuckle/radome, a fixed open coupling nut, real centre pin/dielectric, neck, tapered closed rod and molded seams. `Antenna` exposes one external **`tilt`** joint over **0–90 degrees** around local X at `[0,13,0]` in the SMA port frame. This interval is an appearance reconstruction supported by those two reference poses; it is not measured mechanical stops. The estimated 100 mm antenna length, hinge-axis installation, rod curves and connector/neck dimensions are inferred. There is no SMA unscrewing, arbitrary axial spin, automatic sweep, RF glow, radio physics or network behavior.

The default Unit has no antenna installed, matching its quoted body/SMA envelope. Set `antenna:true` for the supplied accessory; `antennaAngleDeg` sets its initial 0–90 degree pose. Its mating family follows the existing Port contract: the host `sma` port and accessory `meta.connector` both use `sma-female`; accessory `meta.physicalConnector` documents the visible male plug. It may be independently detached and reattached without moving the Grove branch or other Units.

## Agent integration

```js
import { Model, GroveModule, Antenna, spec }
  from '../../../src/units/zigbee/index.js';

const unit = new GroveModule({ cableLength: 55, antenna: true,
  antennaAngleDeg: 0 });
host.port('portC').attach(unit); // existing compatible Grove port
host.handle({ type: 'pose', target: 'portC/unitFrame',
  position: [15, 75, -5], rotation: [0.2, -0.1, 0.3] });
host.handle({ type: 'joint', target: 'portC/sma/tilt',
  angleDeg: 90, durationMs: 500 });
host.update(0.016); // advance visual interpolation and four wire curves
const antenna = unit.port('sma').detach({ dispose: false });
unit.port('sma').attach(antenna); // compatible visual connector family
// For a detached Unit: unit.port('sma').attach(new Antenna({angleDeg:45})).
// Release detached objects with .dispose() when no longer needed.
```

Exports are `Model`, `GroveModule`, `Antenna` and `spec`. The body's own registered components are only **`grove` / `sma`**. A mounted Grove module adds common `unitFrame` pose and `cable`; its optional antenna adds **`sma/tilt`**. There is no sensor, exterior button, LED or display. The body has no joint; the recursive `list('joint')` includes an installed antenna hinge. Read state through `get('sma/tilt').getState()`; use `type:'joint'`, finite `angleDeg` in `[0,90]` and optional nonnegative `durationMs`. The limited hinge rejects nonzero `rpm`, out-of-range or nonfinite angles before mutation. S1/D1 are physical internal envelopes without input/light commands.

External pose/joint commands alter appearance without input echo. Ordinary port attachment/detachment still reports lifecycle intent. An external framework owns ZigBee state, mesh roles, pairing, UART, network data, receive/transmit, RSSI, radio range, frequency, power, electrical and firmware behavior; these are rejected as model commands. Static network/range print is actual artwork and supplies no simulated state.

## Necessary construction checks

[Local smoke](smoke.json) verifies all 6592 native shell triangles, exact own blob/commit, scale 1, CAD/visual envelopes, ten clear mounting axial paths with native FrontSide wall hits, carrier retaining bore, true module half-holes and FrontSide walls, coordinate-welded directed closure and positive volume for PCB/module/plated lands/SMA annuli, actual module dimensions, hidden nonemissive S1/D1 and terminal counts, genuine male/female contact bores, same gold body behind both fine slots, two films seated on native walls, six Model/GroveModule/antenna0-or90 artwork configurations with every physical attribute/index/world transform invariant, limited hinge interpolation/45/90/exact return/invalid-state preservation with fixed coupling and ports, nested four-core cable pose, independent peer, accessory detach/refit, resource disposal and no echo. These checks do not establish browser visual, physical hardware, production-fit, measured hinge stops, RF, antenna performance, electrical, UART, network or firmware acceptance.
