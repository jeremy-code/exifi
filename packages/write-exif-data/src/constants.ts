const MARKER_FIRST_BYTE = 0xff;

const enum JpegMarker {
  /** Encoding (baseline) */
  SOF0 = 0xc0,
  /** Encoding (extended sequential) */
  SOF1 = 0xc1,
  /** Encoding (progressive) */
  SOF2 = 0xc2,
  /** Encoding (lossless) */
  SOF3 = 0xc3,
  /** Encoding (differential sequential) */
  SOF5 = 0xc5,
  /** Encoding (differential progressive) */
  SOF6 = 0xc6,
  /** Encoding (differential lossless) */
  SOF7 = 0xc7,
  /** Encoding (extended sequential, arithmetic) */
  SOF9 = 0xc9,
  /** Encoding (progressive, arithmetic) */
  SOF10 = 0xca,
  /** Encoding (lossless, arithmetic) */
  SOF11 = 0xcb,
  /** Encoding (differential sequential, arithmetic) */
  SOF13 = 0xcd,
  /** Encoding (differential progressive, arithmetic) */
  SOF14 = 0xce,
  /** Encoding (differential loss, arithmetic) */
  SOF15 = 0xcf,

  /** Start of Image */
  SOI = 0xd8,
  /** End of Image */
  EOI = 0xd9,
  /** Start of Scan */
  SOS = 0xda,
  /** Comment */
  COM = 0xfe,
  /** Define Huffman table */
  DHT = 0xc4,
  /** Extension */
  JPG = 0xc8,
  /** Define arithmetic coding conditioning */
  DAC = 0xcc,

  /** Restart 0 */
  RST0 = 0xd0,
  /** Restart 1 */
  RST1 = 0xd1,
  /** Restart 2 */
  RST2 = 0xd2,
  /** Restart 3 */
  RST3 = 0xd3,
  /** Restart 4 */
  RST4 = 0xd4,
  /** Restart 5 */
  RST5 = 0xd5,
  /** Restart 6 */
  RST6 = 0xd6,
  /** Restart 7 */
  RST7 = 0xd7,

  /** Define quantization table */
  DQT = 0xdb,
  /** Define number of lines */
  DNL = 0xdc,
  /** Define restart interval */
  DRI = 0xdd,
  /** Define hierarchical progression */
  DHP = 0xde,
  /** Expand reference component */
  EXP = 0xdf,

  /* Application segment 0 */
  APP0 = 0xe0,
  /* Application segment 1 */
  APP1 = 0xe1,
  /* Application segment 2 */
  APP2 = 0xe2,
  /* Application segment 3 */
  APP3 = 0xe3,
  /* Application segment 4 */
  APP4 = 0xe4,
  /* Application segment 5 */
  APP5 = 0xe5,
  /* Application segment 6 */
  APP6 = 0xe6,
  /* Application segment 7 */
  APP7 = 0xe7,
  /* Application segment 8 */
  APP8 = 0xe8,
  /* Application segment 9 */
  APP9 = 0xe9,
  /* Application segment 10 */
  APP10 = 0xea,
  /* Application segment 11 */
  APP11 = 0xeb,
  /* Application segment 12 */
  APP12 = 0xec,
  /* Application segment 13 */
  APP13 = 0xed,
  /* Application segment 14 */
  APP14 = 0xee,
  /* Application segment 15 */
  APP15 = 0xef,

  JPG0 = 0xf0,
  /* Extension 1 */
  JPG1 = 0xf1,
  /* Extension 2 */
  JPG2 = 0xf2,
  /* Extension 3 */
  JPG3 = 0xf3,
  /* Extension 4 */
  JPG4 = 0xf4,
  /* Extension 5 */
  JPG5 = 0xf5,
  /* Extension 6 */
  JPG6 = 0xf6,
  /* Extension 7 */
  JPG7 = 0xf7,
  /* Extension 8 */
  JPG8 = 0xf8,
  /* Extension 9 */
  JPG9 = 0xf9,
  /* Extension 10 */
  JPG10 = 0xfa,
  /* Extension 11 */
  JPG11 = 0xfb,
  /* Extension 12 */
  JPG12 = 0xfc,
  /* Extension 13 */
  JPG13 = 0xfd,
}

const EXIF_HEADER = new Uint8Array([0x45, 0x78, 0x69, 0x66, 0x00, 0x00]); // Exif\0\0

export { MARKER_FIRST_BYTE, JpegMarker, EXIF_HEADER };
