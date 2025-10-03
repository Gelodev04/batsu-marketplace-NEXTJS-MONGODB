import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    campus?: string;
  }
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string;
      role?: string;
      campus?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    campus?: string;
    image?: string | null;
  }
}
