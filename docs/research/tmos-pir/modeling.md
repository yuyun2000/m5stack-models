# Unit TMOS PIR U185

This is the exact U185 STHS34PF80 Unit, with a recessed rectangular package/filter window, not the old U004 PIR with its large hemispherical Fresnel lens. Model axes are millimetres: +X right, +Y away from Grove, +Z toward the sensing window. Status is `modeled`; browser visual acceptance is deferred.

The official specification table says 32×24×5.2 mm. Its own dimension drawing instead labels total thickness 8 mm, with 5.2 mm spanning the Grove-side connector height. The exact native U185 STL also measures 24×32×8 mm in model axes. The model keeps all 3,490 triangles of assembled component 0 at scale 1, under one common translation only; displaced duplicate shells 1/2 are excluded. `nominalMm`, `cadEnvelopeMm` and `visualEnvelopeMm` use the native/drawing 24×32×8 mm geometry. `vendorDimensionOrderMm` preserves the conflicting table value. The discrepancy was submitted as feedback `052dc71fcd6b48e5a17651bb4f438896`; no production-fit claim is made.

Native shell contours, capsule sensing opening, mounting bores, Grove cutout, rear label recess, central fastener recess and M5 relief are unchanged. A genuine dark PCB backs the sensing opening. The board has side mounting reliefs and a true central mechanical hole. The own schematic identifies STHS34PF80TR, XC6228D332VR-G, SRV05-4, two populated pull-up resistors and five capacitors; R3 is NC and is not populated. Regulator/protection/passive bodies and their leads are present inside the shell.

The passive STHS34PF80 assembly has a 4.2×3.2×1.455 mm maximum oriented OLGA-10L envelope, consistent with ST DS13916 Rev 2. Separate geometry represents its organic package, metal edge, actual lid aperture, recessed silicon infrared filter, internal filter support and ten underside contacts. The filter is a non-emissive reflective physical surface. The smaller filter aperture remains a real opening in the lid; the main native shell window reveals this layered package and the surrounding PCB at different depths. No sticker, broad flat fill, visible infrared glow, detection cone or beam closes the opening.

The PCB outline/installed plane, concealed population placement, lid/rim/filter details and subdimensions, package support, Grove internals, fastener installation and print registration are appearance reconstructions from same-model references. Only the shell, documented gross dimensions and manufacturer package envelope have dimensional source evidence; hidden assembly tolerances and optical behavior are not established.

## Public API

`index.js` exports `Model`, `GroveModule`, `spec` and default `Model`.

- `grove` is the physical `grove` attachment with GND/5V/SDA/SCL labels; `GroveModule` renders four wires and two plugs.
- `sensor` is a passive appearance anchor. It has no presence, motion, temperature, infrared ray, threshold, register, I2C or numeric sensor interface.
- There are no registered buttons, LEDs or joints. The exact-model references and schematic document no external user control or indicator.
- `artwork:false` removes only the printed layers and preserves every physical geometry attribute, index and world matrix for both exports.

```js
import {GroveModule} from './src/units/tmos-pir/index.js';
const tmos = new GroveModule({cableLength:80});
controller.port('grove').attach(tmos);
controller.handle({
  type:'pose', target:'grove/unitFrame',
  position:[25,90,0], rotation:[0,0,0]
});
controller.update(1/60);
```

Use the actual controller port ID in the nested target path. The external framework implements all firmware, I2C/register access, measurements, presence/motion classification, thresholds, calibration and electrical behavior. This model supplies only the real visible shell, package and cable shape.

## Artwork and checks

Two final ordinary PNGs are newly code-redrawn from exact U185 official photographs and marked `reference-redraw`: a 3280×700 front TMOS/PIR label and a 3200×2400 rear STHS34PF80/PORT.A.I2C/pin label. They include only legible same-model graphics. Typography, colors, small product pictogram and print registration are reconstructed. Printed range/target markings are artwork, not implemented detection behavior. No photograph crop, private source, vector, raw CAD, generator or conversion intermediate is distributed.

`sources.json` records exact official URLs, content hashes, native CAD commit/blob and the dimensional conflict. `artwork.json` records the two raster sources/assets. Necessary local `smoke.json` covers the native envelope and triangle preservation, true mounting paths and FrontSide material walls, the actual package/filter/PCB depth, passive API rejection of numeric commands, four-wire nested attachment/pose under a transformed ancestor, independent detach/disposal and full physical invariance without artwork. It does not establish browser acceptance, real-device behavior, optical performance or production assembly fit.
