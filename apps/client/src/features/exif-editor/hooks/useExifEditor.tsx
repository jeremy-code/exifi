import { createContext, use, useMemo } from "react";

import type { LatLng } from "leaflet";
import { ExifIfd, type ExifData, type ValidTypedArray } from "libexif-wasm";
import { create, useStore } from "zustand";

import { getOrInsertEntry } from "#lib/exif/getOrInsertEntry";
import { setGpsExifFromGeolocationPosition } from "#lib/exif/gps/setGpsExifFromGeolocationPosition";
import { updateLatLng } from "#lib/exif/gps/updateLatLng";
import {
  serializeExifData,
  type ExifDataObject,
  type ExifEntryObject,
} from "#lib/exif/serializeExifData";
import { encodeStringToUtf8 } from "#utils/encodeStringToUtf8";
import { getImageDimensions } from "#utils/getImageDimensions";
import { isTypedArray } from "#utils/isTypedArray";

const getExifEntryFromExifEntryObject = (
  exifData: ExifData | null,
  exifEntryObject: ExifEntryObject,
) => {
  if (exifData === null) {
    throw new Error("Reference to ExifData instance not found");
  }
  const exifContent = exifData.ifd[ExifIfd[exifEntryObject.ifd]];
  const exifEntry = exifContent.getEntry(exifEntryObject.tag);

  if (exifEntry === null) {
    throw new Error(
      `Exif entry with tag ${exifEntryObject.tag} was not found.`,
    );
  }
  return exifEntry;
};

type ExifEditorStoreState = {
  exifDataObject: ExifDataObject;
};

type ExifEditorStoreActions = {
  updateExifEntry: (
    exifEntryObject: ExifEntryObject,
    value: string | ValidTypedArray,
  ) => void;
  removeExifEntry: (exifEntryObject: ExifEntryObject) => void;
  removeExifEntries: (exifEntryObjects: ExifEntryObject[]) => void;
  addExifEntry: (
    exifEntryObject: Partial<ExifEntryObject> &
      Pick<ExifEntryObject, "ifd" | "tag" | "format">,
    value: string | ValidTypedArray,
  ) => void;
  fix: () => void;
  addImageDimensions: (file: File) => Promise<void>;
  updateLatLng: (latLng: LatLng) => void;
  setGpsExifFromGeolocationPosition: (
    geoLocationPosition: GeolocationPosition,
  ) => void;
};

type ExifEditorStore = ExifEditorStoreState & ExifEditorStoreActions;

