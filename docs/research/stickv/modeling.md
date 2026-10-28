# M5StickV / K027

2026-10-28。Atom/Stick全系列补齐批。产品状态保持 `modeled`。

以[本款官方页面](https://docs.m5stack.com/en/core/StickV)及[自身照片](https://static-cdn.m5stack.com/resource/docs/products/core/m5stickv/m5stickv_03.webp)重建，毫米轴为 +X右、+Y上、+Z屏幕面。外壳采用真实厚度前/后盖、四边壁及四段闭合角，含完整物理屏模块、PCB/电池视觉包络、开孔后的接口包体、按键支承和真实盲止挡。隐藏尺寸及行程为外观推导，不作为制造资料。

- Own K027 photographs and stated48×24×22mm,original reconstruction;not StickC geometry and not ESP32.
- Two PCB revisions exposed as visual configurations;official BOM/MPU6886/SH200Q and flash references vary historically,not collapsed into fabricated runtime capability.
- Camera,RGBW physical optic,speaker,USB-C,Grove,microSD and keys included. Camera/audio/SD/IMU are passive visible structure;no emulated sensor or firmware.
- Own photos show a plain blue molded case and physical key ribs,not a rear pinout sticker;no photo crop or invented sticker added.

## 使用与验证

`Model`、`defaults`、`configurations`、`configurationSchema`、`spec` 从本款入口导出。配置见目录。`lcd`是外驱帧缓冲、非触摸；按键提供意图输入，灯仅表现外部给定颜色/亮度。Grove可连接真实Unit模型和四芯线。`artwork:false`只关闭墨层，保留物理贴纸载体、玻璃、壳壁、孔壁/止挡、动作。

专项：`node scripts/check-stickv-controller.mjs`。当前检查两配置真实实体的正反首交射线、全物理属性/索引、固定区稳定、部分/全按与精确回位、多源取消无click、外驱屏/灯无回声、实例隔离、真实Grove和四线连接。共享检查覆盖全目录。CPU检查不代替浏览器像素、固件、电气、物理相机或音频验收。

私有CSV、矢量、名称/URL映射和生成材料在分发树外。代码MIT；图像及商标权独立。


## 自身照片拓扑修正

按本款官方01/03/04/06照片核定：前A为底部连壳的三边U槽舌，固定下根不随按压平移；内外壁及三条实体握纹同权弯曲，取消后恢复原数组。后RGBW为比镜头更宽的横向矩形窗口。底端从屏幕面到背面依次M3孔、USB-C、Grove，M3保留实体厚壁、金属孔圈及推导深盲止挡，孔深/位置为外观估计。自身02 PinMap规定Grove为GND / VOUT / G35 / G34，黄35、白34。

专项新增以上独立来源约束、M3中心/壁首交、固定U槽桥首交及全部内外顶点的连续弯曲/回零检查。旧检查曾只覆盖刚帽和正反闭合；这次拓扑要求独立补齐。
