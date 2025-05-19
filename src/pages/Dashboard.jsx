import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Chart from 'react-apexcharts';
import { Calendar, Clock, DollarSign, Users, TrendingUp, BarChart2, Check, AlertCircle, ChevronRight } from 'lucide-react';
import { events, clients, financialMetrics } from '../utils/mockData';
import { formatCurrency } from '../utils/formUtils';

function Dashboard() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  // Update chart theme when dark mode changes
  const updateDarkMode = () => {
    setDarkMode(document.documentElement.classList.contains('dark'));
  };

  // Listen for dark mode changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateDarkMode);
  document.addEventListener('darkmodechange', updateDarkMode);

  // Get upcoming events
  const upcomingEvents = [...events]
    .filter(event => new Date(event.startDate) > new Date())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 5);

  // Get recent clients
  const recentClients = [...clients].slice(0, 4);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Revenue chart options
  const revenueChartOptions = {
    chart: {
      type: 'area',
      toolbar: {
        show: false
      },
      fontFamily: 'Inter, ui-sans-serif, system-ui',
      foreColor: darkMode ? '#cbd5e1' : '#64748b',
    },
    colors: ['#6366f1', '#f97316'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
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
    },
    xaxis: {
      categories: financialMetrics.monthlyBreakdown.map(item => item.month),
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

  const revenueChartSeries = [
    {
      name: 'Revenue',
      data: financialMetrics.monthlyBreakdown.map(item => item.revenue)
    },
    {
      name: 'Expenses',
      data: financialMetrics.monthlyBreakdown.map(item => item.expenses)
    }
  ];

  // Event profitability chart options
  const eventProfitChartOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      },
      fontFamily: 'Inter, ui-sans-serif, system-ui',
      foreColor: darkMode ? '#cbd5e1' : '#64748b',
      stacked: true
    },
    colors: ['#6366f1', '#f97316', '#14b8a6'],
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

  const eventProfitChartSeries = [
    {
      name: 'Revenue',
      data: financialMetrics.eventProfitability.map(item => item.revenue)
    },
    {
      name: 'Expenses',
      data: financialMetrics.eventProfitability.map(item => item.expenses)
    },
    {
      name: 'Profit',
      data: financialMetrics.eventProfitability.map(item => item.profit)
    }
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-surface-600 dark:text-surface-400">
          Welcome to your Event Planner CRM dashboard
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-surface-600 dark:text-surface-400">Upcoming Events</h3>
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Calendar size={20} className="text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-2">{upcomingEvents.length}</p>
          <div className="flex items-center text-sm">
            <span className="text-emerald-500 flex items-center">
              <TrendingUp size={14} className="mr-1" />
              2 new this month
            </span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-surface-600 dark:text-surface-400">Total Clients</h3>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Users size={20} className="text-secondary" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-2">{clients.length}</p>
          <div className="flex items-center text-sm">
            <span className="text-emerald-500 flex items-center">
              <TrendingUp size={14} className="mr-1" />
              3 new this month
            </span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-surface-600 dark:text-surface-400">Total Revenue</h3>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
              <DollarSign size={20} className="text-emerald-500" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-2">{formatCurrency(financialMetrics.totalRevenue)}</p>
          <div className="flex items-center text-sm">
            <span className="text-emerald-500 flex items-center">
              <TrendingUp size={14} className="mr-1" />
              {financialMetrics.profitMargin}% profit margin
            </span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-surface-600 dark:text-surface-400">Active Tasks</h3>
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <Clock size={20} className="text-red-500" />
            </div>
          </div>
          <p className="text-3xl font-bold mb-2">12</p>
          <div className="flex items-center text-sm">
            <span className="text-red-500 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              3 overdue tasks
            </span>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <div className="flex items-center mb-4">
            <BarChart2 size={20} className="mr-2 text-primary" />
            <h3 className="text-lg font-medium">Revenue & Expenses</h3>
          </div>
          <div className="h-80">
            <Chart options={revenueChartOptions} series={revenueChartSeries} type="area" height="100%" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="card p-6"
        >
          <div className="flex items-center mb-4">
            <BarChart2 size={20} className="mr-2 text-primary" />
            <h3 className="text-lg font-medium">Event Profitability</h3>
          </div>
          <div className="h-80">
            <Chart options={eventProfitChartOptions} series={eventProfitChartSeries} type="bar" height="100%" />
          </div>
        </motion.div>
      </div>

      {/* Upcoming Events List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="card p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Calendar size={20} className="mr-2 text-primary" />
            <h3 className="text-lg font-medium">Upcoming Events</h3>
          </div>
          <button 
            onClick={() => navigate('/events')}
            className="text-sm text-primary hover:text-primary-dark flex items-center"
          >
            View All <ChevronRight size={16} />
          </button>
        </div>
        
        {upcomingEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700">
                  <th className="px-4 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">Event</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {upcomingEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">{event.title}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{event.client}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{formatDate(event.startDate)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.status === 'Confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                        event.status === 'Planning' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-surface-500 dark:text-surface-400 py-8">No upcoming events scheduled</p>
        )}
      </motion.div>

      {/* Recent Clients */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Users size={20} className="mr-2 text-primary" />
            <h3 className="text-lg font-medium">Recent Clients</h3>
          </div>
          <button 
            onClick={() => navigate('/clients')}
            className="text-sm text-primary hover:text-primary-dark flex items-center"
          >
            View All <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentClients.map((client) => (
            <div key={client.id} className="flex items-center p-4 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-md mr-4 flex-shrink-0">
                {client.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{client.name}</p>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1 truncate">{client.email}</p>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-100 dark:bg-surface-700 text-surface-800 dark:text-surface-200 ml-2">
                {client.type}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

export default Dashboard;