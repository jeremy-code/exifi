#pragma once

#include "../common.h"
#include <emscripten/val.h>

std::optional<Uint8Array> png_get_exif_data(const std::string png_data);
Uint8Array png_set_exif_data(const std::string png_data,
                             const std::string exif_data);
