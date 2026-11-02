import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Pencil, Trash2, X, ArrowUpRight, LoaderCircle } from 'lucide-react';

export default function TaskItem({ task, index, busy, onToggle, onRename, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  async function submit(e) {
    e.preventDefault();
    const next = draft.trim();
    if (!next) return;
    const ok = await onRename(task._id, next);
    if (ok) setEditing(false);
  }

  return <motion.article layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -40, height: 0 }} transition={{ duration: .28, delay: Math.min(index * .035, .18) }} className={`task-row ${task.completed ? 'task-done' : ''}`}>
    <button className="check-button" aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'} title={task.completed ? 'Mark incomplete' : 'Complete task'} onClick={() => onToggle(task)} disabled={busy}>
      {busy ? <LoaderCircle size={14} className="spin"/> : task.completed ? <Check size={15} strokeWidth={3}/> : null}
    </button>
    <div className="task-body">
      {editing ? <form className="edit-form" onSubmit={submit}>
        <input autoFocus value={draft} onChange={e => setDraft(e.target.value)} maxLength={160} aria-label="Edit task title"/>
        <button className="icon-button confirm" type="submit" title="Save" disabled={busy}><Check size={18}/></button>
        <button className="icon-button" type="button" title="Cancel" onClick={() => { setDraft(task.title); setEditing(false); }}><X size={18}/></button>
      </form> : <>
        <div className="task-title">{task.title}</div>
        <div className="task-meta"><span className={`status-dot ${task.completed ? 'green' : 'orange'}`}/>{task.completed ? 'Completed' : 'In progress'} <span className="meta-sep">·</span> {new Date(task.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
      </>}
    </div>
    {!editing && <div className="task-actions">
      <button className="icon-button" title="Edit task" aria-label="Edit task" onClick={() => { setDraft(task.title); setEditing(true); }} disabled={busy}><Pencil size={16}/></button>
      <button className="icon-button danger" title="Delete task" aria-label="Delete task" onClick={() => { if (window.confirm(`Delete “${task.title}”?`)) onDelete(task._id); }} disabled={busy}><Trash2 size={16}/></button>
      <span className="arrow-ornament"><ArrowUpRight size={17}/></span>
    </div>}
  </motion.article>;
}
