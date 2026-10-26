# Unit PoE CAM-W v1.1 — U121-B-V11

Exact-product official MCP, grey-body photographs, 64×24×18mm drawing, full schematic and native CAD were checked. This is the fixed OV3660/ESP32/W5500 model, distinct from CamS3, UnitV2 and PoESP32. Axes are +X right, +Y top, +Z camera front.

## Native geometry and physical interfaces

The 23068-face source has 12 closed, directed, positive-volume components. All 4892 body/front/rear/camera/retainer faces, 5080 faces of its own assembled Stand, and 3348 faces of its own Brick are retained. The other 9748 faces are displaced/duplicate display pieces. Each native assembly receives one proper rigid transform; no scale, deleted/fill faces or another product's geometry. The few hundredths-mm native envelope difference is preserved. Native accessory pose and separately inferred installed frame are distinguished in cad-map.json.

RJ45 and four-pin Grove are at opposite ends. Both rear three-pin female service sockets have real square bores, recessed springs and stops. Original rear slots expose the real recessed RST cap/stem and yellow/green indicator lenses. The model has five mechanical ports: grove, ethernet, download-p2, download-p3 and its own mount family. There is no invented USB/card or electrical/download/network behavior. PCB/PoE/package installation is reconstructed from this product's own sources and explicitly estimated because native CAD is not populated.

## Controls, optics and supplied mounts

G37 user is the native +X side U tongue: 217 selected vertices move inward by an estimated 0.3mm and its follower follows X−depth×0.65. Independent recessed RST has estimated 0.25mm travel into the original back slot. Both support multi-source press/release/cancel and exact neutral restoration; neither executes firmware/reset. The fixed OV3660 optical anchor has no joint, framebuffer, capture, sampling or invented readings.

Blue, yellow link and green activity carriers are independent and off by default. Yellow/green have checked rays through original service slots. The blue carrier's top axis remains occluded by the opaque native shell, so no external light path is claimed. No fake aperture, pipe, transparent shell or depth-test bypass was added. Schematic SK6812 population is unresolved and no RGB is invented.

Exports: Model, GroveModule, Stand, BackBrick and spec. Defaults are mount:none and artwork:true. Optional own native Stand/Brick attach one at a time; no unsupplied cable/card is added. Stand.get('tilt') turns only its actual native leg/foot relative to the fixed clamp around its native bore-derived transverse axis. Range [-20,40] degrees is a conservative visual interval, not a rated stop, motor or ground/host-world pose solver. Brick retains all five true through bores. Use Module.get; no typed Module shortcut is assumed. Catalog configurations are id/name/options arrays with a separate configurationSchema.

## Labels and bounded checks

Two readable own-product labels are code-redrawn as ordinary PNGs: front OV3660 badge and rear information/pin diagram. No photo pixels/crop, packaging or wrong revision is used. Typefaces, logos/icons, color, registration and 35µm film thickness are appearance estimates. Native M5 relief remains CAD. Physical films do not cover original service slots and remain when artwork:false. All physical attributes/index/world poses match for both entry classes and all three mount configurations. Both PNGs use explicit static per-panel URL entries for Vite asset analysis; this runtime asset-path correction changes no geometry, API or PNG bytes. Node dispatch is checked locally; actual built asset emission is checked separately during integration.

Necessary smoke passes: all 13320 retained source faces, 15 closed-material topology checks, 27 actual cavity/contact/backing rays, user/RST cancel/restoration, independent fixed LEDs, actual native leg-only movement, wrong-family rejection and native Brick bores. Four-core Grove nesting passes transformed-parent pose, peer isolation, noecho and all 438-resource disposal. PNGs were parsed/opened; no GPU/browser, production fit or physical-device acceptance is claimed.

Official missing-populated-assembly/BOM, optical-path, SK6812-population and control/Stand datums feedback was accepted as 39e5e272835f47fd9e0c477eb58b564c. Sources and inference: sources.json; label provenance: artwork.json; bounded evidence: smoke.json. Only final PNG/derived geometry/safe summaries are distributed. New code is MIT; preserve M5_Hardware MIT for CAD derivatives.
