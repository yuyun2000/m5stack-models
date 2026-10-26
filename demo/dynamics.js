import {loadGroveModule} from '../src/loaders.js';
import * as THREE from 'three';

const rad = degrees => Number(degrees) * Math.PI / 180;
const node = (tag, text, className) => {
  const el = document.createElement(tag);
  if (text != null) el.textContent = text;
  if (className) el.className = className;
  return el;
};

/** The panel uses the same public component APIs as an external renderer. */
export class DynamicsPanel {
  constructor(container, {viewer, catalog, onGeometryChange, moduleLoader = loadGroveModule}) {
    this.container = container;
    this.viewer = viewer;
    this.catalog = catalog;
    this.onGeometryChange = onGeometryChange;
    this.loadModule = moduleLoader;
    this.held = new Map();
    this.generation = 0;
    this.cleanups = [];
    this.readouts = [];
    this.container.innerHTML = `
      <div class="dynamics-heading"><div><p class="eyebrow">MOVE & CONNECT</p><h3>操作模型</h3></div><span>姿态演示 · 输入交给外部框架</span></div>
      <div class="dynamics-grid">
        <section class="connection-controls"><h4>连接 Unit</h4>
          <div class="connection-selects"><label>Grove 接口<select id="grove-port"></select></label><label>Unit<select id="grove-unit"></select></label></div>
          <div class="connection-actions"><button id="grove-connect" class="action-primary">连接</button><button id="grove-disconnect" disabled>断开</button><output id="grove-status" aria-live="polite">选择一个 Grove 接口</output></div>
          <div id="cable-controls" hidden></div>
          <p id="connection-note" class="control-note"></p>
        </section>
        <section><h4>按键与开关</h4><p class="control-note">按住查看行程，松开回弹；滑动开关保持档位。也可直接点击模型。</p><div id="button-controls" class="button-controls"></div><div id="button-inspection" class="button-inspection"><label>定格检查<select id="inspect-button"></select></label><div><button id="hold-button">保持按下</button><button id="release-button">弹起</button><button id="focus-button">近看</button></div><output id="button-travel"></output></div></section>
        <section id="joint-section" hidden><h4>可动部件</h4><p class="control-note">位置、角度与转速由外部给定；滑块与旋转选择器也可直接拖动。演示范围不代表硬件额定范围。</p><div id="joint-controls"></div></section>
        <section id="led-section" hidden><h4>灯光外观</h4><p class="control-note">外部指定颜色和亮度，不与按键或设备状态自动联动。</p><div class="led-selects"><label>灯位<select id="led-target"></select></label><label>颜色<input id="led-color" type="color" aria-label="灯光颜色"></label></div><div id="led-brightness-control"></div><button id="led-off">熄灭</button><output id="led-state" class="led-state"></output></section>
        <section class="input-events"><h4>输入意图</h4><p class="control-note">点击模型后可用键盘；切换到表单会释放按键。</p><output id="input-events" aria-live="polite">等待操作…</output><details><summary>当前几何状态</summary><pre id="dynamic-state"></pre></details></section>
      </div>`;
    this.$ = selector => container.querySelector(selector);
    for (const p of catalog.products.filter(p => p.category === 'unit' && p.entry)) {
      this.$('#grove-unit').add(new Option(p.name, p.id));
    }
    this.$('#grove-unit').value = 'env-iii';
    this.$('#grove-connect').onclick = () => this.connect();
    this.$('#grove-disconnect').onclick = () => this.disconnect();
    this.$('#grove-port').onchange = () => { this.generation++; this.refreshConnection(); };
    this.$('#grove-unit').onchange = () => { this.generation++; this.refreshConnection(); };
    this.$('#hold-button').onclick = () => {
      const button = this.model?.find(this.$('#inspect-button').value, 'button');
      if (button && !button.latching) { const key = `inspect:${button.path}`; this.held.set(key, button); button.press(key); }
    };
    this.$('#release-button').onclick = () => {
      const button = this.model?.find(this.$('#inspect-button').value, 'button');
      if (button && !button.latching) { const key = `inspect:${button.path}`; this.held.delete(key); button.release(key); }
    };
    this.$('#focus-button').onclick = () => {
      const button = this.model?.find(this.$('#inspect-button').value, 'button');
      if (button) this.viewer.focus(button.path, {distance: 50});
    };
    this.$('#inspect-button').onchange = () => { this.releaseAll(); this.refreshState(); };
    this.$('#led-target').onchange = () => this.refreshLedControls();
    this.$('#led-color').oninput = event => { this.led()?.set({color:event.target.value}); this.refreshState(); };
    this.$('#led-off').onclick = () => { this.led()?.set({brightness:0}); this.refreshState(); };
    this.releaseAll = () => this.releaseHeld(() => true);
    this.onVisibilityChange = () => { if (document.hidden) this.releaseAll(); };
    window.addEventListener('blur', this.releaseAll);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    // Include the terminal frame: throttling only on render can leave a stale
    // nonzero readout forever once an on-demand viewer becomes idle.
    this.offRender = viewer.on('render', () => this.refreshState());
  }

