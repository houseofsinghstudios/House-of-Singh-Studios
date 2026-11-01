// The service names the browser gets (src/lib/service-names.ts) stay equal to the service copy.
import { test } from "node:test";
import assert from "node:assert/strict";
import { services } from "@/data/services";
import { SERVICE_NAMES, SERVICE_TOPICS, serviceTopic } from "@/lib/service-names";
import { getServiceBySlug } from "@/data/services";
import { serviceLinkLabel, serviceLinkTopic } from "@/lib/linking";
import { serviceLink } from "@/lib/brand-pulse/engine";

test("every service page's name, and only those, in the same order", () => {
  assert.deepEqual(Object.entries(SERVICE_NAMES), services.map((s) => [s.slug, s.name]));
});

test("every service page's topic (its seoH1), for the link text in linking.ts", () => {
  assert.deepEqual(Object.entries(SERVICE_TOPICS), services.map((s) => [s.slug, s.seoH1]));
});

test("Brand Pulse links each service by its slug, name and page address", () => {
  assert.deepEqual(serviceLink("BRAND"), { slug: "brand-identity", name: "Brand Identity and Visual Design", url: "https://studios.houseofsingh.com/services/brand-identity" });
  for (const key of ["BRAND", "MEDIA", "DIGITAL", "STRATEGY"] as const) {
    const link = serviceLink(key);
    assert.equal(link.name, services.find((s) => s.slug === link.slug)?.name);
    assert.equal(link.url, `https://studios.houseofsingh.com/services/${link.slug}`);
  }
});

test("the link text in linking.ts is the same as when it read src/data/services.ts", () => {
  // The old lookup, kept here as the reference: the seoH1 of the service page, or nothing.
  const before = (slug: string) => getServiceBySlug(slug)?.seoH1;
  for (const slug of [...services.map((s) => s.slug), "unknown", "", "toString", "constructor", "__proto__"]) {
    assert.equal(serviceTopic(slug), before(slug), slug);
    const topic = before(slug);
    assert.equal(serviceLinkTopic(slug), topic ? ` about ${topic.charAt(0).toLowerCase()}${topic.slice(1)}` : "", slug);
    assert.equal(serviceLinkLabel(slug, "Learn More"), topic ? `Learn More: ${topic}` : "Learn More", slug);
  }
});
