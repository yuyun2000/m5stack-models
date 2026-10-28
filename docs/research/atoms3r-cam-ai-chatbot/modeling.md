# AtomS3R-CAM AI Chatbot / K147-CAM

2026-10-28。官方Atom系列中具独立SKU的完整套装，状态 `modeled`。本款组合[实际 atoms3r-cam 控制器](../../../src/devices/atoms3r-cam/index.js)与Atomic Voice Base A149。实际输入/输出与控制器保持一致，不把“AI Chatbot”名称转成未实现的音频、云服务或AI仿真。

## 来源和机械装配

使用[本款官方页](https://docs.m5stack.com/en/core/AtomS3R-CAM_AI_Chatbot)及[自身套装STL](https://raw.githubusercontent.com/m5stack/M5_Hardware/e29c139cbc7c80b5ccc5557e5ab8025a7a19a109/Products/K147-CAM_AtomS3R-CAM_AI_Chatbot/Structures/AtomS3R-CAM_AI_Chatbot.stl)，固定commit `e29c139cbc7c80b5ccc5557e5ab8025a7a19a109`，Git blob与SHA均已核。自身底座source position/normal/index/sourceFaceIndex/sourceAttributeWord保持字节，只有独立物件刚性平移。其余来源面在[native-map.json](native-map.json)逐组件记账：主机/散开展示件由实际产品实现承担，不重复渲染。没有把整体装配缩成壳体厚度。

[官方底座尺寸图](https://m5stack.oss-cn-shenzhen.aliyuncs.com/resource/docs/products/atom/Atomic%20Echo%20Base/model%20size.jpg)明确壳体10mm、含插针14.14mm；完整插接时增加10mm外露壳深。九根2.54mm接点随底座，5P外露插孔有实体孔壁、止挡与弹片。PCB、喇叭腔、麦克风和固定支承填充实际底座开口。藏于插接区的针尖/孔深为视觉推导，不声称制造配合。

## 贴纸和API

[artwork.json](artwork.json)注册三张批准普通PNG：底部、MIC侧和前部Voice Base标签；私表、矢量、原名、私URL及生成材料均不进入分发树。旧套装官图显示Echo Base字样，本次使用用户提供的当前Voice Base印刷修订，明确保留版本差异。`artwork:false`只去墨，薄膜、壳体和接点都保留。

`Model`、`spec`、`defaults`、`configurations`、`configurationSchema`均从自身入口导出。按键提供输入意图，现有屏/灯接受外部命令；Grove可连接真实Unit，`voice-base-ext`仅声明可见物理接口。相机/音频/AI/固件/电气能力不由模型生成。

专项：`node scripts/check-atoms3r-cam-ai-chatbot-controller.mjs`，检查本款原生数组、全来源面记账、169条底部首交、九针、全部按键部分/全按/多源取消与回零、底座固定、去墨结构不变、外驱输出不回声与实例隔离。共享目录、连接和demo检查由整批执行；浏览器证据另存。产品仍为modeled，CPU检查不替代实物或制造验收。


## 底座插接与内部避让修正

官方4.14mm为未装配突出尺寸。本装配保留4.14mm金属针体，其中一部分埋入底座；实际插入量按当前真实母座止挡推导，本款为 2mm，9根针尖与实际止挡首交均留约0.20mm正间隙。音频PCB按自身角柱作四角避让并保留9个针孔；CAM自身额外顶盖下移PCB并添加隐藏焊接尾段。2014喇叭保留20×14mm前框，后声腔单独圆角重建。各补件顶点/面心按3方向奇偶采样，未进入本款原生底座；该检查为采样证据，隐藏尺寸仍为视觉推导。

底部外露5P连接器按自身约11mm窗口/官图推导2.0mm节距和10.5mm壳长，端部不穿壳；它与主机九根2.54mm插针分别建模。未取得该外露连接器额定节距/制造图，meta明确标注推断，不作为电气接口承诺。
