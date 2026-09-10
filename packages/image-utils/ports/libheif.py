# Copyright 2026 The Emscripten Authors.  All rights reserved.
# Emscripten is available under two separate licenses, the MIT license and the
# University of Illinois/NCSA Open Source License.  Both these licenses can be
# found in the LICENSE file.

import os

# contrib port information (required)
URL = 'https://github.com/strukturag/libheif'
DESCRIPTION = ('libheif is an ISO/IEC 23008-12 HEIF/HEIC and AVIF image container format '
               'decoder and encoder; this port builds the core library plus its dependency-free '
               "'uncompressed' codec, but none of the third-party HEVC/AV1 codecs (libde265, "
               'x265, aom, dav1d, ...), which are not ported to Emscripten here')
LICENSE = 'GNU Lesser General Public License (LGPL) v3 or later'

TAG = '1.23.4'
# This is the GitHub-generated source archive for the v1.23.4 tag.
# To (re)compute the hash: curl -L <url> | sha512sum
HASH = 'f33b216fd550ad1f7d65c76977bea77e4447875e1c84a868d620406bc2530ce8425e781e8052f4cddab49b87e2a6184a58edcd3782bb12ec6414a99bf8663e58'

port_name = 'libheif'

variants = {
  'libheif-mt': {'PTHREADS': 1},
}

# libheif's own third-party codec bridges (libde265, x265, dav1d, aom, x264,
# openjpeg, kvazaar, openjph, uvg266, vvdec/vvenc, rav1e, svt, ffmpeg,
# openh264, and the experimental in-browser WebCodecs backend) all live under
# libheif/plugins/ and are only compiled by upstream's own CMake build when
# the corresponding external library is found via find_package(). None of
# those libraries are ported to Emscripten, so their bridge files (along with
# the experimental API and the dlopen()-based runtime plugin loader, both off
# by default upstream) are simply left out of `srcs` below.
#
# This still leaves a fully functional library: HEIF/AVIF/HEIC container
# parsing, boxes, metadata, tiling, regions, sequences etc. all work, and one
# image codec is built in end-to-end without needing any third-party
# dependency: the self-contained ISO/IEC 23001-17 "uncompressed" codec
# (upstream's WITH_UNCOMPRESSED_CODEC option, enabled below). To decode or
# encode "real world" HEIC photos (which use HEVC) or AVIF images (which use
# AV1), a codec such as libde265 or dav1d/aom would need to be ported
# separately and linked in alongside this port.
#
# This list was derived from libheif/CMakeLists.txt's unconditional
# `libheif_sources`/`target_sources` entries plus libheif/plugins/CMakeLists.txt's
# `encoder_mask.*`/`nalu_utils.*` (always built) and
# `decoder_uncompressed.*`/`encoder_uncompressed.*` (built when
# WITH_UNCOMPRESSED_CODEC is enabled, as it is here) sources, for tag v1.23.4.
srcs = '''
api/libheif/heif.cc
api/libheif/heif_aux_images.cc
api/libheif/heif_brands.cc
api/libheif/heif_color.cc
api/libheif/heif_components.cc
api/libheif/heif_context.cc
api/libheif/heif_decoding.cc
api/libheif/heif_encoding.cc
api/libheif/heif_entity_groups.cc
api/libheif/heif_image.cc
api/libheif/heif_image_handle.cc
api/libheif/heif_items.cc
api/libheif/heif_library.cc
api/libheif/heif_metadata.cc
api/libheif/heif_omaf.cc
api/libheif/heif_plugin.cc
api/libheif/heif_properties.cc
api/libheif/heif_regions.cc
api/libheif/heif_security.cc
api/libheif/heif_sequences.cc
api/libheif/heif_tai_timestamps.cc
api/libheif/heif_text.cc
api/libheif/heif_tiling.cc
api/libheif/heif_uncompressed.cc
bitstream.cc
box.cc
brands.cc
codecs/avc_boxes.cc
codecs/avc_dec.cc
codecs/avc_enc.cc
codecs/avif_boxes.cc
codecs/avif_dec.cc
codecs/avif_enc.cc
codecs/decoder.cc
codecs/encoder.cc
codecs/hevc_boxes.cc
codecs/hevc_dec.cc
codecs/hevc_enc.cc
codecs/jpeg2000_boxes.cc
codecs/jpeg2000_dec.cc
codecs/jpeg2000_enc.cc
codecs/jpeg_boxes.cc
codecs/jpeg_dec.cc
codecs/jpeg_enc.cc
codecs/uncompressed/unc_boxes.cc
codecs/uncompressed/unc_codec.cc
codecs/uncompressed/unc_dec.cc
codecs/uncompressed/unc_decoder.cc
codecs/uncompressed/unc_decoder_block_component_interleave.cc
codecs/uncompressed/unc_decoder_block_pixel_interleave.cc
codecs/uncompressed/unc_decoder_bytealign_component_interleave.cc
codecs/uncompressed/unc_decoder_component_interleave.cc
codecs/uncompressed/unc_decoder_legacybase.cc
codecs/uncompressed/unc_decoder_mixed_interleave.cc
codecs/uncompressed/unc_decoder_pixel_interleave.cc
codecs/uncompressed/unc_decoder_row_interleave.cc
codecs/uncompressed/unc_enc.cc
codecs/uncompressed/unc_encoder.cc
codecs/uncompressed/unc_encoder_component_interleave.cc
codecs/uncompressed/unc_encoder_rgb_block_pixel_interleave.cc
codecs/uncompressed/unc_encoder_rgb_bytealign_pixel_interleave.cc
codecs/uncompressed/unc_encoder_rgb_pixel_interleave.cc
codecs/vvc_boxes.cc
codecs/vvc_dec.cc
codecs/vvc_enc.cc
color-conversion/alpha.cc
color-conversion/bayer_bilinear.cc
color-conversion/chroma_sampling.cc
color-conversion/colorconversion.cc
color-conversion/hdr_sdr.cc
color-conversion/monochrome.cc
color-conversion/rgb2rgb.cc
color-conversion/rgb2yuv.cc
color-conversion/rgb2yuv_sharp.cc
color-conversion/yuv2rgb.cc
common_utils.cc
compression.cc
compression_brotli.cc
compression_zlib.cc
context.cc
error.cc
file.cc
file_layout.cc
id_creator.cc
image-items/avc.cc
image-items/avif.cc
image-items/grid.cc
image-items/hevc.cc
image-items/iden.cc
image-items/image_item.cc
image-items/jpeg.cc
image-items/jpeg2000.cc
image-items/mask_image.cc
image-items/overlay.cc
image-items/tiled.cc
image-items/unc_image.cc
image-items/vvc.cc
image/image_description.cc
image/pixelimage.cc
init.cc
logging.cc
mini.cc
nclx.cc
omaf_boxes.cc
plugin_registry.cc
plugins/decoder_uncompressed.cc
plugins/encoder_mask.cc
plugins/encoder_uncompressed.cc
plugins/nalu_utils.cc
region.cc
security_limits.cc
sequences/chunk.cc
sequences/seq_boxes.cc
sequences/track.cc
sequences/track_metadata.cc
sequences/track_visual.cc
text.cc
'''.split()


