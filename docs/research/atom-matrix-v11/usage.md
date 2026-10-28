# Atom Matrix v1.1 接入

```js
import MatrixV11 from './src/devices/atom-matrix-v11/index.js';
const host = new MatrixV11();
const off = host.on('input', event => bridge.acceptInput(event));
host.button('button').press('external');
host.button('button').cancel('external');
host.led('led12').set({color:'#20a0ff',brightness:0.3});
```

默认导出与 `Model` 是相同构造器，另有 `spec/defaults/configurations/configurationSchema`。真实组件顺序：`led0` 到 `led24`、`button`、`reset`、`ext-5p`、`ext-4p`、`grove`、`usb`。`ledN` 是视觉行优先索引，不能当作未经核实的电气串接编号。按键不自动点灯、Reset 不重启固件。

`complete` 配置为 `{}`，`mount-open` 为 `{labelPierced:true}`。默认黄色 M2 标记有实体薄膜覆盖；后一个配置只物理穿透薄膜以开放膜后的原生安装孔。`artwork:false` 仅关闭墨层，仍保留物理膜和所有动作。

Grove 使用既有 Port/UnitFrame/GroveCable，可挂实际 Unit 或 HUB；输入用完整层级路径 `grove/grove-1/press`。外部 RGB 命令不回送 input。自建循环以秒调用 `host.update(dt,time)`，Viewer 已处理更新循环。最终取消自己持有的来源、调用 `off()`，再卸载并 dispose 模型和 Viewer。GPIO/IMU/IR/总线、音频与固件逻辑由下游实现。
