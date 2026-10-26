# NBIoT2 / NBIoT-CN / Mini Proto 接入

本批提供本款真实外观、四芯Grove连接、可拆天线与外部驱动的实际弯折形状，以及后盖服务装配。内部蜂窝/RF/AT/UART、网络、SIM内容、传感值、供电电气和固件由外部框架实现。实现阶段保持 `modeled`，实际检查范围见[本批进度](../artifacts/nbiot-mini-proto-expansion/progress.json)，不等于逐面浏览器/GPU或实物验收。

| loader ID | SKU | 实际外观 |
| --- | --- | --- |
| `nbiot2` | U111-B | SIM7028本款板/卡座、蓝Grove、普通SMA、可拆本款天线及前后标 |
| `nbiot-cn` | U112 | SIM7020C本款载体、蓝Grove、普通SMA、可拆本款天线及CN标识 |
| `mini-proto` | U064 | 自身24×32×8壳、48真贯孔洞板、Grove和实际背标 |

三款均导出 `Model` / `GroveModule` / `spec`。主入口为 `Nbiot2Unit` / `Nbiot2UnitModule`、`NbiotCnUnit` / `NbiotCnUnitModule`、`MiniProtoUnit` / `MiniProtoUnitModule`。两款蜂窝附件各自子路径导出 `Antenna`，主入口分别为 `Nbiot2Antenna` / `NbiotCnAntenna`。推荐按需loader或产品子路径。

## 两款蜂窝Unit

U111-B与U112使用各自SKU发布的完整6592面原装CAD；两个官方文件字节相同，仅证明发布的壳源相同。原生24×64×8 mm壳与官规格含SMA的71.5×24×8 mm分列（统一坐标包络为24×71.5×8 mm），摆开副本不重复放进运行装配，不拉壳凑尺寸。PCB、通信载体/模组、NanoSIM座、Grove与SMA按各自本款照片和原理来源建立，不能据相同外壳推断内部、贴纸或天线相同。隐藏板位、器件安装、连接器尺寸等推导见各自[U111-B来源](research/nbiot2/sources.json)与[U112来源](research/nbiot-cn/sources.json)。

默认 `{antenna:false,rearCover:true}`；可选安装天线，也可设置 `{rearCover:false}`移除真实后盖、相应固定件和背膜进行服务查看。U111-B的两个端口为 `grove` / `sma`，U112为 `grove` / `antenna`，保留各自实际API。内部 `sim` 是空状态被动锚，只在去后盖配置中暴露；默认不凭空附SIM卡，不注册穿盖点击、虚构外置弹出卡托或SIM内容。

上方金色安装窗保真实SMA金属安装体/卡件背衬。内部D1在原理中存在，不代表已证明外部光路；没有证据的外灯、RGB、用户按钮、显示或机身转轴不添加。模型不从接线、天线姿态或协议推断联网/电源/指示状态。

U111-B用 `port('sma')`、U112用 `port('antenna')` 接受各自 `Antenna`。本款普通SMA中心结构与RP-SMA分开，拒绝错误连接家族；相同连接家族只表达可接入的视觉接口，不声明推导尺寸具有量产互配精度。天线尺寸、可见横向轴和有限展示角按各自官图独立推导，不借Cat1/CN470或另一款天线数据，不冒充厂家机械止挡。

天线初始角由构造选项 `antennaAngleDeg` 指定，默认0°；后续用天线Module的 `get('tilt')`访问。`angleDeg` / `durationMs`只外驱可见弯折结构，机端、固定耦合件、PCB和壳保持；拒绝非零RPM，不自动改变主机姿态或模拟RF。装拆需保留附件时使用 `{dispose:false}`，调用者负责后续释放。

## Mini Proto

U064保完整本款3222原装面（前1526/后1696），仅对自身源做共同刚性坐标变换，运行24×32×8 mm，不借已覆盖Proto U022。裸板为本款8列×6行、48个真实贯孔，孔壁/双面焊环和PCB厚度为实体；两个壳安装孔、Grove/引脚、真实盖板与卡件独立存在。实际本款布局与隐藏安装推导见[来源](research/mini-proto/sources.json)。

本体只有 `grove`，没有默认用户电路、sensor、读数、LED、按钮或关节。裸洞板前面不新增胶贴，也不以印刷代替孔网。默认后盖与真实背标存在；`{rearCover:false}`只移除相应盖板/背标及该盖实际固定件，保留PCB/Grove和其余结构。

## 接入示例

```js
import {loadModel,loadGroveModule} from '../src/loaders.js';
const host = await loadModel('sticks3');
const hub = await loadGroveModule('hub');
host.port('grove').attach(hub);
const global2 = await loadGroveModule('nbiot2',{antenna:true});
const cn = await loadGroveModule('nbiot-cn',{antenna:true});
const proto = await loadGroveModule('mini-proto');
hub.port('grove-1').attach(global2);
hub.port('grove-2').attach(cn);
hub.port('grove-3').attach(proto);
host.handle({type:'joint',target:'grove/grove-1/sma/tilt',
  angleDeg:45,durationMs:250});
host.handle({type:'joint',target:'grove/grove-2/antenna/tilt',
  angleDeg:70,durationMs:250});
function onFrame(deltaSeconds) { host.update(deltaSeconds); }
// Teardown: host.dispose().
```

每款GroveModule提供真实四芯线、`unitFrame`外驱整机姿态和独立 `cable`弯曲。附件Module使用 `get()`，没有专用 `joint()`访问器。接口层级沿port进入附件，彼此独立装拆，不自动路由供电或协议。

所有入口及实际配置的 `artwork:false`只取消墨层，真实膜/板/壳/孔壁/触点与附件保持全部物理attributes/index/matrixWorld。贴纸按本款SKU/类别/可见版本筛原稿，缺稿按本款清楚官图代码重绘高清普通PNG，并注明字体/颜色/配准近似；不裁照片、不借错款、不编不可辨小字、不用PNG补缺件。图片使用静态URL字面量，统一构建后检查实际dist与预览服务的源PNG字节。

必要专项：`node scripts/check-nbiot-mini-proto-units.mjs`。单品孔腔与材料、三分支四芯、天线动作/固定件/错误连接拒绝、后盖服务、所有入口实际配置印刷不变性、装拆/主机framebuffer和导出/build实际范围以本批进度为准。CSV、私URL/原稿名/映射、矢量、原始官图/CAD/PDF/MCP全文、生成器及中间件留分发树外；新增代码MIT，第三方及标识保留各自权利。旧贴纸/Scroll/StackChan量产配合/Puzzle Bridge缺基准检查点继续保留。
