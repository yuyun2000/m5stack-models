# Weight / SSR / PoE CAM-W v1.1 接入

本批负责真实外观、可拆端子和外部驱动的螺钉头/控件/支架形状。称重读数、SSR状态、电气/供电、摄像/AI/视频、网络/PoE、固件和协议由其他框架实现。阶段保持 `modeled`，实际检查范围见[本批进度](../artifacts/weight-ssr-poecam-expansion/progress.json)，不等于逐面浏览器/GPU或实物验收。

| loader ID | SKU | 实际外观/API |
| --- | --- | --- |
| `weight` | U030 | 原款HX711板、Grove、4P固定端子及可拆四螺钉插头 |
| `ssr` | U122 | 本款MOC3043M/BT136S、黑Grove、橙4P固定端子及可拆四头插头 |
| `poe-cam-w-v11` | U121-B-V11 | 固定OV3660、RJ45/Grove、真实控件/指示载体及自身原生Stand/Brick |

三款均导出 `Model` / `GroveModule` / `spec`。主入口分别为 `WeightUnit` / `WeightUnitModule`、`SsrUnit` / `SsrUnitModule`、`PoECamWV11Unit` / `PoECamWV11UnitModule`。两款端子附件为 `WeightTerminalPlug` / `SsrTerminalPlug`，各产品子路径导出 `TerminalPlug`；PoECAM附件主入口为 `PoECamWV11Stand` / `PoECamWV11BackBrick`，子路径导出 `Stand` / `BackBrick`。推荐按需loader或产品子路径。

## Weight：原款HX711

U030使用自身原装3216三角，24×32×8 mm原壳与含固定端子的10.2 mm厚度分列；摆开副本不重复放入运行装配，不拉壳凑尺寸。实际PCB/HX711、Grove、固定4P座/触点和可拆插头按本款官图建立；隐藏安装、连接器孔壁和插头配合尺寸等推导详见[本款来源](research/weight/sources.json)；螺钉仅转动工具头，轴向行程未建模。

这是HX711/DAT-CLK原款，和已覆盖的Weight-I2C不同。实际本体只有 `grove` / `terminal`，没有MCU、I2C地址、按钮、LED、显示、sensor或自动重量状态。包装不附称重传感器或秤台，模型不添加这些物件。铭牌A+/A−/E−/E+及接口文字仅还原可见印刷，不自动实现电气连接或采样。

默认 `{terminalPlug:false}`；`{terminalPlug:true}`安装本款可拆 `TerminalPlug`。没有用贴图代替端子孔、簧片、固定夹笼和材料壁，也没有借U180插头尺寸。

## SSR：小型独立U122

本款同位原壳组件0+2共5630三角（rear3032/front2598），排除摆开副本；24×56×8 mm壳与含固定座的10.2 mm厚度分列，不缩放壳体。内部为自身MOC3043M、BT136S、SS8050、熔断器/阻容与钳位器件的实际封装重建；隐藏板位、封装安装、端子配合推导见[本款来源](research/ssr/sources.json)。

实际本体只有 `grove` / `terminal`。不套ACSSR/DCSSR的ESP32-C3控制器、RS485PWR、大型DELIXI模块、按钮或RGB。内部D1红色封装有原理图依据，外部透光位置未证时保固定非发光，不注册虚构外灯。没有机械继电器衔铁、触点运动、SSR开关状态或负载/电气模拟。

顶端橙色4P板座、独立四螺钉插头及前后机身印刷按本款来源。前贴1605×2708为 `source-vector-raster-and-reference-redraw`（原路径加本款灰/绿样式恢复），背贴1623×3620为 `source-vector-raster`（描边转换修复），不是两张未经修改的原稿直出。IN/COM/COM/OUT文字是可见外观，不构建电气连通图。默认 `{terminalPlug:false}`，`{terminalPlug:true}`安装自身 `TerminalPlug`。不能只因针距相同，就把不同型号附件的推导尺寸当作已验证量产互配。

## 两款端子附件

每个插头有四个真实线孔/接触腔、孔壁与相应夹持实体；独立 `screw-1` 至 `screw-4` 只旋转可见工具头。固定螺钉轴/夹笼/簧片/插舌/外壳保持。`angleDeg` / `durationMs` 是外驱视觉参数，非螺纹夹紧量；`visualRangeDeg`是浏览器展示建议，不是测得的机械止挡。拒绝非零RPM，不模拟轴向行程、扭矩、夹紧力或电气。

