# Unit FlashLight U152

Status: **modeled**, no browser or physical-device visual acceptance. Dimensions use millimetres: +X right, +Y away from Grove, +Z front/light face. Official 32 × 24 × 8 mm becomes `[24,32,8]` in model axes.

## Evidence and assembly

[Official product](https://docs.m5stack.com/en/unit/FlashLight), its own dimension drawing, complete M5_Hardware U152 CAD, exact-model rear photograph, bare-PCB mode photograph and schematic were checked on 2026-10-26. Compact source hashes are in [sources.json](sources.json); the complete CAD attribution and transform are in [cad-map.json](../../../src/units/flashlight/cad-map.json).

All **3422 triangles of native assembled component 0** remain at scale 1 with a common translation. Displaced copies 1 and 2 are excluded. No native wall is filled, removed or patched. The optical well, two mounting holes, Grove opening and rear retaining recess remain real openings. Reconstructed geometry supplies the white PCB with mounting reliefs and retaining bore, local green soldermask seen through the light well, real single white LED package/phosphor, AW3641EDNR and fixed passives, the actual internal S1 slide, four-contact black Grove housing and fixed screw. The soldermask is a thin finish on the PCB, not a separate undocumented daughterboard.

The official drawing establishes the 16 mm mounting pitch, 24 mm LED centre from the Grove end and 12 mm mounting centre. The hidden PCB plane, finish transition, package locations, selector installation/throw and connector internals are appearance estimates. These are not production mating or manufacturing dimensions.

## Controls and external drive

`Model` and `GroveModule` export the same product API:

| Path | Kind | Appearance contract |
| --- | --- | --- |
| `grove` | `port` | Physical Grove attachment and own printed `GND / 5V / S / NC` pin names; no GPIO/power implementation |
| `mode` | `button`, latching | One internal S1 retained slide, 0 = Flash-side and 1 = Torch-side visual thumb position; 1.5 mm photo-inferred throw along +Y |
| `light` | `led`, fixed white | Independent external on/brightness, default off; commands cannot change its fixed white color |

The manufacturer explicitly requires removing the shell to access the Flash/Torch switch. Default closed assembly sets `mode.interactive === false`, removes moving-cap pointer hit tags and ignores pointer-down/up/cancel. `{ covers:false }` keeps every native CAD triangle in the scene graph but hides the covers and cover artwork, making the correctly located internal thumb available to the pointer. PCB silk remains on the PCB. This is an assembly inspection view, not a fabricated exterior opening.

```js
import {Model, GroveModule} from './src/units/flashlight/index.js';
const unit = new Model({covers:false});
unit.on('input', event => { /* forward button intent to the external runtime */ });
unit.button('mode').press('external-input');
unit.button('mode').release('external-input');
unit.button('mode').cancel('external-input');
unit.handle({type:'position',target:'mode',position:1,immediate:true});
unit.handle({type:'led',target:'light',on:true,brightness:0.4});
unit.update(1 / 60);

const connected = new GroveModule({covers:false,cableLength:100});
controller.port('grove').attach(connected);
controller.handle({type:'position',target:'grove/mode',position:0});
controller.handle({type:'led',target:'grove/light',brightness:0.7});
```

Press/release/cancel emit input intent, and a retained slide keeps its detent after release. Cancel releases a held source without a click. `setPosition(0|1)` and the `position` command set external visual state without input echo. `unitFrame` pose and cable shape use the shared GroveModule contract. The external framework must interpret the physical input and separately send the resulting visual state. No Flash/Torch state machine, autonomous flash pulse, PWM/single-wire protocol, power, current, temperature, protection, firmware, RGB, beam or scene-light simulation is included.

## Artwork and limitations

Two ordinary final PNGs are distributed: readable rear model/pin label and readable internal `TORCH / FLASH` PCB silk. Both are newly drawn from exact-model official reference photographs and labeled `reference-redraw`. No photographic pixels, private table, private link, vector original, generator or intermediate is distributed. Rear artwork projects only onto the native rear surface; PCB silk projects only onto its physical board. `{artwork:false}` removes only artwork. The front has no invented model sticker.

The description, schematic and rear label say 5000–5700 K; the official specification table says 6000–6500 K. This was reasonably rechecked and submitted to M5Stack, accepted as feedback `cc88e29d64704663a8a098f42ea5f145`. The fixed `#fffaf0` appearance is not calibrated colorimetry or a resolved production BOM claim.

[smoke.json](smoke.json) records the necessary local checks: all native source triangles, nominal envelope, open mounting axes and FrontSide bore walls, physical LED/PCB/Grove closure, stable switch press/release/cancel, assembled pointer boundary, fixed-white independent external drive, four Model/GroveModule artwork/configuration combinations, nested four-wire/two-plug Grove pose, independent detach and resource disposal. Exhaustive browser, hardware and production-fit inspection remain deferred so Unit expansion can continue.
