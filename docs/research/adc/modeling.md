# Unit ADC U013 原版 ADS1100

自身官方尺寸图与02/05/06照片建立24×32×10.2mm、8mm基壳、R4外角、两Ø5孔/16mm孔距/距底12mm、10×5.2mm Grove口和前装橙色2P插体。路线为 own-dimensional-parametric，不借ADC v1.1或其他型号原生几何，不宣称native源面计数。原款/EOL身份明确，不套ADS1110。自身文档不可变commit/blob/SHA与每张官方参考URL/SHA见sources.json；照片/图纸只参考不统一称MIT，不分发原字节。

白壳由自身参数化完整前盖、后盘、真实左右圆角壁与上下后挡、两贯通孔壁构成；真实前ADC/箭头浮雕与后M5凹纹是物理几何，去墨仍保留。8mm基壳未缩放，0.12mm前浮雕为照片推导，因此取下插体实物包络深8.12mm；默认安装插体和其膜总深仍10.2mm。M5凹纹有真实0.12mm底，中央固定十字头有盲槽底与接前boss的螺杆。隐藏壁厚/卡扣细节/封装安装和载体膜厚是外观推导，非量产机械BOM或fit。

PCB以四根实际支柱接后盘，穿两安装孔用开边r3.5避空轮廓，避免把孔裁穿板外边；实际5mm安装空轴与FrontSide孔壁均验证。ADS1100、LM358、HT7533身份依据本款官方资料，隐藏位置与被动件安装推导。红色HY2.0有接收地板/两侧壁/部分扣桥/深后壁/导轨、四真实接点、90度回弯、穿PCB尾脚/镀孔桶/上下环焊盘；端子两实际针/回弯/穿板桶和焊盘完整支持在PCB。

橙色插体是本款实际可拆2P：固定接收器保深腔/止挡/地板/顶壁/接点，可拆体保两真贯穿配针孔、四母触簧、真实两圆导线孔、金属深止挡/导体夹腔和隔壁。实测实体舌片到固定腔壁两侧约0.15mm、上下约0.25mm正间隙；不称额定公差。自身照片尚不足以确认外驱螺丝槽/头，所以TerminalPlug是静态0组件/0joint机械附件，不猜螺距/夹紧/轴移。原始HT3.96/3.96mm pitch仅记录本款身份，port family自有，不声称电气或其他版本通用。

两张普通高清PNG由自身清楚照片准确代码重绘：02背标ADC/0-12V/PORT. A . I2C/ADS1100/SCL/SDA/5V/GND；05/06插体红+黑−极性。真实后膜和插体膜完整保留，artwork:false只去墨，插体取下则载体/其印刷随物件移除。字体/间距/颜色/膜厚是重建；未用私矢量/照片裁切/未知微字/个体码。原图、SVG生成中间件、代码生成器都只在work，公开只有普通PNG和运行时代码。

实际API导出Model/GroveModule/TerminalPlug/spec/defaults/configurationSchema/configurations。body只有grove/terminal两Port；GroveModule追加unitFrame/cable；canonical真实grove。默认{terminal:'installed'}，另一真实preset{terminal:'removed'}；前者两张PNG，后者只背标一张；TerminalPlug自身只有一张极性PNG。0按钮/灯/关节/传感/显示/相机/虚构anchor。端子family m5.adc.u013.terminal-2p；仅机械detach/reattach，不输出ADC值/电压/波形/I2C/固件行为。

必要CPU smoke/helper pass：154个正体积闭合有向两面边FrontSide实体（132主体+22插体）、真实安装孔/PCB/深腔墙、插体正间隙和接点支持，2入口×2实际配置的去墨全attributes/index/world不变；真实Model与StickS3→HUB第2路四芯、非平凡祖先/Unit pose、机械roundtrip/错家族拒绝/dispose通过。没有browser/GPU/build/实物fit或全历史验收，stage保持modeled。
