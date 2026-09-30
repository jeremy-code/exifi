#pragma once

#include <optional>
#include <string>

#include "../common.h"

std::optional<Uint8Array>
webp_get_exif_data(const std::string webp_data) noexcept;
Uint8Array webp_set_exif_data(const std::string webp_data,
                              const std::string exif_data);
