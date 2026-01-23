"use client";
import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { ImageUpload } from "../ui/imageUpload";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long.")
    .max(32, "Name must be at most 32 characters long."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(16, "Password must be at most 32 characters long.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  email: z.string().email("Invalid email address"),
  image: z.instanceof(File),
});
const CreateAccountPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  return (
    <div className="max-w-1/2 w-full py-8">
      <div className="flex flex-col gap-1 mb-8">
        <h2 className="text-2xl font-semibold">Create Account</h2>
        <p className="text-gray-500 text-sm">
          Join us to start tracking your expenses.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(
          async (data) => {
            try {
              const formData = new FormData();

              formData.append("name", data.name);
              formData.append("email", data.email);
              formData.append("password", data.password);

              if (data.image instanceof File) {
                formData.append("image", data.image);
              }

              const res = await fetch("/api/users/createUser", {
                method: "POST",
                body: formData, // 🚨 NO headers
              });

              if (!res.ok) {
                const text = await res.text();
                console.error(text);
                return;
              }

              const result = await res.json();
              console.log("SUCCESS", result);
            } catch (err) {
              console.error("Request failed", err);
            }
          },
          (errors) => {
            // THIS WILL TELL YOU WHY THE GET FALLBACK HAPPENED
            console.log("Validation Errors:", errors);
          }
        )}
        className="flex flex-col gap-4 justify-between"
      >
        {/* Image/Avatar Upload (Simplified) */}
        <Controller
          name="image"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex flex-col items-center gap-3"
            >
              <ImageUpload value={field.value} onChange={field.onChange} />
              <div className="flex flex-col items-center">
                <FieldLabel htmlFor="image">Upload avatar</FieldLabel>
                <FieldDescription>PNG, JPG up to 2MB</FieldDescription>
                {fieldState.invalid && (
                  <FieldError className="text-xs" errors={[fieldState.error]} />
                )}
              </div>
            </Field>
          )}
        />

        <div className="flex gap-4 flex-1">
          {/* Name Field */}
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => {
              return (
                <Field
                  data-invalid={fieldState.invalid}
                  className="flex flex-col gap-1 flex-1"
                >
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input {...field} id="name" type="text" placeholder="Name" />
                  {fieldState.invalid && (
                    <FieldError
                      className="text-xs"
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              );
            }}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex flex-col gap-1 flex-1"
              >
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                />

                {fieldState.invalid && (
                  <FieldError className="text-xs" errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex flex-col gap-1 flex-1"
            >
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                {...field}
                id="password"
                type="password"
                placeholder="••••••••"
              />

              {fieldState.invalid && (
                <FieldError className="text-xs" errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Button type="submit">Create Account</Button>
        <FieldDescription>Already have an account? Log in</FieldDescription>
      </form>
    </div>
  );
};
export default CreateAccountPage;
