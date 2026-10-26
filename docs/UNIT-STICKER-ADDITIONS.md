# 新增 Unit 贴纸接入

## 最新本地增量：NBIoT2 / NBIoT-CN / Mini Proto

当前本地151款（14主机、137Unit），全部 `modeled`、`verified` 为0。本批新增`nbiot2` U111-B、`nbiot-cn` U112、`mini-proto` U064及5张本款普通PNG。本次Git同步包含这151款源码，新增八批共24款及48张PNG；提交与远端状态以Git日志为准，见[151款同步记录](GIT-SYNC-151-2026-10-27.md)。下方各前批检查点中的Git数量与未推送描述保留其历史时点。真实结构/配置/API见[本批接入指南](NBIOT-MINI-PROTO-UNITS.md)，38批范围见[增量索引](LOCAL-EXPANSION.md)。

NBIoT2 U111-B与NBIoT-CN U112分别保SIM7028/SIM7020C本款通信载体、板/卡座、Grove/普通SMA及自身机身；各自官方CAD路径壳字节相同只说明发布壳源相同，不推出内部、标签或天线相同。默认不凭空附SIM卡，真实后盖服务配置才暴露原遮挡内部。天线按本款官图独立可拆，只有真实可辨结构才给外驱关节，尺寸/轴/展示角推导不称量产止挡。D1外光路未证不造外灯或把金色安装窗当按钮。

Mini Proto U064保自身3222原装面、48个真实贯孔/孔壁镀层/双面焊环的洞板、Grove和实际背标，后盖服务只去真实盖及对应印刷，不借U022孔网或附用户电路。三款内部蜂窝/RF/AT/UART、SIM内容、网络、固件、传感值与供电电气由其他框架实现；隐藏安装与附件配合推导分记。

贴纸同步本款原稿栅格或本款清楚官图代码重绘，逐款分列来源；不裁照片/借错型号/编小字/靠PNG填缺件。所有入口实际配置artwork:false保全部物理attributes/index/matrixWorld。必要专项 `node scripts/check-nbiot-mini-proto-units.mjs`，实际分支四芯/动作固定分离/独立装拆、8导出、两build及5188源PNG/运行chunk字节范围见[本批进度](../artifacts/nbiot-mini-proto-expansion/progress.json)。未逐面浏览器/GPU、全量历史、制造或实物验收；私表/URL/原稿名/矢量/映射/生成器/中间件继续分发树外。


## 前批检查点：Weight / SSR / PoE CAM-W v1.1

该批保存时本地148款（14主机、134Unit），全部 `modeled`、`verified` 为0。本批新增 `weight` U030、`ssr` U122、`poe-cam-w-v11` U121-B-V11及6张本款PNG。GitHub `main`保持已同步127款 `3681a64`；随后七批共21款、43张PNG未再次提交推送，历史见[127款记录](GIT-SYNC-127-2026-10-26.md)。真实结构/配置/API见[Weight/SSR/PoECAM](WEIGHT-SSR-POECAM-UNITS.md)，37批范围见[增量索引](LOCAL-EXPANSION.md)。

Weight保本款HX711/DAT-CLK原装壳/板/Grove/四位端子与可拆四螺钉插头，不套Weight-I2C/MCU/I2C，不附传感器/秤台或造sensor读数。SSR保MOC3043M/BT136S本款小型壳/板/橙4P端子与可拆四头插头，不套ACSSR/DCSSR控制器/RS485/DELIXI；内部D1光路未证时固定不发光，无虚构relay状态或接触臂。螺钉只外驱工具头角，固定夹座/孔壁/插舌/簧片保持，推导配合不冒充轴向夹紧或量产止挡。

PoE CAM-W v1.1保U121-B-V11/OV3660、本款原生壳/相机夹持件/Stand/Brick，不借UnitV2/CamS3。RJ45/Grove、user/reset及实际下载/扩展结构按可达面表达，灯仅真实载体/原孔光路，不造USB、假RGB或固定镜头关节。Stand只给真实单轴相对角，不自动固定地面或求解主机世界姿态。隐藏安装/控件行程/附件配合推导分记，固件、摄像/视频/AI、网络/PoE、传感值、电气/供电和协议由外部框架实现。

本批贴纸同步原稿栅格/官图代码重绘，按各自来源记录区分；不裁照片/借错型号/编不可辨小字/靠印刷填缺件。各入口实际配置artwork:false保全部物理attributes/index/matrixWorld。必要专项 `node scripts/check-weight-ssr-poecam-units.mjs`，真实三分支四芯、螺钉/按键/支架及固定件、独立装拆、10导出/两build及5188源PNG/运行chunk字节范围见[本批进度](../artifacts/weight-ssr-poecam-expansion/progress.json)。未新增逐面浏览器/GPU、全量历史、制造或实物验收；私表/URL/原稿名/映射/矢量/生成器/中间件继续分发树外。


## 前批检查点：UnitV2 / LoRaWAN-CN470 / Proto

该批保存时本地145款（14主机、131Unit），全部 `modeled`、`verified` 为0。本批新增 `unitv2` U078-D、`lorawan-cn470` U184-CN470、`proto` U022及4张本款PNG。GitHub `main`保持已同步127款 `3681a64`；随后六批共18款、37张PNG尚未再次提交推送，历史见[127款记录](GIT-SYNC-127-2026-10-26.md)。实际结构/配置/API见[UnitV2/LoRaWAN-CN470/Proto](UNITV2-LORAWAN-PROTO-UNITS.md)，36批范围见[增量索引](LOCAL-EXPANSION.md)。

UnitV2严格U078-D/GC2145与本款原壳，真实镜头/麦克风、user、实际内部红白LED（外部可见光路未证）、USB-C/Grove/卡座和安装结构；实际风扇只外驱叶轮，固定框/电机保持，卡/50cmUSB线/单轴支架/Back-Brick按各自装拆和配置表达。支架只表现真实单轴相对角，不自动求解地面或主机世界姿态。LoRaWAN-CN470是本款RAK3172(L)/蓝Grove/普通SMA与195mm配套天线，不借其他频段或蜂窝器件；有限肘关节范围为本款结构的视觉重建，不称量产止挡。Proto保本款完整壳、7×11共77个真实贯孔/金属环/基材、Grove和真实后盖服务视图，前裸板不造胶贴、用户电路或虚构控件。内部视频/AI、RF网络、电气/供电、固件和协议由外部框架实现。

印刷同步本款真实表面：缺本款机身原稿时按可读官图代码准确重绘普通PNG、记录来源和字形/颜色/配准推导；不裁照片/借错型号/编不可辨小字/用PNG遮缺件。两入口及各实际配置artwork:false保全部物理attributes/index/matrixWorld。必要专项 `node scripts/check-unitv2-lorawan-proto-units.mjs`，真实控件/附件动作与固定件、三分支四芯和独立装拆、11导出/两build及5188源PNG/运行chunk字节范围见[本批进度](../artifacts/unitv2-lorawan-proto-expansion/progress.json)。没有新增逐面浏览器/GPU、全量历史、制造或实物验收；私表/URL/映射/原稿名/矢量/生成器/中间件继续留分发树外。


## 前批检查点：PoE-P4 / Cat1-CN / Grove-to-Grove

该批保存时本地142款（14主机、128Unit），全部 `modeled`、`verified` 为0。本批新增 `poe-p4` U213、`cat1-cn` U204、`grove-to-grove` U148和8张本款PNG。GitHub `main`保持已同步127款 `3681a64`；随后五批共15款、33张PNG尚未再次提交推送，历史见[127款记录](GIT-SYNC-127-2026-10-26.md)。实际结构/多入口/API见[PoE-P4/Cat1/Grove](POEP4-CAT1-GROVE-UNITS.md)，35批范围见[增量索引](LOCAL-EXPANSION.md)。

