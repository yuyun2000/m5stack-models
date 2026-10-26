# Unit NBIoT2 U111-B

Stage: `modeled`; scope: `visual-only`. Millimetres: +X front right, +Y SMA, +Z front NB-IoT2 label. This is the exact **U111-B / SIM7028** Unit, independently established by its current official MCP, product page, own gallery/schematic and product-linked module brochure. Original U111 SIM7020G, U112 SIM7020C, Cat1 and LoRaWAN internal hardware/printing/antenna are not its authority.

## Complete own native assembly

The [CAD map](../../../src/units/nbiot2/cad-map.json) pins own `Products/U111-B_Unit_NBIoT2/Structures/Unit_NBIoT2.stl` to commit `c6bf30a9848f1a8b4e4dd7537cceec5b147cafb3`, Git blob `cd451d15e2d03f37e80e7db05bf7f82fa56a78ba` and SHA-256 `6d93ea1962caf38864027accc041acb990a61e3360581aad16edf30ec294b17f`, with pinned M5_Hardware MIT rights. Source component0 contains the complete **6592-face** same-location assembly; components1/2 are displaced **3858 rear / 2734 front** display duplicates.

Every original component0 face is mapped one-to-one, preserving cyclic winding, to those own duplicate halves. There are zero missing/ambiguous faces and maximum vertex correspondence error **0.000004827976226806641 mm**. Runtime halves retain original component0 vertices and all faces, one common origin `[0,32,-4]`, identity axes and scale1. No source cutting, patching, stretching or independent half movement occurs. Both native halves are closed positive-volume solids when treated separately. Identical case bytes published under other exact SKU paths establish shared casing only.

Own product nominal dimensions are **71.5 × 24 × 8 mm** including SMA. The native casing is **24 × 64 × 8 mm** in model axes. The drawing marks **6.5 mm** threaded projection; the reconstructed full installed connector datum is distinguished from that partial dimension and matches table nominal length. Actual Ø4.85 mm front mounts lie at X±8/Y−20,16 mm apart and12 mm above the bottom;Grove outline is10 × 5.2 mm. Source tolerances are retained.

## Carrier, own SIM7028 and internal NanoSIM

A reconstructed shaped carrier at Z1.6–2.4 includes actual mounting-boss reliefs, retaining bore and four true Grove solder bores with annular lands/inner barrels. Bent contacts physically enter these board drill locations with positive diagonal clearance. Its hidden layout and exact installation remain inferred.

The linked SIM7028 brochure explicitly specifies **17.6 × 15.7 × 2.3 mm**,LCC packaging and shows **12 top +12 bottom +9 left +9 right =42** perimeter terminals. The model retains this own body envelope,42 genuinely open edge half-holes,closed inner plating,upper gold lands and carrier toes. Pitch1.1 mm,drill/plating sizes,0.6 mm substrate and installed pose are appearance estimates rather than a mechanical pin-number drawing. Its metal shield and actual blank factory-film substrate fit the2.3 mm body; no fictional serial,IMEI,QR or other unreadable ink is generated.

Own schematic packages are present: U1 SY8003ADFC converter/eight perimeter terminals and thermal pad,L1 WPN3012H2R2MT,U2 SMF05CT1G/six terminals,Q1 SS8050/three terminals,D1 internal0603,actual C1–C8 and R1/R2/R3/R4/R5/R7/R8/R9 envelopes,and four JP passive test-land envelopes. Their installed footprints/envelopes are reconstructed. D1 is fixed and nonemissive because its exterior optical path is not established. No exterior LED,button,display,sensor or body joint is registered.

Built-in NanoSIM is documented. The actual socket is represented by a fixed six-contact dielectric carrier,metal lid,side guides,rear stop,real insertion cavity and solder toes;exact holder part,retention mechanism and concealed installation are inferred. No SIMcard is supplied or fabricated. No card insertion,hinge,authentication,network or SIMdata behavior exists.

## Own physical interfaces and service configuration

Bottom blue Grove is an actual open receiving socket with floor,rear wall,latch/rails,four contacts and bent solder tails. Documentary pins are **GND /5V /UART_RX /UART_TX**. Top ordinary SMA female has genuine annular mouth,dielectric center opening,hollow center contact/blind end,barrel,threaded shell,nut,washer and gold internal installation body. Both small original upper windows are backed by that real gold hardware;yellow-green photographic appearance does not turn these windows into a light guide or button. Own E1 ANT_IPEX is schematic-confirmed;its physical receptacle/cable plug and capped coax-to-SMA envelope are present,with concealed routing/installation inferred. Both helical threads and coax terminate in real material faces.

