# Mini IMU-Pro / Glass / 8Servos2-Chain 接入

三款提供实际外形、接口、真实操作柄和外部像素驱动。当前公开 Git 为163款；接入本批后本地169款（14主机、155Unit），仍为 `modeled / visual-only`。本批 7 张普通PNG与模型同步；源码、三路集成及构建结果见[本批进度](../artifacts/imupro-glass-servoschain-expansion/progress.json)。内部读数、地址、电气、通信、声音合成与舵机/PWM行为由外部框架负责。

| 型号 / SKU | 名义尺寸X×Y×Z / mm | 实际端口 | 实际控件 / 外部输出 |
| --- | --- | --- | --- |
| `mini-imu-pro` / U171 | 24×24×8 | `grove` | 控件无；灯无；屏无 |
| `glass` / U158 | 42×53×6 | `grove` | 控件`button-a` / `button-b`；灯无；屏`screen` |
| `8servos2-chain` / U223 | 24×56×11.5 | `grove` / `out` / `ch0` / `ch1` / `ch2` / `ch3` / `ch4` / `ch5` / `ch6` / `ch7` / `dc` | 控件无；灯无；屏无 |

所有型号按自己的官方发布尺寸和本款实拍建模，不声明原生CAD面。U171壳同为24×24×8不表示其为U095；U158有自身侧键、MCU和蜂鸣载体，与Glass2不同；U223的官方外形图沿用了U222图中的内部圆件示意，模型保留该图的外尺寸/孔/窗/DC基准，内部按本款实拍电容与固定载体，未添加旧版旋钮或未证外灯。

## 入口、配置与生命周期

每款子路径导出 `Model`、`GroveModule`、`spec`。Model用于单独预览，GroveModule增加真实四芯线和 `unitFrame` / `cable`，本款组件ID保持。按需加载可用：

```js
import {loadModel, loadGroveModule} from '../src/loaders.js';
const standalone = await loadModel('mini-imu-pro');
standalone.root; // 先物化，再直接检查 components
const module = await loadGroveModule('8servos2-chain', {cableLength:90});
module.root;
standalone.dispose();
module.dispose();
```

| 型号 | 真实预设 | 默认参数 |
| --- | --- | --- |
| `mini-imu-pro` | `complete {}` | `{}` |
| `glass` | `assembled {}` | `{}` |
| `8servos2-chain` | `assembled {}` | `{}` |

`artwork:false`只去墨，不移除实体膜、PCB、玻璃、支柱、按键固定包体、焊脚和接点。隐藏安装、壳扣、壁厚及行程中由照片推导的部分见各自研究记录。不得把外观构造当作制造尺寸或量产配合验收。

## StickS3 → HUB → 三个真实四芯分支

```js
import {loadModel, loadGroveModule} from '../src/loaders.js';
const host = await loadModel('sticks3');
host.root;
const hub = await loadGroveModule('hub');
host.port('grove').attach(hub);
const imu = await loadGroveModule('mini-imu-pro', {cableLength:75});
const glass = await loadGroveModule('glass', {cableLength:90});
const chain = await loadGroveModule('8servos2-chain', {cableLength:105});
hub.get('grove-1').attach(imu);
hub.get('grove-2').attach(glass);
hub.get('grove-3').attach(chain);
host.handle({type:'pose',target:'grove/grove-2/unitFrame',
  position:[55,210,8],rotation:[.1,-.2,.15]});
host.handle({type:'cable',target:'grove/grove-2/cable',slack:12,bend:[0,0,-1]});
host.update(0);
```

所有实际Grove封装以 `grove` 为线缆入口。U223的标签是 **Chain IN**；`connector:'grove'` 在这里仅表示本款HY2.0-4P机械插接家族。标签、引脚名称和相同的4P外形不代表I2C、Chain串口、电压或固件互通。

## Glass：两侧瞬时键与透明蓝光屏

两枚真实侧向瞬时操作柄独立运动，固定黄色包体、金属框/端子、板与接口保持。具体轴向和推导行程见本款建模记录；未测量的力、止挡与触感不作为物理仿真。

```js
host.on('input', event => console.log(event));
host.handle({type:'button',target:'grove/grove-2/button-a',
  action:'press',source:'external:hand'});
host.update(.1);
host.handle({type:'button',target:'grove/grove-2/button-a',
  action:'release',source:'external:hand'});
host.update(.1);
```

