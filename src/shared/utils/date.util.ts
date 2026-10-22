export function formatToIso(date: Date = new Date()): string {
  return date.toISOString();
}

export function isValidDate(dateString: string): boolean {
  const timestamp = Date.parse(dateString);
  return !isNaN(timestamp);
}
