# M5Camera-X U038

自身官方MIT结构3194+1584闭合半壳复位共同raw minX−12，保rawY/Z和4778全部面及角序。combined4778有1条非两面边，不删面修补、不消费该combined件。proper frame:x=−(rawX+partShift),y=rawY−70,z=0.9−rawZ，det+1/scale1；逐源triangle/corner对应见runtime native-map.json。MIT全文/已有M5_Hardware notices保留。没有借TimerCamera-X/F或其他SKU几何。

自身native壳24×48×13.1999998mm，网页名义24×48×13分记；网页错挂U082-X尺寸图明确排除，官方反馈1a99ea3bfd8f4747acd88a18696d891b已接收。真实光学补到z8.1，含镜头默认实体包络24×48×14.7000003mm，不能静默压壳/镜头凑名义13。镜头尺寸/玻璃曲率/安装、隐藏PCB/器件和所有接收口细部均明示外观推导，非量产fit或完整BOM。

## 结构与真实侧RESET

保白壳全部自身M5压纹/原生窗和孔；main PCB闭合带真实固定孔，ESP32-Wrover/CP2104身份据本款官方资料，隐藏封装/位置仅推导。OV2640子板以四实柱接主板，实际传感包体/24针FPC座/尾片、自身Ø8原生喉口/Ø9.4外口内的黑筒与前挡肩、实际小黑镜头筒/握齿、闭合曲面玻璃和深止挡补齐，光学不是图片。HY2.0具真实侧壁/地板/深背壁/导轨和4触点/弯回脚/焊盘；USB-C保真实开放金属壳、介质后壁/舌片/24触点和实际PCB端脚/固定脚。原生正常通风/工具孔后有实际PCB/内部实体，不添贴片掩盖缺件。

RESET是本款front壳左侧一体舌片，不是拆出来平移的白方块。只变形自身x≤−10.29,y∈[−16.41,−12.59],z∈[−1.501,4.4)的176分面vertex。t=clamp((4.4−z)/5.9)，w=t²(3−2t)，自由端内压0.18mm；安装轴+X，行程仅外观推断。真实小柱塞在body下按自身接触高度权重0.4618972728随动；固定switch frame/base/body/lid/terminals和板/口/后壳不动。Button.cap仅透明输入proxy随行程；真实material由原生舌片与实际柱塞承担。rest/norm/weights/slopes/affectedIndices保control上，cancel中立恢复原位置/法线/索引字节。

未装MIC/BME280/MPU6050不造包体/输出；GPIO14文字不能当实际外灯证据，因此0LED。相机只被动Component anchor，无capture/display/video/AI/USB电气、WiFi或固件行为，无镜头关节或自动调焦。

## 光学内颈与原壳配合修正

实测自身源面并非全程Ø9.4通孔：z4.9..5.9处为名义r4.0多边形喉口，z5.9..6.6倒角张开至r4.7外口。原先外观推导的r4.65内筒和z6.4..6.65肩座会进入这段原壳实体，因此只修隐藏配合：内颈改r3.85、z2.7..6.6；肩座外径r4.8不变，实体改为z6.6..6.65薄前lip，可见顶面仍6.65。内颈从真实sensor顶面连续接到lip，lip再接原knob；不裁原壳面、不改玻璃/knob、不靠贴片补空隙。内颈/薄lip尺寸是由自身原面推导的外观装配量，不是官方量产公差。

全部38个原生竖直喉口三角面的投影边界最小半径3.9389996157mm；当前内颈全部顶点最大半径3.8500000584mm，给出全角保守径向间隙下界0.0889995573mm。另按24角×6层（z4.95/5.25/5.85/6.05/6.3/6.55）从真实空气区间对source wall与neck射线，144处实测最小0.0924699913mm；每条源孔壁命中均按实际三角面平面核对，未假定理想圆。24角前lip底与自身原壳外表面差约9.54e−8mm，仅Float32量级；lip不进入native材料。原4778面及角序、237闭合实体、14.7000003总深、API/RESET/端口/附件/0PNG均不变。own smoke及带真实Wall1515的Model、StickS3→HUB第1路真实LEGO/变父pose同步helper检查均pass；这次只验证该光学配合，不宣称整机碰撞审查或量产fit。

## 自身安装附件身份修订

44预检把2150叫LEGO、1966叫Wall1515，与自身02整图文字/形状相反。本款按自身02的LEGO旁横向双外耳孔/中央长方孔匹配1966面40×28×8.4mm件；WALL /1515旁纵向两个中心孔/长侧槽匹配2150面26.7039×37.9327×10.6mm件。整图SHA/标注及源component3/2见native-map；own work保accessory-identity.json供核对。只纠正身份，原面/几何不改，冻结预检不回写。

LEGO component3自身原生已在本款共同坐标，保rawXYZ；Wall1515 component2仅rawX平移47.1921424866，匹配本款两附件共同夹面modelX约−12.1352/+12.2646，保rawYZ。安装为静态外观fit推断，不是量产扣合力或额定容差。mount位置[0,0,−6.6]，accessory frame在Port中rotationX=π/2、position[0,−6.6,0]复现自身形状。保一个实际夹件/adapter，另一1966横排副本排除。

## 实际API、配置与0PNG

导出Model/GroveModule/LegoClip/Wall1515/spec/defaults/configurationSchema/configurations，默认Model。body顺序grove,usb,reset,camera,mount，GroveModule追加unitFrame/cable。canonical真实grove，USB家族usb-c，mount为m5.m5camera-x.rear-mount。reset既有多源press/release/cancel/click/state与down/up/click/longpress；Model键R。camera无输入/空state；无LED/display/speaker/sensor/joint。

mount选none/lego/wall1515，默认none；真实preset数组complete/lego/wall1515，配置options分别{mount:'none'/'lego'/'wall1515'}。LegoClip/Wall1515为静态Module，m5CameraXAccessory含kind/frame/parts/nativeMesh，无内部组件或关节，可独立detach/reattach。带LEGO整机包络40×48×16.1mm，带Wall1515约26.7039×48×18.3000mm；含Grove线缆包络单独记smoke，不当整机尺寸。

自身白壳只有无色native M5压纹，保几何；**0PNG是实际载体判断，不是缺原稿延期**。artwork.json明确assets=[]/pngCount0/physicalFilms0。没有白墨、假后膜、1px占位或裁照片。宣传箭头/包装纸不贴到壳。两入口所有3配置artwork:false仍检查全物理attributes/index/world相同。

必要CPU smoke pass：237正体积闭合有向两面边实体、FrontSide、4778壳原面及1966/2150附件逐角对应、实际光学孔/玻璃/深止挡/四支撑与4/24/24接点、原生RESET多源/取消/字节恢复/固定件、六入口配置去墨不变、附件独立拆装、四芯/变父/peer/嵌套/disposal。未运行browser/GPU/build或实物fit；stage modeled，非verified。原图/STL/生成器只work，0私稿下载，0产品贴图。
