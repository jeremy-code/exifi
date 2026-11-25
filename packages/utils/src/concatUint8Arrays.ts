const concatUint8Arrays = (
  buffers: readonly Uint8Array[],
): Uint8Array<ArrayBuffer> => {
  let totalLength = 0;
  for (const buffer of buffers) {
    totalLength += buffer.length;
  }
  const mergedArray = new Uint8Array(totalLength);

  let currentOffset = 0;
  for (const buffer of buffers) {
    mergedArray.set(buffer, currentOffset);
    currentOffset += buffer.length;
  }

  return mergedArray;
};

export { concatUint8Arrays };
