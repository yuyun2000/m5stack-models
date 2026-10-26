# Unit PoE-P4 · U213

Own U213 ESP32-P4 Unit,distinct from U138 PoESP32.Official dimensions are64×24×20.2mm in length/width/thickness order;model X/Y/Z is24×64×20.2mm.+Y is the Hat end,-Y the RJ45 end,+Z the printed expansion face.In this frame the actual UserKey is on-X and HostUSB/Grove are on+X.[Official product](https://docs.m5stack.com/en/unit/Unit_PoE-P4),[sources](sources.json),[necessary local checks](smoke.json).

## Native enclosure and two evidenced amendments

Path-specific M5_Hardware commit66720a863658da9bab58a208d4ebf8a040c2d42c supplies12316triangles as two display copies of each part.Same-position components0/2 form the6158-triangle baseline;displaced copies1/3 are excluded.One common rigid rotation/translation at scale1 maps the actual expansion face forward.No global resize or wrong-model shell.

The linked CAD has a blind HostUSB recess and closed Hat2 placeholder surfaces where the exact-model official photos10/12 show open sockets.Direct rays against the unchanged baseline hit those native solids first.The Host recess sits0.2mm below the outer face,but the remaining wall is about1.58–1.63mm thick,not a0.2mm through-wall.Two explicitly documented local derivatives therefore open an8.7×3mm Host capsule and sixteen1.3mm Hat2 square axes,limited to the actual connector insertion volume.Closed inward bore walls follow original source surfaces;finite end caps preserve internal rails behind the socket floors.Other ports,hinge,IR/light opening,retainers,labels and exterior stay in place.

Runtime enclosure is11728triangles:4050→5106 and2108→6622.5975of6158input faces remain byte-exact after the common transform;27+156modified face indices,local clipping/boundary subdivision,source/output hashes and interval/topology evidence are recorded in[cad-map.json](../../../src/units/poe-p4/cad-map.json).Each output part has exactly two opposed faces per coordinate-welded edge and positive volume;24×64×20.2mm envelope remains unchanged.This is a locally amended derivative,not an unmodified-CAD claim.Official MCP accepted CAD-difference feedback **ff53d83247364aad8238f7b54e2fd318**;that receipt does not certify a corrected revision.

## Real physical assembly

Actual main,power and Hat daughterboards accompany their solder bores/annular lands,internal16P ribbon,ESP32-P4/Flash,IP101GRI/clock,PoE TPS23753A/transformer/bridge/capacitor envelopes and power-path/regulator/passive packages.Hidden outlines,heights,installation and package positions are own-source appearance estimates;public sources have no populated production assembly STEP.The Hat board has clearance behind the actual CSI contact slot.

The RC01835 RJ45 has its metal shield,stepped deep eight-contact cavity,latch recess,retained springs,rear stop and separate yellow/green optical lenses.Two independent USB-C16P sockets each have an open annular shield,a real insulating tongue,16contact strips and a recessed rear.The white HY2.0-4P Grove has an open keyed housing,four pins and physical solder tails.

The expansion face carries two actual24contact0.5mm FPC card sockets with fixed latch bars,contacts and metal anchors;they are connector hardware,not displays or cameras.SDIO is a9hole single-row female plastic header and ISP a6hole one,each with actual square bores,recessed contacts and solder tails.The opposite end has the actual2×8female Hat2 array;it is not an eight-pin HAT socket or bare PCB hole chart.The actual dark MHS153IRCT emitter lens/package remains a physical optical part only,with no light beam or visible glow.The NH-B2020RGBA-HF carrier/lens is behind the original RGB slit.

The actual U-cut native side tongue flexes inward for `user`.110native tongue vertices move;the hinge/unselected native vertices and all fixed boards,packages,ports and optical carriers stay fixed.A retained tactile-switch follower moves only with that tongue.Multi-source press/release/cancel restores original positions and normals exactly;travel is an appearance estimate,not a rated mechanical limit.A3second hold emits input intent only and causes no boot,reset,green-light transition or firmware action.

## External API

Exports `Model`,`GroveModule`,`spec`.Both entries expose nine ports: `grove`,`usb-host`,`usb-otg`,`ethernet`,`csi`,`dsi`,`sdio`,`isp`,`hat2`;one momentary control `user`;and three independent external LED appearances `rgb`,`link-led`,`activity-led`.They begin off.The RJ45 indicator colors remain yellow/green and are never driven automatically from attachment,keys or network state.

`grove` is the wrapper entry and has four contacts GND/5V/G53/G54.Two USB anchors use the physical `usb-c` family and Ethernet uses `rj45-8p8c`.The actual FPC,9/6pin and16pin Hat2 anchors use independent exact-model families: `m5stack.u213.mipi-csi-fpc24`,`m5stack.u213.mipi-dsi-fpc24`,`m5stack.u213.sdio-1x9-female`,`m5stack.u213.isp-1x6-female`,`m5stack.u213.hat2-2x8-female`.No arbitrary eight-pin attachment compatibility or electrical pin-number view is inferred.FPC mating-frame direction remains an appearance estimate.

There is no display,sensor/IMU,speaker,joint,IR-state or firmware/network/USB/PoE/electrical simulation.No automatic packets,link activity,supply routing,camera images,display contents,GPIO state,boot/reset or factory Web page.Only the body and20cmGrove cable are officially included;default model adds no camera,screen,USBperipheral orEthernetcable.The wrapper adds its four-core cable and external pose frame.

## Synchronous printing and verification

Four ordinary high-resolution PNGs reproduce the exact-model original outlined front,rear,Hat-end and Grove-side body labels.[Artwork record](artwork.json) distinguishes their source and physical surfaces.Old packaging coverage and photographic views are excluded.The private table,source links,original filenames,vectors,proofs,mappings,generators and intermediates remain outside the distribution tree.Physical die-cut perimeters contain no lettering or source vector resource.

Necessary local checks cover individual positive directed enclosure closure and unchanged envelope,5975byte-exact native faces and recorded183changed indices,68amended FrontSide bore-wall rays,31deep female socket axes,48FPC contacts,eight RJ45 springs,both USB tongues/16contacts/deep backs,actual Grove contact/rear,real RGB/IR openings,PCB bores,multi-source key cancellation and fixed objects,three independent external lamps,all physical attributes/index/matrixWorld with artwork:false in both entries,four-core nested attach/pose/independent detach/noecho/disposal.These are construction/API evidence.No browser/GPU,manufacturing fit,material flexure,mechanical-stop,network,USB,PoE,electrical,firmware or physical-device acceptance is claimed.
