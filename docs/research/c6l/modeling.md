# Unit C6L U202

Stage: `modeled`. Geometry/API checks pass; exhaustive browser, production-fit and physical-hardware acceptance remain unverified. Millimetres: +X front right, +Y antenna end, +Z OLED face.

## Exact model and source assembly

The own U202 official product describes a complete **ESP32-C6 / SX1262 LoRa terminal** with 16MB Flash, **0.66-inch SSD1306 64×48 monochrome OLED**, one WS2812C2020 RGB, a user button, one side reset/boot key, a buzzer, USB-C, a white four-contact Grove and two RP-SMA receptacles. Its product nominal **62×24×8mm** excludes supplied rubber antennas. The own mechanical drawing separates **56mm casing + 6mm receptacle projection**,24mm width,8mm thickness, two **Ø5 mounting holes at 16mm pitch** and 12mm hole-to-bottom distance. Source/model axes therefore use shell24×56×8mm and receptacle-inclusive24×62×8mm; the vendor's nominal length/width/thickness order remains separately recorded.

The exact path `Products/U202_Unit_C6L/Structures/Unit_C6L.stl` was retrieved at path-specific commit `2a547f4cb53263c7c263c2fdc7c80f54cfb93fdc`, verified Git blob `5d9b8f363cde41c692bf2fe4c6dde15b1f64a25e`, and recorded source-byte SHA in [CAD map](../../../src/units/c6l/cad-map.json). Component0 is the complete **6442-triangle front/rear assembled shell**. Component4 is its **256-triangle assembled status light guide**, not a button cap. Components1/2/3 are displaced duplicate halves/guide. One common translation retains all **6698 original triangles** at scale1, with no source cuts, fills, patched faces or substitute cover. The native shell preserves OLED bevel, front U-cut user tongue and RGB slot, actual side reset tongue, USB/Grove mouths, rear acoustic/retainer openings, mounting bores, countersink reliefs, seam and M5 emboss.

Source shell and light guide each have only paired opposing coordinate-welded edges and positive signed volume. The outer front countersink has the actual edge relief; FrontSide through-bore wall checks use the inner cylindrical levels, not an invented wall across the visible relief. Bare assembly measures approximately **23.986×61.993×8.000mm**, while the complete source casing measures23.986×55.986×8mm. Those small differences reflect native tessellation and are retained without scaling.

## Physical closure and external input

A real-depth carrier PCB has open mounting-boss/Grove reliefs plus true retaining and four solder bores. The concealed Stamp C6LoRa substrate, shielding envelope, castellated contacts, power/protection packages, passives, display FPC, two fixed switch bodies/plungers, status packages and IPEX4/coax shapes fill the installed assembly. The own carrier schematic identifies U8M5Stack_Lora_C6,J1USB_C_16P_Horizontal,U2AW32901FCR,J2FH34SRJ-20S-0.5SH,S2SYS_KEY1,S1reset/boot network,U1WS2812C2020,LED1red/LED2green and **BZ1BUZZER1**. The linked module contains ESP32-C6,128Mbit Flash,SX1262 and PI4IOE5V6408. Hidden package dimensions/positions and board installation are visual reconstruction, without unproven PCB traces or manufacturing tolerances.

The actual OLED opening is backed by **solid glass with an inactive border**,a deep opaque carrier and FPC. `screen` accepts external64×48 pixels; a luminance shader renders white monochrome while preserving the supplied RGB buffer. It begins blank,with no touch surface,firmware screen or automatic content. The native front RGB slot has a fixed opal diffuser plus the actual2×2mm WS2812C2020 package behind it. `rgb` and `status` use distinct materials and begin off. `status` emits through the original CAD light guide. They are independent externally commanded appearances; pressing either key never changes them.

The two real integral case tongues deform in place using existing source vertices: **176 user vertices** and **50 side reset vertices**. Their original hinges stay fixed, and the neutral coordinates/normals return exactly after release/cancel. The corresponding internal tactile plunger moves while PCB,display,LEDs and fixed switch bodies stay fixed. Travel0.25mm/user and0.22mm/reset is an appearance estimate,not rated switch travel or material physics. Buttons accept normal multi-source pointer/keyboard/external press,release and cancellation. The side key is one physical `reset` control: long-press input is reported,with no added BOOT key and no download/reset/green-to-red state machine.

The buzzer has a real opaque acoustic carrier,annular rear sound opening and recessed diaphragm behind the native rear aperture;it exposes **no audio,Speaker or buzzer API**. Thin physical films touch actual front/rear label recesses,with the rear film backed by shell/acoustic structure. Two fixed retaining screws have real annular metal heads,blind hex sockets and internal shanks. USB-C has a deep closed rear dielectric,true annular shell,retained tongue and **16 contact strips**. The Grove has open molded walls,guide/latch geometry,a deep dielectric rear wall and four real contacts/tails. Native mounting holes remain empty through the assembled model.

## RP-SMA receptacles and supplied antennas

