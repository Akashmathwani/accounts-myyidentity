import { googleLogin, login } from "@/api";
import { authLogin } from "@/api/login.authentication";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ACCOUNTS_STORAGE } from "@/config/localstorage";
import { SessionData } from "@/types";
import { useToasts } from "react-toast-notifications";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { redirect } from "next/navigation";

//later in the code

let clientJs: any;

const LoginForm = () => {
  const router = useRouter();
  const query: any = router.query;
  const { addToast } = useToasts();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
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

  const handleLoginSubmit = async () => {
    const accountStorage = getAccountStorage();
    const currentUserSession = accountStorage[email];
    console.log(currentUserSession);

    if (
      currentUserSession?.expires_at &&
      currentUserSession.expires_at > Math.floor(new Date().getTime() / 1000)
    ) {
      console.log("already logged in");
      addToast("already logged in!", { appearance: "error" });
    } else {
      const loginRes = await authLogin({ email, password });
      console.log({ loginRes });

      if (loginRes.data) {
        setAccountSession(email, loginRes.data);
      }

      if (query?.redirect_back) {
        const newQuery = query;
        delete newQuery["redirect_back"];
        router.push(`/authorize?${new URLSearchParams(newQuery).toString()}`);
      } else {
        router.push("accounts");
      }
    }

    // Cookies.set("account2_token", "account2_token_value");
  };

  const handleGoolgleLoginSuccess = async (response: any) => {
    const id_token = response?.credential;
    if (id_token) {
      const decoded = jwt_decode(response?.credential) as any;
      console.log({ response, decoded });

      if (decoded) {
        const email = decoded?.email as string;
        const name = decoded?.name;
        console.log();
        if (id_token && email) {
          const accountStorage = getAccountStorage();
          const currentUserSession = accountStorage[email];

          console.log({ response, currentUserSession });

          if (
            currentUserSession?.expires_at &&
            currentUserSession.expires_at >
              Math.floor(new Date().getTime() / 1000)
          ) {
            console.log("already logged in");
            addToast("already logged in!", { appearance: "error" });
          } else {
            const sessionData = await googleLogin(id_token);
            console.log({ response, sessionData });

            if (sessionData) {
              setAccountSession(email, sessionData);
              addToast(`Sucess Google Sign in as ${name}`, {
                appearance: "success",
              });
            }
            if (query?.redirect_back) {
              const newQuery = query;
              delete newQuery["redirect_back"];
              router.push(
                `/authorize?${new URLSearchParams(newQuery).toString()}`
              );
            } else {
              router.push("accounts");
            }
          }
        }
      }
    } else {
      addToast("Some problem with google login", { appearance: "error" });
    }
  };

  const handleGoolgleLoginFailure = async (response) => {
    console.log({ response });
    addToast("Login Failed with google", { appearance: "error" });
  };

  const handlePhoneSignIn = () => {
    console.log("phone sign in");
    redirect("/phone");
  };

  return (
    <>
      <div className="h-screen flex bg-gray-bg1">
        <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
          <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
            Log in to your account 🔐
          </h1>

          <form>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                id="email"
                placeholder="Your Email"
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
                id="password"
                placeholder="Your Password"
              />
            </div>
            <div className="flex justify-center items-center mt-1">
              <button>signup ?</button>
            </div>
            <div className="flex justify-center items-center mt-6">
              <button
                className={`bg-green py-2 px-4 text-sm text-white rounded border border-green focus:outline-none focus:border-green-dark`}
              >
                Login
              </button>
            </div>

            <div className="flex justify-center items-center mt-6">
              <GoogleLogin onSuccess={() => {}} onError={() => {}} />
            </div>

            <div className="flex justify-center items-center mt-6">
              <button
                className={`bg-green py-2 px-4 text-sm text-white rounded border border-green focus:outline-none focus:border-green-dark`}
                onClick={() => {
                  handlePhoneSignIn;
                }}
              >
                Sign In With Phone
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
