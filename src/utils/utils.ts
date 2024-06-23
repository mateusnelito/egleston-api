// Formate date to yyyy-mm-dd
export function formatDate(date: Date): String {
  return date.toISOString().slice(0, 10);
}
