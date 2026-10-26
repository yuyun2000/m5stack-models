# Arduino Nesso N1 参考重绘

更新日期：2026-10-26。精确型号：Arduino Nesso N1；SKU：DK001。

本批 PNG 从空白画布按同型号官方照片重新绘制，来源类型统一为 `reference-redraw`，不是官方原稿、矢量转图或产品照片裁片。未将照片像素直接复制到输出。字体、图形、颜色及配准为显示用近似；高清画布保证重绘线条清楚，不恢复原图不可辨内容，也不构成制造或电气验证。

## 公开来源

- [同型号官方产品文档](https://docs.m5stack.com/en/core/Arduino_Nesso_N1)。
- [官方照片 10](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/1198/DK001_main_pictures_10.jpg)，1200 × 1200。
- [官方照片 11](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/1198/DK001_main_pictures_11.jpg)，1200 × 1200。
- [官方照片 14](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/1198/DK001_main_pictures_14.jpg)，1200 × 1200。
- [官方照片 15](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/1198/DK001_main_pictures_15.jpg)，1200 × 1200。

以上公开资料于 2026-10-26 获取并实看。产品标识、官方图像及商标的权利归各自权利人；项目代码的 MIT 许可不重新授权这些素材。

## 接入范围

- 背面：Arduino 标识及制造/认证信息、ON/RST/BOOT。照片印刷 SKU 为 TPX00227，按照片保留，没有用模型目录的 DK001 替换。
- +Y 顶部：WiFi_ANT、ARDUINO.CC、LoRa_ANT、IR；胶片在实测原生 IR 开口处有真实开窗。
- −X 侧：QWIIC 胶片，位于插座下方，不盖住 Qwiic 开口。
- 收纳天线的插头同面：850-960 MHz；该面朝设备内部，当前收纳姿态下被背盖遮住，不能把它贴到背盖外侧。
- 三片外壳标签均为官方照片中清楚可见的独立胶片。原生 CAD 包含其下方的槽/凹字，按连续工厂胶片处理；顶部 IR 窗及背面底部螺丝/接口仍留开。

## 保留边界

认证图形、Arduino 轮廓、字体和灰底是按照片手绘的显示近似。没有加入官方照片未出现的标记。印刷内容不改变连接器种类或已有接口定义。

所有新增层标记 `artworkKind: 'reference-redraw'` 和 `source: 'reference-redraw'`；默认显示，`artwork: false` 关闭。它们继承所属实体，保留原有开孔、显示、接口、按键和已有动作 API，不把印刷文字当作模型电气定义。

局部构造检查覆盖 12 种主机/关闭配置；额外核对 Nesso 顶部原生 IR 开口 1,243 个采样、Core2 EXT 双孔 10 个采样。13 片新图各用 6,241 个 UV 网格点检查，实体孔对应位置允许透明，非透明图案没有采样裁失。上述是几何检查，图片解码和实际外观由浏览器复核，不等于实物或制造验收；不回写历史冻结记录。

## 栅格文件

| 文件 | 像素 | SHA-256 |
| --- | --- | --- |
| `reference-redraw-rear.png` | 2048 × 4077 | `22479a68a3cdced2c04266d55ba8ac45e0681efceecd4b60e0a4b648df733581` |
| `reference-redraw-top.png` | 2048 × 1132 | `3a5e0eaf55ea3ca5ce0ba54586f2348058c66f68a80428699848513deaf98001` |
| `reference-redraw-qwiic.png` | 1536 × 512 | `40b0bd7ee4ae4d72e8e9395cde920b31d89c8c90fcb5d0ba690e0cd2352b86c2` |
| `reference-redraw-antenna.png` | 1536 × 3474 | `e5cd9db9292dde90b4d717cbd149a9bbf4500a0c1d3c6961b7044ab55038c66a` |

原表、私有映射、原始源文件下载索引、绘制生成器、原图与中间材料仅保存在私有目录，不随仓库分发。

2026-10-26 QA 修正：QWIIC 纸底角 alpha 按实际 0.05 mm 胶片圆角处理，仅改底角背景，无字形裁失。
