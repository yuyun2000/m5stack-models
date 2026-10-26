# Unit Scroll 标准版贴纸参考重绘

更新日期：2026-10-26。型号：Unit Scroll，SKU：U186。

这张 `reference-redraw-back.png` 是根据同型号官方照片重新绘制的普通 PNG，来源类型为 `reference-redraw`。它不是官方原稿、矢量转图或照片裁片。图中文字、色块和图标从空白画布重新排版绘制，没有将官方照片像素复制进贴图。

## 公开参考

- [同型号官方产品文档](https://docs.m5stack.com/en/unit/Unit_Scroll)。
- [官方背面直视照片](https://m5stack.oss-cn-shenzhen.aliyuncs.com/resource/docs/products/unit/UNIT-Scroll/7.webp)，2026-10-26 获取并逐张查看，原图 800 × 800 像素。
- 官方图片及产品标识的权利归各自权利人。项目代码的 MIT 许可不重新授权这些图片或标识。

## 可见内容与边界

重绘范围：SCROLL、ENCODER / BUTTON、STM32 / F030、PA6 / A / B / PA7 / PA5、PA0 / 3V3、RGB / LDO、PORT.A.I2C 和 SCL / SDA / 5V / GND 色块；滚轮、手指、箭头及灯泡图形。

内部细线和图标按照片可见轮廓手绘，字体、线宽和间距为显示用近似，不能用于推导芯片连接或作为原理图。没有加入被遮挡元件、隐藏引脚、地址、版本、默认行为等未在贴纸上可辨的内容。

字体、金属灰底色、反射外观及印刷边缘是显示用近似，没有原稿色彩或字体校样可供比对。高像素输出可以保持重绘线条清楚，不能恢复照片本来不可辨的内容，也不代表制造用贴纸精度。

## 模型接入

- 普通构造或 `stickerVariant: 'standard'` 使用此参考重绘；每个贴层标记 `artworkKind: 'reference-redraw'`、`source: 'reference-redraw'`。
- `stickerVariant: 'education-cn'` 保留既有中文教育版 PNG；`artwork: false` 关闭两类正式栅格层。
- 沿用本型号已接入的实体背面与配准范围，贴层依附该壳体。图片不补洞，不替代结构，也不改变动作、电气或控制状态。
- 输出尺寸：2048 × 1427；SHA-256：`f0e4c29b17507f06f8a3725f9640a4a35dedeee174271e05bc48fa42fcb4ff33`。

原表、私有素材映射、下载索引、绘制生成器、参考原图及中间文件不随公开仓库分发。

A final boundary-sampling pass reduced only the standard reference redraw to 19.7 mm width, keeping its exact raster aspect and center. This keeps the rounded paper corners inside the real recess; the education variant remains unchanged.
