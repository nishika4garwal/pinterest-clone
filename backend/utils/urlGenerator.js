import DataUriParser from "datauri/parser.js";
import path from "path";

const getDataUrl = (file) => {
  const parser = new DataUriParser();

  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};

// Takes a file from req.file (Multer + memoryStorage)
// Converts it to a base64 Data URI
// Returns a string 


// This format is perfect for:
// Passing to Cloudinary's .upload() or .upload_stream()
// Storing in DB (not common for large files)
// Sending image previews in frontend

export default getDataUrl;
