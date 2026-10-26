# m5stack-models.js

## 最新本地增量：NBIoT2 / NBIoT-CN / Mini Proto

当前本地151款（14主机、137Unit），全部 `modeled`、`verified` 为0。本批新增`nbiot2` U111-B、`nbiot-cn` U112、`mini-proto` U064及5张本款普通PNG。本次Git同步包含这151款源码，新增八批共24款及48张PNG；提交与远端状态以Git日志为准，见[151款同步记录](docs/GIT-SYNC-151-2026-10-27.md)。下方各前批检查点中的Git数量与未推送描述保留其历史时点。真实结构/配置/API见[本批接入指南](docs/NBIOT-MINI-PROTO-UNITS.md)，38批范围见[增量索引](docs/LOCAL-EXPANSION.md)。

NBIoT2 U111-B与NBIoT-CN U112分别保SIM7028/SIM7020C本款通信载体、板/卡座、Grove/普通SMA及自身机身；各自官方CAD路径壳字节相同只说明发布壳源相同，不推出内部、标签或天线相同。默认不凭空附SIM卡，真实后盖服务配置才暴露原遮挡内部。天线按本款官图独立可拆，只有真实可辨结构才给外驱关节，尺寸/轴/展示角推导不称量产止挡。D1外光路未证不造外灯或把金色安装窗当按钮。

Mini Proto U064保自身3222原装面、48个真实贯孔/孔壁镀层/双面焊环的洞板、Grove和实际背标，后盖服务只去真实盖及对应印刷，不借U022孔网或附用户电路。三款内部蜂窝/RF/AT/UART、SIM内容、网络、固件、传感值与供电电气由其他框架实现；隐藏安装与附件配合推导分记。

贴纸同步本款原稿栅格或本款清楚官图代码重绘，逐款分列来源；不裁照片/借错型号/编小字/靠PNG填缺件。所有入口实际配置artwork:false保全部物理attributes/index/matrixWorld。必要专项 `node scripts/check-nbiot-mini-proto-units.mjs`，实际分支四芯/动作固定分离/独立装拆、8导出、两build及5188源PNG/运行chunk字节范围见[本批进度](artifacts/nbiot-mini-proto-expansion/progress.json)。未逐面浏览器/GPU、全量历史、制造或实物验收；私表/URL/原稿名/矢量/映射/生成器/中间件继续分发树外。


## 前批检查点：Weight / SSR / PoE CAM-W v1.1

该批保存时本地148款（14主机、134Unit），全部 `modeled`、`verified` 为0。本批新增 `weight` U030、`ssr` U122、`poe-cam-w-v11` U121-B-V11及6张本款PNG。GitHub `main`保持已同步127款 `3681a64`；随后七批共21款、43张PNG未再次提交推送，历史见[127款记录](docs/GIT-SYNC-127-2026-10-26.md)。真实结构/配置/API见[Weight/SSR/PoECAM](docs/WEIGHT-SSR-POECAM-UNITS.md)，37批范围见[增量索引](docs/LOCAL-EXPANSION.md)。

Weight保本款HX711/DAT-CLK原装壳/板/Grove/四位端子与可拆四螺钉插头，不套Weight-I2C/MCU/I2C，不附传感器/秤台或造sensor读数。SSR保MOC3043M/BT136S本款小型壳/板/橙4P端子与可拆四头插头，不套ACSSR/DCSSR控制器/RS485/DELIXI；内部D1光路未证时固定不发光，无虚构relay状态或接触臂。螺钉只外驱工具头角，固定夹座/孔壁/插舌/簧片保持，推导配合不冒充轴向夹紧或量产止挡。

PoE CAM-W v1.1保U121-B-V11/OV3660、本款原生壳/相机夹持件/Stand/Brick，不借UnitV2/CamS3。RJ45/Grove、user/reset及实际下载/扩展结构按可达面表达，灯仅真实载体/原孔光路，不造USB、假RGB或固定镜头关节。Stand只给真实单轴相对角，不自动固定地面或求解主机世界姿态。隐藏安装/控件行程/附件配合推导分记，固件、摄像/视频/AI、网络/PoE、传感值、电气/供电和协议由外部框架实现。

