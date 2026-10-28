## AtomS3U · K125

精确本款自身原生结构，完整默认装配与普通PNG贴纸，阶段 `modeled`。入口 `src/devices/atoms3u/index.js` 导出 `Model`、`spec`、`defaults`、`configurations`、`configurationSchema`；默认配置 `complete`（`{}`）。

```js
import {Model} from 'm5stack-models/src/devices/atoms3u/index.js';
const host = new Model({artwork: true});
host.ensureBuilt();
host.on('input', event => console.log(event));
host.button('reset').press('pointer');
host.button('reset').cancel('pointer');
host.handle({type:'led',target:'rgb',color:'#ffffff',brightness:.6});
host.port('grove').attach(unit); // 真实Grove视觉装配与下游路径
// 动画循环内 host.update(dt, elapsed)，移除时 host.dispose()
```

控制：`button`, `reset`；端口：`usb`, `grove`, `ext-6p`；外驱LED：`rgb`。无模拟摄像头数据、传感器、固件或总线。`artwork:false` 保留所有实体和动作。模型原点/尺寸、推导、冲突与限制见 `docs/research/atoms3u/sources.json`；运行 `node scripts/check-atoms3u-controller.mjs`。
