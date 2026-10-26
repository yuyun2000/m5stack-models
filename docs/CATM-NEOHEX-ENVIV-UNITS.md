# CatM / NeoHEX / ENV-IV 接入

三款为 `modeled / visual-only`：展示自身机械结构、真实连接器和可由外部设置的外观。蜂窝通信、WS2812 串行/级联、环境值、电气和固件行为由外部运行框架处理，模型不自动计算或伪造这些状态。

[本批集成检查点](../artifacts/catm-neohex-enviv-expansion/progress.json)记录本批最终专项检查、构建和资源验证结果。

| ID / SKU | 机械来源与尺寸基准 | 主要接口与输出 |
| --- | --- | --- |
| `catm` / U128 | 本款官方完整装配 **6592 原面**；原壳 **24×64×8 mm**，固定普通 SMA 加入后为 **24×72×8 mm** | `grove`、`sma`；隐藏 NanoSIM 为真实接收结构，非外露端口 |
| `neohex` / A045-B | 本款尺寸图/照片参数化，**没有本款 CAD 原面**；31 mm 为灯板本体对边，36 mm 为相对安装孔中心距，六耳外径 Ø4、孔 Ø2 | `grove`、`out`、`grove-in`；`led-1`…`led-37`；`diffuser` 为独立均光片静态放置点 |
| `env-iv` / U001-D | 本款尺寸图/照片参数化，**没有本款 CAD 原面**；**24×32×8 mm**，两个 Ø5 安装孔，16 mm 孔距、孔心距底边 12 mm | 红色 `grove`；`sht40`、`bmp280` 为真实被动包体锚点 |

参数化路线分别来自本款多视图、实板照片与器件资料，没有借用旧 HEX、ENV-III 或别款壳体。NeoHEX 的 36×36×9.6 mm 是官方标称，尺寸图厚度为 9.55 mm；六个安装耳和连接器可能超出标称正方形。ENV-IV 的 R4 前视轮廓、R1 侧边、实际通气口、PCB 隔热岛与传感器封装单独构建，壁厚、暗扣和隐藏安装明确记录为推导。

准确尺寸、来源 SHA、机械范围和推断见 [CatM](research/catm/sources.json)、[NeoHEX](research/neohex/sources.json)、[ENV-IV](research/env-iv/sources.json)。三款均导出 `Model/GroveModule/spec`；CatM 另导出 `Antenna`，NeoHEX 另导出 `Diffuser`。

## 三条独立 Grove 分支

```js
import {loadModel,loadGroveModule} from '../src/loaders.js';

const host=await loadModel('sticks3');
const hub=await loadGroveModule('hub');
host.get('grove').attach(hub);

const modem=await loadGroveModule('catm',{
  cableLength:80,antenna:false
});
const light=await loadGroveModule('neohex',{
  cableLength:90,diffuser:true
});
const environment=await loadGroveModule('env-iv',{
  cableLength:100,rearCover:true
});
hub.get('grove-1').attach(modem);
hub.get('grove-2').attach(light);
hub.get('grove-3').attach(environment);

// 宿主循环调用 host.update(dtSeconds)，渲染 host.root。
host.handle({type:'pose',target:'grove/grove-1/unitFrame',
  position:[-60,180,8],rotation:[.1,-.2,.15]});
host.handle({type:'cable',target:'grove/grove-1/cable',
  slack:12,bend:[0,0,-1]});
```

`GroveModule` 都使用 `grove` 作为实际四芯电缆输入，并在本体组件后加入 `unitFrame,cable`。单位为 mm，+X 前视右方、+Y 上方、+Z 前方；模块使用 `.get(id)`，不依赖 Device 的便利访问器。连接族执行机械匹配；针名只记录本款标注，不自动分配电源、地址、串行链或协议路由。

## CatM：完整窄壳、隐藏 NanoSIM 与静态 SMA

`catmAssembly` 保留完整前/后壳、自己的 PCB/SIM7080G、单根 IPEX 至 SMA 的同轴外观、蓝 Grove、内部 NanoSIM 接收件、三个后侧固定件和两张实体薄膜。6592 个原面来自零基闭区间 `[0,3857]`、`[7716,10449]`，按同一个原点 `[0,32,-4]` 和比例 1 变换；另外两组 3858/2734 面是摆开的展示副本，不属于装配模型。没有拉长原壳来凑 72 mm，也没有借 U137 的双天线、DC、MicroSIM 或印刷。

