# Finger / 3.96 / Scales 接入

本批提供本款真实装配、外部可见动作和输入意图。内部指纹、称重、协议、电气和固件由下游框架实现。Git127基线为 `3681a64`；本批及此前ZigBee/CO2L/INA226-1A是其后本地增量。所有产品保持 `modeled`，未完成逐面浏览器、制造配合或实物验收。

| loader ID | SKU | 本体组件 | 附件/动作 | 对应印刷 |
| --- | --- | --- | --- | --- |
| `finger` | U008 | `grove`、被动 `sensor` | 固定电容采集面，无机械按钮/外灯 | 1张背贴 `reference-redraw` |
| `unit-396` | U020 | `grove`、`terminal` | 可拆 `TerminalPlug`，`terminal/screw-1…4` | 1张背贴 `reference-redraw` |
| `scales` | U108 | `grove`、被动 `sensor`、`tare`、`rgb` | 原生壳片柔性清零键、独立外驱RGB | 1张底贴 `reference-redraw` |

三款均导出 `Model` / `GroveModule` / `spec`；总入口别名为 `FingerUnit` / `FingerUnitModule`、`Unit396` / `Unit396Module` / `Unit396TerminalPlug`、`ScalesUnit` / `ScalesUnitModule`。按需使用loader即可避免总入口加载全部设备。

## 本款结构与来源

Finger U008保留完整3956三角本款原壳，24×48×8 mm，统一刚性变换使真实采集孔朝+Z，不缩放或切掉原壳。包含FPC1020A电容采集面、金属边框、30×17.3×5.1 mm本款模块板/内联六针、HT7533、PCB真孔、Grove深腔和独立背膜。触摸唤醒是模块内部选项，U008原理图相关两针未接；不造机械键、光学镜头、触摸电气API、识别动画或外露灯。被动 `sensor`状态为空。

Unit 3.96 U020是本款HY2.0→HT3.96被动转接。完整3216三角原壳24×32×8，固定座含总厚10.2按本款尺寸图和官图另记；不把8 mm壳拉伸。固定橙色四位公座/四接触针，与随附可拆橙色四螺钉母插头分别建模。接口间距3.96 mm，固定座、PCB/Grove/接触件和插头内孔/夹笼均有实体深度。本款没有公开原理图/内部路由基准，四位端口使用数字针名，不编电源/地或自动电气连通。接口名字不证明任意厂牌机械通配，隐藏安装与插入深度保留外观推导。

Scales U108按本款56×40×41 mm装配，完整选取原生底座、承载板和M5圆盖共16694三角；其他移位副本不混入。实际称重元件、支撑/固定件、PCB、HX711/STM32及Grove另行补齐，正常工作间隙保留，不用壳或贴纸填死。顶面M5是原生浮雕，不另加PNG。圆形清零键是底座上有U形槽、铰根连体的真实柔性片；`tare`弯曲原生壳片顶点，保留原索引和固定部，释放/取消精确恢复原位置及法线。不是另放一个浮动可见帽。行程、隐藏安装与按压变形是外观推导，未标定真实材料力学。

`rgb`只驱动实际长窗/导光条，默认关闭，无光晕Sprite或随清零自动变化。承载板不是joint，不接受重量驱动的自动下沉。按钮只发输入意图；被动 `sensor`不计算重量、质量、力、清零或校准。

原壳SHA/选择/坐标、实际包络、芯片/封装与推导分别见[Finger来源](research/finger/sources.json)、[3.96来源](research/unit-396/sources.json)、[Scales来源](research/scales/sources.json)和各 `cad-map.json` / `dimensions.js`。照片推导部分不证明量产装配或电气。

## 三分支四芯与真实动作

```js
import {loadModel, loadGroveModule} from '../src/loaders.js';

const host = await loadModel('sticks3');
const hub = await loadGroveModule('hub');
host.port('grove').attach(hub);
const finger = await loadGroveModule('finger');
const terminals = await loadGroveModule('unit-396', {terminalPlug: true});
const scales = await loadGroveModule('scales');
hub.port('grove-1').attach(finger);
hub.port('grove-2').attach(terminals);
hub.port('grove-3').attach(scales);

// Intent only: the consuming framework decides whether this means tare.
host.on('input', event => { /* route event.target / event.action */ });
function tareDown(source = 'demo') {
  host.handle({type: 'button', target: 'grove/grove-3/tare',
    action: 'press', source});
}
function tareUp(source = 'demo', cancelled = false) {
  host.handle({type: 'button', target: 'grove/grove-3/tare',
    action: cancelled ? 'cancel' : 'release', source});
}
// Bind these to separate down/up/cancel events while render frames continue.

host.handle({type: 'led', target: 'grove/grove-3/rgb',
  color: '#38a2ef', brightness: 0.45});
host.handle({type: 'joint', target: 'grove/grove-2/terminal/screw-1',
  angleDeg: 70, durationMs: 120});
host.handle({type: 'pose', target: 'grove/grove-1/unitFrame',
  position: [35, 160, 8], rotation: [0.1, -0.2, 0.15]});
host.handle({type: 'cable', target: 'grove/grove-1/cable',
  slack: 12, bend: [0, 0, -1]});

// Call once from each render frame; children update through the host.
function onFrame(deltaSeconds) { host.update(deltaSeconds); }

const plug = terminals.port('terminal').detach({dispose: false});
terminals.port('terminal').attach(plug);
// At teardown, dispose the full owned hierarchy.
host.dispose();
```

`tare`支持重叠按压来源：只要仍有一个来源持有，壳片就保持按下。正常松开产生down/up/click；取消产生down/up(cancelled)，不补发click。按压不改变承载板、固定支撑、端口、RGB状态或外部sensor状态。输入不是固件执行、真实清零或称重证明。

四螺钉只旋转真实工具槽头，接受有限 `angleDeg` / `durationMs`；±180°是UI预览建议，不是API硬限或实测机械止挡。拒非零RPM，不模拟轴向行程、螺纹、夹紧/扭矩或接触电阻。`terminalPlug:true`可配合 `terminalPlugAnglesDeg:[0,35,70,-20]`设置四头初始姿态；`terminalPlug:false`查看固定空座，实体孔壁/触点仍在；错误Grove配件不能接入端子口。装拆只改变场景归属，不创建电气连接。

## 印刷与必要检查

三款私表没有本款原稿，三张实际背/底贴全部按本款官方照片用代码重绘为PNG，标 `reference-redraw`。不裁照片、不借另一型号、不编不可辨小字；字体、颜色和物理配准仍有照片推导误差。新增代码MIT；印刷/商标保留各自权利。

`artwork:false`仅去印刷层，保留实际膜/壳面、原生浮雕、采集面、PCB、封装、腔壁、触点、秤台/支撑和动作几何。两入口与各附件配置检查全部物理attributes/index/世界矩阵一致。CSV、私有URL/映射/原稿名、矢量、原CAD/官图/PDF/MCP全文、生成器和中间材料留仓库外，只分发最终普通PNG、派生几何及安全来源。

必要专项：`node scripts/check-finger-396-scales-units.mjs`。两副本单品/真实三分支四芯、四螺钉独立外驱/插值/回位、Scales原生柔性键压放/取消/原位置法线回位/固定件保持与独立RGB、两入口印刷全物理一致、七导出/build及5188资源字节检查的实际结果见[本批进度](../artifacts/finger-396-scales-expansion/progress.json)。没有新增逐面浏览器、全量历史或制造/实物验收。
