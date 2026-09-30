import os
import re
from pathlib import Path
from string import Template

URL = "https://github.com/strukturag/libheif"
DESCRIPTION = "libheif is an ISO/IEC 23008-12 HEIF/HEIC and AVIF image container format decoder and encoder"
LICENSE = "GNU Lesser General Public License (LGPL) v3 or later"

TAG = "1.23.5"
HASH = "a7b4a7ecc093f6b453939e093abef391f88bb371303183a91e431cba8f4b590131c05cc80a28733ac4822cce4a69ca1475251b2d4679890330a603de04c6c77c"

port_name = "libheif"


variants = {
    "libheif-mt": {"PTHREADS": 1},
}


def get_lib_name(settings):
    return "libheif-mt.a" if settings.PTHREADS else "libheif.a"


# srcs obtained from emcmake
# https://gist.github.com/jeremy-code/27ccbfbb5188422d94530da941cc04ca
srcs = [
    "libheif/bitstream.cc",
    "libheif/box.cc",
    "libheif/error.cc",
    "libheif/context.cc",
    "libheif/file.cc",
    "libheif/file_layout.cc",
    "libheif/image/pixelimage.cc",
    "libheif/image/image_description.cc",
    "libheif/plugin_registry.cc",
    "libheif/nclx.cc",
    "libheif/security_limits.cc",
    "libheif/init.cc",
    "libheif/logging.cc",
    "libheif/compression.cc",
    "libheif/compression_brotli.cc",
    "libheif/compression_zlib.cc",
    "libheif/common_utils.cc",
    "libheif/region.cc",
    "libheif/brands.cc",
    "libheif/id_creator.cc",
    "libheif/text.cc",
    "libheif/api/libheif/heif.cc",
    "libheif/api/libheif/heif_library.cc",
    "libheif/api/libheif/heif_image.cc",
    "libheif/api/libheif/heif_color.cc",
    "libheif/api/libheif/heif_regions.cc",
    "libheif/api/libheif/heif_plugin.cc",
    "libheif/api/libheif/heif_properties.cc",
    "libheif/api/libheif/heif_items.cc",
    "libheif/api/libheif/heif_sequences.cc",
    "libheif/api/libheif/heif_tai_timestamps.cc",
    "libheif/api/libheif/heif_brands.cc",
    "libheif/api/libheif/heif_metadata.cc",
    "libheif/api/libheif/heif_aux_images.cc",
    "libheif/api/libheif/heif_entity_groups.cc",
    "libheif/api/libheif/heif_security.cc",
    "libheif/api/libheif/heif_encoding.cc",
    "libheif/api/libheif/heif_decoding.cc",
    "libheif/api/libheif/heif_image_handle.cc",
    "libheif/api/libheif/heif_context.cc",
    "libheif/api/libheif/heif_tiling.cc",
    "libheif/api/libheif/heif_components.cc",
    "libheif/api/libheif/heif_uncompressed.cc",
    "libheif/api/libheif/heif_text.cc",
    "libheif/api/libheif/heif_omaf.cc",
    "libheif/codecs/decoder.cc",
    "libheif/codecs/encoder.cc",
    "libheif/image-items/hevc.cc",
    "libheif/codecs/hevc_boxes.cc",
    "libheif/codecs/hevc_dec.cc",
    "libheif/codecs/hevc_enc.cc",
    "libheif/image-items/avif.cc",
    "libheif/codecs/avif_enc.cc",
    "libheif/codecs/avif_dec.cc",
    "libheif/codecs/avif_boxes.cc",
    "libheif/image-items/jpeg.cc",
    "libheif/codecs/jpeg_boxes.cc",
    "libheif/codecs/jpeg_dec.cc",
    "libheif/codecs/jpeg_enc.cc",
    "libheif/image-items/jpeg2000.cc",
    "libheif/codecs/jpeg2000_dec.cc",
    "libheif/codecs/jpeg2000_enc.cc",
    "libheif/codecs/jpeg2000_boxes.cc",
    "libheif/image-items/vvc.cc",
    "libheif/codecs/vvc_dec.cc",
    "libheif/codecs/vvc_enc.cc",
    "libheif/codecs/vvc_boxes.cc",
    "libheif/image-items/avc.cc",
    "libheif/codecs/avc_boxes.cc",
    "libheif/codecs/avc_dec.cc",
    "libheif/codecs/avc_enc.cc",
    "libheif/image-items/mask_image.cc",
    "libheif/image-items/image_item.cc",
    "libheif/image-items/grid.cc",
    "libheif/image-items/overlay.cc",
    "libheif/image-items/iden.cc",
    "libheif/image-items/tiled.cc",
    "libheif/color-conversion/colorconversion.cc",
    "libheif/color-conversion/rgb2yuv.cc",
    "libheif/color-conversion/rgb2yuv_sharp.cc",
    "libheif/color-conversion/yuv2rgb.cc",
    "libheif/color-conversion/rgb2rgb.cc",
    "libheif/color-conversion/monochrome.cc",
    "libheif/color-conversion/hdr_sdr.cc",
    "libheif/color-conversion/alpha.cc",
    "libheif/color-conversion/chroma_sampling.cc",
    "libheif/color-conversion/bayer_bilinear.cc",
    "libheif/sequences/seq_boxes.cc",
    "libheif/sequences/chunk.cc",
    "libheif/sequences/track.cc",
    "libheif/sequences/track_visual.cc",
    "libheif/sequences/track_metadata.cc",
    "libheif/plugins/encoder_mask.cc",
    "libheif/plugins/nalu_utils.cc",
    "libheif/mini.cc",
    "libheif/omaf_boxes.cc",
]


