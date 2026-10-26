# CardKB v1.1 U035-B PCB 主字符参考重绘

更新日期：2026-10-26。来源类型：`reference-redraw`；这是部分完成的裸 PCB 印字重绘。

透明高清 PNG 上的字母、数字、符号和方向图形从空白画布手工绘制。它不是官方 PCB 丝印文件、印刷原稿或照片裁切，没有复制照片像素。

## 公开参考

- [同型号官方产品文档](https://docs.m5stack.com/en/unit/Unit_CardKB_v1.1)。
- [正面直视照片 cardkb_1.1_02.webp](https://static-cdn.m5stack.com/resource/docs/products/unit/cardkb_1.1/cardkb_1.1_02.webp)，2026-10-26 HTTP 200；SHA-256：`ede3bf0d0939d9c13b12aed9f4b766eb5eeceac8532a35bd75eefef749a03e9d`。
- [背面照片 cardkb_1.1_03.webp](https://static-cdn.m5stack.com/resource/docs/products/unit/cardkb_1.1/cardkb_1.1_03.webp) 用于区分裸板图案和独立外壳贴纸。
- [v1.1 官方文档引用的组合键表](https://static-cdn.m5stack.com/resource/docs/products/unit/cardkb/cardkb_02.webp)，2026-10-26 HTTP 200；SHA-256：`dd27e55abe84667ff71534b50c138f4f4ba6abe3a8cce0b80243a8fc84b1755b`。副符号另与其文档链接的[官方 CardKeyBoard 固件 KeyMap](https://github.com/m5stack/M5-ProductExampleCodes/blob/master/Unit/CARDKB/firmware_328p/CardKeyBoard/CardKeyBoard.ino) 逐项核对。

接入内容：数字 0–9、A–Z、Esc / Tab / fn / Sym / SPACE、退格/Shift/回车和四方向图形、逗号/句号、数字行 ! @ # $ % ^ & * ( )，以及 www.M5Stack.com 页脚。字符印在固定 PCB 上，不在会按动的小金属按头上。

第二行副符号依序为 Q→`{`、W→`}`、E→`[`、R→`]`、T→`/`、Y→`\`、U→`|`、I→`~`、O→单引号、P→双引号；第三行为 A→`;`、S→`:`、D→反引号、F→`+`、G→`-`、H→`_`、J→`=`、K→`?`，L 无副字符。底部逗号、句号分别对应 `<`、`>`。这 20 项均由同型号照片和官方组合键表确认，不从常见键盘布局猜测。

## 模型配准

| 文件 | 像素 | 物理尺寸 mm | 中心 mm | 面 / 旋转 | 依附对象 |
| --- | --- | --- | --- | --- | --- |
| `src/units/cardkb/reference-redraw-front-legends.png` | 4200 × 2700 | 84 × 54 | `[0, 0, -2.15]` | front / 0 | CardKB front solder mask |

使用深度 0.12 mm 的 `printedArtwork`，只投影到既有 PCB 表面，保留安装孔和六个 ISP 真孔。位置与既有键位一致，主字符置于对应开关上方；方向图形在小按头旁。没有改变 PCB、开关或 Grove 几何。独立与 Grove 共用实现，`artwork: false` 可关闭。

## 部分完成与验证边界

尚未重绘极小元件丝印以及背面的 M5Stack 黑白图案。没有猜测难读文字，也没有用近似品牌图形冒充原稿。字体、字距及方向符号的精确印刷位置为照片参考近似，不能作 PCB 制造文件。

已实看 PNG；独立和 Grove 各 2,652 个不透明 UV 采样全部落在固定 PCB 面上，抽样首命中未见开关遮挡，ISP 孔附近的方向图形已移开孔区。已验证关闭选项及按键动作不会带动字符层。浏览器纹理解码和最终外观仍需单独验收，几何检查不代表实物验证。

官方图片和标识权利归各自权利人，代码 MIT 许可不重新授权它们。参考原图、原表、生成器和中间素材不公开分发。
