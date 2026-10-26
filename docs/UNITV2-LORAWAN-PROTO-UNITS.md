# UnitV2 / LoRaWAN-CN470 / Proto 接入

本批负责各自完整物件、真实控件压放、附件和外部驱动的运动。视频/AI、RF网络、固件、USB、供电、电气和协议由外部框架实现。阶段保持 `modeled`；实际检查范围见[本批进度](../artifacts/unitv2-lorawan-proto-expansion/progress.json)，不代表逐面浏览器/GPU或实物验收。

| loader ID | SKU | 本款边界 |
| --- | --- | --- |
| `unitv2` | U078-D | GC2145镜头/麦克风、真实顶端user舌片、内部红白LED、风扇叶轮、USB-C/Grove/microSD与实际安装附件 |
| `lorawan-cn470` | U184-CN470 | RAK3172(L)、蓝Grove、普通SMA及本款195mm可拆天线 |
| `proto` | U022 | 完整原壳、7×11共77贯孔/金属环/板材、Grove与真实后盖服务配置 |

各款均导出 `Model` / `GroveModule` / `spec`。主入口为 `UnitV2` / `UnitV2Module`、`LoRaWanCn470Unit` / `LoRaWanCn470UnitModule` / `LoRaWanCn470Antenna`、`ProtoUnit` / `ProtoUnitModule`。UnitV2的附件主入口为 `UnitV2MicroSdCard`、`UnitV2UsbCable`、`UnitV2Stand`、`UnitV2BackBrick`，产品子路径分别导出 `MicroSdCard`、`UsbCable`、`Stand`、`BackBrick`。推荐按需loader或产品子路径。所有隐藏布局、配合、厚度和关节行程推导分别记录在各自 `research/<id>/sources.json` 中。

目录中的 `configurations` 是既有浏览器使用的命名配置列表。UnitV2保留作者原参数说明于 `configurationSchema`，并把已验证的卡/USB线/挂件实际组合列为12个配置，默认装卡、无线缆、无挂件排首。Proto的两种配置同时提供浏览器所需名称；不改冻结模型或构造选项。

## UnitV2：实际控件、风扇与附属装配

本款是 U078-D/GC2145，使用自己的5522三角同位壳对与本款48×24×18.5 mm依据；排除展示副本，不能借UnitV、USB版或M12版壳与镜头。顶端原生U舌片对应 `user`，左侧窄槽为microSD。夹扣的装配基准来自本款原壳两对槽及附件尺寸图，原始与运行几何、安装推导见[本款来源](research/unitv2/sources.json)。

`user`只提供输入意图，按压实际原壳舌片，释放/取消恢复原位置与法线；固定壳、卡座、镜头/麦克风、板和端口保持。`red` / `white` 分别接受外部设置，只改变真实内部LED载体的材质。现有原壳为不透明外观，必要轴线检查显示这两载体被壳遮挡，外部可见光路未证；不挖假灯窗或显示穿壳光晕，按键不自动触发灯、识别或视频状态。`fan`只转真实叶轮，电机/框架与散热实体固定，默认停止；角度或RPM均是外部请求的视觉状态，不模拟电机负载、温度或控制算法。

镜头与麦克风是实体与被动 `camera` / `microphone` 锚，没有camera framebuffer、采样、视频、检测框或AI结果。官方附32GB卡、50cmUSB线、可调单轴支架和五孔Back-Brick分别按真实物件和装拆边界表达；USB线使用真实USB端头，不能套Grove插头。正文附32GB与官图16GB示意分记，默认卡保实体/8触点，不照搬示意品牌或容量印刷。支架只表现夹板和腿脚的相对单轴角，不自动固定地面或求解主机世界姿态；重建范围与安装推导不代表测得机械止挡。

本体四个Port为 `grove`、`usb`、`sd`、`mount`。默认 `{card:true,usbCable:false,mount:'none'}`；`mount`另可选 `'stand'` 或 `'brick'`，同一个实际夹扣端口每次只装一个挂件。卡/USB线通过各自端口独立装拆，挂件使用本款夹扣家族，不能把Grove模块塞进USB/卡/安装口。支架关节地址为 `mount/tilt`，外驱范围以其 `get('tilt').getState().rangeDeg` 为准。

## LoRaWAN-CN470：本款无线模块与长天线

本款U184-CN470不是蜂窝Unit，也不是其他地区LoRaWAN型号。自己的6592源面按本款完整组件对应rear3858/front2734，保原顶点/绕向与同位装配；64 mm原壳与含SMA71.4 mm长度分列，不拉伸壳体。内部是RAK3172(L)及本款PCB/供电外围和隐蔽RF馈线，未证IPEX安装不编独立接口。详见[本款来源](research/lorawan-cn470/sources.json)。

