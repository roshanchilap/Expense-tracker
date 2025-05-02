import { useState } from 'react';
import useExpenseStore from '../store/expenseStore';
import './css/TransactionForm.css'; // Import the CSS file

const categories = ['Food', 'Rent', 'Salary', 'Utilities', 'Entertainment', 'Other'];

function TransactionForm() {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(categories[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const addTransaction = useExpenseStore((state) => state.addTransaction);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount)) return alert('Please enter a valid amount');
    addTransaction({
      amount: parseFloat(amount),
      type,
      category,
      date,
      description,
    });
    setAmount('');
    setDescription('');
    setCategory('');
  };
  
  const handleReset = (e) =>{
    e.preventDefault();
    setAmount('');
    setDescription('');
    setCategory('');
  }

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <h3 className="form-heading">Add Transaction</h3>
      <div className="form-group">
        <input
          type="number"
          className="form-input"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <select
          className="form-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <div className="form-group">
        <select
          className="form-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <input
          type="date"
          className="form-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          className="form-input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-group">
        <button type="submit" className="form-button">
          Add Transaction
        </button>
        <button type="submit" className="form-button" onClick={handleReset}>
          Reset
        </button>
      </div>
    </form>
  );
}

export default TransactionForm;