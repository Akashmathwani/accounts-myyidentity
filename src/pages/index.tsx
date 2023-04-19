import type { NextPage } from "next";
import Head from "next/head";
import SignUpForm from "./home";

const Home: NextPage = () => {
  return (
    <div className="bg-green-300 text-center h-screen text-slate-900">
      <Head>
        <title>login/signup form</title>
        <meta name="description" content="a face.IO login form" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {/* <h1 className="text-xl font-bold">Home</h1> */}
        <SignUpForm />
      </main>
    </div>
  );
};

export default Home;
