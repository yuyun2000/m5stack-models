# Unit Gateway H2 U195

Stage: `modeled`; browser visual and physical acceptance remain unverified. Millimetres: +X front-label right, +Y fixed PCB antenna end, +Z front. This is the exact **U195 Unit**, not the bus-mounted Module Gateway H2.

## Own native casing and dimensions

The official product table gives **48 × 24 × 8 mm** in length/width/thickness order. Its own dimension drawing and native assembled CAD give model **24 × 48 × 8 mm**. Own path `Products/U195_Unit_Gateway_H2/Structures/Unit_Gateway_H2.stl` was retrieved at file-specific commit `784c926812716110e9b76041bfa876514017f81a`, verified against Git blob `30b057378d5ee35b8377f7db70d08b570cb0e55d` and the source SHA-256 in the [CAD map](../../../src/units/gateway-h2/cad-map.json). Component 0 is the complete assembled **3580-triangle** front/rear casing; components 1/2 are displaced duplicate halves, 1872/1708 triangles. Every selected native triangle remains intact at scale 1, with identity axes and one common `[0,0,1.2]` translation. No faces are removed, patched, filled, stretched or independently repositioned.

The original Ø5 mounting bores at X ±8/Y −12, side reliefs, retaining recess, M5 emboss and deep bottom Grove aperture remain real. A shell retaining screw and concealed fixed shank complete the evidenced rear assembly. Both front and back label-support surfaces are **closed native walls** at Z ±3.8; the two real adhesive films directly touch them. Print does not bridge a fake cutout or replace absent casing.

## Closed assembly versus bare-board service

Own assembled views and the native CAD establish that **only Grove is externally accessible with the original casing installed**. There is no side USB-C opening or exposed Boot control. Own `U195_04.webp` and the official download GIF show the **uncovered PCB**, with a real Boot actuator, side USB-C and six unpopulated download holes. The model therefore offers two explicit construction configurations:

- **`shell:true`**, default: complete unmodified casing, films and retaining screw; only `grove` is registered. Internal USB/Boot hardware exists physically but cannot be called or clicked through the casing.
- **`shell:false`**: bare-board service appearance. Casing, films and shell screws are omitted. Actual `grove` and `usb` ports, `boot` input and passive `download` location anchor are registered. It is not an animated disassembly or a fabricated casing hinge. This exposed reconstruction measures about **19.2 × 43.6 × 6 mm** and is recorded separately from the marketed assembled dimensions.

The six right-side holes are real circular through-bores, annular lands and plated inner barrels. No populated plastic header is shown in the exact bare-board photo, so none is invented. The `download` component is noninteractive and is **not a Port**. Its labels preserve the source's `G0 label / H2-G9 net` distinction; G0 text must not be silently interpreted as ESP32-H2 GPIO0. Hole diameter, 2.54 mm pitch and exact installed positions are appearance estimates rather than production drilling data.

The service USB-C is an actual hollow rounded metal shell with insulating tongue, deep dielectric carrier, retention tabs and physical contact-finger envelopes. The 24-contact appearance is reconstructed; the precise connector BOM is unconfirmed. It accepts attachment in the explicit bare-board configuration only. USB enumeration, serial data, power, programming and any electrical/protocol effects belong to an external runtime.

## PCB, module and actual momentary button

The shaped carrier PCB includes the Grove notch, two mounting-boss reliefs, central retaining through-bore and six actual download bores. The own linked ESP32-H2-MINI-1 datasheet mechanical page 36 supplies the **13.2 × 16.6 × 2.4 mm** module envelope, 0.8 mm board, 11.95 × 9.95 mm shield, 48 small perimeter lands, four corner grounds and nine central thermal lands. Their physical envelope is modeled without claiming electrical pad numbering. The real module-integrated planar meander antenna is fixed nonemissive copper appearance on the PCB; there is **no external SMA, removable antenna, antenna joint or radio effect**.

