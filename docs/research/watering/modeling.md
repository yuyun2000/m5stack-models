# Unit Watering U101

The exact assembled U101 native shell and pump saddle retain all 9,930 triangles at scale 1 with one translation. Separate displaced rear/front copies are excluded. The complete Unit is 26.5 × 192.8 × 33 mm in model axes, including the long capacitive probe and actual fixed motor/pump. The original shell alone measures 24 × 111.995 × 32.973 mm. The two supplied flexible tubes have a separate appearance envelope and are excluded from the manufacturer's nominal Unit dimensions.

The model includes the stationary motor can, pump housing and recessed diaphragm backing, two independently bored nipples, two retaining ties around the pump and shell, real probe laminate with buried capacitive conductor faces and black protective mask, concealed pump-drive and sensor electronics, TLC555I/XC6206/SI2302 packages, four actual Grove contacts, retaining hardware, and two synchronized labels. Neither label supplies missing physical structure. Original mounting openings remain genuine through-paths. The nipples contain real FrontSide bore walls and deep backing rather than black discs placed over their mouths.

`Model`, `GroveModule`, `Hose` and `spec` are exported from the Unit entry. `GroveModule` renders four separate Grove wires and accepts the standard external `unitFrame` pose and `cable` options. Its Unit options are explicitly forwarded, including `hoses:true`; `artwork:false` disables both printed layers without changing physical geometry or world poses.

```js
import { Model, GroveModule, Hose } from './src/units/watering/index.js';

const unit = new Model({ hoses: true });
// Or attach the whole Unit to any Grove host through its rendered cable:
const module = new GroveModule({ hoses: true, cableLength: 55 });
host.port('grove').attach(module);

// Every water tube can be moved or removed independently.
host.handle({
  type: 'shape', target: 'grove/inlet/shape',
  points: [[0, 0, 0], [0, 14, 0], [-25, 43, 11], [-61, 22, 9], [-40, -19, 20]],
});
const hose = module.port('inlet').detach({ dispose: false });
module.port('inlet').attach(hose);
// A bare Unit can receive either supplied tube independently:
unit.port('outlet').attach(new Hose());
```

`inlet` and `outlet` use connector type `silicone-tube-4mm` and face +Y. They reject Grove modules. A `Hose` owns the `shape` component of kind `hose-shape`. A `shape` command takes 3–16 finite `[x,y,z]` coordinates in millimetres in the tube's attachment frame, within ±500 mm. Point 0 must remain `[0,0,0]`; point 1 must follow +Y by at least 6 mm; consecutive points must be at least 1 mm apart. Invalid data leave existing geometry and state intact. `getState()` returns copied points, outer/inner diameters, wall thickness, insertion depth, stretched seat diameter and curve length. Posing replaces only that tube's hollow curved mesh; the 5.4 mm seating sleeve, pump, real ports, Grove cable and other tube remain fixed. Detaching and refitting at the same port restores the same attachment frame.

The two tubes' 6 mm outer / 4 mm inner appearance diameters, 1 mm wall, 5.4 mm insertion sleeve, 4.5 mm stretched seat and default mirror routes are estimates from exact U101 photographs. They are not manufacturer hose specifications, measured supplied lengths, fluid volumes, production fit, flexibility limits or physics constraints. Both ends and the curved lumen remain genuinely open.

The sole `sensor` component is a passive visual anchor. No external LED, button, rotary knob or visible pump impeller is evidenced, so none is invented. The model emits no pump/water/moisture/ADC effects, light, automatic wobble or hidden rotor animation. Pin labels are descriptive. Pump enable, sensing, power, flow and all firmware behavior belong to the external framework.

[Smoke evidence](./smoke.json) records necessary native-source, physical closure, axial-hole / FrontSide-wall, removable-tube, independent external-pose, invalid-input rollback, four-core attachment and resource-release checks. This batch has no browser/front-back-iso acceptance or hardware/production verification; its stage remains `modeled`.
