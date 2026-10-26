# 贴纸与外壳印刷覆盖

## 最新本地增量：ENV II / Joystick / GPS

当前本地187款（14主机、173Unit），全部 `modeled`、`verified` 为0。本批新增原ENV-II U001-B、原Joystick U024、原GPS U032及4张本款普通PNG。本次Git同步收录全部187款及批41–48新增的24款/40PNG，见[187款同步记录](GIT-SYNC-187-2026-10-27.md)。历史检查点中的Git状态保留其保存时点；当前提交与远端状态以Git日志及GitHub main为准。实际结构/API见[本批指南](ENVII-JOYSTICK-GPS-UNITS.md)，50批范围见[增量索引](LOCAL-EXPANSION.md)。

三款按自身官方尺寸/多视图参数化，无本款CAD，不借后代。ENV-II保SHT30/BMP280、40真槽/承托，当前24×32×8与旧24.2×32.2×8.1分记；Joystick保原MEGA328P、帽/轴/杯/金属载体及实际XY倾斜/Z瞬时按放与回弹，名义24×48×32和帽体完整包络分记，J3未实装不造座；GPS保24×48×8自身维图/2孔/蓝Grove/两膜，小缺口用途未证不造灯。实际API/PNG：env-ii 控件0[无]、XY摇杆[无]、灯0[无]、显示0[无]、关节[无]、端口[grove]、PNG1；joystick 控件1[press]、XY摇杆[stick]、灯0[无]、显示0[无]、关节[无]、端口[grove]、PNG1；gps 控件0[无]、XY摇杆[无]、灯0[无]、显示0[无]、关节[无]、端口[grove]、PNG2。隐藏内部/配合、摇杆pivot/travel/limits明确推导，不称完整BOM或制造实测；读数、ADC、通信、电气和固件由外部实现。

本批印刷同步：Unit ENV-II 1张参考重绘；Unit Joystick (MEGA328P original) 1张参考重绘；Unit GPS (AT6558 + MAX2659) 2张参考重绘。本款清楚后标或GPS前后膜准确代码重绘高清普通PNG，真实膜/M5去墨保留；不裁照片/借错款/猜微字或个体码，不以图遮缺件，不凭文字符号造灯。私表/URL/原名/映射/矢量/原始资料/生成器/中间件留分发树外。新代码MIT，官方照片与第三方标识保留各自权利。

两入口/实际配置去墨与真实partial倾斜/按放、固定件/外驱无echo、StickS3→HUB三分支四芯、变父/peer/framebuffer/资源释放、6导出/双build及在线PNG已保存[本批进度](../artifacts/envii-joystick-gps-expansion/progress.json)。未逐面浏览器/GPU、历史全量或硬件验收；旧50PNG、私Scroll、StackChan量产fit-unresolved、Puzzle Bridge、Catch及既有延期保持，整体goal active。


## 前批检查点：RGB LED 10cm / RFID / ENV

该批保存时本地184款（14主机、170Unit），全部 `modeled`、`verified` 为0。本批新增A035精确10cm15LED灯带、原RFID U031、原ENV U001及7张本款普通PNG。GitHub `main`的163款已同步于 `4fd5216`，见[163款同步记录](GIT-SYNC-163-2026-10-27.md)；随后批41/42/43/44/45/46/47共21款/36PNG仍是本地增量，未再次提交推送。实际结构/API见[本批指南](RGBLED-RFID-ENV-UNITS.md)，49批范围见[增量索引](LOCAL-EXPANSION.md)。

三款按自身尺寸与官方多视图参数化，无本款CAD，不借后代或宣称原生面。A035保100×10条带名义与双端板整体包络分记、15颗3535/连续基材背胶/白黑4P端板及实际外驱柔性形状，未知弹性/额定弯半径不编；RFID保MFRC522完整壳/银前膜/背膜/真实侧槽承托，槽功能未证不造灯键；ENV保24.2×32.2×8.1、40交错真槽、DHT12栅壳/固定介质与BMP280压力封装和板支持，不套后代壳。实际API/PNG：rgb-led-10cm 控件0[无]、灯15[led-1,led-2,led-3,led-4,led-5,led-6,led-7,led-8,led-9,led-10,led-11,led-12,led-13,led-14,led-15]、显示0[无]、关节[无]、端口[grove,extension]、PNG3；rfid 控件0[无]、灯0[无]、显示0[无]、关节[无]、端口[grove]、PNG2；env 控件0[无]、灯0[无]、显示0[无]、关节[无]、端口[grove]、PNG2。隐藏安装/配合推导另记，不称完整BOM、制造或实物验收，无通信/UID/环境读数/固件。

本批贴纸同步：Unit RGB LED 10cm / 15LED 3张参考重绘；Unit RFID 2张参考重绘；Unit ENV (DHT12 + BMP280) 2张参考重绘。准确本款条带/端板丝印、RFID前后膜、ENV后标/QC膜代码重绘普通高清PNG并注明来源，QC仅复现实物文字。PCB不造假膜，真实基材/背胶/膜/压纹去墨保留；不裁照片/借错款/猜微字或个体码，不以图遮缺件。私表/URL/原名/映射/矢量/原始资料/生成器/中间件留分发树外。新增代码MIT，官方照片与第三方标识保留各自权利。

两入口/实际配置与去墨和真实partial带形、15灯逐颗外驱/实体支持、StickS3→HUB三分支四芯、变父/peer/外驱无echo、host framebuffer/资源释放、6导出/双build及在线PNG已保存[本批进度](../artifacts/rgbled-rfid-env-expansion/progress.json)。未逐面浏览器/GPU、历史全量或硬件验收；旧50PNG、私Scroll、StackChan量产fit-unresolved、Puzzle Bridge、Catch及既有延期保持，整体goal active。


## 前批检查点：M5Bit / Mini BPS / HEX

该批保存时本地181款（14主机、167Unit），全部 `modeled`、`verified` 为0。本批新增M5Bit A051、原Mini BPS U090、原HEX A045及5张本款普通PNG。GitHub `main`的163款已同步于 `4fd5216`，见[163款同步记录](GIT-SYNC-163-2026-10-27.md)；随后批41/42/43/44/45/46共18款/29PNG仍是本地增量，未再次提交推送。实际结构/API见[本批指南](M5BIT-BPS-HEX-UNITS.md)，48批范围见[增量索引](LOCAL-EXPANSION.md)。

三款按自身官方尺寸与多视图参数化，无本款CAD，不借新版/宣称原生面。M5Bit保真实深卡槽/双侧接触与IO/蓝Grove，Microbit卡为情境不默认附带；BPS保BMP280/双通气口/支撑，不借U090-B8mm壳拉伸；HEX保自身36×31.2×6.95图纸与37颗较大SK6812/三白4P座，表31.2×36×7维序/取整分记。实际LED仅外驱材料，不自动彩虹/协议级联/供电或固件。最终实际API/PNG：m5-bit 控件0[无]、灯0[无]、显示0[无]、关节[无]、端口[microbit,io,aux,grove]、PNG2；bps 控件0[无]、灯0[无]、显示0[无]、关节[无]、端口[grove]、PNG2；hex 控件0[无]、灯37[led-1,led-2,led-3,led-4,led-5,led-6,led-7,led-8,led-9,led-10,led-11,led-12,led-13,led-14,led-15,led-16,led-17,led-18,led-19,led-20,led-21,led-22,led-23,led-24,led-25,led-26,led-27,led-28,led-29,led-30,led-31,led-32,led-33,led-34,led-35,led-36,led-37]、显示0[无]、关节[无]、端口[grove,out,power]、PNG1。隐藏安装与接触/配合推导另记，不称完整BOM或制造/实物验收，不模拟IO/UART/压力温度高度/寄存器。

本批贴纸同步：Unit M5Bit 2张参考重绘；Unit Mini BPS 2张参考重绘；Unit HEX 1张参考重绘。精确SKU无原稿，本款清楚PCB/前标/后膜代码准确重绘普通高清PNG并注明来源，个体QR/编号和宣传叠字不复制；PCB不添假膜，真实膜/压纹保留。私表/URL/原名/映射/矢量及原始资料/生成器/中间件留分发树外；不裁照片、不借错款、不编微字或以图遮缺件。新增代码MIT，官方照片和第三方标识保留各自权利。

本批两入口/实际配置与去墨、实体接口/通气路径和37灯外驱、StickS3→HUB三分支四芯、变父/peer/外驱无echo、host framebuffer与资源释放、6导出/双build及在线PNG已保存[本批进度](../artifacts/m5bit-bps-hex-expansion/progress.json)。未逐面浏览器/GPU、历史全量或硬件验收；旧50PNG、私Scroll、StackChan量产fit-unresolved、Puzzle Bridge、Catch及既有延期保持，整体goal active。


## 前批检查点：EXT.IO / ADC / DAC

该批保存时本地178款（14主机、164Unit），全部 `modeled`、`verified` 为0。本批新增EXT.IO U011、ADC U013、DAC U012原版/EOL及5张本款普通PNG。GitHub `main`的163款已同步于 `4fd5216`，见[163款同步记录](GIT-SYNC-163-2026-10-27.md)；随后批41/42/43/44/45共15款/24PNG仍是本地增量，未再次提交推送。实际结构/API见[本批指南](EXTIO-ADC-DAC-UNITS.md)，47批范围见[增量索引](LOCAL-EXPANSION.md)。

