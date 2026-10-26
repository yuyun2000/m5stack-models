# RollerCAN / RollerCAN Lite / Vibrator

2026-10-26。继续用户要求的 Unit 扩展，补真实旋转件和完整装配。

标准版 U188 有集电环与顶部旋转 Grove，Lite U188-Lite 无顶部 Grove；两者分别使用自身官方 CAD 和照片。OLED固定在底部并接受外部 framebuffer，真实按键与灯独立控制。Vibrator U059有外露偏心轮，只按外部角度/rpm旋转，不自动振动外壳。

复用 VisualJoint、Display、Button 和 Grove 四芯线；不实现CAN、扭矩/转速控制、电气、编码器数值或电机物理。原生弹舌要显示真壳形变，移动端口要带动下级线缆与Unit。

完成条件为三款独立/Grove模型、来源和推导限制、必要局部动作/API smoke、真实三分支与移动输出接线、构建和本地预览。按用户要求不逐面浏览器复核、不全量验收，阶段保持modeled；旧贴纸/StackChan未解装配/私有Scroll保持检查点。

已接入：14主机+53 Unit，共67 modeled/0 verified。三款局部smoke、真实三转子/移动Grove输出/原生弹舌动作夹具、两个副本构建与5188运行字节检查通过；未做逐面浏览器或全量复核，未提交/推送。公开记录：`artifacts/rotating-unit-expansion/progress.json`。
