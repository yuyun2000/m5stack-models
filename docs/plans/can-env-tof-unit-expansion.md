# CAN / ENV Pro / ToF4M

2026-10-26。继续用户要求的 Unit 扩展，本批为 CAN U085、ENV Pro U169、ToF4M U172。

使用官方原壳，补 PCB、接口、实际传感器封装和光学/通风窗口后的实体。CAN保留可拆4P端子、可转螺钉头和独立白灯；传感器型号分别为BME688与VL53L1X，不用旧版本替代。只负责外观、姿态和视觉锚点，不实现总线、测量值、寄存器、气体计算或激光束。

完成条件：三个独立/Grove 模型、可追溯来源与推导限制、必要局部结构/API smoke、真实三分支接线、构建与本地预览。遵循用户要求，不逐面浏览器复核、不运行历史最终器或全量验收。阶段保持 modeled，私有素材与旧 Scroll WIP 保持原检查点。

已接入：14主机+50 Unit，共64 modeled/0 verified。三款局部smoke、实际三分支接线/API夹具、两个副本构建和5188运行字节检查通过；未做逐面浏览器或全量复核，未提交/推送。公开记录：`artifacts/can-env-tof-unit-expansion/progress.json`。