三款根据本款官方尺寸与自身多视图参数化重建，无本款CAD，不声明原生面或套新版。U011保PCA9554PW/真实2×5 IO/红Grove，旧款11mm表与B图10.2mm冲突已记录，B图不作旧款精确datum；U013/U012各按自身32×24×10.2图、真实前装可拆橙2P端子/接收深腔/触点及板/四芯Grove支持。无色壳字/箭头为实体，贴纸不遮缺件。最终实际API/PNG：extio 控件0[无]、灯0[无]、显示0[无]、关节[无]、端口[grove,io]、PNG1；adc 控件0[无]、灯0[无]、显示0[无]、关节[无]、端口[grove,terminal]、PNG2；dac 控件0[无]、灯0[无]、显示0[无]、关节[无]、端口[grove,terminal]、PNG2。内部安装与配合推导另记，不称完整BOM或制造/实物验收，不模拟IO/ADC/DAC/电气/固件。

本批贴纸同步：Unit EXT.IO 1张参考重绘；Unit ADC 2张参考重绘；Unit DAC 2张参考重绘。私表精确SKU核对无原稿，本款清楚后标/端子极性代码准确重绘普通高清PNG并标明来源；私表/URL/原名/映射/矢量及原始资料/生成器/中间件均留分发树外。不裁照片、不借错款、不编微字或个体码，不添假膜。新增代码MIT，官方照片和第三方标识保留各自权利。

本批两入口/全部实际配置与去墨、真实接口/端子装拆及有证机械动作、StickS3→HUB三分支四芯、变父/peer/外驱无echo、host framebuffer与资源释放、8导出/双build及在线PNG已保存[本批进度](../artifacts/extio-adc-dac-expansion/progress.json)。未逐面浏览器/GPU、历史全量或硬件验收；旧50PNG、私Scroll、StackChan量产fit-unresolved、Puzzle Bridge、Catch及既有延期保持，整体goal active。


## 前批检查点：M5Camera-X / UnitV2-M12 / TimerCamera-X

该批保存时本地175款（14主机、161Unit），全部 `modeled`、`verified` 为0。本批新增M5Camera-X U038、UnitV2-M12 U078-M12、TimerCamera-X U082-X及2张本款普通PNG。GitHub `main`的163款已同步于 `4fd5216`，见[163款同步记录](GIT-SYNC-163-2026-10-27.md)；随后批41/42/43/44共12款/19PNG仍是本地增量，未再次提交推送。实际结构/API见[本批指南](M5CAMERAX-V2M12-TIMERCAMX-UNITS.md)，46批范围见[增量索引](LOCAL-EXPANSION.md)。

三款按本款官方MIT完整闭合native壳件与自身照片建模，按整件身份排横向/爆炸重复，不删面或无声伸缩迁就名义尺寸。U038保白壳原生压纹/真实光学与RESET和接口，排网页错挂尺寸图；U078-M12保本款光学/真实弹性舌与独立外驱焦环，固定sensor/板/口/壳不随焦环转动，未知螺距不造轴移联动或自动调焦；U082-X保66.5度/140mAh与本款帽/光路和安装件。原生壳、光学、膜和附件包络分记，实际附件名与family据各款冻结证据。最终实际API/PNG：m5camera-x 控件1[reset]、灯0[无]、显示0[无]、关节[无]、端口[grove,usb,mount]、PNG0；unitv2-m12 控件1[user]、灯0[无]、显示0[无]、关节[focus]、端口[grove,usb,sd]、PNG1；timercamera-x 控件2[power,reset]、灯1[status]、显示0[无]、关节[无]、端口[grove,usb,mount]、PNG1。隐藏安装、行程、光学和配合推导另记，无证灯/转子/轴/铰链不编，不称制造或实物验收。

本批贴纸/标记同步：M5Camera-X无PNG，保真实无色原生压纹；UnitV2-M12 1张参考重绘；TimerCamera-X 1张参考重绘。M5Camera-X只有已证无色native M5压纹，0PNG是实际载体判断；其余清楚本款后标代码重绘普通高清PNG。私表/URL/原名/映射/矢量及原始CAD官图/生成器/中间件均留分发树外，不裁照片、不借错款、不编微字或个体QR/MAC/SN，不添假膜或以图片遮缺件。新增代码MIT，官方结构与第三方标识保留各自权利。

本批两入口/全部实际配置与去墨、真实按放/取消/焦环形状及固定件、附件拆装、StickS3→HUB三分支四芯、变父/peer/外部输出无echo、host framebuffer与资源释放、10导出/双build及在线源PNG已保存[本批进度](../artifacts/m5camerax-v2m12-timercamx-expansion/progress.json)。未逐面浏览器/GPU、历史全量或硬件验收；旧50PNG、私Scroll、StackChan量产fit-unresolved、Puzzle Bridge、Catch及既有延期保持，整体goal active。


## 前批检查点：UnitV2-USB / UnitV-M12 / TimerCamera-F

该批保存时本地172款（14主机、158Unit），全部 `modeled`、`verified` 为0。本批新增UnitV2-USB U078-USB、UnitV-M12 U078-V-M12、TimerCamera-F U082-F及4张本款普通PNG。GitHub `main`的163款已同步于 `4fd5216`，见[163款同步记录](GIT-SYNC-163-2026-10-27.md)；随后批41/42/43共9款/17PNG仍是本地增量，未再次提交推送。实际结构/API见[本批指南](UNITVUSB-M12-TIMERCAM-UNITS.md)，45批范围见[增量索引](LOCAL-EXPANSION.md)。

三款按各自官方MIT STL完整闭合壳件与本款实拍建模，按分件身份排横向副本/爆炸重复，不把整排源文件包络当整机，不删面或静默拉伸迁就规格。USB版保固定USB-A凸罩/USB-A/C/HY2.0/SD/实际顶部弹性舌与自身clip，无内置相机或可拆镜头盖；M12保自身CNC框/M12光学/侧键与原生壳半；TimerF保本款鱼眼/真实板与270mAh电池/安装附件，旧CAD点阵孔按本款实拍以本体塑料补实，保源面并记录版本差异。原生壳与含光学/接口/夹具的包络分记。最终冻结API/PNG记录：unitv2-usb 控件1[user]、灯0[无]、显示0[无]、关节[无]、端口[grove,usb-a,usb,sd,mount]、PNG1；unitv-m12 控件2[buttonA,buttonB]、灯0[无]、显示0[无]、关节[无]、端口[grove,usb,sd]、PNG2；timercamera-f 控件2[power,reset]、灯1[status]、显示0[无]、关节[无]、端口[grove,usb,mount]、PNG1。实际cap/输出/转动只据本款证据并由外部驱动，固定包体/板/口保留；无证外灯/轴/铰链不编，隐藏安装与行程/光学/配合推导单独记录。

贴纸随三款同步：UnitV2-USB 1张参考重绘；UnitV-M12 2张参考重绘；TimerCamera-F 1张原稿栅格。本款原稿核准后转普通PNG，缺源按清楚本款官图代码重绘，明确真实膜或CNC/PCB载体；排包装/错版/照片裁切/不可辨微字及变量QR/MAC/SN，印刷不遮缺件。两入口实际配置artwork:false保全部物理attributes/index/world。必要检查依实际freeze覆盖输入/外驱形状、三分支四芯、真实多接口/附件独立装拆、peer/framebuffer/disposal、9导出/两build/5188实际资源字节；执行记录见[本批进度](../artifacts/unitvusb-m12-timercam-expansion/progress.json)。没有USB/UART/AI抓拍、音频、RTC唤醒、读数、电气或固件仿真，不伪造视频display。未逐面浏览器/GPU、历史全量、制造或实物验收。私表/URL/原名/映射/矢量/原始来源/生成器/中间材料继续只留分发树外。


## 前批检查点：Mini IMU-Pro / Glass / 8Servos2-Chain

该批保存时本地169款（14主机、155Unit），全部 `modeled`、`verified` 为0。本批新增Mini IMU-Pro U171、Glass U158、8Servos2-Chain U223及7张本款普通PNG。GitHub `main`的163款已同步于 `4fd5216`，见[163款同步记录](GIT-SYNC-163-2026-10-27.md)；随后批41/42共6款/13PNG仍是本地增量，未再次提交推送。实际结构/API见[本批指南](IMUPRO-GLASS-SERVOSCHAIN-UNITS.md)，44批范围见[增量索引](LOCAL-EXPANSION.md)。

三款按官方发布尺寸和自身实拍参数化，不声明原生CAD面、不借U095/Glass2/U222。U171内部SW1未见外部通道，不许诺闭壳地址控件；原款Glass保自身两侧键、透明蓝128×56显示区及真实固定蜂鸣载体；U223保官方发布外形/孔/窗/DC尺寸，其与U222相同的尺寸图不作独立内部装配证据，内部按U223实拍电容/载体和Chain IN/OUT HY2.0-4P/24针构建，无U222旋钮，未证外部光路不造外灯。最终冻结API/PNG记录：mini-imu-pro 控件0[无]、灯0[无]、显示0[无]、端口[grove]、PNG3；glass 控件2[button-a,button-b]、灯0[无]、显示1[screen]、端口[grove]、PNG2；8servos2-chain 控件0[无]、灯0[无]、显示0[无]、端口[grove,out,ch0,ch1,ch2,ch3,ch4,ch5,ch6,ch7,dc]、PNG2。实际控件、输出、配置和命令以作者冻结记录为准，不预填数量或为报表修改产品；隐藏安装、行程/配合推导单独记录。

