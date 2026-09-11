# @exifi/test-fixtures

plain-jpg.jpg was created with:

```c
#include <stdio.h>

#include <jpeglib.h>

int main(void) {
    FILE *file = fopen("plain.jpg", "wb");
    if (!file) {
        perror("fopen");
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

plain-jpg-with-exif.exif does not including the leading `Exif\0\0` header, which is the format ExifTool seems to use.

plain-png.png was created with

```c
#include <stdio.h>
#include <png.h>

int main(void) {
  FILE *file = fopen("smallest.png", "wb");
  if (!file) {
    perror("fopen");
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

plain-webp.webp was created with

```c
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
    fprintf(stderr, "WebPEncodeRGBA failed\n");
    return 1;
  }

  FILE *file = fopen("smallest.webp", "wb");
  if (!file) {
    perror("fopen");
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

  printf("Wrote %zu bytes\n", size);
  return 0;
}
```

plain-heif was created from:

```c
#include <libheif/heif.h>

#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static void check(struct heif_error err, const char *what) {
  if (err.code != heif_error_Ok) {
    fprintf(stderr, "Error in %s: %s\n", what, err.message);
    exit(1);
  }
}

int main(int argc, char **argv) {
  struct heif_image *image = NULL;
  check(heif_image_create(1, 1, heif_colorspace_monochrome,
                          heif_chroma_monochrome, &image),
        "heif_image_create");

  check(heif_image_add_plane(image, heif_channel_Y, 1, 1, 8),
        "heif_image_add_plane");

  struct heif_context *ctx = heif_context_alloc();

  struct heif_encoder *encoder = NULL;
  check(
      heif_context_get_encoder_for_format(ctx, heif_compression_HEVC, &encoder),
      "heif_context_get_encoder_for_format (is the x265 plugin installed?)");

  heif_encoder_set_lossless(encoder, 0);
  heif_encoder_set_lossy_quality(encoder, /* quality */ 0);
  heif_encoder_set_parameter(encoder, "preset", "ultrafast");

  struct heif_encoding_options *options = heif_encoding_options_alloc();

  struct heif_image_handle *handle = NULL;
  check(heif_context_encode_image(ctx, image, encoder, options, &handle),
        "heif_context_encode_image");

  heif_encoding_options_free(options);
  heif_encoder_release(encoder);
  heif_image_release(image);

  check(heif_context_write_to_file(ctx, "smallest.heic"),
        "heif_context_write_to_file(smallest.heic)");

  heif_image_handle_release(handle);
  heif_context_free(ctx);

  return 0;
}
```

Exif data is from:

https://github.com/ianare/exif-samples/blob/master/heic/IMG_5195.HEIC
