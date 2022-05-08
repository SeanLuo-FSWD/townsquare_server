import dotenv from "dotenv";
// import * as Cloudinary from 'cloudinary'
import { v2 as cloudinary } from "cloudinary";
import { UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";

dotenv.config();

class PhotoModel {
  private cloudinary;

  constructor() {
    this.cloudinary = cloudinary;

    this.cloudinary.config({
      cloud_name: process.env.cloud_name,
      api_key: process.env.api_key,
      api_secret: process.env.api_secret,
    });
  }

  async uploadImage(buffer: Buffer): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          upload_preset: "ml_default",
        },
        (error: Error, result: UploadApiResponse) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  }
}

export default PhotoModel;
