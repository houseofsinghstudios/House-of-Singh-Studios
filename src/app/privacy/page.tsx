import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — House of Singh Studios",
  description: "How House of Singh Studios collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <section className="legal-page" style={{ padding: "var(--hero-pt) var(--page-px) clamp(80px, 10vw, 120px)" }}>
      <div className="legal-content">
        <p className="editorial-label-static" style={{ marginBottom: 24, fontFamily: "var(--sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)" }}>
          Legal
        </p>
        <h1 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.025em", lineHeight: 1.1, color: "var(--text-primary)", margin: "0 0 16px" }}>
          Privacy Policy
        </h1>
        <p className="legal-updated" style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--text-muted)", marginBottom: "clamp(40px, 5vw, 64px)" }}>
          Last updated: March 31, 2026
        </p>

        <div className="legal-body" style={{ fontFamily: "var(--sans)", fontSize: "clamp(15px, 1.1vw, 16px)", lineHeight: 1.75, color: "var(--text-secondary)", maxWidth: 680 }}>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>1. Who we are</h2>
          <p style={{ margin: "0 0 32px" }}>
            House of Singh Studios Inc. (&quot;we,&quot; &quot;us,&quot; or &quot;the Studio&quot;) is a design studio incorporated in Ontario, Canada. We operate the website studios.houseofsingh.com. Our designated privacy contact is Maninder Singh, Founder, reachable at studio@houseofsingh.com.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>2. What personal information we collect</h2>
          <p style={{ margin: "0 0 12px" }}>
            We may collect the following types of personal information:
          </p>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>Information you provide directly:</strong> name, email address, phone number, company name, project details, service interest, and budget range when you submit our contact form, book a discovery call, or subscribe to our communications.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>Information collected automatically:</strong> IP address, browser type, device information, pages visited, time spent on pages, referring URL, and general geographic location through analytics tools and server logs.
          </p>
          <p style={{ margin: "0 0 32px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>Cookies and similar technologies:</strong> we use cookies and similar tracking technologies to understand how visitors interact with our website. You can control cookie preferences through your browser settings.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>3. How we use your information</h2>
          <p style={{ margin: "0 0 12px" }}>
            We use personal information for the following purposes:
          </p>
          <p style={{ margin: "0 0 12px" }}>
            To respond to inquiries submitted through our contact form. To schedule and conduct discovery calls. To send project proposals and communications related to our services. To send occasional updates about our studio, if you have opted in to receive them. To improve our website, content, and services through analytics. To comply with legal obligations.
          </p>
          <p style={{ margin: "0 0 32px" }}>
            We will not use your personal information for purposes other than those identified at or before the time of collection without obtaining your consent.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>4. Third-party services</h2>
          <p style={{ margin: "0 0 12px" }}>
            We use the following third-party services to operate our studio. Each processes limited personal information as described:
          </p>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>Vercel</strong> (website hosting and analytics) — collects anonymized usage data including page views and performance metrics. Data is processed in accordance with Vercel&apos;s privacy policy.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>Airtable</strong> (client relationship management) — stores contact form submissions including name, email, service interest, and project details for lead management.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>n8n</strong> (workflow automation) — processes form submissions to route inquiries and send email notifications. Data passes through n8n workflows but is not stored long-term.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>Cal.com</strong> (scheduling) — collects name and email address when you book a discovery call through our embedded booking system.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>Sanity</strong> (content management) — manages website content. Does not collect visitor personal information.
          </p>
          <p style={{ margin: "0 0 32px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>Anthropic Claude API</strong> (AI processing) — may be used to assist with lead classification and proposal preparation. Any personal information processed is limited to information you have already provided through our contact form and is not used to train AI models.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>5. Consent</h2>
          <p style={{ margin: "0 0 32px" }}>
            We obtain your consent before collecting, using, or disclosing your personal information. By submitting the contact form or booking a call, you consent to the collection and use of your information as described in this policy. For marketing communications, we will obtain your explicit opt-in consent. You may withdraw your consent at any time by contacting us at studio@houseofsingh.com.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>6. Data retention</h2>
          <p style={{ margin: "0 0 32px" }}>
            We retain personal information only as long as necessary to fulfill the purposes for which it was collected, or as required by law. Contact form submissions are retained for the duration of the business relationship and for a reasonable period afterward. Analytics data is retained in anonymized form. You may request deletion of your personal information at any time.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>7. Data security</h2>
          <p style={{ margin: "0 0 32px" }}>
            We protect personal information with security safeguards appropriate to the sensitivity of the information. Our website uses HTTPS encryption. Access to personal information is limited to authorized personnel. Third-party services are selected based on their security practices and compliance standards. However, no method of transmission over the Internet is completely secure, and we cannot guarantee absolute security.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>8. Your rights under PIPEDA</h2>
          <p style={{ margin: "0 0 12px" }}>
            Under Canada&apos;s Personal Information Protection and Electronic Documents Act (PIPEDA), you have the right to:
          </p>
          <p style={{ margin: "0 0 12px" }}>
            Request access to the personal information we hold about you. Request correction of inaccurate or incomplete information. Withdraw your consent to the collection, use, or disclosure of your information. Request deletion of your personal information, subject to legal and contractual obligations. File a complaint with the Office of the Privacy Commissioner of Canada if you believe your privacy rights have been violated.
          </p>
          <p style={{ margin: "0 0 32px" }}>
            To exercise any of these rights, contact us at studio@houseofsingh.com. We will respond to requests within 30 days.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>9. International transfers</h2>
          <p style={{ margin: "0 0 32px" }}>
            Some of our third-party service providers may store or process data outside of Canada, including in the United States. When personal information is transferred outside Canada, it may be subject to the laws of those jurisdictions. We take reasonable steps to ensure that third-party providers maintain comparable levels of protection for your personal information.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>10. Changes to this policy</h2>
          <p style={{ margin: "0 0 32px" }}>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically. Continued use of our website after changes constitutes acceptance of the updated policy.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>11. Contact us</h2>
          <p style={{ margin: "0 0 0" }}>
            For privacy-related questions, requests, or complaints, contact our designated privacy officer: Maninder Singh, Founder and Creative Director, House of Singh Studios Inc., Toronto, Ontario, Canada. Email: studio@houseofsingh.com.
          </p>

        </div>
      </div>
    </section>
  );
}
