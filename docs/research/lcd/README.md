# Unit LCD · U120

Official product: <https://docs.m5stack.com/en/unit/lcd>. Retrieved 2026-10-26 through official M5Stack MCP and official M5_Hardware files. Exact source hashes, component selection and derivations are in `sources.json` and the model's `cad-map.json`.

This is the U120 1.14-inch, 135 × 240 ST7789V2 Unit, nominal 48 × 24 × 8 mm. Model coordinates use millimetres, +X right, +Y up and +Z toward the display, so its metadata is `[24,48,8]`. The original front/rear shells are retained at their native assembly positions. Displaced duplicates are excluded. The source front shell is slightly larger than nominal; it has not been scaled to hide that difference.

The model includes the LCD metal rear plate, backlight/diffuser volume, dark glass substrate, physical FPC and connector, a PCB with clear native screw/mounting reliefs, concealed chip/passive packages, rear magnets, open-top red Grove housing, contacts and solder tails. Intentional mounting bores and the socket mouth remain open. The screen aperture ends at the framebuffer plane and a physical LCD stack, rather than an empty shell or a picture.

`Model` and `GroveModule` expose the existing `lcd` Display component and `grove` port. `lcd` accepts RGB565, RGB888 and RGBA framebuffers with top-left pixel origin, plus external backlight/power controls. It is a non-touch display. Nested paths such as `unit/lcd` use the same API after Grove attachment. Example:

```js
model.handle({type:'display',target:'lcd',fill:'#123456',backlight:0.8});
model.display().writeRGB888(pixels, {x:0,y:0,w:135,h:240});
```

The official product supplies panel resolution/pixel pitch, screen aperture/placement, shell size, bore and Grove dimensions. PCB/layout, concealed package positioning, LCD installed Z and stack details, FPC and magnet depth are appearance reconstructions. These do not model the onboard ESP32 firmware, I2C command protocol, electrical behavior or magnetic forces. The reference-redrawn permanent label is integrated; see [sticker update](./stickers.md). Tiny internal markings remain deferred.

`smoke.json` records finite geometry/envelope, native bore emptiness, FrontSide screw-bore walls, screen/socket closure, framebuffer writes/backlight, nested Grove attachment/pose/detachment and geometry/material/texture disposal. It is a necessary local construction/API check; browser visual acceptance and real hardware verification were not performed. Stage remains `modeled`.

Official M5_Hardware shell geometry retains its MIT license. Project reconstruction code is MIT. Official reference photographs and drawings are provenance links, not bundled art. No private sticker table, vector original or conversion intermediate is included.