`press/release/cancel`携带同一source；多个source持有时，释放一个不会提前弹回。最后取消抑制click，并让真实柄回位；成功释放发出down/up/click意图。动作不写屏幕或启动蜂鸣。B键路径为 `grove/grove-2/button-b`。

原厂面板PDF给出透明可见128×56、有效区35.05×15.32mm，像素pitch为0.274mm，点尺寸0.254mm，点包络35.052×15.324mm为圆整前值。官网35.05×18mm和128×64另记为文档差异；这里不拉伸56行，也不模拟控制器余行映射。42.04×27.22×1.25mm清透玻璃保留实体体积；屏幕是外部像素叠层，默认空白，前后可见且背面镜像。

```js
const pixels = new Uint8Array(128 * 56 * 4);
for (let y=0; y<56; y++) for (let x=0; x<128; x++) {
  const p=(y*128+x)*4, v=(x+y)%2 ? 255 : 0;
  pixels.set([v,v,v,255],p);
}
host.handle({type:'display',target:'grove/grove-2/screen',
  format:'rgba',x:0,y:0,w:128,h:56,data:pixels});
```

外部RGB/alpha字节留在原buffer，实际屏幕材质将亮度映成透明单色蓝光；黑像素透出真实玻璃和背后场景。支持原生外部RGBA、RGB888、RGB565及局部fill，固定 `style:'oled'`、无触摸；非法style、启用touch或直接touch调用按实际类合同拒绝，指针不产生触摸事件。`FramebufferPanel`可选择嵌套路径 `grove/grove-2/screen` 写校准图；选择目标和插拔刷新不自动写入其他屏幕。Node检查覆盖buffer、材质绑定和shader合同，没有GPU逐像素验收。

## Chain OUT、24针与DC实体

```js
const key = await loadGroveModule('key', {cableLength:55});
chain.get('out').attach(key);
host.handle({type:'button',target:'grove/grove-3/out/press',
  action:'press',source:'external:chain-peer'});
host.handle({type:'button',target:'grove/grove-3/out/press',
  action:'cancel',source:'external:chain-peer'});
host.update(.1);
```

此例验证实际下挂组件、四芯线和输入意图路径，不转发串行数据或模拟供电。DC深腔、24枚公针及固定电容/PCB均为真实结构；对应端口ID以首表和freeze为准。没有附送舵机运动、地址旋钮、自动灯态、ADC值或PWM状态。

插拔可保留同一实例；从宿主入口解析完整路径：

```js
const port = hub.get('grove-3');
const saved = port.detach({dispose:false});
port.attach(saved);
host.update(0);
host.dispose(); // 当前所附子树随之释放
```

## 印刷、来源和检查范围

Mini IMU-Pro U171 3张（`reference-redraw`），实际载体及配准见[印刷记录](research/mini-imu-pro/artwork.json)；Glass U158 2张（`reference-redraw`），实际载体及配准见[印刷记录](research/glass/artwork.json)；8Servos2-Chain U223 2张（`official-vector-raster`），实际载体及配准见[印刷记录](research/8servos2-chain/artwork.json)。所有来源按每款最终记录分开，不统称原稿。

原稿、表格、私有链接/名称/映射、矢量、生成器、官图原文件与中间件不分发；公开树仅有普通PNG及安全来源说明。没有照片裁切、错型号贴层、编造微字或用平面图片遮缺件。新增代码MIT，第三方原稿、商标和官方来源保留各自权利。

必要专项：`node scripts/check-imupro-glass-servoschain-units.mjs`。检查本批真实接口/动作、透明像素buffer、两入口实际配置和印刷不改实体、多口/四芯/变换父/独立装拆、同宿主peer与framebuffer、观察到的资源释放；实际导出、两仓构建及在线PNG字节结果由本批进度记录。不重跑历史全量，不作逐面浏览器、制造或实物验收。

来源：[U171](research/mini-imu-pro/sources.json) / [Glass](research/glass/sources.json) / [U223](research/8servos2-chain/sources.json)；建模与剩余推导：[U171](research/mini-imu-pro/modeling.md) / [Glass](research/glass/modeling.md) / [U223](research/8servos2-chain/modeling.md)；印刷：[U171](research/mini-imu-pro/artwork.json) / [Glass](research/glass/artwork.json) / [U223](research/8servos2-chain/artwork.json)。
