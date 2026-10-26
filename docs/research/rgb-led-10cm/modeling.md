# Unit RGB LED 10cm / 15LED — A035

2026-10-27。`modeled`，0 verified。own-dimensional-parametric，0 native/source faces。精确商店variant A035=10cm-15LED；没有借A035-B29灯照片计数，也没有借A093防水5050。新代码MIT；原图/源文件/生成器只留work，仅公开3张普通PNG重绘。

**官方只给10×100 mm二维条带datum，没有官方厚度或完整装配包络。** nominalMm设null，nominalStripMm=[10,100]；自建直态含白/黑端板与Grove的包络10×137×7.5、FPC0.3/胶0.06/离型纸0.12、端板13.5、15灯节距100/15均为照片重建，不能当官方尺寸或制造公差。

白色连续厚FPC、胶层和背面实际离型纸均有闭合有向实体；15颗独立3535白封装、真实窗口壁/底面/树脂、4端子、铜垫/焊接与清楚被动件支持齐全。102铜垫、96实际焊接支撑把曲面铜面接到刚性封装脚/端板。每端都有有厚度缺口PCB、真实三组辅助通孔/四触点穿板焊接、金属孔桶/焊盘、Grove墙/底/锁桥/深止挡/四触点与回弯，不能以黑面或图片替代。Grovetail0.42方针角半径0.29698小于孔桶内半径0.32，有正余量。

当前官方实物与页面是白SIGNALINPUT、黑NEXT；旧不可变文档反写，保留冲突与官方已受理反馈1dacda9a2ec84a859ccf2796e7e463c6。只呈现连接外观，不做功率、协议、级联地址、固件或自动彩虹。

本款专属`StripFlex`，kind=`flexible-strip`、id=`flex`。外部命令`{type:'flex',target:'flex',bendDeg:90,durationMs:1000}`线性插值曲率状态，`durationMs`仅视觉过渡；无async/计时器/弹性求解。展示范围−120..120°是模型数值边界，不声称硬件限位或额定最小弯曲半径。

令k=bendRad/100、s∈[−50,50]，中性线C(s)=(0,sin(ks)/k,(1−cos(ks))/k)，法向N=(0,−sin(ks),cos(ks))，实体点P=(x,Cy−z sin(ks),Cz+z cos(ks))。k=0精确恢复原Float32位置/法向字节。中性轴解析弧长100，三层连续厚材与铜垫/条带墨同步变形；法向按Jacobian逆转置更新，索引恒定。15刚性封装和两真实端板按各自位置切向随动，96真实焊接桥保持两端连接，整端面与FPC接缝一致。Module每帧同时更新输入端口局部位置和四芯cable，端口真实随动；没有虚构铰链/joint。

三个实际命名配置：straight=0°、arc=90°、reverse=−60°。默认bendDeg=0；Model与GroveModule相同配置。自身组件依次flex、led-1..led-15、grove、extension；Module另有unitFrame/cable。每颗LED仅外驱on/color/brightness，独立真实树脂材料，弯曲不重置灯状态或peer/framebuffer。无button/sensor/display/joint/anchor/虚构附件。

三张PNG分别是同A035家族清楚条带+/D/−/箭头、白端板B/arrow/S+G、黑端板B/arrow/S+G；不裁照片、不猜微字/离型纸商标/宣传标题。板墨在真实PCB上，条带墨按相同曲率更新；去墨保留所有实体和背胶/离型纸。

本款必要检查通过：439实体在0/±120°均闭合、边反向配对、正体积；每态12条完整FPC/端板接缝检查。100 mm中性轴的512段数值采样最坏误差0.0000698 mm；3预设两入口partial过渡的全部physical attrs/index/world去墨一致，墨/焊接无悬空并精确恢复当前预设。15树脂第一材料射线、8Grove触点、32条FrontSide焊孔壁射线、真实变父StickS3→HUB第1路与两根四芯cable通过。没有浏览器复核、实测、制造fit或电气/固件验收。

检查基线窄修：三分支初始挂接的Grove cable可能沿用挂接前几何；返回同一曲率后，在当前父级重新采样得到等值但不同字节的±0和最大1.78e−15插头矩阵差。helper先用当前实际父级显式同slack/bend采样，再建立严格rest；原physical attrs/index/world全等断言不变。产品几何/API/core/shared没有更改，已在真实初始三分支与后续变父阶段分别通过。
