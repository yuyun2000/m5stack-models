# 本地设备扩展批次

2026-10-27。本页整理当前公开工作副本中的本地增量，便于其他Agent接入、查阅各批证据和续作。

当前catalog为201款（17款主机、184款Unit）；阶段计数`{"modeled": 201}`，verified为0。第49–53批累计14款（3款主机、11款Unit）与21张普通PNG纳入本次Git同步范围。预览点击修复、方法论整理以及提交/推送结果统一见[本次发布记录](releases/2026-10-27-preview-stability.md)。

用户已停止继续新增Unit；第54批三款尚未接入的工作不纳入本次201款发布。当前优先完成demo点击响应修复、整理建模方法与Git同步。下方各历史progress、批次计数和Git字样均表示记录保存时点，不代表最新发布状态。

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
| DAC2 / DDS / KMeter-ISO v1.1 | dac2 / dds / kmeter-iso-v11 | [本地进度](../artifacts/dac-dds-kmeter-expansion/progress.json) |
| TimerPWR / ExtEncoder / NFC | timerpwr / extencoder / nfc | [本地进度](../artifacts/timer-encoder-nfc-expansion/progress.json) |
| ADC v1.1 / AMeter / VMeter | adc-v11 / ameter / vmeter | [本地进度](../artifacts/adc-meter-expansion/progress.json) |
| Tube Pressure / MQ / LoRaE220-920 | tube-pressure / mq / lora-e220-920 | [本地进度](../artifacts/radio-gas-pressure-expansion/progress.json) |
| Watering / HBridge v1.1 / DLight | watering / hbridge-v11 / dlight | [本地进度](../artifacts/watering-light-hbridge-expansion/progress.json) |
| DCSSR / NCIR2 / Reflective IR | dcssr / ncir2 / reflective-ir | [本地进度](../artifacts/dcssr-ncir2-reflective-ir-expansion/progress.json) |
| Thermal2 / FlashLight / GPS SMA | thermal2 / flashlight / gps-sma | [本地进度](../artifacts/thermal2-flashlight-gps-expansion/progress.json) |
| BLDC Driver / RCA / Puzzle | bldc-driver / rca / puzzle | [本地进度](../artifacts/bldc-rca-puzzle-expansion/progress.json) |
| RS485-ISO / AIN4-20mA / AC Measure | rs485-iso / ain4-20ma / ac-measure | [本地进度](../artifacts/isolated-interface-expansion/progress.json) |
| UWB / TMOS PIR / Mini ToF-90 | uwb / tmos-pir / mini-tof-90 | [本地进度](../artifacts/ranging-presence-expansion/progress.json) |
| Roller485 Lite / Mini CAN / INA226-10A | roller485-lite / mini-can / ina226-10a | [本地进度](../artifacts/roller-mini-can-ina226-expansion/progress.json) |
| Mini PDM / Mini BPS v1.1 / MIC | mini-pdm / mini-bps-v11 / mic | [本地进度](../artifacts/audio-pressure-expansion/progress.json) |
| Accel / OP90 / OP180 | accel / op90 / op180 | [本地进度](../artifacts/accel-op90-op180-expansion/progress.json) |
| Unit ID / RF433R / RF433T | unit-id / rf433r / rf433t | [本地进度](../artifacts/id-rf433-expansion/progress.json) |
| ZigBee / CO2L / INA226-1A | zigbee / co2l / ina226-1a | [本地进度](../artifacts/zigbee-co2l-ina226-1a-expansion/progress.json) |
| Finger / 3.96 / Scales | finger / unit-396 / scales | [本地进度](../artifacts/finger-396-scales-expansion/progress.json) |
| C6L / Gateway H2 / ChainBus | c6l / gateway-h2 / chainbus | [本地进度](../artifacts/c6l-gateway-chainbus-expansion/progress.json) |
| Glass2 / TypeC-to-Grove / DoF10 | glass2 / typec-to-grove / dof10 | [本地进度](../artifacts/glass-typec-dof10-expansion/progress.json) |
| PoE-P4 / Cat1-CN / Grove-to-Grove | poe-p4 / cat1-cn / grove-to-grove | [本地进度](../artifacts/poep4-cat1-grove-expansion/progress.json) |
| UnitV2 / LoRaWAN-CN470 / Proto | unitv2 / lorawan-cn470 / proto | [本地进度](../artifacts/unitv2-lorawan-proto-expansion/progress.json) |
| Weight / SSR / PoE CAM-W v1.1 | weight / ssr / poe-cam-w-v11 | [本地进度](../artifacts/weight-ssr-poecam-expansion/progress.json) |
| NBIoT2 / NBIoT-CN / Mini Proto | nbiot2 / nbiot-cn / mini-proto | [本地进度](../artifacts/nbiot-mini-proto-expansion/progress.json) |
| HBridge / CatM GNSS / Ultrasonic-IO | hbridge / catm-gnss / ultrasonic-io | [本地进度](../artifacts/hbridge-catm-ultrasonic-expansion/progress.json) |
| DoF6 / DoF9 / BMM350 | dof6 / dof9 / bmm350 | [本地进度](../artifacts/dof6-dof9-bmm350-expansion/progress.json) |
| UnitV-OV7740 / LoRaE220-433 / 8Servos2-I2C | unitv-ov7740 / lora-e220-433 / 8servos2-i2c | [本地进度](../artifacts/unitv-lora433-servos2-expansion/progress.json) |
| CatM / NeoHEX / ENV-IV | catm / neohex / env-iv | [本地进度](../artifacts/catm-neohex-enviv-expansion/progress.json) |
| CardKB2 / Neco / Mini OLED | cardkb2 / neco / mini-oled | [本地进度](../artifacts/cardkb2-neco-minioled-expansion/progress.json) |
| Mini IMU-Pro / Glass / 8Servos2-Chain | mini-imu-pro / glass / 8servos2-chain | [本地进度](../artifacts/imupro-glass-servoschain-expansion/progress.json) |
| UnitV2-USB / UnitV-M12 / TimerCamera-F | unitv2-usb / unitv-m12 / timercamera-f | [本地进度](../artifacts/unitvusb-m12-timercam-expansion/progress.json) |
| M5Camera-X / UnitV2-M12 / TimerCamera-X | m5camera-x / unitv2-m12 / timercamera-x | [本地进度](../artifacts/m5camerax-v2m12-timercamx-expansion/progress.json) |
| EXT.IO / ADC / DAC | extio / adc / dac | [本地进度](../artifacts/extio-adc-dac-expansion/progress.json) |
| M5Bit / Mini BPS / HEX | m5-bit / bps / hex | [本地进度](../artifacts/m5bit-bps-hex-expansion/progress.json) |
| RGB LED 10cm / RFID / ENV | rgb-led-10cm / rfid / env | [本地进度](../artifacts/rgbled-rfid-env-expansion/progress.json) |
| ENV II / Joystick / GPS | env-ii / joystick / gps | [本地进度](../artifacts/envii-joystick-gps-expansion/progress.json) |
| PaHub v2.0 / PbHub / TimerCamera | pahub-v20 / pbhub / timercamera | [本地进度](../artifacts/pahubv20-pbhub-timercamera-expansion/progress.json) |
| M5Camera / ESP32CAM / RGB LED Strip 50cm | m5camera / esp32cam / rgb-led-strip-50cm | [本地进度](../artifacts/m5camera-esp32cam-rgbstrip50-expansion/progress.json) |
| CardKB original / PoE CAM-W original / LoRaWAN US915 | cardkb-original / poe-cam-w / lorawan-us915 | [本地进度](../artifacts/cardkboriginal-poecamoriginal-lorawanus915-expansion/progress.json) |
| LoRaWAN AS923 / EU868 | lorawan-as923 / lorawan-eu868 | [本地进度](../artifacts/lorawan-as923-eu868-expansion/progress.json) |
| Atom Lite / 原 Atom Matrix / AtomS3 Lite（三款controller） | atom-lite / atom-matrix / atoms3-lite | [本地进度](../artifacts/atomlite-atommatrix-atoms3lite-expansion/progress.json) |

