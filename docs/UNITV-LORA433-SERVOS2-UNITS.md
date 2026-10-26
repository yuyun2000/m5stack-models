# UnitV-OV7740 / LoRaE220-433 / 8Servos2-I2C 接入

三款均为 `modeled`、`visual-only`，展示本款实体结构、真实外部控件和可设置的外观。摄像头/AI、无线通信、PWM、I2C 地址、电气与固件行为交给外部运行框架；模型不自动推导这些状态。

[本批集成检查点](../artifacts/unitv-lora433-servos2-expansion/progress.json)记录正式专项检查、构建与资源验证结果。

| ID / SKU | 机械来源 | 本体实际组件 |
| --- | --- | --- |
| `unitv-ov7740` / U078-C | 本款官方完整装配 **7056 原面**，一组共同平移；原生包络约 **24.26051×40.00062×12.7 mm**，保留侧弹片及外壳公差 | `grove`、`usb`、`sd`、`buttonA`、`buttonB`、`camera`、`rgb` |
| `lora-e220-433` / U170-433 | 本款官方完整装配 **6614 原面**；原壳 **24×64×8 mm**，包含 SMA 的标称本体为 **24×71.4×8 mm** | `grove`、`sma`、`m0`、`m1` |
| `8servos2-i2c` / U222 | **own-dimensioned-parametric-no-CAD**：依据本款六视尺寸图和多面照片参数化构建 **24×56×11.5 mm** 外壳、孔位和接口，不声明官方 CAD 原面 | `grove`、`grove-b`、`dc`、`ch0`…`ch7`、`selector` |

UnitV 是 K210/OV7740 蓝色半透明原款；本款页面、背标和官方机械路径相互对应。LoRa433 使用 E220-400T22S/LLCC68，与已有 920 款属于同家族壳，模组和印刷按本款分别建模。U222 的双 Grove、侧 DC 口、16 档选择器与实际输出针按自身尺寸和照片构建；壁厚、暗扣、隐蔽 PCB/封装安装属于有记录的推导。

CAD 提交、SHA、尺寸依据和安装范围见 [UnitV 来源](research/unitv-ov7740/sources.json)、[LoRa433 来源](research/lora-e220-433/sources.json)、[U222 来源](research/8servos2-i2c/sources.json)。产品目录导出均为 `Model/GroveModule/spec`，LoRa433 另导出 `Antenna`。

## 三个独立 Grove 分支

```js
import {loadModel,loadGroveModule} from '../src/loaders.js';

const host=await loadModel('sticks3');
const hub=await loadGroveModule('hub');
host.get('grove').attach(hub);

const vision=await loadGroveModule('unitv-ov7740',{cableLength:80});
const radio=await loadGroveModule('lora-e220-433',{
  cableLength:90,antenna:false,m0Position:0,m1Position:0
});
const servos=await loadGroveModule('8servos2-i2c',{
  cableLength:100,selectorPosition:0
});
hub.get('grove-1').attach(vision);
hub.get('grove-2').attach(radio);
hub.get('grove-3').attach(servos);

// 宿主循环调用 host.update(dtSeconds)，渲染 host.root。
host.handle({type:'pose',target:'grove/grove-1/unitFrame',
  position:[-55,190,8],rotation:[.1,-.2,.15]});
host.handle({type:'cable',target:'grove/grove-1/cable',
  slack:12,bend:[0,0,-1]});
```

三个 `GroveModule` 都在本体组件之后增加 `unitFrame/cable`，以 `grove` 作为实际四芯线的输入口。单位为 mm，+X 为前视右方、+Y 上方、+Z 前方；变换属于当前模块框架。Module 使用 `.get(id)`，不依赖 `.button()`、`.led()` 或 `.joint()` 便利方法。端口类型负责机械匹配，针名负责说明来源，不执行协议或电路路由。

## UnitV 的瞬时双键与 RGB

`buttonA/buttonB` 是 `kind:'button'`、非锁存的原生侧弹片。由背标映射到前视坐标后，A(GPIO19) 位于 −X，B(GPIO18) 位于 +X。每键仅变形后壳中各自 **98 个原生顶点**及对应法线，并推动自己的内部 plunger；两个掩码不相交，其余后壳顶点、索引、另一键和固定结构保持。推导的视觉行程为 0.22 mm，不是材料仿真或实测止挡。

