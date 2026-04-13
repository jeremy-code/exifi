import { Input, type InputProps } from "@exiftools/ui/components/Input";

type NumberInputProps = {
  value: number;
  setValue: (value: number) => void;
} & Omit<InputProps, "value">;

const NumberInput = ({ value, setValue, ...props }: NumberInputProps) => {
  return (
    <Input
      {...props}
      type="number"
      value={value}
      onChange={(event) => {
        if (!Number.isNaN(event.target.valueAsNumber)) {
          setValue(event.target.valueAsNumber);
        } else {
          setValue(0);
        }
      }}
    />
  );
};

export { NumberInput, type NumberInputProps };
