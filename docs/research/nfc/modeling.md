# Unit NFC · U216

This is the current ST25R3916-AQWT Unit NFC, not the older PN532 NFC or MFRC522 RFID2. The model reproduces the product body, fixed physical circuit/antenna volumes and Grove mating frame. NFC, tag data, card emulation and I2C belong to an external runtime.

## Evidence and dimensions

The exact U216 official product page, its own photographs, current model-size drawing and own schematic were consulted. Model axes are +X right, +Y top, +Z toward the blue front label. The model uses 24 × 48 × 8 mm; the vendor writes 48 × 24 × 8 mm. The drawing specifies two nominal Ø5 mounting bores on 16 mm pitch. Their centerline is y = −12 mm. Original stepped/faceted CAD bores remain unchanged; the facet span is approximately 4.8753–5 mm.

The M5_Hardware native assembled component contains 3616 triangles. All are retained with one common Z −1.2 mm translation at scale 1. Two displaced separate shell copies are excluded. `cad-map.json` records immutable source commit/blob/SHA, retained components and exact transform. No shell panels were cut, scaled independently, capped or moved to hide a gap. Original front Grove cutout, rear fastening recess and small top pry slot remain real openings.

The fixed PCB is an extruded board with actual mounting-boss scallops, central fastening hole and Grove solder bores. The own schematic identifies U1 ST25R3916-AQWT, U3 TPAP7343D-33FS4, X1 27.12 MHz, ANT1, symmetric L1/L2 and the matching/decoupling network. Physical QFN32, 32 solder terminals, regulator, metal crystal, passives and antenna traces are modeled. C3/C10 are marked NC on the schematic and remain bare pads.

The concealed antenna is solid planar copper geometry on the PCB with an opposite-layer inner feed return. Its three turns, exact trace route, package sizes, board outline/thickness/Z and component registration are appearance inferences; the schematic confirms the antenna/network type, not this RF layout. No populated assembly STEP or production board artwork was available. The blue front RF symbol is ordinary printed artwork and has no scanning/field behavior.

The Grove opening has real recessed floor/side/rear structure and four metal contacts. A ray through the unfilled native top pry slot reaches the recessed board edge. These checks establish a physical backing at those sightlines, not manufacturing tolerances or production mating certification.

## Integration

```js
import {Model, GroveModule, spec} from './src/units/nfc/index.js';

const standalone = new Model();
const unit = new GroveModule({cableLength: 80});
host.port('grove').attach(unit);

// Physical cable and body placement only.
host.handle({type:'pose', target:'grove/unitFrame',
  position:[25,90,0], rotation:[0,0,0.2]});
host.update(1/60);

const physicalAnchor = host.get('grove/sensor');
host.port('grove').detach();
```

`grove` is a 4-pin physical connector with visual order GND, 5V, SDA, SCL. `sensor` is a passive package anchor and reports `{}`. It implements no command processing. There are no public LEDs, buttons, joints, RF fields, card/tag objects or protocol controls; none is confirmed by this product's visible light paths or hardware layout. Avoid adding an indicator merely because another NFC/RFID product has one.

Set `{artwork:false}` independently on each standalone model or module to hide only printed meshes. Every physical geometry position/normal/index buffer and world transform remains identical. Two final high-resolution PNGs come from exact supplied U216 source contours, with converter winding semantics restored. Originals, private links, source names, spreadsheet, original product photos and all generators remain private. See [artwork.md](artwork.md).

## Necessary local verification

[smoke.json](smoke.json) records native triangle count/envelope, finite meshes, ten mounting-bore rays, eight real inward FrontSide bore walls, physical PCB/antenna/package/4-contact presence, connector and top-pry-slot backing, passive-only API rejection of simulated NFC commands, source PNG registration, artwork physical invariants, four-wire/two-plug Grove attachment/pose/detachment and disposal. This is not browser pixel acceptance, hardware, electrical/RF/I2C operation, exact hidden assembly fit or exhaustive historical-model verification.
