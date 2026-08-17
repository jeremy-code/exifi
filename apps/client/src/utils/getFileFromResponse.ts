import { basename } from "@std/path/posix/basename";
import { parse as contentDispositionParse } from "content-disposition";
import { lookup } from "mrmime";

/**
 * Returns Last-Modified header as a timestamp if present, otherwise returns
 * the Date header as a timestamp. Returns Date.now() as a fallback
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Last-Modified}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Date}
 */
const getLastModifiedFromResponse = (response: Response): number => {
  for (const headerName of ["Last-Modified", "Date"]) {
    const headerValue = response.headers.get(headerName);
    if (headerValue === null) {
      continue;
    }
    /**
     * Per MDN, Date.parse supports the Date.toString format
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse#tostring_and_toutcstring_formats}
     */
    const timestamp = Date.parse(headerValue);
    if (!Number.isNaN(timestamp)) {
      return timestamp;
    }
  }

  // Fallback. When lastModified is undefined, File constructor defaults to
  // Date.now(). Setting manually for testing
  return Date.now();
};

/**
 * Returns a File object from a Response, correctly setting its filename, type,
 * and lastModified properties based on its headers and URL
 */
const getFileFromResponse = async (response: Response): Promise<File> => {
  /**
   * Since "Content-Disposition" header is not a CORS-safelisted header (unlike
   * Content-Type, Last-Modified), it will likely not be present
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_response_header}
   */
  const contentDispositionHeader = response.headers.get("Content-Disposition");
  const contentDisposition =
    contentDispositionHeader !== null
      ? contentDispositionParse(contentDispositionHeader)
      : null;

  const fileName =
    // If "Content-Disposition" header exists with "filename" parameter, use it
    contentDisposition?.type === "attachment" &&
    "filename" in contentDisposition.parameters
      ? contentDisposition.parameters.filename
      : /**
         * Otherwise, defaults to basename of Response. Not using original
         * requestUrl since redirects may occur. Using `.pathname`, so query
         * parameters are not included
         */
        basename(new URL(response.url).pathname);
  const contentType = response.headers.get("Content-Type") ?? lookup(fileName);

  // A File is a superset of a Blob, but the conversion is not straightforward.
  // At least on Node.js, using the File constructor with an already existing
  // Blob does not result in excessive memory usage. Hence, avoiding arrayBuffer
  const blob = await response.blob();

  const file = new File([blob], fileName, {
    type: contentType ?? blob.type,
    lastModified: getLastModifiedFromResponse(response),
  });

  return file;
};

export { getFileFromResponse };
