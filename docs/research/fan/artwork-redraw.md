# Fan 标准版贴纸参考重绘

更新日期：2026-10-26。型号：Fan，SKU：U063。

这张 `reference-redraw-back.png` 是根据同型号官方照片重新绘制的普通 PNG，来源类型为 `reference-redraw`。它不是官方原稿、矢量转图或照片裁片。图中文字、色块和图标从空白画布重新排版绘制，没有将官方照片像素复制进贴图。

## 公开参考

- [同型号官方产品文档](https://docs.m5stack.com/en/unit/Unit_Fan)。
- [官方背面直视照片](https://static-cdn.m5stack.com/resource/docs/products/unit/unit_fan/unit_fan_02.webp)，2026-10-26 获取并逐张查看，原图 800 × 800 像素。
- 官方图片及产品标识的权利归各自权利人。项目代码的 MIT 许可不重新授权这些图片或标识。

## 可见内容与边界

重绘范围：DC MOTOR、N20、PORT.B.I/O，以及空白 / OUT / 5V / GND 色块。

照片第一格没有可辨文字，因此保持空白，未补写管脚名、方向或驱动参数。

字体、金属灰底色、反射外观及印刷边缘是显示用近似，没有原稿色彩或字体校样可供比对。高像素输出可以保持重绘线条清楚，不能恢复照片本来不可辨的内容，也不代表制造用贴纸精度。

## 模型接入

- 普通构造或 `stickerVariant: 'standard'` 使用此参考重绘；每个贴层标记 `artworkKind: 'reference-redraw'`、`source: 'reference-redraw'`。
- `stickerVariant: 'education-cn'` 保留既有中文教育版 PNG；`artwork: false` 关闭两类正式栅格层。
- 沿用本型号已接入的实体背面与配准范围，贴层依附该壳体。图片不补洞，不替代结构，也不改变动作、电气或控制状态。
- 输出尺寸：2048 × 1536；SHA-256：`8d0fbe6e19dfcce95b0690c61b2c89db03e6b8841fba89867e08e14d2b311d20`。

原表、私有素材映射、下载索引、绘制生成器、参考原图及中间文件不随公开仓库分发。
