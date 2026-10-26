# Unit RTC — U126

The official U126 page confirms **HYM8563**, a **32.768 kHz crystal** and a **built-in button battery**. The dimension drawing gives **48 × 24 × 8 mm**, two **5 mm mounting bores** on **16 mm pitch**, 12 mm above the lower edge, and a 10 × 5.2 mm Grove face. Model coordinates are millimetres, +X right, +Y top and +Z labeled front, so the normalized envelope is **24 × 48 × 8 mm**.

The native assembled double shell (STL island 0, 3580 triangles) is retained in full with a single Z-centering translation. Islands 1 and 2 are displaced individual shell copies. No native opening, mounting bore, seam, small release recess or molded detail is filled, scaled or cut. The physical PCB has open mounting-boss scallops, a real fastening hole, four real Grove solder holes and an open connector notch. The original upper shell-release opening has recessed PCB behind it; the connector mouth ends at the real recessed rear wall, preserving insertion space. No artwork masks an assembly gap.

The interior includes one HYM8563 8-lead visual package, a cylindrical crystal, HT7533/BAV74/passive packages, an unmarked coin cell, an insulating support and fixed metal contact tabs. HYM8563's official datasheet offers SOP8/MSOP8, and the schematic shows two RTC8563 alternative footprints; the model chooses one SOP8 body and does not claim simultaneous RTC population. No official internal photo or complete assembly STEP/BOM was found. **The concealed battery diameter, thickness, XYZ and tab arrangement are reconstruction estimates.** No battery part number or replaceable holder is claimed. No added exterior battery cover, Battery Port, user button, LED or moving feature is invented.

The exact battery/assembly documentation gap was submitted through the M5Stack official MCP: `feedback_id=6de3c2f2791a41c0a792a7e99457f992`. It does not block a complete exterior housing or passive visual model.

## Integration

```js
import { Model, GroveModule } from './src/units/rtc/index.js';
const rtc = new Model();
rtc.port('grove');             // HY2.0-4P, outward -Y
rtc.get('sensor', 'component'); // passive package anchor

const unit = host.port('portA').attach(new GroveModule({ cableLength: 60 }));
host.handle({ type: 'pose', target: 'portA/unitFrame',
  position: [0, 80, 0], rotation: [0, 0, 0] });
host.port('portA').detach({ dispose: false });
unit.dispose();
```

The input is labeled GND, 5V, SDA, SCL. `GroveModule` exposes shared `unitFrame`, `cable`, nested `grove` and passive `sensor`; the four physical wires follow external pose. `sensor` accepts no clock commands and returns no measurements. Time, date, oscillator, alarm, calendar, power switching, battery voltage/capacity, I2C and firmware behavior belong to the consuming runtime. There is no autonomous visual state.

## Sources and checks

`sources.json` and the product's `cad-map.json` record immutable official CAD commit/blob, SHA-256, the one shared transform, exact photo/drawing/schematic/datasheet URLs and hashes, inferred details and runtime hashes. Preserve `licenses/M5_Hardware-MIT.txt`. Raw MCP responses, STL, PDF, images, store HTML and generators remain outside the repository. No private sticker table, vector original or photo crop was used.

`smoke.json` records finite geometry/envelopes, ten clear mounting samples, twenty FrontSide native/PCB hole-wall samples, actual connector/release-opening backing, physical cell/contact presence, no unsupported battery Port or controls, passive anchor, nested Grove four-wire pose, detach and resource disposal. The native shells widen the mounting bore near their internal seam, so 5 mm FrontSide bore walls are sampled at Z=1.5 mm within the upper molded boss. Stage remains `modeled`; exhaustive browser inspection remains deferred at the user's request. Reference-redrawn front/rear artwork is now integrated ([sticker update](./stickers.md)).
