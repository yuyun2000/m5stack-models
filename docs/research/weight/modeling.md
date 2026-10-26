# Unit Weight · U030

Stage `modeled`; visual verification remains null. [Official product](https://docs.m5stack.com/en/unit/Unit_Weight), [sources](sources.json), [artwork](artwork.json), [necessary smoke](smoke.json). Retrieved 2026-10-27.

## Exact product and original assembly

This is the original **Unit Weight U030** with HX711 and its documentary DAT/CLK connection. It is separate from Weight-I2C U180, Mini Scales U177 and Scales U108. Its package contains the Unit, a 20 cm Grove cable and one removable HT3.96-4P four-screw plug. No load cell, scale platform, user wires or weight is included in this model.

The own mechanical drawing dimensions a **24×32×8 mm shell** and **10.2 mm assembled fixed-socket depth**, terminal width15.8 mm, Ø5 mounting holes16 mm apart and12 mm from the bottom. The modeled native envelope is24×32×8; default physical envelope24×32×10.2 mm. Axes are +X right,+Y terminal end,+Z front. Mount centres are[−8,−4] and[8,−4].

Own `Products/U030_Unit_Weight/Structures/Unit_Weight.stl` is pinned to path-specific commit `dbc93013098189c8c0995e7678347b75a369a366`, blob `c02795519805df4ed432dd045eeac657b410f6dc`, SHA256 `258895767cd805c4860265ba219fece24399a3b7e3aa1e76eb8863c54ce98d48`. The original file contains assembled component0, **3216 triangles**, plus displaced duplicates1(1684) and2(1532). Only original assembled0 faces enter runtime. Directed cyclic correspondence assigns its1532 front/1684 rear faces to actual physical parts without moving them independently. All3216 match; maximum duplicate vertex deviation0.00006104 mm. Common origin[−529.268798828125,225.22348022460938,4], axes[−X,+Y,−Z], scale1. No source face is removed,repaired,patched,stretched orfilled; displaced copies are excluded.

Original combined source0 retains10 direction-balanced count-four mating edges. Each independent native shell and each runtime part is coordinate-welded count-two/balance-zero with positive volume. This preserves the original assembly, without claiming it is a single manufacturing manifold. The source's layered mounting bores and all intentional socket mouths remain genuine openings.

## Complete physical structure

The rear housing, embossed M5 and single retained centre screw remain. The screw has a real hex-socket annular head,recessed floor and shaft. An inferred0.8 mm green PCB at topZ−1.3 includes open side mounting reliefs and a real central fixing bore. Its3.8 mm side reliefs,6 mm central clearance bore androunded corner reliefs avoid the native mounting bosses andrear locating features;the0.8 mm substrate is above the native locating pads. Its component bodies reproduce the own schematic inventory: one HX711 SOIC16 with16 physical gull-wing leads, SS8550 Y2 with3 leads, R1…R5 and C1…C5, and factory connector pads. Hidden board outline,seating,package placement andpassive dimensions are declared appearance estimates. No MCU,SWD,I2C hardware or invented electrical traces are borrowed from U180.

The black Grove receiving connector has actual full side walls,front retaining rails,short bridge,floor,recessed dielectric back,four metal pins and four terminations landing in solder pads over real FR4. The opposite orange4P fixed socket has a real floor,side/back walls,three low separators,4actual inspection windows and4metal pins with board returns. These physical structures close the native shell cutouts without using a PNG as missing assembly geometry.

The supplied **TerminalPlug** is a separate Module. Its own U030 package photograph proves its removable structure,four recessed screw heads andfour wire entries. Its reconstructed **16.4×18.2×7.2 mm** envelope,7.4 mm inserted tongue,internal walls andclamp details are independent estimates from that exact photo and3.96 mm pitch,not another product's plug dimensions or rated fit. Four pin passages through the tongue andshoulder,wire-entry bores and screw-access deck openings are actual empty material channels with FrontSide walls. Recessed springs,deep cage back/floors/side plates,pressure plates and retained shanks provide real visible backing. Positive material and socket/tongue clearances remain around each opening. Attachment preserves the Unit's shell,connector,films and mounts.

Only the four slotted heads rotate. Their externally driven joints accept angles and requested interpolation; newer commands replace an unfinished transition. Neutral pose roundtrips exactly. The fixed shanks,cages,pressure plates,receiving socket and all labels stay fixed. The displayed −180…180° interval is a viewer interval; thread pitch,tightening limits,axial travel,clamp force and actual stop angles are unconfirmed and are not simulated.

## API and genuine configurations

Exports: `Model`, `GroveModule`, `TerminalPlug`, `spec`. The body has only `grove` and `terminal` Port components, with no virtual sensor,button,LED,display,body joint or synthetic scale value. Grove documentary labels are DAT,CLK,5V,GND. Terminal left-to-right labels A+,A−,E−,E+ correspond to own J2 pin1,2,3,4. Metadata does not implement voltage,excitation,HX711 clocks/conversion,calibration or firmware.

`terminalPlug:false` is the default empty receiving socket; `terminalPlug:true` installs the real supplied accessory. Both Model/GroveModule support those two configurations. The plug contains only`screw-1`…`screw-4` joints. Component lookup uses `get()`; GroveModule additionally has existing`unitFrame` andfour-core`cable` components.

```js
import {Model,GroveModule,TerminalPlug} from '../../../src/units/weight/index.js';
const unit=new Model({terminalPlug:true});
unit.handle({type:'joint',target:'terminal/screw-2',angleDeg:90,durationMs:200});
unit.update(.2);
const plug=unit.get('terminal').detach({dispose:false});
unit.get('terminal').attach(plug); // same accessory andhead state
const wired=new GroveModule({terminalPlug:true,cableLength:70});
host.get('unit').attach(wired);
host.handle({type:'joint',target:'unit/terminal/screw-4',angleDeg:67});
host.handle({type:'pose',target:'unit/unitFrame',position:[10,90,7],rotation:[.2,.1,-.3]});
host.handle({type:'cable',target:'unit/cable',slack:17,bend:[0,0,-1]});
host.update(.2);
```

## Two labels together with the model

The exact own front photograph supports a **1540×440** code redraw of A+ green,A− silver,E− black,E+ red. The rear photograph supports a **1580×1180** redraw of WEIGHT,GPIO A/B/C,arrows,HX711 andDAT/CLK/5V/GND. Only readable text is reproduced. Original print-master fonts,colors andregistration are unavailable and remain declared estimates.

Both transparent-ink PNGs project onto independent physical silver adhesive films. The front film is on the actual socket roof away from its inspection windows; the rear film is in the native label recess. `artwork:false` removes ink only. All physical attributes,indices andworld matrices remain identical for both entries withandwithout the plug and for standalone TerminalPlug. The final PNGs contain only numeric2540 DPI metadata. No photographic crop,original vector,private table/name/URL/mapping,raw CAD/photo/PDF/MCP,SVG generator orproof is distributed.

## Bounded verification and remaining limits

Necessary local smoke passes **188 physical meshes with directed closed edges andpositive volume** in the plugged configuration. This includes complete3216 original faces,10 open mounting axes,40 actual native FrontSide bore walls,4fixed inspection axes/16walls,40 front-opening/backing checks,16 real plug channel axes and64FrontSide plug wall rays. Three-direction surface/interior overlap checks cover41 candidate fixed/socket ormetal/plastic pairs,7332 surface samples and1107 volume-grid points without detected penetration. The inferred PCB also passes a targeted two-shell clearance regression:3914 surface samples and54 volume-grid points atthree directions,including the original rear locating/mounting bosses. These are bounded visual construction checks,not manufacturing collision certification.

Twenty screw poses,interpolation/replacement/neutral roundtrip,no input echo,fixed-part invariance,5 artwork configurations,transformed-parent four-core attachment,independent peer,selective plug detach/reattach,whole Unit pose roundtrip anddisposal of629 tracked resources pass. No exhaustive browser,GPU,physical-device orproduction-fit acceptance was performed. There are no real button multi-source press/release tests because this exact product has no buttons.

Targeted official product/MCP/CAD-directory recheck still lacks PCB mechanical/installed-plane andsupplied plug dimensions. Feedback `da5b3aa5ebea4f2d9ae31ff88308ef17` was accepted for official review. These secondary dimensions remain marked inferred;the model provides appearance andexternal visual kinematics only.
