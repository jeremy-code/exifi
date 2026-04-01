import { useEffect, useRef } from "react";

import { ExifData } from "libexif-wasm";

const useExifDataRef = <TArrayBuffer extends ArrayBufferLike = ArrayBufferLike>(
  arrayBuffer: TArrayBuffer,
) => {
  const exifDataRef = useRef<ExifData | null>(null);

  useEffect(() => {
    exifDataRef.current = ExifData.from(arrayBuffer);

    return () => {
      if (exifDataRef.current !== null) {
        exifDataRef.current.free();
        exifDataRef.current = null;
      }
    };
  }, [arrayBuffer]);

  return exifDataRef;
};

export { useExifDataRef };
