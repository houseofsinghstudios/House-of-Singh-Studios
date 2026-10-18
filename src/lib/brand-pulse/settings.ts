// Brand Pulse settings.
import { DISCOVERY_CALL_URL } from "@/lib/constants/booking";
import type { Gate } from "./types";

// When the email is asked for:
//   "none"                Full result, email optional. Default.
//   "before-full-result"  Pulse, profile, headline and vital signs shown; the email unlocks the rest.
//   "before-questions"    Email before question 1.
export const GATE: Gate = "none";

export const SITE_URL = "https://studios.houseofsingh.com";
// The sitewide discovery call link. Brand Pulse adds its notes to it.
export const BOOKING_URL = DISCOVERY_CALL_URL;
