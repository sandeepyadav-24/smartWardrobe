import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { uploadToCloudinary } from "../../functions/cloudinaryImage";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

// Define types for the clothing item
interface ClothingItem {
  id: string;
  name: string;
  category: string;
  tags: string[];
  imageUrl: string;
  favorite: boolean;
}

const prisma = new PrismaClient();

// Post Request
export async function POST(request: Request) {
  try {
    console.log("POST /api/clothing - Starting request");

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

    try {
      console.log("Processing file...");
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name}`;
      const tempDir = path.join(process.cwd(), "temp");
      await mkdir(tempDir, { recursive: true });
      const tempFilePath = path.join(tempDir, filename);
      await writeFile(tempFilePath, buffer);

      const imageUrl = await uploadToCloudinary(tempFilePath);

      if (!imageUrl) {
        return NextResponse.json(
          { error: "Failed to upload image to Cloudinary" },
          { status: 500 }
        );
      }

      console.log("Image uploaded successfully to Cloudinary:", imageUrl);

      const clothingItem = await prisma.clothing_items.create({
        data: {
          user_id: session.user.id,
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

      const response: ClothingItem = {
        id: clothingItem.id,
        name: clothingItem.name,
        category: clothingItem.category,
        tags: tags,
        imageUrl: clothingItem.image_url,
        favorite: clothingItem.favourite,
      };

      return NextResponse.json({ data: response });
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
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clothingItems = await prisma.clothing_items.findMany({
      where: {
        user_id: session.user.id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const response = clothingItems.map(
      (item): ClothingItem => ({
        id: item.id,
        name: item.name,
        category: item.category,
        tags: [],
        imageUrl: item.image_url,
        favorite: item.favourite,
      })
    );

    return NextResponse.json({ data: response });
  } catch (error) {
    console.error("Error in GET /api/clothing:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete a clothing item
export async function DELETE() {
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
