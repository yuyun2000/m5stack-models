# UnitV2-USB、UnitV-M12、TimerCamera-F 接入

本批三款均为 `modeled`，尚未逐面浏览器或实物验收。模型负责完整外观、真实控件输入意图和外部驱动的视觉输出。USB/UART、AI、拍摄、存储、RTC、供电与固件由接入框架实现；相机仅保留实际光学结构与被动锚点。

| 型号 / SKU | 实际端口 | 实际控件 / 外部输出 |
| --- | --- | --- |
| `unitv2-usb` / U078-USB | `grove` / `usb-a` / `usb` / `sd` / `mount` | 控件`user`；灯无；屏无；关节无 |
| `unitv-m12` / U078-V-M12 | `grove` / `usb` / `sd` | 控件`buttonA` / `buttonB`；灯无；屏无；关节无 |
| `timercamera-f` / U082-F | `grove` / `usb` / `mount` | 控件`power` / `reset`；灯`status`；屏无；关节无 |

名义尺寸与实际原生壳、镜头、端口、膜、夹具包络分记，详见每款 `spec` 和[建模来源](#来源与限制)。不能把 STL 内横向排列的重复件尺寸当作整机尺寸。

## 加载与四芯连接

```js
import { loadModel, loadGroveModule } from '../src/loaders.js';

const host = await loadModel('sticks3');
host.root; // 材化主机后可查询组件
const hub = await loadGroveModule('hub');
host.port('grove').attach(hub);

const usb = await loadGroveModule('unitv2-usb', { cableLength: 85 });
const m12 = await loadGroveModule('unitv-m12', { cableLength: 100 });
const timer = await loadGroveModule('timercamera-f', { cableLength: 115 });
hub.get('grove-1').attach(usb);
hub.get('grove-2').attach(m12);
hub.get('grove-3').attach(timer);

host.on('input', event => externalFramework.acceptInputIntent(event));
// 在渲染循环中调用：真实帽/原生弹性桥的按下与回弹、线形均由它更新
host.update(deltaSeconds);
```

三条线均有真实四芯外形；连接建立装配和事件路径，不执行电气通信。嵌套输入路径使用 `grove/grove-1/<控件ID>`、`grove/grove-2/<控件ID>`、`grove/grove-3/<控件ID>`。独立预览用 `loadModel(id, options)`，接入主机用 `loadGroveModule(id, options)`。USB、SD 和机械安装口保留各自实际连接家族，不接受 Grove 模块冒充。

## 按键、外部输出与附件

UnitV2-USB 的 `user` 是前壳原生 U 形切口弹性舌，局部向内挠曲，固定 USB-A 罩与其余壳面保持。UnitV-M12 的两枚侧帽属于原生后壳弹性桥，按本款权重形变并在中立恢复原始位置/法线；真实小柱塞随动，固定开关包体、端子、板和接口保持。其余本款真实操作帽按各自实际轴向按下/回弹。实际控件ID：`unitv2-usb`：`user`；`unitv-m12`：`buttonA` / `buttonB`；`timercamera-f`：`power` / `reset`。

```js
// 这里的 key 必须取自上表本款真实控件；不是固件命令
const target = `grove/grove-2/${key}`;
host.handle({ type: 'button', target, action: 'press', source: 'agent:gesture-1' });
host.update(deltaSeconds);
host.handle({ type: 'button', target, action: 'release', source: 'agent:gesture-1' });
// 指针丢失或中断时用 cancel，回弹且不产生 click
host.handle({ type: 'button', target, action: 'cancel', source: 'agent:gesture-1' });
```

每个输入源独立持有按下状态，最后一个源释放才回弹。`cancel` 不产生成功点击；不要用取消一个源来重置仍持有的另一源。按钮默认静止，实际开关包体、端子、PCB 与接收口不随操作帽移动。行程、弹性桥权重及隐藏安装的推导限制在本款记录中明确。

`timercamera-f` 的实际蓝灯 `status` 接收外部 `led` 指令的 `brightness`；保持本款固定蓝色 `#168aff`，不把它当RGB灯。它改变自己的发光材质与真实光路，不回发输入，也不自动映射按键或固件状态。

真实静态安装附件使用本款命名预设和端口。可通过 `port.module` 检查当前附件，`port.detach({dispose:false})` 保留对象，之后 `port.attach(savedAccessory)` 恢复；附件自身的真实安装口可继续持有本款 adapter。只在同连接家族间装配，不造磁吸、铰链或自动运动。裸机预设是否保留端口、附件位姿及命名导出，以本款下表和冻结 API 为准。

| 型号 | 真实预设 | 默认参数 |
| --- | --- | --- |
| `unitv2-usb` | `bare {"clip":false}`；`with-clip {"clip":true}` | `{"clip":false}` |
| `unitv-m12` | `assembled {}` | `{}` |
| `timercamera-f` | `complete {"mount":"none"}`；`clip {"mount":"clip"}`；`wall1515 {"mount":"wall1515"}` | `{"mount":"none"}` |

| 型号 | 入口与附件导出别名 |
| --- | --- |
| `unitv2-usb` | `UnitV2USBUnit` ← `Model`；`UnitV2USBUnitModule` ← `GroveModule`；`UnitV2USBClip` ← `Clip` |
| `unitv-m12` | `UnitVM12Unit` ← `Model`；`UnitVM12UnitModule` ← `GroveModule` |
| `timercamera-f` | `TimerCameraFUnit` ← `Model`；`TimerCameraFUnitModule` ← `GroveModule`；`TimerCameraFClip` ← `Clip`；`TimerCameraFWall1515` ← `Wall1515` |

## 贴纸与材质

本批 4 张普通 PNG 随模型提供：UnitV2-USB U078-USB 1张（`reference-redraw`），实际载体及配准见[印刷记录](research/unitv2-usb/artwork.json)；UnitV-M12 U078-V-M12 2张（`reference-redraw`），实际载体及配准见[印刷记录](research/unitv-m12/artwork.json)；TimerCamera-F U082-F 1张（`source-vector-raster`），实际载体及配准见[印刷记录](research/timercamera-f/artwork.json)。所有来源按每款最终记录分开，不统称原稿。

`artwork:false` 仅去墨，保留真实膜、CNC/PCB 载体、玻璃、所有实体结构，以及按下/回弹形状；不使用照片裁切。私表、链接、原稿名与映射、矢量原稿、原始资料及生成中间件均不分发。不可辨微字与个体 QR/MAC/SN 不编造。

## 来源与限制

- [UnitV2-USB U078-USB](research/unitv2-usb/sources.json)：自身官方 MIT STL 中两完整壳共 4962 面，独立 clip 为 3316 面，按完整件身份排横向重复。凸起是固定 USB-A 罩壳；实际散热结构、可见内部件和无证运动限制依本款来源。
- [UnitV-M12 U078-V-M12](research/unitv-m12/sources.json)：自身 2850+1660 面闭合壳半复位，保真实 CNC 框、M12 光学与原生侧帽。混合装配副本存在接触非流形边，采用独立壳件，不借兄弟款外形。
- [TimerCamera-F U082-F](research/timercamera-f/sources.json)：自身 7912+1584 面闭合壳半、真实 clip/adapter、120° 鱼眼与 270mAh 电池。旧 CAD/尺寸图有点阵孔，本款实拍是平整前壳；在对应壳厚度内补实体塑料并保原始源面身份，记录版本差异及已更正的来源反馈。不是贴图遮孔。

隐藏板/电池安装、封装/膜厚、光学和推导行程以每款记录为准，不等于完整制造 BOM、硬件物理仿真或量产装配认证。新增代码采用 MIT，官方原生结构保留 MIT 归属，产品标识权利另记。

本批必要验证使用 `node scripts/check-unitvusb-m12-timercam-units.mjs`：真实 StickS3→HUB 三分支四芯、实际预设/两入口/去墨、真实键与固定件/多源取消、附件拆装、变换后结构及事件路径、外部输出无回声和资源释放。证据见[本批进度](../artifacts/unitvusb-m12-timercam-expansion/progress.json)。未执行逐面浏览器/GPU、历史全量或实物验收。
