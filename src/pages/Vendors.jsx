import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Plus, Mail, Phone, Tag, Star, Search, Globe, Map, CheckCircle } from 'lucide-react';
import FormModal from '../components/FormModal';
import { vendorCategories } from '../utils/mockData';
import { validateRequired, validateEmail, validatePhone } from '../utils/formUtils';
import vendorService from '../services/vendorService';

function Vendors() {
  // State for vendors data
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  // State for modal and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    rating: 5,
    address: '',
    services: '',
    website: ''
  });
  
  // State for form validation
  const [errors, setErrors] = useState({});
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Fetch vendors when component mounts
  useEffect(() => {
    const fetchVendorsData = async () => {
      setLoading(true);
      try {
        const data = await vendorService.fetchVendors({
          searchQuery: searchQuery,
          category: categoryFilter !== 'All' ? categoryFilter : null
        });
        
        // Map returned data to expected format
        const formattedData = data.map(vendor => ({
          id: vendor.Id,
          name: vendor.Name,
          email: vendor.email,
          phone: vendor.phone,
          category: vendor.category,
          rating: vendor.rating,
          address: vendor.address,
          services: vendor.services,
          website: vendor.website
        }));
        setVendors(formattedData);
      } catch (error) {
        toast.error('Failed to load vendors: ' + (error.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchVendorsData();
  }, [searchQuery, categoryFilter]);
  
  // Initialize form when editing a vendor
  const handleEditVendor = (vendor) => {
    setCurrentVendor(vendor);
    setFormData({
      Name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      category: vendor.category,
      rating: vendor.rating,
      address: vendor.address || '',
      services: vendor.services || '',
      website: vendor.website || ''
    });
    setIsModalOpen(true);
  };
  
  // Reset form for new vendor
  const handleNewVendor = () => {
    setCurrentVendor(null);
    setFormData({
      Name: '',
      email: '',
      phone: '',
      category: '',
      rating: 5,
      address: '',
      services: '',
      website: ''
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
      Name: 'Name',
      email: 'Email',
      phone: 'Phone number',
      category: 'Category'
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
    setLoading(true);
    
    const submitForm = async () => {
      if (!validateForm()) {
        toast.error('Please fix the errors in the form.');
        setLoading(false);
        return;
      }
      
      try {
        // Format the vendor data for the API
        const vendorData = {
          Name: formData.Name,
          email: formData.email,
          phone: formData.phone,
          category: formData.category,
          rating: parseFloat(formData.rating),
          address: formData.address,
          services: formData.services,
          website: formData.website
        };
        
        if (currentVendor) {
          // Update existing vendor
          await vendorService.updateVendor(currentVendor.id, vendorData);
          toast.success('Vendor updated successfully!');
        } else {
          // Create new vendor
          await vendorService.createVendor(vendorData);
          toast.success('Vendor created successfully!');
        }
        
        // Refresh vendor list from server
        const data = await vendorService.fetchVendors({
          searchQuery: searchQuery,
          category: categoryFilter !== 'All' ? categoryFilter : null
        });
        
        // Map returned data to expected format
        const formattedData = data.map(vendor => ({
          id: vendor.Id,
          name: vendor.Name,
          email: vendor.email,
          phone: vendor.phone,
          category: vendor.category,
          rating: vendor.rating,
          address: vendor.address,
          services: vendor.services,
          website: vendor.website
        }));
        
        setVendors(formattedData);
        setIsModalOpen(false);
      } catch (error) {
        toast.error('An error occurred while saving the vendor: ' + (error.message || 'Unknown error'));
        console.error('Error saving vendor:', error);
      } finally {
        setLoading(false);
      }
    };
    
    submitForm();
  };
  
  // Handle vendor deletion
  const handleDeleteVendor = (vendorId) => {
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      setLoading(true);
      vendorService.deleteVendor(vendorId)
        .then(() => {
          setVendors(vendors.filter(vendor => vendor.id !== vendorId));
          toast.success('Vendor deleted successfully!');
        })
        .catch(error => {
          toast.error('Failed to delete vendor: ' + (error.message || 'Unknown error'));
        })
        .finally(() => setLoading(false));
    }
  };
  
  // Apply filters
  const filteredVendors = useMemo(() => {
    let result = vendors?.length ? [...vendors] : [];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(vendor => 
        vendor.name.toLowerCase().includes(query) ||
        vendor.email.toLowerCase().includes(query) ||
        vendor.services?.toLowerCase().includes(query) ||
        vendor.phone.includes(query)
      );
    }
    
    if (categoryFilter !== 'All') {
      result = result.filter(vendor => vendor.category === categoryFilter);
    }
    
    return result;
  }, [vendors, searchQuery, categoryFilter]);
  
  // Generate star rating display
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} size={16} className="text-yellow-500" fill="currentColor" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<Star key={i} size={16} className="text-yellow-500" fill="currentColor" style={{ clipPath: 'inset(0 50% 0 0)' }} />);
      } else {
        stars.push(<Star key={i} size={16} className="text-surface-300 dark:text-surface-600" />);
      }
    }
    
    return <div className="flex">{stars}</div>;
  };

  return (
    <>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Vendor Directory</h1>
          <p className="text-surface-600 dark:text-surface-400">
            Manage your vendors and service providers
          </p>
        </div>
        <button 
          onClick={handleNewVendor}
          className="btn btn-primary flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add New Vendor
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
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {vendorCategories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm ${
              categoryFilter === category 
                ? 'bg-primary text-white' 
                : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
            }`}
            onClick={() => setCategoryFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
     
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {filteredVendors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={vendor.id}
                  className="card p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{vendor.name}</h3>
                      <div className="flex items-center mt-1">
                        {renderStars(vendor.rating)}
                        <span className="ml-1 text-sm text-surface-500 dark:text-surface-400">{vendor.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditVendor(vendor)}
                        className="p-1.5 rounded-lg bg-surface-100 hover:bg-surface-200 dark:bg-surface-700 dark:hover:bg-surface-600 transition-colors text-sm"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteVendor(vendor.id)}
                        className="p-1.5 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 transition-colors text-red-600 dark:text-red-400 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
                    <div className="flex items-center">
                      <Tag size={16} className="mr-2 text-primary" />
                      <span>{vendor.category}</span>
                    </div>
                    <div className="flex items-center">
                      <Map size={16} className="mr-2 text-primary" />
                      <span>{vendor.address || 'No address provided'}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail size={16} className="mr-2 text-primary" />
                      <span>{vendor.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone size={16} className="mr-2 text-primary" />
                      <span>{vendor.phone}</span>
                    </div>
                    {vendor.website && (
                      <div className="flex items-center">
                        <Globe size={16} className="mr-2 text-primary" />
                        <a href={vendor.website.startsWith('http') ? vendor.website : `http://${vendor.website}`} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="text-primary hover:underline">
                          {vendor.website}
                        </a>
                      </div>
                    )}
                    {vendor.services && (
                      <div className="mt-3 pt-3 border-t border-surface-200 dark:border-surface-700">
                        <p className="font-medium mb-1">Services:</p>
                        <p>{vendor.services}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 card">
          <Tag size={48} className="mx-auto text-surface-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No vendors found</h3>
          <p className="text-surface-500 dark:text-surface-400 max-w-md mx-auto mb-6">
            {searchQuery || categoryFilter !== 'All' 
              ? "No vendors match your current filters. Try adjusting your search criteria."
              : "You haven't added any vendors yet. Click the 'Add New Vendor' button to get started."}
          </p>
          {(searchQuery || categoryFilter !== 'All') && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('All');
              }}
              className="btn btn-outline"
            >
              Clear Filters
            </button>
          )}
        </div>
          )}
        </>
      )}
      
      {/* Vendor Form Modal */}
      <AnimatePresence>
        <FormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={currentVendor ? "Edit Vendor" : "Add New Vendor"}
          description={currentVendor 
            ? "Update the vendor information below" 
            : "Fill in the details to add a new vendor"}
        >
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="col-span-full">
                <label htmlFor="name" className="label">Vendor Name</label>
                <input
                  id="name"
                  name="Name"
                  type="text"
                  value={formData.Name}
                  onChange={handleInputChange}
                  className={`input ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Company or business name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="category" className="label">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`input ${errors.category ? 'border-red-500 focus:ring-red-500' : ''}`}
                >
                  <option value="">Select category</option>
                  {vendorCategories.filter(cat => cat !== 'All').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
              </div>
              
              {/* Rating */}
              <div>
                <label htmlFor="rating" className="label">Rating (1-5)</label>
                <div className="flex items-center">
                  <input
                    id="rating"
                    name="rating"
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-surface-200 rounded-lg appearance-none cursor-pointer accent-primary dark:bg-surface-700"
                  />
                  <span className="ml-2 text-sm font-medium w-6">{parseFloat(formData.rating).toFixed(1)}</span>
                </div>
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
                    placeholder="contact@vendor.com"
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
              
              {/* Website */}
              <div>
                <label htmlFor="website" className="label">Website</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe size={16} className="text-surface-400" />
                  </div>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="input pl-10"
                    placeholder="www.vendor.com"
                  />
                </div>
              </div>
              
              {/* Address */}
              <div className="col-span-full">
                <label htmlFor="address" className="label">Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Map size={16} className="text-surface-400" />
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
              
              {/* Services */}
              <div className="col-span-full">
                <label htmlFor="services" className="label">Services Offered</label>
                <textarea
                  id="services"
                  name="services"
                  value={formData.services}
                  onChange={handleInputChange}
                  rows={3}
                  className="input"
                  placeholder="Describe the services this vendor offers"
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn btn-outline"
              >
                disabled={loading}>
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {currentVendor ? (
                  <>
                    <CheckCircle size={18} className="mr-2" />
                    Update Vendor
                  </>
                ) : (
                  <>
                    <Plus size={18} className="mr-2" />
                    Add Vendor
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

export default Vendors;