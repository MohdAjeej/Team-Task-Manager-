import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, Users, Trash2, Edit2, UserPlus, X } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

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
    assigneeId: ''
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
        role: memberRole
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
    if (!confirm('Are you sure you want to remove this team member?')) return;
    
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
      await axios.post('/api/tasks', {
        ...taskFormData,
        projectId
      });
      setShowTaskModal(false);
      setTaskFormData({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: '',
        assigneeId: ''
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
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      fetchProject();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!project) {
    return <div className="text-center py-12">Project not found</div>;
  }

  const tasksByStatus = {
    TODO: project.tasks?.filter(t => t.status === 'TODO') || [],
    IN_PROGRESS: project.tasks?.filter(t => t.status === 'IN_PROGRESS') || [],
    COMPLETED: project.tasks?.filter(t => t.status === 'COMPLETED') || []
  };

  return (
    <div className="space-y-6">
      <div>
        <Link to="/projects" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
          <button
            onClick={() => setShowTaskModal(true)}
            className="btn btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </button>
        </div>
      </div>

      {/* Team Members */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Team Members ({(project.teamMembers?.length || 0) + 1})
          </h2>
          {(project.creator.id === user.id || user.role === 'ADMIN') && (
            <button
              onClick={() => setShowMemberModal(true)}
              className="btn btn-primary text-sm flex items-center"
            >
              <UserPlus className="w-4 h-4 mr-1" />
              Add Member
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium flex items-center">
            {project.creator.name} (Owner)
          </div>
          {project.teamMembers?.map((member) => (
            <div key={member.id} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-2">
              {member.user.name}
              {(project.creator.id === user.id || user.role === 'ADMIN') && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(tasksByStatus).map(([status, tasks]) => (
          <div key={status} className="card bg-gray-50">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center justify-between">
              <span>{status.replace('_', ' ')}</span>
              <span className="text-sm font-normal text-gray-600">({tasks.length})</span>
            </h3>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <span className={`badge badge-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-gray-600">
                        Due: {format(new Date(task.dueDate), 'MMM dd')}
                      </span>
                    )}
                  </div>

                  {task.assignee && (
                    <p className="text-xs text-gray-600 mb-3">
                      Assigned to: {task.assignee.name}
                    </p>
                  )}

                  <select
                    value={task.status}
                    onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                    className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Team Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Add Team Member</h2>
            
            {allUsers.filter(u => 
              u.id !== project.creator.id && 
              !project.teamMembers?.some(m => m.user.id === u.id)
            ).length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No users available to add</p>
                <p className="text-sm text-gray-500 mb-4">
                  All registered users are already members of this project.
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  To add more members, create additional user accounts first.
                </p>
                <button
                  onClick={() => {
                    setShowMemberModal(false);
                    setSelectedUserId('');
                    setMemberRole('MEMBER');
                  }}
                  className="btn btn-secondary"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select User
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="input"
                    required
                  >
                    <option value="">Choose a user...</option>
                    {allUsers
                      .filter(u => 
                        u.id !== project.creator.id && 
                        !project.teamMembers?.some(m => m.user.id === u.id)
                      )
                      .map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.email})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value)}
                    className="input"
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div className="flex space-x-3">
                  <button type="submit" className="flex-1 btn btn-primary">
                    Add Member
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMemberModal(false);
                      setSelectedUserId('');
                      setMemberRole('MEMBER');
                    }}
                    className="flex-1 btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={taskFormData.title}
                  onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                  className="input"
                  placeholder="Task title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={taskFormData.description}
                  onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                  className="input"
                  rows="3"
                  placeholder="Task description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={taskFormData.status}
                    onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value })}
                    className="input"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={taskFormData.priority}
                    onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
                    className="input"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={taskFormData.dueDate}
                  onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign To
                </label>
                <select
                  value={taskFormData.assigneeId}
                  onChange={(e) => setTaskFormData({ ...taskFormData, assigneeId: e.target.value })}
                  className="input"
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

              <div className="flex space-x-3">
                <button type="submit" className="flex-1 btn btn-primary">
                  Create Task
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
                      assigneeId: ''
                    });
                  }}
                  className="flex-1 btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
