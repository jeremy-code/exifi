# https://github.com/emscripten-core/emscripten/pull/27680

import os

URL = 'https://chromium.googlesource.com/webm/heicdec'
DESCRIPTION = 'heicdec is a library for encoding and decoding images in the WebP format, including animation, alpha and metadata (mux/demux) support'
LICENSE = 'BSD-3-Clause license'

TAG = '9c44152ee711785316cae54e5879748e7bc653fb' # 0.1.0-dev
HASH = '42f41806423f80b576439f11a74c96ed8d613692bc40905b87f5bfe5d2fb913804afc92876aee4a356e710e2498130e21f0a8ccebd8d25d8dc5fde8ba04af36d'

port_name = 'heicdec'

def get_lib_name(settings):
  return 'heicdec.a'


def get(ports, settings, shared):
  ports.fetch_project(port_name, f'https://github.com/kjk/heicdec/archive/{TAG}.tar.gz', sha512hash=HASH)

  def create(final):
    root_path = ports.get_dir(port_name, f'heicdec-{TAG}')

    ports.install_headers(os.path.join(root_path, 'dist'))

    ports.build_port(
      root_path, final, port_name,
      exclude_dirs=['test', '.github', 'fuzz', 'dist'],
    )

  return [shared.cache.get_lib(get_lib_name(settings), create, what='port')]


def clear(ports, settings, shared):
  shared.cache.erase_lib(get_lib_name(settings))
