# M5Stick / K016

2026-10-28。Atom/Stick全系列补齐批。产品状态保持 `modeled`。

以[本款官方页面](https://docs.m5stack.com/en/core/M5Stick)及[自身照片](https://static-cdn.m5stack.com/resource/docs/static/assets/img/product_pics/core/minicore/m5stick/m5stick_03.webp)重建，毫米轴为 +X右、+Y上、+Z屏幕面。外壳采用真实厚度前/后盖、四边壁及四段闭合角，含完整物理屏模块、PCB/电池视觉包络、开孔后的接口包体、按键支承和真实盲止挡。隐藏尺寸及行程为外观推导，不作为制造资料。

- Official page dimensions48.2×25.5×13.7 are reordered to X25.5,Y48.2,Z13.7;source axes documented.
- Own photographs and dimensions,original reconstruction;not later StickC CAD. Hidden stack,button travel and apertures photo-inferred.
- Gray MPU9250 and no-IMU white own-photo revisions separated;page calls no-IMU variant black while own photo says white. White full rear print not independently resolved;optional IMU block omitted.
- Own gray rear-photo readable large blocks reference-redrawn;unreadable microprint omitted. No audio,IR,IMU,electrical or firmware emulation.

## 使用与验证

`Model`、`defaults`、`configurations`、`configurationSchema`、`spec` 从本款入口导出。配置见目录。`lcd`是外驱帧缓冲、非触摸；按键提供意图输入，灯仅表现外部给定颜色/亮度。Grove可连接真实Unit模型和四芯线。`artwork:false`只关闭墨层，保留物理贴纸载体、玻璃、壳壁、孔壁/止挡、动作。

专项：`node scripts/check-m5stick-controller.mjs`。当前检查两配置真实实体的正反首交射线、全物理属性/索引、固定区稳定、部分/全按与精确回位、多源取消无click、外驱屏/灯无回声、实例隔离、真实Grove和四线连接。共享检查覆盖全目录。CPU检查不代替浏览器像素、固件、电气、物理相机或音频验收。

私有CSV、矢量、名称/URL映射和生成材料在分发树外。代码MIT；图像及商标权独立。


原M5Stick A键按自身06侧视定位于OLED端（Y约+9mm），与M5标识端区分；侧壁开孔和固定开关随同配准。专项增加该来源方位与官方G32/G33 Grove引脚顺序约束。
