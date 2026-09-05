import { dequal } from "dequal";
import {
  ExifIfd,
  mapRationalFromObject,
  type ExifData,
  type RationalObject,
  type ValidTypedArray,
} from "libexif-wasm";
import { create } from "zustand";

import type {
  ExifDataObject,
  ExifEntryObject,
} from "@exifi/core/exif/interfaces";
import {
  serializeExifData,
  getEntryFromEntryObject,
  getOrInsertEntry,
  typedArrayInFormat,
} from "@exifi/core/exif/utils";
import { encodeStringToUtf8 } from "@exifi/utils/encodeStringToUtf8";
import { isTypedArray } from "@exifi/utils/isTypedArray";

type ExifEditorStoreState = {
  exifData: ExifData;
  exifDataObject: ExifDataObject;
  initialExifDataObject: ExifDataObject;
  isDirty: boolean;
};

type ExifEditorStoreActions = {
  updateExifDataObject: () => void;
  updateExifEntry: (
    exifEntryObject: ExifEntryObject,
    value: ValidTypedArray | ExifEntryObject["value"],
  ) => void;
  removeExifEntries: (exifEntryObjects: ExifEntryObject[]) => void;
  addExifEntry: (
    exifEntryObject: Partial<ExifEntryObject> &
      Pick<ExifEntryObject, "ifd" | "tag" | "format">,
    value: ValidTypedArray | ExifEntryObject["value"],
  ) => void;
};

type ExifEditorStore = ExifEditorStoreState & ExifEditorStoreActions;

const createExifEditorStore = (exifData: ExifData) =>
  create<ExifEditorStore>((set) => {
    const initialExifDataObject = serializeExifData(exifData);

    return {
      exifData,
      exifDataObject: initialExifDataObject,
      // TODO: Use a better way of comparing objects than dequal that is more
      // efficient and only compares the necessary entries
      isDirty: false,
      initialExifDataObject,
      updateExifDataObject: () => {
        set((state) => {
          const exifDataObject = serializeExifData(state.exifData);
          return {
            exifDataObject,
            isDirty: !dequal(exifDataObject, state.initialExifDataObject),
          };
        });
      },
      updateExifEntry: (exifEntryObject, value) => {
        set((state) => {
          const exifEntry = getEntryFromEntryObject(
            state.exifData,
            exifEntryObject,
          );
          const typedArray =
            typeof value === "string"
              ? encodeStringToUtf8(value)
              : isTypedArray(value)
                ? value
                : exifEntryObject.format === "RATIONAL" ||
                    exifEntryObject.format === "SRATIONAL"
                  ? mapRationalFromObject(
                      value as RationalObject[],
                      exifEntryObject.format,
                    )
                  : typedArrayInFormat(
                      value as number[],
                      exifEntryObject.format,
                    );

          exifEntry.fromTypedArray(typedArray);

          const exifDataObject = serializeExifData(state.exifData);
          return {
            exifDataObject,
            isDirty: !dequal(exifDataObject, state.initialExifDataObject),
          };
        });
      },
      removeExifEntries: (exifEntryObjects) => {
        set((state) => {
          exifEntryObjects.forEach((exifEntryObject) => {
            const exifEntry = getEntryFromEntryObject(
              state.exifData,
              exifEntryObject,
            );
            const exifContent = exifEntry.parent!; // Never null since entry must belong to an IFD
            exifContent.removeEntry(exifEntry);
          });
          const exifDataObject = serializeExifData(state.exifData);
          return {
            exifDataObject,
            isDirty: !dequal(exifDataObject, state.initialExifDataObject),
          };
        });
      },
      addExifEntry: (exifEntryObject, value) => {
        set((state) => {
          const exifContent = state.exifData.ifd[ExifIfd[exifEntryObject.ifd]];
          const prevExifEntry = exifContent.getEntry(exifEntryObject.tag);
          if (prevExifEntry !== null) {
            console.warn(
              `Exif entry with tag ${exifEntryObject.tag} already exists and will be overwritten.`,
            );
          }
          const exifEntry = getOrInsertEntry(exifContent, exifEntryObject.tag);
          exifEntry.format = exifEntryObject.format;
          let typedArray: ValidTypedArray = new Uint8Array(0);
          try {
            typedArray =
              typeof value === "string"
                ? encodeStringToUtf8(value)
                : isTypedArray(value)
                  ? value
                  : exifEntryObject.format === "RATIONAL" ||
                      exifEntryObject.format === "SRATIONAL"
                    ? mapRationalFromObject(
                        value as RationalObject[],
                        exifEntryObject.format,
                      )
                    : typedArrayInFormat(
                        value as number[],
                        exifEntryObject.format,
                      );
          } catch (e) {
            console.error("An error occurred", e);
          }

          exifEntry.fromTypedArray(typedArray);

          const exifDataObject = serializeExifData(state.exifData);
          return {
            exifDataObject,
            isDirty: !dequal(exifDataObject, state.initialExifDataObject),
          };
        });
      },
    };
  });

type ExifEditorStoreApi = ReturnType<typeof createExifEditorStore>;

export {
  type ExifEditorStore,
  type ExifEditorStoreState,
  type ExifEditorStoreActions,
  type ExifEditorStoreApi,
  createExifEditorStore,
};
