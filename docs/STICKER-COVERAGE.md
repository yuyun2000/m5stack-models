# 贴纸与外壳印刷覆盖

更新日期：2026-10-26。

本表范围是新增 GPS v1.1、Weight-I2C、8Servos 之前的43款模型，这43款默认外观均至少接入一处贴纸或印刷层：14款只使用原稿栅格，3款同时使用原稿栅格与参考重绘，26款使用参考重绘。7款另保留必须显式选择的中文教育版。接入指定印刷面不表示每款的所有印刷面或整体几何验收均已完成；全部产品继续保持 `modeled`。

用户于2026-10-26要求停止耗时复核、继续其他Unit，因此本批50张参考重绘PNG保留为待复核检查点，不宣称完整check或逐面浏览器验收完成。后续新增型号的贴纸进度由各自产品记录单独说明，不并入以上历史统计。

2026-10-26 用户明确授权缺原稿处按同型号官方照片重绘高清 PNG，并标明来源。重绘层标记 `reference-redraw`，原稿栅格仍标记 `official-raster` / `official-raster-film`。可辨文字和图形重新绘制，不复制产品照片像素；字体、字距、颜色与物理配准存在照片推导误差。高像素不代表厂商矢量或电气引脚验证。

清单依据：`catalog/products.json`、下表所列公开源码，以及 `src/modeling/artwork.js`。原表行、原始下载地址、原素材文件名、矢量及私有素材索引不在本文中记录。

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
