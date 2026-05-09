import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  // interface Session {
  //   user: {
  //     id: string;
  //     name?: string | null;
  //     email?: string | null;
  //     image?: string | null;
  //     accessToken?: string;
  //     githubConnected: boolean;
  //   } & DefaultSession["user"];
  // }

  interface Session {
    user: {
      id: string;
      accessToken?: string;
      githubConnected: boolean;
    } & DefaultSession["user"]; // already has name, email, image — no need to redeclare
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    githubConnected?: boolean;
  }
}
