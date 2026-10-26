# Unit SSR U122

Stage: `modeled`; scope: `visual-only`. Millimetres: +X front right, +Y orange terminal, +Z front SSR UNIT label. This is the exact **U122 Unit SSR**, with MOC3043M and BT136S. It does not use the case, DELIXI relay, ESP32 or RS485 hardware of the larger U139 ACSSR / U140 DCSSR kits.

## Original casing and dimensions

The [CAD map](../../../src/units/ssr/cad-map.json) pins own `Products/U122_Unit_SSR/Structures/Unit_SSR.stl` to commit `07d8765bd52f32cc2705fc542ea608169a6c3c8c`, Git blob `48c31aab5f9d02b4e3f9a3cc133af8908c2291cf`, SHA-256 `e2c7f06ff031e701e52d872a4305a9f3ce0bced27f3231ca58eafd3e5209f976`, under the pinned M5_Hardware MIT license. Complete same-location components 0 rear **3032** and 2 front **2598** retain all **5630** original triangles. Components 1/3 are displaced duplicate halves. One common origin `[0,28,-4]`, identity axes and scale 1 are used. No face is removed, patched, cut, stretched or independently moved. Both native halves are closed with outward material winding and positive volume after 0.0001 mm coordinate welding. There is no cover-removal configuration.

Own product and drawing specify **56 × 24 × 10.2 mm** including the orange terminal cross section. The unmodified native shell is **24 × 56 × 8 mm** in model axes; the reconstructed installed header reaches Z6.2 above shell Z−4. Native front STL tolerance is retained. Two Ø4.85 mm front mounting bores are at X±8, Y−16; native rear counterbores are slightly wider. Grove outline is 10 × 5.2 mm. The optional removable plug yields an approximately **24 × 67.1 × 10.4 mm** installed visual envelope; its overlap and dimensions remain reconstructed rather than a measured fit.

## Physical assembly

The shaped carrier PCB includes actual mounting-boss reliefs, retaining-screw bore and eight real plated solder bores, annular lands and closed inner barrels. Its installed plane Z−1.6 to −0.8 and concealed layout are inferred. Four bent Grove tails and four header tails physically enter their own plated holes. The model includes the actual six-lead MOC3043M optocoupler, BT136S power-semiconductor envelope/tab/three leads, SS8050 transistor/three leads, F1 2410 fuse, R4 clamp, C1 capacitor and R1/R2/R3/R5/R6/R7/R8 packages. Package existence follows own schematic and linked component sheets; hidden installation and envelopes remain inferred.

Internal schematic D1 red0603 is a fixed nonemissive package. Current own photographs and documents do not establish an exterior optical path, so there is no LED or light-guide API. The front U-shaped native contour is not treated as a button. There is no physical user button, RGB, screen, sensor anchor, mechanical relay armature, DC jack, USB or RS485 connector in the documented assembly.

The bottom black Grove has an actual open receiving mouth, floor, rear wall, rails/latch, four metal contacts and bent solder tails. `grove` documentary pin labels are **GND / 5V / DIN / NC** in the actual mating frame. The orange top four-pole header has real side walls, projecting roof, floor, deep rear wall, guide rails, four male contacts and bent solder tails. The actual original front-half retaining tongues remain intact behind the rear windows; the outer window sections are backed by the real carrier PCB. Own photographs show a grey visible finish, but do not independently establish its material or hidden linkage; no added metal cover is asserted. The rear retaining screw has an annular hex head, actual blind metal recess floor and fixed shank.

The official page text calls the terminal **HT3.96-4P**, while own hero labeling calls it **VH3.96-4P**. The established mechanical viewer family is `ht3.96-4p`; this is not an electrical compatibility claim. Visible front printing records **IN / two central COM positions / OUT** without deriving continuity or wiring behavior.

## Removable terminal and four screw heads

`TerminalPlug` is the supplied independent four-pole accessory. `{terminalPlug:false}` is the default; `{terminalPlug:true}` fits it to `terminal`. It contains a full bored mating tongue/shoulder, four genuinely open wire entries, channel partitions/floor, a deck with four actual screw-access holes, four fixed metal clamp cages/lower and pressure plates, four fixed shanks and four true cross-recess heads with blind metal floors. The tongue end/bottom bores retain positive material clearance including bevels. Actual male header contacts traverse those empty tongue bores.

