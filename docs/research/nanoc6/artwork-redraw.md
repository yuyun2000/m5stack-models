# NanoC6 参考重绘

更新日期：2026-10-26。精确型号：NanoC6；SKU：C125。

本批 PNG 从空白画布按同型号官方照片重新绘制，来源类型统一为 `reference-redraw`，不是官方原稿、矢量转图或产品照片裁片。未将照片像素直接复制到输出。字体、图形、颜色及配准为显示用近似；高清画布保证重绘线条清楚，不恢复原图不可辨内容，也不构成制造或电气验证。

## 公开来源

- [同型号官方产品文档](https://docs.m5stack.com/en/core/NanoC6)。
- [官方照片 5](https://static-cdn.m5stack.com/resource/docs/products/core/M5NanoC6/img-1228b929-959f-4940-b4fa-b14451eed567.webp)，800 × 800。
- [官方照片 7](https://static-cdn.m5stack.com/resource/docs/products/core/M5NanoC6/img-5f49bf45-e2de-4c18-87a5-460cc78cffcf.webp)，800 × 800。
- [官方照片 9](https://static-cdn.m5stack.com/resource/docs/products/core/M5NanoC6/img-2e866aaa-29eb-42a2-a9fe-7808544e4e7d.webp)，800 × 800。

以上公开资料于 2026-10-26 获取并实看。产品标识、官方图像及商标的权利归各自权利人；项目代码的 MIT 许可不重新授权这些素材。

## 接入范围

- 背面：G / 5V / G2 / G1、M5NanoC6、ESP32-C6FH4、RISC-V、Model Name、FCC ID、可辨的无线认证编号、IR / BTN / RGB / PWR / LED GPIO 标记，以及 USB-C。
- +X 侧：CE 胶片；−X 侧：划叉垃圾桶胶片。两片均按同型号官方侧视图中可见的连续工厂胶片处理，跨已装配的壳体接缝，范围避开旁边 IR / RGB 开口。
- 旧版无来源的 Canvas 背标已移除，防止新旧文字叠加。

## 保留边界

协议小图标和认证图形仅按照片可辨轮廓重新描画，字体、笔画及反射外观近似；没有制造原稿校样，不能宣称官方印版逐像素一致。没有加入照片中未印的接口信息。

所有新增层标记 `artworkKind: 'reference-redraw'` 和 `source: 'reference-redraw'`；默认显示，`artwork: false` 关闭。它们继承所属实体，保留原有开孔、显示、接口、按键和已有动作 API，不把印刷文字当作模型电气定义。

局部构造检查覆盖 12 种主机/关闭配置；额外核对 Nesso 顶部原生 IR 开口 1,243 个采样、Core2 EXT 双孔 10 个采样。13 片新图各用 6,241 个 UV 网格点检查，实体孔对应位置允许透明，非透明图案没有采样裁失。上述是几何检查，图片解码和实际外观由浏览器复核，不等于实物或制造验收；不回写历史冻结记录。

## 栅格文件

| 文件 | 像素 | SHA-256 |
| --- | --- | --- |
| `reference-redraw-rear.png` | 1536 × 2618 | `7c1f827b1947a4f6a3a9e48a921dd7a5e15c6c749b9734e1ffc9392e2760d860` |
| `reference-redraw-ce.png` | 1200 × 923 | `894a432552847c0e1b8ab322fd3a6e4764cf045f6f9a25dc252b7be7b85e4556` |
| `reference-redraw-weee.png` | 1200 × 923 | `d1e751c181d1943c4f1b0d8141f14ff9ac00e290a1f5809d035f2184deb6635a` |

原表、私有映射、原始源文件下载索引、绘制生成器、原图与中间材料仅保存在私有目录，不随仓库分发。

2026-10-26 QA 修正：顶部黄色 G2 格按官方背面照改为黑字；侧面 WEEE 按官方侧照改为横向桶体、右上轮子与右侧黑条。CE / WEEE 纸底角 alpha 按实际 0.05 mm 胶片圆角处理，仅改底角背景，无图案裁失。
