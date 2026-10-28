# StickT2编码器接收壳修订（2026-10-28）

这是初次冻结之后的独立修订，保留原[checks.json](checks.json)、原生面账本与作者初次freeze，不把旧成功记录改写成当前验收。当前数值见[修订检查](encoder-receiver-amendment-2026-10-28.json)。本款继续为`modeled`。

## 触发与原因

集成浏览器右视图发现编码器上、下沿白片。CPU首交用同一区域24条射线复现：18条碰到银色电池包、3条到达远侧后壳、3条完全没有材料。因此这些白片不具有已核实的量产白色encoder物件依据；旧8.2×8.2mm固定包体没有承接较长的本款原生开口。

本款[原生结构](native-source.json)及[官方自身侧视](https://static-cdn.m5stack.com/resource/docs/products/core/m5stickt/m5stickt_05.webp)作为定位依据。官方2021修订提到减小编码器轮，原生源未注明对应修订；隐藏接收件的具体BOM仍缺失，本修订属于有边界的视觉装配推导。

## 本次改变

只替换固定encoder包体为有实际厚度的闭合黑色接收壳，14.4×9.5×1.3mm，带半径1.32mm的贯通轴孔和0.16mm厚深止挡。圆角外壁、孔壁、正反材料面与止挡均为实体FrontSide几何，没有用黑平面或双面材质遮盖。新增部分随主机固定，不跟随按压或转动。

原生壳体position/normal/index/sourceFaceIndex/sourceAttributeWord、轮帽/滚花/轴、活动行程、组件及输入API保持。真实移动轴进入孔内，并保留约0.17mm径向净隙；全压时轴末端距止挡约0.84mm。接收件与电池包和PCB的当前数字最小分隔分别约0.09、0.10mm。尺寸与安装均明确为本款开口/照片推导，不代表生产公差、材料力学或实物配合。

## 当前验证

```sh
node scripts/check-stickt2-encoder-receiver.mjs
node scripts/check-stickt2-controller.mjs
```

新专项检查2个闭合正体积实体、四面真实轴孔/深止挡，2个主机姿态×4种按键状态×3个轮角，共576条原白片/透背景点首交全部为近侧接收壳。全物理属性/index/world证明固定接收壳在三主键/轴按压及轮旋转期间保持；几何测量证明径向/轴向/电池/PCB净隙为正，回零原生数组仍等于源摘要。

既有完整控制专项按当前代码重跑通过，新增闭合实体为104，144真实Viewer拾取、24取消、两姿态轮圈拖转、framebuffer、Grove四芯双插头、真实timer与资源释放继续通过。当前每实例154个资源均释放。上述仍是CPU与GPU/DOM边界夹具证据，浏览器修复后像素由根集成重建另验；不提升verified。
