#include "png.h"

#include <cstdlib>
#include <cstring>

#include <iterator>
#include <optional>
#include <stdexcept>
#include <string>

#include <png.h>

#include "../common.h"
#include "../constants.h"

struct PngReadBuffer {
  const unsigned char *data;
  size_t size;
  size_t offset;
};

static void png_read_from_memory(png_structp png_ptr, png_bytep data,
                                 png_size_t length) {
  auto *io_ptr = static_cast<PngReadBuffer *>(png_get_io_ptr(png_ptr));

  if (io_ptr->offset + length > io_ptr->size) {
    png_error(png_ptr, "unexpected end of PNG data");
  }

  std::memcpy(data, io_ptr->data + io_ptr->offset, length);
  io_ptr->offset += length;
}

struct PngWriteBuffer {
  unsigned char *data;
  size_t size;
  size_t capacity;
};

static void png_write_to_memory(png_structp png_ptr, png_bytep data,
                                png_size_t length) {
  auto *io_ptr = static_cast<PngWriteBuffer *>(png_get_io_ptr(png_ptr));
  size_t new_size = io_ptr->size + length;

  if (new_size > io_ptr->capacity) {
    // Set the new capacity to either double the original capacity or enough to
    // fit the new data
    size_t new_capacity = io_ptr->capacity * 2;
    if (new_capacity < io_ptr->size + length) {
      new_capacity = io_ptr->size + length;
    }
    auto *new_data =
        static_cast<unsigned char *>(std::realloc(io_ptr->data, new_capacity));
    if (new_data == nullptr) {
      png_error(png_ptr, "failed to allocate memory for PNG buffer");
      return;
    }
    io_ptr->data = new_data;
    io_ptr->capacity = new_capacity;
  }

  std::memcpy(io_ptr->data + io_ptr->size, data, length);
  io_ptr->size += length;
}

static void png_flush_memory(png_structp png_ptr) { (void)png_ptr; }

std::optional<Uint8Array>
png_get_exif_data(const std::string png_data) noexcept {
  png_structp png_ptr =
      png_create_read_struct(PNG_LIBPNG_VER_STRING, nullptr, nullptr, nullptr);
  if (png_ptr == nullptr) {
    return std::nullopt;
  }

  png_infop info_ptr = png_create_info_struct(png_ptr);
  if (info_ptr == nullptr) {
    png_destroy_read_struct(&png_ptr, nullptr, nullptr);
    return std::nullopt;
  }

  PngReadBuffer read_buffer = {
      reinterpret_cast<const unsigned char *>(png_data.data()), png_data.size(),
      0};
  png_set_read_fn(png_ptr, &read_buffer, png_read_from_memory);

  if (setjmp(png_jmpbuf(png_ptr))) {
    png_destroy_read_struct(&png_ptr, &info_ptr, nullptr);
    return std::nullopt;
  }

  png_read_info(png_ptr, info_ptr);

  std::optional<Uint8Array> output = std::nullopt;

#ifdef PNG_eXIf_SUPPORTED
  png_uint_32 png_exif_size = 0;
  png_bytep png_exif_data = nullptr;

  if (png_get_eXIf_1(png_ptr, info_ptr, &png_exif_size, &png_exif_data) != 0 &&
      png_exif_data != nullptr && png_exif_size > 0) {
    size_t exif_size = (std::size(constants::kExifHeader) + png_exif_size);
    auto *exif_data = static_cast<unsigned char *>(std::malloc(exif_size));

    if (exif_data != nullptr) {
      std::memcpy(exif_data, constants::kExifHeader,
                  std::size(constants::kExifHeader));
      std::memcpy(exif_data + std::size(constants::kExifHeader), png_exif_data,
                  png_exif_size);
      output = Uint8Array(
          emscripten::val(emscripten::typed_memory_view(exif_size, exif_data)));
    }
  }
#endif

  png_destroy_read_struct(&png_ptr, &info_ptr, nullptr);
  return output;
}

Uint8Array png_set_exif_data(const std::string png_data,
                             const std::string exif_data) {
  png_structp read_png_ptr =
      png_create_read_struct(PNG_LIBPNG_VER_STRING, nullptr, nullptr, nullptr);
  png_structp write_png_ptr =
      png_create_write_struct(PNG_LIBPNG_VER_STRING, nullptr, nullptr, nullptr);
  if (read_png_ptr == nullptr || write_png_ptr == nullptr) {
    if (read_png_ptr != nullptr) {
      png_destroy_read_struct(&read_png_ptr, nullptr, nullptr);
    }
    if (write_png_ptr != nullptr) {
      png_destroy_write_struct(&write_png_ptr, nullptr);
    }
    throw std::runtime_error(
        "An error occurred while creating read_png_ptr and/or write_png_ptr");
  }

  png_infop info_ptr = png_create_info_struct(read_png_ptr);
  if (info_ptr == nullptr) {
    png_destroy_read_struct(&read_png_ptr, nullptr, nullptr);
    png_destroy_write_struct(&write_png_ptr, nullptr);
    throw std::runtime_error("An error occurred while creating info_ptr");
  }

  PngReadBuffer read_buffer = {
      reinterpret_cast<const unsigned char *>(png_data.data()), png_data.size(),
      0};
  png_set_read_fn(read_png_ptr, &read_buffer, png_read_from_memory);

  if (setjmp(png_jmpbuf(read_png_ptr))) {
    png_destroy_read_struct(&read_png_ptr, &info_ptr, nullptr);
    png_destroy_write_struct(&write_png_ptr, nullptr);
    throw std::runtime_error("An error occurred while reading the PNG");
  }

  png_read_png(read_png_ptr, info_ptr, PNG_TRANSFORM_IDENTITY, NULL);

#ifdef PNG_eXIf_SUPPORTED
  bool has_exif_header =
      exif_data.size() >= std::size(constants::kExifHeader) &&
      std::equal(std::begin(constants::kExifHeader),
                 std::end(constants::kExifHeader), exif_data.data());
  auto png_exif_data = reinterpret_cast<png_bytep>(const_cast<char *>(
      has_exif_header ? exif_data.data() + std::size(constants::kExifHeader)
                      : exif_data.data()));
  auto png_exif_size = static_cast<png_uint_32>(
      has_exif_header ? exif_data.size() - std::size(constants::kExifHeader)
                      : exif_data.size());

  png_set_eXIf_1(read_png_ptr, info_ptr, png_exif_size, png_exif_data);
#endif

  size_t rowbytes = png_get_rowbytes(read_png_ptr, info_ptr);
  PngWriteBuffer write_buffer = {
      .data = static_cast<unsigned char *>(std::malloc(rowbytes)),
      .size = 0,
      .capacity = rowbytes};
  png_set_write_fn(write_png_ptr, &write_buffer, png_write_to_memory,
                   png_flush_memory);

  if (setjmp(png_jmpbuf(write_png_ptr))) {
    png_destroy_read_struct(&read_png_ptr, &info_ptr, nullptr);
    png_destroy_write_struct(&write_png_ptr, &info_ptr);
    throw std::runtime_error("An error occurred while writing the PNG");
  }

  png_write_png(write_png_ptr, info_ptr,
                /* transforms */ PNG_TRANSFORM_IDENTITY, /* params */ nullptr);

  png_destroy_read_struct(&read_png_ptr, &info_ptr, nullptr);
  png_destroy_write_struct(&write_png_ptr, nullptr);

  return Uint8Array(emscripten::val(
      emscripten::typed_memory_view(write_buffer.size, write_buffer.data)));
}
