import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Chart from 'react-apexcharts';
import { Plus, DollarSign, TrendingUp, TrendingDown, Filter, Search, CheckCircle, CalendarRange, CreditCard, Tag } from 'lucide-react';
import FormModal from '../components/FormModal';
import { expenseCategories, financialMetrics } from '../utils/mockData';
import { validateRequired, validateNumeric, formatCurrency } from '../utils/formUtils';
import financeService from '../services/financeService';
import eventService from '../services/eventService';

function Finances() {
  // State for finances data
  const [finances, setFinances] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  // State for modal and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    eventId: '',
    type: 'expense',
    category: '',
    description: '',
    amount: '',
    date: '',
    status: 'pending'
  });
  
  // State for form validation
  const [errors, setErrors] = useState({});
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));
  
  // Fetch finances and events when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch events for the dropdown
        const eventsData = await eventService.fetchEvents();
        const formattedEvents = eventsData.map(event => ({
          id: event.Id,
          title: event.title
        }));
        setEvents(formattedEvents);
        
        // Fetch financial transactions
        const financesData = await financeService.fetchFinancialTransactions({
          searchQuery: searchQuery,
          eventId: eventFilter !== 'all' ? eventFilter : null,
          type: typeFilter !== 'all' ? typeFilter : null
        });
        
        // Map returned data to expected format
        const formattedFinances = financesData.map(transaction => ({
          id: transaction.Id,
          type: transaction.type,
          category: transaction.category,
          description: transaction.description,
          amount: transaction.amount,
          date: transaction.date,
          status: transaction.status,
          eventId: transaction.event,
          eventName: transaction.eventDetails?.Name || 'Unknown Event'
        }));
        
        setFinances(formattedFinances);
      } catch (error) {
        toast.error('Failed to load financial data: ' + (error.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [searchQuery, eventFilter, typeFilter]);
  
  // Refresh data when filters change
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        // This will trigger the fetchData effect
        setLoading(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, eventFilter, typeFilter]);
  
  // Update chart theme when dark mode changes
  const updateDarkMode = () => {
    setDarkMode(document.documentElement.classList.contains('dark'));
  };
  
  // Listen for dark mode changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateDarkMode);
  document.addEventListener('darkmodechange', updateDarkMode);
  
  // Initialize form when editing a finance item
  const handleEditItem = (item) => {
    setCurrentItem(item);
    setFormData({
      eventId: item.eventId.toString(),
      type: item.type,
      category: item.category,
      description: item.description,
      amount: item.amount.toString(),
      date: item.date ? new Date(item.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      status: item.status
    });
    setIsModalOpen(true);
  };
  
  // Reset form for new finance item
  const handleNewItem = () => {
    setCurrentItem(null);
    setFormData({
      eventId: '',
      type: 'expense',
      category: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    });
    setErrors({});
    setIsModalOpen(true);
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = {
      eventId: 'Event',
      category: 'Category',
      description: 'Description',
      amount: 'Amount',
      date: 'Date'
    };
    
    Object.entries(requiredFields).forEach(([field, label]) => {
      const error = validateRequired(formData[field], label);
      if (error) newErrors[field] = error;
    });
    
    // Numeric validation
    const amountError = validateNumeric(formData.amount, 'Amount');
    if (amountError) newErrors.amount = amountError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
   e.preventDefault();
    setLoading(true);
    
    const submitForm = async () => {
      if (!validateForm()) {
        toast.error('Please fix the errors in the form.');
        setLoading(false);
        return;
      }
      
      try {
        // Format the transaction data for the API
        const transactionData = {
          Name: formData.description, // Use description as the Name field
          type: formData.type,
          category: formData.category,
          description: formData.description,
          amount: parseFloat(formData.amount),
          date: formData.date,
          status: formData.status,
          event: parseInt(formData.eventId)
        };
        
        if (currentItem) {
          // Update existing transaction
          await financeService.updateFinancialTransaction(currentItem.id, transactionData);
          toast.success('Financial transaction updated successfully!');
        } else {
          // Create new transaction
          await financeService.createFinancialTransaction(transactionData);
          toast.success('Financial transaction created successfully!');
        }
        
        // Refresh finance list from server
        const data = await financeService.fetchFinancialTransactions({
          searchQuery: searchQuery,
          eventId: eventFilter !== 'all' ? eventFilter : null,
          type: typeFilter !== 'all' ? typeFilter : null
        });
        
        // Map returned data to expected format
        const formattedFinances = data.map(transaction => ({
          id: transaction.Id,
          type: transaction.type,
          category: transaction.category,
          description: transaction.description,
          amount: transaction.amount,
          date: transaction.date,
          status: transaction.status,
          eventId: transaction.event,
          eventName: transaction.eventDetails?.Name || 'Unknown Event'
        }));
        
        setFinances(formattedFinances);
        setIsModalOpen(false);
      } catch (error) {
        toast.error('An error occurred while saving the transaction: ' + (error.message || 'Unknown error'));
        console.error('Error saving transaction:', error);
      } finally {
        setLoading(false);
      }
    };
    
    submitForm();
  };
  
  // Handle finance item deletion
  const handleDeleteItem = (itemId) => {
    if (window.confirm('Are you sure you want to delete this financial record?')) {
      setLoading(true);
      financeService.deleteFinancialTransaction(itemId)
        .then(() => {
          setFinances(finances.filter(item => item.id !== itemId));
          toast.success('Financial transaction deleted successfully!');
        })
        .catch(error => {
          toast.error('Failed to delete transaction: ' + (error.message || 'Unknown error'));
        })
        .finally(() => setLoading(false));
    }
  };
  
  // Apply filters
  const filteredFinances = useMemo(() => {
    let result = finances?.length ? [...finances] : [];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }
    
    if (eventFilter !== 'all') {
      result = result.filter(item => item.eventId === parseInt(eventFilter));
    }
    
    if (typeFilter !== 'all') {
      result = result.filter(item => item.type === typeFilter);
    }
    
    // Sort by date (most recent first)
    result.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return result;
  }, [finances, searchQuery, eventFilter, typeFilter]);
  
  // Calculate finance summary
  const summary = useMemo(() => {
    const income = finances.filter(item => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
    const expenses = finances.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
    const balance = income - expenses;
    const pendingExpenses = finances.filter(item => item.type === 'expense' && item.status === 'pending').reduce((sum, item) => sum + item.amount, 0);
    
    return { income, expenses, balance, pendingExpenses };
  }, [finances]);
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Get event name by ID
  const getEventName = (eventId) => {
    const event = events?.find(event => event.id === eventId);
    return event ? event.title : 'Unknown Event';
  };
  
  // Get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'paid':
      case 'received':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };
  
  // Budget vs Actual chart options
  const budgetChartOptions = {
    chart: {
      type: 'bar',
      stacked: false,
      toolbar: {
        show: false
      },
      fontFamily: 'Inter, ui-sans-serif, system-ui',
      foreColor: darkMode ? '#cbd5e1' : '#64748b',
    },
    colors: ['#6366f1', '#f97316'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5
      },
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      borderColor: darkMode ? '#334155' : '#e2e8f0',
      row: {
        opacity: 0.5
      }
    },
    tooltip: {
      theme: darkMode ? 'dark' : 'light',
      y: {
        formatter: (value) => `$${value.toLocaleString()}`
      }
    },
    xaxis: {
      categories: financialMetrics.eventProfitability.map(item => item.event),
      axisBorder: {
        show: false
      }
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${value.toLocaleString()}`
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: darkMode ? '#cbd5e1' : '#64748b'
      }
    }
  };

  const budgetChartSeries = [
    {
      name: 'Budget',
      data: financialMetrics.eventProfitability.map(item => item.revenue)
    },
    {
      name: 'Actual Expenses',
      data: financialMetrics.eventProfitability.map(item => item.expenses)
    }
  ];

  return (
    <>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Financial Management</h1>
          <p className="text-surface-600 dark:text-surface-400">
            Track income, expenses and budgets for your events
          </p>
        </div>
        <button 
          onClick={handleNewItem}
          className="btn btn-primary flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add Transaction
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {loading ? (
        <div className="flex justify-center items-center py-20 col-span-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-surface-600 dark:text-surface-400">Total Income</h3>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(summary.income)}</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-surface-600 dark:text-surface-400">Total Expenses</h3>
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <TrendingDown size={20} className="text-red-600 dark:text-red-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(summary.expenses)}</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-surface-600 dark:text-surface-400">Net Balance</h3>
              <div className={`p-2 ${summary.balance >= 0 ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'} rounded-lg`}>
                <DollarSign size={20} className={summary.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {formatCurrency(summary.balance)}
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-surface-600 dark:text-surface-400">Pending Expenses</h3>
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <DollarSign size={20} className="text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <p className="text-2xl font-bold">{formatCurrency(summary.pendingExpenses)}</p>
          </motion.div>
        </>
      )}
      </div>
      
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6 mb-8"
        >
          <h3 className="text-lg font-medium mb-4">Budget vs Actual Expenses</h3>
          <div className="h-80">
            <Chart options={budgetChartOptions} series={budgetChartSeries} type="bar" height="100%" />
          </div>
        </motion.div>
        
        {/* Transactions List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card overflow-hidden"
        >
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <h3 className="text-lg font-medium">Financial Transactions</h3>
          </div>
            {/* Filters */}
            <div className="p-6 border-b border-surface-200 dark:border-surface-700 flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">               
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-surface-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10"
                />
              </div>
              <div className="flex gap-4">
                <div className="relative md:w-48">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter size={18} className="text-surface-400" />
                  </div>
                  <select
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                    className="input pl-10 appearance-none"
                  >
                    <option value="all">All Events</option>
                    {events.map(event => (
                      <option key={event.id} value={event.id}>{event.title}</option>
                    ))}
                  </select>
                </div>
              <div className="relative md:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter size={18} className="text-surface-400" />
                </div>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="input pl-10 appearance-none"
                >
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              </div>
            </div>
          </div>  {filteredFinances.length > 0 ? (
              <table className="w-full">
                <thead className="bg-surface-100 dark:bg-surface-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                  {filteredFinances.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400">{item.eventName || getEventName(item.eventId)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400">{formatDate(item.date)}</td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${item.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex justify-end space-x-2">
                          <button 
                            onClick={() => handleEditItem(item)}
                            className="text-primary hover:text-primary-dark"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <DollarSign size={48} className="mx-auto text-surface-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No transactions found</h3>
                <p className="text-surface-500 dark:text-surface-400 max-w-md mx-auto mb-6">
                  {searchQuery || eventFilter !== 'all' || typeFilter !== 'all' 
                    ? "No transactions match your current filters. Try adjusting your search criteria."
                    : "You haven't added any financial transactions yet. Click the 'Add Transaction' button to get started."}
                </p>
                {(searchQuery || eventFilter !== 'all' || typeFilter !== 'all') && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setEventFilter('all');
                      setTypeFilter('all');
                    }}
                    className="btn btn-outline"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
      <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentItem ? "Edit Transaction" : "Add Transaction"}>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event */}
              <div className="col-span-full">
                <label htmlFor="eventId" className="label">Event</label>
                <select
                  id="eventId"
                  name="eventId"
                  value={formData.eventId}
                  onChange={handleInputChange}
                  className={`input ${errors.eventId ? 'border-red-500 focus:ring-red-500' : ''}`}
                >
                  <option value="">Select an event</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>{event.title || event.Name}</option>
                  ))}
                </select>
                {errors.eventId && <p className="mt-1 text-sm text-red-500">{errors.eventId}</p>}
              </div>
              
              {/* Transaction Type */}
              <div>
                <label htmlFor="type" className="label">Transaction Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="income"
                      checked={formData.type === 'income'}
                      onChange={handleInputChange}
                      className="text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="ml-2 text-sm">Income</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="expense"
                      checked={formData.type === 'expense'}
                      onChange={handleInputChange}
                      className="text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="ml-2 text-sm">Expense</span>
                  </label>
                </div>
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="category" className="label">Category</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag size={16} className="text-surface-400" />
                  </div>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`input pl-10 ${errors.category ? 'border-red-500 focus:ring-red-500' : ''}`}
                  >
                    <option value="">Select category</option>
                    {formData.type === 'income' ? (
                      <>
                        <option value="Deposit">Deposit</option>
                        <option value="Payment">Payment</option>
                        <option value="Refund">Refund</option>
                      </>
                    ) : (
                      expenseCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))
                    )}
                  </select>
                </div>
                {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
              </div>
              
              {/* Description */}
              <div className="col-span-full">
                <label htmlFor="description" className="label">Description</label>
                <input
                  id="description"
                  name="description"
                  type="text"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`input ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Brief description of the transaction"
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
              </div>
              
              {/* Amount */}
              <div>
                <label htmlFor="amount" className="label">Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign size={16} className="text-surface-400" />
                  </div>
                  <input
                    id="amount"
                    name="amount"
                    type="text"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className={`input pl-10 ${errors.amount ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="0.00"
                  />
                </div>
                {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
              </div>
              
              {/* Date */}
              <div>
                <label htmlFor="date" className="label">Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarRange size={16} className="text-surface-400" />
                  </div>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`input pl-10 ${errors.date ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                </div>
                {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
              </div>
              
              {/* Status */}
              <div>
                <label htmlFor="status" className="label">Status</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard size={16} className="text-surface-400" />
                  </div>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="input pl-10"
                  >
                    {formData.type === 'income' ? (
                      <>
                        <option value="pending">Pending</option>
                        <option value="received">Received</option>
                        <option value="cancelled">Cancelled</option>
                      </>
                    ) : (
                      <>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="cancelled">Cancelled</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-700">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}>
                {currentItem ? (
                  <>
                    <CheckCircle size={18} className="mr-2" />
                    Update Transaction
                  </>
                ) : (
                  <>
                    <Plus size={18} className="mr-2" />
                    Add Transaction
                  </>
                )}
              </button>
            </div>
          </form>
      </FormModal>
    </>
  );
}

export default Finances;