# Atom / Dial / Stick / Core 主机接入

2026-10-28，新增四款独立型号，本批完成时目录共 205 款：21 主机、184 Unit。后续Atom/Stick完整系列补齐后为222款，见[系列覆盖](ATOM-STICK-SERIES-2026-10-28.md)。新增产品保持 `modeled`；隐藏尺寸、配合与行程的推导不等于制造或实物验收。旧 StackChan 装配未闭合项独立保留。

| 产品 | ID / SKU | 实际输入和显示 | 配置与指南 |
| --- | --- | --- | --- |
| AtomS3 原版 | `atoms3` / C123 | `button` 整组 LCD 键、原生侧 `reset`；`lcd` 128×128，非触摸 | `complete` / `{}`；[本款指南](research/atoms3/modeling.md) |
| Dial 初版 | `dial` / K130 | `rotation` 灰色外圈拖转；`wake/reset/boot`；圆形 240×240 `lcd` 和触摸 | `complete` / `{}`；[本款指南](research/dial/modeling.md) |
| M5StickC Plus2 | `stickc-plus2` / K016-P2 | `a/b/power`；135×240 非触摸 `lcd`；外驱 `red` LED | `complete` / `{}`；[本款指南](research/stickc-plus2/modeling.md) |
| Basic v2.7 | `basic-v27` / K001-V27 | `a/b/c/power`；完整底座另有保持两档 `power-switch`；320×240 非触摸 `lcd` | `complete` / `{}`，`base-removed` / `{base:'removed'}`；[本款指南](research/basic-v27/usage.md) |

本批前三款各有一个完整配置，Basic 有两个配置。加上既有产品，共 21 款主机、23 种配置。共享检查显式核对这些身份和配置，不能通过固定数量跳过新增产品。

## 几何与贴纸

AtomS3 使用自身 C123 两件原生壳；Dial 使用自身 K130 九件原生装配；Basic 保留自身框架和键件，按本款资料重建有缺面的后壳；Plus2 按自身照片及官方明确引用尺寸图原创重建。没有把近似版本换名。C123 Reset 周围的原生 U 槽在自身官图也开放，保留真实孔口，不用黑面遮挡内部结构。

三款参考重绘和 Basic 的批准普通 PNG 随模型接入。Basic 七张图片中五片默认安装；两张注册位置未确认的图不强贴。私有表格、矢量、原始名称/URL、映射和转换材料继续留在分发树外。各产品的来源、PNG 注册及省略项见单品研究。Dial 的初版 StampS3 未使用新版 StampS3A 图稿。

## 公开 API

```js
import {loadModel, loadGroveModule} from 'm5stack-models.js/loaders';

const dial = await loadModel('dial');
dial.get('rotation').set({angleDeg:45});
dial.display('lcd').fill('#2080cf');
dial.button('wake').press('preview');
dial.button('wake').cancel('preview');
const button = await loadGroveModule('button', {cableLength:85});
dial.port('port-a').attach(button);
// button 输入路径：port-a/press；port-b 同样可独立连接。

const basic = await loadModel('basic-v27', {base:'removed'});
// 卸载只离开 Viewer；不复用时再 dispose 模型和 Viewer。
```

Dial 拖外圈产生 `rotate` 角度意图，外驱 `set()` 不回送输入。圆屏中心发触摸，橙色前框发 WAKE；后壳、端口、螺母不随外圈转。其他三款 Grove 为 `grove`。模型仅提供外观、视觉动作、像素和输入意图，固件、总线、电源、编码器脉冲与真实设备由下游实现。

## 当前检查入口

- `node scripts/check-atoms3-controller.mjs`
- `node scripts/check-dial-controller.mjs`
- `node scripts/check-stickc-plus2-controller.mjs`
- `node scripts/check-basic-v27-controller.mjs`
- `npm run check:controllers`、`npm run check:connections`、`npm run check:demo`、`npm run check:input-picking`
- `npm run build`；生产服务由 `./manage.sh status` 核实。

专项使用真实导出和实例，覆盖原生数组/实体、部分及全按、固定区、精确回零/保持档位、多来源取消、屏幕、真实连接及资源释放。Dial 额外检查拖转跨角边界、圆屏裁切及两口接点到实际插头四腔的 64 条首交射线。网页和在线字节另留当前批证据，不改写旧冻结报告。

当前任务计划见[本批计划](plans/controller-family-expansion-2026-10-28.md)。

## 实际预览证据

[网页操作记录](../artifacts/host-families-2026-10-28/browser-checks.json)及[在线字节核对](../artifacts/host-families-2026-10-28/production.json)对应本批最终资源。

| 产品 | 浏览器截图 |
| --- | --- |
| AtomS3 | [完整模型](../artifacts/host-families-2026-10-28/atoms3.jpg)、[Fan运转](../artifacts/host-families-2026-10-28/atoms3-fan-running.jpg) |
| Dial | [完整模型](../artifacts/host-families-2026-10-28/dial.jpg)、[背面](../artifacts/host-families-2026-10-28/dial-back.jpg) |
| Plus2 | [完整模型](../artifacts/host-families-2026-10-28/stickc-plus2.jpg)、[背面](../artifacts/host-families-2026-10-28/stickc-plus2-back.jpg) |
| Basic v2.7 | [完整模型](../artifacts/host-families-2026-10-28/basic-v27.jpg)、[拆底](../artifacts/host-families-2026-10-28/basic-v27-base-removed.jpg) |
