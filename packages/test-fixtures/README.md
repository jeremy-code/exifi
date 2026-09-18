# @exifi/test-fixtures

## Files

### plain-jpg.jpg

```c
// libjpeg-turbo v3.2.0
#include <stdio.h>
#include <stdlib.h>

#include <jpeglib.h>

int main(void) {
  FILE *file = fopen("plain-jpg.jpg", "wb");
  if (!file) {
    return EXIT_FAILURE;
  }

  struct jpeg_compress_struct cinfo;
  struct jpeg_error_mgr jerr;
  cinfo.err = jpeg_std_error(&jerr);
  jpeg_create_compress(&cinfo);

  jpeg_stdio_dest(&cinfo, file);

  cinfo.image_width = 1;
  cinfo.image_height = 1;
  cinfo.input_components = 1;
  cinfo.in_color_space = JCS_GRAYSCALE;

  jpeg_set_defaults(&cinfo);

  jpeg_set_quality(&cinfo, 1, TRUE);

  cinfo.optimize_coding = TRUE;
  cinfo.write_JFIF_header = TRUE;

  jpeg_start_compress(&cinfo, TRUE);

  JSAMPLE pixel = 0;
  JSAMPROW row = &pixel;

  jpeg_write_scanlines(&cinfo, &row, 1);

  jpeg_finish_compress(&cinfo);
  jpeg_destroy_compress(&cinfo);

  fclose(file);

  return EXIT_SUCCESS;
}
```

### plain-png.png

```c
// libpng v1.6.58
#include <png.h>
#include <stdio.h>
#include <stdlib.h>

int main(void) {
  FILE *file = fopen("plain-png.png", "wb");
  if (!file) {
    return EXIT_FAILURE;
  }

  png_structp png =
      png_create_write_struct(PNG_LIBPNG_VER_STRING, NULL, NULL, NULL);

  if (!png) {
    fclose(file);
    return EXIT_FAILURE;
  }

  png_infop info = png_create_info_struct(png);
  if (!info) {
    png_destroy_write_struct(&png, NULL);
    fclose(file);
    return EXIT_FAILURE;
  }

  if (setjmp(png_jmpbuf(png))) {
    png_destroy_write_struct(&png, &info);
    fclose(file);
    return EXIT_FAILURE;
  }

  png_init_io(png, file);

  png_set_IHDR(png, info,
               /* width */ 1,
               /* height */ 1,
               /* bit depth */ 1, PNG_COLOR_TYPE_GRAY, PNG_INTERLACE_NONE,
               PNG_COMPRESSION_TYPE_DEFAULT, PNG_FILTER_TYPE_DEFAULT);

  png_set_compression_level(png, 9);
  png_set_filter(png, 0, PNG_FILTER_NONE);

  png_write_info(png, info);

  png_byte pixel = 0;
  png_bytep row = &pixel;

  png_write_row(png, row);

  png_write_end(png, NULL);

  png_destroy_write_struct(&png, &info);
  fclose(file);

  return EXIT_SUCCESS;
}
```

### plain-webp.webp

```c
// libwebp v1.6.0
#include <webp/encode.h>
#include <stdio.h>
#include <stdlib.h>

int main(void) {
  const uint8_t pixel[4] = {0, 0, 0, 255};

  uint8_t *output = NULL;

  size_t size = WebPEncodeRGBA(pixel,
                               /* width */ 1,
                               /* height */ 1,
                               /* stride */ 4,
                               /* quality */ 0, &output);

  if (size == 0) {
    return EXIT_FAILURE;
  }

  FILE *file = fopen("plain-webp.webp", "wb");
  if (!file) {
    WebPFree(output);
    return EXIT_FAILURE;
  }

  if (fwrite(output, 1, size, file) != size) {
    perror("fwrite");
    fclose(file);
    WebPFree(output);
    return EXIT_FAILURE;
  }

  fclose(file);
  WebPFree(output);

  return EXIT_SUCCESS;
}
```

### plain-heic.heic

