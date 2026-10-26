# Unit Fingerprint2 — U203

U203 uses the **A-K323CP semiconductor capacitive fingerprint module** and **STM32G031G8U6**. It is not an optical fingerprint reader. The official drawing gives 40 × 24 × 8 mm, a sensor centre 28 mm from the bottom, and two 4.85 mm mounting holes on 16 mm pitch. Model coordinates are millimetres, +X right, +Y toward the round top, +Z toward the sensing surface: **24 × 40 × 8 mm**.

The native assembled front and back shells and blue-power light guide are kept in full, with one translation and no scale, clipping or independent alignment. The displaced duplicate components are omitted. The circular aperture contains a real matte solid sensing surface, volumetric black package/carrier, annular diffuser, emitter and substrate. The rear opening is backed by a real PCB/module assembly. Mounting holes, bore walls, seam and Grove mouth remain physical openings. No photograph or artwork fills an assembly gap.

The internal PCB contour/Z/thickness, sensor package envelope and hidden construction, diffuser section, passives/MCU placements, screws and connector interiors are appearance reconstructions. The exact module mechanical drawing and a complete production STEP were not available. They are not manufacturing-fit claims. `sources.json` and `cad-map.json` record immutable source URLs, hashes, selections and inferences; preserve `licenses/M5_Hardware-MIT.txt`.

## Agent integration

`Model` and `GroveModule` use the standard ComponentHost API. The Unit exposes:

- `grove`: cyan HY2.0-4P PORT.C, four physical contacts/wires; metadata GND, 5V, UART_RX, UART_TX follows the official table.
- `ring-led` (`led`): physical annular RGB diffuser, external colour/on/brightness, defaults off. Official library lists blue, green, cyan, red, purple, yellow and white. Only appearance is driven; no protocol or built-in breathing/recognition feedback is implemented.
- `power-led` (`led`): independent **fixed-blue** power indicator; external on/brightness, defaults off. Colour overrides remain blue. Uses the complete native light guide.
- `sensor` (`component`): passive capacitive-surface location anchor. No accepted sensor commands, data or input events. The surface has no mechanical travel. Independent touch input was not confirmed by the product/API sources, so no touch button is invented.

```js
const unit = new GroveModule({ cableLength: 60 });
host.port('portC').attach(unit);
host.handle({ type: 'pose', target: 'portC/unitFrame', distance: 70 });
host.handle({ type: 'led', target: 'portC/ring-led', color: '#00ffff', brightness: 0.6 });
host.handle({ type: 'led', target: 'portC/power-led', on: true });
```

`unitFrame` and `cable` support the existing nested pose/connection interface. Light commands emit no input intent and do not change each other or the sensing face. There is no fingerprint acquisition, biometric image/template, registration, identity/database, recognition, UART, power model or electrical state. Those functions belong to the external runtime.

## Necessary checks

`smoke.json` records finite geometry, native shell envelope, ten clear mounting samples, FrontSide bore and open-boss walls, solid front face/ring and rear PCB backing, independent RGB/fixed-blue outputs, passive anchor restrictions, four-wire Grove attachment/pose/nested command/detach and resource disposal. Stage remains `modeled`; exact supplied raster artwork is now applied (see `STICKERS.md`); exhaustive browser review remains deferred at the user's request. No private sticker table, source vector or cropped photographic artwork is distributed.
