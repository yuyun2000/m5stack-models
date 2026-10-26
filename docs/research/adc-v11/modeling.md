# Unit ADC v1.1 U013-V11

The model uses X/Y/Z = **24 × 32 × 10.2 mm**, corresponding to the official table's32 × 24 × 10.2 mm order. This is the own U013-V11 ADS1110 model. The older ADS1100 Unit ADC and the separate Hat ADC are excluded as geometry/electronics references. [sources.json](./sources.json) records the exact own-product sources and immutable CAD identity.

## Assembly

All **3710 triangles** of native assembled shell component0 are retained with one common rigid translation and a half turn about Y, scale1. Displaced shell copies1 and2 are excluded. The original24 × 32 × 8 mm shell, embossed ADC/M5 marks, stepped/faceted through-holes, central fastener recess and connector apertures are unmodified. No shell scaling, hole filling, circular replacement, shifted halves or artwork cover planes are used. Native mounting bores remain at[−8,−4] and[8,−4], nominal Ø5 mm with4.8753–5 mm facet spans.

A separately reconstructed green PCB has open mounting-boss scallops, the Grove notch and a real center fastening bore. Its populated packages follow the exact v1.1 schematic: six-lead U2 ADS1110, eight-lead U1 LM358DR2G, two HT7533 regulator packages and R1–R6/C1–C5 envelopes. Board outline/thickness/Z, hidden package placement and package dimensions are visual inferences, not production placement evidence. There is no invented exposed LED, button or display.

The burgundy Grove housing has four real contacts, open-top walls, floor, recessed carrier and rear wall. The orange **HT3.96-2P** fixed socket has two metal contacts, open insertion cavity, floor, two side cheeks, physical roof and rear stop. The included separate plug has two actual mating bores and springs, two round wire entries, clamp cages and two recessed screw heads. The exact own package photograph and official in-box list establish this accessory; concealed mating depths and clearances remain local appearance estimates, without a production-fit claim.

## External API

`Model`, `GroveModule`, `TerminalPlug` and `spec` are exported from `src/units/adc-v11/index.js`.

- `grove`: physical four-pin connector/cable frame, GND / 5V / SDA / SCL.
- `terminal`: connector `ht3.96-2p`, frame[0,16.04,2.6], rejects Grove. Front left-to-right + / − correspond to own schematic P1 pins1 / 2, VIN+ / GND.
- `sensor`: passive appearance anchor, with no commands, conversion state or numeric sensor values.
- No main-body button, LED, slider or motor-like joint is registered.

```js
import {Model, GroveModule, TerminalPlug} from './src/units/adc-v11/index.js';
const unit = new Model({terminalPlug:true});
unit.handle({type:'joint', target:'terminal/screw-1', angleDeg:70, durationMs:150});
unit.update(0.15);
unit.handle({type:'joint', target:'terminal/screw-2', angleDeg:-35});
unit.handle({type:'joint', target:'terminal/screw-1', angleDeg:0});

const bare = new Model();
const plug = bare.port('terminal').attach(new TerminalPlug());
bare.port('terminal').detach({dispose:false});
plug.dispose();

// host is an external Device with an actual connector:'grove' Port.
const module = host.port('grove').attach(new GroveModule({cableLength:60, terminalPlug:true}));
host.handle({type:'pose', target:'grove/unitFrame', position:[20,65,-4], rotation:[0.2,0,-0.1]});
host.handle({type:'joint', target:'grove/terminal/screw-2', angleDeg:45});
host.update(0.016);
```

`terminal/screw-1` and `terminal/screw-2` independently accept finite external visual angles and timed transitions. Resetting to0 restores the exact original head quaternion; other heads, socket and chassis stay fixed. Nonzero RPM is rejected. There is no axial travel, thread pitch, tightening/clamp force or wire state. The suggested ±180° viewer range is not a measured tightening limit. External commands do not echo user input.

`GroveModule` adds the common `unitFrame` pose and `cable`: four independently colored black/red/yellow/white wires, two physical plugs and a moving endpoint. Nesting follows the ordinary Port/Module API. This provides physical appearance and input addressing only: no ADC conversion, voltage/current, PGA, rate/reference selection, I2C transactions, firmware, protection or electrical continuity is implemented.

## Checks and limits

[smoke.json](./smoke.json) records necessary local source-envelope/triangle, empty through-bore and FrontSide bore-wall checks, genuine contact/cavity backing, two plug holes, independent screw animation/reset, artwork attributes/index/world-transform invariance, four-core cable attach/pose/detach and disposal. [artwork.md](./artwork.md) documents the synchronized two reference-redraw PNGs. The status remains **modeled**; browser, exhaustive historical checks, physical hardware and production mating acceptance are not claimed.

The official description/specification disagree about ADS1110/ADS1100 naming, internal2.048V versus VDD reference and15/30/60/240 versus8/16/32/128 SPS. The exact own schematic and rear print say ADS1110. This conflict was rechecked and submitted to official knowledge feedback, receipt **7d083ce9fb334c50ba440a29d0591ee0**. The model does not resolve those electrical claims through invented behavior.
