# Atom VoiceS3R (Atom EchoS3R) 接入

```js
import Model, {spec, defaults, configurations, configurationSchema} from './src/devices/atom-echos3r/index.js';
const host = new Model({artwork:true});
host.root;
host.button('button').press('external');
host.update(1/60);
host.button('button').release('external');
host.on('input', event => console.log(event));
// host.port('grove').attach(realGroveModule);
```

主键`button`、侧键`reset`；Grove、USB-C、5p/4p端口分别`grove/usb/ext-5p/ext-4p`。本款无RGB、显示屏、IMU或数值传感器组件。端口仅视觉机械装配与层级事件，音频、GPIO、电源、固件和电气总线交由下游。默认真实完整贴膜；安装开孔用`labelPierced:true`，去墨用`artwork:false`，两者独立。
