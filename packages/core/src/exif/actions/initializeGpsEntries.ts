import { ExifIfd, mapRationalFromObject, type ExifData } from "libexif-wasm";

import { getOrInsertEntry } from "#exif/utils/getOrInsertEntry";

/**
 * Initializes GPS entries (latitude, longitude) with the correct format,
 * setting a default value if necessary. This defaults to the geographic center
 * of the United States (including Alaska, Hawaii): 44° 58′ 2.08″ N, 103° 46′
 * 17.6″ W.
 *
 * @see {@link https://www.ngs.noaa.gov/cgi-bin/ds_mark.prl?PidBox=PU2386}
 * @see {@link https://geohack.toolforge.org/geohack.php?pagename=Geographic_center_of_the_United_States&params=44_58_2.08_N_103_46_17.60_W_}
 */
const initializeGpsEntries = (exifData: ExifData) => {
  const exifDataGpsIfd = exifData.ifd[ExifIfd.GPS];
  const latitudeEntry = getOrInsertEntry(exifDataGpsIfd, "LATITUDE");
  const longitudeEntry = getOrInsertEntry(exifDataGpsIfd, "LONGITUDE");
  const latitudeRefEntry = getOrInsertEntry(exifDataGpsIfd, "LATITUDE_REF");
  const longitudeRefEntry = getOrInsertEntry(exifDataGpsIfd, "LONGITUDE_REF");

  latitudeEntry.format = "RATIONAL";
  longitudeEntry.format = "RATIONAL";
  latitudeRefEntry.format = "ASCII";
  longitudeRefEntry.format = "ASCII";

  if (latitudeEntry.size === 0) {
    latitudeEntry.fromTypedArray(
      mapRationalFromObject(
        [
          { numerator: 44, denominator: 1 },
          { numerator: 58, denominator: 1 },
          { numerator: 103_811, denominator: 50_000 },
        ],
        "RATIONAL",
      ),
    );
  }

  if (longitudeEntry.size === 0) {
    longitudeEntry.fromTypedArray(
      mapRationalFromObject(
        [
          { numerator: 103, denominator: 1 },
          { numerator: 46, denominator: 1 },
          { numerator: 1_760_283, denominator: 100_000 },
        ],
        "RATIONAL",
      ),
    );
  }

  if (latitudeRefEntry.size === 0) {
    latitudeRefEntry.fromTypedArray(new TextEncoder().encode("N\u0000"));
  }

  if (longitudeRefEntry.size === 0) {
    longitudeRefEntry.fromTypedArray(new TextEncoder().encode("W\u0000"));
  }
};

export { initializeGpsEntries };
