# 原 M5Camera、ESP32CAM、50cm RGB 灯条接入

三款均为 `modeled`，未逐面浏览器或实物验收。模型提供本款完整外观、真实接口与线束、实际帽的按放/回弹，以及外部指定的灯光和柔性带形。通信、寄存器、图像/AI、电气、供电和固件由外部框架实现。

| 型号 / SKU | 本体实际组件与类型 | 接口 / 控件 / 输出 |
| --- | --- | --- |
| `m5camera` / U017 | `camera (component)` / `grove (port)` / `usb (port)` / `reset (button)` | 接口`grove` / `usb`；控件`reset`；灯无；被动锚点`camera` |
| `esp32cam` / U007 | `grove (port)` / `usb (port)` / `camera (component)` / `key (button)` | 接口`grove` / `usb`；控件`key`；灯无；被动锚点`camera` |
| `rgb-led-strip-50cm` / A093 | `flex (visual-flex)` / `pixel-0 (led)` / `pixel-1 (led)` / `pixel-2 (led)` / `pixel-3 (led)` / `pixel-4 (led)` / `pixel-5 (led)` / `pixel-6 (led)` / `pixel-7 (led)` / `pixel-8 (led)` / `pixel-9 (led)` / `pixel-10 (led)` / `pixel-11 (led)` / `pixel-12 (led)` / `pixel-13 (led)` / `pixel-14 (led)` / `pixel-15 (led)` / `pixel-16 (led)` / `pixel-17 (led)` / `pixel-18 (led)` / `pixel-19 (led)` / `pixel-20 (led)` / `pixel-21 (led)` / `pixel-22 (led)` / `pixel-23 (led)` / `pixel-24 (led)` / `pixel-25 (led)` / `pixel-26 (led)` / `pixel-27 (led)` / `pixel-28 (led)` / `pixel-29 (led)` / `input (port)` / `output (port)` | 接口`input` / `output`；控件无；灯`pixel-0` / `pixel-1` / `pixel-2` / `pixel-3` / `pixel-4` / `pixel-5` / `pixel-6` / `pixel-7` / `pixel-8` / `pixel-9` / `pixel-10` / `pixel-11` / `pixel-12` / `pixel-13` / `pixel-14` / `pixel-15` / `pixel-16` / `pixel-17` / `pixel-18` / `pixel-19` / `pixel-20` / `pixel-21` / `pixel-22` / `pixel-23` / `pixel-24` / `pixel-25` / `pixel-26` / `pixel-27` / `pixel-28` / `pixel-29`；被动锚点无 |

## 三分支机械装配

```js
import {loadModel,loadGroveModule} from '../src/loaders.js';
const host=await loadModel('sticks3');
host.root;
const hub=await loadGroveModule('hub');
host.port('grove').attach(hub);
const unit1=await loadGroveModule('m5camera',{});
hub.get('grove-1').attach(unit1);
const unit2=await loadGroveModule('esp32cam',{});
hub.get('grove-2').attach(unit2);
const unit3=await loadGroveModule('rgb-led-strip-50cm',{});
hub.get('grove-3').attach(unit3);
host.update(deltaSeconds); // 每帧时间为秒
```

这段接入只建立机械所有权与完整组件路径，不声明物理总线兼容或硬件支持任意级联。两个相机使用真实四芯 Grove 接线；A093 依自身三线转接和白色四位 Grove 插头直接接入，不添加本体 Grove 接收座或虚构第四根灯条导体。A093 的实际转接结构、组件路径、拆装和外驱命令以下方冻结实现为准。

## M5Camera (original U017)

`m5camera` 对应黑色侧耳原版 U017，主体组件依次为 `camera`（被动 `component`）、`grove`（port）、`usb`（port）、`reset`（button）；模块再带 `unitFrame` 与 `cable`。没有 LED、视频 Display、焦点关节或未装 MPU/BME/MIC 组件，也不默认附加图中的 ENV、积木支架、电池或 USB 线。

```text
grove/grove-1/camera       # OV2640 / 65° 被动光学帧
grove/grove-1/grove        # 原版白色四芯物理口
grove/grove-1/usb          # 本款照片明确的 USB-C 物理口
grove/grove-1/reset        # 实际侧面 RESET 瞬时帽杆
grove/grove-1/unitFrame    # 完整 Unit 外驱姿态
grove/grove-1/cable        # 四芯线外驱形状
```

```js
const reset='grove/grove-1/reset';
host.handle({type:'button',target:reset,action:'press',source:'operator:r'});
host.handle({type:'button',target:reset,action:'release',source:'operator:r'});
// 拖动取消/失焦时可改用 action:'cancel'，抑制 click。
host.handle({type:'button',target:reset,action:'state'}); // {pressed:false}
const cameraFrame=host.get('grove/grove-1/camera').object3d;
host.handle({type:'pose',target:'grove/grove-1/unitFrame',position:[55,174,19],rotation:[.15,-.29,.24]});
host.handle({type:'cable',target:'grove/grove-1/cable',slack:12,bend:[0,0,-1]});
host.update(deltaSeconds); // 秒数；推进帽杆按下与弹回，不执行设备固件
```

