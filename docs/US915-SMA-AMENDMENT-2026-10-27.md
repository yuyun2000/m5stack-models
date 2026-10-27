# US915 SMA 独立更正（2026-10-27）

US915自身[官方近照10.webp](https://m5stack.oss-cn-shenzhen.aliyuncs.com/resource/docs/products/unit/Unit%20LoRaWAN-US915/10.webp)清楚显示中央实心金属凸针，纠正51批旧空心本体接点推导。图SHA256为 `0ca652d373ab43778f500f3b5b2f598104f60fcdb52fb46fe8039da7b822b721`，详情见[自身来源与推导边界](research/lorawan-us915/sources.json)和[当前建模说明](research/lorawan-us915/modeling.md)；没有借AS923/EU868照片或尺寸。

本体使用实际实心针、后退介质和支承基底；附件内部受针腔、真实深止挡及保持介质属于不可见内部的互补推导。精确尺寸、SMA/RP-SMA极性、螺纹与生产fit未确认。内部旧 `.pin` 属性保留为 `receiver` 别名；导出、组件/端口/配置、fold和Grove API保持。

两个仓库的实际文件均已通过 `node scripts/check-lorawan-us915-sma-amendment.mjs`，没有source loader或候选覆盖。证据为[当前实际无loader receipt](research/lorawan-us915/sma-amendment-2026-10-27-smoke.json)：Model/GroveModule×3配置共6case、部分fold去墨全attributes/index/world、变父StickS3→HUB第3路四芯、固定件/peer/framebuffer/noecho、拆装与disposal，以及闭合正体积FrontSide、实心针/受针腔/止挡和正间隙射线。当前本体236实体/39412面，附件48实体/5588面。实际针腔轴向重叠约0.9mm、径向间隙约0.06007mm；全部是展示推导，不是制造公差。

构建与最终证据见[当前双仓专项及最终证据 progress](../artifacts/us915-sma-amendment-2026-10-27/progress.json)。此说明仅确认实际专项通过，不预先声明build或最终全pass，也不代表浏览器/GPU、实物、BOM、电气或射频验收。

旧证据保留：[旧 smoke（历史快照）](research/lorawan-us915/smoke.json)及[51批历史 progress](../artifacts/cardkboriginal-poecamoriginal-lorawanus915-expansion/progress.json)描述51批保存时快照，不能用来证明更正后的当前中心接点。51/52原helper/freeze/progress和52固定保护基线未改，未重跑历史suite或旧最终器。原native全部源属性/索引/sourceFaceIndex、两张PNG、framework/API与其余产品保持；本更正没有新增贴纸、型号或硬件能力。

| Runtime文件 | 51批历史SHA256 | 当前SHA256 |
| --- | --- | --- |
| `assembly.js` | `4ba69126d8b070553f4868384fbe0b50a9fc3fe43bac6f6b5c6ee35973cc343c` | `e384c40ed6bef5688615836009db859dc3e8210f4268baeee1c41b2e0882d7f8` |
| `Antenna.js` | `5213dba1210bf87091474454aaf6c381c26f74ff6c65912ee9202898c7252da6` | `ddeedd3ee121504132fa7e584bde46c1f558c5c55ae72026603b5495c1db39e3` |

当前manifest/catalog/provenance改指新receipt；旧smoke和历史progress不覆盖。专项入口为 `scripts/check-lorawan-us915-sma-amendment.mjs`；当前装配fixture只替换 `scripts/check-cardkboriginal-poecamoriginal-lorawanus915-units.mjs` 的US915 helper块，其余Unit/shared检查保持。
