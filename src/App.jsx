import { createContext, useEffect, useState } from 'react';
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { Sun, Moon } from 'lucide-react';
import { setUser, clearUser } from './store/userSlice';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import Clients from './pages/Clients';
import Calendar from './pages/Calendar';
import Vendors from './pages/Vendors';
import Finances from './pages/Finances';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';
import Sidebar from './components/Sidebar';

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
            '/callback') || currentPath.includes('/error');
        if (user) {
            // User is authenticated
            if (redirectPath) {
                navigate(redirectPath);
            } else if (!isAuthPage) {
                if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
                    navigate(currentPath);
                } else {
                    navigate('/dashboard');
                }
            } else {
                navigate('/dashboard');
            }
            // Store user information in Redux
            dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
            // User is not authenticated
            if (!isAuthPage) {
                navigate(
                    currentPath.includes('/signup')
                     ? `/signup?redirect=${currentPath}`
                     : currentPath.includes('/login')
                     ? `/login?redirect=${currentPath}`
                     : '/login');
            } else if (redirectPath) {
                if (
                    ![
                        'error',
                        'signup',
                        'login',
                        'callback'
                    ].some((path) => currentPath.includes(path)))
                    navigate(`/login?redirect=${redirectPath}`);
                else {
                    navigate(currentPath);
                }
            } else if (isAuthPage) {
                navigate(currentPath);
            } else {
                navigate('/login');
            }
            dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        setIsInitialized(true);
      }
    });
  }, [dispatch, navigate]);

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
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    isAuthenticated,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };
  
  // Protected route component
  const ProtectedRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl">Initializing application...</p>
    </div>;
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="relative min-h-screen">
        <button
          onClick={toggleDarkMode}
          className="fixed right-4 top-4 z-50 p-2 rounded-full bg-surface-200 dark:bg-surface-800 text-surface-800 dark:text-surface-200 shadow-soft transition-all hover:scale-110"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/" element={<ProtectedRoute element={<Layout />} />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="events" element={<ProtectedRoute element={<Events />} />} />
            <Route path="clients" element={<ProtectedRoute element={<Clients />} />} />
            <Route path="calendar" element={<ProtectedRoute element={<Calendar />} />} />
            <Route path="vendors" element={<ProtectedRoute element={<Vendors />} />} />
            <Route path="finances" element={<ProtectedRoute element={<Finances />} />} />
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
    </AuthContext.Provider>
  );
}

export default App;