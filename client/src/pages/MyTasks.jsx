import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format, isPast } from 'date-fns';

const STATUS_LABEL = {
  TODO: 'Todo',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Done',
};

const STATUS_PILL = {
  TODO: 'eq-pill-todo',
  IN_PROGRESS: 'eq-pill-progress',
  COMPLETED: 'eq-pill-done',
};

const PRIORITY_PILL = {
  LOW: 'eq-pill-low',
  MEDIUM: 'eq-pill-medium',
  HIGH: 'eq-pill-high',
};

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    axios
      .get('/api/dashboard/my-tasks')
      .then((res) => setTasks(res.data || []))
      .catch((e) => console.error('My tasks load error:', e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="font-mono text-[10px] uppercase tracking-micro text-slate">Loading…</div>
      </div>
    );
  }

  const filtered = filter === 'ALL' ? tasks : tasks.filter((t) => t.status === filter);

  const counts = {
    ALL: tasks.length,
    TODO: tasks.filter((t) => t.status === 'TODO').length,
    IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    COMPLETED: tasks.filter((t) => t.status === 'COMPLETED').length,
  };

  const overdueCount = tasks.filter(
    (t) => t.dueDate && isPast(new Date(t.dueDate)) && t.status !== 'COMPLETED'
  ).length;

  const FILTERS = [
    { key: 'ALL', label: 'All' },
    { key: 'TODO', label: 'Todo' },
    { key: 'IN_PROGRESS', label: 'In progress' },
    { key: 'COMPLETED', label: 'Done' },
  ];

  return (
    <>
      {/* topline */}
      <div className="flex items-center justify-between pb-6 border-b border-fog mb-10">
        <div className="font-mono text-[11px] uppercase tracking-micro text-slate">
          Workspace <span className="text-fog mx-2">/</span>
          <span className="text-ink">My Tasks</span>
        </div>
      </div>

      {/* header */}
      <div className="mb-12">
        <div className="font-mono text-[11px] uppercase tracking-micro text-slate mb-4">
          — Your queue · {tasks.length} total · {overdueCount} overdue
        </div>
        <h1 className="display mb-3">
          My tasks<em className="serif-italic text-orchid">.</em>
        </h1>
        <p className="text-base text-slate max-w-[560px] leading-relaxed">
          Everything assigned to you across every project. Click a row to jump into the project.
        </p>
      </div>

      {/* filters */}
      <div className="flex items-center gap-2 mb-8">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              filter === f.key
                ? 'bg-ink text-cream'
                : 'border border-fog text-slate hover:text-ink hover:border-ink'
            }`}
          >
            {f.label}
            <span className="ml-2 font-mono text-[10px] tracking-micro opacity-70">
              {String(counts[f.key]).padStart(2, '0')}
            </span>
          </button>
        ))}
      </div>

      {/* table */}
      {filtered.length === 0 ? (
        <div className="border border-fog rounded-xl text-center py-20 px-6 bg-cream">
          <div className="serif-italic text-[28px] text-ink mb-2">
            {filter === 'ALL' ? 'No tasks assigned yet' : `Nothing in "${STATUS_LABEL[filter] || filter}"`}
          </div>
          <p className="text-slate">
            {filter === 'ALL'
              ? 'Tasks assigned to you will appear here.'
              : 'Try a different filter, or head to a project to grab some work.'}
          </p>
        </div>
      ) : (
        <div className="border border-fog rounded-xl overflow-hidden bg-cream">
          {/* header row */}
          <div
            className="grid items-center gap-6 px-7 py-4 border-b border-fog font-mono text-[10px] uppercase tracking-micro text-slate-soft"
            style={{ gridTemplateColumns: '36px 1fr 200px 120px 120px 60px' }}
          >
            <div>#</div>
            <div>Task</div>
            <div>Project</div>
            <div>Priority</div>
            <div>Due</div>
            <div></div>
          </div>

          {filtered.map((t, i) => {
            const overdue = t.dueDate && isPast(new Date(t.dueDate)) && t.status !== 'COMPLETED';
            return (
              <Link
                key={t.id}
                to={`/projects/${t.project?.id || t.projectId}`}
                className="grid items-center gap-6 px-7 py-4 border-b border-fog last:border-b-0 hover:bg-fog/20 transition-colors"
                style={{ gridTemplateColumns: '36px 1fr 200px 120px 120px 60px' }}
              >
                <div className="font-mono text-[11px] text-slate-soft">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <div className="text-[14px] font-medium text-ink leading-snug">{t.title}</div>
                  <div className="mt-1">
                    <span className={STATUS_PILL[t.status] || 'eq-pill-todo'}>
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          t.status === 'COMPLETED'
                            ? 'bg-brand-green'
                            : t.status === 'IN_PROGRESS'
                            ? 'bg-orchid'
                            : 'bg-slate'
                        }`}
                      />
                      {STATUS_LABEL[t.status] || t.status}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-slate truncate">{t.project?.name || '—'}</div>
                <div>
                  <span className={PRIORITY_PILL[t.priority] || 'eq-pill-low'}>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        t.priority === 'HIGH'
                          ? 'bg-revops-red'
                          : t.priority === 'MEDIUM'
                          ? 'bg-glacier'
                          : 'bg-slate'
                      }`}
                    />
                    {t.priority}
                  </span>
                </div>
                <div
                  className={`font-mono text-[11px] ${
                    overdue ? 'text-revops-red' : 'text-slate'
                  }`}
                >
                  {t.dueDate ? format(new Date(t.dueDate), 'MMM dd') : '—'}
                </div>
                <div className="text-right text-slate hover:text-ink text-base">→</div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
