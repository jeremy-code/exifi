const getCurrentPosition = (options?: PositionOptions) => {
  if ("geolocation" in navigator) {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  } else {
    return new Promise<GeolocationPosition>((_resolve, reject) => {
      reject(new Error("Geolocation is supported in this browser"));
    });
  }
};

export { getCurrentPosition };
