# Unit Fader U123

The [official U123 product page](https://docs.m5stack.com/en/unit/fader), retrieved through M5Stack MCP `knowledge_search` on 2026-10-26, specifies a 35 mm sliding potentiometer, centre detent, fourteen SK6812 RGB LEDs, and 64 x 24 x 22.8 mm total dimensions. The [own mechanical drawing](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/802/U123_Model_Size_page_01.png) gives a 10.4 mm shell, a 7.2 x 11.2 mm cap, mounting bore diameter 4.85 mm and 16 mm mounting pitch. Coordinates here are millimetres: +X right, +Y away from Grove and +Z towards the cap. Runtime size is [24,64,22.8].

The [official structure at the pinned M5_Hardware snapshot](https://github.com/m5stack/M5_Hardware/tree/e29c139cbc7c80b5ccc5557e5ab8025a7a19a109/Products/U123_Unit_Fader/Structures) contains assembled parts and displaced duplicates. The runtime retains components 0, 2, 4 and 7: both native shells and both light guides. The transform is a translation by [0,-20,-5.2]. No native triangles are deleted, filled or replaced by a photo. `src/units/fader/cad-map.json` records the blob, SHA-256 and exact selection. MIT attribution is preserved.

The added physical assembly includes a solid PCB with real mounting-pillar, screw and Grove reliefs; a fixed potentiometer case with side and end walls, solid floor, resistive tracks and a metal guide with a true longitudinal slit; the moving carriage, stem and sculpted grip cap; fourteen LED package bodies and independently addressable diffused lens cells; and the black HY2.0-4P socket with four physical contacts and recessed back. The rear shell's central service opening contains the PCB behind it. Concealed component dimensions, cap curvature, grip ridges and small connector walls are appearance estimates rather than production-fit CAD.

## External visual control

```js
const model = new Model();
model.handle({type:'slider', target:'slider', positionMm:12, durationMs:180});
model.update(0.18);
model.get('slider').getState(); // positionMm:12; rangeMm:[-17.5,17.5]
model.handle({type:'led', target:'rgb-1', color:'#ff4040', brightness:0.6});
```

Only the cap, stem and carriage translate. The PCB, native shells, light guides, fixed potentiometer and Grove socket stay fixed. Default zero is the documented centre detent, aligned with the geometric centre of the native front slot, [−0.006,6.837,0]. `positionMm` is a signed physical displacement along +Y, not an analog reading. Pointer dragging emits `slider` input intent (`start`, `position`, `end`); external commands emit no pointer input. This layer does not calculate resistance, ADC voltage, LED level meters, protocol state or firmware behavior. LEDs default off and never change when the slider moves.

`GroveModule` uses the same assembly with the existing visible Grove cable, unit pose and lifecycle. After attaching it under a host port named `unit`, the external path is `unit/slider` and the lights are `unit/rgb-1` through `unit/rgb-14`. Lens-cell numbering follows the [own rear photograph](https://static-cdn.m5stack.com/resource/docs/products/unit/fader/fader_02.webp), without asserting an electrical data-chain topology. Grove pin labels in cable color order are GND, 5V, RGB and Analog Input, from the official product mapping.

## Current limits and verification

Back sticker and tiny print are deferred. The service opening remains a real opening with the PCB behind it; no sticker hides missing geometry. Miniature PCB parts and hidden sliding contacts are simplified. This model has not received browser or physical-device verification and remains `modeled`.

`geometry-check.json` records the limited construction/movement smoke: finite geometry, nominal/native envelopes, ten unobstructed mounting rays, three interior/connector rays, five true stem positions across the 35 mm travel, fixed-parts invariance, independent external LED state and Grove module attach/detach/disposal. Browser review was deliberately deferred following the user's instruction to prioritize adding more Units.


Printed appearance update (2026-10-26): reference-redrawn PNG labels are included; `artwork:false` disables them while preserving all original physical geometry and controls. Sources, registered surfaces and bounded evidence: [artwork.md](artwork.md), [sticker-smoke.json](sticker-smoke.json).
