"use client";

import { useState } from "react";
import type { Metadata } from "next";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: Connect to n8n webhook
    setSubmitted(true);
  }

  return (
    <section className="py-24 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Info */}
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-neutral-400 mb-4">
              Contact
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-black">
              Let&apos;s talk
            </h1>
            <p className="mt-5 text-lg text-neutral-500 leading-relaxed max-w-md">
              Tell us about your project and we will get back to you within 24
              hours. Or book a discovery call directly.
            </p>

            <div className="mt-10 flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  Email
                </p>
                <a
                  href="mailto:studio@houseofsingh.com"
                  className="text-sm text-black hover:text-neutral-600 transition-colors"
                >
                  studio@houseofsingh.com
                </a>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                  Location
                </p>
                <p className="text-sm text-black">Toronto, Canada</p>
              </div>
            </div>

            {/* Booking embed placeholder */}
            <div className="mt-10 p-6 border border-neutral-100 rounded-xl">
              <p className="text-sm font-medium text-black mb-2">
                Book a Discovery Call
              </p>
              <p className="text-sm text-neutral-500">
                Cal.com or Calendly embed will go here.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            {submitted ? (
              <div className="p-8 bg-neutral-50 rounded-2xl text-center">
                <h2 className="text-2xl font-semibold text-black">
                  Thank you
                </h2>
                <p className="mt-3 text-neutral-500">
                  We have received your message and will get back to you within
                  24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                    Service Interested In
                  </label>
                  <select
                    name="service"
                    className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm text-black focus:outline-none focus:border-black transition-colors"
                  >
                    <option value="">Select a service</option>
                    <option value="brand-identity">
                      Brand Identity & Visual Design
                    </option>
                    <option value="visual-media">
                      Visual Media & Content Production
                    </option>
                    <option value="digital-design">
                      Digital Design & Experience
                    </option>
                    <option value="creative-strategy">
                      Creative Strategy & Systems
                    </option>
                    <option value="multiple">Multiple Services</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                    Budget Range
                  </label>
                  <select
                    name="budget"
                    className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm text-black focus:outline-none focus:border-black transition-colors"
                  >
                    <option value="">Select a range</option>
                    <option value="under-5k">Under $5,000</option>
                    <option value="5k-10k">$5,000 to $10,000</option>
                    <option value="10k-25k">$10,000 to $25,000</option>
                    <option value="25k-50k">$25,000 to $50,000</option>
                    <option value="50k-plus">$50,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                    Tell us about your project
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors resize-none"
                    placeholder="What are you looking to build? Any timelines or details you can share."
                  />
                </div>
                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center rounded-full bg-black px-8 py-3.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