def get(ports, settings, shared):
    ports.fetch_project(
        port_name,
        f"https://github.com/strukturag/libheif/archive/refs/tags/v{TAG}.tar.gz",
        sha512hash=HASH,
    )

    def create(final):
        root_path = ports.get_dir(port_name, f"libheif-{TAG}")
        source_path = os.path.join(root_path, "libheif")
        api_path = os.path.join(source_path, "api", "libheif")

        # cflags generated when using emcmake
        # https://gist.github.com/jeremy-code/27ccbfbb5188422d94530da941cc04ca
        cflags = [
            "-DHAVE_VISIBILITY",
            "-DIS_BIG_ENDIAN=0",  # https://github.com/strukturag/libheif/blob/bc292d97abed6b1ba1fc3d95c4191829ee99b088/CMakeLists.txt#L88
            "-DLIBHEIF_EXPORTS",
            "-DNDEBUG",
            "-std=c++20",  # https://github.com/strukturag/libheif/blob/bc292d97abed6b1ba1fc3d95c4191829ee99b088/CMakeLists.txt#L64
            "-fPIC",
            "-fvisibility=hidden",  # https://github.com/strukturag/libheif/blob/bc292d97abed6b1ba1fc3d95c4191829ee99b088/CMakeLists.txt#L602-L603
            "-fvisibility-inlines-hidden",
            "-Wall",  # https://github.com/strukturag/libheif/blob/bc292d97abed6b1ba1fc3d95c4191829ee99b088/CMakeLists.txt#L41-L47
            "-Wsign-compare",
            "-Wconversion",
            "-Wno-sign-conversion",
            "-Wno-error=conversion",
            "-Wno-error=unused-parameter",
            "-Wno-error=deprecated-declarations",
            "-Wno-error=tautological-compare",  # https://github.com/strukturag/libheif/blob/bc292d97abed6b1ba1fc3d95c4191829ee99b088/CMakeLists.txt#L58-L61
            "-Wno-error=tautological-constant-out-of-range-compare",
        ]
        cflags += [
            # Do not compile Emscripten bindings for libheif library
            # https://github.com/strukturag/libheif/blob/bc292d97abed6b1ba1fc3d95c4191829ee99b088/libheif/api/libheif/heif.cc#L23-L26
            # https://github.com/strukturag/libheif/blob/bc292d97abed6b1ba1fc3d95c4191829ee99b088/libheif/api/libheif/heif_emscripten.h
            # https://github.com/strukturag/libheif/blob/bc292d97abed6b1ba1fc3d95c4191829ee99b088/build-emscripten.sh
            "-D__EMSCRIPTEN_STANDALONE_WASM__",
            # This error happens while compiling libheif
            "-Wno-shorten-64-to-32",
            # When running `heif_context_read_from_memory_without_copy`, libheif
            # may eventually constructs an ImageItem instance. Since that class
            # has virtual functions including `decode_image` and
            # `decode_compressed_image`, the bundle size balloons immediately
            # once that function is introduced. Hence, to optimize bundle size,
            # enable virtual-function-elimination, which also requires lto=full.
            #
            # `heif_context_read_from_memory_without_copy`
            # -> `HeifContext::read` -> `HeifContext::interpret_heif_file`
            # -> `HeifContext::interpret_heif_file_images`
            # -> `HeifContext::interpret_heif_file_images`
            # -> `ImageItem::alloc_for_infe_box`
            #
            # https://github.com/strukturag/libheif/blob/bc292d97abed6b1ba1fc3d95c4191829ee99b088/libheif/image-items/image_item.h#L375
            # https://github.com/strukturag/libheif/blob/bc292d97abed6b1ba1fc3d95c4191829ee99b088/libheif/context.cc#L630
            # https://clang.llvm.org/docs/ClangCommandLineReference.html#cmdoption-clang-fvirtual-function-elimination
            "-fvirtual-function-elimination",
            "-Oz",
        ]
        if settings.PTHREADS:
            cflags += ["-pthread", "-DENABLE_MULTITHREADING_SUPPORT=ON"]
        else:
            cflags += ["-DENABLE_MULTITHREADING_SUPPORT=OFF"]

        # Upstream generates this header from heif_version.h.in via CMake's
        # configure_file() -- reproduce that substitution here
        major, minor, patch = TAG.split(".")
        heif_version_h = Template(
            re.sub(
                r"@([^@\n]+)@",
                r"$\1",
                (Path(api_path) / "heif_version.h.in").read_text(),
            )
        ).substitute(
            {
                "PROJECT_VERSION_MAJOR": major,
                "PROJECT_VERSION_MINOR": minor,
                "PROJECT_VERSION_PATCH": patch,
                # Plugin loading is disabled
                "PLUGIN_DIRECTORY": "",
            }
        )
        ports.write_file(os.path.join(api_path, "heif_version.h"), heif_version_h)

        ports.install_headers(api_path, target="libheif")

        ports.build_port(
            root_path, final, port_name, includes=[source_path], flags=cflags, srcs=srcs
        )

    return [
        shared.cache.get_lib(
            get_lib_name(settings),
            create,
            what="port",
        )
    ]


def clear(ports, settings, shared):
    shared.cache.erase_lib(get_lib_name(settings))
