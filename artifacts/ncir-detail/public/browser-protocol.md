# NCIR 浏览器复核流程

本批使用 CUA 操作现有浏览器，不执行旧批次的 Playwright 进程脚本，不访问模型内部对象，不通过 evaluate 改 DOM、canvas 或模型。evaluate只读DOM几何和可展开的当前几何状态。截图API返回的原生JPEG字节单独保留，再把其解码RGB无损封装成真实PNG；不改变像素内容。几何状态与console来自当前页面。另用独立HTTP只读请求核HTML/CSS/JS/catalog与实际build绑定；它不是浏览器网络事件抓取。

1. 源码冻结，完整check/build/status与build binding通过后，打开对应127.0.0.1预览的`?model=ncir`并刷新，确认stage为ncir/ready，机械控件无虚构按钮/关节。
2. 实际点击七个视角按钮，逐个保存canvas区域原始JPEG与视角状态；PNG另由原始解码RGB生成。每次交互后读取AX状态。
3. front视角连续取两张不施加输入的图；用RGB像素比较确认静态外观稳定。
4. front、iso、bottom各从相应视角正常fit状态，对画布施加相同原生滚轮上移，再保存近景。结束后通过视角按钮复位fit。
5. 打开StickS3，使用可见连接控件先挂HUB，再挂NCIR到grove/grove-1，保存default接线图并读当前几何状态。
6. 使用实际range的键盘Home/ArrowRight调整distance110/x50/z14/turn25/tilt-18/slack23（按DOM给出的min/max/step，不通过evaluate赋值）。读状态验证四芯/双插头与目标位置/四元数，使用“框选连接”和正常视角按钮保存posed图。
7. 使用可见断开控件移除NCIR，确认HUB三个输出保留、NCIR输入路径移除、cable清除且宿主保留，保存detached图。
8. 保存console原始可得条目。逐张对照官方参考照片与原CAD结果，明确实际看到的结构及推导限制。核当前source/build未变化；保存时间、页面URL、截图hash及检查结果。公开版本独立重复，并比较相同稳定视图的RGB，不直接沿用私有浏览器结果。

若浏览器交互或截图失败，保留实际失败，不使用离屏伪造模型图、不以程序生成图片代替浏览器证明。不同浏览器/默认视口若造成RGB差异则保留差异，不能改旧冻结图凑一致。
