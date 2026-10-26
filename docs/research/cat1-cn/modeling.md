# Unit Cat1-CN U204

Stage: `modeled`; browser visual and physical acceptance remain unverified. Millimetres: +X front right, +Y ordinary SMA end, +Z front CAT-1 label. This is the exact U204 ML307R-DL cellular Unit.

## Native casing and rear service configuration

The official table gives **71.4 × 24 × 8 mm**. Its own drawing distinguishes the **24 × 64 × 8 mm** casing and **7.4 mm** ordinary SMA projection, plus Ø4.85 mounting bores at 16 mm pitch and 12 mm from the bottom. The supplied **108 × 10 mm** antenna is excluded from the nominal Unit length.

The exact own path `Products/U204_Unit_Cat1-CN/Structures/Unit_Cat1-CN.stl` is pinned to path commit `2a547f4cb53263c7c263c2fdc7c80f54cfb93fdc`, Git blob `9ff6f6a0e938660892800403ae0bf13bee344e6b` and the source SHA-256 in the [CAD map](../../../src/units/cat1-cn/cad-map.json). Original component 0 is the complete **6562-triangle** assembled casing. Components 1/2 are displaced **3848/2714**-triangle duplicate halves.

Every original component-0 triangle was matched one-to-one to the displaced halves after rigid X translation, including cyclic winding-preserving full-vertex matching. The mapping has **zero missing or ambiguous faces**, full 6562-face coverage and maximum vertex difference **0.000005740206688642502 mm**. Runtime geometry uses component-0 original vertices, grouped into the actual **2714 front / 3848 rear** subsets. It does not substitute the duplicate coordinates. Both subsets use the same origin `[0,32,-4]`, identity axes and scale 1. No native face is cut, filled, patched, scaled or independently moved.

Default `{rearCover:true, antenna:false, antennaAngleDeg:0}` retains all 6562 faces, both physical adhesive films and all three rear screws. Official SIM instructions require removing the three screws and rear cover. Explicit `{rearCover:false}` therefore omits only the proven 3848-face rear half, its back film/ink and the three complete screw assemblies. Exact front-casing attributes/index/world pose, front film, PCB, all components, Grove, fixed SIM holder, IPEX/coax and SMA remain unchanged. The service configuration adds only the passive noninteractive `sim` location anchor. It does not invent a card/tray accessory, an external slot or a SIM-cover hinge operation.

## Complete real assembly

The shaped PCB has actual mounting-boss reliefs, central retaining bore and four Grove solder bores with annular lands and inner plated barrels. The board is at Z1.6–2.4, with its photographed module/component side facing −Z. The blue bottom Grove includes genuine molded walls, cavity, latch/rails, four independent contacts and four bent solder tails that enter those actual drill locations at the board plane. Its physical pin row and bottom-facing Port picking basis agree. Documentary labels are GND/5V/RXD/TXD; they do not implement UART or power.

The actual ML307R-DL substrate/shield, SY8003ADFC regulator, WPN3012 inductor, C9 bulk package, SIM protection, transistor/passive packages, test-pad envelopes and fixed D1 package remain present behind the casing. The modeled **18 × 18 × 2.3 mm** module envelope and **72 perimeter solder-land appearances** are unconfirmed installation reconstruction, not a measured module drawing, numbered pin map or confirmed PCB BOM. Two inferred resistor positions retain positive board/mounting clearance. The fixed Nano-SIM holder includes dielectric base, rails, six gold leaf-contact appearances, metal cover with real central and three circular inspection apertures, fixed hinge barrels and solder tails. Cover/leaf/tail dimensions are inferred appearance geometry.

Own naked-board and SIM-location photographs show a board IPEX receptacle, plug cap, black coax pigtail and an independent SMA bulkhead. That assembly explains the schematic IPEX versus exterior SMA naming; it is not a source conflict. The actual **ordinary SMA female** has outer threads, annular shell, dielectric center opening, a genuinely hollow female contact terminating at a blind end, shaft, inner gold hex body, outer mounting nut/washer, coax crimp and heatshrink. Both small upper front/back native windows expose the gold installation hex; they are backed by that real hardware. Neither window is assumed to be an LED light guide.

D1 NETLIGHT0603 is evidenced internally near the Grove. Its color and exterior optical path are not established. It remains a fixed nonemissive package with no exterior LED API. USB exists only as test-pad evidence, with no populated external USB socket or API. There is no external button, sensor, display or body joint.

