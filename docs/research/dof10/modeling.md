# Unit DoF10 · U230

Stage: `modeled`; browser and physical acceptance remain unverified. Retrieved 2026-10-26. [Official product](https://docs.m5stack.com/en/unit/Unit_DoF10), [sources](sources.json), [artwork](artwork.json), [necessary local checks](smoke.json).

## Exact native assembly and dimensions

The exact own source `Products/U230_Unit_DoF10/Structures/Unit_DoF10.stl` is pinned to hardware commit `e29c139cbc7c80b5ccc5557e5ab8025a7a19a109`, blob `cbb28004b34a94fbabaebe05148fa4e74c7cb65d`, last changed at `681b2cbd645bb27a3ff23f877c17b5804cf45444`. SHA and transform are recorded in [cad-map](../../../src/units/dof10/cad-map.json). Component **0 is the complete assembled front/rear housing, 4,188 triangles**. Components 1/2 are the separately laid-out rear/front duplicates and are excluded. All original assembled faces and indices remain at scale 1 under the common translation from source origin `[122.52239990234375,12,−4]`; no faces are filled, patched, removed or independently repositioned.

Axes are millimetres: +X front-label right, +Y actual SW1 top slot, +Z XYZ label. Nominal and native envelopes are **24×24×8 mm**. Independent circular XYZ adhesive film adds 0.04 mm at the front, so the visual envelope is **24×24×8.04 mm**. The official linked common DoF6/DoF9/DoF10 drawing gives two Ø5 mm mounting holes at X±8/Y0, 16 mm apart; a 7.22×3 mm open SW1 slot; and a rear central Ø4 head/Ø1.6 shaft retaining bore.

The native combined assembly preserves front/rear coincident mating edges at Z−1.2. At 0.0001 mm coordinate quantization, raw source gives **12 four-face/balance-zero edges**, while runtime Float32/merge quantization gives **14**; all other edges have two faces and zero directed balance. These are recorded separately. The two original independently laid-out shell components each have strictly two-face directed closed edges and positive volume. All 4,188 assembled source triangles match these original closed shells within 0.0001 mm, with maximum vertex distance 0.00000763 mm. The combined source assembly is not claimed to be a single manifold. No source repair is used to remove its real mating coincidence.

Mounting bores retain their layered native profile. At near-face Z±3.6, the chamfer mouth joins the outside edge in the outward X direction; inward X and both Y walls remain present. At Z−3/0/+3 all four radial directions hit original FrontSide material walls. Empty full-height axial paths and these distinct source cross-sections are checked without adding artificial closure faces.

## Complete physical construction

Own product photos and schematic establish one red open HY2.0-4P Grove socket, BMI270, BMM350, SPA06-003, ME6206A33M3G and SSP7615-18DFR regulators, five resistors R1–R5 and eleven capacitors C1–C11. No local MCU, LED, display or USB is shown. The reconstructed socket has actual side/floor/guide/retaining geometry, a recessed dielectric rear, four metal contacts and retained solder legs. A shaped 0.8 mm PCB has true mounting reliefs, a central retaining bore and the Grove notch. Physical components close the corresponding real assembly openings; artwork does not fill missing geometry.

Official linked manufacturer drawings establish the three distinct sensor packages. BMI270 is 2.5×3×0.83 mm LGA14; BMM350 is 1.28×1.28×0.5 mm WLCSP9 with a 0.306 mm body and 0.194 mm ball height; SPA06-003 is 2×2.5×0.95 mm LGA8 with a metal lid and actual Ø0.3 mm pressure orifice. The model supplies 14 pads, nine physical solder balls and eight pads respectively, seated on the PCB at Z−1. The pressure lid has a real opening, FrontSide cavity walls and a recessed non-emissive floor. Two regulators have three and four physical terminals; all 16 schematic R/C parts have physical terminations. Hidden PCB/package positions, pad placement, pressure-hole installation and LDO envelopes remain inferred because the own hardware folder currently supplies Structures without production PCB/complete assembly BOM.

The top-edge rectangular native opening exposes the actual cream SW1 thumb in the fully assembled shell. A fixed switch body, open metal retainer and three fixed terminals remain independent of the moving thumb/stem. Two stable thumb detents are X−0.9 and X+0.9; the 1.8 mm visual throw is inferred from the own opening and switch note, not a rated switch travel. A fixed real hex-socket retaining head has cavity walls, recessed floor and shaft. Front title, circular XYZ and rear PORT.A films are separate physical substrates.

## External appearance API

Exports are `Model`, `GroveModule` and `spec`. Body component order is `grove`, `address`, `sensor`. `grove` is a bottom-facing Port with connector `grove` as the HY2.0-4P mechanical family and documentary GND/5V/SDA/SCL labels. `address` is a latching Button controlling only the real physical SW1 thumb. `sensor` is a passive Component at `[0,0,−0.5]` with empty state; it does not produce IMU, magnetic, pressure, temperature, heading, quaternion or pose readings. There are no LEDs, displays or joints.

`press(source)` toggles the stable detent only for the first active source; another held source does not toggle it again. `release` or `cancel` ends the source press while **retaining the stable detent**. `cancel` emits a cancelled up event without click. For exact physical reset use `setPosition(0,{immediate:true})`; the accepted stable positions are only 0 and 1. The fixed housing, PCB, sensor packages, Grove, retainer, screw and films do not move. External position commands do not echo input intent or calculate an electrical address.

```js
import {Model,GroveModule} from '../../../src/units/dof10/index.js';
const unit=new Model();
unit.button('address').press('pointer:1');
unit.update(.3);
unit.button('address').cancel('pointer:1'); // Remains at stable position 1.
unit.handle({type:'position',target:'address',position:0,immediate:true});
const accessory=new GroveModule({cableLength:60});
host.port('unit').attach(accessory);
host.handle({type:'pose',target:'unit/unitFrame',position:[10,90,5],rotation:[.2,0,.1]});
host.handle({type:'cable',target:'unit/cable',slack:15,bend:[0,0,-1]});
host.handle({type:'position',target:'unit/address',position:1,immediate:true});
host.update(.2);
```

`GroveModule` uses the existing two-plug four-conductor cable framework and adds `unitFrame`/`cable`. It supports transformed parents, independently driven unit pose and cable bend/slack. There is no automatic orientation, BMI270 address computation, I2C routing, power, measurement, electrical or firmware simulation.

## Exact own artwork

Three own original outlined groups become ordinary high-resolution `source-vector-raster` PNGs: 1782×370 front title, 626×626 circular XYZ and 1605×401 rear pin strip. Independent alpha bounds preserve original letterforms, palette and layout without retyping, photographic pixels, packaging or another DoF variant. The private conversion sees 30 outlined paths, zero live text and zero embedded images. Artwork is attached to the corresponding independent physical films. `artwork:false` preserves every physical attribute, index and world matrix in both Model and GroveModule. Supplied table, private mappings, original names/URLs, vectors, generator and intermediates are excluded from distribution.

## Necessary validation and boundary

Local smoke passes complete 4,188-triangle/native/visual envelopes, 10 empty mounting axial rays, 44 FrontSide material-wall rays across native/PCB/pressure bores, original mating-seam accounting and seven newly constructed strictly directed closed positive-volume solids. Raw independent original shells are also closed with positive volume and all source assembly triangles correspond. Three manufacturer-sized package envelopes and 14/9/8 contacts meet their PCB/body planes; physical Grove contacts/rear, exposed SW1 thumb, films and hex-floor rays are checked. The real mouth outlet at Z±3.6 is explicitly recorded rather than closed artificially.

Stable0/1, multi-source pressing, cancel retaining detent, exact0 reset and fixed non-thumb geometry pass. Both entry artwork configurations are physically invariant. Transformed-parent four-core pose/cable, nested control and independent-peer checks pass; all 488 tracked resources dispose. These are necessary construction and appearance-interface checks only. No lengthy browser face-by-face re-review, manufacturing fit, protocol/electrical or physical-device acceptance was performed. The product remains `modeled` with visual verification null.
