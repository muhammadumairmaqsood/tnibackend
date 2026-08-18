// import cloudinary from "cloudinary";
// import dotenv from "dotenv";
// dotenv.config();
// const cloudinaryConfig = {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// };
// cloudinary.config(cloudinaryConfig);
// export const fileUpload = async (files) => {
//   try {
//     if (!files || files.length === 0) {
//       return null;
//     }

//     const file = files[0];

//     const base64 = `data:${file.mimetype};base64,${file.buffer.toString(
//       "base64",
//     )}`;

//     const result = await cloudinary.uploader.upload(base64, {
//       folder: "blogs",
//     });

//     return {
//       url: result.secure_url,
//       public_id: result.public_id,
//     };
//   } catch (error) {
//     console.log("Cloudinary Upload Error:", error);
//     return null;
//   }
// };


import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const fileUpload = async (files) => {
  try {
    if (!files || files.length === 0) {
      return null;
    }

    const file = files[0];

    const base64 = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "blogs",
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.log("Cloudinary Upload Error:", error);
    return null;
  }
};

export default cloudinary;