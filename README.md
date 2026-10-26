# m5stack-models.js

已修复AC Measure、AIN4-20mA、BLDC Driver可拆端子四孔下缘的缺面；端口、四螺钉外驱、标签与外包络保持。两份构建/回归和预览资源检查通过，[修复范围](docs/TERMINAL-TONGUE-CLOSURE.md)与各历史检查点分别记录。该修复保存时118款；当时本地随后6款及该修复尚未再次推送，公开Git112基线为32c95e0。当前增量以本文最新批次记录为准。

本库提供M5Stack主机与Unit的毫米尺度交互模型，支持实体按键压放、旋钮/推子/稳定开关、外驱灯光、屏幕framebuffer和Grove多级接线。本地最新增加ID、RF433R、RF433T，同步6张本款参考重绘PNG；真实芯片封装/引脚、PCB、Grove深腔/触点与胶贴基底均独立。三款本体均只有Grove，无sensor/按钮/关节/灯/显示；R/T内置PCB天线固定不发光，不造外接天线、观察窗或RF动效。身份/密钥/证书/加密/I2C与RF/ASK/数据/强度/距离/通信、电气和固件交外部框架。[本批接入](docs/ID-RF433-UNITS.md)与此前[Accel/OP90/OP180](docs/ACCEL-OP90-OP180-UNITS.md)等记录保留；全部 `modeled`，必要专项为 `node scripts/check-id-rf433-units.mjs`，综合范围以[本批进度](artifacts/id-rf433-expansion/progress.json)为准。

[本地增量批次索引](docs/LOCAL-EXPANSION.md)汇总当前工作区的模型、API与检查点，供查阅模型、API和各批检查范围。

本次Git同步源码包含 **127款：14款主机、113款Unit**；从112款基线新增15款Unit及28张对应PNG，并纳入三旧端子闭合修复。范围、必要检查和保留事项见[127款源码同步记录](docs/GIT-SYNC-127-2026-10-26.md)。此前[112款同步记录](docs/GIT-SYNC-112-2026-10-26.md)与[85款同步记录](docs/GIT-SYNC-2026-10-26.md)保留为历史快照；远端状态以GitHub main及实际推送回执为准。

本次15款增量为UWB、TMOS PIR、Mini ToF-90、Roller485 Lite、Mini CAN、INA226-10A、Mini PDM、Mini BPS v1.1、MIC、Accel、OP90、OP180、ID、RF433R、RF433T，均带对应贴纸。30批来源/API/必要检查范围见[增量索引](docs/LOCAL-EXPANSION.md)。历史progress中的未提交、未推送和本地HEAD字样只描述保存时点。

Weight-I2C 与8Servos现可选择随附的可拔插4P螺钉端子，四个螺钉角度独立外驱；默认空座、固定几何与Grove连接保留。用法见[可拆端子接入](docs/UNIT-TERMINALS.md)。

此前43款的贴纸批次保留：每款默认外观至少有一处印刷，部分面仍缺；50张参考重绘PNG尚未完成全批复核。原稿栅格、参考重绘和7款可选中文教学版的准确范围见[贴纸覆盖记录](docs/STICKER-COVERAGE.md)。

基于 Three.js 与 sticks3.js 建模方法的 M5Stack 毫米尺度交互模型库。当前本地包含 **14款主机、113款Unit，共127款模型**，全部保持 `modeled`，`verified` 为0。此前各批验收记录均对应各自源码快照。

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
