import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, X } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/projects', formData);
      setShowModal(false);
      setFormData({ name: '', description: '' });
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="font-mono text-[10px] uppercase tracking-micro text-slate">Loading…</div>
      </div>
    );
  }

  return (
    <>
      {/* topline */}
      <div className="flex items-center justify-between pb-6 border-b border-fog mb-10">
        <div className="font-mono text-[11px] uppercase tracking-micro text-slate">
          Workspace <span className="text-fog mx-2">/</span>{' '}
          <span className="text-ink">Projects</span>
        </div>
        <button onClick={() => setShowModal(true)} className="eq-btn-primary text-sm">
          + New project
        </button>
      </div>

      {/* header */}
      <div className="mb-12">
        <div className="font-mono text-[11px] uppercase tracking-micro text-slate mb-4">
          — All projects · {projects.length} total
        </div>
        <h1 className="display mb-2">
          Projects<em className="serif-italic text-orchid">.</em>
        </h1>
        <p className="text-base text-slate max-w-[560px] leading-relaxed">
          Every workspace you're a member of. Click into one to manage tasks, kanban, and team.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="border border-fog rounded-xl text-center py-20 px-6 bg-cream">
          <div className="serif-italic text-[28px] text-ink mb-2">No projects yet</div>
          <p className="text-slate mb-6">Get started by creating your first project.</p>
          <button onClick={() => setShowModal(true)} className="eq-btn-primary">
            Create project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => {
            const totalTasks = project.tasks?.length || 0;
            const completedTasks =
              project.tasks?.filter((t) => t.status === 'COMPLETED').length || 0;
            const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
            const memberCount = (project.teamMembers?.length || 0) + 1;

            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="border border-fog rounded-[12px] p-6 flex flex-col gap-4 bg-cream hover:border-ink hover:-translate-y-px transition-all"
              >
                <div className="flex items-baseline justify-between">
                  <h3 className="serif-italic text-[24px] text-ink leading-tight">
                    {project.name}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-micro text-slate-soft">
                    PRJ-{String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {project.description && (
                  <p className="text-sm text-slate line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                )}

                <div className="mt-auto flex flex-col gap-2">
                  <div className="h-px bg-fog relative overflow-hidden rounded-full">
                    <div
                      className="absolute inset-y-0 left-0 bg-orchid"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between font-mono text-[10px] uppercase tracking-micro text-slate">
                    <span>
                      {Math.round(progress)}% · {completedTasks}/{totalTasks}
                    </span>
                    <span>
                      {memberCount} {memberCount === 1 ? 'member' : 'members'}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-cream border border-ink max-w-md w-full"
            style={{ borderRadius: '12px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-fog">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-micro text-slate mb-1">
                  — New project
                </div>
                <div className="serif-italic text-[24px] text-ink">Create project</div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate hover:text-ink transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
              <div>
                <label className="eq-label">Project name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="eq-input"
                  placeholder="e.g. Acme onboarding"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="eq-label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="eq-input resize-none"
                  rows="3"
                  placeholder="What's this project about?"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 eq-btn-primary py-2.5"
                >
                  {submitting ? 'Creating…' : 'Create project'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ name: '', description: '' });
                  }}
                  className="flex-1 eq-btn-secondary py-2.5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
