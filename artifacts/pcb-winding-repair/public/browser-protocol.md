# PCB孔壁修复浏览器复验

完整check/build/status及source/runtime binding通过后，使用CUA控制实际5187（private）或5188（public）页面。默认viewport保持；evaluate只读DOM几何、range值和页面发布的dynamic-state，禁止访问内部对象或赋值。截图API实际返回JPEG：保留原字节，随后将decoded RGB无损装入真PNG。每张记录真实clip、时间、UI步骤与hash；这份自建capture记录不是浏览器原生API trace。

截图前对canvas发Home、读取AX、点击canvas外[15,90]、再读AX。clip为canvas bounding rect加scrollX/Y的document坐标。无手动sleep，依CUA的AX/screenshot内置等待取最终状态。

1. 分别打开thermal/angle/encoder，读stage ready与当前公开状态；实际点击front/back/left/right/top/bottom/iso七视图，各保存一张。每次正常视角按钮会fit，拍摄不另加连接fit。
2. Thermal iso再取一张无输入图；与thermal-iso逐RGB比较，确认没有虚构运动。
3. Angle用实际range键盘调rotation37°，正常iso视角后拍；调回0°并正常iso后拍，与原iso逐RGB相等。
4. Encoder调rotation37°、正常iso后拍；在实际定格检查中选press，点击保持按下拍；弹起后拍，与相同37°未按状态逐RGB相等；rotation回0°并正常iso后拍，与原iso相等。按下图需实际与未按图不同。读取press状态证明压/放。
5. 切StickS3，实际连接HUB到grove。每个目标thermal/angle/encoder分别通过grove/grove-1连接，新模块保持初始状态。正常iso按钮后拍default。
6. 每个目标用实际range键盘Home/End和Arrow改distance110/x50/z14/turn25/tilt-18/slack23，读DOM及dynamic-state验证4芯/2插头与端点位姿。正常left按钮后拍posed。
7. 每个目标点击断开，读无目标cable、HUB三输出仍在、主机按键状态保持。正常left按钮重新fit后拍detached，再继续下一个目标。
8. 保存可得warn/error（最多500条）和最终DOM状态；不声称抓取了浏览器网络事件或所有历史console。另用直接HTTP对服务JS/CSS/HTML/catalog逐字节绑定构建。公开副本独立重复全部步骤，37对稳定图逐RGB比较；差异保留并解释，不改旧图。

固定37图：3产品×7视图＝21；thermal-iso-stable＝1；angle-rotation37/angle-rotation-reset＝2；encoder-rotation37/encoder-rotation37-pressed/encoder-rotation37-released/encoder-rotation-reset＝4；3条StickS3→HUB→Unit的default/posed/detached＝9；共37张。
