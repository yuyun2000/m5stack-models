# PaHUB v2.1 U040-B-V21

The exact-version [official documentation](https://docs.m5stack.com/en/unit/Unit-PaHub%20v2.1), [annotated photograph](https://m5stack.oss-cn-shenzhen.aliyuncs.com/resource/docs/products/unit/Unit-PaHub2.1/4.webp), [front photograph](https://m5stack.oss-cn-shenzhen.aliyuncs.com/resource/docs/products/unit/Unit-PaHub2.1/8.webp), [side photograph](https://m5stack.oss-cn-shenzhen.aliyuncs.com/resource/docs/products/unit/Unit-PaHub2.1/7.webp) and [mechanical drawing](https://m5stack.oss-cn-shenzhen.aliyuncs.com/resource/docs/products/unit/Unit-PaHub2.1/module%20size.jpg) establish the assembly. Official M5Stack MCP `knowledge_search` retrieved these sources on 2026-10-26. This model represents U040-B-V21, including its three physical DIP sliders, rather than the older resistor-configured PaHUB.

Coordinates are millimetres: +X right, +Y top, +Z toward the exposed PCB. The official 48 × 24 × 10.8 mm specification is normalized to a 24 × 48 × 10.8 mm X/Y/Z envelope. The perimeter housing is 8 mm deep. The drawing specifies two Ø5 mm mounting holes at 16 mm pitch, 12 mm from the input end, and a 10 × 5.2 mm input connector.

## Physical assembly

The fixed [official CAD source](https://github.com/m5stack/M5_Hardware/blob/e29c139cbc7c80b5ccc5557e5ab8025a7a19a109/Products/U040-B-V21_Unit_PaHub_v2.1/Structures/Unit_PaHub_v2.1.stl) has one complete assembled shell and two displaced duplicate parts. The model retains component 0, 3,498 triangles, and excludes only duplicates 1 and 2. `src/units/pahub-v21/cad-map.json` records the exact Git blob, SHA-256 and translation. Native front PCB opening, connector cutout, mounting bores, rear screw recess, molded M5 mark and shell seam remain geometry.

The opening contains a solid red PCB with mounting/screw clearances and input relief, a physical PCA9548AP package and leads, resistor-array packages, ceramic components, a fixed three-pole DIP carrier, three moving slider caps, seven complete red Grove receptacles and the rear screw. The board is a real extruded solid; no image plane closes the front window. Each socket has actual walls, an empty mouth, four short recessed metal contacts and a physical support behind them.

PCB/package thicknesses, small hidden components, connector internals, socket centres and 0.9 mm DIP travel are appearance estimates. The original-design rear label and chip-top reference label are now integrated; see [sticker update](./stickers.md). PCB traces, fine board silkscreen and exact hidden package details remain deferred. Source photos, raw CAD and generators are not redistributed. The model remains `modeled`; no exhaustive browser review is claimed.

## Connection and motion API

`grove` is the bottom input; `grove-0` through `grove-5` identify the six front-facing outputs. In front view, the upper pair is CH3 on the left and CH2 on the right. The left column is CH4 then CH5; the right column is CH1 then CH0. Their mouth normals are +Z, while the input normal is −Y. Output socket pin rows and Port frames share the same front-plane rotation. Pin metadata uses the library's cable-colour order GND/5V/SDn/SCn, not the schematic's J1–J7 pin-number convention. This metadata does not implement a bus.

Both standalone `Model` and cable-wrapped `GroveModule` accept downstream Grove Modules at all six outputs. Existing recursive routing, independent detach, four-wire cable rendering and `unitFrame` pose APIs apply at each nesting level:

```js
import {Model, GroveModule} from './src/units/pahub-v21/index.js';
import {GroveModule as GPS} from './src/units/gps-v11/index.js';
import {GroveModule as Weight} from './src/units/weight-i2c/index.js';

const unit = new Model();
const a = unit.port('grove-0').attach(new GPS({cableLength: 65}));
const b = unit.port('grove-4').attach(new Weight({cableLength: 80}));
a.get('unitFrame').setPose({position: [42, 80, -8], rotation: [.2, .1, -.2]});
unit.handle({target: 'dip-1', action: 'position', position: 1});
unit.port('grove-0').detach(); // CH4 and its cable remain attached.

const hub = host.port('grove').attach(new GroveModule({cableLength: 90}));
hub.port('grove-2').attach(new GroveModule({cableLength: 95}));
host.handle({target: 'grove/grove-2/dip-2', action: 'position', position: 1});
host.get('grove/grove-2/unitFrame').setPose({rotation: [.1, .2, 0]});
// Tick host.update(dt, time), or let DeviceViewer drive interpolation.
```

The `dip-1`, `dip-2` and `dip-3` controls are stable `Button` sliders. `position: 0 | 1` drives the visible cap; pointer or `Digit1`–`Digit3` input toggles it on standalone models. Releasing input keeps the detent. Their visual detents do not calculate an I2C address or switch any channel. This library provides no I2C communication, registers, power distribution, sensor data, firmware or electrical behavior.

`smoke.json` records the bounded construction check: finite geometry, complete envelope, all seven outward connector frames and real contact depths, open mounting bores, a FrontSide PCB bore wall, three independent stable sliders, two downstream cable assemblies, recursive paths, selective detach, standalone/cabled Hub outputs and resource disposal. Browser inspection was intentionally deferred following the user's request to continue Unit expansion.