Three actual rear hex retaining screws have annular heads,blind metal floors and shanks. Default `{rearCover:true}` retains the entire original rear half,all three screws and rear physical film. The explicit service view `{rearCover:false}` intentionally omits those complete removable parts,retains the full2734-face native front and only then exposes passive `sim`. No `sim` component is registered through the closed shell. Service view reconstructs access to the documented built-in socket;exact factory servicing instructions/holder latch remain unconfirmed and no animated cover/screw motion is claimed.

## Supplied independent antenna

`Antenna` is an optional separately detachable own U111-B accessory,default `{antenna:false,antennaAngleDeg:0}`. Own hero shows a slim round tapered black rod,ordinary SMA male coupling/centerpin,coupling ribs and a neck with visible side-axis dimple/fork segmentation. Relative projection against the same photographed Unit axis gives approximately100–110 mm;**105 mm** straight overall length and approximately9.44 mm coupling width/depth are explicitly appearance estimates. The official page supplies no rated antenna mechanical size. This is the own round-rod reconstruction,not a195 mm flattened or another product's antenna.

Only its knuckle and solid round radome move about inferred local X at `[0,12,0]`. Coupling,pin,neck,fork cheeks and axle stay fixed. `sma/tilt` accepts external **0–90°** visual angles and timed interpolation;axis/profile/range are inferred,with no measured stop or actual bent-production-pose claim. There is no continuous RPM,automatic sweep,unscrewing,ground solve,RF/frequency/performance or electrical simulation. Straight installed envelope is approximately **24 ×171.5 ×9.44 mm**.

## Corresponding exact-model print

Two ordinary **1580 ×3610** and **1600 ×3600** `reference-redraw` PNGs reproduce readable own official views. Front retains three hollow hexagons and NB-IoT2 with blue2.Back retains NB-IoT2,**SIM7028**,the own19-band list,SIM/INSIDE icon and actual **PORT.C.UART /TXD /RXD /5V /GND** color strip. Fonts/colors/line work/registration are reconstructed;no photographic pixels or other variant's print is used. Exact source originals were not established,so conflicting candidate variants are excluded.

Separate physical films at Z3.8/−3.8 touch native closed supports. `artwork:false` removes ink only,with full physical attributes/index/world invariant in both entries,cover states and antenna states.The real rear film is absent only with the removed rear half.[Artwork provenance](artwork.json) records safe references and final hashes. Private table,mappings,source vectors/URLs/names,raw evidence and generators stay outside the distribution.Static literal `new URL` PNG bindings support asset emission;root build/resource checks are separate.

## Agent integration

```js
import {Model,GroveModule,Antenna,spec}
  from '../../../src/units/nbiot2/index.js';
const unit = new GroveModule({rearCover:true,antenna:true,cableLength:60});
host.port('portA').attach(unit);
host.handle({type:'joint',target:'portA/sma/tilt',
  angleDeg:90,durationMs:500});
host.handle({type:'pose',target:'portA/unitFrame',
  position:[15,85,-5],rotation:[0.2,-0.1,0.3]});
host.update(0.016);
unit.get('sma/tilt').set({angleDeg:0});
const antenna = unit.port('sma').detach({dispose:false});
unit.port('sma').attach(antenna);
const service = new Model({rearCover:false});
service.get('sim'); // Passive internal socket; no card/data behavior.
// Teardown: host.dispose();service.dispose(). Retained detached items are caller-owned.
```

Default own components are `grove` and `sma`;service adds `sim`;the separate antenna adds `sma/tilt`. Module lookups use `get`,not a Device-only convenience accessor.`GroveModule` adds the standard actual four-core/two-plug `cable` and `unitFrame`. Cable source follows the transformed actual parent port;pose/tilt commands do not echo input. No cellular/AT/UART/network,RF/RSSI,SIM authentication/data,USB,sensor value,power/electrical or firmware behavior is implemented;requests are rejected.

## Necessary construction checks

[Local smoke](smoke.json) confirms full6592 original faces/common transform/correspondence,body and module envelope,whole-assembly mounts,retaining/Grove bores and actual bent-tail seating,all42 true module edge apertures/plated walls,ordinary SMA female cavity/male pin,gold hardware behind both native windows,fixed blind screws/film supports and actual NanoSIM cavity. **328 physical solids** across body/accessory have opposed welded edge pairs and positive volume. **18 axial and156 FrontSide wall checks**,42 castellation checks and12 artwork configuration pairs pass. Service-only SIM visibility,0/45/90 interpolation/fixed assembly/precise return,invalid state preservation,transformed-parent four-core/nested pose/peer independence,detach/refit/noecho and all **375** tracked resource releases pass.

These are bounded construction/API checks,no exhaustive browser/GPU,production fit,measured antenna stops,network/RF/electrical/firmware orphysical-device acceptance.Missing exact installed PCB/NanoSIM/SMA/D1 optical path and supplied antenna mechanics were reported through official documentation feedback,accepted as **`8835048c2d544bc19516a233746ee788`**.
