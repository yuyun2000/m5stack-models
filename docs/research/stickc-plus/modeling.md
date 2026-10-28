# M5StickC Plus（K016-P）

本款采用固定官方自身CAD壳体、精确本款多视图与原创隐藏承托/接口细化，仍为 `modeled`。没有把同族模型改名充作本款。来源与摘要见 [sources.json](sources.json)，原生面账本见 [native-source.json](native-source.json)。原始STL、HTML和照片不分发。

## 来源与装配

[本款官方页](https://docs.m5stack.com/en/core/StickC-Plus)与固定 `m5stack/M5_Hardware` 提交 `e29c139cbc7c80b5ccc5557e5ab8025a7a19a109` 提供身份/自身壳体。原始position、normal、index、sourceFaceIndex、sourceAttributeWord与属性摘要均保留。两件原生壳体严格闭合正体积；另两件为重复平移预览，逐面配对后排除。以mm为单位，正面+Z、顶HAT+Y。原生不缩放；名义尺寸为 [24, 48, 13.5]，运行时原生壳体包络为24×48×13.5mm。重复预览没有用于默认装配。

实际前M5字槽和活动舌、两侧键均来自本款原生壳。新增完整PCB、120mAh电池包络、屏幕玻璃/背板、固定开关背衬和板边支承。USB-C的24接点、Grove的四壁/四接点/深止挡、顶HAT的8孔壁/16接触片/止挡与安装件都有实体。真实开口保留，隐藏尺寸仍按本款照片比例或连接器族推导，不表示生产公差。保留被动蜂鸣器结构。

三键是归一化视觉弹性场：A下缘根部权重为0，B/电源按本款壳面活动区域变形，回零恢复原数组。权重为0的原始顶点及其他实体保持；原生长三角横跨固定邻区时，插值可能带来微小邻区弹性，不能据此声称整条材料根线完全固定或真实材料变形。只有实际活动面接受拾取，固定邻区遮挡后方。显示尺寸为135×240，非触摸；可视行程A0.22/B0.16/电源0.15mm均是推导，不执行电源或固件。

## API与外部驱动

入口导出 `Model`（默认）、`StickCPlus`（同构造器）、`spec`、`DIM`、`defaults`、`configurations`、`configurationSchema`、`HAT_PINS`、`GROVE_PINS`。配置为 `complete / {}`。组件顺序 `a,b,power,usb,grove,hat,red,lcd`；按钮键盘Space/A、B、P分别对应A、B、电源意图。没有本款GroveModule导出。

```js
import Model from 'm5stack-models.js/devices/stickc-plus';
import {GroveModule as ButtonUnit} from 'm5stack-models.js/units/button';
const host = new Model({artwork:true});
host.port('grove').attach(new ButtonUnit({cableLength:74}));
const off = host.on('input', e => runtime.receive(e));
host.display('lcd').fill('#205790');
host.led('red').set({color:'#ff2010',brightness:.3});
host.button('a').press('external');
host.button('a').cancel('external');
// 每帧host.update(dt,time)，dt/time为秒；结束off()与host.dispose()。
```

IR、麦克风、IMU、RTC/蜂鸣器仅被动结构，不注册模拟数值或声音；红LED只接受外驱状态，输入不回写画面。HAT/Grove/USB只是视觉连接器，不表示电气兼容。Grove四芯/双插头与子路径 `grove/press` 复用共享API；需要复用Unit时detach({dispose:false})，默认detach释放。来源必须成对release/cancel，取消不产生click。

## 印刷与验证

普通PNG后标签为1008×1776单面 `reference-redraw`；按本款清楚官图重绘大字/色块/引脚，省略注册编号、微字和唯一标识，未裁切产品照片。永久物理载体始终存在，`artwork:false`只移除墨层，所有物理属性/index/world及运动保持。

运行 `node scripts/check-stickc-plus-controller.mjs`，当前结果见 [checks.json](checks.json)。真实构造器验证自身原生数组、三键实际多点rest/partial/full/return、固定顶点/其他实体、外驱真实framebuffer、接口孔壁/接点、Grove四芯两插头与姿态、连接下去墨不变、timer及资源释放。真实Viewer/camera/raycaster/私有pointer路径覆盖104拾取、18取消、4状态×2姿态；只替换GPU/DOM边界，不能替代网页像素验收，也不证明制造装配、电气或固件。
