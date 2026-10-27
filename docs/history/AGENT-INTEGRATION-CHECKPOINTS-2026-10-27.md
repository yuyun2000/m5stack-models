# 动态外壳接入：历史检查点（截至 2026-10-27）

本页保存原接入指南中长期累计的批次记录。数量、Git 状态、验证范围和完成表述均为对应记录保存时的历史快照；请从 [当前接入指南](../AGENT-INTEGRATION.md) 和 [本地增量索引](../LOCAL-EXPANSION.md) 读取当前入口。

以下正文保留原记录，仅将相对链接调整到归档目录。稳定公开 API 继续维护在当前接入指南。

## 最新本地增量：Atom Lite / 原 Atom Matrix / AtomS3 Lite（第53批三主机）

当前本地201款（17主机、184Unit），全部 `modeled`、`verified` 为0。本批新增3款controller主机和6张普通PNG；既有pending11Unit/15PNG保留。Git187 / `296128b` 同步基线保持，未再次提交推送。实际API与边界见[本批指南](../ATOMLITE-ATOMMATRIX-ATOMS3LITE-CONTROLLERS.md)。

atom-lite C008：2键[button,reset]、灯1[rgb]、4接口[grove,usb,ext-5p,ext-4p]、PNG2；atom-matrix C008-B：2键[button,reset]、灯25[led0…led24（25个独立地址）]、4接口[grove,usb,ext-5p,ext-4p]、PNG2；atoms3-lite C124：2键[button,reset]、灯1[rgb]、4接口[usb,grove,ext-5p,ext-4p]、PNG2。三款无主机Display/传感器模拟；原壳、真实接口、PCB/接点/承托和按键动作保留，隐藏BOM、行程与配合推导另记。

本批双仓实际专项、导出/alias/lazy loader及双build通过，记录见[公开本批进度](../../artifacts/atomlite-atommatrix-atoms3lite-expansion/progress.json)。贴纸与模型同步；私表、原始链接/文件名、矢量和映射留在分发树外。未逐面浏览器/GPU、制造或实物验收；既有延期边界保留。

## 前批检查点：LoRaWAN AS923 / EU868

该批保存时本地198款（14主机、184Unit），全部 `modeled`、`verified` 为0。本批两款与4张普通PNG同步新增。GitHub `main`的187款已同步于 `296128b`，见[187款同步记录](../GIT-SYNC-187-2026-10-27.md)；随后批49/50/51/52共11款/15PNG仍为本地增量，未再次提交推送。实际结构/API见[本批指南](../LORAWAN-AS923-EU868-UNITS.md)，54批范围见[增量索引](../LOCAL-EXPANSION.md)。

AS923/EU868分别保留自身MIT native前后两半的全部源面与preview逐面对映；24×64×8壳和71.4含SMA包络分记。AS923自身195mm/2.3dBi天线与EU868自身195mm/2.8dBi天线独立记录，本款前后标签分别重绘，不借US915/CN470标签。实际本体/附件API和PNG：lorawan-as923 控件0[无]、XY摇杆[无]、灯0[无]、显示0[无]、本体关节[无]、附件导出[Antenna]、端口[grove,antenna]、PNG2；lorawan-eu868 控件0[无]、XY摇杆[无]、灯0[无]、显示0[无]、本体关节[无]、附件导出[Antenna]、端口[grove,antenna]、PNG2；附件关节详见冻结API与专项夹具。隐藏承托/接点/轴/行程/天线内部及配合均明记推导；RF/UART/AT/电气/固件由外部实现。

本批同步印刷：Unit LoRaWAN-AS923 2张参考重绘；Unit LoRaWAN-EU868 2张参考重绘。本款清楚PCB/标签准确重绘普通PNG，真实基材/PCB与全部物理及运动在去墨后保留；不裁照片、不借错款、不猜微字/个体码、不用图遮缺件。本批0批准本体原稿；EU868严格同名8条为5包装/3错Module，既有3下载全拒用，新增下载0。私表/URL/原名/映射/矢量/原图/生成器/中间件不分发。新代码MIT，自身native保原MIT，源图文/商标各保其权利。

两入口/实际配置去墨、实际附件装卸/递归关节部分动作、真实四芯线束和层级寻址、StickS3→HUB两分支、变父/peer/noecho/framebuffer/释放、6导出/双build和在线PNG已保存[本批进度](../../artifacts/lorawan-as923-eu868-expansion/progress.json)。既有Unit/core/Scroll/demo/rotary-panel当前基线保持。未逐面浏览器/GPU、历史全量或实物验收；旧50PNG、私Scroll、StackChan量产fit-unresolved、Puzzle Bridge、Catch及既有延期保持，整体goal active。


## 前批检查点：CardKB original / PoE CAM-W original / LoRaWAN US915

该批保存时本地196款（14主机、182Unit），全部 `modeled`、`verified` 为0。本批三款与4张普通PNG同步新增。GitHub `main`的187款已同步于 `296128b`，见[187款同步记录](../GIT-SYNC-187-2026-10-27.md)；随后批49/50/51共9款/11PNG仍为本地增量，未再次提交推送。实际结构/API见[本批指南](../CARDKBORIGINAL-POECAMORIGINAL-LORAWANUS915-UNITS.md)，53批范围见[增量索引](../LOCAL-EXPANSION.md)。

原CardKB U035按本款MEGA328P白板/50真实帽/方开关保持和单RGB重建，88×54×5表与84×54图注冲突仍以暂定外观依据分列；原PoE CAM-W U121-B按自身64×24×18壳、OV2640光学/PCB/PoE/接口/双键和蓝绿黄灯重建，不借v1.1或造未证外RGB。US915保留自身MIT native两半全部源面及重复preview配对，分记64mm壳与71.4含SMA和自身195mm天线；不借CN470。实际API/PNG：cardkb-original 控件50[key-esc,key-1,key-2,key-3,key-4,key-5,key-6,key-7,key-8,key-9,key-0,key-backspace,key-tab,key-q,key-w,key-e,key-r,key-t,key-y,key-u,key-i,key-o,key-p,key-fn,key-shift,key-a,key-s,key-d,key-f,key-g,key-h,key-j,key-k,key-l,key-enter,key-sym,key-z,key-x,key-c,key-v,key-b,key-n,key-m,key-comma,key-period,key-space,key-up,key-left,key-right,key-down]、XY摇杆[无]、灯1[rgb]、显示0[无]、本体关节[无]、附件导出[无]、端口[grove]、PNG1；poe-cam-w 控件2[user,reset]、XY摇杆[无]、灯3[g0,link,activity]、显示0[无]、本体关节[无]、附件导出[无]、端口[grove,ethernet,download-en,download-uart]、PNG1；lorawan-us915 控件0[无]、XY摇杆[无]、灯0[无]、显示0[无]、本体关节[无]、附件导出[Antenna]、端口[grove,antenna]、PNG2。隐藏安装/接点/行程/光学与配合均明记推导；通信/图像/AI/电气/固件由外部实现。

本批同步印刷：Unit CardKB (original MEGA328P U035) 1张参考重绘；Unit PoE CAM-W (original OV2640 U121-B) 1张参考重绘；Unit LoRaWAN-US915 2张参考重绘。本款清楚PCB/标签准确重绘普通PNG，真实基材/PCB与全部物理及运动在去墨后保留；不裁照片、不借错款、不猜微字/个体码、不用图遮缺件。私表未取得本批精确本体原稿；私表/URL/原名/映射/矢量/原图/生成器/中间件不分发。新代码MIT，自身native保原MIT，源图文/商标各保其权利。

两入口/实际配置去墨、真实帽按放/取消与外驱灯、真实四芯线束和层级寻址、StickS3→HUB三分支、变父/peer/noecho/framebuffer/释放、7导出/双build和在线PNG已保存[本批进度](../../artifacts/cardkboriginal-poecamoriginal-lorawanus915-expansion/progress.json)。既有Unit/core/Scroll/demo/rotary-panel当前基线保持。未逐面浏览器/GPU、历史全量或实物验收；旧50PNG、私Scroll、StackChan量产fit-unresolved、Puzzle Bridge、Catch及既有延期保持，整体goal active。


## 前批检查点：M5Camera / ESP32CAM / RGB LED Strip 50cm

该批保存时本地193款（14主机、179Unit），全部 `modeled`、`verified` 为0。本批新增原M5Camera U017、裸板ESP32CAM U007、RGB LED Strip 50cm A093及2张本款普通PNG。GitHub `main`的187款已同步于 `296128b`，见[187款同步记录](../GIT-SYNC-187-2026-10-27.md)；随后批49/50共6款/7PNG仍为本地增量，未再次提交推送。实际结构/API见[本批指南](../M5CAMERA-ESP32CAM-RGBSTRIP50-UNITS.md)，52批范围见[增量索引](../LOCAL-EXPANSION.md)。

三款均按自身官方资料/多视图程序重建，无本款native，不借相近型号。M5Camera含耳名义40×48×11，黑壳后标有真实基材及自身PCB/WROVER背衬，实际RESET与被动OV2640光学；ESP32CAM按细长双面裸板/光学FPC/真实USB-C/Grove与可见侧帽，旧20.5×46.5×11.5作为暂定外观参考，当前54×54×26.6与接口/引脚版本冲突另存。A093为500mm30颗5050、真实柔性包覆/背胶、黑3P/三导线和随附Grove插头转接，不拉伸A035或造4P本体接收座。实际API/PNG：m5camera 控件1[reset]、XY摇杆[无]、灯0[无]、显示0[无]、关节[无]、端口[grove,usb]、PNG1；esp32cam 控件1[key]、XY摇杆[无]、灯0[无]、显示0[无]、关节[无]、端口[grove,usb]、PNG0；rgb-led-strip-50cm 控件0[无]、XY摇杆[无]、灯30[pixel-0,pixel-1,pixel-2,pixel-3,pixel-4,pixel-5,pixel-6,pixel-7,pixel-8,pixel-9,pixel-10,pixel-11,pixel-12,pixel-13,pixel-14,pixel-15,pixel-16,pixel-17,pixel-18,pixel-19,pixel-20,pixel-21,pixel-22,pixel-23,pixel-24,pixel-25,pixel-26,pixel-27,pixel-28,pixel-29]、显示0[无]、关节[无]、端口[input,output]、PNG1。隐藏装配、厚度、接点、行程和弯曲限制明确推导；通信/图像/AI/电气/固件由外部实现。

本批同步印刷：M5Camera (original U017) 1张参考重绘；ESP32CAM (original U007)无PNG，保真实无色原生压纹；Unit RGB LED Strip 0.5m / 30LED 1张参考重绘。仅从本款清楚后标/PCB字样准确代码重绘普通PNG，去墨保基材/PCB/壳/胶层和全部物理；不裁照片、不借错款、不猜微字/个体码/未见3M背印、不用图遮缺件。私表匹配未取得这三款精确本体原稿，原资料/URL/原名/映射/矢量/生成器/中间件不分发。新代码MIT，源图文和商标各保其权利。

两入口/实际配置去墨、实际帽按放/取消与外驱逐灯/弯曲、真实端头/线束接合与层级地址、StickS3→HUB三分支、变父/peer/无echo、framebuffer/资源释放、7导出/双build和在线PNG已保存[本批进度](../../artifacts/m5camera-esp32cam-rgbstrip50-expansion/progress.json)。未逐面浏览器/GPU、历史全量或实物验收；旧50PNG、私Scroll、StackChan量产fit-unresolved、Puzzle Bridge、Catch及既有延期保持，整体goal active。


## 前批检查点：PaHub v2.0 / PbHub / TimerCamera

该批保存时本地190款（14主机、176Unit），全部 `modeled`、`verified` 为0。本批新增PaHub v2.0 U040-B、原PbHub U041、裸板TimerCamera U082及5张本款普通PNG。GitHub `main`的187款已同步于 `296128b`，见[187款同步记录](../GIT-SYNC-187-2026-10-27.md)；随后批49共3款/5PNG仍为本地增量，未再次提交推送。实际结构/API见[本批指南](../PAHUBV20-PBHUB-TIMERCAMERA-UNITS.md)，51批范围见[增量索引](../LOCAL-EXPANSION.md)。

PaHub使用本款原生闭合后壳/开窗前框，排重复整装预览，原生8mm壳与10.8mm整机口包络分记；真实红PCB/可见芯片腿/七4P座/承托补齐，大开窗按实物保留。原PbHub按自身多视图参数化黑PCB/QFP32/晶体/七座与完整壳，当前10.8与旧12厚、MEGA/STM型号及后膜地址版本冲突保留。TimerCamera按原款双面裸板/光学FPC/USB-C/Grove/空电池座重建，只有真实双帽动作、固定蓝灯外驱和被动camera frame，不添F/X壳或电池。实际API/PNG：pahub-v20 控件0[无]、XY摇杆[无]、灯0[无]、显示0[无]、关节[无]、端口[grove,grove-0,grove-1,grove-2,grove-3,grove-4,grove-5]、PNG2；pbhub 控件0[无]、XY摇杆[无]、灯0[无]、显示0[无]、关节[无]、端口[grove,grove-0,grove-1,grove-2,grove-3,grove-4,grove-5]、PNG2；timercamera 控件2[reset,power]、XY摇杆[无]、灯1[status]、显示0[无]、关节[无]、端口[grove,usb]、PNG1。隐藏装配/行程/接点和配合推导另记，无完整BOM/制造或实物验收声明，无内部通信/采样/电气/固件。

本批印刷同步：Unit PaHub v2.0 2张参考重绘；Unit PbHub 2张参考重绘；TimerCamera (bare board) 1张参考重绘。本款清楚后膜/PCB数字与板丝印代码准确重绘普通PNG，真实膜/PCB/native压纹去墨保留；不裁照片/借错款/猜微字或个体码，不以图遮缺件。TimerCamera两项私候选是包装，已拒绝且0原稿下载。私表/URL/原名/映射/矢量/原始资料/生成器/中间件留分发树外。新代码MIT；native保上游MIT/Copyright声明，官方照片和商标各保其权利。

两入口/实际配置及partial帽动作去墨、两个Hub各六输出真实下游四芯/层级寻址、StickS3→HUB三分支、变父/peer/外驱无echo、framebuffer/资源释放、6导出/双build及在线PNG已保存[本批进度](../../artifacts/pahubv20-pbhub-timercamera-expansion/progress.json)。未逐面浏览器/GPU、历史全量或硬件验收；旧50PNG、私Scroll、StackChan量产fit-unresolved、Puzzle Bridge、Catch及既有延期保持，整体goal active。


