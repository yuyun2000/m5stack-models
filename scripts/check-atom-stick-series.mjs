/** MIT. Dated complete-series identity/configuration/runtime-entry coverage. */
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {loadModelClass,loadModel} from '../src/loaders.js';
import * as api from '../src/index.js';
export async function checkAtomStickSeries(){
 const expected=JSON.parse(await readFile(new URL('../docs/research/atom-stick-series-2026-10-28/coverage.json',import.meta.url),'utf8'));
 const catalog=JSON.parse(await readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
 assert.equal(expected.products.length,24);assert.equal(expected.products.filter(p=>p.series==='Atom').length,16);assert.equal(expected.products.filter(p=>p.series==='Stick').length,8);
 assert.equal(new Set(expected.products.map(p=>p.sku)).size,24);assert.equal(new Set(expected.products.map(p=>p.id)).size,24);
 const missing=expected.products.filter(x=>!catalog.products.some(p=>p.id===x.id));assert.deepEqual(missing.map(x=>x.id),[],'Every exact dated Atom and Stick SKU,including kits/historical revisions,must be present');
 const noop=()=>{},previous=globalThis.document,ctx=new Proxy({measureText:()=>({width:20}),createRadialGradient:()=>({addColorStop:noop}),createLinearGradient:()=>({addColorStop:noop})},{get:(o,k)=>o[k]??noop});if(!previous)globalThis.document={createElement:()=>({getContext:()=>ctx})};
 const rows=[];let configurations=0;
 try{
  for(const x of expected.products){const p=catalog.products.find(p=>p.id===x.id);assert.equal(p.sku,x.sku);assert.equal(p.category,'controller');assert.ok(p.entry&&p.stage==='modeled');const mod=await import(new URL('../'+p.entry,import.meta.url));const C=await loadModelClass(x.id);assert.equal(C,mod[p.export]);assert.equal(api[x.publicAlias],C,x.id+' top-level alias is the actual lazy class');
   const cases=p.configurations?.length?p.configurations:[{id:'default',options:{}}],result=[];
   if(mod.configurations)assert.deepEqual(cases.map(c=>[c.id,c.options??{}]),mod.configurations.map(c=>[c.id,c.options??{}]),x.id+' declared configurations match actual entry');
   for(const conf of cases){const m=await loadModel(x.id,conf.options??{});try{m.root;assert.equal(m.constructor,C);assert.equal(m.meta.sku,x.sku);for(const [alias,target]of Object.entries(p.integration?.controlMap??{})){assert.equal(typeof target,'string');const path=x.controlMapDirection==='model-to-runtime'?alias:target;assert.ok(m.get(path),x.id+'/'+path+' maps to a real implemented component in the declared direction');}if(p.integration?.displayTarget)assert.equal(m.display(p.integration.displayTarget).kind,'display');result.push({id:conf.id,options:conf.options??{},buttons:m.list('button').map(c=>c.id),displays:m.list('display').map(c=>[c.id,c.width,c.height]),grovePorts:m.list('port').filter(c=>c.connector==='grove').map(c=>c.id)});configurations++;}finally{m.dispose();}}
   rows.push({id:x.id,sku:x.sku,series:x.series,publicAlias:x.publicAlias,controlMapDirection:x.controlMapDirection,status:'pass',configurations:result});
  }
 }finally{if(!previous)delete globalThis.document;}
 return{status:'pass',date:expected.date,atom:16,stick:8,exactProducts:rows.length,configurations,rows,scope:'Dated official selector plus two historical Stick pages;actual public aliases/direct classes/lazy loaders/configurations and real component target existence. Dynamics,GPU/browser and physical-device evidence remain separate.'};
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkAtomStickSeries(),null,2));
