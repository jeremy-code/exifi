#include "jpeg.h"

#include <cstring>

#include <iterator>
#include <stdexcept>
#include <string>

#include <emscripten/val.h>
#include <jpeglib.h>

#include "../common.h"
#include "../constants.h"

// "JFIF\0"
constexpr uint8_t kJfifHeader[5] = {0x4A, 0x46, 0x49, 0x46, 0x00};
// "Adobe"
constexpr uint8_t kAdobeHeader[5] = {0x41, 0x64, 0x6F, 0x62, 0x65};

constexpr int kApp1Marker = JPEG_APP0 + 1;
constexpr int kApp14Marker = JPEG_APP0 + 14;

// Does not include the two bytes needed for the data size
// https://github.com/winlibs/libjpeg/blob/66ef88ad97f3c47eb1c7b85f2637ff1073ebce9b/src/jcicc.c#L37
constexpr int kMaxBytesInMarker = 0xFFFF - 2;

/**
 * @see {@link
 * https://github.com/winlibs/libjpeg/blob/66ef88ad97f3c47eb1c7b85f2637ff1073ebce9b/src/jpegtran.c#L489}
 */
Uint8Array jpeg_set_exif_data(const std::string jpeg_data,
                              const std::string exif_data) {
  if (exif_data.size() > kMaxBytesInMarker) {
    throw std::invalid_argument("Exif data is too big!");
  }

  jpeg_decompress_struct srcinfo;
  jpeg_compress_struct dstinfo;
  jpeg_error_mgr src_jerr, dst_jerr;
  srcinfo.err = jpeg_std_error(&src_jerr);
  dstinfo.err = jpeg_std_error(&dst_jerr);

  jpeg_create_decompress(&srcinfo);
  jpeg_create_compress(&dstinfo);

  unsigned char *output_data;
  size_t output_size;
  jpeg_mem_src(&srcinfo, reinterpret_cast<const JOCTET *>(jpeg_data.data()),
               jpeg_data.size());
  jpeg_mem_dest(&dstinfo, &output_data, &output_size);

  // Save all APPn markers
  for (int index = 0; index < 16; index++) {
    jpeg_save_markers(&srcinfo, JPEG_APP0 + index, /* length_limit */ 0xFFFF);
  }

  const int header_result = jpeg_read_header(&srcinfo,
                                             /* require_image */ boolean::TRUE);

  // Since require_image is true, header_result can only be
  // JPEG_SUSPENDED/JPEG_HEADER_OK
  if (header_result != JPEG_HEADER_OK) {
    jpeg_destroy_compress(&dstinfo);
    jpeg_destroy_decompress(&srcinfo);
    throw std::invalid_argument("Invalid JPEG data");
  }

  // Get raw DCT coefficients for lossless encoding
  // https://github.com/winlibs/libjpeg/blob/66ef88ad97f3c47eb1c7b85f2637ff1073ebce9b/src/jpeglib.h#L1131-L1132
  jvirt_barray_ptr *src_coefficients = jpeg_read_coefficients(&srcinfo);

  jpeg_copy_critical_parameters(&srcinfo, &dstinfo);

  jpeg_write_coefficients(&dstinfo, src_coefficients);

  bool is_exif_marker_found = false;
  // Update marker in srcinfo with our Exif data
  for (jpeg_saved_marker_ptr marker = srcinfo.marker_list; marker != NULL;
       marker = marker->next) {
    if (marker->marker == kApp1Marker &&
        marker->data_length >= std::size(constants::kExifHeader) &&
        std::equal(std::begin(constants::kExifHeader),
                   std::end(constants::kExifHeader), marker->data)) {
      is_exif_marker_found = true;
      marker->data = reinterpret_cast<unsigned char *>(
          const_cast<char *>(exif_data.data()));
      marker->data_length = exif_data.size();
      break;
    }
  }

  for (jpeg_saved_marker_ptr marker = srcinfo.marker_list; marker != nullptr;
       marker = marker->next) {
    // Only write JFIF marker when dstinfo.write_JFIF_header (false for non-JFIF
    // colorspaces)
    if (dstinfo.write_JFIF_header && marker->marker == JPEG_APP0 &&
        marker->data_length >= std::size(kJfifHeader) &&
        std::equal(std::begin(kJfifHeader), std::end(kJfifHeader),
                   marker->data)) {
      continue;
    }
    // Only write Adobe marker when dstinfo.write_Adobe_marker
    if (dstinfo.write_Adobe_marker && marker->marker == kApp14Marker &&
        marker->data_length >= std::size(kAdobeHeader) &&
        std::equal(std::begin(kAdobeHeader), std::end(kAdobeHeader),
                   marker->data)) {
      continue;
    }

    jpeg_write_marker(&dstinfo, marker->marker, marker->data,
                      marker->data_length);
  }

  // If there is no Exif marker in jpeg_data, append one to the end. This is how
  // libexif's CLI tool exif handles adding Exif data
  //
  // https://github.com/libexif/exif/blob/9af1f54d5879e72d0b2bf78f65162db84ebcba26/libjpeg/jpeg-data.c#L493
  if (!is_exif_marker_found) {
    jpeg_write_marker(
        &dstinfo, kApp1Marker,
        reinterpret_cast<unsigned char *>(const_cast<char *>(exif_data.data())),
        exif_data.size());
  }

  jpeg_finish_compress(&dstinfo);
  jpeg_destroy_compress(&dstinfo);

  jpeg_finish_decompress(&srcinfo);
  jpeg_destroy_decompress(&srcinfo);

  return Uint8Array(
      emscripten::val(emscripten::typed_memory_view(output_size, output_data)));
}
