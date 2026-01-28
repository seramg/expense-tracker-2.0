import * as z from "zod";

export const formSchema = z.object({
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

export const DEFAULT_VALUES = {
  name: "",
  email: "",
  password: "",
};
