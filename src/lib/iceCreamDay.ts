// National Ice Cream Day is the third Sunday of July, computed per-year.
export function isNationalIceCreamDay(date: Date = new Date()): boolean {
  const july1 = new Date(date.getFullYear(), 6, 1);
  const firstSunday = 1 + ((7 - july1.getDay()) % 7);
  const thirdSunday = firstSunday + 14;

  return date.getMonth() === 6 && date.getDate() === thirdSunday;
}