PoE-P4以自身同位6158源三角壳/背盖为基线，仅按本款官图修正Host USB-C与Hat2封闭面形成闭合实际开口，原/派生面数与区域分列，不称未改CAD；真实RJ45/双USB-C/两24pinFPC、9/6孔黑塑料female排座、独立16pin Hat2与Grove/内部板器件齐；user弯曲原壳舌，独立rgb/link-led/activity-led外驱，IR只实体无光束，不附未随套装提供的屏/相机/USB或网线。Cat1-CN保完整6562原面，前2714/后3848严格对应；rearCover:false只去真实后盖/背膜/3螺钉，保前壳/PCB/内部SIM与馈线，服务sim锚不穿闭壳。普通SMA外螺纹中心孔与本款108×10内螺纹中心针天线、实际肘关节有限0–90外驱/独立装拆，不套RP-SMA；USB仅测试点/无证外灯光路不造口灯。Grove-to-Grove保3974本款原面/三带针socket/4IC和R-C，黑grove、白in/out可独立四芯，不造direct入口、按钮或传感值。内部协议/网络/供电/电气由外部框架实现，隐藏安装和运动范围推导在单品来源列明。

同步印刷：PoE-P4四片与Cat1-CN正背两片为严格本款机身source-vector-raster，包装/视图排除；Grove-to-Grove正背两片reference-redraw。不裁照片/借错型号/编小字/PNG遮缺件，真实膜/壳/PCB/腔壁/触点/控件/附件独立存在。必要专项 `node scripts/check-poep4-cat1-grove-units.mjs`，两入口各真实配置artwork:false全部物理attributes/index/matrixWorld、实际user压放取消/固定件/独立灯、天线有限角与后盖服务、真实三分支四芯/多口装拆范围见[本批进度](../artifacts/poep4-cat1-grove-expansion/progress.json)。没有新增逐面浏览器/GPU、全量历史、制造或实物验收；私表/URL/映射/原稿名/矢量/生成器/中间件继续分发树外。


## 前批检查点：Glass2 / TypeC-to-Grove / DoF10

该批保存时本地139款（14主机、125Unit），全部 `modeled`、`verified` 为0。本批新增 `glass2` U158-B、`typec-to-grove` U151、`dof10` U230和8张本款PNG。GitHub `main`保持已同步127款 `3681a64`；随后四批共12款、25张PNG尚未再次提交推送，历史见[127款记录](GIT-SYNC-127-2026-10-26.md)。具体API/推导见[Glass2/TypeC/DoF10](GLASS-TYPEC-DOF10-UNITS.md)，34批范围见[增量索引](LOCAL-EXPANSION.md)。

Glass2按本款完整尺寸PDF与拆盖图独立重建（无本款CAD，不借旧Glass）；真实透光玻璃/FPC/PCB/安装件与双Grove齐备，128×56可见浅蓝OLED接受外部framebuffer，熄灭像素透明，不套黑底或猜控制器128×64的其余8行映射。U151保完整本款原壳、三前向Grove/USB-C/被动PCB与两CC电阻，canonical input及两输出可独立四芯装拆；不造供电状态或电气路由。DoF10保完整本款原壳、BMI270/BMM350/SPA06-003与真实槽中两档address拨杆；只有白色拨片/杆随动，取消保持稳定档，sensor被动状态空，无传感值/自动姿态/地址通信。几何包络/名义尺寸冲突、隐藏安装及行程推导均按本款来源列明。

同步印刷：Glass2前盖板/后PCB2张reference-redraw，TypeC三片本款标签3张reference-redraw，DoF10机身前/轴向圆贴/背3张source-vector-raster（排包装/视图候选）；不裁照片/借错型号/编小字/PNG遮缺件。必要专项 `node scripts/check-glass-typec-dof10-units.mjs`，两入口及各实际配置artwork:false全部物理attributes/index/matrixWorld、外部像素/透明材质、稳定档/固定件及真实三分支四芯/双输出接线范围见[本批进度](../artifacts/glass-typec-dof10-expansion/progress.json)。没有新增逐面浏览器、GPU显示、全量历史、制造或实物验收；私表/链接/映射/原稿名/矢量/生成器/中间件继续分发树外。


## 前批检查点：C6L / Gateway H2 / ChainBus

该批保存时本地136款（14主机、122Unit），全部 `modeled`、`verified` 为0。本批新增 `c6l` U202、`gateway-h2` U195、`chainbus` U212和8张本款PNG。GitHub `main`保持已同步127款 `3681a64`；随后三批共9款、17张PNG尚未再次提交推送，历史见[127款记录](GIT-SYNC-127-2026-10-26.md)。本批实际结构/多入口/API和限制见[C6L/GatewayH2/ChainBus](C6L-GATEWAY-CHAINBUS-UNITS.md)，33批范围见[增量索引](LOCAL-EXPANSION.md)。

C6L保64×48 OLED外部framebuffer、真实user/reset压放取消、独立rgb/status、USB/Grove和双RP-SMA配套天线；蜂鸣器只实体，长按不自动变灯或执行固件。GatewayH2默认完整闭壳仅grove，shell:false明确裸板配置才注册真实boot/usb/download六镀孔锚，0printed，不挖外壳/不穿壳点控件/不造塑料排座或无线光效。ChainBus左右蓝IN/OUT可四芯级联，白EXT是真实四腔plug，额外DirectModule直接装入hostsocket且无VisualCable/额外白源插头；ext自身拒普通GroveModule插头对插头，rgb仅外驱，无自动协议/电气路由。

C6L背面为本款原稿栅格；前标保留原字形/标志，仅按当前官图修订频段带，明确source-vector-raster-and-reference-redraw（排除原稿版本冲突），天线实际印刷按各自来源记录；GatewayH2候选均非机身原稿，正背2张reference-redraw；ChainBus正背2张精确source-vector-raster。印刷不替代壳/PCB/腔/触点/显示/键/天线，实际载体独立存在。必要专项 `node scripts/check-c6l-gateway-chainbus-units.mjs`，两入口/ChainBus三入口及各配置artwork:false全物理attributes/index/matrixWorld和接线/直接装拆/拒错/固定件/独立灯与framebuffer范围见[本批进度](../artifacts/c6l-gateway-chainbus-expansion/progress.json)。没有新增逐面浏览器、全量历史、制造或实物验收；私表/链接/映射/原稿名/矢量/生成器/中间件继续仓库外。


## 前批检查点：Finger / 3.96 / Scales

该批保存时本地133款（14主机、119Unit），全部 `modeled`、`verified` 为0。本批新增 `finger` U008、`unit-396` U020、`scales` U108和3张本款背贴PNG；三款官图均只证实背贴，Scales顶面M5是原生浮雕，不造正面贴纸。GitHub `main`保持已同步127款 `3681a64`，随后ZigBee/CO2L/INA226-1A及本批共6款、9张PNG尚未再次提交推送，历史见[127款记录](GIT-SYNC-127-2026-10-26.md)。完整来源/API及限制见[Finger/3.96/Scales](FINGER-396-SCALES-UNITS.md)，32批范围见[增量索引](LOCAL-EXPANSION.md)。

Finger严格FPC1020A电容式采集面、金属边框与真实模块，只 `grove`和被动`sensor`；U008内部touch-wake选项未接，不造机械键/触摸电气或外灯。3.96严格本款被动HY2.0转接、固定四位座与可拆四螺钉母插头 `terminal/screw-1…4`；只端口/可见头角度，不发明电气路由。Scales保本款底座/承载板/原生圆盖完整装配及真实称重组件/板/支撑，实际`tare`键压放/取消回位与独立外驱`rgb`；清零意图不自动改灯或重量，不造承载盘下沉joint。内部指纹/身份/UART、重量/质量/力学/清零/I2C及电气/固件由外部框架负责。

