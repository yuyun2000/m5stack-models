# GPS v1.1 · U032-V11

本模型采用该型号官方 STL 中完整装配的壳体，保留两侧卡扣、前后标签凹台、后盖 M5 浮雕、贯穿安装孔和 Grove 开口。另有实体 PCB、安装螺钉、蓝色开顶 HY2.0-4P 连接器及内置陶瓷天线／接收器的隐藏外形。壳体闭合不依赖贴纸或遮挡平面。

- 单位为 mm，坐标 +X 右、+Y 上、+Z 正面。官方 48×24×8 规格归一化为 X×Y×Z = 24×48×8。
- 两个安装孔中心为 `[-8,-12]` 和 `[8,-12]`，孔径 5；孔距 16、距底边 12，均来自官方尺寸图。
- Grove 外口为 10×5.2，位于底部；模型端口原点 `[0,-23.65,1.4]`。开顶结构、蓝色塑料及短锁桥参考该版本官方照片；内部壁厚与插入深度属于视觉估计。
- Port 的 1–4 为库内按线色排列的元数据：黑 GND、红 5V、黄 UART_RX、白 UART_TX。它不替代原理图连接器引脚编号，也不实现通信。
- 隐藏 PCB 的厚度、天线／接收器外形和高度为保守视觉估计。公开照片未提供内部装配标定，模型不宣称这些尺寸为生产数据。

2026-10-26 已完成有限本地检查：几何为有限数值、外形 24×48×8、两安装孔贯穿、前后标签凹台由原壳体承载、连接器上槽保持开放，GroveModule 可构造并改变电缆姿态。报告见 `smoke.json`。本轮按用户要求推进实体，未进行浏览器逐面复核；状态为 `modeled`。已补参考重绘 PNG 标签，见 `artwork.md` 和 `sticker-smoke.json`；不使用官方照片裁片替代贴图。

资料来自 M5Stack 官方 MCP、产品页、尺寸图及 M5_Hardware。原始 STL、原图和 MCP 完整响应保存在本地非公开工作材料中；本目录仅保留公开来源链接、指纹和尺寸判断。衍生壳体几何保留官方 M5_Hardware MIT 许可，见 `licenses/M5_Hardware-MIT.txt`。

官方 MCP 已指出产品页所链接原理图仍标记旧版 UNIT-GPS V1.0 / GP-02，与 v1.1 正文的 ATGM336H-6N / AT6668 不一致。因此本模型只将产品页芯片名称作为外观资料记录，不从旧原理图推断 v1.1 隐藏电路。


Printed appearance update (2026-10-26): reference-redrawn PNG labels are included; `artwork:false` disables them while preserving all original physical geometry and controls. Sources, registered surfaces and bounded evidence: [artwork.md](artwork.md), [sticker-smoke.json](sticker-smoke.json).
