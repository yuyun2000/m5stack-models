# 可动 Unit 扩展

2026-10-26：用户要求停止耗时复核并继续新增 Unit。上一批 GPS v1.1、Weight-I2C、8Servos 已接入；本批新增 Fader U123、8Angle U154、Mini Scales U177。

- Fader：按官方35 mm行程、中位定位，实现实体帽和轴沿轨道移动；14灯分别接受外部视觉颜色/亮度。
- 8Angle：八个电位器只旋转，按官方280°限制角度，不虚构按压；稳定开关保持档位，灯光独立外驱。
- Mini Scales：根据精确SKU资料保留真实秤台/传力结构，按键和灯光按实体实现，不推测受重形变或称重数值。

复用官方CAD和既有Device/GroveModule接口。增加以毫米为单位的VisualSlide及演示位置控件，使独立模型和已接线模块都能驱动滑块；捕获的拖动离开帽体后继续沿真实轴线移动。外驱命令只改变几何，用户拖动发送输入意图，下游负责传感器和协议。

只做本批必要的几何/控件/API/构建检查，不进行逐面浏览器验收。整体保持modeled，CSV/矢量/生成器留在私有目录，旧Scroll WIP和重绘检查点不动。

三款已接入本地预览。基础几何/API入口对49款实现通过，构建通过；VisualSlide有限检查及Viewer/面板事件夹具通过。进度与源码指纹为 `artifacts/interactive-unit-expansion/progress.json`，不等同浏览器像素或硬件验收。