  bind(model, product) {
    this.unbind();
    this.model = model;
    this.product = product;
    this.events = [];
    this.$('#input-events').textContent = '等待操作…';
    this.cleanups.push(model.on('module:will-detach', ({module}) => {
      this.releaseHeld((key, button) => {
        for (let object = button.object3d; object; object = object.parent) if (object === module.root) return true;
        return false;
      });
    }));
    this.cleanups.push(model.on('input', event => {
      if (event.kind === 'port' && ['attach', 'detach'].includes(event.action)) {
        this.refreshPorts();
        this.refreshConnection();
        this.refreshComponents();
        this.onGeometryChange();
      }
      this.record(event);
    }));
    this.refreshComponents({preserveSelection: false});
    this.refreshPorts({preserveSelection: false});
    this.refreshConnection();
    this.refreshState();
  }

  unbind() {
    this.generation++;
    this.releaseAll?.();
    for (const off of this.cleanups) off();
    this.cleanups = [];
    // Cached models should not continue rotating while they are off screen.
    if (this.model) for (const joint of this.model.list('joint')) {
      if (joint.getState().continuous) joint.set({rpm: 0});
    }
    this.model = null;
    this.connectionPort = null;
    this.readouts = [];
  }

  releaseHeld(matches) {
    for (const [key, button] of [...this.held]) if (this.held.get(key) === button && matches(key, button)) {
      // Clear ownership before cancel emits input: callbacks may rebuild the
      // controls or detach a module synchronously.
      this.held.delete(key);
      (button.cancel ?? button.release).call(button, key);
    }
  }

  dispose() {
    this.unbind();
    window.removeEventListener('blur', this.releaseAll);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.offRender?.();
    this.offRender = null;
    this.container.replaceChildren();
  }

  port() { return this.model?.find(this.$('#grove-port').value, 'port'); }
  led() { return this.model?.find(this.$('#led-target').value, 'led'); }

  refreshPorts({preserveSelection = true} = {}) {
    const select = this.$('#grove-port'), previous = preserveSelection ? select.value : '';
    const ports = this.model?.list('port').filter(port => {
      if (port.connector !== 'grove') return false;
      // Socket metadata describes the connector's appearance. The Unit frame
      // identifies the actual input already occupied by the upstream cable;
      // listing it would offer another attachment inside that same cable end.
      const frame = port.host?.find('unitFrame', 'unit-frame');
      return !(port.host?.attachedTo && frame?.inputPort === port);
    }) ?? [];
    select.replaceChildren(...ports.map(port => new Option(`${port.label} / ${port.path}`, port.path)));
    let path = previous;
    while (path && !ports.some(port => port.path === path)) path = path.slice(0, Math.max(0, path.lastIndexOf('/')));
    if (path) select.value = path;
    const selected = this.port();
    if (this.connectionPort !== selected) this.generation++;
    this.connectionPort = selected;
    select.disabled = !ports.length;
    this.$('#grove-unit').disabled = !ports.length;
    this.$('#grove-connect').disabled = !selected;
    this.$('#connection-note').textContent = ports.length
      ? '四芯线与两端插头跟随接口位置；HUB 输出可继续挂接 Unit。连接仅表示外观装配。'
      : '此模型没有可供本演示挂接的 Grove 接口。';
  }

