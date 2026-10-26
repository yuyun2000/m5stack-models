# Unit ExtEncoder U161

This is the external AB/ABZ encoder acquisition Unit, with no integral encoder shaft, rotary knob or motor. Appearance is modeled at X/Y/Z = **24 × 32 × 10.7 mm**, following its own official 32 × 24 × 10.7 mm dimension drawing. [sources.json](./sources.json) records the exact CAD and official own-product references.

## Native shell and physical backing

All **3286 triangles** of the complete assembled source component 0 are retained with one common rigid translation and a half turn about Y, scale 1. Components 1 and 2 are displaced source duplicates and are excluded. The original 24 × 32 × 8 mm shell, stepped/faceted mounting bores, fastener recess and connector openings are unmodified. There are no fill planes, shell scaling, hole replacement or independently shifted shell parts. The two bores remain centered at [−8,−4] and [8,−4]; the nominal Ø5 mm facet span is about4.8753–5 mm.

A PCB with open native-boss scallops, Grove notch and real center fastening bore backs the source enclosure. Own schematic U1 STM32F030F4P6, U2 HX6306, D1 TVS5V, input RC network and concealed J2 SWD pads are physical reconstructed packages. Their hidden placement, package sizes/Z and board contour are appearance inferences, not an assembly drawing. J2 is not registered as an external user port. No external crystal or LED was added.

The green **VH2.54-5P** socket has five recessed square metal contacts, true cavity walls/rear stop, T-shaped end-band windows, floor and keyed rails. Its14.5 mm width/10.2 mm plan depth come from the own dimension drawing; hidden contact lengths, window profile and insertion clearance are photo estimates. The burgundy Grove socket has four real pins, physical walls, contact carrier and PCB tails.

## External API

Exports are `Model`, `GroveModule`, `TerminalPlug` and `spec` from `src/units/extencoder/index.js`.

- `grove`: real four-core attachment/cable frame, GND / 5V / SDA / SCL, connector `grove`.
- `encoder`: fixed mating frame [0,16,2.4], connector **`vh2.54-5p`**, rejects Grove. Physical front-label left-to-right GND / 5V / Z1 / B1 / A1 correspond to own schematic P6 pins5 / 4 / 3 / 2 / 1.
- `sensor`: passive appearance anchor with no command behavior or internal state.
- There are no main-body LEDs, buttons, sliders or visual joints. Support for external encoder inputs does not create an imaginary local wheel or readout.

The exact U161 package photograph explicitly shows a separate green five-pole screw plug with five round wire entries and five slotted metal screws. `TerminalPlug` reconstructs that supplied accessory, with true mating bores, recessed spring strips, wire cavities and clamp cages. Its mating dimensions are appearance estimates. `new Model({terminalPlug:true})` and `new GroveModule({terminalPlug:true})` attach it to `encoder`. It can also be attached/detached through the ordinary `Port` API:

```js
import {Model, GroveModule, TerminalPlug} from './src/units/extencoder/index.js';
const unit = new Model();
const plug = unit.port('encoder').attach(new TerminalPlug());
unit.handle({type:'joint', target:'encoder/screw-1', angleDeg:70, durationMs:150});
unit.update(0.15);
unit.handle({type:'joint', target:'encoder/screw-1', angleDeg:0});
unit.port('encoder').detach({dispose:false});
plug.dispose();

// With a real host Grove Port, cable geometry and nested addressing follow
// the common Module interface. The host's actual Grove port ID is model-specific.
const linked = host.port('grove').attach(new GroveModule({cableLength:60, terminalPlug:true}));
host.handle({type:'pose', target:'grove/unitFrame', position:[35,65,0], rotation:[0,0,0.2]});
host.handle({type:'joint', target:'grove/encoder/screw-5', angleDeg:45});
```

The five `screw-1` through `screw-5` joints are separately externally driven head orientations. Nonzero RPM is rejected; there is no thread travel, torque, clamp displacement or force. Resetting angle0 restores the exact neutral quaternion. Socket, chassis and other screw heads do not move. External commands do not echo as input.

The model implements no excitation, AB/ABZ pulse generation/decoding, counts, angle, position, speed, I2C, protection, voltage, continuity or firmware. Those functions belong to the external framework. Connector metadata and four colored cable cores describe physical appearance and addressing, not proof of electrical protocol conversion or hardware operation.

## Artwork and checks

[artwork.md](./artwork.md) describes the two synchronized high-resolution own-photo reference-redrawn PNGs and the `artwork:false` switch. [smoke.json](./smoke.json) records the necessary local checks: exact source envelope, empty original through-bores with inward FrontSide walls, five real T-windows, five recessed contacts, Grove/cavity backing, plug bores and wire-entry walls, independent screw animation/reset, artwork physical-buffer invariance, nested four-core cable attach/pose/detach and resource disposal. This stage is **modeled**, not visually verified. Browser, exhaustive historical, hardware and production mating-fit checks are not claimed.
