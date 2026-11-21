// Testimonials for the homepage (03) Proof: the published ones that support a promise. For each
// promise the section shows the Sanity testimonial, else the one written in the code (proofChapters
// in src/lib/proof.ts), so a chapter is never empty. Through the resilience helper: while building, a
// failed read uses the coded four; while the site runs, the last good page stays.
import { client } from "./client";
import { readSanity } from "./resilience";
import { proofChapters, type ProofChapter, type TestimonialDoc } from "@/lib/proof";

const proofTestimonialsQuery = `*[_type == "testimonial" && defined(promise) && !(_id in path("drafts.**")) && !(_id in path("versions.**"))] | order(_updatedAt desc) {
  quote,
  author,
  role,
  company,
  excerpt,
  keyPhrase,
  promise
}`;

export async function getProofChapters(): Promise<ProofChapter[]> {
  return readSanity(
    "proof testimonials",
    async () => proofChapters((await client.fetch<TestimonialDoc[]>(proofTestimonialsQuery)) || []),
    () => proofChapters(),
  );
}
