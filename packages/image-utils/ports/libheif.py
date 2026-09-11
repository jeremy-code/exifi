import glob
import os

URL = 'https://github.com/strukturag/libheif'
DESCRIPTION = (
  'libheif is an ISO/IEC 23008-12 HEIF/HEIC and AVIF image container format decoder and encoder'
)
LICENSE = 'GNU Lesser General Public License (LGPL) v3 or later'

TAG = '1.23.4'
HASH = 'f33b216fd550ad1f7d65c76977bea77e4447875e1c84a868d620406bc2530ce8425e781e8052f4cddab49b87e2a6184a58edcd3782bb12ec6414a99bf8663e58'

port_name = 'libheif'

variants = {
  'libheif-mt': {'PTHREADS': 1},
}

glob_patterns = [
  'api/libheif/*.cc',
  '*.cc',
  'codecs/*.cc',
  'codecs/uncompressed/*.cc',
  'color-conversion/*.cc',
  'image-items/*.cc',
  'image/*.cc',
  # libheif's own third-party codec plugins are in libheif/plugins/ and are only
  # compiled by upstream's CMake build when the corresponding external library
  # is found via find_package()
  'plugins/decoder_uncompressed.cc',
  'plugins/encoder_mask.cc',
  'plugins/encoder_uncompressed.cc',
  'plugins/nalu_utils.cc',
  'sequences/*.cc',
]

exclude_files = [
  'api/libheif/heif_experimental.cc',
  'plugins_unix.cc',
  'plugins_windows.cc',
]


def get_lib_name(settings):
  return 'libheif-mt.a' if settings.PTHREADS else 'libheif.a'


def get(ports, settings, shared):
  ports.fetch_project(
    port_name,
    f'https://github.com/strukturag/libheif/archive/refs/tags/v{TAG}.tar.gz',
    sha512hash=HASH,
  )

  def create(final):
    root_path = ports.get_dir(port_name, f'libheif-{TAG}')
    source_path = os.path.join(root_path, 'libheif')
    api_path = os.path.join(source_path, 'api', 'libheif')

    srcs = []
    for pattern in glob_patterns:
      matches = glob.glob(
        os.path.join(source_path, pattern),
        recursive=False,
      )
      assert matches, f'Glob pattern matched no files: {pattern}'
      srcs.extend([
        match
        for match in matches
        if match not in [os.path.join(source_path, exclude_file) for exclude_file in exclude_files]
      ])

    srcs = {os.path.relpath(path, source_path) for path in srcs}

    # Upstream generates this header from heif_version.h.in via CMake's
    # configure_file() -- reproduce that substitution here
    with open(os.path.join(api_path, 'heif_version.h.in')) as f:
      version_h = f.read()
    major, minor, patch = TAG.split('.')
    version_h = version_h.replace('@PROJECT_VERSION_MAJOR@', major)
    version_h = version_h.replace('@PROJECT_VERSION_MINOR@', minor)
    version_h = version_h.replace('@PROJECT_VERSION_PATCH@', patch)
    # Plugin loading is disabled
    version_h = version_h.replace('@PLUGIN_DIRECTORY@', '')
    ports.write_file(os.path.join(api_path, 'heif_version.h'), version_h)

    ports.install_headers(api_path, target='libheif')

    flags = [
      '-DHAVE_VISIBILITY=1',
      '-DLIBHEIF_EXPORTS',
      '-DWITH_UNCOMPRESSED_CODEC=1',
      # libc++ on Emscripten has <bit>
      '-DHAVE_BIT=1',
      # api/libheif/heif.cc conditionally pulls in an embind (JS-binding)
      # wrapper (api_structs.h + heif_emscripten.h) whenever __EMSCRIPTEN__
      # is defined
      # https://github.com/strukturag/libheif/blob/08075aebcc0d9bf7d35f900c36114b1b6e90ed7d/build-emscripten.sh#L144
      '-D__EMSCRIPTEN_STANDALONE_WASM__=1',
    ]
    if settings.PTHREADS:
      flags += [
        '-pthread',
        '-DENABLE_MULTITHREADING_SUPPORT=1',
        '-DENABLE_PARALLEL_TILE_DECODING=1',
      ]

    ports.build_port(
      source_path,
      final,
      port_name,
      includes=[api_path],
      flags=flags,
      cxxflags=['-std=c++20'],
      srcs=srcs,
    )

  return [shared.cache.get_lib(get_lib_name(settings), create, what='port')]


def clear(ports, settings, shared):
  shared.cache.erase_lib(get_lib_name(settings))
