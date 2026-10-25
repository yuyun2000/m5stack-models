import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {FramebufferPanel} from '../demo/framebuffers.js';
import {Device, Module, Port, Display} from '../src/core/index.js';

const display = (meta = {}) => new Display({id:'lcd', width:16, height:12, size:[4,3], glass:false, meta});
class ScreenUnit extends Module {
  static meta = {id:'framebuffer-check-unit', name:'Screen test unit', connector:'grove'};
  build() {
    this.add(display({monochrome:true}));
    this.add(new Port({id:'output', connector:'grove'}));
  }
}
// Only browser controls are replaced. Routing, module ownership, detach events,
// display buffers and disposal are the actual public implementations.
function controls() {
  const selector = {value:'', replaceChildren(...children) { this.children = children; }};
  const button = {dataset:{}, attributes:{}, setAttribute(k,v) { this.attributes[k] = v; }};
  return {selector, button};
}
const snapshot = d => [...d.buffer];

export function checkDemoFramebuffers() {
  const savedDocument = globalThis.document;
  globalThis.document = {createElement:() => ({})};
  const models = [], cases = [];
  try {
    const ui = controls(), panel = new FramebufferPanel(ui);
    const host = new Device(); models.push(host);
    const root = host.add(display()), port = host.add(new Port({id:'grove',connector:'grove'}));
    panel.bind(host);
    assert.equal(ui.button.disabled,false); assert.equal(ui.selector.hidden,true);
    assert.equal(ui.selector.value,'lcd'); assert.deepEqual(snapshot(root).slice(0,4),[5,6,7,255]);
    panel.setCalibration(true);
    const rootFrame = snapshot(root);
    assert.equal(ui.button.attributes['aria-pressed'],'true'); cases.push('single-root calibration and dark rest');

    const parent = new ScreenUnit(); port.attach(parent);
    const child = new ScreenUnit(); parent.port('output').attach(child);
    const parentDisplay = parent.display(), childDisplay = child.display();
    parentDisplay.fill('#2468ab'); childDisplay.fill('#89abcd');
    const parentFrame = snapshot(parentDisplay), childFrame = snapshot(childDisplay);
    assert.deepEqual(ui.selector.children.map(c=>c.value),['lcd','grove/lcd','grove/output/lcd']);
    assert.equal(ui.selector.hidden,false);
    ui.selector.value = 'grove/output/lcd'; ui.selector.onchange();
    assert.deepEqual(snapshot(root),rootFrame); assert.deepEqual(snapshot(parentDisplay),parentFrame);
    assert.deepEqual(snapshot(childDisplay),childFrame,'selection itself preserves external framebuffer');
    ui.button.onclick();
    assert.notDeepEqual(snapshot(childDisplay),childFrame);
    assert.deepEqual(snapshot(root),rootFrame); assert.deepEqual(snapshot(parentDisplay),parentFrame);
    for(let i=0;i<childDisplay.buffer.length;i+=4) assert.ok(childDisplay.buffer[i]===childDisplay.buffer[i+1]&&childDisplay.buffer[i]===childDisplay.buffer[i+2],'monochrome target receives grayscale calibration');
    cases.push('nested target-only write and grayscale OLED pattern');

    let disposedWrites = 0;
    childDisplay.writeRGBA = childDisplay.fill = () => { disposedWrites++; throw Error('disposed target write'); };
    parent.port('output').detach();
    assert.equal(ui.selector.value,'lcd'); assert.deepEqual(snapshot(root),rootFrame);
    assert.equal(disposedWrites,0); cases.push('selected subtree removal falls back without a write');

    const replacement = new ScreenUnit(); parent.port('output').attach(replacement);
    ui.selector.value = 'grove/output/lcd'; ui.selector.onchange();
    assert.equal(ui.button.attributes['aria-pressed'],'false','same-path replacement has its own calibration state');
    ui.button.onclick(); assert.equal(ui.button.attributes['aria-pressed'],'true');
    assert.equal(disposedWrites,0); cases.push('same-path replacement uses current component identity');

    // No port event is required for a local Display replacement. A stale click
    // detects identity drift and refreshes without clearing the new framebuffer.
    ui.selector.value = 'lcd'; ui.selector.onchange();
    host.remove('lcd'); const newRoot = host.add(display()); newRoot.fill('#123456');
    const newRootFrame = snapshot(newRoot); ui.button.onclick();
    assert.deepEqual(snapshot(newRoot),newRootFrame); assert.equal(ui.button.attributes['aria-pressed'],'false');
    cases.push('stale local display replacement click does not overwrite pixels');

    panel.unbind(); const noScreen = new Device(); models.push(noScreen);
    const noScreenPort = noScreen.add(new Port({id:'grove',connector:'grove'})); panel.bind(noScreen);
    assert.equal(ui.button.disabled,true);
    const onlyScreen = new ScreenUnit(); noScreenPort.attach(onlyScreen);
    assert.equal(ui.button.disabled,false); assert.equal(ui.selector.value,'grove/lcd');
    ui.button.onclick(); assert.equal(ui.button.attributes['aria-pressed'],'true');
    noScreenPort.detach(); assert.equal(ui.button.disabled,true); assert.equal(ui.selector.value,'');
    cases.push('screenless host discovers and releases module-only display');

    panel.unbind(); const paperHost = new Device(); models.push(paperHost);
    const paper = paperHost.add(display({surface:'reflective'})); panel.bind(paperHost);
    panel.setCalibration(false); assert.deepEqual(snapshot(paper).slice(0,4),[228,225,213,255]);
    const paperFrame = snapshot(paper); port.detach();
    assert.deepEqual(snapshot(paper),paperFrame,'old model events are unsubscribed');
    panel.unbind(); cases.push('reflective rest color and model-switch cleanup');
    return {status:'pass', cases, caseCount:cases.length,
      scope:'Real recursive component routing and framebuffer ownership; form controls only are stubbed. Actual browser rendering is separate.'};
  } finally {
    for(const model of models) model.dispose();
    if(savedDocument === undefined) delete globalThis.document; else globalThis.document = savedDocument;
  }
}

if(process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  console.log('PASS demo framebuffers:',JSON.stringify(checkDemoFramebuffers()));
}
