/** Demo-only external framebuffer writer. It does not emulate a display driver. */
export class FramebufferPanel {
  constructor({selector, button}) {
    this.selector = selector;
    this.button = button;
    this.states = new WeakMap();
    this.preferredCalibration = false;
    this.model = null;
    this.selectedDisplay = null;
    selector.onchange = () => this.refresh();
    button.onclick = () => {
      const display = this.target();
      if (display) this.setCalibration(!this.states.get(display));
    };
    this.refresh();
  }

  bind(model) {
    this.unbind();
    this.model = model;
    this.offInput = model.on('input', event => {
      if (event.kind === 'port' && ['attach', 'detach'].includes(event.action)) this.refresh();
    });
    this.refresh();
    // Preserve the existing single-screen model-switch calibration behavior.
    // Later attachment and target selection only refresh UI; they never write.
    this.setCalibration(this.preferredCalibration);
  }

  unbind() {
    this.offInput?.();
    this.offInput = null;
    this.model = null;
    this.selectedDisplay = null;
    this.selector.value = '';
    this.refresh();
  }

  refresh() {
    const displays = this.model?.list('display') ?? [];
    const previous = this.selector.value;
    const selected = displays.find(display => display.path === previous)
      ?? displays.find(display => display.path === 'lcd') ?? displays[0] ?? null;
    this.selector.replaceChildren(...displays.map(display => {
      const option = document.createElement('option');
      option.value = display.path;
      option.textContent = `${display.label} / ${display.path}`;
      return option;
    }));
    this.selector.value = selected?.path ?? '';
    this.selector.hidden = displays.length < 2;
    this.selector.disabled = !selected;
    this.selectedDisplay = selected;
    this.button.disabled = !selected;
    this.button.setAttribute('aria-pressed', String(!!selected && !!this.states.get(selected)));
    this.button.dataset.display = selected?.path ?? '';
  }

  target() {
    const actual = this.model?.find(this.selector.value, 'display');
    // A stale click must not write into a replacement with the same path, or
    // into the fallback host screen after a selected subtree was removed.
    if (!actual || actual !== this.selectedDisplay) { this.refresh(); return null; }
    return actual;
  }

  setCalibration(on) {
    const display = this.target();
    if (!display) return false;
    if (on) display.writeRGBA(calibrationPixels(display));
    else display.fill(display.meta.surface === 'reflective' ? '#e4e1d5' : '#050607');
    this.preferredCalibration = !!on;
    this.states.set(display, !!on);
    this.refresh();
    return true;
  }
}

function calibrationPixels(display) {
  const {width, height} = display;
  const bytes = new Uint8Array(width * height * 4);
  const palette = [[2, 130, 203], [30, 60, 80], [225, 235, 240],
    [225, 32, 48], [25, 180, 80], [25, 100, 235], [240, 190, 20]];
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y * width + x) * 4;
    const border = x < 3 || y < 3 || x >= width - 3 || y >= height - 3;
    const grid = Math.floor(x / (width / 10)) % 2 === Math.floor(y / (height / 10)) % 2;
    let color = palette[border ? 0 : grid ? 1 : 2];
    const left = x < width * .1, right = x >= width * .9;
    const top = y < height * .1, bottom = y >= height * .9;
    if (left && top) color = palette[3];
    else if (right && top) color = palette[4];
    else if (left && bottom) color = palette[5];
    else if (right && bottom) color = palette[6];
    if (display.meta.monochrome) {
      const gray = Math.round(color[0] * .2126 + color[1] * .7152 + color[2] * .0722);
      bytes[i] = bytes[i + 1] = bytes[i + 2] = gray;
    } else { bytes[i] = color[0]; bytes[i + 1] = color[1]; bytes[i + 2] = color[2]; }
    bytes[i + 3] = 255;
  }
  return bytes;
}
