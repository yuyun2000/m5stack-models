import {printedFilm} from '../../modeling/artwork.js';

// C139 production print. The transparent die-cut includes the antenna,
// battery, screw and connector openings; physical geometry remains separate.
export function addRearArtwork(host) {
  const artwork = printedFilm(host, {
    url: new URL('./artwork/rear-official.png', import.meta.url).href,
    size: [63.2, 115.6],
    position: [0, -0.66, -3.845],
    face: 'back',
    name: 'PaperS3 official rear production print',
    artworkKind: 'official-production-raster',
    roughness: 0.78,
  });
  if (artwork) artwork.raycast = () => {};
  return artwork;
}
