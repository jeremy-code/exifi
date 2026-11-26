import { m } from "#paraglide/messages";

const getCurrentPosition = (options?: PositionOptions) => {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    } else {
      reject(new Error(m.layout_geolocation_unsupported()));
    }
  });
};

export { getCurrentPosition };