本批贴纸同步原稿栅格/官图代码重绘，按各自来源记录区分；不裁照片/借错型号/编不可辨小字/靠印刷填缺件。各入口实际配置artwork:false保全部物理attributes/index/matrixWorld。必要专项 `node scripts/check-weight-ssr-poecam-units.mjs`，真实三分支四芯、螺钉/按键/支架及固定件、独立装拆、10导出/两build及5188源PNG/运行chunk字节范围见[本批进度](artifacts/weight-ssr-poecam-expansion/progress.json)。未新增逐面浏览器/GPU、全量历史、制造或实物验收；私表/URL/原稿名/映射/矢量/生成器/中间件继续分发树外。


## 前批检查点：UnitV2 / LoRaWAN-CN470 / Proto

该批保存时本地145款（14主机、131Unit），全部 `modeled`、`verified` 为0。本批新增 `unitv2` U078-D、`lorawan-cn470` U184-CN470、`proto` U022及4张本款PNG。GitHub `main`保持已同步127款 `3681a64`；随后六批共18款、37张PNG尚未再次提交推送，历史见[127款记录](docs/GIT-SYNC-127-2026-10-26.md)。实际结构/配置/API见[UnitV2/LoRaWAN-CN470/Proto](docs/UNITV2-LORAWAN-PROTO-UNITS.md)，36批范围见[增量索引](docs/LOCAL-EXPANSION.md)。

UnitV2严格U078-D/GC2145与本款原壳，真实镜头/麦克风、user、实际内部红白LED（外部可见光路未证）、USB-C/Grove/卡座和安装结构；实际风扇只外驱叶轮，固定框/电机保持，卡/50cmUSB线/单轴支架/Back-Brick按各自装拆和配置表达。支架只表现真实单轴相对角，不自动求解地面或主机世界姿态。LoRaWAN-CN470是本款RAK3172(L)/蓝Grove/普通SMA与195mm配套天线，不借其他频段或蜂窝器件；有限肘关节范围为本款结构的视觉重建，不称量产止挡。Proto保本款完整壳、7×11共77个真实贯孔/金属环/基材、Grove和真实后盖服务视图，前裸板不造胶贴、用户电路或虚构控件。内部视频/AI、RF网络、电气/供电、固件和协议由外部框架实现。

印刷同步本款真实表面：缺本款机身原稿时按可读官图代码准确重绘普通PNG、记录来源和字形/颜色/配准推导；不裁照片/借错型号/编不可辨小字/用PNG遮缺件。两入口及各实际配置artwork:false保全部物理attributes/index/matrixWorld。必要专项 `node scripts/check-unitv2-lorawan-proto-units.mjs`，真实控件/附件动作与固定件、三分支四芯和独立装拆、11导出/两build及5188源PNG/运行chunk字节范围见[本批进度](artifacts/unitv2-lorawan-proto-expansion/progress.json)。没有新增逐面浏览器/GPU、全量历史、制造或实物验收；私表/URL/映射/原稿名/矢量/生成器/中间件继续留分发树外。


## 前批检查点：PoE-P4 / Cat1-CN / Grove-to-Grove

该批保存时本地142款（14主机、128Unit），全部 `modeled`、`verified` 为0。本批新增 `poe-p4` U213、`cat1-cn` U204、`grove-to-grove` U148和8张本款PNG。GitHub `main`保持已同步127款 `3681a64`；随后五批共15款、33张PNG尚未再次提交推送，历史见[127款记录](docs/GIT-SYNC-127-2026-10-26.md)。实际结构/多入口/API见[PoE-P4/Cat1/Grove](docs/POEP4-CAT1-GROVE-UNITS.md)，35批范围见[增量索引](docs/LOCAL-EXPANSION.md)。

PoE-P4以自身同位6158源三角壳/背盖为基线，仅按本款官图修正Host USB-C与Hat2封闭面形成闭合实际开口，原/派生面数与区域分列，不称未改CAD；真实RJ45/双USB-C/两24pinFPC、9/6孔黑塑料female排座、独立16pin Hat2与Grove/内部板器件齐；user弯曲原壳舌，独立rgb/link-led/activity-led外驱，IR只实体无光束，不附未随套装提供的屏/相机/USB或网线。Cat1-CN保完整6562原面，前2714/后3848严格对应；rearCover:false只去真实后盖/背膜/3螺钉，保前壳/PCB/内部SIM与馈线，服务sim锚不穿闭壳。普通SMA外螺纹中心孔与本款108×10内螺纹中心针天线、实际肘关节有限0–90外驱/独立装拆，不套RP-SMA；USB仅测试点/无证外灯光路不造口灯。Grove-to-Grove保3974本款原面/三带针socket/4IC和R-C，黑grove、白in/out可独立四芯，不造direct入口、按钮或传感值。内部协议/网络/供电/电气由外部框架实现，隐藏安装和运动范围推导在单品来源列明。

