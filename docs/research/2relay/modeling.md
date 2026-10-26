# Unit 2Relay U131

Model coordinates are millimetres, +X right, +Y toward the end away from Grove, +Z forward. The official drawing specifies 56 × 24 × 19 mm; canonical nominal dimensions are `[24,56,19]`. The native shell pair is 24 × 56 × 8 mm. The two raised opaque relay packages complete the 19 mm nominal assembly depth. The rear screw adds about 0.045 mm to the appearance envelope.

## Evidence and reconstruction

Official MCP product retrieval on 2026-10-26 confirmed SKU U131, two independent blue 0603 status LEDs, GPIO Grove, and two supplied HT3.96-4P terminal accessories. The same-SKU package image names the loose orange accessories VH3.96-4P. This model uses `ht3.96-4p` as the connector key, consistent with the library's previous detachable-terminal Units.

`cad-map.json` records immutable M5_Hardware commit, blob, SHA-256, component selection and one common translation. Both native assembled shells (islands 0 and 2) remain complete. Displaced shell copies 1 and 3 are excluded. Native package/terminal windows, LED recesses, side catches, screw seat, Grove aperture and mounting bores remain unchanged.

Physical additions include a PCB with open edge relief around both LEGO bosses, a central screw bore, two sealed relay packages, fixed terminal shrouds with metal pins and recess floors, recessed LED packages and an open-top black Grove socket with contacts and latch. The relay windows are closed by full opaque package geometry, rather than a photograph. Intentional connector cavities and LED recesses remain real openings with visible interior hardware.

Installed PCB Z, relay height, fixed and removable terminal geometry, Grove details, minor components and screw recesses are photo-derived appearance estimates. Native apertures constrain their placement; this is not a production STEP assembly or a tolerance/insulation/voltage validation. Board traces, relay armatures, electrical switching, NO/NC state and voltage/current behavior belong to external runtimes.

## External visual API

```js
import {Model,GroveModule,TerminalPlug} from './src/units/2relay/index.js';
const standalone = new Model(); // both fixed sockets empty
const unit = new GroveModule({terminalPlug:true,cableLength:60});
controller.port('grove').attach(unit);
controller.handle({type:'led',target:'grove/led-1',brightness:0.7});
controller.handle({type:'joint',target:'grove/terminal-2/screw-4',angleDeg:45,durationMs:200});
```

`terminal-1` and `terminal-2` are independent front-facing attachment Ports. `new Model({terminalPlug:true})` and `new GroveModule({terminalPlug:true})` install both supplied plugs. A single `TerminalPlug` may also be attached to either socket. Each plug owns `screw-1` through `screw-4`; only the visible screw head rotates, with no thread travel, tightening force or clamp motion. Detaching one plug leaves its fixed socket, other plug, whole Unit and four-wire Grove cable in place.

`led-1` and `led-2` default off, keep a fixed blue color, and accept independent external `on` or `brightness`. A `color` command cannot turn them into RGB parts. They do not respond automatically to connections, screw angle, supply, GPIO or relay state. `sensor` is only a visual anchor.

The Grove metadata follows the official cable-color table: black GND, red 5V, yellow RELAY-2, white RELAY-1. Terminal C/A/B/C labels reproduce the official schematic's physical order; they do not implement contact continuity.

## Verification scope

`smoke.json` records finite geometry, unchanged native envelope, open axial mounting bores and FrontSide bore walls, physical relay/contact/LED backing, independent fixed-blue LED control, eight interpolated screw heads, nested Grove four-wire pose, local detach and resource release. The product remains `modeled`, not `verified`. Exact supplied raster artwork is now applied; see `STICKERS.md` and `stickers-smoke.json`. Browser face-by-face review remains deferred under the user's current priority. No CSV, private vectors, cropped stickers or source photo files are distributed.
