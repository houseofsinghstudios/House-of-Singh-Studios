// Google Analytics 4. The measurement ID is public by design: it appears in every page that loads the tag.
export const GA_MEASUREMENT_ID = "G-DKQYLQ90EK";

// Regions with stricter consent rules, where analytics are off until the visitor turns them on (Google
// Analytics then sends nothing at all): the EEA (EU members plus Iceland, Liechtenstein and Norway),
// the UK, Switzerland and Quebec.
export const STRICT_CONSENT_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE",
  "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  "IS", "LI", "NO",
  "GB", "CH", "CA-QC",
];
