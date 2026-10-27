# PaHub v2.0、原 PbHub、裸 TimerCamera 接入

三款为 `modeled`，尚未逐面浏览器或实物验收。模型负责完整外观、真实插座/四芯接合与层级寻址、裸板两个按键的局部按放/回弹，以及固定蓝灯的外驱材料状态。I2C/GPIO/地址路由、采样、电气、电源睡醒、RTC、图像/AI和固件由外部框架实现。

| 型号 / SKU | 本体组件顺序与类型 | 实际接口 / 控件 / 输出 |
| --- | --- | --- |
| `pahub-v20` / U040-B | `grove (port)` / `grove-0 (port)` / `grove-1 (port)` / `grove-2 (port)` / `grove-3 (port)` / `grove-4 (port)` / `grove-5 (port)` | 口`grove` / `grove-0` / `grove-1` / `grove-2` / `grove-3` / `grove-4` / `grove-5`；控件无；灯无；光学锚点无 |
| `pbhub` / U041 | `grove (port)` / `grove-0 (port)` / `grove-1 (port)` / `grove-2 (port)` / `grove-3 (port)` / `grove-4 (port)` / `grove-5 (port)` | 口`grove` / `grove-0` / `grove-1` / `grove-2` / `grove-3` / `grove-4` / `grove-5`；控件无；灯无；光学锚点无 |
| `timercamera` / U082 | `camera (component)` / `grove (port)` / `usb (port)` / `reset (button)` / `power (button)` / `status (led)` | 口`grove` / `usb`；控件`reset` / `power`；灯`status`；光学锚点`camera` |

## 主机、两个七口 Hub 与裸板

```js
import {loadModel,loadGroveModule} from '../src/loaders.js';
const host=await loadModel('sticks3');
host.root;
const hub=await loadGroveModule('hub');
host.port('grove').attach(hub);
const pa=await loadGroveModule('pahub-v20',{cableLength:85});
const pb=await loadGroveModule('pbhub',{cableLength:100});
const camera=await loadGroveModule('timercamera',{cableLength:115});
hub.get('grove-1').attach(pa);
hub.get('grove-2').attach(pb);
hub.get('grove-3').attach(camera);

const childA=await loadGroveModule('button',{cableLength:75});
const childB=await loadGroveModule('button',{cableLength:90});
pa.get('grove-0').attach(childA);
pb.get('grove-0').attach(childB);
host.update(deltaSeconds); // 每帧时间为秒
```

PaHub v2.0 六个输出：`grove-0` / `grove-1` / `grove-2` / `grove-3` / `grove-4` / `grove-5`。原 PbHub 六个输出：`grove-0` / `grove-1` / `grove-2` / `grove-3` / `grove-4` / `grove-5`。底部实际输入为各自 `canonicalCableInput`；直立输出按本款板上编号定位。两个 Hub 都没有 v2.1 的拨码开关，不添加地址设置器、灯或虚构 sensor。

层级地址跟随实际插接，例如下游 Unit 的姿态和四芯线可由调用方控制：

```js
host.handle({type:'pose',target:'grove/grove-1/grove-0/unitFrame',
  position:[45,200,8],rotation:[.1,-.2,.15]});
host.handle({type:'cable',target:'grove/grove-1/grove-0/cable',
  slack:12,bend:[0,0,-1]});
host.update(deltaSeconds);
host.on('input',event=>consumeInputIntent(event)); // 由外部框架消费完整组件路径
```

这些地址和接合描述机械装配，不能据此推断硬件的嵌套能力、协议兼容或已实现通道路由。插拔只改变实际模块所有权与可见四芯线；各输出端口互相独立。外驱姿态/线形不回发用户按键输入。

## 裸 TimerCamera 的按放与蓝灯

```js
const power='grove/grove-3/power';
const reset='grove/grove-3/reset';
host.handle({type:'button',target:power,action:'press',source:'controller:power'});
host.handle({type:'button',target:reset,action:'press',source:'controller:reset'});
host.update(deltaSeconds); // 固定框/焊脚/PCB不动，只移动实际帽/杆
host.handle({type:'button',target:power,action:'cancel',source:'controller:power'});
host.handle({type:'button',target:reset,action:'release',source:'controller:reset'});
host.update(deltaSeconds);

host.handle({type:'led',target:'grove/grove-3/status',on:true,brightness:.65});
host.handle({type:'led',target:'grove/grove-3/status',on:false});
```

按键支持独立来源持有，最后一个来源结束后才回弹；取消抑制 click。按放/点击/长按等事件只表达输入意图，不执行复位、开关机或定时拍摄。两个实际帽不会互相重置，也不会自动改变蓝灯。指示灯保持本款固定蓝色，仅接受外部视觉亮度/开关，不生成默认闪烁。

