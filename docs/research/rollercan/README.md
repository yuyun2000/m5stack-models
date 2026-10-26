# Unit RollerCAN U188

Modeled 2026-10-26 from the standard U188 slip-ring assembly, its official photos and the M5Stack MCP product description. This product has the rotating top Grove; RollerCAN-Lite is a separate product.

Official product: <https://docs.m5stack.com/en/unit/Unit-RollerCAN>. Native mechanical CAD comes from `M5_Hardware` commit `e29c139cbc7c80b5ccc5557e5ab8025a7a19a109`, `Products/U188_Unit_RollerCAN/Structures/Unit_RollerCAN.stl`, Git blob `95ded1c6181d99b05db66fc45320b1932af7dc30`. The five assembled native components retain all 16,008 triangles; displaced duplicate islands are excluded. Source transforms and hashes are in `src/units/rollercan/cad-map.json` and `sources.json`. Preserve `licenses/M5_Hardware-MIT.txt`.

The documented housing is 40 × 40 × 40 mm. The D3504 motor's documented diameter is 41 mm, so the modeled visual envelope is 41 × 40 × 41 mm. Coordinates are millimetres, +X right, +Y rotating output, +Z fixed Grove. The OLED is on the fixed bottom face, facing −Y. The neutral rotor phase is the CAD assembly phase and is not an encoder zero.

The model closes shell openings with a fixed PCB and installed packages, the physical OLED carrier/glass, actual open red Grove sockets, two fixed XT30(2+2) PWRCAN male connectors and the rear MX1.25-5P debug socket. Four base mounting bores and the top expansion bores retain real depth. The D3504 bell, expansion plate, output PCB, output Grove and top red light guide rotate together; the central bearing/shaft, fixed electronics and bottom interfaces stay still.

PCB outline, concealed packages, connector inner walls/pins, mounting fasteners and installed dimensions are reconstructed appearance geometry, not PCB/BOM production data. In particular the CAN envelope (16.6 × 4.05 mm per row), row centers (−11.85 / −15.95 mm Y), depth and contact spacing are inferred from the native U188 opening and photos 4/8. Its PCB edge notch leaves physical clearance for the two CAN bodies. The motor's 41 mm diameter, 14.8 mm bell height, 16 mm fixed boss and 12.6 mm shaft bore follow the motor drawing linked by the official U188 page. The 0.66 inch, 64:48 panel gives a calculated active area of 13.4112 × 10.0584 mm; installed OLED depths and hidden parts are inferred.

## Visual controls for downstream agents

Use `Model` for standalone viewing or `GroveModule` for host attachment. No bus, firmware, motor torque, current, encoder values or control-loop simulation is implemented.

```js
import {Model, GroveModule} from './src/units/rollercan/index.js';
const unit = new Model();
unit.get('rotor', 'joint').set({angleDeg: 90, rpm: 0, durationMs: 350});
unit.get('rotor').set({rpm: 30}); // externally requested visual speed
unit.get('rotor').set({angleDeg: 0, rpm: 0});
unit.get('lcd', 'display').fill(0xffffff); // 64 × 48 external framebuffer
unit.get('rgb-1', 'led').set({color: 0x22aaff, brightness: .4});
unit.get('rgb-2', 'led').set({on: false});
unit.get('top-led', 'led').set({on: true}); // fixed red, independently driven
unit.get('press', 'button').press('external');
unit.update(1 / 60);
unit.get('press').release('external');
```

Call `update(dt, time)` during visual motion. `press` physically flexes the original CAD tongue vertices from their native hinge; the input plane is only the picker. Its estimated free-end travel is 0.25 mm. Release/cancel returns original positions and normals. Pointer/keyboard input emits intent; external rotation does not emit sensor or motor state. `Space` and `KeyA` address `press`. The white monochrome OLED converts supplied RGB to luminance in its actual shader; it does not show a firmware menu automatically. `sensor` is a passive visual anchor.

Attach a `GroveModule` to a host Grove Port. It exposes the fixed `grove` and rotating `grove-top`, with `GND / 5V / SDA / SCL` names; `grove-top.attach(childModule)` parents the child to the real rotating port. `unitFrame.setPose({position, rotation})` changes assembly pose and the four rendered wires. The output port, attached child and downstream four-wire source plug follow the rotor in the same update tick. `can-1`, `can-2` and `debug` are visual connector frames; no corresponding bus or cable protocol is provided. CAN physical numbered pin order is not asserted.

`rgb-1` and `rgb-2` are spatial identities, not inferred chain indices. `top-led` owns an independent fixed-red material. Rotation, button presses and screen writes never imply LED modes or supply state.

## Evidence and limits

`smoke.json` records one necessary structural/API smoke: exact U188 CAD blob, finite geometry/normals, 43 aperture/bore-wall rays, original tongue press/release, OLED writes, independent lights, continuous angle/RPM, fixed versus moving frames, nested Key attachment with same-tick four-wire source tracking and detach/resource release. No browser or physical-fit validation was performed, in accordance with the user's request to continue Unit expansion. Stage remains `modeled`.

Artwork is deferred. No private CSV, vector originals, photo crops or raw reference media are distributed in the runtime product folder. Source URLs and hashes are provenance only.

The MCP-generated U6 schematic summary incorrectly said RS-485. The original linked U188 schematic visibly uses `SIT1044QTK/3`, `FDCAN_RX`, `FDCAN_TX`, `CAN_STB`, `EXT_CANH` and `EXT_CANL`, consistent with the CAN product text. This summary typo was submitted through M5Stack Assistant: feedback `72ad6db8104f414c939b963dcd2db271`; it is not a contradiction in the original schematic.