附件Module用 `get('screw-1')` 访问。通过主机层级可发 `grove/<hub-port>/terminal/screw-1`，装拆使用本体 `port('terminal')`。需要保留拆下附件时用 `{dispose:false}`，调用者负责后续释放；默认拆卸释放该附件资源。

## PoE CAM-W v1.1：自身相机和原生安装件

严格U121-B-V11/OV3660与本款64×24×18 mm来源。原生外壳、相机/夹持件4892源面、独立Brick3348和Stand夹板/腿脚5080源面均来自自己的CAD，排展示副本，不借UnitV2/CamS3/PoESP32。模型保真实壳与PCB/镜头深度、接口腔/触点、帽/舌、安装件和标签实体；原/运行分组与装配推导见[本款来源](research/poe-cam-w-v11/sources.json)。

RJ45与Grove位于本款相对两端；G37 `user`是长侧原生U舌片，RST `reset`按实际服务槽/开关帽处理。两者只发输入意图和外观压放/取消复位，不执行重启或固件行为。原有开口已确认能触及两组3pin深底和RST帽；默认可访问 `download-p2` / `download-p3` 与 `reset`，无需去盖配置。下载口是各自独立连接家族，不接Grove附件；不添加本体USB或存储卡附件。

`blue` 与RJ45的 `link-led`（黄）/ `activity-led`（绿）只改变真实载体的外部请求状态，不从按键、接线、网络或PoE推断灯态；未确证光路保原遮挡，不挖假窗或显示穿壳光晕。原理图中未获本款装配依据的RGB不添加。`camera`只代表固定光学锚，无camera framebuffer、图像、检测框或AI/视频结果。

`Stand`使用本款原生夹板/腿脚，关节只改变真实单轴相对角；固定机身/镜头与夹板不跟着腿脚转。轴、展示范围、安装姿态和隐藏配合仍分记推导，不冒充量产止挡。`BackBrick`为自己的原生固定安装件，没有虚构铰链。默认 `{mount:'none'}`；可选 `{mount:'stand'}` / `{mount:'brick'}`，也可用 `port('mount')` 独立装拆。Stand用 `get('tilt')` 访问，层级命令地址为 `grove/grove-3/mount/tilt`，展示范围−20°至40°为外观推导。模型不自动求解地面或主机世界姿态。

## 接入示例

```js
import {loadModel,loadGroveModule} from '../src/loaders.js';
const host = await loadModel('sticks3');
const hub = await loadGroveModule('hub');
host.port('grove').attach(hub);
const weight = await loadGroveModule('weight',{terminalPlug:true});
const ssr = await loadGroveModule('ssr',{terminalPlug:true});
const camera = await loadGroveModule('poe-cam-w-v11');
hub.port('grove-1').attach(weight);
hub.port('grove-2').attach(ssr);
hub.port('grove-3').attach(camera);
host.handle({type:'joint',target:'grove/grove-1/terminal/screw-1',
  angleDeg:70,durationMs:150});
host.handle({type:'joint',target:'grove/grove-2/terminal/screw-4',
  angleDeg:-35,durationMs:150});
function userDown(source='demo') {
  host.handle({type:'button',target:'grove/grove-3/user',action:'press',source});
}
function userUp(source='demo',cancelled=false) {
  host.handle({type:'button',target:'grove/grove-3/user',
    action:cancelled?'cancel':'release',source});
}
function onFrame(deltaSeconds) { host.update(deltaSeconds); }
// Teardown: host.dispose().
```

`artwork:false`只取消墨层，真实膜/板/壳/孔壁/触点/按键和附件保持；各入口及实际配置全部物理attributes/index/matrixWorld须一致。机身原稿优先，包装/错版/照片排除；缺稿按可读本款官图代码重绘普通高清PNG，注明来源与字形/颜色/配准推导，不裁照片/借错型号/编小字/用印刷遮缺件。

必要专项：`node scripts/check-weight-ssr-poecam-units.mjs`。单品必要孔腔与材料、真实三分支四芯、独立螺钉/按键/支架与固定件、灯与服务边界、装拆拒错、主机framebuffer、导出/两build及5188资源字节的实际范围见本批进度。CSV、私URL/映射/原稿名、矢量、原始官图/CAD/PDF/MCP全文、生成器及中间件留分发树外；新增代码MIT，第三方/标识保留各自权利。旧贴纸/Scroll/StackChan量产配合/Puzzle Bridge缺基准检查点继续保留。