默认 `antenna:false`，目录预设 `complete`；`with-antenna` 对应 `antenna:true`。构造配置之外没有天线角度、盖板服务或插卡选项。原侧壁完整保留，NanoSIM 接收结构藏在内部，不注册可以从外部点击或插入的 `sim` 端口。NETLIGHT 只保留内部非发光 0603 包体，未证明外部光路，所以没有 LED 输出或虚构灯孔。

```js
import {Antenna} from '../src/units/catm/index.js';

const sma=modem.get('sma');
sma.attach(new Antenna());
const detached=sma.detach({dispose:false});
sma.attach(detached);
```

`sma` 为普通 SMA female。附件匹配字段是 `Antenna.meta.connector:'sma-female'`，实物插头记录为 `physicalConnector:'sma-male'`；Grove 与 RP-SMA 不匹配且不能覆盖现有附件。天线按本款照片的直立外形静态构建，约 111 mm 长/9.4 mm 直径只是外观估计。没有可靠轴与止挡依据，附件没有组件、关节、俯仰或转速 API；装拆不改变本体结构。

## NeoHEX：37 个独立 LED 与独立均光片

`neohexAssembly` 包含本款六耳 PCB、两个侧向直角 Grove、一个背向垂直 Grove-form 座、37 个真实 WS2812C-2020-V1 封装/透光体与独立均光片。LED 行数为 **4-5-6-7-6-5-4**；`led-1`…`led-37` 按本款 U1…U37 的上到下、左到右物理位置编号，不声明串行地址算法。它们是 37 个普通 `Led`，没有矩阵组件或自动图案引擎。

```js
light.get('led-1').set({color:'#ff7700',brightness:.6});
light.get('led-37').set('#20aaff');
light.get('led-37').set(false);
host.handle({type:'led',target:'grove/grove-2/led-2',
  color:'#60ff30',brightness:.4});
```

`Led.set` 接受布尔、颜色或 `{on,color,brightness}`，`getState()` 返回颜色和亮度；外部设置不产生 input，也不点亮邻灯、输出 WS2812 数据或执行级联。均光片只用近似透光材质表示实际薄片，没有光学标定与自动亮度补偿。

| ID | 真实结构/方向 | 接入边界 |
| --- | --- | --- |
| `grove` | J1，+X 侧；从背面看左边的 IN | 四芯包装的 canonical 输入 |
| `out` | J2，−X 侧；从背面看右边的 OUT | 真实四接点接收座；不自动转发数据或电源 |
| `grove-in` | J3，背面垂直 IN | 按本款照片构建 Grove-form 座；原理图通用 Header4 命名不替代物理依据 |
| `diffuser` | 独立乳白六角均光片的静态放置框架 | 自定义匹配族 `m5.neohex.diffuser`，表示放置与所有权，不声明制造插座、卡扣或铰链 |

默认 `diffuser:true`、预设 `with-diffuser`；`bare-board` 对应 `diffuser:false`。两种都保留真实安装孔和各自应保留的全部物理结构；含耳/接头包络约 **35.795715×40×9.85 mm**，移去厚 0.3 mm 的均光片后为 **35.795715×40×9.55 mm**。薄片厚度及安装接触高度属于有记录的推导。

```js
import {Diffuser} from '../src/units/neohex/index.js';

const seat=light.get('diffuser');
const sheet=seat.detach({dispose:false}); // 默认已有独立薄片
seat.attach(sheet);                      // 重接同一实例
// 对 diffuser:false 构造的灯板，可 seat.attach(new Diffuser())。
```

`Diffuser` 只有 `diffuserAssembly.sheet`，没有组件、关节或光学命令。错误 Grove 家族不能占用该放置点或替换已装薄片；LED 封装、PCB、连接器和固定印字不会跟随薄片拆除。本款没有后盖服务配置。

## ENV-IV：真实通气与被动传感器包体

`envIVAssembly` 依据本款尺寸/照片构建完整白色外壳、40 个交错通气口、红色四接点 Grove、实际 PCB 隔热岛/开槽以及 SHT40-AD1B 和 BMP280 包体。通气口与安装孔有真实材料孔壁，暴露方向后方是相应实物结构，没有使用贴纸遮住空缺。SHT40 的 1.5×1.5×0.54 mm、顶部 Ø0.6 mm 腔和 BMP280 的 2×2.5×0.95 mm 包络来自自身器件资料；隐藏安装、次级接点和压力口细部按来源标记推导。

