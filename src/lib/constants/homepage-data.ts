// The four client testimonials, written in the code. Each supports one of the homepage Proof promises
// (src/lib/proof.ts). Since the Proof build the published Sanity testimonial for a promise comes first;
// these are the fallback, so a chapter is never empty. The excerpt is copied exactly from the quote
// and the key phrase exactly from the excerpt (tests/proof.test.ts guards both).

export type PromiseId = "understanding" | "time" | "effort" | "people";

export interface Testimonial {
  quote: string;
  // The name, then the role (with the company when there is one), shown as "Name, Role".
  author: string;
  role: string;
  // The part of the quote shown in the Proof section, and the words in it that get the marker band.
  excerpt: string;
  keyPhrase: string;
  promise: PromiseId;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "It was a pleasure collaborating with House of Singh Studios during TEDxToronto. They brought intention to every creative decision and helped foster a team culture rooted in clarity and design excellence.",
    author: "Yanina",
    role: "People and Culture, TEDxToronto",
    excerpt: "They brought intention to every creative decision and helped foster a team culture rooted in clarity and design excellence.",
    keyPhrase: "brought intention to every creative decision",
    promise: "people",
  },
  {
    quote:
      "In a world of overdesigned noise, House of Singh Studios creates work that feels clear, intentional and grounded. Their creative process mirrors the kind of structure we value in finance.",
    author: "Keval",
    role: "CPA and Controller, Ferrari",
    excerpt: "Their creative process mirrors the kind of structure we value in finance.",
    keyPhrase: "the kind of structure we value in finance",
    promise: "effort",
  },
  {
    quote:
      "Crafting a publication cover that reflects the essence of a book is rare. House of Singh Studios brought clarity, intention and elegance to the process.",
    author: "Siddhartha Sharma",
    role: "Author, Speaker, Leadership Coach",
    excerpt: "Crafting a publication cover that reflects the essence of a book is rare.",
    keyPhrase: "reflects the essence of a book",
    promise: "understanding",
  },
  {
    quote:
      "House of Singh Studios approaches creative work with the kind of operational clarity that is rare in this space. From timelines to communication, every step felt aligned and intentional.",
    author: "Lovejot",
    role: "Director, Planning and Logistics",
    excerpt: "From timelines to communication, every step felt aligned and intentional.",
    keyPhrase: "every step felt aligned and intentional",
    promise: "time",
  },
];