3PNG均为本款官方照片代码重绘 `reference-redraw`；实际膜/壳面、原生浮雕、PCB/封装/腔壁/触点独立存在。`artwork:false`保留两入口及各配置全部物理attributes/index/matrixWorld。必要专项 `node scripts/check-finger-396-scales-units.mjs`，保存范围见[本批进度](../artifacts/finger-396-scales-expansion/progress.json)；没有新增逐面浏览器、全量历史、制造或实物验收。私表、私有链接/映射/原稿名、矢量、生成器及中间材料保仓库外。


## 前批检查点：ZigBee / CO2L / INA226-1A

127款已同步至GitHub `main`，基线 `3681a64`；该批新增 `zigbee` U110、`co2l` U104、`ina226-1a` U200-1A，共130款（14主机、116Unit），全部 `modeled`、`verified` 为0。本批三款和6张对应PNG尚未再次提交推送；同步历史见[127款记录](GIT-SYNC-127-2026-10-26.md)，本批外形/API及限制见[ZigBee/CO2L/INA226-1A](ZIGBEE-CO2L-INA226-1A-UNITS.md)。31批来源/范围见[增量索引](LOCAL-EXPANSION.md)。

ZigBee保真实DRF1609H载板/SMA、可拆胶棒天线和外驱 `sma/tilt`；CO2L严格SCD41/VRH3301NLX、真实通气结构和被动 `sensor`；INA226-1A使用本款80mR/保险器件、固定四位座与可拆四螺钉插头 `terminal/screw-1…4`。三款均无证实外露按键/灯，内部S1/D1/D2不造外部控制或光窗；内部RF/UART、CO2/温湿度、电流/电压/功率、协议和电气交外部框架。本款名义尺寸、原壳包络及附件安装推导分别记录，不把源码实现当量产配合验收。

6张PNG为ZigBee/CO2L各2张 `reference-redraw` 与INA226-1A本机1A/80mR两片原稿转 `source-vector-raster`；剔除包装和10A贴纸。`artwork:false`保留两入口/各配置全部物理attributes/index/matrixWorld、真实膜或壳面、PCB/封装/腔壁和接口。必要专项 `node scripts/check-zigbee-co2l-ina226-1a-units.mjs`，保存范围见[本批进度](../artifacts/zigbee-co2l-ina226-1a-expansion/progress.json)；没有新增逐面浏览器、全量历史或实物验收。表格、私有链接/原稿名、矢量、生成器和中间材料继续仓库外。


2026-10-27。下表保留此前105款新增Unit，本批增加NBIoT2 / NBIoT-CN / Mini Proto及5张本款PNG，现列108款。原稿栅格与参考重绘按单品分列，不能混称来源。当前本地151款（14主机、137Unit），全部modeled/0verified；Git127main3681a64已同步，随后24款/48PNG未再push。38批范围见公开工作副本索引，旧43款/50PNG延期复核边界保持。

