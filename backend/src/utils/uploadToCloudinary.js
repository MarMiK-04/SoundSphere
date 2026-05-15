import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

const uploadToCloudinary = (buffer, folder, resource_type) => {

   return new Promise((resolve, reject) => {

      const stream = cloudinary.uploader.upload_stream(
         {
            folder,
            resource_type,
         },

         (error, result) => {

            if(error){
               return reject(error);
            }

            return resolve(result);
         }
      );

      streamifier
         .createReadStream(buffer)
         .pipe(stream);
   });
};

export default uploadToCloudinary;