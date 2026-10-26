# Unit RF433R U113

Stage: `modeled`; browser visual and physical acceptance remain unverified. Millimetres: +X front-label right, +Y label end, +Z front. This is the SYN531R **receiver** U113, with its own sources and receiver artwork.

## Official sources and native assembly

The official product table gives **48 × 24 × 8 mm** in vendor length/width/thickness order. Its exact-model drawing and complete native assembled component give model X/Y/Z **24 × 48 × 8 mm**, Ø5 mounting bores with 16 mm pitch at 12 mm from the bottom and a 10 mm wide, 5.2 mm high Grove socket. No scaling is needed.

The own structure path `Products/U113_Unit_RF433R/Structures/Unit_RF433R.stl` was retrieved at path-specific commit `07d8765bd52f32cc2705fc542ea608169a6c3c8c` and verified against Git blob `c711d25d74bd606fb0027ed6b197226c69d682f9` plus source SHA-256 in the [CAD map](../../../src/units/rf433r/cad-map.json). Component 0 is the complete assembled **3796-triangle** front/rear shell. Components 1/2 are displaced duplicate shell halves. The complete selected component is retained with one common Z translation and scale 1; no native triangle is removed, patched, filled or independently repositioned. The front label area has an original central aperture and a surrounding physical support rim. The rear label area has an original closed wall. The mounting bores, retention recess, end notch, Grove opening and M5 emboss remain native geometry.

Own schematic U1 is **SYN531R**, Y1 **13.51783 MHz**, with L1/L2, C1/C2/C3/C4/C10/C11 and R1/R2. The exact linked SYN531R datasheet page 10 was rendered and read: SOP-8 nominal molded body **4.92 × 3.95 mm**, terminal span **6.00 mm**, overall height **1.50 mm**, body standoff **0.16 mm**, lead pitch **1.27 mm** and lead width **0.40 mm**. The model therefore has a physical body and eight closed gull-wing leads, rather than a generic pinless block. Y1 is modeled as a fixed metal crystal can; its actual production package, hidden placement and solder ends remain inferred. The manufacturer's evaluation-board HC49S/SMA example is not evidence of those parts on the M5Stack Unit.

The official product explicitly says **built-in PCB antenna**. The linked schematic names E1 `ANT_IPEX`, but its generic antenna symbol does not establish a populated connector or an exterior antenna port. Rechecking the original image, exact-model photos, own CAD and a second targeted official MCP search did not establish that installation. The model follows the product's internal PCB antenna statement and closed external appearance. A fixed, concealed planar copper route is included as an inferred appearance envelope. Its exact route is not a production antenna design. No external IPEX/SMA, rod, spring, hinge or RF wave effect is added. This documentation ambiguity was submitted through official MCP feedback; [sources](sources.json) records its accepted receipt.

## Complete physical appearance

The complete original casing contains a shaped PCB with true central retention through-bore, side reliefs around the native mounting bosses and a Grove installation notch; the real SOP-8 package; metal crystal; two inductors, six capacitors and two resistors; fixed PCB copper antenna; and a physical rear retaining screw. Concealed PCB outline/plane, copper route, component placement, non-IC package envelopes and installation remain inferred because a production electronics assembly is unavailable.

The black HY2.0-4P socket matches own receiver photos. Its side walls, guide rails, latch shoulders/bridge, deep dielectric rear carrier, four physical contacts and solder tails leave the mouth recessed and open. There is no invented flat cap at the port entrance. The documented color labels are Black GND, Red 5V, Yellow NC and White RF_RX; the model does not implement their electrical behavior.

An independent thin front adhesive film spans the existing CAD aperture and physically touches the original support rim on all four sides; it does not manufacture missing shell triangles. A second film touches the original closed rear recess. Both films remain under `artwork:false`; only the projected ink is disabled. The two ordinary high-resolution PNGs are own U113 `reference-redraw` assets. Their source photographs, placement, hashes, print limitations and rights are in [artwork provenance](artwork.json). No photograph pixels, transmitter print, unreadable microtext, source vectors, generators or private intake data are distributed.

## Agent integration

```js
import { Model, GroveModule, spec }
  from '../../../src/units/rf433r/index.js';

const receiver = new GroveModule({ cableLength: 55 });
host.port('portB').attach(receiver); // an existing compatible physical Grove port
host.handle({ type: 'pose', target: 'portB/unitFrame',
  position: [15, 70, -5], rotation: [0.2, -0.1, 0.3] });
host.update(0.016); // update four physical wire curves after pose changes
const socket = host.get('portB/grove');
const detached = host.port('portB').detach({ dispose: false });
// detached.dispose() when its external owner no longer needs it.
```

Exports are `Model`, `GroveModule` and `spec`. The body has only `grove`; a mounted module additionally has the shared `unitFrame` pose and `cable` interfaces. There is no sensor or RF anchor, button, LED, display, joint, rotating antenna or movable internal structure. Whole-unit pose moves the casing and cable endpoint without emitting reception values or input echo. Ordinary attach/detach still reports port lifecycle intent. RF receive/decode, ASK/OOK, signal/strength/RSSI, distance, data, GPIO, protocol, power, electrical and firmware behavior belong to the external framework and are rejected as model commands.

## Necessary checks

[Local smoke](smoke.json) verifies all 3796 selected original triangles at scale 1; CAD and visual envelopes; ten clear mounting axial paths and native FrontSide walls; the PCB retaining bore's axial emptiness, FrontSide walls, opposed directed edges and positive signed volume; actual SOP-8 package dimensions and all eight closed leads; fixed nonemissive copper antenna; ten passives; deep carrier and four real Grove contacts; front-film seating at six original rim points; rear-film contact; both entry types' complete physical attribute/index/world-matrix invariance under artwork toggles; nested four-core cable pose, independent branch, detach, resource disposal, no echo and internal-command rejection. These are construction/API checks. No exhaustive browser review, real RF behavior, antenna performance, electrical, firmware, production fit or physical validation is claimed.
