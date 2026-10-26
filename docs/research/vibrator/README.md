# Unit Vibrator — U059

The official U059 page confirms an **N20 DC motor and exposed metal eccentric**. Exact U059 photographs show the brass mass and radial retaining screw; this is not a sealed coin motor. The official drawing gives a **24 × 32 × 8 mm base**, **7 mm eccentric diameter**, **5 mm exposed eccentric length**, and two 5 mm mounting holes on 16 mm pitch. The native raised motor cover reaches **12.2 mm** total housing depth; the default complete assembly is **24 × 37 × 12.2 mm**. Coordinates are millimetres, +X right, +Y toward the eccentric, +Z front.

The complete native assembled double shell is STL island 0, retained with one translation. Islands 1 and 2 are displaced individual housing copies. No native cover, shaft opening, mounting bore, shell seam or molded detail is removed, scaled or filled. A U-shaped physical PCB keeps motor, mounting and fastening clearances open. The stationary flattened N20 metal can, brush cap and real bored bearing back the original shaft aperture. The exterior shaft carries a real bored brass solid and retaining screw; no photographic patch hides an opening. Hidden can shape, PCB/component placement, bearing, shaft dimensions/axis centre, brass bore eccentricity and retaining screw geometry are visual reconstructions. These are not production BOM or fit claims.

## Integration

`Model` exposes `grove`, a passive `sensor` anchor, and the continuous **`rotor` VisualJoint**. The model starts stopped. Set the actual exterior eccentric directly:

```js
const rotor = model.get('rotor', 'joint');
rotor.set({ rpm: 12 });
model.update(0.25); // 18 degrees of visual rotation
rotor.set({ rpm: 0 });
rotor.set({ angleDeg: 0 });
```

Only the output shaft, brass eccentric and retaining screw rotate around `[0, 1, 0]`. The original shell, fixed N20 can/bearing, PCB and Grove frame stay fixed. Externally driven angle/RPM emits no user input. The 240 RPM demo ceiling is a visual demonstration choice; it is not a motor specification or validated operating range. The default `sensor` Component is only an anchor, accepts no motor/sensor commands and returns no measurements. No actual LED is documented, so none is invented.

`GroveModule` uses the shared four-wire cable and `unitFrame` pose controller. A module attached to `portB` exposes `portB/rotor`, `portB/sensor`, `portB/unitFrame` and `portB/cable`; for example `host.handle({ type: 'joint', target: 'portB/rotor', rpm: 12 })`. The socket labels are GND, 5V, DIN and NC. Cable pose and visual kinematics have no GPIO, PWM, current, force, vibration-intensity, motor inertia or firmware behavior. No automatic body shake is tied to rotor motion. Hardware logic belongs to the consuming runtime.

## Sources and checks

`cad-map.json` records the immutable official M5_Hardware commit/blob, SHA-256, selected island and single shared transform. Preserve `licenses/M5_Hardware-MIT.txt`. `sources.json` records exact official photo/drawing URLs and hashes, geometry inferences and runtime hashes. Raw MCP data, STL, photographs, dimension raster and generator stay outside the repository. No private sticker table, vector source or photo crop was used.

`smoke.json` records finite geometry and envelopes, ten clear mounting samples, real PCB and shaft-bore FrontSide walls, physical backing at Grove/motor apertures, 12 RPM × 0.25 s = 18 degree motion, fixed shell/can/port, exact neutral reset, no input events, passive anchor, nested Grove attachment and four-wire pose, detach and current-resource disposal. Stage remains `modeled`. Exhaustive browser inspection stays deferred at the user's request. Reference-redrawn permanent labels are now integrated ([sticker update](./stickers.md)).
