export interface CreateUserInput {
  name: string;
  email: string;
  password?: string | null;
  image?: string | null;
  providers?: ("credentials" | "google")[];
  googleId?: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password?: string | null;
  image?: string | null;
  providers: string[];
  googleId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
