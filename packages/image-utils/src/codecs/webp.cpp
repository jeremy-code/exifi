#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <optional>
#include <stdexcept>
#include <stdio.h>
#include <string.h>
#include <webp/demux.h>
#include <webp/mux.h>
#include <webp/types.h>

#include "webp.h"

using namespace emscripten;

constexpr unsigned char ExifHeader[6] = {0x45, 0x78, 0x69, 0x66, 0x00, 0x00};

std::optional<Uint8Array> webp_get_exif_data(const std::string webp_data) {
  WebPData input_data = {reinterpret_cast<const uint8_t *>(webp_data.data()),
                         webp_data.size()};

  WebPDemuxer *demux = WebPDemux(&input_data);
  if (demux == nullptr) {
    return std::nullopt;
  }

  uint32_t flags = WebPDemuxGetI(demux, WEBP_FF_FORMAT_FLAGS);
  WebPChunkIterator chunk_iter;
  if (flags & EXIF_FLAG) {
    WebPDemuxGetChunk(demux, "EXIF", 1, &chunk_iter);
    auto *output = static_cast<unsigned char *>(
        malloc(std::size(ExifHeader) + chunk_iter.chunk.size));
    if (output == nullptr) {
      WebPDemuxReleaseChunkIterator(&chunk_iter);
      WebPDemuxDelete(demux);
      return std::nullopt;
    }

    memcpy(output, ExifHeader, std::size(ExifHeader));
    memcpy(output + std::size(ExifHeader), chunk_iter.chunk.bytes,
           chunk_iter.chunk.size);
    size_t output_size = std::size(ExifHeader) + chunk_iter.chunk.size;

    WebPDemuxReleaseChunkIterator(&chunk_iter);
    WebPDemuxDelete(demux);

    return std::optional<Uint8Array>{
        Uint8Array(val(typed_memory_view(output_size, output)))};
  }

  WebPDemuxDelete(demux);
  return std::nullopt;
}

Uint8Array webp_set_exif_data(const std::string webp_data,
                              const std::string exif_data) {
  WebPData bitstream = {reinterpret_cast<const uint8_t *>(webp_data.data()),
                        webp_data.size()};
  WebPMux *mux = WebPMuxCreate(&bitstream, /* copy_data */ 1);
  if (mux == nullptr) {
    throw std::runtime_error(
        "An error occurred while creating the WebP mux object");
  }

  bool has_exif_header =
      exif_data.size() >= std::size(ExifHeader) &&
      memcmp(exif_data.data(), ExifHeader, std::size(ExifHeader)) == 0;

  const char *exif_ptr = has_exif_header
                             ? exif_data.data() + std::size(ExifHeader)
                             : exif_data.data();
  size_t exif_size = has_exif_header ? exif_data.size() - std::size(ExifHeader)
                                     : exif_data.size();

  WebPData exif_chunk = {reinterpret_cast<const uint8_t *>(exif_ptr),
                         exif_size};

  WebPMuxError set_err = WebPMuxSetChunk(mux, "EXIF", &exif_chunk, 1);
  if (set_err != WEBP_MUX_OK) {
    WebPMuxDelete(mux);
    throw std::runtime_error("An error occurred while setting the EXIF chunk");
  }

  WebPData output_data;
  WebPMuxError assemble_err = WebPMuxAssemble(mux, &output_data);
  WebPMuxDelete(mux);

  if (assemble_err != WEBP_MUX_OK) {
    throw std::runtime_error(
        "An error occurred while assembling the WebP data");
  }

  return Uint8Array(
      val(typed_memory_view(output_data.size, output_data.bytes)));
}
