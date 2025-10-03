import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";

const DEFAULT_AVATAR = "/images/user.png";

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

        if (!user.image) {
          user.image = DEFAULT_AVATAR;
          await user.save();
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          campus: user.campus,
          image: user.image,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        const existing = await User.findOne({ email: user.email });

        if (existing && existing.password) {
          return "/login?error=OAuthAccountNotLinked";
        }

        if (!existing) {
          await User.create({
            name: user.name,
            email: user.email,
            role: "student",
            campus: "alangilan",
            image: user.image || DEFAULT_AVATAR, // persist google image
          });
        } else if (!existing.image && user.image) {
          existing.image = user.image; // backfill missing image
          await existing.save();
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user && account?.provider === "google") {
        token.image = user.image;
      }

      const email = (user?.email as string) ?? (token.email as string) ?? "";
      if (email) {
        await connectDB();
        const dbUser = await User.findOne({ email });
        if (dbUser) {
          token.role = dbUser.role;
          token.campus = dbUser.campus;
          if (dbUser.image) {
            token.image = dbUser.image;
          }
        }
      }
      if (!token.image) {
        token.image = DEFAULT_AVATAR;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).campus = token.campus;
        (session.user as any).image = (token as any).image;
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
