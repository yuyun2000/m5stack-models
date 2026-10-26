# Unit Mini IMU — U095

Official M5Stack product documentation and dimension drawing specify **24 × 24 × 8 mm**, **MPU6886**, two **5 mm mounting bores** on **16 mm pitch**, and one red **HY2.0-4P I2C** connector. Coordinates use millimetres, +X right, +Y top and +Z labeled front. Mount centers are (−8, 0) and (+8, 0). There are no documented external user buttons, LEDs, moving caps or joints.

The complete native assembled shell, component 0 with 4178 triangles, is retained under one rigid translation. Components 1 and 2 are laterally displaced individual copies (2656 + 1522 triangles); they are excluded rather than independently repositioned. No shell is scaled, cut, filled or flattened. Original mounting bores, connector cutout, mold seams, top release slot, label recesses and rear embossed maker mark remain intact. The mounting bores retain the source tessellation: radial wall samples are approximately 2.438–2.5 mm from the stated centers, rather than replacing the official faceted surfaces with synthetic cylinders.

The rear PCB photo supports the chamfered board outline, open side scallops, central fastening bore and four Grove solder holes. These are actual holes with FrontSide wall normals. The top shell-release slot has the recessed PCB edge behind it; the Grove mouth remains a real insertion cavity ending at the socket's rear wall and four metal contacts. A real fastening head/shank, PCB, MPU6886 QFN visual package, HT7533, two BSS138 packages and passives form the concealed assembly. PCB thickness/Z, component envelopes/positions and connector interior details are inferred for visual closure. No production PCB/assembly STEP, concealed silkscreen or manufacturing fit is asserted.

Three high-resolution PNG reference redraws are included in this same model batch: front IMU/MPU6886 label, front XYZ axis circle and rear PORT.A/I2C pinout. See [artwork](./artwork.md). They project onto existing source shell triangles and do not close any hole. `artwork:false` removes only printed triangles. The physical housing remains 24 × 24 × 8 mm; the front axis label receives the shared 0.008 mm decal offset, giving a displayed Z envelope of approximately 8.008 mm.

## Integration

```js
import { Model, GroveModule } from './src/units/mini-imu/index.js';
const imu = new Model();
imu.port('grove');              // physical I2C socket, outward −Y
imu.get('sensor', 'component'); // passive MPU6886 package anchor

const module = host.port('portA').attach(new GroveModule({ cableLength: 60 }));
host.handle({ type: 'pose', target: 'portA/unitFrame',
  position: [20, 80, 0], rotation: [0.2, 0, 0] });
host.port('portA').detach({ dispose: false });
module.dispose();
```

`GroveModule` exposes shared `unitFrame`, `cable`, nested `grove` and passive `sensor`. Pins are GND, 5V, SDA and SCL. Four real wires and two plugs follow the externally chosen pose. The sensor anchor returns no measurements and accepts no IMU, acceleration, gyro, temperature, calibration or tilt commands. Inertial values, sensor fusion, I2C, firmware, electrical and rigid-body behavior belong to the consuming runtime. No autonomous visual effect is invented for this passive Unit.

`sources.json` records immutable CAD commit/blob, SHA-256, exact official reference URLs, one common transform, artwork assets and runtime hashes. Preserve `licenses/M5_Hardware-MIT.txt`. Raw source assets and generators are not distributed. `smoke.json` covers necessary finite/envelope checks, 10 clear mounting rays, 8 native bore wall samples, 10 PCB bore wall samples, actual release/connector backing, passive API, four-wire pose, detach/disposal and three registered PNGs. Stage is **modeled**; browser inspection, production fit and hardware behavior are not claimed.