  refreshLedControls() {
    const led = this.led();
    if (!led) {
      const output = this.$('#led-state');
      output.textContent = '';
      delete output.dataset.state;
      return;
    }
    const state = led.getState(), percentage = Math.round(state.brightness * 100);
    this.$('#led-color').value = state.color;
    this.$('#led-color').disabled = led.meta.colorMode === 'fixed-red';
    this.$('#led-color').title = led.meta.colorMode === 'fixed-red' ? '此器件为固定红光' : '';
    const brightness = this.$('#led-brightness');
    if (brightness) { brightness.value = state.brightness * 100; brightness.nextElementSibling.textContent = `${percentage}%`; }
    const output = this.$('#led-state');
    output.textContent = `${state.color} · ${percentage}%`;
    output.dataset.state = JSON.stringify(state);
  }

  async connect() {
    const port = this.port();
    if (!port) return;
    const model = this.model;
    const generation = ++this.generation;
    let module = null;
    this.$('#grove-connect').disabled = true;
    this.$('#grove-status').textContent = '正在连接…';
    try {
      const id = this.$('#grove-unit').value;
      module = await this.loadModule(id, {
        cableLength: 85, cable: {slack: 16, bend: [0, 0, -1]},
        ...(id === 'fan' ? {propeller: true} : {}),
      });
      if (generation !== this.generation || model !== this.model || port !== this.port()) return;
      port.attach(module);
      module = null; // The port now owns disposal.
      this.refreshPorts();
      this.refreshConnection();
      this.refreshComponents();
      this.onGeometryChange();
      this.viewer.fit({padding: 1.25});
    } catch (error) {
      if (generation === this.generation && model === this.model) this.$('#grove-status').textContent = `连接失败：${error.message}`;
    } finally {
      if (module && !module.attachedTo) module.dispose();
      if (generation === this.generation) this.$('#grove-connect').disabled = false;
    }
  }

  disconnect() {
    this.generation++;
    this.port()?.detach();
    this.refreshPorts();
    this.refreshConnection();
    this.refreshComponents();
    this.viewer.fit({padding: 1.2});
  }

