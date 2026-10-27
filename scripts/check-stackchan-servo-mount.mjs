/** MIT. Current visual mount diagnostic; no source CAD or runtime mutation. */
import * as THREE from 'three';
import {pathToFileURL} from 'node:url';

const EPS = .002;
const range = values => [Math.min(...values), Math.max(...values)];
const gap = (a, b) => Math.max(0, b[0] - a[1], a[0] - b[1]);
const transverseDistance = (a, b) => Math.hypot(a[1] - b[1], a[2] - b[2]);
const requireValue = (value, message) => {
  if (!value) throw new Error(message);
  return value;
};

function fitCircle(points) {
  const mean = points.reduce((sum, point) => sum.map((v, i) => v + point[i] / points.length), [0, 0]);
  let xx = 0, xy = 0, yy = 0, xr = 0, yr = 0, square = 0;
  for (const point of points) {
    const x = point[0] - mean[0], y = point[1] - mean[1], r = x * x + y * y;
    xx += x * x; xy += x * y; yy += y * y; xr += x * r; yr += y * r; square += r;
  }
  const determinant = xx * yy - xy * xy;
  if (Math.abs(determinant) < 1e-12) return null;
  const x = (xr * yy - yr * xy) / (2 * determinant), y = (yr * xx - xr * xy) / (2 * determinant);
  const center = [mean[0] + x, mean[1] + y], radius = Math.sqrt(square / points.length + x * x + y * y);
  const maxError = Math.max(...points.map(point => Math.abs(Math.hypot(point[0] - center[0], point[1] - center[1]) - radius)));
  return {center, radius, maxError};
}

/** Discover closed boundary loops on actual planar mesh triangles. A fitted
 * rim reports its world plane/axis, rather than a userData hole coordinate. */
function circularRims(mesh, axis, minimumRadius = .7, maximumRadius = 1.3) {
  const position = mesh.geometry.attributes.position, index = mesh.geometry.index;
  const uv = [0, 1, 2].filter(component => component !== axis), planes = new Map();
  for (let i = 0; i < (index?.count ?? position.count); i += 3) {
    const points = [0, 1, 2].map(j => new THREE.Vector3().fromBufferAttribute(position, index ? index.getX(i + j) : i + j));
    const coordinates = points.map(point => point.getComponent(axis));
    if (Math.max(...coordinates) - Math.min(...coordinates) > 2e-5) continue;
    const coordinate = coordinates.reduce((sum, value) => sum + value, 0) / 3, key = Math.round(coordinate * 1e4);
    let plane = planes.get(key);
    if (!plane) planes.set(key, plane = {sum: 0, triangles: 0, vertices: new Map(), edges: new Map()});
    plane.sum += coordinate; plane.triangles++;
    const keys = points.map(point => uv.map(component => Math.round(point.getComponent(component) * 1e4)).join(','));
    points.forEach((point, j) => plane.vertices.set(keys[j], uv.map(component => point.getComponent(component))));
    for (let j = 0; j < 3; j++) {
      const a = keys[j], b = keys[(j + 1) % 3];
      if (a === b) continue;
      const edge = [a, b].sort().join(';');
      plane.edges.set(edge, (plane.edges.get(edge) ?? 0) + 1);
    }
  }
  const rims = [];
  for (const plane of planes.values()) {
    const adjacency = new Map();
    for (const [edge, count] of plane.edges) if (count === 1) {
      const [a, b] = edge.split(';');
      for (const [from, to] of [[a, b], [b, a]]) {
        if (!adjacency.has(from)) adjacency.set(from, new Set());
        adjacency.get(from).add(to);
      }
    }
    const visited = new Set();
    for (const start of adjacency.keys()) {
      if (visited.has(start)) continue;
      const queue = [start], keys = [];
      while (queue.length) {
        const key = queue.pop();
        if (visited.has(key)) continue;
        visited.add(key); keys.push(key);
        for (const next of adjacency.get(key) ?? []) if (!visited.has(next)) queue.push(next);
      }
      if (keys.length < 12 || keys.some(key => adjacency.get(key).size !== 2)) continue;
      const fit = fitCircle(keys.map(key => plane.vertices.get(key)));
      if (!fit || fit.maxError > .001 || fit.radius < minimumRadius || fit.radius > maximumRadius) continue;
      const center = new THREE.Vector3().setComponent(axis, plane.sum / plane.triangles);
      uv.forEach((component, j) => center.setComponent(component, fit.center[j]));
      rims.push({centerMm: mesh.localToWorld(center).toArray(), axis: new THREE.Vector3().setComponent(axis, 1).transformDirection(mesh.matrixWorld).toArray(), radiusMm: fit.radius, vertices: keys.length, maxCircleErrorMm: fit.maxError});
    }
  }
  return rims.sort((a, b) => a.centerMm[0] - b.centerMm[0]);
}