只有实际 RESET 帽杆运动，固定开关框、深止挡、金属焊脚、PCB、WROVER 屏蔽罩与外壳保持固定。多个来源独立持有，最后一个释放才回弹；`down/up/click/longpress` 都只是输入意图。`[-1,0,0]` 轴和 `0.22` mm 行程是本款照片/Viewer 推导，不是额定机械参数。独立 `Model` 默认 `KeyR→reset`；模块不会自动注册主机键位，需要时由调用方显式设置 `host.keymap.KeyR='grove/grove-1/reset'`。

camera 的状态为 `{}`、不可交互，只保 OV2640 和文档视场角 65°；没有图像/视频/AI/光学模拟。USB/Grove 不执行供电、通信或 GPIO。原理图与照片的 USB 版本、说明卡 GPIO 差异仍在来源中记录，反馈已受理并未收到生产更正；采用照片明确的 Type-C 外形，不据此模拟电气。

唯一实际预设为 `complete` 的 `{}`。`artwork:false` 只去后标墨，仍保薄膜实体、周边托边、实际 PCB/WROVER 罩背托、六真前槽/孔壁和无色 M5；没有用黑平面或标签图片代替装配。40×48×11 mm 包含两侧耳，窄主体宽24 mm是照片推导；后标基材/内部保持、光学与引脚/接点等隐藏尺寸均非精密 BOM/制造基准。

## ESP32CAM (original U007)

独立Model选择 `esp32cam`，黄色侧帽用鼠标按住/松开，或键盘 **K**；只有真实小帽沿+X运动0.18mm，框/脚/PCB固定。API：`{type:'button',target:'key',action:'press',source:'app'}`，同source用`release`松开或`cancel`取消；多来源全部结束才回弹，取消抑制click，没有reset/长按/上电算法。

接入变父StickS3→HUB第2路后，按钮完整路径 `grove/grove-2/key`，被动光学frame `grove/grove-2/camera`，姿态 `grove/grove-2/unitFrame`，四芯线缆 `grove/grove-2/cable`。指针直接拾取实际小帽；独立Model的K键映射不代替宿主自己的键位。camera只是OV2640/FOV65°元数据，没有图像/视频/AI/自动行为；USB-C和Grove仅机械接口，空2P电池座无port/电池/附件。

本款是裸板，无机身贴膜，安全可辨印字不足，实交 **0 PNG**；不把宣传标题、箭头或微字猜成贴纸。`artwork:false`不改实体。旧20.5×46.5×11.5mm仅暂定外观基准，当前54×54×26.6mm冲突待官方更正；不当作制造、电气或实物验收。

## Unit RGB LED Strip 0.5m / 30LED

导出 `Model`、`GroveModule`、`InputAdapter`、`defaults`、`configurationSchema`、`configurations`、`spec`，默认导出 `Model`。这是独立的 A093 500 × 10 mm、30 颗 5050 灯条；不能当作 A035 10 cm/3535 灯条的加长版。

默认保留完整实体基材、背胶、透明滴胶、30 灯、铜垫、被动元件、焊接桥、两端白热缩和各三根线。`input` 接收黑色 3P 插头，`output` 是互补的另一端，两个端口都有 3 个实体触点；本体没有 Grove 接收座。随附的 `InputAdapter` 默认接在 `input`，含黑 3P 插头、三根线和一个四位 Grove 插头（3 个触点，第4 NC空）。适配线的组件路径为 `input/cable`，wireCount=3、plugCount=2、展示线束中心线100 mm。引脚细节及映射是外观推导，不能当电气或通用JST兼容声明。

```js
const strip = unit3; // 上方 HUB 第3路已接入的实际灯条
host.handle({type:'led', target:'grove/grove-3/pixel-0', color:'#ff7020', brightness:0.6});
host.handle({type:'led', target:'grove/grove-3/pixel-29', on:true, color:'#2080ff'});
host.handle({type:'flex', target:'grove/grove-3/flex', bendDeg:75, durationMs:200});
host.update(0.1); // 调用方驱动展示过渡；没有自动彩虹
host.handle({type:'pose', target:'grove/grove-3/unitFrame', distance:82, rotation:[0,0.1,Math.PI/2]});
host.handle({type:'cable', target:'grove/grove-3/input/cable', bend:[1,0,-1]});
const input = strip.get('input', 'port');
const adapter = input.detach({dispose:false});
input.attach(adapter); // 保留并重新接合真实三线配件
```

