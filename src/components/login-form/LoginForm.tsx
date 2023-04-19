import { Formik, Field, Form, FormikHelpers } from "formik";
import styles from "./login-form.module.css";
import { googleLogin, login } from "@/api";
import { STAMP_API_BASE_URL } from "@/config";
import Link from "next/link";

interface Values {
  username: string;
  password: string;
}

export function LoginForm() {
  const loginWithGoogleUrl = () => {
    // const res = await googleLogin();
    const code_challenge =
      "_ZrpCMv-SZgGIjdaZSM5Wde2gy9CF5ZadyTmAasdicdsaWHU540dssa12asdaw12" +
      Math.random() * 10;
    const query = `/v1/oauth/login/social?client_id=acdf4b1e-6c50-46bf-8b8b-0f158346cd54&grant_type=authorization_code&redirect_uri=http://localhost:3000&response_type=code&code_challenge=${code_challenge}&code_challenge_method=S256&scope=openid profile email&state=123sad2222asdasdasdwa&prompt=login&connection=google`;
    window.location = STAMP_API_BASE_URL + query;
  };

  const handleLoginSubmit = async () => {
    const loginRes = await login({
      email: "akashmathwan@gmail.com",
      password: "Ak@$h12h1h2h21",
    });
    console.log({ loginRes });
  };

  return (
    <div className={styles.login_box + " p-3"}>
      <h1 className="display-6 mb-3">Login</h1>
      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={(
          values: Values,
          { setSubmitting }: FormikHelpers<Values>
        ) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 500);
        }}
      >
        <Form target="_blank">
          <div className="mb-3">
            <Field
              className="form-control"
              id="username"
              name="username"
              placeholder="Username"
              aria-describedby="usernameHelp"
            />
          </div>

          <div className="mb-3">
            <Field
              className="form-control"
              id="password"
              name="password"
              placeholder="Password"
              type="password"
            />
          </div>

          <button onClick={handleLoginSubmit} className="btn btn-primary">
            Login
          </button>

          <Link
            href=""
            type="submit"
            target="_blank"
            className="btn btn-primary"
          >
            Login with google
          </Link>

          <Link href="https://stackoverflow.com/" passHref={true}>
            <button onClick={loginWithGoogleUrl}>StackOverflow</button>
          </Link>
        </Form>
      </Formik>
    </div>
  );
}
