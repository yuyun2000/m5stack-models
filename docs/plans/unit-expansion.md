# 新增 Unit：GPS v1.1、Weight-I2C、8Servos

2026-10-26 用户要求停止耗时复核、继续其他 Unit。目标是在既有浏览器和 Grove 视觉模块 API 中提供三款可用模型。

1. 读取精确型号官方产品资料与机械文件，记录尺寸、SKU、装配坐标和推导项。
2. 按既有 CADUnit/Component 接口实现外壳、PCB、连接座和主要可见封装，保留真实孔与开口后的内部实体。
3. 加入 catalog、懒加载、公共导出和演示选择；只做本批必要的实例化、有限开口/孔位与 Grove 装配检查，再构建并检查预览就绪。
4. 保持 modeled；本轮不做全库逐面浏览器复核，不声称实物/电气验证，不发布私有素材。

现有贴纸重绘保留，CSV/矢量/映射/中间材料继续在仓库外私有保存。旧 Scroll 结构 WIP 不并入本批。

进度：三款已实现并接入，基础 `node scripts/check.mjs` 及 build 通过，预览5188健康；本轮未做逐面浏览器验收。记录为 `artifacts/unit-expansion/progress.json`。三款贴纸、Weight-I2C/8Servos随附可拔插端子附件后置；固定座、腔体和接触针已实现。
