import { googleLogin, login } from "@/api";
import { authLogin } from "@/api/login.authentication";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { ACCOUNTS_STORAGE } from "@/config/localstorage";
import { LoginData, SessionData } from "@/types";
import { useToasts } from "react-toast-notifications";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { redirect } from "next/dist/server/api-utils";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import AppleLogin from "react-apple-login";

//later in the code

let clientJs: any;

const LoginForm = () => {
  const router = useRouter();
  const query: any = router.query;
  const { data, status } = useSession();
  const { addToast } = useToasts();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState({});
  const [fpHash, setFpHash] = React.useState("");

  const {
    isLoading,
    error,
    data: fpData,
    getData,
  } = useVisitorData({ extendedResult: true }, { immediate: true });

  // The fingerprint can be stored in the state or
  // in the localstorage of the browser

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

  const setAccountSession = (
    email: string,
    sessionData: SessionData,
    provider: string
  ) => {
    if (sessionData.status === "active") {
      const accounts = getAccountStorage();
      accounts[email] = { ...sessionData, provider };
      window.localStorage.setItem(ACCOUNTS_STORAGE, JSON.stringify(accounts));
    }
  };

  const handleLoginSubmit = async () => {
    const accountStorage = getAccountStorage();
    const currentUserSession = accountStorage[email];

    if (
      currentUserSession?.expires_at &&
      currentUserSession.expires_at > Math.floor(new Date().getTime() / 1000)
    ) {
      console.log("already logged in");
      addToast("already logged in!", { appearance: "error" });
    } else {
      const loginRes = await authLogin({ email, password });
      console.log({ loginRes });

      if (loginRes) {
        setAccountSession(email, loginRes.session, "email");
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
            const loginData: LoginData = await googleLogin(id_token);
            if (loginData) {
              setAccountSession(email, loginData.session, "google");
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

  const handleGoolgleLoginFailure = async (response: any) => {
    console.log({ response });
    addToast("Login Failed with google", { appearance: "error" });
  };

  const handlePhoneSignIn = () => {
    router.push("phone");
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  // create and set the fingerprint as soon as
  // the component mounts
  React.useEffect(() => {
    const setFp = async () => {
      const fp = await FingerprintJS.load();

      const { visitorId } = await fp.get();

      setFpHash(visitorId);
    };

    setFp();
  }, []);

  // const singInApple = async () => {
  //   const response = await window.AppleID.auth.signIn();

  //   return response;
  // };

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  console.log({ location });

  const appleResponse = (response: any) => {
    if (!response.error) {
    }
    console.log({ response });
  };

  return (
    <>
      <section className="h-full gradient-form bg-gray-200 md:h-screen">
        <div className="container py-12 px-6 h-full">
          <div className=" flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
            <div className="">
              <div className="block bg-white shadow-lg rounded-lg">
                <div className="lg:flex lg:flex-wrap g-0">
                  <div className="px-4 md:px-0">
                    <div className="md:p-12 md:mx-6">
                      <div className="text-center">
                        <h4 className="text-xl font-semibold mt-1 mb-12 pb-1">
                          MyyIdentity Authentication
                        </h4>
                      </div>
                      <form>
                        <p className="mb-4">Visitor Id: {fpHash}</p>
                        <div className="mb-4">
                          <input
                            type="email"
                            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            placeholder="Your Email"
                            name="userEmail"
                            onChange={handleEmailChange}
                          />
                        </div>
                        <div className="mb-4">
                          <input
                            type="password"
                            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            placeholder="Password"
                            name="pin"
                            onChange={handlePasswordChange}
                          />
                        </div>
                        <div className="text-center pt-1 mb-12 pb-1">
                          <button
                            className="bg-green inline-block px-6 py-2.5 text-black font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full mb-3"
                            type="button"
                            onClick={handleLoginSubmit}
                          >
                            Log In
                          </button>
                        </div>
                        {/* <div className="flex items-center justify-between pb-6">
                          <p className="mb-0 mr-2">Do you have an account?</p>
                          <button
                            type="button"
                            className="inline-block px-6 py-2 border-2 border-green-600 text-green-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                            onClick={handleLoginSubmit}
                          >
                            Log In
                          </button>
                        </div> */}
                        {/* <div className="text-center">or</div>
                        <div className="text-center pt-1 mb-10 pb-1">
                          <button
                            className="bg-green inline-block px-6 py-2.5 text-black font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full mb-3"
                            type="button"
                            onClick={handleGoolgleLoginSubmit}
                          >
                            Log In With Google
                          </button>
                        </div> */}

                        <GoogleLogin
                          onSuccess={handleGoolgleLoginSuccess}
                          onError={() => handleGoolgleLoginFailure}
                        />

                        <br></br>

                        <AppleLogin
                          clientId="com.myysports.app.dev"
                          redirectURI="YOUR_REDIRECT_URL"
                          usePopup={true}
                          callback={appleResponse} // Catch the response
                          scope="email name"
                          responseMode="query"
                          render={(
                            renderProps //Custom Apple Sign in Button
                          ) => (
                            <button
                              onClick={renderProps.onClick}
                              style={{
                                backgroundColor: "white",
                                padding: 10,
                                border: "1px solid black",
                                fontFamily: "none",
                                lineHeight: "25px",
                                fontSize: "25px",
                              }}
                            >
                              <i className="fa-brands fa-apple px-2 "></i>
                              Continue with Apple
                            </button>
                          )}
                        />

                        <br></br>

                        <div className="text-center pt-1 mb-12 pb-1">
                          <button
                            className="bg-green inline-block px-6 py-2.5 text-black font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full mb-3"
                            type="button"
                            onClick={handlePhoneSignIn}
                          >
                            Sign in with Phone
                          </button>
                        </div>

                        {/* <div className="text-center pt-1 mb-12 pb-1">
                          <button
                            className="bg-green inline-block px-6 py-2.5 text-black font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full mb-3"
                            type="button"
                            onClick={handleFBLoginSubmit}
                          >
                            Log In With Facebook
                          </button>
                        </div> */}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginForm;