const useExifEditor = (exifData: ExifData) => {
  const exifDataObject = useMemo(() => serializeExifData(exifData), [exifData]);

  const exifEditorStore = useMemo(
    () =>
      create<ExifEditorStore>((set) => ({
        exifDataObject,
        updateExifEntry: (exifEntryObject, value) => {
          set(() => {
            const exifEntry = getExifEntryFromExifEntryObject(
              exifData,
              exifEntryObject,
            );
            if (exifEntry.format === "ASCII" && typeof value === "string") {
              const utf8Array = encodeStringToUtf8(value);
              exifEntry.data = utf8Array;
              exifEntry.components = utf8Array.length;
            } else {
              if (!isTypedArray(value)) {
                throw new Error("Non-ASCII entries expect a TypedArray value");
              }
              exifEntry.fromTypedArray(value);
            }

            return { exifDataObject: serializeExifData(exifData) };
          });
        },
        removeExifEntry: (exifEntryObject) => {
          set(() => {
            const exifEntry = getExifEntryFromExifEntryObject(
              exifData,
              exifEntryObject,
            );
            const exifContent = exifEntry.parent!; // Never null since entry must belong to an IFD
            exifContent.removeEntry(exifEntry);

            return { exifDataObject: serializeExifData(exifData) };
          });
        },
        removeExifEntries: (exifEntryObjects) => {
          set(() => {
            exifEntryObjects.forEach((exifEntryObject) => {
              const exifEntry = getExifEntryFromExifEntryObject(
                exifData,
                exifEntryObject,
              );
              const exifContent = exifEntry.parent!; // Never null since entry must belong to an IFD
              exifContent.removeEntry(exifEntry);
            });
            return { exifDataObject: serializeExifData(exifData) };
          });
        },
        addExifEntry: (exifEntryObject, value) => {
          set(() => {
            if (exifData === null) {
              throw new Error("Reference to ExifData instance not found");
            }
            const exifContent = exifData.ifd[ExifIfd[exifEntryObject.ifd]];
            const prevExifEntry = exifContent.getEntry(exifEntryObject.tag);
            if (prevExifEntry !== null) {
              throw new Error(
                `Exif entry with tag ${exifEntryObject.tag} already exists.`,
              );
            }
            const exifEntry = getOrInsertEntry(
              exifContent,
              exifEntryObject.tag,
            );
            exifEntry.format = exifEntryObject.format;
            if (
              exifEntryObject.format === "ASCII" &&
              typeof value === "string"
            ) {
              const utf8Array = encodeStringToUtf8(value);
              exifEntry.data = utf8Array;
              exifEntry.components = utf8Array.length;
            } else {
              if (!isTypedArray(value)) {
                throw new Error("Non-ASCII entries expect a TypedArray value");
              }
              exifEntry.fromTypedArray(value);
            }

            return { exifDataObject: serializeExifData(exifData) };
          });
        },
        fix: () => {
          set(() => {
            exifData.fix();

            return { exifDataObject: serializeExifData(exifData) };
          });
        },
        addImageDimensions: async (file: File) => {
          const imageDimensions = await getImageDimensions(file);

          set(() => {
            if (exifData === null) {
              throw new Error("Reference to ExifData instance not found");
            }
            const exifIfd = exifData.ifd[ExifIfd.IFD_0];

            const imageWidthEntry = getOrInsertEntry(exifIfd, "IMAGE_WIDTH");
            const imageHeightEntry = getOrInsertEntry(exifIfd, "IMAGE_LENGTH");

            imageWidthEntry.format = "SHORT";
            imageHeightEntry.format = "SHORT";

            imageWidthEntry.fromTypedArray(
              new Uint16Array([imageDimensions.width]),
            );
            imageHeightEntry.fromTypedArray(
              new Uint16Array([imageDimensions.height]),
            );

            return { exifDataObject: serializeExifData(exifData) };
          });
        },
        updateLatLng: (latLng: LatLng) => {
          set(() => {
            updateLatLng(exifData.ifd[ExifIfd.GPS], latLng);

            return { exifDataObject: serializeExifData(exifData) };
          });
        },
        setGpsExifFromGeolocationPosition: (geoLocationPosition) => {
          set(() => {
            setGpsExifFromGeolocationPosition(
              exifData.ifd[ExifIfd.GPS],
              geoLocationPosition,
            );
            return { exifDataObject: serializeExifData(exifData) };
          });
        },
      })),
    [exifData, exifDataObject],
  );

  return exifEditorStore;
};

type ExifEditorStoreApi = ReturnType<typeof useExifEditor>;

const ExifEditorStoreContext = createContext<ExifEditorStoreApi | null>(null);

const useExifEditorStoreContext = <T,>(
  selector: (state: ExifEditorStore) => T,
): T => {
  const exifEditorStore = use(ExifEditorStoreContext);

  if (exifEditorStore === null) {
    throw new Error("Missing ExifEditorStateStoreContext in the tree");
  }

  return useStore(exifEditorStore, selector);
};

export {
  useExifEditor,
  type ExifEditorStore,
  type ExifEditorStoreState,
  type ExifEditorStoreActions,
  type ExifEditorStoreApi,
  ExifEditorStoreContext,
  useExifEditorStoreContext,
};
