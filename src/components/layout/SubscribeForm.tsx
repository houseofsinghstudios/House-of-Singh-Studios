"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="subscribe-success">
        Thank you. You&rsquo;re on the list.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="subscribe-form">
      <div className="subscribe-row">
        <div className="subscribe-input-wrap">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="subscribe-input"
            disabled={status === "submitting"}
          />
          <span className="focus-line" />
        </div>
        <button
          type="submit"
          className="subscribe-btn"
          disabled={status === "submitting"}
        >
          Subscribe&nbsp;&rarr;
        </button>
      </div>
      {status === "error" && (
        <p className="subscribe-error">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
