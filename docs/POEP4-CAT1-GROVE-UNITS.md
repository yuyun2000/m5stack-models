# PoE-P4 / Cat1-CN / Grove-to-Grove 接入

本批负责真实外观、控件压放、附件折弯、服务配置及物理连接。固件、USB/网络/PoE、蜂窝通信、供电、电气和协议路由由外部框架实现。阶段保持 `modeled`，各检查结果以[本批进度](../artifacts/poep4-cat1-grove-expansion/progress.json)为准；没有新增逐面浏览器、全量历史或实物验收。

| loader ID | SKU | 实际外形/API |
| --- | --- | --- |
| `poe-p4` | U213 | RJ45、双USB-C、Grove、CSI/DSI、SDIO/ISP/Hat2、真实`user`键、独立`rgb`/`link-led`/`activity-led` |
| `cat1-cn` | U204 | Grove、普通SMA、可拆108mm天线/有限`tilt`、真实后盖服务配置及内部SIM座 |
| `grove-to-grove` | U148 | 底黑`grove`、左白`in`、右白`out`三个板端socket，完整电路实体 |

三款导出 `Model` / `GroveModule` / `spec`，Cat1-CN另导出 `Antenna`。主入口为 `PoEP4Unit` / `PoEP4UnitModule`、`Cat1CnUnit` / `Cat1CnUnitModule` / `Cat1Antenna`、`GroveToGroveUnit` / `GroveToGroveUnitModule`；推荐按需loader或产品子路径。

## PoE-P4：完整壳体与真实接口

本款U213与U138 PoESP32不同，以自身6158源三角的同位大壳/背盖组合为基线，64×24×20.2 mm；两个摆开重复件不重复放入运行装配。原CAD的Host USB-C和Hat2入口各有与本款官图10/12冲突的封闭面，运行壳仅在这两个有证据区域作闭合开口派生，不称未经修改的原壳。原/派生面数、修改区域、原阻塞与实际孔腔证据见单品来源与smoke。保真实PCB/ESP32-P4/PoE组件、RJ45深腔与8触点、USB-C舌片/触点、Grove、FPC和排座、实际键和各灯载体，隐藏安装与封装细节推导见[本款来源](research/poe-p4/sources.json)。

九个物理Port分别为 `grove`、`usb-host`、`usb-otg`、`ethernet`、`csi`、`dsi`、`sdio`、`isp`、`hat2`。两24pin FPC按自身卡座建模；SDIO的9孔和ISP的6孔有官图/尺寸图支持的黑塑料female载体、方形深腔和簧片，PCB焊孔另行存在。Hat2为本款2×8 female结构，采用独立16pin家族，不按名字接入现有8pin附件。端口元数据记录实际几何与针列，不自动实现USB角色、MIPI、SDIO、ISP、网络或供电。

`user`只驱动真实原壳舌的按压形变，释放/取消恢复位置和法线；固定壳、PCB、各接口和灯不随动。`rgb`、`link-led`、`activity-led`默认关闭、分别由外部设置，按键不自动联动网络状态或灯色。IR只还原实际器件/透镜，不画可见红外光束或通信动画。套装无屏、相机、USB或网线附件，默认装配不添加这些配件。

## Cat1-CN：普通SMA、配套天线与后盖服务

本款ML307R-DL装配使用完整6562三角本款壳，24×64×8 mm与含SMA71.4 mm名义长度分记。原装组件的6562面与摆开前/后壳逐面对应，保绕向、0遗漏/0歧义；最大坐标差约0.0000057402 mm。前2714/后3848仍用原装坐标，只分组，不切面拉伸。

机端普通SMA母座为外螺纹/中心孔；配套108×10 mm天线为内螺纹/中心针，与C6L的RP-SMA不同。`antenna:false`默认不装，`antenna:true`装本款独立可拆 `Antenna`。附件 `tilt`只移动真实肘关节与上杆，耦合/机端、壳和PCB固定；本款官图显示90°肘关节，0–90°是按自身结构重建的外驱可视化范围，不代表两端姿态均有照片证明或已测机械止挡。拒绝非零RPM，不模拟螺纹旋合/射频或信号强度。

