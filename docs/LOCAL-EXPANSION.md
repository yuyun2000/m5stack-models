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

旧50张参考重绘PNG保留为未完成全批复核的检查点；私有实现尚未整批同步这些重绘。私有Scroll结构WIP与公开新增Unit分开保留，禁止整树覆盖或夹带发布。StackChan生产装配基准及隐藏配合仍未闭合；该机械缺项与当前明确恢复的主机扩展独立保留。

本地预览为<http://127.0.0.1:5188/>。`npm run catalog`生成loader、服务catalog与STATUS；各批专项命令见对应指南。后续新增时应按本页批次和当前实际diff保留依赖，保留公开基线已有的素材净化规则。

<!-- us915-sma-amendment-2026-10-27 -->

2026-10-27 US915 SMA独立更正：[当前更正说明](US915-SMA-AMENDMENT-2026-10-27.md)依据US915自身近照将本体改为实心中心针，附件受针腔/止挡、尺寸/极性/配合仍明记推导；[当前实际无loader专项receipt](research/lorawan-us915/sma-amendment-2026-10-27-smoke.json)对应 `node scripts/check-lorawan-us915-sma-amendment.mjs`。构建与最终证据见[当前progress](../artifacts/us915-sma-amendment-2026-10-27/progress.json)；[51批progress](../artifacts/cardkboriginal-poecamoriginal-lorawanus915-expansion/progress.json)仅为历史快照。原native、两PNG、framework/API、51/52旧helper/freeze/progress及基线保持，未重跑历史套件。

## 2026-10-28 主机四系列

[AtomS3 / Dial / Plus2 / Basic v2.7](HOST-FAMILY-EXPANSION-2026-10-28.md)新增四款、五种配置；含真实输入、外驱显示、Grove与同步贴纸。当前目录21主机、184 Unit，均保持modeled。

<!-- series-atom-matrix-v11 -->
# Atom Matrix v1.1 接入

```js
import MatrixV11 from './src/devices/atom-matrix-v11/index.js';
const host = new MatrixV11();
const off = host.on('input', event => bridge.acceptInput(event));
host.button('button').press('external');
host.button('button').cancel('external');
host.led('led12').set({color:'#20a0ff',brightness:0.3});
```

默认导出与 `Model` 是相同构造器，另有 `spec/defaults/configurations/configurationSchema`。真实组件顺序：`led0` 到 `led24`、`button`、`reset`、`ext-5p`、`ext-4p`、`grove`、`usb`。`ledN` 是视觉行优先索引，不能当作未经核实的电气串接编号。按键不自动点灯、Reset 不重启固件。

`complete` 配置为 `{}`，`mount-open` 为 `{labelPierced:true}`。默认黄色 M2 标记有实体薄膜覆盖；后一个配置只物理穿透薄膜以开放膜后的原生安装孔。`artwork:false` 仅关闭墨层，仍保留物理膜和所有动作。

Grove 使用既有 Port/UnitFrame/GroveCable，可挂实际 Unit 或 HUB；输入用完整层级路径 `grove/grove-1/press`。外部 RGB 命令不回送 input。自建循环以秒调用 `host.update(dt,time)`，Viewer 已处理更新循环。最终取消自己持有的来源、调用 `off()`，再卸载并 dispose 模型和 Viewer。GPIO/IMU/IR/总线、音频与固件逻辑由下游实现。


<!-- series-m5stick -->

- [M5Stick / K016](research/m5stick/modeling.md)：自身照片原创结构；OLED、两键、蓝灯、Grove。


<!-- series-stickv -->

- [M5StickV / K027](research/stickv/modeling.md)：自身照片原创结构；K210、LCD、三键、RGBW、被动相机与Grove。


<!-- series-atoms3r-ai-chatbot -->
- [AtomS3R-AI Chatbot / K147](research/atoms3r-ai-chatbot/modeling.md)：atoms3r完整控制器与A149语音底座，三张批准PNG；音频/AI为下游能力。


