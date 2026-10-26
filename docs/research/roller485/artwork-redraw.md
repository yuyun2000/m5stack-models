# Unit Roller485 U182 固定面贴纸参考重绘

更新日期：2026-10-26。来源类型：`reference-redraw`；完成范围为固定 OLED 面两片标签。

两张高清 PNG 从空白画布手工绘制文字与色块，非官方原稿，非照片裁片，也非矢量源文件转换。

## 公开参考

- [官方产品文档](https://docs.m5stack.com/en/unit/Unit_Roller485)。
- [固定 OLED 面直视照片 15.webp](https://m5stack.oss-cn-shenzhen.aliyuncs.com/resource/docs/products/unit/Unit-Roller485/15.webp)，2026-10-26 HTTP 200；SHA-256：`7a184eebcd1721a7f3f43f54ae7fc269c46bf1ccc4c996a86e6f30aff2fd0f74`。
- [相同面的斜视照片 7.webp](https://m5stack.oss-cn-shenzhen.aliyuncs.com/resource/docs/products/unit/Unit-Roller485/7.webp) 用于核对贴纸位于固定外壳。

PORT.A 标签包含 SCL / SDA / 5V / GND 四色栏和红色竖栏；PWR485 标签包含 G / 6~16V / A / B 与底部 PWR485。M5 和 A 键标识是原 CAD 模塑字，继续保留实体。旋转盘没有增添照片中不存在的标签。

## 模型配准

| 文件 | 像素 | 物理尺寸 mm | 中心 mm | 面 / 旋转 | 类型 |
| --- | --- | --- | --- | --- | --- |
| `reference-redraw-port-a.png` | 1440 × 1840 | 7.2 × 9.2 | `[0, -19.8, 15.9]` | bottom / +π/2 | printedArtwork，深 0.12 mm |
| `reference-redraw-pwr485.png` | 3200 × 1840 | 16 × 9.2 | `[14.85, -19.825, 0]` | bottom / +π/2 | 连续 printedFilm |

文件均位于 `src/units/roller485/`；两层均依附 `Roller485 native fixed OLED face shell`。该面图片右向对应世界 +Z，图片上向对应 −X。配准保持 PNG 原比例，分别位于原 CAD 的 7.795 × 10 mm 和 16.5 × 9.795 mm 凹台内。

照片中的连续 PWR485 膜盖住凹台内两处服务孔，故以真实连续膜表示；PORT.A 标签投影到完整凹面。没有改动外壳或旋转结构，也不以贴图遮住 Grove 接口、OLED 或 A 键槽。独立与 Grove 模式共用实现，`artwork: false` 可关闭。

## 部分完成与验证边界

侧边 debug/ISP 附近小贴条仍未重绘：已复查官方 4.webp、6.webp、7.webp 及三张尺寸图，侧贴文字始终过度透视或分辨率不足，尺寸图也不含印字，无法逐字确认。没有用调试接口的功能引脚反推照片中的印刷缩写；这是部分完成状态。字体、色彩、边框和物理尺寸是照片及原 CAD 凹台配准近似，无原稿或制造公差。

导出 PNG 已实看。独立和 Grove 每实例两层合计 78,240 个不透明 UV 采样均覆盖；背膜抽样未被外壳遮挡。验证了依附关系、关闭选项及转子旋转/A 键动作不带动标签。最终浏览器纹理解码与外观验收独立进行；这些检查不代表硬件、电气或量产尺寸验证。

官方图片和产品标识权利归各自权利人，代码 MIT 许可不重新授权它们。原图、原表、生成器和中间文件不随公开仓库分发。