The own schematic and bare-board image support the five-terminal BL8075CB5TR33 regulator, crystal-can envelope, protection fuse, diode/protection packages and fixed passive packages. Carrier outline/plane, concealed package installation, contacts, solder geometry and antenna traces remain appearance reconstruction; no internal circuit/routing behavior is implemented. The source's gray optional LED area repeats D1/D2 and R4/R5 designators used in the USB section, with no clear population/BOM resolution. There is also no exterior optical path. No fabricated installed LED, external light or LED API is added. This ambiguity and the bare-board service instructions were submitted through the official documentation feedback tool, accepted as `8b19aa0e25cb43c5b85c283abd8d9421`.

S1 is the actual PTS820 momentary Boot switch. The bare-board black round cap moves **0.15 mm along −Z** and returns exactly on final release. This small visual travel is an estimate from the own button appearance, not a rated mechanical travel. Its fixed metal base, terminals, PCB, module, antenna, USB and port frames remain fixed. Pointer and keyboard/programmatic sources can hold it simultaneously; releasing one source preserves the other hold. Cancel releases without click. No long-press timer is installed and no download, reset, boot-state, GPIO, wireless or firmware behavior follows from a press.

## Two matching body-label PNGs

Two ordinary `reference-redraw` PNGs reproduce the own assembled front and rear label layout: **1760 × 2740** front and **1600 × 2800** back. The front carries 2.4G, blue arcs, the triangular symbol and Gateway/H2; the back carries Gateway/H2, ESP32-H2-/MINI-1-N2, PORT.C.UART and TXD/RXD/5V/GND color cells. Final text fits inside the corresponding strips and was opened for one necessary readability check. [Artwork provenance](artwork.json) records own official photos, hashes and reconstruction limits. No product-photo pixels, unreadable fine print, source vectors, private intake or intermediates are distributed.

Back-view pin-strip order becomes front-view `GND / 5V / UART_RX / UART_TX`. The bottom-facing Port local X axis reverses front X, so its explicit `pinGrid` accounts for that rotation. These labels describe visible/documented contacts; they are not a live UART or power model.

## Agent integration

```js
import { Model, GroveModule, spec }
  from '../../../src/units/gateway-h2/index.js';

const closed = new GroveModule({ cableLength: 55 });
host.port('portC').attach(closed); // existing compatible physical Grove port
host.handle({ type: 'pose', target: 'portC/unitFrame',
  position: [15, 70, -5], rotation: [0.2, -0.1, 0.3] });
host.update(0.016); // four actual physical wire curves

const service = new GroveModule({ shell: false, cableLength: 55 });
// Attach service to another compatible host port before addressing it there.
service.handle({ type: 'button', target: 'boot', action: 'press', source: 'ui' });
service.update(0.016);
service.handle({ type: 'button', target: 'boot', action: 'release', source: 'ui' });
service.update(0.016);
const usb = service.port('usb'); // physical USB-C attachment only
const pads = service.get('download'); // passive six-hole location/label anchor
```

Exports are only `Model`, `GroveModule` and `spec`. Closed own API is `grove`; the bare-board own API is `grove / usb / boot / download`. The common Grove module adds `unitFrame` and `cable`; nested service addressing is, for example, `portC/boot`. There are no sensors, LEDs, displays, joints or accessory classes. External whole-unit pose does not echo input; real Boot press/release emits ordinary down/up/click input intent. Attachment lifecycle events retain the common core behavior. Detach with `{dispose:false}` transfers ownership to the caller, who must dispose the detached object.

## Necessary checks

[Local smoke](smoke.json) verifies the exact commit/blob and all 3580 native triangles at scale 1, assembled versus bare-board envelopes, no invented USB/Boot casing access, direct film/native-wall seating, open mounting/PCB/download paths and **48 FrontSide wall checks**, opposed coordinate-welded edges/positive volumes for PCB, all six plated lands/barrels and hollow USB shell, physical USB tongue/deep carrier, fixed module land/antenna/regulator details, Boot multi-source hold/cancel/only actual cap travel/exact return with unrelated geometry and frames fixed, four Model/GroveModule × shell construction combinations with all physical attributes/index/world matrices invariant without ink, both configurations of nested four-core Grove pose/independent peer/detach/resource disposal and rejection of internal programming/radio/network/electrical commands. No exhaustive browser, production-fit, USB/UART/download, boot-state, RF, physical hardware or firmware acceptance is claimed.
