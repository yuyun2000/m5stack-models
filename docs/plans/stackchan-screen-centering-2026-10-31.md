# StackChan 屏幕居中修订 · 2026-10-31

目标：修复用户指出的 K151 屏幕偏上，使有效显示区、局部玻璃与 LCD 背板共同对齐头部正面中心。用户于 2026-10-31 追加“同步到git”，本轮提交推送范围限于此修订和独立验证证据；现有 Pages 工作流随 main 推送自动运行。

依据：2026-10-31 官方 MCP `knowledge_search` 已查询 StackChan 结构与尺寸；官方 [产品页](https://docs.m5stack.com/en/StackChan)、[三视图](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/1205/Model_Size.png) 的正视图，以及自身产品照片。正视图中显示区与 54 mm 方形头部基本居中；该中心是图像配准依据，并非独立标注的面板机械尺寸。

已复现：StackChan 的头部中心 Y=8.25 mm；复用 CoreS3 当前显示区偏移 +5.8 mm 后，LCD 中心成为 Y=14.05 mm，上下边距分别约 5.96 / 17.56 mm。

步骤与完成条件：

1. 保存两副本相关运行时文件原字节及修订前正视图。
2. 将屏幕中心设为 StackChan 自身参数；让屏幕、玻璃与背板采用相同中心，保留 CoreS3 默认参数与既有接口。
3. 检查实际网格位置、触控拾取、不同 yaw/pitch 姿态，以及现有 StackChan 装配专项；构建并检查本地浏览器正视、立体与转动结果。
4. 新证据独立保存；检查精确 diff 与素材/凭据范围。既有机械装配未闭合项不由本次屏幕修订关闭，产品阶段保持 modeled。

状态：本地修订与验证完成。屏幕、玻璃与背板共同下移 5.8 mm，LCD 中心 Y=8.25 mm，上下边距各 11.76 mm。

验证：两副本各 15 组姿态、135 条实际屏面首命中射线及 135 次触控事件映射检查通过；CoreS3 单体和 DinBase 的默认偏移保持原值。既有 StackChan 装配检查各通过 95 组姿态；两副本构建通过。实际本地生产浏览器已检查正视、校准图、pitch45/yaw35 立体姿态，真实鼠标点击生成 lcd start/end；未见 console error/warn。

独立证据：[检查记录](../../artifacts/stackchan-screen-centering-2026-10-31/checks.json)、[前后对比](../../artifacts/stackchan-screen-centering-2026-10-31/front-comparison.png)、[校准图](../../artifacts/stackchan-screen-centering-2026-10-31/after-calibration.png)、[转动姿态](../../artifacts/stackchan-screen-centering-2026-10-31/after-pitch45-yaw35.png)。检查记录是提交前的本地验证快照；部署状态以本次提交触发的 [GitHub Actions](https://github.com/yuyun2000/m5stack-models/actions/workflows/pages.yml) 为准，产品阶段不变。