```js
const A=vision.get('buttonA');
const B=vision.get('buttonB');
A.press('keyboard:A');
B.press('keyboard:B');
A.release('keyboard:A'); // A 回弹，B 仍按住
B.cancel('keyboard:B'); // B 回弹，取消本次 click

host.handle({type:'button',target:'grove/grove-1/buttonA',
  action:'press',source:'bridge:A'});
host.handle({type:'button',target:'grove/grove-1/buttonA',
  action:'release',source:'bridge:A'});
host.handle({type:'led',target:'grove/grove-1/rgb',
  color:'#20aaff',brightness:.5});
```

每个键可以由多个源同时持有，直到最后一个匹配源 release/cancel 才结束按下；取消会给最终 `up` 标记 `cancelled:true` 并抑制 `click`。这些动作产生真实输入意图 `down/up/click`。独立 Device 的键盘映射为 `KeyA/KeyB`。指针通过贴合实际弹片表面的薄代理命中，不给整个后壳标记同一个按键。

`rgb` 是本款实际 WS2812 的外观输出，实体封装及导光结构填在原生长圆孔内；外驱颜色/亮度不回声为 input，也不移动物理结构。`camera` 是被动封装框架，`getState()` 为空；`usb` 是实际 USB-C 接收座，`sd` 是默认空置的 microSD 接收座，均有真实接点、壁和背衬。没有拍摄、AI、文件存储或 USB 功能。当前仅 `complete` 配置，无拆盖或插卡构造选项。

## LoRa433 的稳定 DIP 与静态 SMA 天线

构造选项为 `antenna:boolean`、`m0Position:0|1`、`m1Position:0|1`，默认 `false/0/0`。目录保留四种物理拨档组合与有/无天线的八个具名 preset；命名只表示实体档位。

`m0/m1` 是两个独立锁存 `Button`。首次按下切换稳定档，释放或取消均保留该档；多个源持有同一键不会重复切档。只有一个实际奶油色滑片随每个 `cap` 移动；固定底座、上盖、四个焊脚及本款 PCB/壳不随动。视觉行程 1.1 mm 为安装推导。

```js
const m0=radio.get('m0');
m0.press('pointer-demo');
m0.release('pointer-demo'); // 保留已选择的实体档位
m0.setPosition(0,{immediate:true});
host.handle({type:'button',target:'grove/grove-2/m1',
  action:'position',position:1,immediate:true});
```

`setPosition`/外部 `position` 命令不产生 input；press/release/cancel 表达输入意图。取消后需要显式 `setPosition` 才恢复指定档位。印刷中的模式表保留本款内容，不由模型计算 M0/M1 电平、收发模式或任何 RF 状态。

```js
import {Antenna} from '../src/units/lora-e220-433/index.js';

const sma=radio.get('sma');
sma.attach(new Antenna());
const detached=sma.detach({dispose:false});
sma.attach(detached);
```

`sma` 是普通 SMA female 接收座。附件实物端为普通 SMA male，匹配字段 `connector:'sma-female'` 表示其宿主接口族，`physicalConnector:'sma-male'` 记录实物插头；RP-SMA 和 Grove 不兼容。附件按本款照片所见折弯外形静态构建，**110 mm 是标称展开总长**；未验证铰链轴，因此没有 `joint`、角度或转速 API。`antenna:true` 会在构造时装入同一附件；独立装拆不改变本体。没有 RF 链路、串口包、通信距离或频率算法。

## U222 的 16 档实体选择器与实际接口

`selectorPosition` 接受整数 **0…15**，默认 0；具名 preset 为 `position-0` 和 `position-f`，后者是数值 15。`selector` 的 kind 为 `rotary-selector`，表示每格 22.5°、顺时针递增的 16 个稳定实体档。

```js
const selector=servos.get('selector');
selector.setPosition(15); // 返回组件自身，不产生 input
selector.getState();     // {position:15,positions:16}
host.handle({type:'selector',target:'grove/grove-3/selector',position:0});

servos.on('input',event=>{
  if(event.kind==='rotary-selector'&&event.action==='change'){
    console.log(event.position,event.previousPosition,event.delta);
  }
});
```

