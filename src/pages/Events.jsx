import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Plus } from 'lucide-react';

function Events() {
  const showAddEventToast = () => {
    toast.info('Add Event functionality will be implemented soon!');
  };

  const eventList = [
    { id: 1, name: 'Corporate Retreat 2023', client: 'Acme Corp', date: '2023-08-15', budget: '$45,000', status: 'Active' },
    { id: 2, name: 'Product Launch', client: 'TechStart Inc', date: '2023-09-22', budget: '$32,000', status: 'Planning' },
    { id: 3, name: 'Annual Gala', client: 'City Foundation', date: '2023-11-05', budget: '$75,000', status: 'Active' },
    { id: 4, name: 'Team Building Workshop', client: 'Innovative Solutions', date: '2023-07-28', budget: '$15,000', status: 'Completed' },
  ];

  return (
    <>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Event Management</h1>
          <p className="text-surface-600 dark:text-surface-400">
            Organize and track all your events in one place
          </p>
        </div>
        <button 
          onClick={showAddEventToast}
          className="btn btn-primary flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Create New Event
        </button>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-100 dark:bg-surface-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider">Event Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
              {eventList.map((event) => (
                <tr key={event.id} className="hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{event.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400">{event.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400">{event.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400">{event.budget}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={`px-2 py-1 rounded-full text-xs ${event.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : event.status === 'Planning' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>{event.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
}

export default Events;