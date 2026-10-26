# Unit BMM350 · U231

Stage `modeled`, visual verification null. [Official product](https://docs.m5stack.com/en/unit/Unit_BMM350),[sources](sources.json),[artwork](artwork.json),[bounded smoke](smoke.json). Retrieved2026-10-27.

## Own original case and one sensor

Exact U231 is the **BMM350-only** Unit. U2 BMI270 and U4 eightpin sensor positions are NC in its own schematic;R6/R7/R8 also NC. No BMI270/U4/SPA06 pressure body,DoF6/9 address mechanism,magnetic values ororientation behavior is imported. Shared official STL bytes only prove common housing,not populated PCB/control/artwork. Its own `Products/U231_Unit_BMM350/Structures/Unit_BMM350.stl` is pinned to commit `681b2cbd645bb27a3ff23f877c17b5804cf45444`,blob `cbb28004b34a94fbabaebe05148fa4e74c7cb65d`,SHA256 `eb0ac3380c22da14add40ea3cec458f6b2827bb3edd8a25b9a1999b0c4f6d1dd`.

Own source0 is the complete **4188** assembled native faces. Displayed rear1 has2664 and front2 has1524. Runtime keeps source0 only and partitions every original face by directed cyclic vertex correspondence to the duplicates. No unmatched face,patch,removed/reversed/fill/stretch/borrowed face orindependently moved native half. One common origin[122.52239990234375,12,−4],identity axes,scale1. Front1524/rear2664 remain closed positive material volumes;original mating coincidences remain without a single manufacturing manifold claim. Nominal/native24×24×8mm;physical0.04mm XYZ film makes visual24×24×8.04mm. Two original Ø5mm mounting axes have16mm pitch;faceted native walls have2.4377…2.5mm ray radius.

## Physical PCB and real fixed slot

The own inferred0.8mm carrier sits topZ−1.3 with rounded native-corner clearance,3.65mm openmount reliefs,3mm central nativepost relief,real Grove notch and4actual plated drills/barrels/8annularlands. Square retained contact tails pass through real drills and below lower solderlands. These placement/relief dimensions are visual installation estimates grounded in native material clearance,not production PCB CAD.

BMM350 WLCSP1.28×1.28×0.5mm is confirmed. The body/9ball split and hidden installedpose are inferred. ME6206A33M3G andSSP7615-18 regulator envelopes,own non-NC passive references and physical terminations are represented with inferred secondary population/positions;this is not complete actual BOM acceptance. The two NC chip sites have only empty metal footprintlands and no chips. R3 only serves the NC BMI270 SDO/SW1 branch;C5/C6 only decouple its NC VDD/VDDIO. These three positions also have6empty lands and no packages. Only four actualBMM350/regulator resistors and eight capacitors retain inferred package envelopes. No pressure sensor ororifice is created.

Own #05/#10 photos show a **black fixed-looking carrier/retainer and metal ends** behind the original top aperture;there is no resolved creamthumb or demonstrable travel. Its exact retainer/body identity and actual SW1 population remain undocumented. The shared schematic's SW1 note applies to the NC BMI270 branch and does not establish U231 motion/function. Therefore `topSlot` contains only fixed positive-volume retainer/backing/endtabs/lands. The opening stays a real material aperture backed by a physical black carrier,with no invented slider/button/joint/address API. Official feedback `91112190e73f4971bd86f6be3cd8434d` requests exact population and top-part construction;it was received for review.

The own red Grove has real rails/floor/recessed dielectric rear/bridge,four contacts/molded returns and soldertails. `grove` is a passive mechanical Port with documentary GND/5V/SDA/SCL labels. The BMM350 package frame is a passive `magnetometer` Component whose state is empty. There are no sensor/button/LED/display/joint/IMU interfaces,no heading/calibration/temperature/address/I2C/electrical orfirmware simulation.

## API and cover service

Exports:`Model`,`GroveModule`,`spec`. Body component order in both configurations:`grove`,`magnetometer`. Default `{rearCover:true}`;two real named presets are `closed` and `rear-service`. `GroveModule` adds existing `unitFrame` and true four-core `cable`. Module components use `get()`.

`bmm350Assembly` fields are `rearCover`,`parts`,`board`,`input`,`topSlot`,`screw`,`labels`,`magnetometer`. Fixed slot fields are `retainer`,`backing`,`endTabs`,`pads`. `rearCover:false` removes **exactly five physical meshes**: `parts['BMM350 complete native rear housing']`,`labels.back`,`screw.head`,`screw.floor`,`screw.shank`. It sets screw null andomits rear/backfilm. Every front/PCB/BMM350/emptyNCpad/Grove/fixedslot/front+axisfilm/anchor attribute,index andworld pose stays unchanged. No service-specific control/anchor is added.

```js
import {Model,GroveModule} from '../../../src/units/bmm350/index.js';
const body=new Model();
body.get('magnetometer'); // passive package frame,empty state
const service=new GroveModule({rearCover:false,cableLength:70});
host.get('unit').attach(service);
host.handle({type:'pose',target:'unit/unitFrame',position:[8,90,6],rotation:[.2,.1,-.3]});
host.handle({type:'cable',target:'unit/cable',slack:16,bend:[0,0,-1]});
// Host update drives appearance only;no magnetic/sensor values.
```

## Three exact source labels

One valid own machinevector bodymaster provides outlined BMM350 title/XYZ/back PORT.A I2C artwork. Packaging vector andphotos are rejected as body originals. Final ordinary PNGs are **1782×370 front,626×626 XYZ,1605×406 back**,with static literal local URLs and only numeric2540DPI metadata. No font retyping orphoto pixels. Film sizes/0.04mm thickness/registration are inferred;glyphs andcolours preserve the original vector. Closed configuration has3panels;rearservice retains front/XYZ2. Independent physical films remain under `artwork:false`,which removes only ink. PrivateCSV,sourceURLs/names/mapping,vectororiginals,generators/proofs/intermediates andrawCAD/photos/MCP are outside distribution.

## Necessary bounded receipt

All132 physical meshes are coordinate-welded directed count-two,positive-volume andFrontSide. Complete4188 originalfaces,10empty mountaxes/32nativewalls,12platedaxes/48metalwalls,centralPCB clearancewalls,4fixed-retainer materialwalls and3actualblackbacking rays pass. PCB/Grove/fixedslot versus native parts pass bounded bidirectional vertex/triangle samples andfinite volume grids. Four Model/GroveModule actualpreset artwork comparisons preserve allphysicalattributes/index/matrixWorld. Transformed-parent four-core/plug attachment,independent peer,no input echo,precise service/wholeUnitroundtrip and640trackedresource disposal pass. No exhaustive/browser/GPU/physicaldevice,manufacturing-fit,full populatedBOM orfirmware/electrical acceptance. New code MIT,third-party rights retained.
