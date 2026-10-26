# Unit Key U144 背贴参考重绘

更新日期：2026-10-26。来源类型：`reference-redraw`。

这是一张按同型号官方照片手工排版的高清 PNG，非官方印刷原稿，非照片裁切，也非矢量源文件转换。文字、色块、键帽和 LED 图标均从空白画布重新绘制；没有复制照片像素。

## 公开参考

- [官方产品文档](https://docs.m5stack.com/en/unit/key)。
- [官方背面直视照片 key_06.webp](https://static-cdn.m5stack.com/resource/docs/products/unit/key/key_06.webp)。2026-10-26 核验 HTTP 200；SHA-256：`291e21ee453f767055f6c9eabeb8974ce8611566ee8a1065aa282279ef0e4e3f`。
- [正面照片 key_05.webp](https://static-cdn.m5stack.com/resource/docs/products/unit/key/key_05.webp) 用于确认红色键帽没有额外印字。

重绘包含 Key 键帽示意图、LED 图标、SK6812、PORT. B . I/O，以及 IN / OUT / 5V / GND 四色栏。底壳 M5 是原 CAD 模塑字，保留实体，不重复印成贴图。

## 模型配准

| 文件 | 像素 | 物理尺寸 mm | 中心 mm | 面 / 旋转 | 依附对象 |
| --- | --- | --- | --- | --- | --- |
| `src/units/key/reference-redraw-back.png` | 1890 × 1940 | 17.7 × 18.168254 | `[0, 7.275, -3.825]` | back / 0 | Key back shell |

宽高保持 PNG 比例，边界位于原 CAD 的 18 × 18.45 mm 背面凹台内。官方照片显示它是跨越后壳小开孔的连续背贴，因此使用 `printedFilm`，没有为了贴字而修改外壳。背贴固定在后壳，按键帽动作不带动它；独立和 Grove 模式共用配准。`artwork: false` 可关闭。

## 精度与验证边界

字体、平面化键帽图标、灰色底和印刷边缘为照片参考近似；没有官方字体、专色、刀模或制造公差。标记是 `reference-redraw`，不能作为正式原稿使用。

已查看导出 PNG，并在独立与 Grove 实例验证来源标记、依附关系、可关闭性及固定层不随按键移动。每实例 56,044 个不透明 UV 采样均覆盖连续背膜；稀疏外向射线未见壳体遮字。图片解码和最终材质效果仍需浏览器验收，几何检查不替代实物验证。

官方图片和产品标识权利归各自权利人；代码 MIT 许可不重新授权这些标识。参考原图、原表、生成器和中间素材不随公开仓库分发。
