#!/bin/bash

set -o errexit -o nounset -o pipefail

OUTPUT_DIR="${PWD}/dist"

if [ ! -d "${OUTPUT_DIR}" ]; then
  mkdir -p "${OUTPUT_DIR}"
fi

ENVIRONMENTS=(
  web
  node # Node environment is only needed for Vitest
)

# https://emscripten.org/docs/tools_reference/settings_reference.html
COMPILE_FLAGS=(
  -Oz # https://clang.llvm.org/docs/CommandGuide/clang.html#cmdoption-O0
  -g0 # Do not generate debug information
  --minify 0 # Do not minify JavaScript glue code
  -lembind
  --emit-tsd "${OUTPUT_DIR}/imageUtils.d.ts"
  --use-port="${PWD}/ports/libwebp.py"
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

wasm_files=()
for environment in "${ENVIRONMENTS[@]}"; do
  em++ \
    "${COMPILE_FLAGS[@]}" \
    -sENVIRONMENT="$environment" \
    src/main.cpp \
    src/codecs/*.cpp

  # Instead of determining environment at runtime, use conditional exports to
  # resolve glue code
  mv "${OUTPUT_DIR}/imageUtils.js" "${OUTPUT_DIR}/imageUtils.${environment}.js"
  mv "${OUTPUT_DIR}/imageUtils.wasm" "${OUTPUT_DIR}/imageUtils.${environment}.wasm"
  wasm_files+=("${OUTPUT_DIR}/imageUtils.${environment}.wasm")
done

# Double check that the WASM files are identical
if [ "$(sha256sum "${wasm_files[@]}" | awk '{print $1}' | uniq | wc -l)" -ne 1 ]; then
  echo "Error: WASM files have different SHA-256 checksums:" >&2
  sha256sum "${wasm_files[@]}" >&2
  exit 1
fi

for index in "${!wasm_files[@]}"; do
  if (($index == 1)); then
    mv "${wasm_files[$index]}" "${OUTPUT_DIR}/imageUtils.wasm"
  else
    rm "${wasm_files[$index]}"
  fi
done

tsc