## 前批检查点：ENV II / Joystick / GPS

该批保存时本地187款（14主机、173Unit），全部 `modeled`、`verified` 为0。本批新增原ENV-II U001-B、原Joystick U024、原GPS U032及4张本款普通PNG。本次Git同步收录全部187款及批41–48新增的24款/40PNG，见[187款同步记录](../GIT-SYNC-187-2026-10-27.md)。历史检查点中的Git状态保留其保存时点；当前提交与远端状态以Git日志及GitHub main为准。实际结构/API见[本批指南](../ENVII-JOYSTICK-GPS-UNITS.md)，50批范围见[增量索引](../LOCAL-EXPANSION.md)。

三款按自身官方尺寸/多视图参数化，无本款CAD，不借后代。ENV-II保SHT30/BMP280、40真槽/承托，当前24×32×8与旧24.2×32.2×8.1分记；Joystick保原MEGA328P、帽/轴/杯/金属载体及实际XY倾斜/Z瞬时按放与回弹，名义24×48×32和帽体完整包络分记，J3未实装不造座；GPS保24×48×8自身维图/2孔/蓝Grove/两膜，小缺口用途未证不造灯。实际API/PNG：env-ii 控件0[无]、XY摇杆[无]、灯0[无]、显示0[无]、关节[无]、端口[grove]、PNG1；joystick 控件1[press]、XY摇杆[stick]、灯0[无]、显示0[无]、关节[无]、端口[grove]、PNG1；gps 控件0[无]、XY摇杆[无]、灯0[无]、显示0[无]、关节[无]、端口[grove]、PNG2。隐藏内部/配合、摇杆pivot/travel/limits明确推导，不称完整BOM或制造实测；读数、ADC、通信、电气和固件由外部实现。

本批印刷同步：Unit ENV-II 1张参考重绘；Unit Joystick (MEGA328P original) 1张参考重绘；Unit GPS (AT6558 + MAX2659) 2张参考重绘。本款清楚后标或GPS前后膜准确代码重绘高清普通PNG，真实膜/M5去墨保留；不裁照片/借错款/猜微字或个体码，不以图遮缺件，不凭文字符号造灯。私表/URL/原名/映射/矢量/原始资料/生成器/中间件留分发树外。新代码MIT，官方照片与第三方标识保留各自权利。

两入口/实际配置去墨与真实partial倾斜/按放、固定件/外驱无echo、StickS3→HUB三分支四芯、变父/peer/framebuffer/资源释放、6导出/双build及在线PNG已保存[本批进度](../../artifacts/envii-joystick-gps-expansion/progress.json)。未逐面浏览器/GPU、历史全量或硬件验收；旧50PNG、私Scroll、StackChan量产fit-unresolved、Puzzle Bridge、Catch及既有延期保持，整体goal active。


## 前批检查点：RGB LED 10cm / RFID / ENV

该批保存时本地184款（14主机、170Unit），全部 `modeled`、`verified` 为0。本批新增A035精确10cm15LED灯带、原RFID U031、原ENV U001及7张本款普通PNG。GitHub `main`的163款已同步于 `4fd5216`，见[163款同步记录](../GIT-SYNC-163-2026-10-27.md)；随后批41/42/43/44/45/46/47共21款/36PNG仍是本地增量，未再次提交推送。实际结构/API见[本批指南](../RGBLED-RFID-ENV-UNITS.md)，49批范围见[增量索引](../LOCAL-EXPANSION.md)。

三款按自身尺寸与官方多视图参数化，无本款CAD，不借后代或宣称原生面。A035保100×10条带名义与双端板整体包络分记、15颗3535/连续基材背胶/白黑4P端板及实际外驱柔性形状，未知弹性/额定弯半径不编；RFID保MFRC522完整壳/银前膜/背膜/真实侧槽承托，槽功能未证不造灯键；ENV保24.2×32.2×8.1、40交错真槽、DHT12栅壳/固定介质与BMP280压力封装和板支持，不套后代壳。实际API/PNG：rgb-led-10cm 控件0[无]、灯15[led-1,led-2,led-3,led-4,led-5,led-6,led-7,led-8,led-9,led-10,led-11,led-12,led-13,led-14,led-15]、显示0[无]、关节[无]、端口[grove,extension]、PNG3；rfid 控件0[无]、灯0[无]、显示0[无]、关节[无]、端口[grove]、PNG2；env 控件0[无]、灯0[无]、显示0[无]、关节[无]、端口[grove]、PNG2。隐藏安装/配合推导另记，不称完整BOM、制造或实物验收，无通信/UID/环境读数/固件。

本批贴纸同步：Unit RGB LED 10cm / 15LED 3张参考重绘；Unit RFID 2张参考重绘；Unit ENV (DHT12 + BMP280) 2张参考重绘。准确本款条带/端板丝印、RFID前后膜、ENV后标/QC膜代码重绘普通高清PNG并注明来源，QC仅复现实物文字。PCB不造假膜，真实基材/背胶/膜/压纹去墨保留；不裁照片/借错款/猜微字或个体码，不以图遮缺件。私表/URL/原名/映射/矢量/原始资料/生成器/中间件留分发树外。新增代码MIT，官方照片与第三方标识保留各自权利。

两入口/实际配置与去墨和真实partial带形、15灯逐颗外驱/实体支持、StickS3→HUB三分支四芯、变父/peer/外驱无echo、host framebuffer/资源释放、6导出/双build及在线PNG已保存[本批进度](../../artifacts/rgbled-rfid-env-expansion/progress.json)。未逐面浏览器/GPU、历史全量或硬件验收；旧50PNG、私Scroll、StackChan量产fit-unresolved、Puzzle Bridge、Catch及既有延期保持，整体goal active。


## 前批检查点：M5Bit / Mini BPS / HEX

该批保存时本地181款（14主机、167Unit），全部 `modeled`、`verified` 为0。本批新增M5Bit A051、原Mini BPS U090、原HEX A045及5张本款普通PNG。GitHub `main`的163款已同步于 `4fd5216`，见[163款同步记录](../GIT-SYNC-163-2026-10-27.md)；随后批41/42/43/44/45/46共18款/29PNG仍是本地增量，未再次提交推送。实际结构/API见[本批指南](../M5BIT-BPS-HEX-UNITS.md)，48批范围见[增量索引](../LOCAL-EXPANSION.md)。

三款按自身官方尺寸与多视图参数化，无本款CAD，不借新版/宣称原生面。M5Bit保真实深卡槽/双侧接触与IO/蓝Grove，Microbit卡为情境不默认附带；BPS保BMP280/双通气口/支撑，不借U090-B8mm壳拉伸；HEX保自身36×31.2×6.95图纸与37颗较大SK6812/三白4P座，表31.2×36×7维序/取整分记。实际LED仅外驱材料，不自动彩虹/协议级联/供电或固件。最终实际API/PNG：m5-bit 控件0[无]、灯0[无]、显示0[无]、关节[无]、端口[microbit,io,aux,grove]、PNG2；bps 控件0[无]、灯0[无]、显示0[无]、关节[无]、端口[grove]、PNG2；hex 控件0[无]、灯37[led-1,led-2,led-3,led-4,led-5,led-6,led-7,led-8,led-9,led-10,led-11,led-12,led-13,led-14,led-15,led-16,led-17,led-18,led-19,led-20,led-21,led-22,led-23,led-24,led-25,led-26,led-27,led-28,led-29,led-30,led-31,led-32,led-33,led-34,led-35,led-36,led-37]、显示0[无]、关节[无]、端口[grove,out,power]、PNG1。隐藏安装与接触/配合推导另记，不称完整BOM或制造/实物验收，不模拟IO/UART/压力温度高度/寄存器。

本批贴纸同步：Unit M5Bit 2张参考重绘；Unit Mini BPS 2张参考重绘；Unit HEX 1张参考重绘。精确SKU无原稿，本款清楚PCB/前标/后膜代码准确重绘普通高清PNG并注明来源，个体QR/编号和宣传叠字不复制；PCB不添假膜，真实膜/压纹保留。私表/URL/原名/映射/矢量及原始资料/生成器/中间件留分发树外；不裁照片、不借错款、不编微字或以图遮缺件。新增代码MIT，官方照片和第三方标识保留各自权利。

本批两入口/实际配置与去墨、实体接口/通气路径和37灯外驱、StickS3→HUB三分支四芯、变父/peer/外驱无echo、host framebuffer与资源释放、6导出/双build及在线PNG已保存[本批进度](../../artifacts/m5bit-bps-hex-expansion/progress.json)。未逐面浏览器/GPU、历史全量或硬件验收；旧50PNG、私Scroll、StackChan量产fit-unresolved、Puzzle Bridge、Catch及既有延期保持，整体goal active。


## 前批检查点：EXT.IO / ADC / DAC

该批保存时本地178款（14主机、164Unit），全部 `modeled`、`verified` 为0。本批新增EXT.IO U011、ADC U013、DAC U012原版/EOL及5张本款普通PNG。GitHub `main`的163款已同步于 `4fd5216`，见[163款同步记录](../GIT-SYNC-163-2026-10-27.md)；随后批41/42/43/44/45共15款/24PNG仍是本地增量，未再次提交推送。实际结构/API见[本批指南](../EXTIO-ADC-DAC-UNITS.md)，47批范围见[增量索引](../LOCAL-EXPANSION.md)。

三款根据本款官方尺寸与自身多视图参数化重建，无本款CAD，不声明原生面或套新版。U011保PCA9554PW/真实2×5 IO/红Grove，旧款11mm表与B图10.2mm冲突已记录，B图不作旧款精确datum；U013/U012各按自身32×24×10.2图、真实前装可拆橙2P端子/接收深腔/触点及板/四芯Grove支持。无色壳字/箭头为实体，贴纸不遮缺件。最终实际API/PNG：extio 控件0[无]、灯0[无]、显示0[无]、关节[无]、端口[grove,io]、PNG1；adc 控件0[无]、灯0[无]、显示0[无]、关节[无]、端口[grove,terminal]、PNG2；dac 控件0[无]、灯0[无]、显示0[无]、关节[无]、端口[grove,terminal]、PNG2。内部安装与配合推导另记，不称完整BOM或制造/实物验收，不模拟IO/ADC/DAC/电气/固件。

本批贴纸同步：Unit EXT.IO 1张参考重绘；Unit ADC 2张参考重绘；Unit DAC 2张参考重绘。私表精确SKU核对无原稿，本款清楚后标/端子极性代码准确重绘普通高清PNG并标明来源；私表/URL/原名/映射/矢量及原始资料/生成器/中间件均留分发树外。不裁照片、不借错款、不编微字或个体码，不添假膜。新增代码MIT，官方照片和第三方标识保留各自权利。

本批两入口/全部实际配置与去墨、真实接口/端子装拆及有证机械动作、StickS3→HUB三分支四芯、变父/peer/外驱无echo、host framebuffer与资源释放、8导出/双build及在线PNG已保存[本批进度](../../artifacts/extio-adc-dac-expansion/progress.json)。未逐面浏览器/GPU、历史全量或硬件验收；旧50PNG、私Scroll、StackChan量产fit-unresolved、Puzzle Bridge、Catch及既有延期保持，整体goal active。


## 前批检查点：M5Camera-X / UnitV2-M12 / TimerCamera-X

该批保存时本地175款（14主机、161Unit），全部 `modeled`、`verified` 为0。本批新增M5Camera-X U038、UnitV2-M12 U078-M12、TimerCamera-X U082-X及2张本款普通PNG。GitHub `main`的163款已同步于 `4fd5216`，见[163款同步记录](../GIT-SYNC-163-2026-10-27.md)；随后批41/42/43/44共12款/19PNG仍是本地增量，未再次提交推送。实际结构/API见[本批指南](../M5CAMERAX-V2M12-TIMERCAMX-UNITS.md)，46批范围见[增量索引](../LOCAL-EXPANSION.md)。

三款按本款官方MIT完整闭合native壳件与自身照片建模，按整件身份排横向/爆炸重复，不删面或无声伸缩迁就名义尺寸。U038保白壳原生压纹/真实光学与RESET和接口，排网页错挂尺寸图；U078-M12保本款光学/真实弹性舌与独立外驱焦环，固定sensor/板/口/壳不随焦环转动，未知螺距不造轴移联动或自动调焦；U082-X保66.5度/140mAh与本款帽/光路和安装件。原生壳、光学、膜和附件包络分记，实际附件名与family据各款冻结证据。最终实际API/PNG：m5camera-x 控件1[reset]、灯0[无]、显示0[无]、关节[无]、端口[grove,usb,mount]、PNG0；unitv2-m12 控件1[user]、灯0[无]、显示0[无]、关节[focus]、端口[grove,usb,sd]、PNG1；timercamera-x 控件2[power,reset]、灯1[status]、显示0[无]、关节[无]、端口[grove,usb,mount]、PNG1。隐藏安装、行程、光学和配合推导另记，无证灯/转子/轴/铰链不编，不称制造或实物验收。

本批贴纸/标记同步：M5Camera-X无PNG，保真实无色原生压纹；UnitV2-M12 1张参考重绘；TimerCamera-X 1张参考重绘。M5Camera-X只有已证无色native M5压纹，0PNG是实际载体判断；其余清楚本款后标代码重绘普通高清PNG。私表/URL/原名/映射/矢量及原始CAD官图/生成器/中间件均留分发树外，不裁照片、不借错款、不编微字或个体QR/MAC/SN，不添假膜或以图片遮缺件。新增代码MIT，官方结构与第三方标识保留各自权利。

本批两入口/全部实际配置与去墨、真实按放/取消/焦环形状及固定件、附件拆装、StickS3→HUB三分支四芯、变父/peer/外部输出无echo、host framebuffer与资源释放、10导出/双build及在线源PNG已保存[本批进度](../../artifacts/m5camerax-v2m12-timercamx-expansion/progress.json)。未逐面浏览器/GPU、历史全量或硬件验收；旧50PNG、私Scroll、StackChan量产fit-unresolved、Puzzle Bridge、Catch及既有延期保持，整体goal active。


## 前批检查点：UnitV2-USB / UnitV-M12 / TimerCamera-F

该批保存时本地172款（14主机、158Unit），全部 `modeled`、`verified` 为0。本批新增UnitV2-USB U078-USB、UnitV-M12 U078-V-M12、TimerCamera-F U082-F及4张本款普通PNG。GitHub `main`的163款已同步于 `4fd5216`，见[163款同步记录](../GIT-SYNC-163-2026-10-27.md)；随后批41/42/43共9款/17PNG仍是本地增量，未再次提交推送。实际结构/API见[本批指南](../UNITVUSB-M12-TIMERCAM-UNITS.md)，45批范围见[增量索引](../LOCAL-EXPANSION.md)。

