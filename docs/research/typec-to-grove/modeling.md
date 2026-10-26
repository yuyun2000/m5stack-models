# Unit TypeC to Grove U151

Stage: `modeled`; browser visual and physical acceptance remain unverified. Millimetres: +X front right, +Y top printed banner, +Z three actual Grove mating mouths. This is the exact **U151 three-port passive Type-C power/signal adapter**, not A140 Grove-to-USB-C, Grove Converter or a generic USB data interface.

## Own native casing and complete exterior

The official table gives **32 × 24 × 10.8 mm** in length/width/thickness order. Its own dimension drawing distinguishes **24 × 32 × 8 mm** casing and **10.8 mm** total depth including the three front-projecting Grove sockets, **10 mm** socket length, **5.2 mm** socket height, **7.5 mm** socket pitch, Ø5 mounting holes at 16 mm pitch and 12 mm from the bottom.

Own path `Products/U151_Unit_TypeC_to_Grove/Structures/Unit_TypeC to_Grove.stl` was retrieved at path-specific commit `a9ac25ce7325a37b03b3f4457a6f45caf3b058dc`, verified Git blob `869f5a4642334b25657fc6c35ae210b36414c19e` and the source SHA-256 in the [CAD map](../../../src/units/typec-to-grove/cad-map.json). Component 0 contains the complete assembled **3250-triangle** front/rear shell; components 1/2 are displaced 1660/1590-triangle duplicate halves. All selected source triangles remain intact at scale 1, identity axes and one common translation from the CAD's displaced coordinates. No original faces are cut, filled, patched, scaled or independently moved. Own original +Z connector apertures and −Z rear/M5 face already agree with the model; no 180° rotation is needed.

Three real upright white sockets fill the original three front apertures. Their +Z mouths are at **X −7.5/0/+7.5, Y 5.5, Z 6.8**. Each includes actual molded end/side walls, genuine latch-side opening and shoulders, a deep dielectric floor, four separate metal pins with rounded tips and four solder tails. Their length runs along model Y, unlike the common horizontal bottom-facing Unit socket. Contact row/cable frame rotation is explicitly accounted for: local cable +Y points model +Z, increasing contact-row local X points model −Y, and the latch faces model −X. Native casing remains visible between the three actual openings; no replacement front plate is added.

The bottom USB-C fills the own native open notch with a true annular rounded metal shell, retained insulating tongue, deep dielectric carrier, contact-finger envelopes and mounting tabs. The own CN1 schematic exposes six power/CC/GND terminals and no USB data pins. Six physical contact envelopes are an appearance reconstruction around that evidence, not a confirmed connector BOM or electrical pin-position map. The model offers physical USB-C attachment only, with no enumeration, data, power switching, charging or current model.

The passive shaped PCB has actual mounting-boss and USB reliefs, a retaining through-bore and twelve drilled Grove solder holes with inner plated barrels and annular lands. Each independent pin passes through its own drill location; tests inspect the carrier and barrel separately from its intentional metal pin. Only the two evidenced 5.1 kΩ CC resistor packages are added. No active IC, regulator, arbitrary protection, LED or control is invented. Hidden board plane/outline, solder geometry and installed package dimensions are appearance estimates; they do not claim PCB manufacturing tolerances. The retaining screw has a closed annular metal head with a real blind hex socket, floor and concealed shank. Head angle, tightening, axial screw motion and force are not exposed.

## Pin-label conflict and scope

The official product table labels INPUT CH **Black=NC**, Red=NC, Yellow=S2, White=S1. The exact original schematic explicitly connects **CN2 pin 4 GND** to common CN3/CN4/USB GND while only CN2 VDD/pin3 is crossed out. The own assembled rear sticker likewise prints GND in the input column and draws the ground arrows across the three ports. Both a source-image check and a second targeted official MCP query retain this unresolved conflict. It was submitted through official documentation feedback and accepted as **`a76adbcaf39a4038ae3bdd319b2f6e26`**.