贴纸随三款同步：Unit Mini IMU-Pro 3张参考重绘；Unit Glass 2张参考重绘；Unit 8Servos2-Chain 2张原稿栅格。优先核准本款原稿转普通PNG；缺原稿按本款清楚官方照片代码重绘。按真实载体配准，屏幕不贴永久内容；排包装/错版/照片裁切/不可辨微字，印刷不遮缺件，不添无证胶膜。两入口实际配置artwork:false保全部物理attributes/index/world。必要检查依实际freeze覆盖输入/外驱输出、三分支四芯、多接口嵌套/独立装拆、peer/framebuffer/disposal、6导出/两build/5188实际资源字节；执行记录见[本批进度](../artifacts/imupro-glass-servoschain-expansion/progress.json)。没有地址联动、传感数值、触控、音频合成、servo/PWM、Chain/I2C、电气或固件仿真。未逐面浏览器/GPU、历史全量、制造或实物验收。私表/URL/原名/映射/矢量/生成器/中间材料继续只留分发树外。


## 前批检查点：CardKB2 / Neco / Mini OLED

该批保存时本地166款（14主机、152Unit），全部 `modeled`、`verified` 为0。本批新增CardKB2 U215、Neco U163、Mini OLED U166及6张本款普通PNG。GitHub `main`的163款已同步于 `4fd5216`，见[163款同步记录](GIT-SYNC-163-2026-10-27.md)；随后本批共3款/6PNG仍是本地增量，未再次提交推送。实际结构/API见[本批指南](CARDKB2-NECO-MINIOLED-UNITS.md)，43批范围见[增量索引](LOCAL-EXPANSION.md)。

三款按自身清楚尺寸图/实物照片参数化，不声明原生CAD面、不借旧CardKB/NeoHEX/旧OLED。CardKB2保42矩阵键加RST/BOOT共44实际瞬时控件、Grove/USB-C/RGB，1mm板厚与6.15mm器件包络分记；Neco保自身猫耳曲边板、35独立RGB/后轻触键/双Grove及固定眼，43mm孔距与47.1mm全宽分记；Mini OLED保72×40白色外驱面板、双Grove及默认装配态折回FPC，6.75图纸与6.8圆整规格分记。实际控件只改变对应cap/plunger，固定package/接点/板/口保持；隐藏安装、行程/FPC弯曲等推导记录，不称制造或量产配合验收。

贴纸随三款同步：Unit CardKB2 2张原稿栅格+参考重绘；Unit Neco 2张参考重绘；Unit Mini OLED 2张参考重绘。原稿/参考重绘按各自artwork记录，PCB不添胶膜、无字红plunger不添字、字符留在实际固定PCB、屏幕不贴永久内容；排包装/错版/照片裁切/不可辨微字，印刷不遮缺件。两入口实际配置与按下态artwork:false保全部物理attributes/index/world。必要检查包括44键/后轻触键多源释放取消、独立外驱灯/白OLED、三分支真实四芯、多接口嵌套/独立装拆、peer/framebuffer/disposal、6导出/两build/5188实际资源字节；执行记录见[本批进度](../artifacts/cardkb2-neco-minioled-expansion/progress.json)。没有键盘组合/字符模式、WS2812级联、I2C/SSD1315、电气或固件仿真。未逐面浏览器/GPU、历史全量、制造或实物验收。私表/URL/原名/映射/矢量/生成器/中间材料继续只留分发树外。


## 前批检查点：CatM / NeoHEX / ENV-IV

该批保存时本地163款（14主机、149Unit），全部 `modeled`、`verified` 为0。本批新增CatM U128、NeoHEX A045-B、ENV-IV U001-D及5张本款普通PNG。本次Git同步收录全部163款及批37–40新增的12款/27PNG，见[163款同步记录](GIT-SYNC-163-2026-10-27.md)。历史检查点中的未推送描述保留其保存时点；当前提交与远端状态以Git日志及GitHub main为准。实际结构/API见[本批指南](CATM-NEOHEX-ENVIV-UNITS.md)，42批范围见[增量索引](LOCAL-EXPANSION.md)。

CatM保本款6592完整原装面、单普通SMA/蓝Grove/NanoSIM与真实蜂窝封装，不借宽壳CatM GNSS；未证外灯光路/铰轴不造外灯或关节。NeoHEX无CAD，按自身尺寸图与照片参数化37真实灯、两斜一竖Grove形接口、六耳和独立均光片；36mm孔心基准/31mm主体/耳外包络及9.55图纸/9.6规格分记。ENV-IV无CAD，按自身尺寸与实板照片构建通气壳、红Grove和SHT40/BMP280，真实槽壁/安装背衬齐备。隐蔽壁/卡扣、安装和附件配准推导分别记录；真实配置/附件/可达组件依最终冻结API，不称制造或量产配合验收。

贴纸随三款同步：Unit CatM 2张原稿栅格；Unit NeoHEX 2张参考重绘；Unit ENV-IV 1张原稿栅格。原稿/官方平面栅格/参考重绘按各自artwork记录，PCB印字不添胶膜；排包装/错版/照片裁切/不可辨微字，印刷不遮缺件。两入口实际配置artwork:false保全部物理attributes/index/world。必要检查包括三分支真实四芯、多接口/独立装拆、真实附件与外驱灯noecho、peer/framebuffer/disposal、8导出/两build/5188实际资源字节；执行记录见[本批进度](../artifacts/catm-neohex-enviv-expansion/progress.json)。没有蜂窝/UART/网络、电气/WS2812级联、环境读数或固件状态。未逐面浏览器/GPU、历史全量、制造或实物验收。私表/URL/原名/映射/矢量/生成器/中间材料继续只留分发树外。


## 前批检查点：UnitV-OV7740 / LoRaE220-433 / 8Servos2-I2C

该批保存时本地160款（14主机、146Unit），全部 `modeled`、`verified` 为0。本批新增UnitV-OV7740 U078-C、LoRaE220-433 U170-433、8Servos2-I2C U222及7张本款普通PNG。GitHub `main`的151款已同步于 `a8198a5`，见[151款同步记录](GIT-SYNC-151-2026-10-27.md)；随后三批共9款/22PNG仍是本地增量，未再次提交推送。真实结构/API见[本批接入指南](UNITV-LORA433-SERVOS2-UNITS.md)，41批范围见[增量索引](LOCAL-EXPANSION.md)。

UnitV保本款7056原装源面、真实双原生弹片与plunger、镜头/板/USB/TF/Grove和RGB真实孔；按钮只改变对应原生弹片及真实压杆，具体可达组件以冻结API为准。LoRa433保自身6614原装面、两个真实稳定DIP与普通SMA，配套110mm天线独立可拆且静态，未证铰轴不猜关节或RPM。8Servos2无本款CAD，依据自身六视尺寸/清楚照片完整参数化；双Grove/DC/24个male针、固定刻度与16稳定档rotary-selector齐备，支持实际drag和外驱无回声；真实LED外部光路未证则不造外灯。隐藏安装、参数化壳壁/卡扣、控件行程与附件轮廓推导分记，不称制造或量产配合验收。

贴纸同步按各自artwork.json分列：UnitV-OV7740 1张官方平面栅格；Unit LoRaE220-433 3张参考重绘；Unit 8Servos2-I2C 3张原稿栅格+参考重绘。UnitV使用整块官方平面位图，不称私矢量原稿或重绘；LoRa433的第三面是固定DIP cover印字，不添第三张物理膜；U222前背原稿与固定刻度重绘不统称原稿。排包装/错版/照片裁切/不可辨微字，印刷不遮缺件；所有入口实际配置artwork:false保全部物理attributes/index/world。必要检查包括三分支真实四芯、双键与固定件、稳定DIP/16档选择器drag和外驱无回声、实际配置/独立装拆/framebuffer、16档demo面板的两份专项报告及7导出/两build/5188实际资源字节，执行结果见[本批进度](../artifacts/unitv-lora433-servos2-expansion/progress.json)。没有摄像/AI/SD/USB/UART、RF/模式、电气/PWM/地址算法或内部舵机状态；未逐面浏览器/GPU、历史全量、制造或实物验收。私表/URL/原名/映射/矢量/生成器/中间件继续只留分发树外。


## 前批检查点：DoF6 / DoF9 / BMM350

该批保存时本地157款（14主机、143Unit），全部 `modeled`、`verified` 为0。本批新增DoF6 U228、DoF9 U229、BMM350 U231及9张本款普通PNG。GitHub `main`的151款已同步于 `a8198a5`，见[151款同步记录](GIT-SYNC-151-2026-10-27.md)；随后两批共6款/15PNG仍是本地增量，未再次提交推送。真实结构/API见[本批接入指南](DOF6-DOF9-BMM350-UNITS.md)，40批范围见[增量索引](LOCAL-EXPANSION.md)。

