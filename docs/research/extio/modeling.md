# Unit EXT.IO U011 原版 PCA9554PW

2026-10-27。`modeled`；自身尺寸和本款多视图参数化重建 `own-dimensional-parametric`，没有本款原生 CAD，不宣称源面保留。原版 U011/PCA9554PW 与 U011-B EXT.IO2/STM32F030F4P6 分开。新编代码 MIT；官方图纸和照片只作证据，公开普通重绘 PNG，原图、矢量、生成器与中间件不分发。

本款原版产品表名义外包络 X/Y/Z=24×32×11 mm。页面链接的 `U011_B_Model_Size.png` 标示 8+2.2=10.2 mm，版本适用性未证实，因此明确排除其作为原版精确 datum；没有借 B 版壳或将其拉伸。官方反馈已接收 `71a9efbd18cc4d58b4a331fc6bc909cd`，未收到更正机械基准。模型的 8.6 mm 基壳、2.4 mm 凸罩、壁厚、孔位/孔径、隐藏安装和膜厚都按自身照片推导；后部真实 M5 白色浮雕再突出 0.1 mm，实际模型外包络单列为24×32×11.1 mm，不将名义11 mm称为精确内部平面。

白壳包含独立闭合前/后板、圆角两侧壁、接口上下实体桥、凸罩顶/侧/肩、两处贯通孔壁与固定螺杆接收柱。Grove/IO 开口真实连接外轮廓；PCB 在安装柱处采用开边避空轮廓，另有接点穿板孔。前部凸罩空白，后 M5 是物理无色浮雕。固定后螺丝有真实盲槽底、承台和通柱螺杆；槽形/安装为外观推导，没有螺距、夹紧或关节 API。

红色 HY2.0 接收器有侧壁、底面、深介质止挡、上轨和扣桥；四根独立触针、回弯、穿板尾脚、板上环形焊盘与下方保留焊环均为实体。原版 own01 明确2×5/2.54 mm，own05 可见实心阳针，原版原理图 P1 Header5X2 对应IO0–IO7、VCC、GND；采用 recessed 直角阳针组件，十根实心方针、弯折脚、支撑、穿板孔及焊接保持实体。具体安装和弯折位置由自身照片推导，不冒充量产图。后标观看方向的两行字为5V/6/4/2/0与G/7/5/3/1；这不是自动电气路由。

原版 PCA9554PW、HT7533、被动件与 INT 测试焊盘的身份依据自身官方原理图/MCP；隐藏板形、封装外形/位置、支撑与固定均明确为推导，不称完整 BOM。没有外部按钮、灯、传感器、显示或活动机构。GPIO/I2C 功能只作为产品身份，不制造状态、输入读数、ADC/PWM、地址、逻辑门、供电或固件仿真。

自身02清楚后标准确代码重绘为一张1610×1180普通PNG，保留EXTEND I/O、PCA9554PW、PORT.A . I2C及本款pin图例。字体、颜色、间距和膜注册为重建；无照片裁切、B版标签、包装标签、未知微字或个体码。实物后膜始终存在，`artwork:false`仅去墨，壳、浮雕、孔壁、PCB、触点、物理膜和所有attributes/index/world矩阵保持不变。私源严格匹配为0，未重新查询或下载原稿。

实际导出Model/GroveModule/spec/defaults/configurationSchema/configurations；body组件顺序grove、io，GroveModule追加unitFrame、cable，canonical输入为真实grove。唯一complete预设{}，默认{}；无附件导出、服务盖或可拆插体。IO family为header-2x5-2.54mm-male；仅提供实际固定十触点，未随产品虚构配套附件。控件、LED、display、speaker、sensor、joint、anchor均为0。

本款必要CPU几何检查记录194个正体积闭合实体、32016三角面，坐标焊接后有向边反向配对。最终作者smoke和独立helper probe的真实结果、其SHA及检查细节见smoke.json，只有两者pass才生成本冻结。未做browser/GPU、实物fit或历史全量复核，stage保持modeled。
