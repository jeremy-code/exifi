import { createContext, use, useMemo } from "react";

import { ExifIfd, type ValidTypedArray } from "libexif-wasm";
import { create, useStore } from "zustand";

import { getOrInsertEntry } from "#lib/exif/getOrInsertEntry";
import {
  serializeExifData,
  type ExifDataObject,
  type ExifEntryObject,
} from "#lib/exif/serializeExifData";
import { encodeStringToUtf8 } from "#utils/encodeStringToUtf8";
import { getImageDimensions } from "#utils/getImageDimensions";
import { isTypedArray } from "#utils/isTypedArray";

import { useExifData } from "./useExifData";

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
  fix: () => void;
  addImageDimensions: () => Promise<void>;
};

type ExifEditorStore = ExifEditorStoreState & ExifEditorStoreActions;

const useExifEditor = (file: File) => {
  const exifData = useExifData(file);

  const exifDataObject = useMemo(() => serializeExifData(exifData), [exifData]);

  const exifEditorStore = useMemo(
    () =>
      create<ExifEditorStore>((set) => ({
        exifDataObject,
        updateExifEntry: (exifEntryObject, value) => {
          set(() => {
            if (exifData === null) {
              throw new Error("Reference to ExifData instance not found");
            }
            const exifContent = exifData.ifd[ExifIfd[exifEntryObject.ifd]];
            const exifEntry = exifContent?.getEntry(exifEntryObject.tag);

            if (exifEntry === null) {
              throw new Error("Invalid Exif Entry");
            }

            // TODO: Handle other formats than ASCII
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
            if (exifData === null) {
              throw new Error("Reference to ExifData instance not found");
            }
            const exifContent = exifData.ifd[ExifIfd[exifEntryObject.ifd]];
            const exifEntry = exifContent?.getEntry(exifEntryObject.tag);

            if (exifEntry === null) {
              throw new Error("Invalid Exif Entry");
            }

            exifContent.removeEntry(exifEntry);

            return { exifDataObject: serializeExifData(exifData) };
          });
        },
        removeExifEntries: (exifEntryObjects) => {
          set(() => {
            exifEntryObjects.forEach((exifEntryObject) => {
              if (exifData === null) {
                throw new Error("Reference to ExifData instance not found");
              }
              const exifContent = exifData.ifd[ExifIfd[exifEntryObject.ifd]];
              const exifEntry = exifContent?.getEntry(exifEntryObject.tag);

              if (exifEntry === null) {
                throw new Error("Invalid Exif Entry");
              }
              exifContent.removeEntry(exifEntry);
            });
            return { exifDataObject: serializeExifData(exifData) };
          });
        },
        fix: () => {
          set(() => {
            if (exifData === null) {
              throw new Error("Reference to ExifData instance not found");
            }
            exifData.fix();

            return { exifDataObject: serializeExifData(exifData) };
          });
        },
        addImageDimensions: async () => {
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
      })),
    [exifData, exifDataObject, file],
  );

  return { exifEditorStore, exifData };
};

type ExifEditorStoreApi = ReturnType<typeof useExifEditor>["exifEditorStore"];

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
