# Atom VoiceS3R (Atom EchoS3R) / C126-ECHO 建模记录

本实现是本款独立 `Model`，底层为 Device；入口导出 `Model/spec/defaults/configurations/configurationSchema`，默认导出同一个 Model。`modeled`，视觉验收字段保持空。

## 来源与原生面

[本款官方文档](https://docs.m5stack.com/en/core/Atom_VoiceS3R)、本款官方多视图与固定 M5_Hardware 提交 `e29c139cbc7c80b5ccc5557e5ab8025a7a19a109`。CAD SHA256 `3db4d3fbf54121f74eaacb2f7c85cc4611a98f39a55927f07ed625b4b5e2c51b`。本款原稿与另一 Voice 款的公开 CAD 相同 blob，这一事实不用于推定电子、引脚、颜色或印刷相同。

11284 原面全部有账：2058–4115 是2058面后壳，7700–11283 是3584面前壳；0–2057 与4116–7699 是5642面重复装配预览。实际两壳保留源 position、stored normal、源面ID、attribute word 与顺序索引，仅刚性平移、无缩放/裁面/简化。预览逐面对应见 `duplicate-preview-map.json`：最大位置残差0.000005723mm，496面的stored normal有微差，未替换实际源法线。

## 完整实体与动作

真实前后闭壳、PCB及其支承、排母厚壁/九个独立井/十八簧片/深止挡、USB-C金属厚壳/舌/24接点/24端子/2固定脚、Grove4针/锁扣/深止挡、M2原生孔及盲底留在实际装配。扬声器有实体厚壁音腔、腔底、磁体、真实薄振膜；麦克风有开放拾音管和深处被动封装。IR仅被动外形。内部布局、支承和行程为本款多视图约束下的原创视觉推导，未声称制造或电气精度。

主键按自身U槽连通图隔离198个源顶点/1160个位置记录，包含内外面与原生推杆；根位于原始Y=10。Reset隔离107个源顶点/624记录，根原始Z=1.7。只这些源顶点与各自真实随动件运动；源面/索引/attribute word不动，归零恢复position/normal原字节。随动件锚定实际内壁三角形重心权重；主键内壁间隙0.05mm，Reset0.042mm。两键长按计时关闭，取消压制click；不会自动触发音频、RGB、重启或复位。

本款无RGB组件。固件下载状态灯仅为被动封装；用户键G41、IR G47、Grove G2/G1，主控及音频为本款S3R版本。

## 印刷与验证

两张完整平面普通PNG保留原像素，仅提取完整标签区并剥离说明箭头/排版标题，未裁切产品照片、未分发矢量/私表/私有映射。包装卡、封口标和care图不是机身贴纸，未硬贴。背膜默认按官图完整覆盖黄色M2记号；`labelPierced:true`仅打开物理贴膜供安装；`artwork:false`只去墨。

`node scripts/check-atom-echos3r-controller.mjs` 实跑通过：原生字节/面账、160个闭合FrontSide实体/25938面、两舌partial/full/rest的内外首交射线与固定邻区、九井×四壁、音孔到振膜及麦克风/IR通道、独立输入与输出、变父后的Hub/Button/Fan层级与56个真实线端、去墨动作与连线一致、自然click计时及销毁取消、336个附着资源各释放一次。CPU canvas stub只供外驱LED构造，不当GPU证据。构建、共享接入和实际浏览器验收由根集成执行；音频/电气/固件/实机未验证。
