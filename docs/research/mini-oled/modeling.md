# Unit Mini OLED U166

The exact U166 is reconstructed from its own official six-view drawing, assembled and unfolded photos, schematic and linked N042-7240TSWPG01-H16 panel datasheet. This is an explicit own-dimensioned-parametric route; no native CAD face count or another OLED assembly is claimed. Coordinates are millimetres, +X right Grove, +Y PCB top, +Z display front.

The own drawing gives 25.8 × 12 × 6.75 mm, while the product table rounds thickness to 6.8 mm. The PCB is 1 mm thick and the Grove/PCB section is 6.15 mm. The actual model measures 25.8 × 12.12 × 6.75 mm: the inferred .1 mm folded flex wraps outside the 12 mm rigid board footprint. That .12 mm flex-edge extension is reported separately rather than removing source board material or forcing the flex through it. Undimensioned board holes, hidden installation, connector internals, .16 mm flex radius and underside adhesive seating remain explicit inferences.

The assembly retains the real populated black PCB, HT7533 three-terminal regulator, eleven capacitors/four resistors, two white SMT Grove sockets and their four contacts/bent returns/SMT feet, the full glass volume/COG seal/inactive border/underside protection, and the installed folded sixteen-wire FPC. Four unmarked PCB bores and two datasheet FPC tail holes have real open axes and material walls. The PCB holes have no asserted whole-product mounting function. The folded FPC is the default assembled state; there is no invented flex joint or service preset.

## Display and attachment API

Exports are `Model`, `GroveModule`, `spec`. Body component order is `grove`, `grove-right`, `lcd`; the Grove wrapper appends `unitFrame`, `cable`. `grove` is the canonical cable input at the left X end; `grove-right` is the second actual receiving socket. Both mechanically accept a real four-core cable assembly. Port pin names are documentary; there is no bus or electrical routing.

`lcd` is a standard Display-derived external framebuffer: 72 × 40 pixels across the own 9.196 × 5.18 mm active area. Default pixels are opaque black and no sample image is permanently printed over the display. Raw caller RGB/RGBA data stays in the same buffer used by the live DataTexture. The local white OLED shader maps luminance at threshold 0.5 to white hardware appearance. This is a visual shader adaptation, not an SSD1315 controller or I2C emulator.

Use the existing `display` command with `rgba`/`rgba8888`, `rgb888`/`rgb`, `rgb565` (including `swapBytes`), rect writes, `fill`, `power`, `backlight`, `pixelEffect`. Direct framebuffer writes and canvas `getContext2D()`/`present()` retain their existing contracts. Style is fixed to `oled`; touch is absent. `setStyle(non-oled)`, `setTouchEnabled(non-false)`, direct `touch()` and unsupported command style/touch values actually reject. Invalid command style/touch is rejected before its pixel payload can modify the buffer. Pointer hooks produce no input. External output commands preserve all physical and output-plane attributes/index/world matrices and both connector frames; they emit no input echo.

Only one named preset exists: `assembled` with `{}` options. `defaults` and `configurationSchema` are empty. There are no buttons, LED outputs, sensors, passive anchors, joints or accessory/service variants.

## PCB artwork

Two ordinary transparent 2580 × 1200 PNGs accurately code-redraw the clearly readable exact-U166 PCB markings from official bare-board photos: `2323`/`V1.0` on the populated side, `Mini OLED`/`M5Stack.com`/pin boxes on the rear. Typeface, strokes and fine registration are inferred; illegible microtext is omitted. Ink is projected onto the actual fixed PCB triangles with its real holes preserved. No adhesive film, photographic crop, original vector or permanent screen graphic is invented. The installed glass may conceal front silkscreen. `artwork:false` removes only ink and preserves every physical/output-plane attribute,index,world matrix in both entries.

## Bounded verification

The local smoke passed 192 closed FrontSide material meshes with coordinate-welded directed count-two edges and positive volumes; 20 empty PCB bore axes/16 bore-wall rays, two FPC axes/eight wall rays, all eight socket contacts/six cavity-wall rays, genuine recessed backings, glass seats and folded flex fit. It exercised actual RGBA/RGB888/RGB565/swap/partial fill/canvas-present data, same texture buffer, default blank output, fixed white shader, ten unsupported-control rejections, output noecho, host/peer buffer preservation and physical/port invariance. Both real ports, nested target addressing, transformed four-core cable attachment, peer isolation, detach/reattach and disposal passed; 949 geometry/material/texture resources were disposed and five framebuffer textures each disposed exactly once.

No browser/GPU/device/production placement/manufacturing-fit acceptance is claimed. See `sources.json`, `artwork.json`, `smoke.json`. New code is MIT; existing core/upstream notices remain applicable.
