#pragma once

#include <optional>
#include <string>

#include "../common.h"

std::optional<Uint8Array>
png_get_exif_data(const std::string png_data) noexcept;
Uint8Array png_set_exif_data(const std::string png_data,
                             const std::string exif_data);
