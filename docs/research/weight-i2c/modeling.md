# Unit Weight-I2C U180

Implemented 2026-10-26 from the exact U180 official structure, mechanical drawing, photographs and official product documentation. Coordinate convention: millimetres, +X right, +Y terminal end, +Z front.

- [Official documentation](https://docs.m5stack.com/en/unit/Unit-Weight%20I2C)
- [Official structures](https://github.com/m5stack/M5_Hardware/tree/e29c139cbc7c80b5ccc5557e5ab8025a7a19a109/Products/U180_Unit_Weight-I2C/Structures)
- [Mechanical drawing](https://static-cdn.m5stack.com/resource/docs/products/unit/Unit-Weight%20I2C/img-c48c5579-3111-4266-8f9b-9e748e4bccef.jpg)
- [Front photograph](https://static-cdn.m5stack.com/resource/docs/products/unit/Unit-Weight%20I2C/img-a4d8bc9a-3926-4265-b108-6501b25fcf3d.webp)
- [Back photograph](https://static-cdn.m5stack.com/resource/docs/products/unit/Unit-Weight%20I2C/img-da7c0ae5-b2ca-4371-9d0a-1b7e06b262f5.webp)
- [Terminal opening photograph](https://static-cdn.m5stack.com/resource/docs/products/unit/Unit-Weight%20I2C/img-d890ef48-fe47-4ae6-bc79-4e920f913e53.webp)
- [Schematic](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/632/SCH_UNIT_WEIGHT_I2C.pdf)

The normalized geometry retains the native assembled shell, seam, M5 embossing, front terminal opening, bottom Grove bay and the two 5 mm installation bores at X ±8, Y −4. `cad-map.json` selects the complete assembled component; displaced duplicate cover parts are excluded. Official CAD derivatives retain the M5_Hardware MIT license.

The mechanical drawing gives 24 × 32 mm, 8 mm shell thickness and 11.3 mm assembled depth. The exact native STL independently measures 24 × 32 × 8 mm. The same product page's prose table instead lists 56 × 24 × 11.3 mm. The model follows the drawing and CAD. This discrepancy is retained in `spec.source.conflict`; the prose length has not been silently treated as an assembly dimension. Official knowledge feedback was accepted on 2026-10-26 as `c4af152d60934b4181334891e8da6f44`; no official correction or physical measurement has been received.

The assembly adds a bored PCB, representative enclosed STM32/HX711 packages, a complete open-top HY2.0-4P socket with recessed contacts, and the orange fixed HT3.96-4P socket with floor, walls, inspection windows, leads and retention ears. Local PCB outline, package placement, connector walls and contact depth are photograph-derived appearance estimates; they are not manufacturer production-fit dimensions. No photograph plane closes the enclosure.

`Model` is the standalone device; `GroveModule` supports the existing physical Grove cable/pose attachment API. Port metadata records PORT.A (1 SCL, 2 SDA, 3 5V, 4 GND) and the top four-pole load-cell terminal. The front photograph prints left-to-right A+, A−, E−, E+; schematic P1 uses S+, S− for the first pair, so both terms are recorded. The default address 0x26 is documentation metadata only. There is no sensor, electrical, firmware, calibration or I2C implementation.

The supplied removable terminal accessory is now available through `terminalPlug:true` or the exported `TerminalPlug`; see [the accessory source, API and limitations](terminal-accessory.md). Front/back printed labels remain deferred. The product is `modeled`, with limited local geometry/API checks; no new browser acceptance was requested or performed.

The limited smoke check passed: finite mesh coordinates, 24 × 32 × 8 mm CAD envelope, two unobstructed installation axes, visible inward PCB bore walls using `FrontSide`, four real inspection windows, terminal geometry covering the native front aperture, documented port metadata, and Grove module attachment, external pose change, detach and disposal. This is not a full-suite or visual-acceptance claim.


Printed appearance update (2026-10-26): reference-redrawn PNG labels are included; `artwork:false` disables them while preserving all original physical geometry and controls. Sources, registered surfaces and bounded evidence: [artwork.md](artwork.md), [sticker-smoke.json](sticker-smoke.json).