三款按各自官方MIT STL完整闭合壳件与本款实拍建模，按分件身份排横向副本/爆炸重复，不把整排源文件包络当整机，不删面或静默拉伸迁就规格。USB版保固定USB-A凸罩/USB-A/C/HY2.0/SD/实际顶部弹性舌与自身clip，无内置相机或可拆镜头盖；M12保自身CNC框/M12光学/侧键与原生壳半；TimerF保本款鱼眼/真实板与270mAh电池/安装附件，旧CAD点阵孔按本款实拍以本体塑料补实，保源面并记录版本差异。原生壳与含光学/接口/夹具的包络分记。最终冻结API/PNG记录：unitv2-usb 控件1[user]、灯0[无]、显示0[无]、关节[无]、端口[grove,usb-a,usb,sd,mount]、PNG1；unitv-m12 控件2[buttonA,buttonB]、灯0[无]、显示0[无]、关节[无]、端口[grove,usb,sd]、PNG2；timercamera-f 控件2[power,reset]、灯1[status]、显示0[无]、关节[无]、端口[grove,usb,mount]、PNG1。实际cap/输出/转动只据本款证据并由外部驱动，固定包体/板/口保留；无证外灯/轴/铰链不编，隐藏安装与行程/光学/配合推导单独记录。

贴纸随三款同步：UnitV2-USB 1张参考重绘；UnitV-M12 2张参考重绘；TimerCamera-F 1张原稿栅格。本款原稿核准后转普通PNG，缺源按清楚本款官图代码重绘，明确真实膜或CNC/PCB载体；排包装/错版/照片裁切/不可辨微字及变量QR/MAC/SN，印刷不遮缺件。两入口实际配置artwork:false保全部物理attributes/index/world。必要检查依实际freeze覆盖输入/外驱形状、三分支四芯、真实多接口/附件独立装拆、peer/framebuffer/disposal、9导出/两build/5188实际资源字节；执行记录见[本批进度](../../artifacts/unitvusb-m12-timercam-expansion/progress.json)。没有USB/UART/AI抓拍、音频、RTC唤醒、读数、电气或固件仿真，不伪造视频display。未逐面浏览器/GPU、历史全量、制造或实物验收。私表/URL/原名/映射/矢量/原始来源/生成器/中间材料继续只留分发树外。


## 前批检查点：Mini IMU-Pro / Glass / 8Servos2-Chain

该批保存时本地169款（14主机、155Unit），全部 `modeled`、`verified` 为0。本批新增Mini IMU-Pro U171、Glass U158、8Servos2-Chain U223及7张本款普通PNG。GitHub `main`的163款已同步于 `4fd5216`，见[163款同步记录](../GIT-SYNC-163-2026-10-27.md)；随后批41/42共6款/13PNG仍是本地增量，未再次提交推送。实际结构/API见[本批指南](../IMUPRO-GLASS-SERVOSCHAIN-UNITS.md)，44批范围见[增量索引](../LOCAL-EXPANSION.md)。

三款按官方发布尺寸和自身实拍参数化，不声明原生CAD面、不借U095/Glass2/U222。U171内部SW1未见外部通道，不许诺闭壳地址控件；原款Glass保自身两侧键、透明蓝128×56显示区及真实固定蜂鸣载体；U223保官方发布外形/孔/窗/DC尺寸，其与U222相同的尺寸图不作独立内部装配证据，内部按U223实拍电容/载体和Chain IN/OUT HY2.0-4P/24针构建，无U222旋钮，未证外部光路不造外灯。最终冻结API/PNG记录：mini-imu-pro 控件0[无]、灯0[无]、显示0[无]、端口[grove]、PNG3；glass 控件2[button-a,button-b]、灯0[无]、显示1[screen]、端口[grove]、PNG2；8servos2-chain 控件0[无]、灯0[无]、显示0[无]、端口[grove,out,ch0,ch1,ch2,ch3,ch4,ch5,ch6,ch7,dc]、PNG2。实际控件、输出、配置和命令以作者冻结记录为准，不预填数量或为报表修改产品；隐藏安装、行程/配合推导单独记录。

贴纸随三款同步：Unit Mini IMU-Pro 3张参考重绘；Unit Glass 2张参考重绘；Unit 8Servos2-Chain 2张原稿栅格。优先核准本款原稿转普通PNG；缺原稿按本款清楚官方照片代码重绘。按真实载体配准，屏幕不贴永久内容；排包装/错版/照片裁切/不可辨微字，印刷不遮缺件，不添无证胶膜。两入口实际配置artwork:false保全部物理attributes/index/world。必要检查依实际freeze覆盖输入/外驱输出、三分支四芯、多接口嵌套/独立装拆、peer/framebuffer/disposal、6导出/两build/5188实际资源字节；执行记录见[本批进度](../../artifacts/imupro-glass-servoschain-expansion/progress.json)。没有地址联动、传感数值、触控、音频合成、servo/PWM、Chain/I2C、电气或固件仿真。未逐面浏览器/GPU、历史全量、制造或实物验收。私表/URL/原名/映射/矢量/生成器/中间材料继续只留分发树外。


## 前批检查点：CardKB2 / Neco / Mini OLED

该批保存时本地166款（14主机、152Unit），全部 `modeled`、`verified` 为0。本批新增CardKB2 U215、Neco U163、Mini OLED U166及6张本款普通PNG。GitHub `main`的163款已同步于 `4fd5216`，见[163款同步记录](../GIT-SYNC-163-2026-10-27.md)；随后本批共3款/6PNG仍是本地增量，未再次提交推送。实际结构/API见[本批指南](../CARDKB2-NECO-MINIOLED-UNITS.md)，43批范围见[增量索引](../LOCAL-EXPANSION.md)。

三款按自身清楚尺寸图/实物照片参数化，不声明原生CAD面、不借旧CardKB/NeoHEX/旧OLED。CardKB2保42矩阵键加RST/BOOT共44实际瞬时控件、Grove/USB-C/RGB，1mm板厚与6.15mm器件包络分记；Neco保自身猫耳曲边板、35独立RGB/后轻触键/双Grove及固定眼，43mm孔距与47.1mm全宽分记；Mini OLED保72×40白色外驱面板、双Grove及默认装配态折回FPC，6.75图纸与6.8圆整规格分记。实际控件只改变对应cap/plunger，固定package/接点/板/口保持；隐藏安装、行程/FPC弯曲等推导记录，不称制造或量产配合验收。

贴纸随三款同步：Unit CardKB2 2张原稿栅格+参考重绘；Unit Neco 2张参考重绘；Unit Mini OLED 2张参考重绘。原稿/参考重绘按各自artwork记录，PCB不添胶膜、无字红plunger不添字、字符留在实际固定PCB、屏幕不贴永久内容；排包装/错版/照片裁切/不可辨微字，印刷不遮缺件。两入口实际配置与按下态artwork:false保全部物理attributes/index/world。必要检查包括44键/后轻触键多源释放取消、独立外驱灯/白OLED、三分支真实四芯、多接口嵌套/独立装拆、peer/framebuffer/disposal、6导出/两build/5188实际资源字节；执行记录见[本批进度](../../artifacts/cardkb2-neco-minioled-expansion/progress.json)。没有键盘组合/字符模式、WS2812级联、I2C/SSD1315、电气或固件仿真。未逐面浏览器/GPU、历史全量、制造或实物验收。私表/URL/原名/映射/矢量/生成器/中间材料继续只留分发树外。


## 前批检查点：CatM / NeoHEX / ENV-IV

该批保存时本地163款（14主机、149Unit），全部 `modeled`、`verified` 为0。本批新增CatM U128、NeoHEX A045-B、ENV-IV U001-D及5张本款普通PNG。本次Git同步收录全部163款及批37–40新增的12款/27PNG，见[163款同步记录](../GIT-SYNC-163-2026-10-27.md)。历史检查点中的未推送描述保留其保存时点；当前提交与远端状态以Git日志及GitHub main为准。实际结构/API见[本批指南](../CATM-NEOHEX-ENVIV-UNITS.md)，42批范围见[增量索引](../LOCAL-EXPANSION.md)。

CatM保本款6592完整原装面、单普通SMA/蓝Grove/NanoSIM与真实蜂窝封装，不借宽壳CatM GNSS；未证外灯光路/铰轴不造外灯或关节。NeoHEX无CAD，按自身尺寸图与照片参数化37真实灯、两斜一竖Grove形接口、六耳和独立均光片；36mm孔心基准/31mm主体/耳外包络及9.55图纸/9.6规格分记。ENV-IV无CAD，按自身尺寸与实板照片构建通气壳、红Grove和SHT40/BMP280，真实槽壁/安装背衬齐备。隐蔽壁/卡扣、安装和附件配准推导分别记录；真实配置/附件/可达组件依最终冻结API，不称制造或量产配合验收。

贴纸随三款同步：Unit CatM 2张原稿栅格；Unit NeoHEX 2张参考重绘；Unit ENV-IV 1张原稿栅格。原稿/官方平面栅格/参考重绘按各自artwork记录，PCB印字不添胶膜；排包装/错版/照片裁切/不可辨微字，印刷不遮缺件。两入口实际配置artwork:false保全部物理attributes/index/world。必要检查包括三分支真实四芯、多接口/独立装拆、真实附件与外驱灯noecho、peer/framebuffer/disposal、8导出/两build/5188实际资源字节；执行记录见[本批进度](../../artifacts/catm-neohex-enviv-expansion/progress.json)。没有蜂窝/UART/网络、电气/WS2812级联、环境读数或固件状态。未逐面浏览器/GPU、历史全量、制造或实物验收。私表/URL/原名/映射/矢量/生成器/中间材料继续只留分发树外。


## 前批检查点：UnitV-OV7740 / LoRaE220-433 / 8Servos2-I2C

该批保存时本地160款（14主机、146Unit），全部 `modeled`、`verified` 为0。本批新增UnitV-OV7740 U078-C、LoRaE220-433 U170-433、8Servos2-I2C U222及7张本款普通PNG。GitHub `main`的151款已同步于 `a8198a5`，见[151款同步记录](../GIT-SYNC-151-2026-10-27.md)；随后三批共9款/22PNG仍是本地增量，未再次提交推送。真实结构/API见[本批接入指南](../UNITV-LORA433-SERVOS2-UNITS.md)，41批范围见[增量索引](../LOCAL-EXPANSION.md)。

UnitV保本款7056原装源面、真实双原生弹片与plunger、镜头/板/USB/TF/Grove和RGB真实孔；按钮只改变对应原生弹片及真实压杆，具体可达组件以冻结API为准。LoRa433保自身6614原装面、两个真实稳定DIP与普通SMA，配套110mm天线独立可拆且静态，未证铰轴不猜关节或RPM。8Servos2无本款CAD，依据自身六视尺寸/清楚照片完整参数化；双Grove/DC/24个male针、固定刻度与16稳定档rotary-selector齐备，支持实际drag和外驱无回声；真实LED外部光路未证则不造外灯。隐藏安装、参数化壳壁/卡扣、控件行程与附件轮廓推导分记，不称制造或量产配合验收。

贴纸同步按各自artwork.json分列：UnitV-OV7740 1张官方平面栅格；Unit LoRaE220-433 3张参考重绘；Unit 8Servos2-I2C 3张原稿栅格+参考重绘。UnitV使用整块官方平面位图，不称私矢量原稿或重绘；LoRa433的第三面是固定DIP cover印字，不添第三张物理膜；U222前背原稿与固定刻度重绘不统称原稿。排包装/错版/照片裁切/不可辨微字，印刷不遮缺件；所有入口实际配置artwork:false保全部物理attributes/index/world。必要检查包括三分支真实四芯、双键与固定件、稳定DIP/16档选择器drag和外驱无回声、实际配置/独立装拆/framebuffer、16档demo面板的两份专项报告及7导出/两build/5188实际资源字节，执行结果见[本批进度](../../artifacts/unitv-lora433-servos2-expansion/progress.json)。没有摄像/AI/SD/USB/UART、RF/模式、电气/PWM/地址算法或内部舵机状态；未逐面浏览器/GPU、历史全量、制造或实物验收。私表/URL/原名/映射/矢量/生成器/中间件继续只留分发树外。


## 前批检查点：DoF6 / DoF9 / BMM350

该批保存时本地157款（14主机、143Unit），全部 `modeled`、`verified` 为0。本批新增DoF6 U228、DoF9 U229、BMM350 U231及9张本款普通PNG。GitHub `main`的151款已同步于 `a8198a5`，见[151款同步记录](../GIT-SYNC-151-2026-10-27.md)；随后两批共6款/15PNG仍是本地增量，未再次提交推送。真实结构/API见[本批接入指南](../DOF6-DOF9-BMM350-UNITS.md)，40批范围见[增量索引](../LOCAL-EXPANSION.md)。

三款分别保各自官方路径的完整4188原装壳面。发布壳源字节相同不推出板上器件、控件和印刷相同：DoF6仅BMI270，DoF9为BMI270+BMM350，BMM350只保本款磁感封装；共享原理图NC/选件和DoF10气压件不跨款装入。真实PCB/Grove/孔壁/背衬/标签薄膜齐备；DoF6/DoF9真实稳定SW1只移动滑片和杆，释放/取消保档，BMM350顶槽保本款固定黑色背衬且无虚构拨片。实际组件/服务配置及推导边界以冻结API与单品来源为准。

每款同步从有效本体原稿栅格或可读本款官图代码重绘PNG，排包装/错版/照片裁切/不可辨微字，不能靠印刷遮缺件。两入口实际配置artwork:false保全部物理attributes/index/world。三分支真实四芯、稳定档位/多源取消和外驱无回声、实际配置与其余物理保持、独立装拆/framebuffer、6导出/两build/5188实际资源字节见[本批进度](../../artifacts/dof6-dof9-bmm350-expansion/progress.json)。没有惯性/磁场读数、地址算法、固件或电气状态；未逐面浏览器/GPU、历史全量、制造或实物验收。私表/URL/原名/映射/矢量/生成器/中间件继续只留分发树外。


## 前批检查点：HBridge / CatM GNSS / Ultrasonic-IO

