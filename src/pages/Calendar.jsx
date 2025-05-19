import { motion } from 'framer-motion';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';

function Calendar() {
  const today = new Date();
  const firstDayOfMonth = startOfMonth(today);
  const lastDayOfMonth = endOfMonth(today);
  
  const days = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth
  });
  
  const eventDays = {
    15: [{ name: 'Corporate Retreat', client: 'Acme Corp', time: '9:00 AM - 5:00 PM' }],
    22: [{ name: 'Product Launch', client: 'TechStart Inc', time: '7:00 PM - 10:00 PM' }],
    28: [{ name: 'Team Building Workshop', client: 'Innovative Solutions', time: '1:00 PM - 4:00 PM' }]
  };
  
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Event Calendar</h1>
        <p className="text-surface-600 dark:text-surface-400">
          View all your events in a calendar format
        </p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{format(today, 'MMMM yyyy')}</h2>
          <div className="space-x-2">
            <button className="btn btn-outline">Previous</button>
            <button className="btn btn-outline">Today</button>
            <button className="btn btn-outline">Next</button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-surface-500 dark:text-surface-400">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {days.map(day => (
            <div key={day.toString()} className={`min-h-24 p-2 border border-surface-200 dark:border-surface-700 rounded-lg ${isToday(day) ? 'bg-primary/10 border-primary' : ''}`}>
              <div className="font-medium text-sm">{format(day, 'd')}</div>
              {eventDays[format(day, 'd')] && eventDays[format(day, 'd')].map((event, idx) => (
                <div key={idx} className="mt-1 p-1 bg-primary/20 text-xs rounded truncate">{event.name}</div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

export default Calendar;