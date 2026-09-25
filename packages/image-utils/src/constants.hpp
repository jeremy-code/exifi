#pragma once

namespace constants {
// Equivalent to "Exif\0\0". Necessary for libexif to parse Exif data by itself
// https://github.com/libexif/libexif/blob/aebe2a7b61a2fcd95f8d72e2d317027faf73fdc1/libexif/exif-data.c#L871-L881
inline constexpr unsigned char ExifHeader[6] = {0x45, 0x78, 0x69,
                                                0x66, 0x00, 0x00};
} // namespace constants
