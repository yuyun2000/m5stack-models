# U165 removable power terminal

The original [Unit 8Servos U165 product page](https://docs.m5stack.com/en/unit/8Servos%20Unit), queried through the official M5Stack MCP on 2026-10-26, explicitly includes one HT3.96-4P accessory. The [U165 presentation photograph](https://static-cdn.m5stack.com/resource/docs/products/unit/8Servos%20Unit/img-353a21be-5d6e-4323-912c-5b9df887b513.webp) shows its orange molded body, four circular screw access bores and four wire mouths. The [packaged U165 photograph](https://static-cdn.m5stack.com/resource/docs/products/unit/8Servos%20Unit/img-5b0a720e-2518-42d4-84a7-08ab14aed759.webp) independently shows the loose four-pole plug. This accessory belongs to U165; it is not the barrel connector used by U222/U223 8Servos2 variants.

`TerminalPlug` adds a bored insertion tongue, four separate spring contacts, open wire entries, metal clamp cages, pressure plates and slotted screw heads. It shares the existing visual-component pattern used by the U034 accessory, with a U165-specific mating offset. The fixed U165 socket and native shell are unchanged. At the existing terminal origin `[0, 27.54, 2.65]`, the contact row lies at local Z = −1.1 mm, giving world Z = 1.55 mm. The photo-estimated tongue clears the existing floor, ribs and roof; its four bores follow the fixed 3.96 mm pitch.

The default product retains the empty socket. Both constructors accept `terminalPlug: true`:

```js
import {Model, GroveModule, TerminalPlug} from './src/units/8servos/index.js';

const standalone = new Model({terminalPlug: true});
standalone.handle({type: 'joint', target: 'terminal/screw-1', angleDeg: 45});

// An explicit attach also works; detach can retain the accessory for reuse.
const socket = standalone.port('terminal');
const savedPlug = socket.detach({dispose: false});
socket.attach(savedPlug);

const unit = new GroveModule({cableLength: 80, terminalPlug: true});
host.port('grove').attach(unit);
host.handle({type: 'joint', target: 'grove/terminal/screw-4', angleDeg: 67});
host.handle({type: 'detach', target: 'grove/terminal'});
// The Unit and its four-wire Grove cable remain attached.

// Or install a new accessory on an empty terminal:
standalone.port('terminal').detach();
standalone.port('terminal').attach(new TerminalPlug());
```

`screw-1` through `screw-4` expose externally supplied visible head angles. They do not accept continuous RPM. Rotation does not move the clamps, shanks, socket, PCB or native shell, and it does not imply axial travel, thread pitch, tightening, wire installation, power state or PWM behavior. `HPWR / GND / GND / 5V` preserves the existing visible socket-label order; the labels are not an electrical wiring model.

Only the pitch and supplied connector family are documented. Plug width, wall thickness, insertion length, bore profiles, clamp sizes, screw dimensions and resting head angles are appearance estimates. No connector drawing, manufacturer part number, fit tolerance, tightening limit or thread pitch has been confirmed. The shared `ht3.96-4p` API identifier does not certify mechanical interchangeability across products.

`terminal-check.json` records finite local construction/API checks, including three physical ray paths per pole, visible screw-angle commands, the unchanged fixed assembly, sampled material clearance and Grove nested attach/detach. No browser review or real connector fit was performed; product stage remains `modeled`.


Printed appearance update (2026-10-26): reference-redrawn PNG labels are included; `artwork:false` disables them while preserving all original physical geometry and controls. Sources, registered surfaces and bounded evidence: [artwork.md](artwork.md), [sticker-smoke.json](sticker-smoke.json).
