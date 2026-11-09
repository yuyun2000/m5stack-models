# 四款主机模型与模拟器接入

| 模型 ID | 型号 | 显示组件 | 输入组件 |
| --- | --- | --- | --- |
| `paperdiy` | PaperDIY Complete Kit K159-B | `lcd`，540 × 960，16 级灰度 | `key1`、`key2`、`power` |
| `papers3` | PaperS3 C139 | `lcd`，540 × 960，16 级灰度 | `lcd` 触控、`power` |
| `cardputer` | 初代 Cardputer K132 | `lcd`，240 × 135，RGB | 56 个 `key-*`、`boot`、`reset`、`power`、`grove-power` |
| `corematrix` | CoreMatrix C158 | `display`，16 × 16 白光点阵 | `btnA`、`btnB`、`btnC`、`power` |

型号和组件以[产品目录](../catalog/products.json)与[各型号入口](../src/devices/)为准。两款 Paper 以竖屏接收画面，原点在正视左上角，X 向右、Y 向下。若下游提供 960 × 540 横屏帧，调用方需要先旋转像素，并对 PaperS3 的触控坐标做逆变换。

Paper 的反射式显示表面直接显示调用方送入的像素。灰阶量化、刷新和残影由下游处理。两款 Paper 的指示灯路径均为 `status`，Cardputer 的 Stamp-S3 灯路径为 `stamp-rgb`。

## 写入画面和读取输入

```js
import {loadModel} from 'm5stack-models.js/loaders';

const paper = await loadModel('papers3');
const off = paper.on('input', event => {
  if (event.id === 'lcd') {
    const {action, x, y, pointerId} = event;
    console.log(action, x, y, pointerId);
  }
});
paper.display('lcd').writeRGB565(new Uint16Array(540 * 960).fill(0xffff));

const matrix = await loadModel('corematrix');
const gray = new Uint8Array(16 * 16);
gray[1 * 16 + 2] = 255; // 正视 X=2、Y=1
matrix.handle({type:'display', target:'display', format:'gray8', data:gray});
```

CoreMatrix 的 `gray8` 每像素一个 0–255 强度字节，按行排列。它支持标准显示命令与 `writeGray8`。TM1680 I²C 寄存器、位图布线和刷新周期由下游处理。标准 RGB 帧在白灯渲染时按亮度转换。

Cardputer 每个按键的 `meta.matrix` 为实体位置 `[row,column]`，`meta.scan` 提供解码地址与检测 GPIO。例如 `key-KeyA` 可由模型点击或聚焦画布后按 A。读取按下、抬起、取消与稳定开关档位的方法见[动态外壳接入](AGENT-INTEGRATION.md)。键帽图例与矩阵坐标的对应关系保存在[本型号源码](../src/devices/cardputer/keyboard.js)。

使用 Viewer 时调用 `viewer.mount(model)`。卸载时释放监听、调用 `viewer.unmount(model)` 与 `model.dispose()`。电源开关、固件启动、面板驱动和外设协议的行为由下游实现。

## 模型依据

- [PaperDIY Complete Kit](research/paperdiy/modeling.md)
- [PaperS3](research/papers3/modeling.md)
- [初代 Cardputer](research/cardputer/modeling.md)
- [CoreMatrix](research/corematrix/modeling.md)
