# LoRaWAN AS923 / EU868 接入

两款均为 `modeled`，未逐面浏览器或实物验收。这里只实现各自完整native外观、实际接口/天线附件及真实机械动作；RF、UART/AT、协议、电气和固件由下游实现。

| 型号 / SKU | 本体实际组件与类型 | 接口 / 控件 / 输出 |
| --- | --- | --- |
| `lorawan-as923` / U184-AS923 | `grove (port)` / `antenna (port)` | 接口`grove` / `antenna`；控件无；灯无；本体关节无；附件导出`Antenna`；被动锚点无 |
| `lorawan-eu868` / U184-EU868 | `grove (port)` / `antenna (port)` | 接口`grove` / `antenna`；控件无；灯无；本体关节无；附件导出`Antenna`；被动锚点无 |

## 两分支机械装配

```js
import {loadModel,loadGroveModule} from '../src/loaders.js';
const host=await loadModel('sticks3');
host.root;
const hub=await loadGroveModule('hub');
host.port('grove').attach(hub);
const unit1=await loadGroveModule('lorawan-as923',{});
hub.get('grove-1').attach(unit1);
const unit2=await loadGroveModule('lorawan-eu868',{});
hub.get('grove-2').attach(unit2);
host.update(deltaSeconds); // 每帧时间为秒
```

每款按本体真实接口与四芯线束接入，完整地址是 `grove/grove-N/组件id`。这是机械场景，不声明物理总线兼容任意级联。下方作者单品示例各自独立执行，其控件、灯、端口和预设均依冻结实现。

## Unit LoRaWAN-AS923

默认自身195mm/2.3dBi天线，90°官图折起；straight-antenna `{antennaFoldDeg:0}` 直立，without-antenna `{antenna:false}` 为实际本体/SMA空接合。壳长64mm，本体含SMA71.4mm，天线另算。本体0灯0按钮，金窗是真SMA保持件。

Antenna导出模块自己的真实关节为fold，本体ownjoints=[]。独立Model路径 **antenna/fold**，StickS3→HUB第1路 **grove/grove-1/antenna/fold**。外驱 `{type:'joint',target:'antenna/fold',angleDeg:45,durationMs:200}`；宿主替换完整target。0直立、90折起，0..90仅推导展示限值，照片证明铰节但不证明额定限位/轴位/制造配合。仅活动毂/臂/胶棒动，帽/受腔/介质/轴/颊固定，无RPM或自动行为。

`unit.get('antenna').detach({dispose:false})` 可保留实际附件，`unit.get('antenna').attach(antenna)` 重装保留fold状态；普通detach默认处置。Antenna构造选项 `{foldDeg:90}`。移除附件后antenna/fold路径不存在。GroveModule实际四芯/canonical=grove，HUB1的unitFrame/cable完整路径为grove/grove-1/unitFrame和grove/grove-1/cable。

own10明确可见凸出中央金属接点，本款据图建中心针与推导互补受针腔，区别51空心接点推导；不改51，也不认证SMA/RP-SMA极性/生产螺纹配合。两面橙AS923普通PNG由own8/own9准确重绘，私源批准0且本作者未读私表/矢量。artwork:false仅去墨，保留两实体膜/原凹槽底/全部物理geometry；两入口3配置和部分折转全attrs/index/world严格一致。新代码及原native按MIT声明，CPU检查不等于GPU/实物/制造/射频验收。

## Unit LoRaWAN-EU868

默认显示自身195mm胶棒天线和官图90°折起态；可选择 `straight-antenna` `{antennaFoldDeg:0}` 直立，或 `without-antenna` `{antenna:false}` 看实际空SMA座。本体无按钮或灯；顶部金色小窗是SMA保持螺母。壳长64mm，71.4mm是含SMA的本体总长，195mm天线另算。

真实折肘关节属于可拆 `Antenna` 模块，自身ID `fold`；独立Model路径 **`antenna/fold`**，StickS3→HUB第2路路径 **`grove/grove-2/antenna/fold`**。外驱例：`{type:'joint',target:'antenna/fold',angleDeg:45,durationMs:200}`；宿主例把target替换为完整HUB路径即可。0°直立，90°折起，0..90仅展示范围；照片确认铰节，轴位/限位/制造配合是推导。只有真实活动毂/臂/胶棒移动，SMA帽/中心针/保持颊/轴不动，没有RPM、伺服或自动无线行为。

