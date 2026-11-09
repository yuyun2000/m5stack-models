# CoreMatrix C158

`Model` and `CoreMatrix` export the ESP32-C61HR8 controller with the white 16 × 16 matrix. The model uses millimetres, with the optical face at +Z, the A/B/C edge at +Y and the USB-C/Grove edge at −X. The native enclosure envelope is 54 × 54 × 11.6 mm.

## External integration

| Component | Model interface | Hardware reference |
| --- | --- | --- |
| `display` | Monochrome 16 × 16 framebuffer, top-left origin from the front | TM1680 on ESP GPIO0 SDA and GPIO1 SCL, I²C address `0x72`. Matrix enable is M5IOE1 IO4, `PYB_LEDS_EN` |
| `btnA`, `btnB`, `btnC` | Momentary `down`, `up` and `click` input with independent cap flexure | KEY1, KEY2 and KEY3 on M5PM1 G0, G1 and G2 |
| `power` | Momentary power-button input. Hold emits the standard `longpress` event | Stamp Timer Power2 (M5PM1) power/reset/boot key |
| `grove` | Visual Grove attachment with GND, 5V, G0 and G1 pin metadata | HY2.0-4P PORT.A |
| `usb`, `micro-sd`, `usb-port`, `battery` | Physical connector visuals | Side USB-C and microSD, rear USB expansion and battery connectors |

Write pixels with `model.display('display').writeGray8(pixels)` or use `model.handle({type: 'display', target: 'display', format: 'gray8', data: pixels})`. A whole frame is 256 intensity bytes in row-major order, from 0 for off to 255 for full white. Rectangular writes use `x`, `y`, `w` and `h`. The standard Display RGB565, RGB888 and RGBA writes remain available, with luminance rendered as white. `power` and `backlight` on a display command gate the visible output and preserve the frame buffer. The button events report input intent. The consumer supplies power-management and firmware behavior.

## Sources and scope

- The [CoreMatrix product page](https://docs.m5stack.com/en/core/CoreMatrix) provides the exact SKU, pinout, orthographic references and nominal dimensions. The [dimension drawing](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/1274/C158_CoreMatrix_model_size.pdf) provides the cover size, screw centres and connector apertures.
- The [official enclosure STL](https://github.com/m5stack/M5_Hardware/blob/ec351c516644b44defc145728cc029ced77381ff/Products/C158_CoreMatrix/Structures/CoreMatrix.stl) is the MIT source for the case, engraved legends and four native flexures. Git blob `086eb2a17045c68c29d6b0a91498cdb038bdb730`, SHA-256 `177902e9d3c1ebf61fdf71c985e278aab8d09ae9a4caeef800b3bae715400c80`. The runtime derivative indexes the original coordinates and normals. The Node check reconstructs the exact original 17,152-facet binary STL from the five runtime mesh regions at rest. The [upstream license](../../../licenses/M5_Hardware-MIT.txt) applies.
- The optical cover, 48 × 46.8 mm visual pixel area, internal support parts, connector depth, rear label carrier and 0.27 mm maximum flexure travel are estimates based on the drawing, native apertures and product photographs. The two PNGs are original redraws from the right-side and rear references. Small regulatory marks, exact label typography and undocumented internal tolerances are omitted.
- The [M5GFX TM1680 panel implementation](https://github.com/m5stack/M5GFX/blob/1b6a793a28fd298deeb9c79f0c412170713ea556/src/lgfx/v1/panel/Panel_TM1680.inl) is a reference for downstream firmware integration. The visual framebuffer takes oriented pixel data at the display boundary. Raw register addresses, bus mapping, IMU readings, storage, buzzer, power sequencing and physical fit require separate validation.

Run `node scripts/check-corematrix-controller.mjs` for the native mesh, live cap motion and hit filtering, connector apertures and all 256 framebuffer positions.
