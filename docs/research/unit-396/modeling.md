# Unit 3.96 U020

Stage: `modeled`; browser visual and physical acceptance remain unverified. Millimetres: +X front right, +Y orange connector end, +Z plain front. This is the exact **U020 Grove-to-HT3.96 adapter**, with its own fixed male header and supplied removable female screw plug.

## Exact sources and native shell

The official product table gives **32 × 24 × 10.2 mm** in length/width/thickness order. Its exact U020 dimension drawing distinguishes **24 × 32 × 8 mm** casing, **10.2 mm** including the front-projecting fixed header, **15.8 mm** connector width, **3.96 mm** pitch, Ø5 mounting bores at 16 mm pitch and 12 mm from the bottom, and a 5.2 mm high Grove socket. The supplied female plug is separate from this bare-unit envelope.

Own path `Products/U020_Unit_3.96/Structures/Unit_3.96.stl` was retrieved at latest file-specific commit `b4d8875bd504fed30242df78a1370703742941fb`, verified against Git blob `28a3f3af4bca78df00ff45d69baf158b9021ecae` and the source-byte SHA-256 in the [CAD map](../../../src/units/unit-396/cad-map.json). Component 0 is the complete assembled **3216-triangle** shell. Components 1/2 are displaced duplicate shell halves, 1684/1532 triangles. The selected original assembly is retained intact at scale 1, with a common translation and a rigid **180° Y rotation**, recorded as axes `[[-1,0,0],[0,1,0],[0,0,-1]]`. Its native low-Z connector opening thereby faces model +Z; the native closed rear label/M5 face points −Z. No triangles are removed, patched, filled, stretched or independently repositioned. Simply assuming the recent products' identity axes would put this header into a closed wall and obstruct the Grove mouth; the actual source apertures determine this own-model rotation.

The source shell remains 8 mm thick. The reconstructed orange header rises 2.2 mm above its front to match the own drawing's **24 × 32 × 10.2 mm** bare-unit envelope. Native holes, side reliefs, the front connector opening, rear retention recess and M5 emboss remain intact.

## Complete physical parts

A passive shaped PCB includes real mounting-boss reliefs, a central retaining through-bore, a Grove notch and four physical header solder lands. The public product description establishes a connector adapter, and the own photos show no button, LED, sensor or powered control. Two exact-M5Stack MCP queries yielded the U020 product and structure/dimension references but no own circuit schematic; unrelated U148 Grove-to-Grove, Scroll and TypeC-to-Grove schematic results were excluded. The exact M5_Hardware product directory contains only Structures. No MCU, regulator, arbitrary passives, internal electrical routing or power/signal names are invented. The concealed PCB outline/plane and solder installation remain appearance reconstruction.

The fixed orange part is a **four-pin male shrouded header**, not a removable plug. It has the own 15.8 mm width/3.96 mm pitch, side cheeks, deep rear carrier, lower channel floor, projecting upper hood with four genuine latch windows, four recessed metal male contacts and four right-angle solder tails. Its mouth has real depth; it is neither a filled block nor a free-standing bare pin row. The white Grove likewise has a deep dielectric rear carrier, real rails/latch, four independent contacts and tails. The native apertures remain open around these actual assemblies rather than being covered by print.

The exact front/package photographs separately show the supplied orange **female screw plug**. This U020-specific accessory was reconstructed from those own photos and the width/pitch datum; it is not a renamed generic HT3.96 asset with inherited dimensions. The tongue, shoulder, partitions, floor, screw access deck and four round wire-entry channels form real cavities. Eight mating springs and four recessed clamp cages provide physical metal backing. The tongue's 13.8 mm width, 3.8 mm height, 6.1 mm insertion envelope and the remaining plug package/contact dimensions are inferred appearance estimates, not production fit tolerances. The nominal outer cap material after the 0.02 mm bevel is **0.24 mm** at the outermost tongue bore; it remains positive. Actual FrontSide walls and opposed coordinate-welded edges are tested, including the tongue, shoulder, screw deck, wire-entry body and cross-recess screw heads.

The official text calls the connector HT3.96 while the product photo prints VH3.96-4P. The existing visual attachment family is named `ht3.96-4p`; that string supplies a renderer contract and does not establish mechanical/electrical compatibility with every connector carrying either name.