`unit.get('antenna').detach({dispose:false})` 拆下后可保留实例并 `unit.get('antenna').attach(antenna)` 重装；普通detach默认处置附件。`Antenna`构造选项为 `{foldDeg:90}`。本体own joints为空，已装附件时递归joint列表包含antenna/fold，移除时没有该路径。

GroveModule实际四芯两插头，canonical为grove。HUB第2路的本体端口 `grove/grove-2/grove`/`grove/grove-2/antenna`，姿态 `grove/grove-2/unitFrame`，线缆 `grove/grove-2/cable`。外驱pose/cable无输入echo；不模拟UART/AT/LoRa/功耗/射频/固件。

两面普通PNG按本款官图独立重绘并标源；`artwork:false`仅去墨，保留两实体膜、原生凹槽底和全部物理geometry。本款own10为凸出实心针，附件是有深止挡的空心接收腔，径向0.06mm为外观推导，不认证标准极性/螺纹fit；文档SMA内针原文不改变照片显示的结构。两入口所有3配置及部分折转都验证了attributes/index/world严格一致。新代码MIT、原生壳MIT Copyright2021M5Stack，原图和私表/矢量不发布。CPU检查不等于浏览器GPU或实物制造/射频验收。

## 实际预设与构造导出

| 型号 | 真实预设 | 默认参数 |
| --- | --- | --- |
| `lorawan-as923` | `complete {}`；`straight-antenna {"antennaFoldDeg":0}`；`without-antenna {"antenna":false}` | `{"antenna":true,"antennaFoldDeg":90}` |
| `lorawan-eu868` | `complete {}`；`straight-antenna {"antennaFoldDeg":0}`；`without-antenna {"antenna":false}` | `{"antenna":true,"antennaFoldDeg":90}` |

| 型号 | 导出别名 |
| --- | --- |
| `lorawan-as923` | `LoRaWANAS923Unit` ← `Model`；`LoRaWANAS923UnitModule` ← `GroveModule`；`LoRaWANAS923UnitAntenna` ← `Antenna` |
| `lorawan-eu868` | `LoRaWANEU868Unit` ← `Model`；`LoRaWANEU868UnitModule` ← `GroveModule`；`LoRaWANEU868UnitAntenna` ← `Antenna` |

独立入口 `loadModel(id,options)`，装配入口 `loadGroveModule(id,options)`；每帧调用 `host.update(deltaSeconds)`，输入事件只表示意图，灯光由外部驱动。所有隐藏安装/行程/接点/光学/配合是外观推导，不能当额定硬件或制造基准。

## 同步印刷与来源

- `lorawan-as923`：2张；`reference-redraw`。[来源与余缺](research/lorawan-as923/artwork.json)。
- `lorawan-eu868`：2张；`reference-redraw`。[来源与余缺](research/lorawan-eu868/artwork.json)。

`artwork:false` 只去墨，保留实体壳/PCB/标签基材、端子和承托及全部物理运动。普通PNG准确重绘本款清楚字样，不裁照片、不借包装/错代、不猜微字/个体码、不用图遮缺件。私CSV/URL/原名/映射/矢量/原始图文/生成器/中间件均不分发；新代码MIT，原native保原MIT，源图文和商标各保权利。

- [lorawan-as923 来源与边界](research/lorawan-as923/sources.json)
- [lorawan-eu868 来源与边界](research/lorawan-eu868/sources.json)

必要本批检查：`node scripts/check-lorawan-as923-eu868-units.mjs`。覆盖真实闭合/FrontSide孔壁/承托、两入口/实际预设去墨全attrs/index/world、真实附件及递归关节部分动作、四芯接线/层级寻址、变父/peer/framebuffer/noecho/释放。见[本批进度](../artifacts/lorawan-as923-eu868-expansion/progress.json)。未逐面浏览器/GPU/历史全量/实物或制造配合验收。
