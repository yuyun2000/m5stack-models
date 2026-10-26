# M5Bit、Mini BPS、HEX 原版接入

三款为 `modeled`，未逐面浏览器或实物验收。模型提供完整外观、真实接触件/四芯线以及外驱灯珠材料；UART/IO、压力/温度/高度、采样、寄存器、RGB协议级联、供电、电气与固件由接入框架实现。

| 型号 / SKU | 实际端口 | 实际控件 / 外部输出 |
| --- | --- | --- |
| `m5-bit` / A051 | `microbit` / `io` / `aux` / `grove` | 控件无；灯无；屏无；关节无 |
| `bps` / U090 | `grove` | 控件无；灯无；屏无；关节无 |
| `hex` / A045 | `grove` / `out` / `power` | 控件无；灯37颗（ID见下文）；屏无；关节无 |

不因产品用途添加数值传感器或自动算法。M5Bit默认只含转接板，照片中的Microbit卡是情境，不附其按钮/点阵/固件；Mini BPS保实际金属BMP280及压力孔/通气槽，其位置如有被动锚点也不返回测量值。

## 真实四芯连接

```js
import {loadModel, loadGroveModule} from '../src/loaders.js';
const host = await loadModel('sticks3');
host.root;
const hub = await loadGroveModule('hub');
host.port('grove').attach(hub);
const adapter = await loadGroveModule('m5-bit', {cableLength:85});
const bps = await loadGroveModule('bps', {cableLength:100});
const hex = await loadGroveModule('hex', {cableLength:115});
hub.get('grove-1').attach(adapter);
hub.get('grove-2').attach(bps);
hub.get('grove-3').attach(hex);
host.update(deltaSeconds); // 每帧更新装配姿态和实际四芯线形
```

单独预览使用 `loadModel(id, options)`，装配用 `loadGroveModule(id, options)`。线与接点是实际可见装配，不执行通信。M5Bit IO排针与卡槽、HEX额外座保本款真实家族；没有配套物证的插卡附件不虚构。端口名字和输入由冻结API决定，不把所有插座都当成同一自动信号路由。

## HEX 37颗独立外驱灯

实际ID顺序如下，对应本款官方灯位图，不代表实现串行协议地址：

```js
const ledIds = ["led-1","led-2","led-3","led-4","led-5","led-6","led-7","led-8","led-9","led-10","led-11","led-12","led-13","led-14","led-15","led-16","led-17","led-18","led-19","led-20","led-21","led-22","led-23","led-24","led-25","led-26","led-27","led-28","led-29","led-30","led-31","led-32","led-33","led-34","led-35","led-36","led-37"];
host.handle({
  type:'led', target:'grove/grove-3/led-1',
  color:'#ff6622', brightness:0.65,
});
// 关掉该颗只给外驱状态；不自动改变其他灯、其他分支或主机屏幕
host.handle({type:'led', target:'grove/grove-3/led-1', on:false});
```

颜色/亮度只改变实际灯窗发光材料，不移动封装、接脚、PCB和接口，不回发输入事件。默认灯灭；变色、亮度、关灯及后续序列都由外部驱动。没有自动彩虹、RGB数据级联、供电限流或EEPROM/固件状态。板上PWR座的物理四触点不等于为未知针脚添加电气行为。

## 配置与导出

| 型号 | 真实预设 | 默认参数 |
| --- | --- | --- |
| `m5-bit` | `complete {}` | `{}` |
| `bps` | `complete {}` | `{}` |
| `hex` | `complete {}` | `{}` |

| 型号 | 导出别名 |
| --- | --- |
| `m5-bit` | `M5BitUnit` ← `Model`；`M5BitUnitModule` ← `GroveModule` |
| `bps` | `MiniBPSUnit` ← `Model`；`MiniBPSUnitModule` ← `GroveModule` |
| `hex` | `HEXUnit` ← `Model`；`HEXUnitModule` ← `GroveModule` |

实际端口接合使用 `attach(module)` / `detach({dispose:false})`，保留后可再接回。仅匹配本款真实连接家族；默认拆除会释放对象。没有已证附件的插座可以保持空座，不据照片情境自动附送其他产品。

## 贴纸、丝印与真实载体

本批 5 张普通PNG同步：`m5-bit` 2张（`reference-redraw`），见[本款印刷记录](research/m5-bit/artwork.json)；`bps` 2张（`reference-redraw`），见[本款印刷记录](research/bps/artwork.json)；`hex` 1张（`reference-redraw`），见[本款印刷记录](research/hex/artwork.json)。

准确代码重绘本款可读PCB丝印、BPS前标与后膜，并记录官方来源。`artwork:false`只去墨，保PCB、实际膜、无色压纹、通气孔/卡槽/接点、全部物理attributes/index/world与外驱灯状态。PCB丝印不额外造胶膜；HEX个体QR/编号墨省略，真实载体保留。宣传叠字/箭头和灯位参考数字不印到机身，不猜微字、不裁照片、不借新版或以图遮洞。私表、URL、原名/映射、矢量、原始资料、生成器和中间件不分发。

## 来源与限制

- [M5Bit A051](research/m5-bit/sources.json)：自身57×21×11名义与本款官方商店白色PCB丝印版本。80片卡接触、45个IO针（15列，编号跳过8/12）和8个辅助针依自身近照，80w/1.27mm另有机械旁证；不把物理接触片数量当信号网表。无本款CAD或维图，内部定位/厚度/配合等推导单列，不借其他Microbit转接器，包装厚度不是装配基准。
- [原Mini BPS U090](research/bps/sources.json)：BMP280及本款24×24×13名义、双通气开口/红Grove/后膜与实体M5；内部层位和孔/壁据自身照片推导。不能拉伸U090-B/QMP6988的8mm壳。
- [原HEX A045](research/hex/sources.json)：自身尺寸图X36/Y31.2/总深6.95、板1mm、灯距5/4.33mm，37颗较大SK6812与三白4P座；表31.2×36×7是维序/取整另记。PCB上的HEXv1.1是A045板修订，不是NeoHEX A045-B或2020灯珠。

三款均 `own-dimensional-parametric`，不声明native源面或完整BOM。隐藏接点、器件/焊接支撑、壁厚、膜与配合是有来源的外观重建，不代表量产公差或硬件物理验收。新增代码MIT，官方照片/图纸及第三方标识保留各自权利。

必要验证：`node scripts/check-m5bit-bps-hex-units.mjs`。覆盖自身实体/孔壁/通气与接触支持、两入口/实际配置去墨、37灯外驱材料/noecho、真实三分支四芯、变父/peer/framebuffer与资源释放。见[本批进度](../artifacts/m5bit-bps-hex-expansion/progress.json)。未运行浏览器/GPU、历史全量或实物验收。
