# Unit CO2L U104

Stage: `modeled`; browser/visual and physical acceptance remain unverified. Millimetres: +X right, +Y ventilated top, +Z front grille.

## Own sources, dimensions and local shell amendment

This is **U104 CO2L with SCD41 and VRH3301NLX**, distinct from U103 CO2/SCD40. The own official product table lists **48 × 24 × 16 mm** in vendor length/width/thickness order; the own drawing and model X/Y/Z are **24 × 48 × 16 mm**. The drawing shows Ø5 mounting holes at 16 mm pitch, a 10 × 5.2 mm Grove mouth, a ventilated raised front cover and one long plus two short slots on **each** side. The drawing's 8 mm callout identifies the lower casing depth rather than total product thickness.

The own structure path `Products/U104_Unit_CO2L/Structures/Unit_CO2L.stl` was retrieved at path-specific commit `78baf68c49d623a7c8a9277c45d97c8e4ffbb80d`, verified against Git blob `7c2829ed80aed79770d05479ad6519f04d346b8e` and the source-byte SHA in [CAD map](../../../src/units/co2l/cad-map.json). Component 0 is the complete **13396-triangle input assembly**; components 1/2 are displaced duplicate shell halves. A common translation `[-240,0,5.2]` normalizes the input at scale 1.

The linked STL has solid side walls, in conflict with the exact U104 product photos and dimension drawing. This was checked with raw side projections and opposing FrontSide rays; all other native vents, bore patterns and dimensions agree. The discrepancy was submitted through official MCP and accepted as feedback **39fe0d8f32f54e4ca6b6434fc792efa8**. The output therefore includes a documented **local six-slot amendment** rather than falsely calling the original 13396 triangles unmodified.

Three capsule profiles pass through the two native side walls: long 20.5 × 1.2 mm at Y/Z `[8.45,4.1]`, short 8.1 × 1.2 mm at `[2.25,1.1]` and `[14.65,1.1]`. These sizes/registration are inferred from the exact-model drawing/photos, not production tolerances. Eleven original input side triangles intersect those apertures. The remaining original surfaces retain their positions, with boundary subdivisions where needed to join the new real bore walls. Every new wall vertex meets the original wall through an exact source-mesh intersection; there are no black fake-slot planes or silhouette scaling. The output shell has **19742 triangles**, with unchanged 24 × 48 × 16 mm envelope. Input/output hashes, component selection, aperture geometry, original/intersected/output triangle counts and topology are recorded in the CAD map.

The final runtime shell has zero open or directionally unbalanced welded edges. The original assembled CAD includes coincident front/rear seam edges with four incident faces; these are separately counted, with boundary subdivision exposing their segments, all at existing negative-Z seams outside the new slot region. They are not new openings or asserted to be a single manufacturing manifold. Slot walls have genuine thickness near 1.2 mm, with 1.8 mm between slot rows and 4.3 mm between short slots. No original front grille, mounting hole, Grove opening, rear recess, seam or M5 emboss is replaced by artwork.

## Physical PCB and sensor assembly

The official schematic identifies **SCD41**, **VRH3301NLX**, F1 6V@1A, two 15K pull-ups, four capacitors and four protection diodes. It does not show a buck inductor, MCU, LED, button, display or mechanical actuator. The model contains these actual component families with a shaped PCB, mounting-boss reliefs, a central retaining through-bore and four real Grove solder bores with positive edge clearance. Hidden PCB geometry/plane, electronic placement and minor package envelopes are inferred from the cavity and exact product references.

The own linked Sensirion SCD4x datasheet v1.1, April 2021, pages 5 and 19 was rendered and read. Its LGA has **20 perimeter lands plus split central ground21**. The model includes 20 perimeter pads and four physical ground quadrants, a **10.1 × 10.1 × 0.8 mm** substrate, a hollow rounded metal can tapering **8.5 → 7.8 mm**, and a physical notched white protection membrane. The page 19 nominal can rise is **5.5 mm**, giving **6.3 mm nominal total package height**. The first-page 6.5 mm form-factor figure does not replace that nominal dimension table. The membrane's notch marks polarity; no removable cover, moving element or gas-flow simulation is invented. Internal can opening/corner shape, membrane outline, installed Z/Y/yaw and solder setup remain inferred.

The linked AnaSem VRH series datasheet Rev E13-01 identifies the `L` package option as **LLP-4**, not SOT-25. Printed page 29/PDF page 30 gives **1.2 × 1.6 mm**, typical **0.55 mm** height, four corner contacts and an exposed ground paddle. These are separate physical geometry. The exact regulator/capacitor/protection installation is inferred; no electrical or power simulation is implemented.

The exact U104 red HY2.0-4P socket has side rails, locking shoulders/bridge, a recessed dielectric rear carrier, four metal contacts, bent tails and board shanks. A fixed retaining head/shank sits in the native rear recess. Front ventilation holes look into the real protection membrane, sensor can, PCB and cavity; genuine side slots retain their intentional openings and real interior depth. The model does not paint over absent hardware.

## Ink, labels and Agent integration

Two final ordinary `reference-redraw` PNGs reproduce only readable exact U104 markings. The front gray CO2L text prints directly on native shell; no fictitious adhesive film is added. The rear physical adhesive film is seated on the closed native recess and carries the readable CO2L/SCD41/(SINGLE SHOT)/Humidity/Temperature and PORT.A.I2C pin labels. [Artwork provenance](artwork.json) records source URLs, hashes, image dimensions and registration. No photographic pixels, private source files, vectors, generators or intermediates are distributed.

```js
import { Model, GroveModule, spec }
  from '../../../src/units/co2l/index.js';
const unit = new GroveModule({ cableLength: 65 });
host.port('portA').attach(unit); // an existing physical Grove port
const sensorAnchor = host.get('portA/sensor'); // passive fixed package anchor
host.handle({ type: 'pose', target: 'portA/unitFrame',
  position: [15, 80, -5], rotation: [0.2, -0.1, 0.3] });
host.update(0.016); // update the four physical wire curves
const detached = host.port('portA').detach({ dispose: false });
// detached.dispose() when the external owner no longer needs it.
```

Exports are `Model`, `GroveModule` and `spec`; IDs are `m5stack.unit.co2l` and `m5stack.unit.co2l.grove`. The body's registered components are only `grove` and passive `sensor`. A mounted module also has common `unitFrame` and `cable`. Cable colors are Black GND, Red 5V, Yellow SDA and White SCL. Interface annotations do not provide bus/electrical functionality.

The `sensor` is a fixed appearance anchor; CO2 values, humidity, temperature, measurement modes, single shot, calibration, registers, I2C, power, electrical behavior and firmware belong to external frameworks. The model provides none of those commands or synthetic readings. Whole-unit pose moves the physical assembly and cable endpoint without input echo. Port attach/detach still reports lifecycle intent. There is no button, LED, display or joint.

Both entry classes accept `artwork:false`; front ink/rear printing disappear while every physical attribute/index and world transform remains identical, including the rear film, sensor membrane and real slots. [Necessary local smoke](smoke.json) covers input/output shell counts/envelopes/directed topology, 27 transverse rays through both side walls (54 sampled apertures), 24 FrontSide slot-wall rays, positive webs/thickness, native mounting bores, PCB through-bores/FrontSide walls/closure, hollow sensor-can closure and membrane depth, actual package dimensions/pads, deep Grove contacts, rear film seating, own public API/internal-command rejection, artwork invariance, four-core pose/independent detach/disposal and no echo. These do not claim exhaustive browser review, production assembly fit, gas flow, CO2/RH/T accuracy, electrical, firmware or physical-hardware validation.
