# Unit LoRaE220-920 (U170)

2026-10-26；状态 `modeled`，几何/API 已做必要局部检查，未进行浏览器逐面或实物验收。

## 依据与尺寸

先查询 M5Stack 官方 MCP `Unit LoRaE220-920 U170 dimensions antenna connectors button LED`，交叉读取本款官方照片、尺寸图和原理图，再复查本款模式说明。准确型号为 U170 / E220-900T22S(JP)，不混入 U170-433、旧 LoRa 或 LoRaWAN。来源和校验记录见 [sources.json](./sources.json)。原文、CAD、照片和生成中间文件不分发。

厂家 71.4 × 24 × 8 mm；模型轴为 X24 × Y71.4 × Z8 mm。图纸明确壳长64 mm、含SMA长71.4 mm，均不含随附天线。原壳在一个共同平移后保持 X[-12,12]、Y[-32,32]、Z[-4,4]；含SMA的Y上限39.4。螺孔间距16 mm，通孔Ø4.85；原壳接合段和外口的扩孔照原件保留，未用统一半径替换。

官方完整装配壳 component0 的6614三角全部保留，scale1，共同原点平移[12,32,0.4]；components1/2是平移展开的前后复制壳，排除。DIP、Grove、前后SMA保持窗、背面紧固凹位和通孔均未切改。来源不可变SHA见 [cad-map.json](../../../src/units/lora-e220-920/cad-map.json)。

## 实体闭合与运动

真实PCB有Grove凹位、中央紧固孔和两侧装配孔让位。独立建出 E220-900T22S(JP) 绿基板、金属屏蔽壳、两排11个焊端、C1/C2外形、IPEX和黑同轴。隐藏布板/器件尺寸、位置与高度为照片推导，不声称生产装配或电气拓扑。

蓝色HY2.0-4P座有真实深度、锁肩、壁和四触点；静态标签按照本款官方表为GND、5V、UART_RX、UART_TX。SMA母座有实体螺旋外牙、保持六角体、PTFE、凹进的空心母触点及止底。原壳两保持窗后方是实际金属件。螺纹、接触深度、同轴路线及公母套接留隙为视觉推导，不表示配合公差。

S1有独立固定底座、两个实槽顶板与两个白色保留滑块。`mode-0` / `mode-1` 使用 `Button(latching:true)`，档位0为下端、1为上端，Y向位移1.2 mm。按下切换一次、多个输入源共同保持、弹起后停留；取消仅取消click意图，不回弹稳定档位。位置和行程来自照片/原壳窗推导。外驱 `position` 不发输入回声。固定ON/1/2印字属于贴纸层，滑块不被贴纸代替。

随附黑胶棒天线在本款官方包装图中明确有折叠铰链；独立 `Antenna` 模块包含实际SMA公针、开放套筒和内牙、固定颈和铰链叉、移动节/杆/封闭圆顶。厂家总长110 mm已保留；本模型从套筒口Y-6.5至直立顶Y103.5，实际套接约6.5 mm，未取得生产装配尺寸。直立安装后的整体包络约24 × 174.9 × 9.67 mm。唯一关节 `tilt` 围绕X，单位degree，视觉区间0–90，对应照片可见直立/90度折弯姿态；该区间不是已测机械极限。不加普通天线自转、自动扫动、收发、射频场或电气功能。

## 接入方式

```js
import { Model, GroveModule, Antenna } from './src/units/lora-e220-920/index.js';
const unit = new Model({ antenna: true, antennaAngleDeg: 0 });
unit.handle({ type: 'position', target: 'mode-0', position: 1, immediate: true });
unit.handle({ type: 'joint', target: 'sma/tilt', angleDeg: 90, durationMs: 250 });
// 构造器默认裸本体；预览配置首项为随附天线。
const separate = unit.port('sma').detach({ dispose: false });
unit.port('sma').attach(separate);
// 手动创建也可：unit.port('sma').attach(new Antenna({ angleDeg: 45 }));
// GroveModule通过现有主机Grove Port接入，支持四芯线、unitFrame pose。
```

`Antenna.meta.connector` 为 `sma-female`，表示它接入的Port家族，以符合现有 `Port.accepts` 的匹配契约；`physicalConnector:'sma-male'` 明确附件自身实际公针结构。`sma` Port自身仍为 `sma-female`，拒绝Grove附件。天线拆离保持固定本体、DIP、Grove和线缆，不自动改变天线角度。Unit拆离保持另一Unit的独立线缆和姿态。`antenna:false` 与 `antenna:true` 都可用 `artwork:false`，不改变物理几何或世界姿态。

被动 `sensor` 只作外观锚点。固件框架负责UART、M0/M1解释、模式、WOR、收发、频率、RSSI、电源与所有电气行为。模型无相关命令；本款没有已证外露灯，不造灯或灯联动。

## 贴纸和资料歧义

三个最终PNG为 `reference-redraw`：本款正面LoRa920/认证、背面型号/模式/UART、S1固定ON1/2。全部由代码绘制文字/线条/色块后栅格化；没有产品照片裁切，不以印图遮住实体缺件。完整原稿、私有表、矢量和生成器不公开。排版、字体、颜色和安装位置为推导，未做逐张浏览器复核。详见 [artwork.json](./artwork.json)。

本款官方当前模式表称 normal为OFF/OFF、config为ON/ON，脚注又说ON=0、OFF=1；同页背贴写normal M0=0/M1=0、config M0=1/M1=1，示意图的ON位置也需区分输入逻辑。复查官方MCP和实时英文页面后提交反馈 `00ea6ae3dfc5419192d9e28306a0bdbe`。模型保留照片静态印字，档位只表达物理上/下，不把这些资料歧义变成固件逻辑。

## 验证边界

[smoke.json](./smoke.json) 记录完整原壳、有限FrontSide几何、10条通孔射线和8条实际孔壁、SMA母孔/公针、开口后实体、两DIP稳定位置/按放取消、外驱无回声、天线真实杆顶世界位移/固定配合帧不动、四芯线/嵌套路由/独立拆离/233资源生命周期，以及三个贴纸开关前后全部物理attributes/index/matrixWorld一致。未做全历史检查、浏览器逐面、实物、射频、固件、电气或生产公差验收。下一步在获得实际装配图时替换隐藏与天线安装推导。
