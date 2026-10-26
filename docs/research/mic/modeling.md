# Unit MIC U096

Stage: `modeled`; browser/physical acceptance remains unverified. Millimetres: +X right, +Y away from Grove, +Z microphone and threshold-adjustment face.

## Official facts and native shell

Own U096 official product page and dimension drawing give 32 × 24 × 8 mm, normalized viewer envelope 24 × 32 × 8 mm, a Ø5.2 microphone opening, a 6.9 × 7.1 mm adjustment opening, 16 mm mounting pitch and two Ø5 mounting holes. Own official front, rear and exposed-PCB photographs establish the metal electret microphone, external blue square 10K trimmer with cross-slotted silver adjustment head, black Grove and rear label. The schematic documents U4 MIC, U2 MAX4466, U1A LM393DR2G, U3 HT7533, R2 RPot 10K and J1. No LED is present in the own schematic or exterior references; no invented window, LED, button or display is added.

The exact own structure path `Products/U096_Unit_MIC/Structures/Unit_MIC.stl` was retrieved at latest path-specific commit `78baf68c49d623a7c8a9277c45d97c8e4ffbb80d`. Bytes match Git blob `64dc44f3ea9ab1f1492e23fa2d596242a4cdf3f3`. Component 0 is the complete 3284-triangle assembled front/rear shell; 1/2 are displaced duplicate half-shells. One common rigid 180° Y rotation and translation maps the native microphone and square adjustment openings to +Z, rear label recess/M5 emboss to -Z. Every selected native triangle remains unscaled, uncut and unpatched. [CAD map](../../../src/units/mic/cad-map.json) records source, transform, hashes and MIT attribution. The full CAD and modeled physical envelope both measure 24 × 32 × 8 mm. No material dimension or part contradiction was found requiring official feedback.

The four cable-color labels are GND / 5V / D.OUT / A.OUT (black/red/yellow/white). Rear print shows the reverse-facing OUT/OUT/5V/GND band with A.OUT and D.OUT arrows. These are documented connector labels; the model performs no electrical or audio behavior.

## Physical appearance and motion

The model contains the complete native shell, shaped green PCB with mounting reliefs and retaining bore, LM393 SO8 body/eight leads, MAX4466 body/five leads, HT7533 body/three terminals, passive packages, fixed rear hex retaining screw, and black open HY2.0-4P cavity with four metal contacts, rear carrier, floor, rails and latch shoulders. Concealed board population/installation and pin geometry are inferred from own photographs and schematic, not manufacturing PCB coordinates.

The Ø5.1 mm physical metal microphone can has a hollow chamber with inward-facing walls, an insulating rear base and two soldered leads. Its front opening contains a recessed dark metal screen with **55 actual through perforations**, followed by an air gap and a physical acoustic diaphragm. The minimum screen edge material is approximately 0.197 mm; no tangent bores, flat black cap replacing a missing chamber, sound beam or fabricated vibration animation is used. Screen pattern, diaphragm depth and concealed capsule construction are visual inference; the acoustic capsule's full production part number is unconfirmed.

The front square aperture exposes the real blue trimmer package, fixed radial scale marks, recessed cross-slotted silver head, shaft and three solder terminals. `threshold` rotates only the head/shaft group around +Z. It supports `angleDeg` and `durationMs`, with a conservative ±135° visual range. This range is **not** a verified production stop or resistance calibration. The fixed blue body, scale, microphone, PCB, label and connector do not rotate. Nonzero RPM is rejected; angle zero restores the exact saved rest quaternion. A passive `sensor` anchor locates the microphone package; it accepts no sensor/audio data commands.

## Agent integration

```js
import { GroveModule as Mic } from '../../../src/units/mic/index.js';

host.port('portB').attach(new Mic({ cableLength: 55 }));
host.handle({ type: 'joint', target: 'portB/threshold',
  angleDeg: 80, durationMs: 180 });
host.update(0.18); // seconds, appearance interpolation only
host.handle({ type: 'pose', target: 'portB/unitFrame',
  position: [15, 75, -5], rotation: [0.2, -0.1, 0.3] });
host.handle({ type: 'cable', target: 'portB/cable',
  slack: 14, bend: [0, 0, -1] });
host.update(0.016);
// Reset exact neutral head appearance:
host.handle({ type: 'joint', target: 'portB/threshold', angleDeg: 0 });
```

Exports are `Model`, `GroveModule` and `spec`. Body component IDs are exactly `grove`, `sensor` and `threshold`. Grove wrappers also expose `unitFrame` and `cable`. External appearance commands do not echo input; normal port attach/detach reports lifecycle intent. Sound, audio recording/playback, sampling, waveform generation, ADC, A.OUT/D.OUT state, voltage, resistance, threshold/comparator behavior, register/firmware state and hardware physics belong to the external runtime. `sensor` is a passive position anchor; the joint angle has no electrical mapping.

## Artwork and necessary verification

One final ordinary 1600 × 1220 PNG is exact-model `reference-redraw`, newly drawn from readable own U096 rear label marks. [Artwork provenance](artwork.json) records its source, placement and hash. The independent physical adhesive substrate remains with `artwork:false`; there is no front case sticker over the acoustic or adjustment openings. Source vectors, private table/mappings, raw photographs and generators remain outside distribution.

[Local smoke](smoke.json) proves all 3284 native triangles, both envelopes, ten empty mounting paths, native/PCB/capsule FrontSide bore walls, 55 empty screen paths with 220 FrontSide wall rays, positive screen clearance and physical diaphragm backing. PCB, microphone can, screen, trimmer body and four cap lobes have coordinate-welded closed directed edges and positive signed volume. It also checks physical Grove/rear-label/adjustment closure; finite head angle/duration/exact return/no-RPM/no-echo; fixed body/scale/port frames; both Model/GroveModule artwork invariance for every geometry attribute/index/world transform at rest and a moved head pose; and nested four-core Grove cable pose, independent peer detach and resource disposal. This is construction evidence, not browser, acoustic, electrical, production-fit or hardware acceptance. No exhaustive browser or historical suite was run.
