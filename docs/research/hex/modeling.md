# Unit HEX A045 原版 SK6812

2026-10-27。`modeled`；无自身CAD，按本款维图/01/02/后板照片/05重建 `own-dimensional-parametric`，未借NeoHEX A045-B灯珠、耳位或均光片。新代码MIT；来源照片/图纸只作证据，公开1张代码重绘普通PNG，原图/生成器/矢量/中间件留work。

自身维图X36、Y31.2、深6.95mm、PCB1mm，灯距5/4.33mm，接收座宽12mm；表31.2×36×7保留顺序及取整差异。隐藏后座高度、内部深度/弯折、封装3.5mm边长和树脂轮廓、边孔尺寸、焊接位置、17个可见后被动件包体与薄膜注册为照片推导，不称量产datum/BOM或fit验证。

闭合黑色六角PCB有18实际边孔及12接点穿板孔、圆形铜环、真实孔壁。37颗较大SK6812按本款05的4/5/6/7/6/5/4行、左到右1–37放置，实体白色底/孔口围壁、树脂窗、内芯/金属、148末端及148焊接保持。参考图的编号没有印在PCB。三座白色HY2.0均有四触点，实际墙、深止挡、底面、金属回弯/平脚/穿板尾及焊环；canonical输入为后视左IN。PWR同样四接点，但只按原图GND/VCC标注，其余不编电气作用。MCP派生三位说法已反馈accepted：a1f0dbba68584d2e9f5aab0d79e1140d。

背板清楚HEX/V1.1、IN/OUT实际印刷箭头、可读C位号/白框独立重绘为3600×3120透明PNG，仅投实际PCB；字体/定位推导。QR/0005、未知微字、宣传箭头和参考LED编号不复制；个体白膜作为0.06mm实体贴PCB保留。`artwork:false`只去墨，两入口所有实际attributes/index/world和白膜相同。

API为Model/GroveModule/spec/defaults/configurations/configurationSchema，默认{}、唯一complete:{}。本体顺序grove/out/power、led-1..led-37；Module追加unitFrame/cable。37个LED仅外驱on/color/brightness，状态color/brightness，默认白色/0亮度；每颗真实树脂材料独立变化且无输入回显，无自动彩虹、数据级联、协议、供电、帧缓冲或固件。0按钮/joint/sensor/display/附件。

必要检查699实体/59300面坐标焊接闭合、有向边反向配对、正体积；120PCB孔壁射线、24接收器触点/深腔/墙射线及37真实window命中通过。Model及实际变父StickS3→HUB第三路probe逐灯、去墨保形、四芯、分支装拆、peer/framebuffer和2300资源dispose通过；结果与SHA见smoke.json。不做browser/GPU、实物fit或历史全量验收，0verified。
