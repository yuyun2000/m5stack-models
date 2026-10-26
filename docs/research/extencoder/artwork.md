# Unit ExtEncoder artwork

Two final PNGs are enabled by default: the top face of the actual green five-pole connector and the rear EXT-ENCODER / STM32F030 / PORT. A. I2C label. Both are `reference-redraw`, reconstructed from readable text and color blocks in this exact U161 product's official photographs. [artwork.json](./artwork.json) records source URLs/hashes, raster hashes, physical placement and limitations.

The connector carries G / 5V / Z / B / A from front-label left to right. These match own schematic P6 pins 5 / 4 / 3 / 2 / 1. The lower Grove row is GND / 5V / SDA / SCL. The rear label reverses that physical view to SCL / SDA / 5V / GND, as printed in the own rear reference. No serial number, QR code or unreadable small text was invented.

The PNGs use 150 pixels per millimetre. They are code-redrawn artwork; no photograph pixels are cut out, projected or enlarged. Only final ordinary PNGs and their public registration/provenance are distributed. Source files, generators and conversion intermediates are excluded.

`new Model({artwork:false})` or `new GroveModule({artwork:false})` hides the print while preserving every physical position/normal/index buffer and transform. The front print projects onto the connector roof and the rear print onto the exact native shell. Neither can close ports or mounting bores. Product print, names and trademarks retain their respective rights.
