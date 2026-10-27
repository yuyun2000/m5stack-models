# 建模与接入方法

本项目制作可交互的 M5Stack 外观模型：真实可见结构、输入意图、外部驱动的灯光/像素和可见运动。电气、总线、传感数值、AI、存储、固件与真实设备由下游负责。模型完成、浏览器可用、生产资源更新和实物配合是不同结论，分别留证；`modeled` 不代表 `verified`。

本流程用于新增产品和修订已有产品，不固定产品总数。目录事实以 [catalog/products.json](../catalog/products.json) 为准，安全来源记录见 [source-manifest.json](../source-manifest.json)。架构和调用细节见 [动态 API](AGENT-INTEGRATION.md)、[集成边界](INTEGRATION.md)、[视觉运动](VISUAL-MOTION.md) 与 [Grove 线缆](GROVE-CABLE.md)。

## 1. 开工前锁定身份与完成条件

先确认精确产品 ID、SKU、版本、芯片、壳色、接口和自身多视图，再检查目录是否已覆盖。名称相近、SKU 前缀相同或 CAD blob 相同，都不足以证明两个版本的电子、标签和结构完全一致。不能把有屏版本、Lite、原版与修订版互换。

模型中 1 单位为 1 mm。每款记录三类尺寸：文档名义值、机械图值、实际 CAD/模型包络。记录坐标轴、观察方向、孔距、孔中心和口面方向；背视标签必须转换到统一工程坐标。遇到资料冲突，保留各自来源和日期，不缩放壳体去消除差异，也不根据印刷推断电气兼容。

优先查官方文档、精确产品照片与官方硬件仓库；可用时查官方知识工具。来源缓存记录原公开 URL、固定 commit、Git blob、SHA-256、许可和用途。资料缺失就标明缺项；与自身照片无关的图库、同系列原壳和可选未安装器件不能补成既定事实。

开工前明确：完整默认物件包含什么、有哪些真实键/灯/接口、哪些结构需要推导、提供哪些配置、哪些证据才算完成。不要以通用模板预报不存在的能力。

## 2. 按来源选择几何路线

### 有自身 native CAD

先独立解析原始文件，检查组件、面数、法线、拓扑和装配位置。原文件可能同时包含散件与重复装配预览；预览重合接缝不是待补的第三个壳。

承诺保源时必须逐面记账：实际壳的 position、normal、index、源面编号和属性字保留；重复预览独立建立对应关系，记录刚性匹配误差及源字节差异。不能删掉唯一面、重网格、修洞或重算法线后仍宣称原面精确保留。通用 CAD 加载/切帽助手是否保留这些属性，需要先读实现。

装配优先使用有依据的刚性变换。运动时只改变本款真实活动区域；静止回弹恢复原始数组，index、源面 ID 和属性字不随动作改写。可参考 [AtomS3 Lite 的来源记录](research/atoms3-lite/sources.json)、[建模说明](research/atoms3-lite/modeling.md) 与 [本款运动实现](../src/devices/atoms3-lite/NativeButton.js)，坐标和权重不能直接搬到其他产品。

### 没有自身 native CAD

按自身尺寸图和多视图重建参数化实体，明确写成原创重建。分别记录外壳、PCB、封装、光学件、接口、支承和行程的依据；隐藏 BOM、孔径、壁厚、接点深度与配合中未确认的部分标为推导。

不能借用另一型号壳再换标签，也不能生成虚构的原生面编号或 CAD 精度声明。若关键形状仍无法确定，保留研究状态和缺项，不用通用盒子充当完成品。

## 3. 先完成实体装配

先做完整默认物件，再加印刷与连接形态。壳体、厚 PCB、背部承托、固定件、光学件与真实接口共同封闭错误空腔；安装孔、通风孔、U 槽、卡槽和运动缝继续保持真实开放。

