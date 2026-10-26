# 原版 ENV II、Joystick、GPS 接入

三款为 `modeled`，尚未逐面浏览器或实物验收。模型负责完整外观、真实接口和四芯线、原摇杆实际 XY 倾斜与 Z 按压/回弹及输入意图。环境/定位读数、ADC、采样、寄存器、I2C/UART、电气和固件由外部框架实现。

| 型号 / SKU | 实际本体组件顺序 | 端口 / 控件 / 灯 / 关节 |
| --- | --- | --- |
| `env-ii` / U001-B | `grove` | 口`grove`；控件无；灯无；关节无 |
| `joystick` / U024 | `grove` / `stick` / `press` | 口`grove`；控件`press`；灯无；关节无 |
| `gps` / U032 | `grove` | 口`grove`；控件无；灯无；关节无 |

ENV II 的 SHT30/BMP280 和 GPS 的 AT6558/MAX2659 是固定封装外观，不会生成读数或模拟内部功能。Joystick 实际 `stick` 输入与 Z 按压的关系和外部控制方式见下文。

## 三分支四芯装配

```js
import {loadModel,loadGroveModule} from '../src/loaders.js';
const host=await loadModel('sticks3');
host.root;
const hub=await loadGroveModule('hub');
host.port('grove').attach(hub);
const env=await loadGroveModule('env-ii',{cableLength:85});
const stick=await loadGroveModule('joystick',{cableLength:100});
const gps=await loadGroveModule('gps',{cableLength:115});
hub.get('grove-1').attach(env);
hub.get('grove-2').attach(stick);
hub.get('grove-3').attach(gps);
host.update(deltaSeconds); // 每帧调用，时间单位为秒
```

独立预览使用 `loadModel(id,options)`，接主机使用 `loadGroveModule(id,options)`。端口只建立真实可见接合和组件层级地址。`unitFrame` 接受 `pose` 命令，`cable` 接受 `cable` 命令以改变外部姿态/线形；三款均不因此执行采样或通信。

## 原摇杆输入与外驱形状

`joystick` 是 U024 / MEGA328P 原款，主体组件依次为 `grove`（port）、`stick`（joystick）、`press`（button）；模块再带 `unitFrame` 和 `cable`。固定白壳、PCB、金属框、黑杯和接口不动，只让实际球座/轴/帽及小 Z 推杆组运动。没有 LED、sensor、joint、显示屏、额外插座或可拆附件。

```text
grove                          # StickS3 的主 Grove
└─ HUB
   └─ grove-2                  # HUB 第二路
      └─ Joystick U024
         ├─ grove/grove-2/grove
         ├─ grove/grove-2/stick       # 实际 XY 输入/外驱形状
         ├─ grove/grove-2/press       # 实际 Z 按压/回弹
         ├─ grove/grove-2/unitFrame   # 完整 Unit 外驱姿态
         └─ grove/grove-2/cable       # 四芯线外驱形状
```

普通左键抓帽/拖动只产生 XY 输入；按下时带 Shift 的左键额外持有一个 Z 来源，可组合倾斜与按压。指针释放/取消只撤本指针的来源。独立 `Model` 的 `Space` 默认映射 `press`；接到 StickS3/HUB 后，由调用方显式设置 `host.keymap.Space='grove/grove-2/press'` 才能通过主机 Viewer 的 Space 控制这一路，不自动覆盖主机键位。外部 `button` 命令可独立控制 Z。

```js
const xy='grove/grove-2/stick', z='grove/grove-2/press';
// 只驱动可见角度，不回发用户输入，也不清除已持有的 XY 来源。
host.handle({type:'joystick',target:xy,action:'set',xDeg:10,yDeg:-8,durationMs:160});
host.handle({type:'joystick',target:xy,action:'center',durationMs:100});
const state=host.handle({type:'joystick',target:xy,action:'state'});
// xDeg/yDeg、targetXDeg/targetYDeg、transitioning、activeSources、visualRangeDeg

// 外部交互方产生输入意图；同名来源更新目标，最后更新的来源优先。
host.handle({type:'joystick',target:xy,action:'move',source:'controller:left',xDeg:7,yDeg:-5});
host.handle({type:'joystick',target:xy,action:'move',source:'controller:right',xDeg:-4,yDeg:11});
host.handle({type:'joystick',target:xy,action:'release',source:'controller:left'});
host.handle({type:'joystick',target:xy,action:'cancel',source:'controller:right'});
// 剩余来源继续控制；最后来源结束后按100ms展示过渡回中。

host.handle({type:'button',target:z,action:'press',source:'controller:z'});
host.handle({type:'button',target:z,action:'cancel',source:'controller:z'});
// 或 action:'release'；Z 多来源在最后一个结束后回弹，cancel 抑制 click。
host.on('input',e=>{
  if(e.id===xy) consumeXYIntent(e); // kind:'joystick', start/change/end
  if(e.id===z) consumePressIntent(e); // kind:'button', down/up/click/longpress
});
host.update(deltaSeconds); // 每帧秒数，推进实际部分倾斜/按压/回弹形状
```

