# CardKB2 / Neco / Mini OLED 接入

当前公开 Git 已同步 **163 款**；本批新增 **3 款、6 张 PNG** 为本地增量。三款均为 `modeled / visual-only`，依据各自的官方尺寸图、照片和原理图参数化完整结构，不借用旧 CardKB、HEX/NeoHEX 或其他 OLED 壳体，不声明官方 CAD 原面。[本批集成检查点](../artifacts/cardkb2-neco-minioled-expansion/progress.json)记录集成后的必要检查与资源验证状态。

| ID / SKU | 自身机械基准 | 实际组件 |
| --- | --- | --- |
| `cardkb2` / U215 | PCB **84×54×1 mm**；图纸带器件 **84.7×54.3×6.15 mm**，含推导 0.04 mm 背膜后视觉厚度 **6.19 mm**；四个 Ø2.2 孔，中心距 78×48 mm | `key-1`…`key-42`、`reset`、`boot` 共 44 个瞬时键，`rgb` 一个独立 RGB，`grove`、`usb` |
| `neco` / U163 | 完整猫耳板 **47.1×44.6×10.1 mm**、PCB 1 mm；43 mm 为外侧下孔中心距，28 mm 为内侧固定眼中心距 | `button` 一个后侧瞬时键，`led-1`…`led-35` 独立 RGB，后侧 `grove`、`out` 两个真实 Grove |
| `mini-oled` / U166 | 自身图纸 **25.8×12×6.75 mm**；正文厚度圆整为 6.8 mm；安装态含折回 FPC 的视觉包络 **25.8×12.12×6.75 mm** | `lcd` 为 **72×40 白色 OLED**，有效区 **9.196×5.18 mm**；`grove`、`grove-right` 双 Grove，无机械键或触控 |

三款合计 **45 个真实瞬时输入控件、36 个独立灯输出和一块白色 OLED**。这些数量只描述物理结构和组件接口；字符输入、组合键、键盘矩阵扫描、WS2812 级联、I2C/SSD1315、固件和电气行为由下游运行框架处理。

## 本体和 Grove 包装

每个产品文件都导出 `Model`、`GroveModule`、`spec`；CardKB2 另导出物理键位表 `KEYS`。`Model` 是独立本体；`GroveModule` 增加现有 `unitFrame`、`cable`，包含实际四芯线与两个插头，线缆输入均为本款 `grove`。访问模块组件统一使用 `.get(id)`。

下面是浏览器 ES module 示例，导入路径以本指南所在的 `docs/` 同层脚本为基准，直接使用各款原始导出：

```js
import {StickS3} from '../src/devices/sticks3/StickS3.js';
import {GroveModule as HubModule} from '../src/units/hub/index.js';
import {GroveModule as CardKB2Module,KEYS} from '../src/units/cardkb2/index.js';
import {GroveModule as NecoModule} from '../src/units/neco/index.js';
import {GroveModule as MiniOledModule} from '../src/units/mini-oled/index.js';

const host=new StickS3();
const hub=new HubModule({cableLength:70});
host.get('grove').attach(hub);
const keyboard=new CardKB2Module({cableLength:90});
const neco=new NecoModule({cableLength:100});
const oled=new MiniOledModule({cableLength:110});
hub.get('grove-1').attach(keyboard);
hub.get('grove-2').attach(neco);
hub.get('grove-3').attach(oled);

// 宿主循环调用 host.update(dtSeconds)，渲染 host.root。
```

真实三路组件路径分别以 `grove/grove-1/`、`grove/grove-2/`、`grove/grove-3/` 开头，例如：

```js
host.handle({type:'pose',target:'grove/grove-1/unitFrame',
  position:[-70,210,10],rotation:[.1,-.2,.15]});
host.handle({type:'cable',target:'grove/grove-1/cable',
  slack:12,bend:[0,0,-1]});
```

位置以所属框架内的 mm 表示，+X 右、+Y 上、+Z 正面。姿态和线形只调整本体及真实四芯线，不路由总线或电气状态。`cableLength`、`unitPose`、`cable:{slack,bend}` 属于共用 Grove 包装选项；本款真实构造预设如下，不把墨层开关或任意姿态编造成服务拆装：

| 型号 | `defaults` | 唯一实际 `{id,name,options}` 预设 |
| --- | --- | --- |
| CardKB2 | `{}` | `complete` / `Complete CardKB2 populated board` / `{}` |
| Neco | `{}` | `assembled` / `完整猫耳灯板` / `{}` |
| Mini OLED | `{}` | `assembled` / `Complete Mini OLED with folded FPC` / `{}` |

## 真实瞬时键与独立灯