function holePair(rims, earCenter, label) {
  requireValue(rims.length, `${label}: no actual closed circular rims`);
  const nearest = rims.reduce((a, b) => transverseDistance(a.centerMm, earCenter) < transverseDistance(b.centerMm, earCenter) ? a : b);
  const pair = rims.filter(rim => transverseDistance(rim.centerMm, nearest.centerMm) < EPS);
  requireValue(pair.length === 2, `${label}: expected two planes around the same actual bore`);
  return pair;
}

function meshVertices(mesh) {
  const position = mesh.geometry.attributes.position, points = [];
  for (let i = 0; i < position.count; i++) points.push(mesh.localToWorld(new THREE.Vector3().fromBufferAttribute(position, i)));
  return points;
}

function inspectOutput(model, servo) {
  const shaft = requireValue(model.root.getObjectByName('Pitch servo body splined output'), 'Missing actual pitch output mesh');
  const arm = requireValue(model.parts['pitch-servo-arm'], 'Missing retained native left arm');
  const origin = servo.output.getWorldPosition(new THREE.Vector3()), axis = new THREE.Vector3(0, 0, 1).transformDirection(servo.output.matrixWorld);
  const vertices = meshVertices(shaft), projected = vertices.map(point => point.clone().sub(origin).dot(axis));
  const axialRange = range(projected), radius = Math.max(...vertices.map(point => point.clone().sub(origin).cross(axis).length()));
  const rims = circularRims(arm, 0, .5, 12).filter(rim => {
    const delta = new THREE.Vector3(...rim.centerMm).sub(origin);
    return delta.clone().cross(axis).length() < EPS && delta.dot(axis) >= axialRange[0] - EPS && rim.radiusMm >= radius - .02;
  });
  requireValue(rims.length, 'No actual left-arm receiving rim along the current shaft axis');
  const firstPlane = Math.min(...rims.map(rim => new THREE.Vector3(...rim.centerMm).sub(origin).dot(axis)));
  const atPlane = rims.filter(rim => Math.abs(new THREE.Vector3(...rim.centerMm).sub(origin).dot(axis) - firstPlane) < EPS);
  const receivingRim = atPlane.reduce((a, b) => a.radiusMm < b.radiusMm ? a : b);
  return {originMm: origin.toArray(), axis: axis.toArray(), shaftWorldXRangeMm: range(vertices.map(point => point.x)), actualShaftProjectionMm: axialRange, actualMaximumShaftRadiusMm: radius, receivingRim, receivingPlaneProjectionMm: firstPlane, tipBeyondReceivingPlaneMm: axialRange[1] - firstPlane, scope: 'Actual shaft vertices and native arm circular entry plane; projected entry only, not tooth engagement, contact pressure or manufacturing fit'};
}

/** Inspect the current actual assembly without changing any object pose or
 * loading private/PDF sources. Source-hole-to-ear correspondence is an explicit
 * assumption: this tool exposes geometric inconsistency, not a production BOM. */