同步印刷：PoE-P4四片与Cat1-CN正背两片为严格本款机身source-vector-raster，包装/视图排除；Grove-to-Grove正背两片reference-redraw。不裁照片/借错型号/编小字/PNG遮缺件，真实膜/壳/PCB/腔壁/触点/控件/附件独立存在。必要专项 `node scripts/check-poep4-cat1-grove-units.mjs`，两入口各真实配置artwork:false全部物理attributes/index/matrixWorld、实际user压放取消/固定件/独立灯、天线有限角与后盖服务、真实三分支四芯/多口装拆范围见[本批进度](artifacts/poep4-cat1-grove-expansion/progress.json)。没有新增逐面浏览器/GPU、全量历史、制造或实物验收；私表/URL/映射/原稿名/矢量/生成器/中间件继续分发树外。


## 前批检查点：Glass2 / TypeC-to-Grove / DoF10

该批保存时本地139款（14主机、125Unit），全部 `modeled`、`verified` 为0。本批新增 `glass2` U158-B、`typec-to-grove` U151、`dof10` U230和8张本款PNG。GitHub `main`保持已同步127款 `3681a64`；随后四批共12款、25张PNG尚未再次提交推送，历史见[127款记录](docs/GIT-SYNC-127-2026-10-26.md)。具体API/推导见[Glass2/TypeC/DoF10](docs/GLASS-TYPEC-DOF10-UNITS.md)，34批范围见[增量索引](docs/LOCAL-EXPANSION.md)。

Glass2按本款完整尺寸PDF与拆盖图独立重建（无本款CAD，不借旧Glass）；真实透光玻璃/FPC/PCB/安装件与双Grove齐备，128×56可见浅蓝OLED接受外部framebuffer，熄灭像素透明，不套黑底或猜控制器128×64的其余8行映射。U151保完整本款原壳、三前向Grove/USB-C/被动PCB与两CC电阻，canonical input及两输出可独立四芯装拆；不造供电状态或电气路由。DoF10保完整本款原壳、BMI270/BMM350/SPA06-003与真实槽中两档address拨杆；只有白色拨片/杆随动，取消保持稳定档，sensor被动状态空，无传感值/自动姿态/地址通信。几何包络/名义尺寸冲突、隐藏安装及行程推导均按本款来源列明。

同步印刷：Glass2前盖板/后PCB2张reference-redraw，TypeC三片本款标签3张reference-redraw，DoF10机身前/轴向圆贴/背3张source-vector-raster（排包装/视图候选）；不裁照片/借错型号/编小字/PNG遮缺件。必要专项 `node scripts/check-glass-typec-dof10-units.mjs`，两入口及各实际配置artwork:false全部物理attributes/index/matrixWorld、外部像素/透明材质、稳定档/固定件及真实三分支四芯/双输出接线范围见[本批进度](artifacts/glass-typec-dof10-expansion/progress.json)。没有新增逐面浏览器、GPU显示、全量历史、制造或实物验收；私表/链接/映射/原稿名/矢量/生成器/中间件继续分发树外。


## 前批检查点：C6L / Gateway H2 / ChainBus

该批保存时本地136款（14主机、122Unit），全部 `modeled`、`verified` 为0。本批新增 `c6l` U202、`gateway-h2` U195、`chainbus` U212和8张本款PNG。GitHub `main`保持已同步127款 `3681a64`；随后三批共9款、17张PNG尚未再次提交推送，历史见[127款记录](docs/GIT-SYNC-127-2026-10-26.md)。本批实际结构/多入口/API和限制见[C6L/GatewayH2/ChainBus](docs/C6L-GATEWAY-CHAINBUS-UNITS.md)，33批范围见[增量索引](docs/LOCAL-EXPANSION.md)。

