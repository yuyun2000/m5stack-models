# 新增设备贴纸接入

当前201款范围及本次21张PNG同步见[发布记录](releases/2026-10-27-preview-stability.md)。下方为各批保存时点的贴纸记录；当前任务已暂停新增型号，先完成预览稳定性与仓库同步。

## 最新本地增量：Atom Lite / 原 Atom Matrix / AtomS3 Lite（第53批三主机）

当前本地201款（17主机、184Unit），全部 `modeled`、`verified` 为0。本批新增3款controller主机和6张普通PNG；既有pending11Unit/15PNG保留。Git187 / `296128b` 同步基线保持，未再次提交推送。实际API与边界见[本批指南](ATOMLITE-ATOMMATRIX-ATOMS3LITE-CONTROLLERS.md)。

atom-lite C008：2键[button,reset]、灯1[rgb]、4接口[grove,usb,ext-5p,ext-4p]、PNG2；atom-matrix C008-B：2键[button,reset]、灯25[led0…led24（25个独立地址）]、4接口[grove,usb,ext-5p,ext-4p]、PNG2；atoms3-lite C124：2键[button,reset]、灯1[rgb]、4接口[usb,grove,ext-5p,ext-4p]、PNG2。三款无主机Display/传感器模拟；原壳、真实接口、PCB/接点/承托和按键动作保留，隐藏BOM、行程与配合推导另记。

本批双仓实际专项、导出/alias/lazy loader及双build通过，记录见[公开本批进度](../artifacts/atomlite-atommatrix-atoms3lite-expansion/progress.json)。贴纸与模型同步；私表、原始链接/文件名、矢量和映射留在分发树外。未逐面浏览器/GPU、制造或实物验收；既有延期边界保留。

## 前批检查点：LoRaWAN AS923 / EU868

该批保存时本地198款（14主机、184Unit），全部 `modeled`、`verified` 为0。本批两款与4张普通PNG同步新增。GitHub `main`的187款已同步于 `296128b`，见[187款同步记录](GIT-SYNC-187-2026-10-27.md)；随后批49/50/51/52共11款/15PNG仍为本地增量，未再次提交推送。实际结构/API见[本批指南](LORAWAN-AS923-EU868-UNITS.md)，54批范围见[增量索引](LOCAL-EXPANSION.md)。

AS923/EU868分别保留自身MIT native前后两半的全部源面与preview逐面对映；24×64×8壳和71.4含SMA包络分记。AS923自身195mm/2.3dBi天线与EU868自身195mm/2.8dBi天线独立记录，本款前后标签分别重绘，不借US915/CN470标签。实际本体/附件API和PNG：lorawan-as923 控件0[无]、XY摇杆[无]、灯0[无]、显示0[无]、本体关节[无]、附件导出[Antenna]、端口[grove,antenna]、PNG2；lorawan-eu868 控件0[无]、XY摇杆[无]、灯0[无]、显示0[无]、本体关节[无]、附件导出[Antenna]、端口[grove,antenna]、PNG2；附件关节详见冻结API与专项夹具。隐藏承托/接点/轴/行程/天线内部及配合均明记推导；RF/UART/AT/电气/固件由外部实现。

本批同步印刷：Unit LoRaWAN-AS923 2张参考重绘；Unit LoRaWAN-EU868 2张参考重绘。本款清楚PCB/标签准确重绘普通PNG，真实基材/PCB与全部物理及运动在去墨后保留；不裁照片、不借错款、不猜微字/个体码、不用图遮缺件。本批0批准本体原稿；EU868严格同名8条为5包装/3错Module，既有3下载全拒用，新增下载0。私表/URL/原名/映射/矢量/原图/生成器/中间件不分发。新代码MIT，自身native保原MIT，源图文/商标各保其权利。

两入口/实际配置去墨、实际附件装卸/递归关节部分动作、真实四芯线束和层级寻址、StickS3→HUB两分支、变父/peer/noecho/framebuffer/释放、6导出/双build和在线PNG已保存[本批进度](../artifacts/lorawan-as923-eu868-expansion/progress.json)。既有Unit/core/Scroll/demo/rotary-panel当前基线保持。未逐面浏览器/GPU、历史全量或实物验收；旧50PNG、私Scroll、StackChan量产fit-unresolved、Puzzle Bridge、Catch及既有延期保持，整体goal active。


