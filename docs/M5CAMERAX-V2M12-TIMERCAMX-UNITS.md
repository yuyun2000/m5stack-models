# M5Camera-X、UnitV2-M12、TimerCamera-X 接入

三款为 `modeled`，未逐面浏览器或实物验收。模型负责完整外观、真实按键输入、独立外驱灯光与真实手动焦环形状。拍摄、视频、AI、USB/UART、电气、RTC、电池和固件由接入框架实现；相机只保留实体光学及被动锚点。

| 型号 / SKU | 实际端口 | 实际控件 / 外部输出 |
| --- | --- | --- |
| `m5camera-x` / U038 | `grove` / `usb` / `mount` | 控件`reset`；灯无；屏无；关节无 |
| `unitv2-m12` / U078-M12 | `grove` / `usb` / `sd` | 控件`user`；灯无；屏无；关节`focus` |
| `timercamera-x` / U082-X | `grove` / `usb` / `mount` | 控件`power` / `reset`；灯`status`；屏无；关节无 |

壳、光学、膜和安装件包络分别记录，见每款 `spec` 和[来源限制](#来源与限制)。名义尺寸差异不通过伸缩原生壳件处理。

## 四芯连接与输入

```js
import { loadModel, loadGroveModule } from '../src/loaders.js';

const host = await loadModel('sticks3');
host.root;
const hub = await loadGroveModule('hub');
host.port('grove').attach(hub);
const camera = await loadGroveModule('m5camera-x', { cableLength: 85 });
const m12 = await loadGroveModule('unitv2-m12', { cableLength: 100 });
const timer = await loadGroveModule('timercamera-x', { cableLength: 115 });
hub.get('grove-1').attach(camera);
hub.get('grove-2').attach(m12);
hub.get('grove-3').attach(timer);
host.on('input', event => externalFramework.acceptInputIntent(event));
// 每个渲染帧更新真实回弹、外驱角度过渡与线形
host.update(deltaSeconds);
```

每条线均为实际四芯外形，建立装配和输入路径，不执行通信。独立预览使用 `loadModel(id, options)`，装配使用 `loadGroveModule(id, options)`。USB-C 和机械安装件保持本款连接家族，不能接受 Grove 模块冒充。

真实控件路径：`m5camera-x`：`grove/grove-1/reset`；`unitv2-m12`：`grove/grove-2/user`；`timercamera-x`：`grove/grove-3/power` / `grove/grove-3/reset`。具体帽/弹性桥掩码、轴向、实际小柱塞与行程见各款冻结记录。

```js
// key 从上表选本款实际控件ID，prefix对应本款的HUB分支
const target = `${prefix}/${key}`;
host.handle({ type: 'button', target, action: 'press', source: 'agent:gesture-1' });
// 保持渲染循环更新，随后释放或取消同一输入源
host.handle({ type: 'button', target, action: 'release', source: 'agent:gesture-1' });
host.handle({ type: 'button', target, action: 'cancel', source: 'agent:gesture-1' });
```

任一输入源仍持有时保持按下，最后释放才回弹；`cancel` 不产生成功点击。原生一体帽按本款掩码/桥权重形变并精确恢复位置与法线，真实小柱塞随动；固定开关包体、端子、PCB、口和其余壳面保持。隐藏安装及推导行程不作为力学或制造认证。

## 手动焦环与独立蓝灯

UnitV2-M12 的 `focus` 仅外驱真实镜筒/焦环/玻璃转动，固定 sensor 载体、壳、接口和按键区域保持。默认静止，手动角度与按键按放互不重置。

```js
host.handle({
  type: 'joint',
  target: 'grove/grove-2/focus',
  angleDeg: 35,
  durationMs: 180,
});
// 无自动调焦、图像处理或螺纹轴向联动；角度由外部继续给定
```

焦环使用位置模式，演示角度不代表已测机械止挡；未知螺距/轴移行程不编联动，不能将它当自动电机设置转速。已有预览“可动部件”面板按实际 joint 动态生成角度控件，未在本批追加逐面浏览器验收。镜头版本和壳/光学高度差异见来源限制。

`timercamera-x` 实际固定蓝灯路径 `grove/grove-3/status` 仅接收本款冻结 `on` / `brightness` 字段，例如 `host.handle({type:'led',target:'grove/grove-3/status',brightness:.6})`；不把它当RGB灯，不回发输入或自动映射PWR/RESET/RTC。

## 实际配置与静态附件

| 型号 | 真实预设 | 默认参数 |
| --- | --- | --- |
| `m5camera-x` | `complete {"mount":"none"}`；`lego {"mount":"lego"}`；`wall1515 {"mount":"wall1515"}` | `{"mount":"none"}` |
| `unitv2-m12` | `regular-85 {"lens":"85"}` | `{"lens":"85"}` |
| `timercamera-x` | `complete {"mount":"none"}`；`two-ear {"mount":"two-ear"}`；`twin-hole {"mount":"twin-hole"}` | `{"mount":"none"}` |

| 型号 | 入口与附件导出别名 |
| --- | --- |
| `m5camera-x` | `M5CameraXUnit` ← `Model`；`M5CameraXUnitModule` ← `GroveModule`；`M5CameraXLegoClip` ← `LegoClip`；`M5CameraXWall1515` ← `Wall1515` |
| `unitv2-m12` | `UnitV2M12Unit` ← `Model`；`UnitV2M12UnitModule` ← `GroveModule` |
| `timercamera-x` | `TimerCameraXUnit` ← `Model`；`TimerCameraXUnitModule` ← `GroveModule`；`TimerCameraXTwoEarMount` ← `TwoEarMount`；`TimerCameraXTwinHoleMount` ← `TwinHoleMount` |

附件通过本款真实端口静态装拆，无铰链或自动运动。`port.detach({dispose:false})` 保留实际对象，之后 `port.attach(savedAccessory)` 恢复；默认拆除会释放对象。仅在本款同家族内连接，名称/原面数量与安装姿态按冻结来源。不能独立把 LEGO/Wall1515 名称关联到本款形状时，API 使用形状中性名并明确限制。

## 贴纸与无色压纹

本批 2 张普通 PNG 与实际标记同步：M5Camera-X0PNG，保本款真实无色native M5压纹，见[标记记录](research/m5camera-x/artwork.json)；UnitV2-M12 U078-M12 1张（`reference-redraw`），见[印刷记录](research/unitv2-m12/artwork.json)；TimerCamera-X U082-X 1张（`reference-redraw`），见[印刷记录](research/timercamera-x/artwork.json)。各款来源和载体分记。

M5Camera-X 保留已证无色 native M5 压纹，0PNG 是本体载体判断，不添贴膜、白墨或占位图。`artwork:false` 只去墨，保真实膜/压纹、光学/板/接收腔、所有物理 attributes/index/world 与实际部分按压/焦环运动。其余后标按清楚本款官图代码重绘，原图像素不作为贴纸裁切；不可辨微字与个体 QR/MAC/SN/账号省略。表格、私链接/原名/映射、矢量原稿、原始资料与生成中间件均不分发。

## 来源与限制

- [M5Camera-X U038](research/m5camera-x/sources.json)：自身 3194+1584 面闭合壳半复位，排异常 combined 件，保全部 4778 源面。官网误挂 TimerCamera-X 尺寸图已排除并反馈；原生 13.2mm 与名义 13mm 深分记。未装预留 MIC/BME280/MPU6050 和 GPIO14 文字不当成实际传感/外灯输出。
- [UnitV2-M12 U078-M12](research/unitv2-m12/sources.json)：自身 3044+2412 面壳与实际 M12 光学。原生壳 26mm、网页名义整机 32mm、尺寸图光学包络 33mm 分记；默认本款 85°版本和后膜厚度另记。150°有文献说明而无独立可归属几何，不用同一外形假称双镜头。后格栅/散热载体固定，缺本款转子/轴/外灯光路依据时不造输出或风扇关节。
- [TimerCamera-X U082-X](research/timercamera-x/sources.json)：自身 4452 完整原生面、66.5° OV3660 与 140mAh 身份，原生壳/含镜头高度分记。实际 PWR/针孔 RESET、蓝灯上三窗和本款安装件；不借 F 款 120°/270mAh 标签或模型。

新增代码 MIT，官方结构保留 MIT 归属，标识和印刷设计保留各自权利。隐藏板/封装/光学/膜/行程和装配支持为有来源的外观重建，不是完整 BOM、量产配合或硬件物理仿真。

必要验证：`node scripts/check-m5camerax-v2m12-timercamx-units.mjs`，覆盖实际三分支四芯、两入口/配置/去墨与部分真实动作、原生实体/开口壁/光学支撑、实际按放取消/独立外驱焦环/灯光、附件拆装、变父/peer/framebuffer与释放。证据见[本批进度](../artifacts/m5camerax-v2m12-timercamx-expansion/progress.json)。未运行浏览器/GPU、历史全量或实物验收。
