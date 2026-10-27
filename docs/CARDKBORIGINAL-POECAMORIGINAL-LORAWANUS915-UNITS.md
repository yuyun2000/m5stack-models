# 原 CardKB、原 PoE CAM-W、LoRaWAN-US915 接入

三款均为 `modeled`，未逐面浏览器或实物验收。这里只实现完整外观、真实控件按放/回弹、实际线束及外部指定灯光；协议、图像/AI、电气、供电和固件由下游实现。

| 型号 / SKU | 本体实际组件与类型 | 接口 / 控件 / 输出 |
| --- | --- | --- |
| `cardkb-original` / U035 | `key-esc (button)` / `key-1 (button)` / `key-2 (button)` / `key-3 (button)` / `key-4 (button)` / `key-5 (button)` / `key-6 (button)` / `key-7 (button)` / `key-8 (button)` / `key-9 (button)` / `key-0 (button)` / `key-backspace (button)` / `key-tab (button)` / `key-q (button)` / `key-w (button)` / `key-e (button)` / `key-r (button)` / `key-t (button)` / `key-y (button)` / `key-u (button)` / `key-i (button)` / `key-o (button)` / `key-p (button)` / `key-fn (button)` / `key-shift (button)` / `key-a (button)` / `key-s (button)` / `key-d (button)` / `key-f (button)` / `key-g (button)` / `key-h (button)` / `key-j (button)` / `key-k (button)` / `key-l (button)` / `key-enter (button)` / `key-sym (button)` / `key-z (button)` / `key-x (button)` / `key-c (button)` / `key-v (button)` / `key-b (button)` / `key-n (button)` / `key-m (button)` / `key-comma (button)` / `key-period (button)` / `key-space (button)` / `key-up (button)` / `key-left (button)` / `key-right (button)` / `key-down (button)` / `rgb (led)` / `grove (port)` | 接口`grove`；控件`key-esc` / `key-1` / `key-2` / `key-3` / `key-4` / `key-5` / `key-6` / `key-7` / `key-8` / `key-9` / `key-0` / `key-backspace` / `key-tab` / `key-q` / `key-w` / `key-e` / `key-r` / `key-t` / `key-y` / `key-u` / `key-i` / `key-o` / `key-p` / `key-fn` / `key-shift` / `key-a` / `key-s` / `key-d` / `key-f` / `key-g` / `key-h` / `key-j` / `key-k` / `key-l` / `key-enter` / `key-sym` / `key-z` / `key-x` / `key-c` / `key-v` / `key-b` / `key-n` / `key-m` / `key-comma` / `key-period` / `key-space` / `key-up` / `key-left` / `key-right` / `key-down`；灯`rgb`；本体关节无；附件导出无；被动锚点无 |
| `poe-cam-w` / U121-B | `camera (component)` / `grove (port)` / `ethernet (port)` / `download-en (port)` / `download-uart (port)` / `user (button)` / `reset (button)` / `g0 (led)` / `link (led)` / `activity (led)` | 接口`grove` / `ethernet` / `download-en` / `download-uart`；控件`user` / `reset`；灯`g0` / `link` / `activity`；本体关节无；附件导出无；被动锚点`camera` |
| `lorawan-us915` / U184-US915 | `grove (port)` / `antenna (port)` | 接口`grove` / `antenna`；控件无；灯无；本体关节无；附件导出`Antenna`；被动锚点无 |

## 三分支机械装配

```js
import {loadModel,loadGroveModule} from '../src/loaders.js';
const host=await loadModel('sticks3');
host.root;
const hub=await loadGroveModule('hub');
host.port('grove').attach(hub);
const unit1=await loadGroveModule('cardkb-original',{});
hub.get('grove-1').attach(unit1);
const unit2=await loadGroveModule('poe-cam-w',{});
hub.get('grove-2').attach(unit2);
const unit3=await loadGroveModule('lorawan-us915',{});
hub.get('grove-3').attach(unit3);
host.update(deltaSeconds); // 每帧时间为秒
```

每款按本体真实接口与四芯线束接入，完整地址是 `grove/grove-N/组件id`。这是机械场景，不声明物理总线兼容任意级联。下方作者单品示例各自独立执行，其控件、灯、端口和预设均依冻结实现。

## Unit CardKB (original MEGA328P U035)

