import fs from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const data=JSON.parse(await fs.readFile(path.join(root,'catalog/products.json'),'utf8'));
const ids=new Set();
for(const p of data.products){
 if(ids.has(p.id))throw new Error(`Duplicate product ${p.id}`);ids.add(p.id);
 if(p.scope!=='visual-only')throw new Error(`Scope mismatch: ${p.id}`);
 if(!['planned','researched','modeled','verified'].includes(p.stage))throw new Error(`Invalid stage ${p.id}`);
 if(p.nominalMm&&p.nominalMm.some(x=>!Number.isFinite(x)||x<=0))throw new Error(`Invalid dimensions ${p.id}`);
 if(['modeled','verified'].includes(p.stage)){if(!p.entry)throw new Error(`Missing model entry ${p.id}`);await fs.access(path.join(root,p.entry));}
 if(p.stage==='verified'){
  if(!p.verification.geometry||!p.verification.visual?.report)throw new Error(`Missing verification ${p.id}`);
  await fs.access(path.join(root,p.verification.visual.report));
  for(const view of ['front','back','iso']){if(!p.verification.visual[view])throw new Error(`Missing ${view} evidence: ${p.id}`);await fs.access(path.join(root,p.verification.visual[view]));}
 }
}
await fs.mkdir(path.join(root,'public/data'),{recursive:true});
await fs.writeFile(path.join(root,'public/data/catalog.json'),JSON.stringify(data,null,2)+'\n');
const implemented=data.products.filter(p=>p.entry);
const imports=implemented.map(p=>`  ${JSON.stringify(p.id)}: {load:()=>import(${JSON.stringify('../'+p.entry.replace(/^src\//,''))}),exportName:${JSON.stringify(p.export)},moduleExport:${JSON.stringify(p.integration?.moduleExport??null)}}`);
const loaderSource=`// Generated from catalog/products.json by npm run catalog. No hardware behavior.\nconst bindings={\n${imports.join(',\n')}\n};\nexport const implementedModelIds=Object.freeze(Object.keys(bindings));\nexport async function loadModelClass(id){const b=bindings[id];if(!b)throw new Error('Visual model is not implemented: '+id);return (await b.load())[b.exportName];}\nexport async function loadModel(id,options={}){const C=await loadModelClass(id);return new C(options);}\nexport async function loadGroveModule(id,options={}){const b=bindings[id];if(!b?.moduleExport)throw new Error('No Grove visual module: '+id);const C=(await b.load())[b.moduleExport];return new C(options);}\n`;
await fs.writeFile(path.join(root,'src/loaders.js'),loaderSource.replaceAll('import("../','import("./'));
const counts={};for(const p of data.products)counts[p.stage]=(counts[p.stage]??0)+1;
const rows=data.products.map(p=>`| ${p.category==='controller'?'主机':'Unit'} | ${p.name} | ${p.stage} | ${p.nominalMm?.join(' × ')??'待确认'} | ${p.nextAction} |`);
await fs.writeFile(path.join(root,'docs/STATUS.md'),`# 当前进度\n\n由 npm run catalog 生成；catalog/products.json 为权威状态。\n\n范围：精细外观建模，行为由下游模拟器负责。主机 ${data.products.filter(p=>p.category==='controller').length} 款，Unit ${data.products.filter(p=>p.category==='unit').length} 款。\n\n状态计数：${JSON.stringify(counts)}。modeled 表示已有实现，不表示已完成视觉验收。\n\n| 类别 | 产品 | 阶段 | 名义尺寸 X × Y × Z / mm | 下一步 |\n| --- | --- | --- | --- | --- |\n${rows.join('\n')}\n`);
console.log(`Catalog valid: ${data.products.length} products; ${JSON.stringify(counts)}`);