C6L保64×48 OLED外部framebuffer、真实user/reset压放取消、独立rgb/status、USB/Grove和双RP-SMA配套天线；蜂鸣器只实体，长按不自动变灯或执行固件。GatewayH2默认完整闭壳仅grove，shell:false明确裸板配置才注册真实boot/usb/download六镀孔锚，0printed，不挖外壳/不穿壳点控件/不造塑料排座或无线光效。ChainBus左右蓝IN/OUT可四芯级联，白EXT是真实四腔plug，额外DirectModule直接装入hostsocket且无VisualCable/额外白源插头；ext自身拒普通GroveModule插头对插头，rgb仅外驱，无自动协议/电气路由。

C6L背面为本款原稿栅格；前标保留原字形/标志，仅按当前官图修订频段带，明确source-vector-raster-and-reference-redraw（排除原稿版本冲突），天线实际印刷按各自来源记录；GatewayH2候选均非机身原稿，正背2张reference-redraw；ChainBus正背2张精确source-vector-raster。印刷不替代壳/PCB/腔/触点/显示/键/天线，实际载体独立存在。必要专项 `node scripts/check-c6l-gateway-chainbus-units.mjs`，两入口/ChainBus三入口及各配置artwork:false全物理attributes/index/matrixWorld和接线/直接装拆/拒错/固定件/独立灯与framebuffer范围见[本批进度](artifacts/c6l-gateway-chainbus-expansion/progress.json)。没有新增逐面浏览器、全量历史、制造或实物验收；私表/链接/映射/原稿名/矢量/生成器/中间件继续仓库外。


## 前批检查点：Finger / 3.96 / Scales

该批保存时本地133款（14主机、119Unit），全部 `modeled`、`verified` 为0。本批新增 `finger` U008、`unit-396` U020、`scales` U108和3张本款背贴PNG；三款官图均只证实背贴，Scales顶面M5是原生浮雕，不造正面贴纸。GitHub `main`保持已同步127款 `3681a64`，随后ZigBee/CO2L/INA226-1A及本批共6款、9张PNG尚未再次提交推送，历史见[127款记录](docs/GIT-SYNC-127-2026-10-26.md)。完整来源/API及限制见[Finger/3.96/Scales](docs/FINGER-396-SCALES-UNITS.md)，32批范围见[增量索引](docs/LOCAL-EXPANSION.md)。

Finger严格FPC1020A电容式采集面、金属边框与真实模块，只 `grove`和被动`sensor`；U008内部touch-wake选项未接，不造机械键/触摸电气或外灯。3.96严格本款被动HY2.0转接、固定四位座与可拆四螺钉母插头 `terminal/screw-1…4`；只端口/可见头角度，不发明电气路由。Scales保本款底座/承载板/原生圆盖完整装配及真实称重组件/板/支撑，实际`tare`键压放/取消回位与独立外驱`rgb`；清零意图不自动改灯或重量，不造承载盘下沉joint。内部指纹/身份/UART、重量/质量/力学/清零/I2C及电气/固件由外部框架负责。

3PNG均为本款官方照片代码重绘 `reference-redraw`；实际膜/壳面、原生浮雕、PCB/封装/腔壁/触点独立存在。`artwork:false`保留两入口及各配置全部物理attributes/index/matrixWorld。必要专项 `node scripts/check-finger-396-scales-units.mjs`，保存范围见[本批进度](artifacts/finger-396-scales-expansion/progress.json)；没有新增逐面浏览器、全量历史、制造或实物验收。私表、私有链接/映射/原稿名、矢量、生成器及中间材料保仓库外。


## 前批检查点：ZigBee / CO2L / INA226-1A

127款已同步至GitHub `main`，基线 `3681a64`；该批新增 `zigbee` U110、`co2l` U104、`ina226-1a` U200-1A，共130款（14主机、116Unit），全部 `modeled`、`verified` 为0。本批三款和6张对应PNG尚未再次提交推送；同步历史见[127款记录](docs/GIT-SYNC-127-2026-10-26.md)，本批外形/API及限制见[ZigBee/CO2L/INA226-1A](docs/ZIGBEE-CO2L-INA226-1A-UNITS.md)。31批来源/范围见[增量索引](docs/LOCAL-EXPANSION.md)。