Own photographs06/13 explicitly show **external threads and centre pins** on both Unit receptacles. The official antenna table explicitly calls both accessories **internal thread / centre socket RP-SMA**,rather than ordinary same-polarity SMA. The model therefore gives the Unit true annular outer barrels,continuous helical external threads,recessed dielectrics and exposed centre pins;the antenna couplings have internal helices and actual recessed hollow centre sleeves. These are connector/pose shapes,not RF/electrical behavior.

The supplied **108mm868MHz LoRa** and **84mm2.4GHz Wi-Fi** accessories are independent `LoraAntenna`/`WifiAntenna` Modules. Front official assembly places LoRa left and Wi-Fi right;rear printed arrows agree after view reversal. Both have solid tapered rubber bodies,closed tips,coupling knurls,molded seams and physical label collars. With both installed,the full model measures about **163.993mm** long;the nominal62mm body includes receptacles and excludes radomes. Width/depth and detailed radome profiles are photo-derived,not production measurements.

The exact U202 images/GIF currently show straight antennas and molded seams only. No own bent pose,independent hinge axis or mechanical-stop range was verified. Accordingly both accessories keep the evidenced straight configuration and expose **no `tilt`,automatic sweep,SMA unscrewing or generic U170 joint**. A later exact accessory drawing can refine articulation without inventing it now.

## Artwork and Agent API

Four final ordinary PNGs accompany the Unit: original-vector rear raster,front source raster with current own-reference frequency-band amendment,and two readable reference-redraw LoRa/Wi-Fi collar labels. Front converter-only color/overlap repairs were checked against the exact flat proof;its remaining lettering/marks retain source paths. The mixed `source-vector-raster-and-reference-redraw` classification is explicit. No photo pixels,photographic crops,other-SKU artwork,packaging,private table/source URLs,filenames,vectors or intermediates enter Git. [Artwork record](artwork.json) lists final hashes,dimensions and placement.

The front film occupies Y13.5…25.5mm,above OLED and well clear of the moving user tongue at approximatelyY-9.7…-2.6mm. Neither real key carries a static projected sticker. Both entry types,with/without both antennas,and both separate antenna exports preserve every physical attribute,index and world matrix when `artwork:false`;only the body ink and collar textures disappear.

```js
import { Model, GroveModule, LoraAntenna, WifiAntenna }
  from '../../../src/units/c6l/index.js';
const unit = new GroveModule({ cableLength: 65, antennas: true });
host.port('portA').attach(unit); // mechanical Grove, no bus inferred
host.get('portA/user').press('agent');
host.update(0.016);
host.get('portA/user').release('agent');
host.get('portA/rgb').set({ color: '#20aaff', brightness: 0.3 });
host.get('portA/status').set({ color: '#ff2020', brightness: 0.5 });
host.get('portA/screen').writeRGB565(framebuffer64x48);
host.handle({ type: 'pose', target: 'portA/unitFrame',
  position: [15, 80, -5], rotation: [0.2, -0.1, 0.3] });
host.update(0.016);
const antenna = unit.port('lora-antenna').detach({ dispose: false });
unit.port('lora-antenna').attach(antenna);
const detached = host.port('portA').detach({ dispose: false });
// detached.dispose() when its external owner releases it.
```

Exports are `Model`,`GroveModule`,`LoraAntenna`,`WifiAntenna`,`spec`. Metadata IDs are `m5stack.unit.c6l`,`m5stack.unit.c6l.grove`,`m5stack.unit.c6l.lora-antenna` and `m5stack.unit.c6l.wifi-antenna`. Exact body component IDs are `grove`,`usb`,`lora-antenna`,`wifi-antenna`,`user`,`reset`,`rgb`,`status`,`screen`;a mounted Grove wrapper additionally has common `unitFrame` and `cable`. `options.antennas` is boolean,false by default,attaching both supplied accessories when true. Each antenna port still attaches/detaches independently. Four Grove colors are BlackGND,Red5V,YellowG5,WhiteG4;the actual printed PORT.X does not establish an I2C/UART/electrical simulator.

[Necessary smoke](smoke.json) checks source triangle counts/unscaled envelope,source/new geometry directed closure,real bore axial/FrontSide rays,OLED/perimeter/backing,RGB/status/acoustic/Grove/USB depth,both native keys including simultaneous/multi-source cancellation and exact restoration,independent off LEDs/external framebuffer,six artwork configurations,real RP-SMA polarity/depth,84/108mm accessories,independent antenna lifecycle,nested four-core Grove pose/no echo and disposal. It does not claim exhaustive browser review,manufacturing fit,RF performance,USB programming,download/reset behavior,buzzer audio,firmware/electrical behavior or real-device validation.

The MCP-generated schematic description incorrectly assigned a diode part number to BZ1. The actual linked own schematic marks BZ1 onlyBUZZER1;its exact part identity remains unasserted. Official feedback was accepted as `99c3b6fefdc542d2b59a4c805e4c5765`,also requesting exact supplied-antenna mechanical evidence. No private source information was included in that feedback.
