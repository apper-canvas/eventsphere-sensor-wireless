import { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Calendar, Users, CalendarDays, Briefcase, 
  DollarSign, Menu, X, LogOut
} from 'lucide-react';
import { AuthContext } from '../App';
import { useSelector } from 'react-redux';

function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const user = useSelector(state => state.user.user);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Events', path: '/events', icon: <CalendarDays size={20} /> },
    { name: 'Clients', path: '/clients', icon: <Users size={20} /> },
    { name: 'Calendar', path: '/calendar', icon: <Calendar size={20} /> },
    { name: 'Vendors', path: '/vendors', icon: <Briefcase size={20} /> },
    { name: 'Finances', path: '/finances', icon: <DollarSign size={20} /> },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-surface-200 dark:bg-surface-800 text-surface-800 dark:text-surface-200 shadow-soft"
        aria-label="Toggle Menu"
      >
        <Menu size={24} />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="md:static fixed top-0 left-0 h-screen w-64 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 z-50 md:translate-x-0 flex flex-col"
      >
        <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <CalendarDays size={24} className="text-primary mr-3" />
            <h1 className="text-xl font-bold">EventSphere</h1>
          </Link>
          <button
            onClick={closeSidebar}
            className="md:hidden p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
            aria-label="Close Menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="font-medium truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-surface-500 dark:text-surface-400 truncate">{user?.emailAddress}</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow py-4">
          <ul className="space-y-1 px-2">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={closeSidebar}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary text-white'
                      : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-surface-200 dark:border-surface-700">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 rounded-lg text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
}

export default Sidebar;