import { useSelector, useDispatch } from 'react-redux';
import { clearSelectedDate } from '../store/calendarSlice';
import { getDataForDate, formatDate } from '../utils/dateUtils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DateModal = () => {
  const dispatch = useDispatch();
  const { selectedDate, calendarData } = useSelector((state) => state.calendar);

  if (!selectedDate) return null;

  const data = getDataForDate(selectedDate, calendarData);
  const hasData = data !== null;

  // Transform data for Recharts
  const chartData = hasData
    ? data.map((item, index) => {
        const key = Object.keys(item)[0];
        const value = item[key];
        return {
          name: key,
          value: value,
        };
      })
    : [];

  const handleClose = () => {
    dispatch(clearSelectedDate());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Date: {selectedDate}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {hasData ? (
          <div>
            <p className="text-gray-600 mb-4">
              Data available for this date. Below is the bar graph representation:
            </p>
            <div className="mt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700 mb-2">Data Details:</h3>
              <ul className="list-disc list-inside space-y-1">
                {data.map((item, index) => {
                  const key = Object.keys(item)[0];
                  const value = item[key];
                  return (
                    <li key={index} className="text-gray-600">
                      {key}: {value}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
              <p className="font-bold text-lg">⚠️ No data found for the selected date.</p>
              <p className="mt-2">Selected Date: {selectedDate}</p>
            </div>
            <p className="text-gray-600">
              Please select a date that has data available.
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateModal;

