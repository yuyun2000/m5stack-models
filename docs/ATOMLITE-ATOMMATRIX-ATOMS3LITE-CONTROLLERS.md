# Atom Lite / 原 Atom Matrix / AtomS3 Lite 主机

本批为外观模型，状态 modeled，未声明实物或制造验收。三款均是 Device 主机，无主机 framebuffer；输入意图和灯外观由外部框架驱动。当前 catalog 目标 201 = 17 主机 + 184 Unit，Git187 和既有 pending11Unit/15PNG 保留。

本批实际运行时普通 PNG：6 张（由各作者 freeze 文件清单计数，非安全源 PNG 的 3 张）。

独立检查：`scripts/check-atom-lite-controller.mjs`、`scripts/check-atom-matrix-controller.mjs`、`scripts/check-atoms3-lite-controller.mjs`；组合：`scripts/check-atomlite-atommatrix-atoms3lite-controllers.mjs`。

## Atom Lite C008

原C008灰壳主机，当前名义24×24×9.5，历史10mm厚和原生9.507141分记。仅named导出Model/spec/defaults/configurations/configurationSchema，default===Model；内部类AtomLite。不是GroveModule，根顶层别名由统一注册提供。

实际组件：button/reset为独立Button，rgb为唯一Led，grove/usb/ext-5p/ext-4p为Port；没有display/imu/sensor/joint。主键Space→button；侧Reset只发输入，不重启/boot/download。两键0.18/0.15mm推导行程、longPressMs0，多来源按住/最后释放/cancel回弹；只动本款原U槽/侧tab及各自plunger，固定板/接口/壳区不动。

```js
model.handle({type:'button',target:'button',action:'press',source:'sim:main'});
model.handle({type:'button',target:'button',action:'cancel',source:'sim:main'});
model.handle({type:'button',target:'reset',action:'press',source:'sim:reset'});
model.handle({type:'button',target:'reset',action:'cancel',source:'sim:reset'});
model.handle({type:'led',target:'rgb',color:'#21c4ea',brightness:.37});
model.get('grove').attach(hub);
model.handle({type:'button',target:'grove/grove-1/press',action:'press',source:'downstream'});
model.handle({type:'display',target:'grove/grove-2/lcd',fill:'#357aac'});
```

RGB默认灭，外驱/noecho，不随键或Reset自动联动；IR仅被动封装/光窗，不造可见IR灯。主机自身没有framebuffer；Grove接HUB/按钮/OLED后，屏只在子路径。grove为真实四芯机械族，usb是usb-c；ext-5p/ext-4p族分别m5.atom.ext-5p/m5.atom.ext-4p，不允许冒充Grove。后视图针序5排3V3/G22/G19/G23/G33、4排G21/G25/5V/GND自上到下；GPIO/协议/电气/固件外部实现。

唯一complete:{}。artwork:false只去2个墨面，保两真实膜/原生底、M2孔、9排母井/全部接点、深USB/Grove、PCB/支撑和两键运动；rest、两键部分/同时与连接态全部物理attrs/index/world相同。认证原生470×164普通平面栅格保比例，PH底贴按本款旧图准确重绘并为真实M2口调整排版，字体/间距近似；不裁照片、不借未决HY或S3标签、不猜个体微字。

专项 `node scripts/check-atom-lite-controller.mjs`；import只导出checkAtomLiteController，组合夹具await调用得到完整pass report。225闭合实体/40358面、原2926源面+2926preview记账、真实端口/承托和必要动作/连接/资源检查已通过。隐藏BOM/fit/行程与注册仍推导；新代码MIT，自身CAD保完整MIT，不声明build/GPU/实物/制造、电气或固件验收。


### Atom Matrix 原版 C008-B

原生 24×24×13.8 mm 灰壳，深色透明压力窗、25 颗独立 LED、实际主键和原壳侧 Reset 弹性舌（凹面、内壁和 U 槽内抬高自由端一同随动，槽外壳与根部固定），补齐后排母 9 真井、USB-C、Grove、M2 盲安装孔及 IR 原生小口内实体。两张按本款官图重绘的高清 PNG 已配准，私有矢量和表格未公开。

