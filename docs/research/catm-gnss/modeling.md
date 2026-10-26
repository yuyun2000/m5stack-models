# Unit CatM GNSS · U137

Stage `modeled`; visual verification is null. [Official product](https://docs.m5stack.com/en/unit/Unit_CatM_GNSS), [sources](sources.json), [artwork](artwork.json), [bounded smoke](smoke.json). Retrieved 2026-10-27.

## Own wide case and scoped source correction

Exact U137 uses SIM7080G, two ordinary SMA connectors, a side MicroSIM socket, blue Grove and 5.5/2.1mm DC. Its own case is **40×56×14.8mm**; official **61.6×40×14.8mm** includes fixed SMA. The independent 0.07mm rear label makes this visual envelope 40×61.6×14.87mm. Four mounting axes have 32×48mm pitch, native primary Ø3.2 and rear counterbore Ø4.85. No narrow NBIoT shell or NanoSIM assembly is borrowed.

Own pinned `Products/U137_Unit_CatM_GNSS/Structures/Unit_CatM_GNSS.stl`, commit `c6bf30a9848f1a8b4e4dd7537cceec5b147cafb3`, blob `d7ec62df57c025163f6357031a389ae79ca0fd76`, SHA256 `d9c2a8bcfa48a07a6ec69c3c05a2dfa8d9daa341ec78121dc70806099bf325d7`, contains assembled **0front2646 + 3rear2638 = 5284**, plus displaced 1/2. One common origin [0,34,2.4], identity axes, scale1 is applied to native parts.

The original left SMA aperture has a gray bridge/finger and vertical round hole. Own front photograph shows both apertures exposing real gold SMA bodies. A bounded closed derivative clears only the left aperture inside **X[−10.1,−3.9],Y[19.65,28.05],Z[−3.5,7.45]mm**. This is a physical source correction, with new material cut walls, rather than a sticker or metal skin hiding the discrepancy. **2489 front source triangles remain exact;157 original triangles are removed/retriangulated and121 derivative triangles replace them. Front becomes2610; rear2638 remains unchanged; total runtime5248.** Adjacent original triangles can span beyond the cut box and are clipped/retriangulated without changing geometry outside the tool volume. Full removed/retained/new face IDs, affected triangle bounds, original hash and volume receipts are in sources/smoke. No other model, mirrored patch, stretching or independent part relocation is used. Both resulting native parts are closed, positive material volumes.

## Complete physical installation and evidence limits

The own inferred carrier is0.8mm FR4 at topZ−2.6, with true boss reliefs,4plated Grove drills/barrels and8annular lands. SIM7080G17.6×15.7×2.3mm is confirmed by official MCP chip references; its substrate, shield and perimeter lands are represented. Exact own schematic supports two ME3116AM6G converters,10uHinductors,two470uFbulk capacitors,protection/diode/UARTtransistor/passive envelopes andD2STATUS/D3NETLIGHT carriers. Their hidden positions and secondary packages are inferred;this is not complete populated BOM acceptance.

Both SMA ports use their actual native seating axis **Z4.2**,14mm pitch and5.6mm protrusion. Gold square installation bodies/cylindrical backs, retained PCB legs, narrow seating necks, hollow threaded shafts, real PTFE/centre-contact bores and closed visual helical threads are physical meshes. Their inferred seats remain clear of the native housing in bounded checks. The DC socket has real5.5mm deep material bore, outer sleeve,2.1mm centre pin, rounded tip and recessed dielectric back; it is not a black plane masking a void. Grove has actual wall/floor/rear/4contacts/returns/tails.

The side socket is **MicroSIM**, with dielectric backing, six contact envelopes, rails/endstop and metal retainer with a true inspection opening. No SIM card or NanoSIM substitution is included. `sim` is a passive side-slot anchor in both closed/service configurations. NET/STA printed icons have uninterrupted native plastic behind them; the exact schematic carriers remain fixed and nonemissive, with **no LED or button API**. `rearCover:false` removes only rear2638/backfilm/ink and two actual hex head/floor/shaft fixings. Front,PCB,all ports andSIMholder remain fixed.

## Two separate physical accessories

`LTEAntenna` mates with `lte`, has ordinary SMA male centre pin/open coupling/internal thread, physical white print band, fixed neck/fork/axle and actual bored moving knuckle/radome. Own photograph shows a transverse hinge circle. Straight **11×158×11mm**,axisX,pivotY15 and0…90° viewer interval are own-photo estimates,not published dimensions or measured stops. Only knuckle/neck/rod/tip move;coupling/band/fork/axle stay fixed. External finite angle/interpolation/replacement/exact neutral works;nonzeroRPM rejected,no automatic sweep or input echo. Unreadable LTE band serial is omitted.

`GNSSAntenna` mates independently with `gnss`, and contains the supplied puck/permanent nominal**1m single RF coax** plus ordinary SMA male. The estimated puck is40×46×13mm,with real body/strain/gold label substrate. It has **one coaxial centre-and-shield system**,not four Grove wires. Its geometry API provides `puckPose` for external `pose` and `coax` for external `cable` shape. `points` means only1…24 intermediate finite xyz waypoints in accessory-port coordinates. The source endpoint [0,5.5,0] is generated at actual fixed connector strain;the target is generated from puck-local [−20,0,0]. Changing puck pose automatically regenerates the coax endpoint and shape;waypoint commands do not move the puck or fixed coupling. Nominal1m is documentary;default displayed curve is820.25mm and is explicitly an inferred layout,not a length/physics/collision solver. There is no geographic position,RF,network,electrical orfirmware state.

## API and actual presets

Exports `Model`, `GroveModule`, `LTEAntenna`, `GNSSAntenna`, `spec`. Body component order: `grove`, `dc`, `gnss`, `lte`, `sim`. Four Ports and one passive SIM anchor;no body controls/LEDs/sensors/joints. Defaults:rearCover true,both antennas false,lteAngleDeg0. Six named presets cover body/LTE/GNSS/both/rearservice/serviceboth. Schemas are separate from the required configuration array. `GroveModule` adds existing `unitFrame` and real four-core `cable`.

```js
import {Model,GroveModule,LTEAntenna,GNSSAntenna} from '../../../src/units/catm-gnss/index.js';
const unit=new Model({lteAntenna:true,gnssAntenna:true});
unit.handle({type:'joint',target:'lte/tilt',angleDeg:45,durationMs:200});
unit.handle({type:'pose',target:'gnss/puckPose',position:[100,90,-5],rotation:[.1,.2,.3]});
unit.handle({type:'cable',target:'gnss/coax',points:[[0,25,0],[-60,80,10],[-120,20,0],[-40,-20,0],[45,50,-8]]});
unit.update(.2);
const held=unit.get('gnss').detach({dispose:false});
unit.get('gnss').attach(held);
// Through a host Grove port: unit/lte/tilt,unit/gnss/puckPose,unit/gnss/coax.
// unit/cable remains the separate four-core Grove cable.
```

## Three ordinary PNGs

Own readable front and rear body labels are code-redrawn as3400×4260/2180×1410PNGs. The actual gold GNSS sticker visible on own hero is separately redrawn at3400×3800;only readable GPS/BD ANTENNA and clear blocks/lines are transcribed,with illegible microtext omitted. Packaging GNSS illustration is not a substituted real label. Fonts,colours,registration/compliance glyphs are estimates. These are ordinary final PNGs with only numeric2540DPI metadata and static literal local URLs. Physical body/GNSS label substrates remain without ink. Fourteen entry/configuration `artwork:false` comparisons preserve all physical attributes,index andmatrixWorld,including attached accessories. CSV/privateURLs/names/mapping,vectororiginals,rawCAD/photos/MCP,generators/proofs/intermediates are excluded.

## Necessary bounded checks

211 independent physical meshes are coordinate-welded directed count-two,positive-volume andFrontSide. Native original/derivative counts,20empty mountaxes/48nativewalls,12platedaxes/48metalwalls,18SMAaxes/24internalwalls,6actualgoldwindowbackings and4DCborewalls pass. PCB/SMA/DC/MicroSIM versus own native cases and LTE hinge0/45/90 checks pass bounded bidirectional surface samples and finite volume grids. Five external LTE angles,interpolation/replacement/rejections/neutral,GNSS actual endpoint continuity after pose andwaypoint changes,fixed couplings,selective service/antenna/wholeUnitroundtrips,transformed-parent four-core Grove,independent peer,no input echo and disposal of1032resources pass. No browser/GPU/physicaldevice,manufacturing fit or complete BOM acceptance is claimed.

Official feedback `bbb5f4d47f7e4fe5aac3ea7fc824fce7` requests missing populated/accessory/optical construction;`b7af41bcb4104437b12330a485075481` reports own left gray SMA bridge discrepancy. Both received for official review. New code MIT;existing third-party rights retained.
