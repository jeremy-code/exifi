// https://web.archive.org/web/20160220054607/https://geodesy.geology.ohio-state.edu/course/refpapers/00740128.pdf#page=4
const RADIUS_OF_EARTH_IN_KM = 6_371.007181;

/**
 * Calculate destination point given intial point, great-circle distance, and
 * bearing.
 *
 * @see {@link https://www.movable-type.co.uk/scripts/latlong.html#dest-point}
 * @see {@link https://web.archive.org/web/20200717104402/http://mathforum.org/library/drmath/view/52049.html}
 */
const destinationPoint = (
  latitude: number,
  longitude: number,
  distance: number,
  bearing: number,
): [latitude: number, longitude: number] => {
  const φ1 = degreesToRadians(latitude);
  const λ1 = degreesToRadians(longitude);
  const θ = degreesToRadians(bearing);
  const δ = distance / RADIUS_OF_EARTH_IN_KM;

  const sinφ2 =
    Math.sin(φ1) * Math.cos(δ) + Math.cos(φ1) * Math.sin(δ) * Math.cos(θ);
  const φ2 = Math.asin(sinφ2);
  const y = Math.sin(θ) * Math.sin(δ) * Math.cos(φ1);
  const x = Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2);
  const λ2 = λ1 + Math.atan2(y, x);

  return [radiansToDegrees(φ2), radiansToDegrees(λ2)];
};

type Viewport = [x1: number, y1: number, x2: number, y2: number];

const createViewbox = (
  latitude: number,
  longitude: number,
  radiusKm = 15,
): Viewport => {
  const topRight = destinationPoint(latitude, longitude, radiusKm, 45);
  const bottomLeft = destinationPoint(latitude, longitude, radiusKm, 225);

  return [...bottomLeft, ...topRight];
};

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;
const radiansToDegrees = (radians: number) => (radians * 180) / Math.PI;

export { createViewbox };
