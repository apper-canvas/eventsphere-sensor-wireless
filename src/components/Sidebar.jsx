import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { getIcon } from '../utils/iconUtils';

function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1] || 'dashboard';
  
  const CalendarCheck = getIcon('CalendarCheck');
  const Users = getIcon('Users');
  const Calendar = getIcon('Calendar');
  const ShoppingBag = getIcon('ShoppingBag');
  const DollarSign = getIcon('DollarSign');
  const BarChart = getIcon('BarChart');
  
  const views = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart, path: '/dashboard' },
    { id: 'events', name: 'Events', icon: CalendarCheck, path: '/events' },
    { id: 'clients', name: 'Clients', icon: Users, path: '/clients' },
    { id: 'calendar', name: 'Calendar', icon: Calendar, path: '/calendar' },
    { id: 'vendors', name: 'Vendors', icon: ShoppingBag, path: '/vendors' },
    { id: 'finances', name: 'Finances', icon: DollarSign, path: '/finances' },
  ];

  return (
    <aside className="bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 md:w-64 w-full md:h-screen overflow-y-auto shadow-sm">
      <div className="px-4 py-6 flex items-center border-b border-surface-200 dark:border-surface-700">
        <CalendarCheck className="text-primary mr-2" size={26} />
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          EventSphere
        </h1>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {views.map((view) => {
            const isActive = view.id === currentPath;
            
            return (
              <li key={view.id}>
                <NavLink
                  to={view.path}
                  className={({ isActive }) => `
                    w-full flex items-center px-4 py-3 rounded-lg font-medium transition-all 
                    ${isActive 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <view.icon className="mr-3" size={20} />
                      <span>{view.name}</span>
                      {isActive && (
                        <motion.div 
                          layoutId="activeIndicator"
                          className="ml-auto w-1.5 h-5 rounded-full bg-primary"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;