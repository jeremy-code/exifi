type Encoding = "ASCII" | "UNICODE" | "JIS" | "EMPTY";

type UserComment = {
  encoding: Encoding;
  value: string;
};

export type { Encoding, UserComment };
