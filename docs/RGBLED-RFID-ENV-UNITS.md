# RGB LED 10cm、RFID、ENV 原版接入

三款为 `modeled`，未逐面浏览器或实物验收。模型提供完整真实外观、接口/四芯线、15颗独立外驱灯窗与连续带形。UID/环境读数、采样、地址/协议、级联、电气、供电和固件由外部框架实现。

| 型号 / SKU | 实际端口 | 实际控件 / 外部输出 |
| --- | --- | --- |
| `rgb-led-10cm` / A035 | `grove` / `extension` | 控件无；灯15颗（ID见下文）；屏无；关节无 |
| `rfid` / U031 | `grove` | 控件无；灯无；屏无；关节无 |
| `env` / U001 | `grove` | 控件无；灯无；屏无；关节无 |

RFID只保MFRC522/天线/实际银膜/壳槽和支持，ENV只保DHT12/BMP280的实体/通气路径；没有因用途添加读数、发光槽、按钮或假传感状态。

## 四芯装配

```js
import {loadModel,loadGroveModule} from '../src/loaders.js';
const host=await loadModel('sticks3');
host.root;
const hub=await loadGroveModule('hub');
host.port('grove').attach(hub);
const strip=await loadGroveModule('rgb-led-10cm',{cableLength:85});
const rfid=await loadGroveModule('rfid',{cableLength:100});
const env=await loadGroveModule('env',{cableLength:115});
hub.get('grove-1').attach(strip);
hub.get('grove-2').attach(rfid);
hub.get('grove-3').attach(env);
host.update(deltaSeconds); // 每帧推进外部给定的视觉过渡、装配和实际四芯线形
```

独立预览使用 `loadModel(id,options)`，装配使用 `loadGroveModule(id,options)`。端口接合只建立可见机械装配和层级寻址，不执行读卡、采样或通信。灯带保当前官方实物白端板输入、黑端板延展方向，旧文冲突见来源；其他电气作用由框架实现。

## 灯带真实外驱形状

灯带的实际组件是 `flex`，kind 为 `flexible-strip`，通过外部命令指定中性轴总弯曲角。它没有虚构机械关节。

```js
host.handle({
  type:'flex', target:'grove/grove-1/flex',
  bendDeg:60, durationMs:180
});
host.update(deltaSeconds); // 每帧调用，单位秒；同时推进曲面、端板和四芯线
const flexState=host.get('grove/grove-1/flex').getState();
// bendDeg / targetBendDeg / transitioning / neutralAxisLengthMm / rangeDeg
```

独立 `Model` 或未接入主机的 `GroveModule` 使用 `target:'flex'`，并逐帧调用自身 `update(deltaSeconds)`。`bendDeg` 必须是 −120 至 120 的有限数，`durationMs` 是非负有限数；省略或设为 0 时立即到位。过渡按总角度线性插值，没有计时器或自主动画。此范围只约束当前展示模型，不代表硬件允许的弯折范围。

三个实际预设为 `straight`（0°）、`arc`（90°）及 `reverse`（−60°）。也可通过 `loadModel('rgb-led-10cm',{bendDeg:60})` 或 `loadGroveModule('rgb-led-10cm',{bendDeg:60})` 指定初态。官方只提供条带二维 100×10 mm；完整直态 10×137×7.5 mm、胶层及端板厚度均为明确标注的照片重建，官方三维名义尺寸保持未知。


连续FPC、背胶/离型纸和铜垫保留厚度；灯包保持刚性，由真实随形焊接支撑连接到曲面铜垫。两端板/接口按局部切向随动，Module四芯线在同帧跟随真实输入接口。中性轴长度保持100mm；展示弯曲范围和推导支撑不能视为额定半径、弹性力学或制造配合证明。默认没有自主弯曲或弹起动画。

## 15颗独立外驱灯

实际灯位ID按本款实体顺序如下，不代表已实现串行数据地址：

