# ESP32CAM 原版 U007

以本款正反官方照片独立重建细长黑色裸板、两孔、普通 OV2640/方形载体/镜头/橙排线、白色24P FPC座、金属3D天线与四只固定焊脚、USB-C、4P Grove、空2P电池座、双面可见封装和真实铜焊盘。没有借用 U017-PCBA、TimerCamera 或其他相机外形。0 导入CAD源面，601个闭合正体积实体、19908三角面，所有实体材质为FrontSide。两安装孔轴贯穿空、孔壁有真实方向，接收座有深腔、接点、保持壁与实际承托，裸板的空白位置保留为PCB。

旧精确U007文档的20.5×46.5×11.5 mm只作为**暂定外观基准**，并非测量或制造包络；当前54×54×26.6 mm与照片冲突，仍保留未解状态。官方已受理反馈6a0815243e6c4db08789109122c16be0，没有更正机械/BOM资料。PCB厚度/轮廓/孔位、封装精确身份、全部隐藏安装/引脚/支撑、天线冲孔与弯折、光学栈、内部连接器配合均为照片推导。USB-C照片与原理图USB_Micro符号、Grove照片与原理图缺座、G16 LED表项与未证外镜片等差异不被当作同一已证电路。Grove的G4/G13只保留文档元数据。

唯一输入是实际黄色侧帽 `key`，只移动帽实体0.18 mm，方向+X为照片推导。固定开关框、金属壳、焊脚、PCB和其他器件不动；支持按下、松开、多来源保持、取消与回弹，不做RESET、长按、上电或固件算法。`camera`只是OV2640被动光学frame，文档FOV65°，不显示图像/视频/AI、不模拟焦距。`grove`与`usb`仅机械端口；空2P座不注册battery port、配件或默认电池。NC的MPU/BME/麦克风/PSRAM变体不装成默认传感器，没有LED/display/speaker/sensor/joint API。

本款没有机身贴膜，0 PNG、0实体膜。FPC/PCB微字无法安全逐字读取，故不猜；own01宣传标题及old05/06接口箭头不印到板上。普通PNG在有清楚同款来源时才生成。所有原图、表、矢量和生成器留在work或私有资料中。`artwork:false`对全部物理attributes、index、world和端口frame严格无影响。

直接使用 `src/units/esp32cam/index.js` 的 `Model` 或 `GroveModule`；另导出 `spec/defaults/configurationSchema/configurations`。独立Model键盘K对应key，也可用指针或 `{type:'button',target:'key',action:'press'|'release'|'cancel',source:'app'}`。GroveModule在StickS3→HUB第2路时实际路径为 `grove/grove-2/key`，光学frame为 `grove/grove-2/camera`；`unitFrame`及`cable`沿同一路径寻址。GroveModule使用真实四芯两插头线缆，canonical为grove。

必要同步CPU probe验证两入口/实际配置去墨、单帽partial/multi-source/cancel、固定实体/端口不动、变父StickS3→真实HUB第2路、独立同款peer、宿主framebuffer、实际四芯姿态、拆装恢复、无自动echo及资源dispose。具体结果见smoke.json。它不等于浏览器GPU、实物、制造配合或电气验收；本作者未跑build/browser/旧suite。新代码MIT，原始官方图文不统一套MIT。