| 产品ID | SKU | 当前来源类型 | PNG数 | 具体面与限制 |
| --- | --- | --- | --- | --- |
| `poesp32` | U138 | 原稿膜 / 原稿栅格 | 3 | [来源与配准](research/poesp32/README.md) |
| `cams3-5mp` | U174-B | 原稿栅格 / 原稿膜 | 4 | [来源与配准](research/cams3-5mp/modeling.md) |
| `synth` | U178 | 参考重绘 | 2 | [来源与配准](research/synth/artwork.md) |
| `8angle` | U154 | 原稿膜 / 参考重绘 | 2 | [来源与配准](research/8angle/artwork.md) |
| `pahub-v21` | U040-B-V21 | 原稿栅格 | 2 | [来源与配准](research/pahub-v21/stickers.md) |
| `pbhub-v11` | U041-B | 原稿栅格 | 1 | [来源与配准](research/pbhub-v11/stickers.md) |
| `2relay` | U131 | 原稿栅格 | 3 | [来源与配准](research/2relay/STICKERS.md) |
| `env-pro` | U169 | 原稿栅格 | 1 | [来源与配准](research/env-pro/STICKERS.md) |
| `fingerprint2` | U203 | 原稿栅格 | 2 | [来源与配准](research/fingerprint2/STICKERS.md) |
| `byteswitch` | U191 | 参考重绘 | 2 | [来源与配准](research/byteswitch/artwork.md) |
| `bytebutton` | U192 | 参考重绘 | 2 | [来源与配准](research/bytebutton/artwork.md) |
| `gps-v11` | U032-V11 | 参考重绘 | 2 | [来源与配准](research/gps-v11/artwork.md) |
| `weight-i2c` | U180 | 参考重绘 | 2 | [来源与配准](research/weight-i2c/artwork.md) |
| `8servos` | U165 | 参考重绘 | 3 | [来源与配准](research/8servos/artwork.md) |
| `fader` | U123 | 参考重绘 | 1 | [来源与配准](research/fader/artwork.md) |
| `mini-scales` | U177 | 参考重绘 | 3 | [来源与配准](research/mini-scales/artwork.md) |
| `joystick2` | U024-V2 | 参考重绘 | 1 | [来源与配准](research/joystick2/artwork.md) |
| `gesture` | U127 | 参考重绘 | 1 | [来源与配准](research/gesture/stickers.md) |
| `oled` | U119 | 参考重绘 | 1 | [来源与配准](research/oled/stickers.md) |
| `lcd` | U120 | 参考重绘 | 1 | [来源与配准](research/lcd/stickers.md) |
| `co2` | U103 | 参考重绘 | 1 | [来源与配准](research/co2/stickers.md) |
| `tof4m` | U172 | 参考重绘 | 1 | [来源与配准](research/tof4m/stickers.md) |
| `rtc` | U126 | 参考重绘 | 2 | [来源与配准](research/rtc/stickers.md) |
| `4relay` | U097 | 参考重绘 | 5 | [来源与配准](research/4relay/STICKERS.md) |
| `dmx` | U183 | 参考重绘 | 2 | [来源与配准](research/dmx/STICKERS.md) |
| `can` | U085 | 参考重绘 | 2 | [来源与配准](research/can/STICKERS.md) |
| `rollercan` | U188 | 参考重绘 | 3 | [来源与配准](research/rollercan/STICKERS.md) |
| `rollercan-lite` | U188-Lite | 参考重绘 | 3 | [来源与配准](research/rollercan-lite/STICKERS.md) |
| `vibrator` | U059 | 参考重绘 | 1 | [来源与配准](research/vibrator/stickers.md) |
| `audioplayer` | U197 | 参考重绘 | 2 | [来源与配准](research/audioplayer/stickers.md) |
| `mini-imu` | U095 | 参考重绘 | 3 | [来源与配准](research/mini-imu/artwork.md) |
| `extio2` | U011-B | 参考重绘 | 1 | [来源与配准](research/extio2/artwork.md) |
| `acssr` | U139 | 参考重绘 | 2 | [来源与配准](research/acssr/README.md) |
| `step16` | U198 | 参考重绘 | 1 | [来源与配准](research/step16/artwork.json) |
| `asr` | U194 | 参考重绘 | 2 | [来源与配准](research/asr/artwork.md) |
| `uhf-rfid` | U107 | 原稿栅格 / 参考重绘 | 2 | [来源与配准](research/uhf-rfid/artwork.md) |
| `earth` | U019 | 原稿轮廓/填色及可见层恢复栅格 `source-vector-raster` | 2 | 默认英文；显式 `education-cn` 中文教育版；[接入与边界](EARTH-HALL-QRCODE-UNITS.md) |
| `hall` | U084 | 参考重绘 `reference-redraw` | 2 | 正面方向图、背面型号/信号及引脚色块；[来源与配准](research/hall/artwork.md) |
| `qrcode` | U173 | 精确原稿栅格 `official-raster` | 3 | 正面、背面、侧面 UART/I2C 标；包装不接入；[接入与边界](EARTH-HALL-QRCODE-UNITS.md) |
| `laser-tx` | U066 | 参考重绘 `reference-redraw` | 2 | 正背标；保留自身650nm及OUT印字，不作为接口电气依据；[接入与边界](LASER-MIDI-UNITS.md) |
| `laser-rx` | U065 | 参考重绘 `reference-redraw` | 2 | 正面接收示意/机名，背面频率/PORT.B/引脚块；[来源与配准](research/laser-rx/artwork.md) |
| `midi` | U187 | 参考重绘 `reference-redraw` | 2 | 正背对应机身印刷；固定承载面与稳定滑块分离；[接入与边界](LASER-MIDI-UNITS.md) |
| `dac2` | U012-B | 原稿轮廓栅格 `source-vector-raster` | 2 | 正面T形端子/机名/Grove标、背面GP8413/I2C标；复合字形填充由 `evenodd` 恢复 `nonzero`；[来源与配准](research/dac2/artwork.md) |
| `dds` | U105 | 参考重绘 `reference-redraw` | 2 | 正面机名/波形曲线，背面器件框图/接口标；固定印刷不模拟波形；[来源与配准](research/dds/artwork.md) |
| `kmeter-iso-v11` | U133-V11 | v1.1原稿恢复栅格 / 参考重绘 | 3 | 正背原稿2张，前图alpha为0的圆环按对应预览恢复半透明；K型插座印字另重绘1张；[接入与边界](DAC-DDS-KMETER-UNITS.md) |
| `timerpwr` | U189 | 参考重绘 `reference-redraw` | 4 | 正面机名、按键提示、顶侧充电/电池接口标、背面覆膜；不复制屏幕内容；[接入与边界](TIMER-ENCODER-NFC-UNITS.md) |
| `extencoder` | U161 | 参考重绘 `reference-redraw` | 2 | 五芯座上方固定接口标与背贴；本体没有旋钮或转子；[接入与边界](TIMER-ENCODER-NFC-UNITS.md) |
| `nfc` | U216 | 原稿轮廓恢复栅格 `source-vector-raster` | 2 | 蓝色NFC正标、ST25R3916/I2C背标；复合字形填充由 `evenodd` 恢复 `nonzero`，包装不接入；[来源与配准](research/nfc/artwork.md) |
| `adc-v11` | U013-V11 | 参考重绘 `reference-redraw` | 2 | 固定2P座正负标与背面ADC V1.1/ADS1110/I2C标；不套旧ADS1100型号；[来源与配准](research/adc-v11/artwork.md) |
| `ameter` | U086 | 参考重绘 `reference-redraw` | 2 | 正背对应机身印刷；固定4P端子与可拆插头保持真实实体；[接入与边界](ADC-METER-UNITS.md) |
| `vmeter` | U087 | 参考重绘 `reference-redraw` | 2 | 正背对应机身印刷；不套用AMeter或隐藏原孔；[接入与边界](ADC-METER-UNITS.md) |
| `tube-pressure` | U130 | 参考重绘 `reference-redraw` | 1 | 背面型号/PORT.B/引脚块；前面无贴纸；背面贴纸下方M5浮雕保留原CAD；[来源与配准](research/tube-pressure/artwork.md) |
| `mq` | U199 | 精确背标原稿栅格 `source-vector-raster` / 参考重绘 `reference-redraw` | 4 | 原稿背标1张；机名、空白识别贴、可拆MQ-5银圈字样重绘3张；[接入与边界](RADIO-GAS-PRESSURE-UNITS.md) |
| `lora-e220-920` | U170 | 参考重绘 `reference-redraw` | 3 | 正背本款920标、固定DIP上的ON/1/2；不随两滑块移动，不套433版或LoRaWAN；[接入与边界](RADIO-GAS-PRESSURE-UNITS.md) |
| `watering` | U101 | 原稿轮廓恢复栅格 `source-vector-raster` / 参考重绘 `reference-redraw` | 2 | 精确机身背标1张、电机铭牌1张参考重绘；双管不靠贴纸封口；[接入与边界](WATERING-LIGHT-HBRIDGE-UNITS.md) |
| `dlight` | U136 | 参考重绘 `reference-redraw` | 1 | 背面DLIGHT/BH1750FVI-TR/PORT.A/引脚条；前面无贴纸，光学窗保留真实封装与背衬；[来源与配准](research/dlight/artwork.json) |
| `hbridge-v11` | U160-V11 | 参考重绘 `reference-redraw` | 2 | 正背对应机身印刷；真实壳内DIP与外壳贴纸分离，开盖/附件配置按指南保留；[接入与边界](WATERING-LIGHT-HBRIDGE-UNITS.md) |
| `dcssr` | U140 | 参考重绘 `reference-redraw` | 2 | 本款DCSSR机身与直流SSR标签，不混用交流SSR；[接入与来源](DCSSR-NCIR2-REFLECTIVE-IR-UNITS.md) |
| `ncir2` | U150 | 参考重绘 `reference-redraw` | 2 | 本款壳面印刷，金属感测头/真实孔口保留；[接入与来源](DCSSR-NCIR2-REFLECTIVE-IR-UNITS.md) |
| `reflective-ir` | U175 | 参考重绘 `reference-redraw` | 2 | 正面收发符号与背面型号/阈值方向/接口条，真实电位器孔不以贴纸替代；[接入与来源](DCSSR-NCIR2-REFLECTIVE-IR-UNITS.md) |
| `thermal2` | U149 | 参考重绘 `reference-redraw` | 2 | 本款正背标；原壳舌和黑色MLX90640开口保留，不套NCIR2；[接入与来源](THERMAL2-FLASHLIGHT-GPS-UNITS.md) |
| `flashlight` | U152 | 参考重绘 `reference-redraw` | 2 | 背贴与开盖PCB固定模式标；印刷随真实承载件可见性；[接入与来源](THERMAL2-FLASHLIGHT-GPS-UNITS.md) |
| `gps-sma` | U190 | 参考重绘 `reference-redraw` | 3 | 本体正背及随附有源天线puck正标，不贴到RF/Grove孔口；[接入与来源](THERMAL2-FLASHLIGHT-GPS-UNITS.md) |
| `bldc-driver` | U181 | 参考重绘 `reference-redraw` | 2 | 本款正背标，固定相线座/可拆插头保留实体；[接入与来源](BLDC-RCA-PUZZLE-UNITS.md) |
| `rca` | U155 | 参考重绘 `reference-redraw` | 2 | 背贴与固定PCB I1/I2标，不随壳内滑钮移动；[接入与来源](BLDC-RCA-PUZZLE-UNITS.md) |
| `puzzle` | U193 | 参考重绘 `reference-redraw` | 2 | 本体背部双Grove/方向标和独立桥件背标，正面64灯及栅格是实体；[接入与来源](BLDC-RCA-PUZZLE-UNITS.md) |
| `rs485-iso` | U094 | 参考重绘 `reference-redraw` | 2 | 本款正背标；固定VH3.96座、随插头拆装的电阻及独立指示灯均保留实体；[接入与来源](ISOLATED-INTERFACE-UNITS.md) |
| `ain4-20ma` | U162 | 参考重绘 `reference-redraw` | 2 | 本款正背标；真实六针和独立跳帽不靠印刷替代，无数值sensor/LED/button；[接入与来源](ISOLATED-INTERFACE-UNITS.md) |
| `ac-measure` | U164 | 原稿恢复栅格 `source-vector-raster` | 2 | 精确机身正背标，保留原色，复合字腔 `evenodd`→`nonzero`恢复；包装排除；[接入与来源](ISOLATED-INTERFACE-UNITS.md) |
| `uwb` | U100 | 原稿恢复栅格 `source-vector-raster` | 2 | 标准机身正背标，保留原色与轮廓，恢复复合字腔；包装/照片排除；内置天线与PCB实体独立；[接入与来源](RANGING-PRESENCE-UNITS.md) |
| `tmos-pir` | U185 | 参考重绘 `reference-redraw` | 2 | 本款正背标保留光学开口；真实金属封装/硅滤光窗和PCB背衬，不套旧PIR半球；[接入与来源](RANGING-PRESENCE-UNITS.md) |
| `mini-tof-90` | U196 | 参考重绘 `reference-redraw` | 2 | 本款正背标；固定直角双板/光窗/Grove侧实体嵌件独立，不以贴图替代；[接入与来源](RANGING-PRESENCE-UNITS.md) |
| `roller485-lite` | U182-Lite | 参考重绘 `reference-redraw` | 3 | 本款PORT.A/PWR485/debug可读印字；OLED、柔性壳舌和电机转子独立实体；[接入与来源](ROLLER-MINI-CAN-INA226-UNITS.md) |
| `mini-can` | U179 | 参考重绘 `reference-redraw` | 2 | 本款MINI CAN机身正背标；非隔离SO8/PCB、真实插座及胶贴基底独立；[接入与来源](ROLLER-MINI-CAN-INA226-UNITS.md) |
| `ina226-10a` | U200 | 原稿恢复栅格 `source-vector-raster` | 2 | 精确10A/5mΩ正背机身原稿，恢复复合字腔；不混1A/包装；PCB/隔离封装/分流实体独立；[接入与来源](ROLLER-MINI-CAN-INA226-UNITS.md) |
| `mini-pdm` | U089 | 参考重绘 `reference-redraw` | 2 | 本款前麦克风符号及背面CLK/DAT针序；MEMS声孔/PCB与胶片独立；表13mm/原图原壳8mm分别保留；[接入与来源](AUDIO-PRESSURE-UNITS.md) |
| `mini-bps-v11` | U090-B | 参考重绘 `reference-redraw` | 2 | 精确QMP6988 v1.1前BPS与背PORT.A/I2C针序；不混U090 BMP280；金属气孔/PCB及胶片独立；[接入与来源](AUDIO-PRESSURE-UNITS.md) |
| `mic` | U096 | 参考重绘 `reference-redraw` | 1 | 本款背面型号/接线标签；真实麦克风孔网/阈值头/PCB和胶片独立；[接入与来源](AUDIO-PRESSURE-UNITS.md) |
| `accel` | U056 | 参考重绘 `reference-redraw` | 2 | 本款正背印刷；传感封装/PCB与胶贴基底独立，锚点不含加速度数值；[接入与来源](ACCEL-OP90-OP180-UNITS.md) |
| `op90` | U057 | 参考重绘 `reference-redraw` | 1 | 本款背面型号/针序；固定光电封装、收发窗口及真空气槽独立，不混OP180；[接入与来源](ACCEL-OP90-OP180-UNITS.md) |
| `op180` | U058 | 参考重绘 `reference-redraw` | 1 | 本款背面型号/针序；5mm真槽、相对光窗和固定顶部封装，胶贴基底独立，不混OP90；[接入与来源](ACCEL-OP90-OP180-UNITS.md) |
| `unit-id` | U124 | 参考重绘 `reference-redraw` | 2 | 本款正背印刷；ATECC608B-TNGTLSU-G/PCB与胶贴基底独立，无身份值或加密/I2C模拟；[接入与来源](ID-RF433-UNITS.md) |
| `rf433r` | U113 | 参考重绘 `reference-redraw` | 2 | 本款接收器正背印刷；固定内置PCB天线，不混发射版，不造外接天线或RF动效；[接入与来源](ID-RF433-UNITS.md) |
| `rf433t` | U114 | 参考重绘 `reference-redraw` | 2 | 本款SYN115与OUT正背印刷；固定内置PCB天线、真实六脚封装，不混接收版；[接入与来源](ID-RF433-UNITS.md) |
| `zigbee` | U110 | 参考重绘 | 2 | [来源与配准](research/zigbee/artwork.json)；天线/标签均有独立物理载体 |
| `co2l` | U104 | 参考重绘 | 2 | [来源与配准](research/co2l/artwork.json)；前壳面字与背胶贴分列 |
| `ina226-1a` | U200-1A | 原稿栅格 | 2 | [来源与配准](research/ina226-1a/artwork.json)；仅本机1A/80mR两片，不含包装/10A |
| `finger` | U008 | 参考重绘 | 1 | [来源与配准](research/finger/artwork.json)；仅本款实际背贴，前面是真实电容采集面 |
| `unit-396` | U020 | 参考重绘 | 1 | [来源与配准](research/unit-396/artwork.json)；背面数字色块贴纸，不编内部路由 |
| `scales` | U108 | 参考重绘 | 1 | [来源与配准](research/scales/artwork.json)；仅底贴，顶面M5保留原生浮雕 |
| `c6l` | U202 | 原稿栅格 / 参考重绘 | 4 | [来源与配准](research/c6l/artwork.json)；背面本款原稿；前面保原字形仅修当前官图频段带，两套环参考重绘，排原稿版本冲突 |
| `gateway-h2` | U195 | 参考重绘 | 2 | [来源与配准](research/gateway-h2/artwork.json)；闭壳正背，裸板配置无外壳贴纸 |
| `chainbus` | U212 | 原稿栅格 | 2 | [来源与配准](research/chainbus/artwork.json)；仅本款机身前背，不含包装/错误版本 |
| `glass2` | U158-B | 参考重绘 | 2 | [来源与配准](research/glass2/artwork.json)；前固定盖板及后PCB丝印，透明玻璃/像素独立存在 |
| `typec-to-grove` | U151 | 参考重绘 | 3 | [来源与配准](research/typec-to-grove/artwork.json)；本款顶部横标/电源小标/背部示意，不用印刷补孔 |
| `dof10` | U230 | 原稿栅格 | 3 | [来源与配准](research/dof10/artwork.json)；本机前/轴向圆贴/背，排包装和视图候选 |
| `poe-p4` | U213 | 原稿栅格 | 4 | [来源与配准](research/poe-p4/artwork.json)；本款前异形大标/背图/Hat端/Grove侧色条，排包装和摄影视图 |
| `cat1-cn` | U204 | 原稿栅格 | 2 | [来源与配准](research/cat1-cn/artwork.json)；本机正背，开后盖去实际背膜，包装/照片排除 |
| `grove-to-grove` | U148 | 参考重绘 | 2 | [来源与配准](research/grove-to-grove/artwork.json)；本款正背真实印刷，三socket与电路独立存在 |
| `unitv2` | U078-D | 参考重绘 | 1 | [来源与配准](research/unitv2/artwork.json)；本款背标及实际附件印刷以单品记录为准；不借UnitV/USB/M12版 |
| `lorawan-cn470` | U184-CN470 | 参考重绘 | 2 | [来源与配准](research/lorawan-cn470/artwork.json)；本款CN470正背；不借其他频段/蜂窝型号 |
| `proto` | U022 | 参考重绘 | 1 | [来源与配准](research/proto/artwork.json)；本款实际背标；前裸洞板为真实实体、不造胶贴 |
| `weight` | U030 | 参考重绘 | 2 | [来源与配准](research/weight/artwork.json)；本款前端子铭牌/背标；不借Weight-I2C |
| `ssr` | U122 | 原稿栅格+参考重绘 | 2 | [来源与配准](research/ssr/artwork.json)；本款机身标，包装/错误版本/摄影视图排除；不借ACSSR/DCSSR |
| `poe-cam-w-v11` | U121-B-V11 | 参考重绘 | 2 | [来源与配准](research/poe-cam-w-v11/artwork.json)；本款OV3660小标/背面信息与引脚；原生M5浮雕保持 |
| `nbiot2` | U111-B | 参考重绘 | 2 | [来源与配准](research/nbiot2/artwork.json)；本款前后机身标；不借U111全球版或U112印刷 |
| `nbiot-cn` | U112 | 参考重绘 | 2 | [来源与配准](research/nbiot-cn/artwork.json)；本款CN机身标；不借U111/U111-B印刷 |
| `mini-proto` | U064 | 参考重绘 | 1 | [来源与配准](research/mini-proto/artwork.json)；本款实际背标/PCB印刷；裸洞板不凭空加胶贴或用户电路 |

