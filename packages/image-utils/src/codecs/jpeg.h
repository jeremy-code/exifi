#pragma once

#include <optional>
#include <string>

#include "../common.h"

Uint8Array jpeg_set_exif_data(const std::string jpeg_data,
                              const std::string exif_data);
