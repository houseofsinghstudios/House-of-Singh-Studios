# GA4 debug checklist

Use this to confirm every Google Analytics event on the live site, in GA4 DebugView and Realtime.
About 20 minutes. Property 278883342, measurement ID G-DKQYLQ90EK.

## Before you start

- [ ] GA4, Admin, Data streams, the web stream, Enhanced measurement, Page views, advanced settings: "Page changes based on browser history events" is **off**. The site sends its own page views; with this on, each one counts twice.
- [ ] Every form you submit below reaches n8n and the studio's inbox for real. Use obviously fake details (name "GA Test", an address you control) and delete the test entries afterwards. Unsubscribe the newsletter test address.
- [ ] Use a browser where analytics are allowed. In a stricter consent region (EU, UK, Switzerland, Quebec) turn them on first: footer, Privacy choices, Turn on. Without consent nothing is sent, by design.
- [ ] If the "Internal Traffic" data filter is **Active**, events from an internal browser are dropped and will not show. For this test, open the site once with `?hos_internal=0`, then set it back with `?hos_internal=1` when you are done.

## Turn on debug mode

1. Open `https://studios.houseofsingh.com/?hos_debug=1`. Debug mode lasts for this tab's session only, on every page you open in it. Closing the tab ends it; `?hos_debug=0` ends it sooner.
2. In GA4, open Admin, DebugView. Your device appears within a minute. Keep Realtime open in a second tab.

## Submit each form once

For each row: do the action once, then find the event in DebugView, open it, and check its parameters. A row passes when the event appears **exactly once** with the parameters listed and no name, email, phone number or message in any parameter.

| # | Where and what | Event | Parameters to check |
|---|---|---|---|
| 1 | Any page, then click to another | `page_view` | `page_location`, `page_title` and `content_group` match the page you are on (for example `services` on /services/brand-identity) |
| 2 | /contact, service Brand Identity, send | `generate_lead` | `lead_type` contact, `service` Brand Identity, `has_referral` false |
| 3 | /contact?ref=gatest, any service, send | `generate_lead` | `has_referral` true |
| 4 | /contact?service=introduction, send | `generate_lead` | `lead_type` partner_introduction, no `service` |
| 5 | /contact?service=partnership, send | `partner_application` | none |
| 6 | /contact, Commons nomination, send | `commons_nomination` | none |
| 7 | /contact, Parallel suggestion, send | `parallel_suggestion` | none |
| 8 | /start, finish a brief, Send My Brief | `generate_lead` | `lead_type` project_planner, `service` the planner code (for example identity) |
| 9 | /brand-pulse, answer to the result | `brand_pulse_complete` | none |
| 10 | /careers, apply | `job_application` | none |
| 11 | An article, newsletter signup | `newsletter_signup` | none |
| 12 | Any "Book a Discovery Call" link | `discovery_call_click` | `page_path` the page you clicked on |
| 13 | Homepage, "Two ways to start", a chip | `tool_band_click` | `tool`, `kind` chip, `value` the answer or service |
| 14 | /partners, a call to action; then Copy Text | `partner_cta_click`, `partner_copy_intro` | `action` and `location` on the first |

## Check it never fires twice

- [ ] After any success message, reload the page: no second event.
- [ ] Go to another page and press Back, then Forward: no second event.
- [ ] Double click a submit button: one event, and the form sends once.

## Realtime

- [ ] Realtime, Event count by event name: each event above shows a count of 1 for your test.
- [ ] Realtime, Views by page title: your pages appear under their own titles, not the page you landed on.

## Afterwards

- [ ] Open `?hos_debug=0` (or close the tab).
- [ ] If you cleared the internal flag, open `?hos_internal=1` again.
- [ ] Delete the test entries in n8n and the inbox, and unsubscribe the test address.

Debug sessions are counted in reports like any visit. To keep them out, add a "Developer traffic" data filter in GA4 (Admin, Data filters) and set it to Active; DebugView still shows them.