每款已接入的面和仍缺的小字以单品记录为准，不表示所有印刷面都已完整还原。2Relay部分正面小字缺原稿支持；Fingerprint2原稿中的指纹图形只有200×200像素，保持原生位图并与高清矢量文字分层，未放大冒充更高精度。营销图上的尺寸箭头、屏幕保护膜和外部注释不会作为永久印刷贴到屏幕或活动帽。相似Module/HAT、新旧Unit的贴纸不混用。

原稿栅格标记`official-raster`/`official-raster-film`；UHF准确原稿直接栅格的运行时标记为`official-vector-raster`。Earth依据对应预览和标准官图恢复原稿轮廓/填色及可见层，标记`source-vector-raster`；DAC2与NFC同样标记`source-vector-raster`，恢复范围为原稿复合字形的填充规则`evenodd`→`nonzero`，原有填色和可见面保留。KMeter两面原稿的运行时类型为`official-vector-raster`，前面透明度为0的圆环按对应预览恢复半透明；以上恢复均不宣称未经修改的原稿导出。Watering机背精确原稿的轮廓恢复同样标记`source-vector-raster`，具体恢复范围见单品记录。重新绘制的文字/图形标记`reference-redraw`。字体、颜色、安装尺寸/位置的推导在单品文档说明；这些标签仅为外观，不提供电气引脚或协议行为。新代码MIT；印刷和商标保留权利。表格、私有下载链接、矢量原稿、生成器及转换中间只留仓库外，公开仅最终普通PNG与配准代码。

