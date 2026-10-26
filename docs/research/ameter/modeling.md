# Unit AMeter U086

Status: **modeled**. Millimetres: +X front-label right, +Y measurement terminal, +Z front. This is an appearance model; no ADC, current, fuse melting, calibration, protection, isolation, bus or firmware logic is implemented.

The U086 original structure retains all 3032 rear-shell and 2598 front-shell triangles under one common translation at scale 1. Displaced duplicate shells are excluded. Its stepped/faceted mounting bores, narrow LED slot, clips, central recess and connector apertures remain native. The product table gives 56×24×8 mm; the same product's dimension drawing distinguishes an 8 mm shell from **10.2 mm total fixed-terminal thickness**. The model preserves both values and does not shrink the orange connector to fit the nominal shell depth. The drawing labels the minimum mounting diameter 4.85 mm; the untouched native faceted bore is retained.

The physical PCB includes mounting-boss scallops, a fastening bore, Grove notch and real milled isolation slots. Own U086 bare-board photographs constrain the toroidal isolated supply/copper turns, rear converter package, ADS1115, CA-IS3020S, EEPROM, R050 shunt, fuse and passives. Package locations/depths and concealed attachment are appearance reconstruction; these are not production assembly datums. No VMeter divider, addresses or internal package population is reused as AMeter evidence.

`grove` is the real four-contact HY2.0-4P socket. `terminal` is `ht3.96-4p`, with four recessed metal contacts, a rear support and real upper latch slots. The official product contents call the accessory HT3.96-4P; its own hero image calls it VH3.96-4P. The model records the common 3.96 mm pitch. Printed plus-left/minus-right groups are preserved as spatial `PLUS/PLUS/MINUS/MINUS` labels; pin `n` is a viewer slot index and does not assert schematic numbering or continuity.

```js
import {Model, GroveModule, TerminalPlug} from './src/units/ameter/index.js';
const meter = new Model({terminalPlug: true});
// Alternatively: meter.port('terminal').attach(new TerminalPlug());
meter.handle({type: 'joint', target: 'terminal/screw-1', angleDeg: 65, durationMs: 140});
meter.handle({type: 'led', target: 'power', brightness: 0.5});
// For a host Grove port: host.port('portA').attach(new GroveModule({terminalPlug: true}));
```

The supplied plug has actual wire-entry bores, recessed clamp cages, mating tongues/springs and four independently driven cross-recess screw heads. `screw-1` through `screw-4` accept external `angleDeg`/`durationMs`; nonzero RPM is rejected. These visual angles have no tightening, axial motion, clamp force, wiring or electrical effect. External commands emit no user-input echo. Plug and cable attach/detach preserve the fixed body.

The `power` indicator defaults off and accepts independent external on/brightness. Its native aperture, own-photo LED callout and bare-board phosphor-like package establish a real optical path. **Warm white is an appearance estimate, not a confirmed U086 colour specification**: `meta.colorConfirmed` is `false` and `colorEvidence` records that boundary. External colour requests retain this fixed visual estimate; no RGB hardware or automatic power/current response is implied. No button, rotary mechanism or screen is invented. `sensor` is a passive visual anchor with no values or measurement commands.

Two high-resolution PNG panels are newly drawn from this model's own official photographs. The front range/meter print and back current block diagram are fixed artwork, not live numerical or circuit output. Both are `reference-redraw`, with photo-derived typography, colours and registration. `artwork:false` suppresses only artwork; all physical attributes/index/world matrices remain identical. Source photos, private tables/links, vector/generator files and conversion intermediates are excluded from the repository.

Necessary local smoke covers native bounds/triangles, through-holes and FrontSide walls, true connector backing/contacts, real LED line of sight, screw animation/exact neutral, no input echo, external LED independence, four-core Grove attachment/pose/detachment/resource release and artwork physical invariance. Full browser front/back/iso, physical hardware and production-fit validation remain deferred; stage stays modeled. Official source conflicts were submitted as feedback `50ef770e4de548bf891c91e00ed8fe2f`.
