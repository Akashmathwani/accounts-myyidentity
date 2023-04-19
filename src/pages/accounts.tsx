import type { NextPage } from "next";
import Head from "next/head";
import { LoginForm } from "../components";
import SignUpForm from "./home";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ACCOUNTS_STORAGE } from "@/config/localstorage";
import { SessionDataMap, SessionData } from "@/types";
import { authLogout } from "@/api/logout";
import { useToasts } from "react-toast-notifications";

//unix to local date with date and time
// const unixToLocalDate = (unix: number) => {
//   const date = new Date(unix * 1000);
//   return date.toLocaleString();
// };

const AuthorizePage: NextPage = () => {
  const [accounts, setAccounts] = useState<SessionDataMap[]>([]);
  const { addToast } = useToasts();
  const router = useRouter();

  const getAccountStorage = () => {
    const accountStorage = window.localStorage.getItem(ACCOUNTS_STORAGE);
    return accountStorage ? JSON.parse(accountStorage) : {};
  };

  const fetchAccounts = () => {
    const accounts = getAccountStorage();
    if (Object.keys(accounts).length) {
      const accountData = Object.keys(accounts).map((email) => {
        return {
          email,
          data: accounts[email],
        };
      });
      setAccounts(accountData);
    }
  };

  const isSessionValid = (expires_at: number) => {
    return expires_at > Math.floor(new Date().getTime() / 1000);
  };

  const logout = async (email: string) => {
    const accounts = getAccountStorage();
    const sessionData = accounts[email];
    const token = sessionData.token;
    const res = await authLogout(token);
    if (!res) {
      addToast("problem logging out with API", { appearance: "error" });
    }
    delete accounts[email];
    window.localStorage.setItem(ACCOUNTS_STORAGE, JSON.stringify(accounts));
    fetchAccounts();
    router.reload();
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="bg-green-300 text-center h-screen text-slate-900">
      <Head>
        <title>Authorize </title>
        <meta name="description" content="a face.IO login form" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {accounts.map((account, index) => {
          return (
            <div key={index}>
              <h1 key={index}> {account.email} </h1>
              <div key={index + account.email}>
                {" "}
                {isSessionValid(accounts[index].data.expires_at)
                  ? "active"
                  : "expired"}
              </div>
              <div>
                {new Date(
                  accounts[index].data.expires_at * 1000
                ).toLocaleString()}
              </div>

              <button
                className="bg-blue-500 hover:bg-blue-700  font-bold py-2 px-4 rounded"
                onClick={() => logout(account.email)}
              >
                Logout {account.email}
              </button>

              <br></br>
              <br></br>
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default AuthorizePage;
