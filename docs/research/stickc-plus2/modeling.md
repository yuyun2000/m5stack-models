# M5StickC Plus2（K016-P2）

此款是按本款官方多视图和官方明确链接的尺寸图制作的原创参数化外观重建，阶段为 `modeled`。它不是 StickC、StickC Plus 或 StickS3 的换名，也没有伪造原生 CAD 面编号。CPU 检查不是生产公差、隐藏 BOM、实物或网页像素验收。

## 来源与尺寸边界

2026-10-28 查询官方知识服务，并直接读取 [Plus2 官方页](https://docs.m5stack.com/en/core/StickC-Plus2)。本款为 ESP32-PICO-V3-02、200 mAh 电池、1.14 英寸 135×240 ST7789V2 非触摸屏；三个实体按钮分别为 A/G37、B/G39、C/G35。底部 USB-C 与 HY2.0-4P、顶侧 1×8 2.54 mm HAT 排母均有本款照片支持。

官方页明确链接了一张位于 `m5stickc_plus` 目录下的共享尺寸图：24×48×13.5 mm、正面 R3、后部左右安装中心距 16 mm、两排距底面 9.4/4.5 mm。这里只使用该链接能支持的机械外形与孔位，不据此继承 Plus 的 AXP192、电池、电子或印刷。本款官方资料明确移除了 AXP192，采用不同主控、电池及开关机机制。

已核对 `m5stack/M5_Hardware` 固定提交 `e29c139cbc7c80b5ccc5557e5ab8025a7a19a109` 的目录：有 K016-C、K016-P、K150，未找到 K016-P2 专属结构目录。本款页没有把 Plus 的 STL 明确认定为 Plus2 CAD，因此没有使用这些网格。来源的 URL、字节摘要与用途见 [sources.json](sources.json)；原图、原始页面和检索原文不分发。

坐标为毫米，X 向正视右方、Y 向顶部 HAT、Z 向显示屏。名义外壳是 24×48×13.5 mm；凸出的侧键、墨层/标签和光学覆层是独立层，不能把运行时包络当成制造尺寸。

以下细节由多视图比例或连接器家族推导，未获本款精密图：壁厚 1.1 mm、PCB/电池/封装与支承尺寸、LCD 有效区约 14.75×24.95 mm（本款正视照片长宽比例与 1.14 英寸标称对角线联合推导；不假定像素物理比例）、隐藏焊尾、接口深度与接点厚度、前键 0.25 mm/侧键 0.18 mm 可视行程。没有借用 StickS3 A183 的有效区。三键意图不执行开关机、重启或下载。

## 完整默认装配

- 橙黄色前/后壳、真实厚侧墙与四个圆角侧壁；前屏窗口、M5 键槽、侧键和小孔均保留孔壁。
- 正面 M5 活动舌是一个连续闭合实体，包括字槽、槽底和内侧厚度。下缘为固定根部，向自由边逐渐弯入；独立层皮在弯曲时可能产生微缝，因此没有采用分层帽顶。
- 左右侧键包含完整帽、内部传力柱与固定开关背衬。前键也有独立开关、按钮及支承。
- PCB、电池包络、LCD 金属背/光学载体、厚前玻璃、板边支承、后部中空安装柱、磁环/螺钉及盲止挡均随默认物件提供。
- USB-C 有金属壁、舌、24 个可见接点及深止挡；Grove 有四壁、键位、四接点、后壁、焊尾和承托；HAT 的 8 个孔均有实体孔壁、16 个弹片和独立深止挡。
- 标签始终有独立物理承载层。`artwork:false` 只关墨层，不移除承载、封闭结构、安装件、接点或动作。
- 绿色睡眠导光体是非可编程的被动物理结构，IR、麦克风和蜂鸣器也只表现物件；没有注册虚构传感读数、IMU、音频或射线物理模拟。

## 公开 API 与下游边界

入口 `src/devices/stickc-plus2/index.js` 提供 `Model`、`StickCPlus2`（相同构造器）、默认导出、`DIM`、`spec`、`defaults`、`configurations`、`configurationSchema`、`HAT_PINS` 和 `GROVE_PINS`。

实际组件顺序：`a`、`b`、`power`、`usb`、`grove`、`hat`、`red`、`lcd`。其中三键为 `button`，三口为 `port`，`red` 为 `led`，`lcd` 为 `display`。没有本款 `GroveModule` 导出，因为此款是主机。

```js
import Model from 'm5stack-models.js/devices/stickc-plus2';
import {GroveModule as ButtonUnit} from 'm5stack-models.js/units/button';

const host = new Model({artwork: true});
const unit = new ButtonUnit({cableLength: 70, artwork: false});
host.port('grove').attach(unit);
const off = host.on('input', event => runtime.receive(event));
// 主机路径：a / b / power；Unit 路径：grove/press。
// 外部渲染器需要每帧调用 host.update(dt, time)，单位为秒。
host.button('a').press('preview');
host.button('a').cancel('preview'); // 失焦/取消时必须清理自己的来源，不产生 click。
host.display('lcd').fill('#205790');
host.led('red').set({color: '#ff3020', brightness: 0.4});
host.handle({type: 'pose', target: 'grove/unitFrame', distance: 90});
```

主机红 LED 和 IR 在硬件上共享 G19，但此层不实现电路/固件耦合。红 LED 命令仅驱动可见输出，按钮不自动发光或改写屏幕。C 键只上报 power/wake 意图，不把按放等同于真实断电。Grove/HAT/USB 接口类型仅用于外观装配，不证明任意协议或电气兼容。

Viewer 会调用更新循环；自行渲染时要在动作期间持续更新并渲染最后的回零帧。来源必须成对 release/cancel。结束时 `off()`、解除 Viewer 挂载、`host.dispose()`，再释放 Viewer。需要复用 Unit 时 `detach({dispose:false})`，最终再销毁；默认 detach 会释放它。

## 普通 PNG 与验证

只有一张普通 PNG：`artwork/rear-reference-redraw.png`，840×1480，单个后侧投影面。根据本款清楚的后视照片重新排版可辨颜色块、引脚及元件字样；没有裁切产品照片，没有分发矢量、原图或私源。认证/注册号、微字与唯一标识未转录。它是 `reference-redraw`，不是厂商矢量或独立电气依据。

检查命令：

```sh
node scripts/check-stickc-plus2-controller.mjs
```

当前结果见 [checks.json](checks.json)。专项导入真实构造器，检查闭合正体积实体、孔壁/深止挡/接点、三键内外实体面部分/全按及取消、固定件/固定根部、全属性/index/world 精确回零、墨层独立、真实 framebuffer、真实 timer、Grove 四芯双插头/姿态/拆接及资源释放。实际 Viewer 夹具保留 camera、raycaster、首可见实体拾取和私有指针路径，只替换 GPU/DOM 边界，不能代替网页像素验收。新款不自动获得 `verified`。
