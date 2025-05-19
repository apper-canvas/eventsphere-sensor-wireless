import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

function Dashboard() {
  const CalendarCheck = getIcon('CalendarCheck');
  const Users = getIcon('Users');
  const ShoppingBag = getIcon('ShoppingBag');
  const DollarSign = getIcon('DollarSign');
  
  const showToast = (message) => {
    toast.success(message);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Event Dashboard</h1>
        <p className="text-surface-600 dark:text-surface-400">
          Welcome back! Here's what's happening with your events today.
        </p>
      </div>
      
      {/* Stat cards */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {[
          { name: 'Active Events', value: '12', icon: CalendarCheck, color: 'text-primary' },
          { name: 'Clients', value: '28', icon: Users, color: 'text-secondary' },
          { name: 'Vendors', value: '38', icon: ShoppingBag, color: 'text-accent' },
          { name: 'Revenue', value: '$158,400', icon: DollarSign, color: 'text-green-500' },
        ].map((stat, index) => (
          <motion.div 
            key={index}
            variants={item}
            className="card p-6 flex flex-col hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color} bg-surface-100 dark:bg-surface-700`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-surface-100 dark:bg-surface-700">
                Last 30 days
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-surface-500 dark:text-surface-400 text-sm">{stat.name}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Main Feature - Event Management */}
      <MainFeature onSuccess={showToast} />
    </>
  );
}

export default Dashboard;