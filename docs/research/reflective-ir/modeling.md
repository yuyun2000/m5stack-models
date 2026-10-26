# Unit Reflective IR U175

This model uses the exact U175 references, rather than Unit IR U002. The manufacturer gives32×24×12mm; model axes are24×32×12mm, with +Y away from Grove and +Z toward the optical domes. The native shell is8mm deep; its two physical lens packages extend the complete assembly to12mm. Stage is `modeled`, with browser visual acceptance deferred.

The exact official STL component0 supplies a complete assembled24×32×8mm shell at scale1 under one translation. Components1/2 are displaced duplicate front/rear shells. The original3302 triangles include native mounting bores, two optical openings, Grove cutout, rear label recess and molded M5 relief. All native surfaces are retained except a local rear access-hole reconstruction: the own official rear photographs and dimension drawing show a real screwdriver hole at[0,8], which the distributed shell omits. Three original rear-wall triangles are split around a photo-inferredØ1.6mm,48-sided access cylinder; its true inward bore wall is added between Z−3.8 and−2.9. The result has3546 shell triangles. This limited repair is explicitly recorded in `cad-map.json`; the aperture is not a printed dark circle.

The complete assembly adds a physical white PCB with a central mechanical bore and open mounting reliefs. D4 is a clear non-emissive resin emitter barrel/dome, D3 is a dark non-emissive receiver barrel/dome, both with actual bases, internal die/leadframe backing and two metal leads. The own drawing gives10.2mm optical pitch,16mm mounting pitch and nominalØ5mm mounting bores. The clear package remains visibly passive; there is no invented human-visible IR glow or beam. The physical R4 trimmer body sits behind its real rear access, with a recessed slotted moving metal head, shaft and three connections to the PCB. The unit also contains LM393DR2G, HX6306P332MR, passive-package population, D1 RED0603, a fixed retaining screw and a real open four-contact black Grove socket.

PCB installed plane/outline, concealed component locations, passive-package placement, lens internals/leadframes, trimmer body/head/access diameter, Grove internals, fixed fastener installation and label registration are appearance reconstructions. The official schematic confirms component identities, but no bare-board assembly datum or exact hidden component coordinates were available. D1 is modeled on the PCB inside the shell: no external LED window or exterior halo is invented.

## API

`index.js` exports `Model`, `GroveModule`, `spec` and default `Model`.

- `grove` is a physical `grove` attachment with GND/5V/DO/AO pin labels. `GroveModule` includes four separately modeled cable cores and two plugs.
- `sensor`, `emitter` and `receiver` are passive appearance anchors with no measurement or optical commands.
- `threshold` is a `VisualJoint` driving only the real R4 screwdriver-head shape. It accepts `angleDeg` and optional `durationMs`, has a conservative visual range−135…135°, and rejects nonzero RPM. This range is not a confirmed mechanical stop/angle calibration. It does not map angle to resistance,voltage,sensitivity,distance or AO/DO.
- `status-led` accepts independent external on/brightness and remains fixed red. It defaults off, is physically concealed by the assembled shell, and suppresses screen-space halo. It does not follow trimmer position or sensor/comparator state.
- There is no registered button. No sensor values, GPIO/ADC conversion, electrical comparator,threshold voltage,firmware or optical simulation is implemented.
- `artwork:false` removes the two prints and preserves all physical geometry attributes/index buffers and world matrices.

```js
import {GroveModule} from './src/units/reflective-ir/index.js';
const unit = new GroveModule({cableLength:80});
controller.port('grove').attach(unit);
controller.handle({type:'joint',target:'grove/threshold',angleDeg:35,durationMs:70});
controller.handle({type:'led',target:'grove/status-led',on:true,brightness:0.4});
controller.update(0.07);
```

Use the actual controller port ID in the nested target path. External commands do not emit input echoes. The finite head angle and red LED are independent.

## Artwork and evidence

Two final ordinary PNGs are newly code-drawn from readable own-model official photos and marked `reference-redraw`: a1600×1600 front emitter/receiver-symbol circle and a2560×1920 rear Reflective IR, MIN/MAX, PORT.B.I/O and pin-color label. The rear raster has a transparent access-hole region and is projected only onto existing physical shell triangles. It cannot bridge or fill the trimmer bore. No product-photo crop, unreadable serial/QR content, vector source, raw CAD, generator, private mapping or conversion intermediate is distributed.

The official description prints the contradictory expression `0.3V≥1.65V≤2.15V`. A second product MCP query reproduced it; the surrounding text discusses lower-than0.3V and greater-than2.15V boundaries. The notation was submitted for correction under feedback ID `284ffb97bc824e248cc5aaf576c7e665`. This model does not interpret it as a voltage implementation or infer angle calibration.

See `sources.json` for source URLs/hashes and the explicit local CAD modification; `artwork.json` for final raster provenance; `smoke.json` for necessary native envelopes, through-paths and FrontSide bore walls, real dome/access backing, finite-angle/RPM rejection, independent fixed-red drive, passive boundaries, no input echo, artwork physical invariance and four-core nested Grove attachment/pose/detach/disposal. These checks do not establish browser visual acceptance, production fit, electrical/optical performance or physical-device behavior.