- USB 等接口包含实际厚壁、舌、接点、深止挡、焊尾和保持；Grove 包含对应触点、键位、后壁和板级承托。
- 排母、卡槽与安装孔要有真实入口、内壁和必要深止挡。孔必须贯穿应贯穿的壳、板、载体和墨层，不能只在正面留一个圆形图案。
- 镜头、灯、IR 和窗口包含真实厚度、光学/封装层及支承；黑色平面不能替代缺失后壁或光学结构。
- 默认不放入未包含的卡、线、附件和可选器件。连接形态按产品真实机械关系增加它们。

实际实体采用正确朝向的 `FrontSide`。`DoubleSide` 不能掩盖反面、缺壁或开口网格；临时包含诊断可以使用单独的探针材质。接点、活动件、孔边和固定结构之间保留正间隙，结构接触与外观估计分别说明。

## 4. API 复用核心，能力按本款注册

[Device](../src/core/Device.js) 表示独立展示的物件，[Module](../src/core/Module.js) 表示挂接到接口的物件；[ComponentHost](../src/core/ComponentHost.js) 提供组件枚举、完整路径、状态与命令路由，[Component](../src/core/Component.js) 区分输入事件与外部命令。不要另造每款独立的事件总线。

新增产品在接入契约中明确 `Model`、`spec`、默认值和配置；有真实 Grove 连接形态时再提供 `GroveModule`。旧产品存在不同导出名，应按目录的 `entry`、`export` 和 `integration.moduleExport` 加载，不能批量重命名。目录生成器 [catalog.mjs](../scripts/catalog.mjs) 生成 loaders，不手改 [loaders.js](../src/loaders.js)。

只注册真实能力：可见 RGB 用 `Led`，IR 保留被动结构；没有屏幕不注册 `Display`，没有已实现的外部传感通道就不制造传感读数。Reset 的按压意图不执行重启或下载，按键不自动点灯。物理上存在某芯片，也不等于本库模拟了它。

下面示例使用现有 AtomS3 Lite 主机与 Button Unit；`container` 为调用方已有的网页容器，在 ESM bundler 环境运行：

```js
import {DeviceViewer} from 'm5stack-models.js/core';
import {loadModel, loadGroveModule} from 'm5stack-models.js/loaders';

const viewer = new DeviceViewer(container, {keyboard: 'focused'});
const host = await loadModel('atoms3-lite');
const unit = await loadGroveModule('button', {cableLength: 60});
host.port('grove').attach(unit);
viewer.mount(host);
const off = host.on('input', event => console.log(event.id, event.action));
// 子键输入路径为 grove/press。

// 分别用于手势开始与取消回调；相同来源必须成对清理。
const beginPreview = () => unit.button('press').press('external-preview');
const cancelPreview = () => unit.button('press').cancel('external-preview');
// 独立的外部视觉输出，不回送为 input。
host.led('rgb').set({color: '#20a0ff', brightness: 0.4});
```

上述物件、键和灯可在 [主机入口](../src/devices/atoms3-lite/index.js)、[主机装配](../src/devices/atoms3-lite/assembly.js)、[Button Unit](../src/units/button/index.js) 中核对。调用方决定何时调用回调并向运行时转发输入。最终释放时取消自己持有的来源、调用 `off()`、`viewer.unmount(host)`、`host.dispose()` 与 `viewer.dispose()`；`unmount` 本身不销毁可复用模型。

## 5. 动态正确与网页可点击分别检查

先判定本款是刚性帽、固定根部弹性舌、杠杆、稳定滑块还是零行程触区，轴和固定区来自本款结构。不能把整壳、PCB 或所有光学件一起拖动。

`getActuationState()` 适合观察插值深度，但不是几何通过证明。对真实帽中心、内外壁及必要上段，在 rest、partial、full、取消后回零分别投射实际 `FrontSide` 射线；检查方向、截面随动、固定实体/组件 frame、全行程正间隙和精确恢复。源网格的大三角可能跨过整个内壁，只移动外表顶点会造成“外帽动、内壁不动”。

