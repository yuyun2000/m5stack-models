# Unit LoRaWAN-AS923 U184-AS923

按本款8张官图、精确MCP和自身不可变native建立证据。官方确实对各地区共用同一壳blob，但这不证明区域PCB/BOM/天线/贴纸相同；复用的是作者通用几何/接收座/关节方法，不能以换名旧目录代替本款证据。前后橙色AS923印刷分别按own8、own9独立代码重绘，未读私源、未借其它地区PNG或同名Module图。

自身native保留后3858/前2734，共6592个闭合源面；positions、normals、sequentialindex、sourceFaceIndex及原STL attributeWord都保留，只有[-cx,−32,+4]刚移。另6592装配preview逐面一对一配对，最大差4.827976e-6mm，全部13184原面有账，不装第三壳，不修补/重网格/缩放。MIT Copyright2021M5Stack完整原文在native-data source.license.text。原壳24×64×8，含SMA本体24×71.4×8；不能拉长原壳凑总长。两Ø4.85孔、16间距、距底12、nativeM5字形保持源形。

PCB侧4.5mm避让与原生安装管约0.54538mm正间隙，4支PCB柱与2支接收座柱实际落原后壳内底。真实4P Grove有接收深腔、4接点/回弯/穿板尾/孔壁/焊盘，另有支持的RAK3172(H)外观模组/32端脚/封装/被动件/3螺钉。两实体膜落在原native前后凹槽底z≈±3.8，顶部金色小窗背后是真SMA螺母，0LED/0按钮。PCB/BOM身份和隐藏安装、接点/配合均推导；不根据共享原理图R4/923表造实际区域电阻贴装。

own10近照比51所用照片清楚，可见介质内凸出的中央金属接点。本款据此建实心中心针及后退介质基座；附件采用推导的互补空心受针腔、介质和真深止挡。CPU射线分别命中本体中心针、介质座、附件空腔止挡及受腔侧接点；可见针在外螺纹沿内，推导针半径0.32/受腔半径0.38mm，正径向间隙0.06mm。它与51空心母接点的推导有差别，已封存51未改。本款文档的SMA内针措辞和照片不被当作SMA/RP-SMA极性或生产螺纹配合认证；hidden接合仍明确推导。

本体只有grove/antenna两Port，无本体joint/按钮/灯/虚拟传感器。默认挂本款195mm/2.3dBi/50Ω胶棒天线，独立导出Antenna自己的组件只有fold joint。own4/11能辨折肘/接缝/侧轴帽，轴位/0..90°展示限值/截面/制造配合是推导。固定轴/保持颊支持真空心活动毂，只有活动毂/臂/胶棒移动，SMA帽/受腔/介质/固定颊/轴保持固定。默认90°官图折起，0°直立展示，不支持非0rpm/伺服/自动无线行为。中心线从帽下端−5.5到轴+16.5为22mm，加173mm胶棒轴线为195mm，作为文档长度下的外观重建。

实际配置为complete {}、straight-antenna {antennaFoldDeg:0}、without-antenna {antenna:false}，两入口及所有配置均2普通PNG/2实体膜。外驱例 `{type:'joint',target:'antenna/fold',angleDeg:45,durationMs:200}`，StickS3→HUB第1路完整target为grove/grove-1/antenna/fold。附件实际detach({dispose:false})再attach保持关节/全部物理状态；默认detach会处置。GroveModule canonical=grove，另有unitFrame/cable实际四芯两插头。没有AT/UART/RF/LoRa/电气/功耗/固件仿真或输入echo。

同步必要probe顶层physical为默认Model真实本体计数，详细case另列：两入口×3预设6case、部分fold时去墨所有attrs/index/world严格一致；Model与变父StickS3→真实HUB第1路、实际四芯姿态/peer/framebuffer/noecho、附件与整Unit拆装恢复和资源dispose通过。所有实体为闭合正体积有向FrontSide，native源字节/原面ID/属性字不变，孔壁/支撑/金窗/接点/受腔均实际射线检查。CPU/DOM边界不是浏览器GPU、实物、制造或射频验收；未跑browser/build/历史suite。所有原图/生成器/私表/矢量不发布。
