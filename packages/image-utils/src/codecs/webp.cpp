#include "webp.h"

#include <cstdint>
#include <cstdlib>
#include <cstring>

#include <iterator>
#include <optional>
#include <stdexcept>
#include <string>

#include <emscripten/bind.h>
#include <webp/demux.h>
#include <webp/mux.h>

#include "../common.h"
#include "../constants.h"

std::optional<Uint8Array>
webp_get_exif_data(const std::string webp_data) noexcept {
  WebPData input_data = {reinterpret_cast<const uint8_t *>(webp_data.data()),
                         webp_data.size()};

  WebPDemuxer *demux = WebPDemux(&input_data);
  if (demux == nullptr) {
    return std::nullopt;
  }

  std::optional<Uint8Array> output = std::nullopt;

  uint32_t flags = WebPDemuxGetI(demux, WEBP_FF_FORMAT_FLAGS);
  if (flags & EXIF_FLAG) {
    WebPChunkIterator chunk_iter;
    WebPDemuxGetChunk(demux, "EXIF", /* chunk_number */ 1, &chunk_iter);
    size_t exif_size =
        std::size(constants::kExifHeader) + chunk_iter.chunk.size;
    auto *exif_data = static_cast<unsigned char *>(std::malloc(exif_size));

    if (exif_data != nullptr) {
      std::memcpy(exif_data, constants::kExifHeader,
                  std::size(constants::kExifHeader));
      std::memcpy(exif_data + std::size(constants::kExifHeader),
                  chunk_iter.chunk.bytes, chunk_iter.chunk.size);

      output = Uint8Array(
          emscripten::val(emscripten::typed_memory_view(exif_size, exif_data)));
    }

    WebPDemuxReleaseChunkIterator(&chunk_iter);
  }

  WebPDemuxDelete(demux);
  return output;
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
      exif_data.size() >= std::size(constants::kExifHeader) &&
      std::equal(std::begin(constants::kExifHeader),
                 std::end(constants::kExifHeader), exif_data.data());

  const char *webp_exif_data =
      has_exif_header ? exif_data.data() + std::size(constants::kExifHeader)
                      : exif_data.data();
  size_t webp_exif_size =
      has_exif_header ? exif_data.size() - std::size(constants::kExifHeader)
                      : exif_data.size();

  WebPData exif_chunk = {reinterpret_cast<const uint8_t *>(webp_exif_data),
                         webp_exif_size};

  WebPMuxError set_err =
      WebPMuxSetChunk(mux, "EXIF", &exif_chunk, /* copy_data */ 1);
  if (set_err != WEBP_MUX_OK) {
    WebPMuxDelete(mux);
    throw std::runtime_error("An error occurred while setting the Exif chunk");
  }

  WebPData output;
  WebPMuxError assemble_err = WebPMuxAssemble(mux, &output);
  WebPMuxDelete(mux);

  if (assemble_err != WEBP_MUX_OK) {
    throw std::runtime_error(
        "An error occurred while assembling the WebP data");
  }

  return Uint8Array(emscripten::val(
      emscripten::typed_memory_view(output.size, output.bytes)));
}
