# Unit Finger U008

Stage: `modeled`; browser/visual and physical acceptance remain unverified. Millimetres: +X right,+Y sensor end,+Z capacitive face.

## Exact model and native structure

The official U008 product page identifies **FPC1020A capacitive fingerprint acquisition**, UART and a cyan four-contact Grove C socket. The product table is **48 × 24 × 8 mm** in vendor length/width/thickness order; its own drawing/model axes are **24 × 48 × 8 mm**. The drawing gives Ø5 mounting holes at 16 mm pitch, a 10 × 5.2 mm Grove mouth and a **12.9 × 13.5 mm** fixed acquisition-face region. These marks identify physical geometry,not a protocol implementation.

The own structure path `Products/U008_Unit_Finger/Structures/Unit_Finger.stl` was retrieved at current path-specific commit `802d26343594f6b8e3b8a9f111cb867613c93882`, verified against Git blob `ae89b9ca4c75b18f083b0996f1773e9f95f47bd1` and the source-byte SHA in [CAD map](../../../src/units/finger/cad-map.json). Component 0 contains the complete **3956-triangle assembled shell**; components 1/2 are displaced duplicate halves. One common translation and rigid **180-degree Y rotation** place the real front aperture at +Z and rear label recess at -Z. Scale remains 1. No original face is cut,filled,stretched or independently moved. Native pickup aperture,mounting bores,Grove opening,retaining recess,seam and M5 emboss remain intact.

## Capacitive face and complete physical assembly

The official product's linked **1020A** module datasheet was read and relevant pages rendered. Page 1 describes an **8 × 8 mm active capacitive collection area**. Page 4 gives **30 × 17.3 × 5.1 mm** overall module and **0.8 mm** board thickness; page 5 shows the module's actual front metal bezel/dark pickup surface, rear processor/peripheral layout and six-contact header. Its drawing labels the narrow board axis 17.2 mm while the text nominal is 17.3 mm; this hidden-board reconstruction uses the text nominal and does not claim production tolerances.

The model places a chamfered module board behind the native aperture,with a static dark capacitive plate,metal contact bezel,deep carrier,rear processor envelope/lead rows,minor packages and six physical header contacts. The visible face region follows the own U008 drawing. The metal backing flange is larger than the face opening to close its perimeter behind the native bevel. Processor identity/markings are not invented; concealed package dimensions,terminal layout,board yaw/plane,component positions,bezel flange and acquisition-stack thickness are inferred from the linked module picture and own casing rather than a production assembly STEP.

A separate adapter PCB has true retaining and four Grove solder through-bores plus open mounting-boss reliefs. The own U008 schematic shows P1 Finger six-pin module connection,U1 **HT7533**,C1/C4 **100nF**,C2/C3 **10uF** and J1 Grove. These are physical connector/regulator/capacitor geometry. Four socket contacts,bent tails and board shanks sit in a deeply recessed cyan HY2.0 socket with molded walls and a dielectric rear carrier. The native retaining recess contains a fixed screw;all mounting bores remain open through the assembled parts.

The linked module datasheet describes metal-ring touch wake via V_TOUCH and TOUCH_OUT,but the own U008 schematic leaves P1 pins 1/2 unconnected. Touch is not a mechanical keycap: no press travel,button,LED,display or separate touch/electrical API is invented. The model exposes only the fixed sensor surface anchor and physical Grove port. Exact acquisition,recognition,UART,identity and electrical behavior belong to an external framework.

## Artwork and Agent integration

Only the own rear face has a printed label. One ordinary **1600 × 2800 PNG** is a `reference-redraw` of readable FINGER,the physical generic fingerprint icon,FPC1020A,PORT.C.UART and TXD/RXD/5V/GND. It projects on a thin physical film directly touching the native rear recess. The icon is static product ink,not a biometric sample or stored user template. No front print is created and no picture fills the sensor aperture. [Artwork provenance](artwork.json) records sources,hashes,size and placement. Typeface,ridge curves,colors and registration are reconstructed;source photos,vectors,generators,private links/table and intermediates remain outside Git.

```js
import { Model, GroveModule, spec }
  from '../../../src/units/finger/index.js';
const unit = new GroveModule({ cableLength: 65 });
host.port('portC').attach(unit); // existing physical Grove connector
const faceAnchor = host.get('portC/sensor'); // passive fixed surface position
host.handle({ type: 'pose', target: 'portC/unitFrame',
  position: [15, 80, -5], rotation: [0.2, -0.1, 0.3] });
host.update(0.016);
const detached = host.port('portC').detach({ dispose: false });
// detached.dispose() when its external owner no longer needs it.
```

Exports are `Model`,`GroveModule`,`spec`; metadata IDs are `m5stack.unit.finger` and `m5stack.unit.finger.grove`. The body's registered components are `grove` and passive `sensor`;a mounted module also has common `unitFrame` and `cable`. Cable colors are Black GND,Red 5V,Yellow UART_RX and White UART_TX. Rear TXD/RXD ink reproduces the physical print;connector numbering/labels do not establish a simulated bus.

The sensor anchor has no fingerprint image/template/value,recognition,enrollment,deletion,identity,touch wake,UART,power,electrical or firmware commands. It never generates,reads or stores biometric data. Whole-unit pose moves the entire static face and cable endpoint without input echo. Attach/detach still emits normal port lifecycle intent. `artwork:false` on both classes removes only rear printing;every physical attribute/index/world transform,including the pickup face and rear film,remains identical.

[Necessary smoke](smoke.json) checks all 3956 original shell triangles and the unscaled envelope,native mounting bores/FrontSide walls,true PCB bores and directed closure,module board/bezel closure and positive 0.85 mm bezel material,real closed acquisition plate/perimeter backing,nominal linked module dimensions,deep Grove contacts,physical film seating,actual API/internal-command rejection,two-entry artwork invariance,nested four-core pose/independent detach/disposal and no echo. It does not claim exhaustive browser review,production fit,identification accuracy,biometric data,electrical behavior,UART,firmware or physical hardware validation.