```js
const model = await loadModel('byteswitch');         // 默认带对应印刷
const bare = await loadModel('byteswitch', {artwork:false});
const wired = await loadGroveModule('byteswitch', {artwork:false});
```

选项应传给每个独立模型或模块，父主机选项不自动传播。印刷随真实壳、平台或所属物件；只有实物连续贴膜桥过原生服务孔时使用`printedFilm`，`artwork:false`下原孔及后方组件全部保留。ByteSwitch/ByteButton前面印字0在底部CH0，对应API控件1；印字7在顶部CH7，对应控件8。

必要检查为`node scripts/check-unit-sticker-additions.mjs`，可在命令后传产品ID缩小范围；覆盖新增印刷非空、来源标记、开关、非印刷实体缓冲/姿态不变和Grove四芯装配。各作者另将新贴层和修改前物理基线比较，保留原按钮/开关/旋钮/附件和线缆API。两个工作副本构建与在线资源字节检查另记在[本批记录](../artifacts/unit-sticker-additions/progress.json)。未逐面浏览器、全量73款或实物验收，阶段保持`modeled`。


Step16 / ASR / UHF-RFID 本批与模型同时接入五张PNG。Step16仅背贴，正面和原旋钮保持实物白色；ASR两面按精确Unit U194官图重绘，未套用Module M147。UHF背贴使用当前原稿的 `UP TO 1M` 与黑标题版本，2400×2400 PNG／30×30 mm；正面天线图为官图参考重绘，3300×2200 PNG／33×22 mm。ASR背贴忠实保留印字8Ω@1W，同时记录正文0.8W差异，不作为额定电气数据。必要装配/开关检查及调用方式见[本批接入](STEP-ASR-UHF-UNITS.md)，对应专项为 `node scripts/check-step-asr-uhf-units.mjs`。本批未作逐面浏览器或全目录验收；旧贴纸报告仍只对应其原始快照。

## Earth / Hall / QRCode 同批印刷

本批单独记录7张PNG：Earth默认英文背标和显式 `stickerVariant:'education-cn'` 中文教育版共2张，Hall正背参考重绘2张，QRCode三个机身原稿面3张。Earth两版均标记 `source-vector-raster`，原稿轮廓/填色及可见层按用户所给预览和对应标准官图恢复；不宣称未经修改的原稿导出。QRCode排除包装素材，正背与侧面 UART/I2C 标保留其真实承载壳体关系。

Earth默认不切换为中文教育版；可用 `loadModel('earth', {stickerVariant:'education-cn'})` 或对 Grove 模块传相同选项。`artwork:false` 的优先级高于变体。三款真实控件、Grove接线与外部框架边界见[本批接入](EARTH-HALL-QRCODE-UNITS.md)；局部检查入口为 `node scripts/check-earth-hall-qrcode-units.mjs`，检查结果以对应记录为准。当前不新增逐面浏览器或全目录验收结论，旧报告仍只对应原始快照。


## Laser TX / Laser RX / MIDI 同批印刷

本批独立记录6张 `reference-redraw` PNG，三款各正背2张。已检索所提供表格的精确型号来源，暂无对应原稿；按同型号官方图中可辨文字和图形代码重绘，不裁产品照片，不套用相似型号。TX保留自身650nm与OUT印字，RX背贴保留IN，Grove元数据分别按官方接口表保留DIN与DOUT；贴纸文字不充当电气行为。不可辨细字、字体/颜色/尺寸及配准推导按单品记录保留。

TX/RX各印刷投影到自身原壳，MIDI印刷留在真实固定承载面，均随对应物件姿态保持配准。`artwork:false` 分别传给模型/模块；关闭贴层不删除原孔、接收/发射实体、插座、光导或滑块。调用和必要专项入口 `node scripts/check-laser-midi-units.mjs` 见[本批接入](LASER-MIDI-UNITS.md)，结果以对应记录为准。本段不宣称本批构建、在线资源或浏览器验收通过，也不将此前43款、30款回补、36款或39款快照合并成全量验收。私有表、下载链接、矢量原稿、生成器和中间件继续留在仓库外；公开仅最终PNG、配准及来源说明。


## DAC2 / DDS / KMeter-ISO v1.1 同批印刷

本批单独记录7张PNG，不并入历史43款、此前30款回补及36/39/42款新增快照。DAC2优先使用精确机身原稿，正面T形标和背面GP8413/I2C标共2张；复合字形填充规则由 `evenodd` 恢复 `nonzero` 后保留原稿轮廓和填色，标记 `source-vector-raster`。DDS缺对应原稿，按本款官方照片代码重绘正背2张，标记 `reference-redraw`，波形曲线和器件框图只作为固定印刷。

KMeter使用U133-V11对应正背原稿2张，不套旧版。前面原稿转换后圆环透明度为0，按对应预览恢复半透明并明确记录源恢复；K型插座上可辨标记另按同型号官图重绘1张。原稿栅格与参考重绘分别标记，包装图和不可辨字不补造。三款共7张图片的像素、来源与配准按各款 `artwork.json` 记录；源矢量、私表、下载链接和生成中间件不进入公开目录。

`artwork:false` 分别传给每个模型或Grove模块，关闭贴层保留完整原壳、孔、PCB、SMA/K插座与DAC2端子/螺钉。调用、三分支四芯线和必要专项 `node scripts/check-dac-dds-kmeter-units.mjs` 见[本批指南](DAC-DDS-KMETER-UNITS.md)。本段只登记同批印刷与检查入口，构建和在线资源以相应进度报告为准，不宣称逐面浏览器、全量历史或实物验收通过。


## TimerPWR / ExtEncoder / NFC 同批印刷