可点击还要核 [DeviceViewer](../src/core/DeviceViewer.js) 的真实拾取路径：目标网格通过 `Component.hit()` 绑定组件，组件必须具有正确交互语义，外壳、印刷层或非交互灯不能抢走预期首命中。透明拾取面只用于输入，不能当实体帽或封孔面。直接 API 按压、几何位移和网页指针操作三项分别验证。

再核多来源保持、同时操作、release/cancel、失焦、pointer capture 丢失、拆卸、真实 click timer 和最终 dispose。取消不产生 click。自建渲染器必须调用 `host.update(dt, time)` 并重绘，时间单位为秒；Viewer 已处理更新循环，终点帧仍需正确显示。

## 6. 网页适配是可选层

网页优先读取 `list(kind)`、组件 `.path`、`label`、`meta` 和真实 Port frame，不能凭型号字符串猜能力。近看提示可消费已有的运动说明，缺失时退回通用显示；不要把网页需要的提示反写成未经证实的硬件规格。

模型默认构建、公开 API 和专项不应依赖 demo DOM。产品特有网页适配要有清晰回退，集中处理，不给核心添加仅为某款界面使用的隐式规则。界面控制改动要检查真实 DOM 事件和浏览器控制台，不能用替身测试代替实际网页可用性。

原生弹舌与固定壳共用网格时，按真实活动区域筛选命中，拒绝区域仍保持实体遮挡；不要只放一个较小透明平面并检查其中心。覆盖活动面边缘、固定邻区、部分/全按、回位、旋转和销毁后的输入清理，见 [Atom 原生面点击修订](NATIVE-INPUT-PICKING-AMENDMENT-2026-10-27.md)。

## 7. 印刷与私源边界

优先使用批准的完整普通平面图片，原字节可复用时不再裁切或重绘，保持比例、注册位置和真实孔口。缺原稿时，仅从本款清楚官图重绘可辨内容，标记 `reference-redraw` 并注明公开来源和省略项；不裁照片，不猜微字、QR、MAC 或 SN。高像素重绘不是厂商矢量或引脚依据。

图案绑定真实壳、盖、帽或关节。`artwork:false` 只去墨，保留独立物理载体及所有结构、接点与动作；比较 rest/partial/full 和实际连接状态下全部 physical attributes、index 与 world matrix。

私表、原始名称/URL/映射、矢量原稿和转换生成器不进入分发树。公开只放批准普通栅格、运行时代码及安全来源说明；源图批准数、产品 PNG 文件数与实际 panel 数分别记账。检查 PNG 格式、CRC 和元数据，避免夹带原稿信息。项目新增代码的 MIT、CAD 自身许可与图文/商标权利分别保留，见 [贴纸覆盖](STICKER-COVERAGE.md)、[第三方通知](../THIRD_PARTY_NOTICES.md) 和 [分发范围](PUBLISHING.md)。

## 8. 按层验证，按改动扩大范围

| 层次 | 必要证据 | 不能据此声称 |
| --- | --- | --- |
| 来源 | 精确型号、固定来源与许可；事实/冲突/推导分别记录 | 整机已建成或有量产 CAD |
| 几何 | 有限数组、闭合有向双边、正体积、FrontSide；实孔内四壁首交、深止挡/接点、正间隙、有限包含与前背首交 | 制造公差、光学或实物配合通过 |
| 动态 | 真实帽内外/中心部分及全按、固定区、精确回零、多源与取消、真实 timer/dispose | 浏览器已经可点击或固件已执行 |
| 装配/API | 实际 Model/Module、公开导出、层级完整路径、真实线芯与两端接头、world frame/变父、peer/noecho、拆装复用与释放 | 任意电气、I2C/UART 或下游运行时兼容 |
| 网页 | 实际指针/键盘/DOM、焦点与卸载；真实渲染后的形状和遮挡 | 所有产品逐面验收或真实设备通过 |
| 构建/在线 | 正确 catalog、导出/alias/lazy loader、实际 dist 和在线资源字节 | 自动获得 verified 状态 |

