import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';

function Finances() {
  // Sample data for the chart
  const revenueData = {
    options: {
      chart: {
        id: 'revenue-chart',
        toolbar: {
          show: false
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
      colors: ['#6366f1', '#f97316'],
      legend: {
        position: 'top'
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100]
        }
      }
    },
    series: [
      {
        name: 'Revenue',
        data: [30500, 41200, 35800, 51000, 49000, 62000, 69000, 91000, 85000, 94000, 101000, 112000]
      },
      {
        name: 'Expenses',
        data: [22000, 28000, 25000, 35000, 38000, 45000, 50000, 65000, 60000, 68000, 74000, 82000]
      }
    ]
  };

  const budgetSummaryList = [
    { id: 1, event: 'Corporate Retreat 2023', budget: 45000, spent: 32000, remaining: 13000, status: 'On Track' },
    { id: 2, event: 'Product Launch', budget: 32000, spent: 28000, remaining: 4000, status: 'At Risk' },
    { id: 3, event: 'Annual Gala', budget: 75000, spent: 45000, remaining: 30000, status: 'On Track' },
    { id: 4, event: 'Team Building Workshop', budget: 15000, spent: 15000, remaining: 0, status: 'Complete' },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Financial Management</h1>
        <p className="text-surface-600 dark:text-surface-400">
          Track event budgets, expenses, and financial performance
        </p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Annual Revenue & Expenses</h2>
        <Chart
          options={revenueData.options}
          series={revenueData.series}
          type="area"
          height={350}
        />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
        className="card overflow-hidden"
      >
        <h2 className="text-xl font-semibold p-6 border-b border-surface-200 dark:border-surface-700">Event Budget Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-100 dark:bg-surface-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider">Spent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider">Remaining</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
              {budgetSummaryList.map((budget) => (
                <tr key={budget.id} className="hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{budget.event}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400">${budget.budget.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400">${budget.spent.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-600 dark:text-surface-400">${budget.remaining.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      budget.status === 'On Track' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : budget.status === 'At Risk' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {budget.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
}

export default Finances;