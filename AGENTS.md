# AGENTS.md

本文件适用于本公开仓库。遵守用户最新指令；开始修改前先读实际文件、相关产品指南和下列入口。当前维护范围为目录中已接入的产品，用户已暂停新增产品；未经后续明确授权，不接入磁盘上未发布或暂停的批次。产品总数以当前目录为准。

## 入口与结构

- [README.md](README.md)：使用入口；[建模方法](docs/MODELING-METHODOLOGY.md)：来源、几何、交互、贴纸与验证流程。
- [接入指南](docs/AGENT-INTEGRATION.md)：稳定 API 和验证入口；[本地增量索引](docs/LOCAL-EXPANSION.md)：具体产品指南。
- `src/core/`：组件、模型宿主、端口和 Viewer；`src/modeling/`：公共几何、材质、装配工具。
- `src/devices/`、`src/units/`：主机与 Unit 的实际产品实现。先复用现有模式，保持公开导出、坐标和命令兼容。
- [catalog/products.json](catalog/products.json) 是产品身份、入口、配置和阶段的权威目录；[source-manifest.json](source-manifest.json) 记录安全来源。产品自身的 `docs/research/` 记录来源、推导和证据。
- `npm run catalog` 由 [scripts/catalog.mjs](scripts/catalog.mjs) 生成 `src/loaders.js`、`public/data/catalog.json` 和 `docs/STATUS.md`；修改源目录后重新生成，勿手改生成文件。

## 建模与运行边界

1. 先锁定精确型号、SKU、版本、芯片、外壳和自身多视图，查官方来源与许可。相近名称或共享 CAD 不能证明结构、电子和印刷相同；事实、冲突、缺项和推导分别记录。
2. 单位为 mm。先完成真实默认装配：外壳、PCB、支承、固定件、厚壁接口、接点、孔壁与深止挡；填补错误空腔，保留真实孔口和运动间隙。不得用黑平面、贴纸或 `DoubleSide` 掩盖缺壁。
3. 有自身 native CAD 时按方法论保留来源与面记账；原创重建要明确标注。仅真实活动区域运动，固定件保持，取消/释放后按本款机制恢复。
4. 只注册本款真实且已实现的能力，复用 core 的组件、输入、命令和层级路径。模型表现外观、输入意图、外驱灯光/画面和视觉运动；固件、电气、总线、传感数值、AI、存储和真实设备运行由下游负责。
5. `artwork:false` 只关闭墨层，保留物理载体、结构、接点和动作。直接 API、实际几何运动、网页可点击分别验证。
6. 网页适配是可选层：读取实际组件和 metadata；可选字段缺失须有回退，不能阻止产品加载，也不能让 runtime 或产品专项依赖 demo DOM。

## 私源、许可与发布范围

- 私有 CSV、矢量原稿、原始名称/私有 URL/映射、转换器和中间材料必须留在仓库外；`.gitignore` 不能代替物理隔离。
- 公开图像仅纳入已批准的普通 PNG，并检查格式及元数据。缺原稿时按本款清楚官图准确重绘可辨内容，标记 `reference-redraw` 与公开来源；不裁产品照片、不猜微字或私有标识。
- 新增代码遵循仓库 MIT；CAD 和第三方材料保留各自许可及通知。发布授权与素材权利分别核对，见 [分发范围](docs/PUBLISHING.md) 和 [第三方通知](THIRD_PARTY_NOTICES.md)。
- 同步副本、暂存和提交仅使用本次明确授权的文件 allowlist；先核对完整差异和新增文件，逐路径操作。禁止整树覆盖、`git add .` 或 `git add -A`，暂停批次与无关文件不得混入。
- 对公开远端的提交、推送或部署以本次任务明确授权为准，不继承旧批次授权。报告实际提交与远端结果，构建成功不能代表已推送或已上线。

## 检查与证据

- 按改动运行相关产品专项和必要共享检查；共享输入、装配、生命周期改变时再扩大范围。专项检查真实导出与实例，不以替身或“没有抛错”冒称通过。
- 目录或入口修改运行 `npm run catalog`；网页修改运行 `npm run check:demo` 并检查真实 DOM/指针/键盘、取消、失焦、卸载和控制台；主机按键与Grove装配分别使用 `npm run check:controllers`、`npm run check:connections`。runtime、资源或打包修改运行 `npm run build`；Unit特有结构使用对应产品专项。旧 `npm run check` 尚含历史目录假设及旧报告写入，不作为当前全库验收入口。
- [manage.sh](manage.sh) 服务生产 `dist`。需要验证在线结果时，核对实际构建及 HTML、入口、目标 lazy chunk 和图像字节，区分开发服务、生产资源与真实设备证据。
- `modeled` 只表示已有实现；`verified` 需要目录要求的实际几何、视觉报告和多视图证据，不能由 Node 检查或 build 自动提升。
- 不重跑历史 finalizer、freeze 或 progress 脚本，不改旧成功记录来代表当前代码。缺陷保留历史证据，新增独立 amendment 并运行当前必要检查。
- 交付前检查精确 diff/staged 范围、UTF-8、私源/凭据泄漏和无关改动；报告改动、已跑验证和仍未验证的边界。详细流程以方法论为准。
