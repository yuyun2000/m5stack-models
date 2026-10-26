# 当前进度

由 npm run catalog 生成；catalog/products.json 为权威状态。

范围：精细外观建模，行为由下游模拟器负责。主机 14 款，Unit 113 款。

状态计数：{"modeled":127}。modeled 表示已有实现，不表示已完成视觉验收。

| 类别 | 产品 | 阶段 | 名义尺寸 X × Y × Z / mm | 下一步 |
| --- | --- | --- | --- | --- |
| 主机 | StickS3 | modeled | 24 × 48 × 15 | 七视图及实体排母/接口/侧键背衬已复核；继续精修照片推导局部尺寸；正式栅格贴纸已接入，配准复核见贴纸记录 |
| 主机 | CoreS3 | modeled | 54 × 54 × 15.5 | 当前装配细化与专用检查已复核；继续核对照片推导细节；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| 主机 | StopWatch | modeled | 52 × 52 × 15.5 | 当前装配细化与专用检查已复核；继续核对照片推导细节；正式栅格贴纸已接入，配准复核见贴纸记录 |
| 主机 | Cardputer-ADV | modeled | 84 × 54 × 19.6 | 接口深腔、StampS3A、接缝搭接和60控件已检查；继续核对推导包装及LCD有效区；正式栅格贴纸已接入，配准复核见贴纸记录 |
| 主机 | CardputerZero | modeled | 84 × 54 × 23.1 | 46键/九接口/后置相机七视图已复核；等待正式机械图，继续精修照片推导尺寸；正式栅格贴纸已接入，配准复核见贴纸记录 |
| 主机 | PaperMono | modeled | 62 × 101 × 8 | 七视图与导光件/MIC/NFC实体盖已复核；继续校准面板与封装尺寸；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| 主机 | Core2 v1.1 | modeled | 54 × 54 × 16.5 | v1.1版本与七视图已复核；LCD有效区待面板图，局部机械尺寸继续精修；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| 主机 | PaperColor | modeled | 70.8 × 103.9 × 8.5 | 七视图与前盖/底槽/声学和传感器内层已复核；继续精修局部尺寸；正式栅格贴纸已接入，配准复核见贴纸记录 |
| 主机 | NanoC6 | modeled | 12 × 23.5 × 9.5 | 七视图与USB/Grove/背槽内层已复核；继续精修照片推导封装尺寸；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| 主机 | StackChan | modeled | 54 × 70.5 × 61.5 | 相对盖座孔轴与顶面触区采样已校正；继续核准全局头颈datum、右轴承轴向座与隐藏舵机/线束真实安装；正式栅格贴纸已接入，配准复核见贴纸记录 |
| 主机 | Tab5 | modeled | 128 × 80 × 12 | 七视图与接口深腔已复核；继续精修照片推导尺寸及LCD有效区；正式栅格贴纸已接入，配准复核见贴纸记录 |
| 主机 | AtomS3R | modeled | 24 × 24 × 12.9 | 完成本轮IR实体与双键/Grove的当前数字复核；继续核准绿色下载灯外部可见性、另一顶边窄槽及照片推导局部尺寸；正式栅格贴纸已接入，配准复核见贴纸记录 |
| 主机 | Arduino Nesso N1 | modeled | 24 × 48 × 21.1 | 单天线装配及七视图已复核；等待RF接口命名确认，精修局部尺寸；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| 主机 | StamPLC | modeled | 72 × 80 × 33.4 | 当前装配细化与专用检查已复核；继续核对照片推导细节；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | ENV III | modeled | 24 × 32 × 8 | 当前装配细化与专用检查已复核；继续核对照片推导细节；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | PIR | modeled | 24 × 32 × 12.5 | 当前装配细化与专用检查已复核；继续核对照片推导细节；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | Ultrasonic-I2C | modeled | 24 × 56 × 15.2 | 当前装配细化与专用检查已复核；继续核对照片推导细节；正式栅格贴纸已接入，配准复核见贴纸记录 |
| Unit | RGB LED | modeled | 24 × 32 × 8 | 优先逐面检查装配闭合与真实开口；正式栅格贴纸已接入，配准复核见贴纸记录 |
| Unit | Angle | modeled | 24 × 32 × 22 | 继续核准隐藏包体与机械限位；本批实体/旋转/四芯接线专项证据见artifacts/angle-detail/public/review.json，stage仍modeled；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | Color | modeled | 24 × 32 × 8 | 继续校准白色补光的封装深度、光扩散与窗口装配，D1/D2左右映射仍未确认；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | ToF | modeled | 24 × 32 × 8 | 优先逐面检查装配闭合与真实开口；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | Light | modeled | 24 × 32 × 8 | 继续核准U021电位器具体型号、额定机械转角与微调头/蓝座局部尺寸；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | Relay | modeled | 24 × 48 × 8 | 复核固定座/可拆插头的照片推导局部和可靠装配参数；逐面官方参考验收；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | Joystick v1.1 | modeled | 24 × 48 × 32 | 帽面法线、压放和七视图已检查；继续校准帽形与未确认倾斜限位；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | Dual Button | modeled | 24 × 48 × 8 | 完整彩帽尺寸、压放和七视图已检查；后续校准真实按压行程；正式栅格贴纸已接入，配准复核见贴纸记录 |
| Unit | Button | modeled | 24 × 32 × 8 | 原生按压片弯曲、精确回位及七视图已检查；后续校准未确认行程和隐藏包装；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | NCIR | modeled | 24 × 32 × 8.6 | 本批数字证据见artifacts/ncir-detail/public/review.json；隐藏板形/安装yaw/裁脚仍待更精确依据；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | Heart Rate | modeled | 24 × 32 × 8 | 继续收敛隐藏PCB外边缘／安装柱避让及照片推导的座内结构，保持真实口面与线缆配合；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | Encoder | modeled | 24 × 32 × 25.4 | 继续核准隐藏件尺寸、额定按程与壳体透光外观；本批数字模型专项证据见artifacts/encoder-detail/public/review.json；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | Thermal | modeled | 24 × 32 × 8.6 | 本批数字证据见artifacts/thermal-detail/public/review.json；隐藏板形/包体yaw/装配细节仍待更精确依据；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | Mini TVOC/eCO2 | modeled | 24 × 24 × 8 | 优先逐面检查装配闭合与真实开口；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | IR | modeled | 24 × 32 × 8 | 七视图与双光学封装/接口腔体已复核；精修照片推导透镜尺寸；正式栅格贴纸已接入，配准复核见贴纸记录 |
| Unit | HUB | modeled | 24 × 32 × 10.8 | 七视图与四接口/16针已复核；精修竖座壁厚及插入深度；正式栅格贴纸已接入，配准复核见贴纸记录 |
| Unit | RFID2 | modeled | 24 × 48 × 8 | 七视图与实体面盖/接口腔体已复核；等待面盖及内部机械依据；正式栅格贴纸已接入，配准复核见贴纸记录 |
| Unit | RS485 | modeled | 24 × 32 × 10.2 | 继续收敛隐藏PCB外边缘／安装柱避让及照片推导的座内结构，保持真实口面与线缆配合；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | Buzzer | modeled | 24 × 24 × 8 | 七视图与五条声槽后实体已复核；继续精修隐藏声学封装；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | Fan | modeled | 24 × 32 × 12.2 | 裸轴及风叶已接入外部视觉运动；继续精修照片推导叶形和电机包装；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | Unit Limit | modeled | 24 × 32 × 9.5 | 原始壳体、七视图与压放动作已检查；等待量产KW4A(S)机械图校准限位与隐藏细节；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | CardKB v1.1 | modeled | 88 × 54 × 5 | 当前七视图、50键压放与Grove挂载已检查；继续核对封装细节和官方尺寸冲突，丝印等待原文件；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | Unit Key | modeled | 24 × 40 × 22.6 | 核准官方表格/机械图总高冲突与开关额定行程；继续细化照片推导隐藏件；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | Unit 8Encoder | modeled | 24 × 128 × 25 | 核准EC11A实际装配型号/额定压程与隐藏件尺寸；当前旋转、压放、稳定档位和RGB仅为外驱视觉状态；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | Unit Scroll | modeled | 24 × 32 × 18.9 | 复核官方滚轮按压支撑/额定行程；核对七视图、旋转/回位与实际主机Grove连接；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | Unit Roller485 | modeled | 40 × 40 × 40 | 持续核对隐藏PCB/显示支撑、额定按程与生产装配依据，制造配合与硬件运行另行验证；已补官方照片参考重绘印刷，准确范围及余缺见贴纸覆盖记录 |
| Unit | GPS v1.1 | modeled | 24 × 48 × 8 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Weight-I2C | modeled | 24 × 32 × 11.3 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit 8Servos | modeled | 24 × 55 × 10.5 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit Fader | modeled | 24 × 64 × 22.8 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit 8Angle | modeled | 24 × 128 × 23 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit Mini Scales | modeled | 24 × 40 × 18 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | PaHUB v2.1 | modeled | 24 × 48 × 10.8 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit PbHUB v1.1 | modeled | 24 × 48 × 10.8 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit Gesture | modeled | 24 × 32 × 8 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit OLED | modeled | 24 × 56 × 8 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit LCD | modeled | 24 × 48 × 8 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit CO2 | modeled | 24 × 48 × 16 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit Joystick2 | modeled | 24 × 40 × 23.9 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit ByteSwitch | modeled | 24 × 88 × 19.6 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit ByteButton | modeled | 24 × 88 × 12 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit 2Relay | modeled | 24 × 56 × 19 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit 4Relay | modeled | 24 × 112 × 18.4 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit DMX | modeled | 24 × 51.6 × 32 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit CAN | modeled | 24 × 56 × 10.2 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit ENV-Pro | modeled | 24 × 32 × 8 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit ToF4M | modeled | 24 × 32 × 8 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit RollerCAN | modeled | 40 × 40 × 40 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit RollerCAN-Lite | modeled | 40 × 40 × 40 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit Vibrator | modeled | 24 × 32 × 8 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit RTC | modeled | 24 × 48 × 8 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit Fingerprint2 | modeled | 24 × 40 × 8 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit AudioPlayer | modeled | 24 × 48 × 8 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit PoESP32 | modeled | 26 × 72 × 19.2 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit CamS3-5MP | modeled | 24 × 40 × 11 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit Synth | modeled | 24 × 48 × 16 | Continue Unit expansion with corresponding stickers; refine documented appearance estimates when exact production references become available. |
| Unit | Unit Mini IMU | modeled | 24 × 24 × 8 | Continue Unit expansion with matching artwork; refine concealed PCB/package datums if exact production assembly references become available. |
| Unit | Unit EXT.IO2 | modeled | 24 × 32 × 10.2 | Continue Unit expansion with labels in parallel; refine inferred internal component datums and P1 population only if exact production assembly references become available. |
| Unit | Unit ACSSR | modeled | 45 × 80 × 31 | Continue Unit expansion with stickers. Refine photo-derived SSR assembly and tongue travel when official populated mechanical dimensions become available. |
| Unit | Unit Step16 | modeled | 24 × 32 × 16.9 | Continue Unit expansion with matching artwork; refine concealed assembly/light appearance when exact production references are available. |
| Unit | Unit ASR | modeled | 24 × 48 × 16 | Continue new Unit expansion with matching stickers; refine hidden component installation only if production assembly references become available. |
| Unit | Unit UHF-RFID | modeled | 48 × 56 × 11.5 | Continue Unit expansion with matching artwork; refine concealed module/PCB/antenna datums if exact production assembly references become available. |
| Unit | Unit Earth | modeled | 24 × 64.3 × 8 | Continue Unit expansion with matching artwork; refine concealed assembly/probe/package datums when exact production references become available. |
| Unit | Unit Hall | modeled | 24 × 32 × 8 | Continue new Unit expansion with matching stickers; refine concealed package installation and visible LED optical path only when exact production evidence becomes available. |
| Unit | Unit QRCode | modeled | 27.2 × 65.8 × 18.4 | Continue Unit expansion with corresponding body labels; refine concealed installation only when production assembly evidence is available. |
| Unit | Unit Laser TX | modeled | 24 × 32 × 8 | Continue Unit expansion with simultaneous matching labels; refine concealed laser/PCB placement only from exact populated-assembly evidence. |
| Unit | Unit Laser RX | modeled | 24 × 32 × 8 | Continue new Unit expansion with matching stickers; refine concealed receiver package installation only when exact production evidence becomes available. |
| Unit | Unit MIDI | modeled | 40 × 48 × 25 | Continue Unit expansion with matching labels; refine concealed installation only when production assembly evidence becomes available. |
| Unit | Unit DAC2 | modeled | 24 × 32 × 10.2 | Continue Unit expansion with matching source artwork; refine concealed installation only with official assembly evidence. |
| Unit | Unit DDS | modeled | 24 × 71.4 × 8 | Continue Unit expansion with labels; refine concealed installation only when production assembly evidence becomes available. |
| Unit | Unit KMeter-ISO v1.1 | modeled | 24 × 56 × 8 | Continue new Unit expansion with matching stickers; refine hidden installed package and probe only with exact mechanical evidence. |
| Unit | Unit TimerPWR | modeled | 24 × 40 × 11 | Continue Unit expansion and exact source-label replacement when supplied; production installation only with authoritative new assembly evidence. |
| Unit | Unit ExtEncoder | modeled | 24 × 32 × 10.7 | Continue Unit expansion with matching artwork; refine concealed package placement and plug installation only with exact assembly evidence. |
| Unit | Unit NFC | modeled | 24 × 48 × 8 | Continue Unit expansion with matching source artwork; improve concealed assembly only with official physical-layout evidence. |
| Unit | Unit ADC v1.1 | modeled | 24 × 32 × 10.2 | Continue Unit expansion with matching artwork; refine concealed installation with exact assembly evidence. |
| Unit | Unit AMeter | modeled | 24 × 56 × 8 | Continue Unit expansion with matching artwork; refine concealed installation only with official assembly evidence. |
| Unit | Unit VMeter | modeled | 24 × 56 × 8 | Continue Unit expansion with matching artwork; refine LED color and concealed installation only when exact official assembly evidence becomes available. |
| Unit | Unit Tube Pressure | modeled | 24 × 32 × 12.5 | Continue Unit expansion with matching artwork; refine concealed installation only with exact official assembly evidence. |
| Unit | Unit MQ | modeled | 24 × 64 × 25 | Continue Unit expansion with corresponding artwork; refine concealed assembly and installed sensor dimensions only with exact official production drawings. |
| Unit | Unit LoRaE220-920 | modeled | 24 × 71.4 × 8 | Continue adding exact-model Units with synchronized artwork; refine concealed and antenna installation datums if production assembly evidence becomes public. |
| Unit | Unit Watering | modeled | 26.5 × 192.8 × 33 | Continue exact-model Unit expansion with synchronized artwork; refine concealed pump/hose installation only when production assembly dimensions are available. |
| Unit | Unit HBridge v1.1 | modeled | 24 × 56 × 10.2 | Continue Unit expansion with matching artwork; refine hidden assembly with official manufacturing evidence. |
| Unit | Unit DLight | modeled | 24 × 32 × 8 | Continue Unit expansion with matching artwork;refine concealed installation only with exact official assembly evidence. |
| Unit | Unit DCSSR | modeled | 45 × 80 × 31 | Continue Unit expansion with matching artwork;refine inferred DC SSR assembly and native tongue travel when exact U140 production dimensions become available. |
| Unit | Unit NCIR2 | modeled | 24 × 48 × 8 | Continue Unit expansion with matching artwork;refine concealed assembly only with exact official assembly evidence. |
| Unit | Unit Reflective IR | modeled | 24 × 32 × 12 | Continue Unit expansion with matching artwork;refine hidden installation/trimmer travel only with exact official assembly evidence. |
| Unit | Unit Thermal2 | modeled | 24 × 48 × 8 | Continue Unit expansion with matching artwork;refine concealed assembly only with exact official assembly evidence. |
| Unit | Unit FlashLight | modeled | 24 × 32 × 8 | Continue Unit expansion with matching artwork;refine hidden selector/LED installation only with exact official assembly evidence. |
| Unit | Unit GPS SMA | modeled | 24 × 71.4 × 8 | Continue exact-model Unit expansion with synchronized artwork;refine concealed SMA adapter and accessory installation if official production assembly evidence appears. |
| Unit | Unit BLDC Driver | modeled | 24 × 32 × 11.3 | Continue Unit expansion with matching artwork;refine hidden terminal installation only with exact official assembly evidence. |
| Unit | Unit RCA | modeled | 24 × 36.4 × 8 | Continue Unit expansion with matching artwork;refine hidden S1/socket installation only with exact official assembly evidence. |
| Unit | Unit Puzzle | modeled | 24 × 24 × 15 | Continue exact-model Unit expansion with synchronized artwork;refine actual rigid Bridge fit if authoritative production assembly evidence appears. |
| Unit | Unit RS485-ISO | modeled | 24 × 56 × 10.2 | Continue exact Unit expansion with matching artwork;refine LED emitted color,shared drawing attribution and accessory installation only when exact official evidence appears. |
| Unit | Unit AIN4-20mA | modeled | 24 × 56 × 11.3 | Continue Unit expansion with matching artwork;refine hidden connector/header assembly only with exact official installed geometry. |
| Unit | Unit AC Measure | modeled | 24 × 56 × 10.3 | Continue Unit expansion with matching artwork;refine hidden terminal installation only with exact official assembly evidence. |
| Unit | Unit UWB | modeled | 24 × 48 × 8 | Continue exact Unit expansion with matching artwork;refine concealed BU01 installation only with new exact-model evidence. |
| Unit | Unit TMOS PIR | modeled | 24 × 32 × 8 | Continue Unit expansion with matching artwork;refine concealed installation or dimension attribution only when exact official assembly/revision evidence becomes available. |
| Unit | Unit Mini ToF-90° | modeled | 24 × 24 × 8 | Continue exact Unit expansion with matching artwork;refine concealed planes,guide coupling and installation only when authoritative assembly data appears. |
| Unit | Unit Roller485-Lite | modeled | 40 × 40 × 40 | Continue exact Unit expansion with artwork;refine motor assembly datum only on new Lite-specific dimensional evidence. |
| Unit | Unit Mini CAN | modeled | 24 × 32 × 10.2 | Continue exact Unit expansion with matching artwork;refine concealed board/terminal installation only when authoritative assembly data appears. |
| Unit | Unit INA226-10A | modeled | 24 × 58 × 10.2 | Continue exact Unit expansion with matching artwork;refine socket projection/installation only when official assembly clarification appears. |
| Unit | Unit Mini PDM | modeled | 24 × 24 × 13 | Continue exact Unit expansion with matching artwork;resolve official13mm versus8mm dimension discrepancy if authoritative corrected data appears. |
| Unit | Unit Mini BPS v1.1 | modeled | 24 × 24 × 8 | Continue Unit expansion with matching artwork;refine concealed installation only when exact official assembly/revision evidence becomes available. |
| Unit | Unit MIC | modeled | 24 × 32 × 8 | Continue exact Unit expansion with matching artwork;refine concealed installation and mechanical head range only when authoritative own-model assembly data appears. |
| Unit | Unit Accel | modeled | 32 × 24 × 8 | Continue exact Unit expansion with matching artwork;use authoritative production electronics assembly if later available to refine inferred hidden installation. |
| Unit | Unit OP90 | modeled | 24 × 32 × 12.8 | Continue exact Unit expansion with corresponding artwork;refine concealed installed package details only if authoritative exact assembly evidence appears. |
| Unit | Unit OP180 | modeled | 36 × 24 × 8.8 | Continue exact Unit expansion with matching artwork;refine concealed optical installation only when authoritative own-model assembly data appears. |
| Unit | Unit ID | modeled | 24 × 24 × 8 | Continue exact Unit expansion with matching artwork;use authoritative production electronics assembly if later available to refine inferred hidden installation. |
| Unit | Unit RF433R | modeled | 48 × 24 × 8 | Continue exact Unit expansion with matching artwork;refine inferred concealed installation if authoritative U113 production PCB/BOM becomes available. |
| Unit | Unit RF433T | modeled | 24 × 48 × 8 | Continue exact Unit expansion with corresponding artwork;refine hidden installation/copper layout only if authoritative exact production assembly evidence appears. |