ZigBee保真实DRF1609H载板/SMA、可拆胶棒天线和外驱 `sma/tilt`；CO2L严格SCD41/VRH3301NLX、真实通气结构和被动 `sensor`；INA226-1A使用本款80mR/保险器件、固定四位座与可拆四螺钉插头 `terminal/screw-1…4`。三款均无证实外露按键/灯，内部S1/D1/D2不造外部控制或光窗；内部RF/UART、CO2/温湿度、电流/电压/功率、协议和电气交外部框架。本款名义尺寸、原壳包络及附件安装推导分别记录，不把源码实现当量产配合验收。

6张PNG为ZigBee/CO2L各2张 `reference-redraw` 与INA226-1A本机1A/80mR两片原稿转 `source-vector-raster`；剔除包装和10A贴纸。`artwork:false`保留两入口/各配置全部物理attributes/index/matrixWorld、真实膜或壳面、PCB/封装/腔壁和接口。必要专项 `node scripts/check-zigbee-co2l-ina226-1a-units.mjs`，保存范围见[本批进度](artifacts/zigbee-co2l-ina226-1a-expansion/progress.json)；没有新增逐面浏览器、全量历史或实物验收。表格、私有链接/原稿名、矢量、生成器和中间材料继续仓库外。


已修复AC Measure、AIN4-20mA、BLDC Driver可拆端子四孔下缘的缺面；端口、四螺钉外驱、标签与外包络保持。两份构建/回归和预览资源检查通过，[修复范围](docs/TERMINAL-TONGUE-CLOSURE.md)与各历史检查点分别记录。该修复保存时118款；当时本地随后6款及该修复尚未再次推送，公开Git112基线为32c95e0。当前增量以本文最新批次记录为准。

本库提供M5Stack主机与Unit的毫米尺度交互模型，支持实体按键压放、旋钮/推子/稳定开关、外驱灯光、屏幕framebuffer和Grove多级接线。此前增加ID、RF433R、RF433T，同步6张本款参考重绘PNG；真实芯片封装/引脚、PCB、Grove深腔/触点与胶贴基底均独立。三款本体均只有Grove，无sensor/按钮/关节/灯/显示；R/T内置PCB天线固定不发光，不造外接天线、观察窗或RF动效。身份/密钥/证书/加密/I2C与RF/ASK/数据/强度/距离/通信、电气和固件交外部框架。[本批接入](docs/ID-RF433-UNITS.md)与此前[Accel/OP90/OP180](docs/ACCEL-OP90-OP180-UNITS.md)等记录保留；全部 `modeled`，必要专项为 `node scripts/check-id-rf433-units.mjs`，综合范围以[本批进度](artifacts/id-rf433-expansion/progress.json)为准。

[本地增量批次索引](docs/LOCAL-EXPANSION.md)汇总当前工作区的模型、API与检查点，供查阅模型、API和各批检查范围。

本次Git同步源码包含 **127款：14款主机、113款Unit**；从112款基线新增15款Unit及28张对应PNG，并纳入三旧端子闭合修复。范围、必要检查和保留事项见[127款源码同步记录](docs/GIT-SYNC-127-2026-10-26.md)。此前[112款同步记录](docs/GIT-SYNC-112-2026-10-26.md)与[85款同步记录](docs/GIT-SYNC-2026-10-26.md)保留为历史快照；远端状态以GitHub main及实际推送回执为准。

本次15款增量为UWB、TMOS PIR、Mini ToF-90、Roller485 Lite、Mini CAN、INA226-10A、Mini PDM、Mini BPS v1.1、MIC、Accel、OP90、OP180、ID、RF433R、RF433T，均带对应贴纸。30批来源/API/必要检查范围见[增量索引](docs/LOCAL-EXPANSION.md)。历史progress中的未提交、未推送和本地HEAD字样只描述保存时点。

Weight-I2C 与8Servos现可选择随附的可拔插4P螺钉端子，四个螺钉角度独立外驱；默认空座、固定几何与Grove连接保留。用法见[可拆端子接入](docs/UNIT-TERMINALS.md)。

此前43款的贴纸批次保留：每款默认外观至少有一处印刷，部分面仍缺；50张参考重绘PNG尚未完成全批复核。原稿栅格、参考重绘和7款可选中文教学版的准确范围见[贴纸覆盖记录](docs/STICKER-COVERAGE.md)。

