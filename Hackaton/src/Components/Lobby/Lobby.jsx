import './Lobby.css'; // если у вас есть отдельный CSS файл

function Lobby({ data, onDelete }) {
  return (
    <div className="lobby">
      <h2 style={{color: 'white'}}>История транзакций</h2>
      {data.length === 0 ? (
        <p style={{color: 'white'}}>Нет транзакций</p>
      ) : (
        <div className="transactions-list">
          {data.map((transaction) => (
            <div 
              key={transaction.id} 
              className={`transaction-item ${transaction.type}`}
            >
              <div className="transaction-info">
                <span className="title">{transaction.title}</span>
                <span className="date">{transaction.date}</span>
                <span className={`amount ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'}{transaction.amount} сом
                </span>
              </div>
              <button 
                className="delete-btn"
                onClick={() => onDelete(transaction.id)}
                title="Удалить транзакцию"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Lobby;
