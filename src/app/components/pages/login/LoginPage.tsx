"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { ImageUpload } from "@/components/ui/imageUpload";
import FormTextField from "@/shared/components/forms/FormTextField";
import getPayloadFormData from "@/shared/lib/getPayload";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";
import { DEFAULT_VALUES, formSchema } from "./schema";
import { useRouter } from "next/navigation";
import { AuthPageProps } from "../auth/auth.interface";

const LoginPage = ({ handlePageChange }: AuthPageProps) => {
  const router = useRouter();

  type LoginFormData = z.infer<typeof formSchema>;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const onSubmit = async (data: LoginFormData) => {
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false, // ✅ handle redirect manually
    });

    if (res?.error) {
      toast.error("Invalid email or password");
      return;
    }

    toast.success("Logged in successfully");
    router.push("/dashboard");
  };

  return (
    <div className="max-w-1/2 w-full py-8">
      <div className="flex flex-col gap-1 mb-8">
        <h2 className="text-2xl font-semibold">Welcome Back!</h2>
        <p className="text-gray-500 text-sm">
          Log in to experience effortless expense tracking.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 justify-between"
      >
        {/* Email Field */}
        <FormTextField
          name="email"
          control={form.control}
          placeholder="m@example.com"
          label="Email"
        />

        {/* Password Field */}
        <FormTextField
          name="password"
          control={form.control}
          label="Password"
        />

        <Button type="submit">Login</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        >
          Continue with Google
        </Button>

        <FieldDescription>
          Don&apos;t have an account?{" "}
          <Button
            variant="link"
            onClick={() => handlePageChange?.("signup")}
            className="px-2! cursor-pointer"
          >
            Create Account
          </Button>
        </FieldDescription>
      </form>
    </div>
  );
};

export default LoginPage;
