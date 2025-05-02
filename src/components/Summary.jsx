import { useMemo, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { useShallow } from 'zustand/react/shallow';
import useExpenseStore from '../store/expenseStore';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './css/Summary.css'; // Import the CSS file

ChartJS.register(ArcElement, Tooltip, Legend);

function Summary() {
  const summary = useExpenseStore(
    useShallow((state) => state.getSummaryByCategory())
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of categories per page

  // Sort state
  const [sortBy, setSortBy] = useState('name-asc'); // Options: name-asc, name-desc, amount-asc, amount-desc

  // Sort categories
  const sortedCategories = useMemo(() => {
    const entries = Object.entries(summary);
    switch (sortBy) {
      case 'name-asc':
        return entries.sort(([a], [b]) => a.localeCompare(b));
      case 'name-desc':
        return entries.sort(([a], [b]) => b.localeCompare(a));
      case 'amount-asc':
        return entries.sort(([, a], [, b]) => a - b);
      case 'amount-desc':
        return entries.sort(([, a], [, b]) => b - a);
      default:
        return entries;
    }
  }, [summary, sortBy]);

  // Paginate categories
  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = sortedCategories.slice(startIndex, endIndex);

  // Chart data (uses all categories, not paginated)
  const chartData = useMemo(() => ({
    labels: Object.keys(summary),
    datasets: [
      {
        data: Object.values(summary).map((val) => Math.abs(val)),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  }), [summary]);

  const exportCSV = () => {
    const csv = [
      'Category,Amount',
      ...Object.entries(summary).map(([category, amount]) => `${category},${amount.toFixed(2)}`),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle page navigation
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="summary-container">
      <h3 className="summary-heading">Spending by Category</h3>
      {/* Sort Controls */}
      <div className="sort-container">
        <label className="sort-label">Sort by:</label>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(1); // Reset to first page on sort
          }}
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="amount-asc">Amount (Low to High)</option>
          <option value="amount-desc">Amount (High to Low)</option>
        </select>
        <button className="export-button" onClick={exportCSV}>
          Export as CSV
        </button>
      </div>

      {/* Category List */}
      <ul className="summary-list">
        {paginatedCategories.length === 0 ? (
          <li className="no-categories">No categories found.</li>
        ) : (
          paginatedCategories.map(([category, amount]) => (
            <li key={category} className="summary-list-item">
              <span>{category}</span>
              <span className={amount >= 0 ? 'amount-positive' : 'amount-negative'}>
                ${amount.toFixed(2)}
              </span>
            </li>
          ))
        )}
      </ul>
      {/* Pagination Controls */}
      {sortedCategories.length > itemsPerPage && (
        <div className="pagination-container">
          <button
            onClick={goToPreviousPage}
            className="pagination-button"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            className="pagination-button"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
      
      {/* Pie Chart */}
      {Object.keys(summary).length > 0 && (
        <div className="chart-container">
          <Pie
            data={chartData}
            options={{
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
                  },
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const label = context.label || '';
                      const value = context.raw || 0;
                      return `${label}: $${value.toFixed(2)}`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Summary;