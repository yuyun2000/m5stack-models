# m5stack-models.js

基于 Three.js 与 sticks3.js 建模方法的 M5Stack 毫米尺度交互模型库。目前包含 **14款主机、29款Unit，共43款模型**，全部保持 `modeled`，`verified` 为0，逐款精细外观验收继续进行。

![Thermal U016实体装配](artifacts/thermal-detail/public/views/thermal-iso-close.png)

本批细化 **Thermal U016**：保留官方CAD外壳，补齐110°黑色光学封装、浅漏斗、小光窗、金属header、节圆四脚、板体与开放Grove。包体完整高度与PCB位置共同校正，Grove按自身10×5.2 mm机械图和CAD入口对齐。

公开构建独立check/build/status及实际浏览器8场景、15张原生PNG通过，覆盖七视图、静态光学稳定性、三个近景及StickS3→HUB→Thermal四芯接线/姿态/拆卸。15对独立公开图与冻结原图RGB一致。凹深、装后裁短脚、板形/高度和安装yaw仍含视觉推导；有限数字采样不代表制造配合或实物光学。全部43款仍为modeled。

[Thermal验证](artifacts/thermal-detail/public/review.json) · [来源审计](artifacts/thermal-detail/public/source-audit.json) · [建模与坐标迁移](docs/THERMAL-MODEL-NOTES.md) · [Agent接入](docs/AGENT-INTEGRATION.md)

### 上一批：Angle U005

以下为已发布Angle批次的历史证据与限制。

![Angle U005实体装配](artifacts/angle-detail/public/views/angle-assembly-close.png)

上一批细化 **Angle U005**：按自身机械图校正轴心Y8与含齿帽Ø9.5；补齐蓝色固定底板、银色金属框、盲孔和轴杆，重建PCB孔柱与Grove通道避让。原CAD壳保持；旋钮接受外部绝对角度，固定件保持不动。

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

**贴纸继续等待原文件。** 隐藏PCB与封装尺寸、折腿、0.35mm行程和漫透效果仍含外观推导，左右灯的视觉地址不代表原理图LED编号。有限几何采样与浏览器渲染不证明制造配合、固件行为、正交脉冲、电气或光学性能。StackChan生产基准与隐藏交叠、Heart既有PCB边缘交叠继续记录为待解决项。

## 本地运行

需要 Node.js 22.12+。

```sh
npm ci
npm run check
npm run build
./manage.sh start
```

打开 http://127.0.0.1:5188 。使用 `./manage.sh status|logs|stop|help` 管理预览，或运行 `npm run dev` 开发。检查覆盖实体压放、关节、全部当前 Unit 的线缆装配，以及真实主机接口上的线管表面采样；通过数见生成的 `artifacts/` 报告。浏览器视觉检查与实物配合分别记录，不以构建成功替代外观验收。

## 使用与分发

`src/core/` 保留 Device / Module / Component 接口，`src/devices/` 与 `src/units/` 按产品提供实现，`demo/` 展示浏览器交互，`catalog/products.json` 记录产品与进度。产品入口可按需导入；共享入口为 `src/index.js`。

[动态 API 与下游接入](docs/AGENT-INTEGRATION.md) · [视觉运动](docs/VISUAL-MOTION.md) · [Grove 线缆](docs/GROVE-CABLE.md) · [集成边界](docs/INTEGRATION.md) · [分发范围](docs/PUBLISHING.md)

贴纸等待用户提供原文件，当前停用照片裁切贴纸。分发源码包含几何/API专项与原创展示证据，排除官方本地照片、尺寸图/PDF、原始 STL、MCP 长篇原文和私有研究历史。目录参考图由浏览器加载官方原 URL，联网可用性取决于源站；来源 URL、Git blob 与 SHA-256 见 [source-manifest.json](source-manifest.json)。前期截图保存在 `artifacts/dynamics/` 和 `artifacts/refinement/`，属于各自历史快照，不能替代本轮证据。

## 许可

本项目自有新增代码使用 **MIT**，允许复用、修改和分发，完整条款见 [LICENSE](LICENSE)。第三方代码、CAD 衍生几何与依赖继续保留来源和许可，见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) 与 `licenses/`。项目许可不重新授权远程照片、第三方商标或其他未包含资产。

`package.json` 保留 `private: true` 以防意外发布到 npm；这不限制 GitHub 源码的 MIT 许可。私有研究仓库保留原名称与历史，公开分发使用独立目录和历史。
