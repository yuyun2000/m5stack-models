# Unit VMeter U087

The model retains the **24 × 56 × 8 mm** native shell, in X/Y/Z order. The official product table lists56 ×24 ×8mm; its own dimension drawing additionally marks **10.2mm including the fixed terminal**. These values are recorded separately: shell nominal and CAD envelope remain8mm, while assembled visual depth is10.2mm. The removable accessory has a further separate envelope and does not redefine the chassis nominal size.

## Structure and physical backing

Original components0 and2 contain the complete rear and front shell halves, **3032 +2598 =5630 triangles**. Both use the same translation [0,−28,+4], scale1, with no rotation, cuts, fills, independent alignment or shape replacement. Displaced duplicates1 and3 are excluded. Native shell seam, centre clip slots, front recess, Grove mouth, terminal cutout and narrow LED slot remain unchanged. The two original mounting bores at[−8,−16] and[8,−16] retain their stepped geometry: the front nominalØ4.85mm section spans about4.8476–4.85mm across facets, while the rear section spans about4.9978–5mm.

A reconstructed green PCB has clear native-boss scallops, real centre fastening bore, Grove notch and its own-photo isolation slit. ADS1115, CA-IS3020S, EEPROM, regulator, passives and the visibly wound DC-DC package are separate physical packages. The own official block diagram establishes component identities; the own PCB photograph establishes the transformer and isolation-slit appearance. Concealed placement, package/lead dimensions, PCB Z and unshown outlines are visual estimates, not a production assembly.

The orange fixed HT3.96-4P socket has a true deep insertion cavity, rear stop, floor, four roof inspection windows and four metal contacts. Exact own product/package photographs show a separate orange four-wire-entry screw plug. `TerminalPlug` reconstructs that accessory with real mating and wire bores, recessed springs, clamp cages and four cross-recess screws. Its hidden mating geometry and insertion clearance are estimates. No electrical continuity or production fit is claimed.

The native front LED slit is backed by a physical carrier and lens. The own front photo explicitly labels this indicator and the product text confirms a power LED, but the linked schematic is a block diagram without LED color or circuit. `power-led` therefore defaults off, takes only external on/brightness, and fixes a **neutral-white preview estimate**. Metadata marks`colorConfirmed:false`. This is neither an official white-color specification nor an RGB hardware claim; color requests do not change hue. No automatic supply, attachment or measurement response is implemented. Documentation feedback was accepted; see[sources.json](./sources.json).

## External API

Exports are`Model`, `GroveModule`, `TerminalPlug` and`spec` from`src/units/vmeter/index.js`.

- `grove` is the real four-core connector at[0,−27.65,1.4], GND /5V /SDA /SCL.
- `terminal` uses`ht3.96-4p` at[0,28.04,2.6] and rejects Grove. Front-left two contacts belong to the printed positive pair, front-right two to the negative pair. Contact numbers1–4 are viewer indices only; the own block diagram supplies no individual four-pin numbering.
- `sensor` is a passive appearance anchor and accepts no measurement, calibration, ADC, voltage, isolation or bus commands.
- `power-led` accepts externally driven`on`/`brightness` only. The model has no buttons, display, local rotary joint or automatic values.

```js
import {Model, GroveModule, TerminalPlug} from './src/units/vmeter/index.js';
const unit = new Model({terminalPlug:true});
unit.handle({type:'led',target:'power-led',brightness:0.35});
unit.handle({type:'joint',target:'terminal/screw-1',angleDeg:70,durationMs:150});
unit.update(0.15);
unit.handle({type:'joint',target:'terminal/screw-1',angleDeg:0});

const bare = new Model();
const plug = bare.port('terminal').attach(new TerminalPlug());
bare.port('terminal').detach({dispose:false});
plug.dispose();

// Use the real host model's own Grove port ID.
const linked = host.port('grove').attach(new GroveModule({cableLength:60,terminalPlug:true}));
host.handle({type:'pose',target:'grove/unitFrame',position:[30,75,-4],rotation:[0.1,0,0.2]});
host.handle({type:'joint',target:'grove/terminal/screw-4',angleDeg:-40});
```

The four accessory`screw-1`…`screw-4` joints rotate only their respective visible heads. Finite angles and timed transitions are supported; nonzeroRPM is rejected. Setting angle0 restores the exact neutral quaternion. A viewer suggestion of±180° is not a tightening range. No axial travel, torque, clamp motion, pressure, wire-insertion logic, voltage, calibration, isolation, electrical behavior or firmware is implemented. External commands produce no input echo.

`GroveModule` supplies the common four distinct black/red/yellow/white wire curves, two physical cable plugs and an externally posed`unitFrame`. Attachment, pose changes and detach preserve separate ownership. The cable describes physical connection only; an external framework owns measurement, ADC conversions, EEPROM, isolation semantics, values and bus/firmware behavior.

## Evidence and remaining limits

[sources.json](./sources.json) records the exact official CAD blob, official product/schematic/dimension references, reconstruction inferences and accepted documentation feedback. [artwork.md](./artwork.md) describes both synchronized reference-redraw PNGs. Raw CAD, photos, spreadsheets, private source names/links, original vectors, generators and intermediates are excluded.

[smoke.json](./smoke.json) records necessary local geometry/API checks: original complete source envelope, unobstructed mounting bores and explicit FrontSide material walls on both steps, real connector cavities/windows/contacts, LED backing and independent brightness, detachable plug bores, four independent screw transitions/exact reset, no input echo, four-wire Grove pose/attach/detach and resource disposal, passive command rejection, and artwork invariance of physical attributes/index/world matrices. This is **modeled**, not verified. Browser pixel acceptance, full historical checks, real devices, electrical behavior and production mating fit are not claimed.