基于 Three.js 与 sticks3.js 建模方法的 M5Stack 毫米尺度交互模型库。当前本地包含 **14款主机、137款Unit，共151款模型**，全部保持 `modeled`，`verified` 为0。此前各批验收记录均对应各自源码快照。

近期校正 **Thermal／Angle／Encoder PCB孔内壁**：保留原孔位与实体曲面，修正默认FrontSide下不可见的内壁；旋转、按压回弹及Grove接线接口保持。新的回归覆盖真实孔内壁法线与定向闭合，历史单品验收仍对应各自源码快照。

[本批验证](artifacts/pcb-winding-repair/public/review.json) · [PCB孔内壁说明](docs/PCB-HOLE-WINDING.md)

![NCIR U028实体装配](artifacts/ncir-detail/public/views/ncir-iso-close.png)

本批细化 **NCIR U028**：保留官方原壳和真实环隙，补齐标准TO39金属筒、凸冠、Ø3.5凹入光窗、玻璃封接圈、四引脚、PCB真孔和开放Grove。封装肩高与最高点分开，插座按自身10×5.2 mm机械图对齐。

七视图/近景、静态光学、StickS3→HUB→NCIR四芯接线/姿态/拆卸及专项几何证据见下列记录。隐藏PCB、安装yaw、法兰厚度与裁脚仍为外观推导；有限数字检查不代表制造配合或实物光学。全部43款继续modeled；正式贴纸进度见[覆盖清单](docs/STICKER-COVERAGE.md)。

[NCIR验证](artifacts/ncir-detail/public/review.json) · [来源审计](artifacts/ncir-detail/public/source-audit.json) · [建模与坐标迁移](docs/NCIR-MODEL-NOTES.md) · [Agent接入](docs/AGENT-INTEGRATION.md)

### 上一批：Thermal U016

以下为已发布Thermal批次的历史证据与限制。

![Thermal U016实体装配](artifacts/thermal-detail/public/views/thermal-iso-close.png)

此前细化 **Thermal U016**：保留官方CAD外壳，补齐110°黑色光学封装、浅漏斗、小光窗、金属header、节圆四脚、板体与开放Grove。包体完整高度与PCB位置共同校正，Grove按自身10×5.2 mm机械图和CAD入口对齐。

公开构建独立check/build/status及实际浏览器8场景、15张原生PNG通过，覆盖七视图、静态光学稳定性、三个近景及StickS3→HUB→Thermal四芯接线/姿态/拆卸。15对独立公开图与冻结原图RGB一致。凹深、装后裁短脚、板形/高度和安装yaw仍含视觉推导；有限数字采样不代表制造配合或实物光学。全部43款仍为modeled。

[Thermal验证](artifacts/thermal-detail/public/review.json) · [来源审计](artifacts/thermal-detail/public/source-audit.json) · [建模与坐标迁移](docs/THERMAL-MODEL-NOTES.md) · [Agent接入](docs/AGENT-INTEGRATION.md)

### 更早批次：Angle U005

以下为已发布Angle批次的历史证据与限制。

![Angle U005实体装配](artifacts/angle-detail/public/views/angle-assembly-close.png)

此前细化 **Angle U005**：按自身机械图校正轴心Y8与含齿帽Ø9.5；补齐蓝色固定底板、银色金属框、盲孔和轴杆，重建PCB孔柱与Grove通道避让。原CAD壳保持；旋钮接受外部绝对角度，固定件保持不动。

公开构建独立check/build/status及实际浏览器13场景、18张原生PNG通过，覆盖七视图、37/−90/150°定位与精确复位、StickS3→HUB→Angle四芯接线/姿态/拆卸。18对独立公开图与冻结原图RGB一致。隐藏尺寸与机械限位仍未确认，有限数字采样不代表制造配合；全部43款仍为modeled。

[Angle验证](artifacts/angle-detail/public/review.json) · [来源审计](artifacts/angle-detail/public/source-audit.json) · [建模与坐标迁移](docs/ANGLE-MODEL-NOTES.md) · [Agent接入](docs/AGENT-INTEGRATION.md)

### 更早批次：Encoder U135

以下为已发布Encoder批次的历史证据与限制。

![Encoder U135实体装配](artifacts/encoder-detail/public/encoder-iso.png)

