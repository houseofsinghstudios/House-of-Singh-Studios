// "$4,000": a dollar sign and thousands separators, whole dollars. Same output on server and browser.
export function formatDollars(amount: number): string {
  return `$${Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