各进度记录绑定相应批次的源码/检查范围。近期新增只执行必要局部结构、动作/API、接线夹具及构建；没有逐面浏览器复核或全量验收。`modeled`表示已有实现，不能视为完成视觉或实物配合验收。

## 接入入口

- [Atom三主机](ATOMLITE-ATOMMATRIX-ATOMS3LITE-CONTROLLERS.md)：原Atom Lite、原Atom Matrix与AtomS3 Lite，真实键、灯、接口及同步贴纸。
- [LoRaWAN AS923/EU868](LORAWAN-AS923-EU868-UNITS.md)：两款自身native完整壳、各自天线/真实接口及同步前后印刷。
- [原CardKB/原PoE CAM-W/US915](CARDKBORIGINAL-POECAMORIGINAL-LORAWANUS915-UNITS.md)：50键实际按放/单RGB、原摄像头双键与独立灯、原生US915完整壳/接口及同步印刷。
- [Agent总指南](AGENT-INTEGRATION.md)：按需loader、输入/外驱状态、层级地址与生命周期。
- [原M5Camera/ESP32CAM/50cm灯条](M5CAMERA-ESP32CAM-RGBSTRIP50-UNITS.md)：自身相机结构/真实帽、500mm30灯实际包覆/三线转接与外驱形状及同步印刷。
- [PaHub v2.0/原PbHub/裸TimerCamera](PAHUBV20-PBHUB-TIMERCAMERA-UNITS.md)：七口真实接合/下游四芯与层级地址、裸板双帽/固定蓝灯和被动光学frame及同步印刷。
- [原ENV II/Joystick/GPS](ENVII-JOYSTICK-GPS-UNITS.md)：SHT30/BMP280真实通气壳、XY倾斜与Z按压回弹、原GPS完整接口及同步印刷。
- [RGB LED 10cm/RFID/ENV原版](RGBLED-RFID-ENV-UNITS.md)：15灯外驱/真实柔性带形、原RFID实体与银膜、原ENV40交错通气槽/双封装及同步印刷。
- [M5Bit/Mini BPS/HEX原版](M5BIT-BPS-HEX-UNITS.md)：真实卡槽/IO、BMP280双通气槽、37颗SK6812外驱与本款印刷；只外观与实际物理接口。
- [EXT.IO/ADC/DAC原版](EXTIO-ADC-DAC-UNITS.md)：自身尺寸/多视图参数化壳、真实IO/可拆端子/Grove和本款重绘PNG；电气与固件由外部框架实现。
- [M5Camera-X/UnitV2-M12/TimerCamera-X](M5CAMERAX-V2M12-TIMERCAMX-UNITS.md)：自身native壳/光学与真实接口控件、M12外驱焦环角、静态安装件及对应印刷/真实无色压纹；不模拟拍摄/AI/固件。
- [UnitV2-USB/UnitV-M12/TimerCamera-F](UNITVUSB-M12-TIMERCAM-UNITS.md)：各自完整原生壳件/真实USB与四芯接口、顶部原生弹性舌/侧帽、光学或固定散热载体、实际静态安装附件与同步印刷；动作和输出依最终冻结API。
- [Mini IMU-Pro/Glass/8Servos2-Chain](IMUPRO-GLASS-SERVOSCHAIN-UNITS.md)：本款内部地址拨片的可达边界、透明蓝屏/真实侧键与蜂鸣载体，以及Chain IN/OUT/24针/DC和同步印刷；实际API以冻结记录为准。
- [CardKB2/Neco/Mini OLED](CARDKB2-NECO-MINIOLED-UNITS.md)：44真实按键与独立灯、猫耳板35RGB/轻触键、72×40白OLED外驱与自身多接口及同步印刷。
- [CatM/NeoHEX/ENV-IV](CATM-NEOHEX-ENVIV-UNITS.md)：本款单SMA/NanoSIM蜂窝实体、37灯与独立均光片、真实双芯片通气壳及同步印刷。
- [UnitV/LoRa433/8Servos2](UNITV-LORA433-SERVOS2-UNITS.md)：本款原生侧键/真实光路、433双拨片和静态天线，以及六视参数化控制器/16档旋钮/24实针与同步印刷。
- [DoF6/DoF9/BMM350](DOF6-DOF9-BMM350-UNITS.md)：各自实际惯性/磁感封装、稳定滑片与空槽背衬、四芯Grove和同步印刷。
- [HBridge/CatM GNSS/Ultrasonic-IO](HBRIDGE-CATM-ULTRASONIC-UNITS.md)：原款真实DIP/滑选与端子、宽壳MicroSIM/双射频附件和GPIO超声深网罩及同步贴纸。
- [NBIoT2/NBIoT-CN/Mini Proto](NBIOT-MINI-PROTO-UNITS.md)：各自蜂窝模组/卡座/SMA与可拆天线、真实后盖服务和本款48孔洞板及同步印刷。
- [Weight/SSR/PoE CAM-W v1.1](WEIGHT-SSR-POECAM-UNITS.md)：原款HX711/小型SSR的真实端子与外驱螺钉、OV3660/网口/实际控件和自身支架附件及同步印刷。
- [UnitV2/LoRaWAN-CN470/Proto](UNITV2-LORAWAN-PROTO-UNITS.md)：本款摄像Unit实体/风扇与附属装配、CN470可拆天线及真实洞板与同步贴纸。
- [PoE-P4/Cat1-CN/Grove-to-Grove](POEP4-CAT1-GROVE-UNITS.md)：本款PoE/双USB/真实控件灯、普通SMA可动天线/后盖服务及三socket物理转接与同步贴纸。
- [Glass2/TypeC-to-Grove/DoF10](GLASS-TYPEC-DOF10-UNITS.md)：透明OLED外部framebuffer、实际USB-C/三Grove适配与真实地址拨杆/同步贴纸。
- [C6L/GatewayH2/ChainBus](C6L-GATEWAY-CHAINBUS-UNITS.md)：外部OLED/真实控件/RP-SMA、闭壳与裸板及真实EXT直接插接和同步贴纸。
- [Finger/3.96/Scales](FINGER-396-SCALES-UNITS.md)：真实电容采集面、可拆端子和秤台/键帽/独立灯及同步贴纸。
- [ZigBee/CO2L/INA226-1A](ZIGBEE-CO2L-INA226-1A-UNITS.md)：真实RF模组/SMA天线、SCD41与1A专属测量实体和同步贴纸。
- [Unit ID/RF433R/RF433T](ID-RF433-UNITS.md)：真实加密IC与接收/发射封装、固定PCB天线和同步贴纸。
- [Accel/OP90/OP180](ACCEL-OP90-OP180-UNITS.md)：真实加速度封装、两种固定光电叉与检测空气槽及同步贴纸。
- [Mini PDM/Mini BPS v1.1/MIC](AUDIO-PRESSURE-UNITS.md)：真实声学/气压封装、声孔与可调头及同步贴纸。
- [Roller485 Lite/Mini CAN/INA226-10A](ROLLER-MINI-CAN-INA226-UNITS.md)：真实电机转子、非隔离CAN与隔离采集端子及同步贴纸。
- [UWB/TMOS PIR/Mini ToF-90](RANGING-PRESENCE-UNITS.md)：内置天线、真实红外感测窗口与固定直角双板/原稿印刷。
- [RS485-ISO/AIN4-20mA/AC Measure](ISOLATED-INTERFACE-UNITS.md)：真实隔离芯片/四位端子、可拆跳帽与原稿印刷。
- [BLDC Driver/RCA/Puzzle](BLDC-RCA-PUZZLE-UNITS.md)：真实三相连接器、音视频插座/壳内双通道开关和64灯外驱/物理级联。
- [Thermal2/FlashLight/GPS SMA](THERMAL2-FLASHLIGHT-GPS-UNITS.md)：热成像采集头/原壳舌、固定白灯/壳内选择器和可拆有源带线天线。
- [DCSSR/NCIR2/Reflective IR](DCSSR-NCIR2-REFLECTIVE-IR-UNITS.md)：完整直流SSR、实际测温头/按钮和红外阈值调节头。
- [Watering/HBridge v1.1/DLight](WATERING-LIGHT-HBRIDGE-UNITS.md)：真实泵/极板、驱动端子与稳定电源选择器、环境光感测实体。
- [Tube Pressure/MQ/LoRaE220-920](RADIO-GAS-PRESSURE-UNITS.md)：真实气嘴、金属感测罩、可拆配件与无线模组DIP形状。
- [ADC v1.1/AMeter/VMeter](ADC-METER-UNITS.md)：真实模拟输入/测量插座、可拆端子与外驱螺钉头。
- [TimerPWR/ExtEncoder/NFC](TIMER-ENCODER-NFC-UNITS.md)：真实按键、外部屏幕、五芯插头与NFC实体。
- [DAC2/DDS/KMeter-ISO](DAC-DDS-KMETER-UNITS.md)：可拆端子、SMA同轴与K型扁插座/附件。
- [Laser TX/RX/MIDI](LASER-MIDI-UNITS.md)：发射/接收光学实体、DIN/TRS插座与真实稳定滑块。
- [Earth/Hall/QRCode](EARTH-HALL-QRCODE-UNITS.md)：土壤探针、固定磁感实体、真实触发键/通讯滑块与独立灯。
- [Step16/ASR/UHF](STEP-ASR-UHF-UNITS.md)：旋钮、原生七段/RGB外驱、固定声学与RF实体。
- [IMU/扩展IO/ACSSR](IMU-EXTIO-ACSSR-UNITS.md)：纯实体锚点、真实排针、按键/螺钉与独立外驱灯。
- [近期设备贴纸](UNIT-STICKER-ADDITIONS.md)：158款设备（含本批3款controller）的实际PNG、来源、开关与必要局部检查。
- [网络/摄像/合成Unit](NETWORK-CAMERA-SYNTH-UNITS.md)：真实网口、固定镜头、内置喇叭与同步贴纸。
- [旋转Unit](ROTATING-UNITS.md)：转子、真实弹舌和移动Grove输出。
- [显示Unit](DISPLAY-UNITS.md)：独立与嵌套framebuffer。
- [可动输入Unit](INTERACTIVE-INPUT-UNITS.md)：稳定开关、瞬时键和双轴摇杆。
- [Relay与DMX](RELAY-DMX-UNITS.md)、[CAN与环境/测距](CAN-ENV-TOF-UNITS.md)、[RTC/指纹/音频](RTC-FINGERPRINT-AUDIO-UNITS.md)。

