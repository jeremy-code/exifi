import { useSuspenseQuery } from "@tanstack/react-query";
import { ExifData } from "libexif-wasm";

import { getExifData } from "@exifi/core/exif/utils/getExifData";
import { toastQueue } from "@exifi/ui/components/Toast";

import { useFileHash } from "./useFileHash";

/**
 * Since File objects cannot easily be serialized for caching in react-query,
 * this hook takes in a file and a promise for the file hash, and uses the file
 * hash as part of the query key to ensure that the ExifData is refetched when a
 * file with different contents is provided
 */
const useExifData = (file: File): ExifData => {
  const fileHash = useFileHash(file);
  const { data: exifData } = useSuspenseQuery({
    queryKey: ["useExifData", file, fileHash],
    queryFn: async () => {
      const exifDataOrNull = await getExifData(file);
      if (exifDataOrNull === null) {
        toastQueue.add(
          {
            title: "No Exif data was found",
            description:
              "Exif data could not be found for this file. Initializing default Exif data...",
          },
          { timeout: 5_000 /* 5 seconds */ },
        );
        const newExifData = ExifData.new();
        newExifData.fix();
        return newExifData;
      }
      return exifDataOrNull;
    },
    gcTime: 30_000, // By default, it is 300,000
  });

  return exifData;
};

export { useExifData };
