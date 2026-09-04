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
