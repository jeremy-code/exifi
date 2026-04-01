import { createContext, use, useMemo, useState } from "react";

import { ExifData, ExifIfd } from "libexif-wasm";
import { create, useStore } from "zustand";

import {
  serializeExifData,
  serializeExifEntry,
  type ExifDataObject,
  type ExifIfdObject,
} from "#lib/exif/serializeExifData";
import { encodeStringToUtf8 } from "#utils/encodeStringToUtf8";

import { useExifDataRef } from "./useExifDataRef";

type ExifEditorState = {
  exifDataObject: ExifDataObject;
  updateExifEntry: (
    ifd: keyof ExifIfdObject,
    index: number,
    value: string,
  ) => void;
};

const useExifEditorState = <
  TArrayBuffer extends ArrayBufferLike = ArrayBufferLike,
>(
  arrayBuffer: TArrayBuffer,
) => {
  const exifDataRef = useExifDataRef(arrayBuffer);
  const getExifDataRef = () => {
    if (exifDataRef.current === null) {
      throw new Error("Reference to ExifData instance not found");
    }
    return exifDataRef.current;
  };

  const initialExifDataObject = useMemo(() => {
    const exifData = ExifData.from(arrayBuffer);
    const exifDataObject = serializeExifData(exifData);
    exifData.free();
    return exifDataObject;
  }, [arrayBuffer]);

  const [store] = useState(() =>
    create<ExifEditorState>((set) => ({
      exifDataObject: initialExifDataObject,
      updateExifEntry: (ifd, index, value) => {
        set((state) => {
          const exifTagToReplace = state.exifDataObject.ifd[ifd].at(index);
          if (exifTagToReplace === undefined) {
            return {};
          }
          const exifData = getExifDataRef();
          const entry = exifData.ifd[ExifIfd[ifd]]?.getEntry(
            exifTagToReplace.tag,
          );

          if (entry === null) {
            throw new Error("Invalid Exif Entry");
          }

          // TODO: Handle other formats than ASCII
          if (exifTagToReplace.format === "ASCII") {
            const utf8Array = encodeStringToUtf8(value);
            entry.data = utf8Array;
            entry.components = utf8Array.length;
          }

          const exifEntryObject = serializeExifEntry(entry);
          if (exifEntryObject === null) {
            throw new Error("Exif Entry cannot be serialized into an object.");
          }

          return {
            exifDataObject: {
              ...state.exifDataObject,
              ifd: {
                ...state.exifDataObject.ifd,
                [ifd]: state.exifDataObject.ifd[ifd]?.with(
                  index,
                  exifEntryObject,
                ),
              },
            },
          };
        });
      },
    })),
  );

  return {
    exifEditorStateStore: store,
    exifDataRef,
  } as const;
};

type ExifEditorStateStore = ReturnType<
  typeof useExifEditorState
>["exifEditorStateStore"];

const ExifEditorStateStoreContext = createContext<ExifEditorStateStore | null>(
  null,
);

const useExifEditorStateStore = <T,>(
  selector: (state: ExifEditorState) => T,
): T => {
  const exifEditorStateStore = use(ExifEditorStateStoreContext);

  if (exifEditorStateStore === null) {
    throw new Error("Missing ExifEditorStateStoreContext in the tree");
  }

  return useStore(exifEditorStateStore, selector);
};

export {
  useExifEditorState,
  type ExifEditorState,
  ExifEditorStateStoreContext,
  useExifEditorStateStore,
};
