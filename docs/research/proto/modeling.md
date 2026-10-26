# Unit Proto · U022

Stage: `modeled`; browser and physical acceptance remain unverified. Retrieved 2026-10-27. [Official product](https://docs.m5stack.com/en/unit/proto), [sources](sources.json), [artwork](artwork.json), [necessary local checks](smoke.json).

## Exact product and original shell faces

This is the full-length **Unit Proto U022**, separate from Mini Proto U064 and Module Proto. Official product data gives 48×24×8 mm, 77 holes, nominal Ø1 mm hole size and 2.54 mm pitch. Its own photos and dimension drawing show a **7-column×11-row exposed board**, 20×28 mm front window, black HY2.0-4P receiving socket and two Ø5 mm mounting bores, 16 mm apart and 12 mm from the bottom edge. The rear is a closed housing with one central fixing screw and one PROTO label. There is no front adhesive label over the prototype field.

Own `Products/U022_Unit_Proto/Structures/Unit_Proto.stl` is pinned to path-specific last-change commit `66720a863658da9bab58a208d4ebf8a040c2d42c`, blob `2e8d4e9bbc03d9fc6c30f330b67bb7ddc469a51c`, SHA recorded in [cad-map](../../../src/units/proto/cad-map.json). It contains complete assembled component **0, 3,498 triangles**, plus separately laid-out rear 1 (1,872) and front 2 (1,626). Only the assembled component supplies runtime faces.

Each assembled source triangle is classified by directed cyclic vertex correspondence with its own laid-out shell duplicate. All 3,498 match, with zero unmatched or reversed triangles and maximum vertex difference 0.000003934 mm. Runtime front **1,626** and rear **1,872** groups retain their original assembled coordinates, winding and faces under the common translation from `[-80,0,1.2]`, at scale 1. No cut, patch, fill, stretch, face deletion or independently repositioned source face is used. The comparison duplicates are excluded from runtime.

Axes are millimetres: +X right, +Y prototype-field top, +Z exposed board. Default native and visual envelopes are **24×48×8 mm**. Original combined source0 has 25 count-four, balance-zero front/rear mating coincidences at 0.0001 mm coordinate quantization. Each source shell and each corresponding runtime physical part independently has count-two, balance-zero closed directed edges and positive volume. Grouping the actual parts does not remove their source mating surfaces, and the combined overlapping assembly is not claimed to be a single manufacturing manifold.

The original mounting bores have layered radial profiles. At Z±3.5 their near-face mouths join the outward side edge; inward and Y-directed walls remain. At Z−2/0/+2 all four radial directions meet actual FrontSide source walls. Original openings and counterbores are retained instead of adding test-only closure faces.

## Physical prototype board and connector

All **77 holes are real material bores**. The 7×11 grid uses the documented 2.54 mm pitch and is centred in the actual front window. Every hole has a 1 mm clear opening, an independent metal barrel and separate front/back metal annuli. The substrate itself is a thick extruded body with 77 drilled material passages, actual side mounting reliefs, a central fixing bore and Grove clearance. Rings are not flat ink dots, black discs or a sticker. There are no user-added ICs, discrete components, jumper wires or soldered project circuits in the default model.

The exact sources do not supply a production PCB or assembly stack-up. The modeled **1 mm board thickness**, installed top plane Z−0.45, 0.03 mm barrel wall, 0.025 mm annulus thickness and 1.6 mm pad diameter are declared visual estimates. The substrate passage is 1.06 mm around the reconstructed plating, preserving the product's nominal 1 mm clear hole in the finished appearance; this is not a claim about the factory drill/plating process. Positive material remains between bores, annuli, the field/window edge and mounting reliefs. Both annular faces meet their barrel and substrate planes.

The actual Grove receiving socket has side/top rails, retention shoulders/bridge, a real floor, recessed dielectric rear, four separate male contact pins and four factory PCB terminals. Each terminal has actual board material and a metal solder pad underneath, rather than ending over a clearance notch. Hidden connector seating, contacts and termination installation remain inferred. The closed native rear wall provides real backing behind all 77 open board holes. The front window is never filled by artwork or fabricated plastic.

The own schematic contains only P1 Header4 and J1 Grove, with J1 documentary pin numbers 1 I, 2 O, 3 VCC and 4 GND. It does not establish the physical P1 allocation within the visible field, a raised factory four-pin header or permitted VCC rating. No extra upright header, default user circuit, electrical pad routing or signal direction is invented. The label's visible “5V” is reproduced as print rather than turned into a supply model.

## Complete rear and service configuration

Default `rearCover:true` retains the front frame, rear housing, board, Grove, one real fixed central screw and rear physical silver label film. The screw has an annular hex-socket head, directed recess walls, recessed floor and retained shaft. The label substrate sits within the measured native rear recess.

`rearCover:false` removes **only the native rear group, rear film/ink and one centre screw**. It retains the exact front frame, full prototype board, 77 holes/plating, Grove and factory pads at their original positions. Every board hole is then truly open through the assembly from front to back. The service configuration does not remove the front shell, fabricate a hinge, pull out the board or invent a disassembly animation. Component IDs remain unchanged.

## Appearance API

Exports are `Model`, `GroveModule` and `spec`. The body contains only **`grove`**, a mechanical Port. There are no controls, LEDs, sensor anchors, displays, speakers or joints. `GroveModule` adds the existing `unitFrame` and four-conductor `cable`; its input is the actual black board socket. Nested pose and cable bend/slack commands are external appearance controls. No self-driven circuit behavior, sensor values, voltage/current, protocol, electrical routing or firmware simulation is implemented.

```js
import {Model,GroveModule} from '../../../src/units/proto/index.js';
const closed=new Model();
const service=new Model({rearCover:false});
const module=new GroveModule({rearCover:false,cableLength:70});
host.port('unit').attach(module);
host.handle({type:'pose',target:'unit/unitFrame',position:[10,90,7],rotation:[.2,.1,-.3]});
host.handle({type:'cable',target:'unit/cable',slack:17,bend:[0,0,-1]});
host.update(.2);
module.get('grove'); // Module components are available through get().
```

## Exact rear reference redraw

One **1580×2780 reference-redraw PNG** reproduces the clearly readable own rear PROTO title and blank white/yellow, 5V red and GND black blocks. Unprinted PNG areas are transparent, exposing the independent silver physical adhesive substrate. The original typeface, metallic/holographic appearance and registration remain declared estimates. No photograph is cropped, no wrong-product original is borrowed, and no unreadable front PCB microlegend is invented or replaced with a front sticker.

`artwork:false` removes the rear ink layer only. All physical attributes, indices and world matrices remain identical for both Model/GroveModule and both rear-cover configurations. Only the final ordinary PNG is distributed. Original table/private URLs/names/mappings, official image/CAD/PDF/MCP originals, SVG redraw source, generator and intermediates remain outside the distributable tree.

## Necessary local validation and limits

The bounded smoke checks all original 3,498 assembled faces and front/rear correspondence; both runtime native groups are independently directed closed with positive volume. **259 physical meshes** share 30 unique geometries; each unique geometry is coordinate-welded count-two/balance-zero with positive volume, while every physical transform has positive determinant and finite attributes. Native parts use 0.0001 mm and constructed geometry 0.00001 mm coordinate quantization.

The 77-hole field passes **385 empty axial rays**, **924 FrontSide metallic bore-wall rays** and **312 substrate/fixing-bore wall rays**, with all metal/substrate seating planes and positive allowances checked. Closed configuration rays reach the actual native rear backing behind every free bore. Ten full-height mounting paths, 36 native layered wall rays, four original near-face outward outlets, actual recessed Grove rear/four separate pins/PCB support and film/hex-floor closure rays pass.

The rear service view removes only its recorded parts and leaves fixed geometry identical. Four entry/configuration artwork comparisons preserve every physical attribute/index/world matrix. Transformed-parent four-core attachment, independent peer, exact detach/reattach pose and disposal of all **200 tracked resources** pass. No exhaustive browser, GPU, manufacturing fit, electrical/protocol, user circuit or physical-device acceptance was performed; visual verification stays null.

A targeted official MCP recheck still lacks PCB thickness/installed plane/plating stack and P1 physical pad mapping. Feedback `9fe56810cf9f4563a2caf8cdc95db1cb` was accepted for official review. These details remain inferred rather than blocking this bounded visual implementation or being presented as production measurements.
