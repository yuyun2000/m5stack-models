# Unit DLight U136

This is the 32×24×8 mm **Unit DLight U136**, not Hat DLight U134 or the adjustable analog Unit Light U021. In model axes the envelope is24×32×8 mm: +Y points away from Grove and +Z toward the optical window. Status is `modeled`; browser visual acceptance is deferred.

The exact U136 official STL contributes all3,216 triangles of its assembled component0 at scale1. One translation and a proper180° Y rotation orient the part; displaced duplicate shells1/2 are excluded. Native front/rear contours, mounting bores, optical opening, Grove cutout, rear sticker recess and M5 relief are retained. The dimension drawing specifies a2.9×5.7 mm optical opening,16 mm mounting pitch and nominalØ5 mm mounting bores; the original faceted bores are preserved without rounding or remeshing.

A physical white PCB backs the optical opening. Its outline includes side mounting reliefs, the central mechanical hole and eight actual drilled unpopulated P1/P2 solder pads. The pads are concealed manufacturing detail and are not public ports. The BH1750FVI-TR contains a separate substrate, passive dark die, six metal leads and non-emissive transparent optical resin. The manufacturer WSOF6I drawing gives a1.6×3 mm package with0.75 mm maximum height. The package is recessed below the front shell. No broad black sheet, sticker, glowing emitter or light beam covers the opening. The assembly also contains HT7533, three resistors, four capacitors, the fixed hex screw and a genuine open four-contact red Grove socket.

The PCB installed plane, hidden packages/population positions, internal die/resin rendering, Grove internals, fastener installation and print registration are visual reconstructions from same-model photographs, schematic, package drawing and shell dimensions. They are not production-fit or optical-performance validation.

## Public API

`index.js` exports `Model`, `GroveModule`, `spec` and default `Model`.

- `grove` is the physical `grove` attachment with GND/5V/SDA/SCL labels and a four-wire cable when used as `GroveModule`.
- `sensor` is a passive appearance anchor. It exposes no illuminance/lux, conversion, calibration, optical or electrical commands.
- There are no registered buttons, LEDs or joints. The same-model references show no user-operated mechanism or external indicator.
- `artwork:false` removes the rear print and preserves every physical attribute/index buffer and world matrix.

```js
import {GroveModule} from './src/units/dlight/index.js';
const dlight = new GroveModule({cableLength:80});
controller.port('grove').attach(dlight);
controller.handle({
  type:'pose', target:'grove/unitFrame',
  position:[25,90,0], rotation:[0,0,0]
});
controller.update(1/60);
```

The attachment path above assumes the controller's port ID is`grove`; use the actual host port ID. Firmware, I2C, sensor values, light/lux/ADC conversion, voltage and optical simulation belong to the external framework.

## Artwork and evidence

One2560×1920 rear PNG is code-redrawn from the exact official U136 rear photograph and marked`reference-redraw`. The printed face contains DLIGHT, BH1750FVI-TR, PORT.A.I2C and the SCL/SDA/5V/GND color strip. The front is unprinted in the references, so no front label is invented. Final ordinary PNG only; no photograph crop, vector, generator, raw CAD or conversion intermediate is distributed.

The official schematic depicts the sensor exposed pad on GND, whereas the linked ROHM Rev.D document page16 item10 says to leave the exposed central pad unsoldered/unconnected. This does not prove the real PCB footprint connects the pad. The discrepancy was submitted for clarification as`da4b7c91844c46b89ae2a29951908a79`; this model makes no electrical implementation claim.

See `sources.json` for exact official URLs and source hashes, `artwork.json` for raster provenance and `smoke.json` for necessary local checks: native envelope, true through-paths and FrontSide hole walls, actual optical package/PCB backing, passive boundary, four-wire cable pose, independent detach, resource disposal and physical invariance without artwork. These checks do not establish browser acceptance, real-device behavior or production fit.
