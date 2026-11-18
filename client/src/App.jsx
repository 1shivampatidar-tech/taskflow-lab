import { useEffect, useMemo, useState } from 'react';
import { Check, CheckCircle2, Circle, Clock3, Plus, Search, Trash2 } from 'lucide-react';

const API = '/api/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadTasks() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      if (search) params.set('search', search);
      const response = await fetch(`${API}?${params}`);
      if (!response.ok) throw new Error('Could not load tasks');
      setTasks(await response.json());
      setError('');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadTasks(); }, [filter, search]);

  async function createTask(event) {
    event.preventDefault();
    if (!title.trim()) return;
    try {
      const response = await fetch(API, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), priority })
      });
      if (!response.ok) throw new Error('Could not create task');
      setTitle('');
      setPriority('medium');
      await loadTasks();
    } catch (err) { setError(err.message); }
  }

  async function updateStatus(task) {
    const status = task.status === 'done' ? 'todo' : 'done';
    await fetch(`${API}/${task._id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    await loadTasks();
  }

  async function deleteTask(id) {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    await loadTasks();
  }

  const counts = useMemo(() => ({
    all: tasks.length,
    todo: tasks.filter((task) => task.status === 'todo').length,
    progress: tasks.filter((task) => task.status === 'progress').length,
    done: tasks.filter((task) => task.status === 'done').length
  }), [tasks]);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Check size={19} /></div><span>TaskFlow</span></div>
        <nav>
          {[['all', 'All tasks'], ['todo', 'To do'], ['progress', 'In progress'], ['done', 'Completed']].map(([value, label]) => (
            <button key={value} className={filter === value ? 'nav-item active' : 'nav-item'} onClick={() => setFilter(value)}>
              <span>{label}</span><b>{counts[value]}</b>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer"><span className="avatar">SP</span><div><strong>Shivam Patidar</strong><small>Personal workspace</small></div></div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div><p className="eyebrow">Personal workspace</p><h1>{filter === 'all' ? 'Today' : filter === 'done' ? 'Completed' : 'My tasks'}</h1></div>
          <label className="search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tasks" /></label>
        </header>

        <form className="task-composer" onSubmit={createTask}>
          <button type="submit" className="add-button" aria-label="Add task"><Plus size={20} /></button>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Add a task..." />
          <select value={priority} onChange={(event) => setPriority(event.target.value)} aria-label="Priority">
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
          </select>
        </form>

        {error && <div className="error">{error}</div>}
        {loading ? <div className="empty">Loading tasks...</div> : tasks.length === 0 ? (
          <div className="empty"><CheckCircle2 size={38} /><h2>All clear</h2><p>Add a task to get started.</p></div>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <article className="task-card" key={task._id}>
                <button className={task.status === 'done' ? 'task-check checked' : 'task-check'} onClick={() => updateStatus(task)} aria-label="Toggle task status">
                  {task.status === 'done' ? <Check size={16} /> : <Circle size={18} />}
                </button>
                <div className="task-copy"><h3 className={task.status === 'done' ? 'done' : ''}>{task.title}</h3><div className="meta"><Clock3 size={14} /> <span>{new Date(task.createdAt).toLocaleDateString()}</span><i className={`priority ${task.priority}`}>{task.priority}</i></div></div>
                <button className="delete-button" onClick={() => deleteTask(task._id)} aria-label="Delete task"><Trash2 size={17} /></button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
