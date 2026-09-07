#!/bin/bash

set -o errexit -o nounset -o pipefail

OUTPUT_DIR="${PWD}/dist"

if [ ! -d "${OUTPUT_DIR}" ]; then
  mkdir -p "${OUTPUT_DIR}"
fi

ENVIRONMENTS=(
  # Node environment is only needed for Vitest
  node
  web
)

# https://emscripten.org/docs/tools_reference/settings_reference.html
COMPILE_FLAGS=(
  -Oz # https://clang.llvm.org/docs/CommandGuide/clang.html#cmdoption-O0
  -g0 # Do not generate debug information
  --minify 0 # Do not minify JavaScript glue code
  -lembind
  --emit-tsd "${OUTPUT_DIR}/imageUtils.d.ts"
  -sSTACK_SIZE=$((2 ** 16))
  -sALLOW_MEMORY_GROWTH=1
  -sFILESYSTEM=0
  -sMODULARIZE=1
  -sEXPORT_ES6=1
  -sEXPORT_NAME="ImageUtilsModule"
  -sUSE_LIBJPEG=1
  -sUSE_LIBPNG=1
  -o "${OUTPUT_DIR}/imageUtils.js"
)

for environment in "${ENVIRONMENTS[@]}"; do
  em++ \
    "${COMPILE_FLAGS[@]}" \
    -sENVIRONMENT="$environment" \
    src/main.cpp \
    src/codecs/*.cpp

  # Instead of determining environment at runtime, use conditional exports to
  # resolve glue code. The WASM bundle is the same in both environment
  mv "${OUTPUT_DIR}/imageUtils.js" "${OUTPUT_DIR}/imageUtils.${environment}.js"
done
