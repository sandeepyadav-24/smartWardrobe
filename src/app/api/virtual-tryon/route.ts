import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { fal } from "@fal-ai/client";

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

    // Parse the request body
    const body = await request.json();
    const { humanImage, clothingItems } = body;

    if (
      !humanImage ||
      !clothingItems ||
      !Array.isArray(clothingItems) ||
      clothingItems.length === 0
    ) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Create a response object with streaming capability
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Configure Fal.ai client
          fal.config({ credentials: process.env.FAL_KEY });

          // Start with the human image
          let currentImage = humanImage;

          // Send initial progress
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "progress",
                message: "Starting virtual try-on process...",
                progress: 0,
                totalItems: clothingItems.length,
              }) + "\n"
            )
          );

          // Process each clothing item sequentially
          for (let i = 0; i < clothingItems.length; i++) {
            const item = clothingItems[i];
            if (!item.imageUrl) continue;

            // Send progress update
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  type: "progress",
                  message: `Processing ${item.category}...`,
                  progress: i,
                  totalItems: clothingItems.length,
                  currentItem: item.category,
                }) + "\n"
              )
            );

            // Call the Fal.ai API for each clothing item
            const response = await fal.subscribe(
              "fal-ai/kling/v1-5/kolors-virtual-try-on",
              {
                input: {
                  human_image_url: currentImage,
                  garment_image_url: item.imageUrl,
                },
                logs: true,
                onQueueUpdate: (update) => {
                  if (update.status === "IN_PROGRESS") {
                    // Send model progress updates
                    const logMessages = update.logs.map((log) => log.message);
                    controller.enqueue(
                      encoder.encode(
                        JSON.stringify({
                          type: "modelProgress",
                          message: logMessages.join(", "),
                          progress: i,
                          totalItems: clothingItems.length,
                          currentItem: item.category,
                        }) + "\n"
                      )
                    );
                  }
                },
              }
            );

            // Update the current image with the result for the next iteration
            if (response?.data?.image?.url) {
              currentImage = response.data.image.url;

              // Send item completion update
              controller.enqueue(
                encoder.encode(
                  JSON.stringify({
                    type: "itemComplete",
                    message: `${item.category} applied successfully!`,
                    progress: i + 1,
                    totalItems: clothingItems.length,
                    currentItem: item.category,
                    intermediateImage: currentImage,
                  }) + "\n"
                )
              );
            } else {
              console.error(
                "No result image returned from Fal.ai for item:",
                item
              );
              controller.enqueue(
                encoder.encode(
                  JSON.stringify({
                    type: "error",
                    message: `Failed to apply ${item.category}`,
                    progress: i,
                    totalItems: clothingItems.length,
                    currentItem: item.category,
                  }) + "\n"
                )
              );
            }
          }

          // Send final completion message
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "complete",
                message: "Virtual try-on complete!",
                progress: clothingItems.length,
                totalItems: clothingItems.length,
                resultImage: currentImage,
              }) + "\n"
            )
          );

          // Close the stream
          controller.close();
        } catch (error) {
          console.error("Error in stream:", error);
          controller.enqueue(
            encoder.encode(
              JSON.stringify({
                type: "error",
                message: "Failed to generate try-on image",
              }) + "\n"
            )
          );
          controller.close();
        }
      },
    });

    // Return the stream as a response
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in virtual try-on API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
