import { useCallback } from 'react';
import { debounce } from 'lodash';
import useExpenseStore from '../store/expenseStore';
import './css/Filter.css'; // Import the CSS file

const categories = ['All', 'Food', 'Rent', 'Salary', 'Utilities', 'Entertainment', 'Other'];

function Filter() {
  const setFilter = useExpenseStore((state) => state.setFilter);
  const filter = useExpenseStore((state) => state.filter);

  const debouncedSetFilter = useCallback(
    debounce((newFilter) => setFilter(newFilter), 300),
    []
  );

  return (
    <div className="filter-container">
      <h3 className="filter-heading">Filter Transactions</h3>
      <div className="filter-group">
        <label className="filter-label">Category:</label>
        <select
          className="filter-select"
          value={filter.category}
          onChange={(e) => debouncedSetFilter({ category: e.target.value })}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label className="filter-label">Start Date:</label>
        <input
          type="date"
          className="filter-input"
          value={filter.startDate ?? ''}
          onChange={(e) =>
            debouncedSetFilter({ startDate: e.target.value || null })
          }
        />
      </div>
      <div className="filter-group">
        <label className="filter-label">End Date:</label>
        <input
          type="date"
          className="filter-input"
          value={filter.endDate ?? ''}
          onChange={(e) =>
            debouncedSetFilter({ endDate: e.target.value || null })
          }
        />
      </div>
    </div>
  );
}

export default Filter;