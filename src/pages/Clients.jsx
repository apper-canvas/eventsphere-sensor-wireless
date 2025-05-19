import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Plus, Mail, Phone, Calendar } from 'lucide-react';

function Clients() {
  const showAddClientToast = () => {
    toast.info('Add Client functionality will be implemented soon!');
  };

  const clientList = [
    { id: 1, name: 'Acme Corporation', email: 'contact@acmecorp.com', phone: '(555) 123-4567', events: 3, type: 'Corporate' },
    { id: 2, name: 'John & Sarah Smith', email: 'john.smith@example.com', phone: '(555) 987-6543', events: 1, type: 'Individual' },
    { id: 3, name: 'TechStart Inc', email: 'events@techstart.io', phone: '(555) 234-5678', events: 2, type: 'Corporate' },
    { id: 4, name: 'City Foundation', email: 'foundation@city.org', phone: '(555) 876-5432', events: 1, type: 'Non-profit' },
  ];

  return (
    <>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Client Management</h1>
          <p className="text-surface-600 dark:text-surface-400">
            Manage your client relationships and preferences
          </p>
        </div>
        <button 
          onClick={showAddClientToast}
          className="btn btn-primary flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Create New Client
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clientList.map((client) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={client.id}
            className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => toast.info(`Client profile for ${client.name} will be displayed soon!`)}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mr-4">
                {client.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{client.name}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-surface-100 dark:bg-surface-700">
                  {client.type}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-surface-600 dark:text-surface-400">
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
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}

export default Clients;