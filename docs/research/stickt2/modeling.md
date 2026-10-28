# M5StickT2（K016-T2）

本款是黑色尼龙热成像主机，采用自身原生壳体与本款多视图/机械图重建；阶段为 `modeled`。不是普通StickC盒子的改名。来源见 [sources.json](sources.json)，原生面账本见 [native-source.json](native-source.json)，原始STL/页面/官图不分发。

## 自身原生源与尺寸

[官方页](https://docs.m5stack.com/en/core/StickT2)明确PICO-D4、300mAh、AXP192、135×240 ST7789非触摸TFT、Lepton3.0、编码器与按键。只把这些事实用于外观和输入意图，不实现真实温度测量、热图生成或固件。

固定M5_Hardware提交 `e29c139cbc7c80b5ccc5557e5ab8025a7a19a109` 的K016-T2自身STL共15300面，实际装配7650面、重复组装预览7650面。rear原始面0–3129与preview偏移3130逐面对应；front原始6260–10779与preview偏移4520逐面对应，最大位置残差4.77e-6mm、原始法线一致。原始position/normal/index/sourceFaceIndex/sourceAttributeWord保留，只有刚性平移/根旋转，不缩放、删面或翻转原生数组。

前壳包括两组各24面的封闭负体积内边界，作为继承的内侧空腔边界保留；不是丢掉负体积或重造第三件外壳。自身前后单独壳体对齐到源组装预览，重复预览不叠在默认模型上。名义尺寸24×48×24mm与包含侧耳的CAD30.4×48×23.9mm分别记录。mm坐标正面+Z、顶部+Y，耳位向-X。

## 默认装配与实际动作

默认包含完整原生厚壳、独特侧耳与安装孔、前A条纹弹舌、侧B/电源舌、后M5凹字槽/槽底。后M5是真实源几何；专项从后壳land与字槽取首表面并核对深度，不以贴纸代替凹槽。官图没有独立胶贴，本款普通PNG数为0。

新增真实PCB/电池与支承肋、屏幕背板/光学承载/厚玻璃、开关背衬、被动麦克风/封装、Lepton承托板/模块包络/带孔壁镜筒/实体透镜和后止挡。USB-C有24接点、Grove四壁/键位/四接点/深止挡/焊尾，M3和1/4英寸安装口有真实内孔与深止挡。隐藏安装、板厚/壁厚、内层深度、透镜/编码器包络均是照片/自身开口推导，不表示制造公差或认证配合。

A和电源使用自身front-shell的局部材料场，B使用自身rear-shell活动面；共享壳面用不同祖先输入过滤器，固定邻区继续遮挡。权重为0的源顶点及其他实体不动，回零精确恢复原数组。源长三角可能在固定邻区插值出微小弹性，不能据此宣称全部根线/材料物理固定。可视A0.22/B0.16/电源0.15mm不是额定行程。

编码器完整帽、滚花、转轴随`rotation`实际旋转；中心`press`作0.18mm轴向视觉按压。中心点按、轮圈拖转分别拾取真实实体。角度连续、有符号，不假定档位数、脉冲数或温度灵敏度。取消拖转结束捕获并保留当前角度；按钮取消回位且不产生click。2021官方变更提到减小轮尺寸，但源CAD未标明修订，轮尺寸仍按本款照片/开口推导。

## API与生命周期

导出`Model`（默认）/`StickT2`同构造器，以及`spec,DIM,defaults,configurations,configurationSchema,GROVE_PINS`。配置`complete/{}`。组件顺序`a,b,power,usb,grove,press,rotation,lcd`；三主机键及编码器press为button，rotation为joint，USB/Grove为port，lcd为display。没有HAT、可编程LED、sensor、IMU或speaker注册。

```js
import Model from 'm5stack-models.js/devices/stickt2';
import {GroveModule as ButtonUnit} from 'm5stack-models.js/units/button';
const host = new Model();
const off = host.on('input', e => runtime.receive(e));
host.port('grove').attach(new ButtonUnit({cableLength:74}));
host.display('lcd').fill('#205790'); // 外部热图或其他像素由调用方提供
host.handle({type:'joint',target:'rotation',angleDeg:90});
host.button('press').press('external');
host.button('press').cancel('external');
// 渲染循环host.update(dt,time)，单位秒；结束off()/host.dispose()。
```

Space/A→a，B→b，P→power，Enter→press。外驱角度/画面不产生输入回声。PA2 SW、PA3 EN_B、PA4 EN_A沿用官方PinMap文字，不把这些名字猜成直接ESP32 GPIO映射。输入不执行开关机。Grove四芯两插头、`grove/press`子输入和姿态复用共享API，接口不证明电气/协议兼容；复用Unit用detach({dispose:false})，默认detach释放。

`artwork:false`不改变任何原生字槽、物理结构或动作。程序输入来源成对release/cancel。持续更新到最后回零帧，自行渲染时需释放Viewer和模型资源。

## 当前专项证据

运行 `node scripts/check-stickt2-controller.mjs`，结果见 [checks.json](checks.json)。真实导出/实例验证7650原生面全部属性及面账本、103新增闭合正体积FrontSide实体、实际多点键面部分/全按及回位、固定顶点/其他件、编码器压放/转动/外驱无回声、真实135×240 framebuffer、接口孔壁接点、相机背衬、原生M5槽深、四芯双插头/变姿态/拆接和释放。

真实Viewer/camera/raycaster/私有pointer路径验证144拾取、24按钮取消、4状态×2姿态，另有两姿态真实轮圈拖转。GPU/DOM夹具不代替网页像素验收，也不表示隐藏BOM、实物配合、电气、固件、测温或热图精度已经验证；仍为modeled。

## 后续装配修订

编码器窗口接收壳的现行修复、原缺陷与独立检查见 [2026-10-28修订](encoder-receiver-amendment-2026-10-28.md)。上述初次103新增实体证据保持为历史记录；当前104实体及窗口封闭以修订报告为准。
