# StackChan 运动坐标来源续查

2026-10-26。本轮按用户要求停止逐面复核，只补有界公开来源查询。没有修改模型几何、装配变换或 `fit-unresolved` 状态。

先检索 M5Stack 官方知识库，关键词包括 K151、K151-R、A180、生产舵机 BOM、STEP、ServoBody、bearing fixture 与 pitch 轴向座。检索成功，返回的机械入口仍是十份结构 STL 和 SCS0009 数据手册；新增原理图说明也没有将具体舵机壳体变体绑定到生产 BOM，未给出安装座面或轴向尺寸链。此前机械资料缺失反馈已经覆盖此问题，本轮未重复提交。

随后只查三个官方 GitHub 入口，均实际 HTTP 200：

| 入口 | 本轮结果 | 能支持的结论 |
| --- | --- | --- |
| [m5stack 组织的 StackChan 仓库发现](https://api.github.com/search/repositories?q=stackchan+org%3Am5stack&sort=updated&order=desc&per_page=30) | 仅返回已知的 StackChan、StackChan-BSP；两仓 pushed_at 分别为 2026-10-22、2026-10-21 | 未发现新的同名官方装配仓库；仓库 updated_at 不能作为机械资料更新依据 |
| [K151 目录最近提交](https://api.github.com/repos/m5stack/M5_Hardware/commits?path=Products%2FK151_StackChan&per_page=1) | 仍为 [70fb127275ef0e2da21218d1f01cd305754d35fa](https://github.com/m5stack/M5_Hardware/commit/70fb127275ef0e2da21218d1f01cd305754d35fa)，2026-05-25 | 该路径未提供晚于既有研究的新提交；未重新下载或遍历旧 STL |
| [官方组织中的 StackChan assembly issue/PR 发现](https://api.github.com/search/issues?q=org%3Am5stack%20stackchan%20assembly&sort=updated&order=desc&per_page=10) | 返回 [esphome-yaml PR #73](https://github.com/m5stack/esphome-yaml/pull/73)，已于 2026-04-28 合并 | 得到一个此前未记录的软件校准来源，不是机械装配图 |

## 新线索：软件角度零位

PR #73 的合并提交是 `e4513556d5741832c990d0b7f8c775bbd934e8b9`。本轮实际读取 [PR 元数据](https://api.github.com/repos/m5stack/esphome-yaml/pulls/73)及 [变更文件](https://api.github.com/repos/m5stack/esphome-yaml/pulls/73/files)。它修改 `common/stackchan-voice-assistant-base.yaml`，将 Y 轴 `angle_offset` 从 `50` 改为 `239`，反馈换算由 `(x - 133.0f) * 0.337f` 改为 `x * 0.3333f - 226.67f`，与该项目的 kit BSP 配置对齐。X 轴校准保持原值。

该变更同时明确允许用户因机械装配零位不同而覆盖校准值。PR 中配置校验与实体烧录测试框均未勾选；合并本身不能证明所有量产版本具有同一机械零位。本轮读取的是固定 PR 变更，未宣称已核当前默认分支或真实硬件。

这些数值可作为外部 ESPHome 适配器理解其软件角度的参考，不能直接作为本模型 yaw/pitch 刚体变换。它没有给出舵机安装耳、输出轴座、head/cradle 对位、右侧 fixture/bearing 或 lower yaw/base 的尺寸和方向，也不能证明 `239` 是世界坐标中的头部角度。因此本轮没有据此改变视觉轴位、默认姿态或机械限位。

## 结论与边界

本轮新增了可追溯的软件校准线索，未取得能支持具体生产装配 transform 的新 datum。生产舵机变体、pitch 轴向座及紧固栈、右侧 bearing/fixture 身份与止口、lower yaw/base 定位链仍未闭合，继续保持 `fit-unresolved`。

本轮没有启动浏览器、重扫旧照片或批量观看视频。原始接口响应及工具日志仅供本地研究，公开仓库只包含这份自写摘要和公开来源链接。有限查询未命中不等于证明所有官方渠道均不存在资料。