本体组件顺序为 `grove,sht40,bmp280`，Grove 包装随后加入 `unitFrame,cable`。`sht40/bmp280` 是普通 `Component` 被动包体锚点，`getState()` 都是 `{}`，没有 `sensor` 类型、读数或温湿压/海拔/加热/地址命令。

```js
environment.get('sht40').getState();  // {}
environment.get('bmp280').getState(); // {}
```

默认 `rearCover:true`，预设 `closed`；服务预设 `rear-service` 对应 `rearCover:false`。这是构造配置，没有通用开盖动画或 hinge API。

```js
const serviceBody=await loadModel('env-iv',{rearCover:false});
serviceBody.ensureBuilt(); // 直接访问装配字段前完成延迟构建
console.assert(serviceBody.envIVAssembly.rear===null);
serviceBody.get('sht40').getState(); // {}，保留真实被动包体锚点
// 渲染/检查 serviceBody.root 后，完成时释放。
serviceBody.dispose();
```

`rear-service` 精确移去自己的 −Z 后盖组 **35 个物理网格**：后板 1、后壁 8、实体背膜 1、M5 浮雕 22，以及固定螺钉头/盲孔底/杆各 1。完整装配中，背贴、中央固定和 M5 浮雕同属 −Z 后半；+Z 通气正面没有 M5 或胶膜。服务配置的 `envIVAssembly.rear` 为 `null`，背贴墨层也为 0；全部保留的前壳、孔壁、安装柱、暗扣、PCB、真实包体、Grove 及锚点保持自己的物理 attributes/index/world。服务配置明确显示拆开的实体，不把去墨选项误当拆盖。

壳体包络为 **24×32×8 mm**，完整背膜加入后视觉厚度为 **8.04 mm**。本款没有机械控件、外部 LED 或关节；GND/5V/SDA/SCL 只是本款端子标注，不执行 I2C、电源或环境值仿真。

## 普通 PNG、实体印刷和隐私边界

公开运行资产共 **5 张普通 PNG**，完整形态分别为 CatM 2、NeoHEX 2、ENV-IV 1；数量及来源类型与各自冻结记录一致。

| 型号 | PNG 数量与来源类型 | 实际印刷载体 |
| --- | --- | --- |
| CatM | **2 张 `source-vector-raster`**，本款前/背原始矢量设计本地转高清 PNG，保留原字形与配色 | 两张真实实体薄膜，贴合自身原生凹台；背标保留所给原稿的认证区版本，旧官方照片没有该区，差异有记录 |
| NeoHEX | **2 张 `reference-redraw`**，按本款清楚官方照片用代码重绘前面的 1…37 位置与背面可读标注；不猜不可读批次微字 | 只投影到真实固定 PCB 的外向表面，**0 张实体胶膜**；真实孔/槽保持开口，均光片是单独实物 |
| ENV-IV | **1 张 `source-vector-raster`**，本款后标原始矢量本地转 **1605×1204 PNG** | −Z 后盖上的独立实体背膜；完整配置 1 个墨层，`rear-service` 为 0，+Z 通气前面不添标签 |

来源、变体和推导见 [CatM 印刷](research/catm/artwork.json)、[NeoHEX 印刷](research/neohex/artwork.json)、[ENV-IV 印刷](research/env-iv/artwork.json)。

`artwork:false` 仅关闭印刷墨层，实际壳、PCB、胶膜或实物印刷载体、接点与保留附件不应随之消失；各款在自己的真实构造选项中核对物理 attributes/index/world 矩阵。公开树只分发最终普通 PNG、代码、派生几何与安全来源说明；CSV、私有矢量、原文件名/链接/映射、转换器、中间证明和原始资料不分发，PNG 不携带私有文本元数据。

## 外部状态、输入与生命周期

外部框架发来的 LED 外观、`unitFrame` 姿态和电缆形状命令不回声为 input。三款本体没有按钮、滑杆或旋钮，不应凭空生成 down/up/click、蜂窝收包、LED 级联或环境数值事件。真实连接器 attach/detach 仍遵循核心 Port 生命周期，可产生机械装拆输入；桥接层只转发实际发生的输入意图，不把外观设置回传成设备业务事件。

`detach({dispose:false})` 后可以重接同一个模块；装拆一个分支不应改变宿主或其他分支。宿主最终 `dispose()` 递归释放模块、独立天线和均光片资源。必要本地记录见 [CatM](research/catm/smoke.json)、[NeoHEX](research/neohex/smoke.json)、[ENV-IV](research/env-iv/smoke.json)；这些来源/几何/接口检查不等于 GPU、量产配合或实体硬件验收。
