import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {renderProductDetails} from '../demo/product-details.js';

// Run the actual page controller with only its DOM, renderer and import boundary
// replaced. This checks selection recovery; actual browser pixels are separate.
const source=await fs.readFile(new URL('../demo/main.js',import.meta.url),'utf8');
const controller=source.replace(/^import .*;\n/gm,'').replace(/^init\(\)\.catch\(.*\);\s*$/m,'');
assert.ok(!controller.includes('init().catch'),'fixture must not start the browser app');
const catalog=JSON.parse(await fs.readFile(new URL('../catalog/products.json',import.meta.url),'utf8'));
const ui=new Map();
const element=()=>({dataset:{},hidden:false,innerHTML:'',textContent:'',children:[],classList:{toggle(){}},setAttribute(){},append(child){this.children.push(child);},replaceChildren(){this.children=[];}});
const query=selector=>{if(!ui.has(selector))ui.set(selector,element());return ui.get(selector);};
const history=[],errors=[],models=[];
let implementation=async()=>Model;
class Model{
 constructor(){this.scene={traverse(){}};this.disposed=false;models.push(this);}
 get root(){return this.scene;}
 dispose(){this.disposed=true;}
}
const renders=[];
const viewer={mount(){},unmount(){},setView(){},fit(){},once(event,callback){renders.push(callback);},requestRender(){for(const callback of renders.splice(0))callback();}};
const panel={bind(){},unbind(){}};
const context=vm.createContext({document:{querySelector:query,querySelectorAll:()=>[],createElement:element},console:{error:e=>errors.push(e.message)},history:{replaceState:(_a,_b,url)=>history.push(url)},renderProductDetails,loadModelClass:id=>implementation(id),catalogData:catalog,viewerStub:viewer,panelStub:panel});
vm.runInContext(controller,context,{filename:'demo/main.js'});
vm.runInContext('catalog=catalogData;viewer=viewerStub;dynamics=panelStub;framebuffers=panelStub;',context);
const select=(id,configuration)=>vm.runInContext(`select(${JSON.stringify(id)},${JSON.stringify(configuration)})`,context);
const cases=[];

for(const product of catalog.products.filter(p=>!Array.isArray(p.limitations))){
 await select(product.id);
 assert.equal(query('#stage').dataset.state,'ready',product.id);
 assert.equal(query('#stage').dataset.model,product.id);
 assert.equal(query('#error').hidden,true,product.id);
}
cases.push('all-31-products-without-limitations-reach-ready');
await select('qrcode','direct');
assert.match(query('#configuration').innerHTML,/直视|Direct|direct/i,'configuration label/id is visible without name');
assert.ok(!query('#configuration').innerHTML.includes('></option>'),'configuration choices are not blank');
cases.push('configuration-label-fallback');

let attempts=0,failed;
implementation=async()=>class extends Model{
 constructor(){super();this.attempt=++attempts;if(this.attempt===1)failed=this;}
 get root(){if(this.attempt===1)throw new Error('build probe failed');return super.root;}
};
await select('button');
assert.equal(query('#stage').dataset.state,'error');
assert.equal(query('#loading').hidden,true);
assert.match(query('#error').textContent,/build probe failed/);
assert.equal(failed.disposed,true);
await select('button');
assert.equal(query('#stage').dataset.state,'ready');
assert.equal(attempts,2,'failed models must not be cached');
assert.equal(query('#error').hidden,true);
cases.push('lazy-build-failure-visible-and-retry-creates-new-model');

let rejectOld;
implementation=id=>id==='pir'?new Promise((_resolve,reject)=>{rejectOld=reject;}):Promise.resolve(Model);
const stale=select('pir');
await select('env-iii');
const currentUrl=history.at(-1);
rejectOld(new Error('outdated import probe'));
await stale;
assert.equal(query('#stage').dataset.model,'env-iii');
assert.equal(query('#stage').dataset.state,'ready');
assert.equal(query('#error').hidden,true);
assert.equal(history.at(-1),currentUrl);
cases.push('stale-import-error-cannot-overwrite-new-selection');

let imports=0;
implementation=async()=>{imports++;return Model;};
await select('light');await select('env-iii');await select('light');
assert.equal(imports,1,'successful models are reused on return');
assert.equal(query('#stage').dataset.state,'ready');
cases.push('successful-selection-cache-reuse');
assert.deepEqual(errors,['build probe failed']);
for(const model of models)if(!model.disposed)model.dispose();

// Boot the real controller at both hosting roots. A project site must request
// its own catalog and preserve the shared model/configuration query on selection.
for(const href of ['http://127.0.0.1:5188/?model=dial&configuration=complete','https://yuyun2000.github.io/m5stack-models/?model=dial&configuration=complete','https://yuyun2000.github.io/m5stack-models/index.html?model=dial&configuration=complete']){
 const nodes=new Map(),requests=[],urls=[],location={href};
 const get=s=>{if(!nodes.has(s))nodes.set(s,element());return nodes.get(s);};
 const expected=new URL(href).pathname.startsWith('/m5stack-models/')?'/m5stack-models/data/catalog.json':'/data/catalog.json';
 const boot=vm.createContext({document:{querySelector:get,querySelectorAll:()=>[],createElement:element},URL,location,console,history:{replaceState:(_a,_b,url)=>{location.href=new URL(url,location.href).href;urls.push(location.href);}},fetch:async url=>{const resolved=new URL(url,href);requests.push(resolved.href);return{ok:resolved.pathname===expected,json:async()=>catalog};},renderProductDetails,loadModelClass:async()=>Model,DeviceViewer:class{constructor(){return viewer;}},DynamicsPanel:class{constructor(){return panel;}},FramebufferPanel:class{constructor(){return panel;}}});
 vm.runInContext(controller,boot,{filename:'demo/main.js'});await vm.runInContext('init()',boot);
 assert.equal(requests.length,1);assert.equal(new URL(requests[0]).pathname,expected);
 assert.equal(get('#stage').dataset.state,'ready');assert.equal(get('#stage').dataset.model,'dial');
 const final=new URL(urls.at(-1));assert.equal(final.pathname,new URL(href).pathname);assert.equal(final.searchParams.get('model'),'dial');assert.equal(final.searchParams.get('configuration'),'complete');
}
cases.push('root-and-github-pages-project-path-boot-with-shared-model-query');
console.log(JSON.stringify({status:'pass',cases,scope:'Actual demo/main.js controller with DOM,viewer and import boundary fixtures;no geometry or browser pixel acceptance'},null,2));
