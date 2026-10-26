import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import * as THREE from 'three';
import {loadModel,loadGroveModule} from '../src/loaders.js';
import {Device,Port} from '../src/core/index.js';

const prints=model=>{const out=[];model.root.traverse(o=>{if(o.userData.role==='printed-artwork'&&(o.userData.artworkKind?.startsWith('official-raster')||o.userData.artworkKind==='reference-redraw'))out.push(o);});return out;};
const api=model=>model.list().map(c=>[c.id,c.kind]).sort((a,b)=>a[0].localeCompare(b[0]));

export async function checkStickerVariants(){
 const previousDocument=globalThis.document;
 if(!previousDocument){const noop=()=>{},ctx=new Proxy({measureText:()=>({width:20}),createLinearGradient:()=>({addColorStop:noop}),createRadialGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop,set:(o,k,v)=>(o[k]=v,true)});globalThis.document={createElement:()=>({getContext:()=>ctx})};}
 try{
 const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8')),cases=[];
 for(const product of catalog.products.filter(p=>p.artwork?.variants)){
  for(const configuration of product.configurations??[{id:'default',options:{}}]){
   const options=configuration.options??{},enabled=['official-raster-integrated','reference-redraw-integrated','mixed-raster-integrated'].includes(product.artwork.status)||options.stickerVariant==='education-cn';
   const model=await loadModel(product.id,options),without=await loadModel(product.id,{...options,artwork:false});
   try{
    model.root.updateMatrixWorld(true);without.root.updateMatrixWorld(true);
    const layers=prints(model);assert.equal(layers.length>0,enabled,`${product.id}/${configuration.id}: expected formal raster variant`);
    assert.equal(prints(without).length,0,`${product.id}: explicit opt-out`);
    assert.deepEqual(api(model),api(without),`${product.id}: artwork preserves component addresses/kinds`);
    for(const layer of layers)for(const value of layer.geometry.attributes.position.array)assert.ok(Number.isFinite(value),`${product.id}: finite print vertices`);
    let movingLabels=0;
    for(const button of model.list('button')){
     const onCap=[];button.cap.traverse(o=>{if(layers.includes(o))onCap.push(o);});if(!onCap.length)continue;
     const rest=onCap.map(o=>o.getWorldPosition(new THREE.Vector3()));button.press('sticker-check');button.update(1);model.root.updateMatrixWorld(true);
     for(const [i,layer]of onCap.entries())assert.ok(layer.getWorldPosition(new THREE.Vector3()).distanceTo(rest[i])>0,`${product.id}: cap print moves with its physical key`);
     const held=onCap.map(o=>o.getWorldPosition(new THREE.Vector3()));
     button.release('sticker-check');button.update(1);model.root.updateMatrixWorld(true);
     if(button.isLatching){
      for(const [i,layer]of onCap.entries())assert.ok(layer.getWorldPosition(new THREE.Vector3()).distanceTo(held[i])<1e-6,`${product.id}: slider print stays in the new detent on release`);
      button.press('sticker-reset');button.release('sticker-reset');button.update(1);model.root.updateMatrixWorld(true);
     }
     for(const [i,layer]of onCap.entries())assert.ok(layer.getWorldPosition(new THREE.Vector3()).distanceTo(rest[i])<1e-6,`${product.id}: cap print returns exactly`);
     movingLabels+=onCap.length;
    }
    let groveLayers=null;
    if(product.integration?.moduleExport){
     const host=new Device(),port=host.add(new Port({id:'unit',connector:'grove'}));
     try{const unit=await loadGroveModule(product.id,{...options,cableLength:35});port.attach(unit);host.root.updateMatrixWorld(true);groveLayers=prints(unit).length;assert.equal(groveLayers,layers.length,`${product.id}: Grove assembly retains the same artwork variant`);assert.deepEqual(api(unit).filter(([id])=>!['unitFrame','cable'].includes(id)),api(model),`${product.id}: Grove variant retains product component addresses/kinds`);}finally{host.dispose();}
    }
    cases.push({product:product.id,configuration:configuration.id,layers:layers.length,groveLayers,movingLabels,status:'pass'});
   }finally{model.dispose();without.dispose();}
  }
 }
 const report={status:'pass',cases,scope:'Actual model/configuration/attached-module geometry, opt-out, addresses and cap ownership; browser pixel review is separate'};
 await fs.writeFile(new URL('../artifacts/sticker-check.json',import.meta.url),JSON.stringify(report,null,2)+'\n');return report;
 }finally{if(previousDocument===undefined)delete globalThis.document;else globalThis.document=previousDocument;}
}
