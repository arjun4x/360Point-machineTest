import { useState, useMemo } from 'react';
import { Calendar as BigCalendar } from 'react-big-calendar';
import dayjsLocalizer from '../utils/dayjsLocalizer';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedDate } from '../store/calendarSlice';
import { convertDataToEvents, formatDate, hasDataForDate } from '../utils/dateUtils';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/calendar.css';

const localizer = dayjsLocalizer;

const Calendar = () => {
  const dispatch = useDispatch();
  const { calendarData, selectedDate } = useSelector((state) => state.calendar);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  const events = useMemo(() => {
    return convertDataToEvents(calendarData);
  }, [calendarData]);

  const eventStyleGetter = (event) => {
    const dateString = formatDate(event.start);
    const hasData = hasDataForDate(dateString, calendarData);
    
    return {
      style: {
        backgroundColor: hasData ? '#3b82f6' : '#9ca3af',
        color: 'white',
        borderRadius: '4px',
        border: 'none',
        padding: '2px 4px',
      },
    };
  };

  const dayPropGetter = (date) => {
    const dateString = formatDate(date);
    const hasData = hasDataForDate(dateString, calendarData);
    const isSelected = selectedDate === dateString;
    
    let className = '';
    if (isSelected) {
      className += 'rbc-day-selected ';
    }
    if (hasData) {
      className += 'rbc-day-has-data';
    }
    
    return {
      className: className.trim(),
    };
  };

  const handleSelectSlot = ({ start }) => {
    const dateString = formatDate(start);
    dispatch(setSelectedDate(dateString));
  };

  const handleSelectEvent = (event) => {
    const dateString = formatDate(event.start);
    dispatch(setSelectedDate(dateString));
  };

  return (
    <div className="calendar-container p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Calendar Dashboard
      </h1>
      <div className="mb-4 flex gap-2 justify-center">
        <button
          onClick={() => setView('month')}
          className={`px-4 py-2 rounded ${
            view === 'month'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Month
        </button>
        <button
          onClick={() => setView('week')}
          className={`px-4 py-2 rounded ${
            view === 'week'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Week
        </button>
        <button
          onClick={() => setView('day')}
          className={`px-4 py-2 rounded ${
            view === 'day'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Day
        </button>
      </div>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayPropGetter}
      />
    </div>
  );
};

export default Calendar;

