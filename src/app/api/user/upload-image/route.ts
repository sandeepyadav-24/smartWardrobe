import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { writeFile } from "fs/promises";
import { mkdir } from "fs/promises";
import path from "path";
import { uploadToCloudinary } from "../../../functions/cloudinaryImage";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    if (!file || !type) {
      return NextResponse.json(
        { error: "File and type are required" },
        { status: 400 }
      );
    }

    // Process the file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const filename = `${Date.now()}-${file.name}`;

    // Create temp directory for file
    const tempDir = path.join(process.cwd(), "temp");
    await mkdir(tempDir, { recursive: true });
    const tempFilePath = path.join(tempDir, filename);
    await writeFile(tempFilePath, buffer);

    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(tempFilePath);

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Failed to upload image to Cloudinary" },
        { status: 500 }
      );
    }

    // Update user profile based on the type of image
    if (type === "fullBody") {
      // In a real implementation, you would add a fullBodyImage field to your User model
      // For now, we'll just update the user's image field
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          image: imageUrl,
        },
      });
    }

    return NextResponse.json({
      imageUrl,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
