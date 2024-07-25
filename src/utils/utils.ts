import dayjs from 'dayjs';

// Formate date to yyyy-mm-dd
export function formatDate(date: Date): String {
  return date.toISOString().slice(0, 10);
}

export function isDateBeginAfterDateEnd(begin: Date, end: Date): boolean {
  return dayjs(begin).isAfter(dayjs(end));
}
