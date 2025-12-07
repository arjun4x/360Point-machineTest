import Calendar from './components/Calendar';
import DateModal from './components/DateModal';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Calendar />
        <DateModal />
      </div>
    </div>
  );
}

export default App;


