export const formatDateTime = (input: Date | string | number): string => {
  let newDate: Date;
  if (typeof input === 'number') {
    newDate = new Date(input);
  } else {
    newDate = typeof input === 'string' ? new Date(input) : input;
  }

  const inputDate = formatDateTimeInUserTimezone(newDate);
  const today = new Date();
  const sameYear = inputDate.getFullYear() === today.getFullYear();
  const sameMonth = inputDate.getMonth() === today.getMonth();
  const sameDay = inputDate.getDate() === today.getDate();

  const month = String(inputDate.getMonth() + 1).padStart(2, '0');
  const day = String(inputDate.getDate()).padStart(2, '0');
  const hours = String(inputDate.getHours()).padStart(2, '0');
  const minutes = String(inputDate.getMinutes()).padStart(2, '0');

  if (sameYear && sameMonth && sameDay) {
    return `${hours}:${minutes}`;
  } else {
    return `${month}-${day}`;
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

export const isVersionLessThan = (currentVersion: string, releaseVersion: string): boolean =>  {
  const parseVersion = (version: string) => version.split('.').map(Number);

  const [currentMajor, currentMinor, currentPatch] = parseVersion(currentVersion);
  const [releaseMajor, releaseMinor, releasePatch] = parseVersion(releaseVersion);

  if (currentMajor < releaseMajor) return true;
  if (currentMajor > releaseMajor) return false;

  if (currentMinor < releaseMinor) return true;
  if (currentMinor > releaseMinor) return false;

  return currentPatch < releasePatch;
}
