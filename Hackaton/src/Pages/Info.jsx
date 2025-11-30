import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Accordion, Button, Form, Alert, ListGroup } from 'react-bootstrap';
import './Info.css';

function Info() {
  const [activeTab, setActiveTab] = useState('tips');
  const [notes, setNotes] = useState('');
  const [quickNotes, setQuickNotes] = useState([]);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });


  useEffect(() => {
    const savedNotes = localStorage.getItem('financialNotes');
    const savedQuickNotes = localStorage.getItem('quickFinancialNotes');
    
    if (savedNotes) setNotes(savedNotes);
    if (savedQuickNotes) setQuickNotes(JSON.parse(savedQuickNotes));
  }, []);


  const saveNotes = () => {
    localStorage.setItem('financialNotes', notes);
    showAlert('Заметки сохранены!', 'success');
  };


  const addQuickNote = () => {
    const text = prompt('Введите финансовую заметку:');
    if (text && text.trim()) {
      const newNote = {
        id: Date.now(),
        text: text.trim(),
        date: new Date().toLocaleDateString('ru-RU'),
        completed: false
      };
      const updatedNotes = [...quickNotes, newNote];
      setQuickNotes(updatedNotes);
      localStorage.setItem('quickFinancialNotes', JSON.stringify(updatedNotes));
      showAlert('Заметка добавлена!', 'success');
    }
  };


    const deleteQuickNote = (id) => {
    const updatedNotes = quickNotes.filter(note => note.id !== id);
    setQuickNotes(updatedNotes);
    localStorage.setItem('quickFinancialNotes', JSON.stringify(updatedNotes));
    showAlert('Заметка удалена!', 'info');
  };

  const toggleNoteCompletion = (id) => {
    const updatedNotes = quickNotes.map(note => 
      note.id === id ? { ...note, completed: !note.completed } : note
    );
    setQuickNotes(updatedNotes);
    localStorage.setItem('quickFinancialNotes', JSON.stringify(updatedNotes));
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: '' }), 3000);
  };

  const financialTips = [
    {
      title: " Ведите бюджет",
      content: "Регулярно отслеживайте свои доходы и расходы. Используйте приложения для учета финансов или простую таблицу. Это поможет понять, куда уходят деньги и где можно оптимизировать расходы."
    },
    {
      title: " Создайте финансовую подушку",
      content: "Накопите сумму, равную 3-6 месяцам расходов на непредвиденные ситуации. Храните эти деньги на отдельном счете с возможностью быстрого доступа, но не используйте их для повседневных трат."
    },
    {
      title: " Ставьте финансовые цели",
      content: "Определите конкретные цели (покупка жилья, образование, путешествия) и планируйте их достижение. Разбейте крупные цели на небольшие этапы и регулярно откладывайте деньги на их реализацию."
    },
    {
      title: "Диверсифицируйте доходы",
      content: "Рассмотрите возможность создания нескольких источников дохода. Это может быть инвестирование, фриланс, пассивный доход от аренды или создание собственного бизнеса. Диверсификация снижает финансовые риски."
    },
    {
      title: " Инвестируйте в знания",
      content: "Постоянно обучайтесь финансовой грамотности. Читайте книги, посещайте курсы, изучайте инвестиционные инструменты. Знания - это лучшая инвестиция, которая всегда окупается."
    },
    {
      title: " Начните сейчас",
      content: "Не откладывайте финансовое планирование на потом. Даже небольшие, но регулярные шаги сегодня приведут к значительным результатам в будущем. Время - ваш главный союзник в достижении финансовых целей."
    }
  ];

  const exportData = () => {
    const transactions = localStorage.getItem('transactions');
    const goals = localStorage.getItem('financialGoals');
    const financialNotes = localStorage.getItem('financialNotes');
    const quickNotes = localStorage.getItem('quickFinancialNotes');
    
    const data = {
      transactions: transactions ? JSON.parse(transactions) : [],
      goals: goals ? JSON.parse(goals) : [],
      notes: financialNotes || '',
      quickNotes: quickNotes ? JSON.parse(quickNotes) : [],
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `moneyflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showAlert('Данные экспортированы!', 'success');
  };

  const clearData = () => {
    if (window.confirm('Вы уверены, что хотите удалить все данные? Это действие нельзя отменить.')) {
      localStorage.removeItem('transactions');
      localStorage.removeItem('financialGoals');
      localStorage.removeItem('financialNotes');
      localStorage.removeItem('quickFinancialNotes');
      setNotes('');
      setQuickNotes([]);
      showAlert('Все данные очищены!', 'info');
    }
  };

  return (
    <Container className="info-container">
      {alert.show && (
        <Alert variant={alert.variant} className="mt-3">
          {alert.message}
        </Alert>
      )}
      
      <h1 className="page-title"> Финансовый помощник</h1>
      
      {/* Навигация по вкладкам */}
      <Row className="mb-4">
        <Col>
          <div className="info-tabs">
            <Button
              variant={activeTab === 'tips' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('tips')}
            >
               Советы
            </Button>
            <Button
              variant={activeTab === 'notes' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('notes')}
            >
               Мои заметки
            </Button>
            <Button
              variant={activeTab === 'calculators' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('calculators')}
            >
               Калькуляторы
            </Button>
            <Button
              variant={activeTab === 'settings' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('settings')}
            >
               Настройки
            </Button>
          </div>
        </Col>
      </Row>

      {/* Контент вкладок */}
      <Row>
        <Col>
          {activeTab === 'tips' && (
            <Card>
              <Card.Header>
                <h5>Финансовые советы для успеха</h5>
              </Card.Header>
              <Card.Body>
                <Accordion defaultActiveKey="0">
                  {financialTips.map((tip, index) => (
                    <Accordion.Item key={index} eventKey={index.toString()}>
                      <Accordion.Header>{tip.title}</Accordion.Header>
                      <Accordion.Body>{tip.content}</Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Card.Body>
            </Card>
          )}

          {activeTab === 'notes' && (
            <Row>
              <Col lg={8}>
                <Card className="notes-card">
                  <Card.Header>
                    <h5> Финансовый дневник</h5>
                  </Card.Header>
                  <Card.Body>
                    <Form.Group className="mb-4">
                      <Form.Label className="form-label-custom">Записывайте свои финансовые мысли, цели и идеи:</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={12}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Например: 
• Хочу накопить на отпуск к лету
• Нужно сократить расходы на доставку еды
• Интересно изучить инвестиции в акции
• Планирую увеличить доход на 20% в этом году
• Важные финансовые уроки..."
                        className="notes-textarea"
                      />
                    </Form.Group>
                    <div className="d-flex gap-3 flex-wrap">
                      <Button variant="primary" onClick={saveNotes} size="lg">
                        Сохранить заметки
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => setNotes('')}
                        size="lg"
                      >
                        Очистить
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={4}>
                <Card className="quick-notes-card">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0"> Быстрые задачи</h5>
                    <Button variant="outline-primary" size="lg" onClick={addQuickNote}>
                      ➕ Добавить
                    </Button>
                  </Card.Header>
                  <Card.Body>
                    {quickNotes.length === 0 ? (
                      <div className="text-center text-muted py-4">
                        <div style={{fontSize: '3rem'}}>📝</div>
                        <p>Нет задач. Добавьте первую!</p>
                      </div>
                    ) : (
                      <ListGroup variant="flush">
                        {quickNotes.map((note) => (
                          <ListGroup.Item 
                            key={note.id}
                            className={`quick-note-item ${note.completed ? 'completed' : ''}`}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="note-content">
                                <Form.Check
                                  type="checkbox"
                                  checked={note.completed}
                                  onChange={() => toggleNoteCompletion(note.id)}
                                  label={note.text}
                                  className="note-checkbox"
                                />
                                <small className="note-date">{note.date}</small>
                              </div>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => deleteQuickNote(note.id)}
                                className="delete-btn"
                              >
                                ×
                              </Button>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                    {quickNotes.length > 0 && (
                      <div className="mt-3 p-3 bg-light rounded">
                        <small className="text-muted">
                          ✅ Выполнено: {quickNotes.filter(note => note.completed).length} из {quickNotes.length}
                        </small>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {activeTab === 'calculators' && (
            <Row>
              <Col md={6} lg={3}>
                <Card className="calculator-card">
                  <Card.Body>
                    <div className="calculator-icon"></div>
                    <Card.Title>Калькулятор экономии</Card.Title>
                    <p className="text-muted">
                      Сколько можно накопить, откладывая определенную сумму регулярно
                    </p>
                    <Button variant="primary" disabled>
                      🔜 Скоро будет
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={3}>
                <Card className="calculator-card">
                  <Card.Body>
                    <div className="calculator-icon"></div>
                    <Card.Title>Калькулятор кредита</Card.Title>
                    <p className="text-muted">
                      Рассчитайте ежемесячные платежи по кредиту и общую переплату
                    </p>
                    <Button variant="primary" disabled>
                      🔜 Скоро будет
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={3}>
                <Card className="calculator-card">
                  <Card.Body>
                    <div className="calculator-icon"></div>
                    <Card.Title>Калькулятор инвестиций</Card.Title>
                    <p className="text-muted">
                      Узнайте потенциал роста ваших инвестиций со временем
                    </p>
                    <Button variant="primary" disabled>
                      🔜 Скоро будет
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} lg={3}>
                <Card className="calculator-card">
                  <Card.Body>
                    <div className="calculator-icon"></div>
                    <Card.Title>Калькулятор целей</Card.Title>
                    <p className="text-muted">
                      Сколько нужно откладывать для достижения финансовых целей
                    </p>
                    <Button variant="primary" disabled>
                      🔜 Скоро будет
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {activeTab === 'settings' && (
            <Card>
              <Card.Header>
                <h5> Управление данными</h5>
              </Card.Header>
              <Card.Body>
                <div className="settings-actions">
                  <div className="setting-item">
                    <div className="setting-icon">📥</div>
                    <h6>Экспорт данных</h6>
                    <p>Скачайте резервную копию всех ваших транзакций, целей и заметок в формате JSON. Рекомендуется регулярно делать backup ваших данных.</p>
                    <Button variant="success" onClick={exportData} size="lg">
                       Экспортировать данные
                    </Button>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-icon">🔄</div>
                    <h6>Импорт данных</h6>
                    <p>Восстановите данные из ранее созданной резервной копии. Поддерживается формат JSON.</p>
                    <Button variant="warning" disabled size="lg">
                       Скоро будет доступно
                    </Button>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-icon">🗑️</div>
                    <h6>Очистка данных</h6>
                    <p>Удалить все транзакции, финансовые цели и заметки. Это действие необратимо - все данные будут безвозвратно удалены.</p>
                    <Button variant="danger" onClick={clearData} size="lg">
                       Очистить все данные
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Info;