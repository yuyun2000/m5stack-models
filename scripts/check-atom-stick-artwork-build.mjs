/** MIT. Prove new-series ordinary PNGs are present in the actual production build. */
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
const hash=b=>createHash('sha256').update(b).digest('hex');
const prior=new Set(['atom-lite','atom-matrix','atoms3','atoms3-lite','atoms3r','sticks3','stickc-plus2']);
export async function checkAtomStickArtworkBuild(){
 const {products}=JSON.parse(await readFile(new URL('../docs/research/atom-stick-series-2026-10-28/coverage.json',import.meta.url),'utf8'));
 const assets=new Map(),inline=new Set(),files=await readdir(new URL('../dist/assets/',import.meta.url));
 for(const file of files){const b=await readFile(new URL('../dist/assets/'+file,import.meta.url));if(file.endsWith('.png'))assets.set(hash(b),file);if(file.endsWith('.js'))for(const m of b.toString().matchAll(/data:image\/png;base64,([A-Za-z0-9+/=]+)/g))inline.add(hash(Buffer.from(m[1],'base64')));}
 const rows=[];
 for(const p of products.filter(p=>!prior.has(p.id))){const folder=new URL('../src/devices/'+p.id+'/artwork/',import.meta.url);let pngs=[];try{pngs=(await readdir(folder)).filter(f=>f.endsWith('.png'));}catch(e){if(e.code!=='ENOENT')throw e;}
  for(const file of pngs){const b=await readFile(new URL(file,folder));assert.equal(b.subarray(0,8).toString('hex'),'89504e470d0a1a0a');const chunks=[];for(let i=8;i<b.length;){const n=b.readUInt32BE(i),type=b.toString('ascii',i+4,i+8);assert.ok(i+12+n<=b.length,'valid PNG chunk framing');chunks.push(type);i+=12+n;}assert.ok(chunks.includes('IHDR')&&chunks.includes('IDAT')&&chunks.includes('IEND'));assert.ok(!chunks.some(c=>['tEXt','zTXt','iTXt','eXIf'].includes(c)),p.id+'/'+file+' private metadata excluded');const sha=hash(b),asset=assets.get(sha);assert.ok(asset||inline.has(sha),p.id+'/'+file+' actual PNG bytes must be bundled;dynamic source URL alone is insufficient');rows.push({id:p.id,file,sha256:sha,productionAsset:asset??'inlined-data-url',width:b.readUInt32BE(16),height:b.readUInt32BE(20)});}
 }
 assert.ok(rows.length>0);return{status:'pass',newProducts:products.filter(p=>!prior.has(p.id)).length,pngs:rows.length,rows,scope:'Byte-exact actual production PNG assets or decoded inlined bytes;ordinary PNG metadata check. GPU texture readiness/browser placement is verified separately.'};
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url)console.log(JSON.stringify(await checkAtomStickArtworkBuild(),null,2));
