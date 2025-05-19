import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Plus, Mail, Phone, Calendar, Search, User, MapPin, Heart, CheckCircle } from 'lucide-react';
import FormModal from '../components/FormModal';
import { clients as initialClients, clientTypes } from '../utils/mockData';
import { validateRequired, validateEmail, validatePhone } from '../utils/formUtils';

function Clients() {
  // State for clients data
  const [clients, setClients] = useState(initialClients);
  
  // State for modal and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: '',
    address: '',
    preferences: ''
  });
  
  // State for form validation
  const [errors, setErrors] = useState({});
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  
  // Initialize form when editing a client
  const handleEditClient = (client) => {
    setCurrentClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      type: client.type,
      address: client.address || '',
      preferences: client.preferences || ''
    });
    setIsModalOpen(true);
  };
  
  // Reset form for new client
  const handleNewClient = () => {
    setCurrentClient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      type: '',
      address: '',
      preferences: ''
    });
    setErrors({});
    setIsModalOpen(true);
  };
  
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
      name: 'Name',
      email: 'Email',
      phone: 'Phone number',
      type: 'Client type'
    };
    
    Object.entries(requiredFields).forEach(([field, label]) => {
      const error = validateRequired(formData[field], label);
      if (error) newErrors[field] = error;
    });
    
    // Email validation
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    // Phone validation
    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;
    
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
      if (currentClient) {
        // Update existing client
        const updatedClients = clients.map(client => 
          client.id === currentClient.id ? { ...client, ...formData } : client
        );
        setClients(updatedClients);
        toast.success('Client updated successfully!');
      } else {
        // Create new client
        const newClient = {
          ...formData,
          id: Math.max(0, ...clients.map(c => c.id)) + 1,
          events: 0
        };
        setClients([...clients, newClient]);
        toast.success('Client created successfully!');
      }
      
      setIsModalOpen(false);
    } catch (error) {
      toast.error('An error occurred while saving the client.');
      console.error('Error saving client:', error);
    }
  };
  
  // Handle client deletion
  const handleDeleteClient = (clientId) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      const updatedClients = clients.filter(client => client.id !== clientId);
      setClients(updatedClients);
      toast.success('Client deleted successfully!');
    }
  };
  
  // Apply filters
  const filteredClients = useMemo(() => {
    let result = [...clients];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(client => 
        client.name.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.phone.includes(query)
      );
    }
    
    if (typeFilter !== 'All') {
      result = result.filter(client => client.type === typeFilter);
    }
    
    return result;
  }, [clients, searchQuery, typeFilter]);
  
  // Get client initials
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Client Management</h1>
          <p className="text-surface-600 dark:text-surface-400">
            Manage your clients' information and event preferences
          </p>
        </div>
        <button 
          onClick={handleNewClient}
          className="btn btn-primary flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Create New Client
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
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>

        <div className="relative md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User size={18} className="text-surface-400" />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input pl-10 appearance-none"
          >
            {clientTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.length > 0 ? filteredClients.map((client) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={client.id}
            className="card p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mr-4">
                  {getInitials(client.name)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{client.name}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-surface-100 dark:bg-surface-700">
                    {client.type}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditClient(client)}
                  className="p-1.5 rounded-lg bg-surface-100 hover:bg-surface-200 dark:bg-surface-700 dark:hover:bg-surface-600 transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteClient(client.id)}
                  className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 transition-colors text-red-600 dark:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-primary" />
                <span>{client.address || 'No address provided'}</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-primary" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-2 text-primary" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-primary" />
                <span>{client.events} {client.events === 1 ? 'Event' : 'Events'}</span>
              </div>
              <div className="flex items-start mt-3">
                <Heart size={16} className="mr-2 text-primary flex-shrink-0 mt-0.5" />
                <span>{client.preferences || 'No preferences recorded'}</span>
              </div>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full text-center py-12">
            <User size={48} className="mx-auto text-surface-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No clients found</h3>
            <p className="text-surface-500 dark:text-surface-400 max-w-md mx-auto mb-6">
              {searchQuery || typeFilter !== 'All' 
                ? "No clients match your current filters. Try adjusting your search criteria."
                : "You haven't added any clients yet. Click the 'Create New Client' button to get started."}
            </p>
            {(searchQuery || typeFilter !== 'All') && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('All');
                }}
                className="btn btn-outline"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Client Form Modal */}
      <AnimatePresence>
        <FormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={currentClient ? "Edit Client" : "Create New Client"}
          description={currentClient 
            ? "Update the client information below" 
            : "Fill in the details to create a new client"}
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="col-span-full">
                <label htmlFor="name" className="label">Client Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`input ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Individual or company name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              
              {/* Type */}
              <div>
                <label htmlFor="type" className="label">Client Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`input ${errors.type ? 'border-red-500 focus:ring-red-500' : ''}`}
                >
                  <option value="">Select client type</option>
                  {clientTypes.filter(type => type !== 'All').map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="label">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-surface-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`input pl-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="client@example.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>
              
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="label">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={16} className="text-surface-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`input pl-10 ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="(555) 123-4567"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>
              
              {/* Address */}
              <div className="col-span-full">
                <label htmlFor="address" className="label">Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={16} className="text-surface-400" />
                  </div>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input pl-10"
                    placeholder="Street address, city, state, zip"
                  />
                </div>
              </div>
              
              {/* Preferences */}
              <div className="col-span-full">
                <label htmlFor="preferences" className="label">Preferences</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <Heart size={16} className="text-surface-400" />
                  </div>
                  <textarea
                    id="preferences"
                    name="preferences"
                    value={formData.preferences}
                    onChange={handleInputChange}
                    rows={3}
                    className="input pl-10"
                    placeholder="Event preferences, dietary restrictions, etc."
                  ></textarea>
                </div>
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
                {currentClient ? (
                  <>
                    <CheckCircle size={18} className="mr-2" />
                    Update Client
                  </>
                ) : (
                  <>
                    <Plus size={18} className="mr-2" />
                    Create Client
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

export default Clients;