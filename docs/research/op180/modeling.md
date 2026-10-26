# Unit OP180 U058

Stage: `modeled`; browser/physical acceptance remains unverified. Millimetres: +X right, +Y toward the open optical slot, +Z plain front.

## Official facts and native shell

Own U058 product page gives 36 × 24 × 8.8 mm. Its dimension drawing separately specifies the 24 × 32 × 8 mm shell, 36 mm full length, 8.8 mm full depth including the ITR9606 package, 7.5 mm package height, 5 mm slot width, 16 mm mounting pitch and two Ø5 mounting holes. The model records the vendor order [36,24,8.8] and normalized viewer envelope [24,36,8.8]. The 32 mm native shell is not a contradictory product dimension: the fixed package extends 4 mm beyond it. Own front/rear/side photographs show a fixed U-shaped black interrupter, black Grove, plain front and one rear label.

The exact own structure path `Products/U058_Unit_OP180/Structures/Unit_OP180.stl` was retrieved at path-specific commit `dbc93013098189c8c0995e7678347b75a369a366`; bytes match Git blob `2cd2e347cc949685e384fba0dcda4adcd148cd83`. Component 0 is the complete 3254-triangle assembled front/rear shell. Components 1/2 are displaced duplicate shell halves. A common translation places the native shell at X[-12,12], Y[-18,14], Z[-4,4]. Every selected native triangle is retained unscaled, uncut and unpatched. [CAD map](../../../src/units/op180/cad-map.json) records source, transform, hashes and MIT attribution. No material dimension or product-part contradiction required official feedback.

Own schematic establishes U1 ITR9606, R1 1K, R2 20K, R3 10K, C4/C5 100nF and J1 Grove. Cable-color order is GND / 5V / NC / Digital Output. The own rear label calls the white-wire signal `IN`, which is retained as a printed connector marking; no electrical meaning is implemented. Neither the own schematic nor exterior evidence supplies a separate visible status LED. The IR emitter is a passive physical optical window, without visible emissive light, sprite, beam or fabricated detection cone.

## Physical reconstruction

The model adds a shaped PCB with real retaining bore/mounting reliefs, five schematic passive packages, four fixed ITR9606 solder leads, fixed retaining screw, black open Grove with four metal contacts, dielectric rear carrier, floor, rails and latch shoulders, and a physical rear adhesive substrate.

The black ITR9606 package contains a lower crossbar and two arms with actual recessed optical-window cavities, outer opaque caps, non-emissive opposing windows and deeper die backings. The detection slot stays **physically empty**, opens toward +Y and has the drawing's 5 mm width. Package width 14 mm, depth 6 mm, crossbar thickness 2 mm, resulting 5.5 mm slot depth, window registration and emitter/receiver handedness are inferred from own drawing/photo proportions. They are visual reconstruction, not production package/optical calibration. The two inward optical axes point along ±X; the `180` product name describes this fixed arrangement, not an articulating joint. No hinge, rotary motion or mechanical button is fabricated. Intentional empty slot and mounting bores are not closure defects.

## Agent integration

```js
import { GroveModule as Op180 } from '../../../src/units/op180/index.js';

host.port('portB').attach(new Op180({ cableLength: 55 }));
host.handle({ type: 'pose', target: 'portB/unitFrame',
  position: [15, 75, -5], rotation: [0.2, -0.1, 0.3] });
host.handle({ type: 'cable', target: 'portB/cable',
  slack: 14, bend: [0, 0, -1] });
host.update(0.016);
const appearanceAnchor = host.get('portB/sensor');
// Passive fixed-slot metadata only; no detection or value command.
```

Exports are `Model`, `GroveModule` and `spec`. Body component IDs are exactly `grove` and `sensor`; Grove wrappers also expose `unitFrame` and `cable`. `sensor` is a passive position/metadata anchor, with slot opening, fixed angle and inferred opposing optical positions. There are no `button`, `joint`, `led` or display components. External pose/cable commands do not echo input; port attachment reports normal lifecycle intent. Object occlusion, counting, digital levels, IR propagation, optical physics, values, voltage, registers and firmware behavior belong to the external runtime and are rejected as model commands.

## Artwork and necessary verification

One final ordinary 1600 × 1200 PNG is exact-model `reference-redraw`, newly drawn from readable own U058 rear marks. [Artwork provenance](artwork.json) records its source, placement and hash. The independent physical adhesive substrate remains with `artwork:false`. No product photograph was cropped into a sticker, no OP90 design was borrowed and no private source/table/mapping/vector or generator is distributed.

[Local smoke](smoke.json) checks all 3254 native triangles, shell and full physical envelopes, ten empty mounting paths, native/PCB FrontSide bore walls, positive closed directed edges for PCB and both window-cavity arms, nine empty slot paths, actual crossbar floor and both recessed opposing windows with FrontSide cavity-wall hits. It also checks physical Grove/label/screw closure; exact body API and rejected internal detection commands; all physical geometry attributes/index/world transforms with artwork on/off for both entry types; nested four-core cable pose, independent peer branch, detach, no echo and resource disposal. This is construction evidence, not browser, optical, electrical, production-fit or hardware acceptance. No exhaustive browser or historical suite was run.
