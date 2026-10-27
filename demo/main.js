import '../tokens.css';
import './style.css';
import * as THREE from 'three';
import {DeviceViewer} from '../src/core/DeviceViewer.js';
import {loadModelClass} from '../src/loaders.js';
import {DynamicsPanel} from './dynamics.js';
import {FramebufferPanel} from './framebuffers.js';
import {renderProductDetails} from './product-details.js';
const $=s=>document.querySelector(s), escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stages={planned:'待收集资料',researched:'资料阶段',modeled:'模型待验收',verified:'外观已验收'};
let configuration=null;
let dynamics,framebuffers;
let catalog,viewer,current,product,category='all',query='',wire=false,version=0;
const cache=new Map();
function error(message){$('#error').hidden=false;$('#error').textContent=message;}
function list(){const all=catalog.products.filter(p=>(category==='all'||p.category===category)&&`${p.id} ${p.name} ${p.sku}`.toLowerCase().includes(query));const box=$('#product-list');box.replaceChildren();for(const type of ['controller','unit']){const group=all.filter(p=>p.category===type);if(!group.length)continue;const heading=document.createElement('p');heading.className='group-title';heading.textContent=type==='controller'?'CONTROLLERS / 主机':'UNITS / 功能单元';box.append(heading);for(const p of group){const b=document.createElement('button');b.className=`product-option ${p.id===product?.id?'selected':''}`;b.dataset.product=p.id;b.setAttribute('aria-pressed',String(p.id===product?.id));b.innerHTML=`<span>${String(catalog.products.indexOf(p)+1).padStart(2,'0')}</span><div><strong>${escape(p.name)}</strong><small>${escape(p.sku)} · ${stages[p.stage]}</small></div><span class="dot ${p.stage}"></span>`;b.onclick=()=>select(p.id);box.append(b);}}if(!all.length)box.innerHTML='<p class="empty">没有匹配的产品</p>';}
function setWire(on){wire=on;if(current)current.root.traverse(o=>{if(!o.isMesh)return;if(!o.userData.originalMaterial)o.userData.originalMaterial=o.material;if(on){const original=o.userData.originalMaterial;if(!o.userData.wireMaterial)o.userData.wireMaterial=new THREE.MeshBasicMaterial({color:0x6b9fb6,wireframe:true});o.userData.wireMaterial.wireframe=true;if('color'in o.userData.wireMaterial)o.userData.wireMaterial.color.set(0x6b9fb6);o.material=o.userData.wireMaterial;}else o.material=o.userData.originalMaterial;});$('#wireframe').setAttribute('aria-pressed',String(on));viewer?.requestRender();}
function view(name){if(current){viewer.setView(name,{duration:1});viewer.once('render',()=>viewer.fit({padding:1.35}));}document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===name));}
function facts(p){const detail=renderProductDetails(p,configuration);$('#facts').innerHTML=detail.facts;$('#progress').innerHTML=detail.progress;}
async function select(id,configurationId){
 const token=++version;
 let model=null,cacheKey=null;
 try{
  const selected=catalog.products.find(p=>p.id===id);
  if(!selected)throw new Error('找不到该型号');
  const configurations=Array.isArray(selected.configurations)?selected.configurations:[];
  const selectedConfiguration=configurations.find(c=>c.id===configurationId)??configurations[0]??null;
  product=selected;configuration=selectedConfiguration;
  $('#stage').dataset.state='loading';$('#stage').dataset.model=id;
  $('#error').hidden=true;$('#loading').hidden=false;$('#pending').hidden=true;
  framebuffers.unbind();dynamics.unbind();
  if(current){viewer.unmount(current);current=null;}
  const selector=$('#configuration');selector.hidden=configurations.length===0;
  selector.innerHTML=configurations.map(c=>`<option value="${escape(c.id)}" ${c===selectedConfiguration?'selected':''}>${escape(c.name??c.label??c.id)}</option>`).join('');
  selector.onchange=()=>select(id,selector.value);
  list();facts(selected);
  $('#model-tag').textContent=`${selected.name} / ${selected.sku}`;$('#model-state').textContent=stages[selected.stage];
  $('#reference-panel').hidden=true;$('#reference-toggle').setAttribute('aria-pressed','false');
  $('#reference-toggle').disabled=!selected.reference;$('#reference-image').src=selected.reference??'';
  $('#reference-image').alt=`${selected.name} 官方参考图`;
  if(!selected.entry){$('#loading').hidden=true;$('#pending').hidden=false;$('#pending-image').src=selected.reference??'';$('#pending-image').hidden=!selected.reference;$('#stage').dataset.state='pending';return;}
  cacheKey=id+':'+(selectedConfiguration?.id??'default');model=cache.get(cacheKey);
  if(!model){const C=await loadModelClass(id);if(token!==version)return;model=new C(selectedConfiguration?.options??{});}
  // A failed lazy build must not enter the cache or become a mounted device.
  model.root;
  current=model;viewer.mount(model);dynamics.bind(model,selected);setWire(wire);
  view('iso');viewer.fit({padding:1.2});framebuffers.bind(model);cache.set(cacheKey,model);
  $('#loading').hidden=true;viewer.once('render',()=>{if(token===version)$('#stage').dataset.state='ready';});
  viewer.requestRender();history.replaceState(null,'',`?model=${encodeURIComponent(id)}${selectedConfiguration?'&configuration='+encodeURIComponent(selectedConfiguration.id):''}`);
 }catch(e){
  if(token!==version)return;
  framebuffers.unbind();dynamics.unbind();
  if(model){viewer.unmount(model);cache.delete(cacheKey);model.dispose();}
  current=null;$('#loading').hidden=true;$('#stage').dataset.state='error';
  error(`模型加载失败：${e.message}；可重新点击该型号重试。`);console.error(e);
 }
}
async function init(){catalog=await fetch('/data/catalog.json').then(r=>{if(!r.ok)throw new Error('产品目录未生成，请运行 npm run catalog');return r.json();});const n=catalog.products.filter(p=>p.entry).length;$('#coverage').innerHTML=`<div><strong>${catalog.products.filter(p=>p.category==='controller').length}</strong>款主机</div><div><strong>${catalog.products.filter(p=>p.category==='unit').length}</strong>款 Unit</div><div><strong>${n}</strong>已有实现</div>`;viewer=new DeviceViewer($('#stage'),{ground:false,shadows:false,keyboard:'focused',fov:26,maxDistance:1800,exposure:1.08});framebuffers=new FramebufferPanel({selector:$('#display-target'),button:$('#calibration')});dynamics=new DynamicsPanel($('#dynamics'),{viewer,catalog,onGeometryChange:()=>{setWire(wire);framebuffers.refresh();}});$('#search').oninput=e=>{query=e.target.value.toLowerCase().trim();list();};document.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{category=b.dataset.category;document.querySelectorAll('[data-category]').forEach(x=>x.classList.toggle('active',x===b));list();});document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>view(b.dataset.view));$('#reset').onclick=()=>{view('iso');viewer.fit({padding:1.2});};$('#wireframe').onclick=()=>setWire(!wire);$('#reference-toggle').onclick=e=>{const on=e.currentTarget.getAttribute('aria-pressed')!=='true';e.currentTarget.setAttribute('aria-pressed',String(on));$('#reference-panel').hidden=!on;};const id=new URL(location.href).searchParams.get('model');await select(catalog.products.some(p=>p.id===id)?id:'sticks3',new URL(location.href).searchParams.get('configuration'));}
init().catch(e=>{$('#loading').hidden=true;$('#stage').dataset.state='error';error(e.message);});
