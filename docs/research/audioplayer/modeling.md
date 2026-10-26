# Unit AudioPlayer — U197

Modeled appearance, 2026-10-26. Millimetres; +X right, +Y audio jack end, +Z printed front. The official 48 × 24 × 8 mm specification is represented as 24 × 48 × 8 mm in model axes. A photo-derived 0.4 mm jack lip protrusion makes the assembled visual Y envelope 48.4 mm; it is not a measured production datum.

## Official evidence

- [U197 product documentation](https://docs.m5stack.com/en/unit/Unit_AudioPlayer), retrieved through official M5Stack MCP `knowledge_search`, 2026-10-26: N9301, microSD, Grove UART and 3.5 mm stereo output. There are no documented or visible physical playback buttons, knob, speaker or USB socket.
- [U197 dimension drawing](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/1155/U197_unitaudioplayer_page_size_01.png): 48 × 24 × 8 mm, 4.85 mm mounting bores on 16 mm pitch, 12 mm above the Grove end.
- [U197 schematic](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/1155/Unit_AudioPlayer_U197_page_01.png): U1 N9301; U2 5033981892 microSD socket; CN1 PJ-342 stereo jack; D1 BLUE 0603 BUSY LED; J1 Grove.
- [Exact U197 photographs](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/1155/U197-01.webp), especially [jack](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/1155/U197-08.webp), [Grove](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/1155/U197-09.webp), and [side microSD slot](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/1155/U197-10.webp).
- [Official source STL at immutable commit](https://raw.githubusercontent.com/m5stack/M5_Hardware/e29c139cbc7c80b5ccc5557e5ab8025a7a19a109/Products/U197_Unit_AudioPlayer/Structures/Unit_AudioPlayer.stl), MIT. `src/units/audioplayer/cad-map.json` records blob/hash/islands/translation. Both complete native shells and the original BUSY light guide are retained under a single common translation. Displaced duplicate islands are excluded. No shell cuts, scaling, hole filling or independent alignment.

Raw MCP response, source STL, photographs, dimensions and generator stay outside Git. No private sticker table, vector original or photographic crop is distributed. Reference-redrawn final PNG artwork is now integrated ([sticker update](./stickers.md)).

## Physical assembly and inference

The model adds a PCB with open mounting-boss/Grove reliefs, central screw bore and hidden N9301/passive packages. The cyan Grove connector has four real contacts, rails and a recessed rear wall. The PJ-342 has an actual 3.5 mm axial air cavity, inward-facing bore walls, insertion stop and three recessed spring contacts. The microSD socket has a folded metal roof, side rails, carrier, eight recessed contacts and an insertion stop. The native +X side slot stays recessed. The original native shell aperture constrains the available channel; full insertion travel and production fit are not established, and no card accessory is included.

Connector body envelopes, hidden package placement, board outline/Z/thickness, contact positions, LED coupling and jack protrusion are reconstructions from exact-product photographs and native apertures. These are visual solids, not production PCB/STEP definitions. Mounting bores remain empty through the complete model.

## External API

```js
import {Model, GroveModule} from './src/units/audioplayer/index.js';
const audio = new Model();
audio.get('busy-led', 'led').set({on: true, brightness: 0.6});
// The one documented BUSY lamp remains blue. No automatic playback state.
audio.get('busy-led', 'led').set(false);

const attached = controller.port('grove').attach(new GroveModule());
controller.get('grove/busy-led', 'led').set({on: true});
controller.handle({
  type: 'pose', target: 'grove/unitFrame',
  position: [30, 60, 0], rotation: [0, 0, 0.2],
});
controller.port('grove').detach();
```

Ports: `grove` (`grove`, −Y); `audio` (`audio-3.5mm-trs`, +Y); `sd` (`microsd`, +X). Audio/card ports reject Grove modules. These ports document physical mating frames, not audio or storage behavior. `sensor` is a passive visual anchor with no commands. The model has no button, rotary or slider component, and emits no input events for external lamp updates.

No sound playback, MP3/WAV decoding, filesystem, memory-card state, UART command protocol, supply, electronic BUSY logic, amplifier, firmware or electrical simulation is implemented. Another framework owns those behaviors and may drive the one blue indicator.

## Necessary smoke only

`smoke.json` records finite source/runtime geometry, nominal/native envelopes, ten full-assembly mounting-bore rays, PCB and audio-bore FrontSide walls, recessed jack/card/Grove mouths and backing, three audio/eight microSD contacts, exact port frames, passive API, fixed-blue independent indicator, nested four-wire Grove cable pose, detachment and resource release. No browser, hardware, exhaustive face/artwork review or production-fit acceptance was performed; stage stays `modeled`.
