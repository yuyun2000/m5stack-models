# 初代 Cardputer K132

名义尺寸 84 × 54 × 19.7 mm。使用初代本款官方 CAD 的安装态结构和原版 Stamp-S3 外壳。选择和排除的装配面见 [CAD map](../../../src/devices/cardputer/cad-map.json)。局部封装、内藏件和显示装配的补建尺寸为外观推导。

ST7789V2 模型目标为 `lcd`，分辨率为 240 × 135。实体键帽采用 4×14 布局，56 键各自提供外观行程和键盘扫描位置。解码器地址位 A0、A1、A2 对应 GPIO 8、9、11，低有效检测列为 GPIO 13、15、3、4、5、6、7。

十张独立印刷为参考重绘，保留正面名称、键位字样、Stamp-S3 图案、顶部与 Grove 标签以及背面图例。微型引脚标识、合规标记和部分背面线路细节省略。关闭 `artwork` 后，物理载体和控件仍保留。[正面官方参考图](https://static-cdn.m5stack.com/resource/docs/products/core/Cardputer/img-60261bcd-a23f-40e6-994d-ad97477dcec4.webp)

来源见[官方产品页](https://docs.m5stack.com/en/core/Cardputer)、[官方 KeyboardReader 实现](https://github.com/m5stack/M5Cardputer/tree/bf64d3178ab43928fa02365fbe3937cec99716ad/src/utility/Keyboard/KeyboardReader)与[来源清单](../../../source-manifest.json)。
