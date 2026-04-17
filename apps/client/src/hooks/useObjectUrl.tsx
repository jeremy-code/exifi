import { useEffect, useMemo } from "react";

const useObjectUrl = (obj: Blob | MediaSource) => {
  const objectUrl = useMemo(() => URL.createObjectURL(obj), [obj]);

  useEffect(() => {
    return () => {
      if (objectUrl !== null) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  return objectUrl;
};

export { useObjectUrl };
