import express from "express";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import path from "path";

dotenv.config(); //env setup hogya, can take all variables from .env

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const app = express();

const port = process.env.PORT;

//using middlewares
app.use(express.json());
app.use(cookieParser()); //Parses the cookies attached to the request object
                         //Makes them accessible via req.cookies
                         //cookies are used to store session information,
                         //authentication tokens, or other data that needs to persist across requests.
// importing routes
import userRoutes from "./routes/userRoutes.js";
import pinRoutes from "./routes/pinRoutes.js";

// using routes
app.use("/api/user", userRoutes);
app.use("/api/pin", pinRoutes);
//api is used as a prefix
//It makes it obvious that the route is part 
// of the backend API and not a frontend route.
// It helps in organizing the routes and makes it easier to manage the API endpoints.

const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

// app.get('/hello', (req, res) => {
//   res.send('Hello, World!');
// });
// when the server receives a GET request to /hello, it should run the callback function and send "Hello, World!" back to the client.

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});
// start the Express server and have it listen for incoming requests on port 3000. The callback (optional) runs after the server starts.


// "If someone knocks on the /hello door, here’s how we respond."
// "I’m opening the main gate at port 3000 so people can start knocking."