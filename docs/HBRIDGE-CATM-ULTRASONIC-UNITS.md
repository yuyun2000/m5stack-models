# HBridge / CatM GNSS / Ultrasonic-IO 接入

本批是原款HBridge U160、CatM GNSS U137和Ultrasonic-IO U098-B2，均为 `modeled`、`visual-only`。已有127→151款同步见[Git记录](GIT-SYNC-151-2026-10-27.md)；本批是随后本地增量。[本批检查点](../artifacts/hbridge-catm-ultrasonic-expansion/progress.json)记录必要检查、构建及资源字节范围，不表示浏览器/GPU、量产配合或实物验收。

| ID | 顶层导出 | 默认/真实附件 |
| --- | --- | --- |
| `hbridge` | `HbridgeUnit` / `HbridgeUnitModule` / `HbridgeTerminalPlug` | 前盖保留；四位插头默认不附，`terminalPlug:true`可装 |
| `catm-gnss` | `CatMGnssUnit` / `CatMGnssUnitModule` / `CatMLteAntenna` / `CatMGnssAntenna` | 后盖保留；LTE杆和GNSS同轴+puck分别选装 |
| `ultrasonic-io` | `UltrasonicIoUnit` / `UltrasonicIoUnitModule` | 后盖保留，无按键、灯、关节或sensor读数接口 |

各产品文件的原始导出为 `Model/GroveModule/spec`，HBridge另有 `TerminalPlug`，CatM另有 `LTEAntenna/GNSSAntenna`。使用按需loader可避免预加载全部产品。目录中的 `configurations` 是 `{id,name,options}` 数组；构造选项schema另列。

```js
import {loadModel,loadGroveModule} from '../src/loaders.js';
const host=await loadModel('sticks3');
const hub=await loadGroveModule('hub');
host.port('grove').attach(hub);
const hbridge=await loadGroveModule('hbridge',{
  frontCover:false,terminalPlug:true,cableLength:80
});
const catm=await loadGroveModule('catm-gnss',{
  lteAntenna:true,gnssAntenna:true,lteAngleDeg:45,cableLength:90
});
const sonic=await loadGroveModule('ultrasonic-io',{cableLength:100});
hub.port('grove-1').attach(hbridge);
hub.port('grove-2').attach(catm);
hub.port('grove-3').attach(sonic);
// 宿主循环调用host.update(dtSeconds)，渲染host.root。
```

GroveModule含四芯 `cable` 和外驱 `unitFrame`，不是传感器模拟。层级地址以真实端口路径为准，无额外 `unit/` 前缀：

```js
host.handle({type:'pose',target:'grove/grove-1/unitFrame',
  position:[-55,190,8],rotation:[0.1,-0.2,0.15]});
host.handle({type:'cable',target:'grove/grove-1/cable',slack:12,bend:[0,0,-1]});
```

## HBridge 原U160

端口为 `grove/terminal`。四位DIP `address-1`…`address-4` 和供电滑选 `source` 是真实稳定滑片，接口kind为button。每个组件的 `cap` 是移动片/杆，其底座、板和壳不随动。首次press切换档位，release/cancel保留已切档；多个输入源共享一次按下周期，最后一个释放才完成该周期。取消产生cancelled up且无click。

```js
const slide=hbridge.get('address-1');
slide.press('keyboard');
slide.release('keyboard');
slide.setPosition(0,{immediate:true});
host.handle({type:'button',target:'grove/grove-1/source',
  action:'position',position:1,immediate:true});
```

`frontCover:true` 时 `.interactive` 为false，pointer handlers不穿壳命中；外部press/release/cancel和position API仍保留。`frontCover:false` 仅去原前壳、前膜/印刷及对应固定螺钉三件，保其余物理与框架。它是装配服务配置，不是假透明外壳。

插头 `hbridge.port('terminal').module` 有 `screw-1`…`screw-4`，分别只旋转可见工具头。固定轴、孔壁、夹笼和簧片不动。`angleDeg/durationMs` 可外驱插值；不支持非零RPM或夹紧/轴向动作。`rangeDeg:null`，`visualRangeDeg:[-180,180]` 只是UI建议，不是实测止挡。

