# Unit ToF4M U172

The official M5Stack product record identifies the U172 sensor as **VL53L1CXV0FY/1**. The model preserves complete component 0 from the exact-SKU official STL. It adds a physical PCB, the 4.9 × 2.5 × 1.56 mm ST optical package, two solid filter panes with receiver lens and passive VCSEL underneath, concealed support components, screw and the red open HY2.0-4P socket with four contacts.

Coordinates are millimetres, +X right, +Y top and +Z toward the optical face. Nominal envelope is 24 × 32 × 8 mm. The two mounting bores remain empty. Concealed board position and contour, installed package height, detailed optical wells, passive component placement and socket interiors are visual inferences. The source shell is neither cut nor rescaled.

`Model` is the standalone appearance. `GroveModule` attaches through the shared Grove interface and renders the two plugs and four separate wires. `sensor` is only a visual anchor; it accepts no distance, scan, laser, I2C or sensor-value commands. The package has no visible LED and exposes no LED component. Its 940 nm emitter is invisible, so the model adds no beam, visible emission or automatic animation. A downstream framework owns sensor behavior.

The necessary construction smoke is in `smoke.json`: finite geometry and envelope; ten axial mounting-bore rays; FrontSide PCB screw-bore and optical-well wall hits; actual filter/lens/emitter and PCB behind the optical opening; Grove direction/pins; nested anchor access; four-wire connection pose, detach and resource disposal. This is not browser visual acceptance, physical fit or electronic verification. Stage remains `modeled`.

Sources and runtime file hashes are in `sources.json` and `cad-map.json`. Official CAD retains upstream MIT terms. Reference photos and manufacturer PDF remain outside this repository. Reference-redrawn artwork is integrated ([sticker update](./stickers.md)); no supplied private table, vector, intermediate or sticker crop is distributed.
