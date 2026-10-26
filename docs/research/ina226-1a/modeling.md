# Unit INA226-1A · U200-1A

Stage: `modeled`; browser and physical acceptance remain unverified. Retrieved 2026-10-26. [Official product](https://docs.m5stack.com/en/unit/Unit_INA226-1A), [sources](sources.json), [artwork](artwork.json), [necessary local checks](smoke.json).

## Exact variant and dimensions

This is U200-1A, the ±1 A version with an **80 mΩ** shunt and **SMD1206-100-30** fuse. The 10A version's 5 mΩ shunt, fuse choice and print are not used. Both official product variants share the 58×24×10.2 mm nominal table; that common dimension does not establish identical electronics or artwork. Model axes are millimetres: +X front-label right, +Y orange terminal end, +Z front.

The own immutable path `Products/U200-1A_Unit_INA226-1A/Structures/Unit_INA226-1A.stl` was retrieved independently and checked against commit `784c926812716110e9b76041bfa876514017f81a`, blob `407677da165e92da74916f294e3c7e390418c823` and its source-byte SHA. It happens to share the housing blob with the 10A product. Both complete native components 0/2, totaling **5,582 triangles**, remain unmodified at scale 1 under one common translation `[0,28,-4]`; components 1/3 are displaced duplicates. No original face is filled, patched, removed, stretched or independently repositioned. [CAD map](../../../src/units/ina226-1a/cad-map.json) records the independent own source and MIT attribution.

The native shell is approximately24×56×8 mm. The product-linked U085-named common drawing also gives56mm shell length,24mm width,8mm shell depth and10.2mm fixed-socket-inclusive depth; it givesØ4.85 front bores,16mm pitch and12mm mounting datum from Grove. The reconstructed fixed orange socket projects2mm beyond the native shell, yielding the documented24×58×10.2mm bare-unit appearance envelope. Its projection and mouth datum remain inferred; the drawing does not establish that2mm production fit. The supplied removable plug extends further and its separate neutral envelope is recorded in `smoke.json`. Previous10A dimension feedback `692e32ec722240559336c5c6fb24a03f` is related evidence only,not an answered1A measurement or production drawing.

## Physical reconstruction

Own1A photos confirm the burgundy HY2.0-4P Grove,orange fixed four-pin HT3.96-4P socket,supplied orange four-screw plug,central rear hex screw and two device labels. Own schematic identifies INA226AIDGSR MSOP-10,CA-IS3020S eight-lead isolation package,B0505ST16-W5 sixteen-lead converter and two XC6228D332VR-G SOT25 regulators. The model gives these packages44 closed bent physical leads with feet seated at the PCB top. The manufacturer's B0505ST16-W5 drawing gives7.50×10.30×2.50mm body and16 leads at1.27mm pitch;the product-linked INA226 datasheet identifies the MSOP10 form. Hidden placement,minor package details and non-converter height/envelopes remain reconstructed rather than production installation datums.

The shaped PCB has real mounting reliefs and central retaining bore. The exact1A80mΩ shunt and1A fuse have physical metal terminations;the hidden shunt envelope is explicitly inferred because no own production PCB layout/BOM is available. The schematic's eleven additional populated resistors,twelve populated capacitors andD1 protection diode have named physical bodies. NC footprintsR2/C3 are not fabricated as populated components. Both board sides have relevant fixed copper/backing;four-pin socket/plug spring contacts,retention features,cages,pressure plates and screw heads give real depths rather than flat black caps. These shapes do not certify manufacturing,connector fit or isolation clearances.

D2 is a physical concealed **BLUE0603** package with non-emissive resin. Own11 product photos show the closed shell/ports/packaging,not a bare PCB or an exteriorD2 light path;the own hardware directory contains onlyStructures. No LED controller,light window,Sprite,halo or automatic connection/power glow is invented.

The four mating bores retain positive material after coordinate offsets and bevels:the narrowest tested allowance is0.20mm. The rear shoulder,screw-access deck and four wire-entry profile are also real perforated closed bodies. Their FrontSide cavity walls,empty axial channels,coordinate-welded directed edges and positive signed volumes are checked. These are local construction checks,not connector qualification.

## Source correction and print

The initial officialMCP generated summary incorrectly calledJ2 pin2 unconnected. Full-resolution inspection of the exact source schematic shows**pin2 andpin3 explicitly joined toPGND**;pin1 is the fuse/input side,pin4VCC_OUT. This reproducible correction was accepted for official review as feedback`8dc9976c83db4b2f9643586636cbc4c9`. The physical front-view documentary order remainsINPUT+/INPUT−/OUTPUT−/OUTPUT+;schematic numbering is a separate view and is not a wiring API. This model does not implement electrical connections.

Two exact own1A outlined original body labels are recovered as ordinary high-resolution `source-vector-raster` PNGs:front1A and rear80mR/1%. Original palette,letterforms and layout remain;compound glyph winding is normalized to recover counters. Bounding regions were independently measured from the actual1A vector. No10A print,photo pixels,packaging label,source filename,private URL,vector,generator or intermediate is distributed. Independent physical adhesive substrates remain with `artwork:false`;the print does not replace missing casing,PCB or connector parts.

## Agent integration

Exports are `Model`,`GroveModule`,`TerminalPlug` and `spec`. The body's only registered components are `grove` and `terminal`. It has no sensor anchor,button,LED,display or body joint. `terminal` accepts exact connector `ht3.96-4p`;the supplied accessory's four joints are `screw-1` through `screw-4` in physical front-view order. Both main types accept `terminalPlug:true`;the default fixed socket is bare.

```js
import {Model,GroveModule,TerminalPlug} from '../../../src/units/ina226-1a/index.js';
const bare=new Model();
bare.port('terminal').attach(new TerminalPlug());
bare.handle({type:'joint',target:'terminal/screw-1',angleDeg:70,durationMs:180});
bare.update(.18);
bare.handle({type:'joint',target:'terminal/screw-1',angleDeg:0});
const detached=bare.port('terminal').detach({dispose:false});
detached.dispose();
const unit=new GroveModule({terminalPlug:true,cableLength:60});
host.port('unit').attach(unit);
host.handle({type:'joint',target:'unit/terminal/screw-2',angleDeg:-45,durationMs:200});
host.handle({type:'pose',target:'unit/unitFrame',position:[20,70,0],rotation:[0,0,.2]});
host.handle({type:'cable',target:'unit/cable',slack:18,bend:[0,0,-1]});
host.update(.2);
```

Only corresponding screw heads rotate;fixed socket,plug frame,tongue and other heads remain independent. `angleDeg`/optional`durationMs` support exact neutral reset;nonzeroRPM is rejected. The viewer's[−180,180] range is not a measured thread stop. No screw axial travel,clamp displacement,torque,wire or input echo is simulated. GroveModule renders two plugs and four conductors,following externalunitFrame/cable pose under transformed parents and independent attachment/detachment/disposal. All current/voltage/power,INA226/register/I2C behavior,fuse response,isolation,power,electrical and firmware behavior belongs to external frameworks.

## Verification boundary

Necessary local smoke checks preserve every native triangle and separate envelopes;ten true mounting paths,native/PCB FrontSide bore walls;all44 physical IC/converter feet;57 directed closed geometries with positive volumes;64 accessory cavity-wall rays and12 empty axial paths;positive post-bevel hole material;four physical contacts per socket;no fabricatedLED/sensor;exact connector mismatch rejection;four independent screw transitions/reset,noRPM/noecho and fixed frames;all bare/plug Model/GroveModule artwork configurations with identical complete physical attributes/index/world matrices;nested four-core pose/cable,independent peer,detach and disposal. No full browser face-by-face review,production mating/isolating fit,electrical behavior or physical hardware acceptance was performed.