```cpp
// libheif v1.23.4
#include <libheif/heif_cxx.h>

int main() {
  heif::Image image;

  image.create(1, 1, heif_colorspace_monochrome, heif_chroma_monochrome);

  image.add_plane(heif_channel_Y, 1, 1, 8);

  heif::Context ctx;

  heif::Encoder encoder(heif_compression_HEVC);

  encoder.set_lossless(false);
  encoder.set_lossy_quality(0);
  encoder.set_parameter("preset", "ultrafast");

  heif::Context::EncodingOptions options;

  auto handle = ctx.encode_image(image, encoder, options);

  ctx.write_to_file("plain-heic.heic");

  return EXIT_SUCCESS;
}
```

### plain-avif.avif

```c
// libavif v1.4.2, aom v3.15.0
#include "avif/avif.h"
#include <stdio.h>

int main(void) {
  avifImage *image =
      avifImageCreate(/* width */ 1, /* height */ 1, /* depth */ 8,
                      /* yuvFormat */ AVIF_PIXEL_FORMAT_YUV400);
  if (!image) {
    return EXIT_FAILURE;
  }

  avifResult allocate_result = avifImageAllocatePlanes(image, AVIF_PLANES_YUV);

  if (allocate_result != AVIF_RESULT_OK) {
    avifImageDestroy(image);
    return EXIT_FAILURE;
  }

  uint8_t *y_plane = avifImagePlane(image, AVIF_CHAN_Y);
  y_plane[0] = 0;

  image->colorPrimaries = AVIF_COLOR_PRIMARIES_BT709;
  image->transferCharacteristics = AVIF_TRANSFER_CHARACTERISTICS_BT709;
  image->matrixCoefficients = AVIF_MATRIX_COEFFICIENTS_BT709;
  image->yuvRange = AVIF_RANGE_FULL;

  avifEncoder *encoder = avifEncoderCreate();

  encoder->quality = AVIF_QUALITY_WORST;
  encoder->qualityAlpha = AVIF_QUALITY_WORST;
  encoder->speed = AVIF_SPEED_SLOWEST;

  avifRWData avif_output = AVIF_DATA_EMPTY;
  avifResult result = avifEncoderWrite(encoder, image, &avif_output);

  if (result == AVIF_RESULT_OK) {
    FILE *file = fopen("plain-avif.avif", "wb");
    if (file) {
      fwrite(avif_output.data, 1, avif_output.size, file);
      fclose(file);
    }
  }

  avifRWDataFree(&avif_output);
  avifEncoderDestroy(encoder);
  avifImageDestroy(image);

  return EXIT_SUCCESS;
}
```

### plain-jpegxl.jxl

