import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { writeFile } from "fs/promises";
import { mkdir } from "fs/promises";
import { uploadToCloudinary } from "../../functions/cloudinaryImage";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

// Post Request
export async function POST(request: Request) {
  try {
    console.log("POST /api/clothing - Starting request");

    // Get the authenticated user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const name = formData.get("name") as string;
    const category = formData.get("category") as string;
    const tags = formData.getAll("tags") as string[];
    const favorite = formData.get("favorite") === "true";

    console.log("Form data received:", {
      name,
      category,
      tagsCount: tags.length,
      favorite,
    });

    if (!file || !name || !category) {
      console.log("Missing required fields:", {
        file: !!file,
        name: !!name,
        category: !!category,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Upload to Cloudinary and get URL
    try {
      console.log("Processing file...");
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create a unique filename
      const filename = `${Date.now()}-${file.name}`;

      // Create temp directory for file
      const tempDir = path.join(process.cwd(), "temp");
      await mkdir(tempDir, { recursive: true });
      const tempFilePath = path.join(tempDir, filename);
      await writeFile(tempFilePath, buffer);

      // Upload to Cloudinary using your function
      const imageUrl = await uploadToCloudinary(tempFilePath);

      if (!imageUrl) {
        return NextResponse.json(
          { error: "Failed to upload image to Cloudinary" },
          { status: 500 }
        );
      }

      console.log("Image uploaded successfully to Cloudinary:", imageUrl);

      // Save to database using Prisma with the user's ID
      console.log("Saving to database...");
      const clothingItem = await prisma.clothing_items.create({
        data: {
          user_id: session.user.id, // Use the authenticated user's ID
          name,
          category,
          image_url: imageUrl,
          favourite: favorite,
          wears: 0,
          last_worn: null,
          created_at: new Date().toISOString(),
        },
      });
      console.log("Database entry created:", clothingItem.id);

      // Return a properly formatted response
      return NextResponse.json({
        data: {
          id: clothingItem.id,
          name: clothingItem.name,
          category: category as any,
          tags: tags as any[],
          imageUrl: clothingItem.image_url,
          favorite: clothingItem.favourite,
        },
      });
    } catch (uploadError) {
      console.error(
        "Error during file processing or database save:",
        uploadError
      );
      return NextResponse.json(
        { error: "Failed to process file or save to database" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Unhandled error in POST /api/clothing:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get all clothing items for the current user
export async function GET(request: Request) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clothingItems = await prisma.clothing_items.findMany({
      where: {
        user_id: session.user.id, // Use the authenticated user's ID
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json({
      data: clothingItems.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        imageUrl: item.image_url,
        favorite: item.favourite,
      })),
    });
  } catch (error) {
    console.error("Error in GET /api/clothing:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete a clothing item
export async function DELETE(request: Request) {
  try {
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/clothing:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