`set` 可只传一个角度，另一轴保持当前可见角度；`durationMs` 默认为 0。外驱 `set/center` 仅改变当前视觉目标，后续 `move/release/cancel` 继续按持有来源选目标。`change` 携带 `source/xDeg/yDeg`，`end` 携带 `source/cancelled/targetXDeg/targetYDeg`；角度只表示外观和输入意图，不换算 ADC、I2C 寄存器或游戏状态。

每轴 `[-16,16]` 度、枢轴 `[0,8,10.4]` mm、Z 行程 `0.45` mm 都是照片推导与 Viewer 展示边界，不是硬件额定止挡/行程。中立完整包络 `[26.6,48,32]` mm 的 26.6 是黑杯外伸照片估算，官方名义 `[24,48,32]` mm 另存。两个实际预设为 `neutral` 的 `{xDeg:0,yDeg:0}` 和 `tilted` 的 `{xDeg:10,yDeg:-8}`，均保同款后膜普通 PNG。


## 实际外部输出

本批没有暴露外部灯、显示或声音输出。后标的器件/引脚文字只作为实际印刷保留，不会自动生成灯效或内部状态。

## 实际配置与构造导出

| 型号 | 实际预设 | 默认参数 |
| --- | --- | --- |
| `env-ii` | `complete {}` | `{}` |
| `joystick` | `neutral {"xDeg":0,"yDeg":0}`；`tilted {"xDeg":10,"yDeg":-8}` | `{"xDeg":0,"yDeg":0}` |
| `gps` | `complete {}` | `{}` |

| 型号 | 导出别名 |
| --- | --- |
| `env-ii` | `ENVIIUnit` ← `Model`；`ENVIIUnitModule` ← `GroveModule` |
| `joystick` | `JoystickOriginalUnit` ← `Model`；`JoystickOriginalUnitModule` ← `GroveModule` |
| `gps` | `GPSOriginalUnit` ← `Model`；`GPSOriginalUnitModule` ← `GroveModule` |

预设名称与参数来自作者冻结实现。`JoystickOriginalUnit` 导出对应 U024，既有 `JoystickUnit` 对应 v1.1；新模型不覆盖既有构造名或行为。未知附件不自动附加，ENV II 和 GPS 不因产品用途增加控件或关节。

## 同步印刷与实体载体

本批 4 张普通 PNG：`env-ii` 1张（`reference-redraw`），见[本款印刷记录](research/env-ii/artwork.json)；`joystick` 1张（`reference-redraw`），见[本款印刷记录](research/joystick/artwork.json)；`gps` 2张（`reference-redraw`），见[本款印刷记录](research/gps/artwork.json)。

按本款清楚后标及 GPS 前后膜准确代码重绘并注明来源。`artwork:false` 只去墨，保实体膜、无色 M5、全部孔槽壁、支撑、摇杆运动件、接口及四芯线。两入口/实际预设和部分倾斜/按放中，全部物理 attributes/index/world 均保留。ENV II 不借原 ENV 的 QC 膜；Joystick 后标 `LED D2` 不等同于额外外灯，`J3 NotMount` 不变成实装插座。禁照片裁切、错款标签、猜微字/个体码或用图片遮缺件。

私 CSV、私 URL、原名/映射、矢量原稿、原始官图/资料、生成器和中间件不分发；公开只提供普通 PNG 与必要模型代码。新增代码 MIT，官方照片、商标等保留各自权利。

## 来源与结构边界

- [ENV II U001-B](research/env-ii/sources.json)：自身 SHT30/BMP280、40 交错真通气槽和红 Grove。当前表模型轴 24×32×8 与旧文 24.2×32.2×8.1 分记，差异已反馈；未得到量产内部装配基准，内部安装/壁厚/膜厚等为明确推导，不套原 ENV 或 ENV III/IV。
- [原 Joystick U024](research/joystick/sources.json)：自身 MEGA328P、帽轴/杯体/金属载体及 XY/Z 运动。24×48×32 是官方名义，黑帽外伸的完整包络另记；枢轴、展示角度和行程为外观推导，不冒充额定止挡、弹性力学或制造配合。
- [原 GPS U032](research/gps/sources.json)：自身 24×48×8 维图、两 Ø5 安装孔/16 间距、蓝 4P 口和双膜；无内照/装配 CAD 时，PCB/AT6558/MAX2659/天线定位与隐藏配合明确推导。顶侧小缺口用途未证，不产生灯或 GPS 状态，不借 GPS v1.1/SMA。

三款均为 `own-dimensional-parametric`，没有本款 native 面或完整 BOM/制造验收声明。仅拓展历史原款覆盖，不宣称当前热度或在售状态。

必要本批验证：`node scripts/check-envii-joystick-gps-units.mjs`。覆盖实际闭合实体/FrontSide 孔壁/接收座和承托、摇杆独立 XY/Z/多源取消与部分形状、真实三分支四芯、两入口/配置去墨、变父/peer/framebuffer/资源释放。见[本批进度](../artifacts/envii-joystick-gps-expansion/progress.json)。未进行浏览器/GPU、历史全量或实物验收。
