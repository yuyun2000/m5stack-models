# HBridge / CatM GNSS / Ultrasonic-IO 扩展

2026-10-27本批本地已接入。

本地154=14主机+140Unit/0verified；Git151 main a8198a5已同步，见各副本docs/GIT-SYNC-151-2026-10-27.md。本批3款/6张实际PNG仍为本地增量，未再次提交推送；当前待同步合计3款/6PNG。上一轮151检查点与旧产品逐字节保留，当前实现数量不等于逐面/GPU/制造或实物验收，整体goal active。

原HBridge U160以自身1rear3032+2front2560=5592原装源为基准，保实际STM32/RZ7899/供电件、Grove/橙4P座及自身可拆四头插头。五个真实稳定DIP/VM滑选保外部档位API；被前盖挡住时不提供穿壳pointer命中，真实去盖服务才开放指针交互。只滑片/杆/工具头运动，底座/壳/板及固定轴夹笼保持；释放/取消保已切档，显式setPosition才恢复所需档位。不借U160-V11的loose电容或造旋钮、马达/PWM/电气状态。

CatM GNSS U137以自身0front2646+3rear2638=5284原装CAD为源基准；左SMA窗口按本款官图限域派生，运行5248面（前2610/后2638），前壳2489原面保留、157原面在限域内替换为121新面，后壳完整。区域、原面/新面对应、材料闭合与推导以最终sources/smoke为准，不能将5284源面数声称为运行保留面数。宽壳/四安装孔、SIM7080G/实际板、双SMA/Grove/DC/侧MicroSIM与两真实盖固定件齐备；MicroSIM非Nano、不附无据卡。自身LTE杆和GNSS同轴+puck独立可拆与外驱真实形状，同轴不套Grove四芯；六种真实配置依最终冻结API保留。未证NET/STA外部光路则保内部载体/原遮挡，不造灯或网络/定位状态。尺寸/轴/线形及隐藏安装明记推导，不称量产止挡/机械互配或内部RF行为。

Ultrasonic-IO U098-B2保自身1rear3044+2front2466=5510源、原公差、RCWL-9620 GPIO板/黑Grove/两16mm真开网罩和深膜片、支撑/后盖与本款IO背标。排B1 I2C与包装/错视图，官方错PinMap依据自身PORT.B I/O照片/例程记录已反馈；不造声波、膜片动作、距离读数/时序或内部固件。实际所有组件、导出、默认/服务配置和附件消息以本批指南与各自frozen publicAPI为准。

本批6张本款普通PNG同步；本款原稿栅格与本款官图代码重绘按各自artwork.json分列，注明转换/字体颜色/配准推导。不裁照片/借错款/编小字或以印刷遮缺件。私表/URL/原稿名/映射/矢量、原始官图/CAD/PDF/MCP全文/生成器/中间件只在分发树外，不公开/打印私值；静态URL图片与实际打包/服务字节核对。新增代码MIT，第三方及标识保留各自权利。

三作者runtime/research/fragments全SHA冻结后按实际API登记/窄同步；两副本必要单品、真实StickS3→HUB三分支4芯、真实稳定档位/多源取消/外驱附件与固定件/错误家族拒绝/独立装拆、实际服务只去指定件并保持其余全物理与端口、所有入口实际配置artwork:false全部attributes/index/matrixWorld、pose/cable/noecho与主机framebuffer保持通过。9导出、两build及5188在线154catalog/3chunk/6对应源PNG字节、6新catalog/source记录与PNG隐私通过；1142旧公开Unit/1103旧私Unit/19core/7Scroll保持。111贴纸行/39批索引与指南/公开progress已存；未逐面浏览器/GPU、历史全量、制造或实物验收。

冻结SHA256：hbridge `63c5329db0232c631a2c7064c554587614c50c4f68ba39c55a37f867c2ee7af0`；catm-gnss `f221c2426fabd07cf85b4d542bdf5e922b6486e5750be2767cc5a0ba940982a1`；ultrasonic-io `856565b9a1bf06aaf05aec20ff4b0b96d5756d5aeaf5e07030fb471921b79e39`。旧50PNG/私Scroll/StackChan量产fit-unresolved/Puzzle Bridge配合缺基准保留。原KMeter U133/MQTT U129/MQTT-PoE U129-B缺自身机械源暂缓，不借壳；不重复同资料/旧最终器/整树同步/重启5188/加标签/自动push。继续真实未覆盖Unit与同步贴纸，内部马达、蜂窝/RF/GNSS/AT/UART、声学/传感值、固件/网络与电气由外部框架实现，整体goal active。

见[本批指南](../HBRIDGE-CATM-ULTRASONIC-UNITS.md)与[本地检查点](../../artifacts/hbridge-catm-ultrasonic-expansion/progress.json)。
