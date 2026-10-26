# Joystick2 / ByteSwitch / ByteButton

2026-10-26。继续用户要求的 Unit 扩展，重点补可见的机械动作。上一批 OLED/LCD/CO2 已接入，本批增加 Joystick2 U024-V2、ByteSwitch U191、ByteButton U192。

使用官方结构与产品依据，保留完整壳体，补 PCB、控制器封装、活动帽/杆、灯和接口。复用现有 Button、VisualJoint、Led、Grove 装配与输入路径；不实现传感器读数、I2C、寄存器或固件。

完成条件为三款独立/Grove 模型、来源和推导限制、必要局部动作/API smoke、实际级联连接检查、构建及本地预览。只做必要检查，不跑逐面浏览器复核或历史最终器；阶段保持 modeled。私有贴纸输入、矢量、映射和旧 Scroll WIP 保持原检查点。

已接入：14主机+44 Unit，共58 modeled/0 verified。三款局部smoke、三级真实产品动作/级联夹具、两个副本构建与5188运行字节检查通过；未做逐面浏览器或全量复核，未提交/推送。公开记录：`artifacts/byte-joystick-unit-expansion/progress.json`。