现有 Viewer 使用真实转子表面的 pointer 射线/平面拖动，每 22.5° 落入稳定档位；首个 pointer 拥有拖动，其他 pointer 的移动/结束不接管。Release/cancel 保留最后选择的档位。外部 `setPosition` 清除当前拖动且不回声；非法值原子拒绝，不改变档位、拖动状态或几何。输入为 `action:'change'`、`position`、`previousPosition`、最短物理步数 `delta` 和 `source:'pointer'`。只有转子下部、两块上部及箭头运动；固定刻度环、封装、保持件、针脚、PCB、壳和印刷保持。

演示页选择 `?model=8servos2-i2c` 后，动态控制面板的“物理档位”可设置 0…15，并显示对应的十六进制 0…F；该面板调用同一 `setPosition`，只改变实体选择器，不设置地址或驱动输出。

| 端口 ID | 连接族 | 实际几何与边界 |
| --- | --- | --- |
| `grove` | `grove` | 底部 PORT.A，标准四芯线输入；本款 GND/5V/SDA/SCL 为来源标签 |
| `grove-b` | `grove` | 顶部 PORT.B，第二个真实接收座；不模拟 I2C 级联路由 |
| `dc` | `dc-5.5x2.1` | 侧面 DC 5.5×2.1 接收口，实际中针、绝缘体和凹入背衬 |
| `ch0`…`ch7` | `servo-2.54-3` | 每路 GND/5V/SIG，共 **24 根实际 male post**；位置/接点用于机械展示，不产生 PWM 或伺服运动 |

官方资料提及红/绿电源监测灯，但当前外部光路未证实，模型只保留非发光内部载体，不注册 LED 输出。选择器数字也不转换为 I2C 地址；电压/电流数据、内部 PWM、舵机和电源算法均不建模。U222 没有服务盖或关节配置。

## 七张普通 PNG 与物理印刷载体

| 型号 | PNG 来源 | 物理载体 |
| --- | --- | --- |
| UnitV | **1 张 `official-flat-raster`**：本款公开清洁平面背标，完整转为 1164×1561 PNG；解码像素与原位图一致，未缩放、裁产品照片或重绘 | 独立背标薄膜；正面保原生结构，不把图库箭头/文字标注印到产品上 |
| LoRa433 | **3 张 `reference-redraw`**：按本款清楚照片用代码重绘前标、背标及固定 DIP 的 ON/1/2 印刷，记录字体和配准推导 | 两块实际本体薄膜，前标有真实 DIP 开窗；第三块是固定 DIP 上盖墨层，不额外造贴膜 |
| U222 | **2 张 `source-vector-raster` + 1 张 `official-photo-code-redraw`**：前/背本体原稿直接转 PNG，另按本款清楚近照重绘固定选择器 0…F 刻度 | 实际前 L 形膜、背膜及固定刻度载体；保留真实旋钮/排针窗口，不用 PNG 遮挡缺失零件 |

`artwork:false` 只关闭墨层；实际薄膜、壳、控件、载体、接点及所有物理 attributes/index/world 矩阵保持。UnitV 的单键/双键按下态、433 的八种天线/拨档组合及运动过程、U222 的两入口与具名档位均有对应检查记录。完整来源与推导见 [UnitV 印刷](research/unitv-ov7740/artwork.json)、[LoRa433 印刷](research/lora-e220-433/artwork.json)、[U222 印刷](research/8servos2-i2c/artwork.json)。

公开树只分发最终普通 PNG、派生几何、代码和安全来源说明。CSV、私有矢量、原文件名/链接/映射、转换器及中间证明不分发；PNG 仅保安全数值 DPI 元数据。

## 生命周期与证据范围

`detach({dispose:false})` 后可重接同一模块；装拆一个分支不应改变其他分支或宿主 framebuffer。最终 dispose 宿主会递归释放模块和附件。来源保全、闭合材料、孔壁/接口背衬、真实控件、去墨不变及资源释放的必要本地记录见 [UnitV](research/unitv-ov7740/smoke.json)、[LoRa433](research/lora-e220-433/smoke.json)、[U222](research/8servos2-i2c/smoke.json)。这些记录不表示逐面浏览器/GPU、量产装配配合或实物验收。
