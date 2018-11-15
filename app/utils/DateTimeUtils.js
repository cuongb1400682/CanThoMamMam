import {convertToCapitalizedText, isEmpty} from "./StringUtils";
import {languageSelect} from "../res";

const abbreviatedMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Sep"];

const weekdayName = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export function getNumericalOrder(date) {
  if (date % 10 === 1) {
    return `${date}st`;
  } else if (date % 10 === 2) {
    return `${date}nd`;
  } else if (date % 10 === 3) {
    return `${date}rd`;
  } else {
    return `${date}th`;
  }
}

export function addPaddingZero(number) {
  if (number < 10) {
    return `0${number}`;
  } else {
    return `${number}`;
  }
}

export function getWeekdayName(index) {
  return convertToCapitalizedText(weekdayName[index]);
}

function getVietnameseDate(date: Date) {
  let hour: number = date.getHours();
  let minute: number = date.getMinutes();
  let day: number = date.getDate();
  let month: number = date.getMonth() + 1;
  let year: number = date.getFullYear();

  let period: string = 'sáng';

  if (hour > 12) {
    console.log('detect hour > 12 = ', hour);
    hour %= 12;
    if (hour >= 1) {
      period = 'chiều';
    }
    if (hour >= 6) {
      period = 'tối';
    }
  }

  console.log('in getVietnameseDate: hour = ', hour);

  if (hour === 12) {
    period = 'trưa';
  }
  console.log('period = ', period);

  return `Vào ${addPaddingZero(hour)}:${addPaddingZero(minute)}${(!isEmpty(period) ? ' ' : '') + period},` +
    ` ${addPaddingZero(day)} Th${month} ${year}`;
}

export function timestamp2Date(timestamp) {
  let date = new Date(timestamp);

  console.log("in timestamp2Date: timestamp = ", JSON.stringify(timestamp));

  if (typeof(timestamp) !== 'number') {
    return languageSelect({
      any: `Seconds ago`,
      vi: `Vài giây trước`,
    });
  }

  return languageSelect({
    any: (
      `at ${date.toLocaleTimeString()}` +
      ` ${abbreviatedMonthNames[date.getMonth()]}` +
      ` ${getNumericalOrder(date.getDate())}` +
      ` ${date.getFullYear()}`
    ),
    vi: getVietnameseDate(date),
  });
}