<!-- series-atoms3r-cam -->
## AtomS3R-CAM · C126-CAM

精确本款自身原生结构，完整默认装配与普通PNG贴纸，阶段 `modeled`。入口 `src/devices/atoms3r-cam/index.js` 导出 `Model`、`spec`、`defaults`、`configurations`、`configurationSchema`；默认配置 `complete`（`{}`）。

```js
import {Model} from 'm5stack-models/src/devices/atoms3r-cam/index.js';
const host = new Model({artwork: true});
host.ensureBuilt();
host.on('input', event => console.log(event));
host.button('reset').press('pointer');
host.button('reset').cancel('pointer');
host.handle({type:'led',target:'camera-led',color:'#ffffff',brightness:.6});
host.port('grove').attach(unit); // 真实Grove视觉装配与下游路径
// 动画循环内 host.update(dt, elapsed)，移除时 host.dispose()
```

控制：`reset`；端口：`usb`, `grove`, `ext-5p`, `ext-4p`；外驱LED：`camera-led`。无模拟摄像头数据、传感器、固件或总线。`artwork:false` 保留所有实体和动作。模型原点/尺寸、推导、冲突与限制见 `docs/research/atoms3r-cam/sources.json`；运行 `node scripts/check-atoms3r-cam-controller.mjs`。


<!-- series-atoms3r-cam-ai-chatbot -->
- [AtomS3R-CAM AI Chatbot / K147-CAM](research/atoms3r-cam-ai-chatbot/modeling.md)：atoms3r-cam完整控制器与A149语音底座，三张批准PNG；音频/AI为下游能力。


<!-- series-atoms3r-m12 -->
## AtomS3R-M12 · C126-M12

精确本款自身原生结构，完整默认装配与普通PNG贴纸，阶段 `modeled`。入口 `src/devices/atoms3r-m12/index.js` 导出 `Model`、`spec`、`defaults`、`configurations`、`configurationSchema`；默认配置 `complete`（`{}`）。

```js
import {Model} from 'm5stack-models/src/devices/atoms3r-m12/index.js';
const host = new Model({artwork: true});
host.ensureBuilt();
host.on('input', event => console.log(event));
host.button('reset').press('pointer');
host.button('reset').cancel('pointer');
host.handle({type:'led',target:'camera-led',color:'#ffffff',brightness:.6});
host.port('grove').attach(unit); // 真实Grove视觉装配与下游路径
// 动画循环内 host.update(dt, elapsed)，移除时 host.dispose()
```

控制：`reset`；端口：`usb`, `grove`, `ext-5p`, `ext-4p`；外驱LED：`camera-led`。无模拟摄像头数据、传感器、固件或总线。`artwork:false` 保留所有实体和动作。模型原点/尺寸、推导、冲突与限制见 `docs/research/atoms3r-m12/sources.json`；运行 `node scripts/check-atoms3r-m12-controller.mjs`。


<!-- series-atoms3r-m12-volcengine-kit -->
- [AtomS3R-M12 Volcengine Kit / D062-M12](research/atoms3r-m12-volcengine-kit/modeling.md)：atoms3r-m12完整控制器与A149语音底座，三张批准PNG；音频/AI为下游能力。


<!-- series-stickc -->
### M5StickC · K016-C

`stickc` 保留本款官方原生壳体与原始属性/面编号；原生源有12条四向边、没有degree-1边界；不修补、不删面，不冒称严格每边双面的流形。新增完整背衬/PCB/电池/LCD、三键本款壳面运动、USB/Grove/HAT厚壁孔与接点，以及后标签普通PNG。名义与CAD尺寸冲突在本款来源中保留，不缩放原生源。

组件顺序 `a,b,power,usb,grove,hat,red,lcd`，配置 `complete / {}`，三键为按钮意图、`lcd`为80×160外驱非触摸屏、`red`外驱；Grove四芯/双插头和`grove/press`复用共享API。持续调用`update(dt,time)`；输入来源成对release/cancel。不注册固件/传感数值/音频。

