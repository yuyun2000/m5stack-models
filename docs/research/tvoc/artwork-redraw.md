# Mini TVOC/eCO2 (U088) 照片参考重绘

此贴图于 2026-10-26 按 M5Stack 官方公开产品照片重新排版绘制，**是参考重绘，非官方贴纸原稿**。公开文件不包含原照片、照片裁切、私有素材或矢量中间文件。

- 背面参考：[官方背视图](https://static-cdn.m5stack.com/resource/docs/products/unit/tvoc/tvoc_02.webp)。内容为红底 PORT. A . I2C 与 SCL / SDA / 5V / GND 四色条；该型号背面没有另加产品名称块。
- 正面参考：[官方正视斜图](https://static-cdn.m5stack.com/resource/docs/products/unit/tvoc/tvoc_06.webp)。内容为蓝底白字 TVOC/eCO2 与浅灰底深字 SGP30；以此替换此前未配准的单行文字面片。
- 背图：`src/units/tvoc/reference-redraw-back.png`，1600 × 400 RGBA；16 × 4 mm，模型坐标 `[0, 7, -3.8]`。
- 前图：`src/units/tvoc/reference-redraw-front.png`，1780 × 270 RGBA；17.8 × 2.7 mm，模型坐标 `[0, 5.55, 3.8]`。
- 配准目标均为真实 CAD `housing` 的印刷凹面，使用 `printedArtwork`、深度 0.12 mm、来源类型 `reference-redraw`，保留通风槽、安装孔与原生外形。
- 几何与公开组件 API 不变；`artwork: false` 可关闭两面贴图。

颜色、字形和笔画按可读照片近似重绘；未声称原始字体、原始色值或生产用模切尺寸。外壳下部 M5 模塑字不属于贴图，未重复绘制。PNG 的高清尺寸不提高原照片本身的取证精度。表面投影与浏览器纹理解码/视觉验收分别验证。

局部验证已通过：`Model` 与 `GroveModule` 均生成完整印刷表面；`artwork: false` 无贴图层，公开组件 IDs/kinds 不变；投影 UV 覆盖 0–1。将各 UV 三角形栅格化到最终 PNG 后，alpha > 250 的像素均有实体投影支持（覆盖 100%）。此检查不代替浏览器纹理解码和视觉验收。

## 最终 PNG SHA-256

仅无损剥离 PNG 的 `tEXt Description` 元数据；全部 IDAT 数据块及其他保留块逐字节不变。剥离前后解码 RGBA 逐字节一致，未重新排版或渲染。

- `reference-redraw-back.png`：`dd13f0cef61321e8d46f8e55bc49a9dd6f85a0c1eaa3533943ff948e35ce1d76`。
- `reference-redraw-front.png`：`e4883e681081afcaa7f2ba67224064d4ef0df5772d7624ad3d03e0208387174e`。
