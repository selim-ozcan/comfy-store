import { Form, Link, redirect } from "react-router-dom";
import { FormInput, SubmitBtn } from "../components";

import { store } from "../store";
import { loginUser } from "../features/user/userSlice";
import { customFetch } from "../utils";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    const response = await customFetch.post("/auth/local", data);
    toast.success("Logged in successfully");
    store.dispatch(loginUser(response.data));
    return redirect("/");
  } catch (error) {
    const errorMessage =
      error?.response?.data?.error?.message ||
      "Please double check your credentials";
    toast.error(errorMessage);
    return null;
  }
};

const Login = () => {
  return (
    <section className="h-screen grid place-items-center">
      <Form
        method="post"
        className="card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4"
      >
        <h4 className="text-center text-3xl font-bold">Login</h4>
        <FormInput
          type="email"
          label="email"
          name="identifier"
          defaultValue="selimozcan17@gmail.com"
        />
        <FormInput
          type="password"
          label="password"
          name="password"
          defaultValue="Pass123?"
        />
        <div className="mt-4">
          <SubmitBtn text="login" />
        </div>

        <p className="text-center">
          Not a member yet?{" "}
          <Link
            to="/register"
            className="ml-2 link link-hover link-primary capitalize"
          >
            register
          </Link>
        </p>
      </Form>
    </section>
  );
};

export default Login;
