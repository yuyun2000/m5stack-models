# m5stack-models.js

基于 Three.js 与 [sticks3.js](https://github.com/MarsTechHAN/sticks3.js) 建模方法的 M5Stack 毫米尺度交互模型库。当前包含 **14 款主机、27 款 Unit，共 41 款模型**。目录状态全部为 `modeled`，尚未逐款完成最终精细外观验收。

模型提供外观、实体按键行程、稳定开关、旋转/倾斜关节、Grove 插头线缆与外部灯光。屏幕接收外部帧缓冲，控件输出输入意图；固件、电气、协议、传感器数值及设备物理行为由下游系统提供。

![当前新增与机械细化](artifacts/motion-refinement/overview.jpg)

[主机与新 Unit 接线](artifacts/motion-refinement/connections.jpg) · [Key 按压回位](artifacts/motion-refinement/key-press.gif) · [StackChan 组合姿态](artifacts/motion-refinement/stackchan-motion.gif)

新增 Unit Key U144 和 Unit 8Encoder U153，补齐空心键帽、盲轴孔、PCB、Grove 与独立 RGB。StackChan 校正前侧 Power 板、下端 Adapter、七线跨关节线束和真实底座 USB 腔，后部保留官方开放机构。灯光、角度和转速均由外部指定。贴纸等待原文件，隐藏件与未获机械图确认的行程明确为外观估计。

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
