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
    deadline: ''
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
      createdAt: new Date().toISOString()
    };
    
    setGoals(prev => [...prev, goal]);
    setNewGoal({ title: '', targetAmount: '', currentAmount: '0', deadline: '' });
    setShowModal(false);
  };

  const addToGoal = (id, amount) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id 
        ? { ...goal, currentAmount: goal.currentAmount + amount }
        : goal
    ));
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const getProgress = (goal) => {
    return (goal.currentAmount / goal.targetAmount) * 100;
  };

  return (
    <Container className="plans-container">
      <div className="page-header">
        <h1 className="page-title">Финансовые цели</h1>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          + Новая цель
        </Button>
      </div>

      <Row>
        {goals.length > 0 ? (
          goals.map(goal => (
            <Col md={6} lg={4} key={goal.id} className="mb-4">
              <Card className="goal-card">
                <Card.Body>
                  <div className="goal-header">
                    <Card.Title>{goal.title}</Card.Title>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      ×
                    </Button>
                  </div>
                  
                  <div className="goal-progress">
                    <ProgressBar 
                      now={getProgress(goal)} 
                      variant={getProgress(goal) >= 100 ? 'success' : 'primary'}
                    />
                    <div className="goal-amounts">
                      <span>{goal.currentAmount} сом</span>
                      <span>{goal.targetAmount} сом</span>
                    </div>
                    <div className="progress-text">
                      {getProgress(goal).toFixed(1)}%
                    </div>
                  </div>

                  {goal.deadline && (
                    <div className="goal-deadline">
                      До: {new Date(goal.deadline).toLocaleDateString()}
                    </div>
                  )}

                  <div className="goal-actions">
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      onClick={() => addToGoal(goal.id, 1000)}
                    >
                      +1000
                    </Button>
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      onClick={() => addToGoal(goal.id, 5000)}
                    >
                      +5000
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <Card className="text-center">
              <Card.Body>
                <Card.Text className="text-muted" style={{fontSize: '30px'}}>
                  У вас пока нет финансовых целей
                </Card.Text>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                  Создать первую цель
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {/* Модалка создания цели */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Новая финансовая цель</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Название цели</Form.Label>
              <Form.Control
                type="text"
                placeholder="Например: Накопить на машину"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Целевая сумма (сом)</Form.Label>
              <Form.Control
                type="number"
                placeholder="100000"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Текущая сумма (сом)</Form.Label>
              <Form.Control
                type="number"
                placeholder="0"
                value={newGoal.currentAmount}
                onChange={(e) => setNewGoal({...newGoal, currentAmount: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Срок цели (опционально)</Form.Label>
              <Form.Control
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Отмена
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCreateGoal}
            disabled={!newGoal.title || !newGoal.targetAmount}
          >
            Создать цель
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Plans;
