import { fal } from "@fal-ai/client";
export async function generateImage({ prompt }: { prompt: string }) {
  try {
    fal.config({ credentials: process.env.FAL_KEY });

    const response = await fal.subscribe(
      "fal-ai/kling/v1-5/kolors-virtual-try-on",
      {
        input: {
          human_image_url:
            "https://storage.googleapis.com/falserverless/model_tests/leffa/person_image.jpg",
          garment_image_url:
            "https://storage.googleapis.com/falserverless/model_tests/leffa/tshirt_image.jpg",
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      }
    );

    return (
      response?.data?.image || "https://example.com/default-placeholder.jpg"
    );
  } catch (error) {}
}