All four physical input contacts remain modeled. Metadata records `GND print/schematic; NC table,unconfirmed` for the black contact, `NC` for red, and the visible S1/S2 names for the white/yellow row. Output ports use the own printed S1/S2/5V IN/GND labels. These are source/appearance labels, not an electrical route graph, a recommendation for grounding, a live power source or proof of the advertised 3 A rating. The model never forwards power, pin values, sensor values, I2C/UART or USB behavior between its ports.

There is no actual exterior button, sensor acquisition surface, display, LED, moving mechanism or detachable custom accessory. No particulate/air/power animation or synthetic reading is introduced. All four real attachment locations exist independently.

## Three actual adhesive films

Own front and rear photographs establish three separate labels: the rounded top SIGNAL INPUT/orange POWER OUTPUT and SIGNAL OUTPUT banner, the small DC/5V INPUT/red-arrow label between the sockets and USB notch, and the rear TypeC2Grove pin/color/arrow diagram. Three final ordinary **2140 × 500**, **780 × 870** and **1600 × 1230** `reference-redraw` PNGs reproduce these readable marks. The banner's real shape follows the top corner region; the central tag remains clear of the mounting holes and USB notch. Front substrates touch native Z4 support and rear substrate touches native Z−3.8 support. The three physical films remain when `artwork:false`; no ink covers an actual connector opening or substitutes for missing structure.

[Artwork provenance](artwork.json) lists own references, final hashes, physical registration and limits. Typeface/color/registration are reconstructed, the source's input-GND conflict remains explicit, and no unreadable small text or product-photo pixels are invented. Vectors, generators, original evidence and private intake remain outside the distribution.

## Agent integration

```js
import { Model, GroveModule, spec }
  from '../../../src/units/typec-to-grove/index.js';

const adapter = new GroveModule({ cableLength: 60 });
host.port('portA').attach(adapter); // canonical input is the actual left socket
adapter.port('out-1').attach(firstGroveModule);
adapter.port('out-2').attach(secondGroveModule);
host.handle({ type: 'pose', target: 'portA/unitFrame',
  position: [15, 80, -5], rotation: [0.2, -0.1, 0.3] });
host.update(0.016); // actual independent four-wire curves
// Attached downstream modules have their own unitFrame/cable when applicable.
const detached = adapter.port('out-1').detach({ dispose: false });
adapter.port('out-1').attach(detached);
// adapter.port('usb') is the physical bottom power-only USB-C attachment.
```

Exports are only `Model`, `GroveModule` and `spec`. Own public components are **`grove` / `out-1` / `out-2` / `usb`**. The common Grove module adds `unitFrame` and `cable`, with a cable fitted to the actual left INPUT socket. A nested output's child address is, for example, `portA/out-1/unitFrame`. There is no sensor anchor, button, LED, display, joint, direct-entry or accessory class. Whole-unit/cable pose commands do not echo input; port lifecycle events retain core behavior. Detach with `{dispose:false}` transfers disposal responsibility to the caller.

## Necessary checks

[Local smoke](smoke.json) verifies own commit/blob and all 3250 native triangles, unscaled/common axes, separate 8 mm casing and 10.8 mm assembled envelopes, whole-assembly clear mounting bores, true retaining/twelve solder bores with **76 FrontSide wall checks** and positive material clearance, opposed coordinate-welded edges/positive volumes for PCB, all twelve plated barrels/lands, annular USB shell and blind-hex head, three actual four-contact upright sockets/rounded tips/deep floors and correctly rotated pin picking/cable mating axes, original casing between apertures and direct film seating, all physical attributes/index/world matrices invariant for Model/GroveModule without artwork, two real independent four-core downstream branches/nested pose/peer stability/detach/resource disposal and internal electrical/protocol command rejection. No exhaustive browser visual, production-fit, USB data, power/ground continuity, current-rating, firmware, physical hardware or electrical acceptance is claimed.