## 前批检查点：CardKB original / PoE CAM-W original / LoRaWAN US915

该批保存时本地196款（14主机、182Unit），全部 `modeled`、`verified` 为0。本批三款与4张普通PNG同步新增。GitHub `main`的187款已同步于 `296128b`，见[187款同步记录](GIT-SYNC-187-2026-10-27.md)；随后批49/50/51共9款/11PNG仍为本地增量，未再次提交推送。实际结构/API见[本批指南](CARDKBORIGINAL-POECAMORIGINAL-LORAWANUS915-UNITS.md)，53批范围见[增量索引](LOCAL-EXPANSION.md)。

原CardKB U035按本款MEGA328P白板/50真实帽/方开关保持和单RGB重建，88×54×5表与84×54图注冲突仍以暂定外观依据分列；原PoE CAM-W U121-B按自身64×24×18壳、OV2640光学/PCB/PoE/接口/双键和蓝绿黄灯重建，不借v1.1或造未证外RGB。US915保留自身MIT native两半全部源面及重复preview配对，分记64mm壳与71.4含SMA和自身195mm天线；不借CN470。实际API/PNG：cardkb-original 控件50[key-esc,key-1,key-2,key-3,key-4,key-5,key-6,key-7,key-8,key-9,key-0,key-backspace,key-tab,key-q,key-w,key-e,key-r,key-t,key-y,key-u,key-i,key-o,key-p,key-fn,key-shift,key-a,key-s,key-d,key-f,key-g,key-h,key-j,key-k,key-l,key-enter,key-sym,key-z,key-x,key-c,key-v,key-b,key-n,key-m,key-comma,key-period,key-space,key-up,key-left,key-right,key-down]、XY摇杆[无]、灯1[rgb]、显示0[无]、本体关节[无]、附件导出[无]、端口[grove]、PNG1；poe-cam-w 控件2[user,reset]、XY摇杆[无]、灯3[g0,link,activity]、显示0[无]、本体关节[无]、附件导出[无]、端口[grove,ethernet,download-en,download-uart]、PNG1；lorawan-us915 控件0[无]、XY摇杆[无]、灯0[无]、显示0[无]、本体关节[无]、附件导出[Antenna]、端口[grove,antenna]、PNG2。隐藏安装/接点/行程/光学与配合均明记推导；通信/图像/AI/电气/固件由外部实现。

本批同步印刷：Unit CardKB (original MEGA328P U035) 1张参考重绘；Unit PoE CAM-W (original OV2640 U121-B) 1张参考重绘；Unit LoRaWAN-US915 2张参考重绘。本款清楚PCB/标签准确重绘普通PNG，真实基材/PCB与全部物理及运动在去墨后保留；不裁照片、不借错款、不猜微字/个体码、不用图遮缺件。私表未取得本批精确本体原稿；私表/URL/原名/映射/矢量/原图/生成器/中间件不分发。新代码MIT，自身native保原MIT，源图文/商标各保其权利。

两入口/实际配置去墨、真实帽按放/取消与外驱灯、真实四芯线束和层级寻址、StickS3→HUB三分支、变父/peer/noecho/framebuffer/释放、7导出/双build和在线PNG已保存[本批进度](../artifacts/cardkboriginal-poecamoriginal-lorawanus915-expansion/progress.json)。既有Unit/core/Scroll/demo/rotary-panel当前基线保持。未逐面浏览器/GPU、历史全量或实物验收；旧50PNG、私Scroll、StackChan量产fit-unresolved、Puzzle Bridge、Catch及既有延期保持，整体goal active。


## 前批检查点：M5Camera / ESP32CAM / RGB LED Strip 50cm