导出 `Model`、`GroveModule`、`spec`、`KEYS`、`KEYMAP`、`defaults`、`configurationSchema`、`configurations`；默认导出 `Model`。本款是原 MEGA328P U035，不能替代已覆盖的 U035-B/v1.1 ATMega8A 或 CardKB2。表88×54×5与自身照片84×54存在冲突；本模型以表格比例作暂定外观依据，实际推导88×54×5.15。不能把这理解成PCB/外包络差异已有证据，也不是制造基准。

真实独立按键 ID 是 `key-esc`、`key-1`…`key-0`、`key-backspace`、`key-tab`、`key-q`…`key-p`、`key-fn`、`key-shift`、`key-a`…`key-l`、`key-enter`、`key-sym`、`key-z`…`key-m`、`key-comma`、`key-period`、`key-space`，以及左下 `key-up`、`key-left`、`key-right`、`key-down`，共50个。每键只有实际圆金属帽和杆沿−Z移动0.18mm；固定框、PCB、焊脚、接点不随动。按下源可叠加，最后源释放才弹起；cancel不发click，longpress关闭。Model有KEYMAP，模块由调用方显式映射带前缀路径。

```js
const keyboard = new GroveModule({cableLength:80});
hub.get('grove-1').attach(keyboard);
host.handle({type:'button', target:'grove/grove-1/key-q', action:'press', source:'sim:q'});
host.update(0.02);
host.handle({type:'button', target:'grove/grove-1/key-q', action:'cancel', source:'sim:q'});
host.handle({type:'led', target:'grove/grove-1/rgb', color:'#30a0ff', brightness:0.5});
host.handle({type:'pose', target:'grove/grove-1/unitFrame', position:[35,195,8], rotation:[0.1,-0.2,0.15]});
host.handle({type:'cable', target:'grove/grove-1/cable', slack:12, bend:[0,0,-1]});
```

`rgb`只有一个外驱RGB，不随按键、Shift/Sym/Fn或时间自动改变。`grove`是真4P接收座，有深腔/保持接点/回弯/穿板尾/镀孔，模块`cable`是真四芯、两插头外观，`unitFrame`支持pose。I2C 0x5F和IO13只作官方资料注释；没有矩阵扫描、ASCII、HID、组合键/锁定、协议、电源或固件行为。

配置只有 `complete:{}`，defaults为 `{}`。`artwork:false`只去除1张透明高清PCB字样PNG形成的1处印刷面，50个真实帽、开关、板、RGB、铜/孔/接口与支撑全部保留；所有50帽的部分运动也通过attrs/index/world一致性检查。印刷按自身照片重绘，字体/尺寸/注册明确近似；金属帽上没有贴字。导航区不清楚字形、MCU微字、宣传标题/外部标注与组合键教程没有贴到板上。私表原稿0匹配，私CSV/矢量/映射/原图/生成器不公开。

只有照片清楚定位的左上1个大安装孔和6个ISP镀孔做成真实通孔。旧文档“两Lego孔”仍保留为未解差异，没有对称补造第二孔。870闭合正体积FrontSide实体/75880三角、真实Model与StickS3→HUB1、50键独立/多源取消/回弹、RGB/noecho、变姿/四芯端点/HUB3换父级、同级与framebuffer隔离、拆装及资源释放均通过必要Node检查。未声明GPU、实物、完整BOM、材料或制造配合验收。

## Unit PoE CAM-W (original OV2640 U121-B)

`poe-cam-w` 对应原 U121-B / OV2640，主体依次为 `camera`（被动 component）、`grove`、`ethernet`、`download-en`、`download-uart`（4 个真实物理 port）、`user`、`reset`（button）和 `g0`、`link`、`activity`（固定蓝/黄/绿 led）；模块追加 `unitFrame` 与 `cable`。默认省略 Stand/Brick，没有 SK6812、视频 Display、传感器或关节 API。

