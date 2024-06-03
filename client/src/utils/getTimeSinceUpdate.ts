export const getTimeSinceUpdate = (updatedAtString: string): string => {
  const updatedAt = new Date(updatedAtString);
  const now = new Date();
  const timeDifference = now.getTime() - updatedAt.getTime();
  const millisecondsInSecond = 1000;
  const millisecondsInMinute = 60 * millisecondsInSecond;
  const millisecondsInHour = 60 * millisecondsInMinute;
  const millisecondsInDay = 24 * millisecondsInHour;
  const millisecondsInWeek = 7 * millisecondsInDay;
  const millisecondsInMonth = 30 * millisecondsInDay; // Approximation
  const millisecondsInYear = 365 * millisecondsInDay; // Approximation

  const hoursDiff = Math.floor(timeDifference / millisecondsInHour);
  const daysDiff = Math.floor(timeDifference / millisecondsInDay);
  const weeksDiff = Math.floor(timeDifference / millisecondsInWeek);
  const monthsDiff = Math.floor(timeDifference / millisecondsInMonth);
  const yearsDiff = Math.floor(timeDifference / millisecondsInYear);

  if (hoursDiff < 24) {
    return `${hoursDiff}h`;
  } else if (daysDiff < 7) {
    return `${daysDiff}d`;
  } else if (weeksDiff <= 4) {
    return `${weeksDiff}w`;
  } else if (monthsDiff <= 12) {
    return `${monthsDiff}mth`;
  } else {
    return `${yearsDiff}yr`;
  }
};