```js
host.handle({type:'joint',target:'grove/grove-1/terminal/screw-1',
  angleDeg:90,durationMs:250});
const plug=hbridge.port('terminal').detach({dispose:false});
hbridge.port('terminal').attach(plug);
```

原款保自身5592个原装壳三角面，不借U160-V11外置loose电容或贴纸。两张机身PNG按本款清楚官图代码重绘，[印刷来源](research/hbridge/artwork.json)记字体、颜色和配准推导。

## CatM GNSS U137

端口是 `grove/dc/lte/gnss`，`sim` 仅为真实MicroSIM侧槽的被动位置锚，无卡片或卡内容状态。双SMA附件可以独立装拆；它们与RP-SMA或Grove附件的家族不同，错误附件拒绝且保原连接。

```js
const lte=catm.port('lte').module;
const gnss=catm.port('gnss').module;
host.handle({type:'joint',target:'grove/grove-2/lte/tilt',
  angleDeg:60,durationMs:250});
host.handle({type:'pose',target:'grove/grove-2/gnss/puckPose',
  position:[60,110,12],rotation:[0.1,0,0.25]});
host.handle({type:'cable',target:'grove/grove-2/gnss/coax',
  points:[[0,20,0],[25,60,5],[45,90,8]]});
```

LTE只有真实肘部的 `tilt`，显示区间0…90度及尺寸/轴属于有来源的外观推导。固定螺母、耦合颈/叉/轴保持。Module用 `.get('tilt')` 访问，不能假定有 `.joint()` 方法。

GNSS `puckPose` 使用附件端口局部坐标，接受三维position和Euler rotation或归一化quaternion；它表达实物puck姿态，不是地理位置。`coax.points` 是1…24个有限三维**中间控制点**，SMA固定起点和puck真实入线端由模型绑定；改变puck姿态会重新连接末端。`coax` 为单根RF同轴，不能套用四芯Grove状态。标称1m保留为来源信息，当前显示曲线不求解恒长、碰撞或拉力。

U137以自身5284原装CAD面为源基准；运行5248面＝派生前壳2610＋原后壳2638。前壳2489面逐坐标保留，157面在左窗范围内变更为121面；后壳全保留。官方原CAD左SMA灰桥与本款官图的金色方座冲突，因此只在该窗内保留有记录的派生；最终运行面数、原面/派生面ID、原SHA、区域及未改后壳证据见[结构来源](research/catm-gnss/sources.json)与[必要检查](research/catm-gnss/smoke.json)。不能把运行壳写成全部原面保留。机身前后标和GNSS puck可读大字同步为普通PNG，[印刷来源](research/catm-gnss/artwork.json)区分重绘和推导；不编不可辨微字。NET/STA没有充分外部光路证据，内部载体保持不发光，不注册虚构灯。

## Ultrasonic-IO U098-B2

本体只注册 `grove`，GroveModule另有 `unitFrame/cable`。保自身5510原装壳面、GPIO板和黑Grove，以及两个有真实网孔/网壁的金属罐、深静态膜片和支撑；不借I2C版标签或把声学开口填成实心贴图。`rearCover:false` 只去原后壳、后膜/印刷及对应螺钉三件；其他物理逐件保持。

本款背标由有效本体矢量直接转换为1600×3600普通PNG，[来源](research/ultrasonic-io/artwork.json)只公开最终栅格和安全配准信息。没有声波动画、膜片运动、距离值、TRIG/ECHO时序或电气行为。官方PinMap与本款PORT.B照片/示例的冲突已记录，不将错表变成外观接口。

## 贴纸、事件与生命周期

所有入口及真实配置的 `artwork:false` 只去墨层；包括标签物理膜在内的全部物理attributes/index/world矩阵保持。原稿、CSV、私有URL/原稿名/映射、矢量、生成器和中间材料留在分发树外。

外部pose、joint、position及cable命令不回声为用户input；真实滑片press/release按输入意图发事件，不执行固件或电气逻辑。`detach({dispose:false})` 可重接；结束时dispose宿主会递归清理附件。下游框架负责马达、网络、RF/GNSS、声学、读数、协议和内部功能。

必要集成检查：`node scripts/check-hbridge-catm-ultrasonic-units.mjs`。检查使用Node canvas stub，不是GPU或实物验收；两份构建与5188目录/chunk/对应PNG源字节结果以本批检查点为准。