def get_lib_name(settings):
  return 'libheif-mt.a' if settings.PTHREADS else 'libheif.a'


def get(ports, settings, shared):
  ports.fetch_project(port_name, f'https://github.com/strukturag/libheif/archive/refs/tags/v{TAG}.tar.gz', sha512hash=HASH)

  def create(final):
    root_path = ports.get_dir(port_name, f'libheif-{TAG}')
    source_path = os.path.join(root_path, 'libheif')
    api_path = os.path.join(source_path, 'api', 'libheif')

    # Upstream generates this header from heif_version.h.in via CMake's
    # configure_file(); reproduce that (trivial) substitution here. Plugin
    # loading is disabled (see the comment above `srcs`), so there is no
    # plugin directory to report.
    with open(os.path.join(api_path, 'heif_version.h.in')) as f:
      version_h = f.read()
    major, minor, patch = TAG.split('.')
    version_h = version_h.replace('@PROJECT_VERSION_MAJOR@', major)
    version_h = version_h.replace('@PROJECT_VERSION_MINOR@', minor)
    version_h = version_h.replace('@PROJECT_VERSION_PATCH@', patch)
    version_h = version_h.replace('@PLUGIN_DIRECTORY@', '')
    ports.write_file(os.path.join(api_path, 'heif_version.h'), version_h)

    ports.install_headers(api_path, target='libheif')

    flags = [
      '-DHAVE_VISIBILITY=1',
      '-DLIBHEIF_EXPORTS',
      '-DWITH_UNCOMPRESSED_CODEC=1',
      # libc++ on Emscripten has <bit> (this is what upstream's CMake checks
      # for via CHECK_INCLUDE_FILE_CXX(bit HAVE_BIT)).
      '-DHAVE_BIT=1',
      # api/libheif/heif.cc conditionally pulls in an embind (JS-binding)
      # wrapper (api_structs.h + heif_emscripten.h) whenever __EMSCRIPTEN__
      # is defined, which it always is under emcc/em++. That wrapper exists
      # to build a separate JS-facing module (see upstream's own
      # build-emscripten.sh + post.js) and isn't needed for a plain static
      # library; pulling it in here would also require linking every user of
      # this port with `--bind`. Upstream's own build script uses this exact
      # define, under the same '#if !defined(__EMSCRIPTEN_STANDALONE_WASM__)'
      # guard, to opt out of it for non-JS builds, so we reuse that knob
      # rather than patching heif.cc ourselves.
      '-D__EMSCRIPTEN_STANDALONE_WASM__=1',
      # Match libheif's own (non-MSVC) CMakeLists.txt warning flags: upstream
      # builds with these, and Emscripten's port build system always adds
      # -Werror, so warnings upstream doesn't intend to be fatal need to be
      # downgraded here too. -Wtautological-constant-out-of-range-compare in
      # particular only fires on 32-bit size_t targets like wasm32, so it
      # won't show up when testing a port change on a 64-bit host.
      '-Wall',
      '-Wsign-compare',
      '-Wconversion',
      '-Wno-sign-conversion',
      '-Wno-error=conversion',
      '-Wno-error=unused-parameter',
      '-Wno-error=deprecated-declarations',
      '-Wno-error=array-bounds',
      '-Wno-error=tautological-compare',
      '-Wno-error=tautological-constant-out-of-range-compare',
      '-Wno-error=potentially-evaluated-expression',
      '-Wno-nontrivial-memaccess',
    ]
    if settings.PTHREADS:
      flags += ['-pthread', '-DENABLE_MULTITHREADING_SUPPORT=1', '-DENABLE_PARALLEL_TILE_DECODING=1']

    ports.build_port(
      source_path, final, port_name,
      includes=[api_path],
      flags=flags,
      cxxflags=['-std=c++20'],
      srcs=srcs,
    )

  return [shared.cache.get_lib(get_lib_name(settings), create, what='port')]


def clear(ports, settings, shared):
  shared.cache.erase_lib(get_lib_name(settings))