`rearCover:true`为闭壳。`rearCover:false`只去掉实际后盖、背膜与3颗后螺钉，保真实前壳和PCB/安装件，形成有官方SIM操作图依据的服务视图。Nano-SIM金属座、IPEX→同轴线→SMA馈线实体独立存在，SIM为开后盖时的被动 `sim`锚，不注册穿壳点击的外部卡槽或虚构抽屉/铰链。默认不附SIM卡；未断言卡盖运动基准，不提供其动画。

外部只有 `grove`、`sma`。USB在原理图为测试点，不构造外部USB口。壳顶小窗显露金色安装件，未证外灯光路；内部D1按实际封装建模，不注册外部LED或假按钮。SIM、天线和服务视图均不改变网络、运营商、固件或电气状态。

## Grove-to-Grove：三个socket

本款源组件0+2共3974三角是同位实际完整装配，1/3是摆开副本。按本款proper刚性变换统一+X右/+Y双白座端/+Z正面，不拉伸24×32×8 mm源壳凑官方接口截面8.1 mm。

底部黑座为控制口 canonical `grove`，左白`in`、右白`out`；三者都是有开放槽腔、四根公针与保持桥的板端socket，可接受普通四芯Grove线。没有固定线端plug或 `DirectModule`。HT7533、INA199A1DCKR、SGM2553D、TL432及自身R/C、PCB、触点、背衬和膜齐备，不能把实际电路简化成一组直通线。没有机械控件、灯、显示或传感器API；不产生电流值、不自动开关或路由电气。

## 接入示例

```js
import {loadModel,loadGroveModule} from '../src/loaders.js';
const host = await loadModel('sticks3');
const hub = await loadGroveModule('hub');
host.port('grove').attach(hub);
const poe = await loadGroveModule('poe-p4');
const cat = await loadGroveModule('cat1-cn',{antenna:true});
const adapter = await loadGroveModule('grove-to-grove');
hub.port('grove-1').attach(poe);
hub.port('grove-2').attach(cat);
hub.port('grove-3').attach(adapter);
host.handle({type:'led',target:'grove/grove-1/rgb',
  color:'#38a2ef',brightness:0.45});
host.handle({type:'joint',target:'grove/grove-2/sma/tilt',
  angleDeg:90,durationMs:250});
function userDown(source='demo') {
  host.handle({type:'button',target:'grove/grove-1/user',action:'press',source});
}
function userUp(source='demo',cancelled=false) {
  host.handle({type:'button',target:'grove/grove-1/user',
    action:cancelled?'cancel':'release',source});
}
const peer = await loadGroveModule('key');
adapter.port('out').attach(peer); // physical four-core link, no power/protocol routing
function onFrame(deltaSeconds) { host.update(deltaSeconds); }
// Teardown: host.dispose().
```

需要查看SIM实体时另建服务配置，端口和外驱状态由调用者独立持有：

```js
const service = await loadModel('cat1-cn',{rearCover:false,antenna:false});
const simAnchor = service.get('sim'); // passive empty state; no SIM/network behavior
// Teardown: service.dispose().
```

## 同步印刷与必要检查

PoE-P4前异形大标/背电路图/Hat端标/Grove侧色条四片和Cat1-CN正背两片均来自严格本款机身原稿，栅格为普通PNG；包装/摄影视图排除。Grove-to-Grove正背两片按本款可读官图代码重绘。最终来源、面数和配准见各`research/<id>/artwork.json`。不裁照片、不借错型号、不编不可辨小字，也不靠PNG填缺失的实体。

`artwork:false`只取消墨层，真实膜、壳、板、腔/触点、键、天线和实际服务配置仍在；两入口及全部真实配置的所有物理attributes/index/世界矩阵保持一致。必要专项：`node scripts/check-poep4-cat1-grove-units.mjs`，覆盖三分支四芯、真实按键多源压放取消/固定件、独立灯、天线有限角及SMA极性、后盖服务、多口独立装拆/拒错、印刷物理和主机framebuffer保持。导出、构建与5188资源字节的实际结果见[本批进度](../artifacts/poep4-cat1-grove-expansion/progress.json)。

CSV、私有链接/映射/原稿名、矢量、原始官图/CAD/PDF/MCP全文、生成器与中间件留分发树外；新增代码MIT，第三方来源、印刷和商标保留各自权利。旧贴纸/Scroll/StackChan和Puzzle Bridge缺基准检查点继续保留。
