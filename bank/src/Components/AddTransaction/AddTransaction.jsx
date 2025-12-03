import { useState } from "react";
import "./AddTransaction.css";

function AddTransaction({ onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !amount) return; // проверка на пустые поля

    const newTransaction = {
      id: Date.now(),
      title,
      amount: Number(amount),
      type,
      date: new Date().toISOString().split("T")[0] // yyyy-mm-dd
    };

    onAdd(newTransaction);

    // очистка формы
    setTitle("");
    setAmount("");
    setType("income");
  };

  return (
    <form className="addTransactionForm" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Сумма"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="income">Доход</option>
        <option value="expense">Расход</option>
      </select>
      <button type="submit">Добавить</button>
    </form>
  );
}

export default AddTransaction;
