//@ts-nocheck
// eslint no-use-before-define: 0
// import { GoogleLogin } from "@react-oauth/google";
// import { useRouter } from "next/router";
// import React from "react";

// const Login = () => {
//   const router = useRouter();

//   const handleFormSubmit = (e) => {
//     e.preventDefault();

//     let email = e.target.elements.email?.value;
//     let password = e.target.elements.password?.value;

//     console.log(email, password);
//   };

//   const handlePhoneSignIn = () => {
//     router.push("phone");
//   };

//   return (
//     <div className="h-screen flex bg-gray-bg1">
//       <div className="w-full max-w-md m-auto bg-white rounded-lg border border-primaryBorder shadow-default py-10 px-16">
//         <h1 className="text-2xl font-medium text-primary mt-4 mb-12 text-center">
//           Log in to your account 🔐
//         </h1>

//         <form>
//           <div>
//             <label htmlFor="email">Email</label>
//             <input
//               type="email"
//               className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
//               id="email"
//               placeholder="Your Email"
//             />
//           </div>
//           <div>
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               className={`w-full p-2 text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out mb-4`}
//               id="password"
//               placeholder="Your Password"
//             />
//           </div>
//           <div className="flex justify-center items-center mt-1">
//             <button>signup ?</button>
//           </div>
//           <div className="flex justify-center items-center mt-6">
//             <button
//               className={`bg-green py-2 px-4 text-sm text-white rounded border border-green focus:outline-none focus:border-green-dark`}
//             >
//               Login
//             </button>
//           </div>

//           <div className="flex justify-center items-center mt-6">
//             <GoogleLogin onSuccess={() => {}} onError={() => {}} />
//           </div>

//           <div className="flex justify-center items-center mt-6">
//             <button
//               className={`bg-green py-2 px-4 text-sm text-white rounded border border-green focus:outline-none focus:border-green-dark`}
//               onClick={() => {
//                 handlePhoneSignIn;
//               }}
//             >
//               Sign In With Phone
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

export {};
