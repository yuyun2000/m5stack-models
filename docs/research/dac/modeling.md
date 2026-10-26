# Unit DAC U012 original MCP4725

2026-10-27。`modeled`，未做浏览器或实物验收。自身尺寸参数化建模 `own-dimensional-parametric`；没有本款 CAD，0 imported/native faces，未借 DAC2 的壳或标签。新编代码 MIT，官方照片/图纸仅作证据；仅公开授权的普通重绘 PNG。

当前本款官方 MCP 和自身尺寸图给出外包络 X/Y/Z=24×32×10.2 mm，基壳 8 mm、R4、两处 Ø5/16 mm 孔距，孔心距底12 mm，Grove 10×5.2 mm。旧不可变英文表 32.2×24.2×10.3 与其不同，保留差异，采用当前表与自身图；官方反馈已接收 `62c7572dda704867bc1c2c85edc363b8`，未收到更正装配数据。

独立闭合前/后壳、周边侧壁和贯通套筒；Grove 与端子是连接外轮廓的真实缺口，不以越界 hole 伪造。PCB 采用外缘避让安装孔的真实开轮廓，保持两条空轴，另有六个贯通焊脚孔、金属孔桶及双面焊盘。背板、PCB 支撑和固定螺杆/接收柱闭合装配；前部 DAC/箭头与背部 M5 采用实体无色浮雕。后贴膜和浮雕小凹台为照片推导，保持8 mm基壳和10.2 mm装配包络。

红色 Grove 有真实接收侧壁、底面、止挡、锁桥、四触点、回弯和固定 PCB 焊脚；2P 端子有固定接收壁/深止挡、两触针、下行导体与穿板尾脚。橙插体是专属可拆 `TerminalPlug`，包括带两孔的插入舌、两个真实线口、内部金属弹簧/夹笼和实体极性膜。插舌/固定载体/壳槽有正间隙，记录在 smoke；这些是外观推导间隙，不能当制造公差。自身图只证实端面凹孔，螺丝头槽形与螺距未获清楚确认，因此不添加 joint、螺距或夹紧行为。

本款官方原理图指导 MCP4725 和 LM321MFX 两固定封装、两电阻三电容的外观载体；内部板形、封装尺寸/位置、焊接支撑、厚度和插深为明确推导，并非完整 BOM。只做外观和真实机械连接；不制造电压、EEPROM、波形、转换动画、I2C 或固件。没有按钮、LED、sensor、display、joint 或虚构被动 sensor anchor。

后标与正面端子极性分别参考本款 dac_02 与 dac_06 准确代码重绘为高清普通 PNG；正面观察为左 + 右 −。不使用照片像素/裁切、DAC2 或 HAT 稿、包装图或未知个体码。后标载体固定在主壳；极性膜属于可拆插体。`artwork:false` 只去墨，完整保留物理膜、壳、孔壁、触点和浮雕。

入口 `Model` / `GroveModule`；默认 `{terminalPlug:true}`，另有 `terminalPlug:false` 真实拔下插体的命名配置。`terminal` port family 为 `m5.u012.2p-terminal`，只接纳本款 `TerminalPlug`。主机有 `grove`、`terminal` 两 port；GroveModule 增加 `unitFrame` 和 `cable`。插体没有内部组件、joint 或传感输出。`terminal.detach({dispose:false})` / `attach(savedPlug)` 用于机械装拆。

完成必要本款检查：142实体全部坐标焊接闭合、每边反向配对、正体积，14条壳体闭合射线、40条 FrontSide 安装孔壁射线、24条 PCB 钻孔壁射线；装配24×32×10.2。Model 与变父 StickS3→HUB 第3路真实四芯连接均检查机械插体往返、去墨保形、配置切换和禁止命令。没有运行历史全量、浏览器复核或实物测量。
