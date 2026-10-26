# 四螺钉端子插舌闭合修复

2026-10-26。118款检查点已保存后，单独修复AC Measure、AIN4-20mA、BLDC Driver的端子插舌。AC Measure已确认旧2.5mm高剖面在坐标偏置与0.025mm倒角后，四个下孔边恰与端面外缘相切，产生20条单边界；另外两款同参数模板须实际确认后才改。FrontSide射线通过不能替代有向闭合边验证。

仅将确认受影响的三款 `TerminalPlug.js` 插舌剖面增到2.9mm，保留孔位、固定端子、挂接帧、四个外驱螺钉、标签和整体包络。新轮廓有材料下壁，不用贴图或DoubleSide掩盖缺面。核三实际插舌坐标边闭合/正体积/FrontSide孔壁，外驱头角与精确复位/端口固定，各配置印刷全物理属性/索引/世界矩阵及对应局部装配专项。

基线847个Unit文件，除三个目标外保持844文件；19core及7私有Scroll保持。本次不改已冻结的Roller485 Lite/Mini CAN/INA226产品源。原批次freeze/smoke/progress保留为各自历史快照，另存修订回执及新SHA，更新当前sources/global manifest、窄同步两副本并构建。仅本地修复，Git112基线32c95e0保持，不自动推送。不逐面浏览器或跑全量历史，整体goal active。

## 完成检查点

三款均实际确认20缺边后修复，0坏边/正体积/FrontSide与轴向孔、4螺钉外驱/精确复位/固定帧、12配置印刷和旧新非舌几何/包络保持通过。当前来源SHA已修订，三源窄同步，两build/两回归及5188 catalog/6chunk/13PNG字节通过，其余844Unit/19core/7Scroll保持。来源/回执与限制见TERMINAL-TONGUE-CLOSURE指南；本地118/0verified，公开Git112不变，整体goal active。