```text
grove/grove-2/camera         # 原 OV2640 / 65° 被动光学帧
grove/grove-2/grove          # 实际 EXT_PORT 白色四芯口
grove/grove-2/ethernet       # 八接点深 RJ45 物理口
grove/grove-2/download-en    # 实际 GND/G0/EN 三针母座
grove/grove-2/download-uart  # 实际 3V3/TX/RX 三针母座
grove/grove-2/user           # 实际 G37 侧帽/跟杆
grove/grove-2/reset          # 实际后部 recessed RESET 帽杆
grove/grove-2/g0             # 仅外驱蓝色 D8 外观
grove/grove-2/link           # 仅外驱黄色 D2 外观
grove/grove-2/activity       # 仅外驱绿色 D1 外观
grove/grove-2/unitFrame      # 完整 Unit 外驱姿态
grove/grove-2/cable          # 四芯线外驱形状
```

```js
host.handle({type:'button',target:'grove/grove-2/user',action:'press',source:'operator:a'});
host.handle({type:'button',target:'grove/grove-2/user',action:'release',source:'operator:a'});
// 失焦/取消用 action:'cancel'，抑制 click；多源最后撤源才回弹。
host.handle({type:'button',target:'grove/grove-2/reset',action:'state'});
host.handle({type:'led',target:'grove/grove-2/link',on:true,brightness:.4});
host.handle({type:'pose',target:'grove/grove-2/unitFrame',position:[55,174,19],rotation:[.15,-.29,.24]});
host.handle({type:'cable',target:'grove/grove-2/cable',slack:12,bend:[0,0,-1]});
host.update(deltaSeconds); // 秒数，只推进外观帽杆，不执行设备固件。
```

G37 只移动实际帽/跟杆 2 个实体，推导轴 `[1,0,0]`、行程 `0.25` mm；RESET 只移动实际帽/杆 2 个实体，推导轴 `[0,0,1]`、行程 `0.18` mm。固定框、止挡、端子、PCB/PoE、相机、所有接口与 peer 保持固定。`down/up/click/longpress` 仅输入意图。独立 Model 的 `Space→user`、`KeyR→reset` 默认键位有效；模块不自动注册主机键位，由调用方显式设置完整路径。

灯只接受外部 on/brightness；颜色固定为真实蓝、黄、绿，传入 color 会忽略；默认亮度 0，不依据用户键、RESET、连接网线、PoE、Wi-Fi、启动或固件自动点亮。相机 `getState()` 为 `{}`，不可交互，无图像、视频、焦点或 AI；四个口仅表示实际机械接收结构，不模拟供电、网络、GPIO、UART、I2C 或下载协议。没有 mount port 或附件导出。

唯一实际预设是 `complete` 的 `{}`；`artwork:false` 只去后标墨，保留真实 die-cut 膜、完整后壳、PCB/PoE 深托底、真实孔壁、四夹槽保持件、端子和无色 M5。1 张普通 `reference-redraw` PNG，默认 1 个 panel；未知认证微字/个体码省略，未裁照片，原稿 0。原尺寸 64×24×18 mm 对应模型 `[24,64,18]`；壳壁、隐藏安装/BOM、光学栈、接点/光路/行程和膜厚均为本款来源推导，无制造配合或实物验收声明。

## Unit LoRaWAN-US915 U184-US915

默认显示自身195mm胶棒天线和官图90°折起态；可选择 `straight-antenna` `{antennaFoldDeg:0}` 直立，或 `without-antenna` `{antenna:false}` 看实际空SMA座。本体无按钮或灯；顶部金色小窗是SMA保持螺母。壳长64mm，71.4mm是含SMA的本体总长，195mm天线另算。

真实折肘关节属于可拆 `Antenna` 模块，自身ID `fold`；独立Model路径 **`antenna/fold`**，StickS3→HUB第3路路径 **`grove/grove-3/antenna/fold`**。外驱例：`{type:'joint',target:'antenna/fold',angleDeg:45,durationMs:200}`；宿主例把target替换为完整HUB路径即可。0°直立，90°折起，0..90仅展示范围；照片确认铰节，轴位/限位/制造配合是推导。只有真实活动毂/臂/胶棒移动，SMA帽/受针接点/深止挡/保持颊/轴不动，没有RPM、伺服或自动无线行为。

`unit.get('antenna').detach({dispose:false})` 拆下后可保留实例并 `unit.get('antenna').attach(antenna)` 重装；普通detach默认处置附件。`Antenna`构造选项为 `{foldDeg:90}`。本体own joints为空，已装附件时递归joint列表包含antenna/fold，移除时没有该路径。

