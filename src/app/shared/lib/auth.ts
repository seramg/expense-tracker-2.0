import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import {
  getUserByEmail,
  getUserByGoogleid,
  createUser,
  linkGoogleProvider,
} from "@/controllers/userController";
import { AppEnv } from "@/config/env";
import { IUser } from "../interfaces/user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: AppEnv.NEXT_AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: AppEnv.AUTH_GOOGLE_CLIENT_ID || "",
      clientSecret: AppEnv.AUTH_GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error("Missing credentials");

        const { email, password } = credentials;
        const user = await getUserByEmail(email as string);

        if (!user) return null;
        // throw new Error("No user found");
        if (!user.password) return null;
        // throw new Error("This account uses Google login");

        const isMatch = await bcrypt.compare(password as string, user.password);
        if (!isMatch) return null;
        // throw new Error("Invalid password");

        return {
          id: (user.id || "")?.toString(),
          email: user.email,
          name: user.name,
          provider: user.providers || "credentials",
          image: user.image || null,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile) {
        if (profile.sub) {
          const googleLinkedUser = await getUserByGoogleid(profile.sub);
          if (googleLinkedUser && googleLinkedUser.email !== profile.email) {
            throw new Error(
              "This Google account is already linked to another user"
            );
          }
        }

        // Check if user exists
        let dbUser = await getUserByEmail(profile.email || "");

        if (!dbUser) {
          // Create user if doesn't exist
          dbUser = await createUser({
            name: profile.name || "",
            email: profile.email || "",
            image: profile.picture || "",
            // password: null, // Google users have no password
            googleId: profile.sub ?? undefined,
            providers: ["google"],
          });
        }
        // Manual → Google = auto-link
        // Google → Manual = explicit password setup
        else if (!dbUser.providers?.includes("google")) {
          await linkGoogleProvider(
            dbUser.id,
            profile.sub || "",
            profile.picture
          );
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const { name, email, image } = user as IUser;
        token.user = { name, email, image };
      }
      return token;
    },
    async session({ session, token }) {
      if (token && token?.user) {
        const userData = token.user as IUser;
        session.user = {
          ...session.user,
          name: userData.name,
          email: userData.email,
          image: userData.image,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
