# Unit Mini ToF-90° U196

Stage: `modeled`; browser/physical acceptance remains unverified. Millimetres: +X front-label right, +Y fixed optical sensing direction, +Z front label. The 90° name describes a **fixed board installation**, with no hinge or tilt joint.

## Official facts

- Own U196 product page and dimension drawing specify 24 × 24 × 8 mm. Mounting centres are 16 mm apart and 12 mm from the Grove end, with nominal Ø4.85 bores. Coarse native bore facets have smaller inradii; the original geometry is preserved.
- Own Unicode degree-sign structure path `Products/U196_Unit_Mini_ToF-90°/Structures/Unit_Mini_ToF-90°.stl` was fetched at its latest path-specific commit `d3ae864f161167af3f9698214012e1d135adc357`. The bytes match Git blob `5cabc9b77493bde97465f65f7e462099be24e023`. Complete native rear 1, front 2 and narrow Grove-side insert 4 (4550 triangles) retain one shared translation and scale 1. Components 0/3/5 are displaced duplicate parts. [CAD map](../../../src/units/mini-tof-90/cad-map.json) records source, transform, hashes and MIT attribution.
- Own schematic divides the assembly into 1F (J1 Grove, U1 ME6206A33XG, I2C pulls, D1 red LED) and 2F (U2 ToF package, XSHUT/GPIO1 pull-ups and local decoupling). P1/P2 carry four corresponding physical links. Official side photo and drawing show the optical package facing the end opposite Grove.
- The product describes the sensor family as VL53L0X; its own photo label reads VL53L0C and schematic U2 is VL53L0CXV0DH/1. This is **not an unresolved part contradiction**: official ST VL53L0X datasheet DocID029104 Rev 1, page 37 Table 17, names VL53L0CXV0DH/1 as its sales type. Page 6 gives the optical LGA12 package at 4.40 × 2.40 × 1.00 mm. No error feedback was needed for that name difference.
- Official red Grove pin labels are GND / 5V / SDA / SCL in cable-color order. These are documentary labels, with no bus or power model.

## Physical reconstruction and appearance

The model includes both complete shells, the native narrow insert, 1F horizontal PCB, 2F upright PCB, four continuous right-angle metal board links and their dielectric carriers, regulator and passives, real optical LGA12 substrate and twelve lands, two separated non-emissive optical windows with deep FrontSide baffle walls, matte-black optical surround, four-contact recessed Grove housing, central retaining screw, and physical front/rear adhesive substrates. These remain with `artwork:false`. Label films bridge the native label slots as shown by the real product labels; the image does not substitute for missing PCB or optical geometry.

PCB outlines, planes and hidden population; board-link pitch and detailed installation; package apertures and inner window detail; optical-surround geometry; Grove cavity/contact details; adhesive thickness; and print placement are inferred appearance. The fixed board normals are perpendicular. The passive optical surface faces +Y; no visible infrared, rays, detection cone, measured distance or FoV controls exist.

D1 is documented red. A separate native insert occupies and backs the narrow Grove-side slot. This model uses that native part as an inferred light guide and exposes `power-led`, default off, fixed red `#ff2020`. External `on`/`brightness` writes change only its material emissive term; **no Sprite, halo or new shell window** is added. The material and concealed D1-to-guide coupling are inferred, not confirmed manufacturing data. Cable connection and elapsed time never turn it on. Color commands do not convert it into RGB hardware.

## Agent integration

```js
import { GroveModule as MiniToF90 }
  from '../../../src/units/mini-tof-90/index.js';

host.port('portA').attach(new MiniToF90({ cableLength: 55 }));
host.handle({ type: 'led', target: 'portA/power-led', brightness: 0.5 });
host.handle({ type: 'pose', target: 'portA/unitFrame',
  position: [15, 75, -5], rotation: [0.2, -0.1, 0.3] });
host.update(0.1); // seconds, for four-core cable pose/interpolation only

const unit = host.port('portA').module;
const passiveAnchor = unit.get('sensor'); // fixed +Y; rejects value/range commands
console.log(unit.get('power-led').getState()); // { color:'#ff2020',brightness:0.5 }
const detached = host.port('portA').detach({ dispose: false });
host.port('portA').attach(detached);
```

Public exports are `Model`, `GroveModule` and `spec`. Body components are `grove`, passive `sensor`, and `power-led`. No buttons, joints, tilt, measurement state, automatic power, I2C registers or firmware reset are provided. External appearance writes never echo input intent. Numeric sensing, optical/electrical behavior and hardware function belong to the external runtime.

## Artwork and necessary checks

Two final ordinary PNGs are own-model `reference-redraw`; readable marks were drawn from U196 front 02 and rear 10 photographs. [Artwork provenance](artwork.json) records exact sources, placement and output hashes. Private table, vectors, raw photos, mappings, generators and intermediate files are not distributed.

[Local smoke](smoke.json) covers complete native triangle preservation and envelope; ten empty mounting paths; native/PCB FrontSide bore walls; eight optical aperture wall rays; the fixed perpendicular boards and four continuous links; LGA12/non-emissive separated windows; real optical/Grove/slot/label/screw backing; passive-anchor command rejection; fixed red material-only LED and no input echo; both Model/GroveModule artwork geometry/index/world-transform invariants; four-core nested cable pose, independent peers, attach/detach and disposal. It is construction evidence, not visual acceptance, manufacturing fit or hardware verification. No exhaustive browser review or historical suite was run.