Only `terminal/screw-1` through `terminal/screw-4` rotate their respective visible heads about local Z. Each accepts an externally requested finite angle and timed interpolation. The suggested **−180 to 180°** display range is only a viewer range: `rangeDeg` is null, there is no measured hard-stop claim, and nonzero RPM is rejected. Head rotation causes no axial displacement, tightening, pressure-plate movement, automatic clamp action, SSR state or electrical behavior. All cages, plates, shanks, contacts, receiving socket, other heads and main assembly remain fixed.

## Corresponding body print

Own outlined body-label paths produce **1605 × 2708** front and **1623 × 3620** back ordinary PNGs. All 58 original paths and outlined glyphs remain. Scoped no-fill conversion repair restores the open orange/grey circuit strokes instead of accidentally filled triangles. The front also restores three original grey terminal-name fills and the existing lower strip's green production style from readable own proof/official photography. Accordingly front is `source-vector-raster-and-reference-redraw`; back is `source-vector-raster` with the documented conversion repair. No product-photo pixels, invented small text or font substitution is used. Production colorimetry and film registration remain reconstructed.

Separate real physical films preserve original panel proportions at approximately **16.052 × 27.076 mm** and **16.228 × 36.204 mm**. They directly touch native recess support surfaces Z3.8/−3.8. `artwork:false` removes ink only and preserves every physical attribute, index and world transform. Intentional connector/mounting openings remain real. [Artwork provenance](artwork.json) records safe public references, registration and final hashes. Only ordinary PNGs are distributed; the table, original vectors, private mappings, proofs and conversion intermediates stay outside public files.

## Agent integration

```js
import {Model, GroveModule, TerminalPlug, spec}
  from '../../../src/units/ssr/index.js';
const unit = new GroveModule({terminalPlug:true,cableLength:60});
host.port('portA').attach(unit);
host.handle({type:'joint',target:'portA/terminal/screw-1',
  angleDeg:90,durationMs:500});
host.handle({type:'pose',target:'portA/unitFrame',
  position:[15,85,-5],rotation:[0.2,-0.1,0.3]});
host.update(0.016);
const plug = unit.port('terminal').module;
plug.get('screw-1').set({angleDeg:0}); // Module component lookup
const detached = unit.port('terminal').detach({dispose:false});
unit.port('terminal').attach(detached);
// Teardown: host.dispose(). Retained detached items are caller-owned.
```

Own components are `grove` and `terminal`. The attached accessory exposes four independent `terminal/screw-N` joints. `GroveModule` adds the standard `unitFrame` and actual four-core `cable` with two receiving plugs. Source-frame attachment follows a transformed actual parent port. Whole-unit pose and requested screw angles do not echo input; ordinary core port lifecycle events remain. No SSR on/off, zero crossing, load, voltage/current, clamp force, axial thread motion, sensor value, protocol, network or firmware behavior exists; such requests are rejected.

## Necessary checks and remaining evidence

[Local smoke](smoke.json) checks all 5630 complete own CAD faces/common transform, nominal/assembled envelopes, clear whole-assembly mounts and FrontSide bore walls, eight actual plated board bores/tail seating, real receiving cavity and plug tongue/contact/wire/screw paths, closed material walls and blind floors, native film support and original rear-window tabs/PCB. **175 physical solids** across Unit and accessory have opposed coordinate-welded edge pairs and positive volume. **35 axial and 168 FrontSide wall rays** pass. Six Model/GroveModule/plug/screw-state artwork pairs preserve every physical attribute/index/world matrix. All four independent 0/45/90° head transitions, exact return, unchanged fixed geometry, invalid-command state preservation, transformed-parent four-core attachment, nested pose/peer independence, detach/refit/no echo and release of all **228** tracked resources pass.

These are bounded construction/API checks. Browser/GPU visual acceptance, production connector fit, thread/clamp mechanics, electrical switching, firmware and physical-device acceptance remain unverified. Missing exact populated-board/terminal installation and D1 exterior optical-path evidence were reported through official documentation feedback, accepted as **`839829333c77479291949aab78233293`**.