三款分别保各自官方路径的完整4188原装壳面。发布壳源字节相同不推出板上器件、控件和印刷相同：DoF6仅BMI270，DoF9为BMI270+BMM350，BMM350只保本款磁感封装；共享原理图NC/选件和DoF10气压件不跨款装入。真实PCB/Grove/孔壁/背衬/标签薄膜齐备；DoF6/DoF9真实稳定SW1只移动滑片和杆，释放/取消保档，BMM350顶槽保本款固定黑色背衬且无虚构拨片。实际组件/服务配置及推导边界以冻结API与单品来源为准。

每款同步从有效本体原稿栅格或可读本款官图代码重绘PNG，排包装/错版/照片裁切/不可辨微字，不能靠印刷遮缺件。两入口实际配置artwork:false保全部物理attributes/index/world。三分支真实四芯、稳定档位/多源取消和外驱无回声、实际配置与其余物理保持、独立装拆/framebuffer、6导出/两build/5188实际资源字节见[本批进度](../artifacts/dof6-dof9-bmm350-expansion/progress.json)。没有惯性/磁场读数、地址算法、固件或电气状态；未逐面浏览器/GPU、历史全量、制造或实物验收。私表/URL/原名/映射/矢量/生成器/中间件继续只留分发树外。


## 前批检查点：HBridge / CatM GNSS / Ultrasonic-IO

该批保存时本地154款（14主机、140Unit），全部 `modeled`、`verified` 为0。本批新增`hbridge` U160、`catm-gnss` U137、`ultrasonic-io` U098-B2及6张本款普通PNG。GitHub `main`的151款已同步于 `a8198a5`，见[151款同步记录](GIT-SYNC-151-2026-10-27.md)；本批3款/6张实际PNG仍是本地增量，未再次提交推送，当前待同步合计3款/6PNG。真实结构/配置/API见[本批接入指南](HBRIDGE-CATM-ULTRASONIC-UNITS.md)，39批范围见[增量索引](LOCAL-EXPANSION.md)。

原HBridge U160保自身5592原装面和STM32/RZ7899/供电实体、Grove/4P座及本款可拆四头插头，区别已覆盖U160-V11。实际四位DIP/VM稳定滑选仅滑片/杆改变档位；被前盖挡住时没有穿壳pointer目标，外部真实档位API仍保留，去对应盖后才可指针交互。头角外驱不模拟轴向夹紧，不借v1.1的loose电容或造旋钮、马达状态。

CatM GNSS U137以自身5284原装面为源；左SMA窗口限域派生后运行5248面（前2610/后2638），前2489原面保留、157原面在限域内替换为121新面，完整后壳保持。区域、保留/替换对应与材料闭合以最终sources/smoke为准，不把5284源面数当运行保留面数。宽壳/四安装孔、SIM7080G/实际板、MicroSIM/DC/Grove与双SMA齐备，不套窄NBIoT/NanoSIM。六种真实配置、LTE杆与GNSS同轴+puck独立装拆；只有真实可辨轴才给外驱展示角，同轴与Grove四芯分开。NET/STA标签不当外部光路证据，真实内部载体保留但光路未证不造外灯或网络/定位状态。

Ultrasonic-IO U098-B2保自身5510原面/原公差、RCWL-9620 GPIO板、黑Grove、两个真实网罩/深膜片及支撑、后盖与本款IO背标，不借B1 I2C打印或拉壳。官方错PinMap已反馈，按自身清楚PORT.B I/O照片记外观；没有声波/膜片动画、读数、触发回声时序或电气/固件行为。

贴纸同步本款原稿栅格或本款清楚官图代码重绘，逐款分列来源；不裁照片/借错型号/编小字/靠PNG填缺件。所有入口实际配置artwork:false保全部物理attributes/index/matrixWorld。必要专项 `node scripts/check-hbridge-catm-ultrasonic-units.mjs`，实际分支四芯/动作固定分离/独立装拆、9导出、两build及5188源PNG/运行chunk字节范围见[本批进度](../artifacts/hbridge-catm-ultrasonic-expansion/progress.json)。未逐面浏览器/GPU、全量历史、制造或实物验收；私表/URL/原稿名/矢量/映射/生成器/中间件继续分发树外。


## 前批检查点：NBIoT2 / NBIoT-CN / Mini Proto

该批保存时本地151款（14主机、137Unit），全部 `modeled`、`verified` 为0。本批新增`nbiot2` U111-B、`nbiot-cn` U112、`mini-proto` U064及5张本款普通PNG。本次Git同步包含这151款源码，新增八批共24款及48张PNG；提交与远端状态以Git日志为准，见[151款同步记录](GIT-SYNC-151-2026-10-27.md)。下方各前批检查点中的Git数量与未推送描述保留其历史时点。真实结构/配置/API见[本批接入指南](NBIOT-MINI-PROTO-UNITS.md)，38批范围见[增量索引](LOCAL-EXPANSION.md)。

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


更新日期：2026-10-26。

本表范围是新增 GPS v1.1、Weight-I2C、8Servos 之前的43款模型，这43款默认外观均至少接入一处贴纸或印刷层：14款只使用原稿栅格，3款同时使用原稿栅格与参考重绘，26款使用参考重绘。7款另保留必须显式选择的中文教育版。接入指定印刷面不表示每款的所有印刷面或整体几何验收均已完成；全部产品继续保持 `modeled`。

用户于2026-10-26要求停止耗时复核、继续其他Unit，因此本批50张参考重绘PNG保留为待复核检查点，不宣称完整check或逐面浏览器验收完成。后续新增型号的贴纸进度由各自产品记录单独说明，不并入以上历史统计。

2026-10-26 用户明确授权缺原稿处按同型号官方照片重绘高清 PNG，并标明来源。重绘层标记 `reference-redraw`，原稿栅格仍标记 `official-raster` / `official-raster-film`。可辨文字和图形重新绘制，不复制产品照片像素；字体、字距、颜色与物理配准存在照片推导误差。高像素不代表厂商矢量或电气引脚验证。

清单依据：`catalog/products.json`、下表所列公开源码，以及 `src/modeling/artwork.js`。原表行、原始下载地址、原素材文件名、矢量及私有素材索引不在本文中记录。

## ID / RF433R / RF433T 同步印刷

2026-10-26。本批三款同步6张 `reference-redraw` PNG，每款正背各1张，均从精确本款官图可辨文字/符号代码重绘。没有裁产品照片、套相近型号、接收/发射版互借或编造不可辨小字。原壳、实际芯片/引脚、PCB、Grove深腔/触点和胶贴基底独立；RF433R/T内置PCB天线固定、不发光，没有外接天线、RF动效、假观察窗或关节。隐藏布局/安装和字体/颜色/配准是推导，实体不依赖贴纸遮挡。

[新增Unit表](UNIT-STICKER-ADDITIONS.md)该批保存时列84款、catalog127款（14主机、113Unit），全部 `modeled`、`verified` 为0。本次127款源码同步包含112款基线 `32c95e0` 后新增的15款Unit/28张对应PNG及三旧端子闭合修复，范围见[127款同步记录](GIT-SYNC-127-2026-10-26.md)。历史progress中的未提交/未推送字样仅描述其保存时点，远端状态以GitHub main及实际推送回执为准。30批记录见[本地增量索引](LOCAL-EXPANSION.md)。各实例 `artwork:false`保持全部物理attributes/index与世界矩阵；必要专项 `node scripts/check-id-rf433-units.mjs`及[本批指南](ID-RF433-UNITS.md)对应，综合范围以[本批进度](../artifacts/id-rf433-expansion/progress.json)为准。三款本体均只有 `grove`，无sensor/按钮/关节/灯/显示或内部数值；身份/密钥/证书/加密/I2C与RF/ASK/数据/强度/距离/通信、协议、电气与固件由外部实现。没有新增逐面浏览器、全量历史或实物验收；私表、私有链接/原稿名、矢量、官图CAD原件、生成器和中间件留仓库外。

## Accel / OP90 / OP180 同步印刷

2026-10-26。本批三款同步4张 `reference-redraw` PNG：Accel正背2张，OP90/OP180各背贴1张，均从精确本款官图可辨文字/符号代码重绘。没有裁产品照片、套相近型号或编造不可辨小字。原壳、真实传感器、PCB、Grove和胶贴基底独立；光电封装有实际固定结构、收发窗口、引脚和真空气槽，不用印刷或平面填料遮槽。90/180是固定结构方向，不是旋转关节；IR不作可见发光或检测锥。

