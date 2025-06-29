import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import uploadFile from "../middlewares/multer.js";
import {
  commentOnPin,
  createPin,
  deleteComment,
  deletePin,
  getAllPins,
  getSinglePin,
  updatePin,
  savePin
} from "../controllers/pinControllers.js";

const router = express.Router();

router.post("/new", isAuth, uploadFile, createPin);// Create a new pin
// The uploadFile middleware handles file uploads using multer
router.get("/all", isAuth, getAllPins);// Get all pins
// The isAuth middleware checks if the user is authenticated
router.get("/:id", isAuth, getSinglePin);// Get a single pin by ID
// The :id parameter is the ID of the pin to retrieve
router.put("/:id", isAuth, updatePin);// Update a pin by ID
router.delete("/:id", isAuth, deletePin);// Delete a pin by ID
router.post("/comment/:id", isAuth, commentOnPin);// Comment on a pin by ID
router.delete("/comment/:id", isAuth, deleteComment);// Delete a comment on a pin by comment's ID
router.post("/save/:id", isAuth, savePin);

export default router;
