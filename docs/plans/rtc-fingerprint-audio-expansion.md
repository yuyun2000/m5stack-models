# RTC / Fingerprint2 / AudioPlayer

2026-10-26。继续其他Unit，使用各型号官方结构，补真实器件和插座。

RTC U126为HYM8563与内置纽扣电池，保留封闭壳；无来源支持的电池拆卸不造接口。Fingerprint2 U203为电容指纹采集面与RGB灯环、蓝色电源灯。AudioPlayer U197为N9301、microSD、3.5mm插座和蓝BUSY灯，未添加原本不存在的播放按键。

只负责实体、外部灯光与有明确依据的触控意图；不实现时钟、识别/数据库、音频解码/播放、文件系统、串口或电气。原稿/来源二进制/生成器仅仓库外，公开衍生几何、自写来源和必要smoke。

完成条件：三个独立/Grove模型、来源和推导限制、局部结构/API smoke、实际三分支接线、构建及本地预览。按用户要求不逐面浏览器复核、不运行历史最终器/全量验收，阶段保持modeled；旧贴纸/StackChan/私有Scroll保留检查点。

已接入：14主机+56 Unit，共70 modeled/0 verified。三款局部smoke、实际三分支接线/插座类型/灯光与运行时边界夹具、两个副本构建及5188字节检查通过；未做逐面浏览器或全量复核，未提交/推送。公开记录：`artifacts/rtc-fingerprint-audio-expansion/progress.json`。