[建模与API](research/stickc/modeling.md)，[安全来源](research/stickc/sources.json)，[CPU专项](research/stickc/checks.json)。`node scripts/check-stickc-controller.mjs`验证真实几何/多点运动、去墨、framebuffer、接口、Grove和释放；实际Viewer夹具104拾取/18取消不代替网页像素，仍为`modeled`。


<!-- series-stickc-plus -->
### M5StickC Plus · K016-P

`stickc-plus` 保留本款官方原生壳体与原始属性/面编号；两件原生壳体严格闭合正体积；另两件为重复平移预览，逐面配对后排除。新增完整背衬/PCB/电池/LCD、三键本款壳面运动、USB/Grove/HAT厚壁孔与接点，以及后标签普通PNG。名义与CAD尺寸冲突在本款来源中保留，不缩放原生源。

组件顺序 `a,b,power,usb,grove,hat,red,lcd`，配置 `complete / {}`，三键为按钮意图、`lcd`为135×240外驱非触摸屏、`red`外驱；Grove四芯/双插头和`grove/press`复用共享API。持续调用`update(dt,time)`；输入来源成对release/cancel。不注册固件/传感数值/音频。

[建模与API](research/stickc-plus/modeling.md)，[安全来源](research/stickc-plus/sources.json)，[CPU专项](research/stickc-plus/checks.json)。`node scripts/check-stickc-plus-controller.mjs`验证真实几何/多点运动、去墨、framebuffer、接口、Grove和释放；实际Viewer夹具104拾取/18取消不代替网页像素，仍为`modeled`。


<!-- series-atoms3r-ext -->
## AtomS3R-Ext · C126-Ext

精确本款自身原生结构，完整默认装配与普通PNG贴纸，阶段 `modeled`。入口 `src/devices/atoms3r-ext/index.js` 导出 `Model`、`spec`、`defaults`、`configurations`、`configurationSchema`；默认配置 `complete`（`{}`）。

```js
import {Model} from 'm5stack-models/src/devices/atoms3r-ext/index.js';
const host = new Model({artwork: true});
host.ensureBuilt();
host.on('input', event => console.log(event));
host.button('reset').press('pointer');
host.button('reset').cancel('pointer');
host.port('grove').attach(unit); // 真实Grove视觉装配与下游路径
// 动画循环内 host.update(dt, elapsed)，移除时 host.dispose()
```

控制：`reset`；端口：`usb`, `grove`, `ext-5p`, `ext-4p`；外驱LED：``。无模拟摄像头数据、传感器、固件或总线。`artwork:false` 保留所有实体和动作。模型原点/尺寸、推导、冲突与限制见 `docs/research/atoms3r-ext/sources.json`；运行 `node scripts/check-atoms3r-ext-controller.mjs`。


<!-- series-stickc-plus-se -->
### M5StickC Plus SE · K016-P-SE

`stickc-plus-se` 按自身机械图/多视图原创重建，透明橙壳、前M5闭合活动舌、左右按键、120mAh/AXP192/无IMU、本款普通PNG独立提供。机械图13.52mm与正文8.4mm冲突保留，模型按自身机械图；不借Plus/Plus2网格、不声称原生CAD。

导出`Model`/`StickCPlusSE`、`spec,DIM,defaults,configurations,configurationSchema,HAT_PINS,GROVE_PINS`；配置`complete/{}`，组件`a,b,power,usb,grove,hat,red,lcd`，135×240非触摸屏及red外驱。Grove四芯/双插头、`grove/press`复用共享API，持续`update(dt,time)`，来源成对取消或释放。输入不执行电源/固件。

[建模/API](research/stickc-plus-se/modeling.md)、[安全来源](research/stickc-plus-se/sources.json)、[CPU专项](research/stickc-plus-se/checks.json)。`node scripts/check-stickc-plus-se-controller.mjs`通过155闭合实体、三键实际表面运动、104 Viewer拾取/18取消、去墨、framebuffer、Grove与释放；网页像素另验收，保持modeled。