该批保存时本地193款（14主机、179Unit），全部 `modeled`、`verified` 为0。本批新增原M5Camera U017、裸板ESP32CAM U007、RGB LED Strip 50cm A093及2张本款普通PNG。GitHub `main`的187款已同步于 `296128b`，见[187款同步记录](GIT-SYNC-187-2026-10-27.md)；随后批49/50共6款/7PNG仍为本地增量，未再次提交推送。实际结构/API见[本批指南](M5CAMERA-ESP32CAM-RGBSTRIP50-UNITS.md)，52批范围见[增量索引](LOCAL-EXPANSION.md)。

三款均按自身官方资料/多视图程序重建，无本款native，不借相近型号。M5Camera含耳名义40×48×11，黑壳后标有真实基材及自身PCB/WROVER背衬，实际RESET与被动OV2640光学；ESP32CAM按细长双面裸板/光学FPC/真实USB-C/Grove与可见侧帽，旧20.5×46.5×11.5作为暂定外观参考，当前54×54×26.6与接口/引脚版本冲突另存。A093为500mm30颗5050、真实柔性包覆/背胶、黑3P/三导线和随附Grove插头转接，不拉伸A035或造4P本体接收座。实际API/PNG：m5camera 控件1[reset]、XY摇杆[无]、灯0[无]、显示0[无]、关节[无]、端口[grove,usb]、PNG1；esp32cam 控件1[key]、XY摇杆[无]、灯0[无]、显示0[无]、关节[无]、端口[grove,usb]、PNG0；rgb-led-strip-50cm 控件0[无]、XY摇杆[无]、灯30[pixel-0,pixel-1,pixel-2,pixel-3,pixel-4,pixel-5,pixel-6,pixel-7,pixel-8,pixel-9,pixel-10,pixel-11,pixel-12,pixel-13,pixel-14,pixel-15,pixel-16,pixel-17,pixel-18,pixel-19,pixel-20,pixel-21,pixel-22,pixel-23,pixel-24,pixel-25,pixel-26,pixel-27,pixel-28,pixel-29]、显示0[无]、关节[无]、端口[input,output]、PNG1。隐藏装配、厚度、接点、行程和弯曲限制明确推导；通信/图像/AI/电气/固件由外部实现。

本批同步印刷：M5Camera (original U017) 1张参考重绘；ESP32CAM (original U007)无PNG，保真实无色原生压纹；Unit RGB LED Strip 0.5m / 30LED 1张参考重绘。仅从本款清楚后标/PCB字样准确代码重绘普通PNG，去墨保基材/PCB/壳/胶层和全部物理；不裁照片、不借错款、不猜微字/个体码/未见3M背印、不用图遮缺件。私表匹配未取得这三款精确本体原稿，原资料/URL/原名/映射/矢量/生成器/中间件不分发。新代码MIT，源图文和商标各保其权利。

两入口/实际配置去墨、实际帽按放/取消与外驱逐灯/弯曲、真实端头/线束接合与层级地址、StickS3→HUB三分支、变父/peer/无echo、framebuffer/资源释放、7导出/双build和在线PNG已保存[本批进度](../artifacts/m5camera-esp32cam-rgbstrip50-expansion/progress.json)。未逐面浏览器/GPU、历史全量或实物验收；旧50PNG、私Scroll、StackChan量产fit-unresolved、Puzzle Bridge、Catch及既有延期保持，整体goal active。


## 前批检查点：PaHub v2.0 / PbHub / TimerCamera

该批保存时本地190款（14主机、176Unit），全部 `modeled`、`verified` 为0。本批新增PaHub v2.0 U040-B、原PbHub U041、裸板TimerCamera U082及5张本款普通PNG。GitHub `main`的187款已同步于 `296128b`，见[187款同步记录](GIT-SYNC-187-2026-10-27.md)；随后批49共3款/5PNG仍为本地增量，未再次提交推送。实际结构/API见[本批指南](PAHUBV20-PBHUB-TIMERCAMERA-UNITS.md)，51批范围见[增量索引](LOCAL-EXPANSION.md)。

