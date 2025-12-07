import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import isoWeek from 'dayjs/plugin/isoWeek';
import 'dayjs/locale/en';

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(isoWeek);
dayjs.locale('en');

// Define formats object similar to moment localizer
const formats = {
  dateFormat: 'DD',
  dayFormat: 'DD ddd',
  weekdayFormat: 'ddd',
  timeGutterFormat: 'h:mm A',
  monthHeaderFormat: 'MMMM YYYY',
  dayHeaderFormat: 'dddd MMM DD',
  agendaHeaderFormat: 'ddd MMM DD',
  agendaDateFormat: 'ddd MMM DD',
  agendaTimeFormat: 'h:mm A',
};

// Create a dayjs localizer that matches react-big-calendar's expected interface
const dayjsLocalizer = {
  formats: formats,
  
  format: (date, formatStr, culture) => {
    if (!date) return '';
    
    // Handle function format strings (like timeRangeFormat)
    if (typeof formatStr === 'function') {
      return formatStr({ start: date, end: date }, culture, this);
    }
    
    // Set locale if provided
    if (culture) {
      try {
        dayjs.locale(culture);
      } catch (e) {
        // If locale not found, use default
        dayjs.locale('en');
      }
    }
    
    // dayjs format strings are mostly compatible with moment.js
    let format = formatStr || 'YYYY-MM-DD';
    
    // Ensure format is a string
    if (typeof format !== 'string') {
      format = String(format);
    }
    
    // Map moment.js specific format tokens to dayjs equivalents
    // Most tokens are the same, but handle special cases
    // 'L' in moment = 'MM/DD/YYYY' in dayjs
    if (format === 'L') {
      format = 'MM/DD/YYYY';
    }
    // 'LT' in moment = 'h:mm A' in dayjs
    else if (format === 'LT') {
      format = 'h:mm A';
    }
    // 'LTS' in moment = 'h:mm:ss A' in dayjs
    else if (format === 'LTS') {
      format = 'h:mm:ss A';
    }
    // Convert 'a' to 'A' for AM/PM (dayjs uses 'A' for uppercase)
    // But be careful not to replace 'a' in the middle of words
    else {
      // Only replace standalone 'a' or 'a' in format patterns
      format = format.replace(/(^|[^a-zA-Z])a([^a-zA-Z]|$)/g, '$1A$2');
    }
    
    try {
      const formatted = dayjs(date).format(format);
      // If formatting results in the format string itself, something went wrong
      if (formatted === format && format.length > 10) {
        console.warn('Format may have failed, format:', format, 'result:', formatted);
        return dayjs(date).format('YYYY-MM-DD');
      }
      return formatted;
    } catch (e) {
      console.warn('Date format error:', e, 'format:', format, 'date:', date);
      return dayjs(date).format('YYYY-MM-DD');
    }
  },
  
  firstDayOfWeek: (culture) => {
    return 0; // Sunday
  },
  
  firstVisibleDay: (date) => {
    return dayjs(date).startOf('month').startOf('week').toDate();
  },
  
  lastVisibleDay: (date) => {
    return dayjs(date).endOf('month').endOf('week').toDate();
  },
  
  visibleDays: (date) => {
    const first = dayjs(date).startOf('month').startOf('week');
    const last = dayjs(date).endOf('month').endOf('week');
    const days = [];
    let current = first;
    while (current.isBefore(last) || current.isSame(last, 'day')) {
      days.push(current.toDate());
      current = current.add(1, 'day');
    }
    return days;
  },
  
  range: (start, end) => {
    const current = dayjs(start);
    const days = [];
    let date = current;
    while (date.isBefore(end) || date.isSame(end, 'day')) {
      days.push(date.toDate());
      date = date.add(1, 'day');
    }
    return days;
  },
  
  add: (date, amount, unit) => {
    return dayjs(date).add(amount, unit).toDate();
  },
  
  addWeeks: (date, amount) => {
    return dayjs(date).add(amount, 'week').toDate();
  },
  
  addDays: (date, amount) => {
    return dayjs(date).add(amount, 'day').toDate();
  },
  
  addMonths: (date, amount) => {
    return dayjs(date).add(amount, 'month').toDate();
  },
  
  startOf: (date, unit) => {
    return dayjs(date).startOf(unit || 'day').toDate();
  },
  
  endOf: (date, unit) => {
    return dayjs(date).endOf(unit || 'day').toDate();
  },
  
  startOfDay: (date) => {
    return dayjs(date).startOf('day').toDate();
  },
  
  endOfDay: (date) => {
    return dayjs(date).endOf('day').toDate();
  },
  
  startOfWeek: (date, culture) => {
    return dayjs(date).startOf('week').toDate();
  },
  
  endOfWeek: (date, culture) => {
    return dayjs(date).endOf('week').toDate();
  },
  
  startOfMonth: (date) => {
    return dayjs(date).startOf('month').toDate();
  },
  
  endOfMonth: (date) => {
    return dayjs(date).endOf('month').toDate();
  },
  
  startOfYear: (date) => {
    return dayjs(date).startOf('year').toDate();
  },
  
  endOfYear: (date) => {
    return dayjs(date).endOf('year').toDate();
  },
  
  getSlotMetrics: (options) => {
    const { min, max, step, timeslots } = options;
    const slots = [];
    let current = dayjs(min);
    const end = dayjs(max);
    
    while (current.isBefore(end) || current.isSame(end, 'minute')) {
      slots.push(current.toDate());
      current = current.add(step || 30, 'minute');
    }
    
    return {
      slots,
      step: step || 30,
      timeslots: timeslots || 1,
    };
  },
  
  getDstOffset: (start, end) => {
    return 0;
  },
  
  getTotalMin: (start, end) => {
    return dayjs(end).diff(dayjs(start), 'minute');
  },
  
  continuesPrior: (range, date) => {
    return dayjs(date).isBefore(dayjs(range.start));
  },
  
  continuesAfter: (range, date) => {
    return dayjs(date).isAfter(dayjs(range.end));
  },
  
  sortEvents: ({ evtA, evtB }) => {
    return dayjs(evtA.start).valueOf() - dayjs(evtB.start).valueOf();
  },
  
  inEventRange: ({ event, range }) => {
    const eventStart = dayjs(event.start);
    const eventEnd = dayjs(event.end || event.start);
    const rangeStart = dayjs(range.start);
    const rangeEnd = dayjs(range.end);
    return (
      (eventStart.isAfter(rangeStart) || eventStart.isSame(rangeStart, 'day')) &&
      (eventEnd.isBefore(rangeEnd) || eventEnd.isSame(rangeEnd, 'day'))
    );
  },
  
  isSameDate: (date1, date2) => {
    return dayjs(date1).isSame(dayjs(date2), 'day');
  },
  
  isSameTime: (date1, date2) => {
    return dayjs(date1).isSame(dayjs(date2), 'minute');
  },
  
  isBefore: (date1, date2) => {
    return dayjs(date1).isBefore(dayjs(date2));
  },
  
  isAfter: (date1, date2) => {
    return dayjs(date1).isAfter(dayjs(date2));
  },
  
  neq: (date1, date2) => {
    return !dayjs(date1).isSame(dayjs(date2));
  },
  
  eq: (date1, date2) => {
    return dayjs(date1).isSame(dayjs(date2));
  },
  
  gte: (date1, date2) => {
    return dayjs(date1).isAfter(dayjs(date2)) || dayjs(date1).isSame(dayjs(date2));
  },
  
  lte: (date1, date2) => {
    return dayjs(date1).isBefore(dayjs(date2)) || dayjs(date1).isSame(dayjs(date2));
  },
  
  gt: (date1, date2) => {
    return dayjs(date1).isAfter(dayjs(date2));
  },
  
  lt: (date1, date2) => {
    return dayjs(date1).isBefore(dayjs(date2));
  },
  
  inRange: (date, start, end) => {
    const d = dayjs(date);
    const s = dayjs(start);
    const e = dayjs(end);
    return (d.isAfter(s) || d.isSame(s)) && (d.isBefore(e) || d.isSame(e));
  },
  
  merge: (date, time) => {
    const dateObj = dayjs(date);
    const timeObj = dayjs(time);
    return dayjs(dateObj)
      .hour(timeObj.hour())
      .minute(timeObj.minute())
      .second(timeObj.second())
      .toDate();
  },
  
  diff: (date1, date2, unit) => {
    return dayjs(date1).diff(dayjs(date2), unit);
  },
  
  daySpan: (start, end) => {
    return dayjs(end).diff(dayjs(start), 'day');
  },
  
  ceil: (date, unit) => {
    const floor = dayjs(date).startOf(unit || 'day');
    return floor.isSame(dayjs(date)) ? floor.toDate() : floor.add(1, unit || 'day').toDate();
  },
  
  min: (...dates) => {
    return new Date(Math.min(...dates.map(d => dayjs(d).valueOf())));
  },
  
  max: (...dates) => {
    return new Date(Math.max(...dates.map(d => dayjs(d).valueOf())));
  },
  
  minutes: (date) => {
    return dayjs(date).minute();
  },
  
  getSlotDate: (dt, minutesFromMidnight, offset) => {
    return dayjs(dt).startOf('day').add(minutesFromMidnight + offset, 'minute').toDate();
  },
  
  getTimezoneOffset: (date) => {
    return date.getTimezoneOffset();
  },
  
  getMinutesFromMidnight: (date) => {
    return dayjs(date).diff(dayjs(date).startOf('day'), 'minute');
  },
  
  browserTZOffset: () => {
    return new Date().getTimezoneOffset();
  },
};

export default dayjsLocalizer;

