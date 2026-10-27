# 原版 PbHub U041

stage: modeled；外观和物理接口模型，非电子/固件仿真。当前U041原版EOL，不能称当前热销。没有自身CAD，未借U041-B v1.1外壳、PCB、标签或电子封装；所有几何从本款官图、当前名义尺寸程序重建。

当前官方尺寸48×24×10.8 mm，本地XYZ为24×48×10.8；immutable旧U041文档厚12 mm另存，未当成同一内部datum。白壳7.92 mm外观深、圆角/1.2壁/1mm皮、两Ø5孔及16mm孔距、窗口与后标尺寸/中央固定螺钉/M5浮雕均为照片推导，没有制造公差和实物量测。前大开窗是真实露出黑PCB的结构；后壳闭合，孔有全厚孔壁，没有用贴图或大片平面遮掩缺失内构。

黑板具有真实体积、28触点孔/上下金属环、实际承托的四支柱和推导的下游输入连接舌片/螺钉让位。可见32脚四边封装、32腿、上方金属晶体/两脚与八个可辨被动件/16端子均固定坐板。当前正文/背膜MEGA328、原理图ATMEGA328与当前表STM32F030F4P6冲突；只称可见QFP32外观，不能冒充已确认量产BOM。既有feedback d1563a5d43244eb4ba20aebb7ef67fbc已受理，未重复提交，也未收到更正。

六黑色正面直立Grove+一红色底部水平Grove均有深腔、止挡、两壁、实底、保持桥/导轨/承托和四金属接点。六直立座使用贯穿PCB保持茎/焊接，水平入口使用折返、脚和贯穿长尾；28接点与28孔注册。完整安装深度/端子/支撑/接触尺寸是外观推导。正视入口向下时，CH3/CH2顶行，CH4/CH1中行，CH5/CH0底行；每个真实端口有对应旋转frame。针脚为原理图字面文档，输入SCL/SDA/5V/GND，通道INn/OUTn/5V/GND，不能推导电气兼容或颜色路由。

普通PNG两张与构造同步交付：当前own02后膜1620×2840和PCB六数字透明丝印2020×3020。背膜是MEGA328、ADDR0X61~0X68、PORT.A.I2C这一版，螺钉可见且无QC；旧immutable背标0x40~0x47/QC不混入。背膜0.08mm真实基材贴后壳，板丝印贴黑板，不增加第二张实体膜。字型/字距/色彩和注册是准确参考重绘的近似；不裁切照片，不加入未知微字、个体码或包装。artwork:false仅去两墨层，实体属性/索引/世界矩阵保持。原始官图、矢量、私表及生成器均不进入公开库，新代码MIT；源图文/标识保留各自权利。

Model组件顺序为grove、grove-0…grove-5，均port。GroveModule额外在末尾添加unitFrame、cable，kind为unit-frame/cable；canonical输入grove。defaults/schema={}，唯一complete配置options={}。七port只做机械attach/detach；无DIP、button、LED、joint、sensor/anchor、读数、地址/GPIO/ADC/PWM/RGB/servo/I2C/MCU/供电/固件行为。pose/cable是现有外观构造控制。

必要Node探针通过281个闭合有向正体积实体、44,924三角面、两真贯孔40孔壁射线、28板孔112孔壁射线、三条开窗实际板背衬、七深座/28接点。两入口complete配置去墨attrs/index/world相同。实际StickS3直连后变父到HUB第2路并改变父/UnitFrame姿态；每六路挂真实当前GroveModule四芯下游，做接点/插头frame/四线端点、层级寻址、各自pose、独立拆装与释放；peer/framebuffer/noecho保持，观察1044个宿主资源及每批下游资源dispose。112条七port不支持协议命令均拒绝。helper完全同步，无悬挂Promise。

原图/二维PNG已目视，PNG做RGBA解析。没有跑浏览器、GPU、实物或制造配合验收；CPU几何/API结果不能称这些验收已通过。
