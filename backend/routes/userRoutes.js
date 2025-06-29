import express from "express";
import {
  followAndUnfollowUser,
  logOutUser,
  loginUser,
  myProfile,
  registerUser,
  userProfile,
  removeFollower,
} from "../controllers/userControllers.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/register", registerUser); // Register a new user by calling the registerUser controller function and expects user data in the request body.
router.post("/login", loginUser); // Login an existing user by calling the loginUser controller function and expects user credentials in the request body.
router.get("/logout", isAuth, logOutUser); // Log out the user by calling the logOutUser controller function, ensuring the user is authenticated with the isAuth middleware.
router.get("/me", isAuth, myProfile); // Get the authenticated user's profile by calling the myProfile controller function, ensuring the user is authenticated with the isAuth middleware.
router.get("/:id", isAuth, userProfile); // Get a specific user's profile by their ID, ensuring the user is authenticated with the isAuth middleware.
router.post("/follow/:id", isAuth, followAndUnfollowUser); // Follow or unfollow a user by their ID by calling the followAndUnfollowUser controller function, ensuring the user is authenticated with the isAuth middleware.
router.delete("/remove-follower/:id", isAuth, removeFollower);



export default router;
