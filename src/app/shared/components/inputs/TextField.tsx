import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React from "react";
import {
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormStateReturn,
} from "react-hook-form";

interface ITextFieldProps<T extends FieldValues> {
  name: string;
  className?: string;
  label?: string;
  placeholder?: string;
  controlProps: {
    field: ControllerRenderProps<T, Path<T>>;
    fieldState: ControllerFieldState;
  };
}

const TextField = <T extends FieldValues>({
  name,
  controlProps,
  placeholder,
  className,
  label,
}: ITextFieldProps<T>) => {
  const { fieldState, field } = controlProps;
  return (
    <Field
      data-invalid={fieldState.invalid}
      className={"flex flex-col gap-1 flex-1 " + className}
    >
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input {...field} id={name} type="text" placeholder={placeholder}   className="placeholder:text-muted-foreground placeholder:text-xs"
 />
      {fieldState.invalid && (
        <FieldError className="text-xs" errors={[fieldState.error]} />
      )}
    </Field>
  );
};

export default TextField;
