# Unit 8Servos U165

Implemented the original U165, not the U222/U223 8Servos2 variants. Model coordinates are millimetres, +X right, +Y power-terminal end and +Z the male-header side.

Official product and schematic material was retrieved through the M5Stack MCP `knowledge_search` on 2026-10-26. The official [product page](https://docs.m5stack.com/en/unit/8Servos%20Unit) gives 55 × 24 × 10.5 mm. Its [mechanical drawing](https://static-cdn.m5stack.com/resource/docs/products/unit/8Servos%20Unit/img-2eae2b86-5d70-4245-9511-36a8efa3098f.jpg) separately marks an 8 mm shell, 10.45 mm terminal height and 11.5 mm male-pin envelope. The runtime uses [24, 55, 11.5] for the complete visual envelope and preserves [24, 55, 10.5] as the nominal table dimensions.

The two mounting axes are X = ±8, Y = −15.8 mm, matching the drawing's 16 mm pitch and 11.7 mm distance from the bottom end. Their approximately 4.92 mm bores remain open through the native shells and the reconstructed PCB. The PCB also clears the outside of the native mounting pillars and the central rear screw boss.

## Native shell

The [official U165 structure](https://github.com/m5stack/M5_Hardware/tree/e29c139cbc7c80b5ccc5557e5ab8025a7a19a109/Products/U165_Unit_8Servos/Structures) contains four connected components: an assembled pair and displaced duplicates. Runtime geometry preserves components 1 and 2, with 3,132 and 1,940 triangles respectively. No native triangles are deleted or replaced with a planar cover. `src/units/8servos/cad-map.json` records the source SHA-256 and the translation from native coordinates. Official CAD derivatives retain the M5_Hardware MIT attribution.

## Added physical assembly

- Solid 0.8 mm PCB with outline relief for the mounting pillars, central screw boss and Grove connector.
- Four yellow 3 × 2 male-header blocks and 24 gold square contacts with tapered tips, as shown in the [official front photograph](https://static-cdn.m5stack.com/resource/docs/products/unit/8Servos%20Unit/img-884ad9cd-e07b-4cbd-8f36-eb00b6ae5898.webp).
- Orange HT3.96-4P fixed power socket with solid floor, back and side walls, real roof inspection windows and recessed contact pins. This U165 socket is a terminal connector rather than a barrel DC jack.
- Red open-top HY2.0-4P connector with a recessed physical back, side rails, short latch tongue and four contacts.
- Rear screw and recessed MCU package. Concealed PCB/package dimensions and connector wall dimensions are appearance estimates derived from the drawing and photographs, not manufacturing or fit tolerances.

`Model` and `GroveModule` use the same physical assembly. The module supports the existing Grove cable and pose mechanism. `grove`, `terminal` and `servo-0` through `servo-7` provide physical mating frames only. There is no PWM, servo physics, firmware, register, current-sensor or power-switch simulation. Servo connector row identity and pin names follow the official [U165 schematic](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/620/SCH_UNIT_8Servos_V1.01.pdf).

## Current limits

The front/back labels and power-connector labels are deferred. The supplied removable HT3.96-4P screw plug is available through the optional `terminalPlug: true` configuration or an explicit `TerminalPlug` attachment; see [accessory sources and API](terminal-accessory.md). The closed native shell, fixed connectors and PCB are available now; no photo or artwork plane is used to conceal an assembly gap. Very small internal packages and the debug interface remain simplified.

`geometry-check.json` records the limited local geometry/API smoke: finite vertices, envelopes, ten mounting-clearance rays, four assembly rays, ten correctly oriented physical ports and Grove module attach/detach. It is not browser or hardware verification. Stage remains `modeled`; browser review was intentionally deferred following the user's request to prioritize more Units.


Printed appearance update (2026-10-26): reference-redrawn PNG labels are included; `artwork:false` disables them while preserving all original physical geometry and controls. Sources, registered surfaces and bounded evidence: [artwork.md](artwork.md), [sticker-smoke.json](sticker-smoke.json).