## Own supplied ordinary SMA antenna

`Antenna` is a separate accessory with its own U204 **108 × 10 mm** nominal envelope. Default Unit configurations do not install it. `{antenna:true,antennaAngleDeg:0}` fits it to `sma`; the straight assembled overall envelope is about **24 × 174.6 × 10 mm**. The ordinary SMA male coupling has genuine inner threads, an open mating cavity, dielectric carrier and exposed center pin. Both antenna inner and body outer helical threads have real terminal material end faces.

Own U204 hero/package views demonstrate the supplied antenna's 90-degree elbow. A finite externally driven `sma/tilt` joint rotates only its knuckle/radome/tip about local X through `[0,11.8,0]`. The coupling, fixed neck, fork/cheeks and axle remain stationary. The 0–90-degree visual contract reconstructs the own straight/right-angle poses; its axis, profile and range are appearance estimates, not measured production stops. There is no continuous spin, SMA unscrewing or automatic sweep. Ordinary SMA attachment rejects RP-SMA and Grove families.

## Two exact supplied body labels

The actual front ONLY CHINA/three-hex/CAT-1 and back CAT-1/ML307R/bands/SIM Card Slot/PORT.C layout come from the exact supplied U204 outlined body originals. Two final ordinary **1583 × 3612** and **1605 × 3603** `source-vector-raster` PNGs retain the source paths and text. A single compound-path fill-rule conversion defect in the front title was corrected without retyping or changing its paths. Packaging originals and product photos are excluded as body-label sources. No photo crop is used.

Real front/back films directly touch the native support walls at Z3.8/−3.8. The film geometry remains when `artwork:false`. Open-rear mode removes the physical back film with that actual cover and retains the front film. Labels do not cover missing hardware or close genuine mounting/connector openings. [Artwork provenance](artwork.json) records final hashes, registration and distribution limits. Private table, mappings, source vectors and conversion intermediates remain outside the repository.

## Agent integration

```js
import {Model, GroveModule, Antenna, spec}
  from '../../../src/units/cat1-cn/index.js';
const unit = new GroveModule({rearCover:true, antenna:true, cableLength:60});
host.port('portA').attach(unit);
host.handle({type:'joint', target:'portA/sma/tilt',
  angleDeg:90, durationMs:500});
host.handle({type:'pose', target:'portA/unitFrame',
  position:[15,85,-5], rotation:[0.2,-0.1,0.3]});
host.update(0.016);
const detached = unit.port('sma').detach({dispose:false});
unit.port('sma').attach(detached);
// Alternative construction: new Model({rearCover:false}).get('sim')
// is a passive internal socket anchor after explicit rear-cover removal.
```

Own default components are `grove` and `sma`; open rear adds the passive `sim` component. Attached `Antenna` adds `sma/tilt`. Common `GroveModule` adds `unitFrame` and `cable`, preserving four independently curved wires/two plugs. Whole-unit pose and antenna-joint commands do not echo input; ordinary port lifecycle events keep core behavior. `{dispose:false}` transfers disposal responsibility to the caller.

The model owns appearance, actual physical attachment and externally requested visual motion. It does not implement cellular/network registration, SIM data/authentication, signal/RSSI, RF/antenna performance, AT/UART, USB, power, voltage/current, electrical routing, firmware or a hardware state machine. These commands are rejected. Missing authoritative module mechanical/installation and D1 optical details were reported through official feedback, accepted as **`55e19c0de225443a9927fed0b253c8ab`**.

## Necessary checks

[Local smoke](smoke.json) verifies exact source commit/blob/scale and complete native partition, unchanged front/internal geometry on rear removal, separate casing/connector/antenna envelopes, whole-assembly mounting bores, retaining/four solder bores and actual bent tails, **54 FrontSide material-wall checks**, coordinate-welded opposed edge pairs/positive volumes for both native halves, PCB, plated lands/barrels, perforated SIM metal cover, SMA/antenna cavities, capped inner/outer thread terminals and screw heads; actual female center hole/male center pin; both native windows backed by SMA; film support; exact public APIs; **12 artwork configuration pairs** preserving all physical attributes/index/world matrices; 0/45/90 joint transition/fixed hardware/exact return/invalid-state preservation/no echo; nested four-core cable pose/peer independence, detach/refit and disposal of all 373 resources. No exhaustive browser review, production fit, measured hinge stops, physical hardware or electrical acceptance is claimed.
