# AtomS3 Lite C124：自身完整外观模型

C124 / ESP32-S3FN8 / 白壳，继承 Device。当前为 modeled，0 verified；没有浏览器/GPU、实物、制造配合、电子、协议或固件验收。

自身原 STL 的两真实半壳保留2926个原始面，position/normal/index/sourceFaceIndex/sourceAttributeWord在rest逐字节对照原文件。各半壳只用刚性平移装配，无修面/重网格/缩放。另2926个duplicate preview逐面独立重新匹配，最大位置差4.76837158203125e-6mm。preview有129面原始法线字节不同，最大数值差6.293967083625951e-13；这些源差异诚实记账，没有虚报字节相同。实际半壳的原法线和属性字精确保留。名义24×24×9.5，与native高度9.50714111328125分别记录。

179个闭合正体积FrontSide实体、37542面。补PCB真实厚度/扩展与Grove尾针孔、开底槽厚后部承托、排母9个真实凹井/弹片/尾脚、USB-C金属壳/舌/24触片/后挡和焊脚、Grove塑壳/4触点/尾脚/后挡与承托、M2原孔壁及深止挡、RGB固定2020封装/支板/光学导引、G4被动IR暗封装/透镜/引脚/支承。真实功能孔和正间隙保留，没有黑面或照片平面替代缺件。

本款窄NativeButton在原始索引和源属性上做连续局部U舌外观变形；主键G41与侧Reset分别动作，longPressMs=0。主键只有真实舌、光学导引及必要plunger随动；Reset只有自身舌和开关头随动。PCB、接口、IR及固定壳区域不随动。部分/全按、两来源保持、release/cancel/回弹、实际timer点击和dispose已核。另用自身真实FrontSide原壳每状态83条射线核rest/partial/full/回零：8条中心/开关位、主键30条内外壁、Reset42条内外壁及3条固定区。Reset自身U槽向上开口，根部z=-3.053569793701172mm固定；完整舌（含上段和内壁）按同一线性截面场弯曲，无截断内壁。Reset中心内外full约0.056747mm，开关位约0.062512mm，样本网格内外位移差最大1.33213e-6mm；主键真实中心外/内full约0.101947/0.097956mm。partial均严格介于rest/full，全部射线精确回零，固定区不动、index/源面/属性字不改。完整按压cap/RGB封装间最小检查间隙约0.17365mm；另核真实主键内壁/开关头与Reset内壁/头的正间隙。外观行程场最大值.18/.15mm（Reset自由上缘；实际中心位移单独记录）、弯曲权重、隐藏支承/接点和弹簧/公差均是外观推导，不是FEM或额定机械参数。

API为button/reset两Button、rgb单Led，默认灭、外部色亮、无自动Reset/boot下载联动；IR只被动几何，无Display/触摸/IMU/传感器/joint/第二绿灯。usb='usb-c'、grove='grove'、ext-5p/ext-4p='m5.atom.ext-5p'/'m5.atom.ext-4p'；header机械族与文档pin标签不模拟电气兼容。

1681条后面首交点、9井中心深止挡及36条真实FrontSide内壁首交点（每井四侧、精确命中该bank有孔housing及对应井±.51mm侧壁，避开弹片）、4触点、5312个实体点对原壳的有限包含采样已核。rest/partial/full/接线partial的artwork:false与有墨全physical attrs/index/world一致。两个原稿PNG分别3277×4096与原生402×146；图案保持比例，M2黄导引对准实际孔且载体/墨层均开孔；认证贴未虚报高清。物理基材和所有实体去墨后保留。

主机Grove连接已有HUB、Button和LCD Unit，检查48个真实四芯端点、变化父级/姿态、完整输入路径、下游RGBA写入/peer隔离/noecho/拆装取消与资源释放。旧thermal模型实际无Display，因此使用已有LCD作真实屏类子模块，没有给thermal造屏。独立helper仅directCLI执行，import不autorun；作者work probe直接指向实际public文件，无source-loader或替代构造器。

隐藏PCB/芯片/天线/支柱/接点及安装位置、后部保持件、光学引导与透镜尺寸、印刷厚度/注册、卡扣和螺纹/机械配合未有完整量产BOM或实物证明。普通图片获用户授权分发，图文/商标权利另保留；新代码MIT，官方native MIT全文随本款分发。原STL/照片/MCP全文/私表/矢量/生成器只留work。
