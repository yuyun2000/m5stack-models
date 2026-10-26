# EXT.IO、ADC、DAC 原版接入

三款为原版/EOL、`modeled`，未逐面浏览器或实物验收。模型提供完整外观、真实接口/四芯线和机械装拆；IO寄存器、地址、ADC读数/采样、DAC电压/EEPROM、波形、电气和固件由外部框架实现。

| 型号 / SKU | 实际端口 | 实际控件 / 外部输出 |
| --- | --- | --- |
| `extio` / U011 | `grove` / `io` | 控件无；灯无；屏无；关节无 |
| `adc` / U013 | `grove` / `terminal` | 控件无；灯无；屏无；关节无 |
| `dac` / U012 | `grove` / `terminal` | 控件无；灯无；屏无；关节无 |

本款没有已证外部按键、灯、屏或主动转动件，不因产品的电气用途创建读数或状态。壳、实体无色压纹、实际接收腔/触点/PCB/Grove支持与印刷载体分别保留。

## 四芯装配

```js
import {loadModel, loadGroveModule} from '../src/loaders.js';

const host = await loadModel('sticks3');
host.root;
const hub = await loadGroveModule('hub');
host.port('grove').attach(hub);
const io = await loadGroveModule('extio', {cableLength:85});
const adc = await loadGroveModule('adc', {cableLength:100});
const dac = await loadGroveModule('dac', {cableLength:115});
hub.get('grove-1').attach(io);
hub.get('grove-2').attach(adc);
hub.get('grove-3').attach(dac);
// 每帧更新装配姿态和真实四芯线形
host.update(deltaSeconds);
```

单独预览使用 `loadModel(id, options)`，装配用 `loadGroveModule(id, options)`。连接建立可见装配和寻址层级，不执行 I2C 或模拟电气通断。更改 `unitFrame` pose 和 `cable` 外观不会改变其他分支或主机屏幕。

## 真实配置与机械附件

| 型号 | 真实预设 | 默认参数 |
| --- | --- | --- |
| `extio` | `complete {}` | `{}` |
| `adc` | `complete {"terminal":"installed"}`；`without-plug {"terminal":"removed"}` | `{"terminal":"installed"}` |
| `dac` | `complete {"terminalPlug":true}`；`without-terminal-plug {"terminalPlug":false}` | `{"terminalPlug":true}` |

| 型号 | 入口与附件导出别名 |
| --- | --- |
| `extio` | `EXTIOUnit` ← `Model`；`EXTIOUnitModule` ← `GroveModule` |
| `adc` | `ADCUnit` ← `Model`；`ADCUnitModule` ← `GroveModule`；`ADCUnitTerminalPlug` ← `TerminalPlug` |
| `dac` | `DACUnit` ← `Model`；`DACUnitModule` ← `GroveModule`；`DACUnitTerminalPlug` ← `TerminalPlug` |

`adc` 的 `ADCUnitTerminalPlug` 对应本款 `TerminalPlug`，仅匹配自身机械连接家族。

`dac` 的 `DACUnitTerminalPlug` 对应本款 `TerminalPlug`，仅匹配自身机械连接家族。

可拆橙2P插体通过本款端口装拆；从上表取实际端口ID，`unit.get(portId).detach({dispose:false})` 保留对象，之后 `unit.get(portId).attach(savedPlug)` 恢复装配。默认拆除会释放对象。只匹配本款连接家族，不接受 Grove 模块或错款插头。固定接收座、接点、板和壳保持，装拆不产生电压/输出/采样状态。

照片未充分确认螺丝头槽、螺距或夹紧行程，模型不提供猜测的螺丝旋转或轴向联动；真实插体机械拆装照常保留。

## 贴纸与实体标记

本批 5 张普通PNG同步：`extio` 1张（`reference-redraw`），见[本款印刷记录](research/extio/artwork.json)；`adc` 2张（`reference-redraw`），见[本款印刷记录](research/adc/artwork.json)；`dac` 2张（`reference-redraw`），见[本款印刷记录](research/dac/artwork.json)。

清楚本款后标与端子极性按官方照片准确代码重绘并注明来源，原始照片像素不裁成贴纸。无色壳字/箭头保留实体；`artwork:false` 只去墨，保真实膜/压纹、接收腔/板/触点、全部物理 attributes/index/world 与装配。私表、私链接、原名/映射、矢量、原始资料、生成器和中间件均不分发。不借新版、不编微字或个体码、不以图片遮缺件。

## 来源与限制

- [EXT.IO U011](research/extio/sources.json)：原版PCA9554PW，真实2×5 IO和红Grove。旧表24×32×11mm与页面B版图10.2mm冲突，B图不作旧款精确datum；外形由原版多视图与名义包络重建，内部/局部定位明确为推导，不借EXT.IO2 U011-B结构或功能。
- [ADC U013](research/adc/sources.json)：原版ADS1100，自身尺寸图32×24×10.2mm、8mm基壳、真实前装2P端子与本款极性/后标，不借ADC v1.1。
- [DAC U012](research/dac/sources.json)：原版MCP4725，当前本款MCP与自身尺寸图32×24×10.2mm、8mm基壳、真实前装2P端子与本款极性/后标，不借DAC2。旧不可变英文表32.2×24.2×10.3mm另记来源差异并已反馈，不作为当前图纸基准。

三款无本款原生CAD，采用 `own-dimensional-parametric`，不宣称保留原生面或完整BOM。隐藏安装、接收腔配合、壁厚、板/器件与膜为有来源的外观重建，不是量产配合或硬件物理验收。新增代码MIT，官方照片/图纸和第三方标识保留各自权利。

必要验证：`node scripts/check-extio-adc-dac-units.mjs`，覆盖自身实体/孔口壁与支持、两入口/实际配置去墨、真实三分支四芯、端子装拆、变父/peer/framebuffer与资源释放。见[本批进度](../artifacts/extio-adc-dac-expansion/progress.json)。未运行浏览器/GPU、历史全量或实物验收。
