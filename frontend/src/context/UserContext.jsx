import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const UserContext = createContext();//This sets up a container for sharing user data and functions throughout your app.

export const UserProvider = ({ children }) => { //This wraps your entire app and provides access to user data and functions to all components inside it.
  //children: This is a special prop that contains all the components that will be wrapped by this provider.
  //It allows you to pass down the user context to any component that needs it.

  const [user, setUser] = useState([]); //
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);//Whether login/register button should show loading

  async function registerUser(name, email, password, navigate, fetchPins) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/user/register", {
        name,
        email,
        password,
      });

      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
      fetchPins();
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }
  //Sends a POST request to /api/user/register
//On success: Shows toast, Sets user and auth status, Navigates to /, Fetches pins

  async function loginUser(email, password, navigate, fetchPins) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post("/api/user/login", { email, password });

      toast.success(data.message);
      setUser(data.user);
      setIsAuth(true);
      setBtnLoading(false);
      navigate("/");
      fetchPins();
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }

  const [loading, setLoading] = useState(true);//Whether the app is checking session (/me) in background

  async function fetchUser() {
    try {
      const { data } = await axios.get("/api/user/me");

      setUser(data);
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  //Called once when the app loads (via useEffect)
//Checks if user session exists (/api/user/me)
//Sets the user and isAuth accordingly

  async function followUser(id, fetchUserCallback) {
  try {
    const { data } = await axios.post("/api/user/follow/" + id);
    toast.success(data.message);

    const updated = await axios.get("/api/user/me");
    setUser(updated.data);
    if (fetchUserCallback) fetchUserCallback(); // optional
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to follow/unfollow");
  }
}


  useEffect(() => {
    fetchUser();
  }, []);
  return (
    // Everything inside UserContext is made available to other components
    <UserContext.Provider
      value={{
        loginUser,
        btnLoading,
        isAuth,
        user,
        loading,
        registerUser,
        setIsAuth,
        setUser,
        followUser,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);


// User clicks Login
// ⬇️
// React sends axios POST /api/user/login
// ⬇️
// Vite proxies to URL in frontend/api/user/login
// ⬇️
// Express route validates and responds with user data
// ⬇️
// React stores user, shows success, redirects

