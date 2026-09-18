import { createClient } from "#generated/nominatim/client/client.gen";

const nominatimClient = createClient({
  baseUrl: "https://nominatim.openstreetmap.org",
  headers: {
    // https://operations.osmfoundation.org/policies/nominatim/
    "User-Agent": "exifi",
  },
});

export { nominatimClient };
