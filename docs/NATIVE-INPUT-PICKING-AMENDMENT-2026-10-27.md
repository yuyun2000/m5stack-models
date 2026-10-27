# Atom原生活动面点击修订

2026-10-27。修订基线为 `8324228c8fd8702da32623ebd62af4b3bb4d0cbd`。范围是现有Atom Lite、原Atom Matrix、AtomS3 Lite的输入拾取，不增加型号、不修改CAD、实体形状、变形权重、按程、贴纸或输入/外驱语义。

## 触发与结果

原检查覆盖主机按放几何及可见帽中心，但三个原生弹舌实现只给较小的透明平面绑定按键。实际可见活动面超出平面，或位于平面之前时，查看器首先命中未绑定的原生壳面，点击会进入旋转而不发按键事件。

受影响区域为Atom Lite主键/Reset、原Matrix Reset、AtomS3 Lite主键/Reset。真实生产网页中，Atom Lite正面主键边缘点击无输入，中心点击正常；Node真实拾取也复现了活动源面上132个漏点。

修复保留原透明代理，同时让真实活动源面接收输入。固定壳体继续用于旋转和遮挡，不能把整半壳变成按钮，也不能从被拒绝的前方壳面穿透点击后方控件。

## 实现与复用

[Component.hit](../src/core/Component.js)增加可选筛选函数，原单参数调用保持原行为：

```js
component.hit(mesh);                         // 原有完整目标
component.hit(sharedMesh, intersection => { // 只接受命中的实际活动区域
  return isInteractiveRegion(intersection);
});
```

`isInteractiveRegion`由模型作者提供。查看器对首个可见实际交点逐级查找组件；筛选拒绝时可继续查该物件的祖先，但不会穿透这块实体寻找后方控件。筛选函数须按命中物件自身的面索引解释数据；投射印刷子网格的面索引不能直接套到父原壳。

[weighted-input](../src/modeling/weighted-input.js)供这三款内部复用：校验命中确属本款原壳及真实三角面，使用当前顶点和世界命中点计算局部重心坐标，对已有变形权重插值，超过数值噪声阈值才接收。它不分割、复制、偏移或重建物理网格，也不改动按放实现。

绑定可位于组件自己的Object3D之外。组件销毁时只移除自己仍持有的点击登记，保留原壳与后来的新owner；普通unmount/reattach继续保留登记。外部框架仍使用原有按键ID、事件和取消API，无需读取变形权重或处理命中筛选。

## 验证与历史

```sh
npm run check:input-picking
npm run check:controllers
npm run check:demo
node scripts/check-viewer-lifecycle.mjs
```

新原生拾取专项使用真实`DeviceViewer.pick`与指针分发，GPU和DOM是边界fixture：280项包括168活动区域、88固定邻区、24移除Reset后的检查；覆盖rest/partial/full/returned和模型旋转，另有42次实际指针路由及外来印刷面索引拒绝。核心专项覆盖旧无筛选调用、祖先回退、前壳遮挡、参数原子性、外部目标销毁、owner替换和unmount/reattach。

四状态原生网格的全部attribute/index指纹与修前逐项一致。原53批freeze/smoke、Matrix Reset修订及旧检查快照保持；`source-manifest.json`仅更新这三款当前NativeButton指纹，并新增独立`inputPickingAmendment`绑定共享源码和本次记录。

生产预览页完成实际鼠标验证：上述5处活动面均触发down/up/click，固定邻壳不触发按键；Atom Lite保持按下显示0.180mm，释放后回到0.000mm。Matrix连接Fan后四芯线和两端插头可见，240rpm时叶片连续转动，停止后回到0°/0rpm，断开再连接正常；控制台没有error。这些操作仅覆盖本次场景，不代表全部201款逐面视觉验收。示例：[运行中](../artifacts/native-input-picking-2026-10-27/grove-fan-running.jpg)、[停止后](../artifacts/native-input-picking-2026-10-27/grove-fan-stopped.jpg)。

本次结果及真实网页操作见[当前检查记录](../artifacts/native-input-picking-2026-10-27/checks.json)。当前已知StackChan包装残余独立保留，见[动态检查与未闭合项](plans/existing-dynamics-audit.md)。这些输入修复和CPU检查不提升产品的`verified`阶段，也不代表硬件复位、固件执行或制造验收。
