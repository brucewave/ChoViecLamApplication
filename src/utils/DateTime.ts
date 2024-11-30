import {appInfo} from '../constants/appInfos';
import {numberToString} from './numberToString';
export class DateTime {
  static GetTime = (num: Date) => {
    const date = new Date(num);

    return `${numberToString(date.getHours())}:${numberToString(
      date.getMinutes(),
    )}`;
  };
  static GetDate = (num: Date) => {
    const date = new Date(num);
    const dayString = appInfo.dayNames[date.getDay()];
    const day = numberToString(date.getDate()).padStart(2, '0');
    const month = numberToString(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${dayString}, ${day}/${month}/${year}`;
  }; 

  static GetDayString = (num: number) => {
    const date = new Date(num);
    const dayString = appInfo.dayNames[date.getDay()];
    const day = numberToString(date.getDate()).padStart(2, '0');
    const month = numberToString(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${dayString}, ${day}/${month}/${year}`;
  };
}
