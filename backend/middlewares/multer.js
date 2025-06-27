// a popular Node.js middleware used to handle 
// file uploads, such as images, PDFs, or any form files


import multer from "multer";

const storage = multer.memoryStorage();
// This tells Multer to store uploaded files in memory (RAM) rather than saving them to disk.
// The file will be available at req.file.buffer (as a Buffer), which is useful if:
// You're uploading it directly to a cloud service (e.g., Cloudinary, AWS S3)
// You don't want to save files to your local server
// Example: Uploading images to Cloudinary works perfectly with memoryStorage().

const uploadFile = multer({ storage }).single("file");

export default uploadFile;
