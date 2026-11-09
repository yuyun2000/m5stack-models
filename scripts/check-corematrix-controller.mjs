import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import * as THREE from 'three';
import {Model, spec} from '../src/devices/corematrix/index.js';

function checkSource(housing) {
  const facetCount = 17152;
  const data = Buffer.alloc(84 + facetCount * 50);
  data.fill(0x20, 0, 80);
  data.write('solid COREMATRIX-V1_2_10\0');
  data.writeUInt32LE(facetCount, 80);
  const seen = new Set();
  const bounds = new THREE.Box3();
  for (const part of [housing.shell, ...housing.buttons.map(key => key.mesh)]) {
    const {attributes: {position, normal}, index, userData} = part.geometry;
    bounds.union(part.geometry.boundingBox.clone().translate(part.position));
    assert.equal(index.count, userData.sourceFaces.length * 3);
    for (const [i, face] of userData.sourceFaces.entries()) {
      assert.ok(!seen.has(face));
      seen.add(face);
      let offset = 84 + face * 50;
      const n = index.getX(i * 3);
      for (const v of normal.array.subarray(n * 3, n * 3 + 3)) {
        data.writeFloatLE(v, offset);
        offset += 4;
      }
      for (let j = 0; j < 3; j++) {
        const p = index.getX(i * 3 + j);
        for (const v of position.array.subarray(p * 3, p * 3 + 3)) {
          data.writeFloatLE(v, offset);
          offset += 4;
        }
      }
      data.writeUInt16LE(userData.sourceAttributeWord, offset);
    }
  }
  const size = bounds.getSize(new THREE.Vector3()).toArray();
  size.forEach((value, i) => assert.ok(Math.abs(value - spec.size[i]) < 1e-4));
  assert.equal(seen.size, facetCount);
  const sourceSha256 = createHash('sha256').update(data).digest('hex');
  assert.equal(sourceSha256, '177902e9d3c1ebf61fdf71c985e278aab8d09ae9a4caeef800b3bae715400c80');
  return {facets: facetCount, sourceSha256, size};
}

function firstRay(host, origin, direction, {physical = false} = {}) {
  const ray = new THREE.Raycaster(origin, direction);
  return ray.intersectObject(host.root, true).find(hit =>
    !physical || hit.object.userData.component?.kind !== 'port');
}

function keyRay(host, key, u, v) {
  const origin = new THREE.Vector3(...key.meta.surfaceCenter);
  if (key.id === 'power') origin.y += u;
  else origin.x += u;
  origin.z += v;
  const inward = new THREE.Vector3(...key.key.inward);
  origin.addScaledVector(inward, -3);
  return firstRay(host, origin, inward);
}

function keyHits(host, key) {
  return [[0, 0], [-2.9, 0], [2.9, 0], [0, -2.2], [0, 1.8], [-2.6, 1.5], [2.6, 1.5]].map(([u, v]) => {
    const hit = keyRay(host, key, u, v);
    const binding = hit?.object.userData.componentHit;
    assert.equal(binding?.component, key, `${key.id} surface ${u},${v}`);
    assert.ok(binding.filter(hit));
    return hit.distance;
  });
}

function checkMotion(host, housing) {
  const state = part => ['position', 'normal'].map(name => part.geometry.attributes[name].array.slice());
  const fixed = state(housing.shell);
  const original = housing.buttons.map(key => state(key.mesh));
  const events = [];
  const off = host.on('input', event => events.push(event));
  const keys = host.list('button');
  assert.deepEqual(keys.map(key => key.id), ['btnA', 'btnB', 'btnC', 'power']);
  for (const [i, key] of keys.entries()) {
    const rest = keyHits(host, key);
    const neighborU = key.id === 'power' ? 4.85 : 5.2;
    const neighbor = keyRay(host, key, neighborU, 0);
    assert.ok(neighbor && !neighbor.object.userData.componentHit?.filter(neighbor));
    key.onPointerDown({pointerId: 11});
    key.press('hold');
    host.update(.015, 0);
    const partial = keyHits(host, key);
    key.onPointerCancel({pointerId: 11});
    assert.equal(key.getState().pressed, true);
    host.update(.2, .2);
    const down = keyHits(host, key);
    down.forEach((distance, j) => {
      assert.ok(partial[j] > rest[j] && distance > partial[j], key.id + ' inward motion');
    });
    const currentNeighbor = keyRay(host, key, neighborU, 0);
    assert.ok(!currentNeighbor.object.userData.componentHit?.filter(currentNeighbor));
    assert.ok(Math.abs(currentNeighbor.distance - neighbor.distance) < 1e-5);
    assert.deepEqual(state(housing.shell), fixed);
    for (const [other, button] of keys.entries()) if (i !== other) {
      assert.deepEqual(state(button.mesh), original[other]);
    }
    key.release('hold');
    host.update(.2, .4);
    assert.deepEqual(state(key.mesh), original[i]);
    assert.deepEqual(keyHits(host, key), rest);
  }
  off();
  assert.deepEqual(events.map(event => [event.id, event.action, !!event.cancelled]),
    keys.flatMap(key => [[key.id, 'down', false], [key.id, 'up', true]]));
  return {keys: keys.length, samplesPerKey: 7};
}

