import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

// ── Hardcoded admin fallback credentials ──────────────────────────────────────
export const ADMIN_EMAIL = "rai@jnnce.ac.in";
export const ADMIN_PASSWORD = "rai#@123";

const JWT_SECRET = process.env.JWT_SECRET || "rai_jnnce_super_secret_jwt_key_2024";

// ── JWT helpers ───────────────────────────────────────────────────────────────
export function signToken(payload: { id: string; role: string; email: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function getAuthUser(req: NextRequest): { id: string; role: string; email: string } | null {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    const token = authHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string; email: string };
    return decoded;
  } catch {
    return null;
  }
}

export function unauthorizedResponse() {
  return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // ── Hardcoded admin fallback (works even if MongoDB is unreachable) ─────
        if (
          credentials.email === ADMIN_EMAIL &&
          credentials.password === ADMIN_PASSWORD
        ) {
          return { id: "admin", email: ADMIN_EMAIL, name: "RAI Admin" };
        }

        // ── MongoDB user lookup ───────────────────────────────────────────────
        try {
          await connectDB();
          const user = await User.findOne({ email: credentials.email });

          if (user) {
            const isCorrectPassword = await bcrypt.compare(
              credentials.password as string,
              user.password
            );
            if (isCorrectPassword) {
              return { id: user._id.toString(), email: user.email, name: user.name };
            }
          }
        } catch {
          // DB unreachable — fallback already checked above
        }

        throw new Error("Invalid credentials");
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
