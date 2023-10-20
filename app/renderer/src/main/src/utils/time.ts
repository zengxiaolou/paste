export const formatDateTime = (input: Date | string): string => {
  const newDate = typeof input === 'string' ? new Date(input) : input;
  const inputDate = formatDateTimeInUserTimezone(newDate);
  const today = new Date();
  const sameYear = inputDate.getFullYear() === today.getFullYear();
  const sameMonth = inputDate.getMonth() === today.getMonth();
  const sameDay = inputDate.getDate() === today.getDate();

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, '0');
  const day = String(inputDate.getDate()).padStart(2, '0');
  const hours = String(inputDate.getHours()).padStart(2, '0');
  const minutes = String(inputDate.getMinutes()).padStart(2, '0');
  const seconds = String(inputDate.getSeconds()).padStart(2, '0');

  if (sameYear && sameMonth && sameDay) {
    return `${hours}:${minutes}:${seconds}`;
  } else {
    return `${year}-${month}-${day}`;
  }
};

const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

const formatDateTimeInUserTimezone = (date: Date): Date => {
  const userTimeZone = getUserTimezone();
  const dateString = date.toLocaleString('en-US', { timeZone: userTimeZone });
  return new Date(dateString);
};