该批保存时本地154款（14主机、140Unit），全部 `modeled`、`verified` 为0。本批新增`hbridge` U160、`catm-gnss` U137、`ultrasonic-io` U098-B2及6张本款普通PNG。GitHub `main`的151款已同步于 `a8198a5`，见[151款同步记录](../GIT-SYNC-151-2026-10-27.md)；本批3款/6张实际PNG仍是本地增量，未再次提交推送，当前待同步合计3款/6PNG。真实结构/配置/API见[本批接入指南](../HBRIDGE-CATM-ULTRASONIC-UNITS.md)，39批范围见[增量索引](../LOCAL-EXPANSION.md)。

原HBridge U160保自身5592原装面和STM32/RZ7899/供电实体、Grove/4P座及本款可拆四头插头，区别已覆盖U160-V11。实际四位DIP/VM稳定滑选仅滑片/杆改变档位；被前盖挡住时没有穿壳pointer目标，外部真实档位API仍保留，去对应盖后才可指针交互。头角外驱不模拟轴向夹紧，不借v1.1的loose电容或造旋钮、马达状态。

CatM GNSS U137以自身5284原装面为源；左SMA窗口限域派生后运行5248面（前2610/后2638），前2489原面保留、157原面在限域内替换为121新面，完整后壳保持。区域、保留/替换对应与材料闭合以最终sources/smoke为准，不把5284源面数当运行保留面数。宽壳/四安装孔、SIM7080G/实际板、MicroSIM/DC/Grove与双SMA齐备，不套窄NBIoT/NanoSIM。六种真实配置、LTE杆与GNSS同轴+puck独立装拆；只有真实可辨轴才给外驱展示角，同轴与Grove四芯分开。NET/STA标签不当外部光路证据，真实内部载体保留但光路未证不造外灯或网络/定位状态。

Ultrasonic-IO U098-B2保自身5510原面/原公差、RCWL-9620 GPIO板、黑Grove、两个真实网罩/深膜片及支撑、后盖与本款IO背标，不借B1 I2C打印或拉壳。官方错PinMap已反馈，按自身清楚PORT.B I/O照片记外观；没有声波/膜片动画、读数、触发回声时序或电气/固件行为。

贴纸同步本款原稿栅格或本款清楚官图代码重绘，逐款分列来源；不裁照片/借错型号/编小字/靠PNG填缺件。所有入口实际配置artwork:false保全部物理attributes/index/matrixWorld。必要专项 `node scripts/check-hbridge-catm-ultrasonic-units.mjs`，实际分支四芯/动作固定分离/独立装拆、9导出、两build及5188源PNG/运行chunk字节范围见[本批进度](../../artifacts/hbridge-catm-ultrasonic-expansion/progress.json)。未逐面浏览器/GPU、全量历史、制造或实物验收；私表/URL/原稿名/矢量/映射/生成器/中间件继续分发树外。


## 前批检查点：NBIoT2 / NBIoT-CN / Mini Proto

该批保存时本地151款（14主机、137Unit），全部 `modeled`、`verified` 为0。本批新增`nbiot2` U111-B、`nbiot-cn` U112、`mini-proto` U064及5张本款普通PNG。本次Git同步包含这151款源码，新增八批共24款及48张PNG；提交与远端状态以Git日志为准，见[151款同步记录](../GIT-SYNC-151-2026-10-27.md)。下方各前批检查点中的Git数量与未推送描述保留其历史时点。真实结构/配置/API见[本批接入指南](../NBIOT-MINI-PROTO-UNITS.md)，38批范围见[增量索引](../LOCAL-EXPANSION.md)。

NBIoT2 U111-B与NBIoT-CN U112分别保SIM7028/SIM7020C本款通信载体、板/卡座、Grove/普通SMA及自身机身；各自官方CAD路径壳字节相同只说明发布壳源相同，不推出内部、标签或天线相同。默认不凭空附SIM卡，真实后盖服务配置才暴露原遮挡内部。天线按本款官图独立可拆，只有真实可辨结构才给外驱关节，尺寸/轴/展示角推导不称量产止挡。D1外光路未证不造外灯或把金色安装窗当按钮。

Mini Proto U064保自身3222原装面、48个真实贯孔/孔壁镀层/双面焊环的洞板、Grove和实际背标，后盖服务只去真实盖及对应印刷，不借U022孔网或附用户电路。三款内部蜂窝/RF/AT/UART、SIM内容、网络、固件、传感值与供电电气由其他框架实现；隐藏安装与附件配合推导分记。

贴纸同步本款原稿栅格或本款清楚官图代码重绘，逐款分列来源；不裁照片/借错型号/编小字/靠PNG填缺件。所有入口实际配置artwork:false保全部物理attributes/index/matrixWorld。必要专项 `node scripts/check-nbiot-mini-proto-units.mjs`，实际分支四芯/动作固定分离/独立装拆、8导出、两build及5188源PNG/运行chunk字节范围见[本批进度](../../artifacts/nbiot-mini-proto-expansion/progress.json)。未逐面浏览器/GPU、全量历史、制造或实物验收；私表/URL/原稿名/矢量/映射/生成器/中间件继续分发树外。


## 前批检查点：Weight / SSR / PoE CAM-W v1.1

该批保存时本地148款（14主机、134Unit），全部 `modeled`、`verified` 为0。本批新增 `weight` U030、`ssr` U122、`poe-cam-w-v11` U121-B-V11及6张本款PNG。GitHub `main`保持已同步127款 `3681a64`；随后七批共21款、43张PNG未再次提交推送，历史见[127款记录](../GIT-SYNC-127-2026-10-26.md)。真实结构/配置/API见[Weight/SSR/PoECAM](../WEIGHT-SSR-POECAM-UNITS.md)，37批范围见[增量索引](../LOCAL-EXPANSION.md)。

Weight保本款HX711/DAT-CLK原装壳/板/Grove/四位端子与可拆四螺钉插头，不套Weight-I2C/MCU/I2C，不附传感器/秤台或造sensor读数。SSR保MOC3043M/BT136S本款小型壳/板/橙4P端子与可拆四头插头，不套ACSSR/DCSSR控制器/RS485/DELIXI；内部D1光路未证时固定不发光，无虚构relay状态或接触臂。螺钉只外驱工具头角，固定夹座/孔壁/插舌/簧片保持，推导配合不冒充轴向夹紧或量产止挡。

PoE CAM-W v1.1保U121-B-V11/OV3660、本款原生壳/相机夹持件/Stand/Brick，不借UnitV2/CamS3。RJ45/Grove、user/reset及实际下载/扩展结构按可达面表达，灯仅真实载体/原孔光路，不造USB、假RGB或固定镜头关节。Stand只给真实单轴相对角，不自动固定地面或求解主机世界姿态。隐藏安装/控件行程/附件配合推导分记，固件、摄像/视频/AI、网络/PoE、传感值、电气/供电和协议由外部框架实现。

本批贴纸同步原稿栅格/官图代码重绘，按各自来源记录区分；不裁照片/借错型号/编不可辨小字/靠印刷填缺件。各入口实际配置artwork:false保全部物理attributes/index/matrixWorld。必要专项 `node scripts/check-weight-ssr-poecam-units.mjs`，真实三分支四芯、螺钉/按键/支架及固定件、独立装拆、10导出/两build及5188源PNG/运行chunk字节范围见[本批进度](../../artifacts/weight-ssr-poecam-expansion/progress.json)。未新增逐面浏览器/GPU、全量历史、制造或实物验收；私表/URL/原稿名/映射/矢量/生成器/中间件继续分发树外。


## 前批检查点：UnitV2 / LoRaWAN-CN470 / Proto

该批保存时本地145款（14主机、131Unit），全部 `modeled`、`verified` 为0。本批新增 `unitv2` U078-D、`lorawan-cn470` U184-CN470、`proto` U022及4张本款PNG。GitHub `main`保持已同步127款 `3681a64`；随后六批共18款、37张PNG尚未再次提交推送，历史见[127款记录](../GIT-SYNC-127-2026-10-26.md)。实际结构/配置/API见[UnitV2/LoRaWAN-CN470/Proto](../UNITV2-LORAWAN-PROTO-UNITS.md)，36批范围见[增量索引](../LOCAL-EXPANSION.md)。

UnitV2严格U078-D/GC2145与本款原壳，真实镜头/麦克风、user、实际内部红白LED（外部可见光路未证）、USB-C/Grove/卡座和安装结构；实际风扇只外驱叶轮，固定框/电机保持，卡/50cmUSB线/单轴支架/Back-Brick按各自装拆和配置表达。支架只表现真实单轴相对角，不自动求解地面或主机世界姿态。LoRaWAN-CN470是本款RAK3172(L)/蓝Grove/普通SMA与195mm配套天线，不借其他频段或蜂窝器件；有限肘关节范围为本款结构的视觉重建，不称量产止挡。Proto保本款完整壳、7×11共77个真实贯孔/金属环/基材、Grove和真实后盖服务视图，前裸板不造胶贴、用户电路或虚构控件。内部视频/AI、RF网络、电气/供电、固件和协议由外部框架实现。

印刷同步本款真实表面：缺本款机身原稿时按可读官图代码准确重绘普通PNG、记录来源和字形/颜色/配准推导；不裁照片/借错型号/编不可辨小字/用PNG遮缺件。两入口及各实际配置artwork:false保全部物理attributes/index/matrixWorld。必要专项 `node scripts/check-unitv2-lorawan-proto-units.mjs`，真实控件/附件动作与固定件、三分支四芯和独立装拆、11导出/两build及5188源PNG/运行chunk字节范围见[本批进度](../../artifacts/unitv2-lorawan-proto-expansion/progress.json)。没有新增逐面浏览器/GPU、全量历史、制造或实物验收；私表/URL/映射/原稿名/矢量/生成器/中间件继续留分发树外。


## 前批检查点：PoE-P4 / Cat1-CN / Grove-to-Grove

该批保存时本地142款（14主机、128Unit），全部 `modeled`、`verified` 为0。本批新增 `poe-p4` U213、`cat1-cn` U204、`grove-to-grove` U148和8张本款PNG。GitHub `main`保持已同步127款 `3681a64`；随后五批共15款、33张PNG尚未再次提交推送，历史见[127款记录](../GIT-SYNC-127-2026-10-26.md)。实际结构/多入口/API见[PoE-P4/Cat1/Grove](../POEP4-CAT1-GROVE-UNITS.md)，35批范围见[增量索引](../LOCAL-EXPANSION.md)。

PoE-P4以自身同位6158源三角壳/背盖为基线，仅按本款官图修正Host USB-C与Hat2封闭面形成闭合实际开口，原/派生面数与区域分列，不称未改CAD；真实RJ45/双USB-C/两24pinFPC、9/6孔黑塑料female排座、独立16pin Hat2与Grove/内部板器件齐；user弯曲原壳舌，独立rgb/link-led/activity-led外驱，IR只实体无光束，不附未随套装提供的屏/相机/USB或网线。Cat1-CN保完整6562原面，前2714/后3848严格对应；rearCover:false只去真实后盖/背膜/3螺钉，保前壳/PCB/内部SIM与馈线，服务sim锚不穿闭壳。普通SMA外螺纹中心孔与本款108×10内螺纹中心针天线、实际肘关节有限0–90外驱/独立装拆，不套RP-SMA；USB仅测试点/无证外灯光路不造口灯。Grove-to-Grove保3974本款原面/三带针socket/4IC和R-C，黑grove、白in/out可独立四芯，不造direct入口、按钮或传感值。内部协议/网络/供电/电气由外部框架实现，隐藏安装和运动范围推导在单品来源列明。

同步印刷：PoE-P4四片与Cat1-CN正背两片为严格本款机身source-vector-raster，包装/视图排除；Grove-to-Grove正背两片reference-redraw。不裁照片/借错型号/编小字/PNG遮缺件，真实膜/壳/PCB/腔壁/触点/控件/附件独立存在。必要专项 `node scripts/check-poep4-cat1-grove-units.mjs`，两入口各真实配置artwork:false全部物理attributes/index/matrixWorld、实际user压放取消/固定件/独立灯、天线有限角与后盖服务、真实三分支四芯/多口装拆范围见[本批进度](../../artifacts/poep4-cat1-grove-expansion/progress.json)。没有新增逐面浏览器/GPU、全量历史、制造或实物验收；私表/URL/映射/原稿名/矢量/生成器/中间件继续分发树外。


## 前批检查点：Glass2 / TypeC-to-Grove / DoF10

该批保存时本地139款（14主机、125Unit），全部 `modeled`、`verified` 为0。本批新增 `glass2` U158-B、`typec-to-grove` U151、`dof10` U230和8张本款PNG。GitHub `main`保持已同步127款 `3681a64`；随后四批共12款、25张PNG尚未再次提交推送，历史见[127款记录](../GIT-SYNC-127-2026-10-26.md)。具体API/推导见[Glass2/TypeC/DoF10](../GLASS-TYPEC-DOF10-UNITS.md)，34批范围见[增量索引](../LOCAL-EXPANSION.md)。

Glass2按本款完整尺寸PDF与拆盖图独立重建（无本款CAD，不借旧Glass）；真实透光玻璃/FPC/PCB/安装件与双Grove齐备，128×56可见浅蓝OLED接受外部framebuffer，熄灭像素透明，不套黑底或猜控制器128×64的其余8行映射。U151保完整本款原壳、三前向Grove/USB-C/被动PCB与两CC电阻，canonical input及两输出可独立四芯装拆；不造供电状态或电气路由。DoF10保完整本款原壳、BMI270/BMM350/SPA06-003与真实槽中两档address拨杆；只有白色拨片/杆随动，取消保持稳定档，sensor被动状态空，无传感值/自动姿态/地址通信。几何包络/名义尺寸冲突、隐藏安装及行程推导均按本款来源列明。

同步印刷：Glass2前盖板/后PCB2张reference-redraw，TypeC三片本款标签3张reference-redraw，DoF10机身前/轴向圆贴/背3张source-vector-raster（排包装/视图候选）；不裁照片/借错型号/编小字/PNG遮缺件。必要专项 `node scripts/check-glass-typec-dof10-units.mjs`，两入口及各实际配置artwork:false全部物理attributes/index/matrixWorld、外部像素/透明材质、稳定档/固定件及真实三分支四芯/双输出接线范围见[本批进度](../../artifacts/glass-typec-dof10-expansion/progress.json)。没有新增逐面浏览器、GPU显示、全量历史、制造或实物验收；私表/链接/映射/原稿名/矢量/生成器/中间件继续分发树外。


## 前批检查点：C6L / Gateway H2 / ChainBus

