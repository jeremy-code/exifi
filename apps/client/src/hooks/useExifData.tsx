import { useSuspenseQuery } from "@tanstack/react-query";
import { ExifData } from "libexif-wasm";

import { useFileHash } from "./useFileHash";

/**
 * Since File objects cannot easily be serialized for caching in react-query,
 * this hook takes in a file and a promise for the file hash, and uses the file
 * hash as part of the query key to ensure that the ExifData is refetched when a
 * file with different contents is provided
 */
const useExifData = (file: File) => {
  const fileHash = useFileHash(file);
  const { data: exifData } = useSuspenseQuery({
    queryKey: ["useExifData", file, fileHash],
    queryFn: async () => {
      try {
        return await ExifData.fromReadableStream(file.stream());
      } catch (_) {
        // Since rather than returning an empty ExifData, exifLoaderWrite errors
        // when there is no Exif data (even if it is a valid JPG), load ExifData
        // from buffer instead
        return ExifData.from(await file.arrayBuffer());
      }
    },
    gcTime: 30_000, // By default, it is 300,000
  });

  return exifData;
};

export { useExifData };
