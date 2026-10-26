# Unit DCSSR — U140

Stage: `modeled`. Geometry/API checks passed; browser reference comparison, production fit and physical hardware validation are deferred. This model describes the complete supplied DC SSR and its controller, including the two removable terminal plugs when requested.

## Evidence and dimensions

The exact U140 official product response and dimension image describe a 45 × 30.7 × 11.5 mm controller **including its two fork lugs**. They do not dimension the complete relay kit. The exact U140 structure path contains the assembled controller shell and two displaced duplicate shell parts. Component 0 is retained in full: 2,654 triangles, one rigid transform, scale 1, no cuts or filled openings. Its closed-shell envelope is 44.9394 × 18.7393 × 11.5000 mm. The U140 STL resolves to the same blob as the U139 controller enclosure; this is source identity, not evidence that the two bundled power relays have the same electrical ratings.

The U140 gallery clearly shows a DELIXI **CDG1-1DD/10A** DC SSR, the `DC-12:10A 220VDC` and `3V~32VDC` nameplate, four cross-head terminal screws, white screw-access guards, black sealed package, metal mounting flange and two control fork lugs. The modeled full-kit envelope, approximately **45 × 80 × 31 mm**, and installed controller/relay transform are estimates constrained by these same-model front/side photographs and the known 45 mm controller width. They are not an official U140 mechanical specification or a production assembly datum. The modeled controller with lugs is checked against the actual 30.7 mm drawing.

Original CAD, downloaded reference images, MCP raw responses, artwork generators and intermediate material are kept outside the public repository. Public source URLs, hashes, the native-shell transform and the final ordinary PNG derivatives are recorded in [sources.json](sources.json), [cad-map.json](../../../src/units/dcssr/cad-map.json) and [artwork.json](artwork.json). M5Stack native CAD derivatives retain the MIT notice.

## Complete physical assembly

The complete native enclosure retains its integral central flexure tongue. A real green PCB, inferred concealed package envelopes, tactile-switch body/plunger and two metal fork lugs back the shell openings. Hidden package types and footprints beyond the documented ESP32-C3 are visual reconstruction, not a confirmed U140 BOM. Hidden pads are not exposed as public Ports.

The DC SSR has an opaque sealed body, aluminum thermal flange with two real mounting bores, four separate recessed clamp cages/pressure plates/shanks, four externally driven cross-recess screw heads and two fixed guards with true screw-access bores. The front nameplate sits on an actual physical support, with a true independent indicator aperture. The Grove and two recessed HT3.96 sockets have walls, rear supports, contacts and PCB tails. Real cavities remain open; artwork closes none of them.

`artwork:false` removes only printed layers. The local check compares every physical mesh's geometry attributes, index and world transform after updating its top-level ancestor; all shell/PCB/SSR/contact/lens/clamp geometry remains identical.

## Public interface

- `Model`, `GroveModule`, `TerminalPlug`, `spec` are exported from the product entry.
- `grove`: physical four-pin socket; `GroveModule` adds the normal four-wire Grove cable and poseable `unitFrame`.
- `terminal-1`, `terminal-2`: `ht3.96-4p` mating interfaces. `terminalPlug:true` installs two independent supplied plugs; each detaches through its Port. Default `{}` leaves both fixed sockets visible.
- `button`: input intent with an externally driven native-tongue flexure. Its 0.22 mm free-end travel is an appearance estimate; the original neutral shell positions and normals are restored exactly on release/cancel. Cancel produces no click.
- `rgb`: independent SK6812 full-color appearance; `power-led` and `ssr-led`: independent fixed-red appearances. All start off. External on/brightness/color commands do not produce input events; fixed-red lamps ignore alternate requested colors.
- `ssr-screw-1`…`ssr-screw-4`: external visible head angle and optional duration. Each terminal plug adds `screw-1`…`screw-4` under its Port path. Nonzero RPM is rejected. No thread pitch, tightening, axial clamp travel or guard removal is implied.
- `sensor`: passive visual anchor only; no measurement or relay state.

The model implements no DC continuity, relay on/off behavior, load, voltage/current, thermal response, automatic lamp coupling, mode/configuration state machine, I2C, Modbus, MCU, RF, network or firmware. Those remain the external runtime's responsibility.

## Matching artwork

Two same-model code redraws are distributed as final PNGs: controller rear label (2250 × 900) and DC SSR nameplate (2150 × 1450). They are `reference-redraw`, not exact original artwork. Readable text and color blocks follow U140 photographs; unresolved QR/serial content is omitted. Logo/certification/bulb outlines, typography, physical registration and color are visual approximations. Product marks retain their respective rights and do not establish certification. No photograph is cut out as a sticker, and no private table, private source mapping, vector or generator is distributed.

## Necessary checks and remaining limits

[smoke.json](smoke.json) records finite geometry; all 2,654 native-shell triangles; controller-with-lugs and inferred kit envelopes; 18 FrontSide bore/slot wall checks; true Grove depth; native tongue input/cancel/restoration; separate lamps and screw appearance; both removable 4P plugs; nested Grove attachment/pose/detachment and resource release; and full physical invariance when artwork is disabled. These are construction checks, not visual acceptance.

Official missing-documentation feedback `a1da7ba30adb4fd5ba6dfc708e8aed1f` was accepted for the full U140 kit outline, supplied DC SSR outline, production installed datum, guard/plug dimensions and actual tongue travel. Refine those inferred details only when exact U140 evidence appears; do not use ACSSR electrical data to fill the gap.
