# AtomS3 C123

Original AtomS3 with its own C123 native shell. Export `Model` (also default), `spec`, `defaults`, `configurations`, `configurationSchema`.

- `button`: actual pressable LCD assembly, G41, visual travel 0.18 mm.
- `reset`: actual native side tongue, inward visual flexure 0.15 mm; input intent only.
- `lcd`: 128×128 external framebuffer, 15.27 mm active square, non-touch, default black.
- `usb`, `grove`, `ext-5p`, `ext-4p`: documented physical connector frames. Grove supports existing four-wire modules.
- `artwork: false`: remove three ink panels while retaining carriers, holes, geometry and motion.
- Configuration `complete`, `options: {}`. Hidden board/support/package/fit/travel dimensions are explicit appearance inferences. No firmware, buses, IMU samples or automatic reset effects.

```js
import {Model} from './index.js';
const host = new Model();
host.ensureBuilt();
const off = host.on('input', event => console.log(event.id, event.action));
host.display('lcd').fill('#143a63');
host.button('button').press('preview');
host.update(1 / 60, 0); // required per frame outside DeviceViewer
host.button('button').cancel('preview');
off();
host.dispose();
```

Run from repository root: `node scripts/check-atoms3-controller.mjs`. It imports the actual Model, is guarded on import and writes no artifacts. Source/geometry/artwork/limitations: [modeling](../../../docs/research/atoms3/modeling.md), [sources](../../../docs/research/atoms3/sources.json). CPU fixture results do not certify browser pixels, hardware or manufacturing fit.