该批完成时[新增Unit表](UNIT-STICKER-ADDITIONS.md)列81款，当时catalog124款（14主机、110Unit），全部 `modeled`、`verified` 为0。公开仓库112款提交基线为 `32c95e0`，该批保存时其后共12款及三旧端子局部修复为本地增量；当前未推送范围以本文最新批次记录为准；Git同步范围见[112款同步记录](GIT-SYNC-112-2026-10-26.md)。29批记录见[本地增量索引](LOCAL-EXPANSION.md)。各实例 `artwork:false`保持全部物理attributes/index与世界矩阵；必要专项 `node scripts/check-accel-opto-units.mjs`及[本批指南](ACCEL-OP90-OP180-UNITS.md)对应，综合范围以[本批进度](../artifacts/accel-op90-op180-expansion/progress.json)为准。三款本体均只有 `grove`和被动 `sensor`，无按钮/关节/灯/显示或内部数值；加速度、遮挡/检测/计数/电平、协议、电气与固件由外部实现。没有新增逐面浏览器、全量历史或实物验收；私表、私有链接/原稿名、矢量、官图CAD原件、生成器和中间件留仓库外。

## Mini PDM / Mini BPS v1.1 / MIC 同步印刷

2026-10-26。本批三款同步5张 `reference-redraw` PNG：Mini PDM和Mini BPS v1.1各正背2张，MIC背贴1张，均从本款官图可辨文字/符号代码重绘。没有裁产品照片、套相近型号或编造不可辨小字；BPS使用精确U090-B QMP6988 v1.1。PDM官方13mm表与自身8mm尺寸图/原壳分别记录并有反馈，原壳保持不缩放。金属MEMS/气压封装、真孔/孔网/深腔、PCB、MIC蓝座/旋转头、Grove和胶贴基底独立，印刷不遮缺件。

该批完成时[新增Unit表](UNIT-STICKER-ADDITIONS.md)列78款，当时catalog121款（14主机、107Unit），全部 `modeled`、`verified` 为0。公开仓库112款提交基线为 `32c95e0`，该批保存时其后共9款为本地增量；当前未推送范围以本文最新批次记录为准；Git同步范围见[112款同步记录](GIT-SYNC-112-2026-10-26.md)。28批记录见[本地增量索引](LOCAL-EXPANSION.md)。各实例 `artwork:false`保持全部物理attributes/index与世界矩阵；必要专项 `node scripts/check-audio-pressure-units.mjs`及[本批指南](AUDIO-PRESSURE-UNITS.md)对应，综合范围以[本批进度](../artifacts/audio-pressure-expansion/progress.json)为准。三款都只有被动 `sensor`，MIC另有外驱有限角 `threshold` 调节头，无灯/按钮/显示或内部数值；音频、气压、电气与固件由外部实现。没有新增逐面浏览器、全量历史或实物验收；私表、私有链接/原稿名、矢量、官图CAD原件、生成器和中间件留仓库外。

## Roller485 Lite / Mini CAN / INA226-10A 同步印刷

2026-10-26。本批三款同步7张PNG：Roller485 Lite三张和Mini CAN两张为自身官图代码重绘 `reference-redraw`，INA226-10A精确10A/5mΩ正背两张为 `source-vector-raster`，保留原轮廓/颜色并恢复复合字腔，不混1A版本/包装。没有裁产品照片、套相近型号或编造不可辨小字。电机/PCB、非隔离SO8、隔离16脚封装、分流器、端子和胶贴基底有独立实体，印刷不遮缺件；字体/颜色/配准及原稿恢复限制见单品来源。

该批完成时[新增Unit表](UNIT-STICKER-ADDITIONS.md)列75款，当时catalog118款（14主机、104Unit），全部 `modeled`、`verified` 为0。公开仓库112款提交基线为 `32c95e0`，该批保存时其后共6款为本地增量；当前未推送范围以本文最新批次记录为准；Git同步范围见[112款同步记录](GIT-SYNC-112-2026-10-26.md)。27批记录见[本地增量索引](LOCAL-EXPANSION.md)。各实例 `artwork:false`保持全部物理attributes/index与世界矩阵；必要专项 `node scripts/check-roller-mini-can-ina226-units.mjs`及[本批指南](ROLLER-MINI-CAN-INA226-UNITS.md)对应，综合范围以[本批进度](../artifacts/roller-mini-can-ina226-expansion/progress.json)为准。Roller转子/壳舌/OLED/RGB各按真实API外驱，三款四头插头只旋转可见螺钉；Mini/INA无数值锚点或外露LED。没有新增逐面浏览器、全量历史或实物验收；私表、私有链接/原稿名、矢量、官图CAD原件、生成器与中间件留仓库外。

## UWB / TMOS PIR / Mini ToF-90 同步印刷

2026-10-26。本批三款同步6张PNG，每款2张。UWB采用精确标准机身正背原稿恢复栅格 `source-vector-raster`，保留原色和轮廓，恢复转换中的 `evenodd`→`nonzero`复合字腔；包装/照片排除。TMOS PIR和Mini ToF-90使用自身官图代码重绘 `reference-redraw`，不裁照片、不编不可辨字、不套相近型号。内置天线/PCB、硅滤光窗、固定直角双板与光学深腔都有独立实体，印刷不遮缺件；原稿恢复及字体/颜色/配准推导见单品来源。

该批完成时[新增Unit表](UNIT-STICKER-ADDITIONS.md)列72款，当时catalog115款（14主机、101Unit），全部 `modeled`、`verified` 为0。公开仓库112款提交基线为 `32c95e0`，该批保存时新增三款为本地增量；当前未推送范围以本文顶部批次记录为准；Git同步范围见[112款同步记录](GIT-SYNC-112-2026-10-26.md)。26批记录见[本地增量索引](LOCAL-EXPANSION.md)。各实例 `artwork:false`保持全部物理attributes/index与世界矩阵；必要专项 `node scripts/check-ranging-presence-units.mjs` 及[本批指南](RANGING-PRESENCE-UNITS.md)对应，综合范围以[本批进度](../artifacts/ranging-presence-expansion/progress.json)为准。Mini ToF红灯只独立外驱明暗，不随连接/测距联动；两光学锚点不含数值，不画可见IR或检测锥。没有新增逐面浏览器、全量历史或实物验收；私表、私有链接/原稿名、矢量、官图CAD原件、生成器与中间件留仓库外。

## RS485-ISO / AIN4-20mA / AC Measure 同步印刷

2026-10-26。本批三款同步6张PNG，每款2张。RS485-ISO和AIN4-20mA采用自身官图代码重绘 `reference-redraw`；AC Measure采用精确机身正背原稿恢复栅格 `source-vector-raster`，保留原色，恢复转换中的 `evenodd`→`nonzero`字腔填充，包装排除。承载实体、真实端子/孔口、电阻/六针/跳帽与PCB/采集封装独立存在，不裁产品照片、不编不可辨字、不借贴纸遮缺件。字体、颜色、安装与配准推导见各款来源记录。

该批完成时[新增Unit表](UNIT-STICKER-ADDITIONS.md)列69款，当时catalog112款（14主机、98Unit），全部 `modeled`、`verified` 为0。该批保存时公开Git为85款 `ad5d062`，当时随后二十七款尚未推送；当前同步以本文顶部记录为准。各实例 `artwork:false`保持对应盖/插头/电阻/跳帽配置全部物理attributes/index及世界矩阵。必要专项 `node scripts/check-isolated-interface-units.mjs`与[本批指南](ISOLATED-INTERFACE-UNITS.md)对应，综合范围以[本批进度](../artifacts/isolated-interface-expansion/progress.json)为准；未新增逐面浏览器、全量历史或实物验收。私表、私有链接/原稿名、矢量、官图CAD原件、生成器和中间件仅留仓库外。

## BLDC Driver / RCA / Puzzle 同步印刷

2026-10-26。本批三款同步6张 `reference-redraw` PNG（BLDC Driver 2、RCA 2、Puzzle 2），私表无精确原稿，按已授权本型号官图代码重绘。BLDC Driver正背、RCA背壳与PCB固定标、Puzzle背面双Grove方向标分别归属真实承载件；正面矩阵不是贴纸。不裁产品照片、编造不可读字或借印刷盖缺件；字体/颜色和配准推导见单品研究。

该批完成时[新增Unit表](UNIT-STICKER-ADDITIONS.md)列66款，当时catalog109款（14主机、95Unit），全部 `modeled`、`verified` 为0。公开Git仍85款 `ad5d062`，后续二十四款本地增量未自动再次推送。各实例 `artwork:false` 保持插头/闭壳/开盖配置全部物理attributes/index和世界矩阵，包含实际64灯/隔光栅格/插座/壳内滑钮。必要专项 `node scripts/check-bldc-rca-puzzle-units.mjs` 与[本批指南](BLDC-RCA-PUZZLE-UNITS.md)对应，综合结果以本批进度为准；未增加逐面浏览器、全量历史或实物验收。原表、私有链接/原稿名、矢量、官图CAD原件、生成器/中间件仅留仓库外。

## Thermal2 / FlashLight / GPS SMA 同步印刷

2026-10-26。本批新增三款同步7张 `reference-redraw` PNG（Thermal2 2、FlashLight 2、GPS SMA 3）；私表无精确原稿，按已授权本型号官图代码重绘。Thermal2不套NCIR2标签，FlashLight背壳与PCB固定模式标分层，GPS本体和随附puck分别印刷，不裁产品照片或用贴纸遮缺件。字体、颜色、可辨小字与配准推导保留在单品研究。

