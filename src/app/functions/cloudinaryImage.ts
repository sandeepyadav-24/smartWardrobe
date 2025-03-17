import cloudinary from "cloudinary";
import fs from "fs";
// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload image to Cloudinary
export async function uploadToCloudinary(filePath: string): Promise<string> {
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      folder: "storybook",
      resource_type: "image",
    });

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return "";
  }
}
