//to check if user is authenticated

// We generate a token after registration to instantly log the user in so they 
// don’t have to register then login separately.


//You also generate the token after login, 
//to authenticate the user and allow them access to protected routes.


import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token)
      return res.status(403).json({
        message: "Please Login",
      });

    const decodedData = jwt.verify(token, process.env.JWT_SEC);

    if (!decodedData)
      return res.status(403).json({
        message: "token expired",
      });

    req.user = await User.findById(decodedData.id);

    next();
  } catch (error) {
    res.status(500).json({
      message: "Please Login",
    });
  }
};
