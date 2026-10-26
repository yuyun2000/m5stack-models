# Unit MQ U199

The exact native assembled shell is **24 ×64 ×25mm** in X/Y/Z order, matching the manufacturer’s64 ×24 ×25mm specification. Original component0 is retained whole, **6718triangles**, scale1 with one common translation[0,−32,+4]. Displaced duplicate front/rear components1/2 are excluded. Native cylindrical hood, centre fin, socket opening, side seam, mounting bores, screw seats and Grove notch are unchanged.

## Actual assembly and size distinction

The own dimension drawing’s64mm endpoints enclose the shell, while a small socket rim protrudes above it. The raw shell CAD does not contain the removable MQ-5 can. The own official photo08 shows the round six-pin can removed beside the six-hole socket; it does **not** show the entire internal adapter board removed. The model therefore keeps the circular socket, adapter PCB and J2/J4 header in the Unit, and detaches only `MQ5Cartridge`.

`spec.nominalMm` and `cadEnvelopeMm` stay[24,64,25]. The fixed socket reconstruction protrudes0.4mm, producing a bare physical envelope[24,64.4,25]. The default MQ-5 installed envelope is[24,80.31,25]. The latter two are explicitly appearance reconstructions, not alternative manufacturer specifications or production mating tolerances. The own linked MQ-5 datasheet establishes a19±0.5mm can,10mm lead circle,1mm round pins and24mm total can-plus-lead height; the installed insertion/extension and fine weave are photo-derived estimates.

The MQ-5 metal protection is real round-wire geometry with open spaces, including a tapered side weave, a top lattice and rolled rims. A black textured cone or opaque face is never used to impersonate the mesh. The can contains a physical ceramic tube, unpowered heater wire, electrode leads, bakelite seal and six round contact pins. Internal details reconstruct the documented sensor structure; hidden exact routing and mesh gauge/pitch remain estimates. No heat, gas sampling or response is implemented.

The fixed six-hole socket has real axial channels, recessed metal sleeves/springs, a rear insulator and actual adapter/header contacts. The main PCB has mounting-boss scallops, Grove relief, central fastening bore and screw clearances. Separate packages represent STM32G030F6P6, XC6228D332VR-G, LMV321M5/NOPB, AO3400, NTC KNTC0603/10KF3950, passives and D1 GREEN0603. The schematic confirms the green package, but own exterior photos provide no distinct light aperture. It remains concealed physical geometry; there is no exposed Led component, glow or power-triggered light.

## External API

Exports are`Model`, `GroveModule`, `MQ5Cartridge` and`spec` from`src/units/mq/index.js`.

- `grove`: real four-core PORT.A connector at[0,−31.65,1.4]; GND/5V/SDA/SCL.
- `mq5`: mechanical `mq5-six-pin` socket at[0,32.4,9], outward +Y. It rejects Grove.
- `sensor`: passive Unit appearance anchor. The installed module has passive`mq5/appearance`.
- `MQ5Cartridge` is installed by default. Pass`mq5Cartridge:false` to display the actual empty socket. There are no user buttons, display, rotary joints, gas values, automatic LEDs or electrical behavior.

```js
import {Model, GroveModule, MQ5Cartridge} from './src/units/mq/index.js';
const unit = new Model(); // supplied MQ-5 round-pin can installed
const removed = unit.port('mq5').detach({dispose:false});
unit.port('mq5').attach(removed);

const bare = new Model({mq5Cartridge:false});
bare.port('mq5').attach(new MQ5Cartridge());
const noPrint = new Model({artwork:false}); // also disables can lettering

// Choose the real host's Grove port ID.
const linked = host.port('grove').attach(new GroveModule({cableLength:60}));
host.handle({type:'pose',target:'grove/unitFrame',position:[30,95,-5],rotation:[.1,0,.2]});
const can = linked.port('mq5').detach({dispose:false});
// The chassis, adapter, cable and both cable plugs remain attached.
linked.port('mq5').attach(can);
```

`GroveModule` uses four separately rendered black/red/yellow/white wire curves and two physical cable plugs. The posed`unitFrame` and the detachable MQ-5 maintain separate ownership. The model does not compute gas concentration, heater modes, preheat time, alarms, ADC, NTC temperature, I2C, power, continuity, calibration or firmware behavior. An external framework owns those semantics. Other MQ model types are not fabricated merely because the product supports them electrically.

## Evidence and limits

[sources.json](./sources.json) records official references and source identities. [artwork.md](./artwork.md) separates the exact-source back PNG from the three reference redraws. [smoke.json](./smoke.json) records necessary local checks: full native envelope/triangles, true mounting bores and FrontSide walls, real socket channels/backing, open mesh wire/air ray probes, ceramic tube wall, accurate API boundary, independent can attachment/removal, four-wire Grove pose/detach/resource disposal and `artwork:false` physical arrays/indices/matrixWorld invariance in both configurations.

This is**modeled**, not verified. No browser pixel inspection, exhaustive historical testing, hardware/electrical/gas execution or production fit is claimed. Concealed package placement, PCB/adapter layout, contact depths and spring shape, mesh pitch/gauge, internal can detail, installed clearance and redraw registration remain explicit reconstruction estimates.
