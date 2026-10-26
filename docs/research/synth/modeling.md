# Unit Synth U178

Modeled from the exact U178 official product documentation, dimension drawing, schematic and complete assembled official shell. Units are millimetres: +X right, +Y toward the speaker end, +Z toward the perforated front grille. Nominal and assembled envelopes are 24 × 48 × 16 mm in model axes, corresponding to the vendor's 48 × 24 × 16 mm order.

## Physical construction

The official `Unit_Synth.stl` has three connected source islands. Island 0 contains the complete assembled shell; islands 1 and 2 are laterally displaced duplicate individual shell halves. Only island 0 is retained, using the single translation recorded in `src/units/synth/cad-map.json`. No scaling, shell cutting, hole filling or per-part realignment is applied. The native front grille, two 5 mm mounting bores on 16 mm pitch, Grove mouth and rear fastening relief remain intact.

A real PCB contour includes open mounting-boss reliefs, a Grove notch and an internal screw bore. Added physical components include the SAM2695 package, NS4150B amplifier, regulator, reset supervisor, crystal, passive packages, fixed internal LED2/LED3 packages, complete fixed loudspeaker, internal 1.25 mm 2P socket J2, its recessed contacts and two fixed speaker leads. The loudspeaker has a rectangular chassis, oval suspension and paper cone, convex dust cap, basket ribs, magnet can, rear plate and solder terminals. These physical parts back the original grille openings; no dark photograph, decal or planar closure is substituted for the speaker.

The exact U178 photographs and dimension drawing show no physical button, rotary control, slider, external LED window, DIN, USB or 3.5 mm jack. The official document's DIN diagram describes external wiring through Grove. Unit MIDI U187 is a different product. J2 is an internal speaker connection, represented as fixed concealed geometry and not registered as an exposed mating port. LED2/LED3 have no confirmed visible lens/window or package colour/placement and remain fixed unlit concealed parts, with no invented external LED API.

## External API

```js
import {Model, GroveModule} from './src/units/synth/index.js';

const standalone = new Model();
const unit = new GroveModule({cableLength: 60});
host.port('grove').attach(unit);
host.handle({
  type: 'pose', target: 'grove/unitFrame',
  position: [20, 80, 0], rotation: [0.2, 0, -0.15],
});
host.update(1 / 60);
```

`grove` is the only mating port. It faces −Y, with four documented pin labels `GND`, `5V_IN`, `SYS_MIDI`, `NC`. A `GroveModule` supplies two physical plugs and four rendered cable conductors. The `sensor` component is a passive visual package anchor; it accepts no MIDI, note, sound, synthesis, audio, firmware, electrical or sensor-value commands. There are no Button, Joint, Slider, Led or speaker-displacement controls. Audio/MIDI runtime functionality belongs to the downstream framework.

## Evidence and limits

`sources.json` records exact source URLs, CAD commit/blob/hash and runtime hashes. `smoke.json` records necessary local construction/API checks: finite geometry, exact envelope, ten mounting-bore axial rays, inward-facing PCB screw-bore walls, 47 native grille paths backed by physical speaker parts, actual internal J2 cavity/two contacts/two leads, Grove cavity/four-wire pose, nested component identity, detach and resource disposal.

The complete native shell and nominal dimensions are source-derived. PCB outline/thickness/Z, concealed package locations/envelopes, speaker dimensions/installed datums, internal J2 placement/orientation/contact dimensions and fixed wire routing are reconstructed from the shell, schematic and exact product photographs. No complete production PCB/speaker assembly STEP or manufacturing-fit claim is available. The fixed speaker shape is not an acoustic or displacement simulation.

Both actual front and rear labels are included as high-resolution reference-redrawn PNGs. See `artwork.md` for official-photo sources and surface registration. `artwork:false` disables both labels while preserving all physical geometry. Exhaustive browser inspection is deferred under the user's current instruction. Stage remains `modeled`; local geometry/API smoke does not establish browser or hardware verification. Raw photos, original STL, official MCP result and generators remain outside the repository under the local working directory.
