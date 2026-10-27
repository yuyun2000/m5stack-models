# Unit LoRaWAN-US915

当前型号为 **U184-US915**，官方原生结构目录沿用U184。仅本款来源，不复用既有CN470模型、贴纸或天线。原生后3858面、前2734面，共6592个独立闭合源面，保留原始positions/normals/index/sourceFaceIndex和MIT Copyright2021M5Stack完整声明。原STL另外6592面是同件装配预览，逐面刚移配对最大差4.827976e-6mm并全数交代；没有第三壳、修补、重网格或缩放。

原始壳为24×64×8mm，含外伸SMA本体为24×71.4×8mm。后续SMA只在顶端增加7.4mm，原壳不伸缩。两实际Ø4.85安装孔16mm间距、距底12mm，原始孔壁及M5字形保留。真实PCB采用4.5mm侧避让，CPU射线核得对原生安装管约0.54538mm正间隙。4支PCB柱及2支Grove柱接到原始后壳底；4P接收座有深腔、真实接点/回弯/穿板脚/孔壁/焊盘。另有支持的RAK3172(H)外观模组、32端脚、封装/被动件和3只实际内六角螺钉。全部PCB/BOM安装、隐藏接点和配合仍为推导，不是生产装配验收。

native两标签位置实际具有前z≈3.8、后z≈−3.8的封闭凹槽底，两个0.04mm实体膜贴在原底上，未造硬盖或用图片填洞。顶部两面的小开口背后是SMA金属保持螺母，**不是LED或按钮**。SMA本体有实际外壳和外螺纹外观；自身官图own10明确显示中央实心凸针及其后方浅色介质，已据此更正旧空心母接点推导。针的精确尺寸、介质/底部承托、内部RF尾、螺纹和极性均未实测，不模拟射频。私表匹配0，本款两面清楚官图own8/own5独立代码重绘为790×1800透明普通PNG，分别为US915图形/LoRaWAN US915与RAK3172(H)/PORT.C.UART/TXD RXD5V GND；无裁照片、微字/个体码猜测或CN470改色。字体/间距/颜色是近似重绘，原图、生成器及矢量均不发布。

本体组件只有 `grove` 与 `antenna` 两个Port，无本体按键、灯、传感器、关节或假锚点。默认装本款195mm、文档2.3dBi/50Ω的独立胶棒天线，`Antenna`导出是可拆Module，自己的组件只有 `fold` 视觉关节。own4可见真实折肘、接缝和侧轴帽，own11是相同折起姿态；精确枢轴/轴向/0..90°展示限值是推导，并非额定机械限位。实际轴/保持颊/空心活动毂支撑活动臂及胶棒；固定SMA帽、金属衬、介质、受针接点/深止挡、颊和轴不随fold转。附件内部在own10不可见，当前互补受针腔是推导；保留旧内部 `.pin` 属性作为 `receiver` 的别名，不再表示实心针。介质延伸到固定帽后保持环，受腔与真实止挡相接，避免接点浮空。1mm固定轴与1.05mm孔有0.05mm径向外观间隙，颊与活动毂轴向间隙0.025mm，均非制造公差。

`Model`默认 `{antenna:true,antennaFoldDeg:90}`，90°为官图折起态，0°为直立展示。另有 `{antennaFoldDeg:0}` 和 `{antenna:false}` 两实际预设。天线中心线从连接帽下端−5.5mm到铰轴+16.5mm为22mm，加173mm胶棒轴线为195mm，是据文档建立的外观重建。用 `{type:'joint',target:'antenna/fold',angleDeg:45,durationMs:200}` 外驱折转；不支持RPM、自动、servo、LoRa/AT/UART/电气或固件行为。拆卸实际天线使用 `get('antenna').detach({dispose:false})`，重新attach同一Module保持关节状态。若拆卸默认dispose，不再复用已处置实例。

GroveModule还具有 `unitFrame`/`cable`，canonical为grove，使用真实四芯两插头。接入StickS3→HUB第3路后的完整折转路径为 `grove/grove-3/antenna/fold`；本体端口为 `grove/grove-3/grove` 与 `grove/grove-3/antenna`，姿态/线缆为同前缀下unitFrame/cable。Antenna关节属于附件自身，不混入本体ownjoints。

必要同步probe已验证Model/GroveModule×3预设共6case、默认/直立/移除天线两入口去墨的所有attributes/index/world严格一致；有天线的两入口在部分折转时也保持同样去墨不变量。还核对真实闭合有向FrontSide实体、16孔壁射线、真实底部承托、SMA金窗、4接点/孔壁、活动毂孔/固定轴、部分折转只动真实hub/arm/blade、固定件/端口/peer不动、无echo或自动运动、附件/整Unit真拆装恢复及资源dispose。变父StickS3→HUB第3路四芯姿态与宿主framebuffer均保持。独立amendment的新当前receipt（`sma-amendment-2026-10-27-smoke.json`）顶层physical为默认Model实际本体236实体/39412面；另有天线48实体/5588面。本验证为CPU/DOM边界，不等于浏览器GPU、生产BOM、制造配合、实物、电气或射频验收；未跑build/browser/旧全历史suite。


2026-10-27 SMA外观独立更正：自身公开own10来源与SHA见sources.json。当前实现用实心针尖/侧壁、介质内壁/基底、受针腔四向内壁及深止挡的实际射线核对形态；装配针与受腔轴向重叠约0.9mm，四向正径向间隙约0.06007mm，受腔与本体介质轴向间隙约0.6mm，针尖到止挡约2.9mm。全部数值为展示重建，不是制造公差或配合认证。原native、两张PNG、导出/端口/关节API及fold/Grove行为未改；保留batch51/52的旧freeze/helper/probe/progress，使用独立amendment的当前本款helper和receipt，不能改写历史检查来制造通过记录。两仓实际current文件已通过无source-loader专项复验；构建与最终证据见当前progress。

旧 `smoke.json` 保留为batch51历史证明；当前manifest/catalog/provenance指向无source-loader复验后新增的amendment receipt，不覆盖历史文件。
