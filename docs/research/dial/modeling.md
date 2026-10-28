# 初版 Dial K130

本款为 StampS3 主控的初版 K130；不以 v1.1 的 StampS3A 标签或外壳替换。尺寸与公开照片取自[官方页](https://docs.m5stack.com/en/core/M5Dial)，固定来源和限制见 [sources.json](sources.json)。

## 结构与来源

自身 `Dial.stl` 含 18 个闭合、正体积组件，实际装配 9 件 29,240 面，另 9 件为重复散件。运行时保留实际 9 件的原始 Float32 position/normal、index、源面编号与属性字，采用刚性 Y 轴 180° 变换统一正面 +Z。逐面重复映射误差最大 0.00003911 mm，完整账本见 [source-face-map.json](source-face-map.json)。未缩放、重网格或切掉原生面。

保留前框、抓纹外圈、螺纹后壳、锁紧螺母、内承载件/保持环/垫圈及 Stamp 外盖/法兰。补充厚 PCB、显示模块与玻璃、EC30 定/转子包络、StampS3 与天线、USB-C、两路 Grove、绿色供电口、内部电池座、接点、止挡、支承和固定件。隐藏尺寸与配合是外观推导；官方名义 51×51×32.3 mm 与 CAD 本身包络分别记录。

## 可用接口

| 路径 | 能力 |
| --- | --- |
| `rotation` | 连续视觉关节；指针拖灰色外圈发 `rotate {angleDeg,deltaDeg}`；`set({angleDeg,rpm})` 外驱，不回送输入 |
| `wake` | 按橙色前框移动前框/圆屏承载组；Space 也可按压；0.2 mm 视觉行程为推导 |
| `reset` | 原生后壳 U 舌，原位筛选活动面并变形；内外壁共同移动，释放精确恢复原始数组；R 键 |
| `boot` | StampS3 GPIO0，独立物理帽；B 键；不执行下载模式 |
| `lcd` | 240×240 RGBA/RGB565/RGB888 framebuffer，圆形有效区及像素坐标触摸；不执行 GC9A01/FT3267 总线 |
| `port-a` / `port-b` | 后部竖向 Grove，独立机械 mating frame，可接已有 `GroveModule` 并显示实际四芯线 |
| `usb` / `power` | USB-C 和 2P 供电口的外观/接口信息 |

只有灰色外圈与编码器套随 `rotation` 转动，后壳、端口、螺母和屏幕保持。圆屏中心用于触摸输入，橙色框用于 WAKE 按压，二者可独立使用。`reset` 使用自身 U 槽边界和原生连通结构定义权重；原生几何的通过结论针对默认/回零状态，视觉形变不代表量产行程。所有 reset、boot、wake 都仅发输入意图。

```js
const dial = await loadModel('dial');
dial.get('rotation').set({angleDeg:45});
dial.display('lcd').fill('#2266cc');
dial.button('wake').press('preview');
dial.button('wake').cancel('preview');
dial.on('input', event => console.log(event));
const unit = await loadGroveModule('button');
dial.port('port-a').attach(unit);
```

## 印刷与验收边界

同版清楚背照重绘一张 996×1332 普通 PNG；省略不可辨认证编号与微字，不改写为硬件规格标签。所给普通素材中不同版 S3A/S3Mini 未混用，私表、原稿、源名称/URL 及转换器不分发。`artwork:false` 保留物理薄膜与 GPIO0 开口。

运行 `node scripts/check-dial-controller.mjs`。检查实际 101 个闭合正体积物理网格、原生字节、三键部分/全按与取消、固定件、精确回零、拖转跨角边界、外驱不回送、圆屏像素/触摸、去墨物理不变、两口实际线缆及拆接。浏览器像素与实际指针另验。RFID、RTC、蜂鸣器、电源保持、编码器电气脉冲、固件及实物制造配合均由外部负责，当前保持 `modeled`。