该批保存时本地136款（14主机、122Unit），全部 `modeled`、`verified` 为0。本批新增 `c6l` U202、`gateway-h2` U195、`chainbus` U212和8张本款PNG。GitHub `main`保持已同步127款 `3681a64`；随后三批共9款、17张PNG尚未再次提交推送，历史见[127款记录](../GIT-SYNC-127-2026-10-26.md)。本批实际结构/多入口/API和限制见[C6L/GatewayH2/ChainBus](../C6L-GATEWAY-CHAINBUS-UNITS.md)，33批范围见[增量索引](../LOCAL-EXPANSION.md)。

C6L保64×48 OLED外部framebuffer、真实user/reset压放取消、独立rgb/status、USB/Grove和双RP-SMA配套天线；蜂鸣器只实体，长按不自动变灯或执行固件。GatewayH2默认完整闭壳仅grove，shell:false明确裸板配置才注册真实boot/usb/download六镀孔锚，0printed，不挖外壳/不穿壳点控件/不造塑料排座或无线光效。ChainBus左右蓝IN/OUT可四芯级联，白EXT是真实四腔plug，额外DirectModule直接装入hostsocket且无VisualCable/额外白源插头；ext自身拒普通GroveModule插头对插头，rgb仅外驱，无自动协议/电气路由。

C6L背面为本款原稿栅格；前标保留原字形/标志，仅按当前官图修订频段带，明确source-vector-raster-and-reference-redraw（排除原稿版本冲突），天线实际印刷按各自来源记录；GatewayH2候选均非机身原稿，正背2张reference-redraw；ChainBus正背2张精确source-vector-raster。印刷不替代壳/PCB/腔/触点/显示/键/天线，实际载体独立存在。必要专项 `node scripts/check-c6l-gateway-chainbus-units.mjs`，两入口/ChainBus三入口及各配置artwork:false全物理attributes/index/matrixWorld和接线/直接装拆/拒错/固定件/独立灯与framebuffer范围见[本批进度](../../artifacts/c6l-gateway-chainbus-expansion/progress.json)。没有新增逐面浏览器、全量历史、制造或实物验收；私表/链接/映射/原稿名/矢量/生成器/中间件继续仓库外。


## 前批检查点：Finger / 3.96 / Scales

该批保存时本地133款（14主机、119Unit），全部 `modeled`、`verified` 为0。本批新增 `finger` U008、`unit-396` U020、`scales` U108和3张本款背贴PNG；三款官图均只证实背贴，Scales顶面M5是原生浮雕，不造正面贴纸。GitHub `main`保持已同步127款 `3681a64`，随后ZigBee/CO2L/INA226-1A及本批共6款、9张PNG尚未再次提交推送，历史见[127款记录](../GIT-SYNC-127-2026-10-26.md)。完整来源/API及限制见[Finger/3.96/Scales](../FINGER-396-SCALES-UNITS.md)，32批范围见[增量索引](../LOCAL-EXPANSION.md)。

Finger严格FPC1020A电容式采集面、金属边框与真实模块，只 `grove`和被动`sensor`；U008内部touch-wake选项未接，不造机械键/触摸电气或外灯。3.96严格本款被动HY2.0转接、固定四位座与可拆四螺钉母插头 `terminal/screw-1…4`；只端口/可见头角度，不发明电气路由。Scales保本款底座/承载板/原生圆盖完整装配及真实称重组件/板/支撑，实际`tare`键压放/取消回位与独立外驱`rgb`；清零意图不自动改灯或重量，不造承载盘下沉joint。内部指纹/身份/UART、重量/质量/力学/清零/I2C及电气/固件由外部框架负责。

3PNG均为本款官方照片代码重绘 `reference-redraw`；实际膜/壳面、原生浮雕、PCB/封装/腔壁/触点独立存在。`artwork:false`保留两入口及各配置全部物理attributes/index/matrixWorld。必要专项 `node scripts/check-finger-396-scales-units.mjs`，保存范围见[本批进度](../../artifacts/finger-396-scales-expansion/progress.json)；没有新增逐面浏览器、全量历史、制造或实物验收。私表、私有链接/映射/原稿名、矢量、生成器及中间材料保仓库外。


## 前批检查点：ZigBee / CO2L / INA226-1A

127款已同步至GitHub `main`，基线 `3681a64`；该批新增 `zigbee` U110、`co2l` U104、`ina226-1a` U200-1A，共130款（14主机、116Unit），全部 `modeled`、`verified` 为0。本批三款和6张对应PNG尚未再次提交推送；同步历史见[127款记录](../GIT-SYNC-127-2026-10-26.md)，本批外形/API及限制见[ZigBee/CO2L/INA226-1A](../ZIGBEE-CO2L-INA226-1A-UNITS.md)。31批来源/范围见[增量索引](../LOCAL-EXPANSION.md)。

ZigBee保真实DRF1609H载板/SMA、可拆胶棒天线和外驱 `sma/tilt`；CO2L严格SCD41/VRH3301NLX、真实通气结构和被动 `sensor`；INA226-1A使用本款80mR/保险器件、固定四位座与可拆四螺钉插头 `terminal/screw-1…4`。三款均无证实外露按键/灯，内部S1/D1/D2不造外部控制或光窗；内部RF/UART、CO2/温湿度、电流/电压/功率、协议和电气交外部框架。本款名义尺寸、原壳包络及附件安装推导分别记录，不把源码实现当量产配合验收。

6张PNG为ZigBee/CO2L各2张 `reference-redraw` 与INA226-1A本机1A/80mR两片原稿转 `source-vector-raster`；剔除包装和10A贴纸。`artwork:false`保留两入口/各配置全部物理attributes/index/matrixWorld、真实膜或壳面、PCB/封装/腔壁和接口。必要专项 `node scripts/check-zigbee-co2l-ina226-1a-units.mjs`，保存范围见[本批进度](../../artifacts/zigbee-co2l-ina226-1a-expansion/progress.json)；没有新增逐面浏览器、全量历史或实物验收。表格、私有链接/原稿名、矢量、生成器和中间材料继续仓库外。


2026-10-26端子修订：AC Measure/AIN4-20mA/BLDC Driver只补齐插舌四孔下壁，`terminal/screw-1…4`、装拆和所有端口/输入接口保持。当前SHA及局部验证见[闭合修复](../TERMINAL-TONGUE-CLOSURE.md)；旧freeze/smoke是历史快照，不能代替当前修订来源。

前批新增 `unit-id`（U124）、`rf433r`（U113）、`rf433t`（U114），同步6张本款官图代码重绘 `reference-redraw` PNG，每款正背各1张；没有照片裁切、借用相近型号或不可辨小字编造。该批保存时本地127款（14主机、113Unit），全部 `modeled`、`verified` 为0。本次127款源码同步包含112款基线 `32c95e0` 后新增的15款Unit/28张对应PNG及三旧端子闭合修复，范围见[127款同步记录](../GIT-SYNC-127-2026-10-26.md)。历史progress中的未提交/未推送字样仅描述其保存时点，远端状态以GitHub main及实际推送回执为准。完整API、来源和三分支四芯例见[ID/RF433R/RF433T](../ID-RF433-UNITS.md)，30批记录见[本地增量索引](../LOCAL-EXPANSION.md)。

三款分别保留本款原壳、真实芯片封装/引脚、PCB、Grove深腔/四触点和独立胶贴基底。ID为本款ATECC608B-TNGTLSU-G器件外观；RF433R与RF433T分别采用真实接收/发射器及晶体/外围，内置PCB天线固定、不发光，没有外接SMA、胶棒或弹簧天线，不挖假观察窗或造关节。共用壳只在本款自有CAD来源核对后保留，不套用另一型号的芯片或印刷。隐藏板位/铜天线布局/安装、字体颜色与印刷配准仍标明推导，不宣称生产配合。

三款本体组件均只有 `grove`，没有 `sensor` / `button` / `joint` / `led` / display；均导出 `Model` / `GroveModule` / `spec`。总入口六个别名为 `IdUnit` / `IdUnitModule`、`Rf433rUnit` / `Rf433rUnitModule`、`Rf433tUnit` / `Rf433tUnitModule`；loader ID为三款slug。`unitFrame` / `cable`沿现有Grove接口外驱姿态和四芯线形，嵌套路径以前级实际Port ID作前缀，外驱不回送输入意图。外形只呈现真实连接和固定器件；没有身份值、数据帧、RF动画、读写/识别或收发功能。

`artwork:false`保留两入口全部物理attributes/index与最顶层更新后的 `matrixWorld`，含独立胶贴基底；印刷不代替PCB、器件、原壳或插座。身份/密钥/证书/加密/I2C、RF/ASK/数据/强度/距离/通信、GPIO、供电/电气、物理和固件由外部框架实现。必要专项 `node scripts/check-id-rf433-units.mjs`，综合范围以[本批进度](../../artifacts/id-rf433-expansion/progress.json)为准；没有新增逐面浏览器、全量历史或实物验收。私表、私有链接/原稿名、矢量、官图CAD原件、生成器和中间件留仓库外，仅公开最终普通PNG及安全配准/来源。

## 此前：Accel / OP90 / OP180

前批新增 `accel`（U056）、`op90`（U057）、`op180`（U058），同步4张本款官图代码重绘 `reference-redraw` PNG：Accel正背2张，OP90/OP180各背贴1张；没有照片裁切、借用相近型号或不可辨小字编造。该批完成时本地124款（14主机、110Unit），全部 `modeled`、`verified` 为0。公开仓库112款提交基线为 `32c95e0`，该批保存时其后共12款及三旧端子局部修复为本地增量；当前未推送范围以本文最新批次记录为准；Git同步范围见[112款同步记录](../GIT-SYNC-112-2026-10-26.md)。完整API、来源和三分支四芯例见[Accel/OP90/OP180](../ACCEL-OP90-OP180-UNITS.md)，29批记录见[本地增量索引](../LOCAL-EXPANSION.md)。

三款分别保留本款原壳、真实传感封装、PCB与器件、Grove插座和独立胶贴基底。OP90/OP180保留实际固定安装方向、槽型遮光壳、收发窗口、引脚与有意开放的检测空气隙；`90` / `180`是产品结构方向，不是可动角，不能为闭合填平真槽或造铰链。IR发射器不画可见灯、光束或检测锥。Accel没有真实可动机构，不以倾斜动画模拟内部加速度或数据；隐藏安装、内腔、图形字体/颜色和配准推导见单品研究。

三款本体组件均只有 `grove`和被动 `sensor`，没有 `button` / `joint` / `led` / display；均导出 `Model` / `GroveModule` / `spec`。总入口六个别名为 `AccelUnit` / `AccelUnitModule`、`Op90Unit` / `Op90UnitModule`、`Op180Unit` / `Op180UnitModule`；loader ID为三款slug。`unitFrame` / `cable`沿现有Grove接口外驱姿态和四芯线形，嵌套路径以前级实际Port ID作前缀，外驱不回送输入意图。`sensor`只定位真实器件外观，不能写入数值、检测、计数或内部状态。

`artwork:false`保留两入口全部物理attributes/index与最顶层更新后的 `matrixWorld`，含独立胶贴基底；印刷不代替PCB、光电封装、空气槽或插座。加速度/姿态数据、遮挡/检测/计数/电平、IR光学、I2C/GPIO、供电/电气、物理和固件由外部框架实现。必要专项 `node scripts/check-accel-opto-units.mjs`，综合范围以[本批进度](../../artifacts/accel-op90-op180-expansion/progress.json)为准；没有新增逐面浏览器、全量历史或实物验收。私表、私有链接/原稿名、矢量、官图CAD原件、生成器和中间件留仓库外，仅公开最终普通PNG及安全配准/来源。

## 此前：Mini PDM / Mini BPS v1.1 / MIC

前批新增 `mini-pdm`（U089）、`mini-bps-v11`（U090-B）、`mic`（U096），同步5张本款官图代码重绘 `reference-redraw` PNG：前两款各正背2张，MIC背贴1张；没有照片裁切或不可辨小字编造。三款均导出 `Model` / `GroveModule` / `spec`，保留真实四芯 `grove` 和被动 `sensor`；MIC另有实际调节头的有限角关节。该批完成时本地121款（14主机、107Unit），全部 `modeled`、`verified` 为0。公开仓库112款提交基线为 `32c95e0`，该批保存时其后共9款为本地增量；当前未推送范围以本文最新批次记录为准；Git同步范围见[112款同步记录](../GIT-SYNC-112-2026-10-26.md)。完整API、来源和三分支四芯例见[Mini PDM/Mini BPS v1.1/MIC](../AUDIO-PRESSURE-UNITS.md)，28批记录见[本地增量索引](../LOCAL-EXPANSION.md)。

Mini PDM保留本款SPM1423HM4H-B金属MEMS封装、真实声孔/深腔、PCB、HT7333及Grove。官方表为24×24×13mm，自身尺寸图与完整4162三角原壳为24×24×8mm，两者分别记录，不缩放原壳；反馈 `dcd6f74080ea478f8745ce19d5542ab8` 已保存。Mini BPS严格U090-B QMP6988 v1.1，保留4162三角原壳24×24×8mm、LGA9金属封装、Ø0.20mm真气孔/深腔、PCB、HT7533及BSS138；不混EOL U090 BMP280或其13mm几何/贴纸。两款前部双槽都有真实封装或PCB背衬，胶贴基底独立；安装/内腔、隐藏器件与印刷配准仍标明推导。

MIC保留本款电容麦克风金属筒、真实穿孔网/内凹振膜、蓝色10K阈值电位器、MAX4466/LM393/HT7533与Grove。`threshold`仅外驱可见调节头的 `angleDeg` / `durationMs`，非零RPM被拒绝；当前−135～135°是保守外观范围，机械止点和电气零点未确认。蓝色固定座、刻线、PCB与麦克风不随头旋转，不产生电阻、增益、ADC、Din/阈值或声音事件。三款均没有灯、按钮或显示屏；被动 `sensor`没有内部数值命令。

总入口六个别名为 `MiniPdmUnit` / `MiniPdmUnitModule`、`MiniBpsV11Unit` / `MiniBpsV11UnitModule`、`MicUnit` / `MicUnitModule`；loader ID为三款slug。`unitFrame` / `cable`沿现有Grove接口外驱姿态和四芯线形，嵌套路径以前级实际Port ID作前缀，外驱不回送输入意图。三款的麦克风声学/音频/录音、PDM时钟/数据、气压/温度/海拔、I2C/ADC/GPIO、电气和固件由其他框架实现。

