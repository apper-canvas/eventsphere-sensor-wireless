import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';

function MainFeature({ onSuccess }) {
  // Get icons
  const CalendarPlus = getIcon('CalendarPlus');
  const Calendar = getIcon('Calendar');
  const Users = getIcon('Users');
  const MapPin = getIcon('MapPin');
  const Clock = getIcon('Clock');
  const Edit = getIcon('Edit');
  const Trash = getIcon('Trash');
  const CheckCircle = getIcon('CheckCircle');
  const XCircle = getIcon('XCircle');
  const Plus = getIcon('Plus');
  const Search = getIcon('Search');
  const Filter = getIcon('Filter');

  // Demo events data
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Annual Tech Conference",
      client: "TechCorp Inc.",
      type: "Conference",
      location: "Convention Center, San Francisco",
      startDate: "2023-11-15T09:00:00",
      endDate: "2023-11-17T18:00:00",
      status: "Planning",
      budget: 48000,
      attendees: 500
    },
    {
      id: 2,
      title: "Product Launch Gala",
      client: "Innovate Solutions",
      type: "Launch",
      location: "Grand Hotel, New York",
      startDate: "2023-12-05T19:00:00",
      endDate: "2023-12-05T23:00:00",
      status: "Confirmed",
      budget: 35000,
      attendees: 250
    },
    {
      id: 3,
      title: "Corporate Team Building",
      client: "Global Banking Ltd",
      type: "Workshop",
      location: "Mountain Resort, Denver",
      startDate: "2024-01-20T08:00:00",
      endDate: "2024-01-22T16:00:00",
      status: "Planning",
      budget: 22000,
      attendees: 120
    }
  ]);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formState, setFormState] = useState({
    title: "",
    client: "",
    type: "",
    location: "",
    startDate: "",
    endDate: "",
    status: "Planning",
    budget: "",
    attendees: ""
  });
  const [errors, setErrors] = useState({});
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Reset form when closing
  useEffect(() => {
    if (!showForm) {
      setFormState({
        title: "",
        client: "",
        type: "",
        location: "",
        startDate: "",
        endDate: "",
        status: "Planning",
        budget: "",
        attendees: ""
      });
      setEditingId(null);
      setErrors({});
    }
  }, [showForm]);

  // Edit event
  const handleEdit = (event) => {
    const startDate = event.startDate ? event.startDate.slice(0, 16) : "";
    const endDate = event.endDate ? event.endDate.slice(0, 16) : "";
    
    setFormState({
      ...event,
      startDate,
      endDate
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  // Delete event
  const handleDelete = (id) => {
    setEvents(events.filter(event => event.id !== id));
    toast.success("Event deleted successfully");
    if (onSuccess) onSuccess("Event deleted successfully");
  };

  // Form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formState.title) newErrors.title = "Title is required";
    if (!formState.client) newErrors.client = "Client is required";
    if (!formState.location) newErrors.location = "Location is required";
    if (!formState.type) newErrors.type = "Event type is required";
    if (!formState.startDate) newErrors.startDate = "Start date is required";
    if (!formState.endDate) newErrors.endDate = "End date is required";
    if (formState.startDate && formState.endDate && new Date(formState.startDate) > new Date(formState.endDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    if (formState.budget && isNaN(Number(formState.budget))) {
      newErrors.budget = "Budget must be a number";
    }
    if (formState.attendees && isNaN(Number(formState.attendees))) {
      newErrors.attendees = "Attendees must be a number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (editingId) {
      // Update existing event
      setEvents(prev => prev.map(event => 
        event.id === editingId ? { ...formState, id: editingId } : event
      ));
      toast.success("Event updated successfully");
      if (onSuccess) onSuccess("Event updated successfully");
    } else {
      // Add new event
      const newEvent = {
        ...formState,
        id: Date.now(), // Generate temporary ID
        budget: Number(formState.budget) || 0,
        attendees: Number(formState.attendees) || 0
      };
      setEvents(prev => [...prev, newEvent]);
      toast.success("Event created successfully");
      if (onSuccess) onSuccess("Event created successfully");
    }
    
    setShowForm(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy - hh:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Planning': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Completed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = filter === "" || 
      event.title.toLowerCase().includes(filter.toLowerCase()) ||
      event.client.toLowerCase().includes(filter.toLowerCase()) ||
      event.location.toLowerCase().includes(filter.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Calendar className="mr-2 text-primary" size={24} />
            Event Management
          </h2>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Create and manage your upcoming events
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="btn btn-primary mt-4 sm:mt-0"
        >
          <CalendarPlus className="mr-2" size={18} />
          New Event
        </motion.button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-surface-400" size={18} />
          </div>
          <input
            type="text"
            placeholder="Search events..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input pl-10"
          />
        </div>
        
        <div className="relative md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="text-surface-400" size={18} />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input pl-10 appearance-none"
          >
            <option value="all">All Statuses</option>
            <option value="Planning">Planning</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Event List */}
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden mb-6">
        {filteredEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-100 dark:bg-surface-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider hidden md:table-cell">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider hidden lg:table-cell">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-surface-900 dark:text-surface-100">{event.title}</span>
                        <span className="text-sm text-surface-500 dark:text-surface-400 flex items-center mt-1">
                          <Users size={14} className="mr-1" /> {event.client}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-col">
                        <span className="text-sm flex items-center">
                          <Clock size={14} className="mr-1 text-surface-500 dark:text-surface-400" /> 
                          {formatDate(event.startDate)}
                        </span>
                        {event.endDate && (
                          <span className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                            To: {formatDate(event.endDate)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm flex items-center text-surface-600 dark:text-surface-400">
                        <MapPin size={14} className="mr-1 flex-shrink-0" /> 
                        <span className="truncate max-w-xs">{event.location}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="p-1.5 rounded-lg bg-surface-100 hover:bg-surface-200 dark:bg-surface-700 dark:hover:bg-surface-600 transition-colors"
                          aria-label="Edit event"
                        >
                          <Edit size={16} className="text-surface-600 dark:text-surface-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 transition-colors"
                          aria-label="Delete event"
                        >
                          <Trash size={16} className="text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Calendar className="text-surface-400 mb-4" size={48} />
            <h3 className="text-lg font-medium mb-2">No events found</h3>
            <p className="text-surface-500 dark:text-surface-400 mb-4 max-w-md">
              {filter || statusFilter !== "all" 
                ? "No events match your current filters. Try adjusting your search criteria."
                : "You haven't created any events yet. Click the 'New Event' button to get started."}
            </p>
            {(filter || statusFilter !== "all") && (
              <button 
                onClick={() => {
                  setFilter("");
                  setStatusFilter("all");
                }}
                className="btn btn-outline"
              >
                <XCircle className="mr-2" size={18} />
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Event Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="border-b border-surface-200 dark:border-surface-700 p-6">
                <h3 className="text-xl font-bold">
                  {editingId ? "Edit Event" : "Create New Event"}
                </h3>
                <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
                  {editingId 
                    ? "Update the event details below"
                    : "Fill in the details to create a new event"}
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="col-span-full">
                    <label htmlFor="title" className="label">Event Title</label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formState.title}
                      onChange={handleChange}
                      className={`input ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Annual Conference, Product Launch, etc."
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                  </div>
                  
                  {/* Client */}
                  <div>
                    <label htmlFor="client" className="label">Client</label>
                    <input
                      id="client"
                      name="client"
                      type="text"
                      value={formState.client}
                      onChange={handleChange}
                      className={`input ${errors.client ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Client name or organization"
                    />
                    {errors.client && <p className="mt-1 text-sm text-red-500">{errors.client}</p>}
                  </div>
                  
                  {/* Event Type */}
                  <div>
                    <label htmlFor="type" className="label">Event Type</label>
                    <select
                      id="type"
                      name="type"
                      value={formState.type}
                      onChange={handleChange}
                      className={`input ${errors.type ? 'border-red-500 focus:ring-red-500' : ''}`}
                    >
                      <option value="">Select event type</option>
                      <option value="Conference">Conference</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Corporate">Corporate</option>
                      <option value="Launch">Product Launch</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Gala">Gala</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                  </div>
                  
                  {/* Location */}
                  <div className="col-span-full">
                    <label htmlFor="location" className="label">Location</label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={formState.location}
                      onChange={handleChange}
                      className={`input ${errors.location ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Venue name and address"
                    />
                    {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
                  </div>
                  
                  {/* Start Date */}
                  <div>
                    <label htmlFor="startDate" className="label">Start Date & Time</label>
                    <input
                      id="startDate"
                      name="startDate"
                      type="datetime-local"
                      value={formState.startDate}
                      onChange={handleChange}
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
                      value={formState.endDate}
                      onChange={handleChange}
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
                      value={formState.status}
                      onChange={handleChange}
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
                        value={formState.budget}
                        onChange={handleChange}
                        className={`input pl-8 ${errors.budget ? 'border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.budget && <p className="mt-1 text-sm text-red-500">{errors.budget}</p>}
                  </div>
                  
                  {/* Attendees */}
                  <div>
                    <label htmlFor="attendees" className="label">Expected Attendees</label>
                    <input
                      id="attendees"
                      name="attendees"
                      type="text"
                      value={formState.attendees}
                      onChange={handleChange}
                      className={`input ${errors.attendees ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Number of attendees"
                    />
                    {errors.attendees && <p className="mt-1 text-sm text-red-500">{errors.attendees}</p>}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingId ? (
                      <>
                        <CheckCircle className="mr-2" size={18} />
                        Update Event
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2" size={18} />
                        Create Event
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MainFeature;