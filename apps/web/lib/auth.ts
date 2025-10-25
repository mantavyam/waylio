import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: "PATIENT" | "DOCTOR" | "RECEPTION" | "ADMIN";
      uniqueId?: string;
      requiresPasswordChange?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    role: "PATIENT" | "DOCTOR" | "RECEPTION" | "ADMIN";
    uniqueId?: string;
    requiresPasswordChange?: boolean;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: "PATIENT" | "DOCTOR" | "RECEPTION" | "ADMIN";
    uniqueId?: string;
    requiresPasswordChange?: boolean;
    accessToken: string;
    refreshToken: string;
  }
}

const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
  role: z.enum(["PATIENT", "DOCTOR", "RECEPTION", "ADMIN"]).optional(),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email/Phone/ID", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        try {
          const validatedFields = loginSchema.safeParse(credentials);

          if (!validatedFields.success) {
            return null;
          }

          const { identifier, password, role } = validatedFields.data;

          // Call backend API
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                identifier,
                password,
                role,
              }),
            }
          );

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          // Return user object with tokens
          return {
            id: data.user.id,
            email: data.user.email,
            name: `${data.user.first_name} ${data.user.last_name}`,
            role: data.user.role,
            uniqueId: data.user.unique_id,
            requiresPasswordChange: data.user.requires_password_change,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.uniqueId = user.uniqueId;
        token.requiresPasswordChange = user.requiresPasswordChange;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }

      // Update session
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.uniqueId = token.uniqueId;
        session.user.requiresPasswordChange = token.requiresPasswordChange;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
});

