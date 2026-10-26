# Unit GPS SMA U190

Snapshot: 2026-10-26. Stage `modeled`; full browser/reference acceptance is deferred, so this product remains unverified.

The exact U190 official structure retains all **6,592 triangles** of the assembled shell at scale 1, using only one common translation. Components 1 and 2 are displaced separate shell copies and are excluded. The native front and rear label recesses, SMA retention windows, mounting bores, Grove cutout, shell separation and rear M5 relief remain intact. The own dimension drawing distinguishes the **24 × 64 × 8 mm shell** from the **24 × 71.4 × 8 mm complete Unit including SMA**. The supplied antenna is excluded from both Unit dimensions. Mounting pitch is 16 mm and the bores are Ø4.85 mm.

Official U190 documentation identifies ATGM336H with AT6668, MAX2659 and the cabled active antenna. The schematic adds a backup cell and blue 1PPS LED package. The exact photographs show an externally threaded SMA female body with a recessed female centre contact, blue four-contact Grove socket and a supplied straight male SMA coupling feeding a black coax cable and rounded puck. There is no photographed hinge. The closed opaque covers and labels provide no confirmed external optical path for the internal blue LED: it remains a passive concealed package, without a registered LED, fictitious window or halo.

The assembled model adds the actual PCB with mounting and Grove reliefs, GNSS module substrate/shield/castellations, MAX2659 package, backup cell and retaining tab, regulator, passives, concealed non-emissive LED package, SMA thread/socket/dielectric/backing, inferred internal coax/IPEX termination, actual blue Grove walls/latch/contact interiors and fixings. Deep connector cavities terminate on physical backs. Original SMA retention windows reveal the actual retained hex body from both faces. Geometry closes the assembly independently of printed layers. Concealed population layout, PCB plane/outline/thickness, package dimensions, SMA seating/contact/thread detail and internal adapter route are appearance reconstruction. The schematic calls E1 IPEX while the exterior is visibly SMA; the internal adapter topology is not confirmed by an official production assembly or BOM and is marked inferred.

`Model` and `GroveModule` export the fixed Unit. Stable components are `grove`, `sma` and passive `sensor`. `GroveModule` supplies four real colored wires, two plugs, `cable` and `unitFrame` using the existing host attachment/pose interfaces. There are no buttons, joints, visible LED or automatic animations. `sensor` does not implement GNSS, satellites, position, fix, NMEA, PPS, time, UART, RF, voltage, electrical or firmware commands.

The separate `Antenna` module reproduces the supplied **38 × 36 × 13 mm** closed black puck, male internally threaded coupling with a real centre pin, fixed crimp/straight relief and flexible coax jacket. The gold face is printed artwork on an independently complete black housing. The accepting `Port` connector and module `meta.connector` are both `sma-female` because matching is exact; the accessory's actual physical connector is recorded as `meta.physicalConnector: 'sma-male'`. The library does not derive connector sex automatically.

```js
import {Model, GroveModule, Antenna, spec} from '../../../src/units/gps-sma/index.js';
const model = new Model({antenna:true}); // default is antenna:false
const points = structuredClone(spec.antenna.points);
points.at(-1)[0] += 25;
model.handle({type:'shape',target:'sma/shape',points});
const state = model.get('sma/shape').getState();
const saved = model.port('sma').detach({dispose:false});
model.port('sma').attach(saved); // restore the same fixed mating frame
// Or attach a separate new Antenna({points}) to the empty SMA port.
// On a host Port named unit, the nested command target is unit/sma/shape.
```

The `shape` command accepts **3–32 finite xyz arrays in millimetres**, each axis within ±1500 mm, in the accessory's SMA module-port frame. Point 0 must be `[0,0,0]`; point 1 must follow +Y with x=z=0 and y≥18 mm past the fixed straight relief; consecutive points must be ≥2 mm apart. The visual cable begins at the retained relief exit `[0,10,0]`, passes through points 1 onward and terminates at the last point. The puck's cable-entry position follows this endpoint and its local +Y follows the final cable tangent. Valid external poses rebuild only the visible coax geometry and move/orient the entire puck with its printed layer. The fixed Unit, SMA, Grove and male coupling stay unchanged. Invalid point sets throw before replacing geometry or state, and external poses emit no input echo. Default points form a compact approximately bundled cable pose; there is no hinge, tilt/RPM control, automatic motion, slack solver, bend-radius enforcement, collision prevention or cable physics.

State includes `points`, `space: 'module-port'`, published `nominalCableLengthMm:1000`, actual reconstructed `curveLengthMm`, inferred `cableOuterDiameterMm:2.8`, `cableStartMm`, published `puckMm:[38,36,13]`, `puckCableEntryPositionMm`, `puckQuaternion` and `dimensionsInferred:true`. The default visible curve is about **994.79 mm**, measured from the fixed relief exit, rather than a certified 1 m physical cable. The gold label dimensions/registration, coax OD, installed connector depths, puck profile/entry and chosen curve are visual estimates. Other frameworks own all GNSS, RF and electrical behavior.

Three synchronized high-resolution PNGs were newly code-drawn from readable exact U190 official photos: Unit front, Unit rear and supplied active puck front. They are `reference-redraw`; no photographic pixels, source vector, generator, private mapping or table is distributed. Unreadable identifiers are omitted. Typography, color and label registration remain reconstruction. `artwork:false` removes only print and preserves every physical attribute/index byte and world matrix in bare and antenna configurations, for both exports.

Necessary local checks cover exact CAD retention/envelopes; genuine open mounting paths and FrontSide bore walls; real SMA male/female bores, contacts and backing; fixed concealed assembly; external coax/puck pose, invalid rollback, fixed frames and no input echo; independent accessory remove/refit; artwork physical-buffer/world-pose invariance; nested four-wire Grove host pose/peer independence/detach; and resource disposal. See [smoke.json](smoke.json), [sources.json](sources.json) and [artwork.json](artwork.json). Browser visual acceptance, production fit, physical cable measurement and hardware validation remain deferred.
