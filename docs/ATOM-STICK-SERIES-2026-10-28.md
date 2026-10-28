# Atom / Stick 系列覆盖

范围按2026-10-28官方选型器：Atom Controllers16项，Stick6项加原M5Stick/StickV历史页，共24项。本轮17项缺口逐款补齐，旧款、独立硬件修订和外形不同整机套装均保留。

| 系列 | 官方产品 / SKU | 模型入口 | 当前 |
| --- | --- | --- | --- |
| Atom | Atom VoiceS3R (Atom EchoS3R) / C126-ECHO | [atom-echos3r](../src/devices/atom-echos3r/index.js) | 已接入，modeled |
| Atom | Atom Lite / C008 | [atom-lite](../src/devices/atom-lite/index.js) | 已接入，modeled |
| Atom | Atom Matrix v1.1 / C008-B-V11 | [atom-matrix-v11](../src/devices/atom-matrix-v11/index.js) | 已接入，modeled |
| Atom | Atom Matrix original / C008-B | [atom-matrix](../src/devices/atom-matrix/index.js) | 已接入，modeled |
| Atom | AtomU / K117 | [atomu](../src/devices/atomu/index.js) | 已接入，modeled |
| Atom | Atom Voice (Atom Echo) / C008-C | [atom-echo](../src/devices/atom-echo/index.js) | 已接入，modeled |
| Atom | AtomS3 / C123 | [atoms3](../src/devices/atoms3/index.js) | 已接入，modeled |
| Atom | AtomS3 Lite / C124 | [atoms3-lite](../src/devices/atoms3-lite/index.js) | 已接入，modeled |
| Atom | AtomS3U / K125 | [atoms3u](../src/devices/atoms3u/index.js) | 已接入，modeled |
| Atom | AtomS3R / C126 | [atoms3r](../src/devices/atoms3r/index.js) | 已接入，modeled |
| Atom | AtomS3R-CAM / C126-CAM | [atoms3r-cam](../src/devices/atoms3r-cam/index.js) | 已接入，modeled |
| Atom | AtomS3R-Ext / C126-Ext | [atoms3r-ext](../src/devices/atoms3r-ext/index.js) | 已接入，modeled |
| Atom | AtomS3R-M12 / C126-M12 | [atoms3r-m12](../src/devices/atoms3r-m12/index.js) | 已接入，modeled |
| Atom | AtomS3R-M12 Volcengine Kit / D062-M12 | [atoms3r-m12-volcengine-kit](../src/devices/atoms3r-m12-volcengine-kit/index.js) | 已接入，modeled |
| Atom | AtomS3R-AI Chatbot / K147 | [atoms3r-ai-chatbot](../src/devices/atoms3r-ai-chatbot/index.js) | 已接入，modeled |
| Atom | AtomS3R-CAM AI Chatbot / K147-CAM | [atoms3r-cam-ai-chatbot](../src/devices/atoms3r-cam-ai-chatbot/index.js) | 已接入，modeled |
| Stick | StickS3 / K150 | [sticks3](../src/devices/sticks3/index.js) | 已接入，modeled |
| Stick | M5StickC Plus2 / K016-P2 | [stickc-plus2](../src/devices/stickc-plus2/index.js) | 已接入，modeled |
| Stick | M5StickC / K016-C | [stickc](../src/devices/stickc/index.js) | 已接入，modeled |
| Stick | M5StickC Plus / K016-P | [stickc-plus](../src/devices/stickc-plus/index.js) | 已接入，modeled |
| Stick | M5StickC Plus SE / K016-P-SE | [stickc-plus-se](../src/devices/stickc-plus-se/index.js) | 已接入，modeled |
| Stick | M5StickT2 / K016-T2 | [stickt2](../src/devices/stickt2/index.js) | 已接入，modeled |
| Stick | M5Stick / K016 | [m5stick](../src/devices/m5stick/index.js) | 已接入，modeled |
| Stick | M5StickV / K027 | [stickv](../src/devices/stickv/index.js) | 已接入，modeled |

模型与贴纸来源见各款研究记录。Echo/Voice、EchoS3R/VoiceS3R保留官方新旧名称对应同一SKU；没有官方独立SKU的AtomS3R-Lite不另造型号。底座套装具完整额外实体并保留实际主机能力。

检查入口：`node scripts/check-atom-stick-series.mjs` 核对全部24条身份、实际导出/lazy loader/顶层别名、每个配置和控件目标；每款专项、主机动态/连接、demo和生产浏览器证据另行执行。

所有产品保持modeled。相机、语音、AI、IMU、总线、固件和电气由下游实现；几何、普通PNG和输入/显示仅提供当前明确实现的视觉能力。

本批计划见[全系列计划](plans/atom-stick-series-2026-10-28.md)。

## 当前验证与修订

当前目录222款，包含38主机、184 Unit。系列检查覆盖24产品、29配置；全部主机共享检查覆盖45配置、216控件与50个Grove端口。结果分别见[系列](../artifacts/atom-stick-series-2026-10-28/series.json)、[主机动态](../artifacts/atom-stick-series-2026-10-28/controllers.json)、[连接](../artifacts/atom-stick-series-2026-10-28/connections.json)。Demo生命周期、输入拾取与生产构建均通过。

[实际页面报告](../artifacts/atom-stick-series-2026-10-28/browser-checks.json)包含全部24款的目录选择、加载及主按键定格按放，连同额外5配置共29次检查。真实画布输入另覆盖Matrix v1.1、StickV弹舌、T2轮圈与中心按压；不能据此声称逐一点击过全部216控件。隐藏面板0×0恢复后也能正常适配模型。控制台无错误或警告。

T2右视检查发现窗口可见电池及部分透空，现已补入本款闭合接收壳、真实轴孔与深止挡。旧成功记录保持原样，当前以[独立修订](research/stickt2/encoder-receiver-amendment-2026-10-28.md)、[576条首交与净隙检查](../artifacts/atom-stick-series-2026-10-28/stickt2-receiver-current.json)和[当前完整专项](../artifacts/atom-stick-series-2026-10-28/stickt2-controller-current.json)为准。修订后重新构建并核对[右视图](../artifacts/atom-stick-series-2026-10-28/stickt2-right-amended.jpg)，真实轮圈拖转94.1°后面板读数同步，中心按放与回零正常。接收件隐藏尺寸仍明确为本款视觉推导。

[最终贴图打包检查](../artifacts/atom-stick-series-2026-10-28/artwork-build-final.json)确认30张普通PNG真实字节已进入dist文件或内联资源。[HTTP构建核对](../artifacts/atom-stick-series-2026-10-28/http-build.json)确认HTML、入口、17款新lazy chunk及外置PNG共44份资源与本地生产dist完全一致。最后两处修订仅涉及T2固定接收件和joint面板读回，完成针对性页面复测；其他28配置的逐款截图保留原检查记录。

原M5Stick白版完整背面印刷尚无独立依据，未猜补微字。隐藏配合、推导行程和当前视觉测试均不构成实物制造或固件验收。私有表格、矢量原稿与映射继续位于分发树外。
