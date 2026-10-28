# M5StickC Plus SE（K016-P-SE）

本款为自身机械图及多视图的原创参数化重建，`modeled`。复用仓库的解析几何/组件构造模式，未借其他型号的壳网格或虚构原生面编号。来源与用途见 [sources.json](sources.json)，只有批准的普通PNG分发；原始页面、照片、私表、矢量及映射不分发。

## 本款依据与尺寸冲突

[官方SE页](https://docs.m5stack.com/en/core/StickC-Plus_SE)明确：PICO-D4、120mAh、AXP192、135×240 ST7789V2、透明橙壳、移除内置IMU。A/B为G37/G39，电源是PMIC意图，红LEDG10与IRG9分别保留。蜂鸣器/麦克风/RTC仅被动物件，不注册虚构数据或音频。

本款页面正文的48×24×8.4mm与它自己链接的机械图13.52mm厚度冲突。模型按自身机械图24×48×13.52mm及14.8×24.86mm内窗口重建，同时保留8.4mm原值。以mm为单位，屏朝+Z、顶HAT+Y。固定M5_Hardware提交未找到本款专属结构，因此没有改名使用Plus/Plus2网格。模型源码复用解析构造与API模式，各尺寸/透明材质/电子事实/印刷来自SE自身依据。

## 装配、动作与输出

默认装配提供透明橙前后壳、连续厚角壁、M5凹字闭合活动舌、左右完整键帽/内柱/开关背衬、PCB、电池、屏幕承托/玻璃、支承肋/中空安装柱/螺钉/磁环。USB-C有24接点，Grove有四壁/键位/四接点/深止挡；HAT八孔各有实体孔壁、16弹片和止挡。未用黑平面或双面材质遮盖缺壁。隐藏BOM安装、接口深度、透光参数及壁厚是视觉推导，不表示生产公差或实物配合。

前A是连续闭合实体，下根部保持、自由端归一化弯入；两侧B/电源键刚性按入。视觉行程A0.25mm、B/电源0.18mm不是额定机械行程。释放/取消回零，取消不产生click；所有来源需成对release/cancel。`artwork:false`只关墨层，白色标签载体、结构与动作仍在。只有外驱红LED与非触摸135×240真实framebuffer可见输出，输入不改屏幕或执行真实开关机。

导出 `Model`（默认）/`StickCPlusSE`同构造器、`spec`、`DIM`、`defaults`、`configurations`、`configurationSchema`、`HAT_PINS`、`GROVE_PINS`。配置 `complete / {}`；组件顺序 `a,b,power,usb,grove,hat,red,lcd`。Space/A→a、B→b、P/C→power。没有本款GroveModule导出。Grove可装现有Unit GroveModule，子输入如`grove/press`，四芯/双插头/姿态复用共享API。

```js
import Model from 'm5stack-models.js/devices/stickc-plus-se';
import {GroveModule as ButtonUnit} from 'm5stack-models.js/units/button';
const host = new Model();
host.port('grove').attach(new ButtonUnit({cableLength:70}));
const off = host.on('input', e => runtime.receive(e));
host.display('lcd').fill('#205790');
host.led('red').set({color:'#ff3020',brightness:.4});
host.button('a').press('external');
host.button('a').cancel('external');
// 外部渲染器持续调用host.update(dt,time)，单位秒；结束off()/host.dispose()。
```

Unit要复用时 `detach({dispose:false})`；默认detach释放。接口类型不证明总线/电气兼容。

## 标签与专项

318×569 RGB普通PNG来自用户批准的本款平面标签图，只配准提取完整标签本体，未裁实物照片、未猜字或虚构高分辨率。物理标签21×37mm；原始说明/白边不贴到模型。私表、私URL、矢量、转换器及原始映射均留仓库外。该PNG是原始普通图像内容，不是官图重绘。

运行 `node scripts/check-stickc-plus-se-controller.mjs`，当前 [checks.json](checks.json) 记录155闭合正体积FrontSide实体、三键内外实际partial/full/return、多来源取消、全属性/index/world去墨不变、真实framebuffer/定时器、接口孔壁接点、四芯双插头/变姿态/拆接和释放。真实Viewer/camera/raycaster/私有指针路径覆盖104拾取、18取消、4状态×2姿态，GPU/DOM边界夹具不能替代网页像素验收；不提升verified。