`artwork:false`保留两入口全部物理attributes/index与最顶层更新后的 `matrixWorld`，含独立胶贴基底；印刷不代替真实PCB、器件、孔网或插座。必要专项 `node scripts/check-audio-pressure-units.mjs`，综合范围以[本批进度](../../artifacts/audio-pressure-expansion/progress.json)为准；没有新增逐面浏览器、全量历史或实物验收。私表、私有链接/原稿名、矢量、官图CAD原件、生成器和中间件留仓库外，仅公开最终普通PNG及安全配准/来源。

## 此前：Roller485 Lite / Mini CAN / INA226-10A

前批新增 `roller485-lite`（U182-Lite）、`mini-can`（U179）、`ina226-10a`（U200），同步7张PNG：Roller485 Lite三张、Mini CAN正背两张为同款官图代码重绘 `reference-redraw`，INA226-10A精确10A机身正背两张为原稿恢复栅格 `source-vector-raster`。三款均导出 `Model` / `GroveModule` / `TerminalPlug` / `spec`，保留真实四芯 `grove`。该批完成时本地118款（14主机、104Unit），全部 `modeled`、`verified` 为0。公开仓库112款提交基线为 `32c95e0`，该批保存时其后共6款为本地增量；当前未推送范围以本文最新批次记录为准；Git同步范围见[112款同步记录](../GIT-SYNC-112-2026-10-26.md)。完整API、来源和三分支四芯例见[Roller485 Lite/Mini CAN/INA226-10A](../ROLLER-MINI-CAN-INA226-UNITS.md)，27批记录见[本地增量索引](../LOCAL-EXPANSION.md)。

Roller485 Lite保留本款3504电机/转子、固定壳体、PCB、白色单色64×48 OLED、两颗独立RGB、Grove、PWR485与debug实体。`rotor`接受外驱角度/时长或连续视觉RPM，`press`压放实际壳舌并回弹，`lcd`仅接外部framebuffer，`rgb-1` / `rgb-2`默认off独立外驱。它只有单PWR485端子，不套其他Roller型号的顶部扩展口或滑环输出；没有 `sensor` 或 `grove-top`，不生成FOC、编码器数值、扭矩、负载、电流/速度环或电机物理。

Mini CAN为本款非隔离TJA1051T/3 SO8、ME3116/MST5333与3012电感实体，完整3286三角原壳8mm保留，含固定端子的裸机为24×32×10.2mm。不套Unit CAN U085隔离模块或MCU。INA226为U20010A/5mΩ版本，保留MSOP10、隔离SOIC8封装、16脚B0505ST16-W5、保险丝/分流器；不是1A版本。其官方58mm名义与56mm原壳分别记录，固定座安装外伸为已标明推导，官方尺寸图适用范围反馈见单品来源。两款本体只有 `grove` / `terminal`，隐藏LED无确认外露光路，不造灯窗、数值锚点或按钮。

三款均有可拆四螺钉 `TerminalPlug`，可用 `terminalPlug:true`安装或通过真实固定Port单独装拆。Roller使用 `pwr485/screw-1`…`screw-4`，Mini CAN/INA使用 `terminal/screw-1`…`screw-4`；四头仅接受 `angleDeg` / `durationMs`并可精确回位，拒非零RPM，不模拟螺纹轴向、夹紧或电气连接。总入口九个别名为 `Roller485LiteUnit` / `Roller485LiteUnitModule` / `Roller485LiteTerminalPlug`、`MiniCanUnit` / `MiniCanUnitModule` / `MiniCanTerminalPlug`、`Ina22610aUnit` / `Ina22610aUnitModule` / `Ina22610aTerminalPlug`；loader ID为三款slug。

`unitFrame` / `cable`沿现有Grove接口外驱姿态和四芯线形，嵌套路径以前级实际Port ID作前缀，外驱不回送输入意图。`artwork:false`保留各配置全部物理attributes/index与最顶层更新后的 `matrixWorld`，印刷不替代PCB、端子、触点或胶贴基底。电机控制/反馈、串口/CAN/I2C、电流电压功率、电气保护、供电与固件由其他框架实现。必要专项 `node scripts/check-roller-mini-can-ina226-units.mjs`，综合范围以[本批进度](../../artifacts/roller-mini-can-ina226-expansion/progress.json)为准；没有新增逐面浏览器、全量历史或实物验收。私表、私有链接/原稿名、矢量、官图CAD原件、生成器和中间件留仓库外，仅公开最终普通PNG及安全配准/来源。

## 此前：UWB / TMOS PIR / Mini ToF-90

前批新增 `uwb`（U100）、`tmos-pir`（U185）、`mini-tof-90`（U196），同步6张PNG：UWB标准机身正背2张 `source-vector-raster`，另两款各2张本款官图代码重绘 `reference-redraw`。三款均导出 `Model` / `GroveModule` / `spec`，保留真实四芯 `grove`。该批完成时本地115款（14主机、101Unit），全部 `modeled`、`verified` 为0。公开仓库112款提交基线为 `32c95e0`，该批保存时新增三款为本地增量；当前未推送范围以本文顶部记录为准；Git同步范围见[112款同步记录](../GIT-SYNC-112-2026-10-26.md)。完整API、来源与三分支四芯例见[UWB/TMOS PIR/Mini ToF-90](../RANGING-PRESENCE-UNITS.md)，26批记录见[本地增量索引](../LOCAL-EXPANSION.md)。

UWB为本款Ai-Thinker BU01/DW1000及STM32F103C8T6实体，完整3796三角原壳、黑色PCB、内置固定平面铜天线、晶振/稳压器和蓝色Grove均保留。只有 `grove`，无sensor/button/LED/joint，不套外置SMA或胶棒天线。标准机身原稿恢复保留原色与轮廓，仅修正转换的 `evenodd`→`nonzero`复合字腔；包装、照片及跨SKU同名候选排除，原稿/映射仅留仓库外。

TMOS PIR为本款STHS34PF80金属封装与凹入硅滤光窗、PCB背衬，只有被动 `sensor` 外观锚点及 `grove`。不套旧PIR半球菲涅耳，不画可见红外/检测锥，不提供人体存在、温度、运动或数值状态。官方规格表5.2mm与本款尺寸图/完整STL的8mm厚度冲突，保留24×32×8原始实体并已反馈，见单品来源。

Mini ToF-90保留固定90°两块PCB、板间四针、VL53L0X分离收发窗和深腔实体，光学方向固定+Y，不造铰链或外驱转动。`sensor`仅被动外观锚点；`power-led`为独立固定红色D1外驱明暗，默认off，无光晕。原生Grove侧嵌件的导光材料与耦合属于已标明的外观推导，灯不随连接/供电/距离自动联动，IR窗保持不发可见光。

总入口别名 `UwbUnit` / `UwbUnitModule`、`TmosPirUnit` / `TmosPirUnitModule`、`MiniTof90Unit` / `MiniTof90UnitModule`，loader ID为三款slug。`unitFrame` / `cable`沿现有Grove接口接受外驱姿态/线形；嵌套时以前级实际port ID作路径前缀，外驱不回送输入。`artwork:false`保留本款全部物理attributes/index及最顶层更新后的世界矩阵；印刷不代替PCB、光窗、胶贴基底或插口背衬。RF/AT/定位/测距、人体存在/温度、I2C、电气与固件由其他框架实现。必要专项 `node scripts/check-ranging-presence-units.mjs`，综合范围以[本批进度](../../artifacts/ranging-presence-expansion/progress.json)为准，没有新增逐面浏览器、全量历史或实物验收。私表、私有链接/原稿名、矢量、官图CAD原件、生成器和中间件留仓库外，仅公开最终普通PNG及安全配准/来源。

## 此前：RS485-ISO / AIN4-20mA / AC Measure

前批新增 `rs485-iso`（U094）、`ain4-20ma`（U162）、`ac-measure`（U164），同步6张PNG：前两款各2张 `reference-redraw`，AC Measure正背2张 `source-vector-raster`。三款均导出 `Model` / `GroveModule` / `TerminalPlug` / `spec`，提供真实四芯 `grove` 与本款固定端子。该批完成时本地112款（14主机、98Unit），全部 `modeled`、`verified` 为0；该批保存时公开Git为85款 `ad5d062`，当时随后二十七款尚未推送；当前同步以本文顶部记录为准。完整API、配置、来源和三分支四芯例见[RS485-ISO/AIN4-20mA/AC Measure](../ISOLATED-INTERFACE-UNITS.md)。

RS485-ISO严格本款U094隔离本体，`terminal` 为 `vh3.96-4p`；`terminalPlug:true`装随附四螺钉插头。`terminator:true`须同时装插头，120Ω电阻及引线位于同一插头B/A入口并随其拆装，不增加假插口。`power-led`默认off，只接受独立外驱开关/亮度；固定白色是预览估计，`meta.colorConfirmed:false`，不是官方确认灯色或RGB规格，不随UART/端子/电源联动。

AIN4-20mA是单通道U162，保留STM32G030/HCNR200/SGM321、真实六针P2/P3及五个可拆帽位；`terminal` 为 `ht3.96-4p`。`jumpers`接受默认 `'three-horizontal'`、`'two-vertical'` 或 `false`；每个 `Shunt`独立装拆，五口为 `pin-header-2.54-2p`，`port.meta.physicalPins` / `port.physicalPins`记录占针，冲突在修改附件前拒绝。只防止两帽占同一实体针，不执行供电选择。帽位经真实开口外露，`covers:false`只作开盖检查；无sensor/LED/button/本体joint。

AC Measure U164保留本款STM32G030/HLW8032/B0505ST16-W5/EL357、PCB与 `ht3.96-4p`固定座，前视L2/N2/L1/N1只记录实体标记，不是接线建议。无sensor/LED/button/本体joint。AC正背原稿恢复保留原色，仅修正转换造成的 `evenodd`→`nonzero`字腔填充，标 `source-vector-raster`，包装贴纸排除；另两款按自身官图代码重绘，不裁照片、不编不可辨字、不借贴纸遮缺件。

三款插头均有 `terminal/screw-1`…`screw-4`，只外驱可见头角 `angleDeg` / `durationMs`、拒非零RPM，不代表轴向压线/扭矩/电气。总入口别名 `Rs485IsoUnit` / `Rs485IsoUnitModule` / `Rs485IsoTerminalPlug`、`Ain420maUnit` / `Ain420maUnitModule` / `Ain420maTerminalPlug` / `Ain420maShunt`、`AcMeasureUnit` / `AcMeasureUnitModule` / `AcMeasureTerminalPlug`；loader ID为三款slug。实例 `artwork:false`保留对应盖/插头/电阻/跳帽配置的全部物理attributes/index和世界矩阵。内部UART/RS485、供电、ADC、数值、隔离、协议及电气由外部框架实现。必要专项 `node scripts/check-isolated-interface-units.mjs`；综合范围以[本批进度](../../artifacts/isolated-interface-expansion/progress.json)为准，不新增逐面浏览器、全量历史或实物验收结论。私表、私有链接/原稿名、矢量、官图CAD原件、生成器与中间件只留仓库外，公开最终普通PNG及安全来源说明。

## 此前：BLDC Driver / RCA / Puzzle

前批新增 `bldc-driver`（U181）、`rca`（U155）、`puzzle`（U193），同步6张本款官图代码重绘 `reference-redraw` PNG。三款均导出 `Model` / `GroveModule` / `spec`，提供实际四芯 `grove`；均为输出/连接装配，没有虚构的 `sensor`。该批完成时本地109款（14主机、95Unit），全部 `modeled`、`verified` 为0；公开Git仍85款 `ad5d062`，随后二十四款本地增量未自动再次推送。完整API、配置、来源与三分支/级联例见[BLDC Driver/RCA/Puzzle](../BLDC-RCA-PUZZLE-UNITS.md)。

BLDC Driver严格本款STM32G030/DRV11873与U/V/W/COM固定4P座；`terminal` 为 `ht3.96-4p`，默认裸座，`terminalPlug:true` 装随附 `TerminalPlug`。附件有四个 `screw-1`…`screw-4`，仅外驱头角/时长、拒非零RPM。无随附电机/转子/按钮/旋钮，隐藏SYS_LED无确证光路则不注册穿壳灯。固定座、PCB/封装、Grove和真实背衬齐备，不执行PWM、转速、方向、保护或电气。

RCA保留真实单母插孔的金属筒/绝缘环/中心触点/开放腔，`rca` Port拒Grove；没有随附RCA插头/线。`channel` 是壳内单枚SW-SPDT双通道稳定滑钮，默认闭壳禁pointer，`covers:false`开盖才可看/操作，贴层随真实盖隐藏，固定I1/I2不随滑块移动。0/1只表示外观档位，外驱不回声，取消不click，不切换音视频或模拟电路。壳24×32×8与含座24×36.4×14.7分记，官网表8mm不能替代总厚尺寸图；无LED/joint/sensor。

Puzzle为24×24×15的真实64颗WS2812E-1313和原生8×8隔光栅格。`pixel-0`…`pixel-63` 是正视行优先外观布局索引，不宣称厂家串行线序；默认全off，可逐灯外驱。`matrix` 接 `{type:'matrix',colors:[64色],brightness:0…1}` 或 `{type:'matrix',rgba:[256字节],brightness:0…1}`，alpha仅乘外观亮度，整帧先验证后更新。主输入 `grove` 对应J2，输出 `out` 对应J1，可接第二真实GroveModule，继续渲染四芯线与下级形状；上游帧不自动转发下游像素/电源/协议。不造MCU、按键、显示屏、自动动画或电气行为。随附桥接件独立导出 `Bridge` / 总入口 `PuzzleBridge`，仅外形/实体PCB插座/背标，无装配Port或命令，刚性成品配合缺基准，不能视为已核准装配。

总入口模型别名 `BldcDriverUnit` / `BldcDriverUnitModule` / `BldcDriverTerminalPlug`、`RcaUnit` / `RcaUnitModule`、`PuzzleUnit` / `PuzzleUnitModule` / `PuzzleBridge`；按需loader ID为三款slug。各实例 `artwork:false` 保持当前插头/闭壳/开盖配置的全部物理attributes/index和世界矩阵。三款私表无精确原稿，重绘不裁照片/不编不可读小字/不遮缺件；私表、私有链接/原稿名、矢量、官图CAD原件、生成器和中间件只在仓库外。必要专项 `node scripts/check-bldc-rca-puzzle-units.mjs`，综合范围见[本批进度](../../artifacts/bldc-rca-puzzle-expansion/progress.json)，不增加逐面浏览器、全量历史或实物验收结论。

## 此前：Thermal2 / FlashLight / GPS SMA

