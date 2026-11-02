import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowUpRight, CalendarDays, Check, CheckCheck, CircleHelp, Clock3, Command, LayoutDashboard, ListTodo, Menu, Plus, Search, Sparkles, Target, X, Zap, RefreshCw } from 'lucide-react';
import Brand from './components/Brand.jsx';
import TaskItem from './components/TaskItem.jsx';
import { todosApi } from './services/todosApi.js';

const filters = [{ key: 'all', label: 'All tasks' }, { key: 'active', label: 'In progress' }, { key: 'done', label: 'Completed' }];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [busyIds, setBusyIds] = useState([]);
  const [creating, setCreating] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const reduceMotion = useReducedMotion();

  async function loadTasks() {
    setLoading(true);
    setError('');
    try {
      const result = await todosApi.list();
      if (!Array.isArray(result)) throw new Error('The API did not return a task list.');
      setTasks(result);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadTasks(); }, []);
  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(''), 3200);
    return () => clearTimeout(timeout);
  }, [toast]);

  const completed = tasks.filter(t => t.completed).length;
  const active = tasks.length - completed;
  const percentage = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  const visible = useMemo(() => tasks.filter(t => (filter === 'all' || (filter === 'done' ? t.completed : !t.completed)) && (t.title || '').toLowerCase().includes(query.toLowerCase())), [tasks, filter, query]);

  async function createTask(e) {
    e.preventDefault();
    const title = draft.trim();
    if (!title || creating) return;
    setCreating(true); setError('');
    try {
      const todo = await todosApi.create(title);
      setTasks(t => [todo, ...t]); setDraft(''); setFilter('all'); setQuery(''); setToast('New task added successfully');
    } catch (err) { setError(err.message); }
    finally { setCreating(false); }
  }
  async function changeTask(id, updates, successMessage) {
    setBusyIds(ids => [...ids, id]); setError('');
    try {
      const changed = await todosApi.update(id, updates);
      setTasks(ts => ts.map(t => t._id === id ? changed : t));
      setToast(successMessage); return true;
    } catch (err) { setError(err.message); return false; }
    finally { setBusyIds(ids => ids.filter(value => value !== id)); }
  }
  async function removeTask(id) {
    setBusyIds(ids => [...ids, id]); setError('');
    try { await todosApi.remove(id); setTasks(ts => ts.filter(t => t._id !== id)); setToast('Task deleted'); }
    catch (err) { setError(err.message); }
    finally { setBusyIds(ids => ids.filter(value => value !== id)); }
  }
  function selectFilter(value) { setFilter(value); setMobileMenu(false); }
  const day = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const entrance = reduceMotion ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: .5 } };

  return <div className="app-shell">
    <button className="mobile-menu-trigger" onClick={() => setMobileMenu(v => !v)} aria-label="Toggle sidebar"><Menu size={23}/></button>
    {mobileMenu && <button className="mobile-scrim" aria-label="Close sidebar" onClick={() => setMobileMenu(false)}/>}
    <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
      <div><Brand/><div className="sidebar-caption">THE ART OF GETTING THINGS DONE</div></div>
      <div className="sidebar-group-label">WORKSPACE</div>
      <nav className="nav-items" aria-label="Main navigation">
        <button className="nav-item active" onClick={() => selectFilter('all')}><LayoutDashboard size={18}/> Overview <ArrowUpRight className="nav-right" size={15}/></button>
        <button className="nav-item" onClick={() => selectFilter('active')}><ListTodo size={18}/> My tasks <span className="nav-count">{active}</span></button>
        <button className="nav-item" onClick={() => selectFilter('done')}><CheckCheck size={18}/> Completed <span className="nav-count">{completed}</span></button>
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-promo"><div className="promo-top"><span>✳</span><ArrowUpRight size={17}/></div><h3>Make space for<br/>what matters.</h3><p>One thing at a time.<br/>Every day, a little better.</p></div>
        <div className="sidebar-help"><CircleHelp size={17}/> Your personal workspace</div>
        <div className="sidebar-foot">© {new Date().getFullYear()} TASKFLOW STUDIO <span>V1.0</span></div>
      </div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="breadcrumb"><span>Workspace</span><span className="slash">/</span><strong>Overview</strong></div><div className="topbar-right"><span className="availability"><span/> ALL SYSTEMS READY</span><span className="avatar">TF</span></div></header>
      <div className="page-content">
        <motion.div {...entrance} className="hero-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> YOUR PERSONAL CONTROL CENTER <span>·</span> {day.toUpperCase()}</div><h1>Find your <em>flow.</em><span className="hero-flower">✳</span></h1><p>A clear mind starts with a clear plan. Make today count.</p></div><div className="hero-badge"><div className="hero-badge-inner"><Zap size={26} fill="currentColor"/></div><span>DO THE WORK.<br/>ENJOY THE FLOW.</span></div></motion.div>
        <motion.section {...entrance} transition={{ duration: .5, delay: .1 }} className="stats-grid" aria-label="Task statistics">
          <div className="stat-card stat-main"><div className="stat-top"><span>TOTAL TASKS</span><Target size={19}/></div><div className="stat-number">{tasks.length.toString().padStart(2, '0')}<span className="stat-suffix">/ ALL TIME</span></div><div className="stat-foot"><span className="mini-chart">▁▂▄▃▆█</span><span>Keep the momentum going</span></div></div>
          <div className="stat-card"><div className="stat-top"><span>IN PROGRESS</span><Clock3 size={19}/></div><div className="stat-number">{active.toString().padStart(2, '0')}</div><div className="stat-foot"><span className="stat-pill orange">●</span><span>Things on your radar</span></div></div>
          <div className="stat-card"><div className="stat-top"><span>COMPLETED</span><CheckCheck size={19}/></div><div className="stat-number">{completed.toString().padStart(2, '0')}</div><div className="stat-foot"><span className="stat-pill green">●</span><span>Small wins add up</span></div></div>
        </motion.section>
        <motion.section {...entrance} transition={{ duration: .5, delay: .2 }} className="workspace-grid">
          <div className="task-panel">
            <div className="section-top"><div><div className="section-kicker">01 / STAY ON TRACK</div><h2>Your taskboard<span className="section-dot">.</span></h2></div><span className="task-total">{tasks.length} TASK{tasks.length !== 1 ? 'S' : ''}</span></div>
            <form className="add-form" onSubmit={createTask}><div className="plus-square"><Plus size={20}/></div><input value={draft} onChange={e => setDraft(e.target.value)} placeholder="What needs to get done?" aria-label="New task title" maxLength={160}/><button className="add-btn" type="submit" disabled={!draft.trim() || creating}>{creating ? 'Adding...' : 'Add task'}<ArrowRight size={17}/></button></form>
            <div className="task-toolbar"><div className="filter-tabs" role="group" aria-label="Task filter">{filters.map(f => <button key={f.key} className={filter === f.key ? 'selected' : ''} onClick={() => setFilter(f.key)}>{f.label}</button>)}</div><label className="search-field"><Search size={17}/><input placeholder="Search tasks" aria-label="Search tasks" value={query} onChange={e => setQuery(e.target.value)}/>{query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={15}/></button>}</label></div>
            {error && <div className="error-note" role="alert"><span>{error}</span><button onClick={loadTasks}><RefreshCw size={15}/> Retry</button></div>}
            {loading ? <div className="loading-state"><RefreshCw className="spin" size={24}/> Loading your tasks...</div> : <div className="task-list"><AnimatePresence initial={false} mode="popLayout">{visible.length ? visible.map((task, i) => <TaskItem key={task._id} task={task} index={i} busy={busyIds.includes(task._id)} onToggle={t => changeTask(t._id, { completed: !t.completed }, t.completed ? 'Moved to in progress' : 'Another task complete!')} onRename={(id, title) => changeTask(id, { title }, 'Task updated')} onDelete={removeTask}/>) : <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="empty-state"><div className="empty-glyph">✳</div><h3>{query ? 'No matching tasks' : filter === 'done' ? 'No completed tasks yet' : filter === 'active' ? 'Nothing left on your plate' : 'A fresh start looks good on you.'}</h3><p>{query ? 'Try another search.' : 'Add a task above to start building momentum.'}</p></motion.div>}</AnimatePresence></div>}
            <div className="task-bottom"><span><Sparkles size={15}/> PROGRESS OVER PERFECTION</span><span>{visible.length} SHOWN</span></div>
          </div>
          <aside className="insights-panel"><div className="insight-heading"><div className="section-kicker">02 / THE BIG PICTURE</div><h2>Daily pulse<span className="section-dot">.</span></h2><p>Keep your eyes on the little victories.</p></div><div className="progress-card"><div className="progress-label"><span>COMPLETION RATE</span><ArrowUpRight size={17}/></div><div className="progress-figure">{percentage}<span>%</span></div><div className="progress-track"><motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: .8, ease: 'easeOut' }}/></div><div className="progress-caption">{completed} of {tasks.length} tasks completed</div></div><div className="quote-card"><div className="quote-mark">“</div><p>Great things are done by a series of small things brought together.</p><span>— VINCENT VAN GOGH</span><div className="quote-decoration">✳</div></div><div className="daily-tip"><CalendarDays size={18}/><div><strong>One step at a time.</strong><span>Focus on the next right thing.</span></div></div></aside>
        </motion.section>
        <footer className="footer"><span>BUILT FOR BETTER DAYS.</span><span>CRAFTED WITH INTENTION <span className="footer-star">✳</span></span></footer>
      </div>
    </main>
    <AnimatePresence>{toast && <motion.div className="toast" role="status" initial={{ opacity: 0, y: 20, scale: .94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15 }}><Check size={17}/>{toast}<button aria-label="Dismiss notification" onClick={() => setToast('')}><X size={15}/></button></motion.div>}</AnimatePresence>
  </div>;
}
