# Glass2 / TypeC-to-Grove / DoF10 接入

本批负责实际结构、物理接口、外部像素和真实稳定拨杆形状。内部SSD1309命令、供电分配、传感值、地址通信和电气由外部框架实现。三款为 `modeled`，必要检查记录见[本批进度](../artifacts/glass-typec-dof10-expansion/progress.json)；不代表逐面或实物验收。

| loader ID | SKU | 实际结构/API |
| --- | --- | --- |
| `glass2` | U158-B | 真实透明玻璃/FPC/PCB/盖板/安装结构；双Grove；`screen`为128×56可见像素 |
| `typec-to-grove` | U151 | 本款原壳、前向三Grove座和底部USB-C；canonical `grove`、`out-1`、`out-2`、`usb` |
| `dof10` | U230 | 本款原壳、BMI270/BMM350/SPA06-003、Grove、外露稳定`address`拨杆和被动`sensor`锚 |

三款均提供 `Model` / `GroveModule` / `spec`，主入口别名为 `Glass2Unit` / `Glass2UnitModule`、`TypecToGroveUnit` / `TypecToGroveUnitModule`、`Dof10Unit` / `Dof10UnitModule`。推荐按需loader或产品子路径，避免导入所有型号。

## Glass2：透明显示与真实安装结构

本款没有可得官方CAD，依据自身详细尺寸图、面板资料与拆盖照片独立构造，不借旧Glass的壳、按键或蜂鸣器。正文53×42×6 mm和详细图的尺寸差异分记，实际建模包络及隐藏安装推导见[本款来源](research/glass2/sources.json)。玻璃、板、FPC、真实金属螺柱/盖板与安装孔分别存在，透明效果不替代实体。

本款面板资料和官图标128×56可见浅蓝像素，实际区35.05×15.32 mm；正文/控制器128×64逻辑尺寸另记。`screen`只接收128×56可见framebuffer，不猜其余8行控制器映射。RGB按亮度阈值转成单色，RGBA还保留alpha覆盖度；alpha为0的白像素也不发光。关闭像素透出后方物体，发光由外部像素和亮度控制，不绘制不透明黑背板。前后相向的像素面共享同一buffer/texture，背视自然镜像；真实玻璃体独立存在。没有触摸、按键、LED或音频API。

`grove`为左侧连接入口，`grove-right`为右侧实际连通座的几何接口，支持独立四芯模块装拆；接口存在不代表库自动路由I2C或供电。

## TypeC-to-Grove：三插座与USB-C

完整本款24×32×8 mm原壳保留；官方32×24×10.8 mm整机厚度包含前向凸出的Grove座，不能把原壳拉伸到10.8。三个真实立式Grove座沿X排布，左`grove`对应input，中/右`out-1`和`out-2`，底部`usb`对应真实USB-C。实际PCB、腔壁、触点和USB舌片独立存在。

本体没有主动IC、按键、灯、传感器或可见运动。输出可物理连接四芯模块，不自动改变电压、电源状态、通信或总线拓扑。正文与原理图的针名争议保留来源，模型不替它判定电气。

## DoF10：真实两档地址拨杆

完整本款原壳与实际BMI270/BMM350/SPA06-003、稳压器、PCB和红Grove齐备。`address`在Grove相反的顶边实际槽中外露，只移动真实白色拨片/杆，固定开关座、壳、PCB和传感器不跟随。

4188三角的前后壳组合保留方向平衡的四邻面拼装共边：原始组合12条，运行几何在记录的坐标焊接容差下为14条；独立前后壳各自闭合。保留原三角，不把原生组合称为单一流形，也不为检查指标删面补面；新增PCB、孔壁、固定件与薄膜单独检查闭合。

`address`是稳定0/1档位，`setPosition(0|1,{immediate})`或外部`position`消息指定其可见形状。压放/取消只处理稳定拨动输入，不能按瞬时按钮假定取消后自动回0；精确恢复指定档位应调用`setPosition`。行程和隐藏安装推导不是量产机械配合证明。`sensor`为被动实体锚，状态为空；不生成惯性/磁场/气压/温度、自动姿态或I2C地址变化。

## 接入示例

```js
import {loadModel, loadGroveModule} from '../src/loaders.js';
const host = await loadModel('sticks3');
const hub = await loadGroveModule('hub');
host.port('grove').attach(hub);
const glass = await loadGroveModule('glass2');
const adapter = await loadGroveModule('typec-to-grove');
const dof = await loadGroveModule('dof10');
hub.port('grove-1').attach(glass);
hub.port('grove-2').attach(adapter);
hub.port('grove-3').attach(dof);
// Caller supplies visible128x56 pixels; the library owns no controller firmware.
glass.display('screen').fill('#ffffff');
host.handle({type:'position', target:'grove/grove-3/address',
  position:1, immediate:true});
const peer = await loadGroveModule('key');
adapter.port('out-1').attach(peer);
// Run from the caller's render loop; visual transitions use elapsed seconds.
function onFrame(deltaSeconds) { host.update(deltaSeconds); }
// Teardown: host.dispose().
```

## 印刷与检查范围

贴纸与PCB丝印仅采用本款原稿栅格或本款可读官图准确重绘，最终面数、来源种类和配准见各`research/<id>/artwork.json`。DoF10精确SKU候选需逐项排除包装/错误版本；其余两款没有匹配原稿时按本款官图重绘。印刷不遮缺失壳、PCB、触点、FPC或安装件。`artwork:false`只取消墨层，各入口/实际配置的所有物理attributes/index/世界矩阵保持。

必要专项为 `node scripts/check-glass-typec-dof10-units.mjs`，覆盖真实StickS3→HUB三分支四芯、Glass2外部像素和透明材质/双接口、适配器两输出独立装拆与USB拒错、DoF10稳定档和固定件、两入口各配置印刷物理、主机framebuffer保持。六导出、两构建和5188资源字节结果以[本批进度](../artifacts/glass-typec-dof10-expansion/progress.json)为准。未新增逐面浏览器、全量历史、制造或实物验收。

CSV、私有链接/映射/原稿名、矢量、原始官图/CAD/PDF/MCP全文、生成器与中间件留在分发树外；只分发普通PNG、派生几何和安全来源。新增代码MIT，第三方来源/标识/商标保留各自权利。
