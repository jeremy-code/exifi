import { useMemo, useState } from "react";

import { Decimal } from "decimal.js";
import type { RationalObject } from "libexif-wasm";

import { approximateRational } from "#lib/math/approximateRational";
import { Input, type InputProps } from "@exiftools/ui/components/Input";

type RationalInputProps = {
  initialRational?: RationalObject | undefined;
  setRational?: (rational: RationalObject) => void;
  numeratorInputProps?: InputProps;
  denominatorInputProps?: InputProps;
  decimalInputProps?: InputProps;
} & InputProps;

const RationalInput = ({
  initialRational,
  setRational,
  numeratorInputProps,
  denominatorInputProps,
  decimalInputProps,
  ...sharedProps
}: RationalInputProps) => {
  const [numerator, setNumerator] = useState(initialRational?.numerator ?? 0);
  const [denominator, setDenominator] = useState(
    initialRational?.denominator ?? 0,
  );
  const decimal = useMemo(
    () =>
      numerator !== undefined && denominator !== undefined ?
        new Decimal(numerator).div(denominator).toNumber()
      : NaN,
    [numerator, denominator],
  );

  return (
    <div className="flex items-center gap-2">
      <Input
        {...sharedProps}
        {...numeratorInputProps}
        type="number"
        value={numerator}
        onChange={(e) => {
          if (!Number.isNaN(e.target.valueAsNumber)) {
            setNumerator(e.target.valueAsNumber);
            setRational?.({ numerator: e.target.valueAsNumber, denominator });
          } else {
            setNumerator(0);
            setRational?.({ numerator: 0, denominator });
          }
        }}
      />
      /
      <Input
        {...sharedProps}
        {...denominatorInputProps}
        type="number"
        value={denominator}
        onChange={(e) => {
          if (!Number.isNaN(e.target.valueAsNumber)) {
            setDenominator(e.target.valueAsNumber);
            setRational?.({ numerator, denominator: e.target.valueAsNumber });
          } else {
            setDenominator(0);
            setRational?.({ numerator, denominator: 0 });
          }
        }}
      />
      =
      <Input
        {...sharedProps}
        {...decimalInputProps}
        type="number"
        step="any"
        value={decimal}
        onChange={(e) => {
          if (!Number.isNaN(e.target.valueAsNumber)) {
            const rational = approximateRational(e.target.valueAsNumber);
            setNumerator(rational.numerator);
            setDenominator(rational.denominator);
            setRational?.(rational);
          }
        }}
      />
    </div>
  );
};

export { RationalInput };
