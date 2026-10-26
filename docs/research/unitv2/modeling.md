# UnitV2 — U078-D

Built from this product's own official enclosure STL,dimension drawings,GC2145/PCB pictures and assembled accessory photographs. This is the fixed-camera UnitV2,not the external-camera UnitV2-USB,M12 or original UnitV. Model axes are +X right,+Y top,+Z camera front;the native body is24×48×18.5mm.

## Native structure and real openings

The official file has11044triangles in four components. Same-position components1/2 contain3068/2454triangles;all5522faces are preserved after the single translation[0,-4,-0.05],with no scale or local CAD patch. Two displaced display duplicates are excluded. Both native solids have count-two,direction-balanced coordinate-welded edges and positive volume. The frontØ9.5camera hole,MIC slots,top/rear cooling slots,sideTFslot,bottom USB/Grove openings and paired mount slots remain actual material openings.

Own-photo PCB includes both edge reliefs,a real retaining bore and four reserved plated pads. Actual lens barrel/glass,amber camera flexible board and ribbon,metal microphone can,metal microSD cage/8springs,USB shield/tongue/contacts and open4-pin Grove have independent physical geometry. Whole-assembly rays reach real contacts and deep stops. Board height and concealed packages/fan/heat-spreader installation are appearance estimates because the public CAD has only the enclosure.

## External controls and physical accessories

- `user`: the native U-cut tongue is on the +Y top end. A0.3mm estimated press deforms only110selected native vertices along−Y and the retained plunger follows−Y. Multi-source press/release/cancel restores exact native positions,normals and follower rest;PCB,ports,slots and fixed shell remain stationary.
- `red`,`white`: separate actual fixed-color on-board LED carriers,off by default. The opaque blue enclosure remains opaque. Axial front/top/rear rays are blocked by native shell;exact external optical path is undocumented. No artificial aperture,light pipe,transparent whole shell or depth-test bypass is added.
- `fan`: continuous VisualJoint around localZ,stopped by default. External angle/RPM turns only hub/impeller blades. Frame,motor supports,shell and heat spreader remain fixed. A real back vent exposes the rotor;no automatic cooling,temperature or motor model. Seven-blade geometry is an explicit appearance estimate.
- `camera` and `microphone`: passive optical/acoustic anchors,without framebuffer,capture,sampling or invented values.

The four real ports are `grove`,`usb`,`sd`,`mount`. Exports are `Model`,`GroveModule`,`MicroSdCard`,`UsbCable`,`Stand`,`BackBrick`,`spec`. Use Module.get(id) for attached modules. `card:true` installs the included nominal32GB card by default;its8contacts and15×11×1mm body stay physical. `usbCable:false` defaults to no hanging cable;the optional white USB-C–USB-A cable has actual independent metal/dielectric ends,4USB-A contact strips,and a modeled500mm jacket centerline. Package50cm nominal length and inferred end allowance/coiled pose are distinguished.

`mount:'none'|'stand'|'brick'` installs one exact-product four-clip mount. Native paired slots centre near y16/−4 and the mounting frame at y6. The16.43mm drawing value is inner clip clearance,not slot-centre pitch. Stand plate/leg/foot are dimension/photo-derived;its retained transverse bolt defines one relative X-axis `tilt` joint. Only actual leg/foot geometry turns,with conservative[-20,40]degree appearance range. It does not lock to ground,solve host world pose,model friction or claim a production hard stop. The Brick has five truly openØ4.85mm bores on an8mm cross grid;frame and tube wall rays are checked. Neither accessory is borrowed HAT geometry.

## Label and limits

One readable own-model rear information label is code-redrawn as a1608×2104ordinary PNG with numeric2032DPI metadata only. The real closed35µm die-cut film has a notch that clears the native fan vents. Front V/M5 is native relief,not invented print. Typeface/icon outlines,color,registration and film thickness remain appearance estimates. No photographic crop,packaging artwork or guessed unreadable microtext is used. Official photo01 illustrates16GB while package text says32GB,so the included nominal32GB card is unbranded rather than assigned that mismatched print.

`artwork:false` hides ink only:all physical attributes,index arrays and matrixWorld values match across both entries and all24actual card/cable/mount configurations. Physical film,boards,contacts,card and accessories remain.

Necessary bounded smoke passes:complete5522native faces/native envelope;25constructed/native closed-material topology checks;24whole-assembly backing/contact rays;native top button/fan/stand fixed-vs-moving roundtrips;independent fixed-color LEDs;all attachment classes and wrong-family rejection;24artwork invariants;4-core Grove through transformed parent,peer isolation,noecho and full resource disposal. A local CPU depth render and rear PNG were inspected;this is not GPU/browser or physical/production-fit acceptance.

The linked system diagram says SSD202/256MB NAND while text says SSD202D/512MB;it lacks detailed schematic/BOM and installation data. These conflicts,card illustration mismatch and assembly/button/LED/fan/stand data gaps were submitted as official feedback `c6b5a679e19d49edbe673381dd9ca122` (accepted for human review). All reported hardware facts remain visual metadata. No Linux,AI results,video,network,USB enumeration,UART,filesystem,electrical,power or firmware behavior.

Sources and explicit inference: [sources.json](./sources.json). Label provenance: [artwork.json](./artwork.json). Necessary checks: [smoke.json](./smoke.json). New code isMIT;official CAD derivative preserves M5_HardwareMIT. Original source files and generation intermediates are excluded from the distributable tree.
