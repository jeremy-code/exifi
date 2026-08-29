const concatUint8Arrays = (arrays: Uint8Array[]): Uint8Array => {
  const totalLength = arrays.reduce((acc, array) => acc + array.length, 0);
  const mergedArray = new Uint8Array(totalLength);

  let currentOffset = 0;
  for (const array of arrays) {
    mergedArray.set(array, currentOffset);
    currentOffset += array.length;
  }

  return mergedArray;
};

export { concatUint8Arrays };