本批独立记录8张PNG，不并入历史43款、此前30款回补或36/39/42/45款新增快照。TimerPWR按自身U189官方照片代码重绘4张：正面机名、按键提示、顶侧充电/电池接口与背贴；屏幕仍由外部framebuffer负责，不裁取计时界面当永久贴纸。ExtEncoder按自身U161官方照片重绘固定五芯座接口标和背贴2张；两款共6张均标记 `reference-redraw`，不可辨小字及配准推导以单品记录为准。

NFC采用U216自身正背精确原稿，不套用旧PN532 NFC或RFID2。复合字形填充由 `evenodd` 恢复 `nonzero` 后保留原轮廓与填色，直接高清栅格成2张PNG，标记 `source-vector-raster`；不宣称未经修改的转换器导出。独立包装贴、预览图、原稿、原文件名、私表、下载URL、矢量和生成中间件均不分发，公开仅最终普通PNG、配准代码和安全来源说明。

每个模型/模块分别传 `artwork:false`，关闭印刷不删除原壳、孔、OLED/按键、五芯座/插头/螺钉、Grove触点或NFC实体天线。调用与三分支四芯线见[本批指南](TIMER-ENCODER-NFC-UNITS.md)，必要专项入口为 `node scripts/check-timer-encoder-nfc-units.mjs`。这里只登记接入和检查入口，构建、在线资源与专项结果以本批进度报告为准，不新增逐面浏览器、全量历史或实物验收结论。


## ADC v1.1 / AMeter / VMeter 同批印刷

本批单独记录6张PNG，三款各2张，全部标记 `reference-redraw`。所提供表格无这三款精确原稿，按自身型号官方照片中可辨文字、色块和图形代码重绘；不裁产品照片、不使用相似型号。ADC v1.1固定2P座的正负标与背面ADS1110/接口标按U013-V11保留，不把旧ADS1100正文差异转成模型行为；AMeter与VMeter各自保留自身正背印刷。可辨范围、字体/颜色和配准推导按各款研究记录说明。

每个模型/模块分别传 `artwork:false`，关闭印刷保留真实原壳、孔、PCB、固定座、可拆插头与螺钉。两款电表的指示灯是独立物理光路，固定预览色仅为发光色未确认时的外观估计，`colorConfirmed:false`；PNG与灯都不执行测量或电气逻辑。API、三分支四芯线、两/四/四个螺钉头和检查入口见[本批指南](ADC-METER-UNITS.md)，必要专项为 `node scripts/check-adc-meter-units.mjs`。这里只记录来源与入口，构建、接线和在线资源结果以本批进度报告为准，不预先宣称综合验证、逐面浏览器、全量历史或实物验收通过。私表、私有下载链接、原稿名、矢量、原始官图、生成器与中间素材均留仓库外，公开仅最终普通PNG、配准和安全来源说明。


## Tube Pressure / MQ / LoRaE220-920 同批印刷

本批单独记录8张PNG，新增Unit表由51款增至54款；不回写历史43款、30款回补或此前各批快照。Tube Pressure只有官图确证的背贴1张，按同型号照片代码重绘为 `reference-redraw`；正面保留真实单气嘴，不添加虚构贴纸；背面贴纸下方的M5浮雕保留原CAD。

MQ背面精确机身原稿栅格1张标记 `source-vector-raster`，原稿转换/恢复范围以单品来源记录为准，不称未经修改的原稿导出；机名标题、空白识别贴、MQ-5银圈字样3张为 `reference-redraw`。空白识别贴保持原样，不补造气体名称或工作状态；银圈字样随可拆MQ-5圆罐，拆罐保留固定座与适配板。LoRa按U170/920自身官图重绘正背与固定DIP的ON/1/2共3张，标记 `reference-redraw`；固定字样不随两枚稳定滑块移动，天线折叠不改变固定机身印刷。

每个模型/模块分别传 `artwork:false`，保留完整原壳、开孔、PCB、感测封装、管嘴深腔、固定座、DIP与可拆圆罐/天线的物理attributes/index和世界姿态。MQ名义/CAD24×64×25 mm与默认含罐约24×80.31×25 mm、拆罐约24×64.4×25 mm分别记录；LoRa的两DIP与0…90°天线关节仅表达形状和输入意图，不实现气体/加热/压力/RF或电气逻辑。配置菜单、四芯线和必要专项入口 `node scripts/check-radio-gas-pressure-units.mjs` 见[本批指南](RADIO-GAS-PRESSURE-UNITS.md)。构建、接线、在线资源和隐私结果以对应进度报告为准，不预先声称综合验证通过，也不新增逐面浏览器、全量历史或实物验收。私表、私有下载链接、原稿名、矢量、原始官图/CAD、生成器和中间材料均不分发，公开仅最终普通PNG、配准及安全来源说明。


## Watering / DLight / HBridge 同批印刷

本批独立记录5张PNG，不并入历史43款、此前30款回补或36/39/42/45/48/51/54款新增快照。Watering机背按精确原稿轮廓恢复并栅格化，标记 `source-vector-raster`；电机铭牌可辨部分另按同型号官图代码重绘1张。DLight背贴1张及HBridge正背2张均为 `reference-redraw`，不可辨小字不补造，不裁产品照片。原稿恢复范围、字体/颜色、安装尺寸及配准推导按单品记录保留，不宣称厂商原稿未经修改直接导出。

`artwork:false` 分别传给各独立模型/Grove模块；完整原壳、真孔、DLight感测封装/背衬、Watering双软管与机械口、HBridge开盖/闭壳/端子/电容配置的物理attributes/index和世界姿态保持。调用与必要专项 `node scripts/check-watering-light-hbridge-units.mjs` 见[本批指南](WATERING-LIGHT-HBRIDGE-UNITS.md)，综合结果以对应进度报告为准；不预先声称两构建、在线资源、逐面浏览器、全量历史或实物验收通过。原表、私有URL/原稿名、矢量、官图/CAD原文件、生成器与中间件仅在仓库外保留，公开仅最终普通PNG、配准代码及安全来源说明。


## DCSSR / NCIR2 / Reflective IR 同批印刷

本批6张PNG按各自官方照片代码重绘，不复制产品照片像素，不套相近型号，不编造不可辨小字，不用印刷掩盖缺件。仅公开最终普通PNG、配准和安全来源说明，原表、私有链接/原稿名、矢量、官图/CAD原文件、生成器和中间件留仓库外。各配置 `artwork:false` 关闭印刷保留完整实体、真实孔口和装配世界矩阵。用法和专项 `node scripts/check-dcssr-ncir2-reflective-ir-units.mjs` 见[本批指南](DCSSR-NCIR2-REFLECTIVE-IR-UNITS.md)，检查范围以本批进度记录为准；不增加逐面浏览器或实物验收结论。


## Thermal2 / FlashLight / GPS SMA 同批印刷

本批7张PNG（Thermal2 2、FlashLight 2、GPS SMA 3）均为同型号官图代码重绘，不复制照片像素、不编造不可辨小字、不套相近型号、不用贴纸遮缺件。各配置 `artwork:false` 保留完整原壳、真实光学封装/孔、PCB、双原壳舌、壳内模式开关及可拆带线天线的物理attributes/index和世界矩阵。具体来源/注册限制与必要专项 `node scripts/check-thermal2-flashlight-gps-units.mjs` 见[本批指南](THERMAL2-FLASHLIGHT-GPS-UNITS.md)，综合结果以本批进度为准；没有新增逐面浏览器或实物验收。原表/私有链接/原稿名/矢量/官图CAD原文件/生成器/中间件仅留仓库外，公开最终普通PNG、配准与安全说明。


## BLDC Driver / RCA / Puzzle 同批印刷

