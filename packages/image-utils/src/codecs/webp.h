#pragma once

#include "../common.h"
#include <emscripten/val.h>

std::optional<Uint8Array> webp_get_exif_data(const std::string webp_data);
Uint8Array webp_set_exif_data(const std::string webp_data,
                              const std::string exif_data);
