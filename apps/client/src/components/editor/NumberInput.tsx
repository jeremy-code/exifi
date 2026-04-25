import { Input, type InputProps } from "@exifi/ui/components/Input";

type NumberInputProps = {
  value: number;
  onValueChange: (value: number) => void;
} & Omit<InputProps, "value">;

const NumberInput = ({ value, onValueChange, ...props }: NumberInputProps) => {
  return (
    <Input
      {...props}
      type="number"
      value={value}
      onChange={(event) => {
        if (!Number.isNaN(event.target.valueAsNumber)) {
          onValueChange(event.target.valueAsNumber);
        } else {
          onValueChange(0);
        }
      }}
    />
  );
};

export { NumberInput, type NumberInputProps };
