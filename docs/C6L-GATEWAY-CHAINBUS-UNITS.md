# C6L / Gateway H2 / ChainBus 接入

本批提供实际外形、真实控件/接口、外部framebuffer与灯光，以及两种有物理依据的ChainBus接法。内部无线、boot/reset固件、USB/UART/I2C、ChainBus路由和电气由外部框架实现。三款继续 `modeled`；未完成逐面浏览器、生产配合或实物验收。

| loader ID | SKU | 主要可见结构/API | 对应PNG |
| --- | --- | --- | --- |
| `c6l` | U202 | `screen`64×48、`user`/`reset`、`rgb`/`status`、`grove`/`usb`/`lora-antenna`/`wifi-antenna` | 4：背原稿、前原稿局部参考修订、两天线套环重绘 |
| `gateway-h2` | U195 | 默认闭壳仅`grove`；`shell:false`裸板增加`boot`/`usb`/`download` | 2：闭壳正背参考重绘，裸板无印刷层 |
| `chainbus` | U212 | `grove`即左IN、`out`、真实白色`ext`插头、独立`rgb`；额外`DirectModule` | 2：本款机身前背原稿栅格 |

三款导出 `Model` / `GroveModule` / `spec`。总入口别名为 `C6lUnit` / `C6lUnitModule` / `C6lLoraAntenna` / `C6lWifiAntenna`、`GatewayH2Unit` / `GatewayH2UnitModule`、`ChainBusUnit` / `ChainBusUnitModule` / `ChainBusDirectModule`；按需loader及产品子路径避免导入全部设备。

## C6L：屏、真实舌片与RP-SMA

本款原壳长56 mm，含外伸射频接头的名义总长62 mm、宽24 mm、厚8 mm；两根套装天线分别为LoRa108 mm、Wi-Fi84 mm，不把天线包含在裸机名义长度内，也不拉伸原壳。保留完整原生壳与状态导光件、实际PCB/ESP32-C6/SX1262、电路封装、OLED/显示深度、Grove/USB-C、蜂鸣器实体和双RP-SMA。

本体接头是外螺纹加中心针，天线是内螺纹加中心孔；RP-SMA与普通SMA不是同一接受家族。`options.antennas:true`同时装配两根正确长度的套装天线，`false`查看裸接头；两口仍可独立装拆。只保已证直立外形，不借其他产品的0–90°铰链/机械止挡。隐藏接头内部、板位/安装及局部参数的推导在单品来源列明。

`user`和侧面同一`reset`键是原生舌片的可见变形，压下时相应开关柱塞随实际舌片移动，固定开关座/PCB保持；多源保持/释放/取消恢复原始位置、法线和柱塞姿态；不再造一个外露BOOT键。长按只产生输入意图，不自动执行重启/下载或将灯由绿变红。前标签只覆盖天线端固定面，不跨用户舌片；侧reset没有贴纸，避免静态印刷悬在压下键面上。

`screen`为64×48外部framebuffer，调用者提供像素。本库不运行SSD1306固件、字符终端或无线状态页。`rgb`/`status`默认关闭，外部独立设置颜色/亮度；蜂鸣器只还原实体，不提供音频合成或固件行为。

## Gateway H2：闭壳与裸板配置

默认`shell:true`完整保留本款3580三角原壳，24×48×8 mm，只有真实外露Grove。官方裸板图/GIF中的USB与Boot在闭壳装配中被真实墙面遮挡，不挖假开口、不提供穿壳点击目标。

`shell:false`是有官方裸板参考的板级装配视图：实际ESP32-H2-MINI-1-N2、固定PCB天线、板/孔/元件、右侧USB-C、Boot黑帽和六个镀通孔可见；不含外壳、膜或外壳螺钉，不伪造拆壳铰链。仅该配置注册`boot`按键、`usb` Port及`download`被动六孔锚。下载孔不是带塑料排座的Header，锚不执行烧录/调试；Boot只发输入意图。灰显可选LED及不明光路不转成外灯或网络指示动画。

装配/光路缺资料已反馈 `8b19aa0e25cb43c5b85c283abd8d9421`；推导和隐藏结构以[本款来源](research/gateway-h2/sources.json)为准。

## ChainBus：线缆与直接插接

完整本款原生壳/锁舌/RGB导光件4156三角保留。原壳体24×24×8 mm，原生锁舌突出到26.6795 mm；补齐实际白色四腔插头主体后，总长29.8 mm。PCB/STM32、左右蓝色敞口座、四腔触点、真实锁舌和印刷载体独立存在。

左IN与右OUT是HY2.0-4P板载插座，顶部EXT是固定白色线端插头。两个入口按真实接法区分：

