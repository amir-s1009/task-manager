export function splitNumber(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function convertTime(timeInSec: number) {
  return {
    hour: Math.floor(timeInSec / 3600),
    minute: Math.floor((timeInSec % 3600) / 60),
    seconds: timeInSec % 60,
  };
}
