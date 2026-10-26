# Unit Joystick2 — U024-V2

This is the 40 × 24 × 23.9 mm Hall electromagnetic **Joystick2**, with the red 20 mm thumb cap, Z push button and one WS2812C. It is distinct from U024-C Joystick v1.1. The official U024-V2 front/rear shell, cap and RGB light pipe are retained at one native assembly transform. Four laterally displaced duplicate parts are excluded. No shell cutting, scaling or independent realignment was used. The native full envelope is 24 × 40 × 23.87865 mm. The CAD shell body is 13 mm deep while the product drawing labels 12 mm; the supplied CAD remains unchanged.

The open shell is occupied by a real PCB, fixed JH16 appearance package, ball gimbal, stick shaft, connector walls and contacts. Mounting bores and Grove entrance remain physical openings. Concealed parts and installed positions are appearance reconstructions from official photos, not production tolerances. Exact immutable CAD URL, commit, source hash, photo/drawing hashes and translations are in `sources.json` and `src/units/joystick2/cad-map.json`. Preserve `licenses/M5_Hardware-MIT.txt`.

## External visual API

```js
import { Model, GroveModule } from '../../../src/units/joystick2/index.js';
const unit = new Model();
unit.handle({ type: 'joint', target: 'tilt-x', angleDeg: 12, durationMs: 300 });
unit.handle({ type: 'joint', target: 'tilt-y', angleDeg: -10, durationMs: 300 });
unit.button('press').press('pointer:1');
unit.button('press').release('pointer:1');
unit.led('rgb').set({ color: '#00cc88', brightness: 0.6 });
unit.on('input', ({ id, action }) => { /* id=press, actions down/up/click */ });
```

`tilt-x` and `tilt-y` rotate around the model's +X and +Y axes at the inferred gimbal centre. Their ±18° limits and `press` travel of 0.4 mm are **viewer approximations**, not official mechanical stops, electrical output ranges or real-device calibration. Cap, shaft and gimbal move together; the package, PCB, Grove socket and RGB light pipe stay fixed. Use `unit.update(dt)` outside a viewer to advance interpolation and cap return. Set both joint angles to zero to restore the native neutral pose. External joint/LED commands emit no user input; button interaction emits input intent. Cancellation releases the cap without a click.

`new GroveModule({ cableLength: 60 })` attaches to a compatible Grove Port with four posed wires. For a host port `unit`, route the same calls through `unit/tilt-x`, `unit/tilt-y`, `unit/press` and `unit/rgb`. Detachment preserves the Unit until explicitly disposed. The `sensor` component is a visual anchor only. There are no Hall readings, ADC values, I2C/registers, GPIO, firmware or electrical simulation. Native RGB geometry accepts external color and brightness only.

`smoke.json` records finite construction/envelopes, 10 mounting-ray checks, FrontSide PCB bore normals, four closure rays, actual native cap tilt interpolation and reset, press/release/cancel return, fixed-part retention, external/input separation, nested Grove commands, four wires, detach and disposal. Stage remains `modeled`. No browser or physical-hardware acceptance was performed. Reference-redrawn labels are now included; see `artwork.md` and `sticker-smoke.json`. no private CSV, vector source or photographic sticker crop was used.


Printed appearance update (2026-10-26): reference-redrawn PNG labels are included; `artwork:false` disables them while preserving all original physical geometry and controls. Sources, registered surfaces and bounded evidence: [artwork.md](artwork.md), [sticker-smoke.json](sticker-smoke.json).
