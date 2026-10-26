# U101 Watering artwork

Two ordinary PNGs accompany the model: the rear Unit legend and the motor-can mark. [artwork.json](./artwork.json) records each raster's SHA-256, pixel size, physical registration, method and public reference.

The 2400 × 3000 rear raster uses the exact supplied source outlines, including all standard English text, coloured connector blocks, arrows and product diagram. The source exporter omitted fill colours. These were restored using the corresponding source preview and exact-model official photographs; compound outlines use nonzero winding. The alternative Chinese educational title present in the same source is excluded to match the standard photographed Unit. This is explicitly `source-vector-raster` with restoration, not an unmodified source export or a photograph crop.

The 2600 × 1600 motor raster is a new code-drawn `reference-redraw` of legible model, maker and certification text from the exact U101 motor photograph. Tiny unreadable numerical/production lines and barcode details are omitted rather than invented. Font metrics, cylindrical registration, colour and spacing remain appearance estimates.

The rear label is projected onto the genuine native rear shell and the motor legend onto the physical metal motor can. Both remain optional through `artwork:false`; all configurations preserve physical attributes, indices and `matrixWorld`. Only these final ordinary PNGs are distributed. Private tables, private source links, source filenames, vectors, raw reference media, original CAD, conversion scripts and intermediates remain outside the repository. Product names, printed designs and trademarks retain their respective rights. No exhaustive image or browser review is claimed.
