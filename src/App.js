import { useState } from 'react';
import useExpenseStore from './store/expenseStore';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Filter from './components/Filter';
import Summary from './components/Summary';
import './App.css';

function App() {
  const balance = useExpenseStore((state) => state.getBalance());

  return (
    <div className="app-container">
      <h1 className="app-heading">Expense Tracker</h1>
      
      {/* Balance */}
      <div className="balance-section">
        <h2 className="balance-heading">
          <span className="balance-icon">{balance >= 0 ? '💰' : '⚠️'}</span>
          Balance: <span className={`balance-amount ${balance >= 0 ? 'positive' : 'negative'}`}>
            ${balance.toFixed(2)}
          </span>
        </h2>
      </div>

      {/* Add Transaction Form */}
      <TransactionForm />

      {/* Filters */}
      <Filter />

      {/* Transaction List */}
      <TransactionList />

      {/* Summary/Chart */}
      <Summary />
    </div>
  );
}

export default App;