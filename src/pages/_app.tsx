import { GOOGLE_CLIENT_ID } from "@/config";
import "@/styles/globals.css";
import { FpjsProvider } from "@fingerprintjs/fingerprintjs-pro-react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "bootstrap/dist/css/bootstrap.css";
import { SessionProvider } from "next-auth/react";

import type { AppProps } from "next/app";
import { ToastProvider } from "react-toast-notifications";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <ToastProvider autoDismiss={true} autoDismissTimeout={2000}>
          <FpjsProvider
            loadOptions={{
              apiKey: "IKj2Fpvi0qJXWJn7BN0v",
              region: "ap",
            }}
          >
            <Component {...pageProps} />
          </FpjsProvider>
        </ToastProvider>
      </GoogleOAuthProvider>
    </SessionProvider>
  );
}
