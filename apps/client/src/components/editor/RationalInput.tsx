import { useMemo, useState } from "react";

import { Decimal } from "decimal.js";
import type { RationalObject } from "libexif-wasm";
import { useNumberFormatter } from "react-aria/useNumberFormatter";
import { Group } from "react-aria-components/Group";

import { approximateRational } from "@exifi/core/math/approximateRational";
import {
  NumberField,
  type NumberFieldProps,
} from "@exifi/ui/components/NumberField";

type RationalInputProps = {
  placeholderRational?: RationalObject | undefined;
  initialRational?: RationalObject | undefined;
  setRational?: (rational: RationalObject) => void;
  numeratorInputProps?: Omit<NumberFieldProps, "value" | "onChange">;
  denominatorInputProps?: Omit<NumberFieldProps, "value" | "onChange">;
  decimalInputProps?: Omit<NumberFieldProps, "value" | "onChange">;
} & Omit<NumberFieldProps, "value" | "onChange">;

const RationalInput = ({
  initialRational,
  setRational,
  numeratorInputProps,
  denominatorInputProps,
  decimalInputProps,
  placeholderRational,
  ...sharedProps
}: RationalInputProps) => {
  const numberFormatter = useNumberFormatter();
  const [prevRational, setPrevRational] = useState(initialRational);
  const [numerator, setNumerator] = useState(initialRational?.numerator);
  const [denominator, setDenominator] = useState(initialRational?.denominator);

  if (prevRational !== initialRational) {
    setNumerator(initialRational?.numerator);
    setDenominator(initialRational?.denominator);
    setPrevRational(initialRational);
  }

  const decimal = useMemo(
    () =>
      numerator !== undefined && denominator !== undefined
        ? new Decimal(numerator).div(denominator).toNumber()
        : undefined,
    [numerator, denominator],
  );

  return (
    <Group className="flex items-center gap-2">
      <NumberField
        {...sharedProps}
        {...numeratorInputProps}
        placeholder={
          placeholderRational !== undefined
            ? numberFormatter.format(placeholderRational.numerator)
            : numeratorInputProps?.placeholder
        }
        aria-label={
          sharedProps["aria-label"] !== undefined
            ? sharedProps["aria-label"] + " Numerator"
            : " Numerator"
        }
        value={numerator}
        onChange={(value) => {
          setNumerator(value);
          if (denominator !== undefined) {
            setRational?.({ numerator: value, denominator });
          }
        }}
      />
      /
      <NumberField
        {...sharedProps}
        {...denominatorInputProps}
        aria-label={
          sharedProps["aria-label"] !== undefined
            ? sharedProps["aria-label"] + " Denominator"
            : "Denominator"
        }
        placeholder={
          placeholderRational !== undefined
            ? numberFormatter.format(placeholderRational.denominator)
            : numeratorInputProps?.placeholder
        }
        value={denominator}
        onChange={(value) => {
          setDenominator(value);
          if (numerator !== undefined) {
            setRational?.({
              numerator,
              denominator: value,
            });
          }
        }}
      />
      =
      <NumberField
        {...sharedProps}
        {...decimalInputProps}
        placeholder={
          placeholderRational !== undefined
            ? numberFormatter.format(
                placeholderRational.numerator / placeholderRational.denominator,
              )
            : numeratorInputProps?.placeholder
        }
        aria-label={
          sharedProps["aria-label"] !== undefined
            ? sharedProps["aria-label"] + " Decimal"
            : "Decimal"
        }
        value={decimal}
        onChange={(value) => {
          const rational = approximateRational(value);
          setNumerator(rational.numerator);
          setDenominator(rational.denominator);
          setRational?.(rational);
        }}
      />
    </Group>
  );
};

export { RationalInput, type RationalInputProps };
