import * as THREE from 'three';
import {materials} from '../../core/index.js';
import {slab,mesh,FACE} from '../../modeling/parts.js';

// Photo-derived placement on the official open-backed body. These are physical
// connector/cable bodies, with no electrical state or emulation behavior.
function connector(parent,{name,position,pins,pitch,width,height,color}){
 const group=new THREE.Group();group.name=name;group.position.fromArray(position);group.quaternion.copy(FACE.back);parent.add(group);
 const plastic=materials.plastic(color,{roughness:.8});
 slab(group,width,height,.25,.25,[0,0,0],plastic,[],.04).name=`${name} backstop`;
 slab(group,width,height,.95,.25,[0,0,.25],plastic,[{w:width-1.2,h:height-1.3,r:.15}],.06).name=`${name} shroud`;
 const metal=materials.metal(0x9d9a7c,{roughness:.46});
 for(let i=0;i<pins;i++){
  const x=(i-(pins-1)/2)*pitch;
  mesh(group,new THREE.BoxGeometry(.42,.38,.7),metal,[x,-.15,.67],`${name} contact ${i+1}`);
 }
 slab(group,width*.48,.48,.5,.12,[0,height/2-.18,.62],plastic,[],.04).name=`${name} latch`;
 group.userData={role:'visual-cable-connector',contactCount:pins,pitchMm:pitch,placementSource:'official rear photo; dimensions inferred'};
 return group;
}

export function addRearAssembly(host){
 const rear=new THREE.Group();rear.name='Rear body electronics';host.body.add(rear);
 // The board is continuous above the servo. Its central clearance starts below
 // Y=13.1, rather than removing the area behind the main harness and ICs.
 slab(rear,47,48,1.0,2,[0,9.1,-29.3],materials.plastic(0x233f33,{roughness:.9}),[{w:33,h:27,r:1,cy:-.4}],.08).name='Rear power PCB';
 for(const x of [-10,10])connector(rear,{name:x<0?'Servo S1 connector':'Servo S2 connector',position:[x,29.1,-28.95],pins:3,pitch:2.54,width:9.2,height:4.5,color:0x1e5054});
 connector(rear,{name:'Upper 7P harness connector',position:[0,23.4,-29.35],pins:7,pitch:1.25,width:11.2,height:3.4,color:0x202b26});
 connector(rear,{name:'Lower 7P harness connector',position:[-1.3,13.9,-29.35],pins:7,pitch:1.25,width:11.2,height:3.4,color:0x202b26});
 const insulation=materials.plastic(0x111b16,{roughness:.76});
 for(let i=0;i<7;i++){
  const offset=i-3;
  // Each wire fans into a real contact at both ends and bows away from the PCB.
  const points=[
   [offset*1.25,23.25,-30.08],
   [offset*.78+.65,22.0,-30.25],
   [offset*.72+2.15,19.9,-30.45],
   [offset*.72+1.0,17.0,-30.45],
   [offset*.78-1.05,15.2,-30.25],
   [offset*1.25-1.3,13.75,-30.08]
  ];
  const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),false,'centripetal');
  mesh(rear,new THREE.TubeGeometry(curve,32,.21,8,false),insulation,[0,0,0],`Rear harness wire ${i+1}`);
 }
 const chips=materials.plastic(0x15201a,{roughness:.81}),termination=materials.metal(0x8c9688,{roughness:.55});
 for(const [name,x,y,w,h] of [['Left PCB IC',-8.6,19.9,3.1,3.8],['Right PCB IC',8.3,20.1,2.7,4.6]]){
  const chip=slab(rear,w,h,.6,.15,[x,y,-29.35],chips,[],.05);chip.quaternion.copy(FACE.back);chip.name=name;
  for(const side of [-1,1])for(let n=0;n<4;n++)mesh(rear,new THREE.BoxGeometry(.55,.3,.17),termination,[x+side*(w/2+.14),y+(n-1.5)*.72,-29.55],`${name} lead`);
 }
 for(const [x,y] of [[-13.1,21.4],[-13.1,18.8],[-12.4,16.2],[-8.6,15.6],[12.6,22.3],[12.6,19.7],[12.6,17.1],[8.4,16.3]]){
  const part=slab(rear,1.6,.75,.4,.1,[x,y,-29.35],chips,[],.025);part.quaternion.copy(FACE.back);part.name='Rear PCB passive package';
  for(const side of [-1,1])mesh(rear,new THREE.BoxGeometry(.35,.78,.16),termination,[x+side*.63,y,-29.65],'Rear PCB passive termination');
 }
 return rear;
}

export function addTopBoard(host){
 const top=new THREE.Group();top.name='Head top electronics';host.body.add(top);
 const pcb=materials.plastic(0x234331,{roughness:.88});
 // A separate Touch board follows the top cover. The narrow central carrier
 // stops before the CoreS3 back and leaves both Grove mouths unobstructed.
 const board=slab(top,47,37,.6,1.5,[0,33.3,-9.5],pcb,[],.06);board.quaternion.copy(FACE.top);board.name='Head Touch PCB';
 const carrier=slab(top,3.5,7.2,.6,.2,[0,33.3,11.6],pcb,[],.04);carrier.quaternion.copy(FACE.top);carrier.name='Top IR carrier PCB';
 const receiver=new THREE.Group();receiver.name='Top IR receiver assembly';receiver.position.set(0,34.52,10.25);receiver.quaternion.copy(FACE.top);top.add(receiver);
 mesh(receiver,new THREE.CylinderGeometry(1.22,1.35,.8,32).rotateX(Math.PI/2),materials.plastic(0x18211c,{roughness:.78}),[0,0,-.35],'Top IR receiver package');
 const lens=mesh(receiver,new THREE.SphereGeometry(1.2,32,20),materials.glossy(0x0d1712,{roughness:.18,clearcoat:.22}),[0,0,.25],'Top IR receiver lens');lens.scale.z=.45;
 return top;
}
