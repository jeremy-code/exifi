#!/bin/bash

set -o errexit -o nounset -o pipefail

OUTPUT_DIR="${PWD}/dist"

if [ ! -d "${OUTPUT_DIR}" ]; then
  mkdir -p "${OUTPUT_DIR}"
fi

# https://emscripten.org/docs/tools_reference/settings_reference.html
COMPILE_FLAGS=(
  -Oz # https://clang.llvm.org/docs/CommandGuide/clang.html#cmdoption-O0
  -g0 # Do not generate debug information
  --minify 0 # Do not minify JavaScript glue code
  -lembind
  --emit-tsd "${OUTPUT_DIR}/imageUtils.d.ts"
  -sSTACK_SIZE=$((2 ** 16))
  -sALLOW_MEMORY_GROWTH=1
  -sINCOMING_MODULE_JS_API="[]"
  -sFILESYSTEM=0
  -sMODULARIZE=1
  -sEXPORT_ES6=1
  -sEXPORT_NAME="ImageUtilsModule"
  -sUSE_LIBJPEG=1
  -sUSE_LIBPNG=1
  -o "${OUTPUT_DIR}/imageUtils.js"
)

em++ \
  "${COMPILE_FLAGS[@]}" \
  src/main.cpp \
  src/codecs/*.cpp
