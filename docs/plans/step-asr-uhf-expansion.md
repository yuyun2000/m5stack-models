# Step16 / ASR / UHF-RFID

2026-10-26。继续新增三款不同形状的Unit并同步印刷。Step16 U198是16定位BCD旋钮与七段数码管/独立RGB；只外驱真实旋钮及各段/灯，不联动码字或固件。ASR U194是CI-03T、固定模拟麦克风与内置腔体喇叭，按自身原壳补完整封装，不套Module版本。UHF-RFID U107补真实板堆、RF模组/陶瓷天线与Grove；仅视觉锚点，不实现读卡或扫描。

每款使用完整官方原壳，补PCB、封装和真实孔口后方组件。U107优先使用私有表中精确型号原稿导出PNG，Step16/ASR缺源按已授权同型号官图代码重绘并标记reference-redraw。表格、私有链接、矢量原稿/中间件、全部原始来源/生成器留仓库外，公开只最终普通PNG、衍生几何和自写来源/推导说明。

完成条件：三个独立/Grove模型及对应印刷，必要局部结构/API/真实旋钮/七段与RGB独立外驱/贴纸开关/四芯线三分支接线，两个副本窄同步/构建与5188运行资源更新。阶段保持modeled，不逐面浏览器或全量复核，不提交/推送。旧76款、旧43款贴纸复核批、StackChan未解生产装配和私有Scroll检查点不动。


当前检查点（2026-10-26）：

- 三款作者目录和来源/贴纸片段冻结，目录已集成为79款（14主机、65Unit），保持modeled／0 verified。
- 五张最终PNG同步接入：Step16背贴1张参考重绘；ASR正背2张参考重绘；UHF背贴原稿直接栅格1张、正面官图参考重绘1张。各自保留来源类型与artwork:false物理不变边界。
- 公开本批专项 `scripts/check-step-asr-uhf-units.mjs` 已通过，记录在仓库外 `work/new-units-12/grove-check.json`；单品必要结构smoke各自保留。
- 接入指南 `docs/STEP-ASR-UHF-UNITS.md` 已写，README／Agent入口／新增贴纸记录已更新。Step旋钮/段灯独立外驱，ASR不实现识别/音频，UHF不实现读写或RF；三分支HUB仅演示机械装配与寻址。
- 两个副本的窄同步、专项夹具、六个新增导出与构建通过；5188在线79款目录、三个运行chunk及五张PNG与公开dist逐字节一致。472个既有Unit文件、19个core和7个私有Scroll/WIP文件指纹保持，新增目录/研究两副本一致，六条新增catalog/manifest记录与PNG隐私检查通过。
- 最终本地记录为 `artifacts/step-asr-uhf-expansion/progress.json`，本地增量索引现14批。不恢复浏览器逐面或历史全量复核，不提交推送；整体goal保持active，StackChan生产装配基准仍缺。