该批完成时[新增Unit表](UNIT-STICKER-ADDITIONS.md)列63款；当时catalog106款（14主机、92Unit），全部 `modeled`、`verified` 为0。公开Git仍85款 `ad5d062`，后续二十一款本地增量未自动再次推送。各配置 `artwork:false` 保持完整物理attributes/index及世界矩阵，包含真实原壳舌、开盖模式开关与天线装拆。必要专项 `node scripts/check-thermal2-flashlight-gps-units.mjs` 与[本批指南](THERMAL2-FLASHLIGHT-GPS-UNITS.md)对应，综合范围以本批进度为准；未增加逐面浏览器、全量历史或实物验收。原表、私有链接/原稿名、矢量、官图CAD原件、生成器和中间件留仓库外，公开最终普通PNG及安全配准/来源。

## DCSSR / NCIR2 / Reflective IR 同步印刷

2026-10-26。本批新增三款同步6张 `reference-redraw` PNG（DCSSR 2、NCIR2 2、Reflective IR 2），私表无精确原稿，按已授权同型号官图代码重绘。公开最终普通PNG和配准，不公开原表、私有链接/原稿名、矢量、原始官图/CAD、生成器或中间件；不裁产品照片、不用贴纸遮缺件。具体可辨范围、字体/颜色和注册推导见单品研究。

该批完成时[新增Unit表](UNIT-STICKER-ADDITIONS.md)列60款，当时catalog103款（14主机、89Unit），全部 `modeled`、`verified` 为0。Git基线仍85款 `ad5d062`，后十八款本地增量未自动再次推送。`artwork:false` 保持完整物理attributes/index及世界矩阵，包含真实收发管/感测头、电位器孔和可拆端子配置；必要专项 `node scripts/check-dcssr-ncir2-reflective-ir-units.mjs` 与[本批指南](DCSSR-NCIR2-REFLECTIVE-IR-UNITS.md)对应。本批检查不代表逐面浏览器、全量历史或实物验收。

## Watering / DLight / HBridge 同步印刷

2026-10-26本地新增三款同步接入5张PNG：Watering精确机背原稿轮廓恢复1张 `source-vector-raster`，电机铭牌1张 `reference-redraw`；DLight背贴1张、HBridge正背2张均为同型号官图代码重绘 `reference-redraw`。不裁产品照片，不套用相近型号，不用贴纸掩盖缺件；DLight前面无贴纸，真实光学窗后有透明感测封装与白PCB背衬。Watering机背的源恢复不宣称原稿未经修改直接导出，恢复范围与字体/颜色/物理配准推导见各款记录。

该批完成时[新增Unit表](UNIT-STICKER-ADDITIONS.md)列57款，保留此前54款与以下原43款及各批验收快照。当时本地100款（14主机、86Unit），全部保持 `modeled`、`verified` 为0；GitHub `main` 仍为85款 `ad5d062`，随后十五款本地增量未自动再次推送。

各模型/模块分别传 `artwork:false`，对应配置的完整物理attributes/index和 `matrixWorld` 保持。Watering默认不装双管、`hoses:true` 安装，双软管是外驱形状而非水流；HBridge五枚真实稳定滑块在壳内，默认闭壳不接受pointer，`covers:false`开盖检查才可看/操作。HBridge端子可单独插拔，电容附件必须配插头并跨同一插头的前两槽，无新增接口或电气逻辑。API、配置与必要专项入口见[本批指南](WATERING-LIGHT-HBRIDGE-UNITS.md)和 `node scripts/check-watering-light-hbridge-units.mjs`；两构建、接线、在线资源和隐私结果以对应进度报告为准，不预先声称综合验证、逐面浏览器、全量历史或实物验收通过。私表、私有链接、原稿名、矢量、原始官图/CAD、生成器与中间材料留仓库外，公开仅最终普通PNG、配准及安全来源说明。

## Tube Pressure / MQ / LoRaE220-920 同步印刷

2026-10-26本地新增三款同步接入8张PNG：Tube Pressure背贴1张 `reference-redraw`；MQ精确机身背标1张 `source-vector-raster`，机名标题、空白识别贴与MQ-5银圈字样3张 `reference-redraw`；LoRa正背及固定DIP的ON/1/2共3张 `reference-redraw`。不裁产品照片当贴纸，不把重绘称原稿，不借印刷遮盖缺件。Tube气嘴正面无贴纸，背面贴纸下方的原生M5浮雕保留；MQ空白标不补造气体名称，银圈字样归属可拆感测圆罐；LoRa固定DIP字样不随两枚滑块移动。可辨范围、原稿转换/恢复、字体/颜色及配准推导以单品记录为准。

该批完成时[新增Unit表](UNIT-STICKER-ADDITIONS.md)列54款，保留此前51款与以下原43款及各批验收快照。当时本地97款（14主机、83Unit），全部保持 `modeled`、`verified` 为0；GitHub `main` 仍为85款 `ad5d062`，随后十二款本地增量未自动再次推送。

各模型/模块分别传 `artwork:false`，保留当前配置的物理attributes/index和世界姿态，包括真实管嘴、感测背衬、固定六孔座、内部适配板、可拆MQ-5、两DIP及可折叠天线。MQ名义/CAD24×64×25 mm与默认含罐约24×80.31×25 mm、无罐约24×64.4×25 mm分别记录；LoRa默认构造不装天线，配置菜单先列带天线再列裸本体。API、配置、三分支四芯线和必要专项入口见[本批指南](RADIO-GAS-PRESSURE-UNITS.md)与 `node scripts/check-radio-gas-pressure-units.mjs`。两构建、接线、在线资源和隐私结果以对应进度报告为准，不预先声称综合验证、逐面浏览器、全量历史或实物验收通过。私表、私有链接、原稿名、矢量、原始官图/CAD、生成器与中间素材留仓库外，公开仅最终普通PNG、配准及安全来源说明。

## ADC v1.1 / AMeter / VMeter 同步印刷

2026-10-26本地新增三款同步接入6张PNG，三款各2张，全部按自身型号官方照片代码重绘，标记 `reference-redraw`。所提供表格无这三款精确原稿，不裁产品照片，不套相似型号。ADC v1.1固定2P座正负标与后侧ADS1110/I2C标严格对应U013-V11；AMeter、VMeter各自正背印刷按对应研究记录保留，可辨范围、字体/颜色和物理注册仍含照片推导。

该批完成时[新增Unit表](UNIT-STICKER-ADDITIONS.md)列51款，保留此前48款及其他历史快照，不合并以下原43款或既有回补验收。当时本地94款（14主机、80Unit）均保持 `modeled`、`verified` 为0，对应GitHub85款 `ad5d062` 之后的九款本地增量。

各模型/模块分别传 `artwork:false` 关闭印刷，真实壳体、原孔、PCB、触点、可拆插头、螺钉和物理世界姿态保持。AMeter的 `power` 与VMeter的 `power-led` 是独立外驱亮度光路，固定预览色仅为外观估计，发光色未确认、`colorConfirmed:false`，不作为官方白灯或RGB规格。两款电表名义8mm壳厚与含固定端子10.2mm总厚分别记录。调用与必要专项入口见[ADC/AMeter/VMeter](ADC-METER-UNITS.md)和 `node scripts/check-adc-meter-units.mjs`；构建、接线与在线资源结果以本批进度报告为准，不预先声称综合验证、逐面浏览器、全量历史或实物验收通过。私表、私有下载链接、原稿名、矢量、原始官图、生成器与中间材料留仓库外，公开仅最终普通PNG、配准及安全来源说明。

## TimerPWR / ExtEncoder / NFC 同步印刷

2026-10-26本地新增三款同步接入8张PNG，单独计数。TimerPWR4张（正面机名、按键提示、顶侧接口、背贴）与ExtEncoder2张（固定五芯座接口标、背贴）为自身型号官图代码重绘，标记 `reference-redraw`；TimerPWR不把屏幕内容当贴纸，ExtEncoder不套用带旋钮的Encoder。NFC正背2张使用U216 ST25R3916精确原稿，复合字形填充由 `evenodd` 恢复 `nonzero` 后保留原轮廓及填色，标记 `source-vector-raster`，不宣称未经修改直接导出。

该批完成时[新增Unit表](UNIT-STICKER-ADDITIONS.md)列48款，保留此前45款和其他历史快照；此处不并入下列原43款或既有回补验收。当时本地91款（14主机、77Unit）均保持 `modeled`、`verified` 为0；对应GitHub85款 `ad5d062` 之后的六款本地增量。

各模型/模块分别传 `artwork:false` 关闭印刷，真实壳体、原孔、按键/显示/插座和天线实体保持。API、三分支四芯线和检查入口见[TimerPWR/ExtEncoder/NFC](TIMER-ENCODER-NFC-UNITS.md)，必要专项为 `node scripts/check-timer-encoder-nfc-units.mjs`；运行、构建与在线字节结果以本批进度报告为准，不在此预先宣称通过或增加逐面浏览器、全量历史、实物验收结论。私表、私有下载链接、原稿名、矢量、生成器与中间材料继续留在仓库外，仅最终普通PNG、配准与来源说明进入公开目录。

## DAC2 / DDS / KMeter-ISO v1.1 同步印刷

