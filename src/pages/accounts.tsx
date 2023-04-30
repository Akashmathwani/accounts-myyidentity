import type {NextPage} from "next";
import Head from "next/head";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {ACCOUNTS_STORAGE} from "@/config/localstorage";
import {SessionDataMap, SessionData} from "@/types";
import {authLogout} from "@/api/logout";
import {useToasts} from "react-toast-notifications";

const AuthorizePage: NextPage = () => {
  const [accounts, setAccounts] = useState<SessionDataMap[]>([]);
  const {addToast} = useToasts();
  const router = useRouter();

  const getAccountStorage = () => {
    const accountStorage = window.localStorage.getItem(ACCOUNTS_STORAGE);
    return accountStorage ? JSON.parse(accountStorage) : {};
  };

  const syncAccounts = () => {
    const accounts = getAccountStorage();
    const accountsActive: any = {};
    const newAccountData: SessionDataMap[] = [];
    if (Object.keys(accounts).length) {
      Object.keys(accounts).forEach((email) => {
        if (
          accounts[email].expires_at < Math.floor(new Date().getTime() / 1000)
        ) {
          delete accounts[email];
        } else {
          accountsActive[email] = accounts[email];
          newAccountData.push({
            email,
            data: accounts[email],
          });
        }
      });
      window.localStorage.setItem(
        ACCOUNTS_STORAGE,
        JSON.stringify(accountsActive)
      );
      if (Object.keys(accountsActive).length === 0) {
        router.push(`/login`);
        console.log("no accounts found");
        return;
      }
      setAccounts(newAccountData);
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
      addToast("problem logging out with API", {appearance: "error"});
    }
    delete accounts[email];
    window.localStorage.setItem(ACCOUNTS_STORAGE, JSON.stringify(accounts));
    syncAccounts();
    router.reload();
  };

  useEffect(() => {
    syncAccounts();
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
