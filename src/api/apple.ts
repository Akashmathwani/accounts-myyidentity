import AppleAuth from "apple-auth";
import fs from "fs";
import jwt_decode from "jwt-decode";

const config = {
  client_id: "app.netlify.29ecf7-melomakarona-keen",
  team_id: "83PB3LYGZP",
  key_id: "TBH6WBN5C4",
  redirect_uri: "https://keen-melomakarona-29ecf7.netlify.app/auth/apple",
  scope: "name email",
};

let auth = new AppleAuth(
  config,
  `-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgtV176PQACCe6qcUm
WsUGQmq8MOef0/kQQs3mjBXVNOmgCgYIKoZIzj0DAQehRANCAASBUdYcEJ/ELv0c
TCusWjmVzJu04HsnUFIx1DFrE0POLKXi5TjTupvmkSq074THcfdZL4iVMtpgX9x8
DQIdetEr
-----END PRIVATE KEY-----`, //read the key file
  "text"
);

export const getAppleData = async (input: any) => {
  console.log({ input });
  try {
    //authenticate our code we recieved from apple login with our key file
    const response = await auth.accessToken(input.authorization.code);
    // decode our token
    const idToken = jwt_decode(response.id_token) as any;

    const user: any = {};
    user.id = idToken.sub;
    //extract email from idToken
    if (idToken.email) user.email = idToken.email;

    //check if user exists in the returned response from Apple
    //Apple returns the user only once, so you might want to save their details
    // in a database for future logins

    if (input.user) {
      const { name } = JSON.parse(input.user);
      user.name = name;
    }
    console.log({ user });

    return user;
  } catch (error) {
    console.log(error, "apple");
  }
};
