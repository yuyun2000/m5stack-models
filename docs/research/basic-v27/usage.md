# Basic v2.7 动态接入

```js
import BasicV27 from './src/devices/basic-v27/index.js';
import {DeviceViewer} from './src/core/index.js';
import {GroveModule as Fan} from './src/units/fan/index.js';

const host = new BasicV27(); // 完整电池底座；{base:'removed'} 拆底
const viewer = new DeviceViewer(container, {keyboard:'focused'});
viewer.mount(host);
const off = host.on('input', event => runtime.acceptInput(event));
// a/b/c/power 仅报告意图；runtime 由调用方提供。

host.button('a').press('external-controller');
// 在来源释放或取消时配对清理，取消不产生 click。
host.button('a').cancel('external-controller');
host.handle({type:'button',target:'power-switch',action:'position',position:0});
// power-switch 只有完整底座配置存在；位置不执行关机。
host.display('lcd').writeRGB565(framebuffer, {x:0,y:0,w:320,h:240});

const fan = new Fan({propeller:true,cableLength:65});
host.port('grove').attach(fan);
fan.list('joint')[0].set({rpm:120});
// 外部运动命令不回送 input，host 会报告子路径。
fan.list('joint')[0].set({rpm:0,angleDeg:0});
```

稳定导出为 `Model`、default、`spec`、`defaults`、`configurationSchema`、`configurations`。默认 `{artwork:true,base:'installed'}`；`complete` 选项 `{}`，`base-removed` 选项 `{base:'removed'}`。前者组件顺序为 `a,b,c,power,lcd,usb,grove,micro-sd,mbus,power-switch`；后者省去最后的拨钮。按键映射为 KeyA/KeyB/KeyC/KeyP。

`Button` 的 `press/release/cancel/click/getActuationState` 和多来源保持均为 core API。拨钮是 latching button：`getState()` 返回 `position:0|1`；使用 `setPosition(0|1)` 或上述 command 从外部更新物理档位，无 input 回声。它通过自身真实帽网格拾取，不借底板透明贴片。屏幕有标准 RGBA/RGB888/RGB565、背光和电源视觉 API，默认无触摸。产品无 LED/IMU/sensor/speaker 组件。

自建渲染循环须以秒调用 `host.update(dt,time)` 并重绘；Viewer 已执行。Grove 的 source frame 在主机左侧实际红口，连接件可通过既有 UnitFrame API 调整目标姿态，线的四根芯和两端插头随真实父级变化。可接 HUB 并使用完整路径如 `grove/grove-1/press`。

取消自己持有的输入来源后，调用 `off()`、`viewer.unmount(host)`、`host.dispose()`、`viewer.dispose()`。保留 Unit 复用时使用 `port.detach({dispose:false})`；销毁连接状态交由宿主 `dispose()` 递归释放。拆底只改变真实装配形态，不切换运行时电气语义。