本批6张PNG（BLDC Driver 2、RCA 2、Puzzle 2）均为本款官图代码重绘。正面灯阵、插孔、真实端子和开关由物理几何表现，不裁照片/编字/贴纸遮缺件。`artwork:false` 关闭印刷并保留对应插头/闭壳/开盖配置的所有物理attributes/index/世界矩阵；固定PCB丝印随真实PCB保留，不随活动件移动。来源/字体颜色/注册限制与专项 `node scripts/check-bldc-rca-puzzle-units.mjs` 见[本批指南](BLDC-RCA-PUZZLE-UNITS.md)，检查范围以本批进度为准；没有新增逐面浏览器或实物验收。原表/私有链接/原稿名/矢量/官图CAD原件/生成器/中间件只留仓库外，公开最终普通PNG及安全配准/来源。


## RS485-ISO / AIN4-20mA / AC Measure 同批印刷

本批6张PNG（每款2张）：RS485-ISO、AIN4-20mA均按自身官图代码重绘，标 `reference-redraw`；AC Measure精确机身原稿恢复为 `source-vector-raster`，原色和轮廓保留，只修正转换中的 `evenodd`→`nonzero`字腔填充，包装排除。重绘不裁照片、不编造不可辨文字。实际端子/电阻/六针/跳帽/PCB/封装均为物理几何，贴纸不补缺件。

`artwork:false`保留对应盖/插头/电阻/跳帽配置全部物理attributes/index与世界矩阵。必要专项 `node scripts/check-isolated-interface-units.mjs`和[本批指南](ISOLATED-INTERFACE-UNITS.md)登记接线、配件、外驱动作及印刷开关范围；综合结果以[本批进度](../artifacts/isolated-interface-expansion/progress.json)为准，没有新增逐面浏览器、全量历史或实物验收。私表、私有链接/原稿名、矢量、官图CAD原件、生成器与中间件仅留仓库外，公开最终普通PNG及安全配准/来源。


## UWB / TMOS PIR / Mini ToF-90 同批印刷

本批6张PNG（每款2张）：UWB标准机身正背原稿恢复为 `source-vector-raster`，保留原色、轮廓，仅恢复转换中的 `evenodd`→`nonzero`复合字腔；包装/照片排除。TMOS PIR与Mini ToF-90按各自官图代码重绘，标 `reference-redraw`，不裁产品照片、不编造不可辨文字。完整原壳、真实PCB/内置天线、金属/光学封装与胶贴基底均独立建模，贴纸不掩盖缺件。

`artwork:false`保持两入口全部物理attributes/index及最顶层更新后的世界矩阵。必要专项 `node scripts/check-ranging-presence-units.mjs` 和[本批指南](RANGING-PRESENCE-UNITS.md)登记四芯Grove、被动锚点与Mini ToF红灯独立外驱范围；综合结果以[本批进度](../artifacts/ranging-presence-expansion/progress.json)为准，没有新增逐面浏览器、全量历史或实物验收。私表、私有链接/原稿名、矢量、官图CAD原件、生成器与中间件仅留仓库外，公开最终普通PNG及安全配准/来源。


## Roller485 Lite / Mini CAN / INA226-10A 同批印刷

本批7张PNG：Roller485 Lite的PORT.A/PWR485/debug三张及Mini CAN正背两张为同型号官图代码重绘 `reference-redraw`；INA226-10A两张为精确U20010A/5mΩ机身原稿恢复栅格 `source-vector-raster`，保留颜色/轮廓并恢复复合字腔，排除1A版本与包装。没有产品照片裁切、预览放大或不可辨文字编造。完整原壳、真实PCB/封装、端子接触件和胶贴基底均独立建模，印刷不遮缺件。

`artwork:false`保持两入口及裸座/带插头配置的全部物理attributes/index与世界矩阵。必要专项 `node scripts/check-roller-mini-can-ina226-units.mjs`、[本批指南](ROLLER-MINI-CAN-INA226-UNITS.md)登记真实Grove线、Roller转子/壳舌/OLED/RGB及三款四螺钉附件的外驱范围；综合结果以[本批进度](../artifacts/roller-mini-can-ina226-expansion/progress.json)为准，没有新增逐面浏览器、全量历史或实物验收。私表、私有链接/原稿名、矢量、官图CAD原件、生成器与中间件仅留仓库外，公开最终普通PNG及安全配准/来源。


## Mini PDM / Mini BPS v1.1 / MIC 同批印刷

本批5张 `reference-redraw` PNG：Mini PDM前符号/背针序、Mini BPS v1.1前BPS/背PORT.A针序各两张，MIC背面一张。每张依据本款官图可辨文字和图形代码重绘，没有照片裁片、预览放大或不可辨小字编造。BPS严格U090-B QMP6988，不混旧U090 BMP280；PDM官方13mm表与8mm尺寸图/原壳冲突继续记录，原壳不缩放并有真实反馈。各款PCB、金属封装、通气/声学孔网、Grove、独立胶贴基底和MIC调节头均为实体，贴纸不遮缺件。

`artwork:false`保持两入口全部物理attributes/index与世界矩阵。必要专项 `node scripts/check-audio-pressure-units.mjs`、[本批指南](AUDIO-PRESSURE-UNITS.md)登记三款四芯线、被动锚点及MIC有限角 `threshold` 外驱范围；综合结果以[本批进度](../artifacts/audio-pressure-expansion/progress.json)为准，没有新增逐面浏览器、全量历史或实物验收。字体/颜色、隐藏安装和配准限制见各单品研究。私表、私有链接/原稿名、矢量、官图CAD原件、生成器和中间件只留仓库外，公开最终普通PNG及安全配准/来源。


## Accel / OP90 / OP180 同批印刷

本批4张 `reference-redraw` PNG：Accel正背2张，OP90和OP180各背面1张。每张依据精确本款官图可辨文字和图形代码重绘，没有照片裁片、预览放大、相近型号套用或不可辨小字编造。真实传感封装、固定光电遮光壳/收发窗/引脚、PCB、Grove和独立胶贴基底保留，检测真空气槽不填平，印刷不遮缺件。90/180不代表可动角，不造铰链、可见IR或虚拟检测锥。

`artwork:false`保持两入口全部物理attributes/index与世界矩阵。必要专项 `node scripts/check-accel-opto-units.mjs`、[本批指南](ACCEL-OP90-OP180-UNITS.md)登记三款四芯线和被动锚点；综合结果以[本批进度](../artifacts/accel-op90-op180-expansion/progress.json)为准，没有新增逐面浏览器、全量历史或实物验收。三款均无按钮、关节、灯或显示；加速度、检测/遮挡/计数/电平、协议、电气和固件由外部实现。字体/颜色、隐藏安装和配准限制见单品研究。私表、私有链接/原稿名、矢量、官图CAD原件、生成器和中间件只留仓库外，公开最终普通PNG及安全配准/来源。


## ID / RF433R / RF433T 同批印刷

本批6张 `reference-redraw` PNG：ID、RF433R、RF433T每款正背各1张。每张依据精确本款官图可辨文字和图形代码重绘，没有照片裁片、预览放大、收发型号互借或不可辨小字编造。真实芯片封装/引脚、PCB、固定内置铜天线、Grove深腔/四触点和独立胶贴基底均有实体，不用印刷遮缺件。R/T共用外壳依各自CAD核源，不代表共用电子封装或印刷；天线不发光、不动，不造外接天线或观察窗。

`artwork:false`保持两入口全部物理attributes/index与世界矩阵。必要专项 `node scripts/check-id-rf433-units.mjs`、[本批指南](ID-RF433-UNITS.md)登记三款四芯线和grove-only实际API；综合结果以[本批进度](../artifacts/id-rf433-expansion/progress.json)为准，没有新增逐面浏览器、全量历史或实物验收。三款均无sensor、按钮、关节、灯或显示；身份/密钥/证书/加密/I2C与RF/ASK/数据/强度/距离/通信、协议、电气和固件由外部实现。字体/颜色、隐藏安装和配准限制见单品研究。私表、私有链接/原稿名、矢量、官图CAD原件、生成器和中间件只留仓库外，公开最终普通PNG及安全配准/来源。
