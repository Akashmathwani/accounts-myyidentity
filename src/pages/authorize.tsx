import type {NextPage} from "next";
import Head from "next/head";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {oauthAuthorize} from "@/api/authorize";
import {SessionDataMap} from "@/types";
import {ACCOUNTS_STORAGE} from "@/config/localstorage";

const AuthorizePage: NextPage = () => {
  const [accounts, setAccounts] = useState<SessionDataMap[]>([]);
  const router = useRouter();
  const query: any = router.query;

  const getAccountStorage = () => {
    const accountStorage = window.localStorage.getItem(ACCOUNTS_STORAGE);
    return accountStorage ? JSON.parse(accountStorage) : {};
  };

  const syncAccounts = () => {
    if (
      !query.client_id ||
      !query.redirect_uri ||
      !query.grant_type ||
      !query.response_type
    ) {
      router.push("/error");
      console.log("invalid query");
      return;
    }

    const accounts = getAccountStorage();
    const accountsActive: any = {};
    const activeAccountData: SessionDataMap[] = [];

    if (Object.keys(accounts).length) {
      Object.keys(accounts).forEach((email) => {
        if (
          accounts[email].expires_at < Math.floor(new Date().getTime() / 1000)
        ) {
          delete accounts[email];
        } else {
          accountsActive[email] = accounts[email];
          activeAccountData.push({
            email,
            data: accounts[email],
          });
        }
      });
      console.log("accountsActive", accountsActive);

      window.localStorage.setItem(
        ACCOUNTS_STORAGE,
        JSON.stringify(accountsActive)
      );
      console.log(
        Object.keys(accountsActive).length,
        "Object.keys(accountsActive).length"
      );
      if (Object.keys(accountsActive).length === 0) {
        router.push(
          `/login?redirect_back=true&${new URLSearchParams(query).toString()}`
        );
        console.log("no accounts found");
        return;
      } else {
        setAccounts(activeAccountData);
      }
    } else {
      router.push(
        `/login?redirect_back=true&${new URLSearchParams(query).toString()}`
      );
      console.log("no accounts found");
      return;
    }
  };

  // const fetchAccounts = () => {
  //   if (
  //     !query.client_id ||
  //     !query.redirect_uri ||
  //     !query.grant_type ||
  //     !query.response_type
  //   ) {
  //     router.push("/error");
  //     console.log("invalid query");
  //     return;
  //   }
  //   const accounts = getAccountStorage();

  //   const allEmails = Object.keys(accounts);

  //   if (allEmails?.length) {
  //     setEmails(allEmails);
  //   } else {
  //     router.push(
  //       `/login?redirect_back=true&${new URLSearchParams(query).toString()}`
  //     );
  //     console.log("no accounts found");
  //     return;
  //   }

  //   if (Object.keys(accounts).length) {
  //     const accountData = Object.keys(accounts).map((email) => {
  //       return {
  //         email,
  //         data: accounts[email],
  //       };
  //     });
  //     setAccounts(accountData);
  //   }
  // };

  const handleAuthorize = async (email: string) => {
    const sessionData = accounts.find((account) => account.email === email);
    //token and session expiry
    const sessionToken = sessionData?.data?.token;
    if (sessionToken) {
      const resData = await oauthAuthorize(
        new URLSearchParams(query).toString(),
        sessionToken
      );
      console.log({resData});
      window.location.href = `${resData.redirect_uri}?code=${resData.code}&state=${resData.state}`;
    } else {
      console.log(" session expired or not present");
      // delete session if present
    }
  };

  const isSessionValid = (expires_at: number) => {
    return expires_at > Math.floor(new Date().getTime() / 1000);
  };

  useEffect(() => {
    if (!router.isReady) return;

    syncAccounts();
  }, [router.isReady]);

  if (!router.isReady) return <></>;

  return (
    <div className="bg-green-300 text-center h-screen text-slate-900">
      <Head>
        <title>Authorize </title>
        <meta name="description" content="a face.IO login form" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-xl font-bold mb-100">Authorize Page</h1>
      </main>

      <h3 className="text-xl  mb-100">Select Account to Log In</h3>
      {accounts.map((account, index) => {
        return (
          <>
            <div className="text-center m-100 p-10" key={index + account.email}>
              <button onClick={() => handleAuthorize(account.email)}>
                Choose {account.email}
              </button>
            </div>
            <div key={index + account.data.token}>
              {" "}
              {isSessionValid(accounts[index].data.expires_at)
                ? "active"
                : "expired"}
            </div>
            <div>
              {"expires: " +
                new Date(
                  accounts[index].data.expires_at * 1000
                ).toLocaleString()}
            </div>
            <br></br>
            <br></br>
          </>
        );
      })}

      <></>
    </div>
  );
};

export default AuthorizePage;
