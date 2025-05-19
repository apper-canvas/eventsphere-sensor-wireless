import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, Clock, MapPin, Users, DollarSign } from 'lucide-react';
import { formatCurrency } from '../utils/formUtils';
import { useState, useEffect } from 'react';
import eventService from '../services/eventService';
import { toast } from 'react-toastify';

function Calendar() {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events from the database
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await eventService.fetchEvents();
        
        // Map returned data to expected format for the calendar
        const formattedData = data.map(event => ({
          id: event.Id,
          title: event.title,
          type: event.type,
          location: event.location,
          startDate: event.startDate,
          endDate: event.endDate,
          status: event.status,
          budget: event.budget,
          attendees: event.attendees,
          description: event.description,
          client: event.clientDetails?.Name || 'Unknown Client'
        }));
        
        setEvents(formattedData);
      } catch (error) {
        toast.error('Failed to load events for calendar: ' + (error.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  // Navigate to current month
  const goToToday = () => {
    setCurrentMonth(new Date());
  };
  
  // Get days of month
  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };
  
  // Get events for a specific day
  const getEventsForDay = (day) => {
    return events.filter(event => {
      const eventStart = parseISO(event.startDate);
      return isSameDay(day, eventStart);
    });
  };
  
  // Format date for display
  const formatEventDate = (dateString) => {
    const date = parseISO(dateString);
    return format(date, 'EEEE, MMMM d, yyyy');
  };
  
  // Format time for display
  const formatEventTime = (dateString) => {
    const date = parseISO(dateString);
    return format(date, 'h:mm a');
  };
  
  // Get event badge color based on type
  const getEventTypeColor = (type) => {
    switch (type) {
      case 'Conference':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Wedding':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'Corporate':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'Launch':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Workshop':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'Gala':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };
  
  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Planning':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Completed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };
  
  // Render calendar days
  const renderDays = () => {
    const days = getDaysInMonth();
    const firstDayOfMonth = startOfMonth(currentMonth).getDay();
    
    // Add empty cells for days before the first day of month
    const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => (
      <div key={`empty-${i}`} className="h-24 md:h-32 border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50"></div>
    ));
    
    const dayCells = days.map(day => {
      const dayEvents = getEventsForDay(day);
      const isCurrentMonth = isSameMonth(day, currentMonth);
      const isToday = isSameDay(day, new Date());
      
      return (
        <div 
          key={day.toString()} 
          className={`min-h-24 md:min-h-32 border border-surface-200 dark:border-surface-700 p-1 ${
            isToday ? 'bg-primary-light/10' : isCurrentMonth ? 'bg-white dark:bg-surface-800' : 'bg-surface-50 dark:bg-surface-800/50'
          }`}
        >
          <div className={`text-right mb-1 ${isToday ? 'font-bold' : ''}`}>
            <span className={`inline-block px-2 py-1 text-sm rounded-full ${
              isToday ? 'bg-primary text-white' : ''
            }`}>
              {format(day, 'd')}
            </span>
          </div>
          <div className="space-y-1 overflow-y-auto max-h-20 md:max-h-24">
            {dayEvents.map(event => (
              <div 
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className={`text-xs rounded p-1 truncate cursor-pointer ${getEventTypeColor(event.type)}`}
              >
                {formatEventTime(event.startDate)} - {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    });
    
    return [...emptyCells, ...dayCells];
  };
  
  return (
    <>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Event Calendar</h1>
          <p className="text-surface-600 dark:text-surface-400">
           {loading ? 'Loading events...' : 'Visualize and manage your upcoming events'}
          </p>
        </div>
        <button 
          onClick={() => navigate('/events')}
          className="btn btn-primary flex items-center"
        >
          <CalendarIcon size={18} className="mr-1" />
          Manage Events
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Calendar Controls */}
          <div className="card mb-6">
            <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={goToToday}
                  className="btn btn-outline px-2 py-1 text-xs"
                >
                  Today
                </button>
                <button 
                  onClick={prevMonth}
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                  aria-label="Previous month"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={nextMonth}
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                  aria-label="Next month"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
            
            {/* Calendar Grid */}
            <div className="p-2">
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="font-medium text-surface-600 dark:text-surface-400 text-center py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {renderDays()}
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-lg w-full max-w-md overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative p-6 border-b border-surface-200 dark:border-surface-700">
                <div className="pr-8">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${getEventTypeColor(selectedEvent.type)}`}>
                    {selectedEvent.type}
                  </span>
                  <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
                  <p className="text-surface-500 dark:text-surface-400 text-sm">{selectedEvent.client}</p>
                </div>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <X size={20} className="text-surface-500 dark:text-surface-400" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-surface-600 dark:text-surface-400">
                    <Clock size={18} className="mr-2" />
                    <div>
                      <p>{formatEventDate(selectedEvent.startDate)}</p>
                      <p className="text-sm">{formatEventTime(selectedEvent.startDate)} - {formatEventTime(selectedEvent.endDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-surface-600 dark:text-surface-400">
                    <MapPin size={18} className="mr-2" />
                    <p>{selectedEvent.location}</p>
                  </div>
                  
                  <div className="flex items-center text-surface-600 dark:text-surface-400">
                    <Users size={18} className="mr-2" />
                    <p>{selectedEvent.attendees} attendees expected</p>
                  </div>
                  
                  <div className="flex items-center text-surface-600 dark:text-surface-400">
                    <DollarSign size={18} className="mr-2" />
                    <p>Budget: {formatCurrency(selectedEvent.budget)}</p>
                  </div>
                </div>
                
                {selectedEvent.description && (
                  <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-surface-600 dark:text-surface-400 text-sm">{selectedEvent.description}</p>
                  </div>
                )}
                
                <div className="pt-4 flex justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedEvent.status)}`}>
                    {selectedEvent.status}
                  </span>
                  <button 
                    onClick={() => {
                      setSelectedEvent(null);
                      navigate('/events');
                    }}
                    className="text-primary hover:text-primary-dark text-sm"
                  >
                    View in Events
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Calendar;
          </p>
        </div>
        <button 
          onClick={() => navigate('/events')}
          className="btn btn-primary flex items-center"
        >
          <CalendarIcon size={18} className="mr-1" />
          Manage Events
        </button>
      </div>
      
      {/* Calendar Controls */}
      <div className="card mb-6">
        <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">{format(currentMonth, 'MMMM yyyy')}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={goToToday}
              className="btn btn-outline px-2 py-1 text-xs"
            >
              Today
            </button>
            <button 
              onClick={prevMonth}
              className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
              aria-label="Previous month"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextMonth}
              className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
              aria-label="Next month"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="p-2">
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="font-medium text-surface-600 dark:text-surface-400 text-center py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {renderDays()}
          </div>
        </div>
      </div>
      
      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-lg w-full max-w-md overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative p-6 border-b border-surface-200 dark:border-surface-700">
                <div className="pr-8">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${getEventTypeColor(selectedEvent.type)}`}>
                    {selectedEvent.type}
                  </span>
                  <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
                  <p className="text-surface-500 dark:text-surface-400 text-sm">{selectedEvent.client}</p>
                </div>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <X size={20} className="text-surface-500 dark:text-surface-400" />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-surface-600 dark:text-surface-400">
                    <Clock size={18} className="mr-2" />
                    <div>
                      <p>{formatEventDate(selectedEvent.startDate)}</p>
                      <p className="text-sm">{formatEventTime(selectedEvent.startDate)} - {formatEventTime(selectedEvent.endDate)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-surface-600 dark:text-surface-400">
                    <MapPin size={18} className="mr-2" />
                    <p>{selectedEvent.location}</p>
                  </div>
                  
                  <div className="flex items-center text-surface-600 dark:text-surface-400">
                    <Users size={18} className="mr-2" />
                    <p>{selectedEvent.attendees} attendees expected</p>
                  </div>
                  
                  <div className="flex items-center text-surface-600 dark:text-surface-400">
                    <DollarSign size={18} className="mr-2" />
                    <p>Budget: {formatCurrency(selectedEvent.budget)}</p>
                  </div>
                </div>
                
                {selectedEvent.description && (
                  <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-surface-600 dark:text-surface-400 text-sm">{selectedEvent.description}</p>
                  </div>
                )}
                
                <div className="pt-4 flex justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedEvent.status)}`}>
                    {selectedEvent.status}
                  </span>
                  <button 
                    onClick={() => {
                      setSelectedEvent(null);
                      navigate('/events');
                    }}
                    className="text-primary hover:text-primary-dark text-sm"
                  >
                    View in Events
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Calendar;