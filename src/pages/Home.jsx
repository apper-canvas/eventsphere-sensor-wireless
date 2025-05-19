import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

function Home() {
  const [selectedView, setSelectedView] = useState('dashboard');
  
  const CalendarCheck = getIcon('CalendarCheck');
  const Users = getIcon('Users');
  const Calendar = getIcon('Calendar');
  const ShoppingBag = getIcon('ShoppingBag');
  const DollarSign = getIcon('DollarSign');
  const BarChart = getIcon('BarChart');
  
  const views = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart },
    { id: 'events', name: 'Events', icon: CalendarCheck },
    { id: 'clients', name: 'Clients', icon: Users },
    { id: 'calendar', name: 'Calendar', icon: Calendar },
    { id: 'vendors', name: 'Vendors', icon: ShoppingBag },
    { id: 'finances', name: 'Finances', icon: DollarSign },
  ];
  
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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 md:w-64 w-full md:h-screen overflow-y-auto shadow-sm">
        <div className="px-4 py-6 flex items-center border-b border-surface-200 dark:border-surface-700">
          <CalendarCheck className="text-primary mr-2" size={26} />
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            EventSphere
          </h1>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {views.map((view) => (
              <li key={view.id}>
                <button
                  onClick={() => setSelectedView(view.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all 
                    ${selectedView === view.id 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                    }`}
                >
                  <view.icon className="mr-3" size={20} />
                  <span>{view.name}</span>
                  {selectedView === view.id && (
                    <motion.div 
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-5 rounded-full bg-primary"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-8 bg-surface-50 dark:bg-surface-900 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
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
          
        </div>
      </main>
    </div>
  );
}

export default Home;