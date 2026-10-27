/** Optional catalog metadata must never prevent a model from loading. */
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stages={planned:'待收集资料',researched:'资料阶段',modeled:'模型待验收',verified:'外观已验收'};

export function renderProductDetails(product,configuration=null){
 const dimensions=configuration?.nominalMm??product.nominalMm??product.size;
 const size=Array.isArray(dimensions)&&dimensions.length===3&&dimensions.every(x=>Number.isFinite(x)&&x>0)
  ?dimensions.join(' × ')+' mm':'待补充尺寸依据';
 const limitations=Array.isArray(product.limitations)?product.limitations:[];
 const source=typeof product.officialDocs==='string'&&product.officialDocs
  ?`<a class="source-link" href="${escape(product.officialDocs)}" target="_blank" rel="noreferrer">官方产品资料 ↗</a>`:'';
 return{
  facts:`<p class="eyebrow">${product.category==='controller'?'CONTROLLER':'UNIT'} / VISUAL MODEL</p><h2>${escape(product.name)}<small>${escape(product.sku)}</small></h2><div class="facts-grid"><div class="fact"><span>官方名义尺寸 X × Y × Z</span><strong>${escape(size)}</strong></div><div class="fact"><span>模型职责</span><strong>几何 / 材质 / 视觉映射</strong></div><div class="fact"><span>显示像素</span><strong>${product.display?`${escape(product.display.width)} × ${escape(product.display.height)}`:'无显示屏'}</strong></div><div class="fact"><span>运行时</span><strong>由外部模拟器驱动</strong></div></div>`,
  progress:`<p class="progress-line">${stages[product.stage]??'资料待补充'}${product.stage==='modeled'?' · 已有实现，尚未完成本仓库验收':''}</p><p class="next-action">下一步：${escape(product.nextAction??'继续依据本款资料核准外观细节')}</p>${limitations.map(t=>`<p class="limitation">${escape(t)}</p>`).join('')}${source}`
 };
}
