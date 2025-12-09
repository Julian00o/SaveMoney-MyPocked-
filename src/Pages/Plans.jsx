import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, ProgressBar } from 'react-bootstrap';
import './Plans.css';

function Plans() {
  const [goals, setGoals] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '0',
    deadline: '',
    category: 'other'
  });

  useEffect(() => {
    const stored = localStorage.getItem('financialGoals');
    if (stored) {
      setGoals(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('financialGoals', JSON.stringify(goals));
  }, [goals]);

  const handleCreateGoal = () => {
    const goal = {
      id: Date.now(),
      ...newGoal,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount),
      createdAt: new Date().toISOString(),
      completed: false
    };
    
    setGoals(prev => [...prev, goal]);
    setNewGoal({ 
      title: '', 
      targetAmount: '', 
      currentAmount: '0', 
      deadline: '',
      category: 'other' 
    });
    setShowModal(false);
  };

  const addToGoal = (id, amount) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === id) {
        const newAmount = goal.currentAmount + amount;
        return { 
          ...goal, 
          currentAmount: newAmount,
          completed: newAmount >= goal.targetAmount
        };
      }
      return goal;
    }));
  };

  const deleteGoal = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту цель?')) {
      setGoals(prev => prev.filter(goal => goal.id !== id));
    }
  };

  const getProgress = (goal) => {
    return (goal.currentAmount / goal.targetAmount) * 100;
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    const now = new Date();
    const target = new Date(deadline);
    const diff = target - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  // Статистика
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrent = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;
  const completedGoals = goals.filter(goal => goal.currentAmount >= goal.targetAmount).length;

  return (
    <Container className="plans-container">
      {/* Декоративные элементы */}
      <div className="floating-icon" style={{ top: '10%', left: '5%' }}>🚀</div>
      <div className="floating-icon" style={{ bottom: '20%', right: '8%' }}>💫</div>

      {/* Заголовок */}
      <div className="page-header">
        <h1 className="page-title">Финансовые цели</h1>
        <Button 
          variant="primary" 
          onClick={() => setShowModal(true)}
          style={{ padding: '15px 35px', fontSize: '1.2rem' }}
        >
          <span style={{ marginRight: '10px' }}>🎯</span>
          Новая цель
        </Button>
      </div>

      {/* Статистика */}
      {goals.length > 0 && (
        <div className="goals-stats">
          <div className="stats-header">
            <h2>Общая статистика</h2>
            <span style={{
              padding: '8px 20px',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '20px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#3b82f6',
              fontWeight: '600'
            }}>
              Всего целей: {goals.length}
            </span>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value" style={{color: '#3b82f6'}}>
                {formatCurrency(totalCurrent)}
              </div>
              <div className="stat-label">Собрано всего</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value" style={{color: '#8b5cf6'}}>
                {formatCurrency(totalTarget)}
              </div>
              <div className="stat-label">Все цели</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value" style={{color: '#22d3ee'}}>
                {totalProgress.toFixed(1)}%
              </div>
              <div className="stat-label">Общий прогресс</div>
            </div>
            
            <div className="stat-card">
              <div className="stat-value" style={{color: '#10b981'}}>
                {completedGoals}
              </div>
              <div className="stat-label">Выполнено целей</div>
            </div>
          </div>
        </div>
      )}

      {/* Список целей */}
      <Row>
        {goals.length > 0 ? (
          goals.map((goal, index) => {
            const progress = getProgress(goal);
            const daysLeft = getDaysLeft(goal.deadline);
            
            return (
              <Col md={6} lg={4} key={goal.id} className="mb-4">
                <Card className="goal-card">
                  <Card.Body>
                    <div className="goal-header">
                      <Card.Title>
                        {goal.completed ? '✅ ' : '🎯 '}
                        {goal.title}
                      </Card.Title>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => deleteGoal(goal.id)}
                        title="Удалить цель"
                      >
                        ×
                      </Button>
                    </div>
                    
                    <div className="goal-progress">
                      <ProgressBar 
                        now={progress} 
                        variant={progress >= 100 ? 'success' : 'primary'}
                      />
                      <div className="goal-amounts">
                        <span title="Текущая сумма">
                          {formatCurrency(goal.currentAmount)} ₽
                        </span>
                        <span title="Целевая сумма">
                          {formatCurrency(goal.targetAmount)} ₽
                        </span>
                      </div>
                      <div className="progress-text">
                        {progress >= 100 ? '✅ ГОТОВО!' : `${progress.toFixed(1)}%`}
                      </div>
                    </div>

                    {goal.deadline && (
                      <div className="goal-deadline">
                        До: {new Date(goal.deadline).toLocaleDateString('ru-RU')}
                        {daysLeft !== null && (
                          <span style={{
                            marginLeft: 'auto',
                            padding: '4px 12px',
                            background: daysLeft <= 7 
                              ? 'rgba(239, 68, 68, 0.1)' 
                              : daysLeft <= 30 
                                ? 'rgba(245, 158, 11, 0.1)' 
                                : 'rgba(34, 197, 94, 0.1)',
                            borderRadius: '12px',
                            border: `1px solid ${
                              daysLeft <= 7 
                                ? 'rgba(239, 68, 68, 0.3)' 
                                : daysLeft <= 30 
                                  ? 'rgba(245, 158, 11, 0.3)' 
                                  : 'rgba(34, 197, 94, 0.3)'
                            }`,
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            color: daysLeft <= 7 
                              ? '#ef4444' 
                              : daysLeft <= 30 
                                ? '#f59e0b' 
                                : '#22c55e'
                          }}>
                            {daysLeft} дн.
                          </span>
                        )}
                      </div>
                    )}

                    {!goal.completed && (
                      <div className="goal-actions">
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => addToGoal(goal.id, 1000)}
                        >
                          + 1 000 ₽
                        </Button>
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => addToGoal(goal.id, 5000)}
                        >
                          + 5 000 ₽
                        </Button>
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => {
                            const amount = prompt('Введите сумму для добавления:');
                            if (amount && !isNaN(amount)) {
                              addToGoal(goal.id, parseFloat(amount));
                            }
                          }}
                        >
                          Другая сумма
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        ) : (
          <Col xs={12}>
            <Card className="text-center" style={{
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '25px',
              padding: '60px 30px',
              marginTop: '40px'
            }}>
              <Card.Body>
                <div style={{fontSize: '5rem', opacity: 0.3, marginBottom: '20px'}}>
                  🎯
                </div>
                <Card.Text style={{
                  fontSize: '1.8rem',
                  color: 'rgba(226, 232, 240, 0.8)',
                  marginBottom: '30px'
                }}>
                  У вас пока нет финансовых целей
                </Card.Text>
                <Button 
                  variant="primary" 
                  onClick={() => setShowModal(true)}
                  style={{ padding: '15px 40px', fontSize: '1.2rem' }}
                >
                  <span style={{ marginRight: '10px' }}>✨</span>
                  Создать первую цель
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* Модальное окно создания цели */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Новая финансовая цель</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-4">
              <Form.Label>Название цели</Form.Label>
              <Form.Control
                type="text"
                placeholder="Например: Накопить на машину, Отпуск в Турции, Ремонт квартиры"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                autoFocus
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>Целевая сумма (₽)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="100000"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                    min="100"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>Текущая сумма (₽)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="0"
                    value={newGoal.currentAmount}
                    onChange={(e) => setNewGoal({...newGoal, currentAmount: e.target.value})}
                    min="0"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>Срок цели</Form.Label>
                  <Form.Control
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label>Категория</Form.Label>
                  <Form.Select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  >
                    <option value="travel">✈️ Путешествия</option>
                    <option value="car">🚗 Автомобиль</option>
                    <option value="home">🏠 Жильё/ремонт</option>
                    <option value="education">🎓 Образование</option>
                    <option value="electronics">💻 Техника</option>
                    <option value="health">💊 Здоровье</option>
                    <option value="other">⭐ Другое</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowModal(false)}
            style={{ padding: '12px 30px' }}
          >
            Отмена
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCreateGoal}
            disabled={!newGoal.title || !newGoal.targetAmount}
            style={{ padding: '12px 40px' }}
          >
            <span style={{ marginRight: '10px' }}>✨</span>
            Создать цель
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Plans;