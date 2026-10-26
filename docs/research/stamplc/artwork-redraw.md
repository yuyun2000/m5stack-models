# StamPLC 参考重绘

更新日期：2026-10-26。精确型号：StamPLC；SKU：K141。

本批 PNG 从空白画布按同型号官方照片重新绘制，来源类型统一为 `reference-redraw`，不是官方原稿、矢量转图或产品照片裁片。未将照片像素直接复制到输出。字体、图形、颜色及配准为显示用近似；高清画布保证重绘线条清楚，不恢复原图不可辨内容，也不构成制造或电气验证。

## 公开来源

- [同型号官方产品文档](https://docs.m5stack.com/en/core/StamPLC)。
- [官方照片 2](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/1129/K141_02.webp)，1200 × 1200。
- [官方照片 9](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/1129/K141_09.webp)，800 × 800。
- [官方照片 10](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/1129/K141_10.webp)，800 × 800。
- [官方照片 11](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/1129/K141_11.webp)，800 × 800。
- [官方照片 12](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/1129/K141_12.webp)，800 × 800。

以上公开资料于 2026-10-26 获取并实看。产品标识、官方图像及商标的权利归各自权利人；项目代码的 MIT 许可不重新授权这些素材。

## 接入范围

- 正面主标：STAMPLC、STAMP S3A、PORT.A / PORT.C 和可辨的引脚色格；两排功能项 INPUT x8、RELAY x4、PWR-CAN、PWR-485、TF-Card、Grove x2、GPIO.EXT、KEY x3、1.14″LCD、BUZZER(G44)、RTC、LM75 及照片可读额定字样。
- 正面上方：IN 1–8；正面下方：四组 N.O / COM / N.C、RELAY 1–4。
- 正面左侧：PRESS:RST、HOLD:BOOT、LED、NOTE 和可见图形。
- 标签投影在既有外壳实体面，保持各自 PNG 比例，适度缩小以完整容纳印刷；不向端子孔、按键或显示窗造膜。

## 保留边界

仍为 partial：Stamp-S3A 本体的密集电路原稿、侧面 GPIO.EXT/TF/芯片图以及 PWR485/PWRCAN 电路图未重绘。两端端子侧标已有可读照片，但尚未接入：所有当前实体的 ±Y 射线显示，照片高度 Z≈13.8 mm 只有开放 wire-entry frame，Z≈14.5–15 mm 只有 1.7 mm 高的端子塑料 rim；主壳外沿在 Z≈9–10 mm。照片里的白色标签承载壳条没有对应的当前支持面。将 3.8/3.6 mm 高的侧标贴到塑料体会覆盖线口，因此保留缺项，不增加悬空膜或修改结构。

所有新增层标记 `artworkKind: 'reference-redraw'` 和 `source: 'reference-redraw'`；默认显示，`artwork: false` 关闭。它们继承所属实体，保留原有开孔、显示、接口、按键和已有动作 API，不把印刷文字当作模型电气定义。

局部构造检查覆盖 12 种主机/关闭配置；额外核对 Nesso 顶部原生 IR 开口 1,243 个采样、Core2 EXT 双孔 10 个采样。13 片新图各用 6,241 个 UV 网格点检查，实体孔对应位置允许透明，非透明图案没有采样裁失。上述是几何检查，图片解码和实际外观由浏览器复核，不等于实物或制造验收；不回写历史冻结记录。

## 栅格文件

| 文件 | 像素 | SHA-256 |
| --- | --- | --- |
| `reference-redraw-front-main.png` | 3072 × 687 | `b7d449329954fe2cbaa183b6dbe82e417320935737a283cc96ef1830b65f2ee5` |
| `reference-redraw-front-inputs.png` | 3072 × 261 | `cd3f434c529a9a262d2ff0cdc435d448b7cf0d6d60841b94d868d2f610deba88` |
| `reference-redraw-front-relays.png` | 3072 × 205 | `059aa92d37cfa7fcab365ff233966cd29e4b84789d2bad3746b5f1aff935ddb7` |
| `reference-redraw-front-note.png` | 1536 × 5325 | `a24dba1b2acb11288dd79751916cc0023ce5a650345ac52459b32bd4b11b6fdd` |

原表、私有映射、原始源文件下载索引、绘制生成器、原图与中间材料仅保存在私有目录，不随仓库分发。
