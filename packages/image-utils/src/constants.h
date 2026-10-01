#pragma once

#include <cstdint>

namespace constants {
// Equivalent to "Exif\0\0". Necessary for libexif to parse Exif data by itself
// https://github.com/libexif/libexif/blob/aebe2a7b61a2fcd95f8d72e2d317027faf73fdc1/libexif/exif-data.c#L871-L881
inline constexpr uint8_t kExifHeader[6] = {
    'E', 'x', 'i', 'f', '\0', '\0',
};
} // namespace constants
