import type { ComponentPropsWithRef } from "react";

type ExifEntryAddProps = ComponentPropsWithRef<"div">;

const ExifEntryAdd = (props: ExifEntryAddProps) => {
  return <div {...props}>Add entry</div>;
};

export { ExifEntryAdd };
