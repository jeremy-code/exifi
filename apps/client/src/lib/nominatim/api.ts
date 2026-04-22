import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

import type { paths } from "#generated/nominatim";

const nominatimClient = createFetchClient<paths>({
  baseUrl: "https://nominatim.openstreetmap.org/",
});
const $api = createClient(nominatimClient);

export { $api };
