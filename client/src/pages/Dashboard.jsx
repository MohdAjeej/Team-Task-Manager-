import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircle2, Clock, AlertCircle, ListTodo, FolderKanban } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/api/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: stats?.totalProjects || 0,
      icon: FolderKanban,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Tasks',
      value: stats?.totalTasks || 0,
      icon: ListTodo,
      color: 'bg-purple-500'
    },
    {
      title: 'In Progress',
      value: stats?.inProgressTasks || 0,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Completed',
      value: stats?.completedTasks || 0,
      icon: CheckCircle2,
      color: 'bg-green-500'
    },
    {
      title: 'Overdue',
      value: stats?.overdueCount || 0,
      icon: AlertCircle,
      color: 'bg-red-500'
    },
    {
      title: 'My Tasks',
      value: stats?.myTasksCount || 0,
      icon: ListTodo,
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your tasks and projects</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overdue Tasks */}
      {stats?.overdueTasks && stats.overdueTasks.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
            Overdue Tasks
          </h2>
          <div className="space-y-3">
            {stats.overdueTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-600">
                    {task.project} • {task.assignee || 'Unassigned'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">
                    Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      {stats?.recentTasks && stats.recentTasks.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Tasks</h2>
          <div className="space-y-3">
            {stats.recentTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-600">
                    {task.project} • {task.assignee || 'Unassigned'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`badge badge-${task.status.toLowerCase().replace('_', '-')}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className={`badge badge-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
