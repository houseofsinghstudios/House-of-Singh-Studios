import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use — House of Singh Studios",
  description: "Terms governing use of the House of Singh Studios website.",
};

export default function TermsPage() {
  return (
    <section className="legal-page" style={{ padding: "var(--hero-pt) var(--page-px) clamp(80px, 10vw, 120px)" }}>
      <div className="legal-content">
        <p style={{ marginBottom: 24, fontFamily: "var(--sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)" }}>
          Legal
        </p>
        <h1 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.025em", lineHeight: 1.1, color: "var(--text-primary)", margin: "0 0 16px" }}>
          Terms of Use
        </h1>
        <p style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--text-muted)", marginBottom: "clamp(40px, 5vw, 64px)" }}>
          Last updated: March 31, 2026
        </p>

        <div style={{ fontFamily: "var(--sans)", fontSize: "clamp(15px, 1.1vw, 16px)", lineHeight: 1.75, color: "var(--text-secondary)", maxWidth: 680 }}>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>1. Agreement to terms</h2>
          <p style={{ margin: "0 0 32px" }}>
            By accessing or using the website at studios.houseofsingh.com (the &quot;Site&quot;), you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, you should not use the Site. These terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>2. About House of Singh Studios</h2>
          <p style={{ margin: "0 0 32px" }}>
            House of Singh Studios Inc. is a design studio incorporated in Ontario, Canada. The Site serves as an informational platform for our design services. It does not facilitate transactions, process payments, or constitute an offer to contract. All project engagements are governed by separate written agreements between the Studio and the client.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>3. Use of the Site</h2>
          <p style={{ margin: "0 0 12px" }}>
            You may use this Site for lawful purposes only. You agree not to:
          </p>
          <p style={{ margin: "0 0 32px" }}>
            Use the Site in any way that violates applicable federal, provincial, or local law. Attempt to gain unauthorized access to any part of the Site, its servers, or any connected systems. Interfere with or disrupt the Site or its infrastructure. Scrape, crawl, or use automated tools to extract content from the Site without written permission. Submit false, misleading, or fraudulent information through any form on the Site. Reproduce, distribute, or publicly display any content from the Site without prior written consent.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>4. Intellectual property</h2>
          <p style={{ margin: "0 0 12px" }}>
            All content on this Site — including but not limited to text, graphics, logos, images, case study materials, design work, photography, and code — is the property of House of Singh Studios Inc. or is used with permission from the respective rights holders. This content is protected under Canadian copyright law and international intellectual property agreements.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            The House of Singh Studios name, logo, crest, and any associated marks are trademarks of House of Singh Studios Inc. You may not use these marks without prior written consent.
          </p>
          <p style={{ margin: "0 0 32px" }}>
            Case studies and portfolio work displayed on this Site may include work created for clients. The intellectual property rights for client work are governed by the respective client agreements. The presentation and description of such work on this Site is for informational and promotional purposes only.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>5. Contact form and communications</h2>
          <p style={{ margin: "0 0 32px" }}>
            When you submit information through our contact form or booking system, you represent that the information provided is accurate and that you have the authority to share it. Submitting a contact form or booking a call does not create a client relationship or contractual obligation. All project engagements require a separate signed agreement.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>6. Email communications</h2>
          <p style={{ margin: "0 0 32px" }}>
            If you subscribe to receive communications from us, you consent to receiving occasional emails about our services, insights, and studio updates. You may unsubscribe at any time by clicking the unsubscribe link in any email or by contacting us at studio@houseofsingh.com. We comply with Canada&apos;s Anti-Spam Legislation (CASL) and will only send commercial electronic messages with your express or implied consent.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>7. Third-party links</h2>
          <p style={{ margin: "0 0 32px" }}>
            The Site may contain links to third-party websites, including social media platforms and scheduling tools. These links are provided for convenience only. We do not control or endorse these third-party sites and are not responsible for their content, privacy practices, or terms of use. Accessing third-party sites is at your own risk.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>8. Disclaimer of warranties</h2>
          <p style={{ margin: "0 0 32px" }}>
            The Site is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, either express or implied. We do not warrant that the Site will be uninterrupted, error-free, or free from viruses or other harmful components. We make no representations about the accuracy, reliability, or completeness of any content on the Site. Portfolio results and case study outcomes are specific to each client engagement and are not guarantees of future results.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>9. Limitation of liability</h2>
          <p style={{ margin: "0 0 32px" }}>
            To the maximum extent permitted by applicable law, House of Singh Studios Inc., its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Site, including but not limited to loss of profits, data, or business opportunities, regardless of the cause of action or theory of liability.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>10. Indemnification</h2>
          <p style={{ margin: "0 0 32px" }}>
            You agree to indemnify and hold harmless House of Singh Studios Inc. from any claims, damages, losses, or expenses (including reasonable legal fees) arising from your use of the Site or your violation of these Terms of Use.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>11. Governing law and jurisdiction</h2>
          <p style={{ margin: "0 0 32px" }}>
            These Terms of Use are governed by and construed in accordance with the laws of the Province of Ontario and the federal laws of Canada applicable therein, without regard to conflict of law principles. Any dispute arising from these terms or your use of the Site shall be subject to the exclusive jurisdiction of the courts of the Province of Ontario.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>12. Changes to these terms</h2>
          <p style={{ margin: "0 0 32px" }}>
            We reserve the right to modify these Terms of Use at any time. Changes will be posted on this page with an updated revision date. Your continued use of the Site after any changes constitutes acceptance of the revised terms.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>13. Contact</h2>
          <p style={{ margin: "0 0 0" }}>
            For questions about these Terms of Use, contact: House of Singh Studios Inc., Toronto, Ontario, Canada. Email: studio@houseofsingh.com.
          </p>

        </div>
      </div>
    </section>
  );
}
