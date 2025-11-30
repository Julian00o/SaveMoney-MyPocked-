import { useState, useEffect } from 'react';
import Lobby from '../Components/Lobby/Lobby.jsx';
import AddTransaction from '../Components/AddTransaction/AddTransaction.jsx';
import './Home.css';

function Home() {
  const [transactions, setTransactions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("transactions");
    if (stored) {
      setTransactions(JSON.parse(stored));
    } else {
      const mockTransactions = [
        { id: 1, title: "Еда", amount: 300, type: "expense", date: "2025-11-29" },
        { id: 2, title: "Зарплата", amount: 20000, type: "income", date: "2025-11-28" }
      ];
      setTransactions(mockTransactions);
      localStorage.setItem("transactions", JSON.stringify(mockTransactions));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  const handleAddTransaction = (transaction) => {
    const newTransaction = {
      ...transaction,
      id: Date.now()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  };

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="homeContainer">
      <div className="summary">
        <div className="balanceBox">
          <p>Баланс:</p>
          <h2>{balance} сом</h2>
        </div>
        <div className="totalsBox">
          <p>Доходы: <span className="income">{totalIncome} сом</span></p>
          <p>Расходы: <span className="expense">{totalExpense} сом</span></p>
        </div>
      </div>

      <AddTransaction onAdd={handleAddTransaction} />
      <Lobby 
        data={transactions} 
        onDelete={handleDeleteTransaction} 
      />
    </div>
  );
}

export default Home;