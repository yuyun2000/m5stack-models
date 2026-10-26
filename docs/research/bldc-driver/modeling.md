# Unit BLDC Driver · U181

`modeled`, not visually accepted. Retrieved 2026-10-26. [Official product](https://docs.m5stack.com/en/unit/Unit_BLDC_Driver), [machine-readable sources](sources.json), [artwork provenance](artwork.json), [necessary local smoke](smoke.json).

## Official facts

The U181 dimension drawing gives 32 × 24 × 11.3 mm: the shell alone is 8 mm deep and the fixed orange terminal projects above it. The two Ø5 mounting holes are 16 mm apart and 12 mm from the Grove end. The included HT3.96-4P plug has four wire entries and four recessed cross-head screws. The front phase labels read U, V, W, COM; schematic J2 pin numbers run 4, 3, 2, 1 in that front-view order. Grove is HY2.0-4P, with documentary GND / 5V / SDA / SCL labels.

The own-model schematic names STM32G030F6P6, DRV11873PWPR, a green D1 SYS_LED and five J3 upgrade/debug contacts. It does not contain a reset switch. The exterior official photographs show no exposed LED aperture, user switch, dial, motor or rotor. Concealed D1 is therefore represented by a non-emissive physical package, with no public `Led` component and no fabricated optical window.

## Geometry and inference

All 3,216 triangles of native assembled STL component 0 remain unscaled and unmodified. A common translation recentres the shell in millimetres: +X front-label right, +Y terminal end, +Z front-label side. Displaced duplicate front/rear components 1 and 2 are excluded; see the exact blob and transform in [cad-map.json](../../../src/units/bldc-driver/cad-map.json).

Additional physical geometry supplies the notched PCB with open mounting reliefs and retaining bore, both IC packages/leads, passives and diodes, five unpopulated J3 contacts, concealed LED, the fixed screw, open Grove connector, and the fixed phase socket. PCB outline/plane, concealed part positions, solder detail and connector internals are photo/schematic reconstruction rather than manufacturing CAD.

The fixed socket's exposed upper channel is fitted to the drawing's 11.3 mm total depth and front-view 16 mm width. Its cavity remains open with four metal contacts and four real upper molding slots. The native STL still contains a shell surface below the socket. Hidden pin passages, exact seating and insertion depth are not established by an assembled STEP or cross-section; the concealed straight tails and plug profile are inferred appearance, with no fit/tolerance or collision-free manufacturing claim. No extra exterior gap or invented tail-routing slot has been cut into the source shell.

The native rear label recess is open. A separately modeled 0.1 mm adhesive substrate and the real PCB behind it give the assembly depth independently of image loading. The rear print projects onto that physical substrate. Removing artwork retains all physical attributes, indices and world matrices. Front print projects only onto native outward shell triangles and cannot close mounting bores or connector openings. Label thickness, lettering, colors and registration remain reconstructed appearance.

## External use

The public exports are `Model`, `GroveModule`, `TerminalPlug` and `spec`. The bare device has only `grove` and `terminal` ports. There are no synthetic sensor anchors, buttons, lights or body rotation joints.

```js
import { Model, GroveModule, TerminalPlug } from './src/units/bldc-driver/index.js';

const bare = new Model();
const plug = new TerminalPlug();
bare.port('terminal').attach(plug);
bare.handle({ type: 'joint', target: 'terminal/screw-1', angleDeg: 70, durationMs: 180 });
bare.update(0.18);
bare.port('terminal').detach({ dispose: false });
plug.dispose();

// Included accessory, already attached; both Model and GroveModule accept this.
const module = new GroveModule({ terminalPlug: true, cableLength: 60 });
host.port('unit').attach(module);
host.handle({ type: 'joint', target: 'unit/terminal/screw-2', angleDeg: -45, durationMs: 200 });
host.handle({ type: 'pose', target: 'unit/unitFrame', position: [20, 60, 0], rotation: [0, 0, 0.2] });
host.update(0.2);
```

`terminal` accepts `meta.connector: 'ht3.96-4p'`. The included plug exposes `screw-1` through `screw-4` in U / V / W / COM order. Each changes only its visible head angle, optionally over `durationMs`; nonzero RPM is rejected. `visualRangeDeg: [-180,180]` is a viewer range, not a measured thread stop. Angle does not translate the screw or clamp, tighten wires, measure torque, or drive an electrical state. Commands do not echo user input. Disposal follows normal `Port` / `Module` ownership.

`terminalPlug: true` creates the supplied accessory, while the default leaves the bare fixed socket. `artwork: false` omits only the two printed layers. `GroveModule` renders the normal two-ended, four-conductor Grove cable; `unitFrame` pose changes its shape. External frameworks such as m5agent/m5stack-esp-emulator own I2C/PWM, motor commutation/speed/direction, load and protection state, firmware and electrical behavior. This driver unit does not expose a fictional motor shaft to animate.

## Evidence boundary

Local construction checks cover shell triangle retention and bounds, real open mounting and PCB holes with FrontSide wall hits, socket/Grove/PCB/label backing, detachable accessory mating bores, all four external screw joints, four bare/plug Model/GroveModule artwork-invariance configurations, and nested Grove pose/independent detach/disposal. No long historical suite, build, browser face-by-face acceptance, motor/hardware behavior or production assembly-fit validation was performed for this component handoff. Current status remains `modeled` with no visual acceptance claim.

## 端子插舌闭合修订

2026-10-26。旧2.5mm剖面经坐标偏置/倒角后，下孔缘与端面外轮廓相切，留下20条单边界。仅将插舌高改为2.9mm，保留孔下材料；新15018坐标边均成对反向、正体积，四孔轴向畅通/FrontSide内壁有效。端口、四头外驱、包络、标签和其他几何保持。原smoke/freeze为保存时快照，本次新旧SHA及局部验证见[修订回执](terminal-tongue-closure.json)。不代表实物配合公差。
