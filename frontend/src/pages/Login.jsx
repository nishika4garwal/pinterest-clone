import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext"; //A custom context that holds user login logic and state (like loading).
import { LoadingAnimation } from "../components/Loading";
import { PinData } from "../context/PinContext";//A custom context that holds pin-related logic and state (like fetching pins).

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //These manage the input fields for the email and password. As the user types, these values are updated.
 //The useState hook is used to create state variables in functional components.
  //The email and password variables hold the current values of the input fields, and setEmail

  const { loginUser, btnLoading } = UserData();
  const navigate = useNavigate();

  const { fetchPins } = PinData();
  //loginUser: a function that handles actual login logic (probably sends a POST request to your backend).
//btnLoading: a boolean that shows a loading state on the login button.
//fetchPins: gets user's content (like Pinterest posts) after login.
//navigate: allows redirecting the user to another page (like homepage) after logging in.



  const submitHandler = (e) => {
    e.preventDefault();
    loginUser(email, password, navigate, fetchPins);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Pinterest-logo.png/600px-Pinterest-logo.png"
            alt="Pinterest"
            className="h-12"
          />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6">
          Log in to see more
        </h2>
        <form onSubmit={submitHandler}>
          <div className="mb-4">
            <label
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700"
            >
              email
            </label>
            <input
              type="email"
              id="email"
              className="common-input"//this is a custom class for styling inputs in index.css
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              password
            </label>
            <input
              type="password"
              id="password"
              className="common-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="common-btn" disabled={btnLoading}>
            {btnLoading ? <LoadingAnimation /> : "Log in"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 to-gray-50">OR</span>
            </div>
          </div>

          <div className="mt-4 text-center text-sm">
            <span>
              Not on pinterest yet? 
              <Link
                to="/register"
                className="font-medium text-pinterest hover:underline"
              >
                Register
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
