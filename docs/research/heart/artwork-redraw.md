# Heart (U029) 照片参考重绘

此贴图于 2026-10-26 按 M5Stack 官方公开产品照片重新排版绘制，**是参考重绘，非官方贴纸原稿**。公开文件不包含原照片、照片裁切、私有素材或矢量中间文件。

- 参考照片：[官方背视图](https://static-cdn.m5stack.com/resource/docs/products/unit/heart/heart_02.webp)。
- 已重绘：两行 Heart / Rate、PORT. A . I2C、MAX30100 与 SCL / SDA / 5V / GND 四色端口条。
- 输出：`src/units/heart/reference-redraw-back.png`，1600 × 1200 RGBA PNG。
- 配准：16 × 12 mm，模型坐标 `[0, 7, -3.8]`，背面，目标真实 CAD 零件 `housing`；采用 `printedArtwork` 投影到已有凹面，深度 0.12 mm，来源类型 `reference-redraw`。未把旧的名义 Z=-4 作为贴纸表面。
- 几何与公开组件 API 不变；`artwork: false` 可关闭。

颜色、字形和笔画按可读照片近似重绘；未声称原始字体、原始色值或生产用模切尺寸。照片中外壳下部的 M5 为模塑结构，未绘入此贴图。未补画照片中不可确认的微小 PCB 丝印。PNG 的高清尺寸不提高原照片本身的取证精度。表面投影与浏览器纹理解码/视觉验收分别验证。

局部验证已通过：`Model` 与 `GroveModule` 均生成完整印刷表面；`artwork: false` 无贴图层，公开组件 IDs/kinds 不变；投影 UV 覆盖 0–1。将各 UV 三角形栅格化到最终 PNG 后，alpha > 250 的像素均有实体投影支持（覆盖 100%）。此检查不代替浏览器纹理解码和视觉验收。

## 最终 PNG SHA-256

仅无损剥离 PNG 的 `tEXt Description` 元数据；全部 IDAT 数据块及其他保留块逐字节不变。剥离前后解码 RGBA 逐字节一致，未重新排版或渲染。

- `reference-redraw-back.png`：`21f72c5254beda58796eb24c665e80d8baacd244d178f8ce621561c247fa04a5`。
