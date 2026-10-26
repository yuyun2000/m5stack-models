# Unit Grove to Grove · U148

Stage: `modeled`; browser and physical acceptance remain unverified. Retrieved 2026-10-26. [Official product](https://docs.m5stack.com/en/unit/unit_grove2grove), [sources](sources.json), [artwork](artwork.json), [necessary local checks](smoke.json).

## Exact own assembly and dimensions

This is **Unit Grove to Grove U148**, the active Switch & Meter unit with three interfaces. Its own references are separate from the A040 passive Grove-to-Grove accessory and the A162 USB-C Grove Converter. Official MCP, eight same-product photographs, dimension drawing and schematic establish the identity and hardware.

Own structure `Products/U148_Unit_Grove_to_Grove/Structures/Unit_Grove_to_Grove.stl` is pinned to hardware commit `e29c139cbc7c80b5ccc5557e5ab8025a7a19a109`, blob `42e3ce5ecde1df152cb243f8408805a136cfc11a`; this path last changed at `d3ae864f161167af3f9698214012e1d135adc357` on 2026-07-30. SHA and selection are in [cad-map](../../../src/units/grove-to-grove/cad-map.json). Native components **0+2, 3,974 triangles**, are the same-position rear housing and front cover. Components 1/3 are separately displaced duplicates. Complete source faces and indices remain under one common proper rigid rotation/translation at scale 1, without patches, fills, removed faces or independent repositioning.

Millimetre axes are +X toward the white OUT socket, +Y toward both white sockets, +Z toward the narrow front arrow label. Source origin is `[95.45685577392578,13.5,−20]`; proper axes are `[[-1,0,0],[0,0,-1],[0,-1,0]]`. Native main housing is **24×32×8 mm**. Official vendor order is 32×24×8.1 mm; the dimension drawing distinguishes an 8 mm main body section from an **8.1 mm connector-inclusive section**. Reconstructed actual socket retaining rails extend 0.1 mm past the native front plane, yielding visual **24×32×8.1 mm**. The CAD is not stretched.

Two Ø4.85 mm mounting holes are at X±8/Y−4, 16 mm apart and 12 mm from the black-socket edge. Their native counterbore/chamfer mouths at Z±3.5 join the outward side edge; the remaining radial walls are real source geometry. Interior Z−2/0/+2 samples have all four FrontSide walls. No source mouth is artificially closed. The central source retaining shaft bore measures Ø1.7 mm; its rear head recess is approximately Ø4 mm, with native tessellated radial samples 1.952–2.002 mm. These source measurements remain distinct from the official mounting-hole dimension.

## Complete electronic and connector assembly

The real product has **three open board-mounted HY2.0-4P pin sockets**: a black PORT.B control socket at the bottom, white 5V IN at the left and white 5V OUT at the right. Official side photo 04 clearly shows four male metal contact pins in a shrouded receiving housing. Each socket has side/top rails, retention shoulders and bridge, a physical floor, recessed dielectric rear, four separate recessed pins and four PCB terminal legs. The white retaining structures are board housings, not four-chamber cable-end plugs. No fixed extension plug or DirectModule is fabricated.

A shaped 0.8 mm PCB at Z−1.15…−0.35 supplies mounting reliefs, a true central retaining bore and the black-connector notch. The exact schematic contains **HT7533, INA199A1DCKR, SGM2553D and TL432**. All four fixed package envelopes and their 3/6/7/3 terminations, including the SGM2553D exposed pad, are present. Their terminal bottoms meet the PCB plane, tops meet the package bottoms and XY footprints have positive material overlap. The populated resistor set is R1/R2/R3/R5/R6, including the 1206 R3 shunt; capacitors are C1–C4. All nine R/C bodies and physical terminations are modeled. No MCU, exterior LED or physical toggle/button is shown by these references.

Concealed board shape/plane, IC package envelopes and installation, terminal details, passive positions, connector fit and the 0.1 mm front projection are appearance reconstructions. Production PCB or complete assembly BOM is unavailable in the own structure evidence, so these do not claim manufacturing fit. The four ICs are retained as physical assembly rather than representing the product as bare interconnected wires.

A real fixed hex-socket screw has an annular head, directed inner walls, recessed floor and shaft. Native rear M5 relief remains unchanged. Two independent solid adhesive substrates sit on the actual front and rear recesses. Physical socket carriers, PCB, housing and films close the corresponding assembled surfaces; printed images do not hide absent parts. Intended ports and mounting holes remain open.

## Appearance interface

Exports are `Model`, `GroveModule` and `spec`. Body component order is exactly `grove`, `in`, `out`; all three are Ports with `connector:'grove'` as their mechanical receiving-socket family. Documentary labels are GND/5V/D.IN/A.OUT at the black socket and GND/5V IN or OUT/IO1/IO2 at the white sockets. Connector family and printed names do not implement pin routing or electrical compatibility. There are no Buttons, LEDs, sensor anchors, displays or joints.

`GroveModule` uses the black `grove` control socket as the canonical cable input. It adds the existing `unitFrame` and `cable`, with two actual cable-end plugs and four conductors. Both white `in` and `out` sockets accept independent ordinary Grove cable modules. Their source frames follow the physical sockets through transformed ancestors, while downstream Unit pose and cable bend/slack remain independently driven. Detach and reattach preserve the other attached Units.

```js
import {Model,GroveModule} from '../../../src/units/grove-to-grove/index.js';
const unit=new Model();
unit.port('in').attach(new GroveModule({cableLength:55}));
unit.port('out').attach(new GroveModule({cableLength:65}));
unit.handle({type:'pose',target:'in/unitFrame',position:[15,90,8],rotation:[.1,.2,-.3]});
unit.handle({type:'cable',target:'in/cable',slack:19,bend:[0,0,-1]});
unit.update(.2);
const detached=unit.port('in').detach({dispose:false});
detached.dispose();
// A host socket can receive the complete Unit through its black control socket:
host.port('unit').attach(new GroveModule({cableLength:70}));
```

The product's real current-sensing and power-switching functions remain documentary. The model emits no current measurements or supply state and performs no switching, GPIO, voltage, signal/protocol routing, electrical or firmware simulation.

## Official-reference redraws

Two ordinary high-resolution **reference-redraw** PNGs accompany the model: 900×2280 front and 4160×2500 rear. The clear own photos establish the narrow vertical Grove2Grove title, reversed left/right pin-strip order and right-pointing blue arrow; rear Grove2Grove, Switch & Meter, PORT. B. I/O and A.OUT/D.IN/5V/GND color blocks are reproduced. No photographic pixels are cropped or enlarged, no packaging/other model is substituted and no unreadable small text is invented. The original typeface is unavailable; Impact/Arial glyphs, reconstructed colors and registration remain declared appearance approximations.

Both printed layers target independent physical films. `artwork:false` leaves every physical attribute, index and world matrix unchanged in Model and GroveModule. Only the final two ordinary PNGs are distributed. Supplied table/private mappings, original names/URLs, reference photo originals, SVG redrawing sources, generator and intermediates remain outside distribution. Exact official reference URLs/hashes are retained in [artwork](artwork.json).

## Necessary validation

Local smoke passes all 3,974 native triangles and native/visual envelopes; **109 physical solids**, including both native components, have coordinate-welded count-two, balance-zero directed closed edges and positive volume. Native quantization is 0.0001 mm and newly built solids use 0.00001 mm. Ten full-height mounting axes remain empty. **54 FrontSide material-wall rays** cover layered native mounting walls, original head/shaft walls, PCB retaining walls and three socket cavities; four original near-face outward mouth connections are explicitly recorded. Positive PCB relief, shaft/head and socket material allowances remain intact.

All four IC bodies have seated contacts with positive XY overlap. Each of three sockets has four separate pins, four seated PCB terminals, actual cavity walls and a recessed rear. Front/rear film and real hex-floor closure rays pass. Both entry types preserve all physical geometry with artwork disabled. A transformed parent and two white-port downstream Units plus an independent peer exercise four physical four-core cables, independent pose/bend, source tracking and detach/reattach. All **760 tracked resources** dispose. No self-driven geometry or electronic behavior occurs.

These checks cover necessary construction and appearance interfaces. No exhaustive browser face-by-face re-review, production fit, power/current/protocol, firmware or physical-device acceptance was performed. Visual verification remains null and the product stays `modeled`.
