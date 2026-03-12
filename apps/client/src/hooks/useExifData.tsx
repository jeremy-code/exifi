import { useEffect, useEffectEvent, useMemo } from "react";

import { ExifData } from "libexif-wasm";

const useExifData = <TArrayBuffer extends ArrayBufferLike = ArrayBufferLike>(
  arrayBuffer: TArrayBuffer | undefined,
) => {
  const exifData = useMemo(
    () => (arrayBuffer !== undefined ? ExifData.from(arrayBuffer) : null),
    [arrayBuffer],
  );
  const freeExifData = useEffectEvent(() => {
    exifData?.free();
  });

  useEffect(() => {
    // Always free exifData memory on component mount/unmount
    return freeExifData;
  }, []);

  return exifData;
};

export { useExifData };
