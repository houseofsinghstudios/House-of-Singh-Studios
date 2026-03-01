async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      service: formData.get("service"),
      budget: formData.get("budget"),
      message: formData.get("message"),
    };

    try {
      const webhookUrl =
        process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
        "https://houseofsingh.app.n8n.cloud/webhook/lead-capture";

      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        mode: "no-cors",
      });

      setSubmitted(true);
    } catch (err) {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

Also add these state variables next to the existing useState:
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

And update the submit button to show loading state:
  <button
    type="submit"
    disabled={submitting}
    className="mt-2 inline-flex items-center justify-center rounded-full bg-black px-8 py-3.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
  >
    {submitting ? "Sending..." : "Send Inquiry"}
  </button>

If error is true, show this above the form:
  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
    Something went wrong. Please try again or email studio@houseofsingh.com directly.
  </div>