## 端子闭合修订

AC Measure/AIN4-20mA/BLDC Driver插舌已补孔下壁；当前SHA/局部证据见[闭合修复](TERMINAL-TONGUE-CLOSURE.md)。原批22/23及批25的冻结/进度保留为历史快照，不能拿旧SHA当当前源。该修复不增加型号/PNG数。

## 保留的边界

提供给公开分发的新增代码使用MIT，第三方CAD/标识/图片保留各自权利。CSV、矢量原稿、私有映射、生成器和中间材料继续在仓库外；只分发已授权的普通PNG和配准代码。原始官方STL、照片/PDF和MCP长篇原文不加入公开包。

旧50张参考重绘PNG保留为未完成全批复核的检查点；私有实现尚未整批同步这些重绘。私有Scroll结构WIP与公开新增Unit分开保留，禁止整树覆盖或夹带发布。StackChan生产装配基准及隐藏配合仍未闭合，整体goal保持active。

本地预览为<http://127.0.0.1:5188/>。`npm run catalog`生成loader、服务catalog与STATUS；各批专项命令见对应指南。后续新增时应按本页批次和当前实际diff保留依赖，保留公开基线已有的素材净化规则。

<!-- us915-sma-amendment-2026-10-27 -->

2026-10-27 US915 SMA独立更正：[当前更正说明](US915-SMA-AMENDMENT-2026-10-27.md)依据US915自身近照将本体改为实心中心针，附件受针腔/止挡、尺寸/极性/配合仍明记推导；[当前实际无loader专项receipt](research/lorawan-us915/sma-amendment-2026-10-27-smoke.json)对应 `node scripts/check-lorawan-us915-sma-amendment.mjs`。构建与最终证据见[当前progress](../artifacts/us915-sma-amendment-2026-10-27/progress.json)；[51批progress](../artifacts/cardkboriginal-poecamoriginal-lorawanus915-expansion/progress.json)仅为历史快照。原native、两PNG、framework/API、51/52旧helper/freeze/progress及基线保持，未重跑历史套件。
