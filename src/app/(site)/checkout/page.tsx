import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = { title: "סיום ההזמנה", robots: { index: false } };

export default function CheckoutPage() {
  return <CheckoutForm />;
}
