# Unit ByteSwitch U191

Official M5Stack MCP product evidence retrieved 2026-10-26 confirms eight independent DPDT toggle switches, nine WS2812C-2020 RGB LEDs, two Grove I2C sockets, and a vendor dimension order of 88 × 24 × 19.6 mm. This model uses the canonical portrait order **24 × 88 × 19.6 mm**, +X right, +Y top end and +Z front.

- [Official product](https://docs.m5stack.com/en/unit/Unit%20ByteSwitch)
- [Official dimension drawing](https://m5stack.oss-cn-shenzhen.aliyuncs.com/resource/docs/products/unit/Unit%20ByteSwitch/model%20size.png)
- [Official structure](https://github.com/m5stack/M5_Hardware/tree/e29c139cbc7c80b5ccc5557e5ab8025a7a19a109/Products/U191_Unit_ByteSwitch/Structures)
- [Official schematic](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/820/SCH_Unit-ByteSwitch_V1.0.pdf)

The complete native assembled front/rear shell and both native lightpipes are retained (STL islands 0, 3, 4, 7). Islands 1, 2, 5, 6 are displaced duplicates. One rigid transform is applied to every retained part: `X = 12 − rawY`, `Y = rawX − 44`, `Z = rawZ − 3.2`. No shell scaling, contour reconstruction or independent part alignment is used. Hashes, island identities and transform are in `src/units/byteswitch/cad-map.json` and `source-manifest.json`. CAD is MIT with the existing M5_Hardware notice.

The lightpipe comb remains a complete union of its native triangles. Only existing top emission triangles are assigned to eight independent LED materials; vertices and physical surfaces are unchanged, with no overlapping artificial lens plane. The single end lightpipe is the ninth LED. RGB numbering identifies physical location, not firmware LED chain order.

A real PCB with open boss and connector reliefs, two rear screws, fixed six-pin switch packages, annular retainers, hollow bushings, moving ball/rod/tip assemblies, and two open-top red Grove sockets with four contacts are added. Concealed sizes, PCB position, socket interior details, switch pivot and lever shape are photo-based visual reconstruction. Native mounting bores remain clear; the dimension drawing specifies four Ø4.85 mm bores on a 16 × 64 mm rectangle.

## Stable hinged toggles

`switch-1` through `switch-8` are `kind: 'button'`, `latching: true`. `switch-1` is physical **CH0 at Y = −23.8 mm**, and `switch-8` is **CH7 at Y = +23.8 mm**; the native molded CAD channel numbers establish the direction. `Digit1` through `Digit8` provide keyboard input.

Each lever rotates as a rigid object around `[0, channelY, 6.6]`, axis `[0,1,0]`; its fixed package, panel nut and bushing remain stationary. Estimated stops are −22.5° and +22.5°. `press()` toggles once and `release()`/`cancel()` releases the input source while retaining the selected detent. `setPosition(0 | 1, { immediate: true })` sets a visual stop directly and emits no input. Without `immediate`, the usual update loop interpolates the swing. `getState()` includes `pressed`, stable `position`, `latching` and `leverAngleDeg`.

The estimated detent envelope is 24 × 88 × 19.595 mm. Passing through the upright middle of the swing reaches about 20.12 mm total depth; the model does not flatten this real arc to keep every intermediate pose inside the detent box. These visual angles are not rated hardware limits or calibrated switch positions. `getActuationState()` is the inherited interpolation arc length; the cap itself has no linear translation.

```js
const control = unit.get('switch-1', 'button');
control.setPosition(1); // visual retained stop; call unit.update(dt)
control.press('pointer:7');
control.release('pointer:7'); // retains the newly selected position
unit.get('rgb-1', 'led').set({ color: '#00bbee', brightness: 0.6 });
```

`rgb-1` through `rgb-8` align with CH0 through CH7, and `rgb-9` is the top-end light near CH7. All are independently externally driven and have no automatic switch or power coupling.

## Dual Grove and chaining

`grove` is the bottom input and `grove-out` the top cascade output. Both expose `Port` APIs and physical four-contact sockets. The pins are documented as GND, 5V, SDA, SCL. `GroveModule` adds the shared four-wire/two-plug cable and `unitFrame`; its input is occupied by the upstream cable, while `grove-out` remains available for another `GroveModule`.

```js
host.port('grove').attach(new ByteSwitchGrove());
host.port('grove').module.port('grove-out').attach(new ByteButtonGrove());
host.handle({ type: 'button', target: 'grove/switch-1', action: 'position', position: 1 });
host.handle({ type: 'led', target: 'grove/grove-out/rgb-1', color: '#00bbee', brightness: 0.5 });
```

This repository models appearance, mechanical motion, attachment, cable pose and input intent. `sensor` is a visual anchor. Byte values, DPDT electrical truth tables, I2C/STM32/LED protocols and firmware remain the external framework's responsibility.

`smoke.json` records the bounded construction/API check: finite geometry, four clear mounting bores and correct PCB bore walls, eight stable rigid hinge motions, nine independent native lightpipe materials, input/output mouths, nested chaining, pose, independent detach and resource disposal. No browser inspection was performed, as requested. Both fixed-shell labels are now included as reference-redrawn PNGs; see `artwork.md` and `sticker-smoke.json`. Private tables, vector source and intermediates remain absent from the public model.
