# Unit TimerPWR U189

Model axes are +X right, +Y USB/battery end and +Z OLED/front. Nominal envelope is 24×40×11 mm (vendor order40×24×11). Complete assembled native STL component0 retains all5604 triangles at scale1 under one common rigid rotation and translation. Components1/2 are displaced shell copies and are excluded. Native faceted Ø4.85mm mounting bores at(±8,-8), the real screen aperture, connector holes and both side flexure tongues are retained. No shell patch, filled bore or fixed duplicate button is used.

Concealed visual reconstruction adds an actual PCB with open mounting/Grove clearances, STM32G031G8U6, INA3221, LGS4056H, MT9700, SY7088, ME6206A33XG, AW35122FDR, TPS61040DBVR, crystal and passives. Package placements, concealed dimensions and Z are appearance estimates, not manufacturer assembly tolerances. OLED has separate real-depth carrier, black glass/inactive edge and FPC; its active area13.4×10.05mm is derived from0.66-inch4:3 aspect and the native13.4×10.6mm aperture. USB-C has a real metal cavity, insulating tongue, contact strips and rear insulator. Battery socket has1.25mm pitch contacts; red Grove has four metal contacts and a recessed rear wall.

## Public visual/input API

- `lcd`: external64×48 white monochrome OLED. Pixel(0,0) is top left when looking at+Z; screen up is+Y (USB end). `writeRGBA`, `writeRGB888`, `writeRGB565`, `fill`, canvas/present and the standard display command are available. The shader maps luminance to white while preserving the supplied framebuffer bytes. No firmware page is generated.
- `button-a`(-X), `button-b`(+X): genuine native side tongues. A press deforms165/167 original vertices with0.22mm estimated free-end travel, and local normals follow the deformation. Release and cancellation restore native positions/normals exactly. `down`, `up`, `click`, `longpress` are input intentions. Buttons do not edit screen, lights, timers or power.
- `power-led`: fixed red D4, independently driven through the standard Led API. Default off. The product pin table calls PB4 a charging indicator, but original schematic shows PB4 BAT_CHRG is an input from charger U8; D4 is separately fed from5V_OUT through R6. The model uses the schematic D4 meaning and has no automatic charge/power response. Feedback receipt is in `sources.json`. Red appearance follows the exact-product illustration; no wavelength claim.
- `grove`: HY2.0-4P, GND/5V_OUT/SDA/SCL, mechanical attach/cable pose only. `usb`: connector `usb-c-charge-only`, no USB data. `battery`: connector `mx1.25-2p`. Non-Grove ports reject Grove modules. Metadata retains the official warning: the external lithium battery is required, USB only charges it and cannot directly supply Grove. No electrical forwarding is implemented.
- `sensor`: passive visual anchor. No RTC, timer, INA3221 readings, charging, battery state, shutdown, bus or electrical model.

```js
import {Model, GroveModule} from '../../../src/units/timerpwr/index.js';
const unit = new Model();
unit.get('lcd').writeRGBA(externalRgba64x48);
unit.get('power-led').set({on:true, brightness:.5});
unit.get('button-a').press('external-input');
unit.update(.016); // tick while visual motion settles
unit.get('button-a').cancel('external-input');
// To add real cable geometry to a compatible host:
const module = host.port('grove').attach(GroveModule, {cableLength:60});
host.get('grove/lcd').writeRGB565(externalRgb565);
host.handle({type:'pose',target:'grove/unitFrame',position:[15,70,0],rotation:[0,.1,0]});
// Detaching cancels capture in the viewer; external runtimes manage their own source holds.
host.port('grove').detach();
```

Pass `artwork:false` separately to each Model or GroveModule whose labels should be hidden. Firmware, sensor values, electrical supply paths, battery/charging and timer behavior belong to an external runtime. Grove attachment demonstrates physical cable pose and addressing only. Necessary local smoke covers original holes/walls, screen/connector backing, real native deformation and exact reset, independent framebuffer/light state, connector mismatch, four wires/pose/attach/detach/resource disposal and physical artwork invariants. No exhaustive browser, hardware, production-fit or electrical acceptance is claimed.
