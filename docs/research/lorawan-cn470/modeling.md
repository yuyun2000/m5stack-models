# Unit LoRaWAN-CN470 U184-CN470

Stage: `modeled`; browser visual and physical acceptance remain unverified. Millimetres: +X front right, +Y ordinary SMA end, +Z front CN470 logo. This is the exact **U184-CN470 RAK3172(L)/STM32WLE5** Unit; neither an older LoRaWAN470 generation nor another frequency-region product is used as its PCB, print or antenna authority.

## Exact native casing and dimensions

The own official table gives **71.4 × 24 × 8 mm**. The dimension drawing separates **24 × 64 × 8 mm** casing and **7.4 mm** SMA projection, Ø4.85 mounting bores at 16 mm pitch and 12 mm from the bottom, and a 10 × 5.2 mm Grove outline. The supplied **195 mm** rubber antenna is excluded from Unit nominal length.

The [CAD map](../../../src/units/lorawan-cn470/cad-map.json) pins own path `Products/U184-CN470_Unit_LoRaWAN-CN470/Structures/Unit_LoRaWAN-CN470.stl` to path-specific commit `2a547f4cb53263c7c263c2fdc7c80f54cfb93fdc`, Git blob `cd451d15e2d03f37e80e7db05bf7f82fa56a78ba` and SHA-256 `6d93ea1962caf38864027accc041acb990a61e3360581aad16edf30ec294b17f`. Component 0 is the complete **6592-face** assembly; components 1/2 are displaced **3858/2734**-face duplicate halves.

A one-to-one centroid-bucket and cyclic winding-preserving full-vertex audit maps every original assembled face to those own duplicate halves: **zero missing/ambiguous faces**, maximum coordinate difference **0.000004827976226806641 mm**. Runtime groups retain original component-0 coordinates as rear 3858/front 2734 faces. Both use one common origin `[0,32,-4]`, identity axes and scale 1. No source face is cut, patched, filled, scaled or independently moved. Separating the source groups avoids merging contact-seam vertices across two distinct physical halves; each native half is directionally closed with positive material volume. Both halves always remain installed; there is no open-cover/service API. Identical CAD bytes published for another product do not establish shared internal components, artwork, antenna dimensions or behavior.

## Own PCB, module and physical connections

The complete shaped carrier includes mounting-boss reliefs, central retaining bore and four true Grove solder bores, annular lands and plated barrels. Its reconstructed installation is Z−1.6 to −0.8. The actual blue Grove has molded walls, latch/rails, four independent contacts and bent solder tails reaching those own board drill locations. Bottom-facing mating and pin-picking frames agree. Port labels GND/5V/UART_RX/UART_TX are documentary physical labels, with no UART or power routing.

The linked RAK3172 datasheet Figures 2/3 establish a **15 × 15.5 × 2.6 mm** module body in the chosen Figure-2 orientation, 1 mm substrate and 32 asymmetrically placed castellation terminals at 1 mm pitch. The module has **12 left, 8 right, 8 top and 4 bottom** true edge half-holes, closed inner plating, actual top semicircular lands and carrier solder toes. It is not represented by a generic shield block or another radio module. The metal shield includes the module's lower-left RF clearance; installed module pose, shield profile, exact drill/plating sizes and current RF-connector variant remain reconstructed.

Own schematic packages are separately present: U1 VRH3301NLX five-terminal regulator, F1 protection, D1/D4/D5 RLSD52A031V and D3 LESD3Z5.0CMT1G protection packages, D2 1N4148WS, evidenced populated R/C packages and fourteen passive JP test-pad envelopes. R1–R4 are a schematic region-option table without an established current assembly mark, and R8/C8/C9 are NC RF positions; the model includes unpopulated land appearances rather than claiming all options are populated. The internal module MCU, firmware, memory, RF matching and routing are not expanded into functioning hardware.

Own photographs show an **ordinary SMA female** exterior: external threads and a center sleeve opening, with the table specifying a supplied ordinary SMA male center pin. The body includes genuine annular mouth, dielectric center opening, hollow female contact and blind end, shaft, inner gold hex installation body, outer nut/washer and concealed termination. Both original small upper windows are backed by the actual gold installation hardware. They do not become LED light guides. The ordinary SMA male antenna has a real exposed center pin and internal threaded open coupling. Both helical threads terminate in closed material end faces.

No own naked-board or assembly source establishes the concealed RF-to-SMA termination. The schematic only provides RF pin 12 through the ANT/NC matching positions, and the RAK3172 datasheet supports module variants with or without IPEX. The hidden feedline and solder-termination envelope are therefore explicitly inferred; no IPEX connector is asserted or borrowed. Own three fixed retaining screws have real annular metal heads, blind hex floors and shanks. There is no button, LED, USB connector, SIM holder, display, sensor or body joint in this product's documented assembly.

