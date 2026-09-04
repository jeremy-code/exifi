type Fixture = {
  image: Uint8Array<ArrayBuffer>;
  json: Record<PropertyKey, unknown> | undefined;
  exifBytes: Uint8Array<ArrayBuffer> | undefined;
};

export type { Fixture };
