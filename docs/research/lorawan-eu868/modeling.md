# Unit LoRaWAN-EU868

当前精确型号为 **U184-EU868**，自身原生结构目录为U184-EU868_Unit_LoRaWAN-EU868，不采用旧U184别名。仅本款来源，不复用既有CN470模型、贴纸或天线。原生后3858面、前2734面，共6592个独立闭合源面，从本款原文件独立保留原始positions/normals/index/sourceFaceIndex/sourceAttributeWord和MIT Copyright2021M5Stack完整声明。原STL另外6592面是同件装配预览，本款原字节逐面重新验证刚移配对，最大差4.827976e-6mm并全数交代；没有第三壳、修补、重网格或缩放。

原始壳为24×64×8mm，含外伸SMA本体为24×71.4×8mm。后续SMA只在顶端增加7.4mm，原壳不伸缩。两实际Ø4.85安装孔16mm间距、距底12mm，原始孔壁及M5字形保留。真实PCB采用4.5mm侧避让，CPU射线核得对原生安装管约0.54538mm正间隙。4支PCB柱及2支Grove柱接到原始后壳底；4P接收座有深腔、真实接点/回弯/穿板脚/孔壁/焊盘。另有支持的RAK3172(H)外观模组、32端脚、封装/被动件和3只实际内六角螺钉。全部PCB/BOM安装、隐藏接点和配合仍为推导，不是生产装配验收。

native两标签位置实际具有前z≈3.8、后z≈−3.8的封闭凹槽底，两个0.04mm实体膜贴在原底上，未造硬盖或用图片填洞。顶部两面的小开口背后是SMA金属保持螺母，**不是LED或按钮**。SMA本款own10近照明确是介质前的凸针，实体建实心针座/针杆/锥尖；配套附件用真实空心接收腔/深止挡，推导径向间隙0.06mm。准确极性/螺纹配合未认证，SMA内针原文只作元数据；RF尾/保持尺寸推导，不模拟射频。私表严格名8项为5包装与3错Module，既有下载3全拒用、Unit原稿批准0、建模新下载0，不再读取/使用。本款两面清楚官图own8/own9独立代码重绘为790×1800透明普通PNG，分别为EU868图形/LoRaWAN EU868与RAK3172(H)/PORT.C.UART/TXD RXD5V GND；无裁照片、微字/个体码猜测或CN470改色。字体/间距/颜色是近似重绘，原图、生成器及矢量均不发布。

本体组件只有 `grove` 与 `antenna` 两个Port，无本体按键、灯、传感器、关节或假锚点。默认装本款195mm、文档2.8dBi/50Ω的独立胶棒天线，`Antenna`导出是可拆Module，自己的组件只有 `fold` 视觉关节。own4可见真实折肘、接缝和侧轴帽，own11是相同折起姿态；精确枢轴/轴向/0..90°展示限值是推导，并非额定机械限位。实际轴/保持颊/空心活动毂支撑活动臂及胶棒；固定SMA帽、金属衬、介质、附件空心接收腔/止挡、颊和轴不随fold转，本体凸针也保持固定。1mm固定轴与1.05mm孔有0.05mm径向外观间隙，颊与活动毂轴向间隙0.025mm，均非制造公差。

`Model`默认 `{antenna:true,antennaFoldDeg:90}`，90°为官图折起态，0°为直立展示。另有 `{antennaFoldDeg:0}` 和 `{antenna:false}` 两实际预设。天线中心线从连接帽下端−5.5mm到铰轴+16.5mm为22mm，加173mm胶棒轴线为195mm，是据文档建立的外观重建。用 `{type:'joint',target:'antenna/fold',angleDeg:45,durationMs:200}` 外驱折转；不支持RPM、自动、servo、LoRa/AT/UART/电气或固件行为。拆卸实际天线使用 `get('antenna').detach({dispose:false})`，重新attach同一Module保持关节状态。若拆卸默认dispose，不再复用已处置实例。

GroveModule还具有 `unitFrame`/`cable`，canonical为grove，使用真实四芯两插头。接入StickS3→HUB第2路后的完整折转路径为 `grove/grove-2/antenna/fold`；本体端口为 `grove/grove-2/grove` 与 `grove/grove-2/antenna`，姿态/线缆为同前缀下unitFrame/cable。Antenna关节属于附件自身，不混入本体ownjoints。

必要同步probe已验证Model/GroveModule×3预设共6case、默认/直立/移除天线两入口去墨的所有attributes/index/world严格一致；有天线的两入口在部分折转时也保持同样去墨不变量。还核对真实闭合有向FrontSide实体、16孔壁射线、真实底部承托、SMA金窗、4接点/孔壁、活动毂孔/固定轴、部分折转只动真实hub/arm/blade、固定件/端口/peer不动、无echo或自动运动、附件/整Unit真拆装恢复及资源dispose。变父StickS3→HUB第2路四芯姿态与宿主framebuffer均保持。smoke.json顶层physical为默认Model实际本体238实体/39828面；另有天线48实体/5588面。本验证为CPU/DOM边界，不等于浏览器GPU、生产BOM、制造配合、实物、电气或射频验收；未跑build/browser/旧全历史suite。
