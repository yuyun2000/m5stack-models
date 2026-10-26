# Unit 8Encoder U153 印刷与背贴参考重绘

更新日期：2026-10-26。来源类型：`reference-redraw`。

高清 PNG 的文字、表格和色块均从空白画布重新绘制，没有裁切或复制官方照片像素。它们是外观参考重绘，非官方印刷原稿或矢量转图。

## 公开参考

- [官方产品文档](https://docs.m5stack.com/en/unit/Unit_8Encoder)。
- [官方背面直视照片](https://static-cdn.m5stack.com/resource/docs/products/unit/8Encoder/img-3f5f0005-ea48-4ab7-9dbc-4f864e935cbc.webp)，2026-10-26 HTTP 200；SHA-256：`2bef975a29e065825ff1e319f81a2a09528639aac05366e84e3cbab74d074bdb`。
- [官方正面直视照片](https://static-cdn.m5stack.com/resource/docs/products/unit/8Encoder/img-8dd7a2f6-b40d-4782-a012-4dd6927011f2.webp)，同日 HTTP 200；SHA-256：`9bd5fb3bd67e8d264d3338b78a624e03e1fae7c3c9e4b1f2f48f8df8550aee3f`。
- [官方主图及放大引脚表](https://static-cdn.m5stack.com/resource/docs/products/unit/8Encoder/img-f745fc18-6237-4bc8-8500-6c91ce7e2d75.webp) 用于逐项核对表中文字。

已重绘固定前壳 CH1–CH8 / SW / 拨杆 0、1、背贴的 SW/SCL/SDA/RGB 映射、8ENCODER / STM32 F030C8T6、八行 A/B/K 表格、PORT. A. I2C 和底部四色栏。旋钮上的白色缺口是已有实体，不由贴图覆盖。

**引脚字样仅还原照片。** 官方照片在 ENC3 的 A/B 栏印 `PA.14 / PA.15`，ENC4 印 `PA.12 / PA.13`；官方原理图描述则为 PB14/PB15、PB12/PB13。本重绘保留照片中的 PA 字样，不把该背贴当作经过电气验证的引脚表。

## 模型配准

| 文件 | 像素 | 物理尺寸 mm | 中心 mm | 面 / 旋转 | 依附对象 |
| --- | --- | --- | --- | --- | --- |
| `reference-redraw-back.png` | 2020 × 3080 | 19.4 × 29.580198 | `[0, -31, -4.825]` | back / 0 | 8Encoder back shell |
| `reference-redraw-ch1.png` 至 `ch8.png` | 每张 720 × 240 | 每张 3.6 × 1.2 | `[6.8, -40.6 + (n-1)×13, 5]` | front / +π/2 | 8Encoder front shell |
| `reference-redraw-sw.png` | 720 × 240 | 3.6 × 1.2 | `[6.8, 59, 5]` | front / +π/2 | 8Encoder front shell |
| `reference-redraw-switch-1.png` | 240 × 180 | 1.2 × 0.9 | `[-1.45, 56.6, 5]` | front / +π/2 | 8Encoder front shell |
| `reference-redraw-switch-0.png` | 240 × 180 | 1.2 × 0.9 | `[1.45, 56.6, 5]` | front / +π/2 | 8Encoder front shell |

文件均位于 `src/units/8encoder/`。背贴保持 PNG 比例并落在 20 × 30 mm 原 CAD 凹台内。照片显示完整背贴跨过原 CAD 服务窗口，使用连续 `printedFilm`；前壳文字采用 0.12 mm 深的 `printedArtwork` 投影。没有修改壳体几何。所有印刷固定在壳上，不随八个旋钮旋转、按压或拨杆移动。独立与 Grove 共用实现，`artwork: false` 可关闭。

## 验证与精度边界

拨杆 0/1 来自同型号正视照片中可辨字样；它们仅为外观标记，不推断档位电平。字体、线宽、底色和位置为照片参考近似，无原稿字体/颜色校样。

已实看导出 PNG。独立和 Grove 各 12 层验证了来源标记、UV、固定归属与控件动作独立性。每实例背贴 37,676 个、前壳文字合计 29,689 个不透明 UV 采样全部有覆盖，抽样外向首命中未见遮字。最终纹理解码和外观需浏览器验收；这些检查不证明实物或电气行为。

官方图片和标识权利归各自权利人，代码 MIT 许可不重新授权它们。原图、原表、生成器和中间文件不公开分发。
