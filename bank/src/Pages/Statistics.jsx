import { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import './Statistics.css';

function Statistics() {
  const [period, setPeriod] = useState('month');
  const [transactions] = useState(() => {
    const stored = localStorage.getItem('transactions');
    return stored ? JSON.parse(stored) : [];
  });

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const filterDate = new Date();
    
    switch (period) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return transactions;
    }
    
    return transactions.filter(t => new Date(t.date) >= filterDate);
  }, [transactions, period]);

  // Статистика по категориям
  const categoryStats = useMemo(() => {
    const stats = {};
    
    filteredTransactions.forEach(transaction => {
      if (!stats[transaction.title]) {
        stats[transaction.title] = { 
          income: 0, 
          expense: 0,
          count: 0
        };
      }
      
      if (transaction.type === 'income') {
        stats[transaction.title].income += transaction.amount;
      } else {
        stats[transaction.title].expense += transaction.amount;
      }
      stats[transaction.title].count++;
    });
    
    return Object.entries(stats)
      .map(([category, data]) => ({
        category,
        ...data,
        total: data.income - data.expense
      }))
      .sort((a, b) => Math.abs(b.total) - Math.abs(a.total));
  }, [filteredTransactions]);

  // Общая статистика
  const totalStats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expense,
      balance: income - expense,
      transactionCount: filteredTransactions.length
    };
  }, [filteredTransactions]);

  return (
    <Container className="statistics-container">
      <h1 className="page-title">Статистика</h1>
      
      {/* Фильтр по периоду */}
      <Row className="mb-4">
        <Col>
          <Form.Select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="period-select"
          >
            <option value="week">За неделю</option>
            <option value="month">За месяц</option>
            <option value="year">За год</option>
            <option value="all">За все время</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Общая статистика */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <Card.Title>Доходы</Card.Title>
              <Card.Text className="text-success">
                +{totalStats.income} сом
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <Card.Title>Расходы</Card.Title>
              <Card.Text className="text-danger">
                -{totalStats.expense} сом
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <Card.Title>Баланс</Card.Title>
              <Card.Text className={totalStats.balance >= 0 ? 'text-success' : 'text-danger'}>
                {totalStats.balance >= 0 ? '+' : ''}{totalStats.balance} сом
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body>
              <Card.Title>Транзакции</Card.Title>
              <Card.Text>{totalStats.transactionCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5>Статистика по категориям</h5>
            </Card.Header>
            <Card.Body>
              {categoryStats.length > 0 ? (
                <div className="category-stats">
                  {categoryStats.map((stat, index) => (
                    <div key={index} className="category-item">
                      <div className="category-info">
                        <span className="category-name">{stat.category}</span>
                        <span className="category-count">{stat.count} транз.</span>
                      </div>
                      <div className="category-amounts">
                        {stat.income > 0 && (
                          <span className="text-success">+{stat.income} сом</span>
                        )}
                        {stat.expense > 0 && (
                          <span className="text-danger">-{stat.expense} сом</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">Нет данных для выбранного периода</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Statistics;
