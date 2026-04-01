type Rational = {
  numerator: number;
  denominator: number;
};

const isRational = (value: unknown): value is Rational => {
  return (
    typeof value === "object" &&
    value !== null &&
    "numerator" in value &&
    "denominator" in value
  );
};

export { isRational, type Rational };
