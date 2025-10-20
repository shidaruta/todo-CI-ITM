import React, { useState } from 'react';

export default function TaskItem({ task, onDelete, onToggle, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(task.text);
  const [showModal, setShowModal] = useState(false); // for delete confirmation

  return (
    <div className={`task ${task.done ? 'done' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1 }}>
        <input type="checkbox" checked={!!task.done} onChange={() => onToggle(task.id)} />
        {editing ? (
          <input value={text} onChange={e => setText(e.target.value)} />
        ) : (
          <span>{task.text}</span>
        )}
      </div>

      <div>
        {editing ? (
          <>
            <button onClick={() => { onEdit(task.id, text); setEditing(false); }}>Save</button>
            <button onClick={() => { setEditing(false); setText(task.text); }}>Cancel</button>
          </>
        ) : (
          <>
            <button style={{backgroundColor: "#4bcf4bff", color: "white", padding: 7}} onClick={() => setEditing(true)}>Edit</button>
            <button style={{backgroundColor: "#e32a2aff", color: "white", padding: 7}} onClick={() => setShowModal(true)}>Delete</button>
      
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff', padding: '20px', borderRadius: '12px', width: '300px', textAlign: 'center'
          }}>
            <p>Are you sure you want to delete this task?</p>
            <button
              style={{ marginRight: '10px', padding: '6px 12px', borderRadius: '6px', background: '#e74c3c', color: 'white', border: 'none', cursor: "pointer" }}
              onClick={() => { onDelete(task.id); setShowModal(false); }}
            >
              Yes, Delete
            </button>
            <button
              style={{ padding: '6px 12px', borderRadius: '6px', background: '#ccc', border: 'none', }}
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
