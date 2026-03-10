import type { Metadata } from "next";
import ContactClient from "@/components/contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact — House of Singh Studios",
  description:
    "Start a project with House of Singh Studios. Brand identity, visual media, digital design, and creative strategy for established businesses.",
};

export default function ContactPage() {
  return <ContactClient />;
}
