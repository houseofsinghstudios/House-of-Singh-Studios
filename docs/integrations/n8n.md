# Forms to n8n: the contracts

How every form and tool on the site reaches n8n, what each request carries, and what each n8n workflow
does with it. The website side is read from the code (src/app/api/*/route.ts and src/lib); the n8n side
from the workflow definitions, read only, on 31 Oct 2026. If either side changes, update this file in
the same change.

Never put a secret value, a webhook URL or a webhook path in this file, in code comments or in logs.

## Shared by every route

- **Delivery:** every call goes through `postToN8n` in src/lib/n8n.ts: a JSON POST with a 10 second timeout.
- **Authentication:** every request carries the shared secret in the `x-hos-webhook-secret` header. On the
  website the value comes from the `N8N_WEBHOOK_SECRET` environment variable. In n8n, each of the five
  webhooks checks the header with n8n's built in Header Auth, using one credential, "HoS Website Secret";
  a request without the right value is refused by n8n (403) before any node runs. Fail closed: if the
  webhook variable or the secret is missing, the website sends nothing and answers 500.
- **Request size:** 64 KB at most (src/lib/request-body.ts); a larger body is refused before parsing.
- **Text cleaning:** text fields are cut to their limit, stripped of HTML tags and trimmed before checking
  (src/lib/form-input.ts, src/lib/lead.ts). A limit below is the maximum length in characters after cleaning.
- **Honeypot:** each form has a hidden field only bots fill in. When it is filled, the route answers
  200 and sends nothing.
- **Rate limit:** per IP address, per serverless instance (src/lib/rate-limit.ts): 5 a minute for lead,
  careers and subscribe; 20 a minute for brand-pulse and project-planner, whose visits send several events.
- **Logs** carry the route prefix ("[lead]") and the outcome only: never the request body, a visitor's
  details, the webhook address or n8n's response body.
- **Waiting for n8n:** n8n answers only after its last node has run (no workflow uses a Respond to
  Webhook node), so a 2xx means the record was saved and the emails were sent.

| Website answer | When |
|---|---|
| 200 `{ success: true }` | n8n accepted it, or the honeypot was filled |
| 400 | not JSON, not an object, or a field failed its check (the error names the field) |
| 413 | body over 64 KB |
| 415 | /api/lead only: not a JSON request (a form posted before the page's JavaScript loaded); answers a short HTML page |
| 429 | over the rate limit |
| 500 | webhook variable or secret missing, or an unexpected error |
| 502 | n8n answered with a non 2xx status |
| 504 | n8n did not answer within 10 seconds |

Shared field formats:

- `submissionId`: 32 lowercase hexadecimal characters, made by the form and the same on every retry
  of one submission (src/lib/submission-id.ts). Optional: anything else is dropped.
- `attribution` (campaign): `source`, `medium`, `campaign` (the utm tags of the tool's own address,
  otherwise the first tagged page of the visit), and `referralCode` (a partner's `?ref=` code,
  lowercased, 2 to 40 letters or digits, otherwise ""). See src/lib/campaign.ts.
- `leadSource` (how the visit began, src/lib/lead-source.ts), sent only with a form that carries the
  visitor's details: `landing_page` (path on this site, no query, up to 200), `referrer` (the
  referring site's domain only), `utm_source`, `utm_medium`, `utm_campaign` (up to 100 each; anything
  with "@" is dropped). Empty fields are left out.
- `referrer` inside a tool's `attribution`: origin and path only, no query string or fragment, up to 300
  characters (src/lib/referrer.ts).

## /api/lead: contact form, introductions, partner applications, nominations

- **Variable:** `N8N_WEBHOOK_URL`.
- **Workflow:** Lead Capture (`xkTsgUansGhtaymC`).

| Field | Type | Limit and rule |
|---|---|---|
| name | string | 1 to 120, required |
| email | string | valid address, up to 254, required |
| service | string | up to 80; the chosen option, such as "Introducing a client", "Becoming a partner", "Commons nomination (pro bono)" or "Parallel suggestion" |
| budget | string | up to 80, optional |
| message | string | up to 5,000; required except for introductions and partner applications |
| introduction | object | only when service is "Introducing a client": `clientName` (160), `clientContact` (160), `permission` (boolean, must be true) |
| partnership | object | only when service is "Becoming a partner": `businessName` (160), `partnerType` (80), `website` (300) |
| hearAbout | string | up to 60, optional |
| recommendedBy | string | up to 160, optional |
| attribution | object | campaign tags and referral code, see above |
| leadSource | object | how the visit began, see above; optional |
| source | string | always "contact-form" |
| submissionId | string | see above; optional |
| submittedAt | string | ISO date and time |

- **Duplicates:** the workflow keeps the last 500 `submissionId`s; a repeat is skipped (nothing saved,
  nothing emailed) and still answered 200.
- **With `partnership`:** creates a row in **Partners** (Status "Applied"). Emails the partners inbox
  ("Partner application: …") and sends the applicant a confirmation. No Leads row.
- **Otherwise:** creates a row in **Leads**. The Pipeline Stage is:
  - "Nomination" for the Commons and Parallel services;
  - "Qualification" for introductions;
  - "Inquiry" for everything else.

  It emails the studio inbox ("New Lead: …" or "Introduction: …") and, for an introduction, thanks
  the person who made it.
- **Airtable:** base Design Studio CRM. Emails go through the studio's SMTP account.

## /api/careers: job applications

- **Variable:** `N8N_CAREERS_WEBHOOK_URL`.
- **Workflow:** Careers Applications (`NCt9L7eEiMHCHt9N`).

| Field | Type | Limit and rule |
|---|---|---|
| name | string | up to 120, required |
| email | string | valid address, up to 254, required |
| role | string | up to 120, required |
| portfolioUrl | string | up to 500, optional |
| message | string | up to 5,000, optional |
| source | string | always "careers-page" |
| submissionId | string | see above; optional |
| submittedAt | string | ISO date and time |

- **Duplicates:** same as Lead Capture, the last 500 `submissionId`s; a repeat is skipped.
- **Writes:** a row in **Applicants** (Status "New").
- **Emails:**
  - the careers inbox ("New application: …", replies go to the applicant);
  - a confirmation to the applicant.

## /api/subscribe: newsletter

- **Variable:** `N8N_SUBSCRIBE_WEBHOOK_URL`.
- **Workflow:** Newsletter Subscribe (`MUr8r3GzCoXsycFE`).

| Field | Type | Limit and rule |
|---|---|---|
| email | string | valid address, up to 254, required |
| source | string | "footer-subscribe", "article" or "brand-pulse"; anything else becomes "footer-subscribe" |
| submissionId | string | sent when present; the workflow does not use it |
| subscribedAt | string | ISO date and time |

- **Duplicates:** one row per email. The workflow lowercases the address and upserts into
  **Subscribers**, matched on Email (Status "Subscribed").
- **Emails:** none.

## /api/brand-pulse: Brand Pulse events

- **Variable:** `N8N_BRAND_PULSE_WEBHOOK_URL`.
- **Workflow:** Brand Pulse (`mg2bNx8TD3AQKOZu`).
- **Events:**

  | Event | Carries the visitor's details | Sent when |
  |---|---|---|
  | `completed` | no | the visitor finishes the questions and gets a result |
  | `feedback` | no | the visitor rates the result |
  | `lead` | yes | the result is asked for by email |
  | `profile` | yes | the studio view details are sent |

The result is always recomputed on the server; whatever result the browser sends is ignored.

| Field | Type | Limit and rule |
|---|---|---|
| event | string | one of the four above |
| resultId | string | UUID, the same for every event of one visit; required |
| engineVersion | string | the scoring rules' version |
| gate | string | "none", "before-full-result" or "before-questions" |
| submittedAt | string | ISO date and time |
| answers | object | the seven answers (industry, updated, weakest, consistent, handover, clarity, ahead), each a known option |
| answerLabels | object | the answers as readable text |
| result | object | pulse, profile, headline, vital signs, total, paragraphs, actions, services, share and booking links |
| contact | object | `lead`: `email` (254), `retakeReminder`, `marketingConsent` (booleans). `profile`: `email`, `name` (100), `company` (120), `website` (200, normalised to https), `teamSize` ("1-10", "11-50", "51-200", "over-200" or "") |
| feedback | string | `feedback` only: "yes", "partly" or "not-really" |
| leadSource | object | with `lead` and `profile` only; how the visit began, see above |
| attribution | object | `source`, `medium`, `campaign` (200 each), `referralCode`, `landingPage` (the tool page's path, 500), `referrer` (origin and path, see above), `entryPlacement` ("home_band_chip", "home_band_button" or "direct") |

- **Duplicates:** every event upserts one row in **Brand Pulse Results**, matched on **Result ID**.
- **What each event does:**
  - **`completed`:** Status "Completed". No email.
  - **`feedback`:** saves the Feedback field. No email.
  - **`lead`:** Status "Lead", the email, a retake reminder date six months out, and consent.
    - With marketing consent, it also upserts into Subscribers (Source "brand-pulse").
    - Emails the visitor their result and alerts the studio inbox.
  - **`profile`:** saves name, company, website and team size, and alerts the studio inbox.

## /api/project-planner: Project Planner events

- **Variable:** `N8N_PROJECT_PLANNER_WEBHOOK_URL`.
- **Workflow:** Project Planner (`I1Af3BQcz2AqiogX`).
- **Events:**

  | Event | Status rank | Carries the visitor's details | Sent when |
  |---|---|---|---|
  | `started` | 1 | no | a brief is begun (from the intro, or a link that skips it) |
  | `viewed` | 2 | no | the brief is shown |
  | `call_clicked` | none | no | the booking link is clicked; an intention, never a booked call |
  | `sent` | 3 | yes | the brief is sent with contact details |

The brief and prices are always recomputed on the server with its own published prices; whatever the
browser sends is ignored. A hidden price is sent as null.

| Field | Type | Limit and rule |
|---|---|---|
| event | string | one of the four above |
| briefId | string | UUID, lowercased, the same for every event of one brief; required |
| eventIdempotencyKey | string | `<briefId>:<event>` |
| statusRank | number or null | 1, 2, 3, or null for `call_clicked` |
| engineVersion | string | the brief rules' version |
| priceSource | string or null | where the prices came from; null for `started` and `call_clicked` |
| submittedAt | string | ISO date and time |
| attribution | object | `source`, `medium`, `campaign` (100 each), `referralCode`, `landingPage` (path, no query, 200), `entryPlacement` ("services", "case_study", "brand_pulse", "contact", "home_band_chip", "home_band_button" or "direct"), `referrer` (origin and path, see above) |
| answers, brief | object | `viewed` and `sent`: the validated answers and the recomputed brief (services, phases, price lines, fit note, actions, booking link) |
| answerLabels | object | `sent` only |
| optional | object | `sent` only: `investment` (a known band or null), `website` (200), `importantDate` (60) |
| contact | object | `sent` only: `name` (100, required), `email` (254, required), `company` (120), `location` (120), `note` (500), `marketingConsent` (boolean) |
| hearAbout, recommendedBy | string | `sent` only; 60 and 160 |
| leadSource | object | `sent` only, when known; how the visit began |

- **Duplicates:**
  - On the website, an instance does not resend an event it has already delivered (same
    `briefId:event`).
  - In n8n, every event upserts one row in **Project Briefs**, matched on **Brief ID**, filling that
    event's timestamp. The workflow does not read `eventIdempotencyKey`.
- **On `sent` it also:**
  - upserts the lead into **Leads**, matched on Brief ID (Pipeline Stage "Inquiry", Lead Source
    "Project Planner");
  - upserts into Subscribers when consent is given;
  - emails the visitor their brief and alerts the studio inbox.

## Scheduled workflows (they read Airtable, not the website)

- **48hr Follow Up** (`PyiiQc8KbOkOlaEY`): daily at 09:00 Toronto time.
  - Reads Leads with Pipeline Stage "Inquiry", an email, and at least 48 hours since creation.
    Nominations (stage "Nomination") and introductions ("Qualification") are skipped. Project Planner
    leads are included.
  - Emails each lead an invitation to a discovery call, then sets the stage to "Contacted".
- **Partner Welcome** (`pTUDD5ULXtSGQvmJ`): every 15 minutes.
  - Reads Partners with Status "Approved", a referral code, an email, and Welcome Sent not ticked.
  - Emails the welcome with the partner's referral link and terms, then ticks Welcome Sent and sets
    Approved On.

## Known gaps (from the workflow definitions, 31 Oct 2026)

- **Errors after a save:** a failed studio alert email makes the website show an error although the
  row was already saved (Lead Capture, Careers, Brand Pulse, Project Planner). A retry of a lead or an
  application is skipped by its `submissionId`.
- **Repeated emails:** Brand Pulse and Project Planner have no repeat guard for their emails. A
  repeated `lead`, `profile` or `sent` event emails again; the Airtable row is only updated.
- **Subscriber case:** Brand Pulse and Project Planner store subscriber emails without lowercasing
  them; Newsletter Subscribe lowercases. The same address in different capitals can become two rows.
- **Leads choice lists:** "Nomination", "Partnership" and "Project Planner" rely on Airtable's typecast
  setting to exist as Leads options.
- **48hr Follow Up failures:** if one send fails mid run, the leads already emailed in that run are
  not marked "Contacted" and are emailed again the next day.

## Changing a form safely

1. **Change both sides together.** Add or rename a field in the route and in the n8n workflow (and its
   Airtable column) in the same change. Never rename a field n8n reads without updating the workflow first.
2. **Keep the limits matched.** A new text field gets a limit in the route and the same limit in the form.
   Clean it with the shared helpers (src/lib/form-input.ts).
3. **Protect against repeats.**
   - A form that saves a visitor's details sends `submissionId`, and its workflow skips repeats.
   - A tool event carries its `resultId` or `briefId` and the workflow upserts on it.
4. **Keep the protections.** The honeypot, the rate limiter, the 64 KB cap, the 10 second timeout,
   the secret header and the partner permission checkbox are protected (CLAUDE.md).
5. **Log only the outcome.** Logs never carry personal details, the webhook URL or n8n's response.
6. **Test with a stand in.** Add route tests with a stubbed n8n (as in tests/careers-subscribe-routes.test.ts).
   Never send a test request to the real n8n webhooks.
7. **Check privacy and analytics.** If the change sends something new about the visitor, update the
   privacy page (with the owner's approval) and the analytics notes in docs/analytics/.
8. **Update this file.**
