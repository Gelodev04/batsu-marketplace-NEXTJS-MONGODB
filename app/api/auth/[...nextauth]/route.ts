import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await User.findOne({ email: credentials?.email });

        if (!user) throw new Error("No user found");

        if (!user.password) {
          throw new Error(
            "This email is registered with Google. Continue with Google."
          );
        }

        const isPasswordValid = await bcrypt.compare(
          credentials!.password,
          user.password
        );
        if (!isPasswordValid) throw new Error("Invalid credentials");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role, // ✅ include role here
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await connectDB();

        const existingUser = await User.findOne({ email: user.email });

        if (existingUser && existingUser.password) {
          return "/login?error=OAuthAccountNotLinked";
        }

        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            role: "student",
            campus: "alangilan",
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if ((user as any).role) {
          token.role = (user as any).role;
        } else if (user.email) {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });
          token.role = dbUser?.role || "student";
        }
      } else if (token?.email && !token.role) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email });
        token.role = dbUser?.role || "student";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as typeof session.user & { role?: string }).role =
          token.role as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
