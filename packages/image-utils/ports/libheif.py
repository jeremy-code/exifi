import os
import shutil

from tools import shared, utils

URL = 'https://github.com/strukturag/libheif'
DESCRIPTION = (
  'libheif is an ISO/IEC 23008-12 HEIF/HEIC and AVIF image container format decoder and encoder'
)
LICENSE = 'GNU Lesser General Public License (LGPL) v3 or later'

TAG = '1.23.4'
HASH = 'f33b216fd550ad1f7d65c76977bea77e4447875e1c84a868d620406bc2530ce8425e781e8052f4cddab49b87e2a6184a58edcd3782bb12ec6414a99bf8663e58'

port_name = 'libheif'


def get_lib_name(settings):
  return 'libheif.a'


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

    build_path = os.path.join(ports.get_build_dir(), port_name)

    emscripten_dir = os.path.dirname(shared.EMXX)
    emcmake = os.path.join(emscripten_dir, 'emcmake')
    emmake = os.path.join(emscripten_dir, 'emmake')

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

    utils.safe_ensure_dirs(build_path)

    configure = [
      emcmake,
      'cmake',
      '--preset=release-noplugins',
      '-DBUILD_SHARED_LIBS=OFF',
      '-DWITH_LIBSHARPYUV=OFF',
      '-DWITH_EXAMPLES=OFF',
      '-DCMAKE_INSTALL_PREFIX=' + os.path.join(build_path, 'install'),
      root_path,
    ]

    utils.run_process(configure, cwd=build_path)

    build = [
      emmake,
      'cmake',
      '--build',
      build_path,
      '--target',
      'heif',
      '--parallel',
    ]

    utils.run_process(build, cwd=build_path)

    library = os.path.join(build_path, 'libheif', 'libheif.a')
    shutil.copyfile(library, final)

  return [
    shared.cache.get_lib(
      get_lib_name(settings),
      create,
      what='port',
    )
  ]


def clear(ports, settings, shared):
  shared.cache.erase_lib(get_lib_name(settings))