## Printed numbering and screw motion

Only the rear sticker is evidenced. The actual front is plain white casing and orange header, so no front PNG or invented front film is added. One **1600 × 1230** final `reference-redraw` PNG reproduces the readable upper `4 3 2 •1`, orange band, `3.96`, and lower `•1 2 3 4` with their own color blocks. [Artwork provenance](artwork.json) records the photo reference, hash, dimensions and limits. The rear physical film touches the native closed recess and remains without artwork. No photo pixels, unreadable small text, source vectors, private intake or intermediates are distributed.

Back-view upper numbering reverses in the model's front view: fixed header +X order is `1 2 3 4`. Grove front-view contact order is `4 black / 3 red / 2 yellow / 1 white`; the bottom-facing Port's local X reverses the physical front axis, which is accounted for in its `pinGrid`. These are visible pin numbers/colors, not an electrical continuity model or recommendations for GND, supply or signal assignment.

Own `396port_01.webp` clearly shows four separate cross-recess metal screw heads on the supplied female plug. Each has an external **`screw-1` … `screw-4`** joint around local +Z. Only the visible head rotates; the plug housing, contact springs, clamp cage, pressure plate, shank and Unit remain fixed. Finite external angles and optional `durationMs` are accepted, with an exact return to rest. The UI range **−180…180°** is a convenient visual preview range, **not mechanical stops**; the joints have no angle limits and are not continuous motors. Nonzero `rpm`, nonfinite angles and invalid transition arguments are rejected. Thread pitch, axial screw travel, clamp displacement/force, tightening, torque and electrical effects are not implemented.

## Agent integration

```js
import { Model, GroveModule, TerminalPlug, spec }
  from '../../../src/units/unit-396/index.js';

const unit = new GroveModule({ cableLength: 55, terminalPlug: true,
  terminalPlugAnglesDeg: [0, 0, 0, 0] });
host.port('portB').attach(unit); // an existing compatible physical Grove port
host.handle({ type: 'pose', target: 'portB/unitFrame',
  position: [15, 70, -5], rotation: [0.2, -0.1, 0.3] });
host.handle({ type: 'joint', target: 'portB/terminal/screw-2',
  angleDeg: 90, durationMs: 500 });
host.update(0.016); // visual interpolation and four physical wire curves
const plug = unit.port('terminal').detach({ dispose: false });
unit.port('terminal').attach(plug); // independently removable accessory
// Or unit.port('terminal').attach(new TerminalPlug({anglesDeg:[0,45,0,0]})).
// Detached objects remain owned by the caller; dispose them when no longer needed.
```

Exports are `Model`, `GroveModule`, `TerminalPlug` and `spec`. The body's own components are only **`grove` / `terminal`**; `terminalPlug` defaults to `false`. The common Grove module adds `unitFrame` and `cable`; its optional plug exposes **`terminal/screw-1` … `terminal/screw-4`**. A separate plug accepts `anglesDeg:[a,b,c,d]`; the Unit option is `terminalPlugAnglesDeg`. Read a head with `get('terminal/screw-1').getState()`; drive it using `type:'joint'`. There is no sensor, LED, button, display or body joint. Recursive joint lists include an attached plug's four heads.

External pose/head commands do not echo input. Ordinary attach/detach still reports port lifecycle intent. The external framework owns any signal, electrical routing, voltage/current/power, conversion, wiring, protocol or firmware behavior. Those internal commands are rejected by this appearance model.

## Necessary checks

[Local smoke](smoke.json) verifies all 3216 selected native triangles/own commit/blob, scale 1/common rigid axes, separate CAD and header-inclusive envelopes, true clear mounting and carrier bores with FrontSide walls, correct native +Z header opening and −Z closed rear wall, deep Grove and fixed male header contacts/carriers, separate four-contact female plug, 48 plug FrontSide bore checks, positive beveled cap clearance and directed closure/positive volumes for PCB and all perforated plug/head pieces, rear film seating, six entry/plug/artwork configurations with every physical attribute/index/world matrix invariant, four independent screw transitions/45/90/exact return and invalid-state preservation without axial/cage/port movement, nested four-core pose, independent peer and plug detach/refit, resource disposal and no input echo. No exhaustive browser, production-fit, mechanical tightening, electrical routing, hardware or firmware acceptance is claimed.
