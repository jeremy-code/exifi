import type { Format, Ifd, Tag } from "libexif-wasm";

type ExifTagInformation = {
  ifd: Ifd[];
  format: Format[];
  maxNumberOfComponents?: number;
  values?: Record<string, number>;
  asciiValues?: Record<string, string>;
};

/**
 * Information taken from these sources:
 *
 * @see {@link https://www.media.mit.edu/pia/Research/deepview/exif.html}
 * @see {@link https://github.com/libexif/libexif/blob/b9b7f3c08c1b6812ad3b9d62227ad9527ab9385a/libexif/exif-entry.c#L207 }
 * @see {@link https://github.com/libexif/libexif/blob/b9b7f3c08c1b6812ad3b9d62227ad9527ab9385a/libexif/exif-entry.c#L671 }
 */
const EXIF_TAG_MAP: Partial<Record<Tag, ExifTagInformation>> = {
  IMAGE_DESCRIPTION: {
    ifd: ["IFD_0", "IFD_1"],
    format: ["ASCII"],
  },
  MAKE: {
    ifd: ["IFD_0", "IFD_1"],
    format: ["ASCII"],
  },
  MODEL: {
    ifd: ["IFD_0", "IFD_1"],
    format: ["ASCII"],
  },
  ORIENTATION: {
    ifd: ["IFD_0", "IFD_1"],
    format: ["SHORT"],
    maxNumberOfComponents: 1,
    values: {
      "Top-left": 1,
      "Top-right": 2,
      "Bottom-right": 3,
      "Bottom-left": 4,
      "Left-top": 5,
      "Right-top": 6,
      "Right-bottom": 7,
      "Left-bottom": 8,
    },
  },
  X_RESOLUTION: {
    ifd: ["IFD_0", "IFD_1"],
    format: ["RATIONAL"],
    maxNumberOfComponents: 1,
  },
  Y_RESOLUTION: {
    ifd: ["IFD_0", "IFD_1"],
    format: ["RATIONAL"],
    maxNumberOfComponents: 1,
  },
  RESOLUTION_UNIT: {
    ifd: ["IFD_0", "IFD_1"],
    format: ["SHORT"],
    maxNumberOfComponents: 1,
    values: {
      Inch: 2,
      Centimeter: 3,
    },
  },
  SOFTWARE: {
    ifd: ["IFD_0", "IFD_1"],
    format: ["ASCII"],
  },
  DATE_TIME: {
    ifd: ["IFD_0", "IFD_1"],
    format: ["ASCII"],
    maxNumberOfComponents: 20,
  },
  WHITE_POINT: {
    ifd: ["IFD_0", "IFD_1"],
    format: ["RATIONAL"],
    maxNumberOfComponents: 2,
  },
  PRIMARY_CHROMATICITIES: {
    ifd: ["IFD_0", "IFD_1"],
    format: ["RATIONAL"],
    maxNumberOfComponents: 6,
  },
  YCBCR_COEFFICIENTS: {
    ifd: ["IFD_0"],
    format: ["RATIONAL"],
    maxNumberOfComponents: 3,
  },
  YCBCR_POSITIONING: {
    ifd: ["IFD_0"],
    format: ["SHORT"],
    maxNumberOfComponents: 1,
    values: {
      Centered: 1,
      "Co-sited": 2,
    },
  },
  REFERENCE_BLACK_WHITE: {
    ifd: ["IFD_0", "IFD_1"],
    format: ["RATIONAL"],
    maxNumberOfComponents: 6,
  },
  COPYRIGHT: {
    ifd: ["IFD_0", "IFD_1"],
    format: ["ASCII"],
  },
  EXIF_IFD_POINTER: {
    ifd: ["IFD_0"],
    format: ["LONG"],
    maxNumberOfComponents: 1,
  },
  EXPOSURE_TIME: {
    ifd: ["EXIF"],
    format: ["RATIONAL"],
    maxNumberOfComponents: 1,
  },
  FNUMBER: {
    ifd: ["EXIF"],
    format: ["RATIONAL"],
    maxNumberOfComponents: 1,
  },
  EXPOSURE_PROGRAM: {
    ifd: ["EXIF"],
    format: ["SHORT"],
    maxNumberOfComponents: 1,
    values: {
      "Not defined": 0,
      Manual: 1,
      "Normal program": 2,
      "Aperture priority": 3,
      "Shutter priority": 4,
      "Creative program (biased toward depth of field)": 5,
      "Creative program (biased toward fast shutter speed)": 6,
      "Portrait mode (for closeup photos with the background out of focus)": 7,
      "Landscape mode (for landscape photos with the background in focus)": 8,
    },
  },
  ISO_SPEED_RATINGS: {
    ifd: ["EXIF"],
    format: ["SHORT"],
    maxNumberOfComponents: 2,
  },
  EXIF_VERSION: {
    ifd: ["EXIF"],
    format: ["UNDEFINED"],
    maxNumberOfComponents: 4,
  },
  DATE_TIME_ORIGINAL: {
    ifd: ["EXIF"],
    format: ["ASCII"],
    maxNumberOfComponents: 20,
  },
  DATE_TIME_DIGITIZED: {
    ifd: ["EXIF"],
    format: ["ASCII"],
    maxNumberOfComponents: 20,
  },
  COMPONENTS_CONFIGURATION: {
    ifd: ["EXIF"],
    format: ["UNDEFINED"],
  },
  COMPRESSED_BITS_PER_PIXEL: {
    ifd: ["EXIF"],
    format: ["RATIONAL"],
    maxNumberOfComponents: 1,
  },
  SHUTTER_SPEED_VALUE: {
    ifd: ["EXIF"],
    format: ["SRATIONAL"],
    maxNumberOfComponents: 1,
  },
  APERTURE_VALUE: {
    ifd: ["EXIF"],
    format: ["RATIONAL"],
    maxNumberOfComponents: 1,
  },
  BRIGHTNESS_VALUE: {
    ifd: ["EXIF"],
    format: ["SRATIONAL"],
    maxNumberOfComponents: 1,
  },
  EXPOSURE_BIAS_VALUE: {
    ifd: ["EXIF"],
    format: ["SRATIONAL"],
    maxNumberOfComponents: 1,
  },
  MAX_APERTURE_VALUE: {
    ifd: ["EXIF"],
    format: ["RATIONAL"],
    maxNumberOfComponents: 1,
  },
  SUBJECT_DISTANCE: {
    ifd: ["EXIF"],
    format: ["SRATIONAL"],
    maxNumberOfComponents: 1,
  },
  METERING_MODE: {
    ifd: ["EXIF"],
    format: ["SHORT"],
    maxNumberOfComponents: 1,
    values: {
      Unknown: 0,
      Average: 1,
      "Center-weighted average": 2,
      Spot: 3,
      "Multi spot": 4,
      Pattern: 5,
      Partial: 6,
      Other: 255,
    },
  },
  LIGHT_SOURCE: {
    ifd: ["EXIF"],
    format: ["SHORT"],
    maxNumberOfComponents: 1,
    values: {
      Unknown: 0,
      Daylight: 1,
      Fluorescent: 2,
      "Tungsten incandescent light": 3,
      Flash: 4,
      "Fine weather": 9,
      "Cloudy weather": 10,
      Shade: 11,
      "Daylight fluorescent": 12,
      "Day white fluorescent": 13,
      "Cool white fluorescent": 14,
      "White fluorescent": 15,
      "Standard light A": 17,
      "Standard light B": 18,
      "Standard light C": 19,
      D55: 20,
      D65: 21,
      D75: 22,
      "ISO studio tungsten": 24,
      Other: 255,
    },
  },
  FLASH: {
    ifd: ["EXIF"],
    format: ["SHORT"],
    maxNumberOfComponents: 1,
    values: {
      "Flash did not fire": 0x0000,
      "Flash fired": 0x0001,
      "Strobe return light not detected": 0x0005,
      "Strobe return light detected": 0x0007,
      "Flash fired, compulsory flash mode": 0x0009,
      "Flash fired, compulsory flash mode, return light not detected": 0x000d,
      "Flash fired, compulsory flash mode, return light detected": 0x000f,
      "Flash did not fire, compulsory flash mode": 0x0010,
      "Flash did not fire, auto mode": 0x0018,
      "Flash fired, auto mode": 0x0019,
      "Flash fired, auto mode, return light not detected": 0x001d,
      "Flash fired, auto mode, return light detected": 0x001f,
      "No flash function": 0x0020,
      "Flash fired, red-eye reduction mode": 0x0041,
      "Flash fired, red-eye reduction mode, return light not detected": 0x0045,
      "Flash fired, red-eye reduction mode, return light detected": 0x0047,
      "Flash fired, compulsory flash mode, red-eye reduction mode": 0x0049,
      "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected": 0x004d,
      "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected": 0x004f,
      "Flash did not fire, auto mode, red-eye reduction mode": 0x0058,
      "Flash fired, auto mode, red-eye reduction mode": 0x0059,
      "Flash fired, auto mode, return light not detected, red-eye reduction mode": 0x005d,
      "Flash fired, auto mode, return light detected, red-eye reduction mode": 0x005f,
    },
  },
  FOCAL_LENGTH: {
    ifd: ["EXIF"],
    format: ["RATIONAL"],
    maxNumberOfComponents: 1,
  },
  MAKER_NOTE: {
    ifd: ["EXIF"],
    format: ["UNDEFINED"],
  },
  USER_COMMENT: {
    ifd: ["EXIF"],
    format: ["UNDEFINED"],
  },
  FLASH_PIX_VERSION: {
    ifd: ["EXIF"],
    format: ["UNDEFINED"],
    maxNumberOfComponents: 4,
  },
  COLOR_SPACE: {
    ifd: ["EXIF"],
    format: ["SHORT"],
    maxNumberOfComponents: 1,
    values: {
      sRGB: 1,
      "Adobe RGB": 2,
      Uncalibrated: 0xffff,
    },
  },
  IMAGE_WIDTH: {
    ifd: ["IFD_1", "EXIF"],
    format: ["SHORT", "LONG"],
    maxNumberOfComponents: 1,
  },
  IMAGE_LENGTH: {
    ifd: ["IFD_1", "EXIF"],
    format: ["LONG"],
    maxNumberOfComponents: 1,
  },
  RELATED_SOUND_FILE: {
    ifd: ["EXIF"],
    format: ["ASCII"],
  },
  INTEROPERABILITY_IFD_POINTER: {
    ifd: ["EXIF"],
    format: ["LONG"],
    maxNumberOfComponents: 1,
  },
  FOCAL_PLANE_X_RESOLUTION: {
    ifd: ["EXIF"],
    format: ["RATIONAL"],
    maxNumberOfComponents: 1,
  },
  FOCAL_PLANE_Y_RESOLUTION: {
    ifd: ["EXIF"],
    format: ["RATIONAL"],
    maxNumberOfComponents: 1,
  },
  FOCAL_PLANE_RESOLUTION_UNIT: {
    ifd: ["EXIF"],
    format: ["SHORT"],
    maxNumberOfComponents: 1,
    values: {
      Inch: 2,
      Centimeter: 3,
    },
  },
  SENSING_METHOD: {
    ifd: ["EXIF"],
    format: ["SHORT"],
    maxNumberOfComponents: 1,
    values: {
      "Not defined": 1,
      "One-chip color area sensor": 2,
      "Two-chip color area sensor": 3,
      "Three-chip color area sensor": 4,
      "Color sequential area sensor": 5,
      "Trilinear sensor": 7,
      "Color sequential linear sensor": 8,
    },
  },
  FILE_SOURCE: {
    ifd: ["EXIF"],
    format: ["UNDEFINED"],
    maxNumberOfComponents: 1,
  },
  SCENE_TYPE: {
    ifd: ["EXIF"],
    format: ["UNDEFINED"],
    maxNumberOfComponents: 1,
    values: {
      "Directly photographed": 1,
    },
  },

  BITS_PER_SAMPLE: {
    ifd: ["IFD_1"],
    format: ["SHORT"],
    maxNumberOfComponents: 3,
  },
  COMPRESSION: {
    ifd: ["IFD_1"],
    format: ["SHORT"],
    maxNumberOfComponents: 1,
    values: {
      Uncompressed: 1,
      "LZW compression": 5,
      "JPEG compression": 6,
      "Deflate/ZIP compression": 8,
      "PackBits compression": 32773,
    },
  },
  PHOTOMETRIC_INTERPRETATION: {
    ifd: ["IFD_1"],
    format: ["SHORT"],
    maxNumberOfComponents: 1,
    values: {
      "Reversed mono": 0,
      "Normal mono": 1,
      RGB: 2,
      Palette: 3,
      CMYK: 5,
      YCbCr: 6,
      CieLAB: 8,
    },
  },
  STRIP_OFFSETS: {
    ifd: ["IFD_1"],
    format: ["SHORT", "LONG"],
  },
  SAMPLES_PER_PIXEL: {
    ifd: ["IFD_1"],
    format: ["SHORT"],
    maxNumberOfComponents: 1,
  },
  ROWS_PER_STRIP: {
    ifd: ["IFD_1"],
    format: ["LONG"],
    maxNumberOfComponents: 1,
  },
  STRIP_BYTE_COUNTS: {
    ifd: ["IFD_1"],
    format: ["LONG"],
  },
  PLANAR_CONFIGURATION: {
    ifd: ["IFD_1"],
    format: ["SHORT"],
    maxNumberOfComponents: 1,
    values: {
      "Chunky format": 0,
      "Planar format": 1,
    },
  },
  // JPEG_IF_OFFSET: {
  //   ifd: ["IFD_1"],
  //   format: ["LONG"],
  //   maxNumberOfComponents: 1,
  // },
  // JPEG_IF_BYTE_COUNT: {
  //   ifd: ["IFD_1"],
  //   format: ["LONG"],
  //   maxNumberOfComponents: 1,
  // },
  YCBCR_SUB_SAMPLING: {
    ifd: ["IFD_1"],
    format: ["SHORT"],
    maxNumberOfComponents: 2,
  },

  // ---- Misc ----
  ARTIST: {
    ifd: ["IFD_0"],
    format: ["ASCII"],
  },
  GPS_INFO_IFD_POINTER: {
    ifd: ["IFD_0"],
    format: ["LONG"],
    maxNumberOfComponents: 1,
  },
  SUB_SEC_TIME: {
    ifd: ["EXIF"],
    format: ["ASCII"],
  },
  SUB_SEC_TIME_ORIGINAL: {
    ifd: ["EXIF"],
    format: ["ASCII"],
  },
  SUB_SEC_TIME_DIGITIZED: {
    ifd: ["EXIF"],
    format: ["ASCII"],
  },
  SUBJECT_AREA: {
    ifd: ["EXIF"],
    format: ["SHORT"],
  },
  CUSTOM_RENDERED: {
    ifd: ["EXIF"],
    format: ["SHORT"],
    values: {
      "Normal process": 0,
      "Custom process": 1,
    },
  },
  EXPOSURE_MODE: {
    ifd: ["EXIF"],
    format: ["SHORT"],
    values: {
      "Auto exposure": 0,
      "Manual exposure": 1,
      "Auto bracket": 2,
    },
  },
  WHITE_BALANCE: {
    ifd: ["EXIF"],
    format: ["SHORT"],
    values: {
      "Auto white balance": 0,
      "Manual white balance": 1,
    },
  },
  SCENE_CAPTURE_TYPE: {
    ifd: ["EXIF"],
    format: ["SHORT"],
    values: {
      Standard: 0,
      Landscape: 1,
      Portrait: 2,
      "Night scene": 3,
    },
  },
  GAIN_CONTROL: {
    ifd: ["EXIF"],
    format: ["SHORT"],
    values: {
      Normal: 0,
      "Low gain up": 1,
      "High gain up": 2,
      "Low gain down": 3,
      "High gain down": 4,
    },
  },
  SATURATION: {
    ifd: ["EXIF"],
    format: ["SHORT"],
    values: {
      Normal: 0,
      "Low saturation": 1,
      "High saturation": 2,
    },
  },
  CONTRAST: {
    ifd: ["EXIF"],
    format: ["SHORT"],
    values: {
      Normal: 0,
      Soft: 1,
      Hard: 2,
    },
  },
  SHARPNESS: {
    ifd: ["EXIF"],
    format: ["SHORT"],
    values: {
      Normal: 0,
      Soft: 1,
      Hard: 2,
    },
  },
  SENSITIVITY_TYPE: {
    ifd: ["EXIF"],
    format: ["SHORT"],
    values: {
      Unknown: 0,
      "Standard output sensitivity (SOS)": 1,
      "Recommended exposure index (REI)": 2,
      "ISO speed": 3,
      "Standard output sensitivity (SOS) and recommended exposure index (REI)": 4,
      "Standard output sensitivity (SOS) and ISO speed": 5,
      "Recommended exposure index (REI) and ISO speed": 6,
      "Standard output sensitivity (SOS) and recommended exposure index (REI) and ISO speed": 7,
    },
  },
  SUBJECT_DISTANCE_RANGE: {
    ifd: ["EXIF"],
    format: ["SHORT"],
    values: {
      Unknown: 0,
      Macro: 1,
      "Close view": 2,
      "Distant view": 3,
    },
  },
  COMPOSITE_IMAGE: {
    ifd: ["EXIF"],
    format: ["SHORT"],
    values: {
      Unknown: 0,
      "Not a composite image": 1,
      "General composite image": 2,
      "Composite image captured while shooting": 3,
    },
  },

  // Also called SubfileType
  NEW_SUBFILE_TYPE: {
    ifd: ["IFD_0"],
    format: ["SHORT", "LONG"],
    maxNumberOfComponents: 1,
  },
  TRANSFER_FUNCTION: {
    ifd: ["IFD_0"],
    format: ["SHORT"],
    maxNumberOfComponents: 3,
  },
  // PREDICTOR: {
  //   format: ["SHORT"],
  //   maxNumberOfComponents: 1,
  // },
  // TILE_WIDTH: {
  //   ifd: ["IFD_0"],
  //   format: ["SHORT"],
  //   maxNumberOfComponents: 1,
  // },
  // TILE_LENGTH: {
  //   ifd: ["IFD_0"],
  //   format: ["SHORT"],
  //   maxNumberOfComponents: 1,
  // },
  // TILE_OFFSETS: {
  //   ifd: ["IFD_0"],
  //   format: ["LONG"],
  // },
  // TILE_BYTE_COUNTS: {
  //   ifd: ["IFD_0"],
  //   format: ["SHORT"],
  // },
  SUB_IFDS: {
    ifd: ["IFD_0"],
    format: ["LONG"],
  },
  // JPEG_TABLES: {
  //   ifd: ["IFD_0"],
  //   format: ["UNDEFINED"],
  // },
  CFA_REPEAT_PATTERN_DIM: {
    ifd: ["IFD_0"],
    format: ["SHORT"],
    maxNumberOfComponents: 2,
  },
  CFA_PATTERN: {
    ifd: ["IFD_0"],
    format: ["BYTE"],
  },
  BATTERY_LEVEL: {
    ifd: ["IFD_0"],
    format: ["RATIONAL"],
    maxNumberOfComponents: 1,
  },
  IPTC_NAA: {
    ifd: ["IFD_0"],
    format: ["LONG"],
  },
  INTER_COLOR_PROFILE: {
    ifd: ["IFD_0"],
    format: ["UNDEFINED"],
  },
  SPECTRAL_SENSITIVITY: {
    ifd: ["IFD_0"],
    format: ["ASCII"],
  },
  OECF: {
    ifd: ["IFD_0"],
    format: ["UNDEFINED"],
  },
  // INTERLACE: {
  //   ifd: ["IFD_0"],
  //   format: ["SHORT"],
  //   maxNumberOfComponents: 1,
  // },
  TIME_ZONE_OFFSET: {
    ifd: ["IFD_0"],
    format: ["SSHORT"],
    maxNumberOfComponents: 1,
  },
  // SELF_TIMER_MODE: {
  //   ifd: ["IFD_0"],
  //   format: ["SHORT"],
  //   maxNumberOfComponents: 1,
  // },
  FLASH_ENERGY: {
    ifd: ["EXIF"],
    format: ["RATIONAL"],
    maxNumberOfComponents: 1,
  },
  SPATIAL_FREQUENCY_RESPONSE: {
    ifd: ["EXIF"],
    format: ["UNDEFINED", "SHORT"],
    // maxNumberOfComponents: 1, // unknown maxNumber if UNDEFINED
  },
  // NOISE: {
  //   ifd: ["EXIF"],
  //   format: ["UNDEFINED"],
  // },
  // IMAGE_NUMBER: {
  //   ifd: ["EXIF"],
  //   format: ["LONG"],
  //   maxNumberOfComponents: 1,
  // },
  // SECURITY_CLASSIFICATION: {
  //   ifd: ["EXIF"],
  //   format: ["ASCII"],
  //   maxNumberOfComponents: 1,
  // },
  // IMAGE_HISTORY: {
  //   ifd: ["EXIF"],
  //   format: ["ASCII"],
  // },
  SUBJECT_LOCATION: {
    ifd: ["EXIF"],
    format: ["SHORT"],
    // Could also be
    // maxNumberOfComponents: 1,
    maxNumberOfComponents: 4,
  },
  EXPOSURE_INDEX: {
    ifd: ["EXIF"],
    format: ["RATIONAL"],
    maxNumberOfComponents: 1,
  },
  TIFF_EP_STANDARD_ID: {
    ifd: ["EXIF"],
    format: ["BYTE"],
    maxNumberOfComponents: 4,
  },

  NEW_CFA_PATTERN: {
    ifd: ["EXIF"],
    format: ["UNDEFINED"],
    maxNumberOfComponents: 1,
  },

  ALTITUDE_REF: {
    ifd: ["GPS"],
    format: ["BYTE"],
    maxNumberOfComponents: 1,
    values: {
      "Sea level": 0,
      "Sea level reference": 1,
    },
  },
  LATITUDE_REF: {
    ifd: ["GPS"],
    format: ["ASCII"],
    maxNumberOfComponents: 2,
    asciiValues: {
      North: "N",
      South: "S",
    },
  },
  LONGITUDE_REF: {
    ifd: ["GPS"],
    format: ["ASCII"],
    maxNumberOfComponents: 2,
    asciiValues: {
      East: "E",
      West: "W",
    },
  },
  SPEED_REF: {
    ifd: ["GPS"],
    format: ["ASCII"],
    maxNumberOfComponents: 2,
    asciiValues: {
      "km/hr": "K",
      "miles/hr": "M",
      knots: "N",
    },
  },
  IMG_DIRECTION_REF: {
    ifd: ["GPS"],
    format: ["ASCII"],
    maxNumberOfComponents: 2,
    asciiValues: {
      "True direction": "T",
      "Magnetic direction": "M",
    },
  },
  DEST_BEARING_REF: {
    ifd: ["GPS"],
    format: ["ASCII"],
    maxNumberOfComponents: 2,
    asciiValues: {
      "True direction": "T",
      "Magnetic direction": "M",
    },
  },
};

export { EXIF_TAG_MAP, type ExifTagInformation };
