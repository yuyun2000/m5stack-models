# AtomU / K117 接入

```js
import Model, {spec, defaults, configurations, configurationSchema} from './src/devices/atomu/index.js';
const host = new Model({artwork:true});
host.root;
host.on('input', event => console.log(event));
host.button('button').press('external');
host.update(1/60);
host.button('button').release('external');
host.led('led').set({color:'#25aecd',brightness:.7});
// host.port('grove').attach(realGroveModule);
```

`button/reset`为真实独立按键意图，`led`仅外驱RGB，`grove/ext-6p/usb`是实际机械端口；USB为A公头。默认完整壳与贴纸载体；去墨仅`artwork:false`。无显示屏、IMU、数值传感器、音频/固件/电气仿真。root dispose会释放附着几何/材质/贴图并取消未完成的click计时器。
