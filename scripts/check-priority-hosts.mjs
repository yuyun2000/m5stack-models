import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as THREE from 'three';
import * as models from '../src/index.js';
import {loadModel} from '../src/loaders.js';

// Only the LED glow's canvas drawing is stubbed in this Node fixture.
const noop = () => {};
const context = {
  createRadialGradient: () => ({addColorStop:noop}),
  fillRect: noop,
};
globalThis.document ??= {createElement: () => ({getContext: () => context})};

const catalog = JSON.parse(await readFile(new URL('../catalog/products.json', import.meta.url), 'utf8'));
const cases = [
  ['paperdiy', 'K159-B', 'PaperDIY', 'lcd', 540, 960, false],
  ['papers3', 'C139', 'PaperS3', 'lcd', 540, 960, true],
  ['cardputer', 'K132', 'Cardputer', 'lcd', 240, 135, false],
  ['corematrix', 'C158', 'CoreMatrix', 'display', 16, 16, false],
];

for (const [id, sku, exportName, target, width, height, touch] of cases) {
  const product = catalog.products.find(entry => entry.id === id);
  assert.equal(product.sku, sku);
  assert.equal(product.integration.displayTarget, target);
  assert.deepEqual([product.display.width, product.display.height, product.display.touch], [width, height, touch]);
  const model = await loadModel(id, {artwork:false});
  try {
    assert.equal(model.constructor, models[exportName], `${id}: root export and lazy loader agree`);
    const bounds = new THREE.Box3().setFromObject(model.root);
    const size = bounds.getSize(new THREE.Vector3()).toArray();
    const expectedSize = product.cadEnvelopeMm ?? product.nominalMm;
    assert.ok(size.every((mm, axis) => Math.abs(mm - expectedSize[axis]) < 2), `${id}: actual envelope ${size}`);
    const display = model.display(target);
    assert.deepEqual([display.width, display.height, display.touchEnabled], [width, height, touch]);
    assert.deepEqual(display.uvToPixel({x:0,y:1}), {x:0,y:0});
    assert.deepEqual(display.uvToPixel({x:1,y:0}), {x:width-1,y:height-1});
    const inputs = [];
    const unsubscribe = model.on('input', input => inputs.push(input));

    if (id === 'corematrix') {
      const intensities = new Uint8Array(16 * 16);
      intensities[15] = 128;
      intensities[15 * 16] = 255;
      model.handle({type:'display', target, format:'gray8', data:intensities});
      assert.deepEqual(display.getPixel(15, 0), [128, 128, 128]);
      assert.deepEqual(display.getPixel(0, 15), [255, 255, 255]);
      assert.deepEqual(display.getPixel(15, 15), [0, 0, 0]);
    } else {
      model.handle({type:'display', target, format:'rgb565', x:0, y:0, w:2, h:1,
        data:new Uint16Array([id === 'cardputer' ? 0xf800 : 0xffff, 0])});
      assert.deepEqual(display.getPixel(0, 0), id === 'cardputer' ? [255, 0, 0] : [255, 255, 255]);
      assert.deepEqual(display.getPixel(1, 0), [0, 0, 0]);
    }
    assert.equal(inputs.length, 0, `${id}: output writes do not generate input`);
    for (const button of Object.keys(product.integration.controlMap)) assert.ok(model.button(button));

    if (touch) {
      display.onPointerDown({pointerId:1,uv:{x:0,y:1}});
      display.onPointerDown({pointerId:2,uv:{x:1,y:0}});
      display.onPointerUp({pointerId:1});
      display.onPointerCancel({pointerId:2});
      assert.deepEqual(inputs.map(({id,action,x,y}) => [id,action,x,y]), [
        [target,'start',0,0], [target,'start',width-1,height-1],
        [target,'end',0,0], [target,'end',width-1,height-1],
      ]);
      assert.equal(display.touches.size, 0);
    }
    if (id === 'cardputer') {
      const keys = model.list('button').filter(button => button.id.startsWith('key-'));
      assert.equal(keys.length, 56);
      assert.equal(new Set(keys.map(button => button.meta.matrix.join(','))).size, 56);
      assert.equal(new Set(keys.map(button => JSON.stringify(button.meta.scan))).size, 56);
      assert.equal(model.keymap.KeyA, 'key-KeyA');
      assert.equal(model.button('power').latching, true);
    }
    unsubscribe();

    const artworkModel = await loadModel(id);
    try {
      const prints = [];
      artworkModel.root.traverse(object => {
        if (object.userData?.role === 'printed-artwork') prints.push(object);
      });
      assert.equal(prints.length, {
        paperdiy: 1, papers3: 1, cardputer: 11, corematrix: 2,
      }[id], `${id}: expected official print layers`);
      assert.ok(prints.every(panel => !panel.userData.artworkKind.includes('reference-redraw')),
        `${id}: production layers must not use reference redraws`);
      const names = new Set(prints.map(panel => panel.name));
      for (const expected of {
        paperdiy: ['PaperDIY official rear print'],
        papers3: ['PaperS3 official rear production print'],
        cardputer: ['Cardputer M5 wordmark', 'Stamp-S3 circuit cover print', 'Cardputer rear pin legend print'],
        corematrix: ['CoreMatrix official rear production print', 'CoreMatrix official side name print'],
      }[id]) assert.ok(names.has(expected), `${id}: missing ${expected}`);
    } finally {
      artworkModel.dispose();
    }
    console.log(`PASS ${id} ${sku}: ${width}×${height} ${target}, envelope ${size.map(mm => mm.toFixed(2)).join('×')} mm`);
  } finally {
    model.dispose();
  }
}
