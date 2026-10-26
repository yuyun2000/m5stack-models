# Unit CAN U085

Official product dimensions are 56 × 24 × 10.2 mm. The model uses millimetres, +X right, +Y towards the orange terminal and +Z towards the component/front face. The official `Unit_CAN.stl` shell pair is retained with one rigid translation; the separated duplicate pair is excluded. `cad-map.json` records the immutable Git blob and translation. CAD remains under M5_Hardware MIT attribution.

The assembly includes a physical PCB with edge reliefs around both LEGO bosses, the screw bore, Grove notch, CA-IS3050G and isolated DC-DC package envelopes, protection packages, open-top Grove socket with contacts, fixed four-pole terminal socket with real latch slots and contacts, and white indicator/light guide. The terminal aperture is backed by the connector, and the original LED slot is backed by a recessed physical lens. Mounting holes remain open.

The original shell measures approximately 24 × 56 × 8 mm. The fixed orange socket reaches 10.2 mm assembly depth; the rear screw adds approximately 0.045 mm to the measured runtime envelope. Optional installed screw plug dimensions exceed the default product envelope.

## External visual API

```js
import {Model, GroveModule, TerminalPlug} from './src/units/can/index.js';

const standalone = new Model({terminalPlug: true});
standalone.handle({type: 'joint', target: 'terminal/screw-1', angleDeg: 45});
standalone.handle({type: 'led', target: 'power-led', on: true, brightness: 0.5});

// Or attach manually to the default empty fixed socket:
const unpopulated = new Model();
unpopulated.port('terminal').attach(new TerminalPlug());
unpopulated.port('terminal').detach();

// To render the host connection, attach this Module to a Grove Port:
host.port('grove').attach(new GroveModule({cableLength: 75, terminalPlug: true}));
host.handle({type: 'joint', target: 'grove/terminal/screw-4', angleDeg: -30});
host.handle({type: 'pose', target: 'grove/unitFrame', position: [5, 80, -3], rotation: [0, 0.2, 0]});
host.get('grove/terminal').detach(); // Keeps the Unit and its four-wire Grove cable.
```

`terminal/screw-1..4` rotate the actual visible screw heads; no axial travel, tightening or clamping is simulated. `power-led` accepts explicit external on/brightness and remains fixed white. Its default state is off; attaching a host or terminal does not turn it on. External commands emit no user input. `sensor` is only a visual anchor and provides no value simulation.

The `terminal` +Y mating frame points out of the terminal end. Its physical left-to-right positions are H, L, NC, SHIELD (the photograph prints G). The Port's `n` indexes these four visual positions; it does **not** reuse schematic JP1 numbers, which are 4, 3, 2, 1 respectively. Grove wire names are GND, 5V, CAN_TX, CAN_RX. These labels document physical appearance and connection frames; the library does not model CAN frames, register state, transceiver behavior, isolation, termination or supply behavior. The separately supplied 120R resistor is not installed or simulated.

## Evidence and limits

`smoke.json` covers finite geometry, retained native envelope, open axial mounting bores and FrontSide bore walls, physical backing of connector/LED openings, fixed-color external LED commands, four interpolated screw rotations, optional plug attachment/removal and four-wire cable pose/resource release. It is a construction/API check, not browser visual acceptance or physical fit verification. Product stage remains `modeled`.

PCB/hidden package placement, terminal body/contact details, plug/clamp geometry, screw recesses, Grove internals and indicator light-guide depth are appearance estimates from the exact U085 photographs and original shell apertures. No production PCB/terminal assembly STEP or fit tolerances were available. Photographic sources and raw MCP responses stay outside the public repository. Artwork, private tables/vectors, sticker crops and exhaustive visual review remain deferred.
