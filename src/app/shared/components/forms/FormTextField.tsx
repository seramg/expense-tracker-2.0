import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import TextField from "../inputs/TextField";

interface IFormTextFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  className?: string;
  label?: string;
  placeholder?: string;
}

const FormTextField = <T extends FieldValues>({
  name,
  control,
  ...textFieldProps
}: IFormTextFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={(textControlProps) => {
        return (
          <TextField
            controlProps={textControlProps}
            name={name}
            {...textFieldProps}
          />
        );
      }}
    />
  );
};

export default FormTextField;
