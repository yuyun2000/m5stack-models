# ZigBee / CO2L / INA226-1A 接入

本批提供完整本款外形、真实接口和外部驱动的可见动作；内部协议、电气和传感值交下游框架。Git127基线为 `3681a64`，本批为之后的本地增量。三款继续 `modeled`，浏览器逐面、生产装配和实物验收未完成。

| loader ID | SKU | 本体组件 | 可选附件 | 对应印刷 |
| --- | --- | --- | --- | --- |
| `zigbee` | U110 | `grove`、`sma` | `Antenna`：`sma/tilt` | 2张本款 `reference-redraw` |
| `co2l` | U104 | `grove`、被动 `sensor` | 无 | 2张本款 `reference-redraw` |
| `ina226-1a` | U200-1A | `grove`、`terminal` | `TerminalPlug`：`terminal/screw-1…4` | 2张本机1A/80mR `source-vector-raster` |

三款均导出 `Model` / `GroveModule` / `spec`；总入口别名为 `ZigbeeUnit` / `ZigbeeUnitModule` / `ZigbeeAntenna`、`Co2lUnit` / `Co2lUnitModule`、`Ina2261aUnit` / `Ina2261aUnitModule` / `Ina2261aTerminalPlug`。附件的 `meta.connector`是接受它的Port家族，`physicalConnector`描述自身实际连接件；没有公母名称的隐式配对推断。

## 实体与尺寸依据

ZigBee保留本款完整24×64×8原壳；产品表71.5×24×8与SMA突出/安装另行记录，不把64mm壳拉伸到71.5。实际DRF1609H模块、PCB、Grove、金属SMA和胶棒天线均为独立实体。S1/D1在原理图存在，但外露操作路径、灯光路径及槽处金色实体缺装配基准，保持隐藏实体/安装推导，不凭原理图造外部按键/灯窗。本款官图有直杆和90°姿态，附件 `tilt`接受0–90°外部角度/插值；此范围是外观重构，未证实机械止挡。固定SMA耦合、壳和PCB不随天线弯折。官方反馈 `d2b33b1826c44698be8ec73d5fd89789`记录这些装配资料缺口。

CO2L以本款24×48×16原CAD为基线，依据本款官图/尺寸图局部补出原CAD缺失的六个侧面真实通气槽，原/改三角和SHA、修订范围在单品记录分列；外壳不缩放。SCD41感测封装、VRH3301NLX、PCB和通气槽/腔壁均为独立实体。保留有实际用途的通气开口，内部封装与板形成真实背衬；不填死通气孔或贴PNG掩盖缺件。前壳面印字和背面胶贴分开建模。被动 `sensor`只作外观锚点，状态为空，不生成CO2、温度或湿度读数。 原CAD缺侧槽的资料冲突已反馈 `39fe0d8f32f54e4ca6b6434fc792efa8`。

INA226-1A按本款路径确认完整5582三角壳，与10A相同的壳来源不表示芯片周边/标签等同。24×58×10.2名义、24×56×8原壳、固定端子座及附件包络分别记录；安装突出与隐藏PCB仍为外观推导。使用80mR分流件及本款保险器件，内部BLUE0603未有外部光路证据，保持非发光封装。实际四位座/可拆插头、四独立螺钉和接触腔均存在；四孔在倒角后有材料余量，必要局部检查覆盖FrontSide孔壁和有向闭合。MCP摘要J2 pin2无连接与原图pin2/3共PGND的冲突已反馈 `8dc9976c83db4b2f9643586636cbc4c9`；模型不执行电气连接。

准确来源、原壳选择、包络、封装尺寸和推导见各产品 [ZigBee](research/zigbee/sources.json)、[CO2L](research/co2l/sources.json)、[INA226-1A](research/ina226-1a/sources.json)及对应 `cad-map.json` / `dimensions.js`。

## 三分支四芯接线与动作

```js
import {loadModel, loadGroveModule} from '../src/loaders.js';

const host = await loadModel('sticks3');
const hub = await loadGroveModule('hub');
host.port('grove').attach(hub);

const radio = await loadGroveModule('zigbee', {antenna: true});
const air = await loadGroveModule('co2l');
const meter = await loadGroveModule('ina226-1a', {terminalPlug: true});
hub.port('grove-1').attach(radio);
hub.port('grove-2').attach(air);
hub.port('grove-3').attach(meter);

host.handle({type: 'joint', target: 'grove/grove-1/sma/tilt',
  angleDeg: 45, durationMs: 120});
host.handle({type: 'joint', target: 'grove/grove-3/terminal/screw-1',
  angleDeg: 70, durationMs: 120});
host.handle({type: 'pose', target: 'grove/grove-2/unitFrame',
  position: [45, 160, 8], rotation: [0.1, -0.2, 0.15]});
host.handle({type: 'cable', target: 'grove/grove-2/cable',
  slack: 12, bend: [0, 0, -1]});

// Each render frame: update the host once; nested accessories update through it.
host.update(deltaSeconds);

// Preserve an accessory for later reattachment.
const antenna = radio.port('sma').detach({dispose: false});
radio.port('sma').attach(antenna);
// Caller owns the full tree lifecycle.
host.dispose();
```

四螺钉接受有限 `angleDeg` 与 `durationMs`，只改变真实工具槽头姿态；−180…180°是UI推荐预览范围，API没有硬角度限位。不模拟轴向夹紧、扭矩、螺纹升降或接触电阻。天线和螺钉拒绝非零 `rpm`，不会自动连续转动；外部命令不回送按键输入。拆掉CO2L分支不影响另外两条线或附件。天线/端子不能接受Grove附件，错误配对保留原装配。`antenna:false`和`terminalPlug:false`用于查看空座，实体深腔仍保留。

## 印刷、范围与必要检查

ZigBee/CO2L无本款原稿，按授权从本款官方照片重新绘制高清PNG，不复制照片像素、不编不可辨小字。INA226-1A原稿仅取本机1A/80mR两片，不包含包装或10A标签。印刷/商标保留各自权利；新增代码MIT。CSV、私有URL/映射/原稿名、矢量、原始官图CAD/PDF、生成器和中间材料留仓库外。公开只包含最终普通PNG、派生几何和安全来源。

`artwork:false`只移除印刷层；两个入口和各附件配置的所有物理attributes/index/世界矩阵保持一致，包括实际膜、壳面、PCB、封装、腔壁和接触件。

必要专项：`node scripts/check-zigbee-co2l-ina226-1a-units.mjs`。两副本局部smoke/真实三分支四芯、附件动作/插值/精确回位、固定件保持、两入口印刷物理一致性、八导出/build和5188字节检查的实际结果见[本批进度](../artifacts/zigbee-co2l-ina226-1a-expansion/progress.json)。历史证据绑定保存时源码；该检查不代表全库或实物验收。RF、UART、配对、CO2/温湿度、电流/电压/功率、I2C、隔离/保险丝、GPIO、供电、电气和固件均由外部实现。
