#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <png.h>
#include <stdio.h>

#include "png.h"

using namespace emscripten;

// Equivalent to "Exif\0\0". Necessary for libexif to parse Exif data by itself
// https://github.com/libexif/libexif/blob/aebe2a7b61a2fcd95f8d72e2d317027faf73fdc1/libexif/exif-data.c#L871-L881
constexpr unsigned char ExifHeader[6] = {0x45, 0x78, 0x69, 0x66, 0x00, 0x00};

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

  memcpy(data, io_ptr->data + io_ptr->offset, length);
  io_ptr->offset += length;
}

struct PngWriteBuffer {
  char *buffer;
  size_t size;
  size_t capacity;
};

static void png_write_to_memory(png_structp png_ptr, png_bytep data,
                                png_size_t length) {
  auto *io_ptr = static_cast<PngWriteBuffer *>(png_get_io_ptr(png_ptr));
  size_t new_size = io_ptr->size + length;

  if (new_size > io_ptr->capacity) {
    size_t new_capacity = io_ptr->capacity * 2;
    while (new_capacity < new_size) {
      new_capacity *= 2;
    }
    auto *new_buffer =
        static_cast<char *>(realloc(io_ptr->buffer, new_capacity));
    if (new_buffer == nullptr) {
      png_error(png_ptr, "Failed to allocate memory for PNG buffer");
      return;
    }
    io_ptr->buffer = new_buffer;
    io_ptr->capacity = new_capacity;
  }

  memcpy(io_ptr->buffer + io_ptr->size, data, length);
  io_ptr->size += length;
}

static void png_flush_memory(png_structp png_ptr) { (void)png_ptr; }

std::optional<Uint8Array> png_get_exif_data(const std::string png_data) {
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

#ifdef PNG_eXIf_SUPPORTED
  png_uint_32 exif_data_len = 0;
  png_bytep exif_data_ptr = nullptr;

  if (png_get_eXIf_1(png_ptr, info_ptr, &exif_data_len, &exif_data_ptr) != 0 &&
      exif_data_ptr != nullptr && exif_data_len > 0) {
    auto *output = static_cast<unsigned char *>(
        malloc(std::size(ExifHeader) + exif_data_len));
    if (output == nullptr) {
      png_destroy_read_struct(&png_ptr, &info_ptr, nullptr);
      return std::nullopt;
    }

    memcpy(output, ExifHeader, std::size(ExifHeader));
    memcpy(output + std::size(ExifHeader), exif_data_ptr, exif_data_len);
    png_destroy_read_struct(&png_ptr, &info_ptr, nullptr);
    return std::optional<Uint8Array>{Uint8Array(
        val(typed_memory_view(std::size(ExifHeader) + exif_data_len, output)))};
  }
#endif

  png_destroy_read_struct(&png_ptr, &info_ptr, nullptr);
  return std::nullopt;
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
        "An error occurred while creating read_png_ptr or write_png_ptr");
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
      exif_data.size() >= std::size(ExifHeader) &&
      memcmp(exif_data.data(), ExifHeader, std::size(ExifHeader)) == 0;
  auto png_exif_data = reinterpret_cast<png_bytep>(const_cast<char *>(
      has_exif_header ? exif_data.data() + std::size(ExifHeader)
                      : exif_data.data()));
  auto png_exif_data_size = static_cast<png_uint_32>(
      has_exif_header ? exif_data.size() - std::size(ExifHeader)
                      : exif_data.size());

  png_set_eXIf_1(read_png_ptr, info_ptr, png_exif_data_size, png_exif_data);
#endif

  size_t rowbytes = png_get_rowbytes(read_png_ptr, info_ptr);
  PngWriteBuffer write_buffer = {.buffer =
                                     static_cast<char *>(malloc(rowbytes)),
                                 .size = 0,
                                 .capacity = rowbytes};
  png_set_write_fn(write_png_ptr, &write_buffer, png_write_to_memory,
                   png_flush_memory);

  if (setjmp(png_jmpbuf(write_png_ptr))) {
    png_destroy_read_struct(&read_png_ptr, &info_ptr, nullptr);
    png_destroy_write_struct(&write_png_ptr, &info_ptr);
    throw std::runtime_error("An error occurred while writing the PNG");
  }

  png_write_png(write_png_ptr, info_ptr, PNG_TRANSFORM_IDENTITY, nullptr);

  png_destroy_read_struct(&read_png_ptr, &info_ptr, nullptr);
  png_destroy_write_struct(&write_png_ptr, nullptr);

  return Uint8Array(
      val(typed_memory_view(write_buffer.size, write_buffer.buffer)));
}
