# UnitV-M12 U078-V-M12

本款独立使用M5_Hardware自有MIT STL两片闭合壳件与本款尺寸/照片，未借U078-C UnitV-OV7740或U078-M12 UnitV2-M12结构、贴纸或动作。全MIT许可已存在licenses/M5_Hardware-MIT.txt，SHA与官方原文一致；THIRD_PARTY_NOTICES.md保既有M5Stack归属。

## 原生面与装配

原STL9020面包含4510面装配总件及2850/1660面横向分置壳半。装配总件坐标焊接后有6条非两面边，不作为单一实体，也不删面修补。选择两个自身闭合半件，分别rawX平移至共同minX=4.563112735748291，保rawY/rawZ原装配关系和全部2850+1660原面/角序。proper frame为x=rawX+partShift−16.56311273574829，y=−rawZ−20，z=rawY−6.35，det=+1、scale=1；对应每原始triangle/corner的索引与变换见runtime native-map.json。

原生壳包络24.0000038×40×12.6999998 mm，未拉伸；宽末位是原STL单精度。官方40×24×16.4名义含突出镜头。补镜头前apex z10.05，后膜0.04mm从壳背−6.35延至−6.39，因此最终物理包络24.0000038×40.0000000×16.4400002 mm；明确分记膜厚推导，不把源97.09mm横排宽当整机。两Ø4.85原生安装孔中心±8/y−8.2、横距16/距底11.8全部保留。

银色CNC前壳和青色后盖/自身原生M5细部保全；实际M12黑筒、肩座跨接自身7.1mm光学孔、压圈、闭合曲面深色玻璃、光学内锥/深止挡、OV7740物理包体/子板与主板固定支撑补齐，镜头不是图片平面。自身照片所见M12外筒直径14mm。玻璃曲率/层厚、隐藏PCB/芯片/被动件、包体和安装/配合均为外观推导，非制造验证。玻璃是被动光学实体；camera仅Component视觉锚点，不是显示、视频帧或AI采集输出。官方写可换M12镜头，但未确认本款手动调焦机构/行程，故无镜头关节、自动调焦或固定筒旋转。

单白色HY2.0-4P具实腔壁/底/后壁/导轨与4金属触点/弯回脚/焊盘；底端USB-C保真实开放金属壳、深介质后板、舌片和24接点；上端microSD保真实空槽/地板/金属顶与侧壁/深止挡/9弹片和固定支撑，不预装卡。不用PNG盖缺件。主板为带真实安装/螺钉孔的闭合PCB；K210/16M身份来自本款官方资料，隐藏器件封装和位置仅推导，不宣称完整BOM。G8电路RGB说明不能证明本款外灯光路，未新增LED API。

## 两个真实侧帽

本款青侧帽是后壳一体舌片，不能拆造平移整块壳。buttonA在−X/G19，buttonB在+X/G18，与后视标签A右/B左一致。NativeSideCap保后壳全部1660面，按自身cap/桥区顶点absX≥10.29、y∈[−16.501,−12.699]、z∈(−3.15,0.151]计算t=(z+3.15)/3.3及平滑权重t²(3−2t)。只使该区沿X内压，A172/B171个重复分面vertex；原生两区不重叠，固定其余壳顶点/板/口/开关包体。

0.18mm是推导外观行程，不是材料力学或机械极限。真实小plunger在Button.cap下随动；固定frame/base/body/lid/terminals保持。control.shell/rest/norm/weights/slopes/affectedIndices记录原生mesh及原始位置/法线/权重；按放/cancel中立精确恢复原位置和法线字节。不可用rigid shell检查迫使真实舌片改形。

## API与印刷

导出Model、GroveModule、spec、configurations、defaults、configurationSchema，默认Model。body组件顺序grove,usb,sd,buttonA,buttonB,camera；Module追加unitFrame,cable。canonical grove仅是真实机械四芯HY2.0家族，不实现UART/I2C/USB/电气/存储/相机/AI/固件。camera只被动anchor。Model键A/B分别映射buttonA/B；既有多源momentary press/release/cancel/click/state及down/up/click/longpress，取消抑制click。无LED、display、speaker、sensor输出、joint或附件。配置仅{id:'assembled',name:'完整 M12 光学装配',options:{}}，defaults/schema空。

两张自身官图代码重绘普通PNG同步完成，后膜UNITV M12/K210/相机/存储/GPIO/接口可读标，正面M5落实际CNC载体，不添前胶膜。原图不裁切，变量QR/SN和不可辨微字不编造。字体、图形、颜色和定位为照片重绘推断，详artwork.json。矢量/生成器/原STL/官图及私表留分发树外。

## 必要验证

单品CPU smoke pass：152正体积闭合有向两面边实体/FrontSide、4510原面逐源角序/坐标对应、真实孔轴/内壁和光学孔/玻璃/止挡、4/24/9真实接点、两原生帽多源按放/取消/中立位置法线精确恢复/固定件、两入口去墨全部物理attributes/index/world相同、变父pose四芯/嵌套装拆/peer独立/dispose。两PNG已解码目视。未运行浏览器/GPU/build或实物制造fit；stage modeled，非verified。
