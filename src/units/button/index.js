import * as THREE from 'three';
import {Button,Led,materials} from '../../core/index.js';
import {slab,mesh,disc,mark,textMark,hitButton,grove} from '../../modeling/parts.js';
import {makeUnit,knob,can,cylinder} from '../shared/CADUnit.js';
import {spec} from './dimensions.js';import data from './geometry-data.js';
void 0;
const models=makeUnit(spec,data,host=>{
mark(host.body,11,10,[0,7,4.025],(ctx,W,H,s)=>{ctx.strokeStyle='#253130';ctx.lineWidth=.5*s;ctx.beginPath();ctx.moveTo(1*s,8*s);ctx.lineTo(1*s,1*s);ctx.lineTo(10*s,1*s);ctx.lineTo(10*s,8*s);ctx.stroke();});hitButton(host,{id:'press',label:'Press here',position:[0,7,4.04],w:11,h:10});
});
export const Model=models.Model;export const GroveModule=models.GroveModule;export default Model;
