import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

// Convert DD-MM-YYYY to Date object
export const parseDate = (dateString) => {
  return dayjs(dateString, 'DD-MM-YYYY').toDate();
};

// Convert Date object to DD-MM-YYYY
export const formatDate = (date) => {
  return dayjs(date).format('DD-MM-YYYY');
};

// Check if date has data
export const hasDataForDate = (dateString, calendarData) => {
  return calendarData.hasOwnProperty(dateString);
};

// Get data for a specific date
export const getDataForDate = (dateString, calendarData) => {
  return calendarData[dateString] || null;
};

// Convert calendar data to events for React Big Calendar
export const convertDataToEvents = (calendarData) => {
  const events = [];
  Object.keys(calendarData).forEach((dateString) => {
    const date = parseDate(dateString);
    events.push({
      id: dateString,
      title: 'Has Data',
      start: date,
      end: date,
      allDay: true,
    });
  });
  return events;
};

