import React, { useState, useEffect, useCallback } from 'react';
import AuthForm from './components/AuthForm.jsx';
import TaskItem from './components/TaskItem.jsx';

const API = 'http://localhost:5000/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState('');
  const [showModal, setShowModal] = useState(false); // for delete confirmation

useEffect(() => { 
  if (token) loadTasks(); }, [token, loadTasks]);

  const loadTasks = useCallback(async () => {
    try {
      const res = await fetch(`${API}/tasks`, { 
        headers: { Authorization: 'Bearer ' + token } 
      });
      if (!res.ok) throw new Error('Failed to load tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error loading tasks:', err);
      // If token is invalid, logout
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        logout();
      }
    }
  }, [token]);

  async function addTask(e) {
  e.preventDefault();
  if (!text.trim()) return;
  try {
    const res = await fetch(`${API}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error('Failed to add task');
    const data = await res.json();
    setTasks([data, ...tasks]);
    setText('');
  } catch (err) {
    console.error('Error adding task:', err);
  }
}

  async function toggleTask(id) {
    const res = await fetch(`${API}/tasks/${id}/toggle`, { method: 'POST', headers: { Authorization: 'Bearer ' + token } });
    const updated = await res.json();
    setTasks(tasks.map(t => t.id === updated.id ? updated : t));
  }

  async function deleteTask(id) {
    await fetch(`${API}/tasks/${id}`, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } });
    setTasks(tasks.filter(t => t.id !== id));
  }

  async function editTask(id, newText) {
    const res = await fetch(`${API}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ text: newText }),
    });
    const updated = await res.json();
    setTasks(tasks.map(t => t.id === updated.id ? updated : t));
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
  }

  if (!token) return <AuthForm onAuth={setToken} />;

  return (
    <>
    <div className="app">
      <header>
        <h1>Todo</h1>
        <button className='logout-btn' onClick={() => setShowModal(true)}>Logout</button>
      </header>

      <form onSubmit={addTask}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Add new task" />
        <button type="submit">Add</button>
      </form>

      <div className="tasks">
        {tasks.length === 0 ? <p>No tasks yet</p> :
          tasks.map(t => <TaskItem key={t.id} task={t} onDelete={deleteTask} onToggle={toggleTask} onEdit={editTask} />)}
      </div>
    </div>
    
     {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff', padding: '20px', borderRadius: '12px', width: '300px', textAlign: 'center'
          }}>
            <p>Are you sure you want to Logout?</p>
            <button
              style={{ marginRight: '10px', padding: '6px 12px', borderRadius: '6px', backgroundColor: '#4bcf4bff', color: 'white', border: 'none', cursor: "pointer" }}
              onClick={() => { logout(); setShowModal(false); }}
            >
              Sure
            </button>
            <button
              style={{ padding: '6px 12px', borderRadius: '6px', background: '#ccc', border: 'none', cursor: "pointer" }}
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
