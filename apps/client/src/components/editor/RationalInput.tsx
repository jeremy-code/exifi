import { useMemo, useState } from "react";

import { Decimal } from "decimal.js";

import { approximateRational } from "#lib/math/approximateRational";
import { Input } from "@exiftools/ui/components/Input";

type RationalObject = {
  numerator: number;
  denominator: number;
};

type RationalInputProps = {
  initialRational?: RationalObject | undefined;
  setRational?: (rational: RationalObject | undefined) => void;
};

const RationalInput = ({
  initialRational,
  setRational,
}: RationalInputProps) => {
  const [numerator, setNumerator] = useState<number | undefined>(
    initialRational?.numerator,
  );
  const [denominator, setDenominator] = useState<number | undefined>(
    initialRational?.denominator,
  );
  const decimal = useMemo(() => {
    if (numerator === undefined || denominator === undefined) {
      return undefined;
    }

    return new Decimal(numerator).div(denominator).toNumber();
  }, [numerator, denominator]);

  return (
    <div className="flex items-center gap-2">
      <Input
        type="number"
        value={numerator}
        onChange={(e) => {
          if (e.target.value === "") {
            setNumerator(undefined);
          }
          if (!Number.isNaN(e.target.valueAsNumber)) {
            setNumerator(e.target.valueAsNumber);

            if (denominator !== undefined) {
              setRational?.({
                numerator: e.target.valueAsNumber,
                denominator,
              });
            }
          }
        }}
      />
      /
      <Input
        type="number"
        value={denominator}
        onChange={(e) => {
          if (e.target.value === "") {
            setDenominator(undefined);
          }
          if (!Number.isNaN(e.target.valueAsNumber)) {
            setDenominator(e.target.valueAsNumber);
            if (numerator !== undefined) {
              setRational?.({
                numerator,
                denominator: e.target.valueAsNumber,
              });
            }
          }
        }}
      />
      =
      <Input
        type="number"
        step="any"
        value={decimal}
        onChange={(e) => {
          if (e.target.value === "") {
            setNumerator(undefined);
            setDenominator(undefined);
          }
          if (!Number.isNaN(e.target.valueAsNumber)) {
            const fraction = approximateRational(e.target.valueAsNumber);

            setNumerator(fraction.numerator);
            setDenominator(fraction.denominator);
            setRational?.(fraction);
          }
        }}
      />
    </div>
  );
};

export { RationalInput };
