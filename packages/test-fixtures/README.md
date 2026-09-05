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
