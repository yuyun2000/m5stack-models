# Unit Scales · U108

Stage: `modeled`; browser and physical acceptance remain unverified. Retrieved 2026-10-26. [Official product](https://docs.m5stack.com/en/unit/UNIT%20Scales), [sources](sources.json), [artwork](artwork.json), [necessary local checks](smoke.json).

## Exact model and native assembly

This is Unit Scales U108, not Mini Scales U177. The exact immutable own CAD path `Products/U108_Unit_Scales/Structures/Unit_Scales.stl` is pinned to commit `dbc93013098189c8c0995e7678347b75a369a366`, blob `e4e205144b5eaf607ca5f37ac52cbff8b2b0ea5a` and its source-byte SHA in [cad-map](../../../src/units/scales/cad-map.json). Complete components 0/3/5 retain all **16,694 native triangles**: complete base/pedestal, complete load platform and embossed M5 round cover. Components 1/2/4/6 are displaced duplicates. One common origin `[0,0,16.5]`, unchanged axes and scale 1 produce the official **56×40×41 mm** envelope. No native face or index is removed,filled,patched or independently repositioned.

Axes are millimetres: +X Grove end,+Y side,+Z load platform. Four Ø5 mm mounting columns are at X±24/Y±16. The platform's ten real holes are at X±24/Y−16,−8,0,8,16. Original pedestal/platform gaps,button U-slot and mounting holes stay open;the model does not fill real mechanical clearances to hide missing parts.

## Physical construction

Own product photos establish a real metal load-cell support between the native pedestal and load platform,central retaining support,side metal hex gland and retained black cable. These receive separate fixed physical bodies rather than an opaque block across the entire gap. Their hidden envelope,installation,wire path and fit remain appearance reconstructions;no production sensor part number,complete assembly STEP or production PCB layout is available in the own hardware directory.

The shaped PCB retains four real corner scallops and the Grove notch. Own schematic identifies STM32F030F4P6 (also annotated XM1008F6P6),HX711,HT7333,S8550,eight resistors,seven capacitors,one SK6812,SW1 and five SWD pads. The model supplies corresponding fixed packages,terminals,SW1 cover/plunger and R/C envelopes. Concealed positions,minor dimensions and board plane are inferred rather than production layout. Red HY2.0-4P Grove has a recessed dielectric rear carrier,four separate metal contacts,rails and retaining details. Documentary pin order is GND/5V/SDA/SCL;there is no electrical or I2C simulation.

One physical white guide backs the real long RGB window. It defaults off and only its emissive material follows external color/on/brightness. It creates no Sprite,halo or automatic status. A real rear adhesive film is independent of its single printed child. The top M5 marking belongs to the native embossed round cover and is not replaced by an invented sticker.

## Native tare motion and integration

Exports are `Model`,`GroveModule` and `spec`. Registered components are `grove` (Port),`tare` (Button),`rgb` (Led kind) and passive `sensor` (Component anchor). There is no joint and no platform motion or generated weight. `sensor.getState()` is empty. Weight,mass,load,strain,calibration,zeroing,power,register/I2C and firmware behavior belong to the external framework.

The round tare pad is an integral U-slot flexible tongue in the original CAD,not a separate floating cap. `tare` preserves the shell mesh and its indices. Only 228 selected original tongue vertices flex with an inferred 0.20 mm free-edge visual travel and zero travel at the retained stem. Selected rest bounds are X[−18.500002,−13.5],Y[−17.319834,−9.499999],Z[−15.1000004,−11.6999998] mm;there are no higher fixed shell/post vertices in this selected XY column. A local set of 239 normal vertices follows the tongue. All other native vertices,the platform and M5 cover stay fixed. Release/cancel returns original position/normal bytes and all world transforms exactly. The transparent input target is not a second visible cap.

`model.scalesAssembly.shell` and `model.get('tare').shell` point to that same native mesh. Button fields `weights`,`restPositions`,`restNormals`,`normalVertices`,`normalMask` expose the local deformation boundary for integration fixtures. Use inherited `.travel` and `.getActuationState()`;press/release/cancel support independent sources. Button events express input intent only and do not automatically zero a reading or light RGB.

```js
import {Model,GroveModule} from '../../../src/units/scales/index.js';
const scales=new Model();
scales.handle({type:'press',target:'tare',source:'pointer:1'});
scales.update(.2);
scales.handle({type:'cancel',target:'tare',source:'pointer:1'});
scales.update(.5);
scales.handle({type:'led',target:'rgb',color:'#00aaff',brightness:.7});
scales.handle({type:'led',target:'rgb',on:false});
const unit=new GroveModule({cableLength:60});
host.port('unit').attach(unit);
host.handle({type:'pose',target:'unit/unitFrame',position:[20,70,0],rotation:[0,0,.2]});
host.handle({type:'cable',target:'unit/cable',slack:18,bend:[0,0,-1]});
host.update(.2);
```

## Matching artwork

One 1600×2400 ordinary PNG recreates the own U108 rear diagram from its official photograph and is explicitly marked `reference-redraw`. It redraws only readable labels,diagram paths and color/pin blocks. Typeface,color and registration are inferred;unreadable fine text is not invented. It contains no cropped photo pixels and uses no Mini Scales or packaging label. The physical rear film and every physical attribute/index/world matrix are identical with `artwork:false` in both entry types. CSV,private links,vectors,mappings,generator and intermediates remain outside distributed paths.

## Necessary checks and boundary

Local smoke passes: full 16,694 native triangle retention and 56×40×41 envelope;30 empty mounting/platform rays;48 multi-height native FrontSide bore-wall rays;coordinate-welded directed closure of the PCB,metal support,guide and film;physical Grove rear wall/four contacts,guide,film and metal support rays;multi-source tare press/release/cancel with exact restoration and fixed non-flexure/platform/cover;independent default-off material-only RGB with no input echo/halo;both Model/GroveModule artwork configurations;four-core cable/pose under transformed parent,independent peer,detach and all 190 tracked resources disposed.

These are necessary construction/API checks only. No lengthy browser face-by-face re-review,weight/force/deflection physics,production fit,electrical behavior or physical-device acceptance was performed. Remaining production installation and reference-redraw limitations keep the stage `modeled`.
