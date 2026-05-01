import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Team() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    axios
      .get('/api/dashboard/team')
      .then((res) => setUsers(res.data || []))
      .catch((e) => console.error('Team load error:', e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="font-mono text-[10px] uppercase tracking-micro text-slate">Loading…</div>
      </div>
    );
  }

  const q = query.trim().toLowerCase();
  const filtered = q
    ? users.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.role?.toLowerCase().includes(q)
      )
    : users;

  const adminCount = users.filter((u) => u.role === 'ADMIN').length;
  const memberCount = users.filter((u) => u.role === 'MEMBER').length;

  return (
    <>
      {/* topline */}
      <div className="flex items-center justify-between pb-6 border-b border-fog mb-10">
        <div className="font-mono text-[11px] uppercase tracking-micro text-slate">
          Workspace <span className="text-fog mx-2">/</span>
          <span className="text-ink">Team</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 border border-fog rounded-md font-mono text-[11px] text-slate-soft min-w-[220px]">
          <span>⌕</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search team…"
            className="bg-transparent outline-none flex-1 text-ink placeholder:text-slate-soft"
          />
        </div>
      </div>

      {/* header */}
      <div className="mb-12">
        <div className="font-mono text-[11px] uppercase tracking-micro text-slate mb-4">
          — Workspace · {users.length} {users.length === 1 ? 'member' : 'members'} ·{' '}
          {adminCount} admin{adminCount === 1 ? '' : 's'} · {memberCount} member
          {memberCount === 1 ? '' : 's'}
        </div>
        <h1 className="display mb-3">
          Team<em className="serif-italic text-orchid">.</em>
        </h1>
        <p className="text-base text-slate max-w-[560px] leading-relaxed">
          Everyone with an account in this workspace. Add members to a project from the project's
          team panel.
        </p>
      </div>

      {/* roster */}
      {filtered.length === 0 ? (
        <div className="border border-fog rounded-xl text-center py-20 px-6 bg-cream">
          <div className="serif-italic text-[28px] text-ink mb-2">
            {query ? `No matches for "${query}"` : 'No team members yet'}
          </div>
          <p className="text-slate">
            {query
              ? 'Try a different search.'
              : 'Invite teammates by sharing the signup URL.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((u, i) => {
            const initial = (u.name || u.email || '?').trim().charAt(0).toUpperCase();
            const isMe = me?.id === u.id;
            const isAdmin = u.role === 'ADMIN';
            return (
              <div
                key={u.id}
                className="border border-fog rounded-[12px] p-6 bg-cream flex flex-col gap-4 hover:border-ink hover:-translate-y-px transition-all"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center serif-italic text-[20px] ${
                      isAdmin
                        ? 'bg-orchid text-cloud'
                        : 'bg-glacier-tint text-founders-navy'
                    }`}
                  >
                    {initial}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-micro text-slate-soft">
                    USR-{String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div>
                  <div className="serif-italic text-[20px] text-ink leading-tight flex items-center gap-2">
                    {u.name || 'Unnamed'}
                    {isMe && (
                      <span className="font-mono text-[9px] uppercase tracking-micro text-slate not-italic">
                        (you)
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-slate mt-0.5 truncate">{u.email}</div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-fog">
                  <span
                    className={
                      isAdmin
                        ? 'eq-pill bg-orchid-tint text-orchid'
                        : 'eq-pill bg-fog/40 text-ink'
                    }
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isAdmin ? 'bg-orchid' : 'bg-slate'
                      }`}
                    />
                    {u.role}
                  </span>
                  <a
                    href={`mailto:${u.email}`}
                    className="font-mono text-[11px] text-slate hover:text-ink"
                  >
                    Email →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
