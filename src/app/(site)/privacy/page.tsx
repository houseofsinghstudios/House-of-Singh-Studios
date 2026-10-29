import { Metadata } from "next";
import { DEFAULT_SHARE_IMAGE } from "@/lib/seo";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { STUDIO_EMAIL } from "@/lib/constants/contact";

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How House of Singh Studios Inc. collects, uses and protects personal information: enquiries, analytics, the services we use and your choices.',
  alternates: { canonical: 'https://studios.houseofsingh.com/privacy' },
  openGraph: {
    title: 'Privacy Policy — House of Singh Studios',
    description: 'How House of Singh Studios Inc. collects, uses and protects personal information: enquiries, analytics, the services we use and your choices.',
    url: 'https://studios.houseofsingh.com/privacy',
    images: [DEFAULT_SHARE_IMAGE],
  },
};

export default function PrivacyPage() {
  return (
    <>
    <BreadcrumbSchema items={[
      { name: 'Home', url: 'https://studios.houseofsingh.com' },
      { name: 'Privacy Policy', url: 'https://studios.houseofsingh.com/privacy' },
    ]} />
    <section className="legal-page" style={{ padding: "var(--hero-pt) var(--page-px) clamp(80px, 10vw, 120px)" }}>
      <div className="legal-content">
        <p className="editorial-label-static" style={{ marginBottom: 24, fontFamily: "var(--sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)" }}>
          Legal
        </p>
        <h1 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(32px, 4vw, 48px)", letterSpacing: "-0.025em", lineHeight: 1.1, color: "var(--text-primary)", margin: "0 0 16px" }}>
          Privacy Policy
        </h1>
        <p className="legal-updated" style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--text-muted)", marginBottom: "clamp(40px, 5vw, 64px)" }}>
          Last updated: October 29, 2026
        </p>

        <div className="legal-body" style={{ fontFamily: "var(--sans)", fontSize: "clamp(15px, 1.1vw, 16px)", lineHeight: 1.75, color: "var(--text-secondary)", maxWidth: 680 }}>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>1. Who we are</h2>
          <p style={{ margin: "0 0 32px" }}>
            House of Singh Studios Inc. (&quot;we,&quot; &quot;us,&quot; or &quot;the Studio&quot;) is a design studio incorporated in Ontario, Canada. We operate the website studios.houseofsingh.com. Our designated privacy contact is Maninder Singh, Founder, reachable at {STUDIO_EMAIL}.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>2. What personal information we collect</h2>
          <p style={{ margin: "0 0 12px" }}>
            We may collect the following types of personal information:
          </p>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>Information you provide directly:</strong> name, email address, phone number, company name, project details, service interest, and budget range when you submit our contact form, book a discovery call, or subscribe to our communications. If you introduce a client to us as a partner, we also receive the name and contact details you give us for that client, which you confirm you have their permission to share.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>How your visit began, sent with an enquiry:</strong> when you send us a form (the contact form, the Project Planner, a partner introduction or application, or ask for your Brand Pulse result by email), we also receive how your visit to our website began. That means the first page you opened, the website that sent you (its domain only, such as google.com), and any campaign tags in that first link. Your browser keeps this for the current tab only, and it is never sent unless you submit a form.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>Information collected automatically, when analytics are allowed:</strong> browser type, device information, pages visited, time spent on pages, the website that referred you, and general geographic location, through Google Analytics and Microsoft Clarity. We also record a few actions that matter to us: sending an enquiry or a brief, completing Brand Pulse, applying for a role, subscribing, clicking a link to book a call, and choices in the tools on our homepage. These record the kind of action (for example, which service you chose) and the page it happened on, never your name, email address, phone number or message. Our hosting provider&apos;s server logs also record IP addresses for security and to limit abuse of our forms.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            Brand Pulse answers are kept anonymously to improve the check. Contact details are only stored if you choose to share them.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            When you complete the Project Planner, we keep your project selections without your name or contact details, to understand what visitors need. Contact details are stored only if you choose to send your brief.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>Cookies and similar technologies:</strong> Google Analytics and Microsoft Clarity set their cookies only once analytics are allowed, and turning analytics off removes them. Our website also keeps a few small items in your browser: your analytics choice, for 12 months; and, for the current tab only, cleared when you close it, how your visit began (see above), any campaign tags, and a note of forms already counted, so a reload never counts one twice. Our own team&apos;s browsers also carry a marker that keeps our visits out of our statistics, and a temporary marker used to test our measurement. You can also clear or block cookies and stored items in your browser settings.
          </p>
          <p style={{ margin: "0 0 32px" }}>
            You can change your analytics choice at any time using Privacy choices at the bottom of every page. Advertising cookies are never used.
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

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>4. Third party services</h2>
          <p style={{ margin: "0 0 12px" }}>
            We use the following third party services to operate our studio. Each processes limited personal information as described:
          </p>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>Vercel</strong> (website hosting): hosts our website and measures how quickly its pages load (Speed Insights), without cookies. Its server logs record IP addresses for security. Data is processed in accordance with Vercel&apos;s privacy policy.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>Google Analytics</strong> (website analytics): measures how visitors use our website, such as pages viewed, the actions listed above and approximate location. It sends nothing until analytics are allowed: visitors in regions with stricter consent rules are not measured unless they turn analytics on in Privacy choices, and turning them off stops it. We do not use it for advertising, Google signals are off, and we never send it names, email addresses, phone numbers or messages. Detailed Google Analytics data is kept for 14 months, then deleted; summary reports without individual data may be kept longer.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>Microsoft Clarity</strong> (website behaviour analytics): records anonymized page interactions such as clicks and scrolling to help us improve the site. Form fields are masked, so recordings never show what you type. We do not use it for advertising. Like Google Analytics, it sends nothing until analytics are allowed: visitors in regions with stricter consent rules are not recorded unless they turn analytics on in Privacy choices, and turning them off stops it and removes its cookies.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>Airtable</strong> (client relationship management): stores what you send us through our website: enquiries, partner introductions and applications, and nominations (your name, email address, the details you give us and how your visit to our website began); Project Planner briefs (your selections, with your contact details only if you send your brief); Brand Pulse results (your answers, with your email address and details only if you share them); job applications; and newsletter signups. We use it to reply to you and to manage our work with you.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>n8n</strong> (workflow automation): processes form submissions, including how your visit began, to route enquiries and send email notifications. Data passes through n8n workflows but is not stored long term.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>Zoho Mail</strong> (email): hosts our studio email addresses and sends the emails our website triggers: your Brand Pulse result or Project Planner brief when you ask for it, confirmations of applications and introductions, a follow up after an enquiry, and notifications to our team. It processes your name, email address and the content of those emails.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>Cal.com</strong> (scheduling): when you book a discovery call, our booking links open Cal.com in a new tab, where you give your name and email address. If you book from your Brand Pulse result or Project Planner brief, the link also carries a short summary of your result or brief so we can prepare for the call; it never includes your name or email address.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>Sanity</strong> (content management): manages our website content and delivers its images. Like any web server, its image service receives your IP address in order to send them; we do not send it any other information about you.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>Anthropic Claude</strong> (AI assistance): our team may use it to help draft proposals and content, which can include details from your enquiry. Anthropic does not use this information to train its models. Our website and its forms send nothing to it automatically.
          </p>
          <p style={{ margin: "0 0 32px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>LinkedIn API</strong> (social media publishing): used to publish studio content (articles, project announcements, and thought leadership posts) to our official LinkedIn company page. The integration authenticates via OAuth 2.0 using a studio admin account. No client personal information is shared with LinkedIn through this integration. Published content may reference public project outcomes but never identifies clients without prior written consent.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>5. Consent</h2>
          <p style={{ margin: "0 0 32px" }}>
            We obtain your consent before collecting, using, or disclosing your personal information. By submitting the contact form or booking a call, you consent to the collection and use of your information as described in this policy. For marketing communications, we will obtain your explicit opt in consent. You may withdraw your consent at any time by contacting us at {STUDIO_EMAIL}.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>6. Data retention</h2>
          <p style={{ margin: "0 0 32px" }}>
            We retain personal information only as long as necessary to fulfill the purposes for which it was collected, or as required by law. Contact form submissions are retained for the duration of the business relationship and for a reasonable period afterward, up to a maximum of seven years from last contact unless a longer period is required by law. Detailed Google Analytics data is kept for 14 months, then deleted; summary reports without individual data may be kept longer. Microsoft Clarity keeps session recordings for 30 days, except a small sample and any recordings we save, which it keeps for up to 13 months. Heatmaps and click data are kept for 13 months. Items our website keeps in your browser for the current tab are cleared when you close it; your analytics choice lasts 12 months. You may request deletion of your personal information at any time.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>7. Data security</h2>
          <p style={{ margin: "0 0 32px" }}>
            We protect personal information with security safeguards appropriate to the sensitivity of the information. Our website uses HTTPS encryption. Access to personal information is limited to authorized personnel. Third party services are selected based on their security practices and compliance standards. However, no method of transmission over the Internet is completely secure, and we cannot guarantee absolute security.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>8. Your rights under PIPEDA</h2>
          <p style={{ margin: "0 0 12px" }}>
            Under Canada&apos;s Personal Information Protection and Electronic Documents Act (PIPEDA), you have the right to:
          </p>
          <p style={{ margin: "0 0 12px" }}>
            Request access to the personal information we hold about you. Request correction of inaccurate or incomplete information. Withdraw your consent to the collection, use, or disclosure of your information. Request deletion of your personal information, subject to legal and contractual obligations. File a complaint with the Office of the Privacy Commissioner of Canada if you believe your privacy rights have been violated.
          </p>
          <p style={{ margin: "0 0 32px" }}>
            To exercise any of these rights, contact us at {STUDIO_EMAIL}. We will respond to requests within 30 days. Deletion requests will be actioned within 30 days of verification of the requester&apos;s identity.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>9. International transfers</h2>
          <p style={{ margin: "0 0 32px" }}>
            Some of our third party service providers may store or process data outside of Canada, including in the United States. When personal information is transferred outside Canada, it may be subject to the laws of those jurisdictions. We take reasonable steps to ensure that third party providers maintain comparable levels of protection for your personal information.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>10. Changes to this policy</h2>
          <p style={{ margin: "0 0 32px" }}>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically. Continued use of our website after changes constitutes acceptance of the updated policy.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>11. Automated content publishing</h2>
          <p style={{ margin: "0 0 12px" }}>
            We use automated workflows to publish content to third party social media platforms on behalf of House of Singh Studios. This content includes articles, project announcements, and thought leadership posts authored or approved by studio personnel.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            Automated publishing is performed through authenticated API integrations using OAuth 2.0 credentials tied to studio admin accounts. No client personal information is included in automated posts unless the client has provided prior written consent for public attribution.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            Published content may reference publicly available project outcomes, industry trends, or general studio capabilities. We do not use automated systems to send direct messages, connection requests, or any form of unsolicited outreach on social media platforms.
          </p>
          <p style={{ margin: "0 0 32px" }}>
            All automated publishing workflows are reviewed by studio personnel before activation. Content queues are auditable and can be paused or revoked at any time.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>12. Third party social media platforms</h2>
          <p style={{ margin: "0 0 12px" }}>
            We maintain official accounts on the following social media platforms. Each platform has its own privacy policy governing how it collects and processes data from users who view or interact with our published content:
          </p>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>LinkedIn</strong>: used for publishing studio articles, project announcements, and professional updates to our company page. Governed by LinkedIn&apos;s Privacy Policy and API Terms of Use. We access LinkedIn through their Marketing API with permissions limited to content publishing on our own page.
          </p>
          <p style={{ margin: "0 0 12px" }}>
            <strong style={{ color: "var(--text-primary)", fontWeight: 500 }}>Instagram</strong>: used for sharing visual work samples, studio culture, and project highlights. Governed by Meta&apos;s Privacy Policy.
          </p>
          <p style={{ margin: "0 0 32px" }}>
            We do not scrape, collect, or store personal information from followers or viewers on any social media platform. Our use of platform APIs is limited to publishing our own content and retrieving basic engagement metrics (such as view counts and like counts) in aggregate form.
          </p>

          <h2 style={{ fontFamily: "var(--sans)", fontWeight: 500, fontSize: "clamp(18px, 1.5vw, 22px)", color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>13. Contact us</h2>
          <p style={{ margin: "0 0 0" }}>
            For privacy related questions, requests, or complaints, contact our designated privacy officer: Maninder Singh, Founder and Creative Director, House of Singh Studios Inc., Toronto, Ontario, Canada. Email: {STUDIO_EMAIL}.
          </p>

        </div>
      </div>
    </section>
    </>
  );
}
