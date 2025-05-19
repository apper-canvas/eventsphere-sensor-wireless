import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Plus, Filter, Search, ChevronDown, ChevronUp, Calendar, MapPin, Users, Tag, CheckCircle, XCircle } from 'lucide-react';
import FormModal from '../components/FormModal';
import { events as initialEvents, clients, eventTypes } from '../utils/mockData';
import { validateRequired, validateNumeric, validateDateRange, formatDate } from '../utils/formUtils';

function Events() {
  // State for events data
  const [events, setEvents] = useState(initialEvents);
  
  // State for modal and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    clientId: '',
    type: '',
    location: '',
    startDate: '',
    endDate: '',
    status: 'Planning',
    budget: '',
    attendees: '',
    description: ''
  });
  
  // State for form validation
  const [errors, setErrors] = useState({});
  
  // State for filters and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'startDate', direction: 'asc' });
  
  // Initialize form data when editing an event
  useEffect(() => {
    if (currentEvent) {
      setFormData({
        title: currentEvent.title,
        clientId: currentEvent.clientId?.toString() || '',
        type: currentEvent.type,
        location: currentEvent.location,
        // Format dates for datetime-local input
        startDate: new Date(currentEvent.startDate).toISOString().slice(0, 16),
        endDate: new Date(currentEvent.endDate).toISOString().slice(0, 16),
        status: currentEvent.status,
        budget: currentEvent.budget.toString(),
        attendees: currentEvent.attendees.toString(),
        description: currentEvent.description || ''
      });
    } else {
      // Reset form data when creating a new event
      setFormData({
        title: '',
        clientId: '',
        type: '',
        location: '',
        startDate: '',
        endDate: '',
        status: 'Planning',
        budget: '',
        attendees: '',
        description: ''
      });
    }
    // Reset errors when opening/closing modal
    setErrors({});
  }, [currentEvent, isModalOpen]);
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = {
      title: 'Title',
      clientId: 'Client',
      type: 'Event type',
      location: 'Location',
      startDate: 'Start date',
      endDate: 'End date'
    };
    
    Object.entries(requiredFields).forEach(([field, label]) => {
      const error = validateRequired(formData[field], label);
      if (error) newErrors[field] = error;
    });
    
    // Numeric validation
    const numericError = validateNumeric(formData.budget, 'Budget');
    if (numericError) newErrors.budget = numericError;
    
    const attendeesError = validateNumeric(formData.attendees, 'Attendees');
    if (attendeesError) newErrors.attendees = attendeesError;
    
    // Date range validation
    const dateRangeError = validateDateRange(formData.startDate, formData.endDate);
    if (dateRangeError) newErrors.endDate = dateRangeError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form.');
      return;
    }
    
    try {
      const eventData = {
        ...formData,
        budget: parseFloat(formData.budget),
        attendees: parseInt(formData.attendees),
        clientId: parseInt(formData.clientId),
        client: clients.find(c => c.id === parseInt(formData.clientId))?.name || 'Unknown Client'
      };
      
      if (currentEvent) {
        // Update existing event
        const updatedEvents = events.map(event => 
          event.id === currentEvent.id ? { ...eventData, id: currentEvent.id } : event
        );
        setEvents(updatedEvents);
        toast.success('Event updated successfully!');
      } else {
        // Create new event
        const newEvent = {
          ...eventData,
          id: Math.max(0, ...events.map(e => e.id)) + 1
        };
        setEvents([...events, newEvent]);
        toast.success('Event created successfully!');
      }
      
      setIsModalOpen(false);
    } catch (error) {
      toast.error('An error occurred while saving the event.');
      console.error('Error saving event:', error);
    }
  };
  
  // Handle event deletion
  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
      toast.success('Event deleted successfully!');
    }
  };
  
  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Apply filters and sorting
  const filteredAndSortedEvents = useMemo(() => {
    // Filter events
    let filteredEvents = [...events];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredEvents = filteredEvents.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.client.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
      );
    }
    
    if (typeFilter !== 'All') {
      filteredEvents = filteredEvents.filter(event => event.type === typeFilter);
    }
    
    if (statusFilter !== 'All') {
      filteredEvents = filteredEvents.filter(event => event.status === statusFilter);
    }
    
    // Sort events
    filteredEvents.sort((a, b) => {
      if (sortConfig.key === 'startDate') {
        const dateA = new Date(a[sortConfig.key]);
        const dateB = new Date(b[sortConfig.key]);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      }
    });
    
    return filteredEvents;
  }, [events, searchQuery, typeFilter, statusFilter, sortConfig]);
  
  // Get sorting indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    }
    return null;
  };
  
  // Get status badge style
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

  return (
    <>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Event Management</h1>
          <p className="text-surface-600 dark:text-surface-400">
            Create, organize and track all your events in one place
          </p>
        </div>
        <button 
          onClick={() => {
            setCurrentEvent(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Create New Event
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-surface-400" />
          </div>
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>

        <div className="flex gap-4">
          <div className="relative w-40 md:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Tag size={18} className="text-surface-400" />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input pl-10 appearance-none"
            >
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="relative w-40 md:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-surface-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input pl-10 appearance-none"
            >
              <option value="All">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card overflow-hidden"
      >
        <div className="overflow-x-auto">
          {filteredAndSortedEvents.length > 0 ? (
            <table className="w-full">
              <thead className="bg-surface-100 dark:bg-surface-700">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('title')}
                  >
                    <div className="flex items-center">
                      Event Name {getSortIndicator('title')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('client')}
                  >
                    <div className="flex items-center">
                      Client {getSortIndicator('client')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('startDate')}
                  >
                    <div className="flex items-center">
                      Date {getSortIndicator('startDate')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('budget')}
                  >
                    <div className="flex items-center">
                      Budget {getSortIndicator('budget')}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('status')}
                  >
                    <div className="flex items-center">
                      Status {getSortIndicator('status')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                {filteredAndSortedEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{event.title}</div>
                      <div className="text-xs text-surface-500 dark:text-surface-400 mt-1 flex items-center">
                        <Tag size={14} className="mr-1" /> {event.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400">{event.client}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-surface-600 dark:text-surface-400 flex items-center">
                        <Calendar size={14} className="mr-1" /> {formatDate(event.startDate)}
                      </div>
                      {event.endDate && event.startDate !== event.endDate && (
                        <div className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                          to {formatDate(event.endDate)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400">
                      ${event.budget.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => {
                            setCurrentEvent(event);
                            setIsModalOpen(true);
                          }}
                          className="text-primary hover:text-primary-dark"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <Calendar size={48} className="mx-auto text-surface-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No events found</h3>
              <p className="text-surface-500 dark:text-surface-400 max-w-md mx-auto mb-6">
                {searchQuery || typeFilter !== 'All' || statusFilter !== 'All' 
                  ? "No events match your current filters. Try adjusting your search criteria."
                  : "You haven't created any events yet. Click the 'Create New Event' button to get started."}
              </p>
              {(searchQuery || typeFilter !== 'All' || statusFilter !== 'All') && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setTypeFilter('All');
                    setStatusFilter('All');
                  }}
                  className="btn btn-outline"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Event Form Modal */}
      <AnimatePresence>
        <FormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={currentEvent ? "Edit Event" : "Create New Event"}
          description={currentEvent 
            ? "Update the event details below" 
            : "Fill in the details to create a new event"}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="col-span-full">
                <label htmlFor="title" className="label">Event Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`input ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Annual Conference, Product Launch, etc."
                />
                {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
              </div>
              
              {/* Client */}
              <div>
                <label htmlFor="clientId" className="label">Client</label>
                <select
                  id="clientId"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleInputChange}
                  className={`input ${errors.clientId ? 'border-red-500 focus:ring-red-500' : ''}`}
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
                {errors.clientId && <p className="mt-1 text-sm text-red-500">{errors.clientId}</p>}
              </div>
              
              {/* Event Type */}
              <div>
                <label htmlFor="type" className="label">Event Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`input ${errors.type ? 'border-red-500 focus:ring-red-500' : ''}`}
                >
                  <option value="">Select event type</option>
                  {eventTypes.filter(type => type !== 'All').map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
              </div>
              
              {/* Location */}
              <div className="col-span-full">
                <label htmlFor="location" className="label">Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-surface-400" />
                  </div>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`input pl-10 ${errors.location ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Venue name and address"
                  />
                </div>
                {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
              </div>
              
              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="label">Start Date & Time</label>
                <input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`input ${errors.startDate ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>}
              </div>
              
              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="label">End Date & Time</label>
                <input
                  id="endDate"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={`input ${errors.endDate ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>}
              </div>
              
              {/* Status */}
              <div>
                <label htmlFor="status" className="label">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="input"
                >
                  <option value="Planning">Planning</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              {/* Budget */}
              <div>
                <label htmlFor="budget" className="label">Budget</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-surface-500">$</span>
                  </div>
                  <input
                    id="budget"
                    name="budget"
                    type="text"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className={`input pl-8 ${errors.budget ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="0.00"
                  />
                </div>
                {errors.budget && <p className="mt-1 text-sm text-red-500">{errors.budget}</p>}
              </div>
              
              {/* Attendees */}
              <div>
                <label htmlFor="attendees" className="label">Expected Attendees</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users size={16} className="text-surface-400" />
                  </div>
                  <input
                    id="attendees"
                    name="attendees"
                    type="text"
                    value={formData.attendees}
                    onChange={handleInputChange}
                    className={`input pl-10 ${errors.attendees ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Number of attendees"
                  />
                </div>
                {errors.attendees && <p className="mt-1 text-sm text-red-500">{errors.attendees}</p>}
              </div>
              
              {/* Description */}
              <div className="col-span-full">
                <label htmlFor="description" className="label">Event Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="input"
                  placeholder="Event details and special requirements"
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {currentEvent ? (
                  <>
                    <CheckCircle size={18} className="mr-2" />
                    Update Event
                  </>
                ) : (
                  <>
                    <Plus size={18} className="mr-2" />
                    Create Event
                  </>
                )}
              </button>
            </div>
          </form>
        </FormModal>
      </AnimatePresence>
    </>
  );
}

export default Events;