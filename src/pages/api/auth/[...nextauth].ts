import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { googleLogin } from "@/api";
import { ACCOUNTS_STORAGE } from "@/config/localstorage";
import { SessionData } from "@/types";

export type SocialUser = {
  provider: string;
  email: string;
  token: string;
};

const getAccountStorage = () => {
  const accountStorage = window.localStorage.getItem(ACCOUNTS_STORAGE);
  return accountStorage ? JSON.parse(accountStorage) : {};
};

const setAccountSession = (email: string, sessionData: SessionData) => {
  if (sessionData.status === "active") {
    const accounts = getAccountStorage();
    accounts[email] = sessionData;
    window.localStorage.setItem(ACCOUNTS_STORAGE, JSON.stringify(accounts));
  }
};

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId:
        "729824482770-janjo5h3iboqblpv07t4lonto6isgb12.apps.googleusercontent.com",
      clientSecret: "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",
    }),
    FacebookProvider({
      clientId: "548583120581704",
      clientSecret: "4a9bcc966d3fc53a5422a8101543e2e8",
    }),
  ],
  session: {
    strategy: "jwt",
    jwt: true,
  },
  callbacks: {
    async jwt(token: any, user: any, account, profile, isNewUser) {
      console.log({ ac: token }, "@@1");
      // if (account?.accessToken) {
      //   console.log(account.accessToken);
      //   console.log(account);

      //   token.accessToken = account.accessToken;
      // }
      return {
        provider: "google",
        token: token?.account?.id_token,
        email: token?.user?.email,
      };

      // if (token?.account?.id_token) {
      //   const resBack = await googleLogin(token?.account?.id_token);
      //   console.log({ email: token?.user?.email, hmm: resBack }, "@@3");
      //   if (token?.user?.email && resBack) {
      //     setAccountSession(token?.email, resBack);
      //   }
      //   return { sessionData: resBack, id_token: token?.account?.id_token };
      // }
    },
    async signIn({ user, account, profile }) {
      // Save the user's email and ID token in the session data
      console.log({ user, account, profile }, "##$2");
      return {
        email: user?.email,
        idToken: account?.id_token,
      };
    },
  },
};

export default NextAuth(authOptions);
