import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

function NotFound() {
  const navigate = useNavigate();
  const CalendarX = getIcon('CalendarX');
  const ArrowLeft = getIcon('ArrowLeft');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary">
          <CalendarX size={40} />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="btn btn-primary flex items-center justify-center mx-auto"
        >
          <ArrowLeft className="mr-2" size={18} />
          Return to Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
}

export default NotFound;