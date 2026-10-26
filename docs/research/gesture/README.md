# Gesture · U127

模型保留 U127 官方 STL 的完整前后壳、椭圆光窗、两侧卡扣、后盖 M5 浮雕、安装孔和 Grove 开口。光窗后有实体 PCB、PAJ7620U2 封装、凹陷发射器与接收镜头；连接器具有真实开顶槽、后壁、触点和焊脚。贴纸本轮后置，壳体闭合不依赖图片或遮挡平面。

坐标为 mm，+X 右、+Y 上、+Z 光学正面。官方外形为 24×32×8；两个 5 mm 安装孔位于 `[-8,-4]`、`[8,-4]`，孔距 16、距底部 12。光窗为 12×6 胶囊形，中心 `[0,8]`。Grove 口为 10×5.2，模型端口原点 `[0,-15.65,1.4]`，朝 −Y。CAD 两壳的 X 中心存在约 0.00061 mm 原生偏差，保留原始装配，整体 X 包围盒因此为 24.00061。

PAJ7620U2 机械图提供 5.2×3 封装轮廓、1.88 主体和 0.32 基板高度。本模型以这些数值构造有厚度的封装；安装 Z、PCB 轮廓和厚度、光学浅凹的微细形状、接收镜头和发射器材质为同版本照片的外观推导，不能用作生产装配或光学标定。

`Model` 是独立物件；`GroveModule` 使用共享四芯实线及双插头，可挂入主机的 Grove Port。`sensor` 是 `role: 'visual-anchor'` 的定位组件，没有传感器命令。该产品没有外露机械按键或转轴，因此不虚构按键和手势驱动动画；手势识别、传感器数值、I2C、电气和自动发光由外部框架负责。

```js
import {Model, GroveModule} from './src/units/gesture/index.js';

const standalone = new Model();
const unit = new GroveModule({cableLength: 60});
host.port('grove').attach(unit);
const opticalAnchor = host.get('grove/sensor');
host.handle({type: 'pose', target: 'grove/unitFrame',
  position: [12, 70, -3], rotation: [.25, .1, -.3]});
host.handle({type: 'cable', target: 'grove/cable', slack: 14, bend: [0, 0, -1]});
host.port('grove').detach();
unit.dispose();
standalone.dispose();
```

2026-10-26 必要本地 smoke 通过：尺寸、有限几何、安装孔贯穿、PCB 孔壁朝向、光窗后的真实实体、Grove 朝向和口后实体、四芯线、嵌套地址、实际接入/姿态/拆离/资源释放。详见 `smoke.json`。按用户要求未进行浏览器逐面复核，状态为 `modeled`。

官方来源与指纹见 `sources.json`，壳体选择/坐标变换见 `src/units/gesture/cad-map.json`。原始 STL、照片、芯片 PDF 和 MCP 响应不随公开包分发。M5_Hardware 衍生几何保留 MIT 许可，见 `licenses/M5_Hardware-MIT.txt`。

## Reference-redrawn labels

The visible permanent label is now integrated. See [sticker update](./stickers.md) for exact official photo sources, readable transcription, limitations and local construction checks.
