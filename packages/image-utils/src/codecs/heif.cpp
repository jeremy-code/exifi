#include <libheif/heif.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "heif.h"

using namespace emscripten;

std::optional<Uint8Array> heif_get_exif_data(const std::string heif_data) {
  struct heif_context *ctx = heif_context_alloc();

  struct heif_error err = heif_context_read_from_memory_without_copy(
      ctx, heif_data.data(), heif_data.size(), nullptr);

  if (err.code != heif_error_Ok) {
    return std::nullopt;
  }

  struct heif_image_handle *handle;
  heif_context_get_primary_image_handle(ctx, &handle);

  heif_item_id exif_id;
  int n = heif_image_handle_get_list_of_metadata_block_IDs(handle, "Exif",
                                                           &exif_id, 1);

  if (n == 1) {
    size_t exifSize = heif_image_handle_get_metadata_size(handle, exif_id);
    uint8_t *exifData = static_cast<uint8_t *>(malloc(exifSize));
    struct heif_error error =
        heif_image_handle_get_metadata(handle, exif_id, exifData);

    if (error.code != heif_error_Ok) {
      free(exifData);
    } else {
      heif_image_handle_release(handle);
      heif_context_free(ctx);
      return Uint8Array(val(typed_memory_view(exifSize - 4, exifData + 4)));
    }
  }

  heif_image_handle_release(handle);
  heif_context_free(ctx);
  return std::nullopt;
}