```js
const ledIds=["led-1","led-2","led-3","led-4","led-5","led-6","led-7","led-8","led-9","led-10","led-11","led-12","led-13","led-14","led-15"];
host.handle({type:'led',target:'grove/grove-1/led-1',color:'#ff6622',brightness:.65});
host.handle({type:'led',target:'grove/grove-1/led-1',on:false});
```

每颗仅改变自己的实际树脂窗材料，默认白色/0亮度。外部继续给定颜色序列，模型不自动彩虹、级联扩容、处理功耗或回发输入事件。弯曲和灯光状态互不重置，固定芯片/接口支持按实际形状保持。

## 实际配置与导出

| 型号 | 真实预设 | 默认参数 |
| --- | --- | --- |
| `rgb-led-10cm` | `straight {"bendDeg":0}`；`arc {"bendDeg":90}`；`reverse {"bendDeg":-60}` | `{"bendDeg":0}` |
| `rfid` | `complete {}` | `{}` |
| `env` | `complete {}` | `{}` |

| 型号 | 导出别名 |
| --- | --- |
| `rgb-led-10cm` | `RGBLED10cmUnit` ← `Model`；`RGBLED10cmUnitModule` ← `GroveModule` |
| `rfid` | `RFIDUnit` ← `Model`；`RFIDUnitModule` ← `GroveModule` |
| `env` | `ENVUnit` ← `Model`；`ENVUnitModule` ← `GroveModule` |

预览配置下拉可以直接选择直条或已实现的弯曲形状；逐帧过渡通过上述外部命令驱动，无需修改通用演示面板。未证实附件保持空座；不随RFID附卡或让ENV产生数据。

## 印刷与载体

本批 7 张普通PNG：`rgb-led-10cm` 3张（`reference-redraw`），见[本款印刷记录](research/rgb-led-10cm/artwork.json)；`rfid` 2张（`reference-redraw`），见[本款印刷记录](research/rfid/artwork.json)；`env` 2张（`reference-redraw`），见[本款印刷记录](research/env/artwork.json)。

清楚本款条带/端板丝印、RFID银前膜/后标、ENV后标/Q.C PASS膜按官方图准确代码重绘并注明来源。质检字样仅复现实物印刷。`artwork:false`只去墨，保真实连续基材/背胶/离型纸、PCB/灯包/焊接、银膜/背膜、孔槽壁和无色M5；实际配置及partial弯曲的全部物理attributes/index/world一致。PCB不额外造膜，不裁照片/借错款/猜微字或个体码、不以图片遮缺件。私CSV、私URL、原名/映射、矢量、原始官图/资料、生成器和中间件不分发。

## 来源与限制

- [A035 RGB LED 10cm/15LED](research/rgb-led-10cm/sources.json)：精确官方商店SKU映射10cm/15颗3535，100×10仅条带名义。双端板/插座及胶层厚度和完整装配包络据家族近照推导，29LED长条只作端板细节参考，不冒充本款灯数；不套A093防水5050。当前白输入/黑延展与旧文相反，冲突保留并已反馈。
- [原RFID U031](research/rfid/sources.json)：MFRC522、本款48×24×8表与模型轴24×48×8分记，完整壳/银膜/后膜/侧槽及实际支持。小侧槽用途未确认，隐藏封装/天线/板层为明确重建，不套U031-B/WS1850S。
- [原ENV U001](research/env/sources.json)：DHT12+BMP280，本款24.2×32.2×8.1、40交错通气真槽、实际感测栅壳/压力孔/板支持及红Grove。内部定位/壁/膜厚等推导单列，不拉伸BPS或ENV后代壳；没有数值传感器、I2C寄存器或固件。

三款均 `own-dimensional-parametric`，没有本款native面或完整BOM/制造fit声明。新编代码MIT，官方照片/图纸和第三方标识保留各自权利。

必要验证：`node scripts/check-rgbled-rfid-env-units.mjs`。覆盖本款闭合实体/FrontSide孔槽/支持、连续曲面与实际partial外驱/15材料、真实三分支四芯、两入口和配置去墨、变父/peer/framebuffer与资源释放。见[本批进度](../artifacts/rgbled-rfid-env-expansion/progress.json)。未运行浏览器/GPU、历史全量或实物验收。
