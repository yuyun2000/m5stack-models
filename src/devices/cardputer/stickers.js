import {printedArtwork} from '../../modeling/artwork.js';

// Readable print regions cut from the official front, side and rear product
// views. Physical keys, display, ports and fasteners stay separately modeled.
export function addStickers(host) {
  const upper = host.parts['upper-housing'];
  const add = (file, options) => printedArtwork(host, {
    url: new URL(`./artwork/${file}.png`, import.meta.url).href,
    artworkKind: 'official-photo-raster',
    ...options,
  });
  for (let row = 0; row < 4; row++) {
    add(`keyboard-${row + 1}`, {
      target: upper, size: [81.6, 3.72], position: [0, 3.66 - row * 7.5, 5.962],
      depth: 0.24, name: `Cardputer fixed keyboard legends row ${row + 1}`,
    });
  }
  add('front-name', {
    target: upper, size: [17.4, 16.9], position: [-32.1, 17.6, 9.562],
    depth: 0.24, name: 'Cardputer name and microphone legends',
  });
  add('stamp', {
    target: host.parts['stamp-label-carrier'], size: [23.1, 16.7], position: [27.8, 16.47, 9.866],
    depth: 0.22, name: 'Stamp-S3 circuit cover print',
  });
  add('m5-logo', {
    target: upper, size: [8.8, 13.9], position: [8.5, 17.9, 9.562],
    depth: 0.24, name: 'Cardputer M5 wordmark',
  });
  add('top-edge', {
    target: upper, size: [82.0, 11.8], position: [0, 26.80, 4.08],
    face: 'top', rotation: Math.PI, depth: 0.48, name: 'Cardputer top edge legends',
  });
  add('grove-side', {
    target: upper, size: [21.7, 7.9], position: [-41.80, 14.4, 4.02],
    face: 'left', depth: 0.44, name: 'Cardputer Grove labels',
  });
  add('rear', {
    target: host.parts['battery-base'], size: [77.3, 28.0], position: [0, -11.28, -9.68],
    face: 'back', depth: 0.62, name: 'Cardputer rear pin legend print',
  });
  add('rear-rail', {
    target: host.parts['battery-base'], size: [76.1, 5.5], position: [0, 15, -8.638],
    face: 'back', depth: 0.33, name: 'Cardputer rear mounting rail legend',
  });
}
