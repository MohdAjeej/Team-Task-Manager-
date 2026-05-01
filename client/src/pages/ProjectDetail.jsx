import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, Trash2, UserPlus, X } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

const STATUS_LABEL = {
  TODO: 'Todo',
  IN_PROGRESS: 'In progress',
  COMPLETED: 'Done',
};

const PRIORITY_PILL = {
  LOW: 'eq-pill-low',
  MEDIUM: 'eq-pill-medium',
  HIGH: 'eq-pill-high',
};

export default function ProjectDetail() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [memberRole, setMemberRole] = useState('MEMBER');
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: '',
    assigneeId: '',
  });

  useEffect(() => {
    fetchProject();
    fetchAllUsers();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await axios.get(`/api/projects/${projectId}`);
      setProject(response.data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('/api/auth/users');
      setAllUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUserId) return;
    try {
      await axios.post(`/api/projects/${projectId}/members`, {
        userId: selectedUserId,
        role: memberRole,
      });
      setShowMemberModal(false);
      setSelectedUserId('');
      setMemberRole('MEMBER');
      fetchProject();
    } catch (error) {
      console.error('Error adding team member:', error);
      alert(error.response?.data?.error || 'Failed to add team member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Remove this team member?')) return;
    try {
      await axios.delete(`/api/projects/${projectId}/members/${memberId}`);
      fetchProject();
    } catch (error) {
      console.error('Error removing team member:', error);
      alert('Failed to remove team member');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', { ...taskFormData, projectId });
      setShowTaskModal(false);
      setTaskFormData({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: '',
        assigneeId: '',
      });
      fetchProject();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus });
      fetchProject();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      fetchProject();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="font-mono text-[10px] uppercase tracking-micro text-slate">Loading…</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <div className="serif-italic text-[28px] text-ink mb-2">Project not found</div>
        <Link to="/projects" className="text-slate underline hover:text-ink">
          Back to projects
        </Link>
      </div>
    );
  }

  const tasksByStatus = {
    TODO: project.tasks?.filter((t) => t.status === 'TODO') || [],
    IN_PROGRESS: project.tasks?.filter((t) => t.status === 'IN_PROGRESS') || [],
    COMPLETED: project.tasks?.filter((t) => t.status === 'COMPLETED') || [],
  };

  const canManage = project.creator.id === user.id || user.role === 'ADMIN';
  const totalMembers = (project.teamMembers?.length || 0) + 1;
  const totalTasks = project.tasks?.length || 0;

  return (
    <>
      {/* topline */}
      <div className="flex items-center justify-between pb-6 border-b border-fog mb-10">
        <Link
          to="/projects"
          className="font-mono text-[11px] uppercase tracking-micro text-slate hover:text-ink flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Workspace <span className="text-fog mx-1">/</span> Projects{' '}
          <span className="text-fog mx-1">/</span> <span className="text-ink">{project.name}</span>
        </Link>
        <button onClick={() => setShowTaskModal(true)} className="eq-btn-primary text-sm">
          + New task
        </button>
      </div>

      {/* header */}
      <div className="mb-12">
        <div className="font-mono text-[11px] uppercase tracking-micro text-slate mb-4">
          — Project · {totalTasks} task{totalTasks === 1 ? '' : 's'} · {totalMembers} member
          {totalMembers === 1 ? '' : 's'}
        </div>
        <h1 className="display mb-3">
          {project.name}
          <em className="serif-italic text-orchid">.</em>
        </h1>
        {project.description && (
          <p className="text-base text-slate max-w-[680px] leading-relaxed">
            {project.description}
          </p>
        )}
      </div>

      {/* Team members */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="serif-italic text-[22px] text-ink">Team</div>
            <div className="font-mono text-[10px] uppercase tracking-micro text-slate-soft mt-1">
              {totalMembers} {totalMembers === 1 ? 'member' : 'members'}
            </div>
          </div>
          {canManage && (
            <button
              onClick={() => setShowMemberModal(true)}
              className="eq-btn-secondary text-sm flex items-center gap-2"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Add member
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="px-3 py-1 border border-orchid bg-orchid-tint text-orchid rounded-full text-sm flex items-center gap-2">
            <span className="font-medium">{project.creator.name}</span>
            <span className="font-mono text-[9px] uppercase tracking-micro">Owner</span>
          </div>
          {project.teamMembers?.map((member) => (
            <div
              key={member.id}
              className="px-3 py-1 border border-fog bg-cream text-ink rounded-full text-sm flex items-center gap-2"
            >
              {member.user.name}
              {canManage && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-slate hover:text-revops-red transition-colors"
                  title="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Kanban */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="serif-italic text-[22px] text-ink">Tasks</div>
            <div className="font-mono text-[10px] uppercase tracking-micro text-slate-soft mt-1">
              Kanban view
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Object.entries(tasksByStatus).map(([status, tasks]) => (
            <div
              key={status}
              className="border border-fog rounded-[12px] bg-cream"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-fog">
                <span className="serif-italic text-[18px] text-ink">{STATUS_LABEL[status]}</span>
                <span className="font-mono text-[10px] uppercase tracking-micro text-slate">
                  {String(tasks.length).padStart(2, '0')}
                </span>
              </div>

              <div className="p-3 flex flex-col gap-2 min-h-[120px]">
                {tasks.length === 0 && (
                  <div className="text-center py-8 font-mono text-[10px] uppercase tracking-micro text-slate-soft">
                    Empty
                  </div>
                )}
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-cloud border border-fog rounded-[10px] p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-ink leading-snug">{task.title}</h4>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-slate-soft hover:text-revops-red transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate leading-relaxed line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <span className={PRIORITY_PILL[task.priority] || 'eq-pill-low'}>
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            task.priority === 'HIGH'
                              ? 'bg-revops-red'
                              : task.priority === 'MEDIUM'
                              ? 'bg-glacier'
                              : 'bg-slate'
                          }`}
                        />
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span className="font-mono text-[10px] uppercase tracking-micro text-slate">
                          {format(new Date(task.dueDate), 'MMM dd')}
                        </span>
                      )}
                    </div>

                    {task.assignee && (
                      <div className="font-mono text-[10px] uppercase tracking-micro text-slate-soft">
                        {task.assignee.name}
                      </div>
                    )}

                    <select
                      value={task.status}
                      onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                      className="text-xs border border-fog rounded px-2 py-1.5 bg-cream text-ink outline-none focus:border-ink"
                    >
                      <option value="TODO">Todo</option>
                      <option value="IN_PROGRESS">In progress</option>
                      <option value="COMPLETED">Done</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add member modal */}
      {showMemberModal && (
        <Modal title="Add team member" onClose={() => setShowMemberModal(false)}>
          {allUsers.filter(
            (u) =>
              u.id !== project.creator.id &&
              !project.teamMembers?.some((m) => m.user.id === u.id)
          ).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate mb-2">No users available to add.</p>
              <p className="text-sm text-slate-soft mb-6">
                All registered users are already members. Create more accounts first.
              </p>
              <button
                onClick={() => setShowMemberModal(false)}
                className="eq-btn-secondary"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleAddMember} className="flex flex-col gap-5">
              <div>
                <label className="eq-label">Select user</label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="eq-input"
                  required
                >
                  <option value="">Choose a user…</option>
                  {allUsers
                    .filter(
                      (u) =>
                        u.id !== project.creator.id &&
                        !project.teamMembers?.some((m) => m.user.id === u.id)
                    )
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="eq-label">Role</label>
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="eq-input"
                >
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 eq-btn-primary py-2.5">
                  Add member
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMemberModal(false);
                    setSelectedUserId('');
                    setMemberRole('MEMBER');
                  }}
                  className="flex-1 eq-btn-secondary py-2.5"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}

      {/* Create task modal */}
      {showTaskModal && (
        <Modal title="Create task" onClose={() => setShowTaskModal(false)}>
          <form onSubmit={handleCreateTask} className="flex flex-col gap-5">
            <div>
              <label className="eq-label">Title</label>
              <input
                type="text"
                value={taskFormData.title}
                onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                className="eq-input"
                placeholder="e.g. Wire up Stripe webhook"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="eq-label">Description</label>
              <textarea
                value={taskFormData.description}
                onChange={(e) =>
                  setTaskFormData({ ...taskFormData, description: e.target.value })
                }
                className="eq-input resize-none"
                rows="3"
                placeholder="Notes, context, links…"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="eq-label">Status</label>
                <select
                  value={taskFormData.status}
                  onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value })}
                  className="eq-input"
                >
                  <option value="TODO">Todo</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="COMPLETED">Done</option>
                </select>
              </div>
              <div>
                <label className="eq-label">Priority</label>
                <select
                  value={taskFormData.priority}
                  onChange={(e) =>
                    setTaskFormData({ ...taskFormData, priority: e.target.value })
                  }
                  className="eq-input"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="eq-label">Due date</label>
                <input
                  type="date"
                  value={taskFormData.dueDate}
                  onChange={(e) =>
                    setTaskFormData({ ...taskFormData, dueDate: e.target.value })
                  }
                  className="eq-input"
                />
              </div>
              <div>
                <label className="eq-label">Assign to</label>
                <select
                  value={taskFormData.assigneeId}
                  onChange={(e) =>
                    setTaskFormData({ ...taskFormData, assigneeId: e.target.value })
                  }
                  className="eq-input"
                >
                  <option value="">Unassigned</option>
                  <option value={project.creator.id}>{project.creator.name}</option>
                  {project.teamMembers?.map((member) => (
                    <option key={member.user.id} value={member.user.id}>
                      {member.user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 eq-btn-primary py-2.5">
                Create task
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowTaskModal(false);
                  setTaskFormData({
                    title: '',
                    description: '',
                    status: 'TODO',
                    priority: 'MEDIUM',
                    dueDate: '',
                    assigneeId: '',
                  });
                }}
                className="flex-1 eq-btn-secondary py-2.5"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-cream border border-ink max-w-md w-full max-h-[90vh] overflow-y-auto"
        style={{ borderRadius: '12px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-fog sticky top-0 bg-cream">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-micro text-slate mb-1">
              — Action
            </div>
            <div className="serif-italic text-[24px] text-ink">{title}</div>
          </div>
          <button
            onClick={onClose}
            className="text-slate hover:text-ink transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
