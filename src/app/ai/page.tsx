import type { Metadata } from "next";
import AILabClient from "@/components/ai/AILabClient";

export const metadata: Metadata = {
  title: "AI — House of Singh Studios",
  description:
    "How AI powers House of Singh Studios. Faster delivery, sharper consistency, creative direction that stays human.",
  openGraph: {
    title: "AI — House of Singh Studios",
    description:
      "How AI powers House of Singh Studios. Faster delivery, sharper consistency, creative direction that stays human.",
  },
};

export default function AILabPage() {
  return <AILabClient />;
}
