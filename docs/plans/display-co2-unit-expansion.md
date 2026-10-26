# OLED / LCD / CO2 Unit 扩展

2026-10-26。遵循用户最新优先级：停止耗时复核，继续增加 Unit。

本批新增 OLED U119、LCD U120、CO2 U103。三个产品各有独立目录，使用官方结构文件，补 PCB、屏幕组件或传感器封装及 Grove 实体。显示产品复用既有 Display framebuffer；CO2 仅提供外观和视觉锚点，不模拟测量、电气或固件。

完成条件：三个模型加入 catalog、导出与本地预览，保存公开来源与推导限制；新款有限结构/API、显示接入夹具及构建通过。按要求不做逐面浏览器复核，不升 verified，不运行历史最终器。CSV、矢量和映射仍仅在仓库外；旧贴纸批、私有 Scroll WIP 保持检查点。

StackChan 装配基准未闭合，现有实体及关节保持。未接入的姿态按钮原型单独保存为仓库外 patch，先推进本批 Unit。

已接入：14主机+41 Unit，共55 modeled/0 verified。三款局部smoke、实际产品多屏夹具和两个副本构建通过；本地5188提供新模型。未提交/推送，未做逐面浏览器验收。公开进度记录为 `artifacts/display-co2-unit-expansion/progress.json`。