export async function inspectStackChanServoMount() {
  const previousDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  let model;
  if (!globalThis.document) {
    const noop = () => {}, context = new Proxy({measureText: () => ({width: 20}), createLinearGradient: () => ({addColorStop: noop}), createRadialGradient: () => ({addColorStop: noop})}, {get: (object, key) => object[key] ?? noop});
    Object.defineProperty(globalThis, 'document', {configurable: true, writable: true, value: {createElement: () => ({getContext: () => context})}});
  }
  try {
    const {StackChan} = await import('../src/devices/stackchan/index.js');
    model = new StackChan({artwork: false}); model.root.updateMatrixWorld(true);
    const servo = model.stackchanAssembly.mechanics.pitchServo;
    const coverRims = circularRims(model.parts['servo-rear-cover'], 0), cradleRims = circularRims(model.parts['neck-cradle'], 0);
    const output = inspectOutput(model, servo), outputOrigin = new THREE.Vector3(...output.originMm), outputAxis = new THREE.Vector3(...output.axis);
    const mounts = ['front', 'rear'].map(side => {
      const mesh = requireValue(servo.group.getObjectByName(`Pitch servo body ${side} mounting ear`), `Missing actual ${side} ear`);
      const earRims = circularRims(mesh, 2);
      requireValue(earRims.length === 2, `${side}: expected two actual ear bore rims`);
      const center = earRims[0].centerMm, cover = holePair(coverRims, center, `${side} white cover`), cradle = holePair(cradleRims, center, `${side} cradle`);
      const xRange = rims => range(rims.map(rim => rim.centerMm[0])), earX = xRange(earRims), coverX = xRange(cover), cradleX = xRange(cradle);
      requireValue([...earRims, ...cover, ...cradle].every(rim => Math.abs(rim.axis[0]) > 1 - 1e-8), 'Mount diagnostic expects the actual parallel world-X bore axes');
      const centerOf = rims => rims.reduce((sum, rim) => sum.map((value, i) => value + rim.centerMm[i] / rims.length), [0, 0, 0]);
      const coverCenter = centerOf(cover), cradleCenter = centerOf(cradle);
      const radialDistance = point => new THREE.Vector3(...point).sub(outputOrigin).cross(outputAxis).length();
      return {side, earRims, whiteCoverRims: cover, cradleRims: cradle, actualEarWorldXFaceRangeMm: earX, whiteCoverWorldXFaceRangeMm: coverX, cradleWorldXFaceRangeMm: cradleX,
        earMinusCoverYZMm: [center[1] - coverCenter[1], center[2] - coverCenter[2]], earToCoverAxisErrorMm: transverseDistance(center, coverCenter), earToCradleAxisErrorMm: transverseDistance(center, cradleCenter),
        earToNearestCoverFaceGapMm: gap(earX, coverX), earToNearestCradleFaceGapMm: gap(earX, cradleX), requiredPositiveXShiftToNearCradleFaceMm: cradleX[0] - earX[1],
        earAxisDistanceFromOutputAxisMm: radialDistance(center), coverAxisDistanceFromOutputAxisMm: radialDistance(coverCenter)};
    });
    const minimumRequiredShift = Math.min(...mounts.map(mount => mount.requiredPositiveXShiftToNearCradleFaceMm));
    const entryAfterShift = output.tipBeyondReceivingPlaneMm - minimumRequiredShift;
    const unsupported = mounts.some(mount => mount.earToNearestCradleFaceGapMm > EPS || mount.earToCoverAxisErrorMm > EPS);
    return {schemaVersion: 1, id: 'stackchan', status: unsupported ? 'mount-unresolved' : 'sampled-mount-correspondence-only', runtimeChanged: false, sourceHoleToEarCorrespondence: 'Assumed from the matching two-hole spacing and nearby Y/Z axes; not established as the actual production fixing scheme', mounts, outputReceiver: output,
      rigidConstraints: {axialTranslationPreservesTransverseAxisErrors: true, minimumPositiveXShiftToAssumedCradleSeatMm: minimumRequiredShift, projectedEntryAfterThatWholeServoShiftMm: entryAfterShift, wholeServoAxialShiftWouldLoseCurrentArmEntry: minimumRequiredShift > 0 && entryAfterShift <= 0,
        rollCannotExactlyMatchBothCurrentSourceAxes: mounts.some(mount => Math.abs(mount.earAxisDistanceFromOutputAxisMm - mount.coverAxisDistanceFromOutputAxisMm) > EPS),
        reason: 'Axial motion cannot correct Y/Z offsets. Roll preserves each ear axis distance from the output line. Moving the complete current package to the assumed ear seat also translates its output away from the retained left-arm entry.'},
      sourceNote: {url: 'https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/1205/SCS0009.pdf', page: 6, scope: 'Official linked standalone SCS0009 drawing, not a K151 assembly transform', earBackDatumMm: [16.8, 18.4], outputFaceToBackMm: 25.25, correspondingLocalEarZMm: [-8.45, -6.85], review: 'The page-6 dimensions agree with the implemented ear depth; this diagnostic does not attribute the discrepancy to a misread ear depth or substitute a different servo variant.'},
      limits: ['Measured mesh/rim geometry only; no source CAD, joint axis, servo size or pose is changed.', 'The assumed source-hole mating assignment and production servo variant remain unconfirmed; no manufacturing fit or tolerance conclusion.', 'Projected shaft entry is not proof of spline contact or a load-bearing attachment.', 'No voxel rerun, full collision proof, material/cable physics, electrical behavior or hardware validation. A non-unresolved status would still describe sampled correspondence only.']};
  } finally {
    model?.dispose();
    if (previousDocument) Object.defineProperty(globalThis, 'document', previousDocument);
    else delete globalThis.document;
  }
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const report = await inspectStackChanServoMount();
  console.log(JSON.stringify(report, null, 2));
  if (process.argv.includes('--strict') && report.status === 'mount-unresolved') process.exitCode = 2;
}
