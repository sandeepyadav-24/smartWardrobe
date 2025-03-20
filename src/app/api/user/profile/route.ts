import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    try {
      // Fetch the user's profile data
      const user = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      });

      if (!user) {
        // If user not found in database but we have session data,
        // return the session data as a fallback
        return NextResponse.json({
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          fullBodyImage: session.user.image,
        });
      }

      // Return user data with the image as fullBodyImage
      return NextResponse.json({
        ...user,
        fullBodyImage: user.image, // This is a placeholder
      });
    } catch (dbError) {
      console.error("Database connection error:", dbError);

      // Return a fallback response with just the session data
      // This allows the app to function even when DB is unavailable
      return NextResponse.json({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        fullBodyImage: session.user.image,
      });
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
