# Unit DMX U183: physical model and visual controls

Model status: **modeled**, necessary construction/API smoke passed; browser and production mechanical fit have not been verified. Retrieved 2026-10-26. This pass follows the user's request to continue Unit coverage without lengthy sticker or face-by-face review.

## Official evidence

- [Unit DMX U183 product documentation](https://docs.m5stack.com/en/unit/Unit-DMX): 51.6 × 24 × 32 mm, Grove UART, fixed XLR-3 female receptacle, switchable 120 Ω termination.
- [Official dimension drawing](https://m5stack.oss-cn-shenzhen.aliyuncs.com/resource/docs/products/unit/Unit-DMX/%E5%B0%BA%E5%AF%B8%E5%9B%BE.jpg): shell footprint 48 × 24 mm; shell height 19 mm; total dimensions 51.6 mm length and 32 mm depth. XLR axis is 15.7 mm from the rear; two Ø4.85 mounting bores have 16 mm pitch and sit 12 mm from the Grove end.
- [Official assembled photographs](https://m5stack.oss-cn-shenzhen.aliyuncs.com/resource/docs/products/unit/Unit-DMX/11.webp), [side](https://m5stack.oss-cn-shenzhen.aliyuncs.com/resource/docs/products/unit/Unit-DMX/7.webp), [Grove end](https://m5stack.oss-cn-shenzhen.aliyuncs.com/resource/docs/products/unit/Unit-DMX/6.webp), [front](https://m5stack.oss-cn-shenzhen.aliyuncs.com/resource/docs/products/unit/Unit-DMX/9.webp): XLR barrel/insert, three female contact openings, mounting ear bore, physical metal PUSH release, cyan open-top Grove, termination cap and narrow indicator light guide.
- [Official schematic](https://static-cdn.m5stack.com/resource/docs/products/unit/Unit-DMX/img-a9577c01-030e-414c-a485-a37d14fa26b1.png): P1 XLR-328P, SW1 SS-1260, R4 120R, U3 CA-IS3092W, U2 ME6206A33XG, D4 RED LED/R8 2K. XLR contacts: 1 ISO_GND, 2 B/D−, 3 A/D+.
- [Official complete shell STL](https://github.com/m5stack/M5_Hardware/blob/e29c139cbc7c80b5ccc5557e5ab8025a7a19a109/Products/U183_Unit_DMX/Structures/Unit_DMX.stl), MIT; source SHA-256, Git blob, selected islands and rigid translation in `src/units/dmx/cad-map.json` and `sources.json`.

The official MCP `knowledge_search` response was retrieved before modeling and preserved outside the repository with the raw references and the generator. No raw photos, source CSV, private mappings, vector artwork or texture crops were added to the product.

## Native shell and reconstructed assembly

The official STL contains four disconnected islands: 0 and 1 are matching rear covers, while 2 and 3 are matching front covers. Islands 1 and 2 already form the assembled shell pair at the same raw X center. They are retained in full, including the XLR cradle, holes and molded details. A single translation `(−19.4266219139, −24, +27.9791793823)` is applied to both. There are no shell cuts, scaling or independent part realignments.

Canonical axes are millimetres, +X right, +Y toward the XLR end, +Z front/component side. The native rear plane is Z−4, the shell body is approximately Y±24 and the XLR extends to Y+27.6. The nominal total envelope is `[24, 51.6, 32]`, with the native 0.02 mm shell edge relief retained.

Added solids include a relieved physical PCB, CA-IS3092W package and leads, regulator, two mounting clearance scallops and a center screw bore, actual recessed Grove walls/four contacts/tails, SS-1260 body/three terminals and moving cap, XLR hollow barrel/rim/rear support/ribs, three real female contact bores with recessed annular metal contacts and spring leaves, insertion key, open mounting ear, moving PUSH linkage and indicator guide. The XLR is fixed to the PCB. There is no detachable terminal block or loose plug accessory.

The PCB profile/thickness/installed plane, concealed package layout, XLR package/rib/insert/ear/contact dimensions, termination cap/1.8 mm travel, 1 mm axial PUSH travel and indicator light-guide dimensions are reconstructions from the exact-product photographs and drawing. Only the native shell and the dimension drawing establish measured geometry. Connector clearances and actuation travels are visual estimates, not production fit or hardware ratings.

## Stable visual API

Both `Model` and `GroveModule` expose the same physical component IDs:

| ID | Kind | External control |
| --- | --- | --- |
| `grove` | `port` | Grove attachment; UART labels only |
| `dmx` | `port` | Fixed XLR-3 female receptacle; accepts connector `xlr-3-male`, rejects Grove |
| `termination` | `button`, latching | `setPosition(0\|1, { immediate })`; OFF cap is toward Grove, ON is toward XLR; 1.8 mm estimated slide |
| `xlr-release` | `button`, momentary | `press(source)`, `release(source)`, `cancel(source)`; real complete metal linkage moves 1 mm inward and returns |
| `power-led` | `led` | `set({ on, brightness })`; fixed red, default off, no automatic coupling |
| `sensor` | `component` | Pure visual anchor, no sensor value or protocol state |

```js
import {Model, GroveModule} from 'm5stack-models.js/units/dmx';

const unit = new Model();
unit.get('termination', 'button').setPosition(1);
unit.get('xlr-release', 'button').press('external');
unit.update(0.1);
unit.get('xlr-release', 'button').release('external');
unit.get('power-led', 'led').set({brightness: 0.5});

// An existing host Grove port can attach the same assembly with four drawn wires.
const attached = host.port('grove').attach(new GroveModule({cableLength: 60}));
attached.get('power-led', 'led').set({on: true});
host.handle({type: 'pose', target: 'grove/unitFrame',
  position: [15, 70, 0], rotation: [0.1, 0, -0.2]});
```

External writes do not generate input intent. Pointer/keyboard/manual presses use existing Button input events. Releasing/canceling the termination switch leaves its retained detent. The XLR release does not trigger cable removal. No DMX universe, UART, isolated voltage, termination resistance, bus signal, firmware or automatic power/activity state is implemented.

## Indicator evidence conflict

The [official marketing graphic](https://m5stack.oss-cn-shenzhen.aliyuncs.com/resource/docs/products/unit/Unit-DMX/4.webp) calls the narrow front light “RGB LED”, while the schematic identifies D4 as a single RED LED across 3V3/GND with R8 2K and no RGB channels. This model follows the explicit schematic, exposing a fixed-red `power-led`; any color field in a Led write remains red. This source discrepancy was submitted through the official M5Stack skill's MCP feedback: `66724e13e6234c4a9547fb39e08b066f`. A production revision-specific confirmation could refine this later.

## Necessary smoke only

`smoke.json` records the finite mesh/envelope checks, retained complete native shell, ten mounting-axis rays, FrontSide PCB/XLR bore walls, three open female insert bores and metal contact interiors, open XLR ear, real cap/paddle motion, retained termination, release return/cancel, fixed-red external brightness without electrical coupling, distinct XLR connector compatibility, nested Grove four-wire pose/attachment and detach/disposal. No browser, artwork, hardware actuation or measured connector-fit acceptance is claimed.

Next: continue Unit coverage, add approved U183 raster artwork, and refine the reconstructed hidden XLR/switch geometry when production mechanical references become available.
