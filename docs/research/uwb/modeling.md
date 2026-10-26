# Unit UWB U100 外观模型

公开入口为 `src/units/uwb/index.js`，导出 `Model`、`GroveModule`、`spec`。当前为 `modeled`，未作逐面浏览器或实物验收。

尺寸采用本款官方产品页、尺寸图及原壳：模型轴 +X 向右、+Y 指向内置天线端、+Z 正面，24×48×8mm。保留本款 CAD 的完整组装 component0 共3796个三角，仅移动原点；另两个摆开的重复壳体不进入装配。两个Ø5安装通孔、Grove口、原生卡扣和壳体开口保留。

本款官方板照显示黑色载板、BU01模块、模块内置的平面铜天线、STM32封装、侧边两排六焊点、晶振、稳压器和蓝色Grove。它们有独立实体；背面固定螺钉与正背胶贴基底也有真实深度。正面原壳凹区由实际胶贴基底覆盖，贴图只负责其印刷。关闭 `artwork` 后不会留下贴纸所遮掩的装配缺口。隐藏封装安装高度与BU01背面的DW1000包络位置属于外观推导，不是生产装配或RF模型。

仅有一个真实公开组件 `grove`，针脚标签为 GND / 5V / UART_RX / UART_TX，接口朝-Y。未发现外露按键、指示灯光路、可拆外置天线或转子，不注册这些组件，也不人为增加测距数值 `sensor`。内置铜天线固定且不发光。

```js
import { Model, GroveModule } from './src/units/uwb/index.js';
const standalone = new Model();
const unit = new GroveModule({ cableLength: 60 });
host.port('grove').attach(unit);
// target前缀取主机端口id；这里主机端口命名为grove。
host.handle({ type: 'pose', target: 'grove/unitFrame',
  position: [10, 75, -5], rotation: [0.2, 0.1, 0] });
host.handle({ type: 'cable', target: 'grove/cable', slack: 18, bend: [0, 0, -1] });
host.update(1 / 60);
// 四条独立导线与两端插头跟随姿态；外驱不回送input。
const detached = host.port('grove').detach({ dispose: false });
detached.dispose();
```

正背两个普通PNG均为 `source-vector-raster`，来自匹配本款标准机身原稿，保留原色和轮廓，修复原始复合字腔的转换绕向。没有裁用产品照片，也没有默认混用包装或其他教育版。`new Model({artwork:false})` 与对应 `GroveModule` 会禁用印刷层，保留物理胶贴、壳体、PCB、封装与插口。

必要构造检查见 [smoke.json](smoke.json)：3796原壳三角、完整24×48×8包络、安装孔轴向贯通与FrontSide孔壁、PCB中心孔壁、胶贴基底和深腔背衬、四芯Grove姿态/独立装拆/释放、外驱无input回声，以及两入口的 artwork:false 物理attributes/index/matrixWorld一致。没有进行全量历史检查、逐面浏览器或生产配合验证。

测距、定位、AT指令、串口、RF、电气与固件行为由外部框架实现。公开模型只负责真实可见形状、连接与外部姿态；详细官方来源和推导范围见 [sources.json](sources.json)，贴纸范围见 [artwork.json](artwork.json)。
