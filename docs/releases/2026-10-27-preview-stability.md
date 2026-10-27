# 2026-10-27：预览选择修复与仓库整理

本次范围保持201款（17主机、184 Unit），全部为 `modeled`，`verified` 为0。用户已暂停新增型号；尚未接入的下一批不属于本次提交。提交前远端基线为 `296128b6173562d51976073dfa50a5b0ec945030`；本记录随修复提交进入 `main`，确切提交以 Git 历史为准。

## 预览修复

部分产品点击后不加载，因为详情渲染直接调用可选字段 `limitations.map()`，异常又发生在选择加载的错误捕获范围之外。当前目录有31款缺少该字段，包括 Atom Matrix、NeoHEX 及若干旧款 Unit。

- 独立详情渲染对缺失/null说明、尺寸字段和来源链接进行回退，并转义文本。
- 选择流程整体捕获异常，失败时关闭加载提示并显示可重试错误。模型实际构建成功后才缓存，重试不会复用失败实例。
- 异步选择使用局部产品/配置，并阻止过期请求的错误覆盖当前选择。
- 配置名依次读取 `name`、`label`、`id`，修复 QRCode 等产品的空白下拉选项。

## 同步已有模型

第49–53批此前已完成的14款、21张普通PNG一并同步，未继续扩展范围：

| 批次 | 产品 ID |
| --- | --- |
| 49 | `pahub-v20`、`pbhub`、`timercamera` |
| 50 | `m5camera`、`esp32cam`、`rgb-led-strip-50cm` |
| 51 | `cardkb-original`、`poe-cam-w`、`lorawan-us915` |
| 52 | `lorawan-as923`、`lorawan-eu868` |
| 53 | `atom-lite`、`atom-matrix`、`atoms3-lite` |

包括 LoRaWAN US915 的独立 SMA 修订、Atom Matrix 当前 Reset 修订，以及 RGB Strip A093 所需的 demo 接线/姿态控制。旧187款目录对象保持不变。来源、API、几何和各批验证范围见[增量索引](../LOCAL-EXPANSION.md)，原始检查点按保存时点保留。

## 仓库整理

[README](../../README.md)保留运行和接入入口；累计批次记录移至[历史 README](../history/README-CHECKPOINTS-2026-10-27.md)。[动态 API 指南](../AGENT-INTEGRATION.md)保留稳定接口，批次记录另行[归档](../history/AGENT-INTEGRATION-CHECKPOINTS-2026-10-27.md)。

新增[建模方法论](../MODELING-METHODOLOGY.md)与[维护指引](../../AGENTS.md)：精确版本与来源、native保源/参数重建、完整装配、真实运动与拾取、私源隔离、分层验证、冻结交接及独立缺陷修订。公开分发普通PNG；私有表格、矢量原稿和转换资料保持在仓库之外。

## 本次验证

- 两个工作副本均通过 `npm run check:demo` 和 `npm run build`。
- 详情回归覆盖当前全部201条目录，以及31条缺少 `limitations` 的记录。
- 实际 `demo/main.js` 控制器回归覆盖31条选择、配置名回退、构建失败重试、过期错误及缓存复用；DOM、Viewer和导入边界使用fixture。
- 现有动态连接生命周期和帧缓冲路由专项通过。它们不能替代真实浏览器或实物证据。
- 现有生产预览页面的 Atom Matrix、NeoHEX、LoRaWAN EU868、Button、QRCode 选择及 QRCode 配置切换均达到 `ready`，没有浏览器错误；使用真实键盘激活与原生选择事件。宿主面板当时为零尺寸，未取得鼠标坐标操作或截图证据。
- 在线HTML、入口JS与实际构建字节相同，在线目录为201条，暂停产品未进入目录。现有服务健康，未重启。
- 14款的有效冻结与修订共171个文件SHA匹配；21张PNG仅包含必要图像块，无附带文本元数据。

本次紧凑结果见[验证记录](../../artifacts/preview-stability-2026-10-27/checks.json)。构建仍提示部分几何chunk超过500kB；这是包体提示，未阻止构建。没有重跑历史最终器、全量旧几何专项或逐款多视图验收，也未提升任何产品的验收阶段。