GroveModule实际四芯两插头，canonical为grove。HUB第3路的本体端口 `grove/grove-3/grove`/`grove/grove-3/antenna`，姿态 `grove/grove-3/unitFrame`，线缆 `grove/grove-3/cable`。外驱pose/cable无输入echo；不模拟UART/AT/LoRa/功耗/射频/固件。

两面普通PNG按本款官图独立重绘并标源；`artwork:false`仅去墨，保留两实体膜、原生凹槽底和全部物理geometry。两入口所有3配置及部分折转都验证了attributes/index/world严格一致。新代码MIT、原生壳MIT Copyright2021M5Stack，原图和私表/矢量不发布。CPU检查不等于浏览器GPU或实物制造/射频验收。

自身官图own10支持本体实心中心针；附件内部受针腔/止挡、精确尺寸/极性/配合均为推导。2026-10-27更正单独记录，batch51旧快照保留。

当前中心接点更正见[独立更正说明](US915-SMA-AMENDMENT-2026-10-27.md)和[当前实际无loader receipt](research/lorawan-us915/sma-amendment-2026-10-27-smoke.json)；专项 `node scripts/check-lorawan-us915-sma-amendment.mjs`。构建与最终证据见[当前progress](../artifacts/us915-sma-amendment-2026-10-27/progress.json)。[51批progress](../artifacts/cardkboriginal-poecamoriginal-lorawanus915-expansion/progress.json)仅为旧快照，不覆盖当前SMA更正；51/52旧helper/freeze/progress保持。

## 实际预设与构造导出

| 型号 | 真实预设 | 默认参数 |
| --- | --- | --- |
| `cardkb-original` | `complete {}` | `{}` |
| `poe-cam-w` | `complete {}` | `{}` |
| `lorawan-us915` | `complete {}`；`straight-antenna {"antennaFoldDeg":0}`；`without-antenna {"antenna":false}` | `{"antenna":true,"antennaFoldDeg":90}` |

| 型号 | 导出别名 |
| --- | --- |
| `cardkb-original` | `CardKBOriginalUnit` ← `Model`；`CardKBOriginalUnitModule` ← `GroveModule` |
| `poe-cam-w` | `PoECAMWOriginalUnit` ← `Model`；`PoECAMWOriginalUnitModule` ← `GroveModule` |
| `lorawan-us915` | `LoRaWANUS915Unit` ← `Model`；`LoRaWANUS915UnitModule` ← `GroveModule`；`LoRaWANUS915UnitAntenna` ← `Antenna` |

独立入口 `loadModel(id,options)`，装配入口 `loadGroveModule(id,options)`；每帧调用 `host.update(deltaSeconds)`，输入事件只表示意图，灯光由外部驱动。所有隐藏安装/行程/接点/光学/配合是外观推导，不能当额定硬件或制造基准。

## 同步印刷与来源

- `cardkb-original`：1张；`reference-redraw`。[来源与余缺](research/cardkb-original/artwork.json)。
- `poe-cam-w`：1张；`reference-redraw`。[来源与余缺](research/poe-cam-w/artwork.json)。
- `lorawan-us915`：2张；`reference-redraw`。[来源与余缺](research/lorawan-us915/artwork.json)。

`artwork:false` 只去墨，保留实体壳/PCB/标签基材、端子和承托及全部物理运动。普通PNG准确重绘本款清楚字样，不裁照片、不借包装/错代、不猜微字/个体码、不用图遮缺件。私CSV/URL/原名/映射/矢量/原始图文/生成器/中间件均不分发；新代码MIT，原native保原MIT，源图文和商标各保权利。

- [cardkb-original 来源与边界](research/cardkb-original/sources.json)
- [poe-cam-w 来源与边界](research/poe-cam-w/sources.json)
- [lorawan-us915 来源与边界](research/lorawan-us915/sources.json)

必要本批检查：`node scripts/check-cardkboriginal-poecamoriginal-lorawanus915-units.mjs`。覆盖真实闭合/FrontSide孔壁/承托、两入口/实际预设去墨全attrs/index/world、局部动作/外驱灯、四芯接线/层级寻址、变父/peer/framebuffer/noecho/释放。见[51批历史进度](../artifacts/cardkboriginal-poecamoriginal-lorawanus915-expansion/progress.json)。未逐面浏览器/GPU/历史全量/实物或制造配合验收。
