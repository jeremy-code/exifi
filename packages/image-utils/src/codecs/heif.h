#pragma once

#include "../common.h"
#include <emscripten/val.h>

std::optional<Uint8Array> heif_get_exif_data(const std::string heif_data);