外部只有 `grove` / `sma`。没有按钮、外部LED、USB、SIM或传感器组件。机端普通SMA母座为外螺纹/中心孔；配套天线为内螺纹/中心针，与RP-SMA区别。名义195 mm长扁杆、耦合/叉/轴和肘关节按本款官图重建；0–90°是有限外驱视觉范围，轴/轮廓/宽深/止挡仍分记推导。固定耦合/机端、壳和PCB不随天线弯折运动，没有自动扫角、旋合、信号强度或RF波束动画。

默认 `{antenna:false}`；`{antenna:true,antennaAngleDeg:0}`安装本款天线。独立附件 `Antenna` 中的关节为 `tilt`，通过本体地址 `sma/tilt` 调用。Module使用 `get('tilt')`；按端口地址发送外部 `joint` 命令可沿主机层级传递。普通SMA只表达机械配合，不模拟频段、射频或电气兼容性。

## Proto：真实洞板与后盖服务

本款U022使用自己的3498原装三角，不能借U064 MiniProto。48×24×8 mm壳与20×28 mm前窗保实际轮廓；板上7×11共77个Ø1 mm贯孔，孔距2.54 mm。基材有厚度、孔有真实轴向通道与材料壁/金属环，不能用墨点或透明贴图代替。真实Grove、固定焊盘和本款后盖/螺钉齐备，不默认添加用户焊线/元器件。详见[本款来源](research/proto/sources.json)。

外部仅 `grove`，没有按钮、灯、sensor或joint，也没有模拟供电/协议或用户电路。默认 `{rearCover:true}`；`{rearCover:false}`真实后盖服务配置只移除后壳/背标和对应中心螺钉，保前框、板及Grove，不造铰链、拔板动画或穿闭壳的虚构交互。前面暴露的是板材及真实焊孔，不造前胶贴。

## 接入和验证

按需加载三款并通过真实HUB三分支接入：

```js
import {loadModel,loadGroveModule} from '../src/loaders.js';
const host = await loadModel('sticks3');
const hub = await loadGroveModule('hub');
host.port('grove').attach(hub);
const camera = await loadGroveModule('unitv2');
const radio = await loadGroveModule('lorawan-cn470',{antenna:true});
const board = await loadGroveModule('proto');
hub.port('grove-1').attach(camera);
hub.port('grove-2').attach(radio);
hub.port('grove-3').attach(board);
function userDown(source='demo') {
  host.handle({type:'button',target:'grove/grove-1/user',action:'press',source});
}
function userUp(source='demo',cancelled=false) {
  host.handle({type:'button',target:'grove/grove-1/user',
    action:cancelled?'cancel':'release',source});
}
host.handle({type:'joint',target:'grove/grove-1/fan',rpm:30});
host.handle({type:'joint',target:'grove/grove-2/sma/tilt',angleDeg:90,durationMs:250});
function onFrame(deltaSeconds) { host.update(deltaSeconds); }
// Teardown: host.dispose().
```

需要支架时可按配置建立，也可在现有本体上装入实际附件：

```js
import {Stand} from '../src/units/unitv2/index.js';
const stand = new Stand();
camera.port('mount').attach(stand);
host.handle({type:'joint',target:'grove/grove-1/mount/tilt',
  angleDeg:20,durationMs:250});
// Stop the external fan visual and restore its neutral angle:
host.handle({type:'joint',target:'grove/grove-1/fan',angleDeg:0,rpm:0});
// Transfer ownership to caller when keeping an accessory after detaching:
camera.port('mount').detach({dispose:false});
stand.dispose();
```

`artwork:false`只关闭墨层，真实壳/板/孔壁/膜/卡/线端/控件/附件保持。各入口和实际配置的全部物理attributes/index/matrixWorld均须一致；真实没有胶片的丝印不虚构胶层。各款普通PNG按可读本款官图代码重绘，来源与配准见各 `research/<id>/artwork.json`，不能借错型号/裁照片/编不可辨小字或遮缺件。

必要专项：`node scripts/check-unitv2-lorawan-proto-units.mjs`。实际单品、三分支四芯、控件/附件与固定件、独立灯、服务配置、多口拒错/装拆和主机framebuffer、导出/两build及5188源PNG/运行chunk字节检查结果见本批进度。CSV、私链接/映射/原稿名、矢量、原始官图/CAD/PDF/MCP全文/生成器及中间件不进入分发树；新增代码MIT，第三方与标识权利保留。旧贴纸、私Scroll、StackChan量产配合和Puzzle Bridge缺基准检查点继续保留。