function checkDisplay(host) {
  const display = host.display('display');
  assert.equal(display.meta.controller, 'TM1680');
  assert.equal(display.meta.i2cAddress, 0x72);
  assert.equal(display.getState().touch, false);
  const intensities = Uint8Array.from({length: 256}, (_, i) => i);
  host.handle({type: 'display', target: 'display', format: 'gray8', data: intensities});
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    const level = intensities[y * 16 + x];
    assert.deepEqual(display.getPixel(x, y), [level, level, level]);
    const ray = firstRay(host, new THREE.Vector3(
      (x + .5 - 8) * display.size[0] / 16, (7.5 - y) * display.size[1] / 16 - .1, 15,
    ), new THREE.Vector3(0, 0, -1));
    assert.equal(ray?.object, display.panel);
    assert.deepEqual(display.uvToPixel(ray.uv), {x, y});
  }
  host.handle({type: 'display', target: 'display', format: 'gray8', data: [64, 127], x: 9, y: 3, w: 2, h: 1});
  assert.deepEqual(display.getPixel(10, 3), [127, 127, 127]);
  assert.throws(() => display.writeGray8(new Uint8Array(255)), /one gray8 byte/);
  assert.deepEqual(display.getPixel(10, 3), [127, 127, 127]);
  host.handle({type: 'display', target: 'display', format: 'rgb565', data: Uint16Array.of(0xf800), x: 0, y: 0, w: 1, h: 1});
  assert.deepEqual(display.getPixel(0, 0), [255, 0, 0]);
  host.handle({type: 'display', target: 'display', power: false});
  assert.equal(display.material.uniforms.brightness.value, 0);
  host.handle({type: 'display', target: 'display', power: true, backlight: .4});
  assert.equal(display.material.uniforms.brightness.value, .4);
  host.update(.016, .5);
  assert.ok(display.texture.version > 1);
  return {pixels: intensities.length, resolution: [display.width, display.height]};
}

function checkOpenings(host) {
  const checks = [
    ['USB-C', [-30, 0, -.82], [1, 0, 0], 'USB-C centered tongue'],
    ['microSD', [7, -30, -.61], [0, 1, 0], 'microSD insulating backstop'],
    ['rear USB', [-22.05, 6.65, -15], [0, 0, 1], 'Connector deep dielectric stop'],
    ['rear battery', [-22.05, -6.65, -15], [0, 0, 1], 'Connector deep dielectric stop'],
    ['rear carrier', [0, 0, -15], [0, 0, 1], 'Rear carrier with M3 and connector cutouts'],
  ];
  for (const [label, start, vector, expected] of checks) {
    const hit = firstRay(host, new THREE.Vector3(...start), new THREE.Vector3(...vector), {physical: true});
    assert.equal(hit?.object.name, expected, label);
  }
  assert.equal(host.port('grove').connector, 'grove');
  assert.deepEqual(host.port('grove').pins.map(pin => pin.name), ['GND', '5V', 'G0', 'G1']);
  return checks.length;
}

export async function checkCoreMatrixController() {
  const host = new Model({artwork: false});
  try {
    host.root.updateMatrixWorld(true);
    const housing = host.coreMatrixHousing;
    const native = checkSource(housing);
    const motion = checkMotion(host, housing);
    const display = checkDisplay(host);
    const openings = checkOpenings(host);
    return {status: 'pass', native, motion, display, openings};
  } finally {
    host.dispose();
  }
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  console.log(JSON.stringify(await checkCoreMatrixController(), null, 2));
}
