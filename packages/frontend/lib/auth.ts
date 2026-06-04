import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  // ← plain config object, NOT NextAuth(...)
  debug: true,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: { scope: "read:user repo" },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.githubConnected = true;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub!;
      session.user.githubConnected = !!token.githubConnected;
      session.user.accessToken = token.accessToken;

      return session;
    },
  },
};
