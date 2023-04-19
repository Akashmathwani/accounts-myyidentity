import { googleLogin, login } from "@/api";
import { authLogin } from "@/api/login.authentication";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { ACCOUNTS_STORAGE } from "@/config/localstorage";
import { SessionData } from "@/types";
import { useToasts } from "react-toast-notifications";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { redirect } from "next/dist/server/api-utils";
import { sendOTP } from "@/api/authentication.sendOtp";
import { verifyOTP } from "@/api/authentication.verifyOtp";

//later in the code

let clientJs: any;

const LoginForm = () => {
  const router = useRouter();
  const query: any = router.query;
  const { data, status } = useSession();
  const { addToast } = useToasts();

  console.log({ query, data });

  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);

  const handlePhoneChange = (event: any) => {
    setPhone(event.target.value);
  };
  const handleOtpChange = (event: any) => {
    setOtp(event.target.value);
  };

  const getAccountStorage = () => {
    const accountStorage = window.localStorage.getItem(ACCOUNTS_STORAGE);
    return accountStorage ? JSON.parse(accountStorage) : {};
  };

  const setAccountSession = (
    phone: string,
    sessionData: SessionData,
    provider: string
  ) => {
    if (sessionData.status === "active") {
      const accounts = getAccountStorage();
      accounts[phone] = { ...sessionData, provider };
      window.localStorage.setItem(ACCOUNTS_STORAGE, JSON.stringify(accounts));
    }
  };

  const handleSendOTP = async () => {
    if (!isOTPSent) {
      const loginRes = await sendOTP(phone);
      console.log({ loginRes });
      if (loginRes.data) {
        setIsOTPSent(true);
      }
    } else {
      const currentUserSession = getAccountStorage()[phone];
      if (
        currentUserSession?.expires_at &&
        currentUserSession.expires_at > Math.floor(new Date().getTime() / 1000)
      ) {
        console.log("already logged in");
        addToast("already logged in!", { appearance: "error" });
      }
      const loginRes = await verifyOTP(phone, otp);
      console.log({ loginRes });
      setAccountSession(phone, loginRes.session, "phone");
      addToast(" logged in!", { appearance: "success" });
    }
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
                          MyyIdentity Phone Authentication
                        </h4>
                      </div>
                      <form>
                        <p className="mb-4">Continue With Phone</p>
                        <div className="mb-4">
                          <input
                            type="phone"
                            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            placeholder="Your phone"
                            name="userphone"
                            disabled={isOTPSent ? true : false}
                            onChange={handlePhoneChange}
                          />
                        </div>
                        <div className="mb-4">
                          <input
                            type="otp"
                            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                            placeholder="OTP"
                            hidden={isOTPSent ? false : true}
                            name="pin"
                            onChange={handleOtpChange}
                          />
                        </div>
                        <div className="text-center pt-1 mb-12 pb-1">
                          <button
                            className="bg-green inline-block px-6 py-2.5 text-black font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full mb-3"
                            type="button"
                            onClick={handleSendOTP}
                          >
                            {isOTPSent ? "Login" : "Send OTP"}
                          </button>
                        </div>
                        <br></br>
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
