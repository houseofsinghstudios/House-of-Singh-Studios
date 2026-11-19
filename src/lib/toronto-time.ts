// The studio's local time for the phone menu, always Toronto time whatever the visitor's own time
// zone: for example "1:05 AM EST". Split into parts so the colon can be styled on its own.

const FORMAT = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Toronto",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZoneName: "short",
});

export interface TorontoTime {
  hour: string;
  minute: string;
  // "AM" or "PM", then the zone, for example "EST" or "EDT".
  dayPeriod: string;
  zone: string;
}

export function torontoTime(date: Date): TorontoTime {
  const part = (type: Intl.DateTimeFormatPartTypes) => FORMAT.formatToParts(date).find((p) => p.type === type)?.value ?? "";
  return { hour: part("hour"), minute: part("minute"), dayPeriod: part("dayPeriod"), zone: part("timeZoneName") };
}

export const formatTorontoTime = (t: TorontoTime) => `${t.hour}:${t.minute} ${t.dayPeriod} ${t.zone}`;
