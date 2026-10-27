# m5stack-models.js

基于 Three.js 与 [sticks3.js](https://github.com/MarsTechHAN/sticks3.js) 的 M5Stack 主机和 Unit 外观模型库，提供实体结构、真实按键输入意图、外部驱动的灯光/像素/可见运动及 Grove 装配。电气、总线、传感数值、固件和 AI 由外部运行时负责。

当前[产品目录](catalog/products.json)收录 **201 款：17 款主机、184 款 Unit**，全部为 `modeled`，`verified` 为 **0**。已有实现不代表逐款浏览器或实物验收完成。当前暂停新增型号，优先修复预览稳定性并整理建模与接入方法。

## 本地运行

需要 Node.js 22.12+。静态预览管理脚本使用 zsh、Python 3、curl 和 rg。

```sh
npm ci
npm run build
./manage.sh start
```

打开 [http://127.0.0.1:5188](http://127.0.0.1:5188)。`manage.sh` 服务已构建的 `dist/`；修改源码后重新构建并刷新页面。

```sh
./manage.sh status
./manage.sh logs
./manage.sh stop
./manage.sh help
```

开发模式使用 `npm run dev`，同样占用 5188 端口；先停止已有静态预览。

```sh
npm run check:demo
npm run check:controllers
npm run check:connections
```

`check:demo` 检查产品详情、选择失败后的恢复与缓存、DynamicsPanel 异步连接/控制生命周期和 framebuffer 路由清理。选择、连接和帧缓冲检查使用 DOM/viewer/import 或 renderer fixture，不等价于真实浏览器视觉检查或全部产品验收。构建成功也不替代浏览器或实物证据。

`check:controllers` 将当前目录中的主机和配置与显式按键专项逐项核对，检查真实实体按放、固定件及多来源取消；`check:connections` 核当前全部主机配置的 Grove 端口、实际插头配合与线管表面。两者默认只输出结果，不改写历史报告。当前动态范围与未闭合项见[已有模型动态检查](docs/plans/existing-dynamics-audit.md)。

旧 `npm run check` 仍包含 `sensor`、标准四芯路径等历史目录假设，并会写入旧报告；它尚未迁移到当前目录，不能作为201款总验收入口。产品几何/API按对应指南选择当前专项，保留旧报告为历史快照。

## 最小加载示例

在本仓库或已链接该源码包的 ESM bundler 页面中，先提供有宽高的 `#preview` 容器：

```js
import {DeviceViewer} from 'm5stack-models.js/core';
import {loadModel} from 'm5stack-models.js/loaders';

const viewer = new DeviceViewer(document.getElementById('preview'), {
  keyboard: 'focused',
});
const model = await loadModel('atoms3-lite', {artwork: true});
viewer.mount(model);
```

退出页面时依次调用 `viewer.unmount(model)`、`model.dispose()`、`viewer.dispose()`。`loadModel` 按目录中实际导出加载；各型号的键、灯、接口和屏幕能力以自身 API 为准。

## 架构入口

| 入口 | 用途 |
| --- | --- |
| [catalog/products.json](catalog/products.json) | 产品身份、版本、实现状态和入口事实 |
| [src/loaders.js](src/loaders.js) | 按需加载 Model 和 GroveModule；由[目录脚本](scripts/catalog.mjs)生成 |
| [src/core/](src/core/) | Device、Module、Component、DeviceViewer 与状态/事件接口 |
| [src/devices/](src/devices/) / [src/units/](src/units/) | 各产品实体、接口、配置和印刷 |
| [src/modeling/](src/modeling/) | 共享几何、印刷投射与 Grove 线缆装配 |
| [demo/](demo/) | 浏览器预览和外部驱动控件 |
| [docs/research/](docs/research/) | 各产品来源、推导边界和专项证据 |

## 方法与文档

- [建模与接入方法](docs/MODELING-METHODOLOGY.md)：精确型号、native 保源/照片重建、完整实体、实际运动与可点击性、验证和修订流程。
- [动态 API 与下游接入](docs/AGENT-INTEGRATION.md)、[集成边界](docs/INTEGRATION.md)、[视觉运动](docs/VISUAL-MOTION.md)、[Grove 线缆](docs/GROVE-CABLE.md)。
- [贴纸覆盖与来源边界](docs/STICKER-COVERAGE.md)、[来源清单](source-manifest.json)、[分发范围](docs/PUBLISHING.md)。
- [当前状态](docs/STATUS.md)、[增量索引](docs/LOCAL-EXPANSION.md)、[历次 README 检查点](docs/history/README-CHECKPOINTS-2026-10-27.md)。
- [2026-10-27 预览修复与201款同步记录](docs/releases/2026-10-27-preview-stability.md)。

普通 PNG 按许可分发；私有表格、矢量原稿、原始文件名/链接/映射和生成中间件留在仓库外。缺原稿时只按本款清楚官图重绘可读印刷并注明来源，不裁照片、不猜微字，不用贴图替代孔、铜环、接点或缺失实体。`artwork: false` 只去墨，物理结构和动作保留。

## 许可

本项目新增代码使用 [MIT](LICENSE)。第三方代码、CAD 衍生几何和依赖保留各自来源与许可，见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) 和 [licenses/](licenses/)。项目许可不重新授权远程照片、第三方商标或其他未包含资产。`package.json` 的 `private: true` 用于防止误发 npm。
