# Unit Glass2 U158-B

Stage: `modeled`. Necessary construction/API checks pass; exhaustive browser/GPU,production-fit and physical-device acceptance remain unverified. Millimetres: +X front right,+Y transparent-panel end,+Z cover/components front.

## Exact product and independent construction

Official [Unit Glass2](https://docs.m5stack.com/en/unit/Unit_Glass2) identifies **U158-B**,two parallel white Grove I2C sockets and a transparent light-blue OLED. It has **no physical user button,buzzer,MCU or external LED evidenced by its own schematic/photos**. The old U158 Glass has different hardware and is not used as a substitute.

No exact Glass2/U158-B or old Glass/U158 path was found in the current complete `m5stack/M5_Hardware` tree `e29c139cbc7c80b5ccc5557e5ab8025a7a19a109` (`truncated:false`),and neither product page provides a STEP/STL link. This model is therefore **independently reconstructed from the own U158-B dimension PDF and assembled/dismantled photographs**,not a CAD import. [Construction map](../../../src/units/glass2/construction-map.json) records this distinction;source component/triangle counts are null. No other Unit case or PCB is borrowed.

The exact drawing gives **42mm width,40mm rectangular-board height,1mm PCB thickness,6.35mm assembly thickness**,outer M3 holes at **32mm pitch**,and inner retainer holes at **17mm pitch/Ø2.6mm**. The **44mm vertical dimension terminates at the lower mounting-hole centre**,not the ear bottom. The ear's approximately3mm outer radius is scaled from the drawing;the resulting **47mm full height** is a reconstruction. The actual panel width42.04mm adds0.02mm overhang at each side. Thus the model's reconstructed envelope is about **42.04×47×6.35mm**,separately recorded from the product table's conflicting **53×42×6mm** nominal. It is not stretched to the table value. Drawing corner/notch/ear radii and installation details are not production tolerances.

The black FR4 carrier has the own large **37×19mm through-window**,two real M3 ear bores,two retaining bores and eight genuine Grove contact bores. The 2.5mm top/side window frame and1.5mm radial ear material remain positive;no hole is tangent to an outside contour. Both sides have actual annular mounting copper. Its source-derived opaque lower PCB and own fixed cover do not extend over the transparent active area.

## Transparent OLED and honest framebuffer scope

The own official first photograph labels **128×56 transparent pixels**. The linked exact `ZJY-2856KLBAG01` technical specification confirms **light blue,128×56 physical pixels,35.05×15.32mm active area,42.04×27.22×1.25mm panel,0.274mm pitch and0.254mm pixel size**. The headline/controller128×64 and body35.05×18mm remain acknowledged as conflicting/logical data;the mapping of eight unused controller rows is unverified.

`screen` therefore owns an external **128×56 visible framebuffer**,with no64-row adapter,register decoder,I2C addressing or fabricated hidden pixel rows. The physical panel is a true **1.25mm translucent glass volume** spanning the board opening,with actual edge seals and an opaque lower driver/COG strip outside the active area. It intentionally permits a view through the panel when pixels are off;this is not a missing cover or a printed transparent substitute.

A product-local `TransparentOled` subclass preserves core Display compatibility without modifying the engine. Its two opposite **FrontSide** pixel planes share the exact material,texture and external buffer,providing the actual mirrored rear view. The source RGB buffer remains intact;the shader converts luminance at0.5 to one-bit light-blue emission. **RGBA alpha multiplies emission coverage**,so an alpha0 white pixel is off. RGB/RGB565 writers retain their ordinary opaque-alpha semantics. Off pixels output alpha0,with blackLevel/offColor0 and depthWrite false;they do not make an opaque black rectangle. A separate translucent glass material remains present regardless of pixel state or artwork.

The product constructor asserts the two expected base-shader markers before applying local modifications. Necessary checks also assert that the old opaque alpha1 line is gone,the actual ink-alpha expression and source-alpha multiplication exist,and both planes share the exact buffer material. A future base-shader change fails explicitly instead of silently restoring an opaque OLED. These are construction/shader-contract checks,not a GPU optical calibration or browser acceptance claim.

## Complete fixed physical assembly

The own cover-removal photo shows the real amber24-pin FPC,connector,packages,two metal threaded standoffs and unbridged address pads. The reconstruction includes the actual broad glass/FPC neck,contact tracks,a physical return fold visibly extending below the fixed cover,return-to-connector ribbon,and24 discrete contacts with the dark locking bar. The ribbon bend/profile and retained length are inferred from the installed photographs;the unfolded module's manufacturing routing is not claimed.

Own schematic identities are **J3AFC05-S24FIA-00/SSD1309,U1TPS61040DBVR,U2ME6210A33M3G,L1 10uH2520,D1 1N4148WS,Jumper1SA0**,with two parallel Grove sockets. The board has fixed regulator/boost/inductor/diode/passive envelopes and actual separate solder-pad shapes. Concealed package dimensions/placement and FPC contact/tail dimensions are visual estimates,with no invented electrical traces,registers,supply rails or operating state.

A real black service cover and thin physical front film seat on two hollow threaded metal standoffs. Each fixed retaining screw has an annular metal head,deep blind hex socket and actual internal shank. The two white Grove housings have open mouths,deep molded rear walls,guide/latch shapes,four actual contacts and four tails each,with real solder through-bores in the carrier. The frame's two M3 mounting bores remain empty through the complete assembly. Removing a cover for solder-jumper service is not a normal operating button,hinge or accessory API.

## Artwork and Agent API

Two final ordinary PNGs are exact-product `reference-redraw` artwork: the readable **front fixed GLASS2/power-block/pin/address label**,and **rear PCB M5STACK/GLASS2/PortA/arrows/corner marks**. The rear raster has a transparent background and is projected only onto existing PCB triangles. Native window/bores stay open and the screen never receives a demonstration image. Source photos,PDFs,private table/links/mappings,vectors,generators and intermediates are excluded. [Artwork provenance](artwork.json) lists final hashes,size and placement. Font,diagram routing,color and registration are reconstructed;unreadable tiny panel codes are omitted.

```js
import { Model, GroveModule, spec }
  from '../../../src/units/glass2/index.js';
const unit = new GroveModule({ cableLength: 65 });
host.port('portA').attach(unit); // wrapper uses actual left socket as its inlet
const screen = host.get('portA/screen');
screen.writeRGB565(framebuffer128x56);
screen.writeRGBA(new Uint8Array([255, 255, 255, 0]),
  { x: 0, y: 0, w: 1, h: 1 }); // alpha0 remains nonemitting
const next = new GroveModule({ cableLength: 50, artwork: false });
host.get('portA/grove-right').attach(next); // physical daisy chain only
host.handle({ type: 'pose', target: 'portA/unitFrame',
  position: [20, 80, -5], rotation: [0.2, -0.15, 0.3] });
host.update(0.016);
const child = unit.port('grove-right').detach({ dispose: false });
const detached = host.port('portA').detach({ dispose: false });
// child.dispose(); detached.dispose() when their external owner releases them.
```

Exports are `Model`,`GroveModule`,`spec`;metadata IDs are `m5stack.unit.glass2` and `m5stack.unit.glass2.grove`. Actual body component IDs are **`grove` left,`grove-right` right,`screen`128×56**. A mounted wrapper also has common `unitFrame` and `cable`. Each socket independently attaches/detaches a mechanical Grove module. Their BlackGND/Red5V/YellowSDA/WhiteSCL labels and documented parallel wiring do not copy sensor state,pixels,I2C traffic or power. No `sensor`,button,LED,joint,buzzer or Speaker is invented.

`artwork:false` on both entries removes only the ink;every physical attribute,index and world matrix remains identical,including glass,emission planes,FPC,cover and connectors. External pixels never move physical parts. [Necessary smoke](smoke.json) checks all new closed geometry and positive volumes,actual window/bore FrontSide walls and empty mounting paths,positive residual material,glass/active dimensions,transparent pixel-shader contracts and source-alpha behavior,24 FPC/eight Grove contacts,two-entry artwork invariance,nested dual-Grove pose/independent detach/disposal,and no electrical/framebuffer echo. Browser/GPU viewing,manufacturing fit,calibrated optics,the unknown8-row map,I2C,address selection,firmware,power and real hardware remain outside this result.

Official feedback **`72332e4dea8048c791e322df97c5c0a7`** was accepted for the comparison table's swapped chip/address rows,the nominal/drawing dimension conflict,the visible56rows versus64-row headline,and missing own production CAD. The model follows the own drawing/schematic/linked panel specification and keeps unresolved claims explicit.
