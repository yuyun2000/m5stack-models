# CO2 · U103 · SCD40

本模型对应官方 Unit CO2 U103，使用 SCD40；不是 U104 CO2L/SCD41。保留官方 STL 已装配的完整双壳，含正面密集通风孔、两侧通风长槽、底部 Grove 开口、两处安装孔、后盖接缝与 M5 浮雕。模型内有实体 PCB、SCD40 基板/金属罐/白色保护膜、供电器件、螺钉，以及具有真实空槽、后壁、四触点和焊脚的红色 Grove 连接器。贴纸和微小丝印后置，不以图片遮盖缺件。

坐标使用 mm，+X 右、+Y 上、+Z 朝通风正面。官方尺寸 48×24×16 在模型坐标中为 24×48×16；原生 assembled component 0 只作 `[-240,0,5.2]` 平移归一化，不缩放或独立挪壳。两个直径 5 mm 安装孔位于 `[-8,-12]`、`[8,-12]`；孔距 16 mm、距底边 12 mm。Grove 口宽 10、高 5.2，端口原点 `[0,-23.65,-2.6]`，朝 −Y。

SCD4x 数据手册 v1.2（2022-05）第 20 页给出 10.1×10.1 mm 基板、0.8 mm 基板厚、5.5 mm 金属罐高度，以及 8.5/7.8 mm 罐宽。模型据此构造有厚度的封装和带极性缺角的白色膜片。PCB 轮廓与厚度、传感器安装位置和 Z、金属罐圆角/过渡、膜片形状与微小器件安装均是基于同 SKU 照片、原理图和壳体净空的外观重建，不能作为生产装配公差或气流模型。

`Model` 是独立物件；`GroveModule` 具有共享四芯实体线、双插头、Unit 姿态与线缆外驱接口。`sensor` 仅为 `role: 'visual-anchor'` 的定位组件。产品无外露机械控件，官方原理图也未示 LED，因此不虚构按键、灯效、CO₂/温湿度数值、I2C 或电气行为。

```js
import {Model, GroveModule} from './src/units/co2/index.js';
const standalone = new Model();
const unit = new GroveModule({cableLength: 60});
host.port('grove').attach(unit);
const sensorAnchor = host.get('grove/sensor');
host.handle({type:'pose', target:'grove/unitFrame',
  position:[12,70,-3], rotation:[.25,.1,-.3]});
host.port('grove').detach();
unit.dispose();
standalone.dispose();
```

2026-10-26 必要本地 smoke 通过：有限几何与包围盒、10 条安装孔贯穿射线、PCB 螺孔 FrontSide 内壁方向、通风孔后的实体白膜、Grove 开口后壁、四芯线与双插头、真实接入/姿态/嵌套寻址/拆离/资源释放。详见 `smoke.json`。按用户要求不进行浏览器逐面复核，状态为 `modeled`。

官方来源与文件指纹在 `sources.json`；壳体选择/坐标在 `src/units/co2/cad-map.json`。原始 CAD、MCP 返回、照片、PDF 和生成器位于仓库外，未作为公开素材分发。M5_Hardware 衍生几何保留 MIT 许可，见 `licenses/M5_Hardware-MIT.txt`。

## Reference-redrawn labels

The visible permanent label is now integrated. See [sticker update](./stickers.md) for exact official photo sources, readable transcription, limitations and local construction checks.