独立 Model 默认 `KeyR→reset`、`KeyP→power`。装配到主机后，由调用方显式设置 `host.keymap.KeyR='grove/grove-3/reset'`、`host.keymap.KeyP='grove/grove-3/power'`；模块不会自动覆盖主机键位。

被动光学组件只提供实际装配坐标。需要坐标时，可读取它的 `object3d`；它没有图像或传感读数：

```js
import * as THREE from 'three';
const optical=host.get('grove/grove-3/camera').object3d;
optical.updateWorldMatrix(true,false);
const position=optical.getWorldPosition(new THREE.Vector3());
const orientation=optical.getWorldQuaternion(new THREE.Quaternion());
```

66.5°是本款官方光学参数，不表示已实现相机或拍摄。

## 实际配置与构造导出

| 型号 | 真实预设 | 默认参数 |
| --- | --- | --- |
| `pahub-v20` | `complete {}` | `{}` |
| `pbhub` | `complete {}` | `{}` |
| `timercamera` | `bare {}` | `{}` |

| 型号 | 导出别名 |
| --- | --- |
| `pahub-v20` | `PaHubV20Unit` ← `Model`；`PaHubV20UnitModule` ← `GroveModule` |
| `pbhub` | `PbHubOriginalUnit` ← `Model`；`PbHubOriginalUnitModule` ← `GroveModule` |
| `timercamera` | `TimerCameraUnit` ← `Model`；`TimerCameraUnitModule` ← `GroveModule` |

独立使用 `loadModel(id,options)`，装配使用 `loadGroveModule(id,options)`。默认附件、控件和输出只以实际实现为准；TimerCamera 是本款裸板，空电池插座不代表附带电池或已承诺某个附件连接协议。

## 印刷与实际载体

本批 5 张普通 PNG：`pahub-v20` 2张（`reference-redraw`），见[本款印刷记录](research/pahub-v20/artwork.json)；`pbhub` 2张（`reference-redraw`），见[本款印刷记录](research/pbhub/artwork.json)；`timercamera` 1张（`reference-redraw`），见[本款印刷记录](research/timercamera/artwork.json)。

Hub 后标只贴实际膜，PCB 数字/丝印直接注册到真实 PCB，不多造胶膜。PaHub 前开窗按本款实物暴露红板与元件；PbHub 保本款黑板/七座。TimerCamera 没有机身背膜，私表两项包装候选已拒绝，不能将包装图贴到裸板。清楚印字按本款官方照片准确代码重绘，不裁照片、不借错版或猜微字/个体码。

`artwork:false` 只去墨，保 native 壳、真实膜/PCB/孔壁/元件/接点、两帽及其部分运动状态。私 CSV、URL、原名/映射、矢量原稿、原始图纸/官图、生成器和中间件不分发；公开只提供普通 PNG 与必要模型代码。新代码 MIT，原生 CAD 保留上游 MIT/Copyright，照片和商标保留各自权利。

## 本款来源与结构边界

- [PaHub v2.0 U040-B](research/pahub-v20/sources.json)：本款原生闭合后半壳/开窗前框与源面映射，排重复装配预览。8 mm 壳与 10.8 mm 含接口整体包络分记；七座/28 触点、可见 PCB/元件及隐藏保持是明确重建。正文/背膜 PCA9548AP 与 linked schematic TCA9548A 冲突保留，不能当作已确认的量产 BOM；v2.0 不借 v2.1 拨码或电子部件。
- [原 PbHub U041](research/pbhub/sources.json)：自身照片参数化；当前 10.8 mm 与旧 12 mm、MEGA328/STM32 文本冲突均单列。当前 own02 后膜地址/QC版本不混入旧图；可见 QFP32 外观不能证明量产芯片料号。
- [裸 TimerCamera U082](research/timercamera/sources.json)：自身双面裸板、普通光学/FPC/USB-C/Grove/空电池座，以及真实 RESET/PWR 帽和蓝灯。20×45×12 是整机名义，板厚/隐藏安装/光学基准/行程均明确推导；不剥 F/X 壳冒充本款，也不添电池、鱼眼或支架。

必要本批验证：`node scripts/check-pahubv20-pbhub-timercamera-units.mjs`。覆盖实际 native/闭合实体/FrontSide 孔壁与支持、七口逐路四芯/层级地址/拆装、两帽部分按放与固定蓝灯无回声、两入口/实际配置去墨、变父/peer/framebuffer/资源释放。见[本批进度](../artifacts/pahubv20-pbhub-timercamera-expansion/progress.json)。未进行浏览器/GPU、历史全量或实物验收。