```c
// libjxl v0.12.0
#include <jxl/encode.h>
#include <jxl/thread_parallel_runner.h>
#include <stdio.h>

int main(void) {
  JxlEncoder *enc = JxlEncoderCreate(/* memory_manager */ NULL);
  if (!enc) {
    return EXIT_FAILURE;
  }

  JxlBasicInfo basic_info;
  JxlEncoderInitBasicInfo(&basic_info);
  basic_info.xsize = 1;
  basic_info.ysize = 1;
  basic_info.bits_per_sample = 8;
  basic_info.exponent_bits_per_sample = 0;
  basic_info.num_color_channels = 1;
  basic_info.num_extra_channels = 0;
  basic_info.alpha_bits = 0;

  if (JxlEncoderSetBasicInfo(enc, &basic_info) != JXL_ENC_SUCCESS) {
    JxlEncoderDestroy(enc);
    return EXIT_FAILURE;
  }

  JxlColorEncoding color_encoding;
  JxlColorEncodingSetToSRGB(&color_encoding, /* is_gray */ JXL_TRUE);
  if (JxlEncoderSetColorEncoding(enc, &color_encoding) != JXL_ENC_SUCCESS) {
    JxlEncoderDestroy(enc);
    return EXIT_FAILURE;
  }

  JxlEncoderFrameSettings *frame_settings =
      JxlEncoderFrameSettingsCreate(enc, /* source */ NULL);

  if (!frame_settings) {
    JxlEncoderDestroy(enc);
    return EXIT_FAILURE;
  }

  JxlEncoderFrameSettingsSetOption(
      frame_settings, JXL_ENC_FRAME_SETTING_MODULAR, /* enforce */ 1);

  JxlEncoderFrameSettingsSetOption(frame_settings, JXL_ENC_FRAME_SETTING_EFFORT,
                                   /* maximum */ 10);

  uint8_t pixel = 0x00;
  JxlPixelFormat pixel_format = {.num_channels = 1,
                                 .data_type = JXL_TYPE_UINT8,
                                 .endianness = JXL_NATIVE_ENDIAN,
                                 .align = 0};

  if (JxlEncoderAddImageFrame(frame_settings, &pixel_format, &pixel,
                              sizeof(pixel)) != JXL_ENC_SUCCESS) {
    JxlEncoderDestroy(enc);
    return EXIT_FAILURE;
  }

  JxlEncoderCloseInput(enc);

  size_t compressed_capacity = 64;
  uint8_t *compressed_buffer = malloc(compressed_capacity);
  uint8_t *next_out = compressed_buffer;
  size_t avail_out = compressed_capacity;
  JxlEncoderStatus process_result = JXL_ENC_NEED_MORE_OUTPUT;
  while (process_result == JXL_ENC_NEED_MORE_OUTPUT) {
    process_result = JxlEncoderProcessOutput(enc, &next_out, &avail_out);
    if (process_result == JXL_ENC_NEED_MORE_OUTPUT) {
      size_t offset = next_out - compressed_buffer;
      compressed_capacity *= 2;
      compressed_buffer = realloc(compressed_buffer, compressed_capacity);
      next_out = compressed_buffer + offset;
      avail_out = compressed_capacity - offset;
    }
  }

  if (process_result != JXL_ENC_SUCCESS) {
    free(compressed_buffer);
    JxlEncoderDestroy(enc);
    return EXIT_FAILURE;
  }

  FILE *file = fopen("plain-jpegxl.jxl", "wb");
  if (!file) {
    free(compressed_buffer);
    JxlEncoderDestroy(enc);
    return EXIT_FAILURE;
  }

  fwrite(compressed_buffer, 1, next_out - compressed_buffer, file);
  fclose(file);
  free(compressed_buffer);
  JxlEncoderDestroy(enc);
  return EXIT_SUCCESS;
}
```

### plain-tiff.tiff

```c
// libtiff v4.7.2
#include <stdio.h>
#include <stdlib.h>
#include <tiffio.h>

int main(void) {
  TIFF *tif = TIFFOpen("plain-tiff.tiff", "w");
  if (!tif) {
    return EXIT_FAILURE;
  }

  TIFFSetField(tif, TIFFTAG_IMAGEWIDTH, 1);
  TIFFSetField(tif, TIFFTAG_IMAGELENGTH, 1);
  TIFFSetField(tif, TIFFTAG_BITSPERSAMPLE, 1);
  TIFFSetField(tif, TIFFTAG_SAMPLESPERPIXEL, 1);
  TIFFSetField(tif, TIFFTAG_PHOTOMETRIC, PHOTOMETRIC_MINISBLACK);
  TIFFSetField(tif, TIFFTAG_PLANARCONFIG, PLANARCONFIG_CONTIG);
  TIFFSetField(tif, TIFFTAG_COMPRESSION, COMPRESSION_NONE);
  TIFFSetField(tif, TIFFTAG_ROWSPERSTRIP, 1);

  unsigned char buffer[1] = {0x00};

  TIFFWriteScanline(tif, buffer, 0, 0);

  TIFFClose(tif);

  return EXIT_SUCCESS;
}
```

## Notes

Exif data for `plain-heic-with-exif` is from [IMG_5195.HEIC](https://github.com/ianare/exif-samples/blob/master/heic/IMG_5195.HEIC) from [ianare/exif-samples](https://github.com/ianare/exif-samples).

Exif data for `plain-avif-with-exif` is from [colors_hdr_rec2020.avif](https://github.com/AOMediaCodec/libavif/blob/main/tests/data/colors_hdr_rec2020.avif) from [AOMediaCodec/libavif](https://github.com/AOMediaCodec/libavif).
