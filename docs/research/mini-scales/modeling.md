# Unit Mini Scales U177

2026-10-26：依据官方 M5Stack MCP 产品文档、U177 尺寸图、同 SKU 照片和固定提交的官方结构文件建模。状态为 `modeled`。按用户要求只做必要局部结构/API smoke，未做逐面浏览器验收。

- 官方产品页：<https://docs.m5stack.com/en/unit/Unit-Mini%20Scales>
- 官方结构：<https://github.com/m5stack/M5_Hardware/blob/e29c139cbc7c80b5ccc5557e5ab8025a7a19a109/Products/U177_Unit_Mini_Scales/Structures/Unit_Mini_Scales.stl>
- 官方尺寸图：<https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/748/U177_miniscale_asm_v1_page_01.png>
- 官方载荷片图纸：<https://m5stack.oss-cn-shenzhen.aliyuncs.com/resource/docs/products/unit/Unit-MiniScales/CZL928MC-Model.pdf>

产品名义尺寸 24 × 40 × 18 mm；CAD 圆角处的实际包围盒为 23.976 × 39.976 × 18 mm，保持原比例。坐标为 +X 右、+Y 功能键端、−Y Grove、+Z 秤台。源 STL 中 0/3/4 构成装配，4 又包含接触合并的内盖与载荷片。模型使用分开展示的 5/6 精确平移回装配位置，分别赋予塑料、金属和应变片覆盖层材质；无重复导入的装配实体。

保留完整上秤台、下壳、内部承载盖、U 形金属载荷片、真实机械间隙、安装孔和 M3 固定孔；补实心 PCB、隐藏封装、红色敞口 Grove 及金属触点。PCB、封装、连接器内壁和 LED 透镜的隐藏深度为照片/CAD 推导，不是生产公差。四个角部贯通孔未被 PCB 或贴片遮挡。

`button` 使用原 CAD 的真实功能键表面，提供按下/弹起；0.18 mm 行程是视觉估计。`rgb` 只接受外部驱动。官方资料确认单功能键和单 SK6812 指示灯，无显示屏；按键不会自行触发去皮、标定、称重、颜色变化或供电状态。秤台和载荷片保持固定，不虚构重量驱动的形变。官方产品标称 5 kg；所链接通用载荷片图纸写 30 kg，模型仅参考其实体形状，不推导额定值或模拟行为。

```js
import { Model, GroveModule } from './src/units/mini-scales/index.js';
const unit = new Model();
unit.button('button').press('external');
unit.button('button').release('external');
unit.led('rgb').set({ color: '#0088ff', brightness: 0.5 });
const module = host.port('grove').attach(new GroveModule({ cableLength: 45 }));
module.unitFrame.setPose({ rotation: [0.1, 0.2, 0] });
host.get('grove/button').press('external');
```

有限 smoke 已覆盖有限坐标、装配尺寸、实体按键压放、秤台固定、外驱 RGB、四个角孔贯通、Grove 模块连接/姿态/嵌套 API/断开，以及所有几何/材质资源收到释放。既有公共释放 helper 对共享材质会重复调用 `dispose()`，本批未修改核心。贴纸、随附独立 M3 螺母、微小内部线路及浏览器逐面验收后置。

新增代码采用项目 MIT；官方 CAD 衍生几何保留 `licenses/M5_Hardware-MIT.txt`。


Printed appearance update (2026-10-26): reference-redrawn PNG labels are included; `artwork:false` disables them while preserving all original physical geometry and controls. Sources, registered surfaces and bounded evidence: [artwork.md](artwork.md), [sticker-smoke.json](sticker-smoke.json).
