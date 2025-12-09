import { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import './Statistics.css';

function Statistics() {
  const [period, setPeriod] = useState('month');
  const [transactions, setTransactions] = useState([]);
  const [animateValues, setAnimateValues] = useState(false);

  // Загрузка транзакций
  useEffect(() => {
    const stored = localStorage.getItem('transactions');
    if (stored) {
      setTransactions(JSON.parse(stored));
    }
  }, []);

  // Анимация значений при изменении периода
  useEffect(() => {
    setAnimateValues(true);
    const timer = setTimeout(() => setAnimateValues(false), 1000);
    return () => clearTimeout(timer);
  }, [period]);

  // Фильтрация транзакций по периоду
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
      case 'quarter':
        filterDate.setMonth(now.getMonth() - 3);
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
      const category = transaction.title || 'Без категории';
      
      if (!stats[category]) {
        stats[category] = { 
          income: 0, 
          expense: 0,
          count: 0
        };
      }
      
      if (transaction.type === 'income') {
        stats[category].income += transaction.amount;
      } else {
        stats[category].expense += transaction.amount;
      }
      stats[category].count++;
    });
    
    return Object.entries(stats)
      .map(([category, data]) => ({
        category,
        ...data,
        total: data.income - data.expense,
        incomePercentage: data.income > 0 ? (data.income / (data.income + data.expense)) * 100 : 0,
        expensePercentage: data.expense > 0 ? (data.expense / (data.income + data.expense)) * 100 : 0
      }))
      .sort((a, b) => Math.abs(b.total) - Math.abs(a.total))
      .slice(0, 10); // Показываем топ-10 категорий
  }, [filteredTransactions]);

  // Общая статистика
  const totalStats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const avgIncome = filteredTransactions
      .filter(t => t.type === 'income').length > 0 
      ? income / filteredTransactions.filter(t => t.type === 'income').length 
      : 0;
    
    const avgExpense = filteredTransactions
      .filter(t => t.type === 'expense').length > 0 
      ? expense / filteredTransactions.filter(t => t.type === 'expense').length 
      : 0;
    
    return {
      income,
      expense,
      balance: income - expense,
      transactionCount: filteredTransactions.length,
      incomeTransactions: filteredTransactions.filter(t => t.type === 'income').length,
      expenseTransactions: filteredTransactions.filter(t => t.type === 'expense').length,
      avgIncome,
      avgExpense
    };
  }, [filteredTransactions]);

  // Форматирование чисел
  const formatCurrency = (amount) => {
    return amount.toLocaleString('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // Данные для графика
  const chartData = useMemo(() => {
    if (categoryStats.length === 0) return [];
    
    return categoryStats.slice(0, 8).map(stat => ({
      category: stat.category,
      income: stat.income,
      expense: stat.expense,
      maxValue: Math.max(stat.income, stat.expense, 1)
    }));
  }, [categoryStats]);

  // Максимальное значение для масштабирования графика
  const maxChartValue = useMemo(() => {
    if (chartData.length === 0) return 1;
    return Math.max(...chartData.map(d => d.maxValue));
  }, [chartData]);

  return (
    <Container className="statistics-container">
      {/* Декоративные элементы */}
      <div className="stat-decor" style={{ top: '10%', left: '5%' }}>📊</div>
      <div className="stat-decor" style={{ bottom: '20%', right: '8%' }}>💹</div>

      <h1 className="page-title">Статистика</h1>
      
      {/* Фильтр по периоду */}
      <Row className="mb-4">
        <Col className="text-center">
          <Form.Select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className="period-select"
          >
            <option value="week">📅 За неделю</option>
            <option value="month">📅 За месяц</option>
            <option value="quarter">📅 За квартал</option>
            <option value="year">📅 За год</option>
            <option value="all">📅 За все время</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Общая статистика */}
      <Row className="mb-4 g-4">
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <Card.Title>
                <span style={{ marginRight: '10px' }}>📈</span>
                Доходы
              </Card.Title>
              <Card.Text 
                className="text-success"
                style={{ animation: animateValues ? 'countUp 1s ease-out' : 'none' }}
              >
                +{formatCurrency(totalStats.income)} ₽
              </Card.Text>
              <small className="text-muted" style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                {totalStats.incomeTransactions} транзакций
              </small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <Card.Title>
                <span style={{ marginRight: '10px' }}>📉</span>
                Расходы
              </Card.Title>
              <Card.Text 
                className="text-danger"
                style={{ animation: animateValues ? 'countUp 1s ease-out' : 'none' }}
              >
                -{formatCurrency(totalStats.expense)} ₽
              </Card.Text>
              <small className="text-muted" style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                {totalStats.expenseTransactions} транзакций
              </small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <Card.Title>
                <span style={{ marginRight: '10px' }}>⚖️</span>
                Баланс
              </Card.Title>
              <Card.Text 
                className={totalStats.balance >= 0 ? 'text-success' : 'text-danger'}
                style={{ animation: animateValues ? 'countUp 1s ease-out' : 'none' }}
              >
                {totalStats.balance >= 0 ? '+' : ''}{formatCurrency(totalStats.balance)} ₽
              </Card.Text>
              <small className="text-muted" style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                {totalStats.balance >= 0 ? 'Положительный' : 'Отрицательный'}
              </small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <Card.Title>
                <span style={{ marginRight: '10px' }}>🔄</span>
                Транзакции
              </Card.Title>
              <Card.Text style={{ 
                fontSize: '2.2rem',
                fontWeight: '700',
                color: '#8b5cf6',
                textShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
                animation: animateValues ? 'countUp 1s ease-out' : 'none'
              }}>
                {totalStats.transactionCount}
              </Card.Text>
              <small className="text-muted" style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                Всего операций
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Визуализация данных */}
      {chartData.length > 0 && (
        <div className="chart-container">
          <h3 className="chart-title">Распределение по категориям</h3>
          <div className="chart">
            {chartData.map((data, index) => (
              <div key={index} className="chart-bar">
                <div 
                  className="bar-income"
                  style={{ 
                    height: `${(data.income / maxChartValue) * 150}px`,
                    opacity: data.income > 0 ? 1 : 0
                  }}
                  title={`Доходы: ${formatCurrency(data.income)} ₽`}
                ></div>
                <div 
                  className="bar-expense"
                  style={{ 
                    height: `${(data.expense / maxChartValue) * 150}px`,
                    opacity: data.expense > 0 ? 1 : 0
                  }}
                  title={`Расходы: ${formatCurrency(data.expense)} ₽`}
                ></div>
                <div className="bar-label">
                  {data.category.length > 8 
                    ? data.category.substring(0, 8) + '...' 
                    : data.category}
                </div>
              </div>
            ))}
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '30px', 
            marginTop: '20px',
            fontSize: '0.9rem',
            color: 'rgba(226, 232, 240, 0.7)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                background: '#10b981',
                borderRadius: '2px'
              }}></div>
              <span>Доходы</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                background: '#ef4444',
                borderRadius: '2px'
              }}></div>
              <span>Расходы</span>
            </div>
          </div>
        </div>
      )}

      {/* Статистика по категориям */}
      <Row className="mt-4">
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5>📊 Топ категорий</h5>
            </Card.Header>
            <Card.Body>
              {categoryStats.length > 0 ? (
                <div className="category-stats">
                  {categoryStats.map((stat, index) => (
                    <div 
                      key={index} 
                      className="category-item"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="category-info">
                        <span className="category-name">
                          {stat.category}
                          {index < 3 && (
                            <span style={{
                              marginLeft: '10px',
                              background: index === 0 
                                ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                                : index === 1
                                ? 'linear-gradient(135deg, #94a3b8, #64748b)'
                                : 'linear-gradient(135deg, #92400e, #78350f)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              fontSize: '0.9rem',
                              fontWeight: '700'
                            }}>
                              #{index + 1}
                            </span>
                          )}
                        </span>
                        <span className="category-count">
                          {stat.count} {stat.count === 1 ? 'транзакция' : 
                            stat.count >= 2 && stat.count <= 4 ? 'транзакции' : 
                            'транзакций'}
                        </span>
                      </div>
                      <div className="category-amounts">
                        {stat.income > 0 && (
                          <span className="text-success">
                            ↑ +{formatCurrency(stat.income)} ₽
                            {stat.incomePercentage > 0 && (
                              <small style={{ 
                                marginLeft: '8px', 
                                opacity: 0.7,
                                fontSize: '0.9rem'
                              }}>
                                {stat.incomePercentage.toFixed(0)}%
                              </small>
                            )}
                          </span>
                        )}
                        {stat.expense > 0 && (
                          <span className="text-danger">
                            ↓ -{formatCurrency(stat.expense)} ₽
                            {stat.expensePercentage > 0 && (
                              <small style={{ 
                                marginLeft: '8px', 
                                opacity: 0.7,
                                fontSize: '0.9rem'
                              }}>
                                {stat.expensePercentage.toFixed(0)}%
                              </small>
                            )}
                          </span>
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
        
        <Col lg={4}>
          <Card style={{ height: '100%' }}>
            <Card.Header>
              <h5>📈 Средние значения</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '25px',
                height: '100%',
                justifyContent: 'center'
              }}>
                <div>
                  <h6 style={{ 
                    color: 'rgba(226, 232, 240, 0.7)',
                    fontSize: '1rem',
                    marginBottom: '10px'
                  }}>
                    Средний доход на транзакцию:
                  </h6>
                  <div style={{ 
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    color: '#10b981'
                  }}>
                    {formatCurrency(totalStats.avgIncome)} ₽
                  </div>
                </div>
                
                <div>
                  <h6 style={{ 
                    color: 'rgba(226, 232, 240, 0.7)',
                    fontSize: '1rem',
                    marginBottom: '10px'
                  }}>
                    Средний расход на транзакцию:
                  </h6>
                  <div style={{ 
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    color: '#ef4444'
                  }}>
                    {formatCurrency(totalStats.avgExpense)} ₽
                  </div>
                </div>
                
                <div>
                  <h6 style={{ 
                    color: 'rgba(226, 232, 240, 0.7)',
                    fontSize: '1rem',
                    marginBottom: '10px'
                  }}>
                    Соотношение доход/расход:
                  </h6>
                  <div style={{ 
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    color: totalStats.income > totalStats.expense ? '#10b981' : '#ef4444'
                  }}>
                    {totalStats.expense > 0 
                      ? (totalStats.income / totalStats.expense).toFixed(2)
                      : '∞'} : 1
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Statistics;