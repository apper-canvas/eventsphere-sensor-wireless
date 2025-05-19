import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Sun, Moon } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Clients from './pages/Clients';
import Calendar from './pages/Calendar';
import Vendors from './pages/Vendors';
import Finances from './pages/Finances';
import NotFound from './pages/NotFound';
import Sidebar from './components/Sidebar';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Layout component that includes the sidebar and renders children
  const Layout = () => {
    return (
      <div className="min-h-screen flex flex-col md:flex-row">
        <Sidebar />
        <main className="flex-grow p-4 md:p-8 bg-surface-50 dark:bg-surface-900 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    );
  };

  return (
    <>
      <div className="relative min-h-screen">
        <button
          onClick={toggleDarkMode}
          className="fixed right-4 top-4 z-50 p-2 rounded-full bg-surface-200 dark:bg-surface-800 text-surface-800 dark:text-surface-200 shadow-soft transition-all hover:scale-110"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="events" element={<Events />} />
            <Route path="clients" element={<Clients />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="finances" element={<Finances />} />
            <Route path="*" element={<Navigate to="/not-found" replace />} />
          </Route>
          <Route path="/not-found" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        toastClassName="rounded-lg shadow-card"
      />
    </>
  );
}

export default App;