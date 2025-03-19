import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { credits } = await request.json();

    // Calculate price (e.g., $1 per 10 credits)
    const unitAmount = Math.ceil((credits / 10) * 100); // Amount in cents

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Virtual Try-On Credits",
              description: `${credits} credits for virtual try-on`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/virtual-tryon?success=true&credits=${credits}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/virtual-tryon?canceled=true`,
      metadata: {
        userId: session.user.id,
        credits: credits.toString(),
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