<!-- series-atom-echo -->
- [Atom Voice (Atom Echo) / C008-C](research/atom-echo/usage.md)：自身完整native两壳、U舌主键/Reset、单RGB外驱、厚壁接口/九井、真实音腔和麦克风通道，两张完整普通PNG。入口`src/devices/atom-echo/index.js`，专项`node scripts/check-atom-echo-controller.mjs`；`modeled`，visual空。


<!-- series-atom-echos3r -->
- [Atom VoiceS3R (Atom EchoS3R) / C126-ECHO](research/atom-echos3r/usage.md)：自身完整native两壳、U舌主键/Reset、无RGB、厚壁接口/九井、真实音腔和麦克风通道，两张完整普通PNG。入口`src/devices/atom-echos3r/index.js`，专项`node scripts/check-atom-echos3r-controller.mjs`；`modeled`，visual空。


<!-- series-atoms3u -->
## AtomS3U · K125

精确本款自身原生结构，完整默认装配与普通PNG贴纸，阶段 `modeled`。入口 `src/devices/atoms3u/index.js` 导出 `Model`、`spec`、`defaults`、`configurations`、`configurationSchema`；默认配置 `complete`（`{}`）。

```js
import {Model} from 'm5stack-models/src/devices/atoms3u/index.js';
const host = new Model({artwork: true});
host.ensureBuilt();
host.on('input', event => console.log(event));
host.button('reset').press('pointer');
host.button('reset').cancel('pointer');
host.handle({type:'led',target:'rgb',color:'#ffffff',brightness:.6});
host.port('grove').attach(unit); // 真实Grove视觉装配与下游路径
// 动画循环内 host.update(dt, elapsed)，移除时 host.dispose()
```

控制：`button`, `reset`；端口：`usb`, `grove`, `ext-6p`；外驱LED：`rgb`。无模拟摄像头数据、传感器、固件或总线。`artwork:false` 保留所有实体和动作。模型原点/尺寸、推导、冲突与限制见 `docs/research/atoms3u/sources.json`；运行 `node scripts/check-atoms3u-controller.mjs`。


<!-- series-stickt2 -->
### M5StickT2 · K016-T2

`stickt2`是自身原生黑尼龙热成像主机：7650实际面保留、7650组装预览逐面配对排除、两组继承负体积内边界原样保留。独特耳位/安装口、前条纹舌、原生后M5凹字、300mAh承托/PCB/LCD/厚壁接口/被动Lepton镜组独立提供。名义24×48×24与含耳CAD30.4×48×23.9mm分别记录。

导出`Model`/`StickT2`、`spec,DIM,defaults,configurations,configurationSchema,GROVE_PINS`，配置`complete/{}`；组件`a,b,power,usb,grove,press,rotation,lcd`。三键/编码器中心按压、真实轮圈拖转、外驱135×240画面及Grove四芯/双插头复用共享API。没有HAT/LED/传感数据/热图自动生成。持续`update(dt,time)`，取消按钮回位、取消转动结束捕获并保留角度。该款官图没有独立胶贴，M5为实际原生字槽，无虚构贴纸。

[建模/API](research/stickt2/modeling.md)、[安全来源](research/stickt2/sources.json)、[CPU专项](research/stickt2/checks.json)。`node scripts/check-stickt2-controller.mjs`通过103新增闭合实体、144真实Viewer拾取/24取消、两姿态轮圈拖转、实际按放/转压、framebuffer、Grove与释放；网页像素/实物/电气/固件/测温另验收，保持modeled。


<!-- series-atomu -->
- [AtomU / K117](research/atomu/usage.md)：自身机械图/裸板多视图原创完整壳，53×20×10.3总长与13mm USB-A公头、真实U舌主键/Reset、单外驱RGB、6p厚壁井、拾音/IR真口、完整官图参考重绘PNG。入口`src/devices/atomu/index.js`，专项`node scripts/check-atomu-controller.mjs`；`modeled`，visual空。
