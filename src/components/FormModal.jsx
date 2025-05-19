import { motion } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Reusable form modal component for creating and editing items
 * 
 * @param {Object} props Component props
 * @param {boolean} props.isOpen Whether the modal is open
 * @param {Function} props.onClose Function to call when closing the modal
 * @param {string} props.title Modal title
 * @param {string} props.description Optional modal description
 * @param {ReactNode} props.children Modal content
 * @param {string} props.size Modal size (sm, md, lg, xl)
 * @returns {JSX.Element}
 */
const FormModal = ({ isOpen, onClose, title, description, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`bg-white dark:bg-surface-800 rounded-xl shadow-lg w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-surface-200 dark:border-surface-700 p-6">
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            {description && <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">{description}</p>}
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700">
            <X size={20} className="text-surface-500 dark:text-surface-400" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
};

export default FormModal;