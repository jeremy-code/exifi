type Fixture = {
  image: Uint8Array;
  json: Record<PropertyKey, unknown> | undefined;
  exifBytes: Uint8Array | undefined;
};

export type { Fixture };