2026-10-26本地后续新增三款，同步接入7张PNG并独立计数。DAC2正背2张优先使用精确原稿，标记 `source-vector-raster`；恢复范围是复合字形填充规则 `evenodd`→`nonzero`，保留原轮廓、填色及可见面。DDS正背2张按同型号官方照片代码重绘，标记 `reference-redraw`，印刷曲线/框图不生成信号。KMeter使用U133-V11对应正背原稿2张，前图导出为alpha0的圆环依对应预览恢复半透明；K座可辨印字另有1张参考重绘。源恢复不宣称原稿未经修改直接导出，原稿层与重绘层按单品记录分别标识。

DAC2可拆4P插头和独立螺钉、DDS完整SMA母口及KMeter实际K型扁槽的用法见[DAC2/DDS/KMeter](DAC-DDS-KMETER-UNITS.md)。每个实例分别传 `artwork:false` 关闭本批贴层，真实实体和原孔保持。私表、下载URL、原稿名、矢量、生成器与中间素材继续留在仓库外，公开仅普通PNG、配准及来源说明。本批不合并以下历史43款、此前30款回补或36/39/42款新增快照；必要专项与构建/在线资源结果以对应记录为准，没有逐面浏览器或实物验收结论。

## Laser TX / Laser RX / MIDI 同步印刷

2026-10-26新增三款同步接入6张正背 `reference-redraw` PNG，各款2张，独立计数。所提供表格未检索到对应精确型号原稿，按用户已授权的同型号官方图代码重绘方式补齐；不裁产品照片，不分发原图或矢量。TX自身650nm/OUT、RX的IN及MIDI的接口/模式印字作为外观保留；不据此执行光学、GPIO、MIDI路由或音频行为。不可辨文字及配准推导见各款记录。

真实接收/发射实体、MIDI稳定滑块/固定绿灯、DIN/TRS机械类型和四芯线层级用法见[Laser/MIDI](LASER-MIDI-UNITS.md)。`artwork:false` 逐实例关闭本批贴层，物理壳体、原孔、PCB、光学件、插座与光导保持。本批来源和进度不并入下列历史43款、此前30款回补、36款或39款新增快照，不据此宣称构建、在线资源、逐面浏览器或全量验收通过。私有表、下载链接、矢量、生成器及中间件继续留在仓库外，仅最终普通PNG和配准/来源说明进入可公开素材。

## Earth / Hall / QRCode 同步印刷

2026-10-26新增三款同时接入7张PNG，单独计数：Earth默认英文背标和显式 `stickerVariant:'education-cn'` 中文教育版共2张；Hall正背 `reference-redraw` 2张；QRCode正背和侧面 UART/I2C 标共3张精确原稿 `official-raster`，包装素材排除。Earth两版标记 `source-vector-raster`，原稿轮廓/填色及可见层依对应预览和标准官图恢复，并非未修改原稿直接导出。Earth的可选教育版不加入下列历史7款统计。

本批贴层与模型同步，真实活动件、固定折射头配置、四芯线和 API 边界见[Earth/Hall/QRCode](EARTH-HALL-QRCODE-UNITS.md)；来源/配准与剩余限制按各产品记录。原表、下载链接、矢量及生成中间件继续留在仓库外。这里不合并历史43款、此前30款回补或前36款新增记录，不据此宣称新一轮浏览器、构建或在线验收通过。

## Step16 / ASR / UHF-RFID 同步印刷

2026-10-26新增三款时同步接入5张PNG：Step16背贴、ASR正背贴、UHF-RFID正背标。UHF-RFID背贴为精确型号原稿轮廓直接栅格化，标记`official-vector-raster`；其余4张为同型号官方照片参考重绘。原稿、表格、私有链接与生成中间件留在仓库外。真实面与组件边界见[本批指南](STEP-ASR-UHF-UNITS.md)，本批不并入历史43款或此前30款贴纸统计。

## Mini IMU / EXT.IO2 / ACSSR 同步印刷

2026-10-26继续新增三款时同步接入各自对应印刷，仍按精确型号原稿优先/缺源官方照片参考重绘的政策。真实面、API与边界见[本批指南](IMU-EXTIO-ACSSR-UNITS.md)及单品研究记录；不并入下列历史43款或此前30款贴纸统计。

## 近期新增 Unit 同步补贴纸

2026-10-26按用户补充要求，新增Unit同时接入贴纸，并回补近期30款的缺印刷。具体产品、来源类型、面与遗留见[新增Unit贴纸](UNIT-STICKER-ADDITIONS.md)。只执行新增贴图与物理基线/构建必要检查，未恢复耗时逐面浏览器复核；以下43款为原历史范围。

## 17 款原稿栅格已接入范围

省略 `stickerVariant` 或选择 `standard` 时，以下正式栅格层默认启用；`artwork: false` 可关闭本批正式栅格层。

| 型号 | SKU | 当前接入面 | 实现与边界 |
| --- | --- | --- | --- |
| StickS3 | K150 | 背面引脚/电路标；左侧机名标 | `src/devices/sticks3/StickS3.js` |
| CoreS3 | K128 | 主机上侧认证标；独立主机背面电路/屏蔽区标；DinBase 配置的右侧机名标、底侧 DC 和电源标、上侧 Port B/C 标 | `src/devices/cores3/CoreS3.js`；DinBase 的专属面仅在 `dinBase: true` 时接入，不与独立主机背标混用 |
| StopWatch | C152 | 背面电路标 | `src/devices/stopwatch/index.js` |
| Cardputer-ADV | K132-Adv | 前面四条固定键盘底板标；前机名标；StampS3A 电路覆膜；背面电路标；顶侧控制/接口标；Grove 侧面标 | `src/devices/cardputer-adv/stickers.js`；Stamp 覆膜保留独立螺丝/RGB 孔，键盘底板标不随键帽按压 |
| CardputerZero | C154 | 前面四条固定键盘底板标；前机名标；固定电源/USB 区标；独立移动电源帽印刷；背面电路标；右侧 DISPLAY/AUDIO/Grove 标；左侧 USB/BOOT/LAN 标；顶部 GPIO 和 microSD 标 | `src/devices/cardputer-zero/index.js`、`stickers.js`；外围端口及实体开孔的左右方向同步校正，位置迁移见接入文档 |
| PaperMono | C153 | 背面上部电路标 | `src/devices/papermono/index.js`；下部NFC另使用参考重绘 |
| Core2 v1.1 | K010-V11 | 背面电路覆膜；上侧认证标 | `src/devices/core2/stickers.js`；EXT盖标另使用参考重绘，仍不代表全部印刷面完成 |
| PaperColor | C151 | 背面上、下两片电路标；底侧徽标 | `src/devices/papercolor/index.js` |
| StackChan | K151/K151-R | 头部左、右侧面标；头部认证标；固定底座底面标 | `src/devices/stackchan/index.js`；头部贴层随所属实体/关节，底座贴层保持固定；内部复用 CoreS3 的标准贴纸停用 |
| Tab5 | C145/K145 | 背面 ST7123 电路标；电池仓内 BATTERY/M-BUS 标；后机名标；左侧 USB-A、USB-C、耳机、Port A 标；底侧 GPIO 和认证标 | `src/devices/tab5/index.js`；电池仓贴纸位于机械电池盖之下，不贴到盖外面 |
| AtomS3R | C126 | 背面引脚覆膜；上侧认证标 | `src/devices/atoms3r/stickers.js`；背标与插座排/固定板配准，保留实际机械孔及接口装配 |
| Ultrasonic-I2C | U098-B1 | 背面电路/引脚标 | `src/units/ultrasonic-i2c/stickers.js` |
| RGB LED | U003 | 背面标 | `src/units/rgb/stickers.js` |
| Dual Button | U025 | 背面标 | `src/units/dual-button/stickers.js` |
| IR | U002 | 背面标 | `src/units/ir/stickers.js` |
| HUB | U006 | 背面标 | `src/units/hub/stickers.js` |
| RFID2 | U031-B | 前面天线面标；背面标 | `src/units/rfid2/stickers.js` |

其中 11 款为主机，6 款为 Unit。表中面的方向使用当前模型的产品坐标，不能据此推断电气连接、传感器行为或制造配合已验证。

## 官方照片参考重绘范围

| 型号 | 已接入面及边界 |
| --- | --- |
| ENV III、PIR、Angle、Light、Thermal、Fan、Scroll | 标准版背贴；默认使用重绘，教育版另行选择 |
| Color、ToF、NCIR、Heart、Relay、Joystick v1.1、RS485 | 精确型号背贴；Joystick 使用 U024-C / MEGA8A 背图 |
| TVOC | 背面接口条、正面 TVOC/eCO2 与 SGP30 条；替换旧简化文字 |
| Button、Buzzer、Encoder、Limit | 背标；Encoder 的工厂连续膜跨服务口，孔后保留原PCB，安装孔不封堵 |
| Key | 真实后壳凹台内背贴 |
| 8Encoder | 背贴、CH1–CH8、SW、0/1；固定印刷不随旋钮/拨杆移动 |
| CardKB v1.1 | 裸PCB上的主键字与经官方表格/固件核对的副符号；背面图案和极小丝印仍缺 |
| Roller485 | OLED面 PORT.A 与 PWR485 标；侧面 debug/ISP 细条无法逐字确认，保留缺项 |
| NanoC6 | 背标、两侧认证标；图形与尺寸为照片外观重绘 |
| Nesso N1 | 背标、顶部天线/IR、QWIIC、收纳天线内侧频段标；保留实际 IR 口和所属零件关系 |
| StamPLC | 正面主标、IN 1–8、RELAY 1–4、提示条；端子侧标缺匹配白色承载壳条，不悬空补膜；密集侧面/Stamp图仍缺 |
| Core2 v1.1 | EXT盖 CORE2名牌，保留双孔，不套用v1.0；原稿背标/认证保持 |
| PaperMono | 真实下盖上的 NFC字样与弧线；原稿上部电路标保持 |
| CoreS3 + DinBase | 后盖下方PCB的可读品牌、表格与部分供电文字；不贴到外盖，密集细字仍为部分覆盖 |

