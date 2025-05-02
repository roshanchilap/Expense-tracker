import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import useExpenseStore from '../store/expenseStore';
import './css/TransactionList.css';

function TransactionList() {
  const transactions = useExpenseStore(
    useShallow((state) => state.getFilteredTransactions())
  );
  const deleteTransaction = useExpenseStore((state) => state.deleteTransaction);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate paginated transactions
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = transactions.slice(startIndex, endIndex);

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
    <div className="transaction-list-container">
      <h3 className="transaction-list-heading">Transactions</h3>
      {transactions.length === 0 ? (
        <p className="no-transactions">No transactions found.</p>
      ) : (
        <>
          <div className="transactions-wrapper">
            {/* Table for desktop */}
            <table className="transaction-table desktop-only">
              <thead>
                <tr className="table-header">
                  <th className="table-header-cell">Description</th>
                  <th className="table-header-cell">Amount</th>
                  <th className="table-header-cell">Type</th>
                  <th className="table-header-cell">Category</th>
                  <th className="table-header-cell">Date</th>
                  <th className="table-header-cell">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((t) => (
                  <tr key={t.id} className="table-row">
                    <td className="table-cell">
                      {t.description || 'No description'}
                    </td>
                    <td className="table-cell">${t.amount.toFixed(2)}</td>
                    <td className="table-cell text-capitalize">{t.type}</td>
                    <td className="table-cell">{t.category}</td>
                    <td className="table-cell">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => deleteTransaction(t.id)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Card layout for mobile */}
            <div className="transaction-cards mobile-only">
              {paginatedTransactions.map((t) => (
                <div key={t.id} className="transaction-card">
                  <div className="transaction-card-header">
                    <span className="transaction-description">
                      {t.description || 'No description'}
                    </span>
                    <span className={`transaction-amount ${t.amount >= 0 ? 'amount-positive' : 'amount-negative'}`}>
                      ${t.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="transaction-card-body">
                    <p className="transaction-detail">
                      <span className="detail-label">Type:</span> <span className="text-capitalize">{t.type}</span>
                    </p>
                    <p className="transaction-detail">
                      <span className="detail-label">Category:</span> {t.category}
                    </p>
                    <p className="transaction-detail">
                      <span className="detail-label">Date:</span> {new Date(t.date).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteTransaction(t.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Pagination Controls */}
          <div className="pagination-container">
            <button
              onClick={goToPreviousPage}
              className="pagination-button"
              disabled={currentPage === 1}
              aria-label="Previous page"
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
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TransactionList;