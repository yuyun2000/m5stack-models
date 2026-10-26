# C6L / Gateway H2 / ChainBus 扩展

2026-10-26本批本地已接入。从133新增U202/U195/U212后达到136=14主机+122Unit/0verified。Git127 main3681a64已同步且仍为当前提交基线，随后9款/17PNG保持本地，未再次提交推送。modeled是实现数量，不代表视觉、量产装配或实物验收；整体goal active。

C6L完整6698本款原三角（6442壳+256status导光件），56mm壳/62mm含RP-SMA分记。实际64×48 OLED接受外部framebuffer，user与同一个侧reset键弯曲原生壳舌及内部对应柱塞，固定铰根/底座/板/屏/灯保持，释放/cancel精确回到原坐标和法线；不另造BOOT键或固件复位/下载联动。rgb/status独立外驱，蜂鸣器只实体。双RP-SMA机端外螺纹中心针及两附件内螺纹中心孔按本款形态，108mm LoRa/84mm Wi-Fi附件独立装拆，拒普通SMA；antennas true/false均支持，无证机械铰链止挡不加joint。安装/行程和附件外形推导留来源，不等于量产配合。

GatewayH2完整3580原壳24×48×8，默认闭壳只注册grove，无假USB/Boot开口或穿壳点击；shell:false明确裸PCB配置，无壳/膜/壳螺钉，真实Boot黑帽压放取消回位、USB Port和六镀孔download被动锚可访问。download不是Port，不造塑料排座。实际ESP32-H2-MINI-1固定PCB天线，不造外接SMA/joint、sensor或未确证LED。按钮仅输入意图，不实现烧录/复位/USB枚举/网络/协议电气。

ChainBus完整4156原native壳/锁舌/RGB导光件、PCB/触点及白色四腔EXT plug补足实际29.8总长。左右蓝IN/OUT为四芯座，GroveModule从canonical grove左IN接入，out可独立级联。DirectModule以真实EXT插接面直接装入host的Grove socket，三入口几何一致且只作刚性装配变换，不建VisualCable/unitFrame或额外白源plug；ext的plug家族拒普通GroveModule插头对插头。rgb仅外驱，无按键/自动UART-I2C或总线路由，不为产品适配修改core。

同步8本款普通PNG：C6L背source-vector-raster，前保原稿字形/标志并按当前本款官图改频段带，明确source-vector-raster-and-reference-redraw，另两天线套环reference-redraw，共4；GatewayH2正背2张reference-redraw；ChainBus本机正背2张source-vector-raster。表格、私链接/原稿名、矢量、原始CAD/官图/PDF、MCP全文、生成器和中间件留分发树外。无照片裁切、错误型号借用、编造小字或PNG代缺失实体。H2裸板配置实际无胶膜/印刷，artwork:false只取消其余配置的墨层。

## 本批完成检查点

三作者runtime/research/fragments全SHA冻结后登记、窄同步。两副本必要单品及真实StickS3→HUB三分支四芯通过：C6L两原生键多源压放/cancel/柱塞随动/固定铰根和精确位置法线回位、独立RGB/status与OLED/主机framebuffer保持、两类RP-SMA独立附件装拆/拒普通SMA；H2闭壳只Grove与裸板实际Boot/USB/download；ChainBus IN/OUT级联及EXT直接入口无重复plug/cable、实际接口拒错与独立装拆；三入口适用各配置印刷关闭后全部物理attributes/index/matrixWorld不变，pose/cable/独立拆支/noecho保持。9导出与两build通过，5188在线136款catalog/3运行chunk/8PNG与公开dist/对应源码PNG逐字节一致；970旧Unit/19core/7Scroll保持，新目录两副本及6catalog-manifest记录/PNG隐私通过。93贴纸行、33批索引和接入指南已存，细节见[本批指南](../C6L-GATEWAY-CHAINBUS-UNITS.md)和[本地检查点](../../artifacts/c6l-gateway-chainbus-expansion/progress.json)。

未逐面浏览器、全量历史、实物或量产配合验收。旧50PNG/Scroll/StackChan fit-unresolved/Puzzle Bridge缺基准保留，不重复同资料/旧最终器，不整树同步或自动push。下一步继续按本款官方结构和贴纸可得性挑未覆盖Unit；内部协议、固件、电气由外部框架实现，整体goal active。
