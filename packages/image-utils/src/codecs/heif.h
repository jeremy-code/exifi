#pragma once

#include <optional>
#include <string>

#include "../common.h"

std::optional<Uint8Array> heif_get_exif_data(const std::string heif_data);