前批新增 `thermal2`（U149）、`flashlight`（U152）、`gps-sma`（U190），同步7张本款官图代码重绘 `reference-redraw` PNG。三款均导出 `Model` / `GroveModule` / `spec`，提供真实四芯 `grove`；Thermal2/GPS SMA另有被动 `sensor`，FlashLight仅实际 `mode` / `light` 输出组件，没有传感器锚点。该批完成时本地106款（14主机、92Unit），全部 `modeled`、`verified` 为0；公开Git仍85款 `ad5d062`，后续二十一款本地增量未自动再次推送。完整API、配置、来源和三分支四芯例见[Thermal2/FlashLight/GPS SMA](../THERMAL2-FLASHLIGHT-GPS-UNITS.md)。

Thermal2严格使用本款黑色下凹MLX90640采集头、ESP32-PICO-D4、实际PCB/蜂鸣器和两原壳舌，`button` / `reset` 压放/取消后原顶点精确回位；`rgb` 只独立外驱。没有显示、内生热成像、测温、报警、声音或MCU复位逻辑。相同外壳来源不表示可套NCIR2器件/贴纸。

FlashLight的 `light` 是固定白光外驱灯，接受 `on` / `brightness`，拒绝重设RGB颜色；内部 `mode` 是两档稳定Button，默认闭壳不接pointer，`covers:false`开盖配置才可看/操作，仍保留真实壳数据与固定PCB丝印。`setPosition(0|1)` 或 `type:'button',action:'position'`只改变实体档位且不回送输入，不生成Flash/Torch脉冲、功率、电气或热行为。正文/原理图/背贴5000…5700K与规格表6000…6500K存在冲突，固定预览色不是校准色温，详见单品来源/反馈。

GPS SMA的 `sma` 接真实可拆 `Antenna`，默认 `antenna:false`，`antenna:true`装入完整有源带线puck；不是LoRa胶棒，不造铰链。`sma/shape` 接毫米局部中心线points，更新同轴与末端puck，保持固定SMA/Grove和本体；点集限制/名义1m与当前曲线长见专门指南和组件状态。壳24×64×8与含SMA24×71.4×8分别记录。蓝1PPS未证实外露光路，不注册外露LED，不生成GNSS/RF/定位/NMEA或线缆物理行为。

总入口别名 `Thermal2Unit` / `Thermal2UnitModule`、`FlashlightUnit` / `FlashlightUnitModule`、`GpsSmaUnit` / `GpsSmaUnitModule` / `GpsSmaAntenna`；按需loader ID为三款slug。各模型/模块分别传 `artwork:false`，保留对应闭壳/开盖/天线配置的全部物理attributes/index和世界矩阵。本批私表无精确原稿，重绘不是照片裁片，字体/颜色/注册与不可辨小字限制按单品来源保留。私表、私有链接/原稿名、矢量、官图/CAD原件、生成器和中间件仅留仓库外。必要专项 `node scripts/check-thermal2-flashlight-gps-units.mjs`，综合结果见[本批进度](../../artifacts/thermal2-flashlight-gps-expansion/progress.json)，不增加逐面浏览器、全量历史或实物验收结论。

## 此前：DCSSR / NCIR2 / Reflective IR

前批新增 `dcssr`（U140）、`ncir2`（U150）、`reflective-ir`（U175），同步6张 `reference-redraw` PNG。三款均提供 `Model` / `GroveModule` / `spec`、四芯 `grove` 和被动 `sensor`。该批完成时本地103款（14主机、89Unit），全部保持 `modeled`、`verified` 为0；公开Git基线仍为85款 `ad5d062`，随后十八款本地增量尚未再次推送。完整接口、配置和三分支四芯示例见[DCSSR/NCIR2/Reflective IR](../DCSSR-NCIR2-REFLECTIVE-IR-UNITS.md)。

DCSSR为完整直流SSR套件，控制板和整机包络分别记录；中央 `button`、`rgb`、`power-led`、`ssr-led` 独立，四个 `ssr-screw-1`…`ssr-screw-4` 只改变螺钉头角度。`terminal-1` / `terminal-2` 各为 `ht3.96-4p`，`terminalPlug:true` 安装两只独立 `TerminalPlug`，各含四枚 `screw-1`…`screw-4`。按钮只发输入意图，灯和头角必须由调用方驱动，不实现继电/模式/Modbus或电气。

NCIR2保留真实TO39测温头、正面原壳舌 `button`、侧面原生一体壳舌 `reset`、`rgb` 和蜂鸣器实体；复位按键只发输入意图，不执行MCU复位，不虚构显示屏或声音输出。Reflective IR保留两颗真实IR收发封装、背面 `threshold` 电位器和固定红 `status-led`（实际壳内PCB灯，无新增外窗或穿壳halo）；电位器只外驱有限角/时长并拒非零RPM，不驱动检测距离、比较器或可见IR光束。总入口别名为 `DcssrUnit` / `DcssrUnitModule` / `DcssrTerminalPlug`、`Ncir2Unit` / `Ncir2UnitModule`、`ReflectiveIrUnit` / `ReflectiveIrUnitModule`。

三款原稿在私表中均无精确匹配，按已授权本款官图代码重绘，标 `reference-redraw`，不是照片裁片；字体/颜色、不可辨小字及贴图注册限制见单品研究。每个独立模型/模块传 `artwork:false` 关闭印刷，保留对应配置的全部物理attributes/index与世界矩阵。私表、私有链接、原稿名、矢量、官图/CAD原件、生成器和中间件仅留本地。必要专项为 `node scripts/check-dcssr-ncir2-reflective-ir-units.mjs`，综合检查范围以[本批进度](../../artifacts/dcssr-ncir2-reflective-ir-expansion/progress.json)为准，没有逐面浏览器、全量历史或实物验收结论。

## 此前：Watering / HBridge v1.1 / DLight

前批新增 `watering`（U101）、`dlight`（U136）、`hbridge-v11`（U160-V11），均导出 `Model` / `GroveModule` / `spec`，提供四芯 `grove` 与被动 `sensor`。该批完成时本地100款（14款主机、86款Unit），全部保持 `modeled`、`verified` 为0；GitHub `main` 仍为85款 `ad5d062`，随后十五款本地增量未自动再次推送。完整调用、配置和三分支四芯线见[Watering/DLight/HBridge](../WATERING-LIGHT-HBRIDGE-UNITS.md)。

Watering的 `inlet` / `outlet` 是两只真实 `silicone-tube-4mm` 机械口，拒绝Grove。产品 `Hose` 的总入口别名为 `WateringHose`；默认构造不装管，`hoses:true` 装入双管，配置菜单先列 `supplied-hoses` 再列裸本体。嵌套 `inlet/shape` / `outlet/shape` 接受 `{type:'shape',points:[[0,0,0],…]}`，点的单位为mm，管口局部首段沿+Y且至少6mm，起点必须 `[0,0,0]`；总计3…16个有限点，每轴范围±500mm，相邻点至少相距1mm。管道仅改变外观形状，没有水流、压力、泵驱动、液位或土壤数值。整机没有确证外露LED、按钮或可见转子，内部电机不注册虚构旋转关节。

DLight严格对应U136 BH1750FVI-TR，原壳24×32×8 mm，真实2.9×5.7 mm光学开窗后方有独立透明封装、被动暗色感测die和白PCB背衬。只有 `grove` 和被动 `sensor`，没有灯、按钮、关节、光束、lux/ADC/光学或I2C行为；P1/P2仅为隐藏未装配制造焊盘，不造用户插口。

HBridge的 `source`、`address-1`…`address-4` 是PCB上的五枚稳定 `Button`，实际位于壳内；默认闭壳，控件不接受画布pointer。`covers:false` 是开盖检查配置，可看/操作这些真实滑块；不是在闭壳表面新增开关。外驱 `position` 只移动实体，不执行电源选择、电压或地址运算。`terminal` 类型为 `ht3.96-4p`；产品入口另导出 `TerminalPlug`，模型以 `terminalPlug:true` 安装，并提供四个独立 `screw-1`…`screw-4` 外驱螺钉。`capacitor:true` 必须同时 `terminalPlug:true`，电容跨同一插头的前两槽，不新增插口，也不执行电机/供电行为。配置菜单保留闭壳三种附件组合和开盖检查配置，无LED API。

总入口模型别名为 `WateringUnit` / `WateringUnitModule`、`DlightUnit` / `DlightUnitModule`、`HbridgeV11Unit` / `HbridgeV11UnitModule`；附件别名为 `WateringHose` / `HbridgeV11TerminalPlug`。按需加载ID为 `watering`、`dlight`、`hbridge-v11`。

本批同步5张PNG：Watering机背1张 `source-vector-raster` 为精确原稿轮廓恢复，电机铭牌1张 `reference-redraw`；DLight背贴1张、HBridge正背2张同为 `reference-redraw`。源恢复不宣称未经修改的原稿直接导出。每个模型/模块分别传 `artwork:false`，在对应软管、端子、电容和盖配置下保留完整物理attributes/index与 `matrixWorld`。私表、私有链接、原稿名、矢量、原始官图/CAD、生成器与中间件不分发。必要专项入口为 `node scripts/check-watering-light-hbridge-units.mjs`；这里只登记入口，构建、接线、在线资源与隐私结果以本批进度报告为准，不预先声称综合通过，不新增逐面浏览器、全量历史或实物验收结论。

## 此前：Tube Pressure / MQ / LoRaE220-920

前批新增 `tube-pressure`（U130）、`mq`（U199）、`lora-e220-920`（U170），均导出 `Model` / `GroveModule` / `spec`，提供四芯 `grove` 和被动 `sensor`。该批完成时本地97款（14款主机、83款Unit），全部保持 `modeled`、`verified` 为0；GitHub `main` 仍是 `ad5d062` 的85款快照，随后十二款本地增量未自动再次推送。完整调用、配置菜单与三分支四芯线见[Tube Pressure/MQ/LoRa](../RADIO-GAS-PRESSURE-UNITS.md)。

Tube Pressure的 `tube` 是前向单气嘴机械口 `tube-3mm`，无电气pin，拒绝Grove。真实Ø3mm气嘴、贯通管腔与独立感测背衬保留；原壳24×32×8 mm与含气嘴24×32×12.5 mm分别记录，没有第二气嘴、灯、按钮或旋转关节，不运行压力、气流、导管网络或电压逻辑。

MQ默认装入真实圆脚MQ-5感测封装，`mq5Cartridge:false`仅拆下圆罐，固定六孔座和内部适配板保留。`mq5`类型为 `mq5-six-pin`，产品入口导出 `MQ5Cartridge`，总入口别名 `Mq5Cartridge`；可经 `port('mq5').detach({dispose:false})` 和 `.attach(cartridge)`独立拆装。名义/原CAD24×64×25 mm保留厂家壳体口径；默认含圆罐实际包络约24×80.31×25 mm，拆罐后约24×64.4×25 mm，属于安装/照片推导，不能把厂家64mm标注套到含罐整机或缩壳凑数。无确证外露LED；隐藏D1封装不提供灯API，不执行加热、气敏电阻、ADC、报警或电气逻辑。

LoRa严格对应U170 E220-900T22S/920版。`mode-0` / `mode-1`为两枚稳定DIP：`press`切换、`release`保留档位，`cancel`结束本来源输入而不发送click；外部 `{type:'button', target:'mode-0', action:'position', position:1}`设置档位不回送输入。档位不改变串口、M0/M1电气网络或RF状态。`sma`是 `sma-female`；产品 `Antenna` 的总入口别名为 `LoraE220920Antenna`，`Antenna.meta.physicalConnector === 'sma-male'`记录真实公针，`meta.connector === 'sma-female'`表示可接入的主端口类型。默认 `antenna:false`显示本体，`antenna:true`装入随附110mm天线，`antennaAngleDeg`指定初始角。嵌套 `sma/tilt`接受 `angleDeg` / `durationMs`，范围0…90°，拒绝越界角和非零RPM；形状插值不产生RF、扫描或制造限位保证。本体名义24×71.4×8 mm包含SMA，不包含天线。配置菜单的首项为带天线、次项裸本体；MQ另列正常安装/拆罐配置，菜单默认展示与构造器默认选项分别记录。

本批同步8张PNG：Tube背贴1张 `reference-redraw`；MQ精确背标1张 `source-vector-raster`，标题、空白识别贴与MQ-5银圈印字3张 `reference-redraw`；LoRa正背与固定DIP的ON/1/2字样3张 `reference-redraw`。固定DIP字样不随滑块移动，MQ银圈字样属于可拆圆罐。各模型/模块分别传 `artwork:false`，关闭印刷保留各配置的完整实体attributes/index及物理世界姿态。私表、私有链接、原稿名、矢量、原始官图/CAD、生成器与中间件不分发。必要专项入口为 `node scripts/check-radio-gas-pressure-units.mjs`；这里只登记入口，两构建、接线、在线资源与隐私结果以本批进度报告为准，不预先声称综合通过，不新增逐面浏览器、全量历史或实物验收结论。

## 此前：ADC v1.1 / AMeter / VMeter

前批新增 `adc-v11`（U013-V11）、`ameter`（U086）、`vmeter`（U087），均导出 `Model` / `GroveModule` / `TerminalPlug` / `spec`，提供 `grove`、`terminal` 和被动 `sensor`。该批完成时本地94款（14款主机、80款Unit），全部保持 `modeled`、`verified` 为0；GitHub `main` 仍是 `ad5d062` 的85款快照，随后九款本地增量未自动再次推送。完整调用、三分支四芯线与附件边界见[ADC/AMeter/VMeter](../ADC-METER-UNITS.md)。

ADC v1.1 的 `terminal` 是 `ht3.96-2p`，随附插头提供 `screw-1`…`screw-2`；AMeter与VMeter的 `terminal` 是 `ht3.96-4p`，随附插头各提供 `screw-1`…`screw-4`。三款均以 `terminalPlug:true` 安装，或通过 `port('terminal').attach(new TerminalPlug())` 独立装入/拆下。总入口别名分别为 `AdcV11TerminalPlug`、`AmeterTerminalPlug`、`VmeterTerminalPlug`。`terminal/screw-N` 接受 `angleDeg` / `durationMs`，只转对应螺钉头，非零RPM被拒绝；无轴向紧固、压线、扭矩或电气连接行为。端子机械类型拒绝Grove。