CardKB2 的 42 个主键按前视四行从左到右编号，行数为 **10+11+11+10**。`KEYS` 的 `label` 只说明相邻固定 PCB 印字；真实红色帽体本身无字，不把单键意图转换为字符或 Fn/Aa/Sym 状态。主键只有真实帽体和 plunger 沿 −Z 移动 0.22 mm；RST 沿 −Y、BOOT 沿 +Y 向内移动 0.16 mm，固定底座、金属盖、黄色盖和焊脚保持原位。

Neco 的 `button` 只有后侧真实黄色帽和黑色中心沿 +Z 压入 0.15 mm；开孔盖、帽井、封闭底座和四端焊脚固定。上述行程均为有记录的外观推导，不能当作实测止挡或按压力。

```js
const q=KEYS.find(key=>key.label==='Q'); // 本款物理 key-11
keyboard.get(q.id).press('pointer:7');
keyboard.get(q.id).press('keyboard:KeyQ');
keyboard.get(q.id).cancel('pointer:7'); // 另一个来源仍保持，帽体继续按下
keyboard.get(q.id).release('keyboard:KeyQ'); // 最后 up 带 cancelled:true，无 click

host.handle({type:'button',target:'grove/grove-2/button',
  action:'press',source:'external:demo'});
host.handle({type:'button',target:'grove/grove-2/button',
  action:'release',source:'external:demo'});
```

`press/release/cancel` 表达真实输入意图；多源按住期间只产生一次 down，最终释放后回弹。有源取消会抑制本次 click。CardKB2 为 `down/up/click`，禁用 longpress 定时；Neco 沿用普通 Button 的 `down/up/click/longpress`，其长按阈值为 800 ms。按 RST/BOOT 不自动复位或烧录，按 Neco 键也不自动切换灯效。

```js
keyboard.get('rgb').set({color:'#4090ff',brightness:.6});
neco.get('led-1').set({color:'#ff7700',brightness:.5});
host.handle({type:'led',target:'grove/grove-2/led-35',
  color:'#40ff80',brightness:.4});
neco.get('led-1').set(false);

host.on('input',event=>{
  if(event.kind==='button')console.log(event.id,event.action,event.cancelled??false);
});
```

36 个灯输出默认关闭，每个实际发光件单独接受 `on/color/brightness`。Neco 的可见路径编号从正视下左端经过尖端到右端，**不声称等于原理图 U 编号或串行地址**；每颗封胶独立发光，billboard glow 关闭。现有 demo 可通过普通 `list('led')` 逐颗选取。灯、屏幕、姿态和线形设置不回声为 input；显式按键操作则按上述合同发出输入意图。

## 72×40 白色 OLED 外驱

Mini OLED 的 `lcd` 默认 framebuffer 为不透明黑色空白，没有永久样例图。它保留实际玻璃本体、非显示边框、COG 封胶、安装支撑及折回 16 线 FPC；外部更新只改 framebuffer、纹理或亮度 uniform，不移除玻璃、PCB、FPC 或接收座。

`lcd` 沿用 Display 的 `writeRGBA`、`writeRGB888`、`writeRGB565`、局部矩形、`fill` 和 canvas `getContext2D()/present()`。像素原点在正视左上角，X 向右、Y 向下；写入数据保留在实时 DataTexture 使用的同一个 framebuffer，渲染时以亮度 **0.5** 为白/黑阈值，保持白色硬件外观。

```js
const rgba=new Uint8Array(72*40*4);
for(let y=0;y<40;y++)for(let x=0;x<72;x++){
  const offset=(y*72+x)*4;
  const white=(x>=8&&x<64&&y>=10&&y<30)?255:0;
  rgba[offset]=white;
  rgba[offset+1]=white;
  rgba[offset+2]=white;
  rgba[offset+3]=255;
}
host.handle({type:'display',target:'grove/grove-3/lcd',
  format:'rgba',data:rgba,x:0,y:0,w:72,h:40});
oled.get('lcd').fill('#000000',{x:12,y:14,w:48,h:12});

// 既有 RGB565 写入也可使用 format:'rgb565' 和 swapBytes:true；
// RGB888 的命令格式为 'rgb888'，RGBA 也接受 'rgba8888'。
```

屏幕固定 `style:'oled'`、`touch:false`，Model 和 Grove 包装内均使用这个固定类。`setStyle('oled')` 和 `setTouchEnabled(false)` 只确认允许的状态；其他 style、启用 touch 或直接 `.touch(...)` 都会抛错。`display` 命令先检查 style/touch，非法值在像素、fill 或亮度修改之前拒绝；指针钩子没有触控输入事件。

```js
host.handle({type:'display',target:'grove/grove-3/lcd',
  style:'oled',touch:false,pixelEffect:true,backlight:.65,power:true});
oled.get('lcd').setPower(false); // 只关闭显示外观，保留 framebuffer
oled.get('lcd').setPower(true);
```

