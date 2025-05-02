import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useExpenseStore = create(
  persist(
    (set, get) => ({
      transactions: [],
      filter: { category: 'All', startDate: null, endDate: null },

      addTransaction: (transaction) => {
        console.log('Adding transaction:', transaction);
        set((state) => ({
          transactions: [...state.transactions, { id: Date.now(), ...transaction }],
        }));
      },

      deleteTransaction: (id) => {
        console.log('Deleting transaction:', id);
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      setFilter: (filter) => {
        console.log('Setting filter:', filter);
        set((state) => ({ filter: { ...state.filter, ...filter } }));
      },

      getBalance: () =>
        get().transactions.reduce(
          (sum, t) => sum + (t.type === 'income' ? t.amount : -t.amount),
          0
        ),

      getFilteredTransactions: () => {
        const { transactions, filter } = get();
        return transactions.filter((t) => {
          const matchesCategory =
            filter.category === 'All' || t.category === filter.category;
          const matchesDate =
            (!filter.startDate || new Date(t.date) >= new Date(filter.startDate)) &&
            (!filter.endDate || new Date(t.date) <= new Date(filter.endDate));
          return matchesCategory && matchesDate;
        });
      },

      getSummaryByCategory: () => {
        const { transactions } = get();
        return transactions.reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + (t.type === 'income' ? t.amount : -t.amount);
          return acc;
        }, {});
      },
    }),
    {
      name: 'expense-storage',
    }
  )
);

export default useExpenseStore;