专项直接导入实际产品文件；公共 helper 使用公共相对路径，import 不自动运行，CLI 有 guard，检查函数显式返回 `status: 'pass'`。不得用 source overlay、替代构造器或只检查“没有抛错”冒称已接入。

新增批次先运行受影响产品和必要共享专项；共享输入/装配改变时再扩大生命周期检查。历史 finalizer、freeze、progress 和旧成功报告不作为可重跑模板。Node 检查与构建后仍需完成相应网页操作；命令和验收边界见 [修改后验证](AGENT-INTEGRATION.md#修改后验证)。

## 9. 作者冻结与根窄接入

来源完成后统一冻结安全来源清单，再为当前真实目录捕获一次保护基线。作者只写自己的产品/研究范围，共享 core、modeling、demo、catalog、exports 和生成器由根维护者统一处理。

作者交接包括完整 runtime/research 文件 SHA、实际导出/组件顺序/能力/配置、真实 geometry 与 smoke、PNG/panel 清单，以及四份冻结内容：`catalog-fragment.json`、`provenance-fragment.json`、`guide-fragment.md`、`fixture-helper.mjs`。未知字段不能当通过；根按实际 schema 窄适配，不批量替换旧产品名或猜测通用计数键。

根依次登记冻结文件、追加本款目录/安全来源/顶层别名、安装原字节 helper，再生成 catalog/loaders，核实际导出身份与独立/组合专项。需要维护另一个工作副本时，只同步本批允许文件和新对象，各副本自己的旧对象、历史文件及文档尾部独立保护，不能整份覆盖。

公开进度用显式安全字段投影，不能直接展开配置、基线或私素材账本。冻结后停止写入；准备脚本的静态通过不是产品通过，集成后的实际检查也不能替换作者原始快照。

## 10. 缺陷采用独立修订

发现真实错误，保留原 freeze/helper/smoke 和检查点，新增 amendment 说明触发场景、精确改动、来源、受影响验证和当前状态。只跑必要当前检查，不修改历史 green receipt 来代表新实现。例子见 [US915 SMA 更正](US915-SMA-AMENDMENT-2026-10-27.md) 与 [Matrix Reset 修订记录](research/atom-matrix/reset-amendment.json)。

共享修复应保持已有公开接口；确需改变坐标或语义时给出迁移说明。可复用的方法写入本流程或相应公共文档，产品坐标、计数和暂时缺项留在单品研究与当前报告。

## 11. 核对生产资源后再发布

先确认正在访问开发服务器还是生产 `dist`。现有 [manage.sh](../manage.sh) 服务构建后的目录；改源码不等于在线资源已更新。按需执行实际 [构建脚本](../package.json)，用 `./manage.sh status` 核服务；不要把开发服务器成功误认成生产包成功。

在线检查要沿 HTML → 主入口 → 对应 lazy model chunk → 图像资产核对：目录与目标入口一致，chunk 包含本款独立 meta ID/SKU，主入口确实引用该 chunk。外置 PNG 按源 SHA 找构建资产，核模型 chunk 引用及在线原字节；小图若被 Vite 内联，解码实际 base64 与源字节比较。开发路径或旧缓存不能充当生产证明。

发布前审精确 Git 差异和 staged 文件：只包含授权产品与必要共享修复/文档，暂停或未接入的模型即使已在磁盘也不属于本次发行。保留原历史时点，当前报告写当前状态。扫描全部新增公开文件、已改文件的完整新增行及交接片段，拒绝私源名称/URL、矢量、凭据、机器本地绝对路径与其他未批准材料；普通 PNG 同样要验元数据。

提交、推送或部署按本次明确授权执行，检查实际远端和提交范围，核远端提交与服务结果；不得从构建成功推断已推送或已上线。发布授权、源码许可和图文权利分别确认，最终只报告已取得的证据与仍保留的边界。