- `GroveModule`从左IN（canonical id `grove`）接四芯线，`out`可继续挂真实四芯模块。普通`unitFrame`/`cable`外驱沿用既有API。
- `DirectModule`将同一完整整机以固定装配变换插入host的Grove插座，使用本体白EXT，不创建VisualCable或第二只白源插头。没有自身`unitFrame`/`cable`，姿态随所插主机固定。EXT鼻端相对host frame的1.2 mm插入沿用现有线端插头外观基准，属于装配推导，未证明量产插合。

本体`ext.connector`为`hy2.0-4p-plug`，拒绝普通GroveModule的插头对插头；DirectModule的`meta.connector='grove'`描述它可插入的hostsocket，`inputPort='ext'`标明真实白插头入口。此命名不自动推断公母或电气。IN/OUT、EXT的针名与文献标签只作外观元数据，不自动转发UART/I2C/GPIO。官方正文与原理图UART编号冲突已反馈 `edca641cfca844a2a21fe0aa326d25de`，模型不替文献判定电气路由。

## 接入示例

```js
import {loadModel, loadGroveModule} from '../src/loaders.js';
const host = await loadModel('sticks3');
const hub = await loadGroveModule('hub');
host.port('grove').attach(hub);
const c6l = await loadGroveModule('c6l', {antennas: true});
const h2 = await loadGroveModule('gateway-h2');
const chain = await loadGroveModule('chainbus');
hub.port('grove-1').attach(c6l);
hub.port('grove-2').attach(h2);
hub.port('grove-3').attach(chain);
c6l.display('screen').fill('#b5b5b5'); // or supply external framebuffer pixels
host.handle({type:'led', target:'grove/grove-1/rgb',
  color:'#38a2ef', brightness:0.45});
function userDown(source='demo') {
  host.handle({type:'button',target:'grove/grove-1/user',action:'press',source});
}
function userUp(source='demo',cancelled=false) {
  host.handle({type:'button',target:'grove/grove-1/user',
    action:cancelled?'cancel':'release',source});
}
const peer = await loadGroveModule('key');
chain.port('out').attach(peer); // physical four-core link, no protocol forwarding
function onFrame(deltaSeconds) { host.update(deltaSeconds); }
// Teardown: host.dispose().
```

裸板与直接插接是独立配置/入口，不能给闭壳或EXT再叠一条线：

```js
const bareH2 = await loadGroveModule('gateway-h2', {shell:false});
// After attaching to a host, route its boot press/release/cancel through that path.
const {DirectModule} = await import('../src/units/chainbus/index.js');
const directHost = await loadModel('sticks3');
const direct = new DirectModule();
directHost.port('grove').attach(direct);
// Direct owns no cable; its OUT remains a real socket for a four-core peer.
const saved = directHost.port('grove').detach({dispose:false});
directHost.port('grove').attach(saved);
// Teardown: directHost.dispose(); dispose bareH2 if it was never attached.
```

更多数据见[C6L来源](research/c6l/sources.json)、[Gateway H2来源](research/gateway-h2/sources.json)、[ChainBus来源](research/chainbus/sources.json)及各`dimensions.js`/`cad-map.json`。输入、颜色/像素、物理连接及外部位姿不代表固件、协议或电气执行。

## 印刷与必要检查

共8张最终普通PNG：C6L背面源矢量派生，前面保留源字形/标志，仅按当前官图修订频段带，明确标`source-vector-raster-and-reference-redraw`；两天线可读LoRa/Wi-Fi套环为`reference-redraw`。Gateway H2候选均为包装/标题条，排除后按本款官图重绘正背2张。ChainBus仅选本款机身前背原稿，保原字形/配色/挖口，2张`source-vector-raster`。不裁照片、不借错型号/包装、不编不可辨小字，也不称修改过的前面PNG为未经改动原稿。

`artwork:false`只去掉印刷；保留实际膜、外壳、PCB/封装、深腔/触点、锁舌/导光件、显示/键、RP-SMA与天线套环实体。Gateway裸板无外壳印刷时，允许印刷面数为0。两个常规入口、ChainBus第三直接入口及所有实际配置的全部物理attributes/index/世界矩阵保持一致。

必要专项：`node scripts/check-c6l-gateway-chainbus-units.mjs`。单品/多源真实键压放取消回位、独立灯/OLED pixels、RP-SMA拒普通SMA、三分支四芯/IN-OUT级联/EXT直接装拆不叠线、多入口印刷物理、九导出/两build及5188在线资源字节的实际结果见[本批进度](../artifacts/c6l-gateway-chainbus-expansion/progress.json)。未做新增逐面浏览器、全量历史、制造配合或实物验收。CSV、私有链接/映射/原稿名、矢量、原始官图/CAD/PDF/MCP长文、生成器和中间件留仓库外；新增代码MIT，第三方来源/印刷/商标保留权利。