此前细化 **Encoder U135**：保留官方外壳位置与拓扑，围绕原始轴线补齐直径10mm旋钮、封闭盲帽、PCB、编码器主体和折弯焊腿，补齐下端两颗RGB封装与白壳漫透外观。按下行程为0.35mm，支持旋转、按压和两路外部灯光输入。

![两路RGB外观](artifacts/encoder-detail/public/encoder-leds-both.png)

公开构建已独立通过 `npm run check`、`npm run build` 和预览健康检查。实际浏览器30场景、40张独立原生截图通过，覆盖七视图、双RGB独立点亮与复位、角度和按压、连续18rpm旋转、画布指针与双来源按压，以及StickS3经HUB连接、姿态、可见LED和拆卸。38张静止图与冻结原始截图逐张RGB一致；两张连续旋转图保留实时相位和差异。原始console、请求、运行时哈希及截图字段完整保存，应用请求失败与阻断错误为0。

![接线后可见LED](artifacts/encoder-detail/public/sticks3-hub-encoder-visible-led0-on.png)

[Encoder独立验证](artifacts/encoder-detail/public/review.json) · [来源审计](artifacts/encoder-detail/public/source-audit.json) · [下游Agent接入](docs/AGENT-INTEGRATION.md)

Encoder自身Grove接口中心Z从0迁移至−0.6mm，默认GroveModule自动对齐；显式unitPose仍表示装配原点。Port挂接回调、父子装配和已有接口保持兼容，调用约束见Agent接入文档。

**贴纸与参考重绘按[覆盖清单](docs/STICKER-COVERAGE.md)逐款接入，未还原面继续明确保留缺项。** 隐藏PCB与封装尺寸、折腿、0.35mm行程和漫透效果仍含外观推导，左右灯的视觉地址不代表原理图LED编号。有限几何采样与浏览器渲染不证明制造配合、固件行为、正交脉冲、电气或光学性能。StackChan生产基准与隐藏交叠、Heart既有PCB边缘交叠继续记录为待解决项。

## 本地运行

需要 Node.js 22.12+。

```sh
npm ci
npm run check
npm run build
./manage.sh start
```

打开 http://127.0.0.1:5188 。使用 `./manage.sh status|logs|stop|help` 管理预览，或运行 `npm run dev` 开发。各批检查覆盖实体压放、关节、Unit线缆装配及主机接口；实际产品范围与通过数以相应 `artifacts/` 报告的源码快照和产品列表为准。浏览器视觉检查与实物配合分别记录，不以构建成功替代外观验收。

## 使用与分发

`src/core/` 保留 Device / Module / Component 接口，`src/devices/` 与 `src/units/` 按产品提供实现，`demo/` 展示浏览器交互，`catalog/products.json` 记录产品与进度。产品入口可按需导入；共享入口为 `src/index.js`。

[动态 API 与下游接入](docs/AGENT-INTEGRATION.md) · [视觉运动](docs/VISUAL-MOTION.md) · [Grove 线缆](docs/GROVE-CABLE.md) · [集成边界](docs/INTEGRATION.md) · [分发范围](docs/PUBLISHING.md)

当前分发经许可的普通栅格贴纸，原表、矢量原稿及转换中间文件保存在仓库外，照片裁切贴纸继续停用。分发源码包含几何/API专项与原创展示证据，排除官方本地照片、尺寸图/PDF、原始 STL、MCP 长篇原文和私有研究历史。目录参考图由浏览器加载官方原 URL，联网可用性取决于源站；来源 URL、Git blob 与 SHA-256 见 [source-manifest.json](source-manifest.json)。前期截图保存在 `artifacts/dynamics/` 和 `artifacts/refinement/`，属于各自历史快照，不能替代本轮证据。

## 许可

本项目自有新增代码使用 **MIT**，允许复用、修改和分发，完整条款见 [LICENSE](LICENSE)。第三方代码、CAD 衍生几何与依赖继续保留来源和许可，见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) 与 `licenses/`。项目许可不重新授权远程照片、第三方商标或其他未包含资产。

`package.json` 保留 `private: true` 以防意外发布到 npm；这不限制 GitHub 源码的 MIT 许可。私有研究仓库保留原名称与历史，公开分发使用独立目录和历史。
