# Unit Glass U158

独立按原款 U158 自有六视图、前后/内部照片及其链接面板资料参数化；不是 Glass2/U158-B。未消费 CAD 面或声称官方不存在 CAD。代码采用 MIT，产品印刷和商标保留各自权利。

## 几何依据与装配

主图 42×53×6 mm、窗口 37×19 mm 且距顶2.5 mm、两耳中心横距32 mm、四支柱中心37×14 mm。面板自身图给42.04×27.22×1.25 mm，因此保留42.04实际玻璃宽；CPU实体包络为42.0400009×53×6 mm，不能压缩玻璃来凑42。+Z是GLASS大字正面。大PCB厚0.6 mm、后盖厚0.8 mm、层距、固定螺钉、孔径/细小轮廓与组件位置是自有照片推断，非制造公差。

前板为带真正窗口、下耳孔、四保留孔、五未装SWD孔和侧键让位的闭合实体。两真实玻璃层互相贴合，三条窄座只在窗口外接板；透明窗口不填假支撑。后盖固定在四空心金属柱/真实盲六角螺钉上；中央真实Grove让位、单白色四芯HY2.0口有深背壁、地板、侧壁、导轨、四触点与弯折SMT脚/焊盘。没有Glass2的第二Grove。后视印刷G/V/D/C与实体触点、pinGrid对应。

本款STM32F030F4P6带20条TSSOP实体引脚，原理图SGM6601/BL8075与14C/11R/3D/L1/Q1保固定器件体和端子，隐藏细部位置以自身照片推断。蜂鸣器保本款低矮黑方盒及端子，没有Speaker或声音合成。24针座、24金属接点和闭合折回FPC/24导线连接到玻璃下部；折弯路径/厚度仅装配外观推断，不提供关节。

A在模型+X（后视左），B在−X（后视右）；仅外侧小灰帽和短stem在盲导向井内移动0.14 mm。黄色包体、金属框、底座、端子均固定。行程为外观估计，非机械极限。没有猜外灯、触摸、传感数值、地址联动或协议。后盖不提供服务拆卸配置。

## 面板证据修订

官网/MCP把显示区写成35.05×18 mm，同时记128×56透明区与128×64控制器矩阵。自身ZJY-2856KLBAG01面板PDF第4页（印刷页1）明确1/56 duty、128×56、35.05×15.32 mm Active Area、0.274 mm方形pitch及0.254 mm方点；第5页（印刷页2）机械图重复128×56与35.05×15.32。采用此面板依据，不能把56行拉伸至18 mm。已真实提交官方knowledge_feedback，accepted=true，receipt见sources.json。冻结预检原文不改，由本条明示修订。

点包络(128−1)×0.274+0.254=35.052 mm与(56−1)×0.274+0.254=15.324 mm，相对圆整AA余量0.002/0.004 mm。shader在图示AA内按真实pitch/dot构造mask并注明圆整余量。pixel plane只是外驱发光overlay；实体玻璃独立闭合且FrontSide。前后两plane的世界XY和UV相同，后面只反转绕序及法线，所以从背面观察真实镜像；未通过翻UV把后面显示为可读复制。

## 公开API

`Model`、`GroveModule`、`spec`、`configurations`、`defaults`、`configurationSchema`；默认Model。`glassAssembly`暴露自身固定结构。body组件顺序为`screen,grove,button-a,button-b`；Module再加`unitFrame,cable`。GroveModule沿用独立四芯外观线缆/pose/装拆接口；family只指机械。配置仅`{id:'assembled',name:'完整透明 OLED 装配',options:{}}`，defaults/schema为空。Model键A/B对应两真实侧键。

`button-a/button-b`使用既有momentary Button多源press/release/cancel/click/state；事件down/up/click/longpress。局部轴[0,0,−1]，模型分别[−1,0,0]/[1,0,0]，只有小操作柄运动。

`screen`是可外写128×56 RGBA framebuffer，AA35.05×15.32 mm。保留原始RGBA/alpha；接受RGBA/RGBA8888、RGB888/RGB、RGB565/swap/局部写入、fill、Canvas2D/present、invalidate、backlight/power/pixelEffect。渲染以源亮度0.5阈值、源alpha与外部亮度输出固定light-blue(0.18,0.78,1.0)，off alpha=0。style固定oled，只允许setStyle('oled')；touch固定false，只允许显式false，touch()拒绝，pointer hooks无输入。handle在任何data/fill写入前检查style/touch，所以非法组合不会部分修改framebuffer。不实现128×64控制器行映射、SSD1309、I2C或固件；没有永久屏幕图片。

## 印刷与验证边界

两张普通高清透明PNG由本款官图可读印刷代码重绘；详见artwork.json。投到真实PCB/后盖表面，没有虚构胶膜。表格、原矢量、原图和生成器均不分发。artwork:false下两入口全部物理attributes/index/world相同。

必要CPU smoke覆盖331正体积闭合有向二计数边实体、FrontSide、真耳孔/窗口、支柱/组件、单Grove四触点映射、A/B小柄独立动作和固定黄色包体、多源取消、RGBA/565/swap/局部写、样式触摸原子拒绝、相同世界UV/反后法线、变换父级/pose四芯、嵌套装拆/peer/dispose。普通PNG已解码并目视。未运行浏览器、GPU、构建、实物或制造配合；stage仍modeled，非verified。
