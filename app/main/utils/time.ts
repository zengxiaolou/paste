export const getBeijingDayStartAndEnd = (date: Date) => {
  const dateStart = new Date(date);
  dateStart.setHours(0, 0, 0, 0);
  const utcDateStart = new Date(dateStart.getTime() - 8 * 60 * 60 * 1000);

  const dateEnd = new Date(date);
  dateEnd.setHours(23, 59, 59, 999);
  const utcDateEnd = new Date(dateEnd.getTime() - 8 * 60 * 60 * 1000);

  return {
    start: utcDateStart.toISOString(),
    end: utcDateEnd.toISOString(),
  };
};
