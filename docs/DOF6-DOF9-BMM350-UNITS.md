# DoF6 / DoF9 / BMM350 接入

本批分别为U228、U229、U231，均为 `modeled`、`visual-only`。各自官方路径发布的壳源字节相同，仍独立保留本款来源；每款保完整4188原装面，内部器件、滑片和印刷按本款照片/原理图分别建模。[本批检查点](../artifacts/dof6-dof9-bmm350-expansion/progress.json)记录必要检查、两build和5188资源字节。Git151已同步，后续本地增量见[索引](LOCAL-EXPANSION.md)；阶段不表示浏览器/GPU、量产配合或实物验收。

| ID / SKU | 顶层导出 | 实际结构与控件 |
| --- | --- | --- |
| `dof6` / U228 | `Dof6Unit` / `Dof6UnitModule` | BMI270、真实稳定SW1、红4P Grove |
| `dof9` / U229 | `Dof9Unit` / `Dof9UnitModule` | BMI270+BMM350、真实稳定SW1、红4P Grove |
| `bmm350` / U231 | `Bmm350Unit` / `Bmm350UnitModule` | BMM350、固定空槽背衬、红4P Grove，无拨片 |

产品文件原始导出均为 `Model/GroveModule/spec`。DoF6/9 的真实构造选项为 `addressPosition:0|1`，默认0；两具名preset分别设置两个实际初始视觉档。两款保完整装配壳，没有假定的 `rearCover` 服务API。BMM350默认 `rearCover:true`，另提供真实后盖服务preset；没有addressPosition或address控件。`catalog.configurations` 是 `{id,name,options}` 数组，schema另列。

```js
import {loadModel,loadGroveModule} from '../src/loaders.js';
const host=await loadModel('sticks3');
const hub=await loadGroveModule('hub');
host.port('grove').attach(hub);
const six=await loadGroveModule('dof6',{addressPosition:0,cableLength:80});
const nine=await loadGroveModule('dof9',{addressPosition:1,cableLength:90});
const magnetic=await loadGroveModule('bmm350',{rearCover:true,cableLength:100});
hub.port('grove-1').attach(six);
hub.port('grove-2').attach(nine);
hub.port('grove-3').attach(magnetic);
// 宿主循环调用host.update(dtSeconds)，渲染host.root。
```

GroveModule在本体实际组件之外增加 `unitFrame/cable`。单位为mm，+X右/+Y上/+Z前；位置在所属框架内。外驱仅改变模型形状和实际四芯线，不执行I2C、电气或地址路由：

```js
host.handle({type:'pose',target:'grove/grove-1/unitFrame',
  position:[-55,195,8],rotation:[.1,-.2,.15]});
host.handle({type:'cable',target:'grove/grove-1/cable',slack:12,bend:[0,0,-1]});
```

## 真实稳定滑片

DoF6/9 的 `address` 是kind为button的真实两稳定档SW1，默认外露可达。Module使用 `.get('address')`；不要假定有 `.button()` 或 `.joint()` 方法。其 `cap` 承载实际移动滑片/杆，底座、保持件、焊脚、PCB和壳不随动。

```js
const slide=six.get('address');
slide.press('keyboard'); // 首次按下切档
slide.release('keyboard'); // 释放保留已切档
slide.setPosition(0,{immediate:true});
host.handle({type:'button',target:'grove/grove-2/address',
  action:'position',position:1,immediate:true});
```

多个输入源共享一次真实按下周期：一个源释放后其他源仍按住时不再切档；有源取消会在最后一个释放时给cancelled up，不发click，也不强制回0。显式setPosition可恢复所需档位；省略immediate时允许视觉插值。外部档位命令不回声为用户input；press/release/cancel表达真实输入意图，不计算芯片地址。档位映射、内部安装、封装细节和行程属于有记录的外观推导，不称实测止挡。

BMM350顶槽仅保本款照片所见固定黑色保持件/背衬，没有实际奶油色活动拨片，因此没有 `address`，也没有该模型的按键事件。

## 被动封装与实际配置

本体端口只有 `grove`，四针的GND/5V/SDA/SCL是来源标注。无sensor kind、灯、显示、喇叭或关节；下列锚只给真实封装的外观位置，`getState()` 为空：

| 型号 | 被动组件ID | 边界 |
| --- | --- | --- |
| DoF6 | `bmi270` | 仅本款BMI270，无BMM350/共享NC可选支路 |
| DoF9 | `sensor` | 仅本款BMI270+BMM350实体框架，无DoF10气压件 |
| BMM350 | `magnetometer` | 仅本款BMM350，无BMI270或假address滑片 |

BMM350 `rearCover:false` 仅移除原后壳2664面、背标物理膜/墨层和一颗真实固定件的head/floor/shank，共5个物理mesh；其前壳1524、板/接口、固定空槽载体和前两块膜保持。完整配置保自身4188原面。该配置展示拆盖后的真实结构，不表示制造或维修资格。

必要集成检查逐件比较服务态与闭盖态排除这5件后的完整物理多重集，覆盖所有attributes/index/world矩阵，避免只证明子集而漏掉误删部件。各型号独立来源、实际封装与隐藏安装推导见 [DoF6](research/dof6/modeling.md)、[DoF9](research/dof9/modeling.md)、[BMM350](research/bmm350/modeling.md)。

## 原稿PNG与生命周期

每款三个真实独立贴膜分别为型号/IC标题、中央XYZ和背PORT.A条；三块版面均由有效本体矢量直接转换高清普通PNG，保原字符轮廓，不重打字、裁照片或借DoF10。BMM350的XYZ朝向以自身原稿/照片为准。`artwork:false` 只禁墨层，物理薄膜与全部attributes/index/world矩阵保持。来源与尺寸/配准推导见 [DoF6](research/dof6/artwork.json)、[DoF9](research/dof9/artwork.json)、[BMM350](research/bmm350/artwork.json)。CSV、私URL/原名/映射、矢量、生成器和中间件不分发。

`detach({dispose:false})` 后可以重接，单个分支装拆不改同级模型和宿主framebuffer。最终dispose宿主递归清理附件。传感值、姿态融合、磁场/航向、地址算法、协议、固件和电气功能由下游框架实现。

必要检查：`node scripts/check-dof6-dof9-bmm350-units.mjs`。检查使用Node canvas stub；实际API、全部preset、两份构建和在线资源证据以本批检查点为准，没有逐面浏览器、历史全量或实物验收。
