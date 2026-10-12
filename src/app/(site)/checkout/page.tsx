import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = { title: "סיום ההזמנה", robots: { index: false } };

const CheckoutPage = () => <CheckoutForm />;

export default CheckoutPage;