各款 `docs/research/<型号>/artwork-redraw.md` 和目录字段 `artwork.redrawSources` 记录精确公开参考、转录、PNG摘要和未还原项。8Encoder 照片上的 PA14/PA15、PA12/PA13 与原理图 PB 编号不一致；重绘只还原印刷，不能作为接线依据。新贴层不改变壳体、PCB、接口或控件实体几何。

## 7 款可选中文教育版

以下素材属于中文教育版外观变体，只有在构造选项中明确设置 `stickerVariant: 'education-cn'` 才启用。默认/`standard` 不自动替换成教育版，也不将教育版接入状态标成标准版正式来源齐全。

| 型号 | SKU | 可选接入面 | 分发 PNG 的原生像素 | 实现 |
| --- | --- | --- | --- | --- |
| ENV III | U001-C | 背面中文教育版标 | 341 × 256 | `src/units/env-iii/stickers.js` |
| PIR | U004 | 背面中文教育版标 | 341 × 256 | `src/units/pir/stickers.js` |
| Angle | U005 | 背面中文教育版标 | 340 × 256 | `src/units/angle/stickers.js` |
| Light | U021 | 背面中文教育版标 | 341 × 256 | `src/units/light/stickers.js` |
| Thermal | U016 | 背面中文教育版标 | 340 × 256 | `src/units/thermal/stickers.js` |
| Fan | U063 | 背面中文教育版标 | 341 × 256 | `src/units/fan/stickers.js` |
| Unit Scroll | U186 | 背面中文教育版标 | 367 × 256 | `src/units/scroll/stickers.js` |

这一批教育版仅有约 340 像素宽的原生位图，Scroll 为 367 像素宽。它们可用于展示对应变体，但放大观察时细字和线条存在分辨率上限；纹理采样或放大导出不能恢复原图没有的细节。它们不是高分辨率矢量转图结果，后续有更清晰的同型号素材时再替换。

## 19 款原始设计文件仍缺

以下产品仍没有取得精确型号的原始贴纸设计文件，目前已依据同型号官方照片接入参考重绘。原稿缺失不再表示默认外观没有贴纸；不使用近似型号、不同代际、不同引脚版本或不同认证版本代替。

| 类型 | 型号 / SKU |
| --- | --- |
| 主机（3） | NanoC6 / C125；Arduino Nesso N1 / DK001；StamPLC / K141 |
| Unit（16） | Color / U009；ToF / U010；Relay / U023；Joystick v1.1 / U024-C；Button / U027；NCIR / U028；Heart Rate / U029；Encoder / U135；Mini TVOC/eCO2 / U088；RS485 / U034；Buzzer / U132；Unit Limit / U145；CardKB v1.1 / U035-B；Unit Key / U144；Unit 8Encoder / U153；Unit Roller485 / U182 |

本表记录原稿来源缺口，不表示当前没有印刷层。

## 已知缺面和暂缓项

| 型号 | 当前缺项 | 处理边界 |
| --- | --- | --- |
| Core2 v1.1 | EXT原稿仍缺 | 已按精确v1.1照片重绘盖标，不增加推测引脚表 |
| PaperMono | NFC原稿仍缺 | 已参考同型号照片重绘在真实NFC下盖 |
| CoreS3 + DinBase | 密集PCB丝印未全还原 | 只补可读内部印刷，不把独立主机背标贴到外盖 |
| 上述7款教育版Unit | 教育版原生位图较小 | 标准版已参考重绘；教育版不默认启用，近景受原生像素限制 |
| 上述19款 | 精确型号原稿未取得 | 已加入参考重绘，未还原面和细字见上表 |

## 构造选项与 Grove 模块

`artwork: false` 对本批 `printedArtwork` / `printedFilm` 正式栅格层具有优先权，包括显式选择的教育版。它不负责删除模型所有历史手绘、雕刻、颜色、显示内容或结构件，因此不能用它宣称全部印刷文字均被移除。

`stickerVariant` 是构造选项；本批为上述 7 款实现 `education-cn` 显式选择，其余标准版保持默认行为。未提供运行中切换贴纸的专用 setter；需要另一变体时构造新实例。

独立 Unit 和对应 Grove 模块接受相同选项。每个模型/模块实例分别传入选项，不能假定父主机的贴纸选项自动传播给后接的 Unit。入口为 `src/loaders.js`，按需产品构造器及模块导出见 `src/index.js`。

```js
import {loadModel, loadGroveModule} from './src/loaders.js';

// 标准版正式栅格默认启用；也可明确关闭本批贴纸。
const atom = await loadModel('atoms3r', {artwork: false});

// 只有明确选择时才显示中文教育版。
const env = await loadModel('env-iii', {stickerVariant: 'education-cn'});
const envOnCable = await loadGroveModule('env-iii', {
  stickerVariant: 'education-cn',
  cableLength: 35,
});

// 关闭开关优先于变体选择。
const envWithoutRaster = await loadGroveModule('env-iii', {
  artwork: false,
  stickerVariant: 'education-cn',
});
```

投影贴纸从目标实体已有表面生成，随所属壳体、可拆盖、独立键帽或关节运动；连续覆膜则使用独立形状并明确保留需要的开孔。贴图不能代替缺失的实体结构。相关实现见 `src/modeling/artwork.js`，专项检查见 `scripts/check-printed-artwork.mjs`。

## 验证状态

2026-10-26 首批公开快照 `664799e` 查看了 24 款的背面/立体视图，并补看 16 个侧面、顶面及底面，共 64 个静态视图。另保存 StackChan yaw 35° / pitch 45° 的四个视图、DinBase 电源滑块两档、CardputerZero 电源帽两档，以及真实 StickS3 → HUB → RFID2 连接，共 73 张浏览器截图。贴纸未出现加载空白或意外丢字；浏览器捕获的 warn/error 日志为空。教育版仍受上表原生像素限制，Tab5 仓底标按实际装配被电池盖遮挡。

连续覆膜的选择依据实际贴膜形状：StopWatch 背标跨壳体圆槽且保留喇叭 U 口及排母缺口；Tab5 ST7123 背标跨四个圆槽且保留六针窗口；DinBase 电源字样固定在壳上，滑块在独立开窗中移动。StickS3 左贴跨前后两块真实壳面；Core2 认证贴位于 +Y 顶面，右侧喇叭孔保持敞开。验证索引与拼图见 `artifacts/stickers/review.json`。

后续 CardputerZero 补缺批次加入四片侧面/顶部贴纸。官方正面、斜视及两侧图交叉确认外围 X 方向曾镜像，因此先修正接口、开孔、Boot 与顶部 microSD/IR 的实际方向，再按原 PNG 比例配准；GPIO 跨两块相邻真实壳面，microSD 标避开通风槽。旧真实模型独立回归有 21 项失败，修后 46/46 通过，1332 个源不透明采样点均首先命中正式贴纸；48 个控件动作不会带动固定贴层。

该补缺批次另外保存 22 张当前浏览器图：七视图、三面近景、Boot/F1 压放、电源帽 0/1/0，以及 CardputerZero → HUB → RFID2 的连接、姿态和断开。三组按压/档位均有实际像素变化，复位图的模型区域逐像素相同；首次从前方近看未暴露 Boot 侧帽的截图已排除，最终改从实际左侧检查。当前索引为 `artifacts/cardputer-zero-stickers/review.json`，不回写首批冻结记录。

构造检查、有限几何采样、mock 图片加载、资源释放检查和 build 通过，只能证明对应的数字检查范围。它们不能代替真实浏览器图片解码/渲染验收，也不能证明实物制造、电气、固件、传感器或光学行为。

## 素材分发与许可

本批只分发用于模型展示的普通PNG、配准代码及公开参考来源说明。用户提供的原表、原表映射、原始下载链接、矢量原稿、重绘生成器、字体文件及转换/重绘中间材料均不随公开仓库、构建产物或验证附件分发。旧产品照片裁切贴纸继续停用。

独立分发构建目录时，同包携带当前 `LICENSE`、`THIRD_PARTY_NOTICES.md` 和 `licenses/`；Vite 构建自动加入这些文件。

项目自有新增代码使用 MIT，见 `LICENSE`。M5Stack 图片、产品标识、第三方商标及其他第三方素材的权利归各自权利人；代码的 MIT 许可不重新授权这些图片或标识。第三方来源与许可边界继续由 `THIRD_PARTY_NOTICES.md` 和 `licenses/` 说明。
