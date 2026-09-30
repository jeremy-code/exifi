#include <libheif/heif_context.h>
#include <libheif/heif_image_handle.h>
#include <libheif/heif_metadata.h>

#include "heif.h"

using namespace emscripten;

std::optional<Uint8Array> heif_get_exif_data(const std::string heif_data) {
  struct heif_context *ctx = heif_context_alloc();

  struct heif_error read_err = heif_context_read_from_memory_without_copy(
      ctx, heif_data.data(), heif_data.size(),
      /* heif_reading_options */ nullptr);

  if (read_err.code != heif_error_Ok) {
    return std::nullopt;
  }

  struct heif_image_handle *image_handle;
  heif_context_get_primary_image_handle(ctx, &image_handle);

  heif_item_id exif_item_id;
  int n = heif_image_handle_get_list_of_metadata_block_IDs(
      image_handle, "Exif", &exif_item_id, /* count */ 1);

  std::optional<Uint8Array> output = std::nullopt;

  if (n == 1) {
    size_t exif_size =
        heif_image_handle_get_metadata_size(image_handle, exif_item_id);
    uint8_t *exif_data = static_cast<uint8_t *>(malloc(exif_size));

    if (exif_data != nullptr) {
      struct heif_error metadata_err =
          heif_image_handle_get_metadata(image_handle, exif_item_id, exif_data);

      if (metadata_err.code != heif_error_Ok) {
        free(exif_data);
      } else {
        // The first four bytes are the offset to the start of the TIFF header
        // of the Exif data
        exif_size = exif_size - 4;
        memmove(exif_data, exif_data + 4, exif_size);
        realloc(exif_data, exif_size);
        output = Uint8Array(val(typed_memory_view(exif_size, exif_data)));
      }
    }
  }

  heif_image_handle_release(image_handle);
  heif_context_free(ctx);
  return output;
}
