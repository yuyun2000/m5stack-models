# AtomS3R-Ext（C126-Ext）建模记录

2026-10-28，状态 `modeled`。精确来源和各个官图哈希见 [sources.json](sources.json)，原生逐面记账见 [source-face-map.json](source-face-map.json)，当前实际专项见 [smoke.json](smoke.json)。

本款自身 STL 的 5728 个三角面中，实际件 2864 面与装配预览 2864 面独立对应；原始 position、normal、index、sourceFaceIndex、sourceAttributeWord 原样保留，仅应用记录的刚体位姿。连接弹舌从本款自身源面播种，只移动真实活动区，固定邻域、内外壁截面和源属性分别验证，完全释放后逐字节恢复。

真实默认装配包括厚 PCB、固定支承、真实深排母、Grove 四壁/触点/止挡、USB、M2盲孔、IR与本款专属顶面部件。所有物理网格闭合且 FrontSide，不用黑平面、墨层或 DoubleSide 补缺壁。隐藏封装和安装尺寸是明确的视觉推导。

贴纸由本款清晰官图重绘为普通高清 PNG；不裁产品照片，不分发原始矢量、表格、私有映射或转换器。`artwork:false` 只移除墨层，真实载体、孔洞、光学体和动作保持。不可读微字不补造。

专项直接导入实际 Model，在 rest/partial/full/returned-rest 比较真实几何射线、固定件、源属性、连接端点、取消、卸载复用和逐资源释放。Viewer 使用实际 camera/raycaster/filter 与 DOM 事件，GPU/DOM替身界限写在报告；不能据此宣称浏览器像素、制造或硬件验收。

- Hidden PCBs,package envelopes,supports,optical stack,connector fit and visual travel are own-photo/CAD-space appearance inferences,not manufacturing dimensions.
- External input/LED/connection only;no firmware,bus,sensing,camera stream or automatic Reset effects.
- CPU actual geometry/API/Viewer fixture passed;browser pixels and physical-device fit are separate evidence.
- Prototype board is a fixed seated visual assembly with30 independent through-hole pads;no invented hinge,signal or powered circuit simulation.
- Official dimension conflict:hero12.9mm,current table12mm;own native12mm retained.
