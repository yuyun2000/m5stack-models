import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {renderProductDetails} from '../demo/product-details.js';
const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
let optionalRecords=0;
for(const product of catalog.products){
 const detail=renderProductDetails(product,product.configurations?.[0]);
 assert.match(detail.facts,/<h2>/,product.id);
 assert.ok(!detail.progress.includes('undefined'),product.id+':optional fields remain readable');
 if(!Array.isArray(product.limitations))optionalRecords++;
}
const atom=catalog.products.find(p=>p.id==='atom-matrix');
assert.match(renderProductDetails(atom).facts,/24 × 24 × 13.8 mm/,'size-only catalog metadata displays dimensions');
const minimal=renderProductDetails({name:'<script>',category:'unit',sku:'x',stage:'modeled',limitations:null});
assert.match(minimal.facts,/&lt;script&gt;/);assert.ok(!minimal.facts.includes('<script>'));
assert.match(minimal.progress,/继续依据本款资料/);assert.ok(!minimal.progress.includes('href='),'missing source is not a broken link');
assert.match(renderProductDetails(atom,{nominalMm:[1,2,3]}).facts,/1 × 2 × 3 mm/,'configuration dimensions take precedence');
console.log(JSON.stringify({status:'pass',catalogRecords:catalog.products.length,optionalLimitationsRecords:optionalRecords,scope:'Actual catalog detail rendering,optional metadata,size fallback and escaping;no geometry or historical fixture'},null,2));
