import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Plus, Mail, Phone, Tag, Star } from 'lucide-react';

function Vendors() {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const showAddVendorToast = () => {
    toast.info('Add Vendor functionality will be implemented soon!');
  };

  const categories = ['All', 'Catering', 'Venue', 'Photography', 'Entertainment', 'Decoration'];

  const vendorList = [
    { id: 1, name: 'Elegant Catering Co.', email: 'contact@elegantcatering.com', phone: '(555) 123-7890', category: 'Catering', rating: 4.8 },
    { id: 2, name: 'Grand Plaza Venue', email: 'events@grandplaza.com', phone: '(555) 456-7890', category: 'Venue', rating: 4.6 },
    { id: 3, name: 'Capture Moments Photography', email: 'info@capturemoments.com', phone: '(555) 789-0123', category: 'Photography', rating: 4.9 },
    { id: 4, name: 'Rhythm Band', email: 'booking@rhythmband.com', phone: '(555) 321-6547', category: 'Entertainment', rating: 4.7 },
    { id: 5, name: 'Decor Dreams', email: 'hello@decordreams.com', phone: '(555) 987-6543', category: 'Decoration', rating: 4.5 },
    { id: 6, name: 'Delightful Desserts', email: 'orders@delightfuldesserts.com', phone: '(555) 654-9870', category: 'Catering', rating: 4.3 },
  ];

  const filteredVendors = activeCategory === 'All' 
    ? vendorList 
    : vendorList.filter(vendor => vendor.category === activeCategory);

  return (
    <>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Vendor Directory</h1>
          <p className="text-surface-600 dark:text-surface-400">
            Manage your preferred vendors for various services
          </p>
        </div>
        <button 
          onClick={showAddVendorToast}
          className="btn btn-primary flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add New Vendor
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 rounded-full text-sm ${
              activeCategory === category 
                ? 'bg-primary text-white' 
                : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={vendor.id}
            className="card p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">{vendor.name}</h3>
              <div className="flex items-center text-yellow-500">
                <Star size={16} fill="currentColor" />
                <span className="ml-1 text-sm">{vendor.rating}</span>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
              <div className="flex items-center">
                <Tag size={16} className="mr-2 text-primary" />
                <span>{vendor.category}</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-primary" />
                <span>{vendor.email}</span>
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-2 text-primary" />
                <span>{vendor.phone}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

export default Vendors;