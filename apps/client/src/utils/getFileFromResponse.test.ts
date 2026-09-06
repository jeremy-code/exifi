import { describe, test as baseTest, expect, vi } from "vitest";

import { getFixture } from "@exifi/test-fixtures";

import { getFileFromResponse } from "./getFileFromResponse";

const test = baseTest.extend("plainJpg", () => getFixture("plain-jpg"));

/**
 * Convenience function that sets Response.url since it is readonly
 */
const getResponse = (
  body?: BodyInit,
  init?: ResponseInit & { url?: string },
): Response => {
  if (init === undefined) {
    return new Response(body, init);
  }
  const { url, ...resInit } = init;
  const response = new Response(body, resInit);
  Object.defineProperty(response, "url", { value: url ?? "" });
  return response;
};

describe("getFileFromResponse", () => {
  describe(".filename", () => {
    test("uses Content-Disposition attachment filename when present", async () => {
      const file = await getFileFromResponse(
        getResponse("data", {
          headers: {
            "Content-Disposition": 'attachment; filename="report.docx"',
          },
        }),
      );
      expect(file.name).toBe("report.docx");
    });

    test("falls back to URL pathname basename when no Content-Disposition", async () => {
      const file = await getFileFromResponse(
        getResponse("data", { url: "https://example.com/photo.png" }),
      );
      expect(file.name).toBe("photo.png");
    });

    test("ignores query parameters when deriving filename from URL", async () => {
      const file = await getFileFromResponse(
        getResponse("data", {
          url: "https://example.com/invoice.pdf?token=abc123&v=2",
        }),
      );
      expect(file.name).toBe("invoice.pdf");
    });

    test("ignores inline Content-Disposition (non-attachment) and falls back to URL", async () => {
      const file = await getFileFromResponse(
        getResponse("data", {
          url: "https://example.com/spec.pdf",
          headers: { "Content-Disposition": 'inline; filename="ignored.pdf"' },
        }),
      );
      expect(file.name).toBe("spec.pdf");
    });

    test("handles Content-Disposition attachment without filename parameter", async () => {
      const file = await getFileFromResponse(
        getResponse("data", {
          url: "https://example.com/readme.txt",
          headers: { "Content-Disposition": "attachment" },
        }),
      );
      expect(file.name).toBe("readme.txt");
    });

    test("handles deeply nested URL path", async () => {
      const file = await getFileFromResponse(
        getResponse("data", {
          url: "https://cdn.example.com/a/b/c/d/image.jpg",
        }),
      );
      expect(file.name).toBe("image.jpg");
    });
  });

  describe(".type", () => {
    test("uses Content-Type header when present", async () => {
      const file = await getFileFromResponse(
        getResponse("{}", {
          url: "https://example.com/file.ext",
          headers: { "Content-Type": "application/json" },
        }),
      );
      expect(file.type).toBe("application/json");
    });

    test("infers MIME type from file extension when Content-Type is absent", async () => {
      /**
       * Use an Uint8Array body since passing a string to the Response
       * constructor causes browsers to automatically inject "text/plain;charset=utf-8"
       *
       * @see {@link https://fetch.spec.whatwg.org/#bodyinit-unions}
       */
      const file = await getFileFromResponse(
        getResponse(new TextEncoder().encode("<html></html>"), {
          url: "https://example.com/page.html",
        }),
      );
      expect(file.type).toBe("text/html");
    });

    test("infers MIME type from Content-Disposition filename extension", async () => {
      // Same reason as above
      const file = await getFileFromResponse(
        getResponse(new TextEncoder().encode("{}"), {
          url: "https://example.com/download",
          headers: {
            "Content-Disposition": 'attachment; filename="data.json"',
          },
        }),
      );
      expect(file.type).toBe("application/json");
    });

    test("results in empty string type when no Content-Type and unknown extension", async () => {
      const file = await getFileFromResponse(
        getResponse(new Uint8Array([0x01, 0x02]), {
          url: "https://example.com/file.unknownxyz",
        }),
      );
      expect(file.type).toBe("");
    });

    test("infers MIME type from bytes alone when all else is absent", async ({
      plainJpg,
    }) => {
      const file = await getFileFromResponse(
        getResponse(plainJpg.image, { url: "https://example.com/file" }),
      );
      expect(file.type).toBe("image/jpeg");
    });
  });

  describe(".lastModified", () => {
    const FIXED_DATE = "Thu, 01 Jan 2015 00:00:00 GMT";
    const FIXED_TIMESTAMP = Date.parse(FIXED_DATE); // 1_420_070_400_000

    test("uses Last-Modified header when present", async () => {
      const file = await getFileFromResponse(
        getResponse("data", {
          url: "https://example.com/file.txt",
          headers: { "Last-Modified": FIXED_DATE },
        }),
      );
      expect(file.lastModified).toBe(FIXED_TIMESTAMP);
    });

    test("falls back to Date header when Last-Modified is absent", async () => {
      const file = await getFileFromResponse(
        getResponse("data", {
          url: "https://example.com/file.txt",
          headers: { Date: FIXED_DATE },
        }),
      );
      expect(file.lastModified).toBe(FIXED_TIMESTAMP);
    });

    test("prefers Last-Modified over Date when both are present", async () => {
      const laterDate = "Fri, 01 Jan 2016 00:00:00 GMT";
      const file = await getFileFromResponse(
        getResponse("data", {
          url: "https://example.com/file.txt",
          headers: { "Last-Modified": FIXED_DATE, Date: laterDate },
        }),
      );
      expect(file.lastModified).toBe(FIXED_TIMESTAMP);
    });

    test("defaults to Date.now() when neither header is present", async () => {
      vi.useFakeTimers({ now: FIXED_TIMESTAMP });
      const file = await getFileFromResponse(
        getResponse("data", { url: "https://example.com/file.txt" }),
      );
      expect(file.lastModified).toBe(FIXED_TIMESTAMP);
      vi.useRealTimers();
    });

    test("skips an unparseable Last-Modified and tries Date header", async () => {
      const file = await getFileFromResponse(
        getResponse("data", {
          url: "https://example.com/file.txt",
          headers: { "Last-Modified": "not-a-date", Date: FIXED_DATE },
        }),
      );
      expect(file.lastModified).toBe(FIXED_TIMESTAMP);
    });
  });

  describe("File", () => {
    test("returns a File instance", async () => {
      const file = await getFileFromResponse(
        getResponse("hello world", {
          url: "https://example.com/hello.txt",
          headers: { "Content-Type": "text/plain" },
        }),
      );
      expect(file).toBeInstanceOf(File);
    });

    test("preserves response body bytes", async () => {
      const content = "The quick brown fox";
      const file = await getFileFromResponse(
        getResponse(content, {
          url: "https://example.com/note.txt",
          headers: { "Content-Type": "text/plain" },
        }),
      );
      expect(await file.text()).toBe(content);
    });

    test("handles binary Uint8Array body correctly", async () => {
      const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47]); // PNG magic bytes
      const file = await getFileFromResponse(
        getResponse(bytes, {
          url: "https://example.com/image.png",
          headers: { "Content-Type": "image/png" },
        }),
      );
      expect(await file.bytes()).toEqual(bytes);
    });

    test("returns a zero-byte File for an empty response body", async () => {
      const file = await getFileFromResponse(
        getResponse("", {
          url: "https://example.com/empty.txt",
          headers: { "Content-Type": "text/plain" },
        }),
      );
      expect(file.size).toBe(0);
    });
  });
});
