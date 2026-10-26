# Unit Tube Pressure U130

Modeled on 2026-10-26 from the exact U130 official product page, dimension drawing, schematic, same-model assembled/bare-board photographs and MIT M5_Hardware structure. The original CAD, reference images, long MCP response and generators are local working material. Public provenance is in `sources.json` and the unit's `cad-map.json`.

The complete selected native rear/front assembly contains 3388 triangles. Components 1 and 2 retain one common rigid translation `[-0.013, -4, -1.2]` mm at scale 1. Components 0 and 3 are displaced duplicate halves. Original mounting bores, circular sensor opening, connector cutout, side seam, rear recessed label and M5 relief remain in the source surfaces.

Model axes are +X right, +Y away from Grove and +Z towards the single tube nozzle. The exact drawing separates 24×32×8 mm shell and a Ø3 mm nozzle extending 4.5 mm above its front, giving 24×32×12.5 mm in model axes. Vendor order is 32×24×12.5 mm. Mounting pitch is 16 mm; minimum printed bore is Ø4.85 mm. Native faceted bore cross sections vary slightly with depth and direction and are retained.

This is the single-nozzle MCP-H10-B200KPPN product. It has no second differential-pressure tube. The real tube lumen continues into the sensor package and ends at a separately modeled recessed sensing backing. It is not a dark cap or a sticker. The upper carrier closes the original sensor aperture around the nozzle, with six physically recessed molding pockets. Its concealed package, six leads, five capacitor packages, HT7533 regulator, PCB and central retaining screw are present. PCB edge reliefs and its central fastening hole preserve mounting clearances. The black Grove receptacle has four independent metal contacts, real side/floor/rear walls, latch/guide geometry and physical solder tails.

PCB installation and concealed population, package dimensions, lumen diameter/depth and diaphragm detail, tiny molding pockets, contact internals and screw installation are appearance reconstruction. No production fit or pneumatic characterization is claimed. There is no documented external lamp, button or rotary part, so none is registered.

## Public API

```js
import {Model, GroveModule, spec} from './src/units/tube-pressure/index.js';

const unit = new Model();
const cabled = new GroveModule({cableLength: 70});
host.port('grove').attach(cabled);
host.handle({type: 'pose', target: 'grove/unitFrame',
  position: [12, 72, 0], rotation: [0.1, 0, 0.2]});
const nozzle = host.get('grove/tube');
host.port('grove').detach();
```

`grove` uses the `grove` connector type. Its documented wire order is GND, 5V, NC, Analog Output. Pin labels are metadata and do not execute voltage or electrical behavior. `tube` uses mechanical connector type `tube-3mm`, no electrical pins and a +Z outward mating frame at `[-0.013, 7.95, 8.5]` mm; a Grove module is rejected. This repository does not supply an invented hose accessory or pneumatic engine. A separate consumer may implement a matching mechanical module with its own appearance provenance.

`sensor` is a passive `Component` anchor. It rejects pressure, gas, flow, conversion, calibration, voltage, I2C, sensor-value and firmware commands. No timer, measurement, events, colors or enclosure changes are driven by readings. The model owns shape, connector frames, input intent and externally requested cable pose only.

`artwork:false` removes the one rear PNG projection while preserving all physical attributes, indices and world matrices. Front shell printing is absent in same-model references; its native molded detail remains visible. The public runtime only contains the newly drawn rear PNG, marked `reference-redraw`; there is no cropped product photo.

## Necessary validation

`smoke.json` records full shell/nozzle envelope, native triangle count, ten empty mounting paths, FrontSide original/PCB hole wall checks, five deep tube paths and sixteen lumen wall rays, sensing carrier/connector/screw closure, passive API, mechanical connector rejection, PNG projection and exact physical invariance, four actual cable wires/two plugs, pose updates, independent sibling attachment/detachment and resource disposal. Browser front/back/iso acceptance, full historical regression, hardware, measurement and production-fit validation are deferred. Stage remains `modeled`.
