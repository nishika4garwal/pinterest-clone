import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { UserData } from "./context/UserContext";
import { Loading } from "./components/Loading";
import Navbar from "./components/Navbar";
import PinPage from "./pages/PinPage";
import Create from "./pages/Create";
import Account from "./pages/Account";
import UserProfile from "./pages/UserProfile";

const App = () => {
  const { loading, isAuth, user } = UserData();
  //This extracts loading: true if the app is still fetching the user or auth info.
//isAuth: true if the user is logged in.
//user: The actual user object (e.g., name, email, id).

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        //BrowserRouter is a component from the react-router-dom library that enables routing in a React app using the browser's URL path.
        //React doesn’t natively know how to switch between pages — that’s why you need a router (like BrowserRouter) to handle it.
        
        <BrowserRouter>
          {isAuth && <Navbar user={user} />}
          {/* If the user is logged in (isAuth === true), show the navigation bar. */}
          
          <Routes>
            <Route path="/" element={isAuth ? <Home /> : <Login />} />
            {/* If the user is logged in, show the Home page; otherwise, show the Login page. */}

            <Route
              path="/account"
              element={isAuth ? <Account user={user} /> : <Login />}
            />
            {/* If the user is logged in, show the Account page; otherwise, show the Login page. */}

            <Route
              path="/user/:id"
              element={isAuth ? <UserProfile user={user} /> : <Login />}
            />
            {/* If the user is logged in, show the UserProfile page for the specified user ID; otherwise, show the Login page. */}

            <Route path="/create" element={isAuth ? <Create /> : <Login />} />
            {/* If the user is logged in, show the Create page; otherwise, show the Login page. */}

            <Route
              path="/pin/:id"
              element={isAuth ? <PinPage user={user} /> : <Login />}
            />
            {/* If the user is logged in, show the PinPage for the specified pin ID; otherwise, show the Login page. */}

            <Route path="/login" element={isAuth ? <Home /> : <Login />} />
            {/* If the user is logged in, show the Home page; otherwise, show the Login page. */}

            <Route
              path="/register"
              element={isAuth ? <Home /> : <Register />}
            />
            {/* If the user is logged in, show the Home page; otherwise, show the Register page. */}
            
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
