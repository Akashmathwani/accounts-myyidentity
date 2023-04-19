//apple sign in nextjs
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { ACCOUNTS_STORAGE } from "@/config/localstorage";
import { SessionData } from "@/types";
import { useToasts } from "react-toast-notifications";
import jwt_decode from "jwt-decode";
import { redirect } from "next/dist/server/api-utils";

const AppleLogin = () => {
  return (
    <div>
      <h1>Apple Login</h1>
    </div>
  );
};

export default AppleLogin;