PaHub使用本款原生闭合后壳/开窗前框，排重复整装预览，原生8mm壳与10.8mm整机口包络分记；真实红PCB/可见芯片腿/七4P座/承托补齐，大开窗按实物保留。原PbHub按自身多视图参数化黑PCB/QFP32/晶体/七座与完整壳，当前10.8与旧12厚、MEGA/STM型号及后膜地址版本冲突保留。TimerCamera按原款双面裸板/光学FPC/USB-C/Grove/空电池座重建，只有真实双帽动作、固定蓝灯外驱和被动camera frame，不添F/X壳或电池。实际API/PNG：pahub-v20 控件0[无]、XY摇杆[无]、灯0[无]、显示0[无]、关节[无]、端口[grove,grove-0,grove-1,grove-2,grove-3,grove-4,grove-5]、PNG2；pbhub 控件0[无]、XY摇杆[无]、灯0[无]、显示0[无]、关节[无]、端口[grove,grove-0,grove-1,grove-2,grove-3,grove-4,grove-5]、PNG2；timercamera 控件2[reset,power]、XY摇杆[无]、灯1[status]、显示0[无]、关节[无]、端口[grove,usb]、PNG1。隐藏装配/行程/接点和配合推导另记，无完整BOM/制造或实物验收声明，无内部通信/采样/电气/固件。

本批印刷同步：Unit PaHub v2.0 2张参考重绘；Unit PbHub 2张参考重绘；TimerCamera (bare board) 1张参考重绘。本款清楚后膜/PCB数字与板丝印代码准确重绘普通PNG，真实膜/PCB/native压纹去墨保留；不裁照片/借错款/猜微字或个体码，不以图遮缺件。TimerCamera两项私候选是包装，已拒绝且0原稿下载。私表/URL/原名/映射/矢量/原始资料/生成器/中间件留分发树外。新代码MIT；native保上游MIT/Copyright声明，官方照片和商标各保其权利。

两入口/实际配置及partial帽动作去墨、两个Hub各六输出真实下游四芯/层级寻址、StickS3→HUB三分支、变父/peer/外驱无echo、framebuffer/资源释放、6导出/双build及在线PNG已保存[本批进度](../artifacts/pahubv20-pbhub-timercamera-expansion/progress.json)。未逐面浏览器/GPU、历史全量或硬件验收；旧50PNG、私Scroll、StackChan量产fit-unresolved、Puzzle Bridge、Catch及既有延期保持，整体goal active。


## 前批检查点：ENV II / Joystick / GPS

该批保存时本地187款（14主机、173Unit），全部 `modeled`、`verified` 为0。本批新增原ENV-II U001-B、原Joystick U024、原GPS U032及4张本款普通PNG。本次Git同步收录全部187款及批41–48新增的24款/40PNG，见[187款同步记录](GIT-SYNC-187-2026-10-27.md)。历史检查点中的Git状态保留其保存时点；当前提交与远端状态以Git日志及GitHub main为准。实际结构/API见[本批指南](ENVII-JOYSTICK-GPS-UNITS.md)，50批范围见[增量索引](LOCAL-EXPANSION.md)。

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


