import * as THREE from 'three';
import {Button,Led,materials} from '../../core/index.js';
import {slab,mesh,disc,mark,textMark,hitButton,grove} from '../../modeling/parts.js';
import {makeUnit,knob,can,cylinder} from '../shared/CADUnit.js';
import {spec} from './dimensions.js';import data from './geometry-data.js';
void 0;
const models=makeUnit(spec,data,host=>{
for(const [id,y,color]of [['blue',13,0x008ec4],['red',0,0xc61722]]){const cap=new THREE.Mesh(new THREE.CylinderGeometry(4.65,4.65,.2,64).rotateX(Math.PI/2),materials.plastic(color,{roughness:.58}));host.add(new Button({id,label:id,mesh:cap,position:[0,y,7.88],travel:.25,meta:{role:'visual-control'}}));}
});
export const Model=models.Model;export const GroveModule=models.GroveModule;export default Model;
