# 正式栅格贴纸覆盖与限制

更新日期：2026-10-26。

本批以 `catalog/products.json` 的 43 款现有模型为范围：17 款接入标准版正式栅格贴纸，7 款提供必须显式选择的中文教育版贴纸，19 款仍等待精确型号来源。这里的“接入”指素材已绑定到当前模型的指定实体面，已复核本批贴纸的浏览器显示，不代表每款产品的全部贴纸面或整体几何验收均已完成。全部产品继续保持 `modeled`，不因贴纸接入自动升为 `verified`。

清单依据：`catalog/products.json`、下表所列公开源码，以及 `src/modeling/artwork.js`。原表行、原始下载地址、原素材文件名、矢量及私有素材索引不在本文中记录。

## 17 款标准版已接入范围

省略 `stickerVariant` 或选择 `standard` 时，以下正式栅格层默认启用；`artwork: false` 可关闭本批正式栅格层。

| 型号 | SKU | 当前接入面 | 实现与边界 |
| --- | --- | --- | --- |
| StickS3 | K150 | 背面引脚/电路标；左侧机名标 | `src/devices/sticks3/StickS3.js` |
| CoreS3 | K128 | 主机上侧认证标；独立主机背面电路/屏蔽区标；DinBase 配置的右侧机名标、底侧 DC 和电源标、上侧 Port B/C 标 | `src/devices/cores3/CoreS3.js`；DinBase 的专属面仅在 `dinBase: true` 时接入，不与独立主机背标混用 |
| StopWatch | C152 | 背面电路标 | `src/devices/stopwatch/index.js` |
| Cardputer-ADV | K132-Adv | 前面四条固定键盘底板标；前机名标；StampS3A 电路覆膜；背面电路标；顶侧控制/接口标；Grove 侧面标 | `src/devices/cardputer-adv/stickers.js`；Stamp 覆膜保留独立螺丝/RGB 孔，键盘底板标不随键帽按压 |
| CardputerZero | C154 | 前面四条固定键盘底板标；前机名标；固定电源/USB 区标；独立移动电源帽印刷；背面电路标 | `src/devices/cardputer-zero/index.js`；四侧接口贴纸暂缓，见缺面表 |
| PaperMono | C153 | 背面上部电路标 | `src/devices/papermono/index.js`；下部 NFC 标未接入 |
| Core2 v1.1 | K010-V11 | 背面电路覆膜；上侧认证标 | `src/devices/core2/stickers.js`；EXT 标未接入，不能视为全部外壳贴纸完成 |
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

## 19 款仍无精确来源

以下产品的目录状态为 `awaiting-exact-source`，当前未接入本批正式栅格贴纸。不使用近似型号、不同代际、不同引脚版本或不同认证版本代替。

| 类型 | 型号 / SKU |
| --- | --- |
| 主机（3） | NanoC6 / C125；Arduino Nesso N1 / DK001；StamPLC / K141 |
| Unit（16） | Color / U009；ToF / U010；Relay / U023；Joystick v1.1 / U024-C；Button / U027；NCIR / U028；Heart Rate / U029；Encoder / U135；Mini TVOC/eCO2 / U088；RS485 / U034；Buzzer / U132；Unit Limit / U145；CardKB v1.1 / U035-B；Unit Key / U144；Unit 8Encoder / U153；Unit Roller485 / U182 |

精确型号来源缺失只描述本批正式贴纸状态；不代表这些模型没有现有实体细节、旧生成标记或其他历史外观内容。

## 已知缺面和暂缓项

| 型号 | 当前缺项 | 处理边界 |
| --- | --- | --- |
| Core2 v1.1 | EXT 标尚无正式来源 | 保留缺项，不凭相近版本补字或复刻引脚标；当前仅计背标和认证标接入 |
| CardputerZero | 四侧接口贴纸尚未接入 | 现有左右侧几何/接口标识与贴纸配准存在冲突，待核对几何方向与标识后处理；不靠翻转整片图片掩盖冲突 |
| PaperMono | NFC 图文尚无正式来源 | 当前保留 NFC 实体盖，正式 NFC 图文继续等待同型号来源 |
| CoreS3 + DinBase | 后部 PCB 丝印尚无正式来源 | 保留真实后盖及结构，不把独立主机背标贴到 DinBase 外盖 |
| 上述 7 款可选教育版 Unit | 标准版正式贴纸缺精确来源；教育版原生位图较小 | 不默认启用教育版，不承诺近景细字质量与高分辨率原稿一致 |
| 上述 19 款 | 精确型号正式来源未取得 | 保留等待状态，不把“已有模型”或“构建成功”改写为贴纸完成 |

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

2026-10-26 在本地公开构建中重新查看 24 款的背面/立体视图，并补看 16 个侧面、顶面及底面，共 64 个静态视图。另保存 StackChan yaw 35° / pitch 45° 的四个视图、DinBase 电源滑块两档、CardputerZero 电源帽两档，以及真实 StickS3 → HUB → RFID2 连接，共 73 张浏览器截图。贴纸未出现加载空白或意外丢字；浏览器捕获的 warn/error 日志为空。教育版仍受上表原生像素限制，Tab5 仓底标按实际装配被电池盖遮挡。

连续覆膜的选择依据实际贴膜形状：StopWatch 背标跨壳体圆槽且保留喇叭 U 口及排母缺口；Tab5 ST7123 背标跨四个圆槽且保留六针窗口；DinBase 电源字样固定在壳上，滑块在独立开窗中移动。StickS3 左贴跨前后两块真实壳面；Core2 认证贴位于 +Y 顶面，右侧喇叭孔保持敞开。验证索引与拼图见 `artifacts/stickers/review.json`。

构造检查、有限几何采样、mock 图片加载、资源释放检查和 build 通过，只能证明对应的数字检查范围。它们不能代替真实浏览器图片解码/渲染验收，也不能证明实物制造、电气、固件、传感器或光学行为。

## 素材分发与许可

本批只分发用于模型展示的普通 PNG 栅格贴图和配准代码。用户提供的原表、原表映射、原始下载链接、矢量原稿及矢量转换中间材料均不随公开仓库、构建产物或验证附件分发。旧产品照片裁切贴纸继续停用。

独立分发构建目录时，同包携带当前 `LICENSE`、`THIRD_PARTY_NOTICES.md` 和 `licenses/`；Vite 构建自动加入这些文件。

项目自有新增代码使用 MIT，见 `LICENSE`。M5Stack 图片、产品标识、第三方商标及其他第三方素材的权利归各自权利人；代码的 MIT 许可不重新授权这些图片或标识。第三方来源与许可边界继续由 `THIRD_PARTY_NOTICES.md` 和 `licenses/` 说明。