2026-10-27。下表保留此前155款记录，本批追加3款controller主机及6张普通PNG，现列158款设备。来源与实际PNG按单品记录分列；当前201=17主机+184Unit，全部modeled/0verified；既有pending11Unit/15PNG保留。55批检查点见公开工作副本索引，旧43款/50PNG延期边界保持。

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
| `hbridge` | U160 | 参考重绘 | 2 | [来源与配准](research/hbridge/artwork.json)；原U160机身标；不借U160-V11内容 |
| `catm-gnss` | U137 | 参考重绘 | 3 | [来源与配准](research/catm-gnss/artwork.json)；本款机身/真实附件印刷；不借窄NBIoT |
| `ultrasonic-io` | U098-B2 | 原稿栅格 | 1 | [来源与配准](research/ultrasonic-io/artwork.json)；本款PORT.B I/O背标；排包装/错I2C视图 |
| `dof6` | U228 | 原稿栅格 | 3 | [来源与配准](research/dof6/artwork.json)；本款BMI270/真实稳定SW1；不装BMM350/可选NC件 |
| `dof9` | U229 | 原稿栅格 | 3 | [来源与配准](research/dof9/artwork.json)；本款BMI270+BMM350及真实SW1；不借DoF10气压件 |
| `bmm350` | U231 | 原稿栅格 | 3 | [来源与配准](research/bmm350/artwork.json)；本款BMM350与固定空槽背衬；不造address拨片 |
| `unitv-ov7740` | U078-C | 官方平面栅格 | 1 | [来源与配准](research/unitv-ov7740/artwork.json)；本款7056原面/真实双原生弹片与plunger/RGB真实孔；背标为整块官方平面栅格，非私矢量或重绘 |
| `lora-e220-433` | U170-433 | 参考重绘 | 3 | [来源与配准](research/lora-e220-433/artwork.json)；本款6614原面/两个稳定DIP/普通SMA静态110mm附件；正背膜与固定DIP cover印字共3参考重绘面，不添假膜或猜关节 |
| `8servos2-i2c` | U222 | 原稿栅格+参考重绘 | 3 | [来源与配准](research/8servos2-i2c/artwork.json)；无CAD，按本款六视/照片完整参数化；双Grove/DC/24个male针/16稳定档rotary-selector，前背原稿与固定刻度重绘按本款记录分列 |
| `catm` | U128 | 原稿栅格 | 2 | [来源与配准](research/catm/artwork.json)；本款6592完整原装面/单普通SMA与NanoSIM；本款膜与实际附件依冻结API，不借宽壳CatM GNSS |
| `neohex` | A045-B | 参考重绘 | 2 | [来源与配准](research/neohex/artwork.json)；无CAD，依据本款尺寸/照片参数化37真实灯、三Grove座、六耳与独立均光片；印字在真实PCB，不添胶膜 |
| `env-iv` | U001-D | 原稿栅格 | 1 | [来源与配准](research/env-iv/artwork.json)；无CAD，依据本款尺寸/裸板参数化通气壳、红Grove、SHT40/BMP280；不借ENV-III或造控件/外灯/读数 |
| `cardkb2` | U215 | 原稿栅格+参考重绘 | 2 | [来源与配准](research/cardkb2/artwork.json)；自身六视参数化完整键盘、42矩阵+RST/BOOT共44实际瞬时控件、USB-C/Grove/RGB；无字红plunger与固定PCB字形分开，按实际载体同步印刷 |
| `neco` | U163 | 参考重绘 | 2 | [来源与配准](research/neco/artwork.json)；自身猫耳尺寸/照片参数化35独立RGB、后轻触键/双Grove/真实固定眼；不消费备用STEP，不造胶膜/自动级联 |
| `mini-oled` | U166 | 参考重绘 | 2 | [来源与配准](research/mini-oled/artwork.json)；自身尺寸/面板资料参数化72x40白OLED/双Grove/实际装配折回FPC；背面PCB印字，不贴永久屏内容 |
| `mini-imu-pro` | U171 | 参考重绘 | 3 | [来源与配准](research/mini-imu-pro/artwork.json)；本款U171完整壳/板/真实Grove；内部SW1未见外部通道，不预许诺闭壳外控或传感数值，实际组件以冻结API为准 |
| `glass` | U158 | 参考重绘 | 2 | [来源与配准](research/glass/artwork.json)；原款U158两侧瞬时键/透明蓝128x56屏及真实蜂鸣载体，显示按自身panelPDF35.05x15.32有效区而非官网18高；固定封装与实际帽体分开，屏幕内容由外部给定，按实际载体同步印刷 |
| `8servos2-chain` | U223 | 原稿栅格 | 2 | [来源与配准](research/8servos2-chain/artwork.json)；官方发布外形尺寸+自身U223实拍；共享外形图不作内部旧旋钮证据，内部按本款电容/载体，保IN/OUT HY2.0-4P/24针/DC；未证外灯不造，原稿优先转普通PNG |
| `unitv2-usb` | U078-USB | 参考重绘 | 1 | [来源与配准](research/unitv2-usb/artwork.json)；本款完整闭合原生壳/固定USB-A罩与真实USB-A/C/HY2.0/SD/顶部原生U-cut弹性舌、固定散热载体、未证转子不造运动及自身clip；无内置相机/可拆镜头盖 |
| `unitv-m12` | U078-V-M12 | 参考重绘 | 2 | [来源与配准](research/unitv-m12/artwork.json)；本款闭合2850+1660壳半复位，真实CNC框/M12光学、双侧帽/固定包体与USB-C/HY2.0/SD；不借兄弟款或造外灯 |
| `timercamera-f` | U082-F | 原稿栅格 | 1 | [来源与配准](research/timercamera-f/artwork.json)；本款闭合7912+1584壳半复位、鱼眼/270mAh/真实控件与静态安装附件；按实拍以实体塑料闭合旧CAD点阵孔、排包装纸，原稿优先同步普通PNG |
| `m5camera-x` | U038 | 无色原生压纹（0PNG） | 0 | [来源与配准](research/m5camera-x/artwork.json)；本款4778完整壳面、真实光学/RESET/USB-C/HY2.0与静态安装件；仅真实无色native压纹0PNG，排错尺寸图/未装预留传感器 |
| `unitv2-m12` | U078-M12 | 参考重绘 | 1 | [来源与配准](research/unitv2-m12/artwork.json)；本款5456完整壳面、真实M12光学/原生弹性舌及实际接口；手动焦环外驱角度，未知螺距不造联动，壳/光学/膜包络分记 |
| `timercamera-x` | U082-X | 参考重绘 | 1 | [来源与配准](research/timercamera-x/artwork.json)；本款4452原生面、66.5度/140mAh真实光学/控件/蓝灯与静态安装件；本款后标重绘，附件名称依据本款证据 |
| `extio` | U011 | 参考重绘 | 1 | [来源与配准](research/extio/artwork.json)；U011原版PCA9554PW自身参数化壳/2×5 IO/红Grove/PCB，排B版精确datum与EXT.IO2功能；背标本款准确重绘 |
| `adc` | U013 | 参考重绘 | 2 | [来源与配准](research/adc/artwork.json)；U013原版ADS1100自身尺寸图参数化壳、前装可拆2P端子深腔触点/PCB/Grove；后标与端子极性本款重绘 |
| `dac` | U012 | 参考重绘 | 2 | [来源与配准](research/dac/artwork.json)；U012原版MCP4725自身尺寸图参数化壳、前装可拆2P端子深腔触点/PCB/Grove；后标与端子极性本款重绘 |
| `m5-bit` | A051 | 参考重绘 | 2 | [来源与配准](research/m5-bit/artwork.json)；A051本款黑PCB/真实边卡深槽与IO排针/蓝Grove，触点数量依本款证据，PCB本款印字重绘，不附Microbit板 |
| `bps` | U090 | 参考重绘 | 2 | [来源与配准](research/bps/artwork.json)；U090原版BMP280自身壳/两真通气槽/红Grove与板支撑，前BPS/后PortA本款重绘，不借QMP6988版壳 |
| `hex` | A045 | 参考重绘 | 1 | [来源与配准](research/hex/artwork.json)；A045自身36×31.2×6.95图纸结构、37颗较大SK6812独立外驱/三白4P座及本款PCB丝印，个体码删墨留真实载体 |
| `rgb-led-10cm` | A035 | 参考重绘 | 3 | [来源与配准](research/rgb-led-10cm/artwork.json)；A035精确10cm15LED/3535、真实连续柔性基材/背胶及白黑4P端板，实际外驱灯/带形与本款丝印；排A093/29灯整机/自动固件 |
| `rfid` | U031 | 参考重绘 | 2 | [来源与配准](research/rfid/artwork.json)；U031原MFRC522自身24×48×8完整壳/银膜/背膜/红Grove，真实侧槽承托，隐藏天线与安装明确推导，不模拟UID |
| `env` | U001 | 参考重绘 | 2 | [来源与配准](research/env/artwork.json)；U001原DHT12+BMP280自身24.2×32.2×8.1/40交错真槽/支持与红Grove，背标/QC膜重绘，无环境读数或认证结论 |
| `env-ii` | U001-B | 参考重绘 | 1 | [来源与配准](research/env-ii/artwork.json)；原U001-B SHT30/BMP280自身通气壳/40真槽/红Grove，当前与旧名义差异保留，后膜重绘不造QC或读数 |
| `joystick` | U024 | 参考重绘 | 1 | [来源与配准](research/joystick/artwork.json)；原U024 MEGA328自身帽轴/杯/金属承托与真实XY/Z输入形状，名义与帽体包络分记，不借新版或实装J3 |
| `gps` | U032 | 参考重绘 | 2 | [来源与配准](research/gps/artwork.json)；原U032 AT6558/MAX2659自身24×48×8维图/2真孔/蓝Grove与两膜，隐藏板/天线安装明确推导，无定位状态 |
| `pahub-v20` | U040-B | 参考重绘 | 2 | [来源与配准](research/pahub-v20/artwork.json)；本款native闭合半壳/排重复预览、红PCB/七真实4P座/28触点与后膜/板丝印，不借v2.1或造DIP |
| `pbhub` | U041 | 参考重绘 | 2 | [来源与配准](research/pbhub/artwork.json)；原U041自身黑PCB/QFP32/七座完整开窗壳；当前后膜不混旧地址/QC，MCU与厚度冲突保留 |
| `timercamera` | U082 | 参考重绘 | 1 | [来源与配准](research/timercamera/artwork.json)；原U082双面裸板/普通光学FPC/USB-C/Grove/空电池座、真实双帽/固定蓝灯及板丝印，不添F/X壳电池附件 |
| `m5camera` | U017 | 参考重绘 | 1 | [来源与配准](research/m5camera/artwork.json)；原U017含耳黑壳/实际后膜及PCB/WROVER背衬、USB-C/Grove/RESET与被动光学，不借X/F壳或造发光槽 |
| `esp32cam` | U007 | 来源见记录 | 0 | [来源与配准](research/esp32cam/artwork.json)；原U007细长裸板自身光学/FPC/真实接口与实际侧帽；当前/旧尺寸和版本差异另存，不套TimerCamera |
| `rgb-led-strip-50cm` | A093 | 参考重绘 | 1 | [来源与配准](research/rgb-led-strip-50cm/artwork.json)；A093500mm30颗5050/实际包覆和背胶、两端3P/三线与真实Grove转接；外驱弯曲和逐灯，清楚板丝印，不造3M字样 |
| `cardkb-original` | U035 | 参考重绘 | 1 | [来源与配准](research/cardkb-original/artwork.json)；原U035 MEGA328P白裸板、50真实帽/开关保持、单RGB、4P Grove和真实安装/ISP孔；88/84尺寸与混版PinMap冲突分列 |
| `poe-cam-w` | U121-B | 参考重绘 | 1 | [来源与配准](research/poe-cam-w/artwork.json)；原U121-B OV2640自身64×24×18壳/PCB/PoE与相机承托、RJ45/4P Grove/双3P座/双键和蓝绿黄灯；不造外露RGB |
| `lorawan-us915` | U184-US915 | 参考重绘 | 2 | [来源与配准](research/lorawan-us915/artwork.json)；U184-US915自身MIT native两半完整保留与重复preview映射；SMA/4P Grove和自身195mm天线/两标，不借CN470 |
| `lorawan-as923` | U184-AS923 | 参考重绘 | 2 | [来源与配准](research/lorawan-as923/artwork.json)；U184-AS923自身MIT native前后两半与preview源面逐面对映；24×64×8壳和71.4含SMA分记，自身195mm/2.3dBi天线与本款标签独立重绘 |
| `lorawan-eu868` | U184-EU868 | 参考重绘 | 2 | [来源与配准](research/lorawan-eu868/artwork.json)；U184-EU868自身MIT native前后两半与preview源面逐面对映；24×64×8壳和71.4含SMA分记，自身195mm/2.8dBi天线与本款标签独立重绘 |
| `atom-lite` | C008 | 本款来源记录分列 | 2 | Device主机；[来源与配准](research/atom-lite/artwork.json)；去墨保留全部实体与实际按键动作 |
| `atom-matrix` | C008-B | reference-redraw | 2 | Device主机；[来源与配准](research/atom-matrix/artwork.json)；去墨保留全部实体与实际按键动作 |
| `atoms3-lite` | C124 | official-raster | 2 | Device主机；[来源与配准](research/atoms3-lite/artwork.json)；去墨保留全部实体与实际按键动作 |

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
