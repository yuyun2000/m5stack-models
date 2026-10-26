# Unit HBridge v1.1 — U160-V11

Own U160-V11 structure and photographs were consulted on 2026-10-26 after official M5Stack MCP lookup. This model is **modeled**, with necessary single-product geometry/API checks; browser and hardware acceptance remain deferred.

The original front 2,560 and rear 3,032 triangles are preserved with a common translation `[0,28,-4]`, scale 1. The other two STL components are displaced duplicate covers. Model axes are +X front-label right, +Y terminal end, +Z blue-H label. Own CAD shell is 24 × 56 × 8 mm. The official 56 × 24 × 10.2 mm product table includes the fixed terminal depth; fixed assembly is 24 × 56 × 10.2 mm. Accessory envelopes are reported separately in `smoke.json`. The linked U085 dimension drawing was not treated as this product's drawing.

Behind the original openings are a physical PCB with actual retaining/SWD bores, burgundy HY2.0-4P housing, four Grove contacts and backing, fixed orange HT3.96-4P housing with recessed pins/backing, and own v1.1 packages. These include STM32F030F4P6, RZ7899, INA199A1DCKR, SY8303AIC/inductor, HX6306P332MR, AO3401A/DTC143ZCA, TL432, fuse, shunt and three low-profile 22 µF capacitors. Hidden outlines, installation planes and package dimensions are photographic reconstructions, not production-fit claims.

The exact linked v1.1 schematic labels C11–C13 **22 µF / 25V**. Generated MCP schematic prose incorrectly said C10–C12 220 µF; the actual linked schematic image governs this model. The literal rear sticker reads `1mR`, while schematic R4 is `10mR/1206`; artwork preserves the observed print and does not assert a resistance. The wrong-SKU dimension link and these differences were reported with accepted feedback ID `b5968f0e92364881bee61f5bea7d41c9`.

## External framework integration

`Model`, `GroveModule`, `TerminalPlug`, and `spec` are exported from `src/units/hbridge-v11/index.js`.

| ID | Kind | Appearance contract |
| --- | --- | --- |
| `grove` | Port, `grove` | Four real contacts and physical cable pose, I2C pin labels only |
| `terminal` | Port, `ht3.96-4p` | Real recessed four-pin socket; front-view spatial slots HV, GND, M−, M+ |
| `sensor` | Passive Component | Appearance anchor; accepts no functional/value commands |
| `source` | Latching Button | PCB S1 two stable visual positions, labelled sources DCDC 5V / external HV; throw and electrical-position mapping unconfirmed |
| `address-1` … `address-4` | Latching Button | SW1 four independent stable physical sliders, without I2C address calculation |
| `terminal/screw-1` … `terminal/screw-4` | VisualJoint when plugged | Four independent visible screw-head angles and optional duration; nonzero RPM rejected |

The terminal `n` values are left-to-right front-view spatial slot indices. Schematic P5 numbering runs in the opposite direction. No continuity or electrical behavior is modeled. Grove cannot be attached to the HT3.96 port.

The source selector and DIP sliders remain at their actual internal PCB positions. The native shell and real front adhesive film conceal them during normal assembly. Closed-shell controls have no registered cap hit targets and report `interactive === false`; pointer calls cannot actuate them. `covers:false` hides the preserved cover meshes and explicitly hides every printed layer for assembly inspection, exposing the real movable caps. It does not invent an external switch, relocate controls into connector slots or change CAD holes. External `setPosition()` works in either configuration and produces no echoed input event.

```js
import { Model, GroveModule, TerminalPlug } from './src/units/hbridge-v11/index.js';
const device = new Model({ terminalPlug: true, capacitor: true });
const inspection = new Model({ covers: false, terminalPlug: true, capacitor: true });
inspection.get('source', 'button').setPosition(1, { immediate: true });
inspection.get('address-1', 'button').setPosition(1, { immediate: true });
inspection.on('input', event => { /* forward real down/up/click intent */ });
inspection.get('source').onPointerDown({ pointerId: 1 });
inspection.get('source').onPointerCancel({ pointerId: 1 });
// Cancel releases the hold and emits cancelled up, without click; stable position remains.
device.handle({ type: 'joint', target: 'terminal/screw-1', angleDeg: 65, durationMs: 180 });
// External framework calls device.update(dtSeconds) to render interpolation.
```

Options are `{}` for the fixed socket, `{terminalPlug:true}` for the supplied removable plug, `{terminalPlug:true,capacitor:true}` for the same plug with the supplied 470 µF part, and `{covers:false,terminalPlug:true,capacitor:true}` for inspection. `capacitor:true` on a Unit requires `terminalPlug:true` and is rejected on lazy build otherwise. Standalone `new TerminalPlug({capacitor:true})` is valid. The capacitor's two real metal leads enter the existing HV/G wire entries, matching the own official installation photograph. It has no additional port. Its sleeve, stripe, aluminium end, vent score and rubber lead seal are actual geometry; no unreadable brand or electrical rating is invented.

```js
const module = new GroveModule({
  terminalPlug: true, capacitor: true, covers: false, cableLength: 50
});
host.port('unit').attach(module);
host.handle({ type: 'pose', target: 'unit/unitFrame', position: [20,70,-4], rotation: [.1,0,.15] });
host.handle({ type: 'button', target: 'unit/source', action: 'position', position: 1 });
host.handle({ type: 'joint', target: 'unit/terminal/screw-4', angleDeg: -30 });
const plug = module.port('terminal').detach({ dispose: false });
module.port('terminal').attach(plug);
host.port('unit').detach();
```

Four Grove wires and two fitted plug bodies follow the established `GroveModule` cable API. Removing the supplied terminal retains the fixed chassis, selector positions and cable. Destroying the Unit releases its graphics resources.

There are no registered LEDs, synthetic motor, rotor or supplied external motor accessory. The model does not implement PWM, power selection, motor direction/speed/braking, current/voltage readings, I2C/address mapping, polarity enforcement, capacitor charge/discharge, protection or firmware. Those remain the external framework's responsibility.

## Necessary verification

`smoke.json` covers all 5,592 native triangles and unscaled envelope, ten mounting clearance rays/eight FrontSide bore walls, actual PCB retaining/SWD holes, fixed connector backing/four contacts, four plug wire channels/walls and four independently driven screw angles, exact angular reset and RPM rejection, five stable sliders with press/release/cancel and no external-command echo, closed-shell hit suppression/open inspection with every printed layer effectively hidden and closed print visible, same-plug capacitor leads, four configurations in both public classes with `artwork:false` physical attributes/index/world-matrix invariance, Grove pose and independent detach, and resource disposal. This is not browser, electrical, hardware or production-fit validation.
