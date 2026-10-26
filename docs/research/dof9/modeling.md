# Unit DoF9 - U229

Own U229 official MCP/page,exact schematic,top-slot/switch-note photos and pinned own CAD were checked on2026-10-27. Stage **modeled**,scope **visual-only**;necessary construction/API smoke passes. No GPU/browser,physical assembly,production fit,electrical orfirmware acceptance is claimed.

Own STL order is complete assembled component0=4188faces,displaced rear1=2664 andfront2=1524. Complete0 is retained under one common translation from origin `[122.52239990234375,12,-4]`,identity axes,scale1. All4188 directed triangles match own source;no cuts,repairs,removed faces,stretch orhalf moves. The existing front/rear coincident mating faces remain;the combined housing is not described as a single manifold. Native case24x24x8mm and actual two5mm mounts on16mm pitch remain unchanged. Independent XYZ film adds0.04mm,so visual envelope24x24x8.04mm is recorded separately. Axes +X front right,+Y actual SW1 top opening,+Z front XYZ.

Behind the intact original openings are real PCB mounting reliefs/retaining bore/Grove bores andplated barrels,red4P receiving housing with four contacts/deep rear/bent solder legs,actual SW1 retainer/body and a rear hex fastener. Own exact sensor population is BMI270 LGA14 plus BMM350 WLCSP9,with14/9 seated contacts,two actual LDO envelopes and own schematic passive envelopes. U4 isNC;its eight copper pads remain empty. C8 belongs to the optional U4 branch and fit is unconfirmed,so it is left as two empty lands in this reconstruction. No SPA06-003/barometer,MCU,LED,display orUSB is added. Concealed installation and package/contact/board dimensions remain appearance estimates.

Exports: `Model`, `GroveModule`, `spec`. Actual components are `grove` Port (`grove`,documentary GND/5V/SDA/SCL),`address` latching Button and`sensor` passive Component. The sensor is the actual BMI270/BMM350 package-frame anchor;`getState()` returns `{}` anddoes not synthesize values oraccept functional measurement/address commands. `GroveModule` adds the existing `unitFrame`/`cable` components with four physical wires andtwo plugs;use`get(id)` on modules.

SW1 is truly reachable through the native top opening. Only its cream thumb andretained stem under`get('address').cap` move sideways. Fixed body/retainer/three solder terminals,PCB,case,packages,ports,fastener andfilms stay fixed. Its1.8mm throw andinstalled mechanism dimensions are inferred from own slot/photo;stable0/1 are visual detents without a BMI270 address algorithm. Presses from simultaneous sources toggle once;partial release stays held;cancel/final release ends the hold,preserves the selected detent andsuppresses click. External stable-position drive emits no input echo.

```js
const unit = new Model({addressPosition:0});
unit.get('address').onPointerDown({pointerId:1});
unit.get('address').press('key');
unit.get('address').onPointerUp({pointerId:1});
unit.get('address').cancel('key'); // selected stable detent remains
unit.handle({type:'button',target:'address',action:'position',position:0,immediate:true});
const module = new GroveModule({addressPosition:1,cableLength:60});
host.port('unit').attach(module);
host.handle({type:'button',target:'unit/address',action:'position',position:0});
host.handle({type:'pose',target:'unit/unitFrame',position:[10,90,5],rotation:[.2,0,.1]});
// External runtime calls update(dtSeconds) for interpolation.
```

Constructor option `addressPosition` accepts0 or1,default0. Two named presets present the same actual assembly atstable0/1. There is no half-cover service-removal API:complete original source0 stays intact;all controls are already reachable. No additional accessories orjoints exist.

Three independent physical films carry exact original outlined U229 artwork:DoF9/dual-chip title,XYZ,and rear PORT.A.I2C/pins. All28 original paths are retained as ordinary high-resolution PNG;no retyping,photographic pixels orother-SKU substitution. Static literal URL bindings enable bundling. Physical films remain withartwork:false;all attributes,index andworld matrices remain equal across both entries,both constructor presets andstable0/1 poses. PNG contains no EXIF/ICC/text/private metadata. Original vectors,private table/links/names/mapping,generators andintermediates are not distributed.

Necessary smoke covers own4188 directed source faces/common transform andnative coincident-seam report;all133 physical material meshes withclosed directed construction/positive volume;16empty-axis and64FrontSide wall rays;real mounting/retaining/Grove/retainer bores,plated solder leg installation,14/9 package contact seating,independent film support andactual connector/slot/screw backing;cap-only multi-source/cancel/exact-reset/noecho;8artwork entry/preset/pose pairs;four-core transformed-parent attachment,peer isolation,wrong connector preservation,detach/reattach and509resource disposals. No IMU/magnetometer/temperature/heading/pose values,address/I2C behavior,power,electrical orfirmware simulation. New code MIT;existing M5_Hardware MIT andprinted-design/trademark rights remain.
