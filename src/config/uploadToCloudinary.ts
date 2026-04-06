import cloudinary from "cloudinary";

const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_NAME || "",
    api_key: process.env.CLOUDINARY_KEY || "",
    api_secret: process.env.CLOUDINARY_SECRET || "",
}

cloudinary.v2.config(cloudinaryConfig);

export const uploadToCloudinary = (fileBuffer: Buffer, folder: string) => {
    return new Promise((resolve, reject) => {
        cloudinary.v2.uploader
            .upload_stream({ folder }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            })
            .end(fileBuffer);
    });
};