## Own supplied 195 mm antenna

`Antenna` is an optional separate accessory. Default `{antenna:false,antennaAngleDeg:0}` omits it; `{antenna:true}` fits it to `sma`. Its own straight overall length is **195 mm**. Own hero/package views show a long flattened tapered rubber radome, coupling knurl, retained elbow and 90-degree bend. The modeled cross section is approximately **12 × 10 mm**, inferred from these photographs. The straight assembled Unit envelope is about **24 × 260.9 × 10 mm**; coupling overlap is recorded separately from the 195 mm accessory length.

Only the knuckle and solid long radome move about local X through `[0,14,0]`. The ordinary SMA coupling, pin, molded neck, fork/cheeks and axle remain fixed. `sma/tilt` accepts externally requested finite **0–90°** angles and timed transitions. The own 90-degree photograph is evidence for an elbow; axis/profile and the 0–90 visual range are reconstruction rather than measured mechanical stops or a documented motion sequence. No continuous spin, unscrewing, automatic sweep, frequency behavior, RF field or antenna-performance simulation exists. The port rejects RP-SMA and Grove mechanical families. Other ordinary SMA accessories are mechanically compatible regardless of their frequency label; that does not establish RF suitability.

## Synchronous exact-model print

Two final **1580 × 3610** and **1600 × 3600** ordinary `reference-redraw` PNGs reproduce readable exact U184-CN470 official photographs. The front retains CN470 within blue radio arcs, the black triangular tower and LoRaWAN/CN470 title. The back retains LoRaWAN/CN470, **RAK3172(L)** and the actual **PORT.C.UART / TXD / RXD / 5V / GND** color strip. Typeface, colors, line work and registration are reconstructed; no photographic pixels, unreadable text or other-frequency artwork is used.

Both real physical films directly touch native support walls at Z3.8/−3.8. `artwork:false` removes only ink. Neither film hides missing hardware or fills intentional connector/mounting holes. No antenna print is established. [Artwork provenance](artwork.json) records safe references, registration and final hashes. Private table, candidate details, original vectors, raw official evidence and generators remain outside the distribution.

## Agent integration

```js
import {Model, GroveModule, Antenna, spec}
  from '../../../src/units/lorawan-cn470/index.js';
const unit = new GroveModule({antenna:true,cableLength:60});
host.port('portA').attach(unit);
host.handle({type:'joint',target:'portA/sma/tilt',
  angleDeg:90,durationMs:500});
host.handle({type:'pose',target:'portA/unitFrame',
  position:[15,85,-5],rotation:[0.2,-0.1,0.3]});
host.update(0.016);
const antenna = unit.port('sma').module;
antenna.get('tilt').set({angleDeg:0}); // Module component lookup
const detached = unit.port('sma').detach({dispose:false});
unit.port('sma').attach(detached);
// Teardown: host.dispose(). Detached items kept with dispose:false are caller-owned.
```

Own components are `grove` and `sma`; the separately attached accessory exposes `sma/tilt`. `GroveModule` adds the standard `unitFrame` and `cable`, with four independent wires and two fitted plugs. The source frame follows the actual transformed parent port. Whole-unit and joint commands do not echo input; ordinary port lifecycle events retain core behavior. No sensor value, LoRaWAN/P2P/network/activation, RF/RSSI/signal, AT/UART, electrical/power or firmware behavior is implemented. Requests for these behaviors are rejected.

## Necessary construction checks

[Local smoke](smoke.json) confirms own commit/blob/path and all 6592 native faces, exact two-half correspondence/common transform, 24 × 64 × 8 casing and 71.4 mm connector-inclusive length, whole-assembly mounting bores, retaining/four solder bores and bent-tail seating, all 32 genuine module edge apertures/plated walls and exact 15 × 15.5 × 2.6 body, ordinary SMA female cavity/male pin and actual gold hardware behind both source windows, film seating and fixed blind screws. **292 physical meshes** across body and accessory have opposed coordinate-welded edge pairs and positive volume; **116 FrontSide wall checks** cover actual bores. Six Model/GroveModule/antenna-pose artwork pairs preserve every physical attribute/index/world matrix. Finite 0/45/90 transitions, fixed coupling/body/ports, exact return, invalid-state preservation, transformed-parent four-core attachment, nested pose/peer independence, detach/refit/no echo and disposal of all 350 tracked resources pass.

This is bounded construction/API verification, without exhaustive browser/GPU, production fit, measured antenna stop, RF, electrical, firmware or physical-device acceptance. Missing exact installed PCB/RF feedline/current option BOM and antenna mechanical data were reported through official documentation feedback, accepted as **`5ffa182f2f4b47ae88169e0da68f1275`**.
