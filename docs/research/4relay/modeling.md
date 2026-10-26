# Unit 4Relay U097

本批保留官方 STL 的完整装配壳体（组件 0），仅施加同一个刚体平移 `[0,44,4]` 的逆变换；原坐标缩放为 1，未切壳、挪动子件或用贴图封洞。其余两个组件是平移展示的重复前后壳，不在装配中叠加。

官方尺寸图为 24 × 112 × 18.4 mm，壳体厚 8 mm，四个 Ø4.85 mm 安装孔。正文写 112 × 23 × 18 mm 和两个 LEGO 孔，与同页图/CAD冲突；模型采用图/CAD。已提交官方反馈，编号 `c652a5b1396f4b56bbb28b97efc62911`，未声称官方已修正。来源、原文件 SHA-256 和 CAD Git blob 见 [sources.json](sources.json)。

实体补充包括有四个安装贯孔和两螺丝避空的 PCB、四个密封继电器封装、四个绿色 LED、四个橙色固定端子座及铜针、Grove 内壁和四接点。背面为完整原生外壳；开口后为对应实物，不使用照片或平面遮洞。隐蔽 PCB/封装、连接器内壁、接线夹和插深均为同产品照片推导，不能作为生产装配或安规参数。

`Model` 为独立模型，`GroveModule` 包含四芯实体线缆和两端插头。默认固定座为空；`new Model({ terminalPlug: true })` / `new GroveModule({ terminalPlug: true })` 安装全部四个同产品附件。可单独通过 `model.port('terminal-2').attach(new TerminalPlug())` 安装，或 `detach({dispose:false})` 后自行释放；不会移走固定座、其他附件或 Grove 线。

```js
import { Model, TerminalPlug } from './src/units/4relay/index.js';
const unit = new Model({ terminalPlug: true });
unit.get('led-1', 'led').set({ on: true, brightness: 0.6 });
unit.get('terminal-1/screw-1', 'joint').set({ angleDeg: 45, durationMs: 200 });
unit.update(1 / 60); // 每帧推进外观插值
```

`led-1..4` 从 Grove 端向上编号，颜色固定绿色，仅接受外驱亮度/开关；不会因继电器或螺钉发生变化。`terminal-1..4` 均朝前 +Z，模块局部 +Y 为插出方向，四个附件各有 `screw-1..4` 头部角度。`sensor` 仅为视觉锚点。该仓库不实现继电器电气状态、协议/寄存器、输出负载、供电、夹紧或密封封装内部动作；这些交给外部框架。

必要构造检查见 [smoke.json](smoke.json)：有限几何、原壳尺寸、四孔轴向空路与 FrontSide 孔壁、开口后继电器/灯/端子实体、独立绿灯、附件针孔和螺钉、嵌套四芯 Grove 姿态、单个附件卸下及资源释放通过。按用户要求未做浏览器逐面复核，stage 保持 modeled；印刷层后置。