AMeter的 `power` 与VMeter的 `power-led` 各自默认关闭、接受外部亮度，不与Grove、螺钉或测量值自动联动。当前官方资料未确认发光色，固定预览色仅是外观估计；元数据保留 `colorConfirmed:false`，不能当成官方白灯规格或RGB能力。ADC v1.1没有灯、按钮或旋钮。三款 `sensor` 都是被动视觉锚点，不运行ADC采样、电流/电压、寄存器、校准、隔离、熔断、保护或固件逻辑。两款电表的名义壳体24×56×8 mm与含固定端子的24×56×10.2 mm视觉包络分别记录；ADC v1.1为24×32×10.2 mm，不缩掉真实端子来凑壳厚。

本批三款各2张PNG，共6张，全部按自身型号官图代码重绘并标记 `reference-redraw`，不裁产品照片。每个独立模型或Grove模块分别传 `artwork:false`；原壳、孔、PCB、触点、插头、螺钉及物理世界姿态保持。私表、私有下载链接、原稿名、矢量、原始官图、生成器与中间件不分发。必要专项入口为 `node scripts/check-adc-meter-units.mjs`；这里只登记入口，构建、接线与在线资源结果以本批进度报告为准，不预先声称综合验证通过，也不新增逐面浏览器、全量历史或实物验收结论。

前批 `timerpwr`（U189）、`extencoder`（U161）、`nfc`（U216）均提供 `Model` / `GroveModule`、`grove` 及被动 `sensor`。该批完成时为本地91款（14款主机、77款Unit），对应当时的六款Git同步后增量；调用、四芯线、附件和来源边界见[TimerPWR/ExtEncoder/NFC](../TIMER-ENCODER-NFC-UNITS.md)。

TimerPWR的 `lcd` 是64×48白单色OLED，接受外部RGBA framebuffer后按亮度显示，不自动画计时器或电池状态。`button-a` / `button-b`沿真实原生侧弹舌压下/弹起，`press` / `release` / `cancel` 按各自来源处理；`power-led`为独立固定红灯，屏幕、按键与灯不自动联动。`usb`是 `usb-c-charge-only`，`battery`是 `mx1.25-2p`，仅提供机械配对与视觉元数据，不运行充电/供电状态机。

ExtEncoder的 `encoder` 为 `vh2.54-5p` 五芯机械接口；本体没有旋钮、按钮、LED或转子。`terminalPlug:true`安装随附插头；产品入口导出 `TerminalPlug`，总入口别名为 `ExtEncoderTerminalPlug`。`encoder/screw-1`…`screw-5`分别接受 `angleDeg` / `durationMs`，只转真实螺钉头、拒绝非零RPM；不产生ABZ、计数、压线、电压或轴向紧固。NFC严格对应U216 ST25R3916，只有 `grove` 与被动 `sensor`，没有扫描、标签、读写、卡模拟、RF场或灯/按钮命令；隐藏天线布线与安装为已标明的外观推导。

本批同步8张PNG：TimerPWR4张、ExtEncoder2张标记 `reference-redraw`；NFC正背2张标记 `source-vector-raster`，恢复转换器复合字形填充规则后保留原轮廓与填色，不宣称原稿未经修改直接导出。各模型/模块分别传 `artwork:false`；私表、下载链接、原稿名、矢量、生成器和中间件不分发。必要专项入口为 `node scripts/check-timer-encoder-nfc-units.mjs`；这里只登记入口，构建、接线与在线资源结果以本批进度报告为准，不新增逐面浏览器、全量历史或实物验收结论。

本地后续新增 `dac2`（U012-B）、`dds`（U105）、`kmeter-iso-v11`（U133-V11），均提供 `Model` / `GroveModule`、`grove` 及被动 `sensor`，没有新增可见LED或按钮。三款接口、可拆附件、四芯线和外部职责见[DAC2/DDS/KMeter](../DAC-DDS-KMETER-UNITS.md)；这批属于 `ad5d062` 的85款Git同步之后的本地增量。

DAC2的 `terminal` 为 `ht3.96-4p`，`terminalPlug:true` 安装随附插头；产品入口的 `TerminalPlug` 全局别名为 `Dac2TerminalPlug`。`terminal/screw-1`…`screw-4` 独立接受 `angleDeg` / `durationMs`，只转螺钉头，拒绝非零RPM；固定座、PCB、其他螺钉和Grove线保持。A0/A1/A2保留真实固定焊盘/跳线，不生成外露DIP开关。模型不处理DAC值、电压、电流或短路保护。

DDS的 `sma` 机械类型为 `sma-female`；模型轴总包络24×71.4×8 mm包含SMA，原壳24×64×8 mm单独保留。壳上波形曲线属于固定印刷，不是外驱信号波形。KMeter的 `thermocouple` 机械类型为 `thermocouple-k-mini-flat`，保留真实K型扁槽与触点；没有猜测尺寸的热电偶 `Probe` 模块或温度/冷端补偿命令。两口都拒绝Grove，接口类型只约束机械配对。

本批同步7张PNG：DAC2正背2张为 `source-vector-raster`，原稿复合字形的填充规则从 `evenodd` 恢复为 `nonzero`；DDS正背2张为同型号官图 `reference-redraw`；KMeter正背2张为对应v1.1原稿栅格，前图导出透明度为0的圆环依对应预览恢复为半透明，K座印字另有1张 `reference-redraw`。这些恢复不宣称未经修改的原稿导出。每个模型/模块单独传 `artwork:false`，固定物理实体保持；私有表、源链接、矢量及生成中间件不分发。专项入口为 `node scripts/check-dac-dds-kmeter-units.mjs`，运行结果以对应报告为准，不新增逐面浏览器或实物验收结论。


`laser-tx`（U066）提供独立固定红色 `emitter`，默认关闭，只表现自身650nm印字对应的发射孔/透镜外观；`laser-rx`（U065）仅有 `grove` 和被动 `sensor`，深色接收头不注册为灯。两款没有按钮、关节、光束、光斑、通信或TX/RX状态联动。`midi`（U187）提供稳定 `mode`（0=左Bypass，1=右Separate）、独立固定绿 `power-led`（默认关闭）、`grove` 与被动 `sensor`。型号、命令、三分支四芯线和边界见[Laser/MIDI](../LASER-MIDI-UNITS.md)。

MIDI 的 `midi-in-din` / `midi-out-din` 使用 `din-5pin-female`；`midi-in-trs` / `midi-out-trs` / `audio` 共享 `audio-3.5mm-trs` 机械配对类型，各自 `meta` 保留输入、输出和音频用途。机械配对不证明引脚、电平、光学或MIDI/音频电气兼容，改档不路由信号或产生声音。模型轴40×48×25 mm，厂商尺寸顺序48×40×25 mm。

三款同步6张正背 `reference-redraw` PNG，按同型号官方图代码重绘，未裁产品照片。原稿来源缺口和不可辨细字保留在单品记录中；原表、私有链接、矢量、生成器及中间件不分发。每个独立模型或模块分别传 `artwork:false`；接线仅表示机械装配/层级寻址，不建立TX/RX光学链路或HUB协议转换。

`earth`（U019）的 `trim` 是仅定位的真实调节头关节，无灯或按钮；`hall`（U084）只有 `grove` 和被动 `sensor`，D1 保留隐藏红色封装，没有无依据的可见 LED API。`qrcode`（U173）提供瞬时 `button`、稳定 `mode`、独立固定白光 `illumination` 与红光 `aiming`；默认 `{refractor:true}` 装固定折射头，`{refractor:false}` 显示直视扫描头，独立和 Grove 模块均可选择。具体命令、四芯线层级寻址及职责见[Earth/Hall/QRCode](../EARTH-HALL-QRCODE-UNITS.md)。

三款同步7张PNG：Earth默认英文与显式 `stickerVariant:'education-cn'` 中文版共2张，均为 `source-vector-raster`（原稿轮廓/填色及可见层依对应预览和标准官图恢复，并非未修改原稿）；Hall两面为 `reference-redraw`；QRCode三个机身面为精确原稿 `official-raster`，不使用包装图。模型不实现湿度、阈值、磁场、扫码、电气或固件行为；各实例分别传 `artwork:false` 可关闭本批贴层。

`step16`（U198）提供真实16定位旋钮、八个独立暖黄显示段与独立RGB；`asr`（U194）提供固定喇叭/模拟麦克风，`uhf-rfid`（U107）提供实体陶瓷天线/板堆。三款同时带五张贴纸，UHF背贴使用所提供准确原稿栅格，其他面按官图重绘；API、机械分支示例、来源类型和各模块分别传 `artwork:false` 的方式见[Step16/ASR/UHF](../STEP-ASR-UHF-UNITS.md)。

`mini-imu`（U095）提供完整MPU6886实体与纯视觉锚点，`extio2`（U011-B）提供真实10针弯针接口，`acssr`（U139）提供SSR/控制板套件、原生按键、三路独立外驱灯及两只可拆4P端子。三款同时带对应贴纸，姿态、输入/外驱状态和接线例子见[IMU/扩展IO/ACSSR](../IMU-EXTIO-ACSSR-UNITS.md)。

此前补贴纸批的30款Unit已同步补对应印刷，精确原稿优先，缺源才按官方照片重绘；统一开关、Grove配置和来源/局部检查范围见[新增Unit贴纸](../UNIT-STICKER-ADDITIONS.md)。

`poesp32`（U138）补双板/PoE/RJ45八触点，`cams3-5mp`（U174-B）补PY260固定镜头/卡槽/两组1×3母座，`synth`（U178）补内置喇叭与格栅后实体。真实插座类型、三枚独立固定色灯及三分支接线见[网络/摄像/合成Unit](../NETWORK-CAMERA-SYNTH-UNITS.md)。新增同时补对应贴纸，源表与矢量仅本地保留。

`rtc`（U126）保留封闭电池/时钟器件外观，`fingerprint2`（U203）有真实电容采集面和独立灯环，`audioplayer`（U197）有真实卡槽/音频座和独立BUSY灯。三款只提供外观/锚点，接线与灯光寻址见[RTC/指纹/音频Unit](../RTC-FINGERPRINT-AUDIO-UNITS.md)。

`rollercan` / `rollercan-lite` 和 `vibrator` 均通过 `rotor` 外驱真实旋转件。标准版的 `grove-top` 带动下级Unit与四芯线，Lite无顶部Grove；两款底部OLED和真实弹舌保持固定。组件路径、外部画面与转速示例见[旋转Unit](../ROTATING-UNITS.md)。

`can`（U085）支持可拆4P端子、四个螺钉头和固定白色指示灯；`env-pro`（U169/BME688）与 `tof4m`（U172/VL53L1X）提供完整通风/光学实体与纯视觉锚点。独立模型、三分支Grove接线和职责见[CAN与环境/测距Unit](../CAN-ENV-TOF-UNITS.md)。

`2relay` / `4relay` 支持随附4P端子独立装卸，插头内各有四个外驱螺钉；`dmx` 有稳定终端滑块、XLR释放片与固定红灯。Relay指示灯保持实际蓝/绿色，均不自动联动电气。配置、组件地址和职责见[Relay与DMX](../RELAY-DMX-UNITS.md)。

`joystick2` 有 `tilt-x` / `tilt-y`、瞬时 `press` 和 `rgb`；`byteswitch` 有八枚保持档位的钮子杆，`bytebutton` 有八枚压放按钮，两款各九RGB及可继续级联的 `grove-out`。独立/多级接线、组件地址和输入边界见[可动输入Unit](../INTERACTIVE-INPUT-UNITS.md)。

本库负责毫米尺度的外观、键帽行程、视觉关节、线缆和输入意图。下游负责固件、电气、总线、传感器值、设备状态及舵机/电机物理模型。默认模型静止；设置 `rpm` 只要求渲染器旋转，不表示给硬件通电。

`oled`（U119）与 `lcd`（U120）支持独立和 Grove 模块中的 `lcd` framebuffer，多屏可经 HUB 分别寻址。立式分辨率为 64×128 / 135×240，屏幕选择与 Unit 姿态不覆盖其他画面。`co2`（U103）提供完整实体与传感器视觉锚点；接入示例和职责见[显示 Unit](../DISPLAY-UNITS.md)。

`pahub-v21`、`pbhub-v11` 各有输入 `grove` 和输出 `grove-0`…`grove-5`，六个输出均可挂接下级Unit及四芯线；层级路径和独立分支装卸见[多接口接线](../MULTIPORT-UNITS.md)。`gesture`提供真实光学实体和Grove接口，不在模型内识别手势。

Weight-I2C 与8Servos可通过 `{terminalPlug:true}` 安装各自随附的四芯螺钉端子，也可对 `terminal` 手动装卸。`terminal/screw-1`…`screw-4` 是外驱头部角度，卸下插头不影响Unit或Grove线。示例、层级地址和职责见[可拆端子接入](../UNIT-TERMINALS.md)。

新增 Unit 可用 `loadModel('gps-v11' | 'weight-i2c' | '8servos')` 独立展示，也可用相同ID的 `loadGroveModule()` 挂接主机。GPS定位、称重值、HX711采样、I2C通信和舵机PWM均由外部实现；模型内的接口和封装只描述可见实体。三款当前仅做必要结构/API检查与构建，未做逐面浏览器验收。

`fader` 的 `slider` 是独立的毫米位置控件（`kind: 'slider'`）：中位0、范围−17.5～17.5 mm，向+Y为正。使用 `model.get('slider').set({positionMm: 12, durationMs: 200})`，或 `model.handle({type:'slider', target:'slider', positionMm:12})`；挂接后路径为 `grove/slider`。读取 `getState()` 的 `positionMm`、`targetPositionMm`、`rangeMm`、`transitioning`、`dragging`。外驱设置越界会抛错；直接鼠标拖动限制在实体止点，松手保持位置，取消拖动也不弹回。`start`、`position`、`end` 输入仅表示用户拖动意图，`end.cancelled` 标记失焦/卸载取消；外驱 `set()` 不回送输入。导出的 `VisualSlide` 可供其他直线控件复用，`mesh` 应按零位在组件本地坐标建模；固定轨道不放入移动 `cap`。

`8angle` 提供 `rotation-1`…`rotation-8`，每个只接受−140～140°的绝对 `angleDeg`，不接受非零rpm；这对应官方280°总转角，中位为视觉基准，不代表ADC零点。`switch` 是保持档位的滑动开关，`rgb-1`…`rgb-9` 分别设置灯光。Fader的灯为 `rgb-1`…`rgb-14`。`mini-scales` 的实体功能键为 `button`，RGB为 `rgb`；秤台保持固定，不将重量、校准或传力形变作为可视状态。这三款同样支持 `loadGroveModule()`，所有组件路径随挂接层级前缀变化。
