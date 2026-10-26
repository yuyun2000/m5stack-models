# Unit ENV-Pro — U169

U169 is the BME688 ENV Pro Unit, with official dimensions 32 × 24 × 8 mm. The model uses millimetres, +X right, +Y toward the ventilated end, +Z through the ventilated face, giving **24 × 32 × 8 mm**. It is a separate product from the ENV III model.

The official native assembled double shell, island 0, is retained with one shared translation. Two displaced individual shell copies are excluded. All **40 native air slots**, mounting holes, seam, and molded detail are preserved. The black PCB includes open mounting-boss reliefs, the fastening bore and the C-shaped thermal-isolation air gap around the real supported sensor island shown in the exact U169 bare-board photograph. The metal-lid BME688 is **3 × 3 × 0.93 mm**, with a 2.8 mm lid and a real **0.35 mm gas vent**, per Bosch page 53 picture 16. The vent reaches a recessed physical floor; the front shell air slots retain an air gap and see physical PCB, sensor, or native rear-shell surfaces behind them. Nothing is filled with a photographic patch.

The photo-derived PCB, thermal-isolation cutout, installed sensor location/orientation, cap cross-section, concealed passives and regulator, fastening shank and Grove interior are visual reconstruction. Exact dimension drawing, source hashes, one assembly transform and inferences are in `sources.json` and `cad-map.json`. Preserve `licenses/M5_Hardware-MIT.txt`. No production PCB/complete assembly STEP is available here.

## Integration

`Model` exposes `grove` and **`sensor` as a passive Component anchor**. `GroveModule` uses the shared four-wire Grove connection, `unitFrame` pose controller, and `cable`. Nested paths such as `portA/sensor`, `portA/unitFrame`, and `portA/cable` use the standard host API. The anchor accepts no sensor commands and emits no sensor values. The original schematic contains no LED, so this model has no externally driven LED or invented motion.

This package owns only appearance and physical connection pose. It implements no temperature, humidity, pressure, gas resistance, IAQ, CO₂ equivalent, BSEC algorithms, I2C registers, electrical behavior, or firmware state. Those belong to the external runtime.

## Source correction and checks

Official MCP incorrectly summarized U1 SDO pin5 as GND and claimed an address conflict. The linked original schematic was downloaded and rendered: SDO pin5 is connected to +3.3V, consistent with the documented 0x77. Its embedded netlist also groups PIU105 with +3.3V. The summary error was submitted through the M5Stack assistant skill, feedback **677ac2a8e9e1441591989de9eaabda08**. No bus behavior is inferred or implemented.

`smoke.json` records finite geometry/envelopes, ten clear mounting samples, FrontSide walls for the screw bore and thermal cutout, support-neck presence, package dimensions and gas-vent wall/floor, all forty native air gaps with physical backing, passive anchor restrictions, Grove pin direction, nested attachment, four-wire posing, detach and resource disposal. Stage stays `modeled`. Exhaustive browser review and artwork remain deferred at the user's request. No private sticker table, vector source or photo crop is used.
