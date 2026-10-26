# Unit PbHUB v1.1 (U041-B)

Modeled on 2026-10-26 from the [official U041-B product page](https://docs.m5stack.com/en/unit/pbhub_1.1), its [front photograph](https://static-cdn.m5stack.com/resource/docs/products/unit/pbhub_1.1/pbhub_1.1_05.webp), [rear photograph](https://static-cdn.m5stack.com/resource/docs/products/unit/pbhub_1.1/pbhub_1.1_02.webp), [mechanical drawing](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/793/U040-B_Module_Size_sch_01.png) and [same-version schematic](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/579/SHC_UNIT_PBHUB_v1.1_sch_01.png). The official MCP product search was consulted before implementation. Original photographs, STL and research intermediates are not distributed here.

The upstream [M5_Hardware structure](https://github.com/m5stack/M5_Hardware/blob/e29c139cbc7c80b5ccc5557e5ab8025a7a19a109/Products/U041-B_Unit_PbHub_v1.1/Structures/Unit_PbHub_v1.1.stl) is pinned to commit `e29c139cbc7c80b5ccc5557e5ab8025a7a19a109`; its Git blob is `6207e09668335761cb1f265daa8349f20c6f69d1` and SHA-256 is `b10f9d582a6b12e22e7b51b6059517028cb96c1d1c73330460cd184c50499982`. Only connected component 0 is used: it contains the assembled front and rear shells, totaling 3,498 triangles. Components 1 and 2 are displaced duplicate halves. The coordinate transform is `x = sourceX + 80`, `y = sourceY`, `z = sourceZ - 1.2`; no scaling or axis reversal is applied. The original MIT source attribution is retained in the repository notices.

Local +X is right, +Y is top and +Z is front. The official nominal dimensions are 48 × 24 × 10.8 mm, represented here as 24 × 48 × 10.8 mm. The native shell is 24 × 48 × 8 mm. The assembled maximum is 24 × 48 × 10.845 mm including a 0.045 mm rear screw relief. The product page links a mechanical drawing with a U040-B filename; it matches the six-socket chassis and nominal dimensions. U041-B identity, channel order and visible electronics use the U041-B native file and photographs, rather than the older PbHUB or PaHUB electronics.

The real front opening is occupied by a black PCB, a TSSOP20 package, visible leads, passives, regulator and six black upright Grove housings. The red upstream housing has a true open mouth, side rails, floor, recessed wall and four short metal contacts. All six output housings have the same physical details. No photograph or plane covers these openings. The two Ø5 mm installation bores remain open through the whole model.

PCB thickness and outline, component positions, socket center placement, latch shapes and insertion depths are visual estimates from the same-version photographs and shell fit. They are not production tolerances. The original-design rear label is now integrated ([sticker update](./stickers.md)); fine PCB silkscreen remains deferred; the model remains `modeled`, with browser visual acceptance unset at the user's request.

## Connection API

Both `Model` and `GroveModule` expose the upstream `grove` and six downstream `grove-0` through `grove-5` ports. With the input facing down, the front positions are:

| Port | Physical position | Mouth outward | Pin 1 → 4 |
| --- | --- | --- | --- |
| `grove` | Bottom input | −Y | SCL, SDA, 5V, GND |
| `grove-0` | Right lower | +Z | IN0, OUT0, 5V, GND |
| `grove-1` | Right middle | +Z | IN1, OUT1, 5V, GND |
| `grove-2` | Right upper | +Z | IN2, OUT2, 5V, GND |
| `grove-3` | Left upper | +Z | IN3, OUT3, 5V, GND |
| `grove-4` | Left middle | +Z | IN4, OUT4, 5V, GND |
| `grove-5` | Left lower | +Z | IN5, OUT5, 5V, GND |

All ports use the existing `grove` connector type. The port frame origin is the physical mouth center; local +Y points outward. The two right socket pin rows turn −90° and the two left rows +90°, including their port and pin-grid frames. Top output pin 1 is left; right-side pin 1 is upper; left-side pin 1 is lower. Input pin 1 is right when seen from the front. These sequences match the U041-B rear pin strip and schematic; they are metadata, with no electrical runtime.

```js
import { Model as PbHub, GroveModule as PbHubModule } from './src/units/pbhub-v11/index.js';
import { GroveModule as ButtonModule } from './src/units/button/index.js';
import { GroveModule as AngleModule } from './src/units/angle/index.js';

const hub = new PbHub();
const button = hub.port('grove-0').attach(ButtonModule, { cableLength: 70 });
const angle = hub.port('grove-3').attach(AngleModule, { cableLength: 90 });
angle.get('unitFrame').setPose({ position: [-12, 100, 5], rotation: [.1, .2, -.3] });
hub.get('grove-3/rotation').setAngle(37);
hub.port('grove-0').detach(); // grove-3, its Unit and its cable remain attached.
hub.dispose();

// On any existing host with a real Grove port:
const attachedHub = host.port('grove').attach(PbHubModule, { cableLength: 120 });
attachedHub.port('grove-3').attach(AngleModule, { cableLength: 90 });
host.get('grove/grove-3/rotation').setAngle(20);
```

The connection API represents physical mating, cable shape and nested control addresses. It does not check a Unit's electrical compatibility with PbHUB and does not implement the STM32, I2C address/registers, ADC values, GPIO, PWM, servo control, RGB-controller protocols or supply behavior. Those belong to an external runtime.

## Construction smoke

[geometry-check.json](geometry-check.json) records the native and visible envelopes, clear mounting bores, FrontSide PCB bore-wall rays, all 7 port directions, 28 contact rays and matching pin-grid numbers, recessed socket interiors, physical front electronics and native rear closure. Both standalone and Grove-module forms attach two actual downstream Unit modules with independent four-wire cables, resolve nested component paths, update cable pose and retain one connection when the other is removed. The parent cable stays attached. All 664 tracked new-model resources are disposed once. Existing shared Grove-cable resources are outside that exact-once count.

This is a local geometry/API construction check. Browser rendering, PNG decoding, hardware operation and manufacturing accuracy are not claimed.
