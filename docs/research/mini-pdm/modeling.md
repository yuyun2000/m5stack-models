# Unit Mini PDM U089

Stage: `modeled`; visual/browser and physical acceptance are unverified. Millimetres: +X front-label right, +Y twin acoustic slots, +Z circular microphone-symbol front.

## Own official facts and dimensions

The official U089 product table lists **24 × 24 × 13 mm**. Its own linked dimension drawing explicitly labels **24 × 24 × 8 mm** overall, **5.2 mm** Grove height, **10 mm** connector width, Ø5 mounting holes at **16 mm** pitch, and the hole row 12 mm from the bottom. The exact U089 assembled native shell likewise measures **24 × 24 × 8 mm**. A same-product official MCP recheck did not resolve the conflicting 13 mm table thickness, and own official photos show no extra 5 mm external subassembly. The discrepancy was submitted to the official MCP, receipt `dcd6f74080ea478f8745ce19d5542ab8`; an accepted feedback receipt is not a corrected specification.

The model retains the complete native shell at scale 1. `nominalMm` remains `[24,24,13]`, `dimensionDrawingMm` and `cadEnvelopeMm` are `[24,24,8]`, and the measured visual assembly is `[24,24,8.05]`, including a reconstructed 0.05 mm front adhesive film. `size` follows that visual envelope. No stretching, flattening or invented 5 mm spacer reconciles the conflicting sources.

The own structure path `Products/U089_Unit_Mini_PDM/Structures/Unit_Mini_PDM.stl` was retrieved at path-specific commit `78baf68c49d623a7c8a9277c45d97c8e4ffbb80d`. Its bytes match Git blob `fb8c5852c5a4357cf0adc9e049cb8c1d0618c253`. Component 0 contains all **4162** assembled front/rear shell triangles. Components 1/2 are displaced duplicate shell halves. One shared translation retains every selected native face, its mounting holes, two sound slots, Grove bay, rear recessed label panel and native M5 emboss. There is no local cut, patch, fill or part repositioning. [CAD map](../../../src/units/mini-pdm/cad-map.json) records source, transform, hashes and MIT attribution. Similarity to another Mini Unit shell is not by itself treated as an incorrect official source.

The own product and schematic identify U1 **SPM1423HM4H-B**, U3 **HT7333**, C5/C6/C7 and the HY-2.0_A four-pin connector. The official linked Knowles datasheet, Revision A, sheet 5, explicitly gives **width 3.760 × length 4.720 × height 1.310 mm** and a **Ø0.840 mm** top acoustic port. The six underside lands and their asymmetric first land follow that mechanical diagram. Concealed mounting location, board layout and internal diaphragm depth are appearance reconstruction.

## Complete physical appearance

The complete native shell is backed by a shaped PCB with real mounting reliefs and a central retaining bore, a fixed three-pin regulator and three documented capacitors, a six-land microphone substrate, a real metal package with a through acoustic bore and a deeply recessed non-emissive membrane, four-contact white Grove socket with side rails/latch/physical rear carrier/tails, and a fixed rear retaining screw and concealed shank. The two shell sound slots retain native walls and see the real deeply recessed microphone can; they do not open onto empty space or a decal. The package's Ø0.840 bore has FrontSide inner walls and a physical passive backing more than 1 mm below its top.

The front circular and rear rectangular adhesive films are physical geometry, both seated directly on the native support surfaces. Their two final ordinary PNGs are `reference-redraw`; [artwork provenance](artwork.json) records sources, dimensions, placement and hashes. The front reproduces the blue microphone and green stepped symbol. The rear reproduces the readable exact-model `PORT.I2S` and `CLK / DAT / 5V / GND` marking; the older printed label does not create a protocol implementation. No audio visualization, speaker cone movement, LED, button or articulated joint is invented.

## Agent integration

```js
import { Model, GroveModule, spec }
  from '../../../src/units/mini-pdm/index.js';

const unit = new GroveModule({ cableLength: 55 });
host.port('portA').attach(unit); // use an existing host Grove port
host.handle({ type: 'pose', target: 'portA/unitFrame',
  position: [15, 70, -5], rotation: [0.2, -0.1, 0.3] });
host.update(0.016); // update four physical wire curves after pose changes
const acousticAnchor = host.get('portA/sensor'); // passive fixed position only
const detached = host.port('portA').detach({ dispose: false });
// detached.dispose() when the external owner no longer needs the assembly.
```

Exports are `Model`, `GroveModule` and `spec`. Own body component IDs are only `grove` and `sensor`; `sensor` is a passive `Component` visual anchor at the actual inferred acoustic-port placement, with no sensor-value command or input stream. A mounted module additionally exposes the standard cable and `unitFrame` pose controls. Grove cable-color order is Black GND, Red 5V, Yellow DAT, White CLK. Connector attachment represents mechanical appearance/lifecycle only and does not assign a compatible host PDM peripheral or GPIO mapping.

No audio, waveform, sampling, recording, loudness, clock generation, PDM/I2S, values, register, power, electrical, acoustic physics or firmware state is implemented. External frameworks own those functions and may use the fixed anchor for their own overlays. External pose commands do not echo input; normal port attachment/detachment still reports lifecycle intent. `artwork:false` disables only the print; shell, PCB, real sound cavities and both films remain byte-for-byte identical in all physical attributes/index/world transforms.

## Necessary construction evidence

[Local smoke](smoke.json) covers complete 4162 native triangles and separate CAD/visual envelopes; ten clear mounting axial paths; native/PCB/acoustic-bore FrontSide inner walls; twin native slot walls and real backing; coordinate-welded directed closure and positive signed volume for the PCB and bored package; six lands/three regulator leads/three capacitors/four Grove contacts; seated physical label films; Model/GroveModule artwork invariance; rejection of internal audio/value commands; nested four-core cable pose, independent peer branch, detach, disposal and no input echo. This is construction evidence, not full browser acceptance, manufacturing fit, recording, acoustic, electrical or hardware validation. No exhaustive browser or historical suite was run.
