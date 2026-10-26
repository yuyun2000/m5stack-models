# Unit ChainBus · U212

Stage: `modeled`; browser and physical acceptance remain unverified. Retrieved 2026-10-26. [Official product](https://docs.m5stack.com/en/unit/Unit_ChainBus), [sources](sources.json), [artwork](artwork.json), [necessary local checks](smoke.json).

## Exact native assembly and dimensions

The exact own source `Products/U212_Unit_ChainBus/Structures/Unit_ChainBus.stl` is pinned to current hardware commit `e29c139cbc7c80b5ccc5557e5ab8025a7a19a109`, blob `0f25873ad6e1103b715cd3931d06c399a7e9dcaf` and SHA recorded in [cad-map](../../../src/units/chainbus/cad-map.json). The path last changed at `b4d8875bd504fed30242df78a1370703742941fb`. Complete native components **1/3/4 total 4,156 triangles**: rear housing,front housing with integral EXT latch,and actual RGB light guide. Components 0/2/5 are displaced duplicates. Every source triangle/index remains under one proper rigid rotation/translation at scale 1;no faces are filled,patched,removed or independently repositioned.

Axes are millimetres: +X OUT side,+Y fixed EXT plug,+Z front pin strips. Source origin is `[20,−22,−9.290332794189453]` and proper axes `[[0,1,0],[-1,0,0],[0,0,1]]`. The housing is24×24×8mm;the complete native assembly measures24×26.679523×8mm because it already includes the protruding EXT latch. It lacks the surrounding full white four-chamber plug. The real plug is reconstructed to extend5.8mm beyond the square housing,yielding the official **24×29.8×8mm** model envelope (vendor order29.8×24×8). It does not stretch the housing to29.8mm.

Two Ø4.85mm mounting bores are atX±8/Y8,16mm apart and20mm from the shell bottom. Original shell openings,light path,mounting holes and the source EXT latch remain real geometry.

## Physical construction

Own photos establish cyan open HY2.0-4P board sockets on the left IN and right OUT,with side/top rails,retaining details,recessed dielectric carriers and four metal contacts each. The top EXT is a fixed white four-chamber plug with a raised native latch and recessed contact chambers;it is a different physical mating shape from the two board sockets. Its four real open axial chambers and recessed contact springs/rears are modeled separately. No flat black cap or print replaces these structures. The narrowest exterior material allowance in the tested plug cross-section is0.80mm;between chambers1.20mm and above/below1.15mm,with no bevel erosion.

A shaped PCB supplies real mounting reliefs and a true central retaining bore. Own schematic identifies STM32G031G8U6,ME6211A33M3G,WS2812C-2020,R2 and seven populated capacitors. The model includes a28-pad MCU package envelope,the regulator and three terminals,eight populated R/C bodies and terminations,the RGB package,and five SWD pads. Optional R3/R4 are NC and are not fabricated as populated parts. Hidden board/package coordinates,envelopes,connector terminations and production installation remain inferred:the own hardware folder contains only Structures,without a production PCB layout or complete assembly BOM.

A fixed retaining screw has a real hex entrance,physical cavity walls/recessed floor and shaft. Front pin-strip and rear die-cut adhesive substrates are independent physical bodies. The embossed rear M5 and integral EXT latch remain native. The original guide receives default-off externally commanded RGB material only;no Sprite,halo,automatic link/power status,button,joint,USB or fabricated sensor is added.

## Connector and entry API

Exports are `Model`,`GroveModule`,`DirectModule` and `spec`. All body types register only `grove`,`out`,`ext` (Ports) and `rgb` (Led kind). `grove` is the canonical **left ChainBus IN**;`out` is the right ChainBus OUT. Both use connector`grove` solely as the HY2.0-4P socket mechanical family. It does not assert UART/I2C/pin compatibility or automatically route wires/signals.

`GroveModule` uses the existing two-plug,four-conductor cable framework through left IN and adds`unitFrame`/`cable`. A child GroveModule at`out` supplies another real four-conductor cable and independently driven unit pose. Source cable coordinates are in the child's module frame;their world source follows the parent's OUT port through transformed ancestors.

`ext.connector` is **`hy2.0-4p-plug`**. Ordinary GroveModule cable plugs are rejected at this already existing plug. `DirectModule.meta.connector` is`grove`:it inserts the body's actual white EXT plug into a host HY2.0-4P socket. Its fixed`directAssemblyFrame` rotates the complete body180° aboutZ and translates`[0,16.6,−0.8]`;the actual EXT nose is at`[0,−1.2,0]` in the host Port frame and faces−Y into the host. The1.2mm insertion uses the existing cable-plug appearance datum and remains an inferred fit. DirectModule creates **no VisualCable,additional white source plug,unitFrame or free joint**. Its other ports and RGB remain independently addressable. Detach/reinsert keeps the fixed assembly transform.

```js
import {Model,GroveModule,DirectModule} from '../../../src/units/chainbus/index.js';
const bus=new Model();
bus.port('out').attach(new GroveModule({cableLength:50}));
bus.handle({type:'pose',target:'out/unitFrame',position:[5,70,0],rotation:[0,0,.2]});
bus.handle({type:'cable',target:'out/cable',slack:18,bend:[0,0,-1]});
bus.handle({type:'led',target:'out/rgb',color:'#00aaff',brightness:.6});
bus.update(.2);
// A host socket can instead receive the real fixed EXT plug directly:
const direct=new DirectModule();
host.port('unit').attach(direct);
host.handle({type:'led',target:'unit/rgb',color:'#ff0044',brightness:.4});
const detached=host.port('unit').detach({dispose:false});
detached.dispose();
```

There are no sensor values or communication/electrical models. UID/version queries,enumeration,heartbeats,UART/I2C,GPIO/ADC/NVIC,power and firmware belong to external frameworks.

## Exact artwork and unresolved source numbering

Two own original outlined label groups are recovered as ordinary high-resolution`source-vector-raster` PNGs:723×1005 front and2086×1433 back. Independent bounds preserve the actual letterforms,palette,layout and cutouts without retyping or photographic pixels. Packaging and previews are excluded. Complete physical attributes,indices and world matrices are identical with`artwork:false` for all three entry types. Supplied table,private mappings,original names/URLs,vectors,generator and intermediates are not distributed.

The literal own print/product text labels left IN as UART1 and right OUT as UART2. The exact formal schematic instead connects IN/J1 toTXD2/RXD2 (PA2/PA3) and OUT/J2 toRXD1/TXD1 (PB7/PB6). Rechecking the original image confirms the mismatch;official feedback`edca641cfca844a2a21fe0aa326d25de` was accepted for review. This model preserves visible IN/OUT and printed labels and does not decide production electrical or firmware routing.

## Necessary validation and boundary

Local smoke passes all4,156 original triangle retention,complete/native envelopes,10 empty mounting rays,28 native/PCB FrontSide bore-wall rays,eight coordinate-welded closed directed geometries with positive volume,four truly open EXT chamber axes and16FrontSide chamber-wall rays,four recessed EXT contacts,eight cyan-socket contacts and physical rear carriers/film/guide/hex-floor rays. RGB changes only the real guide's emissive material without input echo,geometry changes,automatic status or halo.

All three artwork configurations preserve every physical attribute/index/world matrix. Nested IN/OUT four-core pose/cable checks run under transformed parents with an independent peer. Direct attachment uses the existing plug only,keeps the true mating datum/fixed transform,rejects ordinary plug-to-plug attachment,and detaches/reinserts without another source plug. All1,060 tracked resources in the integration fixture dispose.

These checks cover necessary construction and appearance API only. No lengthy browser face-by-face re-review,production connector mating qualification,protocol,electrical or physical-device acceptance was performed. Hidden fit/layout and artwork registration limitations keep this product`modeled`.