  refreshConnection() {
    const port = this.port(), module = port?.module;
    this.$('#grove-connect').disabled = !port;
    this.$('#grove-disconnect').disabled = !module;
    this.$('#grove-status').textContent = module ? `${port.path} → ${module.meta.name}` : port ? '尚未连接' : '无 Grove 接口';
    const controls = this.$('#cable-controls');
    controls.replaceChildren();
    controls.hidden = !module;
    if (!module) return;
    const frame = module.get('unitFrame'), cable = module.get('cable');
    const state = cable.getState();
    const rotation = new THREE.Euler().setFromQuaternion(new THREE.Quaternion(...frame.getState().quaternion));
    const degrees = value => value * 180 / Math.PI;
    const values = {distance: state.target.position[1], x: state.target.position[0], z: state.target.position[2], turn: degrees(rotation.z), tilt: degrees(rotation.x), slack: state.slack};
    const inputLocal = frame.object3d.worldToLocal(module.port('grove').object3d.getWorldPosition(new THREE.Vector3()));
    const applyPose = () => {
      const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(rad(values.tilt), rotation.y, rad(values.turn)));
      const position = new THREE.Vector3(values.x, values.distance, values.z).sub(inputLocal.clone().applyQuaternion(quaternion));
      frame.setPose({position: position.toArray(), quaternion: quaternion.toArray()});
      this.viewer.requestRender();
    };
    for (const [key, label, min, max, step] of [
      ['distance', '沿口轴距离', 35, 180, 1], ['x', '横向偏移', -70, 70, 1],
      ['z', '前后偏移', -50, 50, 1], ['turn', '末端转向', -180, 180, 1],
      ['tilt', '末端俯仰', -60, 60, 1], ['slack', '线缆弯曲', 0, 60, 1],
    ]) this.range(controls, {id: `cable-${key}`, label, min, max, step, value: values[key], unit: key === 'turn' || key === 'tilt' ? '°' : ' mm', oninput: value => {
      values[key] = value;
      if (key === 'slack') cable.setOptions({slack: value}); else applyPose();
      this.refreshState();
    }});
    const fit = node('button', '适应画面');
    fit.id = 'connection-fit';
    fit.onclick = () => this.viewer.fit({padding: 1.25});
    controls.append(fit);
  }

  refreshComponents({preserveSelection = true} = {}) {
    const previousInspection = preserveSelection ? this.$('#inspect-button').value : '';
    const previousLed = preserveSelection ? this.$('#led-target').value : '';
    const liveButtons = new Set(this.model.list('button'));
    // Replaced DOM controls lose their pointer/key capture. A deliberate
    // inspection hold stays down while its original button remains selected.
    this.releaseHeld((key, button) => !liveButtons.has(button) || !key.startsWith('inspect:') || button.path !== previousInspection);
    this.readouts = [];
    const buttons = this.$('#button-controls'), joints = this.$('#joint-controls');
    buttons.replaceChildren(); joints.replaceChildren();
    for (const button of this.model.list('button')) {
      const el = node('button', button.label, 'model-button');
      el.dataset.button = button.path;
      el.title = button.path;
      if (button.latching) {
        el.onclick = () => { button.press('panel-switch'); button.release('panel-switch'); };
      } else {
        const begin = key => { this.held.set(key, button); button.press(key); el.setAttribute('aria-pressed', 'true'); };
        const end = (key, cancelled = false) => { this.held.delete(key); (cancelled ? button.cancel : button.release).call(button, key); el.setAttribute('aria-pressed', 'false'); };
        el.onpointerdown = event => {
          if (event.button !== 0) return;
          event.preventDefault(); el.setPointerCapture(event.pointerId);
          begin(`panel:${button.path}:${event.pointerId}`);
        };
        const finish = (event, cancelled) => end(`panel:${button.path}:${event.pointerId}`, cancelled);
        el.onpointerup = event => finish(event, false);
        el.onpointercancel = event => finish(event, true);
        el.onlostpointercapture = event => finish(event, true);
        el.onkeydown = event => { if (['Space', 'Enter'].includes(event.code)) { event.preventDefault(); if (!event.repeat) begin(`panel:${button.path}:key:${event.code}`); } };
        el.onkeyup = event => { if (['Space', 'Enter'].includes(event.code)) { event.preventDefault(); end(`panel:${button.path}:key:${event.code}`); } };
        el.onblur = () => {
          for (const key of [...this.held.keys()]) if (key.startsWith(`panel:${button.path}:key:`)) end(key, true);
        };
      }
      this.readouts.push(() => {
        const state = button.getState();
        el.setAttribute('aria-pressed', String(button.latching ? !!state.position : state.pressed));
        el.dataset.state = JSON.stringify(state);
        if (button.latching) el.textContent = `${button.label} · ${state.position ? '1' : '0'}`;
      });
      buttons.append(el);
    }
    if (!buttons.childElementCount) buttons.append(node('span', '无机械按键', 'control-note'));
    const inspectButtons = this.model.list('button');
    this.$('#button-inspection').hidden = !inspectButtons.length;
    this.$('#inspect-button').replaceChildren(...inspectButtons.map(b => new Option(`${b.label} / ${b.path}`, b.path)));
    if (inspectButtons.some(button => button.path === previousInspection)) this.$('#inspect-button').value = previousInspection;
    const allJoints = this.model.list('joint');
    const allSlides = this.model.list('slider');
    const allRotaries = this.model.list('rotary-selector');
    this.$('#joint-section').hidden = !allJoints.length && !allSlides.length && !allRotaries.length;
    for (const joint of allJoints) {
      const state = joint.getState();
      const group = node('div', null, 'joint-control');
      group.dataset.joint = joint.path;
      group.append(node('strong', joint.label));
      const limits = state.rangeDeg ?? state.visualRangeDeg ?? [-180, 180];
      this.range(group, {id: `joint-${joint.path.replaceAll('/', '-')}-angle`, label: '角度', min: limits[0], max: limits[1], step: 1, value: state.angleDeg, unit: '°', oninput: angleDeg => {
        joint.set({angleDeg, rpm: 0});
        this.viewer.fit({padding: 1.3});
        const rpm = group.querySelector('input[id$="-rpm"]');
        if (rpm) { rpm.value = 0; rpm.nextElementSibling.textContent = '0 rpm'; }
      }});
      if (state.continuous) this.range(group, {id: `joint-${joint.path.replaceAll('/', '-')}-rpm`, label: '演示转速', min: -state.demoRpmMax, max: state.demoRpmMax, step: 1, value: state.rpm, unit: ' rpm', oninput: rpm => joint.set({rpm})});
      const reset = node('button', '回到中位 / 停止');
      reset.onclick = () => {
        joint.set({angleDeg: 0, rpm: 0, durationMs: 250});
        group.querySelectorAll('input').forEach(input => { input.value = 0; input.nextElementSibling.textContent = input.id.endsWith('rpm') ? '0 rpm' : '0°'; });
      };
      const status = node('output', '', 'joint-status');
      this.readouts.push(() => {
        const s = joint.getState();
        status.textContent = `${s.angleDeg.toFixed(1)}°${s.continuous ? ` / ${s.rpm} rpm` : ''}`;
        status.dataset.state = JSON.stringify(s);
      });
      group.append(reset, status); joints.append(group);
    }
    for (const slide of allSlides) {
      const state = slide.getState(), group = node('div', null, 'joint-control');
      group.dataset.slider = slide.path;group.append(node('strong', slide.label));
      const id = `slide-${slide.path.replaceAll('/', '-')}-position`;
      this.range(group, {id, label:'位置', min:state.rangeMm[0], max:state.rangeMm[1], step:.1, value:state.positionMm, unit:' mm', oninput:positionMm=>slide.set({positionMm})});
      const reset = node('button', '回到中位');
      reset.onclick = ()=>slide.set({positionMm:Math.max(state.rangeMm[0],Math.min(state.rangeMm[1],0)),durationMs:200});
      const status = node('output', '', 'joint-status');
      this.readouts.push(()=>{
        const current=slide.getState(),input=group.querySelector(`#${id}`);
        if(input){input.value=current.positionMm;input.nextElementSibling.textContent=`${current.positionMm.toFixed(2)} mm`;}
        status.textContent=`${current.positionMm.toFixed(2)} mm`;status.dataset.state=JSON.stringify(current);
      });
      group.append(reset,status);joints.append(group);
    }
    for (const rotary of allRotaries) {
      const state = rotary.getState(), group = node('div', null, 'joint-control');
      group.dataset.rotary = rotary.path;group.append(node('strong', rotary.label));
      const id = `rotary-${rotary.path.replaceAll('/', '-')}-position`;
      this.range(group, {id, label:'物理档位', min:0, max:15, step:1, value:state.position, unit:'', oninput:position=>rotary.setPosition(position)});
      const status = node('output', '', 'joint-status');
      this.readouts.push(()=>{
        const current=rotary.getState(),input=group.querySelector(`#${id}`),label=current.position.toString(16).toUpperCase();
        if(input){input.value=current.position;input.nextElementSibling.textContent=label;}
        status.textContent=`档位 ${label}`;status.dataset.state=JSON.stringify(current);
      });
      group.append(status);joints.append(group);
    }
    const leds = this.model.list('led').filter(led => !led.invisible);
    this.$('#led-section').hidden = !leds.length;
    this.$('#led-target').replaceChildren(...leds.map(led => new Option(`${led.label} / ${led.path}`, led.path)));
    if (leds.some(led => led.path === previousLed)) this.$('#led-target').value = previousLed;
    const brightness = this.$('#led-brightness-control');
    brightness.replaceChildren();
    if (leds.length) this.range(brightness, {id:'led-brightness',label:'亮度',min:0,max:100,step:1,value:leds[0].getState().brightness * 100,unit:'%',oninput:value=>this.led()?.set({brightness:value / 100})});
    this.refreshState();
  }

  range(parent, {id, label, min, max, step, value, unit, oninput}) {
    const row = node('label', null, 'range-control');
    row.htmlFor = id;
    row.append(node('span', label));
    const input = node('input');
    Object.assign(input, {type: 'range', id, min, max, step, value});
    const output = node('output', `${Math.round(value)}${unit}`);
    input.oninput = () => {
      try { oninput(Number(input.value)); output.textContent = `${input.value}${unit}`; this.refreshState(); }
      catch (error) { this.$('#grove-status').textContent = error.message; }
    };
    row.append(input, output); parent.append(row);
  }

  record(event) {
    this.events.unshift(`${event.id} · ${event.action}${event.source ? ` · ${event.source}` : ''}`);
    this.events.length = Math.min(this.events.length, 5);
    this.$('#input-events').textContent = this.events.join('\n');
    this.refreshState();
  }

  refreshState() {
    if (!this.model) return;
    for (const update of this.readouts) update();
    this.refreshLedControls();
    const inspected = this.model.find(this.$('#inspect-button').value, 'button');
    this.$('#hold-button').disabled = !inspected || inspected.latching;
    this.$('#release-button').disabled = !inspected || inspected.latching;
    this.$('#focus-button').disabled = !inspected;
    const output = this.$('#button-travel');
    if (inspected) {
      const actuation = inspected.getActuationState();
      const travel = Number(inspected.travel.toFixed(3));
      const mechanism = {'flex-pad':'外壳弯曲',lever:'杠杆转动'}[inspected.meta.visualMotion] ?? '按压';
      output.textContent = inspected.latching
        ? `稳定档位 ${inspected.position} · 位移 ${inspected.cap.position.toArray().map(v => v.toFixed(3)).join(', ')} mm · 点击上方开关切换，松开保持档位`
        : inspected.travel === 0
        ? `电容触摸 · ${inspected.pressed ? '已按下' : '已松开'} · 机械行程 0 mm`
        : inspected.meta.visualMotion
        ? `视觉行程 ${actuation.depthMm.toFixed(3)} / ${travel} mm · ${mechanism}`
        : `位移 ${inspected.cap.position.toArray().map(v => v.toFixed(3)).join(', ')} mm · 名义行程 ${travel} mm`;
      output.dataset.settled = String(actuation.settled);
      output.dataset.pressed = String(inspected.pressed);
      output.dataset.actuation = inspected.latching ? 'latching' : inspected.travel === 0 ? 'capacitive' : 'momentary';
      if (inspected.latching) output.dataset.position = String(inspected.position);
      else delete output.dataset.position;
    } else {
      output.textContent = '';
      for (const key of ['settled','pressed','actuation','position']) delete output.dataset[key];
    }
    const module = this.port()?.module;
    const state = {
      buttons: Object.fromEntries(this.model.list('button').map(b => [b.path, b.getState()])),
      joints: Object.fromEntries(this.model.list('joint').map(j => [j.path, j.getState()])),
      sliders: Object.fromEntries(this.model.list('slider').map(s => [s.path, s.getState()])),
      rotarySelectors: Object.fromEntries(this.model.list('rotary-selector').map(s => [s.path, s.getState()])),
      leds: Object.fromEntries(this.model.list('led').map(led => [led.path, led.getState()])),
      ...(module ? {cable: module.get('cable').getState()} : {}),
    };
    this.$('#dynamic-state').textContent = JSON.stringify(state, null, 2);
  }
}