共用字段 `backlight` 在这里仅表示显示亮度外观，没有增加真实背光器件或功耗模拟。`power`、`pixelEffect`、像素/Canvas 设置均无 input 回响，不执行 I2C 或 SSD1315 寄存器命令。

## 双 Grove、USB 与生命周期

Neco 后视左输入座在模型 +X，为 `grove`；后视右输出座在 −X，为 `out`，两个接收口都朝背面。各座保留四个实体接点、折弯 SMD 尾脚/焊盘、固定锚片和封闭深背板。输出侧 PCB 的底部印字为 BTN，但原理图 J2 pin1 未连接；模型保留实物文字，并明确记为 NC，不由印字虚构线路。

可将上例同一个 OLED 实例从 HUB 第三路转移到 Neco 的真实后座，再恢复；转移保留实例，原座变空：

```js
neco.get('out').attach(oled);
// OLED 当前路径前缀为 grove/grove-2/out/。
// 不会自动复制 Neco 灯状态、按键或任何串行数据。
hub.get('grove-3').attach(oled);
```

Mini OLED 的左 X 口 `grove` 是线缆入口，右 X 口 `grove-right` 是第二个真实接收座，可继续附加 Grove 实例；路径将位于当前 OLED 前缀的 `grove-right/` 下。两侧都有实体四接点、折弯 SMD 末端和封闭背衬，机械嵌套不触发总线透传或 framebuffer 复制。

CardKB2 的 `usb` 是真实 USB-C 接收口，含中央舌片、24 个接触片和深背衬，仅提供 `usb-c` 机械连接家族；没有附赠假定的 USB 模块/服务预设，也不模拟 USB 枚举、HID、充电或固件。全部连接器标签只说明来源，不实现电源透传、串行或协议功能。

`detach({dispose:false})` 可以保留实例后重接；错误家族在替换占用前拒绝。装拆或外驱一个分支不应改动其他分支。最终 `host.dispose()` 递归释放 Grove 模块、实际帽体、几何、材质、电缆及 framebuffer 资源。

## 印刷载体与证据

- CardKB2：正面一张 `reference-redraw` 为固定 PCB 间隙的可读键名/符号，移动的 44 个帽体均不印字；背面一张 `source-vector-raster` 保留本款原设计字形和配色，附于有实物依据的独立背膜，真实裁空安装孔/长孔/USB 让位。
- Neco：正背两张 `reference-redraw`，分别为 17 个电容丝印轮廓，以及可读 M5STACK/Grove 字和箭头；墨层直接贴实际 PCB，0 片假胶膜。
- Mini OLED：正背两张 `reference-redraw` 是本款清晰官方 PCB 照片的代码重绘，包含可读 `2323/V1.0`、`Mini OLED/M5Stack.com` 与引脚方框；墨层只投影到固定 PCB，玻璃可能遮住正面部分字，没有假胶膜或永久屏幕贴图。

`artwork:false` 只关闭墨层，PCB、真实背膜、玻璃/FPC、帽体、焊脚及其 attributes/index/world 保持；没有单张平图遮住缺失的器件或按键。公开树只分发最终普通 PNG 与安全来源说明；CSV、私有矢量、原名/链接/映射、原图、生成器和中间证明不分发。字形重绘的字体、颜色、配准及未标尺寸的安装、孔径、隐藏结构均按各款说明列为推导。

CardKB2 的板厚/整机厚度、Neco 的孔中心距/完整外宽分别记录，不压扁器件或拉伸板体凑标称尺寸。Neco CDN STEP 的许可路线未确认，本款不消费其原面。三款不提供任意拆盖、展开 FPC 或假关节预设。

Mini OLED 的 12 mm 是刚性板面宽度，安装态推导的 0.1 mm FPC 绕板边后视觉范围多出约 0.12 mm；该范围单列，未通过删除板材或把 FPC 塞入 PCB 来凑尺寸。折弯半径、隐藏安装、粘接层、接收座细部和未标 PCB 孔均为有记录的推导；未给这些小孔擅定整机安装用途。

来源、印刷和必要本地检查见 [CardKB2 建模](research/cardkb2/modeling.md)、[CardKB2 印刷](research/cardkb2/artwork.json)、[CardKB2 smoke](research/cardkb2/smoke.json)、[Neco 建模](research/neco/modeling.md)、[Neco 印刷](research/neco/artwork.json)、[Neco smoke](research/neco/smoke.json)、[Mini OLED 建模](research/mini-oled/modeling.md)、[Mini OLED 印刷](research/mini-oled/artwork.json)、[Mini OLED smoke](research/mini-oled/smoke.json)。这些记录不等于 GPU/浏览器、量产配合或实物硬件验收；最终集成状态以本批检查点为准。
