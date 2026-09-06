#include <stdio.h>

#include <jpeglib.h>

#include "jpeg.h"

using namespace emscripten;

// "Exif\0\0"
constexpr unsigned char ExifHeader[6] = {0x45, 0x78, 0x69, 0x66, 0x00, 0x00};

// "JFIF\0"
constexpr unsigned char JfifHeader[5] = {0x4A, 0x46, 0x49, 0x46, 0x00};
// "Adobe"
constexpr unsigned char AdobeHeader[5] = {0x41, 0x64, 0x6F, 0x62, 0x65};

constexpr int JPEG_APP1 = JPEG_APP0 + 1;
constexpr int JPEG_APP14 = JPEG_APP0 + 14;

// Does not include the two bytes needed for the data size
// https://github.com/winlibs/libjpeg/blob/66ef88ad97f3c47eb1c7b85f2637ff1073ebce9b/src/jcicc.c#L37
constexpr int MAX_BYTES_IN_MARKER = 0xFFFF - 2;

/**
 * @see {@link
 * https://github.com/winlibs/libjpeg/blob/66ef88ad97f3c47eb1c7b85f2637ff1073ebce9b/src/jpegtran.c#L489}
 */
Uint8Array jpeg_set_exif_data(const std::string jpeg_data,
                              const std::string exif_data) {
  if (exif_data.size() > MAX_BYTES_IN_MARKER) {
    throw std::invalid_argument("Exif data is too big!");
  }

  jpeg_decompress_struct srcinfo;
  jpeg_compress_struct dstinfo;
  jpeg_error_mgr src_jerr, dst_jerr;
  srcinfo.err = jpeg_std_error(&src_jerr);
  dstinfo.err = jpeg_std_error(&dst_jerr);

  jpeg_create_decompress(&srcinfo);
  jpeg_create_compress(&dstinfo);

  unsigned char *out_buffer;
  size_t out_size;
  jpeg_mem_src(&srcinfo, reinterpret_cast<const JOCTET *>(jpeg_data.data()),
               jpeg_data.size());
  jpeg_mem_dest(&dstinfo, &out_buffer, &out_size);

  for (int index = 0; index < 16; index++) {
    jpeg_save_markers(&srcinfo, JPEG_APP0 + index, 0xFFFF);
  }

  const int header_result = jpeg_read_header(&srcinfo,
                                             /* require_image */ boolean::TRUE);

  if (header_result != JPEG_HEADER_OK) {
    jpeg_destroy_compress(&dstinfo);
    jpeg_destroy_decompress(&srcinfo);
    throw std::invalid_argument("Invalid JPEG data");
  }

  jvirt_barray_ptr *src_coefficients = jpeg_read_coefficients(&srcinfo);

  jpeg_copy_critical_parameters(&srcinfo, &dstinfo);

  jpeg_write_coefficients(&dstinfo, src_coefficients);

  bool is_exif_marker_found = false;
  for (jpeg_saved_marker_ptr marker = srcinfo.marker_list; marker != NULL;
       marker = marker->next) {
    if (marker->marker == JPEG_APP1 &&
        marker->data_length >= std::size(ExifHeader) &&
        memcmp(marker->data, ExifHeader, std::size(ExifHeader)) == 0) {
      is_exif_marker_found = true;
      marker->data = reinterpret_cast<unsigned char *>(
          const_cast<char *>(exif_data.data()));
      marker->data_length = exif_data.size();
      break;
    }
  }

  for (jpeg_saved_marker_ptr marker = srcinfo.marker_list; marker != nullptr;
       marker = marker->next) {
    if (dstinfo.write_JFIF_header && marker->marker == JPEG_APP0 &&
        marker->data_length >= std::size(JfifHeader) &&
        memcmp(marker->data, JfifHeader, std::size(JfifHeader)) == 0)
      continue;
    if (dstinfo.write_Adobe_marker && marker->marker == JPEG_APP14 &&
        marker->data_length >= std::size(AdobeHeader) &&
        memcmp(marker->data, AdobeHeader, std::size(AdobeHeader)) == 0)
      continue;

    jpeg_write_marker(&dstinfo, marker->marker, marker->data,
                      marker->data_length);
  }

  // Appending to the end of the JPEG markers if there is no original Exif
  // marker since that is how libexif's exif CLI handles adding Exif data
  //
  // https://github.com/libexif/exif/blob/9af1f54d5879e72d0b2bf78f65162db84ebcba26/libjpeg/jpeg-data.c#L493
  if (!is_exif_marker_found) {
    jpeg_write_marker(
        &dstinfo, JPEG_APP1,
        reinterpret_cast<unsigned char *>(const_cast<char *>(exif_data.data())),
        exif_data.size());
  }

  jpeg_finish_compress(&dstinfo);
  jpeg_destroy_compress(&dstinfo);

  jpeg_finish_decompress(&srcinfo);
  jpeg_destroy_decompress(&srcinfo);

  return Uint8Array(val(typed_memory_view(out_size, out_buffer)));
}
