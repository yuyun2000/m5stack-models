# 原 Mini BPS U090 / BMP280

自身官方MCP及不可变文档表确认24×24×13mm，01/02/03/04/07/08确认白壳、两通气槽、红Grove、BMP280板和前后印刷。采用 own-dimensional-parametric，无自身CAD/源面计数，不借U090-B/QMP6988壳拉伸。**13mm是本款名义包络，不是已知内部平面**；±6.5壳层、壁厚、两孔Ø5/16孔距、槽0.65×2.6及其位置、PCB层/支撑/封装/膜厚全为自身多视图外观推导。URL/commit/blob/SHA和推导项见sources.json。

完整前后盖、圆角侧壁、口后挡、两真实孔壁、中央前boss/后固定柱/十字盲槽头和接收螺杆闭合。PCB按自身03/04保八角轮廓、中央孔和侧开边避空，侧管壁间隙约0.3mm、中心boss间隙约0.4mm；四根柱由真实后盘支撑板。Grove有真实地板/侧壁/扣桥/深止挡/4接点、90度回弯、穿板尾脚/镀孔桶/上下环焊盘；固定PCB确实承接。

两槽是实际贯通孔，保FrontSide真实壁，向内直接看到固定金属BMP280。实际8LGA接点支撑封装，底座/四金属壁/有真实小压力孔的盖板连续装配，孔后有真实固定深底。封装2.5×2轮廓、r0.16压力口和层高为外观推导；不模拟压力膜、温度/高度/采样。HT7533和两BSS138身份据自身官方MCP；隐藏安装及被动件不是完整机械BOM。

两张普通PNG：自身07/08圆BPS蓝字、02的PORT. A . I2C与SCL/SDA/5V/GND后标，代码准确重绘并注明来源。前圆膜/后膜有完整实际托底，去墨仍保留；后无色M5为真实凹纹和底面。字体/间距/颜色为重建，未用包装标、错版标签、猜微字、个体码或照片裁切。私表本款0候选/0原稿下载；源图、SVG、生成器/中间件只留work，公开只有普通PNG。

真实API导出Model/GroveModule/spec/defaults/configurationSchema/configurations；body只有grove Port，canonical grove，GroveModule再加unitFrame/cable；默认{}、complete唯一preset、2张reference-redraw。没有传感Component/anchor、按钮、灯、关节、附件、屏或数值输出。只提供外观/连接/外驱pose，不实现压力、温度、高度、I2C地址/寄存器、电气或固件。

必要CPU smoke/helper pass：109个正体积闭合有向两面边FrontSide实体/42832面；真实孔/槽/压力孔壁、封装/PCB/中央固定/接点焊接支持；两入口去墨全attributes/index/world一致、PNG解码非空；真实Model与StickS3→HUB第2路/祖先和Unit双pose、四芯、拆装/错家族拒绝/host帧缓冲/dispose通过。未做browser/GPU/build/实物fit或旧全量验收，stage保持modeled。