`pixel-0`…`pixel-29` 各自独立，`led` 可传 `on`、`color`、`brightness`。`flex` 是 `visual-flex`，`bendDeg` 范围 −120…120，`durationMs>=0`；连续曲面和墨迹一起弯曲，刚性灯珠沿切线移动并保持焊接。这个角度范围是展示限制，不是材料极限。`GroveModule` 额外有 `unitFrame`（`unit-frame`），`pose` 支持 `position`、`rotation`、`quaternion` 或 `distance`；其 getState 给 inputPort=`input`、distanceRangeMm=[45,112]。线束中心线固定，端点方向或过大位移造成无法接合时会拒绝并回滚；不能复用其它 Unit 的195 mm连线姿态。`input/cable` 只支持非零横向 `bend`，没有 `slack` 拉伸命令。

默认 `{bendDeg:0, adapter:true}`。预设 `complete:{}`、`arc:{bendDeg:90}`、`reverse:{bendDeg:-60}`，两入口都可用；`adapter:false` 只移除实际转接配件。`artwork:false` 只移除29处可辨 +5V 墨迹，所有实体属性、索引和世界矩阵在静止和部分弯曲期间都相同。普通 PNG 由官方公开照片重绘；字体/尺寸/重复位置是外观推导，未知微字、3M背印和宣传图没有补造。原始CSV/矢量和生成器不进入公开仓库。

实体和运行检查已覆盖两入口、全部预设、部分形变、逐灯独立/noecho、真实 StickS3 → HUB 第3路换父级、三线接合、配件拆装、同级与framebuffer隔离、非法拉伸回滚及资源释放。该证据限 Node 几何/运行层；未声明 GPU、实物、制造配合、电气、固件或防水验证。

## 实际预设与构造导出

| 型号 | 真实预设 | 默认参数 |
| --- | --- | --- |
| `m5camera` | `complete {}` | `{}` |
| `esp32cam` | `complete {}` | `{}` |
| `rgb-led-strip-50cm` | `complete {}`；`arc {"bendDeg":90}`；`reverse {"bendDeg":-60}` | `{"bendDeg":0,"adapter":true}` |

| 型号 | 导出别名 |
| --- | --- |
| `m5camera` | `M5CameraOriginalUnit` ← `Model`；`M5CameraOriginalUnitModule` ← `GroveModule` |
| `esp32cam` | `ESP32CAMOriginalUnit` ← `Model`；`ESP32CAMOriginalUnitModule` ← `GroveModule` |
| `rgb-led-strip-50cm` | `RGBLEDStrip50cmUnit` ← `Model`；`RGBLEDStrip50cmUnitModule` ← `GroveModule`；`RGBLEDStrip50cmUnitInputAdapter` ← `InputAdapter` |

独立预览使用 `loadModel(id,options)`，装配使用 `loadGroveModule(id,options)`。组件和配件以实际冻结 API 为准；展示弯曲范围、按键行程、隐藏安装及端子细节均是外观推导，不能当作额定硬件或制造基准。

## 同步印刷与来源

- `m5camera`：1张；`reference-redraw`。[来源与余缺](research/m5camera/artwork.json)。
- `esp32cam`：0张；没有安全可读字样，不编造印刷。[来源与余缺](research/esp32cam/artwork.json)。
- `rgb-led-strip-50cm`：1张；`reference-redraw`。[来源与余缺](research/rgb-led-strip-50cm/artwork.json)。

`artwork:false` 只去墨，保留实体壳/后标基材、PCB、接口/接点、胶层与滴胶、刚性灯包及全部物理运动。只准确重绘本款安全可读图文，不裁照片、不挪用包装/宣传标题、不借错代或猜微字/QR/MAC/SN；未见清楚的 3M 背面字形不制作。私 CSV、私 URL、原名/映射、矢量、原始图文、生成器和中间件均不分发，普通 PNG 可公开。新代码 MIT，官方原图文和第三方标识保留各自权利。

- [U017 来源及版本边界](research/m5camera/sources.json)：40×48×11 为含耳名义；自身 PCB/WROVER 与真实后标承托，USB/GPIO 文档差异另存，不凭通风槽造灯。
- [U007 来源及暂定尺寸](research/esp32cam/sources.json)：旧精确 20.5×46.5×11.5 暂作细长裸板外观基准；当前 54×54×26.6 与照片不符，保留未解冲突，不冒充实测尺寸。
- [A093 来源及三线装配](research/rgb-led-strip-50cm/sources.json)：精确 500mm / 30×5050 / 10mm 宽，滴胶厚度和隐藏保持推导；不拉伸 A035，也不将厂商 IP65 描述当作模型密封验收。

必要本批检查：`node scripts/check-m5camera-esp32cam-rgbstrip50-units.mjs`。覆盖实际实体/FrontSide/承托、相机四芯/真实帽、灯条实际三线/端头和外驱形状、两入口/实际预设去墨、层级寻址/变父/peer/framebuffer/noecho/资源释放。见[本批进度](../artifacts/m5camera-esp32cam-rgbstrip50-expansion/progress.json)。未进行浏览器/GPU、历史全量、实物或制造配合验收。
