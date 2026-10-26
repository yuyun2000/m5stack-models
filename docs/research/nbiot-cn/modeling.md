# Unit NBIoT-CN · U112

Stage `modeled`; visual verification remains null. [Official product](https://docs.m5stack.com/en/unit/Unit_NBIoT-CN),[sources](sources.json),[artwork](artwork.json),[necessary smoke](smoke.json). Retrieved2026-10-27.

## Exact own product and shell

This is **U112 SIM7020C**,separate from globalSIM7020G,U111-B SIM7028 andCat1. Own package contains the Unit,SMAantenna,hexwrench and20cmGrove cable. No SIMcard is supplied orfabricated. Official71.5×24×8mm vendorlength includesfixedSMA,whilethe ownnativecase is24×64×8mm. Axes are+Xright,+YordinarySMA,+Zfrontlabel. Native mountingbores areØ4.85mm,16mm apart at[±8,−20]. Defaultactualphysicalenvelope is24×71.5×8mm.

Own `Products/U112_Unit_NBIoT-CN/Structures/Unit_NBIoT-CN.stl` is pinned tocommit `c6bf30a9848f1a8b4e4dd7537cceec5b147cafb3`,blob `cd451d15e2d03f37e80e7db05bf7f82fa56a78ba`,SHA256 `6d93ea1962caf38864027accc041acb990a61e3360581aad16edf30ec294b17f`. It containsoriginalassembled0,**6592triangles**,plus displacedrear1(3858)/front2(2734). Runtime usesonlysource0faces. Directedcyclicvertexcorrespondence assigns2734front/3858rear withoutindependentlymovingthem. Everyface matches;no unmatched,reversed,deleted,patched,filled,stretched orborrowedface. Commontranslation from[0,32,−4],identityaxes,scale1. Eachnativephysicalpart isdirectedclosed andpositivevolume;originalassembled mating coincidences remain withouta singlemanufacturing-manifold claim.

The publishedU112 andU111-B shellbytes happen to match. Onlythe ownverifiedU112path/commit/blob isusedhere;sharedcasebytes do notestablish commonmodules,PCBpopulations,print orantennageometry.

## Physical internals and evidence boundary

The model includesowninferredFR4carrier,actualSIM7020Cmoduleboard/shield/perimeterlandappearance,realGrove,SMAinstallation,internalNanoSIMholder,threebackhexfixings andIPEX/coaxappearance. SIM7020C17.6×15.7mm footprint isconfirmed;the2.3mm height/installedorientation andallhiddenpositions areestimates. The0.8mm carrier sits attopZ−0.5 withnativebossreliefs,Groveclearance,fouractualplatedsolderbores,metalbarrels andfront/backannularlands. Roundcontacttails passthroughthe realplatedopenings. PCB/nativepostclearance ischecked atitsactualinstalledplane.

The exactU112 page links **globalSIM7020G/SIM7020Ccore schematics witha23pinHCore**. Those areafunctionalreference,notacompletepopulatedGrovecarrierassembly/BOM. Secondaryprotection,transistor,regulator/passive andinternalD1envelopes,locations andthecore-to-carrier mapping remainexplicitlyinferred. No23pinHCoreconnector isadded. ThelinkedcoreD1package staysfixed/nonemissive:thereisno exteriorLEDAPI,button ornetworklightinference.

Bothnativeyellow-goldwindowopenings exposeactualroundedgoldSMAinstallationmaterial. Theyarebackedbythatbody frombothfaces,notpaintedover,filledwithPNG orreplacedwithanLED. OrdinarySMAhasrealhollowmetalshaft,dielectricbore,recessedfemalecontact andclosedvisualhelicalthread. Thecoaxroute isfixedinstallationappearance only. NoRP-SMA,RFfield,antennaelectricalproperties,networkstatus,UARTruntime,ATcommands,power,current,voltage orfirmware isimplemented.

The internalNanoSIMholder hasdielectricbase,sixspringcontactenvelopes,guides andafixedmetalretainer withatruematerialwindow. Its footprint,retainerlayout andseating areinferred becauseexactproductionassembly ismissing. ThereisnoSIMcard,trayaccessory,carddata orinventedhingejoint. **`rearCover:false`** removesonlythenativerear3858group,backfilm/ink andthreehexhead/floor/shaftfixings. Completefront2734,PCB,module,Grove,SMA,NanoSIMholder andfeedline remainattheiroriginalpositions. Onlythisserviceconfiguration registers passive`sim`anchor;closedcover hasno suchcomponent orclick-throughoperation.

## Own detachable antenna

OwnU112hero showsaroundtransverseaxiscap neartheradomebase;theownpackageview showsabentbasalstructure. Aproduct-specifichingedappearance istherefore provided. **10×102×10mm straightantenna**,pivot[0,12.6,0],axisX and0…90°range aredeclaredown-photoestimates,notpublisheddimensions,measuredstops oranotherUnitantennaasset. The71.5mmUnitnominal excludesit.

Onlytheboredknuckle,taperedshoulder,rubberrod,closedroundedtip andmoldedband move. Couplingnut/lip/internalthread,dielectric/solidordinarymalecentrepin,neck,boredforkcheeks andretainedaxle stayfixed. Theknucklehasatrueaxlebore andpositiveaxle/cheek/neckclearance. Itdoesnotspin/unscrewtheSMAnut,automaticallysweep,locktheworldpose orsimulateRF. Externallyrequestedangle/interpolation/replacement commands areimplemented,withfinite0…90°bounds andnonzeroRPMrejected. Neutralposereturnsexactly;commands donotemitinputecho.

## API and configurations

Exports:`Model`,`GroveModule`,`Antenna`,`spec`. Defaultbodycomponents areonly`grove`/`antenna`Ports;serviceappends passive`sim`. Thereareno buttons,LEDs,displays,sensors orbodyjoints. `GroveModule` additionally providesexisting`unitFrame` andtruefour-core`cable`. Actualoptions are`rearCover:true`,`antenna:false`,`antennaAngleDeg:0`. Thefourpresets coverclosed/service withandwithoutthe realantenna. Accessoryhasone`tilt`joint at`antenna/tilt`,or`unit/antenna/tilt`underaGrovehost. Modulecomponents use`get()`.

```js
import {Model,GroveModule,Antenna} from '../../../src/units/nbiot-cn/index.js';
const unit=new Model({antenna:true});
unit.handle({type:'joint',target:'antenna/tilt',angleDeg:60,durationMs:200});
unit.update(.2);
const held=unit.get('antenna').detach({dispose:false});
unit.get('antenna').attach(held);
const service=new GroveModule({rearCover:false,antenna:true,cableLength:70});
host.get('unit').attach(service);
host.handle({type:'joint',target:'unit/antenna/tilt',angleDeg:45});
service.get('sim'); // passive internal holder anchor;no suppliedcard/data
```

## Both own CN labels

Twoauthorizedcode-redrawPNGs reproduceonlyreadableownU112labels:**1580×3610front** honeycomb/NB-IoT-CN and**1600×3600back** NB-IoT-CN/824-1990MHz/SIM7020C/SIM-INSIDE/PORT.C.UART/TXD-RXD-5V-GND. Printedfrequency isliteralappearancefromtheownrearphoto,notasimulatedbandclaim. NoSIM7028/globalGprint orpackagingartwork isborrowed. Fonts,colours andregistration remainestimates. ThetwoURLs usestaticliterallocalbindings forVite.

Independentphysicalsilverfilms remainwith`artwork:false`;onlyinkisremoved. Frontfilmfitsown16×36.3mmnative recess,rearfilmfits16.2×36.2mmrecess. Closedconfiguration hastwoinkpanels;rearservice retainsfrontonly. Nineentry/configuration comparisons preserveeveryphysicalattribute,index andmatrixWorld. FinalPNGscontainonlynumeric2540DPI metadata. PrivateCSV/URLs/names/mapping,vectororiginals,rawofficialCAD/photos/MCP,SVGgenerators/proofs/intermediates arenotdistributed.

## Necessary bounded checks

All**180physicalmeshes** withtheantenna arecoordinate-welded directedcount-two andpositivevolume. Complete6592sourcefaces,10mountaxes/40FrontSidewalls,12platedaxes/48metalwalls,16substratewalls,6actualgoldwindowbackings,9hollowSMAaxes/12internalwalls,8antennacoupling/knucklewalls andSIMretainerwindowpass. Carrier-versus-ownnativeparts passes4125surfacesamples and54volume-gridpoints atthreedirections. Separateownhinge0/45/90poses pass3/5/4candidatepairs,288/973/289surfacesamples and81/135/108volume-gridpoints. Theseareboundedconstructionchecks,notmanufacturingcollisioncertification.

Fiveantennaangles,externalinterpolation/replacement/rejection/noecho,actualfixedmaterialinvariance,exactneutral/service/attachmentroundtrips,nineartworkconfigurations,transformed-parentfour-coreattachment,independentpeer,selectiveantennadetach anddisposalof788trackedresources pass. Nobrowser,GPU,physicaldevice,productionfit,completepopulatedcarrierBOM,RF/network/electrical/firmwareacceptanceisperformed;visualverificationremainsnull.

Officialfeedback`8835048c2d544bc19516a233746ee788`wasaccepted for exactpopulatedU112carrier/SIMholder/SMAfeedmapping,D1lightpath andsuppliedantennadimensions. Themissingsecondarydetails staymarked inferred.
