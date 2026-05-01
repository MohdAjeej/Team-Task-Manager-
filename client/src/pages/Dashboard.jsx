import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

function StatCell({ label, value, foot, hero, accent }) {
  return (
    <div
      className={`relative bg-cream p-7 ${
        hero ? 'p-9' : ''
      }`}
    >
      <div className="font-mono text-[10px] uppercase tracking-micro text-slate flex items-center gap-2 mb-4">
        <span className="block w-3.5 h-px bg-slate" />
        {label}
      </div>
      <div
        className={`serif-italic ${hero ? 'text-[140px] leading-none' : 'text-[56px] leading-none'} text-ink`}
        style={{ fontStyle: 'normal' }}
      >
        {value}
        {hero && <em className="serif-italic text-orchid">.</em>}
      </div>
      {foot}
      {accent}
    </div>
  );
}

function HeroBars({ tasks = [] }) {
  // make a 14-bar mini-chart from updatedAt distribution
  const buckets = new Array(14).fill(0);
  const now = Date.now();
  tasks.forEach((t) => {
    const d = new Date(t.updatedAt || t.createdAt || now).getTime();
    const daysAgo = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (daysAgo >= 0 && daysAgo < 14) buckets[13 - daysAgo] += 1;
  });
  const max = Math.max(...buckets, 1);
  return (
    <div className="flex items-end gap-1 h-[60px] mt-7">
      {buckets.map((b, i) => {
        const h = (b / max) * 100;
        const isPeak = b === max && b > 0;
        return (
          <span
            key={i}
            className="flex-1 bg-orchid rounded-[1px] transition-opacity"
            style={{
              height: `${Math.max(h, 4)}%`,
              opacity: isPeak ? 0.85 : b > 0 ? 0.35 : 0.12,
            }}
          />
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/dashboard/stats'),
      axios.get('/api/dashboard/activity').catch(() => ({ data: [] })),
    ])
      .then(([s, a]) => {
        setStats(s.data);
        setActivity(a.data || []);
      })
      .catch((e) => console.error('Dashboard load error:', e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="font-mono text-[10px] uppercase tracking-micro text-slate">Loading…</div>
      </div>
    );
  }

  const firstName = (user?.name || 'there').split(' ')[0];
  const completionPct = stats?.totalTasks
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;
  const memberCount = stats?.projectProgress?.reduce(
    (acc, p) => Math.max(acc, p.memberCount || 0),
    0
  ) || 1;

  const allRecentForBars = stats?.recentTasks || [];
  const projects = stats?.projectProgress || [];
  const overdues = stats?.overdueTasks || [];

  return (
    <>
      {/* topline */}
      <div className="flex items-center justify-between pb-6 border-b border-fog mb-10">
        <div className="font-mono text-[11px] uppercase tracking-micro text-slate">
          Workspace <span className="text-fog mx-2">/</span>{' '}
          <span className="text-ink">Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 border border-fog rounded-md font-mono text-[11px] text-slate-soft min-w-[200px]">
            <span>⌕ Search tasks, projects…</span>
            <span className="ml-auto px-1.5 py-px border border-fog rounded text-[9px]">⌘ K</span>
          </div>
          <Link to="/projects" className="eq-btn-primary text-sm">
            + New project
          </Link>
        </div>
      </div>

      {/* header */}
      <div className="mb-14">
        <div className="font-mono text-[11px] uppercase tracking-micro text-slate flex items-center gap-3 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
          Live · {format(new Date(), 'EEEE, dd MMM yyyy')}
          <span className="text-fog">·</span>
          {memberCount} active {memberCount === 1 ? 'member' : 'members'}
        </div>
        <h1 className="display-xl mb-3">
          Good {greeting()},<br />
          {firstName}. Here's <em className="serif-italic text-orchid">today.</em>
        </h1>
        <p className="text-base text-slate max-w-[560px] leading-relaxed">
          {stats?.overdueCount > 0
            ? `${stats.overdueCount} task${stats.overdueCount === 1 ? '' : 's'} need your attention before end-of-day.`
            : 'You have no overdue tasks. Velocity looking clean.'}{' '}
          {stats?.shippedThisWeek > 0 &&
            `Your team shipped ${stats.shippedThisWeek} task${stats.shippedThisWeek === 1 ? '' : 's'} this week.`}
        </p>
      </div>

      {/* bento */}
      <div
        className="grid mb-14 border border-fog rounded-[14px] overflow-hidden bg-fog"
        style={{
          gridTemplateColumns: '2fr 1fr 1fr',
          gridTemplateRows: 'auto auto',
          gap: '1px',
        }}
      >
        {/* hero cell */}
        <div className="row-span-2 bg-cream p-9 relative overflow-hidden">
          <div className="font-mono text-[10px] uppercase tracking-micro text-slate flex items-center gap-2 mb-4">
            <span className="block w-3.5 h-px bg-slate" />
            Total tasks · all projects
          </div>
          <div className="serif-italic text-[140px] leading-none text-ink" style={{ fontStyle: 'normal' }}>
            {stats?.totalTasks ?? 0}
            <em className="serif-italic text-orchid">.</em>
          </div>
          <HeroBars tasks={allRecentForBars} />
          <div className="flex gap-6 mt-5 font-mono text-[11px] text-slate">
            <span>
              <strong className="text-ink font-medium">{stats?.shippedThisWeek ?? 0}</strong> shipped
              this week
            </span>
            <span>
              <strong className="text-ink font-medium">{completionPct}%</strong> completion
            </span>
            <span>
              <strong className="text-ink font-medium">{stats?.totalProjects ?? 0}</strong> projects
            </span>
          </div>
          {/* glacier accent */}
          <span className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-glacier-tint opacity-60 blur-2xl pointer-events-none" />
        </div>

        <StatCell
          label="In progress"
          value={stats?.inProgressTasks ?? 0}
          foot={
            <div className="flex items-center gap-1.5 mt-4 text-xs text-slate">
              <span className="font-mono text-[11px] px-1.5 py-px rounded bg-orchid-tint text-orchid">
                {stats?.todoTasks ?? 0} queued
              </span>
              <span>after this</span>
            </div>
          }
        />

        <StatCell
          label="Completed"
          value={stats?.completedTasks ?? 0}
          foot={
            <div className="flex items-center gap-1.5 mt-4 text-xs text-slate">
              <span className="font-mono text-[11px] px-1.5 py-px rounded bg-brand-green-tint text-brand-green">
                {completionPct}%
              </span>
              <span>completion rate</span>
            </div>
          }
        />

        <StatCell
          label="Overdue"
          value={
            <span className={stats?.overdueCount > 0 ? 'text-revops-red' : 'text-ink'}>
              {stats?.overdueCount ?? 0}
            </span>
          }
          foot={
            <div className="flex items-center gap-1.5 mt-4 text-xs text-slate">
              {stats?.overdueCount > 0 ? (
                <>
                  <span className="font-mono text-[11px] px-1.5 py-px rounded bg-revops-red-tint text-revops-red">
                    attention
                  </span>
                  <span>scroll below</span>
                </>
              ) : (
                <span className="font-mono text-[11px] text-slate">all clear</span>
              )}
            </div>
          }
        />

        <StatCell
          label="Assigned to me"
          value={stats?.myTasksCount ?? 0}
          foot={
            <div className="flex items-center gap-1.5 mt-4 text-xs text-slate">
              <span className="font-mono text-[11px] text-slate">your queue</span>
            </div>
          }
        />
      </div>

      {/* overdue strip */}
      {overdues.length > 0 && (
        <section className="border border-fog rounded-xl overflow-hidden mb-14 bg-cream">
          <div className="flex items-center justify-between px-7 py-5 border-b border-fog">
            <div className="flex items-baseline gap-3">
              <span className="serif-italic text-[22px] text-ink">Needs your attention</span>
              <span className="font-mono text-[10px] uppercase tracking-micro text-revops-red">
                {overdues.length} overdue
              </span>
            </div>
            <Link
              to="/projects"
              className="font-mono text-[11px] text-slate hover:text-ink"
            >
              View all →
            </Link>
          </div>
          {overdues.map((t, i) => (
            <Link
              key={t.id}
              to={`/projects/${t.projectId}`}
              className="grid items-center gap-6 px-7 py-4 border-b border-fog last:border-b-0 hover:bg-fog/20 transition-colors"
              style={{ gridTemplateColumns: '36px 1fr 200px 120px 60px' }}
            >
              <div className="font-mono text-[11px] text-slate-soft">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <div className="text-[14px] font-medium text-ink">{t.title}</div>
                <div className="font-mono text-[10px] uppercase tracking-micro text-slate-soft mt-0.5">
                  {t.project}
                </div>
              </div>
              <div className="text-xs text-slate">
                {t.assignee ? `Assigned · ${t.assignee}` : 'Unassigned'}
              </div>
              <div className="font-mono text-[11px] text-revops-red">
                ⌃ {formatDistanceToNow(new Date(t.dueDate))} late
              </div>
              <div className="text-right text-slate hover:text-ink text-base">→</div>
            </Link>
          ))}
        </section>
      )}

      {/* two-col bottom */}
      <div className="grid gap-8" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
        {/* recent activity */}
        <section>
          <div className="serif-italic text-[28px] text-ink mb-1">Recent activity</div>
          <div className="font-mono text-[10px] uppercase tracking-micro text-slate-soft mb-6">
            Last updated tasks
          </div>

          <div className="flex flex-col">
            {activity.length === 0 ? (
              <div className="py-8 text-sm text-slate">
                No activity yet. Create a task to get started.
              </div>
            ) : (
              activity.map((t) => (
                <Link
                  to={`/projects/${t.projectId}`}
                  key={t.id}
                  className="grid gap-6 py-4 border-b border-fog last:border-b-0 items-start hover:bg-fog/20 transition-colors"
                  style={{ gridTemplateColumns: '80px 1fr auto' }}
                >
                  <div className="font-mono text-[10px] uppercase tracking-micro text-slate-soft pt-0.5">
                    {format(new Date(t.updatedAt), 'HH:mm')}
                  </div>
                  <div className="text-sm">
                    <strong className="font-medium text-ink">
                      {t.assignee || t.creator || 'Someone'}
                    </strong>{' '}
                    <span className="text-slate">
                      {t.status === 'COMPLETED'
                        ? 'completed'
                        : t.status === 'IN_PROGRESS'
                        ? 'is working on'
                        : 'updated'}
                    </span>{' '}
                    <em className="serif-italic text-orchid text-[15px]">"{t.title}"</em>
                    <small className="block mt-1 text-slate text-xs">
                      {t.project} · {format(new Date(t.updatedAt), 'MMM dd')}
                    </small>
                  </div>
                  <span
                    className={
                      t.status === 'COMPLETED'
                        ? 'eq-pill-done'
                        : t.status === 'IN_PROGRESS'
                        ? 'eq-pill-progress'
                        : 'eq-pill-todo'
                    }
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        t.status === 'COMPLETED'
                          ? 'bg-brand-green'
                          : t.status === 'IN_PROGRESS'
                          ? 'bg-orchid'
                          : 'bg-slate'
                      }`}
                    />
                    {t.status === 'COMPLETED'
                      ? 'Done'
                      : t.status === 'IN_PROGRESS'
                      ? 'In progress'
                      : 'Todo'}
                  </span>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* projects panel */}
        <section>
          <div className="serif-italic text-[28px] text-ink mb-1">Active projects</div>
          <div className="font-mono text-[10px] uppercase tracking-micro text-slate-soft mb-6">
            Sorted by activity
          </div>

          <div className="flex flex-col gap-3">
            {projects.length === 0 ? (
              <div className="py-8 text-sm text-slate">
                No projects yet.{' '}
                <Link to="/projects" className="underline text-ink hover:text-orchid">
                  Create one →
                </Link>
              </div>
            ) : (
              projects.slice(0, 5).map((p, i) => {
                const pct =
                  p.totalTasks > 0 ? Math.round((p.completedTasks / p.totalTasks) * 100) : 0;
                return (
                  <Link
                    to={`/projects/${p.id}`}
                    key={p.id}
                    className="border border-fog rounded-[10px] px-5 py-4 flex flex-col gap-3 hover:border-ink hover:-translate-y-px transition-all"
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="serif-italic text-[19px] text-ink">{p.name}</span>
                      <span className="font-mono text-[10px] uppercase tracking-micro text-slate-soft">
                        PRJ-{String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="h-px bg-fog relative overflow-hidden rounded-full">
                      <div
                        className="absolute inset-y-0 left-0 bg-orchid"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between font-mono text-[10px] uppercase tracking-micro text-slate">
                      <span>
                        {pct}% · {p.completedTasks}/{p.totalTasks}
                      </span>
                      <span>
                        {p.memberCount} {p.memberCount === 1 ? 'member' : 'members'}
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* footer */}
      <div className="mt-20 pt-6 border-t border-fog flex justify-between font-mono text-[10px] uppercase tracking-micro text-slate-soft">
        <span>Taskflow · v1.0.0</span>
        <span>Last sync · {format(new Date(), 'HH:mm:ss')}</span>
      </div>
    </>
  );
}
