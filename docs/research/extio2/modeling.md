# Unit EXT.IO2 — U011-B

This is an appearance-only assembled model with externally positioned Grove wiring. Stage is `modeled`; no browser or production fit approval is claimed.

## Official basis

Retrieved 2026-10-26 from the [official U011-B product page](https://docs.m5stack.com/en/unit/extio2), official schematic and exact U011-B photographs. The official product size is 32 × 24 × 10.2 mm. Model axes are **24 × 32 × 10.2 mm**, +X right, +Y toward P2 at the top, +Z toward the raised blank front. The official drawing specifies an 8 mm base and 2.2 mm raised front, 5 mm bores at 16 mm pitch, 12 mm above the Grove end.

The complete assembled island from `M5_Hardware` `Products/U011-B_Unit_EXT.IO2/Structures/Unit_EXT.IO2.stl` is retained. Its 3500 triangles are translated by the one documented assembly origin then rigidly rotated 180° about Y. The two laterally displaced spare individual shell islands are excluded. The native raised front, top opening, Grove notch, mounting bores, rear label recess and fastening relief remain unchanged. See `cad-map.json`; retain `licenses/M5_Hardware-MIT.txt` for this MIT CAD derivative.

## Physical assembly

- A dark PCB follows the shell clearance with open side boss reliefs, a Grove notch, central screw bore, ten real P2 lead bores and four Grove solder bores. All openings have coherent `FrontSide` walls.
- P2 is a real right-angle male 2×5, 2.54 mm header. Ten squared contact pins, their unequal bent solder legs, annular solder pads and the complete black molded carrier are present behind the original top opening.
- The STM32F030F4P6 has a physical TSSOP20 body with twenty solder feet, risers and shoulders. HT7533 and resistor/capacitor solids support the visible board. The top opening exposes real board/package/contact surfaces; no photographic or painted black filler closes it.
- Grove uses an actual open-top red housing, four metal contacts and solder tails. The original port remains open, backed by the physical socket rear wall and contacts.
- P1 is documented as a five-node SWD connection. Product photos do not establish an exterior populated SWD socket. Five fixed, concealed connection pads are shown; they are an explicitly inferred internal representation and do not become an exposed `Port`.
- The central fastener has a recessed rear head and physical shank. The two mounting bores stay empty through both shell and PCB.

The PCB outline/thickness/plane, component package datums and envelopes, P2 carrier and bend path, SWD pad placement/population, concealed passives, connector internals and screw shank are inferred visual geometry. There is no populated PCB/assembly STEP or manufacturing fit claim.

## Runtime contract

`Model` and `GroveModule` are exported from `src/units/extio2/index.js`. `GroveModule` reuses the shared four-wire Grove cable, plug pair and `unitFrame` pose controller.

| ID | Kind/type | Meaning |
| --- | --- | --- |
| `grove` | Port, `grove` | Bottom PORT.A / I2C. Pins black GND, red 5V, yellow SDA, white SCL. |
| `io` | Port, `header-2x5-2.54mm-male` | Top ten-pin P2, which rejects Grove modules. Pins 1–8 IO0–IO7, 9 VCC, 10 GND. |
| `sensor` | Passive Component | STM32 physical package anchor only. No commands, sampled values or input events. |
| `unitFrame` | GroveModule only | External Unit pose, position/rotation or mating distance in the parent port frame. |
| `cable` | GroveModule only | Four physical wires and two plugs. Follows pose; does not implement I2C or GPIO. |

P2 front-axis columns from −X to +X are IO0/1, IO2/3, IO4/5, IO6/7 and VCC/GND. The front-near +Z row contains IO0,2,4,6,VCC; the rear-near row IO1,3,5,7,GND. Viewed from the rear label, left-to-right is VCC/6/4/2/0 above GND/7/5/3/1. This physical assignment follows the exact-product label and schematic; mating tolerances are not specified.

No exterior LED, push button or moving mechanism is documented or visible, so none is invented. The advertised RGB LED control, PWM and servo support describe external IO capabilities; they do not represent built-in LEDs, servos or model animations. GPIO values, ADC, PWM, servo angles, RGB drive, address registers, firmware and electrical behavior belong to the external runtime.

```js
import {Model, GroveModule} from './src/units/extio2/index.js';

const standalone = new Model();
const unit = parent.port('grove').attach(GroveModule, {cableLength: 45});
parent.handle({type: 'pose', target: 'grove/unitFrame',
  position: [12, 65, -6], rotation: [0.2, -0.1, 0]});
const io = parent.get('grove/io'); // Ten-pin attachment/legend; rejects Grove.
const physicalOnly = new Model({artwork: false});
```

The parent port must itself be `grove`. Host/model pose and cable motion are visual only, with no input response or electrical simulation.

## Artwork and validation

One exact-product rear label is redrawn as a high-resolution PNG. The raised front is blank in the exact U011-B photos and remains blank. See [artwork.md](artwork.md). Print is projected only onto existing rear shell triangles; it cannot fill ports or replace internals. `artwork:false` suppresses the print with unchanged physical geometry.

`smoke.json` records necessary local finite geometry, native shell retention, clear mounting bores and `FrontSide` walls, real P2 bores/contacts, top/Grove physical backing, typed IO rejection, passive anchor behavior, four-wire nested attach/pose/detach/disposal and artwork disable checks. No browser review, complete historical recheck, hardware execution, IO behavior or production mating validation was performed.
