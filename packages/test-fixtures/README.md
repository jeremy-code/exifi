# @exifi/test-fixtures

## Files

### plain-jpg.jpg

```c
// libjpeg-turbo v3.2.0
#include <stdio.h>

#include <jpeglib.h>

int main(void) {
  FILE *file = fopen("plain-jpg.jpg", "wb");
  if (!file) {
    return 1;
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

  return 0;
}
```

### plain-png.png

```c
// libpng v1.6.58
#include <png.h>
#include <stdio.h>

int main(void) {
  FILE *file = fopen("plain-png.png", "wb");
  if (!file) {
    return 1;
  }

  png_structp png =
      png_create_write_struct(PNG_LIBPNG_VER_STRING, NULL, NULL, NULL);

  if (!png) {
    fclose(file);
    return 1;
  }

  png_infop info = png_create_info_struct(png);
  if (!info) {
    png_destroy_write_struct(&png, NULL);
    fclose(file);
    return 1;
  }

  if (setjmp(png_jmpbuf(png))) {
    png_destroy_write_struct(&png, &info);
    fclose(file);
    return 1;
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

  return 0;
}
```

### plain-webp.webp

```c
// libwebp v1.6.0
#include <stdio.h>
#include <stdlib.h>

#include <webp/encode.h>

int main(void) {
  const uint8_t pixel[4] = {0, 0, 0, 255};

  uint8_t *output = NULL;

  size_t size = WebPEncodeRGBA(pixel,
                               /* width */ 1,
                               /* height */ 1,
                               /* stride */ 4,
                               /* quality */ 0, &output);

  if (size == 0) {
    return 1;
  }

  FILE *file = fopen("smallest.webp", "wb");
  if (!file) {
    WebPFree(output);
    return 1;
  }

  if (fwrite(output, 1, size, file) != size) {
    perror("fwrite");
    fclose(file);
    WebPFree(output);
    return 1;
  }

  fclose(file);
  WebPFree(output);

  return 0;
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

  return 0;
}
```

## Notes

Exif data for plain-heic-with-exif is from:

https://github.com/ianare/exif-samples/blob/master/heic/IMG_5195.HEIC
