#pragma once

#include "../common.h"
#include <emscripten/val.h>

std::optional<Uint8Array> heic_get_exif_data(const std::string heic_data);