`button` / `reset` 可按压、释放、取消；`led0`…`led24` 独立接收 LED 颜色和亮度指令（视觉行列地址，不宣称电气链序）。4 个端口为 `grove`、`usb`、`ext-5p`、`ext-4p`。Grove 可连接现有 Unit，验证过 HUB+Button+Encoder+OLED 的子路径和 framebuffer；未模拟电气总线。`artwork:false` 只去墨；所有壳、载体、触点、板件和运动实体保留。

本款没有注册 Display/传感器/IMU 或模拟复位。隐藏 BOM、配合和 .14 mm 行程属外观推导。详见 `docs/research/atom-matrix/`。

Reset 修订以本款原生源三角真实 FrontSide 射线验证部分/全按与精确回弹；内部从动杆在实体孔载体内保留正间隙，载体支脚接到主 PCB。9 个排母井追加 36 条真实内壁射线。首版 `smoke.json` 保留历史，修订专项另存 `docs/research/atom-matrix/reset-amendment.json`。


## AtomS3 Lite / C124

白色ESP32-S3FN8主机，名义24×24×9.5mm；自身native高度9.507141mm单独保留，实际接口/保持件外观包络见研究smoke。原壳2926面完整保源，另2926面preview独立记账；补PCB、深USB-C、Grove四触点/尾脚、5+4真实排母孔及M2深止挡。179闭合实体/37542面，状态modeled、0verified。

`Model`继承Device，default等于Model；named仅Model/spec/defaults/configurations/configurationSchema。默认`{artwork:true}`，命名配置complete的options为`{}`；`{artwork:false}`只去墨，不删任何真实基材/接点/承托/动作。

- `button('button')`：G41主舌；`button('reset')`：独立侧Reset；press/release/cancel；Space只绑定主键，longPressMs=0；不执行重启/下载固件行为。
- `led('rgb').set({color:'#20a0ff',brightness:.4})`：唯一G35 RGB，默认灭；IR G4仅被动几何，主机没有Display/IMU模拟/第二绿灯。
- `port('grove')`：GND/5V/G2/G1；`port('usb')`：usb-c；`ext-5p`/`ext-4p`为m5.atom.ext-5p / m5.atom.ext-4p机械族，5针3V3/G5/G6/G7/G8、4针G39/G38/5V/GND；不承诺电气/协议仿真。
- 2张普通原稿PNG：底图3277×4096，认证图原生402×146；各1panel，保持比例。底图黄M2导引对齐实际开孔，载体及墨层都开孔；私表/原名/URL/矢量/生成器不分发。

独立检查`node scripts/check-atoms3-lite-controller.mjs`：原面/属性/FrontSide闭合、后面1681射线、9井中心与36条该井真实FrontSide内壁首交点、5312穿壳采样、两键部分/全按/取消/真实timer及每状态83条真实native中心/内外壁/上段/固定区FrontSide射线、RGB与被动IR、去墨rest/partial/full/接线partial完整physical不变、HUB+Button+LCD Unit真实四芯48端点/层级/变父/下游framebuffer/peer/noecho/拆装资源通过。import该helper不自动运行。旧thermal无屏，屏类检查实际使用已有LCD，未给它造Display。

Reset自身U槽向上开口，z=-3.05357固定根部，完整上段/内外壁一起弯曲；最大.15mm是自由缘行程场，实际中心full约.056747mm，内外壁网格位移差最大1.33213e-6mm，精确回零。报告键`actuation.nativeSurfaceRays`。

键行程/弯曲、隐藏PCB/封装/支承/接点、光学导引、注册/膜厚、装配与机械公差仍为外观推导；没有browser/GPU、制造、电子/协议、固件或实物验收。新代码MIT，自身官方native MIT全文和图文/商标各自权利保留。



## 第53批当前接入结果

实际3款Device已按冻结API窄同步；本批双仓专项、3款实际导出/顶层alias/lazy loader与双build均通过。实际PNG共6张；[公开本批进度](../artifacts/atomlite-atommatrix-atoms3lite-expansion/progress.json)记录本批范围与真实结果。当前201=17主机+184Unit/0verified，既有pending11Unit/15PNG保留；不声明GPU、制造或实物验收。
