# 本地 Unit 扩展批次

2026-10-26。本页整理当前公开工作副本中的本地增量，便于其他Agent接入、查阅各批证据和续作。

当前catalog为14款主机、71款Unit，共85款；阶段计数`{"modeled": 85}`。生成本页时的提交基线为`48667b728736fbfd4365a06575473ce538d3c972`，该基线catalog有43款。此页描述当前源码快照；当前提交和远端状态以Git日志及GitHub main为准。各历史progress中的未提交/未推送字样只描述各自保存时点。

| 批次 | 产品ID | 检查点 |
| --- | --- | --- |
| GPS v1.1 / Weight-I2C / 8Servos | gps-v11 / weight-i2c / 8servos | [本地进度](../artifacts/unit-expansion/progress.json) |
| Fader / 8Angle / Mini Scales | fader / 8angle / mini-scales | [本地进度](../artifacts/interactive-unit-expansion/progress.json) |
| Weight-I2C / 8Servos 可拆端子 | 见记录 | [本地进度](../artifacts/unit-terminal-accessories/progress.json) |
| PaHUB v2.1 / PbHUB v1.1 / Gesture | pahub-v21 / pbhub-v11 / gesture | [本地进度](../artifacts/multiport-unit-expansion/progress.json) |
| OLED / LCD / CO2 | oled / lcd / co2 | [本地进度](../artifacts/display-co2-unit-expansion/progress.json) |
| Joystick2 / ByteSwitch / ByteButton | joystick2 / byteswitch / bytebutton | [本地进度](../artifacts/byte-joystick-unit-expansion/progress.json) |
| 2Relay / 4Relay / DMX | 2relay / 4relay / dmx | [本地进度](../artifacts/relay-dmx-unit-expansion/progress.json) |
| CAN / ENV Pro / ToF4M | can / env-pro / tof4m | [本地进度](../artifacts/can-env-tof-unit-expansion/progress.json) |
| RollerCAN / RollerCAN Lite / Vibrator | rollercan / rollercan-lite / vibrator | [本地进度](../artifacts/rotating-unit-expansion/progress.json) |
| RTC / Fingerprint2 / AudioPlayer | rtc / fingerprint2 / audioplayer | [本地进度](../artifacts/rtc-fingerprint-audio-expansion/progress.json) |
| PoESP32 / CamS3-5MP / Synth | poesp32 / cams3-5mp / synth | [本地进度](../artifacts/network-camera-synth-expansion/progress.json) |
| 近期30款Unit同步贴纸 | poesp32 / cams3-5mp / synth / 8angle / pahub-v21 / pbhub-v11 / 2relay / env-pro / fingerprint2 / byteswitch / bytebutton / gps-v11 / weight-i2c / 8servos / fader / mini-scales / joystick2 / gesture / oled / lcd / co2 / tof4m / rtc / 4relay / dmx / can / rollercan / rollercan-lite / vibrator / audioplayer | [本地进度](../artifacts/unit-sticker-additions/progress.json) |
| Mini IMU / EXT.IO2 / ACSSR | mini-imu / extio2 / acssr | [本地进度](../artifacts/imu-extio-acssr-expansion/progress.json) |
| Step16 / ASR / UHF-RFID | step16 / asr / uhf-rfid | [本地进度](../artifacts/step-asr-uhf-expansion/progress.json) |
| Earth / Hall / QRCode | earth / hall / qrcode | [本地进度](../artifacts/earth-hall-qrcode-expansion/progress.json) |
| Laser TX / Laser RX / MIDI | laser-tx / laser-rx / midi | [本地进度](../artifacts/laser-midi-expansion/progress.json) |

各进度记录绑定相应批次的源码/检查范围。近期新增只执行必要局部结构、动作/API、接线夹具及构建；没有逐面浏览器复核或全量验收。`modeled`表示已有实现，不能视为完成视觉或实物配合验收。

## 接入入口

- [Agent总指南](AGENT-INTEGRATION.md)：按需loader、输入/外驱状态、层级地址与生命周期。
- [Laser TX/RX/MIDI](LASER-MIDI-UNITS.md)：发射/接收光学实体、DIN/TRS插座与真实稳定滑块。
- [Earth/Hall/QRCode](EARTH-HALL-QRCODE-UNITS.md)：土壤探针、固定磁感实体、真实触发键/通讯滑块与独立灯。
- [Step16/ASR/UHF](STEP-ASR-UHF-UNITS.md)：旋钮、原生七段/RGB外驱、固定声学与RF实体。
- [IMU/扩展IO/ACSSR](IMU-EXTIO-ACSSR-UNITS.md)：纯实体锚点、真实排针、按键/螺钉与独立外驱灯。
- [近期Unit贴纸](UNIT-STICKER-ADDITIONS.md)：30款原稿/参考重绘、来源、开关与必要局部检查。
- [网络/摄像/合成Unit](NETWORK-CAMERA-SYNTH-UNITS.md)：真实网口、固定镜头、内置喇叭与同步贴纸。
- [旋转Unit](ROTATING-UNITS.md)：转子、真实弹舌和移动Grove输出。
- [显示Unit](DISPLAY-UNITS.md)：独立与嵌套framebuffer。
- [可动输入Unit](INTERACTIVE-INPUT-UNITS.md)：稳定开关、瞬时键和双轴摇杆。
- [Relay与DMX](RELAY-DMX-UNITS.md)、[CAN与环境/测距](CAN-ENV-TOF-UNITS.md)、[RTC/指纹/音频](RTC-FINGERPRINT-AUDIO-UNITS.md)。

## 保留的边界

提供给公开分发的新增代码使用MIT，第三方CAD/标识/图片保留各自权利。CSV、矢量原稿、私有映射、生成器和中间材料继续在仓库外；只分发已授权的普通PNG和配准代码。原始官方STL、照片/PDF和MCP长篇原文不加入公开包。

旧50张参考重绘PNG保留为未完成全批复核的检查点；私有实现尚未整批同步这些重绘。私有Scroll结构WIP与公开新增Unit分开保留，禁止整树覆盖或夹带发布。StackChan生产装配基准及隐藏配合仍未闭合，整体goal保持active。

本地预览为<http://127.0.0.1:5188/>。`npm run catalog`生成loader、服务catalog与STATUS；各批专项命令见对应指南。后续新增时应按本页批次和当前实际diff保留依赖，保留公开基线已有的素材净化规则。
